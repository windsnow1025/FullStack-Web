const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        "index": "./public/js/index.js",
        "markdown": "./public/js/markdown.js",
        "account": "./public/js/account.js",
        "message-transmitter": "./public/js/message-transmitter.js",
        "gpt": "./public/js/gpt.js",
        "bookmarks": "./public/js/bookmarks.js",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};