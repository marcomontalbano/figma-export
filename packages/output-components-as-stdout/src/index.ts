/* eslint-disable no-console */

import { FigmaExport } from '@figma-export/types';

export = (): FigmaExport.Outputter => {
    return async (pages): Promise<void> => {
        console.log(JSON.stringify(pages));
    };
};
