const { Command, flags: commandFlags } = require('@oclif/command');
const spinner = require('ora')({});

const fs = require('fs');
const path = require('path');

const figma = require('@figma-export/core');

const resolveNameOrPath = (nameOrPath) => {
    const absolutePath = path.resolve(nameOrPath);
    return fs.existsSync(absolutePath) ? absolutePath : nameOrPath;
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

        this.log(`Export ${fileId} with [${outputter.join(', ')}]`);

        spinner.start();

        figma.setToken(process.env.FIGMA_TOKEN);

        return figma.exportComponents(fileId, {
            output: output[0],
            onlyFromPages: page,
            transformers: transformer.map(resolveNameOrPath),
            outputters: outputter.map(resolveNameOrPath),
            log: (message) => { spinner.text = message; },
        }).then(() => {
            spinner.stop();
        }).catch((err) => {
            spinner.stop();
            this.error(err.message, { exit: true });
            // throw err;
        });
    }
}

ComponentsCommand.description = `Exports components from a Figma file
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
        description: 'Output directory (defaults to \'./output\')',
        default: ['output'],
        multiple: true,
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
