import { optimize, Config } from 'svgo';

import * as FigmaExport from '@figma-export/types';

export = (options: Config): FigmaExport.StringTransformer => {
    return async (svg) => {
        try {
            const result = optimize(svg, options);

            if (!('data' in result)) {
                return undefined;
            }

            return result.data;
        } catch (error) {
            return undefined;
        }
    };
};
