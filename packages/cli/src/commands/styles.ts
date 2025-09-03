import * as figmaExport from '@figma-export/core';
import type * as FigmaExport from '@figma-export/types';
import type { Ora } from 'ora';
import type { Sade } from 'sade';

import { asArray, requirePackages } from '../utils.js';

export const addStyles = (prog: Sade, spinner: Ora) =>
  prog
    .command('styles <fileId>')
    .describe('Export styles from a Figma file.')
    .option('-O, --outputter', 'Outputter module or path')
    .option('-o, --output', 'Output directory', 'output')
    .option('-i, --ids', 'Figma node IDs (`--page` is always ignored when set)')
    .option(
      '-p, --page',
      'Figma page names or IDs (all pages when not specified)',
    )
    .option(
      '--fileVersion',
      `A specific version ID to get. Omitting this will get the current version of the file.
                         https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history`,
    )
    .example(
      'styles fzYhvQpqwhZDUImRz431Qo -O @figma-export/output-styles-as-css',
    )
    .action(async (fileId, { fileVersion, output, ...opts }) => {
      const outputter = asArray<string>(opts.outputter);
      const ids = asArray<string>(opts.ids);
      const page = asArray<string>(opts.page);

      spinner.info(`Exporting ${fileId} as [${outputter.join(', ')}]`);

      spinner.start();

      figmaExport
        .styles({
          fileId,
          version: fileVersion,
          token: process.env.FIGMA_TOKEN || '',
          ids,
          onlyFromPages: page,
          outputters: await requirePackages<FigmaExport.StyleOutputter>(
            outputter,
            { output },
          ),

          // eslint-disable-next-line no-param-reassign
          log: (message: string) => {
            spinner.text = message;
          },
        })
        .then(() => {
          spinner.succeed('done');
        })
        .catch((error: Error) => {
          spinner.fail();

          // eslint-disable-next-line no-console
          console.log(error);
        });
    });
