/* eslint import/no-extraneous-dependencies:
["error", {"devDependencies": true}]
*/
require('dotenv').config();
const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  nodemon = require('gulp-nodemon'),
  sass = require('gulp-sass'),
  bower = require('gulp-bower'),
  eslint = require('gulp-eslint'),
  browserSync = require('browser-sync'),
  port = process.env.PORT;

gulp.task('watch', () => {
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**', browserSync.reload);
  gulp.watch('public/views/**', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
  gulp.watch('app/views/**', browserSync.reload);
});

gulp.task('sass', () =>
  gulp.src('public/css/common.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/css/'))
);

gulp.task('eslint', () =>
  gulp.src([
    'gulpfile.js',
    'public/js/**/*.js',
    'test/**/*.js',
    'app/**/*.js'
  ])
  .pipe(eslint())
);

gulp.task('bower', () =>
  bower()
  .pipe(gulp.dest('./public/lib/'))
);

gulp.task('mochaTest', () =>
  gulp.src('test/**/*.js', { read: false })
  .pipe(mocha({ reporter: 'spec' }))
);

gulp.task('nodemon', () =>
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  })
);

gulp.task('serve', ['nodemon'], () => {
  browserSync({
    proxy: `localhost:${port}`,
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});

// Default task(s).
gulp.task('default', ['eslint', 'serve', 'watch', 'sass', 'test']);

// Test task.
gulp.task('test', ['mochaTest']);

// Bower task.
gulp.task('install', ['bower']);
