var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('browserify',() => {
  return browserify('./src/index.js')
    .bundle()
    .pipe(source('build/bundle.js'))
    .pipe(buffer())
    .pipe(uglify()) 
    .pipe(gulp.dest('./'));
});

gulp.task('default', () => {
	gulp.start('browserify');
});