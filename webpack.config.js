const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        bundle: './src/app.ts',
        sw: './src/service-worker/service-worker.ts'
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: (pathData) => {
            return pathData.chunk.name === 'bundle' ? '[name].[chunkhash].js': '[name].js';
        },
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
        plugins: [new TsconfigPathsPlugin()],
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
            filename: 'bundle.[hash].css',
        }),
    ],
};
