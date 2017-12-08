'use strict';

const path    = require('path');
const globby  = require('globby');

// Create the webpack entries object.
const entries = pattern => globby.sync(pattern)
    .reduce((files, f) => {
        let file = path.basename(f, '.js');
        files[file] = path.resolve(f);
        return files;
    }, {});

const globDefineFiles = pattern => globby.sync(pattern)
    .reduce((files, f) => {
        let cmp = path.basename(path.parse(f).dir);
        files[cmp] = f.replace(/^src\/app/, '.').replace(/.js$/, '');
        return files;
    }, {});

module.exports = () => {
    return {
        env: "development",
        entries: entries("src/app/*.js"),
        defines: {
            "global": "window",
            restAPI: JSON.stringify(process.env.REST_API_URL || "http://demo3914762.mockable.io"),
            allInitialStates: JSON.stringify(globDefineFiles('src/app/components/**/state.js')),
            allRoutes: JSON.stringify(globDefineFiles('src/app/components/**/route.js')),
            allActions: JSON.stringify(globDefineFiles('src/app/components/**/actions.js')),
            allActionTypes: JSON.stringify(globDefineFiles('src/app/components/**/actionTypes.js')),
            allServices: JSON.stringify(globDefineFiles('src/app/components/**/services.js')),
            allReducers: JSON.stringify(globDefineFiles('src/app/components/**/reducers.js')),
        },
        browsers: "last 1 version",
        port: {
            browsersync: 3030,
        },
        watch: {
            js: [
                "src/app/**/*",
            ],
            markup: [
                "src/**/*.html",
                "src/assets/style/**/*.css"
            ],
            style: [
                "src/assets/style/**/*.less",
                "src/assets/style/**/*.scss",
            ],
            assets: [
                "src/assets/**/*",
                "!{src/assets/style,src/assets/style/**}",
                "!{src/assets/js,src/assets/js/**}"
            ],
        },
        src: {
            js: [
                "src/app/**/*",
            ],
            markup: [
                "src/**/*.html",
            ],
            style: [
                "src/assets/style/*.scss"
            ],
            assets: [
                "src/assets/**/*",
                "!{src/assets/style,src/assets/style/**}",
                "!{src/assets/js,src/assets/js/**}"
            ],
            includes: "./node_modules",
            appdir: path.resolve(__dirname, 'src/app'),
            rootdir: path.resolve(__dirname),
        },
        dest: {
            dist: 'dist',
            js: 'dist/assets/js',
            markup: 'dist',
            style: 'dist/assets/style',
            assets: 'dist/assets',
        },
    };
};
