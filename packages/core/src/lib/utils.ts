import axios from 'axios';

export const toArray = <T>(any: T): T[] => (Array.isArray(any) ? any : [any]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromEntries = (iterable: any[][]): { [key: string]: any } => {
    return [...iterable].reduce((obj: { [key: string]: unknown }, [key, val]) => {
        // eslint-disable-next-line no-param-reassign
        obj[key] = val;
        return obj;
    }, {});
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const promiseSequentially = (promiseFactories: Function[], initialValue: unknown): Promise<unknown> => {
    const promise = promiseFactories.reduce((previousPromise, promiseFactory) => {
        return previousPromise.then((value) => promiseFactory(value));
    }, Promise.resolve(initialValue));

    return promise;
};

export const chunk = <T>(array: T[], perChunk: number): T[][] => {
    return array.reduce((all: T[][], one, i) => {
        const ch = Math.floor(i / perChunk);

        // eslint-disable-next-line no-param-reassign
        all[ch] = [...(all[ch] || []), one];
        return all;
    }, []);
};

export const fetchAsSvgXml = (url: string): Promise<string> => {
    if (!/https?:\/\/.*/.test(url)) {
        throw new TypeError('Only absolute URLs are supported');
    }

    return axios.get(url, {
        headers: {
            'Content-Type': 'images/svg+xml',
        },
    }).then((response) => {
        return response.data;
    }).catch((error: Error) => {
        throw new Error(`while fetching svg "${url}": ${error.message}`);
    });
};

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
    return value !== null && value !== undefined;
};
