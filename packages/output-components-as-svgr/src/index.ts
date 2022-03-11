import * as FigmaExport from '@figma-export/types';
import { pascalCase } from '@figma-export/utils';
import { transform, Config, State } from '@svgr/core';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getComponentName?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getFileExtension?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getExportTemplate?: (options: FigmaExport.ComponentOutputterParamOption) => string;

    /**
     * SVGR ships with a handful of customizable options, usable in both the CLI and API.
     * https://react-svgr.com/docs/options/
     */
    getSvgrConfig?: (options: FigmaExport.ComponentOutputterParamOption) => Config;
}

type IndexFile = {
    [key: string]: string[];
};

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getComponentName = (options): string => `${pascalCase(options.basename)}`,
    getFileExtension = (): string => '.jsx',
    getSvgrConfig = (): Config => ({ }),
    getExportTemplate = (): string => '',

}: Options): FigmaExport.ComponentOutputter => {
    fs.mkdirSync(output, { recursive: true });
    const indexFile: IndexFile = {};
    const indexFormat = getFileExtension() === '.tsx' ? '.ts' : '.js';
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const reactComponentName = getComponentName(options);
                const basename = `${reactComponentName}${getFileExtension(options)}`;
                const filePath = path.resolve(output, getDirname(options));
                const exportTemplate = getExportTemplate(options) || `export { default as ${reactComponentName} } from './${basename}';`;

                fs.mkdirSync(filePath, { recursive: true });

                indexFile[filePath] = indexFile[filePath] || [];
                indexFile[filePath].push(exportTemplate);

                const svgrConfig = getSvgrConfig(options);
                const svgrState: State = { componentName: reactComponentName };

                const jsCode = transform.sync(svg, svgrConfig, svgrState);

                fs.writeFileSync(path.resolve(filePath, basename), jsCode);
            });

            Object.entries(indexFile).forEach(([filePath, exports]) => {
                fs.writeFileSync(path.resolve(filePath, `index${indexFormat}`), exports.join('\n'));
            });
        });
    };
};
