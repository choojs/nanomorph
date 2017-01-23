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
      t.throws(morph, /newTree/)
      t.throws(morph.bind(null, {}), /oldTree/)
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

        var res = morph(newTree, oldTree)
        var expected = '<div>hello world</div>'
        t.equal(String(res), expected, 'result was expected')
      })

      t.test('should morph a node', function (t) {
        t.plan(1)

        var oldTree = html`<p>hello world</p>`
        var newTree = html`<p>hello you</p>`

        var res = morph(newTree, oldTree)
        var expected = '<p>hello you</p>'
        t.equal(String(res), expected, 'result was expected')
      })

      t.test('should morph a node with namespaced attribute', function (t) {
        t.plan(1)

        var oldTree = html`<svg><use xlink:href="#heybooboo"></use></svg>`
        var newTree = html`<svg><use xlink:href="#boobear"></use></svg>`

        var res = morph(newTree, oldTree)
        var expected = '<svg><use xlink:href="#boobear"></use></svg>'
        t.equal(String(res), expected, 'result was expected')
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

        var res = morph(newTree, oldTree)
        var expected = '<main><div>hello world</div></main>'
        t.equal(String(res), expected, 'result was expected')
      })

      t.test('should replace a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello world</p></main>
        `
        var newTree = html`
          <main><p>hello you</p></main>
        `

        var res = morph(newTree, oldTree)
        var expected = '<main><p>hello you</p></main>'
        t.equal(String(res), expected, 'result was expected')
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

        var res = morph(newTree, oldTree)
        var expected = '<main><p>hello you</p></main>'
        t.equal(String(res), expected, 'result was expected')
      })

      t.test('should remove a node', function (t) {
        t.plan(1)

        var oldTree = html`
          <main><p>hello you</p></main>
        `

        var newTree = html`
          <main></main>
        `

        var res = morph(newTree, oldTree)
        var expected = '<main></main>'
        t.equal(String(res), expected, 'result was expected')
      })
    })

    t.test('events', function (t) {
      t.test('should copy onclick events', function (t) {
        t.plan(2)
        var oldTree = html`
          <button
            onclick=${function () {
              t.ok(true)
            }}
          >
            TEST
          </button>`
        var newTree = html`<button>UPDATED</button>`
        var res = morph(newTree, oldTree)
        t.ok(typeof res.onclick === 'function')
        res.onclick()
      })

      t.test('should copy onsubmit events', function (t) {
        var oldTree = html`
          <form
            onsubmit=${function () { t.ok(false) }}
          >
            <button>Sup</button>
          </form>`
        var newTree = html`<form>
            <button>Sup</button>
        </form>`
        var res = morph(newTree, oldTree)
        t.ok(typeof res.onsubmit === 'function')
        t.end()
      })
    })

    t.test('values', function (t) {
      t.test('should be copied to new tree when it has no value', function (t) {
        t.plan(1)
        var oldTree = html`<input type="text" />`
        oldTree.value = 'howdy'
        var newTree = html`<input type="text" />`
        var res = morph(newTree, oldTree)
        t.equal(res.value, 'howdy')
      })

      t.test('should be copied to old tree when new tree has a value', function (t) {
        t.plan(1)
        var oldTree = html`<input type="text" />`
        oldTree.value = 'howdy'
        var newTree = html`<input type="text" />`
        newTree.value = 'hi'
        var res = morph(newTree, oldTree)
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
        var res = morph(newTree, oldTree)
        t.equal(res.childNodes[0].data, 'YOLO')
      })

      t.test('should return newTree if false', function (t) {
        t.plan(1)
        var oldTree = html`<div>YOLO</div>`
        var newTree = html`<div>FOMO</div>`
        newTree.isSameNode = function (el) {
          return false
        }
        var res = morph(newTree, oldTree)
        t.equal(res.childNodes[0].data, 'FOMO')
      })
    })

    t.test('lists', function (t) {
      t.test('should append nodes', function (t) {
        t.plan(1)

        var oldTree = html`<ul></ul>`
        var newTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`

        var res = morph(newTree, oldTree)
        var expected = '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'
        t.equal(String(res), expected, 'result was expected')
      })

      t.test('should remove nodes', function (t) {
        t.plan(1)

        var oldTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
        var newTree = html`<ul></ul>`

        var res = morph(newTree, oldTree)
        var expected = '<ul></ul>'
        t.equal(String(res), expected, 'result was expected')
      })
    })

    t.test('should replace nodes', function (t) {
      t.plan(1)
      var tree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`

      var newTree = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      var expected = '<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>'

      tree = nanomorph(newTree, tree)
      t.equal(String(tree), expected, 'result was expected')
    })

    t.test('should replace nodes after multiple iterations', function (t) {
      t.plan(2)

      var tree = html`<ul></ul>`
      var newTree = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      var expected = '<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'

      tree = nanomorph(newTree, tree)
      t.equal(String(tree), expected, 'result was expected')

      newTree = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      expected = '<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>'

      tree = nanomorph(newTree, tree)
      t.equal(String(tree), expected, 'result was expected')
    })
  })
}
