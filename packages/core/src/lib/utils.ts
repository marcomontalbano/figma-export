import axios from 'axios';

const toArray = <T extends unknown>(any: T): T[] => (Array.isArray(any) ? any : [any]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromEntries = (iterable: any[][]): { [key: string]: any } => {
    return [...iterable].reduce((obj: { [key: string]: unknown }, [key, val]) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = val;
        return obj;
    }, {});
};

// eslint-disable-next-line @typescript-eslint/ban-types
const promiseSequentially = (promiseFactories: Function[], initialValue: unknown): Promise<unknown> => {
    const promise = promiseFactories.reduce((previousPromise, promiseFactory) => {
        return previousPromise.then((value) => promiseFactory(value));
    }, Promise.resolve(initialValue));

    return promise;
};

const fetchAsSvgXml = (url: string): Promise<string> => {
    if (!/https?:\/\/.*/.test(url)) {
        throw new TypeError('Only absolute URLs are supported');
    }

    return axios.get(url, {
        headers: {
            'Content-Type': 'images/svg+xml',
        },
    }).then((response) => response.data);
};

export {
    toArray,
    fromEntries,
    promiseSequentially,
    fetchAsSvgXml,
};
