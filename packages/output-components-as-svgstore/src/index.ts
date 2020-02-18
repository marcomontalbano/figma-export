import fs from 'fs';
import path from 'path';
import makeDir from 'make-dir';
import svgstore from 'svgstore';

import {
    TransformerType,
    OutputComponentsAsSvgstoreOptionType,
} from './types';

export = ({
    output,
    getIconId = (options): string => `${options.pageName}/${options.componentName}`,
    options = {},
}: OutputComponentsAsSvgstoreOptionType): TransformerType => {
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
