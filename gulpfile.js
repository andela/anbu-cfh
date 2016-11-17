require('dotenv').config();
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    mocha = require('gulp-mocha'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    bower = require('gulp-bower'),
    eslint = require('gulp-eslint'),
    //jshint = require ('gulp-jshint'),
    browserSync = require('browser-sync');
    port = process.env.PORT;


gulp.task('watch', function() {
	gulp.watch('public/css/common.scss', ['sass']);
 	gulp.watch('public/css/**', browserSync.reload);
 	gulp.watch('public/views/**', browserSync.reload);
 	gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
	gulp.watch('app/views/**', browserSync.reload);

 })


gulp.task('sass', function() {
	return gulp.src('public/css/common.scss')
		.pipe(sass())
		.pipe(gulp.dest('public/css/'))
});

gulp.task('eslint', function() {
	return gulp.src(['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js'])
	.pipe(eslint());
});

gulp.task('bower', function() {
	return bower()
	.pipe(gulp.dest('./public/lib'));
});

gulp.task('mochaTest', function() {
	gulp.src('test/**/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('nodemon', function() {
  	nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development'}
  })
});

gulp.task('serve', ['nodemon'], function(){
    browserSync({
    proxy: 'localhost:'+port,
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});


// gulp.task('css', ['sass'], function() {
// 	return gulp.src('public/css/**', 
// 		browserSync.reload);
// });

// gulp.task('html', function() {
// 	return gulp.watch('public/views/**', browserSync.reload);
// });

// gulp.task('js', function() {
// 	return gulp.watch('public/css/**', browserSync.reload);
// });

//Default task(s).
gulp.task('default', ['eslint', 'serve','watch', 'sass', 'test']);

//Test task.
gulp.task('test', ['mochaTest']);

//Bower task.
gulp.task('install', ['bower']);