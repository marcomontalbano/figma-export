const fs = require('fs');
const path = require('path');

module.exports = ({ output }) => {
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg }) => {
                const filePath = path.resolve(output, `${pageName}-${componentName}.svg`);
                fs.writeFileSync(filePath, svg);
            });
        });
    };
};
