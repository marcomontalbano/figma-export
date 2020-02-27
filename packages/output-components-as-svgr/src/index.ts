
import { FigmaExport } from '@figma-export/types';
import { pascalCase } from '@figma-export/output-components-utils';
import svgr from '@svgr/core';

import fs = require('fs');
import path = require('path');
import makeDir = require('make-dir');

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.OutputterParamOption) => string;
    getComponentName?: (options: FigmaExport.OutputterParamOption) => string;
    getFileExtension?: (options: FigmaExport.OutputterParamOption) => string;
    getSvgrConfig?: (options: FigmaExport.OutputterParamOption) => svgr.config;
}

type IndexJs = {
    [key: string]: string[];
};

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getComponentName = (options): string => `${pascalCase(options.basename)}`,
    getFileExtension = (): string => '.jsx',
    getSvgrConfig = (): svgr.config => ({}),
}: Options): FigmaExport.Outputter => {
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
                const svgrState = { componentName: reactComponentName };

                const jsCode = svgr.sync(svg, svgrConfig, svgrState);

                fs.writeFileSync(path.resolve(filePath, basename), jsCode);
            });

            Object.entries(indexJs).forEach(([filePath, exports]) => {
                fs.writeFileSync(path.resolve(filePath, 'index.js'), exports.join('\n'));
            });
        });
    };
};
