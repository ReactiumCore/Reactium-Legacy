'use strict';

const path              = require('path');
const webpack           = require('webpack');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

module.exports = (config) => {
    let plugins    = [];
    let tools      = '';

    if (!config.env) {
        plugins.push(new UglifyJSPlugin());
    } else {
        tools = 'source-map';
    }

    let env = config.env || 'production';

    config.defines['process.env'] = {
        NODE_ENV: JSON.stringify(env)
    };

    plugins.push(new webpack.DefinePlugin(config.defines));

    return {
        target: 'node',
        entry: config.entries,
        resolve: {
            alias: {
                appdir: path.resolve(__dirname, 'src/app'),
                rootdir: path.resolve(__dirname)
            }
        },
        output:  {
            path: path.resolve(__dirname, config.dest.js),
            filename: '[name].js'
        },
        devtool: tools,
        plugins: plugins,
        module:  {
            loaders: [
                {
                    test           : [/\.js$/],
                    loader         : 'babel-loader',
                    exclude        : /node_modules/,
                    query          : {
                        presets    : ['react', 'es2015', 'stage-2'],
                        plugins    : ['transform-object-rest-spread'],
                    }
                }
            ]
        }
    };
};
