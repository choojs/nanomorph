var assert = require('assert')
var morph = require('./lib/morph')
var rootLabelRegex = /^data-onloadid/

var ELEMENT_NODE = 1

module.exports = nanomorph

// morph one tree into another tree
// (obj, obj) -> obj
// no parent
//   -> same: diff and walk children
//   -> not same: replace and return
// old node doesn't exist
//   -> insert new node
// new node doesn't exist
//   -> delete old node
// nodes are not the same
//   -> diff nodes and apply patch to old node
// nodes are the same
//   -> walk all child nodes and append to old node
function nanomorph (oldTree, newTree) {
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')

  persistStatefulRoot(newTree, oldTree)
  var tree = walk(newTree, oldTree)
  return tree
}

// walk and morph a dom tree
// (obj, obj) -> obj
function walk (newNode, oldNode) {
  if (!oldNode) {
    return newNode
  } else if (!newNode) {
    return null
  } else if (newNode === oldNode) {
    return oldNode
  } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
    return oldNode
  } else if (newNode.tagName !== oldNode.tagName) {
    return newNode
  } else {
    morph(newNode, oldNode)
    updateChildren(newNode, oldNode)
    return oldNode
  }
}

// update the children of elements
// (obj, obj) -> null
function updateChildren (newNode, oldNode) {
  var oldChildren = oldNode.childNodes
  var newChildren = newNode.childNodes
  if (!newChildren || !oldChildren) return

  var newIndex = 0
  for (var oldIndex = 0; oldIndex < oldChildren.length; oldIndex++) {
    var oldChildNode = oldChildren[oldIndex]
    var oldId = oldChildNode.id
    var newStartIndex = newIndex
    findNewChild()
  }
  while (newChildren[newIndex]) oldNode.appendChild(newChildren[newIndex])

  function findNewChild () {
    for (; newIndex < newChildren.length; newIndex++) {
      var currentChild = newChildren[newIndex]

      if (oldId === currentChild.id) {
        // found child in new list, add the missing ones
        var retChildNode = walk(currentChild, oldChildNode)
        if (retChildNode !== oldChildNode) {
          oldNode.replaceChild(retChildNode, oldChildNode)
          newIndex--
        }
        for (; newStartIndex < newIndex; newStartIndex++) {
          oldNode.insertBefore(newChildren[newStartIndex], oldChildNode)
          newIndex--
          oldIndex++
        }
        newIndex++
        return
      }
    }
    oldNode.removeChild(oldChildNode)
    oldIndex--
    newIndex = newStartIndex
  }
}

function persistStatefulRoot (newNode, oldNode) {
  if (!newNode || !oldNode || oldNode.nodeType !== ELEMENT_NODE || newNode.nodeType !== ELEMENT_NODE) return
  var oldAttrs = oldNode.attributes
  var attr, name
  for (var i = 0, len = oldAttrs.length; i < len; i++) {
    attr = oldAttrs[i]
    name = attr.name
    if (rootLabelRegex.test(name)) {
      newNode.setAttribute(name, attr.value)
      break
    }
  }
}
