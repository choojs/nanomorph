var test = require('tape')
var html = require('bel')
var nanomorph = require('./')

if (!module.parent) {
  specificTests(nanomorph)
  abstractMorph(nanomorph)
} else {
  module.exports = abstractMorph
}

function specificTests (morph) {
  test('nanomorph', function (t) {
    t.test('should assert input types', function (t) {
      t.plan(2)
      t.throws(morph, /oldTree/)
      t.throws(morph.bind(null, {}), /newTree/)
    })
  })
}

function abstractMorph (morph) {
  test('abstract morph', function (t) {
    t.test('root level', function (t) {
      t.test('should replace a node', function (t) {
        t.plan(1)

        var oldTree = html`<p>hello world</p>`
        var newTree = html`<div>hello world</div>`

        var res = morph(oldTree, newTree)
        var expected = '<div>hello world</div>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should morph a node', function (t) {
        t.plan(1)

        var oldTree = html`<p>hello world</p>`
        var newTree = html`<p>hello you</p>`

        var res = morph(oldTree, newTree)
        var expected = '<p>hello you</p>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should morph a node with namespaced attribute', function (t) {
        t.plan(1)

        var oldTree = html`<svg><use xlink:href="#heybooboo"></use></svg>`
        var newTree = html`<svg><use xlink:href="#boobear"></use></svg>`

        var res = morph(oldTree, newTree)
        var expected = '<svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#boobear"></use></svg>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should ignore if node is same', function (t) {
        t.plan(1)

        var oldTree = html`<p>hello world</p>`

        var res = morph(oldTree, oldTree)
        var expected = oldTree
        t.equal(res, expected, 'result was expected')
      })
    })

    t.test('nested', function (t) {
      t.test('should replace a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello world</p></main>
        `
        var newTree = html`
          <main><div>hello world</div></main>
        `

        var res = morph(oldTree, newTree)
        var expected = '<main><div>hello world</div></main>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should replace a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello world</p></main>
        `
        var newTree = html`
          <main><p>hello you</p></main>
        `

        var res = morph(oldTree, newTree)
        var expected = '<main><p>hello you</p></main>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should replace a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello world</p></main>
        `

        var res = morph(oldTree, oldTree)
        var expected = oldTree
        t.equal(res, expected, 'result was expected')
      })

      t.test('should append a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main></main>
        `
        var newTree = html`
          <main><p>hello you</p></main>
        `

        var res = morph(oldTree, newTree)
        var expected = '<main><p>hello you</p></main>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello you</p></main>
        `

        var newTree = html`
          <main></main>
        `

        var res = morph(oldTree, newTree)
        var expected = '<main></main>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })
    })

    t.test('events', function (t) {
      t.test('should copy onclick events', function (t) {
        t.plan(1)
        var oldTree = html`<button onclick=${fail}>OLD</button>`
        var newTree = html`<button>NEW</button>`
        var res = morph(oldTree, newTree)

        res.click()

        oldTree = html`<button>OLD</button>`
        newTree = html`<button onclick=${pass}>NEW</button>`
        res = morph(oldTree, newTree)

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
      t.test('if new tree has no value and old tree does, set value from new tree', function (t) {
        t.plan(2)
        var oldTree = html`<input type="text" value="howdy" />`
        var newTree = html`<input type="text" />`
        var res = morph(oldTree, newTree)
        t.equal(res.value, '')

        oldTree = html`<input type="text" value="howdy" />`
        newTree = html`<input type="text" value=${null} />`
        res = morph(oldTree, newTree)
        t.equal(res.value, '')
      })

      t.test('if new tree has value and old tree does too, set value from new tree', function (t) {
        t.plan(1)
        var oldTree = html`<input type="text" />`
        oldTree.value = 'howdy'
        var newTree = html`<input type="text" />`
        newTree.value = 'hi'
        var res = morph(oldTree, newTree)
        t.equal(res.value, 'hi')
      })
    })

    t.test('isSameNode', function (t) {
      t.test('should return oldTree if true', function (t) {
        t.plan(1)
        var oldTree = html`<div>YOLO</div>`
        var newTree = html`<div>FOMO</div>`
        newTree.isSameNode = function (el) {
          return true
        }
        var res = morph(oldTree, newTree)
        t.equal(res.childNodes[0].data, 'YOLO')
      })

      t.test('should return newTree if false', function (t) {
        t.plan(1)
        var oldTree = html`<div>YOLO</div>`
        var newTree = html`<div>FOMO</div>`
        newTree.isSameNode = function (el) {
          return false
        }
        var res = morph(oldTree, newTree)
        t.equal(res.childNodes[0].data, 'FOMO')
      })
    })

    t.test('lists', function (t) {
      t.test('should append nodes', function (t) {
        t.plan(1)

        var oldTree = html`<ul></ul>`
        var newTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`

        var res = morph(oldTree, newTree)
        var expected = '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })

      t.test('should remove nodes', function (t) {
        t.plan(1)

        var oldTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
        var newTree = html`<ul></ul>`

        var res = morph(oldTree, newTree)
        var expected = '<ul></ul>'
        t.equal(res.outerHTML, expected, 'result was expected')
      })
    })

    t.test('should replace nodes', function (t) {
      t.plan(1)
      var oldTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`

      var newTree = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      var expected = '<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>'

      oldTree = nanomorph(oldTree, newTree)
      t.equal(oldTree.outerHTML, expected, 'result was expected')
    })

    t.test('should replace nodes after multiple iterations', function (t) {
      t.plan(2)

      var oldTree = html`<ul></ul>`
      var newTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      var expected = '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'

      oldTree = nanomorph(oldTree, newTree)
      t.equal(oldTree.outerHTML, expected, 'result was expected')

      newTree = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      expected = '<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>'

      oldTree = nanomorph(oldTree, newTree)
      t.equal(oldTree.outerHTML, expected, 'result was expected')
    })
  })
}
