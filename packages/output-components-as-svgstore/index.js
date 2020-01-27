const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const svgstore = require('svgstore');

module.exports = ({
    output,
    getIconId = (options) => `${options.pageName}/${options.componentName}`,
    options = {},
}) => {
    makeDir.sync(output);
    return async (pages) => {
        pages.forEach(({ name: pageName, components }) => {
            const sprites = svgstore(options);

            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const opts = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                sprites.add(getIconId(opts), svg);
            });

            const filePath = path.resolve(output, `${pageName}.svg`);
            fs.writeFileSync(filePath, sprites);
        });
    };
};
