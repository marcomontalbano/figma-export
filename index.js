require('dotenv')

const fs = require('fs');
const path = require('path');

const cli = require('./cli-helper');
const figma = require('./src/figma');

figma.setToken(process.env.FIGMA_TOKEN);

if (cli.command === 'components') {
    figma.getSvgs(cli.source, {
        onlyFromPages: cli.options.page,
        transformers: cli.options.transformer
    }).then(svgs => {

        console.group('\nGenerating')
        Object.entries(svgs).forEach(([pageName, page]) => {
            Object.entries(page).forEach(([filename, { svg }]) => {
                fs.writeFile(
                    path.resolve(cli.options.output, filename + '.svg'),
                    svg,
                    err => {
                        if (err) throw err;
                        console.log(` • ${filename}.svg`);
                    }
                )
            });
        });
        console.groupEnd('\nGenerating')

    }).catch(err => console.error(err.message));

}
