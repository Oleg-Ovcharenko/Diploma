const webpack   = require('webpack'); 

module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.js$/, 
                    exclude: /node_modules/, 
                    loader: "babel-loader",
                }
            ]
        },
        devtool: 'source-map',
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        ]
    };
};