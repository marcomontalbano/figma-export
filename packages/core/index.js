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

const fileImagesToSvgs = async (images, transformers = []) => {
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
    updateStatusMessage = () => { },
} = {}) => {
    const transformerFactories = constructFromString('transform', transformers);
    const outputterFactories = constructFromString('output', outputters, { output });

    if (!client) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    updateStatusMessage('fetching document');

    const { data: { document } = {} } = await client.file(fileId);

    const pages = utils.getPages(document, { only: onlyFromPages });

    const componentIds = Object.values(pages).reduce((ids, components) => [
        ...ids,
        ...Object.values(components).map((component) => component.id),
    ], []);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    updateStatusMessage('fetching components');
    const images = await fileImages(fileId, componentIds);

    updateStatusMessage('fetching svgs');
    const svgs = await fileImagesToSvgs(images, transformerFactories);

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
