var assert = require('assert')
var morph = require('./morph')

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
function nanomorph (newTree, oldTree) {
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')
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
  } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
    return oldNode
  } else if (newNode !== oldNode) {
    if (newNode.tagName !== oldNode.tagName) {
      return newNode
    } else {
      morph(newNode, oldNode)
      updateChildren(newNode, oldNode)
      return oldNode
    }
  } else {
    updateChildren(newNode, oldNode)
    return oldNode
  }
}

// update the children of elements
// (obj, obj) -> null
function updateChildren (newNode, oldNode) {
  if (!newNode.childNodes || !oldNode.childNodes) return

  var newLength = newNode.childNodes.length
  var oldLength = oldNode.childNodes.length
  var length = Math.max(oldLength, newLength)

  for (var i = 0; i < length; i++) {
    var newChildNode = newNode.childNodes[i]
    var oldChildNode = oldNode.childNodes[i]
    var retChildNode = walk(newChildNode, oldChildNode)
    if (!retChildNode) {
      if (oldChildNode) oldNode.removeChild(oldChildNode)
    } else if (!oldChildNode) {
      if (retChildNode) oldNode.appendChild(retChildNode)
    } else if (retChildNode !== oldChildNode) {
      oldNode.replaceChild(retChildNode, oldChildNode)
    }
  }
}
