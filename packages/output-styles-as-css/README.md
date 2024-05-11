# @figma-export/output-styles-as-css

> Styles Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports styles to CSS.

With this outputter you can export all the styles as variables inside a `.css` file.

This is a sample of the output:

```sh
$ tree output/
# output/
# └── _variables.css
```


## .figmaexportrc.js

You can easily add this outputter to your `.figmaexportrc.js`:

```js
import asCss from '@figma-export/output-styles-as-css'

export default {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                asCss({
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
import asCss from '@figma-export/output-styles-as-css'
import { kebabCase } from '@figma-export/utils'

...

asCss({
    output: './output',
    getFilename: () => '_variables',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
})
```

> *defaults may change, please refer to `./src/index.ts`*

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-styles-as-css
```

or using yarn:

```sh
yarn add @figma-export/output-styles-as-css --dev
```
