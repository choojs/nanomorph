const test = require('tape')
const html = require('bel')
const nanomorph = require('./')

function strip (str) {
  return str.replace(/\s+/g, '')
}

test('nanomorph', (t) => {
  t.test('should assert input types', (t) => {
    t.plan(2)
    t.throws(nanomorph, /newTree/)
    t.throws(nanomorph.bind(null, {}), /oldTree/)
  })

  t.test('root level', (t) => {
    t.test('should replace a node', (t) => {
      t.plan(1)

      const oldTree = html`<p>hello world</p>`
      const newTree = html`<div>hello world</div>`

      const res = nanomorph(newTree, oldTree)
      const expected = '<div>hello world</div>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should morph a node', (t) => {
      t.plan(1)

      const oldTree = html`<p>hello world</p>`
      const newTree = html`<p>hello you</p>`

      const res = nanomorph(newTree, oldTree)
      const expected = '<p>hello you</p>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should ignore if node is same', (t) => {
      t.plan(1)

      const oldTree = html`<p>hello world</p>`

      const res = nanomorph(oldTree, oldTree)
      const expected = oldTree
      t.equal(res, expected, 'result was expected')
    })

    t.test('can copy over input type correctly', function (t) {
      t.plan(1)
      var expected = strip('<input type="password"/>')
      var oldTree = html`<input type="password">`
      var newTree = html`<input type="password">`
      const res = nanomorph(newTree, oldTree)
      t.equal(strip(String(res)), expected, 'nanomorph copied over input type correctly')
    })
  })

  t.test('nested', (t) => {
    t.test('should replace a node', (t) => {
      t.plan(1)

      const oldTree = html`
        <main><p>hello world</p></main>
      `
      const newTree = html`
        <main><div>hello world</div></main>
      `

      const res = nanomorph(newTree, oldTree)
      const expected = '<main><div>hello world</div></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should replace a node', (t) => {
      t.plan(1)

      const oldTree = html`
        <main><p>hello world</p></main>
      `
      const newTree = html`
        <main><p>hello you</p></main>
      `

      const res = nanomorph(newTree, oldTree)
      const expected = '<main><p>hello you</p></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should replace a node', (t) => {
      t.plan(1)

      const oldTree = html`
        <main><p>hello world</p></main>
      `

      const res = nanomorph(oldTree, oldTree)
      const expected = oldTree
      t.equal(res, expected, 'result was expected')
    })

    t.test('should append a node', (t) => {
      t.plan(1)

      const oldTree = html`
        <main></main>
      `
      const newTree = html`
        <main><p>hello you</p></main>
      `

      const res = nanomorph(newTree, oldTree)
      const expected = '<main><p>hello you</p></main>'
      t.equal(String(res), expected, 'result was expected')
    })

    t.test('should remove a node', (t) => {
      t.plan(1)

      const oldTree = html`
        <main><p>hello you</p></main>
      `

      const newTree = html`
        <main></main>
      `

      const res = nanomorph(newTree, oldTree)
      const expected = '<main></main>'
      t.equal(String(res), expected, 'result was expected')
    })
  })

  t.test('events', (t) => {
    t.test('should copy events', (t) => {
      const oldTree = html`
        <button
          onclick=${() => { t.ok(false) }}
        >
          TEST
        </button>`
      const newTree = html`<button>UPDATED</button>`
      const res = nanomorph(newTree, oldTree)
      t.ok(typeof res.onclick === 'function')
      t.end()
    })
  })

  t.test('values', (t) => {
    t.test('should copy input value', (t) => {
      t.plan(1)
      const el = html`<input type="text" />`
      el.value = 'hi'
      const newEl = html`<input type="text" />`
      nanomorph(el, newEl)
      t.equal(el.value, 'hi')
    })
  })

  t.test('svg', (t) => {
    t.test('should update namespaced attribute', (t) => {
      t.plan(1)
      const el = html`
        <svg>
          <use xlink:href='#boobear' />
        </svg>
      `
      const newEl = html`
        <svg>
          <use xlink:href='#heybooboo' />
        </svg>
      `
      const expected = '<svg><use xlink:href="#heybooboo"></use></svg>'

      var res = nanomorph(el, newEl)
      t.equal(strip(String(res)), strip(expected))
    })
  })
})
