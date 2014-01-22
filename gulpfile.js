// Load plugins
var gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
livereload = require('gulp-livereload'),
lr = require('tiny-lr'),
server = lr();

// HTML & PHP
gulp.task('htmlphp', function() {
    return gulp.src(['**/*.html', '**/*.php'])
    .pipe(livereload(server));
});

// CSS
gulp.task('css', function() {
    return gulp.src('assets/scss/main.scss')
    .pipe(sass({ style: 'compact' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'CSS task complete' }));
});

// JS
gulp.task('js', function() {
    return gulp.src('assets/js/app.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'JS task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
    return gulp.src(['assets/css', 'assets/js', 'assets/img'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.run('css', 'js', 'images');
});

// Watch
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
        return console.log(err)
    };

    // Watch .scss files
    gulp.watch('assets/scss/**/*.scss', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('css');
    });

    // Watch .js files
    gulp.watch('assets/js/app.js', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('js');
    });

    // Watch image files
    gulp.watch('assets/img/**/*', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('images');
    });

    // Watch html & php files
    gulp.watch(['*.html', '*.php'], function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('htmlphp');
    });

});

});