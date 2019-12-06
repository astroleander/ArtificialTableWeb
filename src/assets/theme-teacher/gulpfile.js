// 用于给自定义css加入命名空间前缀
var path = require('path')
var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')

var adminThemeName = '.theme-teacher'

gulp.task('css-wrap', function() {
  return gulp.src(path.resolve('./theme-teacher.css')) // 需要处理的文件
    .pipe(cssWrap({ selector: adminThemeName }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/assets/theme-teacher')) // 生成新css文件路径
})
