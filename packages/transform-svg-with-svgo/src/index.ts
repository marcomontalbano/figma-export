import SVGO from 'svgo';

import { StringTransformer } from './types';

module.exports = (options: {}): StringTransformer => {
    const svgo = new SVGO(options);
    return async (svg): Promise<string> => {
        return (await svgo.optimize(svg)).data;
    };
};
