module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png|gif)$/,
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