import { Command, flags as commandFlags } from '@oclif/command';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { requirePackages } from '../utils';

import ora = require('ora');

const spinner = ora({});

class ComponentsCommand extends Command {
    async run(): Promise<void> {
        const {
            args: {
                fileId,
            },
            flags: {
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

module.exports = ComponentsCommand;
