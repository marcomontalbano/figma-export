# @figma-export/output-components-as-svgstore

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components in svg file (`SVG Sprites`).

With this outputter you can export all components as `<symbol>` inside a `.svg` file named with the page name.

This is a sample of the output:

```sh
$ tree output/
# output/
# ├── icons.svg
# └── unit-test.svg
```

Probably you already know what <a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/css-sprites/">CSS Sprites</a> are, basically you can combine multiple images into a single image file and use it on a website.

**SVG Sprites** are very similar, but use svg instead of png.

You can read more on <a target="_blank" rel="noopener noreferrer" href="https://css-tricks.com/svg-sprites-use-better-icon-fonts/">Icon System with SVG Sprites</a> article where you can find how to use them.

## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
module.exports = {
    commands: [
        ['components', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            onlyFromPages: ['icons', 'unit-test'],
            outputters: [
                require('@figma-export/output-components-as-svgstore')({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getIconId` and `svgstoreConfig` are **optional**.

```js
require('@figma-export/output-components-as-svgstore')({
    output: './output',
    getIconId: (options) => `${options.pageName}/${options.componentName}`,
    svgstoreConfig: {},
})
```

> *defaults may change, please refer to `./src/index.ts`*

`svgstoreConfig` is the [svgstore configuration](https://github.com/svgstore/svgstore#options) object.

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-svgstore
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-svgstore --dev
```
