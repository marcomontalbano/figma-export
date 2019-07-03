require('dotenv')

const fs = require('fs');
const path = require('path');

const ora = require('ora');

const cli = require('./cli-helper');
const figma = require('./src/figma');

figma.setToken(process.env.FIGMA_TOKEN);

if (cli.command === 'components') {

    const spinner = ora('Loading unicorns').start();

    figma.getSvgs(cli.source, {
        onlyFromPages: cli.options.page,
        transformers: cli.options.transformer,
        updateStatusMessage: message => spinner.text = message
    }).then(svgs => {
        spinner.stop()

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
