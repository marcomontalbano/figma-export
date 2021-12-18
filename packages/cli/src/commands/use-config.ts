import { Ora } from 'ora';
import { Sade } from 'sade';

import fs from 'fs';
import path from 'path';

import * as figmaExport from '@figma-export/core';

type FigmaExportCommand = [
    string,
    Record<string, unknown>
];

export const addUseConfig = (prog: Sade, spinner: Ora) => prog
    .command('use-config [configFile]', undefined)
    .describe('Export using a configuration file.')
    .example('use-config')
    .example('use-config ./figmaexportrc.production.js')
    .action(
        (configFile = '.figmaexportrc.js') => {
            const configPath = path.resolve(configFile);

            // eslint-disable-next-line import/no-dynamic-require, global-require
            const { commands = [] } = fs.existsSync(configPath) ? require(configPath) : {};

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const runExport = (figmaExporter: (options: any) => Promise<any>, options: Record<string, unknown>) => figmaExporter({
                token: process.env.FIGMA_TOKEN || '',
                fileId: '',
                ...options,

                // eslint-disable-next-line no-param-reassign
                log: (message: string) => { spinner.text = message; },
            }).then((any) => {
                spinner.succeed().start();
                return any;
            });

            const commandPromises: (() => Promise<any>)[] = commands.map((command: FigmaExportCommand) => {
                const [commandName, options] = command;

                switch (commandName) {
                    case 'components':
                        return () => runExport(figmaExport.components, options);
                    case 'styles':
                        return () => runExport(figmaExport.styles, options);
                    default:
                        throw new Error(`Command ${commandName} is not found.`);
                }
            });

            spinner.start();

            commandPromises.reduce((actualPromise, nextPromise) => {
                return actualPromise.then(nextPromise);
            }, Promise.resolve()).then(() => {
                spinner.succeed('done');
            }).catch((error: Error) => {
                spinner.fail();

                // eslint-disable-next-line no-console
                console.error(error);
            });
        },
    );
