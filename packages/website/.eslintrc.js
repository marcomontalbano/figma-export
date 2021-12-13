module.exports = {
    extends: [
        'airbnb',
        'plugin:react/jsx-runtime'
    ],
    rules: {
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'max-len': ['error', 160],
        'comma-dangle': 'off',
        'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
        'react/jsx-one-expression-per-line': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off'
    },
    globals: {
        document: 'readonly'
    }
};
