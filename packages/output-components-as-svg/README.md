# @figma-export/output-components-as-svg

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components as svg.

With this outputter you can export all components as svg into the specified output folder.

This is a sample of the output from this [Figma file](https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5):

```sh
$ tree output/
# output
# ├── icons
# │   ├── figma-arrow.svg
# │   ├── figma-export.svg
# │   └── figma-logo.svg
# ├── monochrome
# │   ├── figma-blue.svg
# │   ├── figma-green.svg
# │   ├── figma-purple.svg
# │   └── figma-red.svg
# └── unit-test
#     ├── figma
#     │   ├── logo
#     │   │   ├── main (bright).svg
#     │   │   └── main.svg
#     │   └── logo.svg
#     └── figma default logo.svg
```

> **Tip**: A component named `icon/eye` will be exported as `eye.svg` inside the `icon` folder.

## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
module.exports = {
    commands: [
        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            outputters: [
                require('@figma-export/output-components-as-svg')({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getDirname` and `getBasename` are **optional**.

```js
const path = require('path');

...

require('@figma-export/output-components-as-svg')({
    output: './output',
    getDirname: (options) => `${options.pageName}${path.sep}${options.dirname}`,
    getBasename: (options) => `${options.basename}.svg`,
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-svg
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-svg --dev
```
