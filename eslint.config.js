const airbnbBase = require('eslint-config-airbnb-base');
const prettier = require('prettier');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.commonjs,
                ...globals.es2021,
                ...globals.node,
                ...globals.jest,
                jest: true,
                describe: true,
                it: true,
                expect: true,
                beforeEach: true,
                afterEach: true,
            },
        },
        plugins: {
            jest: jestPlugin,
            prettier: prettier,
            airbnbBase,
        },
        files: ['**/*.js', '**/*.ts'],
        rules: {
            'jest/expect-expect': 'error',
        },
    },
];
