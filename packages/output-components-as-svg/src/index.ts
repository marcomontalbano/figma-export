import fs from 'fs';
import path from 'path';
import makeDir from 'make-dir';

import {
    OutputComponentsAsSvgOptionType,
    TransformerType,
} from './types';

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getBasename = (options): string => `${options.basename}.svg`,
}: OutputComponentsAsSvgOptionType): TransformerType => {
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const filePath = makeDir.sync(path.resolve(output, getDirname(options)));
                fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
            });
        });
    };
};