var tape = require('tape')
var html = require('bel')
var nanomorph = require('../')

module.exports = abstractMorph

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
        var expected = b.outerHTML
        var res = morph(a, b)
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
        t.plan(4)
        var a = html`<input type="text" value="howdy" />`
        var b = html`<input type="text" value="hi" />`
        var res = morph(a, b)
        t.equal(res.value, 'hi')

        a = html`<input type="text"/>`
        a.value = 'howdy'
        b = html`<input type="text"/>`
        b.value = 'hi'
        res = morph(a, b)
        t.equal(res.value, 'hi')

        a = html`<input type="text" value="howdy"/>`
        b = html`<input type="text"/>`
        b.value = 'hi'
        res = morph(a, b)
        t.equal(res.value, 'hi')

        a = html`<input type="text"/>`
        a.value = 'howdy'
        b = html`<input type="text" value="hi"/>`
        res = morph(a, b)
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

    t.test('selectables', function (t) {
      t.test('should append nodes', function (t) {
        t.plan(1)
        var a = html`<select></select>`
        var b = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should append nodes (including optgroups)', function (t) {
        t.plan(1)
        var a = html`<select></select>`
        var b = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove nodes', function (t) {
        t.plan(1)
        var a = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
        var b = html`<select></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove nodes (including optgroups)', function (t) {
        t.plan(1)
        var a = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
        var b = html`<select></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should add selected', function (t) {
        t.plan(1)
        var a = html`<select><option>1</option><option>2</option></select>`
        var b = html`<select><option>1</option><option selected>2</option></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should add selected (xhtml)', function (t) {
        t.plan(1)
        var a = html`<select><option>1</option><option>2</option></select>`
        var b = html`<select><option>1</option><option selected="selected">2</option></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should switch selected', function (t) {
        t.plan(1)
        var a = html`<select><option selected="selected">1</option><option>2</option></select>`
        var b = html`<select><option>1</option><option selected="selected">2</option></select>`
        var expected = b.outerHTML
        var res = morph(a, b)
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

tape('use id as a key hint', function (t) {
  t.test('append an element', function (t) {
    var a = html`<ul>
      <li id="a"></li>
      <li id="b"></li>
      <li id="c"></li>
    </ul>`
    var b = html`<ul>
      <li id="a"></li>
      <li id="new"></li>
      <li id="b"></li>
      <li id="c"></li>
    </ul>`
    var target = b.outerHTML

    var oldFirst = a.children[0]
    var oldSecond = a.children[1]
    var oldThird = a.children[2]

    var c = nanomorph(a, b)
    t.equal(oldFirst, c.children[0], 'first is equal')
    t.equal(oldSecond, c.children[2], 'moved second is equal')
    t.equal(oldThird, c.children[3], 'moved third is equal')
    t.equal(c.outerHTML, target)
    t.end()
  })

  t.test('handle non-id elements', function (t) {
    var a = html`<ul>
      <li></li>
      <li id="a"></li>
      <li id="b"></li>
      <li id="c"></li>
      <li></li>
    </ul>`
    var b = html`<ul>
      <li></li>
      <li id="a"></li>
      <li id="new"></li>
      <li id="b"></li>
      <li id="c"></li>
      <li></li>
    </ul>`
    var target = b.outerHTML

    var oldSecond = a.children[1]
    var oldThird = a.children[2]
    var oldForth = a.children[3]

    var c = nanomorph(a, b)
    t.equal(oldSecond, c.children[1], 'second is equal')
    t.equal(oldThird, c.children[3], 'moved third is equal')
    t.equal(oldForth, c.children[4], 'moved forth is equal')
    t.equal(c.outerHTML, target)
    t.end()
  })

  t.test('copy over children', function (t) {
    var a = html`<section>'hello'<section>`
    var b = html`<section><div></div><section>`
    var expected = b.outerHTML

    var c = nanomorph(a, b)
    t.equal(c.outerHTML, expected, expected)
    t.end()
  })

  t.test('remove an element', function (t) {
    var a = html`<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>`
    var b = html`<ul><li id="a"></li><li id="c"></li></ul>`

    var oldFirst = a.children[0]
    var oldThird = a.children[2]
    var expected = b.outerHTML

    var c = nanomorph(a, b)

    t.equal(c.children[0], oldFirst, 'first is equal')
    t.equal(c.children[1], oldThird, 'second untouched')
    t.equal(c.outerHTML, expected)
    t.end()
  })

  t.test('swap proxy elements', function (t) {
    var nodeA = html`<li id="a"></li>`
    var placeholderA = html`<div id="a" data-placeholder=true></div>`
    placeholderA.isSameNode = function (el) {
      return el === nodeA
    }

    var nodeB = html`<li id="b"></li>`
    var placeholderB = html`<div id="b" data-placeholder=true></div>`
    placeholderB.isSameNode = function (el) {
      return el === nodeB
    }

    var a = html`<ul>${nodeA}${nodeB}</ul>`
    var b = html`<ul>${placeholderB}${placeholderA}</ul>`
    var c = nanomorph(a, b)

    t.equal(c.children[0], nodeB, 'c.children[0] === nodeB')
    t.equal(c.children[1], nodeA, 'c.children[1] === nodeA')
    t.end()
  })

  t.test('id match still morphs', function (t) {
    var a = html`<li id="12">FOO</li>`
    var b = html`<li id="12">BAR</li>`
    var target = b.outerHTML
    var c = nanomorph(a, b)
    t.equal(c.outerHTML, target)
    t.end()
  })

  t.test('remove orphaned keyed nodes', function (t) {
    var a = html`
      <div>
        <div>1</div>
        <li id="a">a</li>
      </div>
    `
    var b = html`
      <div>
        <div>2</div>
        <li id="b">b</li>
      </div>
    `
    var expected = b.outerHTML
    var c = nanomorph(a, b)
    t.equal(c.outerHTML, expected)
    t.end()
  })

  t.test('whitespace', function (t) {
    var a = html`<ul>
</ul>`
    var b = html`<ul><li></li><li></li>
</ul>`
    var expected = b.outerHTML
    var c = nanomorph(a, b)
    t.equal(c.outerHTML, expected)
    t.end()
  })

  t.test('nested with id', function (t) {
    var child = html`<div id="child"></div>`
    var placeholder = html`<div id="child"></div>`
    placeholder.isSameNode = function (el) { return el === child }

    var a = html`<div><div id="parent">${child}</div></div>`
    var b = html`<div><div id="parent">${placeholder}</div></div>`

    var c = nanomorph(a, b)
    t.equal(c.children[0].children[0], child, 'is the same node')
    t.end()
  })

  t.test('nested without id', function (t) {
    var child = html`<div id="child">child</div>`
    var placeholder = html`<div id="child">placeholder</div>`
    placeholder.isSameNode = function (el) { return el === child }

    var a = html`<div><div>${child}</div></div>`
    var b = html`<div><div>${placeholder}</div></div>`

    var c = nanomorph(a, b)
    t.equal(c.children[0].children[0], child, 'is the same node')
    t.end()
  })
})
