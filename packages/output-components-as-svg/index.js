const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');

module.exports = ({ output }) => {
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ svg, figmaExport }) => {
                const filePath = makeDir.sync(path.resolve(output, figmaExport.dirname));
                fs.writeFileSync(path.resolve(filePath, `${pageName}-${figmaExport.basename}.svg`), svg);
            });
        });
    };
};
