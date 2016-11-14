var gulp = require('gulp'),
    minifyCss = require("gulp-minify-css"),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    px2rem = require('gulp-px3rem'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del')

gulp.task('clean', function() {
  del(['build/*.js'],{force: true});
});

gulp.task('style',function() {
   //return sass(['./src/css/*.scss','./src/js/common/**/*.scss'])
   return sass('./src/**/*.scss')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(px2rem({
          baseDpr: 2,            
          threeVersion: false,    
          remVersion: true,      
          remUnit: 75,           
          remPrecision: 6         
        }))

      .pipe(autoprefixer('last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('./src'))
      .pipe(minifyCss())
      .pipe(rename(function(path){
        path.basename = path.basename.replace('.debug','')
      }))
      .pipe(gulp.dest('./src'))
});

gulp.task('default', ['clean','style']);

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js','./src/**/*.js'], ['style']);
  gulp.watch(['./src/**/*.scss','./src/**/*.scss'], ['style']);
});

// start
gulp.task('start',['default','watch']);

module.exports = gulp;
