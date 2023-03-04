import {spawn} from 'child_process'

(async ()=> {
    console.time('generate')
    const promise = new Promise((resolve, reject) => {
        const proc = spawn('npm', ["run", "generate"], {cwd: 'generator'})
        proc.stdout.on('data', (data) => {
            console.log('stdout', data.toString())
        })
        proc.on('exit', (code) => {
            console.log('exit', code)
            resolve(code)
        })
        proc.on('error', (err) => {
            console.log('error', err)
            reject(err)
        })
    })
    
    await promise
    
    const promise2 = new Promise((resolve, reject) => {
        const proc = spawn('npm', ["run", "check"], {cwd: 'generator'})
        proc.stdout.on('data', (data) => {
            console.log('stdout', data.toString())
        })
        proc.on('exit', (code) => {
            console.log('exit', code)
            resolve(code)
        })
        proc.on('error', (err) => {
            console.log('error', err)
            reject(err)
        })
    })
    
    await promise2
    console.timeEnd('generate')
})()