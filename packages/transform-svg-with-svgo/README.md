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

You can use a custom configuration for svgo, creating a `.figmaexportrc.js` file and provide a `config` object for this package.

```js
// .figmaexportrc.js

module.exports = {
  configs: [
    ['@figma-export/transform-svg-with-svgo', {
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
          name: 'removeDimensions',
          active: true
        }
      ]
    }]
  ]
};
```
