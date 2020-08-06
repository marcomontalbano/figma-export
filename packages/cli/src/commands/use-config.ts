import { Command } from '@oclif/command';

import * as figmaExport from '@figma-export/core';

import fs = require('fs');
import path = require('path');
import ora = require('ora');

type FigmaExportCommand = [
    string,
    Record<string, unknown>
];

const spinner = ora({});

class UseConfigCommand extends Command {
    async run(): Promise<void> {
        const {
            args: {
                config,
            },
        } = this.parse(UseConfigCommand);

        const configPath = path.resolve(config);

        // eslint-disable-next-line import/no-dynamic-require, global-require
        const { commands = [] } = fs.existsSync(configPath) ? require(configPath) : {};

        Promise.all(commands.map((command: FigmaExportCommand) => {
            const [commandName, options] = command;

            spinner.start();

            let figmaExporter;
            switch (commandName) {
            case 'components':
                figmaExporter = figmaExport.components;
                break;
            default:
                throw new Error(`Command ${commandName} is not found.`);
            }

            return figmaExporter({
                token: process.env.FIGMA_TOKEN || '',
                fileId: '',
                ...options,
                log: (message) => { spinner.text = message; },
            }).then(() => {
                spinner.stop();
            }).catch((err: Error) => {
                spinner.stop();
                this.error(err, { exit: 1 });
            });
        }));
    }
}

UseConfigCommand.description = `export using a configuration file
`;

UseConfigCommand.args = [
    {
        name: 'config',
        default: '.figmaexportrc.js',
        required: true,
    },
];

module.exports = UseConfigCommand;
