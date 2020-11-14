import { Command, flags as commandFlags } from '@oclif/command';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { requirePackages } from '../utils';

import ora = require('ora');

const spinner = ora({});

class StylesCommand extends Command {
    async run(): Promise<void> {
        const {
            args: {
                fileId,
            },
            flags: {
                output,
                outputter = [],
            },
        } = this.parse(StylesCommand);

        spinner.info(`Exporting ${fileId} as [${outputter.join(', ')}]`);

        spinner.start();

        figmaExport.styles({
            fileId,
            token: process.env.FIGMA_TOKEN || '',
            outputters: requirePackages<FigmaExport.StyleOutputter>(outputter, { output }),
            log: (message: string) => { spinner.text = message; },
        }).then(() => {
            spinner.succeed('done');
        }).catch((error: Error) => {
            spinner.fail();

            // eslint-disable-next-line no-console
            console.log(error);
        });
    }
}

StylesCommand.description = `export styles from a Figma file
`;

StylesCommand.args = [
    {
        name: 'fileId',
        required: true,
    },
];

StylesCommand.flags = {
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
};

module.exports = StylesCommand;
