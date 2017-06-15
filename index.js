var assert = require('assert')
var morph = require('./lib/morph')

module.exports = nanomorph

// Morph one tree into another tree
//
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
  var tree = walk(newTree, oldTree)
  return tree
}

// Walk and morph a dom tree
function walk (newNode, oldNode) {
  if (!oldNode) {
    return newNode
  } else if (!newNode) {
    return null
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

// Update the children of elements
// (obj, obj) -> null
function updateChildren (newNode, oldNode) {
  // 1) remove all old children
  var oldChildren = []
  while (oldNode.firstChild) {
    oldChildren.push(oldNode.firstChild)
    oldNode.removeChild(oldNode.firstChild)
  }

  // 2) insert new or updated children
  // reverse iteration because we remove elements
  for (var i = newNode.childNodes.length - 1; i >= 0; i--) {
    var newChild = newNode.childNodes[i]
    var oldChild = null

    // 2.1) find matching old child
    if (newChild.id && document.body.contains(newChild)) {
      // 2.1.1) by id if mounted
      oldChild = document.getElementById(newChild.id)
    } else {
      for (var j = 0; j < oldChildren.length; j++) {
        var _oldChild = oldChildren[j]
        if (
          // 2.1.1) by id
          (_oldChild.id && _oldChild.id === newChild.id) ||
          // 2.1.2) by .isSameNode check
          (_oldChild.isSameNode && _oldChild.isSameNode(newChild))
        ) {
          oldChild = _oldChild
          break
        }
      }
    }

    // 2.2) update
    var insert = oldChild
      // 2.2.1) morph
      ? walk(newChild, oldChild)
      // 2.2.2) new
      : newChild
    // insertBefore because of reverse iteration
    if (oldNode.firstChild) {
      oldNode.insertBefore(insert, oldNode.firstChild)
    } else {
      oldNode.appendChild(insert)
    }
  }
}
