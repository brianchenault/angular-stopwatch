'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp.src('./js/app.js')
        .pipe(transform(function(filename) {
            return browserify(filename).bundle();
        }))
        .pipe(gulp.dest('./dist'));
});