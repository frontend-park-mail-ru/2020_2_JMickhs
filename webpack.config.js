const path = require('path');

module.exports = {
    mode: 'development',
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './public')
    }
}