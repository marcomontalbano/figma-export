const SVGO = require('svgo');

module.exports = ({ configs }) => {
    const svgo = new SVGO(configs);
    return async (svg) => (await svgo.optimize(svg)).data;
};
