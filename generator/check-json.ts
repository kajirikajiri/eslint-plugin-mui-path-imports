import fs from 'fs'
import {spawn} from 'child_process'
import outputJson from './output.json' assert { type: "json" }

let imports: string[] = [];
let components: string[] = [];
(Object.keys(outputJson['@mui/material']) as (keyof typeof outputJson['@mui/material'])[]).forEach((key) => {
    imports.push(`import ${key} from '@mui/material/${key}'`)
    components.push(`<${key} />`)
});
let text = `${imports.join('\n')}
export default function App() {
    return (
        <>
${components.join('\n')}
        </>
    )
}
`
fs.writeFileSync('test-data/jsx/MuiMaterial.tsx', text);

imports = [];
components = [];
(Object.keys(outputJson['@mui/joy']) as (keyof typeof outputJson['@mui/joy'])[]).forEach((key) => {
    imports.push(`import ${key} from '@mui/joy/${key}'`)
    components.push(`<${key} />`)
});
text = `${imports.join('\n')}
export default function App() {
    return (
        <>
${components.join('\n')}
        </>
    )
}
`
fs.writeFileSync('test-data/jsx/MuiJoy.tsx', text);

imports = [];
components = [];
(Object.keys(outputJson['@mui/lab']) as (keyof typeof outputJson['@mui/lab'])[]).forEach((key) => {
    imports.push(`import ${key} from '@mui/lab/${key}'`)
    components.push(`<${key} />`)
});
text = `${imports.join('\n')}
export default function App() {
    return (
        <>
${components.join('\n')}
        </>
    )
}
`
fs.writeFileSync('test-data/jsx/MuiLab.tsx', text);

const packageNames = Object.keys(outputJson) as (keyof typeof outputJson)[]
function isPackageName(packageName: string): packageName is keyof typeof outputJson {
    return packageNames.includes(packageName as keyof typeof outputJson)
}

const proc = spawn('tsc', {cwd: 'test-data/jsx', argv0: '--noEmit'})
proc.stdout.on('data', (data) => {
    const stringData = data.toString()
    if (typeof stringData !== 'string') {
        throw new Error("data.toString() is not")
    }

    stringData.split("\n").forEach((line: string) => {
        if ((new RegExp(/.+: error TS2604: JSX element type '.+' does not have any construct or call signatures\./g)).test(line)) {
            const componentName = line.match(/'.+'/g)?.at(0)?.replace(/'/g, '') ?? ""
            const fileName = line.match(/^.+\.tsx\(\d+,\d+\)/g)?.at(0)?.replace(/\(\d+,\d+\)/g, '') ?? ""
            const packageName = (() => {
                const [ownerName, packageName] = fileName?.match(/[A-Z][a-z]+/g)?.map(s => s.toLowerCase()) ?? ["", ""]
                return `@${ownerName}/${packageName}`
            })()
            if (!isPackageName(packageName)) {
                throw Error(`packageName is not: ${packageName}`)
            }
            if (packageName in outputJson && componentName in outputJson[packageName]) {
                console.log('delete', packageName, componentName)
                delete (outputJson[packageName] as any)[componentName]
            }
        }
    })
})
proc.on('exit', (code) => {
    fs.writeFileSync('../lib/rules/path-import-paths.json', JSON.stringify(outputJson, null, 2));
    console.log('exit', code)
})
proc.on('error', (err) => {
    console.log('error', err)
})