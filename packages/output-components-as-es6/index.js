const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const svgToMiniDataURI = require('mini-svg-data-uri');

const camelCase = (str) => str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
});

const getVariableName = (componentName) => {
    const variableName = camelCase(componentName);

    if (/^[\d]+/.test(variableName)) {
        throw new Error(`"${componentName}" - Component names cannot start with a number.`);
    }

    return variableName;
};

module.exports = ({ output, useBase64 = false, useDataUri = false }) => {
    makeDir.sync(output);
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            let code = '';

            components.forEach(({ name: componentName, svg }) => {
                const variableName = getVariableName(componentName);
                let variableValue = svg;

                // eslint-disable-next-line default-case
                switch (true) {
                case useBase64:
                    variableValue = Buffer.from(svg).toString('base64');
                    break;
                case useDataUri:
                    variableValue = svgToMiniDataURI(svg);
                    break;
                }

                code += `export const ${variableName} = \`${variableValue}\`;\n`;
            });

            const filePath = path.resolve(output, `${pageName}.js`);
            fs.writeFileSync(filePath, code);
        });
    };
};
