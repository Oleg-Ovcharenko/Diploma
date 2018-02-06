module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        }
                    }]
                }
            ]
        }
    };
};