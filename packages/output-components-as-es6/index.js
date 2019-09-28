const fs = require('fs');
const path = require('path');

const camelCase = (str) => str.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
});

module.exports = (options) => {
    if (!fs.existsSync(options.output)) {
        const err = new Error(`Folder '${options.output}' doesn't exist`);
        throw err;
    }

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

        fs.writeFile(path.resolve(options.output, 'figma-components.js'), code,
            (err) => {
                if (err) throw err;
            });
    };
};
