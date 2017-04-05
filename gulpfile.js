'use strict';

const gulp = require('gulp');
const rollup = require('rollup').rollup;
const connect = require('gulp-connect');
const babel = require('rollup-plugin-babel');
const babelrc = require('babelrc-rollup').default;
const uglify = require('rollup-plugin-uglify');
const jsdoc = require('gulp-jsdoc3');


// ==========================================================
// SERVER
// ==========================================================
gulp.task('serve', () => {
    connect.server({
        root: [
            'demo',
            'dist',
        ],
        livereload: true,
        port: 3000,
    });
});


// ==========================================================
// DEMO
// ==========================================================
gulp.task('demo', () => {
    console.log('Reloading Page...');
    gulp.src('./demo/*.html')
        .pipe(connect.reload());
});


// ==========================================================
// JS
// ==========================================================
gulp.task('js-dev', () =>
    rollup({
        entry: 'src/element.js',
        plugins: [
            babel(babelrc()),
        ],
    }).then(bundle =>
        bundle.write({
            format: 'umd',
            moduleName: 'element',
            dest: 'dist/element.js',
        })
    )
);

gulp.task('js-production', () => {
    rollup({
        entry: 'src/element.js',
        plugins: [
            babel(babelrc()),
        ],
    }).then(bundle =>
        bundle.write({
            format: 'umd',
            moduleName: 'element',
            dest: 'dist/element.js',
        }));
    rollup({
        entry: 'src/element.js',
        plugins: [
            babel(babelrc()),
            uglify(),
        ],
    }).then(bundle =>
        bundle.write({
            format: 'umd',
            moduleName: 'element',
            dest: 'dist/element.min.js',
        }));
});


// ==========================================================
// WATCH
// ==========================================================
gulp.task('watch', () => {

    // Demo
    gulp.watch([
        'demo/**',
        'dist/**',
    ], [
        'demo',
    ]);

    // JS
    gulp.watch([
        'src/**/*.js',
    ], [
        'js-dev',
    ]);

});

// ==========================================================
// JSDOC
// ==========================================================

gulp.task('doc', function (cb) {
    const config = require('./conf.json');
    gulp.src([
        'README.md',
        './src/element.js',
    ], {
        read: false,
    })
    .pipe(jsdoc(config, cb));
});


// ==========================================================
// TASKS
// ==========================================================

gulp.task('default', [
    'js-dev',
    'serve',
    'watch',
]);

gulp.task('production', [
    'js-production',
    'doc',
]);
