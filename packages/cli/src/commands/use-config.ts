import { Ora } from 'ora';
import { Sade } from 'sade';

import fs from 'fs';
import path from 'path';

import * as figmaExport from '@figma-export/core';

import {
    ComponentsCommand,
    StylesCommand,
    FigmaExportRC,
    BaseCommandOptions,
} from '@figma-export/types';

export const addUseConfig = (prog: Sade, spinner: Ora) => prog
    .command('use-config [configFile]', undefined)
    .describe('Export using a configuration file.')
    .example('use-config')
    .example('use-config ./figmaexportrc.production.js')
    .action(
        async (configFile = '.figmaexportrc.js') => {
            const configPath = path.resolve(configFile);

            if (!fs.existsSync(configPath)) {
                throw new Error(`Cannot find the configuration file at '${configPath}'`);
            }

            import(configPath).then((m) => m.default as FigmaExportRC).then((({ commands }) => {
                const baseCommandOptions: BaseCommandOptions = {
                    token: process.env.FIGMA_TOKEN || '',

                    // eslint-disable-next-line no-param-reassign
                    log: (message: string) => { spinner.text = message; },
                };

                const commandPromises = commands.map((command) => {
                    switch (command[0]) {
                        case 'components':
                            return async () => {
                                await figmaExport.components({ ...baseCommandOptions, ...command[1] });
                                spinner.succeed().start();
                            };
                        case 'styles':
                            return async () => {
                                await figmaExport.styles({ ...baseCommandOptions, ...command[1] });
                                spinner.succeed().start();
                            };
                        default:
                            throw new Error(`Command ${command[0]} is not found.`);
                    }
                });

                spinner.start();

                commandPromises.reduce(
                    (actualPromise, nextPromise) => actualPromise.finally(nextPromise),
                    Promise.resolve() as unknown as ReturnType<ComponentsCommand> | ReturnType<StylesCommand>,
                ).then(() => {
                    spinner.succeed('done');
                }).catch((error: Error) => {
                    spinner.fail();

                    // eslint-disable-next-line no-console
                    console.error(error);
                });
            }));
        },
    );
