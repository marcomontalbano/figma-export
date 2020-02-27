# @figma-export/output-components-as-svgr

> Outputter for [@figma-export](https://github.com/marcomontalbano/figma-export) that exports components as React components.

With this outputter you can export all Figma components as React components into the specified output folder.

This is a sample of the output from this [Figma file](https://www.figma.com/file/RSzpKJcnb6uBRQ3rOfLIyUs5):

```sh
$ tree output/

# output
# ├── icons
# │   ├── FigmaArrow.jsx
# │   ├── FigmaExport.jsx
# │   ├── FigmaLogo.jsx
# │   └── index.js
# ├── monochrome
# │   ├── FigmaBlue.jsx
# │   ├── FigmaGreen.jsx
# │   ├── FigmaPurple.jsx
# │   ├── FigmaRed.jsx
# │   └── index.js
# └── unit-test
#     ├── figma
#     │   ├── logo
#     │   │   ├── Main.jsx
#     │   │   ├── MainBright.jsx
#     │   │   └── index.js
#     │   ├── Logo.jsx
#     │   └── index.js
#     ├── FigmaDefaultLogo.jsx
#     └── index.js
```

> **Tip**: A figma component named `icon/eye` will be exported as `Eye.jsx` inside the `icon` folder. Another `index.js` file will be created inside the `icon` folder and this will export directly the `Eye` component.

## Install

Using npm:

```sh
npm install --save-dev @figma-export/output-components-as-svgr
```

or using yarn:

```sh
yarn add @figma-export/output-components-as-svgr --dev
```
