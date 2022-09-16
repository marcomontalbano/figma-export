module.exports = {
    root: true,
    extends: 'next',
    'settings': {
        'next': {
            'rootDir': 'packages/website/'
        }
    },
    'rules': {
        '@next/next/no-img-element': 'off',
        '@next/next/no-css-tags': 'off'
    }
};
