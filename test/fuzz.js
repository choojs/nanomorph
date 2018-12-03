var seed = require('math-random-seed')
var tape = require('tape')
var html = require('nanohtml')

var nanomorph = require('../')

tape('chaos monkey #1', function (t) {
  var a, b
  a = html`<div r="r"><div></div></div>`
  b = html`<div io="iO" vq="Vq"><div></div></div>`
  compare(a, b, t)
  t.end()
})

// modeled after
// https://github.com/mafintosh/hypercore/blob/master/test/tree-index.js
var random = seed('choo choo')
var props = null
tape('fuzz tests', function (t) {
  var a, b
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 5; j++) {
      a = create(i, j, 0)
      for (var k = 0; k < 3; k++) {
        b = create(i, k, 1)
        props = { depth: i, propCount: j, offset: k }
        compare(a, b, t, props)
      }
    }
  }
  t.end()
})

function create (depth, propCount, offset) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var root = document.createElement('div')
  var el = root
  var _el = null
  var str = ''
  offset += 100
  for (var i = 0; i < depth; i++) {
    _el = document.createElement('div')
    el.appendChild(_el)
    for (var j = 0; j < propCount; j++) {
      str = ''
      for (var k = propCount; k > 0; --k) {
        str += chars[Math.floor(random() * 100) % chars.length]
      }
      el.setAttribute(str, str)
      offset++
    }
    el = _el
  }
  return root
}

function compare (a, b, t, props) {
  props = props ? JSON.stringify(props) : undefined
  var expected = b.cloneNode(true)
  var res = nanomorph(a, b)
  deepEqualNode(res, expected, t, props)
}

function deepEqualNode (a, b, t, props) {
  t.ok(a.isEqualNode(b), props)
  for (var i = a.childNodes.length - 1; i >= 0; --i) {
    deepEqualNode(a.childNodes[i], a.childNodes[i], t, props)
  }
}
