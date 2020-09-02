# @figma-export/output-styles-as-scss

> Styles Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports styles to SCSS.

With this outputter you can export all the styles as variables inside a `.scss` or `.sass` file.

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
            fileId: 'RSzpKJcnb6uBRQ3rOfLIyUs5',
            onlyFromPages: ['figma-styles'],
            outputters: [
                require('@figma-export/output-styles-as-scss')({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getExtension` and `getFilename` are **optional**.

```js
require('@figma-export/output-styles-as-scss')({
    output: './output',
    getExtension: () => 'SCSS',
    getFilename: () => '_variables',
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-styles-as-scss
```

or using yarn:

```sh
yarn add @figma-export/output-styles-as-scss --dev
```
