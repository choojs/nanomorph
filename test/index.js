var tape = require('tape')

var abstractMorph = require('./diff')
var nanomorph = require('../')

if (!module.parent) {
  require('./fuzz')
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
