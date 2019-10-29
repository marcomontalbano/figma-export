
# @figma-export/cli

> Command line for @figma-export.

## Install

While you can install it globally on your machine, it's much better to install it **locally** project by project.

```sh
npm install --save-dev @figma-export/cli
```

> **Note:** If you do not have a `package.json`, create one before installing or run `npm init -y` to automatically create ones.


## Usage

```sh
export FIGMA_TOKEN=<personalAccessToken>

npx figma-export COMMAND
```

> **Note:** These instructions use the `npx` command to run the locally installed executables. You can drop it inside of an npm run script or you may instead execute with the relative path instead. `./node_modules/.bin/figma-export`

## Commands

### `help`

```sh
npx figma-export help
```

### `components`

Exports components from a Figma file

```sh
npx figma-export components FILEID

# help
npx figma-export help components
```

#### transformers

> `--transformer` `-T` option

```sh
npx figma-export components FILEID -T TRANSFORMER
```

A transform function receives an SVG and turns it into something new.

You can create you own:

```js
// with promise
module.exports = options => {
    return (svg) => new Promise((resolve, reject) => {
        resolve(svg);
    });
}
```

```js
// with async/await
module.exports = options => {
    return async (svg) => {
        return svg;
    };
}
```

or install an official transformer:

| Package | Version |
|---------|---------|
| [`@figma-export/transform-svg-with-svgo`](/packages/transform-svg-with-svgo) | [![npm](https://img.shields.io/npm/v/@figma-export/transform-svg-with-svgo.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/transform-svg-with-svgo) |


#### outputters

> `--outputter` `-O` option

```sh
npx figma-export components FILEID -O OUTPUTTER
```

An output function receives a list of pages, in which each page contains components.

You can create you own:

```js
module.exports = options => {
    return async pages => {
        console.clear();
        console.log(JSON.stringify(pages));
    };
}
```

or install an official outputter:

| Package | Version |
|---------|---------|
| [`@figma-export/output-components-as-svg`](/packages/output-components-as-svg) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-svg.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-svg) |
| [`@figma-export/output-components-as-es6`](/packages/output-components-as-es6) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-es6.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-es6) |


#### .figmaexportrc.js

You can create a file `.figmaexportrc.js` or use a different configuration file providing `-c` or `--config` option to `figma-export components` command.

```sh
npx figma-export components FILEID -c .figmaexportrc.prod.js -T TRANSFORMER
```

This file contains the `configs` object that you can use to provide special options to `transformers` and `outputters`.

```js
// .figmaexportrc.js

module.exports = {
  configs: [
    ['@figma-export/transform-svg-with-svgo', {
      plugins: [
        { removeViewBox: false },
        { removeDimensions: true }
      ]
    }]
  ]
};
```
