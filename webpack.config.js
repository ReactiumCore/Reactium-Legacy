'use strict';

const path              = require('path');
const webpack           = require('webpack');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

module.exports = (config) => {
    let plugins    = [];
    let tools      = '';
    let env        = config.env || 'production';

    if (env !== 'development') {
        plugins.push(new UglifyJSPlugin());
    } else {
        tools = 'source-map';
    }

    config.defines['process.env'] = {
        NODE_ENV: JSON.stringify(env)
    };

    plugins.push(new webpack.DefinePlugin(config.defines));

    return {
        target: 'web',
        entry: config.entries,
        resolve: {
            alias: {
                appdir: config.src.appdir,
                rootdir: config.src.rootdir,
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
                        presets    : ['react', ['env', {
                            targets: {
                                browsers: [config.browsers],
                            },
                        }]],
                        plugins    : ['transform-object-rest-spread'],
                    }
                }
            ]
        }
    };
};
