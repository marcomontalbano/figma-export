
const toArray = (any = []) => (Array.isArray(any) ? any : [any]);

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

const getComponents = (children = []) => {
    let components = {};

    children.forEach((child) => {
        if (child.type === 'COMPONENT') {
            components[child.name] = child;
            return;
        }

        components = { ...components, ...getComponents(child.children) };
    });

    return components;
};

const getPages = (document, options = {}) => {
    const only = toArray(options.only);

    return document.children.reduce((accumulator, page) => {
        if (only.length === 0 || (only.length === 1 && only[0] === '') || only.includes(page.name)) {
            accumulator[page.name] = getComponents(page.children);
        }
        return accumulator;
    }, {});
};

module.exports = {
    toArray,
    promiseSequentially,
    combineKeysAndValuesIntoObject,
    getComponents,
    getPages,
};
