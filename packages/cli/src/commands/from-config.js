const { Command } = require('@oclif/command');
const spinner = require('ora')({});

const fs = require('fs');
const path = require('path');

const figma = require('@figma-export/core');

class FromConfigCommand extends Command {
    async run() {
        const {
            args: {
                config,
            },
        } = this.parse(FromConfigCommand);

        const configPath = path.resolve(config);

        // eslint-disable-next-line import/no-dynamic-require, global-require
        const { commands = [] } = fs.existsSync(configPath) ? require(configPath) : {};

        return Promise.all(commands.map(([commandName, options]) => {
            spinner.start();

            figma.setToken(process.env.FIGMA_TOKEN);

            // utils.mkdirRecursive(output);

            return figma[commandName](options.fileId, {
                ...options,
                log: (message) => { spinner.text = message; },
            }).then(() => {
                spinner.stop();
            }).catch((err) => {
                spinner.stop();
                this.error(err.message, { exit: true });
                // throw err;
            });
        }));
    }
}

FromConfigCommand.description = `Exports from configuration file
`;

FromConfigCommand.args = [
    {
        name: 'config',
        default: '.figmaexportrc.js',
        required: true,
    },
];

module.exports = FromConfigCommand;
