const xtend = require('xtend')
const empty = {}

module.exports = morph

// diff elements and apply the resulting patch to the old node
// todo (yw): copy over events
// todo (yw): investigate what else to copy over
// (obj, obj) -> null
function morph (newNode, oldNode) {
  copyAttrs(newNode, oldNode)
  copyAttrsNS(newNode, oldNode)

  if (newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue
  if (newNode.data) oldNode.data = newNode.data
}

function copyAttrs (newNode, oldNode) {
  const newAttrs = newNode.attributes
  const oldAttrs = oldNode.attributes
  const props = xtend(newAttrs, oldAttrs)

  Object.keys(props).forEach(function (attrName) {
    const newKv = newAttrs[attrName] || empty
    const newName = newKv.name
    const newVal = newKv.value

    const oldKv = oldAttrs[attrName] || empty
    const oldName = oldKv.name
    const oldVal = oldKv.value

    if (newVal === undefined) {
      removeAttribute(oldNode, oldName, oldVal)
    } else if (oldVal !== undefined || newVal !== oldVal) {
      setAttribute(oldNode, newName, newVal)
    }
  })
}

function copyAttrsNS (newNode, oldNode) {
  const newAttrs = newNode._attributes
  const oldAttrs = oldNode._attributes
  const props = xtend(newAttrs, oldAttrs)

  Object.keys(props).forEach(function (namespace) {
    const vo = props[namespace]
    Object.keys(vo).forEach(function (attrName) {
      const newKv = newAttrs[namespace][attrName] || empty
      const newName = `${newKv.prefix}:${attrName}`
      const newVal = newKv.value
      const oldKv = oldAttrs[namespace][attrName] || empty
      const oldName = `${oldKv.prefix}:${attrName}`
      const oldVal = oldKv.value

      if (newVal === undefined) {
        removeAttributeNS(oldNode, oldName, oldVal, namespace)
      } else if (oldVal !== undefined || newVal !== oldVal) {
        setAttributeNS(oldNode, newName, newVal, namespace)
      }
    })
  })
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

function setAttributeNS (target, name, value, namespace) {
  if (typeof value === 'boolean') {
    if (value) {
      target.setAttributeNS(namespace, name, value)
      target[name] = true
    } else {
      target[name] = false
    }
  } else {
    target.setAttributeNS(namespace, name, value)
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

function removeAttributeNS (target, name, value, namespace) {
  if (typeof value === 'boolean') {
    target.removeAttributeNS(namespace, name)
    target[name] = false
  } else {
    target.removeAttributeNS(namespace, name)
  }
}
