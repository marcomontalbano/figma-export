# @figma-export/output-styles-as-sass

> Styles Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports styles to SASS and SCSS.

With this outputter you can export all the styles as variables inside a `.sass` or `.scss` file.

This is a sample of the output:

```sh
$ tree output/
# output/
# └── _variables.scss
```


## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
module.exports = {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                require('@figma-export/output-styles-as-sass')({
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

require('@figma-export/output-styles-as-sass')({
    output: './output',
    getExtension: () => 'SCSS',
    getFilename: () => '_variables',
    getVariableName: (style) => kebabCase(style.name).toLowerCase(),
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-styles-as-sass
```

or using yarn:

```sh
yarn add @figma-export/output-styles-as-sass --dev
```
