#!/usr/bin/env node
var reverse = require('../')
  , Readable = require('stream').Readable

var values = ['one', 'two', 'three', 'four', 'five']
  , readIndex = 0

var readable = new Readable

readable._read = function () {
  var index = readIndex++, value = values[index]
  if (value !== undefined) value += '\n'
  readable.push(value)
}

readable
  .pipe(reverse())
  .pipe(process.stdout)