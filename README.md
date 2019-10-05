<p align="center">
    <img src="./images/figma-export.png" width="200" />
</p>

<p align="center">
    Export tool for Figma.
</p>

<p align="center">
    <a href="https://github.com/marcomontalbano/figma-export"><img alt="Build Status" src="https://github.com/marcomontalbano/figma-export/workflows/Node%20CI/badge.svg" /></a>
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

> You can also use [dotenv](https://www.npmjs.com/package/dotenv) to avoid pushing you personal token to your repository or `export` the variable using `.bash_profile`/`.bashrc` file.

## Just Try

If you wanna try it just run following command and you will be able to download all components from https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5 as .svg :sunglasses:

```sh
# export figma token
export FIGMA_TOKEN=<personalAccessToken>

# export figma components as svg
npx -p @figma-export/cli -p @figma-export/output-components-as-svg figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-svg
```

## Packages

### [@figma-export/core](packages/core)

This package contains the core functionalities for `figma-export`. You can download and use it as a dependency of your project.

### [@figma-export/cli](packages/cli)

This package allows you to consume all core functionalities from your terminal.

## Usage

### Build Process

You can use `figma-export` as part of your build process.

```sh
npm install --save-dev @figma-export/cli @figma-export/output-components-as-svg

# or using `yarn`
yarn add @figma-export/cli @figma-export/output-components-as-svg --dev
```

Now you can create a `script` command inside your `package.json`.

Following an example:

```json
...
    "scripts": {
        "figma:export": "FIGMA_TOKEN=<personalAccessToken> figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-svg"
    }
...
```

### Use it on the fly

Alternatively you can use `npx` to use it on the fly:

```sh
npx @figma-export/cli help
```

### Global Setup

You can also install it as a global dependency:

```sh
npm install -g @figma-export/cli

# or using `yarn`
yarn add @figma-export/cli --global
```

```sh
figma-export help
```
