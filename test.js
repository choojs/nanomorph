const test = require('tape')
const nanodiff = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(nanodiff)
})
