# chin-plugin-gulp

[![npm](https://img.shields.io/npm/v/chin-plugin-gulp.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-gulp)
[![npm](https://img.shields.io/npm/dm/chin-plugin-gulp.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-gulp)
[![Build Status](https://img.shields.io/travis/chinjs/chin-plugin-gulp.svg?longCache=true&style=flat-square)](https://travis-ci.org/chinjs/chin-plugin-gulp)
[![Coverage Status](https://img.shields.io/codecov/c/github/chinjs/chin-plugin-gulp.svg?longCache=true&style=flat-square)](https://codecov.io/github/chinjs/chin-plugin-gulp)

[chin](https://github.com/chinjs/chin) plugin using [gulp plugins](https://gulpjs.com/plugins).

## Installation
```shell
yarn add -D chin chin-plugin-gulp
```

## Usage
### gulp(plugins)

`plugins: () => stream[]`

```js
import gulp from 'chin-plugin-gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import minify from 'gulp-minify-css'

const sass2css = gulp(() => [
  sass(),
  autoprefixer(),
  minify()
])

export default {
  put,
  out,
  processors: { sass: sass2css }
}
```

### concat(plugins) / dest(path)
Instead of [`gulp-concat`](https://github.com/gulp-community/gulp-concat) which can not be used in chin.
```js
import { concat } from 'chin-plugin-gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import minify from 'gulp-minify-css'

const sass2css = concat(() => [
  sass(),
  autoprefixer(),
  minify()
])

export default {
  put,
  out,
  processors: { sass: sass2css },
  after: () => sass2css.dest('dist/concated.css')
}
```


## License
MIT (http://opensource.org/licenses/MIT)