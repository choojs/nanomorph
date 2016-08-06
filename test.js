const test = require('tape')
const html = require('bel')
const nanomorph = require('./')

test('nanomorph', (t) => {
  t.test('should assert input types', (t) => {
    t.plan(2)
    t.throws(nanomorph, /newTree/)
    t.throws(nanomorph.bind(null, {}), /oldTree/)
  })

  t.test('should replace a node one level deep', (t) => {
    t.plan(1)

    const oldTree = html`<p>hello world</p>`
    const newTree = html`<div>hello world</div>`

    const res = nanomorph(newTree, oldTree)
    const expected = '<div>hello world</div>'
    t.equal(String(res), expected, 'result was expected')
  })
})
