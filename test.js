var test = require('tape')
var html = require('bel')
var nanomorph = require('./')

test('nanomorph', (t) => {
  t.test('should assert input types', (t) => {
    t.plan(2)
    t.throws(nanomorph, /newTree/)
    t.throws(nanomorph.bind(null, {}), /oldTree/)
  })

  t.test('root level', (t) => {
    t.test('should replace a node', (t) => {
      t.plan(1)

      var oldTree = html`<p>hello world</p>`
      var newTree = html`<div>hello world</div>`

      var res = nanomorph(newTree, oldTree)
      var expected = '<div>hello world</div>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should morph a node', (t) => {
      t.plan(1)

      var oldTree = html`<p>hello world</p>`
      var newTree = html`<p>hello you</p>`

      var res = nanomorph(newTree, oldTree)
      var expected = '<p>hello you</p>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should morph a node with namespaced attribute', (t) => {
      t.plan(1)

      var oldTree = html`<svg><use xlink:href="#heybooboo"></use></svg>`
      var newTree = html`<svg><use xlink:href="#boobear"></use></svg>`

      var res = nanomorph(newTree, oldTree)
      var expected = '<svg><use xlink:href="#boobear"></use></svg>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should ignore if node is same', (t) => {
      t.plan(1)

      var oldTree = html`<p>hello world</p>`

      var res = nanomorph(oldTree, oldTree)
      var expected = oldTree
      t.equal(res, expected, 'result was expected')
    })
  })

  t.test('nested', (t) => {
    t.test('should replace a node', (t) => {
      t.plan(1)

      var oldTree = html`
        <main><p>hello world</p></main>
      `
      var newTree = html`
        <main><div>hello world</div></main>
      `

      var res = nanomorph(newTree, oldTree)
      var expected = '<main><div>hello world</div></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should replace a node', (t) => {
      t.plan(1)

      var oldTree = html`
        <main><p>hello world</p></main>
      `
      var newTree = html`
        <main><p>hello you</p></main>
      `

      var res = nanomorph(newTree, oldTree)
      var expected = '<main><p>hello you</p></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should replace a node', (t) => {
      t.plan(1)

      var oldTree = html`
        <main><p>hello world</p></main>
      `

      var res = nanomorph(oldTree, oldTree)
      var expected = oldTree
      t.equal(res, expected, 'result was expected')
    })

    t.test('should append a node', (t) => {
      t.plan(1)

      var oldTree = html`
        <main></main>
      `
      var newTree = html`
        <main><p>hello you</p></main>
      `

      var res = nanomorph(newTree, oldTree)
      var expected = '<main><p>hello you</p></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should remove a node', (t) => {
      t.plan(1)

      var oldTree = html`
        <main><p>hello you</p></main>
      `

      var newTree = html`
        <main></main>
      `

      var res = nanomorph(newTree, oldTree)
      var expected = '<main></main>'
      t.equal(String(res), expected, 'result was expected')
    })
  })

  t.test('events', (t) => {
    t.test('should copy onclick events', (t) => {
      t.plan(2)
      const oldTree = html`
        <button
          onclick=${() => {
            t.ok(true)
          }}
        >
          TEST
        </button>`
      const newTree = html`<button>UPDATED</button>`
      const res = nanomorph(newTree, oldTree)
      t.ok(typeof res.onclick === 'function')
      res.onclick()
    })

    t.test('should copy onsubmit events', (t) => {
      const oldTree = html`
        <form
          onsubmit=${() => { t.ok(false) }}
        >
          <button>Sup</button>
        </form>`
      const newTree = html`<form>
          <button>Sup</button>
      </form>`
      const res = nanomorph(newTree, oldTree)
      t.ok(typeof res.onsubmit === 'function')
      t.end()
    })
  })
})
