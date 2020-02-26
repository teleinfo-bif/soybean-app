const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const minimist = require('minimist')

let appSassFile = 'app.scss',
  pagesSassFile = 'pages/**/*.scss',
  componentsSassFile = 'components/**/*.scss'
stylesSassFile = 'style/**/*.scss'

// gulp.task('appSass', () => {
//   return sassToWxss(appSassFile, './')
// })

gulp.task('pagesSass', () => {
  return sassToWxss(pagesSassFile, './pages')
})

gulp.task('componentsSass', () => {
  return sassToWxss(componentsSassFile, './components')
})

gulp.task('stylesSass', () => {
  return sassToWxss(stylesSassFile, './style')
})

gulp.task('sass', gulp.series('pagesSass', 'componentsSass', 'stylesSass'))

function sassToWxss(file, path) {
  return gulp.src(file)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(rename({
      extname: '.wxss'
    }))
    .pipe(gulp.dest(path))
}

// let options = minimist(process.argv.slice(2))
// let dir = options.d,
//   file = options.f

// // 快速创建页面文件
// // example: gulp page -d index -f index
// gulp.task('page', () => {
//   return buildPage()
// })

// // 快速创建组件文件
// gulp.task('components', () => {
//   return buildPage('components')
// })

// function buildPage(folder) {
//   return gulp.src('template/*')
//     .pipe(rename({
//       basename: file || dir
//     }))
//     .pipe(gulp.dest(`${folder || 'pages'}/${dir}`))
// }

gulp.task('watch', () => {
  // gulp.watch(appSassFile, gulp.series('appSass'))
  gulp.watch(pagesSassFile, gulp.series('pagesSass'))
  gulp.watch(componentsSassFile, gulp.series('componentsSass'))
  gulp.watch(stylesSassFile, gulp.series('stylesSass'))
})