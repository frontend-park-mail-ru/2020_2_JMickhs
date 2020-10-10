// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line no-undef
module.exports = {
    mode: 'development',
    entry: './public/js/app.js',
    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
        publicPath: '../',
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader',
                    // eslint-disable-next-line no-undef
                    options: {helperDirs: path.resolve(__dirname, './public/js/helpers/handlebars-helpers')},
                }],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HostelScan',
            filename: 'index.html',
            template: './public/template.html',
            entryPoint: 'app',
            css: '../styles.css',
        }),
    ],


};