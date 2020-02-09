
const upperFirst = (str: String) => str.charAt(0).toUpperCase() + str.slice(1);

const lowerFirst = (str: String) => str.charAt(0).toLowerCase() + str.slice(1);

const camelCase = (str: String): String => {
    const words: String[] = str.match(/((\b|)[^\W_]+(\b|))/g);
    return words.reduce((accumulator, word, index) => {
        return `${ accumulator }${ index === 0 ? lowerFirst(word) : upperFirst(word) }`;
    }, '');
};

export { camelCase };
