const { basename, dirname } = require('path');

const Figma = require('figma-js');
const utils = require('./utils');

const getComponents = (children = []) => {
    let components = [];

    children.forEach((component) => {
        if (component.type === 'COMPONENT') {
            components.push({
                ...component,
                figmaExport: {
                    dirname: dirname(component.name),
                    basename: basename(component.name),
                },
            });
            return;
        }

        components = [
            ...components,
            ...getComponents(component.children),
        ];
    });

    return components;
};

const getIdsFromPages = (pages) => pages.reduce((ids, page) => [
    ...ids,
    ...page.components.map((component) => component.id),
], []);

const filterPagesByName = (pages, pageNames = []) => {
    const only = utils.toArray(pageNames).filter((p) => p.length);

    return pages.filter((page) => only.length === 0 || only.includes(page.name));
};

const getPages = (document, options = {}) => {
    const pages = filterPagesByName(document.children, options.only);

    return pages.map((page) => ({
        ...page,
        components: getComponents(page.children),
    }));
};

const getClient = (token) => {
    if (!token) {
        throw new Error('\'Access Token\' is missing. https://www.figma.com/developers/docs#authentication');
    }

    return Figma.Client({ personalAccessToken: token });
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
    const componentIds = getIdsFromPages(pages);

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

module.exports = {
    getComponents,
    getPages,
    getIdsFromPages,
    getClient,
    fileImages,
    fileSvgs,
    enrichPagesWithSvg,
};
