const webpack = require('webpack');

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
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                output: {
                    comments: false
                }
            }),
            new webpack.HashedModuleIdsPlugin()
        ],
    };
};