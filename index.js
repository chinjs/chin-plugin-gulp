const through = require('through2')
const Vinyl = require('vinyl')
const { Readable } = require('stream')
const { format } = require('path')
const { outputFile } = require('fs-extra')

const NAME = 'chin-plugin-gulp'
const isStream = false
const options = { encoding: null }

const throws = (message) => { throw new Error(message) }
const asserts = (condition, message, isWarn) =>
  condition ? false :
  isWarn ? console.warn(message) :
  throws(message)

const createReadable = (data) => {
  const stream = new Readable()
  stream.push(data)
  stream.push(null)
  return stream
}

const createVinylable = (path) => {
  const transform = (contents, enc, cb) => cb(null, new Vinyl({ contents, path }))
  const stream = through.obj(transform)
  return stream
}

const createGulpable = (data, path) => {
  const readable = createReadable(data)
  const vinylable = createVinylable(path)
  const stream = readable.pipe(vinylable)
  return stream
}

const repipe = (partialStream, transforms) => new Promise((resolve, reject) => {
  const transform = transforms.splice(0, 1)[0]
  asserts(typeof transform.pipe === 'function', `(${NAME}) transform.pipe !== 'function'`)

  const stream = partialStream.pipe(transform)
  stream.on('error', reject)

  !transforms.length
  ? stream.on('data', (vinyl) => resolve(vinyl))
  : repipe(stream, transforms).then(resolve).catch(reject)
})

const gulp = (plugins) => {
  asserts(typeof plugins === 'function', `(${NAME}) typeof plugins !== 'function'`)
  return {
    isStream,
    options,
    processor: (data, { out }) => {
      const transforms = plugins()
      asserts(Array.isArray(transforms), `(${NAME}) !Array.isArray(transforms)`)
      asserts(transforms.length, `(${NAME}) !transforms.length`)
      return repipe(
        createGulpable(data, format(out)),
        transforms
      )
      .then(vinyl => [
        vinyl.path,
        vinyl.contents
      ])
    }
  }
}

const concat = (plugins) => {
  const buffers = []
  const { processor } = gulp(plugins)
  return {
    isStream,
    options,
    processor: (...arg) => processor(...arg).then(res => {
      const contents = res[1]
      buffers.push(contents)
      return undefined
    }),
    dest: (outpath) => {
      asserts(outpath && typeof outpath === 'string', `(${NAME}) !outpath || typeof outpath !== 'string'`)
      asserts(buffers.length, `Warning: (${NAME}) !buffers.length`, true)
      return outputFile(outpath, Buffer.concat(buffers))
    }
  }
}

module.exports = gulp
module.exports.gulp = gulp
module.exports.concat = concat