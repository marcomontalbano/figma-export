import * as FigmaExport from '@figma-export/types';
import { pascalCase } from '@figma-export/utils';
import svgr from '@svgr/core';
import { Config, State } from './svgr';

import fs = require('fs');
import path = require('path');
import makeDir = require('make-dir');

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getComponentName?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getFileExtension?: (options: FigmaExport.ComponentOutputterParamOption) => string;

    /**
     * SVGR ships with a handful of customizable options, usable in both the CLI and API.
     * https://react-svgr.com/docs/options/
     */
    getSvgrConfig?: (options: FigmaExport.ComponentOutputterParamOption) => Config;
}

type IndexJs = {
    [key: string]: string[];
};

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getComponentName = (options): string => `${pascalCase(options.basename)}`,
    getFileExtension = (): string => '.jsx',
    getSvgrConfig = (): Config => ({ }),
}: Options): FigmaExport.ComponentOutputter => {
    makeDir.sync(output);
    const indexJs: IndexJs = {};
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
                const filePath = makeDir.sync(path.resolve(output, getDirname(options)));

                indexJs[filePath] = indexJs[filePath] || [];
                indexJs[filePath].push(`export { default as ${reactComponentName} } from './${basename}';`);

                const svgrConfig = getSvgrConfig(options);
                const svgrState: State = { componentName: reactComponentName };

                const jsCode = svgr.sync(svg, svgrConfig, svgrState);

                fs.writeFileSync(path.resolve(filePath, basename), jsCode);
            });

            Object.entries(indexJs).forEach(([filePath, exports]) => {
                fs.writeFileSync(path.resolve(filePath, 'index.js'), exports.join('\n'));
            });
        });
    };
};
