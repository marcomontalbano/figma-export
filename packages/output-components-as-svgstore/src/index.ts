import makeDir from 'make-dir';
import svgstore from 'svgstore';

import { FigmaExport } from '@figma-export/types';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    options?: {};
    getIconId?: (options: FigmaExport.OutputterParamOption) => string;
}

export = ({
    output,
    getIconId = (options): string => `${options.pageName}/${options.componentName}`,
    options = {},
}: Options): FigmaExport.Outputter => {
    makeDir.sync(output);
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            const sprites = svgstore(options);

            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const opts = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                sprites.add(getIconId(opts), svg);
            });

            const filePath = path.resolve(output, `${pageName}.svg`);
            fs.writeFileSync(filePath, sprites);
        });
    };
};
