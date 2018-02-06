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
        devtool: 'source-map',
    };
};