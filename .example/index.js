/* chin */
const { gulp, concat } = require('..')
const compose = require('chin-plugin-compose')
const convertsvg = require('chin-plugin-convert-svg')

/* gulp */
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')
const less = require('gulp-less')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const minify = require('gulp-minify-css')

/* put/out */
const { join } = require('path')
const put = join(__dirname, 'put')
const out = join(__dirname, 'out')

/* extensions */
const img2min = gulp(() => [
  imagemin()
])

const svg2min = compose([
  convertsvg('.png'),
  gulp(() => [
    imagemin()
  ])
])

const sass2css = gulp(() => [
  sass(),
  autoprefixer(),
  minify()
])

const less2css = gulp(() => [
  less(),
  autoprefixer(),
  minify()
])

const styl2css = concat(() => [
  stylus({ compress: true }),
  autoprefixer()
])

module.exports = {
  put,
  out,
  processors: [
    ['stylus', {
      styl: styl2css
    }],
    ['*', {
      png: img2min,
      jpg: img2min,
      svg: svg2min,
      sass: sass2css,
      less: less2css
    }]
  ],
  after: () =>
    styl2css.dest(`${out}/styl.css`)
}