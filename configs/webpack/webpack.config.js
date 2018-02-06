const path    = require('path');
const merge   = require('webpack-merge');

const video   = require('./rules/video');
const json    = require('./rules/json');
const img     = require('./rules/img');
const fonts   = require('./rules/fonts');
const cssDev  = require('./rules/scss.css.dev'); 
const cssProd = require('./rules/scss.css.prod');
const jsDev   = require('./rules/js.dev');
const jsProd  = require('./rules/js.prod');

const PATHS = {
    js: path.join(__dirname, '../../src/js/index.js'),
    scss: path.join(__dirname, '../../src/scss/index.scss'),
    output: path.join(__dirname, '../../public/js')
};

const common = merge([
    {
        entry: {
            main: [
                PATHS.js,
                PATHS.scss,
            ]
        },

        output: {
            path: PATHS.output,
            filename: 'build.js'
        },
    },

    // rules with plugins
    fonts(),
    img(),
    json(),
    video(),
]);

module.exports = function(env) {
    if (env === 'production'){
        return merge([
            common,
            jsProd(),
            cssProd(),
        ]);
    }

    if (env === 'development'){
        return merge([
            common,
            jsDev(),
            cssDev(),
        ]);
    }
};