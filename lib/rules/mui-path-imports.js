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
        if (!["@mui/material", "@mui/icons-material"].includes(node.source.value)) return
        if (
          node.source.value === '@mui/material' &&
          node.specifiers.length === 1 &&
          node.specifiers[0].local.name === "Theme"
        ) return

        const isNotDefaultImport = node.specifiers.some(specifier => {
          if (specifier.type !== "ImportDefaultSpecifier") return true
          return false
        })
        if (isNotDefaultImport) {
          context.report({
            node,
            message: "error: !mui-toplevel-import",
            fix(fixer) {
              const a = node.specifiers.filter((specifier) => {
                return specifier.local.name !== "Theme"
              }).map(specifier => {
                return `import ${specifier.local.name} from "${node.source.value}/${specifier.local.name}";`
              })
              const b = node.specifiers.filter((specifier) => {
                return specifier.local.name === "Theme"
              }).map(specifier => {
                return `import { ${specifier.local.name} } from "${node.source.value}";`
              })
              const c = [...a, ...b].join("\n")
              return fixer.replaceText(node, c)
            }
          })
        }
      }
    };
  },
};
