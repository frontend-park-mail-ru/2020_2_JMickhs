// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// eslint-disable-next-line no-undef
module.exports = {
    mode: 'development',
    entry: './public/js/app.js',
    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.src',
        publicPath: '../',
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader',
                    // eslint-disable-next-line no-undef
                    options: {helperDirs: path.resolve(__dirname, './public/src/helpers/handlebars-helpers')},
                }],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HostelScan',
            filename: 'index.html',
            template: './public/template.html',
            entryPoint: 'app',
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
    ],
};
