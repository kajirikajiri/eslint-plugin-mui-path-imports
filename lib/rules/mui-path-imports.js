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
        const validationTargets = [
          "@mui/material", "@mui/icons-material", "@mui/lab", "@mui/joy",
        ];
        const allowNamedImports = [
          "Theme", "SvgIconTypeMap"
        ];

        const isTypeImport = node.importKind === 'type';

        if (isTypeImport) {
          return
        }

        if (!validationTargets.includes(node.source.value)) {
          return
        }
        if (
          node.source.value === "@mui/material" &&
          node.specifiers.length > 0 &&
          node.specifiers.every((specifier) => {
            return allowNamedImports.includes(specifier.local.name);
          })
        ) {
          return;
        }

        const hasError = node.specifiers.some((specifier) => {
          if (specifier.type !== "ImportDefaultSpecifier") return true;
          return false;
        });
        if (hasError) {
          context.report({
            node,
            message: "error: !mui-toplevel-import",
            fix(fixer) {
              const fixed = [];
              if (node.importKind === "type") return null;
              node.specifiers
                .filter((specifier) => {
                  return !allowNamedImports.includes(specifier.local.name);
                })
                .forEach((specifier) => {
                  fixed.push(
                    `import ${specifier.local.name} from "${node.source.value}/${specifier.local.name}";`
                  );
                });
              const b = node.specifiers.filter((specifier) => {
                return allowNamedImports.includes(specifier.local.name);
              });
              if (b.length > 0) {
                fixed.push(
                  `import { ${b
                    .map((bb) => bb.local.name)
                    .join(', ')} } from "${node.source.value}";`
                );
              }
              return fixer.replaceText(node, fixed.join('\n'));
            },
          });
        }
      },
    };
  },
};
