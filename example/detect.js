'use strict';

var fs = require('fs');
var detect = require('../');

var src = fs.readFileSync(__dirname + '/input.js', 'utf8');

var scope = detect(src);
console.dir(scope);
