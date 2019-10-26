const axios = require('axios');

const toArray = (any = []) => (Array.isArray(any) ? any : [any]);

const fromEntries = (iterable) => {
    return [...iterable].reduce((obj, [key, val]) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = val;
        return obj;
    }, {});
};

const promiseSequentially = (promiseFactories, initialValue) => {
    // eslint-disable-next-line arrow-body-style
    const promise = promiseFactories.reduce((previousPromise, promiseFactory) => {
        return previousPromise.then(promiseFactory);
    }, Promise.resolve(initialValue));

    return promise;
};

const combineKeysAndValuesIntoObject = (keys, values) => values.reduce((obj, value, index) => ({
    ...obj,
    [keys[index]]: value,
}), {});

const fetchAsSvgXml = (url) => {
    if (!/https?:\/\/.*/.test(url)) {
        throw new TypeError('Only absolute URLs are supported');
    }

    return axios.get(url, {
        headers: {
            'Content-Type': 'images/svg+xml',
        },
    }).then((response) => response.data);
};

const getComponents = (children = []) => {
    let components = [];

    children.forEach((child) => {
        if (child.type === 'COMPONENT') {
            components.push(child);
            return;
        }

        components = [
            ...components,
            ...getComponents(child.children),
        ];
    });

    return components;
};

const getIdsFromPages = (pages) => pages.reduce((ids, page) => [
    ...ids,
    ...page.components.map((component) => component.id),
], []);

const filterPagesByName = (pages, pageNames = []) => {
    const only = toArray(pageNames).filter((p) => p.length);

    return pages.filter((page) => only.length === 0 || only.includes(page.name));
};

const getPages = (document, options = {}) => {
    const pages = filterPagesByName(document.children, options.only);

    return pages.map((page) => ({
        ...page,
        components: getComponents(page.children),
    }));
};

module.exports = {
    toArray,
    fromEntries,
    promiseSequentially,
    combineKeysAndValuesIntoObject,
    fetchAsSvgXml,
    getComponents,
    getPages,
    getIdsFromPages,
};
