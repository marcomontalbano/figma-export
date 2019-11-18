const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');

const camelCase = (str) => str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
});

module.exports = ({ output, useBase64 = false }) => {
    makeDir.sync(output);
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            let code = '';

            components.forEach(({ name: componentName, svg }) => {
                const variableName = camelCase(componentName);
                if (/^[\d]+/.test(variableName)) {
                    throw new Error(`"${componentName}" - Component names cannot start with a number.`);
                }
                code += `export const ${variableName} = \`${useBase64 ? Buffer.from(svg).toString('base64') : svg}\`;\n`;
            });

            const filePath = path.resolve(output, `${pageName}.js`);
            fs.writeFileSync(filePath, code);
        });
    };
};
