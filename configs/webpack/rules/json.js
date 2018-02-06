module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.json$/,
                    use: [{
                        loader: 'url-loader',
                    }]
                }
            ]
        }
    };
};