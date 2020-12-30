var gulp = require("gulp");
var path = require('path');
var merge = require("merge-stream");
var globby = require('globby');
var concat = require('gulp-concat');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');

var bundleConfig = require(path.resolve(__dirname, 'bundles.json'));
var production = false;

var styleEntries = {};
var scriptEntries = {};

function processInputDefinition(input) {
    var result = [];
    for (var i = 0; i < input.length; i++) {
        var url = input[i];
        var longPath = '';
        if (url.startsWith('!')) {
            longPath = '!' + path.resolve(__dirname, url.substring(1));
        } else {
            longPath = path.resolve(__dirname, url);
        }

        longPath = longPath.replace(/\\/g, '/');
        result.push(longPath);
    }

    return result;
}

function fillScriptBundles() {
    // User defined bundles
    for (var k = 0; k < bundleConfig.scripts.length; k++) {
        var scriptBundle = bundleConfig.scripts[k];
        scriptEntries[scriptBundle.output] = globby.sync(processInputDefinition(scriptBundle.input), { noext: true });
    }
}

function fillStyleBundles() {
    // User defined styles
    for (var k = 0; k < bundleConfig.styles.length; k++) {
        var styleBundle = bundleConfig.styles[k];
        styleEntries[styleBundle.output] = globby.sync(processInputDefinition(styleBundle.input), { noext: true });
    }
}

function getFileNameFromPath(path) {
    return path.substring(path.lastIndexOf('/') + 1);
}

function getPathWithoutFileNameFromPath(path) {
    return path.substring(0, path.lastIndexOf('/'));
}

function createScriptBundles() {
    var tasks = [];
    for (var script in scriptEntries) {
        tasks.push(
            createScriptBundle(script)
        );
    }

    return tasks;
}

function createScriptBundle(script) {
    var bundleName = getFileNameFromPath(script);
    var bundlePath = getPathWithoutFileNameFromPath(script);

    var stream = gulp.src(scriptEntries[script]);

    if (production) {
        stream = stream
            .pipe(uglify());
    }

    return stream.pipe(concat(bundleName))
        .pipe(gulp.dest(bundlePath));
}

function createStyleBundles() {
    var tasks = [];
    for (var style in styleEntries) {
        tasks.push(
            createStyleBundle(style)
        );
    }

    return tasks;
}

function createStyleBundle(style) {

    var bundleName = getFileNameFromPath(style);
    var bundlePath = getPathWithoutFileNameFromPath(style);

    var stream = gulp.src(styleEntries[style])
        .pipe(less({ math: 'parens-division' }));

    if (production) {
        stream = stream.pipe(cleanCss());
    }

    return stream
        .pipe(concat(bundleName))
        .pipe(gulp.dest(bundlePath));
}

function build(done) {

    production = true;

    fillScriptBundles();
    fillStyleBundles();

    var scriptTasks = createScriptBundles();
    var styleTasks = createStyleBundles();

    var stream = merge(scriptTasks.concat(styleTasks));

    return !stream.isEmpty() ? stream : done();
}

function buildDev(done) {

    fillScriptBundles();
    fillStyleBundles();

    var scriptTasks = createScriptBundles();
    var styleTasks = createStyleBundles();

    console.log("Dynamic bundles are being created.");

    var stream = merge(scriptTasks.concat(styleTasks));

    return !stream.isEmpty() ? stream : done();
}

exports.build = build;
exports.buildDev = buildDev;