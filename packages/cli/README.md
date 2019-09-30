# @figma-export/cli

> Command line for @figma-export.

## Install

Using npm:

```sh
npm i -D @figma-export/cli
```

or using yarn:

```sh
yarn add @figma-export/cli --dev
```

## Usage

```sh
export FIGMA_TOKEN=<personalAccessToken>

figma-export <command> <fileId>
```

## Commands

### `components`

```sh
figma-export components <fileId>
```

#### transformers

A transform function receives an SVG and turns it into something new.

You can create you own:

```js
module.exports = options => {
    return (svg) => new Promise((resolve, reject) => {
        resolve(svg);
    });
}
```

```js
module.exports = options => {
    return async (svg) => {
        return svg;
    };
}
```

```sh
npm install -g @figma-export/transform-svg-with-svgo

figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -T @figma-export/transform-svg-with-svgo
```

- [@figma-export/transform-svg-with-svgo](https://www.npmjs.com/package/@figma-export/transform-svg-with-svgo)


#### outputters

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

Usage: 

```sh
npm install -g @figma-export/output-components-as-svg

figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-svg
```

- [@figma-export/output-components-as-stdout](https://www.npmjs.com/package/@figma-export/output-components-as-stdout)
- [@figma-export/output-components-as-svg](https://www.npmjs.com/package/@figma-export/output-components-as-svg)
- [@figma-export/output-components-as-es6](https://www.npmjs.com/package/@figma-export/output-components-as-es6)
