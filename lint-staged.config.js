module.exports = {
    '!(*.d).{js,ts}': () => ['yarn lint --fix', 'yarn coverage'],
};
