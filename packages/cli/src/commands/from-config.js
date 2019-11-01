const { Command } = require('@oclif/command');
const spinner = require('ora')({});

const fs = require('fs');
const path = require('path');

const figmaExport = require('@figma-export/core');

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

            return figmaExport[commandName](options.fileId, {
                token: process.env.FIGMA_TOKEN,
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
