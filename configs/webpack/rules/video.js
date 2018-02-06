module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(mp4|webm)$/,
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