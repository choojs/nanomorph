let tape = require('tape')
let html = require('nanohtml')

module.exports = abstractMorphEvents

function raiseEvent (element, eventName) {
  let event = document.createEvent('Event')
  event.initEvent(eventName, true, true)
  element.dispatchEvent(event)
}
/* Note:
Failing tests have been commented. They include the following:
  onfocusin
  onfocusout
  ontouchcancel
  ontouchend
  ontouchmove
  ontouchstart
  onunload
*/

function abstractMorphEvents (morph) {
  tape('events', function (t) {
    t.test('should have onabort events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onabort=${pass}></input>`

      raiseEvent(res, 'abort')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onabort events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onabort=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'abort')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onabort events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onabort=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'abort')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onblur events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onblur=${pass}></input>`

      raiseEvent(res, 'blur')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onblur events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onblur=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'blur')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onblur events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onblur=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'blur')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onchange events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onchange=${pass}></input>`

      raiseEvent(res, 'change')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onchange events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onchange=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'change')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onchange events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onchange=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'change')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onclick events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onclick=${pass}></input>`

      raiseEvent(res, 'click')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onclick events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onclick=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'click')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onclick events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onclick=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'click')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have oncontextmenu events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input oncontextmenu=${pass}></input>`

      raiseEvent(res, 'contextmenu')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy oncontextmenu events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input oncontextmenu=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'contextmenu')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy oncontextmenu events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input oncontextmenu=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'contextmenu')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondblclick events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondblclick=${pass}></input>`

      raiseEvent(res, 'dblclick')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondblclick events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondblclick=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dblclick')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondblclick events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondblclick=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dblclick')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondrag events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondrag=${pass}></input>`

      raiseEvent(res, 'drag')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondrag events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondrag=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'drag')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondrag events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondrag=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'drag')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondragend events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondragend=${pass}></input>`

      raiseEvent(res, 'dragend')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondragend events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondragend=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragend')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondragend events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondragend=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragend')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondragenter events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondragenter=${pass}></input>`

      raiseEvent(res, 'dragenter')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondragenter events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondragenter=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragenter')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondragenter events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondragenter=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragenter')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondragleave events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondragleave=${pass}></input>`

      raiseEvent(res, 'dragleave')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondragleave events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondragleave=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragleave')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondragleave events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondragleave=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragleave')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondragover events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondragover=${pass}></input>`

      raiseEvent(res, 'dragover')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondragover events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondragover=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragover')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondragover events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondragover=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragover')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondragstart events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondragstart=${pass}></input>`

      raiseEvent(res, 'dragstart')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondragstart events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondragstart=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragstart')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondragstart events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondragstart=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'dragstart')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have ondrop events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ondrop=${pass}></input>`

      raiseEvent(res, 'drop')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ondrop events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ondrop=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'drop')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ondrop events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ondrop=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'drop')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onerror events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onerror=${pass}></input>`

      raiseEvent(res, 'error')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onerror events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onerror=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'error')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onerror events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onerror=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'error')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onfocus events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onfocus=${pass}></input>`

      raiseEvent(res, 'focus')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onfocus events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onfocus=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focus')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onfocus events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onfocus=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focus')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    /*
    t.test('should have onfocusin events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onfocusin=${pass}></input>`

      raiseEvent(res, 'focusin')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onfocusin events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onfocusin=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focusin')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onfocusin events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onfocusin=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focusin')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */
    /*
    t.test('should have onfocusout events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onfocusout=${pass}></input>`

      raiseEvent(res, 'focusout')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onfocusout events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onfocusout=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focusout')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onfocusout events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onfocusout=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'focusout')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */
    t.test('should have oninput events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input oninput=${pass}></input>`

      raiseEvent(res, 'input')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy oninput events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input oninput=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'input')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy oninput events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input oninput=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'input')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onkeydown events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onkeydown=${pass}></input>`

      raiseEvent(res, 'keydown')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onkeydown events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onkeydown=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keydown')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onkeydown events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onkeydown=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keydown')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onkeypress events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onkeypress=${pass}></input>`

      raiseEvent(res, 'keypress')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onkeypress events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onkeypress=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keypress')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onkeypress events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onkeypress=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keypress')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onkeyup events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onkeyup=${pass}></input>`

      raiseEvent(res, 'keyup')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onkeyup events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onkeyup=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keyup')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onkeyup events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onkeyup=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'keyup')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmousedown events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmousedown=${pass}></input>`

      raiseEvent(res, 'mousedown')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmousedown events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmousedown=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mousedown')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmousedown events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmousedown=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mousedown')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmouseenter events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmouseenter=${pass}></input>`

      raiseEvent(res, 'mouseenter')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmouseenter events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmouseenter=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseenter')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmouseenter events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmouseenter=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseenter')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmouseleave events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmouseleave=${pass}></input>`

      raiseEvent(res, 'mouseleave')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmouseleave events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmouseleave=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseleave')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmouseleave events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmouseleave=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseleave')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmousemove events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmousemove=${pass}></input>`

      raiseEvent(res, 'mousemove')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmousemove events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmousemove=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mousemove')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmousemove events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmousemove=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mousemove')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmouseout events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmouseout=${pass}></input>`

      raiseEvent(res, 'mouseout')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmouseout events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmouseout=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseout')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmouseout events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmouseout=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseout')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmouseover events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmouseover=${pass}></input>`

      raiseEvent(res, 'mouseover')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmouseover events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmouseover=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseover')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmouseover events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmouseover=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseover')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onmouseup events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onmouseup=${pass}></input>`

      raiseEvent(res, 'mouseup')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onmouseup events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onmouseup=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseup')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onmouseup events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onmouseup=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'mouseup')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onreset events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onreset=${pass}></input>`

      raiseEvent(res, 'reset')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onreset events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onreset=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'reset')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onreset events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onreset=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'reset')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onresize events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onresize=${pass}></input>`

      raiseEvent(res, 'resize')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onresize events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onresize=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'resize')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onresize events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onresize=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'resize')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onscroll events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onscroll=${pass}></input>`

      raiseEvent(res, 'scroll')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onscroll events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onscroll=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'scroll')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onscroll events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onscroll=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'scroll')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onselect events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onselect=${pass}></input>`

      raiseEvent(res, 'select')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onselect events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onselect=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'select')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onselect events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onselect=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'select')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should have onsubmit events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input onsubmit=${pass}></input>`

      raiseEvent(res, 'submit')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onsubmit events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input onsubmit=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'submit')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onsubmit events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input onsubmit=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'submit')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    /*
    t.test('should have ontouchcancel events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ontouchcancel=${pass}></input>`

      raiseEvent(res, 'touchcancel')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ontouchcancel events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ontouchcancel=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchcancel')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ontouchcancel events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ontouchcancel=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchcancel')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */
    /*
    t.test('should have ontouchend events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ontouchend=${pass}></input>`

      raiseEvent(res, 'touchend')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ontouchend events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ontouchend=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchend')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ontouchend events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ontouchend=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchend')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */
    /*
    t.test('should have ontouchmove events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ontouchmove=${pass}></input>`

      raiseEvent(res, 'touchmove')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ontouchmove events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ontouchmove=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchmove')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ontouchmove events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ontouchmove=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchmove')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */
    /*
    t.test('should have ontouchstart events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<input ontouchstart=${pass}></input>`

      raiseEvent(res, 'touchstart')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy ontouchstart events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<input ontouchstart=${fail}></input>`
      let b = html`<input></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchstart')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy ontouchstart events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<input></input>`
      let b = html`<input ontouchstart=${pass}></input>`
      let res = morph(a, b)

      raiseEvent(res, 'touchstart')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    /*
    t.test('should have onunload events (html attribute) ', function (t) {
      t.plan(1)
      let expectationMet = false
      let res = html`<body onunload=${pass}></body>`

      raiseEvent(res, 'unload')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should not copy onunload events', function (t) {
      t.plan(1)
      let expectationMet = true
      let a = html`<body onunload=${fail}></body>`
      let b = html`<body></body>`
      let res = morph(a, b)

      raiseEvent(res, 'unload')

      function fail (e) {
        e.preventDefault()
        expectationMet = false
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    t.test('should copy onunload events (html attribute)', function (t) {
      t.plan(1)
      let expectationMet = false
      let a = html`<body></body>`
      let b = html`<body onunload=${pass}></body>`
      let res = morph(a, b)

      raiseEvent(res, 'unload')

      function pass (e) {
        e.preventDefault()
        expectationMet = true
      }

      t.equal(expectationMet, true, 'result was expected')
    })
    */

    t.end()
  })
}
