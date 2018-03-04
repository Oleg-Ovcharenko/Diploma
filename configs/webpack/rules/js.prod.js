const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.js$/, 
                    exclude: /node_modules/, 
                    loader: "babel-loader"
                }
            ]
        },
        plugins: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true,
                    },
                    output: {
                        comments: false,
                    },
                },
            }),
            new webpack.HashedModuleIdsPlugin(),
        ],
    };
};
