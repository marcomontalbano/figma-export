const fs = require('fs');
const path = require('path');

module.exports = ({ output }) => {
    return async (pages) => {
        Object.entries(pages).forEach(([pageName, page]) => {
            Object.entries(page).forEach(([componentName, { svg }]) => {
                const filePath = path.resolve(output, `${pageName}-${componentName}.svg`);
                fs.writeFileSync(filePath, svg);
            });
        });
    };
};
