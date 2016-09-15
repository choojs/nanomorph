const xtend = require('xtend')
const empty = {}

module.exports = morph

// diff elements and apply the resulting patch to the old node
// todo (yw): copy over events
// todo (yw): investigate what else to copy over
// (obj, obj) -> null
function morph (newNode, oldNode) {
  const newAttrs = newNode.attributes
  const oldAttrs = oldNode.attributes
  const props = xtend(newAttrs, oldAttrs)
  const keys = xtend(newNode, oldNode)

  Object.keys(keys).map(function (prop) {
    if (/^on/.test(prop)) {
      if (oldNode[prop]) {
        newNode[prop] = keys[prop]
      } else if (!newNode[prop]) {
        oldNode[prop] = undefined
      }
    }
  })

  Object.keys(props).forEach(function (attrName) {
    const newKv = newAttrs[attrName] || empty
    const newName = newKv.name
    const newVal = newKv.value

    const oldKv = oldAttrs[attrName] || empty
    const oldName = oldKv.name
    const oldVal = oldKv.value

    if (newVal !== undefined) {
      removeAttribute(oldNode, oldName, oldVal)
    } else if (oldVal !== undefined || newVal !== oldVal) {
      setAttribute(oldNode, newName, newVal)
    }
  })

  if (newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue
  if (newNode.data) oldNode.data = newNode.data
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
