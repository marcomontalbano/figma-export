import * as FigmaExport from '@figma-export/types';

import fs = require('fs');
import path = require('path');

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.ComponentOutputterParamOption) => string;
    getBasename?: (options: FigmaExport.ComponentOutputterParamOption) => string;
}

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getBasename = (options): string => `${options.basename}.svg`,
}: Options): FigmaExport.ComponentOutputter => {
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const filePath = path.resolve(output, getDirname(options));

                fs.mkdirSync(filePath, { recursive: true });
                fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
            });
        });
    };
};
