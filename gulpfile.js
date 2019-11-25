;'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const styleSrc = 'public/scss/';
const styleDist = 'public/stylesheets/';
const fileNames = ['style', 'login', 'main'];

function style() {
    for (let i in fileNames) {
        if (fileNames.hasOwnProperty(i)) {
            compileToScss(styleSrc, styleDist, fileNames[i]);
        }
    }
    return complete();
}

function compileToScss(src, dest, fileName) {
    gulp.src(src + fileName + '.scss')
        .pipe(sass({ errorLogToConsole: true, outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(dest));
}

function complete() {
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

exports.default = style;
