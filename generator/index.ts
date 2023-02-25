// @ts-ignore
import { uri, createServer, position, TestLspServer} from './src/test-utils.js'
import * as lsp from 'vscode-languageserver';
import fs from "fs"

const docTemplate = {
    uri: uri('jsx', 'app.tsx'),
    languageId: 'typescriptreact',
    version: 1,
}

const ceateMuiMaterialPaths = async (server: TestLspServer) => {
    const packageName = "@mui/material"
    const doc = {
        ...docTemplate,
        text: `import { } from '${packageName}/'`,
    };
    server.didOpenTextDocument({
        textDocument: doc,
    });
    const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/`) });
    const pathArray: string[] = []
    const recursiveFunction = async (items: any, packageName: string, label: string, recusiveCount: number) => {
        for await (const item of items) {
            const newLabel = (() =>{
                if (label) {
                    return `${label}/${item.label}`
                } else {
                    return `${item.label}`
                }
            })()

            pathArray.push(newLabel)

            const doc = {
                ...docTemplate,
                text: `import { } from '${packageName}/${newLabel}/'`,
            };
            server.didOpenTextDocument({
                textDocument: doc,
            });
            const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/${newLabel}/`) });
            await recursiveFunction(completion!.items, packageName, newLabel, recusiveCount + 1)
        }
    }

    await recursiveFunction(completion!.items, packageName, '', 1)

    const pathObject: {[x: string]: string} = {}

    for await (const item of pathArray) {
        // example: Box/index, Accordion/index
        if (item.endsWith('index')) {
            continue
        }

        // example: Box/package.json, Accordion/package.json
        if (item.endsWith('package.json')) {
            continue
        }

        // example: Box/Box, Accordion/Accordion
        if (item.split('/').at(-1) === item.split('/').at(-2)) {
            continue
        }
        
        // example: node/Box, node/Accordion
        if (item.startsWith('node/')) {
            continue
        }

        // example: node/Box, node/Accordion
        if (item.startsWith('legacy/')) {
            continue
        }

        // example: modern/Box, modern/Accordion
        if (item.startsWith('modern/')) {
            continue
        }
        
        if (item === 'legacy') {
            continue
        }
        
        if (item === 'modern') {
            continue
        }
        
        if (item === 'node') {
            continue
        }
        
        if (item === 'internal') {
            continue
        }

        const isComponent = item.at(0)?.toUpperCase() === item.at(0) && item.includes('/') === false
        if (isComponent) {
            const key = item.split('/').at(-1)
            if (key === undefined) {
                continue
            }
            if (key === 'OverridableComponent') {
                continue
            }
            const value = `${packageName}/` + item
            pathObject[key] = value
            continue
        }
    }
    return pathObject
}

const ceateMuiLabPaths = async (server: TestLspServer) => {
    const packageName = "@mui/lab"
    const doc = {
        ...docTemplate,
        text: `import { } from '${packageName}/'`,
    };
    server.didOpenTextDocument({
        textDocument: doc,
    });
    const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/`) });
    const pathArray: string[] = []
    const recursiveFunction = async (items: any, packageName: string, label: string, recusiveCount: number) => {
        for await (const item of items) {
            const newLabel = (() =>{
                if (label) {
                    return `${label}/${item.label}`
                } else {
                    return `${item.label}`
                }
            })()

            pathArray.push(newLabel)

            const doc = {
                ...docTemplate,
                text: `import { } from '${packageName}/${newLabel}/'`,
            };
            server.didOpenTextDocument({
                textDocument: doc,
            });
            const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/${newLabel}/`) });
            await recursiveFunction(completion!.items, packageName, newLabel, recusiveCount + 1)
        }
    }

    await recursiveFunction(completion!.items, packageName, '', 1)

    const pathObject: {[x: string]: string} = {}

    for await (const item of pathArray) {
        // example: Box/index, Accordion/index
        if (item.endsWith('index')) {
            continue
        }

        // example: Box/package.json, Accordion/package.json
        if (item.endsWith('package.json')) {
            continue
        }

        // example: Box/Box, Accordion/Accordion
        if (item.split('/').at(-1) === item.split('/').at(-2)) {
            continue
        }
        
        // example: node/Box, node/Accordion
        if (item.startsWith('node/')) {
            continue
        }

        // example: node/Box, node/Accordion
        if (item.startsWith('legacy/')) {
            continue
        }

        // example: modern/Box, modern/Accordion
        if (item.startsWith('modern/')) {
            continue
        }
        
        if (item === 'legacy') {
            continue
        }
        
        if (item === 'modern') {
            continue
        }
        
        if (item === 'node') {
            continue
        }
        
        if (item === 'internal') {
            continue
        }

        const isComponent = item.at(0)?.toUpperCase() === item.at(0) && item.includes('/') === false
        if (isComponent) {
            const key = item.split('/').at(-1)
            if (key === undefined) {
                continue
            }
            const value = `${packageName}/` + item
            pathObject[key] = value
            continue
        }
    }
    return pathObject
}

const ceateMuiJoyPaths = async (server: TestLspServer) => {
    const packageName = "@mui/joy"
    const doc = {
        ...docTemplate,
        text: `import { } from '${packageName}/'`,
    };
    server.didOpenTextDocument({
        textDocument: doc,
    });
    const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/`) });
    const pathArray: string[] = []
    const recursiveFunction = async (items: any, packageName: string, label: string, recusiveCount: number) => {
        for await (const item of items) {
            const newLabel = (() =>{
                if (label) {
                    return `${label}/${item.label}`
                } else {
                    return `${item.label}`
                }
            })()

            pathArray.push(newLabel)

            const doc = {
                ...docTemplate,
                text: `import { } from '${packageName}/${newLabel}/'`,
            };
            server.didOpenTextDocument({
                textDocument: doc,
            });
            const completion = await server.completion({ textDocument: doc, position: position(doc, `${packageName}/${newLabel}/`) });
            await recursiveFunction(completion!.items, packageName, newLabel, recusiveCount + 1)
        }
    }

    await recursiveFunction(completion!.items, packageName, '', 1)

    const pathObject: {[x: string]: string} = {}

    for await (const item of pathArray) {
        // example: Box/index, Accordion/index
        if (item.endsWith('index')) {
            continue
        }

        // example: Box/package.json, Accordion/package.json
        if (item.endsWith('package.json')) {
            continue
        }

        // example: Box/Box, Accordion/Accordion
        if (item.split('/').at(-1) === item.split('/').at(-2)) {
            continue
        }
        
        // example: node/Box, node/Accordion
        if (item.startsWith('node/')) {
            continue
        }

        // example: node/Box, node/Accordion
        if (item.startsWith('legacy/')) {
            continue
        }

        // example: modern/Box, modern/Accordion
        if (item.startsWith('modern/')) {
            continue
        }
        
        if (item === 'legacy') {
            continue
        }
        
        if (item === 'modern') {
            continue
        }
        
        if (item === 'node') {
            continue
        }
        
        if (item === 'internal') {
            continue
        }

        const isComponent = item.at(0)?.toUpperCase() === item.at(0) && item.includes('/') === false
        if (isComponent) {
            const key = item.split('/').at(-1)
            if (key === undefined) {
                continue
            }
            const value = `${packageName}/` + item
            pathObject[key] = value
            continue
        }
    }
    return pathObject
}

(async () => {
    const diagnostics: Map<string, lsp.PublishDiagnosticsParams> = new Map();

    const server = await createServer({
        rootUri: uri('jsx'),
        publishDiagnostics: (args: any) => diagnostics.set(args.uri, args),
    });

    ceateMuiMaterialPaths
    ceateMuiLabPaths
    const muiMaterialPaths = await ceateMuiMaterialPaths(server)
    const muiLabPaths = await ceateMuiLabPaths(server)
    const muiJoyPaths = await ceateMuiJoyPaths(server)
    fs.writeFileSync('output.json', JSON.stringify({
        "@mui/material": muiMaterialPaths,
        "@mui/lab": muiLabPaths,
        "@mui/joy": muiJoyPaths,
        "@mui/icons-material": {},
    }, null, 2));

    server.closeAll();
    server.shutdown();
})()
