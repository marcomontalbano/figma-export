# @figma-export/output-components-as-svgr

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components as React components.

With this outputter you can export all Figma components as React components into the specified output folder.

This is a sample of the output from this [Figma file](https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5):

```sh
$ tree output/

# output
# ├── icons
# │   ├── FigmaArrow.jsx
# │   ├── FigmaExport.jsx
# │   ├── FigmaLogo.jsx
# │   └── index.js
# ├── monochrome
# │   ├── FigmaBlue.jsx
# │   ├── FigmaGreen.jsx
# │   ├── FigmaPurple.jsx
# │   ├── FigmaRed.jsx
# │   └── index.js
# └── unit-test
#     ├── figma
#     │   ├── logo
#     │   │   ├── Main.jsx
#     │   │   ├── MainBright.jsx
#     │   │   └── index.js
#     │   ├── Logo.jsx
#     │   └── index.js
#     ├── FigmaDefaultLogo.jsx
#     └── index.js
```

> **Tip**: A figma component named `icon/eye` will be exported as `Eye.jsx` inside the `icon` folder. Another `index.js` file will be created inside the `icon` folder and this will export directly the `Eye` component.

## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
module.exports = {
    commands: [
        ['components', {
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['icons', 'monochrome', 'unit-test'],
            outputters: [
                require('@figma-export/output-components-as-svgr')({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getDirname`, `getComponentName`, `getFileExtension` and `getSvgrConfig` are **optional**.

```js
const path = require('path');
const { pascalCase } = require('@figma-export/utils');

...

require('@figma-export/output-components-as-svgr')({
    output: './output',
    getDirname: (options) => `${options.pageName}${path.sep}${options.dirname}`,
    getComponentName: (options) => `${pascalCase(options.basename)}`,
    getFileExtension: (options) => '.jsx',
    getSvgrConfig: (options) => ({}),
})
```

> *defaults may change, please refer to `./src/index.ts`*

`getSvgrConfig` is a function that returns the [SVGR configuration](https://react-svgr.com/docs/options/) object.

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-svgr
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-svgr --dev
```
