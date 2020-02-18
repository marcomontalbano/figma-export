import axios from 'axios';

const toArray = (any: any = []): Array<any> => (Array.isArray(any) ? any : [any]);

const fromEntries = (iterable: any[][]): { [key: string]: any } => {
    return [...iterable].reduce((obj: { [key: string]: {} }, [key, val]) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = val;
        return obj;
    }, {});
};

const promiseSequentially = (promiseFactories: Function[], initialValue: any): Promise<any> => {
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
