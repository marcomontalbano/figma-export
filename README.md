<p align="center">
    <img src="./images/figma-export.png" width="200" />
</p>

<p align="center">
    Export tool for Figma.
</p>

<p align="center">
    <a href="https://travis-ci.org/marcomontalbano/figma-export"><img alt="Build Status" src="https://travis-ci.org/marcomontalbano/figma-export.svg?branch=master" /></a>
    <a href="https://coveralls.io/github/marcomontalbano/figma-export?branch=master"><img alt="Coverage Status" src="https://coveralls.io/repos/github/marcomontalbano/figma-export/badge.svg?branch=master" /></a>
</p>


## Personal Access Token

First of all you have to set the environment variable `FIGMA_TOKEN`.

To do so, you need a **Personal Access Token**. You can generate one from your *Account Settings*.

<img width="209" alt="Figma - Account Menu" src="./images/figma--account-menu.png" />

Inside the Account Settings click on *Create a new personal access token* and enter a description.

Copy the token, this is your only chance to do so!

```sh
export FIGMA_TOKEN=<personalAccessToken>
```

## Just Try

If you wanna try it just run following command and you will be able to download all components from https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5 as .svg :sunglasses:

```sh
# export figma token
export FIGMA_TOKEN=<personalAccessToken>

# create the default output folder
mkdir output

# export figma components as svg
npx -p @figma-export/cli -p @figma-export/output-components-as-svg figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-svg
```

## Usage

### Build Process

You can use `figma-export` as part of your build process.

```sh
npm install --save-dev @figma-export/cli

# or using `yarn`
yarn add @figma-export/cli --dev
```

Now you can create a `script` command inside your `package.json`.

Following an example:

```json
...
    "scripts": {
        "figma:export": "export FIGMA_TOKEN=<personalAccessToken> figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-svg"
    }
...
```

### Use it on the fly

Alternatively you can use `npx` to use it on the fly:

```sh
npx @figma-export/cli --help
```

### Global Setup

You can also install it as a global dependency:

```sh
npm install -g @figma-export/cli

# or using `yarn`
yarn add @figma-export/cli --global
```

```sh
figma-export --help
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
