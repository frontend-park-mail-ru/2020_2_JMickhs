const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    devtool: 'inline-source-map',
    output: {
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
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@basic': path.resolve(__dirname, 'src/components/basic'),
            '@home': path.resolve(__dirname, 'src/components/home'),
            '@hostel': path.resolve(__dirname, 'src/components/hostel'),
            '@list': path.resolve(__dirname, 'src/components/list'),
            '@navbar': path.resolve(__dirname, 'src/components/navbar'),
            '@pageError': path.resolve(__dirname, 'src/components/pageError'),
            '@profile': path.resolve(__dirname, 'src/components/profile'),
            '@search': path.resolve(__dirname, 'src/components/search'),
            '@signin': path.resolve(__dirname, 'src/components/signin'),
            '@signup': path.resolve(__dirname, 'src/components/signup'),
            '@css': path.resolve(__dirname, 'src/css'),
            '@eventBus': path.resolve(__dirname, 'src/helpers/eventbus'),
            '@network': path.resolve(__dirname, 'src/helpers/network'),
            '@router': path.resolve(__dirname, 'src/helpers/router'),
            '@validator': path.resolve(__dirname, 'src/helpers/validator'),
            '@user': path.resolve(__dirname, 'src/helpers/user'),
        },
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
