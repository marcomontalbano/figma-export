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
import asSass from '@figma-export/output-styles-as-sass'

export default {
    commands: [
        ['styles', {
            fileId: 'fzYhvQpqwhZDUImRz431Qo',
            outputters: [
                asSass({
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
import asSass from '@figma-export/output-styles-as-sass'
import { kebabCase } from '@figma-export/utils'

...

asSass({
    output: './output',
    getExtension: () => 'SCSS',
    getFilename: () => '_variables',
    getVariableName = (style, descriptor) => `${kebabCase(style.name).toLowerCase()}${descriptor != null ? `-${descriptor}` : ''}`,
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
