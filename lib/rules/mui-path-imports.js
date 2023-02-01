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
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "rule",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        /*
          ignoreImportTypeKeyword will allow you to ignore type imports. this is very handy when linting typescript files. 
          It is recommended that it come from the top level of the library as well. 
          This does not affect the tree shake given that types are removed on build time.
          for example:
          import type { TextFieldProps } from '@mui/material';
        */
        ignoreImportTypeKeyword: "boolean",
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const validationTargets = [
          "@mui/material",
          "@mui/icons-material",
          "@mui/lab",
          "@mui/joy",
        ];
        const allowNamedImports = ["Theme", "SvgIconTypeMap"];
        /* 
        
        if is not allowed and import is type return false
        if is not allowed and import iqs normal return true
        if is allowed and import is normal return true
        if is allowed and import is type return true
        */
        const ignoreImportTypeKeyword = context.options[0]
          ? context.options[0].ignoreImportTypeKeyword
          : false;

        if (!validationTargets.includes(node.source.value)) {
          return;
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

        const shouldLintTypeImports = !(
          node.importKind === "type" && ignoreImportTypeKeyword
        );

        const hasError =
          shouldLintTypeImports &&
          node.specifiers.some((specifier) => {
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
                    .join(", ")} } from "${node.source.value}";`
                );
              }
              return fixer.replaceText(node, fixed.join("\n"));
            },
          });
        }
      },
    };
  },
};
