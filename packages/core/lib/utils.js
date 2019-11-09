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

module.exports = {
    toArray,
    fromEntries,
    promiseSequentially,
    fetchAsSvgXml,
};
