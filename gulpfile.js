'use strict';

var gulp = require('gulp');

var uglify = require('gulp-uglifyjs');


var paths = {
    scripts: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/pusher/dist/pusher.min.js'
    ],
    dist: 'web/js/'
};

gulp.task('move', function(){
    gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.dist));
});

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

gulp.task('default',['uglify', 'move']);