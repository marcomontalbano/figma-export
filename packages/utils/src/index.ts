const upperFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const lowerFirst = (str: string): string => str.charAt(0).toLowerCase() + str.slice(1);

/**
 * Remove spaces or punctuation from a string, indicating the separation of words with a single capitalized letter,
 * and the first word starting with lower case.
 *
 * @example "Camel Case" => "camelCase"
 */
const camelCase = (str: string): string => {
    const words: string[] = str.match(/((\b|)[^\W_]+(\b|))/g) || [];
    return words.reduce((accumulator, word, index) => {
        return `${accumulator}${index === 0 ? lowerFirst(word) : upperFirst(word)}`;
    }, '');
};

/**
 * Remove spaces or punctuation from a string, indicating the separation of words with a single capitalized letter,
 * and the first word starting with upper case.
 *
 * @example "Pascal Case" => "PascalCase"
 */
const pascalCase = (str: string): string => upperFirst(camelCase(str));

/**
 * Combines words by replacing all spaces and punctuation with an undescore (_).
 *
 * @example "Snake Case" => "Snake_Case"
 */
const snakeCase = (str: string): string => str.replace(/[\W_]+/g, '_');

/**
 * Combines words by replacing all spaces and punctuation with a dash (-).
 *
 * @example "Kebab Case" => "Kebab-Case"
 */
const kebabCase = (str: string): string => str.replace(/[\W_]+/g, '-');

export {
    camelCase,
    pascalCase,
    snakeCase,
    kebabCase,
};
