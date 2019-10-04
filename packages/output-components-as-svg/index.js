const fs = require('fs');
const path = require('path');

module.exports = ({ output }) => {
    return async (pages) => {
        Object.entries(pages).forEach(([, page]) => {
            Object.entries(page).forEach(([filename, { svg }]) => {
                const filePath = path.resolve(output, `${filename}.svg`);
                fs.writeFileSync(filePath, svg);
            });
        });
    };
};
