const xtend = require('xtend')

module.exports = morph

// diff elements and apply the resulting patch to the old node
// todo (yw): copy over events
// todo (yw): investigate what else to copy over
// (obj, obj) -> null
function morph (newNode, oldNode) {
  const newAttrs = newNode.attributes
  const oldAttrs = oldNode.attributes
  const props = xtend(newAttrs, oldAttrs)

  Object.keys(props).forEach(function (attrName) {
    const newVal = newAttrs[attrName]
    const oldVal = oldAttrs[attrName]

    if (!newVal) {
      removeAttribute(oldNode, attrName, oldVal)
    } else if (!oldVal || newVal !== oldVal) {
      setAttribute(oldNode, attrName, newVal)
    }
  })

  if (newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue
}

function setAttribute (target, name, value) {
  if (/^on/.test(name) || name === 'forceUpdate') {
    return
  } else if (name === 'className') {
    target.setAttribute('class', value)
  } else if (typeof value === 'boolean') {
    if (value) {
      target.setAttribute(name, value)
      target[name] = true
    } else {
      target[name] = false
    }
  } else {
    target.setAttribute(name, value)
  }
}

function removeAttribute (target, name, value) {
  if (/^on/.test(name) || name === 'forceUpdate') {
    return
  } else if (name === 'className') {
    target.removeAttribute('class')
  } else if (typeof value === 'boolean') {
    target.removeAttribute(name)
    target[name] = false
  } else {
    target.removeAttribute(name)
  }
}
