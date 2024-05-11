# @figma-export/transform-svg-with-svgo

> Transformer for [@figma-export](https://github.com/marcomontalbano/figma-export) that optimizes svgs using [svgo](https://github.com/svg/svgo) tool.

## Install

Using npm:

```sh
npm install --save-dev @figma-export/transform-svg-with-svgo
```

or using yarn:

```sh
yarn add @figma-export/transform-svg-with-svgo --dev
```

## Usage

You can transform an svg before exporting with svgo:

```js
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo'

export default {
  commands: [
    ['components', {
      fileId: 'fzYhvQpqwhZDUImRz431Qo',
      onlyFromPages: ['icons', 'unit-test'],
      transformers: [
        transformSvgWithSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                }
              }
            },
            {
              name: 'removeDimensions'
            }
          ]
        })
      ],
    }],
  ]
}
```
