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
import asStyleDictionary from '@figma-export/output-styles-as-style-dictionary'

export default {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                asStyleDictionary({
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
import asStyleDictionary from '@figma-export/output-styles-as-style-dictionary'
import { kebabCase } from '@figma-export/utils'

...

asStyleDictionary({
    output: './output',
    getExtension: () => 'JSON',
    getFilename: () => 'base',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
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
