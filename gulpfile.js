var gulp = require('gulp');
var less = require('gulp-less');
//var shell = require('gulp-shell');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');


gulp.task('watch',  done => {
    gulp.watch('less/*.less', gulp.series('less'));
    gulp.watch('js/*',  gulp.series('scripts'));
    done();
});

gulp.task('less',  done => {
    gulp.src('less/styles.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('css'));
        done();
});

gulp.task('scripts',  done => {
    return gulp.src(['./js/Functions.js','./js/Helpers.js','./js/Globals.js','./js/Events.js', './js/Album.js', './js/Templates.js', './js/Main.js', './js/InterfaceAnimations.js','./js/InterfaceMethods.js','./js/DragAndDrop.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./Libs/'));
});


gulp.task('default', gulp.series(['less', 'watch'], function() { 
    // default task code here
}));