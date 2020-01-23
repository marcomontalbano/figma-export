# @figma-export/output-components-as-es6

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components in javascript file.

With this outputter you can export all components as variables inside a `.js` file called with the page name.

This is a sample of the output:

```sh
$ tree output/
# output/
# ├── icons.js
# └── monochrome.js
```

For each file you will have a list of `export`.

```js
// icons.js
export const figmaExport = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"> ... </svg>`;
export const figmaLogo = `<svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg"> ... </svg>`;
```

> **Tip**: A component named `icon/eye` will be exported as variable named `iconEye`.

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-es6
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-es6 --dev
```

## Options

This task can be configured providing some options:

* `output` is the path to the output folder.
* `variablePrefix` and `variableSuffix` enable you to prepend or append a text to the variable name. This is necessary when your component name is a reserved word (e.g. `const`, `package`, ...).
* `useBase64` (boolean) will export each components using Base 64 encoding.

```js
// icons.js
export const figmaExport = `PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gLi4uIDwvc3ZnPg==`;
```

* `useDataUrl` (boolean) will export each components using [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) format.

```js
// icons.js
export const figmaExport = `data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3e ... %3c/svg%3e`;
```
