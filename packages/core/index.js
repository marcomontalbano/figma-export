const Figma = require('figma-js');
const { produce } = require('immer');

const fs = require('fs');
const path = require('path');

const utils = require('./lib/utils');

let client;

const setToken = (token) => {
    client = Figma.Client({ personalAccessToken: token });
};

const fileImages = async (fileId, ids) => {
    const { data: { images } = {} } = await client.fileImages(fileId, {
        ids,
        format: 'svg',
        svg_include_id: true,
    });

    return images;
};

const fileSvgs = async (fileId, ids, transformers = []) => {
    const images = await fileImages(fileId, ids);
    const svgPromises = Object.entries(images).map(async ([id, url]) => {
        const svg = await utils.fetchAsSvgXml(url);
        const svgTransformed = await utils.promiseSequentially(transformers, svg);

        return [id, svgTransformed];
    });

    const svgs = await Promise.all(svgPromises);

    return utils.fromEntries(svgs);
};

const constructFromString = (type, objs, baseOptions = {}) => utils.toArray(objs).map((basePath) => {
    const absolutePath = fs.existsSync(basePath) ? basePath : require.resolve(basePath);
    const configBasename = `.${path.basename(absolutePath).replace('.js', '.json')}`;
    const configPath = path.resolve(configBasename);
    const options = fs.existsSync(configPath) ? {
        ...baseOptions,
        // eslint-disable-next-line import/no-dynamic-require, global-require
        ...require(configPath),
    } : baseOptions;

    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(absolutePath)(options);
});

const exportComponents = async (fileId, {
    output = '',
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = () => { },
} = {}) => {
    const transformerFactories = constructFromString('transform', transformers);
    const outputterFactories = constructFromString('output', outputters, { output });

    if (!client) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    log('fetching document');

    const { data: { document } = {} } = await client.file(fileId);

    const pages = utils.getPages(document, { only: onlyFromPages });

    const componentIds = utils.getIdsFromPages(pages);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    log('fetching components');
    const svgs = await fileSvgs(fileId, componentIds, transformerFactories);

    const svgsByPages = produce(pages, (draft) => {
        Object.entries(pages).forEach(([pageName, components]) => {
            Object.entries(components).forEach(([componentName, component]) => {
                // eslint-disable-next-line no-param-reassign
                draft[pageName][componentName].svg = svgs[component.id];
            });
        });
    });

    await Promise.all(outputterFactories.map((outputter) => outputter(svgsByPages)));

    return svgsByPages;
};

module.exports = {
    exportComponents,
    setToken,
};
