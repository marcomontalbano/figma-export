/* eslint-disable no-console */

import type * as FigmaExport from '@figma-export/types';

export default (): FigmaExport.ComponentOutputter => {
  return async (pages): Promise<void> => {
    console.log(JSON.stringify(pages));
  };
};
