module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        mocha: true,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    extends: [
        'airbnb-base',
    ],
    plugins: [
        'chai-friendly',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        expect: true,
        sinon: true,
        chai: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'max-len': ['error', 140],
        'no-unused-expressions': 'off',
        'chai-friendly/no-unused-expressions': 'error',
        'arrow-body-style': 'off',
        'import/extensions': [
            'error',
            'always',
            {
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
    overrides: [
        {
            files: ['**.ts'],
            parser: '@typescript-eslint/parser',
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:import/errors',
                'plugin:import/warnings',
                'plugin:import/typescript',
            ],
            plugins: [
                '@typescript-eslint',
            ],
            rules: {
                'import/order': 'off',

                'import/no-unresolved': 'off',

                'import/prefer-default-export': 'off',
            },
        },
        {
            files: ['**.test.ts'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'import/no-relative-packages': 'off',
            },
        },
    ],
};
