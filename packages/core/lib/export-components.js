const figma = require('./figma');

const components = async (fileId, {
    token,
    onlyFromPages = [],
    transformers = [],
    outputters = [],
    log = () => {},
} = {}) => {
    const client = figma.getClient(token);

    log('fetching document');
    const { data: { document } = {} } = await client.file(fileId);

    const pages = figma.getPages(document, { only: onlyFromPages });

    log('fetching components');
    const pagesWithSvg = await figma.enrichPagesWithSvg(client, fileId, pages, transformers);

    await Promise.all(outputters.map((outputter) => outputter(pagesWithSvg)));

    return pagesWithSvg;
};

module.exports = components;
