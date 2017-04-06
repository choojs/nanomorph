var seed = require('math-random-seed')
var tape = require('tape')
var html = require('bel')
var nanomorph = require('./')

if (!module.parent) {
  specificTests(nanomorph)
  abstractMorph(nanomorph)
} else {
  module.exports = abstractMorph
}

function specificTests (morph) {
  tape('nanomorph', function (t) {
    t.test('should assert input types', function (t) {
      t.plan(2)
      t.throws(morph, /a/)
      t.throws(morph.bind(null, {}), /b/)
    })
  })
}

function abstractMorph (morph) {
  tape('abstract morph', function (t) {
    t.test('root level', function (t) {
      t.test('should replace a node', function (t) {
        t.plan(1)
        var a = html`<p>hello world</p>`
        var b = html`<div>hello world</div>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should morph a node', function (t) {
        t.plan(1)
        var a = html`<p>hello world</p>`
        var b = html`<p>hello you</p>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should morph a node with namespaced attribute', function (t) {
        t.plan(1)
        var a = html`<svg><use xlink:href="#heybooboo"></use></svg>`
        var b = html`<svg><use xlink:href="#boobear"></use></svg>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should ignore if node is same', function (t) {
        t.plan(1)
        var a = html`<p>hello world</p>`
        var expected = a.outerHTML
        var res = morph(a, a)
        t.equal(res.outerHTML, expected, 'result was expected')
      })
    })

    t.test('nested', function (t) {
      t.test('should replace a node', function (t) {
        t.plan(1)
        var a = html`<main><p>hello world</p></main>`
        var b = html`<main><div>hello world</div></main>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should replace a node', function (t) {
        t.plan(1)
        var a = html`<main><p>hello world</p></main>`
        var b = html`<main><p>hello you</p></main>`
        var res = morph(a, b)
        var expected = b.outerHTML
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should replace a node', function (t) {
        t.plan(1)
        var a = html`<main><p>hello world</p></main>`
        var res = morph(a, a)
        var expected = a.outerHTML
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should append a node', function (t) {
        t.plan(1)
        var a = html`<main></main>`
        var b = html`<main><p>hello you</p></main>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove a node', function (t) {
        t.plan(1)
        var a = html`<main><p>hello you</p></main>`
        var b = html`<main></main>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })
    })

    t.test('events', function (t) {
      t.test('should copy onclick events', function (t) {
        t.plan(1)
        var a = html`<button onclick=${fail}>OLD</button>`
        var b = html`<button>NEW</button>`
        var res = morph(a, b)

        res.click()

        a = html`<button>OLD</button>`
        b = html`<button onclick=${pass}>NEW</button>`
        res = morph(a, b)

        res.click()

        function fail (e) {
          e.preventDefault()
          t.fail('should not be called')
        }

        function pass (e) {
          e.preventDefault()
          t.ok('called')
        }
      })
    })

    t.test('values', function (t) {
      t.test('if new tree has no value and old tree does, remove value', function (t) {
        t.plan(4)
        var a = html`<input type="text" value="howdy" />`
        var b = html`<input type="text" />`
        var res = morph(a, b)
        t.equal(res.getAttribute('value'), null)
        t.equal(res.value, '')

        a = html`<input type="text" value="howdy" />`
        b = html`<input type="text" value=${null} />`
        res = morph(a, b)
        t.equal(res.getAttribute('value'), null)
        t.equal(res.value, '')
      })

      t.test('if new tree has value and old tree does too, set value from new tree', function (t) {
        t.plan(1)
        var a = html`<input type="text" value="howdy" />`
        var b = html`<input type="text" value="hi" />`
        var res = morph(a, b)
        t.equal(res.value, 'hi')
      })
    })

    t.test('isSameNode', function (t) {
      t.test('should return a if true', function (t) {
        t.plan(1)
        var a = html`<div>YOLO</div>`
        var b = html`<div>FOMO</div>`
        b.isSameNode = function (el) {
          return true
        }
        var res = morph(a, b)
        t.equal(res.childNodes[0].data, 'YOLO')
      })

      t.test('should return b if false', function (t) {
        t.plan(1)
        var a = html`<div>YOLO</div>`
        var b = html`<div>FOMO</div>`
        b.isSameNode = function (el) {
          return false
        }
        var res = morph(a, b)
        t.equal(res.childNodes[0].data, 'FOMO')
      })
    })

    t.test('lists', function (t) {
      t.test('should append nodes', function (t) {
        t.plan(1)
        var a = html`<ul></ul>`
        var b = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove nodes', function (t) {
        t.plan(1)
        var a = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
        var b = html`<ul></ul>`
        var res = morph(a, b)
        var expected = b.outerHTML
        t.equal(res.outerHTML, expected, 'result was expected')
      })
    })

    t.test('should replace nodes', function (t) {
      t.plan(1)
      var a = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      var b = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      var expected = b.outerHTML
      a = morph(a, b)
      t.equal(a.outerHTML, expected, 'result was expected')
    })

    t.test('should replace nodes after multiple iterations', function (t) {
      t.plan(2)

      var a = html`<ul></ul>`
      var b = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      var expected = b.outerHTML

      a = morph(a, b)
      t.equal(a.outerHTML, expected, 'result was expected')

      b = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      expected = b.outerHTML

      a = morph(a, b)
      t.equal(a.outerHTML, expected, 'result was expected')
    })
  })
}

tape('should skip over data-onload attributes at root', function (t) {
  var a = html`
    <section data-onloadidzina="o0">
      <input data-onloadidzina="o1">
    </section>
  `
  var b = html`
    <section>
      <input autofocus="autofocus" value="" class="f6 normal">
      <button class="bg-light-gray white ttu">save</button>
    </section>
  `
  var c = html`
    <section data-onloadidzina="o0">
      <input autofocus="autofocus" value="" class="f6 normal">
      <button class="bg-light-gray white ttu">save</button>
    </section>
  `
  var d = nanomorph(a, b)
  t.ok(c.isEqualNode(d), 'is equal')
  t.end()
})

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
