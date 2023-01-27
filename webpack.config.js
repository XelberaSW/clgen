const webpack = require('webpack');
const ShebangPlugin = require('webpack-shebang-plugin');

const config = {
    mode: 'development',
    entry: './src/index.ts',
    target: 'node',
    resolve: {
        extensions: ['.ts', '.json', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            include: /src/,
            use: [{
                loader: 'ts-loader'
            }]
        }, {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false
            }
        }]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'index.js'
    }
};


module.exports = (env, argv) => {
    if (argv.mode === 'development') { }

    if (argv.mode === 'production') {

    }

    config.plugins = [
        // ...other webpack plugins

        new ShebangPlugin({
            chmod: 0o755,
        })

        // ...other webpack plugins
    ];


    return config;
};
