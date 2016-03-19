'use strict';

var gulp = require('gulp');

var uglify = require('gulp-uglifyjs');

gulp.task('uglify', function() {
    gulp.src(['bower_components/quintus/lib/*'])
        .pipe(uglify('nfc.js', {
            mangle: false,
            output: {
                beautify: true
            }
        }))
        .pipe(gulp.dest('web/js'))
});

gulp.task('default',['uglify']);