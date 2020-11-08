const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        bundle: './src/app.ts',
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name].[chunkhash].js',
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
                use:  [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
              }
        ],
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@home': path.resolve(__dirname, 'src/components/home'),
            '@hostel': path.resolve(__dirname, 'src/components/hostel'),
            '@list': path.resolve(__dirname, 'src/components/listHostel'),
            '@navbar': path.resolve(__dirname, 'src/components/navbar'),
            '@pageError': path.resolve(__dirname, 'src/components/pageError'),
            '@profile': path.resolve(__dirname, 'src/components/profile'),
            '@search': path.resolve(__dirname, 'src/components/search'),
            '@sign': path.resolve(__dirname, 'src/components/sign'),
            '@css': path.resolve(__dirname, 'src/css'),
            '@eventBus': path.resolve(__dirname, 'src/helpers/eventbus'),
            '@network': path.resolve(__dirname, 'src/helpers/network'),
            '@router': path.resolve(__dirname, 'src/helpers/router'),
            '@validator': path.resolve(__dirname, 'src/helpers/validator'),
            '@user': path.resolve(__dirname, 'src/helpers/user'),
            '@interfaces': path.resolve(__dirname, 'src/helpers/interfaces'),
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
            filename: 'bundle.[hash].css',
        }),
    ],
};
