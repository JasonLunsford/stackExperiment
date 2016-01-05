// Based on Paislee's Healthy-Gulp-Angular project
// https://github.com/paislee/healthy-gulp-angular

var gulp       = require('gulp');
var plugins    = require('gulp-load-plugins')();
var del        = require('del');
var es         = require('event-stream');
var bowerFiles = require('main-bower-files');
var print      = require('gulp-print');
var Q          = require('q');

// == PATH STRINGS ========

var paths = {
    scripts:           'app/**/*.js',
    styles:            ['./app/**/*.css', './app/**/*.scss'],
    images:            './images/**/*',
    index:             './app/index.html',
    partials:          ['app/**/*.html', '!app/index.html'],
    distDev:           './dist.dev',
    distProd:          './dist.prod',
    scriptsDevServer:  'devServer/**/*.js',
    scriptsProdServer: './dist.prod/scripts'
};

// == PIPE SEGMENTS ========

var pipes = {};

pipes.orderedVendorScripts = function() {
    return plugins.order([
        'meteor-runtime-config.js',
        'meteor-client-side.bundle.min.js',
        'ace.js',
        'angular.js',
        'angular-meteor.bundle.min.js',
        'angular-meteor.js',
        'ui-ace.js'
    ]);
};

pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.builtAppScripts = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtAppScriptsProd = function() {
    return pipes.validatedAppScripts()
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtVendorScripts = function() {
    return gulp.src(bowerFiles())
        .pipe(gulp.dest('dist.dev/bower_components'));
};

pipes.builtVendorScriptsProd = function() {
    return gulp.src(bowerFiles())
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.scriptsProdServer));
};

pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtPartials = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtPartialsProd = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distProd));
};

pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "beetleLoop"
        }));
};

pipes.builtStyles = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass({errLogToConsole: true}))
            .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distProd));
};

pipes.processedImages = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDev + '/images/'));
};

pipes.processedImagesProd = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distProd + '/images/'));
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

pipes.builtIndex = function() {

    var orderedVendorScripts = pipes.builtVendorScripts()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScripts()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStyles();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev))
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsProd()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScriptsProd()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd))
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

pipes.builtApp = function() {
    return es.merge(pipes.builtIndex(), pipes.builtPartials(), pipes.processedImages());
};

pipes.builtAppProd = function() {
    return es.merge(pipes.builtIndexProd(), pipes.builtPartialsProd(), pipes.processedImagesProd());
};

// == TASKS ========

// removes all compiled files
gulp.task('clean', function() {
    return del(paths.distDev);
});

gulp.task('clean-prod', function() {
    return del(paths.distProd);
});

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the build environment
gulp.task('build-partials', pipes.builtPartials);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the server scripts
gulp.task('validate-dev-server-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the build environment
gulp.task('build-app-scripts', pipes.builtAppScripts);

// further concatenates & uglifies for Prod
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compiles app sass and moves to the build environment
gulp.task('build-styles', pipes.builtStyles);

// compiles and minifies app sass for Prod
gulp.task('build-styles-prod', pipes.builtStylesProd);

// moves vendor scripts into the build environment
gulp.task('build-vendor-scripts', pipes.builtVendorScripts);

// concatenates, uglifies, and moves vendor scripts for Prod
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the build environment
gulp.task('build-index', pipes.builtIndex);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete environment
gulp.task('build-app', pipes.builtApp);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete environment
gulp.task('clean-build-app', ['clean'], pipes.builtApp);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);

// clean, build, and watch live changes
gulp.task('watch', ['clean-build-app', 'validate-dev-server-scripts'], function() {

    // start nodemon to auto-reload the server
    plugins.nodemon(
        { script: 'server.js',
          ext: 'js',
          watch: ['devServer/'],
          env: {NODE_ENV : 'development'},
          tasks: ['validate-server-scripts']
        })
        .on('restart', function () {
            console.log('[nodemon] restarted Development server');
        });

    // start live-reload server
    plugins.livereload.listen({ start: true });

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndex()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScripts()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.partials, function() {
        return pipes.builtPartials()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStyles()
            .pipe(plugins.livereload());
    });

});

// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['clean-build-app-prod', 'validate-dev-server-scripts'], function() {

    plugins.nodemon(
        { script: 'server.js',
          ext: 'js',
          watch: ['devServer/'],
          env: {NODE_ENV : 'production'},
          tasks: ['validate-server-scripts']
        })
        .on('restart', function () {
            console.log('[nodemon] restarted Production server');
        });

    // start live-reload server
    plugins.livereload.listen({start: true});

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexProd()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch hhtml partials
    gulp.watch(paths.partials, function() {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesProd()
            .pipe(plugins.livereload());
    });

});

// default task builds for prod
gulp.task('start-prod', ['clean-build-app-prod']);