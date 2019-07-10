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


## Getting Started

### Personal Access Token

First of all you have to set the environment variable `FIGMA_TOKEN`.

To do so, you need a **Personal Access Token**. You can generate one from your *Account Settings*.

<img width="209" alt="Figma - Account Menu" src="./images/figma--account-menu.png" />

Inside the Account Settings click on *Create a new personal access token* and enter a description.

Copy the token, this is your only chance to do so!

```sh
export FIGMA_TOKEN=<personalAccessToken>
```

### Build Process

You can use `figma-export` as part of your build process.

```sh
npm install --save-dev @figma-export/cli

# or using `yarn`
yarn add @figma-export/cli --dev
```

Nowyou can create a `script` command inside your `package.json`.

Following an example:

```json
...
    "scripts": {
        "figma:export": "export FIGMA_TOKEN=<personalAccessToken> figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5"
    }
...
```

### Use it on the fly

Alternatively you can use `npx` to use it on the fly:

```sh
npx @figma-export/cli <command> <fileId>
```
