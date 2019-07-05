
const toArray = (any = []) => Array.isArray(any) ? any : [any]

const getComponents = (children = [], layers = {}) => {
    children.forEach(child => {
        if (child.type === 'COMPONENT') {
            layers[child.name] = child
        } else {
            layers = { ...layers, ...getComponents(child.children, layers) }
        }
    })

    return layers
}

const getPages = (document, { only = [] } = {}) => {
    only = toArray(only);
    return document.children.reduce((accumulator, page) => {
        if (only.length === 0 || (only.length === 1 && only[0] === '') || only.includes(page.name)) {
            accumulator[page.name] = getComponents(page.children)
        }
        return accumulator
    }, {})
}

const promiseSequentially = (promises, initialValue) => {
    return promises.reduce((previousPromise, promise) => {
        return previousPromise.then(response => promise(response))
    }, Promise.resolve(initialValue));
}

const combineKeysAndValuesIntoObject = (keys, values) => {
    return values.reduce((obj, value, index) => ({
        ...obj,
        [keys[index]]: value
    }), {});
}


module.exports = {
    promiseSequentially,
    toArray,
    getComponents,
    getPages,
    combineKeysAndValuesIntoObject
}
