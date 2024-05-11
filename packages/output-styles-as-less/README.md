# @figma-export/output-styles-as-less

> Styles Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports styles to LESS.

With this outputter you can export all the styles as variables inside a `.less` file.

This is a sample of the output:

```sh
$ tree output/
# output/
# └── _variables.less
```


## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
import asLess from '@figma-export/output-styles-as-less'

export default {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                asLess({
                    output: './output'
                })
            ]
        }],
    ]
}
```

`output` is **mandatory**.

`getFilename` and `getVariableName` are **optional**.

```js
import asLess from '@figma-export/output-styles-as-less'
import { kebabCase } from '@figma-export/utils'

...

asLess({
    output: './output',
    getFilename: () => '_variables',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-styles-as-less
```

or using yarn:

```sh
yarn add @figma-export/output-styles-as-less --dev
```
