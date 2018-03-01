var test = require('tape')
var html = require('bel')
var nanomorph = require('../')

// FIXME: Need a way to test this... any ideas?
test('do not leak proxy nodes', t => {
  var a = html`<ul><li><div><span id="a">leaky?</span></div></li></ul>`
  var b = html`<ul><li><span id="a">leaky?</span></li></ul>`
  var realNode = html`<span id="a">leaky?</span>`
  var proxyA = html`<div id="a" data-proxy=''></div>`
  proxyA.realNode = realNode
  proxyA.isSameNode = function (el) {
    return el === realNode
  }
  var actual = nanomorph(a, b)
  console.log('ACTUAL', actual)
  t.ok(actual, actual.outerHTML)
  t.end()
})
