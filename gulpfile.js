'use strict';

var gulp = require('gulp');

var paths = {
    scripts: [
        'bower_components/quintus/lib/*'
    ],
    dist: 'web/js/'
};

gulp.task('move', function(){
    gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('default',['move']);