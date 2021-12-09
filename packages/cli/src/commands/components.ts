import { Command, flags as commandFlags } from '@oclif/command';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { requirePackages } from '../utils';

import ora = require('ora');

const spinner = ora({});

export class ComponentsCommand extends Command {
    static description = `export components from a Figma file
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
        page: commandFlags.string({
            char: 'p',
            description: 'Figma page names (defaults to \'all pages\')',
            multiple: true,
        }),
        concurrency: commandFlags.integer({
            char: 'c',
            description: 'Concurrency when fetching',
            default: 30,
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
        transformer: commandFlags.string({
            char: 'T',
            description: 'Transformer module or path',
            multiple: true,
        }),
    };

    async run(): Promise<void> {
        const {
            args: {
                fileId,
            },
            flags: {
                fileVersion,
                page,
                output,
                concurrency,
                outputter = [],
                transformer = [],
            },
        } = this.parse(ComponentsCommand);

        spinner.info(`Exporting ${fileId} with [${transformer.join(', ')}] as [${outputter.join(', ')}]`);

        spinner.start();

        figmaExport.components({
            fileId,
            version: fileVersion,
            concurrency,
            token: process.env.FIGMA_TOKEN || '',
            onlyFromPages: page,
            transformers: requirePackages<FigmaExport.StringTransformer>(transformer),
            outputters: requirePackages<FigmaExport.ComponentOutputter>(outputter, { output }),
            log: (message: string) => { spinner.text = message; },
        }).then(() => {
            spinner.succeed('done');
        }).catch((error: Error) => {
            spinner.fail();

            // eslint-disable-next-line no-console
            console.error(error);
        });
    }
}
