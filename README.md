# acorn-globals

Detect global variables in JavaScript using acorn

[![Build Status](https://travis-ci.org/ForbesLindesay/acorn-globals.png?branch=master)](https://travis-ci.org/ForbesLindesay/acorn-globals)
[![Dependency Status](https://gemnasium.com/ForbesLindesay/acorn-globals.png)](https://gemnasium.com/ForbesLindesay/acorn-globals)
[![NPM version](https://badge.fury.io/js/acorn-globals.png)](http://badge.fury.io/js/acorn-globals)

## Installation

    npm install acorn-globals

## Usage

detect.js

```js
var fs = require('fs');
var detect = require('acorn-globals');

var src = fs.readFileSync(__dirname + '/input.js', 'utf8');

var scope = detect(src);
console.dir(scope);
```

input.js

```js
var x = 5;
var y = 3, z = 2;

w.foo();
w = 2;

RAWR=444;
RAWR.foo();

BLARG=3;

foo(function () {
    var BAR = 3;
    process.nextTick(function (ZZZZZZZZZZZZ) {
        console.log('beep boop');
        var xyz = 4;
        x += 10;
        x.zzzzzz;
        ZZZ=6;
    });
    function doom () {
    }
    ZZZ.foo();

});

console.log(xyz);
```

output:

```
$ node example/detect.js
[ { name: 'BLARG', nodes: [ [Object] ] },
  { name: 'RAWR', nodes: [ [Object], [Object] ] },
  { name: 'ZZZ', nodes: [ [Object], [Object] ] },
  { name: 'console', nodes: [ [Object], [Object] ] },
  { name: 'foo', nodes: [ [Object] ] },
  { name: 'process', nodes: [ [Object] ] },
  { name: 'w', nodes: [ [Object], [Object] ] },
  { name: 'xyz', nodes: [ [Object] ] } ]
```


## License

  MIT
