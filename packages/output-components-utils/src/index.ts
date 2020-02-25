
const upperFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const lowerFirst = (str: string): string => str.charAt(0).toLowerCase() + str.slice(1);

const camelCase = (str: string): string => {
    const words: string[] = str.match(/((\b|)[^\W_]+(\b|))/g) || [];
    return words.reduce((accumulator, word, index) => {
        return `${accumulator}${index === 0 ? lowerFirst(word) : upperFirst(word)}`;
    }, '');
};

export { camelCase };
