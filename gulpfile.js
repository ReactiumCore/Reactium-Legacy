
const del              = require('del');
const path             = require('path');
const gulp             = require('gulp');
const gulpif           = require('gulp-if');
const webpack          = require('webpack');
const runSequence      = require('run-sequence');
const browserSync      = require('browser-sync');
const spa              = require('browser-sync-spa');
const prefix           = require('gulp-autoprefixer');
const sass             = require('gulp-sass');
const csso             = require('gulp-csso');
const sourcemaps       = require('gulp-sourcemaps');
const env              = require('yargs').argv;
const config           = require('./gulp.config')();

// Update config from environment variables
config.port.browsersync = (env.hasOwnProperty('port')) ? env.port : config.port.browsersync;
config.env = (env.hasOwnProperty('environment')) ? env.environment : config.env;

// Set webpack config after environment variables
const webpackConfig    = require('./webpack.config')(config);

// Compile js
gulp.task('scripts', (done) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err());
            done();
            return;
        }

        let result = stats.toJson();

        if (result.errors.length > 0) {
            result.errors.forEach((error) => {
                console.log(error);
            });
            done();
            return;
        }

        if (config.env === 'development') {
            browserSync.reload();
        }

        done();
    });
});

// Sass styles
gulp.task('styles', () => {
    let isDev = (config.env === 'development');

    return gulp.src(config.src.style)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(sass({includePaths: config.src.includes}).on('error', sass.logError))
    .pipe(prefix(config.browsers))
    .pipe(gulpif(!isDev, csso()))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(config.dest.style))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Copy assets
gulp.task('assets', () => {
    let isDev = (config.env === 'development');
    return gulp.src(config.src.assets)
    .pipe(gulp.dest(config.dest.assets))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Copy markup
gulp.task('markup', () => {
    let isDev = (config.env === 'development');
    return gulp.src(config.src.markup)
    .pipe(gulp.dest(config.dest.markup))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Remove all distribution files
gulp.task('clean', (done) => {
    del.sync([config.dest.dist]);
    done();
});

// Server locally
gulp.task('serve', () => {

    let index = '/index.html';
        index = (typeof config.spa === 'string') ? config.spa : index;

    browserSync.use(spa({
        history: {
            index: index,
        }
    }));

    browserSync({
        notify: false,
        timestamps: true,
        server: path.resolve(config.dest.dist),
        startPath: index,
        port: config.port.browsersync,
        logPrefix: '00:00:00',
        ui: {port: config.port.browsersync + 1},
        middleware: [
            (req, res, next) => {
                if (config.spa === true || typeof config.spa === 'string') {
                    let ext = path.extname(index);
                    let reg = new RegExp(ext + '$', "i");
                    if (reg.test(req.url) && req.url !== index) {
                        req.url = index;
                    }
                }

                next();
            },
        ],
    });

    gulp.watch(config.watch.style, ['styles']);
    gulp.watch(config.watch.js, ['scripts']);
    gulp.watch(config.watch.markup, ['markup'], browserSync.reload);
    gulp.watch(config.watch.assets, ['assets'], browserSync.reload);
});

// Build
gulp.task('build', (done) => {
    runSequence(['clean'], ['assets', 'markup'], ['scripts', 'styles'], () => {
        done();
    });
});

// The default task
gulp.task('default', (done) => {
    if (config.env === 'development') {
        runSequence(['build'], () => {
            gulp.start('serve');
            done();
        });
    } else {
        runSequence(['build'], () => {
            done();
        });
    }
});
