import type * as FigmaExport from '@figma-export/types';

export const toArray = <T>(any: T | T[]): T[] =>
  Array.isArray(any) ? any : [any];

export const emptySvg = '<svg></svg>';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fromEntries = (iterable: any[][]): { [key: string]: any } => {
  return [...iterable].reduce((obj: { [key: string]: unknown }, [key, val]) => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = val;
    return obj;
  }, {});
};

export const promiseSequentially = (
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  promiseFactories: Function[],
  initialValue: unknown,
): Promise<unknown> => {
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

  return fetch(url, {
    headers: {
      'Content-Type': 'images/svg+xml',
    },
  })
    .then((response) => response.text())
    .then((text) => {
      if (text.length === 0) {
        return emptySvg;
      }

      return text;
    })
    .catch((error: Error) => {
      throw new Error(`while fetching svg "${url}": ${error.message}`);
    });
};

/**
 * Check whether the provided value is `undefined` or `null`. It this case it will return `false`.
 *
 * Useful when you need to exclude nullish values from a list.
 * @example [23, null, null, 'John', undefined].filter(notNullish) //= [23, 'John']
 */
export const notNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Check whether the given string is not empty.
 *
 * Useful when you need to exclude empty strings from a list.
 * @example ['', 'John'].filter(notEmptyString) //= ['John']
 */
export function notEmptyString(value: string): boolean {
  return value.trim() !== '';
}

export type PickOption<
  T extends FigmaExport.ComponentsCommand | FigmaExport.StylesCommand,
  K extends keyof Parameters<T>[0],
> = Pick<Parameters<T>[0], K>;

/**
 * Sanitize an array by converting it to a not nullish and not empty string array.
 */
export function forceArray(maybeArray: string[] | undefined) {
  return (maybeArray ?? []).filter((v) => notNullish(v) && notEmptyString(v));
}
