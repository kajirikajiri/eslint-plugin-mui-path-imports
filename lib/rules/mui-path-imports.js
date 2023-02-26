/**
 * @fileoverview rule
 * @author rule
 */
"use strict";

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
            shouldNamedImports: [
              "Theme", "SvgIconTypeMap"
            ]
          },
          {
            name: "@mui/icons-material",
            shouldNamedImports: [],
          },
          {
            name: "@mui/lab",
            shouldNamedImports: [],
          },
          {
            name: "@mui/joy",
            shouldNamedImports: [],
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
         * If all should be named import, early return will be made. For example, @mui/material Theme cannot be path-import and should be named-import
         * @example
         * true: import { Theme, SvgIconTypeMap } from "@mui/material";
         * false: import { Box, Theme } from "@mui/material";
         */
        const isAllShouldNamedImport = node.specifiers.every(specifier => {
          return targetPackage.shouldNamedImports.includes(specifier.local.name)
        })
        if (isAllShouldNamedImport) {
          return
        }

        context.report({
          node,
          message: "error: !mui-toplevel-import",
          fix(fixer) {
            const shouldNamedImports = []
            const shouldPathImports = []

            node.specifiers.forEach((specifier) => {
              if (targetPackage.shouldNamedImports.includes(specifier.local.name)) {
                shouldNamedImports.push(specifier)
              } else {
                shouldPathImports.push(specifier)
              }
            })
            
            const fixed = []
            shouldPathImports.forEach(specifier => {
              fixed.push(`import ${specifier.local.name} from "${node.source.value}/${specifier.imported.name}";`)
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
              
              /**
               * reference: https://astexplorer.net/
               *
               * reference: https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~ImportDeclaration.html#instance-member-source
               */
              const source = node.source.value

              fixed.push(`import { ${specifiers} } from "${source}";`)
            }

            return fixer.replaceText(node, fixed.join("\n"))
          }
        })
      }
    };
  },
};
