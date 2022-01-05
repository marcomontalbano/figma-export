import { Ora } from 'ora';
import { Sade } from 'sade';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { asArray, requirePackages } from '../utils';

export const addComponents = (prog: Sade, spinner: Ora) => prog
    .command('components <fileId>')
    .describe('Export components from a Figma file.')
    .option('-O, --outputter', 'Outputter module or path')
    .option('-T, --transformer', 'Transformer module or path')
    .option('-c, --concurrency', 'Concurrency when fetching', 30)
    .option('-o, --output', 'Output directory', 'output')
    .option('-p, --page', 'Figma page names (all pages when not specified)')
    .option('--fileVersion', `A specific version ID to get. Omitting this will get the current version of the file.
                         https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history`)
    .example('components fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-components-as-svg')
    .action<[string]>(
        (fileId, {
            fileVersion,
            concurrency,
            output,
            ...opts
        }) => {
            const outputter = asArray<string>(opts.outputter);
            const transformer = asArray<string>(opts.transformer);
            const page = asArray<string>(opts.page);

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

                // eslint-disable-next-line no-param-reassign
                log: (message: string) => { spinner.text = message; },
            }).then(() => {
                spinner.succeed('done');
            }).catch((error: Error) => {
                spinner.fail();

                // eslint-disable-next-line no-console
                console.error(error);
            });
        },
    );
