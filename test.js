import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import { parse } from 'path'

/* gulp plugins */
import stylus from 'gulp-stylus'
import autoprefixer from 'gulp-autoprefixer'
import minify from 'gulp-minify-css'

const styl = `
body
  font: 12px Helvetica, Arial, sans-serif;
`

const parseXbase = (path) => {
  const { root, dir, name, ext } = parse(path)
  return { root, dir, name, ext }
}

it(`e2e by concat(plugins)`, () => {
  const gulp = rewire('.')
  const outputFile = sinon.spy((outpath, buffer) => assert.ok(Buffer.isBuffer(buffer)))
  gulp.__set__('outputFile', outputFile)

  const { concat } = gulp
  const { processor, dest } = concat(() => [ stylus(), autoprefixer(), minify() ])

  return Promise.all([
    [Buffer.from(styl), { out: parseXbase('assets/0.txt') }],
    [Buffer.from(styl), { out: parseXbase('assets/1.txt') }]
  ].map(([ data, util ]) =>
    processor(data, util)
    .then((res) => assert.equal(res, undefined))
  ))
  .then(() => dest('.dist/concated.styl'))
  .then(() => assert.equal(outputFile.callCount, 1))
})

describe('throwed', () => {
  const gulp = rewire('.')

  it(`typeof plugins !== 'function'`, () =>
    ['string', 100, [], {}, undefined, null].forEach(plugins =>
      assert.throws(() =>
        gulp.gulp(plugins)
      )
    )
  )

  it(`!Array.isArray(transforms)`, () =>
    ['string', 100, {}, () => {}, undefined, null].forEach(transforms =>
      assert.throws(() =>
        gulp.gulp(() => transforms).processor('data', {})
      )
    )
  )

  it(`!transforms.length`, () =>
    assert.throws(() =>
      gulp.gulp(() => []).processor('data', {})
    )
  )

  it(`typeof transform.pipe !== 'function'`, () =>
    gulp.gulp(() => [ { pipe: undefined } ])
    .processor('data', { out: parseXbase('assets/file.ext') })
    .then(() => assert(false))
    .catch(() => assert(true))
  )

  it(`!outpath || typeof outpath !== 'string'`, () =>
    ['', true, 100, {}, () => {}, undefined, null].forEach(outpath =>
      assert.throws(() =>
        gulp.concat(() => [ { pipe: () => {} } ]).dest(outpath)
      )
    )
  )
})