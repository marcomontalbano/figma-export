import { Command, Flags as commandFlags } from '@oclif/core';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { requirePackages } from '../utils';

import ora = require('ora');

const spinner = ora({});

export class StylesCommand extends Command {
    static description = `export styles from a Figma file
`;

    static args = [
        {
            name: 'fileId',
            required: true,
        },
    ];

    static flags = {
        fileVersion: commandFlags.string({
            required: false,
            description: `
A specific version ID to get. Omitting this will get the current version of the file.
https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history`,
            multiple: false,
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
    };

    async run(): Promise<void> {
        const {
            args: {
                fileId,
            },
            flags: {
                output,
                outputter = [],
                fileVersion,
            },
        } = await this.parse(StylesCommand);

        spinner.info(`Exporting ${fileId} as [${outputter.join(', ')}]`);

        spinner.start();

        figmaExport.styles({
            fileId,
            version: fileVersion,
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
