/**
 * @fileoverview rule
 * @author rule
 */
"use strict";

/**
 * @type {import('./path-import-paths.json')}
 */
const pathImportPaths = require('./path-import-paths.json');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "rule",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        /**
         * If it is a type import, it will return early.
         *
         * node.importKind https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#importdeclaration
         * @example
         * true: import type { TextFieldProps as MuiTextFieldProps } from '@mui/material';
         */
        const isTypeImport = node.importKind === 'type';
        if (isTypeImport) {
          return
        }

        /**
         * Returns early if nothing is imported
         * @example
         * true: import {} from "@mui/material";
         * false: import { Box } from "@mui/material";
         */
        const isNothingImported = node.specifiers.length === 0
        if (isNothingImported) {
          return
        }

        /**
         * Returns early if it not has import specifier
         *
         * Other specifier.type https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#imports
         */
        const hasImportSpecifier = node.specifiers.some((specifier) => {
          const isImportSpecifier = specifier.type === "ImportSpecifier"
          return isImportSpecifier
        })
        if (!hasImportSpecifier) {
          return
        }

        const packages = [
          {
            name: "@mui/material",
          },
          {
            name: "@mui/icons-material",
          },
          {
            name: "@mui/lab",
          },
          {
            name: "@mui/joy",
          }
        ]

        /**
         * If it is not a target package, it will return early
         * @example
         * true: import Add from "@mui/icons-material/Add";
         * false: import { Add } from "@mui/icons-material";
         */
        const targetPackage = packages.find(p => p.name === node.source.value)
        if (targetPackage === undefined) {
          return
        }
        
        /**
         * If there is nothing that can be path-import, we will return early
         * @example
         * true: import { Theme, SvgIconTypeMap } from "@mui/material";
         * false: import { Box, Theme } from "@mui/material";
         */
        const existsCanPathImport = node.specifiers.some((specifier) => {
          const canPathImport = pathImportPaths[targetPackage.name][specifier.imported.name] !== undefined
          return canPathImport
        })
        
        /**
         * @mui/icons-material should be able to pathimport
         */
        const isIconsMaterial = targetPackage.name === "@mui/icons-material"

        if (isIconsMaterial === false && existsCanPathImport === false) {
          return
        }

        context.report({
          node,
          message: "error: !mui-toplevel-import",
          fix(fixer) {
            const shouldNamedImports = []
            const shouldPathImports = []

            node.specifiers.forEach((specifier) => {
              const canPathImport = pathImportPaths[targetPackage.name][specifier.imported.name] !== undefined
              if (canPathImport || isIconsMaterial) {
                shouldPathImports.push(specifier)
              } else {
                shouldNamedImports.push(specifier)
              }
            })
            
            const fixed = []
            shouldPathImports.forEach(specifier => {
              fixed.push(`import ${specifier.local.name} from "${targetPackage.name}/${specifier.imported.name}";`)
            })

            if (shouldNamedImports.length > 0) {
              
              /**
               * reference: https://astexplorer.net/
               * 
               * reference: https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~ImportDeclaration.html#instance-member-source
               */
              const specifiers = shouldNamedImports.map(s => {
                if (s.imported.name === s.local.name) {
                  return s.imported.name
                }
                return `${s.imported.name} as ${s.local.name}`
              }).join(", ")

              fixed.push(`import { ${specifiers} } from "${targetPackage.name}";`)
            }

            return fixer.replaceText(node, fixed.join("\n"))
          }
        })
      }
    };
  },
};
