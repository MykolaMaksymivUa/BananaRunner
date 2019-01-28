var gulp     = require('gulp'),
sass         = require('gulp-sass'),
browserSync  = require('browser-sync'),
autoprefixer = require('gulp-autoprefixer'),
cleancss     = require('gulp-clean-css'),
rename       = require('gulp-rename'); 

gulp.task('sass', function () {
    return gulp.src('app/css/**/*.css')
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    })
});

gulp.task('watch', ['browser-sync', 'sass'], function () {
    gulp.watch('app/css/**/*.css', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});