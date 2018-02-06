const path    = require('path');
const extract = require('extract-text-webpack-plugin');

module.exports = function(paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: extract.extract({
                        fallback: 'style-loader',
                        use: [{ 
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.join(__dirname, '../../postcss_prod/postcss.config.js'),
                                }
                            } 
                        }, { 
                            loader: 'sass-loader',
                        }]
                    }),
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: extract.extract({
                        fallback: 'style-loader',
                        use: [{
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.join(__dirname, '../../postcss_prod/postcss.config.js')
                                }
                            }
                        }, {
                            loader: 'css-loader',
                        }]
                    }),
                },
            ],
        },
        plugins: [
            new extract('../../public/css/build.css'),
        ],
    };
};