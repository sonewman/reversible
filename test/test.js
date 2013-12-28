#!/usr/bin/env node
var test = require('tap').test

var stream = require('stream')
  , reverse = require('../')
  , decoder = new (require('string_decoder').StringDecoder)('utf8')

test('Pipe string data', function (t) {

  var values = ['one', 'two', 'three', 'four', 'five']
    , readIndex = 0
    , writeIndex = 0
    , expectedValues = [].concat(values).reverse()
    , actualValues = []

  var readable = new stream.Readable
    , writable = new stream.Writable

  readable._read = function () {
    readable.push(values[readIndex++])
  }

  //  this has to be stubbed since we use the old 'data' events (accept in Node 0.11+)
  writable.write = function (chunk) {
    var value = decoder.write(chunk)
    t.equal(expectedValues[writeIndex++], value)
    actualValues.push(value)

    if (writeIndex === values.length) {
      t.equal(expectedValues.length, actualValues.length)
      t.end()
    }
  }

  readable
    .pipe(reverse())
    .pipe(writable)
})

test('Pipe object data', function (t) {

  var values = [
      { thing: 'one' }, { thing: 'two' }, {thing: 'three' }
      , {thing: 'four' }, { thing: 'five' }
    ]
    , readIndex = 0
    , writeIndex = 0
    , expectedValues = [].concat(values).reverse()
    , actualValues = []

  var readable = new stream.Readable
    , writable = new stream.Writable

  readable._readableState.objectMode = true
  writable._writableState.objectMode = true

  readable._read = function () {
    readable.push(values[readIndex++])
  }

  //  this has to be stubbed since we use the old 'data' events (accept in Node 0.11+)
  writable.write = function (chunk) {
    t.equal(JSON.stringify(expectedValues[writeIndex++]), JSON.stringify(chunk))
    actualValues.push(chunk)

    if (writeIndex === values.length) {
      t.equal(expectedValues.length, actualValues.length)
      t.end()
    }
  }

  readable
    .pipe(reverse({ objectMode: true }))
    .pipe(writable)
})