import * as FigmaExport from '@figma-export/types';
import { pascalCase } from '@figma-export/utils';
import { transform, type Config, type State } from '@svgr/core';

import fs from 'fs';
import path from 'path';

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getComponentName?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getComponentFilename?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getFileExtension?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getExportTemplate?: (options: FigmaExport.ComponentOutputterParamOption) => string;

    /**
     * SVGR ships with a handful of customizable options, usable in both the CLI and API.
     * https://react-svgr.com/docs/options/
     */
    getSvgrConfig?: (options: FigmaExport.ComponentOutputterParamOption) => Config;
}

type IndexFile = {
    [key: string]: {
        exports: string[]
        ext: string
    };
};

export default ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getComponentName = (options): string => `${pascalCase(options.basename)}`,
    getComponentFilename = (options): string => `${getComponentName(options)}`,
    getFileExtension = (): string => '.jsx',
    getSvgrConfig = (): Config => ({ }),
    getExportTemplate = (options): string => {
        const reactComponentName = getComponentName(options);
        const reactComponentFilename = `${getComponentFilename(options)}${getFileExtension(options)}`;
        return `export { default as ${reactComponentName} } from './${reactComponentFilename}';`;
    },
}: Options): FigmaExport.ComponentOutputter => {
    const indexFile: IndexFile = {};
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const reactComponentName = getComponentName(options);
                const reactComponentFilename = `${getComponentFilename(options)}${getFileExtension(options)}`;
                const filePath = path.resolve(output, getDirname(options));

                fs.mkdirSync(filePath, { recursive: true });

                indexFile[filePath] = indexFile[filePath] || {
                    ext: getFileExtension(options) === '.tsx' ? '.ts' : '.js',
                    exports: [],
                };
                indexFile[filePath].exports.push(getExportTemplate(options));

                const svgrConfig = getSvgrConfig(options);
                const svgrState: State = { componentName: reactComponentName };

                const jsCode = transform.sync(svg, {
                    ...svgrConfig,
                    plugins: [
                        '@svgr/plugin-jsx',
                        ...svgrConfig.plugins?.filter((p) => p !== '@svgr/plugin-jsx') ?? [],
                    ],
                }, svgrState);

                fs.writeFileSync(path.resolve(filePath, reactComponentFilename), jsCode);
            });

            Object.entries(indexFile).forEach(([filePath, index]) => {
                fs.writeFileSync(path.resolve(filePath, `index${index.ext}`), index.exports.join('\n'));
            });
        });
    };
};
