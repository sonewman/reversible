# Reversible

Reverse Stream data chunks!

install:
```bash
$ npm install reversible
```

include in your project:
```javascript
var reverse = require('reversible')
```

Simple buffer example:
```javascript
  var Readable = require('stream').Readable

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
```

Example reading file splitting on new line:
```javascript
  var fs = require('fs')
    , splitStream = new (require('stream').PassThrough)()

  splitStream._transform = function (chunk, enc, next) {
    String(chunk).split('\n').forEach(function (piece) {
      splitStream.push(piece)
    })
    next()
  }

  fs.createReadStream('file.txt')
    .pipe(splitStream)
    .pipe(reverse())
    .pipe(process.stdout)
```

You can also pipe objects by passing in the objectMode flag:

```javascript
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
```

