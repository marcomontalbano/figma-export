# @figma-export/output-components-as-es6

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components in javascript file.

## Install

Using npm:

```sh
npm i -D @figma-export/output-components-as-es6
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-es6 --dev
```

## Just Try

If you wanna try it just run following command and you will be able to download all components from https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5 :sunglasses:

```sh
# export figma token
export FIGMA_TOKEN=<personalAccessToken>

# export figma components as svg
npx -p @figma-export/cli -p @figma-export/output-components-as-es6 figma-export components RSzpKJcnb6uBRQ3rOfLIyUs5 -O @figma-export/output-components-as-es6
```
