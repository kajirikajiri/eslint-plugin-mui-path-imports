// @ts-ignore
import { uri, createServer, position, TestLspServer} from './src/test-utils.js'
import * as lsp from 'vscode-languageserver';
import fs from "fs"

const shouldContinue = (item: lsp.CompletionItem ,pathname: string, recursiveCount: number): boolean => {
    if (recursiveCount === 1 && item.label === 'internal') {
        return true
    }
    if (recursiveCount === 1 && item.label === 'legacy') {
        return true
    }
    if (recursiveCount === 1 && item.label === 'modern') {
        return true
    }
    if (recursiveCount === 1 && item.label === 'node') {
        return true
    }
    // example: Box/index, Accordion/index
    if (item.label === '/index') {
        return true
    }
    // example: Box/package.json, Accordion/package.json
    if (item.label === '/package.json') {
        return true
    }
    // example: Box/Box, Accordion/Accordion
    if (pathname.split('/').length >= 3 && item.label === pathname.split('/').at(-1)) {
        return true
    }
    
    return false
}

const docTemplate = {
    uri: uri('jsx', 'app.tsx'),
    languageId: 'typescriptreact',
    version: 1,
}

type Packagename = '@mui/material' | '@mui/lab' | '@mui/joy'

const createPathnames = async (packagename: Packagename, server: TestLspServer) => {
    const pathnames: string[] = []
    const pushPathnames = async (items: lsp.CompletionItem[], pathname: string, recursiveCount: number) => {
        for await (const item of items) {
            if (shouldContinue(item, pathname, recursiveCount)) {
                continue
            }

            const newPathname = recursiveCount === 0 ? packagename : `${pathname}/${item.label}`
            if (recursiveCount !== 0) {
                pathnames.push(newPathname.replace(`${packagename}/`, ''))
            }
            const doc = {
                ...docTemplate,
                text: `import { } from '${newPathname}/'`,
            };
            server.didOpenTextDocument({
                textDocument: doc,
            });
            const completion = await server.completion({ textDocument: doc, position: position(doc, `${newPathname}/`) });
            await pushPathnames(completion!.items, newPathname, recursiveCount + 1)
        }
    }
    await pushPathnames([{label: ""}], packagename, 0)
    return pathnames
}

const createPathnameObj = async (packagename: Packagename, server: TestLspServer) => {
    const pathnames = await createPathnames(packagename, server)
    const pathnameObj: {[x: string]: string} = {}
    for await (const pathname of pathnames) {
        const likeComponentPath = pathname.at(0)?.toUpperCase() === pathname.at(0) && pathname.includes('/') === false
        if (!likeComponentPath) {
            continue
        }

        const key = pathname.split('/').at(-1)
        if (key === undefined) {
            throw Error('key is undefined')
        }

        const value = `${packagename}/` + pathname
        pathnameObj[key] = value
    }
    return pathnameObj
}

(async () => {
    const diagnostics: Map<string, lsp.PublishDiagnosticsParams> = new Map();
    const server = await createServer({
        rootUri: uri('jsx'),
        publishDiagnostics: (args: any) => diagnostics.set(args.uri, args),
    });

    const muiMaterialPaths = await createPathnameObj("@mui/material", server)
    const muiLabPaths = await createPathnameObj("@mui/lab", server)
    const muiJoyPaths = await createPathnameObj("@mui/joy", server)
    fs.writeFileSync('output.json', JSON.stringify({
        "@mui/material": muiMaterialPaths,
        "@mui/lab": muiLabPaths,
        "@mui/joy": muiJoyPaths,
        "@mui/icons-material": {},
    }, null, 2));

    server.closeAll();
    server.shutdown();
})()
