module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
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
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        indent: ['error', 4, {
            SwitchCase: 1,
        }],
        'max-len': ['error', 160],
        'no-unused-expressions': 'off',
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
