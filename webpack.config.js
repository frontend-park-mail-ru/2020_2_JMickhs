const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './public/js/app.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
        publicPath: '../',
    },
    module: {
        rules: [
          {
            test: /\.hbs$/,
            use: [{
              loader: "handlebars-loader",
            }]
          }
        ]
      },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'HostelScan',
            filename: 'index.html',
            template: './public/template.html',
            entryPoint: 'app',
            css: '../styles.css'
        }),
    ],


};