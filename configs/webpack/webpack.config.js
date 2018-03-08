const path      = require('path');
const merge     = require('webpack-merge');
const webpack   = require('webpack'); 

const video     = require('./rules/video');
const json      = require('./rules/json');
const img       = require('./rules/img');
const fonts     = require('./rules/fonts');
const cssDev    = require('./rules/scss.css.dev'); 
const cssProd   = require('./rules/scss.css.prod');
const jsDev     = require('./rules/js.dev');
const jsProd    = require('./rules/js.prod');
const devServer = require('./rules/devServer');


const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
    js: path.join(__dirname, '../../src/js/index.js'),
    scss: path.join(__dirname, '../../src/scss/index.scss'),
    output: path.join(__dirname, '../../public'),
};

const common = merge([
    {
        entry: {
            main: [PATHS.js, PATHS.scss],
        },

        output: {
            path: PATHS.output,
            filename: 'build.js',
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: 'SELF-ORGANIZATION OF SENSOR NETWORKS',
                template: path.join(__dirname, './template.html'),
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ],
    },

    // rules with plugins
    fonts(),
    img(),
    json(),
    video(),
]);

module.exports = function (env) {
    if (env === 'production') {
        return merge([
            {
                mode: 'production',
            },
            common,
            jsProd(),
            cssProd(),
        ]);
    }

    if (env === 'development') {
        return merge([
            {
                mode: 'development',
            },
            common,
            jsDev(),
            cssDev(),
            devServer(),
        ]);
    }
};
