module.exports = reverse

var Duplex = require('stream').Duplex

function reverse (opts) {
  var stream, objectMode

  objectMode = opts && opts.objectMode ? true : false
  if (objectMode) delete opts.objectMode

  stream = new Duplex
  stream._buffer = []

  if (objectMode) {
    stream._readableState.objectMode = true
    stream._writableState.objectMode = true
  }

  //  at write method since _write will only be called
  //  once in streams2 because once the stream has a data event
  //  added it will rever to compatibility mode with streams3
  stream.write = function (chunk) {
    stream._buffer.push(chunk)
  }

  //  dead method - we do not need it
  stream._read = function () {}

  //  on pipe we add the on end method to the src
  stream.on('pipe', onPipe)

  function onPipe (src) {
    src.on('end', onEnd)

    function onEnd () {
      done()
      cleanUp()
    }

    function cleanUp () {
      stream.removeListener('pipe', onPipe)
      src.removeListener('end', onEnd)
    }
  }

  function done () {
    var data
    while (data = stream._buffer.pop())
      stream.push(data)

    stream.push(null)
    if (opts && opts.forceEnd) stream.end()
  }

  return stream
} 