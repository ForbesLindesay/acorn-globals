'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var test = require('testit');
var detect = require('../');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname + '/fixtures/', file), 'utf8');
}

test('argument.js - parameters from inline arguments', function () {
  assert.deepEqual(detect(read('argument.js')), []);
});
test('arrow_functions.js - arguments of arrow functions are not globals', function () {
  assert.deepEqual(detect(read('arrow_functions.js')).map(function (node) { return node.name; }), ['z', 'b', 'c'].sort());
});
test('assign_implicit.js - assign from an implicit global', function () {
  assert.deepEqual(detect(read('assign_implicit.js')).map(function (node) { return node.name; }), ['bar']);
});
test('class.js - ES2015 classes', function () {
  assert.deepEqual(detect(read('class.js')).map(function (node) { return node.name; }), ['OtherClass_', 'SuperClass', 'this'].sort());
});
test('default-argument.js - ES2015 default argument', function () {
  assert.deepEqual(detect(read('default-argument.js')).map(function (node) { return node.name; }), ['c', 'h', 'j', 'k']);
});
test('destructuring.js - ES2015 variable destructuring', function () {
  assert.deepEqual(detect(read('destructuring.js')).map(function (node) { return node.name; }), ['g']);
});
test('detect.js - check locals and globals', function () {
  assert.deepEqual(detect(read('detect.js')).map(function (node) { return node.name; }),
                   ['w', 'foo', 'process', 'console', 'AAA', 'BBB', 'CCC', 'xyz', 'ZZZ', 'BLARG', 'RAWR'].sort());
});
test('export.js - Anything that has been imported is not a global', function () {
  assert.deepEqual(detect(read('export.js')).map(function (node) { return node.name; }), []);
});
test('import.js - Anything that has been imported is not a global', function () {
  assert.deepEqual(detect(read('import.js')).map(function (node) { return node.name; }), ['whatever']);
});
test('labels.js - labels for while loops are not globals', function () {
  assert.deepEqual(detect(read('labels.js')), []);
});
test('multiple-exports.js - multiple-exports', function () {
  assert.deepEqual(detect(read('multiple-exports.js')).map(function (node) { return node.name; }), ['bar', 'exports']);
});
test('named_arg.js - named argument / parameter', function () {
  assert.deepEqual(detect(read('named_arg.js')), []);
});
test('obj.js - globals on the right-hand of a colon in an object literal', function () {
  assert.deepEqual(detect(read('obj.js')).map(function (node) { return node.name; }), ['bar', 'module']);
});
test('reserved-words.js - check we do not force into strict mode', function () {
  assert.deepEqual(detect(read('reserved-words.js')).map(function (node) { return node.name; }), ['console']);
});
test('rest-argument.js - ES2015 rest argument', function () {
  assert.deepEqual(detect(read('rest-argument.js')), []);
});
test('return_hash.js - named argument / parameter', function () {
  assert.deepEqual(detect(read('return_hash.js')), []);
});
test('right_hand.js - globals on the right-hand of assignment', function () {
  assert.deepEqual(detect(read('right_hand.js')).map(function (node) { return node.name; }), [ 'exports', '__dirname', '__filename' ].sort());
});
test('try_catch.js - the exception in a try catch block is a local', function () {
  assert.deepEqual(detect(read('try_catch.js')), []);
});
