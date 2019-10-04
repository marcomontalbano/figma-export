const fs = require('fs');
const path = require('path');

const camelCase = (str) => str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
});

module.exports = ({ output }) => {
    return async (pages) => {
        let code = '';
        Object.entries(pages).forEach(([, page]) => {
            Object.entries(page).forEach(([filename, { svg }]) => {
                const variableName = camelCase(filename);
                if (/^[\d]+/.test(variableName)) {
                    throw new Error(`"${filename}" - Component names cannot start with a number.`);
                }
                code += `export const ${variableName} = \`${svg}\`;\n`;
            });
        });

        const filePath = path.resolve(output, 'figma-components.js');
        fs.writeFileSync(filePath, code);
    };
};
