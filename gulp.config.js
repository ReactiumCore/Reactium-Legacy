'use strict';

const fs      = require('fs');
const path    = require('path');
const slug    = require('slug');


// Scan src .js files and return them as an object
const entries = () => {
    let obj    = {};
    let src    = __dirname + '/src/app';

    fs.readdirSync(src, 'utf8').forEach((file) => {
        let farr = file.split('.');
        let ext = String(farr.pop()).toLowerCase();
        if (ext !== 'js') { return; }

        let name = slug(farr.join('-'));

        obj[name] = path.resolve(__dirname, `src/app/${file}`);
    });

    return obj;
};

module.exports = () => {
    return {
        env: 'development',
        entries: entries(),
        dist: 'dist',
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
            includes: "./node_modules"
        },
        dest: {
            js: 'dist/assets/js',
            markup: 'dist',
            style: 'dist/assets/style',
            assets: 'dist/assets',
        },
    };
};