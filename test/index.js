'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var test = require('testit');
var detect = require('../');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname + '/fixtures/', file), 'utf8');
}

function nameOf(node) {
  return node.name;
}

function buildQualifiedVariableName(node) {
  const namePath = [];
  for (var i = node.parents.length - 1; i >= 0; i--) {
    const parent = node.parents[i];
    if (parent.type === "Identifier") {
      namePath.push(parent.name);
    } else if (parent.type === "MemberExpression") {
      namePath.push(parent.property.name || parent.property.value);
    } else if (parent.type === "ThisExpression") {
      namePath.push("this");
    } else {
      break;
    }
  }
  return namePath.join('.');
}

test('argument.js - parameters from inline arguments', function () {
  assert.deepEqual(detect(read('argument.js')), []);
});
test('arrow_functions.js - arguments of arrow functions are not globals', function () {
  assert.deepEqual(detect(read('arrow_functions.js')).map(nameOf), ['z', 'b', 'c', 'arguments'].sort());
});
test('assign_implicit.js - assign from an implicit global', function () {
  assert.deepEqual(detect(read('assign_implicit.js')).map(nameOf), ['bar']);
});
test('catch-pattern.js - pattern in catch', function () {
  assert.deepEqual(detect(read('catch-pattern.js')), []);
});
test('class.js - ES2015 classes', function () {
  assert.deepEqual(detect(read('class.js')).map(nameOf), ['G', 'OtherClass_', 'SuperClass', 'this'].sort());
});
test('class-expression.js - class as expression', function () {
  assert.deepEqual(detect(read('class-expression.js')), []);
});
test('default-argument.js - ES2015 default argument', function () {
  assert.deepEqual(detect(read('default-argument.js')).map(nameOf), ['c', 'h', 'j', 'k']);
});
test('destructuring-rest.js - ES2015 destructuring rest', function () {
  assert.deepEqual(detect(read('destructuring-rest.js')), []);
});
test('destructuring.js - ES2015 variable destructuring', function () {
  assert.deepEqual(detect(read('destructuring.js')).map(nameOf), ['g']);
});
test('detect.js - check locals and globals', function () {
  assert.deepEqual(
    detect(read('detect.js')).map(nameOf),
    ['w', 'foo', 'process', 'console', 'AAA', 'BBB', 'CCC', 'xyz', 'ZZZ', 'BLARG', 'RAWR'].sort()
  );
});
test('detect.js - check variable names', function () {
  assert.deepEqual(
    detect(read('detect.js')).map(function (node) { return '[' + node.nodes.map(buildQualifiedVariableName) + ']'; }),
    [
      '[w.foo,w]',
      '[foo]',
      '[process.nextTick]',
      '[console.log,console.log]',
      '[AAA.aaa]',
      '[BBB.bbb]',
      '[CCC.x]',
      '[xyz]',
      '[ZZZ,ZZZ.foo]',
      '[BLARG]',
      '[RAWR,RAWR.foo]'
    ].sort()
  );
});
test('export.js - Anything that has been imported is not a global', function () {
  assert.deepEqual(detect(read('export.js')).map(nameOf), ['baz']);
});
test('export-default-anonymous-class.js - export anonymous class as default', function () {
  assert.deepEqual(detect(read('export-default-anonymous-class.js')), []);
});
test('export-default-anonymous-function.js - export anonymous function as default', function () {
  assert.deepEqual(detect(read('export-default-anonymous-function.js')), []);
});
test('import.js - Anything that has been imported is not a global', function () {
  assert.deepEqual(detect(read('import.js')).map(nameOf), ['whatever']);
});
test('labels.js - labels for while loops are not globals', function () {
  assert.deepEqual(detect(read('labels.js')), []);
});
test('multiple-exports.js - multiple-exports', function () {
  assert.deepEqual(detect(read('multiple-exports.js')).map(nameOf), ['bar', 'exports']);
});
test('named_arg.js - named argument / parameter', function () {
  assert.deepEqual(detect(read('named_arg.js')), []);
});
test('names-in-object-prototype.js - check names in object prototype', function () {
  assert.deepEqual(detect(read('names-in-object-prototype.js')).map(nameOf).sort(), ['__proto__', 'constructor', 'hasOwnProperty']);
});
test('obj.js - globals on the right-hand of a colon in an object literal', function () {
  assert.deepEqual(detect(read('obj.js')).map(nameOf), ['bar', 'module']);
});
test('properties.js - check variable names', function () {
  assert.deepEqual(
    detect(read('properties.js')).map(function (node) { return '[' + node.nodes.map(buildQualifiedVariableName) + ']'; }),
    [
      '[simple_g]',
      '[qualified_g]',
      '[ugly.chained.methodCall,ugly.chained.lookup]',
      '[uglier.chained.property.lookup]'
    ].sort()
  );
});
test('reserved-words.js - check we do not force into strict mode', function () {
  assert.deepEqual(detect(read('reserved-words.js')).map(nameOf), ['console']);
});
test('rest-argument.js - ES2015 rest argument', function () {
  assert.deepEqual(detect(read('rest-argument.js')), []);
});
test('return_hash.js - named argument / parameter', function () {
  assert.deepEqual(detect(read('return_hash.js')), []);
});
test('right_hand.js - globals on the right-hand of assignment', function () {
  assert.deepEqual(detect(read('right_hand.js')).map(nameOf), [ 'exports', '__dirname', '__filename' ].sort());
});
test('try_catch.js - the exception in a try catch block is a local', function () {
  assert.deepEqual(detect(read('try_catch.js')), []);
});
test('this.js - `this` is considered a global', function () {
  assert.deepEqual(detect(read('this.js')).map(nameOf), ['this']);
});
