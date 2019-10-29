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

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-es6
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-es6 --dev
```
