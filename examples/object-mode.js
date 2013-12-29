#!/usr/bin/env node
var reverse = require('../')

var stream = require('stream')
  , readable = new stream.Readable()
  , stringify = new stream.Transform()
  , index = 0
  , data = [
    { no: 'one' }
    , { no: 'two' }
    , { no: 'three' }
    , { no: 'four' }
    , { no: 'five' }
  ]

readable._read = function () { 
  this.push(data[index++]) 
}
readable._readableState.objectMode = true

stringify.start = true
stringify._writableState.objectMode = true
stringify.write = function (chunk, enc, next) {
  var data = JSON.stringify(chunk)

  if (stringify.start) {
    stringify.push('[')
    stringify.start = false
  } else {
    data = ',' + data
  }

  stringify.push(data)
}
stringify._flush = function () {
  stringify.push(']')
}

readable
  .pipe(reverse({ objectMode: true }))
  .pipe(stringify)
  .pipe(process.stdout)