const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1,
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                config: {
                                    path: path.join(__dirname, '../../postcss_dev/postcss.config.js'),
                                }
                            } 
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }]
                    })
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    sourceMap: true,
                                    importLoaders: 1,
                                }
                            }
                        ]
                    })
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin("style.css"),
        ]
    };
};