const { Command, flags: commandFlags } = require('@oclif/command');
const spinner = require('ora')({});

const fs = require('fs');
const path = require('path');

const figmaExport = require('@figma-export/core');

const resolveNameOrPath = (nameOrPath) => {
    const absolutePath = path.resolve(nameOrPath);
    return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
};

const requirePackages = (packages, baseOptions = {}) => {
    return packages.map((pkg) => {
        if (typeof pkg === 'function') {
            return pkg;
        }

        const pkgNameOrPath = resolveNameOrPath(pkg);

        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(pkgNameOrPath)(baseOptions);
    });
};

class ComponentsCommand extends Command {
    async run() {
        const {
            args: {
                fileId,
            },
            flags: {
                page,
                output,
                outputter = [],
                transformer = [],
            },
        } = this.parse(ComponentsCommand);

        spinner.info(`Exporting ${fileId} with [${transformer.join(', ')}] as [${outputter.join(', ')}]`);

        spinner.start();

        return figmaExport.components({
            fileId,
            token: process.env.FIGMA_TOKEN,
            onlyFromPages: page,
            transformers: requirePackages(transformer),
            outputters: requirePackages(outputter, { output }),
            log: (message) => { spinner.text = message; },
        }).then(() => {
            spinner.stop();
        }).catch((err) => {
            spinner.stop();
            this.error(err, { exit: true });
        });
    }
}

ComponentsCommand.description = `export components from a Figma file
`;

ComponentsCommand.args = [
    {
        name: 'fileId',
        required: true,
    },
];

ComponentsCommand.flags = {
    page: commandFlags.string({
        char: 'p',
        description: 'Figma page names (defaults to \'all pages\')',
    }),
    output: commandFlags.string({
        char: 'o',
        description: 'Output directory',
        default: 'output',
        multiple: false,
    }),
    outputter: commandFlags.string({
        char: 'O',
        description: 'Outputter module or path',
        multiple: true,
    }),
    transformer: commandFlags.string({
        char: 'T',
        description: 'Transformer module or path',
        multiple: true,
    }),
};

module.exports = ComponentsCommand;
