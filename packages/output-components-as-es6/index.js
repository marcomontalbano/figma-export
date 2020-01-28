const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const svgToMiniDataURI = require('mini-svg-data-uri');
const { camelCase } = require('@figma-export/output-components-utils');

module.exports = ({
    output,
    getVariableName = (options) => camelCase(options.componentName.trim()),
    useBase64 = false,
    useDataUrl = false,
}) => {
    makeDir.sync(output);
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            let code = '';

            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const variableName = getVariableName(options);
                let variableValue;

                if (/^[\d]+/.test(variableName)) {
                    throw new Error(`"${componentName.trim()}" thrown an error: component names cannot start with a number.`);
                }

                switch (true) {
                case useBase64:
                    variableValue = Buffer.from(svg).toString('base64');
                    break;
                case useDataUrl:
                    variableValue = svgToMiniDataURI(svg);
                    break;
                default:
                    variableValue = svg;
                    break;
                }

                if (code.includes(`export const ${variableName} =`)) {
                    throw new Error(`Component "${componentName}" has an error: two components cannot have a same name.`);
                }

                code += `export const ${variableName} = \`${variableValue}\`;\n`;
            });

            const filePath = path.resolve(output, `${pageName}.js`);
            fs.writeFileSync(filePath, code);
        });
    };
};
