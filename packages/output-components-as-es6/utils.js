const camelCase = (str) => str.replace(/[\])}]+/g, '').replace(/^([A-Z])|[\s-_([/\\{]+(\w)/g, (match, p1, p2) => {
    if (p2) {
        return p2.toUpperCase();
    }

    return p1.toLowerCase();
});

const getVariableName = (componentName) => {
    const variableName = camelCase(componentName.trim());

    if (/^[\d]+/.test(variableName)) {
        throw new Error(`"${componentName.trim()}" thrown an error: component names cannot start with a number.`);
    }

    return variableName;
};

module.exports = {
    getVariableName,
};
