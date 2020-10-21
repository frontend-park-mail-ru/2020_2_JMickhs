// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// eslint-disable-next-line no-undef
module.exports = {
    mode: 'development',
    entry: './src/app.js',
    devtool: 'inline-source-map',
    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
        publicPath: '../',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'source-map-loader',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
    resolve: {
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HostelScan',
            filename: 'index.html',
            template: './src/template.html',
            entryPoint: 'app',
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
    ],
};
