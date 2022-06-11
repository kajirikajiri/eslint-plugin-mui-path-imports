![logo](./logo.png)

# Mui path imports

Use path import to avoid pulling in unused modules.

Decreases waiting time.

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

And eslint --fix.

```javascript
import { Box } from '@mui/material';
↓
import Box from "@mui/material/Box";
```