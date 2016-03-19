'use strict';

var gulp = require('gulp');

var paths = {
    scripts: ['bower_components/quintus/lib/'],
    dist: 'public/js/'
};

gulp.task('move', function(){
    gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.dist));
});
