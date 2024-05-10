import { Ora } from 'ora';
import { Sade } from 'sade';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { asArray, asUndefinableArray, requirePackages } from '../utils.js';

export const addComponents = (prog: Sade, spinner: Ora) => prog
    .command('components <fileId>')
    .describe('Export components from a Figma file.')
    .option('-O, --outputter', 'Outputter module or path')
    .option('-T, --transformer', 'Transformer module or path')
    .option('-c, --concurrency', 'Concurrency when fetching', 30)
    .option('-r, --retries', 'Maximum number of retries when fetching fails', 3)
    .option('-o, --output', 'Output directory', 'output')
    .option('-i, --ids', 'Export only these node IDs (`--page` is always ignored when set)')
    .option('-p, --page', 'Figma page names or IDs (all pages when not specified)')
    .option('-t, --types', 'Node types to be exported (COMPONENT or INSTANCE)', 'COMPONENT')
    .option('--fileVersion', `A specific version ID to get. Omitting this will get the current version of the file.
                         https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history`)
    .example('components fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-components-as-svg')
    .example('components fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-components-as-svg -t COMPONENT -t INSTANCE -o dist')
    .example('components fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-components-as-svg -o dist -i 54:22 -i 138:52')
    .action(
        async (fileId, {
            fileVersion,
            concurrency,
            retries,
            output,
            ...opts
        }) => {
            type IncludeTypes = FigmaExport.ComponentsCommandOptions['includeTypes']

            const outputter = asArray<string>(opts.outputter);
            const transformer = asArray<string>(opts.transformer);
            const ids = asArray<string>(opts.ids);
            const page = asArray<string>(opts.page);
            const types = asUndefinableArray<string>(opts.types) as IncludeTypes;

            spinner.info(`Exporting ${fileId} with [${transformer.join(', ')}] as [${outputter.join(', ')}]`);

            spinner.start();

            figmaExport.components({
                fileId,
                version: fileVersion,
                concurrency,
                retries,
                token: process.env.FIGMA_TOKEN || '',
                ids,
                onlyFromPages: page,
                includeTypes: types,
                transformers: await requirePackages<FigmaExport.StringTransformer>(transformer),
                outputters: await requirePackages<FigmaExport.ComponentOutputter>(outputter, { output }),

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
