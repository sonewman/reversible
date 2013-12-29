#!/usr/bin/env node
var reverse = require('../')

var fs = require('fs')
  , PassThrough = require('stream').PassThrough
  , splitStream = new PassThrough()
  , values = ['one', 'two', 'three', 'four', 'five']

fs.createWriteStream('file.txt').end(values.join('\n'))

splitStream._transform = function (chunk, enc, next) {
  String(chunk).split('\n').forEach(function (piece) {
    splitStream.push(piece)
  })
  next()
}

var readFile = fs.createReadStream('file.txt')
readFile.on('end', function () {
  fs.unlink('file.txt')
})

readFile
  .pipe(splitStream)
  .pipe(reverse())
  .pipe(process.stdout)