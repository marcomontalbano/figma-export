const fs = require('fs');
const path = require('path');

const AbstractOutputter = require('./AbstractOutputter')

module.exports = class extends AbstractOutputter {

    constructor(options = {}) {
        super(options);

        this.options = options;
    }

    async execute(pages) {
        Object.entries(pages).forEach(([pageName, page]) => {
            Object.entries(page).forEach(([filename, { svg }]) => {
                fs.writeFile(
                    path.resolve(this.options.output, filename + '.svg'),
                    svg,
                    err => {
                        if (err) throw err;
                        console.log(` • ${filename}.svg`);
                    }
                )
            });
        });
    }
}
