const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { Template } = require('webpack');


module.exports = {
    mode: 'development',
    entry: './public/js/app.js',    
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'HostelScan',
          filename: './index.html',
          template: './public/template.html',
          entryPoint: 'app',
          css: "styles.css"
        })
    ]
};