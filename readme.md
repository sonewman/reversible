# Reversible

Reverse Stream data:

```javascript
  var stream = require('stream')
    , writable = new stream.Writable
    , readable = new stream.Readable

  var reverse = require('reversible')

  writable
    .pipe(reverse())
    .pipe(readable)
```

You can also pipe objects by passing in the objectMode flag:

```javascript
  writable
    .pipe(reverse({ objectMode: true }))
    .pipe(readable)
```

