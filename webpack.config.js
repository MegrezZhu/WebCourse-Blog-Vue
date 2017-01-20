let webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: './app/src/main.js',
    output: {
        path: path.resolve(__dirname, './app/public'),
        publicPath: './',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },

    resolve: {
        extenstions: ['', '.js', '.vue', '.css'],
        alias: {
            'muse-components': 'muse-ui',
            'vue': 'vue/dist/vue.common.js',
            'vue-router': 'vue-router/dist/vue-router.common.js'
        }
    }
};