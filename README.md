<img width="100" src="https://user-images.githubusercontent.com/37785038/173216745-5e784fdf-d233-4323-bdf8-483807d40096.svg"/>

# Mui path imports

[![CI:UT](https://github.com/kajirikajiri/eslint-plugin-mui-path-imports/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/kajirikajiri/eslint-plugin-mui-path-imports/actions/workflows/npm-publish.yml)

## Deprecated: See [this comment](https://github.com/kajirikajiri/eslint-plugin-mui-path-imports/issues/39) for more info.

Use path import to avoid pulling in unused modules. Decreases waiting time.

Reduces about 10000 modules.

BEFORE
```
event - compiled successfully in 287 ms (11756 modules)
wait  - compiling...
event - compiled successfully in 384 ms (11756 modules)
wait  - compiling...
event - compiled successfully in 301 ms (11756 modules)
wait  - compiling...
event - compiled successfully in 298 ms (11756 modules)
```

AFTER
```
event - compiled successfully in 69 ms (1867 modules)
wait  - compiling...
event - compiled successfully in 72 ms (1867 modules)
wait  - compiling...
event - compiled successfully in 64 ms (1867 modules)
wait  - compiling...
event - compiled successfully in 84 ms (1867 modules)
```

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-mui-path-imports`:

```sh
npm install eslint-plugin-mui-path-imports --save-dev
```

## Usage

Add `plugin` and `rules` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "mui-path-imports"
    ],
    "rules": {
        "mui-path-imports/mui-path-imports": "error"
    }
}
```

And eslint --fix

```javascript
import { Box } from '@mui/material';
↓
import Box from "@mui/material/Box";
```
