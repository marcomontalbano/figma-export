import { Ora } from 'ora';
import { Sade } from 'sade';

import * as figmaExport from '@figma-export/core';
import * as FigmaExport from '@figma-export/types';

import { asArray, requirePackages } from '../utils';

export const addStyles = (prog: Sade, spinner: Ora) => prog
    .command('styles <fileId>')
    .describe('Export styles from a Figma file.')
    .option('-O, --outputter', 'Outputter module or path')
    .option('-o, --output', 'Output directory', 'output')
    .option('-p, --page', 'Figma page names (all pages when not specified)')
    .option('--fileVersion', `A specific version ID to get. Omitting this will get the current version of the file.
                         https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history`)
    .example('styles fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-styles-as-css')
    .action(
        (fileId, {
            fileVersion,
            output,
            ...opts
        }) => {
            const outputter = asArray<string>(opts.outputter);
            const page = asArray<string>(opts.page);

            spinner.info(`Exporting ${fileId} as [${outputter.join(', ')}]`);

            spinner.start();

            figmaExport.styles({
                fileId,
                version: fileVersion,
                token: process.env.FIGMA_TOKEN || '',
                onlyFromPages: page,
                outputters: requirePackages<FigmaExport.StyleOutputter>(outputter, { output }),

                // eslint-disable-next-line no-param-reassign
                log: (message: string) => { spinner.text = message; },
            }).then(() => {
                spinner.succeed('done');
            }).catch((error: Error) => {
                spinner.fail();

                // eslint-disable-next-line no-console
                console.log(error);
            });
        },
    );
