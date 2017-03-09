var events = require('./events')
var xtend = require('xtend')

var eventsLength = events.length
var empty = {}

module.exports = morph

// diff elements and apply the resulting patch to the old node
// (obj, obj) -> null
function morph (newNode, oldNode) {
  copyAttrs(newNode, oldNode)
  copyAttrsNS(newNode, oldNode)
  copyEvents(newNode, oldNode)
  copyValues(newNode, oldNode)

  if (newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue
  if (newNode.data) oldNode.data = newNode.data
}

function copyAttrs (newNode, oldNode) {
  var newAttrs = newNode.attributes
  var oldAttrs = oldNode.attributes
  var mergedAttrs = xtend(newAttrs, oldAttrs)

  Object.keys(mergedAttrs).forEach(function (attrName) {
    var newKv = newAttrs[attrName] || empty
    var newName = newKv.name
    var newVal = newKv.value

    var oldKv = oldAttrs[attrName] || empty
    var oldName = oldKv.name
    var oldVal = oldKv.value

    if (newVal === undefined) {
      removeAttribute(oldNode, oldName, oldVal)
    } else if (oldVal !== undefined || newVal !== oldVal) {
      setAttribute(oldNode, newName, newVal)
    }
  })
}

function copyAttrsNS (newNode, oldNode) {
  var newAttrs = newNode._attributes
  var oldAttrs = oldNode._attributes
  var mergedAttrs = xtend(newAttrs, oldAttrs)

  Object.keys(mergedAttrs).forEach(function (namespace) {
    var vo = mergedAttrs[namespace]

    Object.keys(vo).forEach(function (attrName) {
      var newKv = newAttrs[namespace][attrName] || empty
      var newName = newKv.prefix + ':' + attrName
      var newVal = newKv.value
      var oldKv = oldAttrs[namespace][attrName] || empty
      var oldName = oldKv.prefix + ':' + attrName
      var oldVal = oldKv.value

      if (newVal === undefined) {
        removeAttributeNS(oldNode, oldName, oldVal, namespace)
      } else if (oldVal !== undefined || newVal !== oldVal) {
        setAttributeNS(oldNode, newName, newVal, namespace)
      }
    })
  })
}

function copyEvents (newNode, oldNode) {
  for (var i = 0; i < eventsLength; i++) {
    var ev = events[i]
    if (newNode[ev]) {           // if new element has a whitelisted attribute
      oldNode[ev] = newNode[ev]  // update existing element
    } else if (oldNode[ev]) {    // if existing element has it and new one doesnt
      oldNode[ev] = undefined    // remove it from existing element
    }
  }
}

function copyValues (newNode, oldNode) {
  var oldValue = oldNode.value
  var newValue = newNode.value
  if ((oldNode.nodeName === 'INPUT' &&
       oldNode.type !== 'file') ||
       oldNode.nodeName === 'SELECT') {
    if (newValue !== oldValue) {
      oldNode.value = newValue
    }
  } else if (oldNode.nodeName === 'TEXTAREA') {
    if (newValue === null) {
      oldNode.value = newValue
    }
  }
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
