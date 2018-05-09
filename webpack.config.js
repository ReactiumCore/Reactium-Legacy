'use strict';

const path              = require('path');
const webpack           = require('webpack');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

module.exports = (config) => {
    let plugins    = [];
    let tools      = '';
    let env        = config.env || 'production';

    if (env !== 'development') {
        //plugins.push(new UglifyJSPlugin());
    } else {
        tools = 'source-map';
    }

    config.defines['process.env'] = {
        NODE_ENV: JSON.stringify(env)
    };

    plugins.push(new webpack.DefinePlugin(config.defines));

    let entries = ['babel-polyfill'];
    entries = entries.concat(Object.values(config.entries));

    return {
        target: 'web',
        entry: entries,
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
            rules: [
                {
                    test: [/.js$/],
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                        }
                    ]
                }
            ]
            // loaders: [
            //     {
            //         test           : [/\.js$/],
            //         loader         : 'babel-loader',
            //         exclude        : /node_modules/,
            //         query          : {
            //             presets    : ['react', 'stage-2', ['env', {
            //                 targets: {
            //                     browsers: [
            //                       "Chrome >= 59",
            //                       "FireFox >= 44",
            //                       "Safari >= 7",
            //                       "Explorer 11",
            //                       "last 4 Edge versions"
            //                     ],
            //                     uglify: true,
            //                 },
            //             }]],
            //             plugins    : [
            //                 'transform-object-rest-spread',
            //             ],
            //         }
            //     }
            // ]
        }
    };
};
