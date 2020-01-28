const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');

module.exports = ({
    output,
    getDirname = (options) => `${options.pageName}${path.sep}${options.dirname}`,
    getBasename = (options) => `${options.basename}.svg`,
}) => {
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const filePath = makeDir.sync(path.resolve(output, getDirname(options)));
                fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
            });
        });
    };
};
