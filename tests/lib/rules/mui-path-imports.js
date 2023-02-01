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
  parser: require.resolve("@typescript-eslint/parser"),
});
ruleTester.run("rule", rule, {
  valid: [
    {
      code: `import Box from "@mui/material/Box";`,
    },
    {
      code: `import Add from "@mui/icons-material/Add";`,
    },
    {
      code: `import TreeView from "@mui/lab/TreeView";`,
    },
    {
      code: `import Button from "@mui/joy/Button";`,
    },
    {
      code: `import { Theme } from "@mui/material";`,
    },
    {
      code: `import { SvgIconTypeMap } from "@mui/material";`,
    },
    {
      code: `import { SvgIconTypeMap, Theme } from "@mui/material";`,
    },
    {
      code: `import { Theme, SvgIconTypeMap } from "@mui/material";`,
    },
    {
      code: `import { Other } from "other/package";`,
    },
    {
      code: `import type { TextFieldProps as MuiTextFieldProps } from '@mui/material';`,
      options: [{ ignoreImportTypeKeyword: true }],
    },
    {
      code: `import type { TextFieldProps } from '@mui/material/Textfield';`,
    },
  ],

  invalid: [
    {
      code: `import { Add } from "@mui/icons-material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Add from "@mui/icons-material/Add";`,
    },
    {
      code: `import { Box } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";`,
    },
    {
      code: `import { TreeView } from "@mui/lab";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import TreeView from "@mui/lab/TreeView";`,
    },
    {
      code: `import { Button } from "@mui/joy";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Button from "@mui/joy/Button";`,
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
import Card from "@mui/material/Card";`,
    },
    {
      code: `import { Box, Theme } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import { Theme } from "@mui/material";`,
    },
    {
      code: `import { TreeView, TreeItem } from "@mui/lab";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";`,
    },
    {
      code: `import { Button, Select } from "@mui/joy";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";`,
    },
    {
      code: `import { Box, Theme, SvgIconTypeMap } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import { Theme, SvgIconTypeMap } from "@mui/material";`,
    },
    {
      code: `import { Theme, Box, SvgIconTypeMap } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import { Theme, SvgIconTypeMap } from "@mui/material";`,
    },
    {
      code: `import { Theme, SvgIconTypeMap, Box } from "@mui/material";`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: `import Box from "@mui/material/Box";
import { Theme, SvgIconTypeMap } from "@mui/material";`,
    },
    {
      code: `import type { TextFieldProps } from '@mui/material';`,
      errors: [{ message: "error: !mui-toplevel-import", type: "" }],
      output: null,
    },
  ],
});
