/* eslint-disable no-console */

import * as FigmaExport from '@figma-export/types';

export = (): FigmaExport.ComponentOutputter => {
    return async (pages): Promise<void> => {
        console.log(JSON.stringify(pages));
    };
};
