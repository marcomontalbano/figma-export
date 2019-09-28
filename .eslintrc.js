module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'chai-friendly'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    expect: true,
    sinon: true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'indent': ['error', 4],
    'max-len': ['error', 150],
    'no-unused-expressions': 'off',
    'chai-friendly/no-unused-expressions': 'error'
  },
};
