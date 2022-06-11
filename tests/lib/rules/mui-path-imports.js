/**
 * @fileoverview rule
 * @author rule
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/mui-path-imports"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});
ruleTester.run("rule", rule, {
  valid: [
    {
      code: `import Box from "@mui/material/Box";`
    },
    {
      code: `import Add from "@mui/icons-material/Add";`
    },
    {
      code: `import { Theme } from "@mui/material";`
    },
    {
      code: `import { Box } from "other/package";`
    },
  ],

  invalid: [
    {
      code: `import { Add } from "@mui/icons-material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Add from "@mui/icons-material/Add";`
    },
    {
      code: `import { Box } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";`
    },
    {
      code: `import { Add, Link } from "@mui/icons-material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Add from "@mui/icons-material/Add";
import Link from "@mui/icons-material/Link";`,
    },
    {
      code: `import { Box, Card } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import Card from "@mui/material/Card";`
    },
    {
      code: `import { Box, Theme } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import { Theme } from "@mui/material";`,
    },
  ],
});
