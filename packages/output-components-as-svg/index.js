const fs = require('fs');
const path = require('path');

module.exports = (options) => {
    if (!fs.existsSync(options.output)) {
        const err = new Error(`Folder '${options.output}' doesn't exist`);
        throw err;
    }

    return async (pages) => {
        Object.entries(pages).forEach(([pageName, page]) => {
            Object.entries(page).forEach(([filename, { svg }]) => {
                fs.writeFile(
                    path.resolve(options.output, `${filename}.svg`),
                    svg,
                    (err) => {
                        if (err) throw err;
                    },
                );
            });
        });
    };
};
