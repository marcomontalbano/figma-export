# @figma-export/output-styles-as-style-dictionary

> Styles Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports styles to [Style Dictionary](https://amzn.github.io/style-dictionary/#/) JSON format.

With this outputter you can export all the styles as variables inside a `.json`.

This is a sample of the output:

```sh
$ tree output/
# output/
# └── base.json
```


## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
module.exports = {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                require('@figma-export/output-styles-as-style-dictionary')({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getExtension`, `getFilename` and `getVariableName` are **optional**.

```js
const { kebabCase } = require('@figma-export/utils');

...

require('@figma-export/output-styles-as-style-dictionary')({
    output: './output',
    getExtension: () => 'JSON',
    getFilename: () => 'base',
    getVariableName: (style) => kebabCase(style.name).toLowerCase(),
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-styles-as-style-dictionary
```

or using yarn:

```sh
yarn add @figma-export/output-styles-as-style-dictionary --dev
```
