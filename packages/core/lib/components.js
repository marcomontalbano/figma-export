const Figma = require('figma-js');

const utils = require('./utils');

const getClient = (token) => {
    const client = Figma.Client({ personalAccessToken: token });

    if (!client) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    return client;
};

const fileImages = async (client, fileId, ids) => {
    const { data: { images } = {} } = await client.fileImages(fileId, {
        ids,
        format: 'svg',
        svg_include_id: true,
    });

    return images;
};

const fileSvgs = async (client, fileId, ids, svgTransformers = []) => {
    const images = await fileImages(client, fileId, ids);
    const svgPromises = Object.entries(images).map(async ([id, url]) => {
        const svg = await utils.fetchAsSvgXml(url);
        const svgTransformed = await utils.promiseSequentially(svgTransformers, svg);

        return [id, svgTransformed];
    });

    const svgs = await Promise.all(svgPromises);

    return utils.fromEntries(svgs);
};

const enrichPagesWithSvg = async (client, fileId, pages, svgTransformers) => {
    const componentIds = utils.getIdsFromPages(pages);

    if (componentIds.length === 0) {
        throw new Error('No components found');
    }

    const svgs = await fileSvgs(client, fileId, componentIds, svgTransformers);

    return pages.map((page) => ({
        ...page,
        components: page.components.map((component) => ({
            ...component,
            svg: svgs[component.id],
        })),
    }));
};

const components = async (fileId, {
    token,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = () => {},
} = {}) => {
    const client = getClient(token);

    log('fetching document');
    const { data: { document } = {} } = await client.file(fileId);

    const pages = utils.getPages(document, { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await enrichPagesWithSvg(client, fileId, pages, transformers);

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};

module.exports = components;
