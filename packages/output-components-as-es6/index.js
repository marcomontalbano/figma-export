const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const svgToMiniDataURI = require('mini-svg-data-uri');

const { getVariableName } = require('./utils');

module.exports = ({
    output,
    variablePrefix = '',
    variableSuffix = '',
    useBase64 = false,
    useDataUrl = false,
}) => {
    makeDir.sync(output);
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            let code = '';

            components.forEach(({ name: componentName, svg }) => {
                const variableName = getVariableName(`${variablePrefix} ${componentName} ${variableSuffix}`);
                let variableValue = svg;

                // eslint-disable-next-line default-case
                switch (true) {
                case useBase64:
                    variableValue = Buffer.from(svg).toString('base64');
                    break;
                case useDataUrl:
                    variableValue = svgToMiniDataURI(svg);
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
