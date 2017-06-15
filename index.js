var assert = require('assert')
var morph = require('./lib/morph')

var TEXT_NODE = 3

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
  var oldChildren = []
  var oldChildrenToDelete = []
  for (var i = 0; i < oldNode.childNodes.length; i++) {
    oldChildren.push(oldNode.childNodes[i])
    oldChildrenToDelete.push(oldNode.childNodes[i])
  }
  var newChildren = []
  for (i = 0; i < newNode.childNodes.length; i++) {
    newChildren.push(newNode.childNodes[i])
  }

  // 2) insert new or updated children
  for (i = 0; i < newChildren.length; i++) {
    var newChild = newChildren[i]
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
          (_oldChild.isSameNode && _oldChild.isSameNode(newChild)) ||
          // 2.1.3) same text node
          (_oldChild.nodeType === TEXT_NODE && _oldChild.nodeValue === newChild.nodeValue)
        ) {
          oldChild = _oldChild
          break
        }
      }
    }

    var newIndex = i
    if (oldChild) {
      // mark as touched
      oldChildrenToDelete.splice(oldChildrenToDelete.indexOf(oldChild), 1)

      // 1) morph
      var morphed = walk(newChild, oldChild)
      if (morphed !== oldChild) {
        oldNode.replaceChild(morphed, oldChild)
      }

      // 2) reorder
      if (oldChildren.indexOf(oldChild) !== newIndex) {
        insertAt(oldNode, morphed, newIndex)
      }
    } else {
      insertAt(oldNode, newChild, newIndex)
    }
  }

  // remove children
  for (i = 0; i < oldChildrenToDelete.length; i++) {
    oldNode.removeChild(oldChildrenToDelete[i])
  }
}

function insertAt (container, el, idx) {
  if (idx === 0) {
    if (container.childNodes.length) {
      container.insertBefore(el, container.firstChild)
    } else {
      container.appendChild(el)
    }
  } else {
    if (idx === container.childNodes.length) {
      container.appendChild(el)
    } else {
      container.insertBefore(el, container.childNodes[idx])
    }
  }
}
