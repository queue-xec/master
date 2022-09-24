/* eslint-disable import/no-commonjs */
module.exports = {
    '**/*.(ts|js)': (filenames) => [
        `yarn lint --fix ${filenames.join(' ')}`,
        `yarn format ${filenames.join(' ')}`,
    ],
};
