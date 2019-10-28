const Figma = require('figma-js');

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

const fileSvgs = async (fileId, ids, svgTransformers = []) => {
    const images = await fileImages(fileId, ids);
    const svgPromises = Object.entries(images).map(async ([id, url]) => {
        const svg = await utils.fetchAsSvgXml(url);
        const svgTransformed = await utils.promiseSequentially(svgTransformers, svg);

        return [id, svgTransformed];
    });

    const svgs = await Promise.all(svgPromises);

    return utils.fromEntries(svgs);
};

const constructFromString = (objects, configFile, baseOptions = {}) => {
    const configPath = path.resolve(configFile);

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const { configs = {} } = fs.existsSync(configPath) ? require(configPath) : {};

    return objects.map((pkg) => {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        return require(pkg.path)({
            ...baseOptions,
            configs: configs[pkg.name],
        });
    });
};

const enrichPagesWithSvg = async (pages, fileId, transformerFactories) => {
    const componentIds = utils.getIdsFromPages(pages);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    const svgs = await fileSvgs(fileId, componentIds, transformerFactories);

    return pages.map((page) => ({
        ...page,
        components: page.components.map((component) => ({
            ...component,
            svg: svgs[component.id],
        })),
    }));
};

const exportComponents = async (fileId, {
    output = '',
    configFile,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = () => { },
} = {}) => {
    const transformerFactories = constructFromString(transformers, configFile);
    const outputterFactories = constructFromString(outputters, configFile, { output });

    if (!client) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    log('fetching document');
    const { data: { document } = {} } = await client.file(fileId);

    const pages = utils.getPages(document, { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await enrichPagesWithSvg(pages, fileId, transformerFactories);

    await Promise.all(outputterFactories.map((outputter) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};

module.exports = {
    exportComponents,
    setToken,
};
