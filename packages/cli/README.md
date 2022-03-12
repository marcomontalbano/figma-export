
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
npx figma-export --help
```


### `use-config`

This command is well-explained into the project README. Look at [advanced](/README.md#advanced) section.


### `components`

Exports components from a Figma file

```sh
npx figma-export components FILEID

# help
npx figma-export components --help
```

#### transformers

> `--transformer` `-T` option

```sh
npx figma-export components FILEID -T TRANSFORMER
```

A transform function receives an SVG and turns it into something new.

You can create you own:

```ts
// with promise
module.exports = options => {
    return (svg) => new Promise((resolve, reject) => {
        resolve(svg);
    });
}
```

```ts
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

```ts
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
| [`@figma-export/output-components-as-es6`](/packages/output-components-as-es6) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-es6.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-es6) |
| [`@figma-export/output-components-as-stdout`](/packages/output-components-as-stdout) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-stdout.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-stdout) |
| [`@figma-export/output-components-as-svg`](/packages/output-components-as-svg) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-svg.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-svg) |
| [`@figma-export/output-components-as-svgr`](/packages/output-components-as-svgr) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-svgr.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-svgr) |
| [`@figma-export/output-components-as-svgstore`](/packages/output-components-as-svgstore) | [![npm](https://img.shields.io/npm/v/@figma-export/output-components-as-svgstore.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-components-as-svgstore) |


### `styles`

Exports styles from a Figma file

```sh
npx figma-export styles FILEID

# help
npx figma-export styles --help
```


#### outputters

> `--outputter` `-O` option

```sh
npx figma-export styles FILEID -O OUTPUTTER
```

An output function receives a list of styles.

You can create you own:

```ts
module.exports = options => {
    return async styles => {
        console.clear();
        console.log(JSON.stringify(styles));
    };
}
```

or install an official outputter:

| Package | Version |
|---------|---------|
| [`@figma-export/output-styles-as-css`](/packages/output-styles-as-css) | [![npm](https://img.shields.io/npm/v/@figma-export/output-styles-as-css.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-styles-as-css) |
| [`@figma-export/output-styles-as-sass`](/packages/output-styles-as-sass) | [![npm](https://img.shields.io/npm/v/@figma-export/output-styles-as-sass.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-styles-as-sass) |
| [`@figma-export/output-styles-as-less`](/packages/output-styles-as-less) | [![npm](https://img.shields.io/npm/v/@figma-export/output-styles-as-less.svg?maxAge=3600)](https://www.npmjs.com/package/@figma-export/output-styles-as-less) |
