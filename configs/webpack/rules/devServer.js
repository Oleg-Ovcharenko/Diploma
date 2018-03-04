module.exports = function(paths) {
    return {
        devServer: {
            contentBase: '../../public',
            hot: true,
        },
    };
};