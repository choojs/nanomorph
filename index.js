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
  // 1) save nodes
  var oldChildren = []
  for (var i = 0; i < oldNode.childNodes.length; i++) {
    oldChildren.push({ node: oldNode.childNodes[i], new: null })
  }
  var newChildren = []
  for (i = 0; i < newNode.childNodes.length; i++) {
    newChildren.push({ node: newNode.childNodes[i], old: null })
  }

  // 2) map new to old children
  for (i = 0; i < newChildren.length; i++) {
    var newChild = newChildren[i]

    // 2.1) find matching old child
    if (newChild.node.id && document.body.contains(newChild.node)) {
      // 2.1.1) by id if mounted
      newChild.old = document.getElementById(newChild.node.id)
    } else {
      for (var j = 0; j < oldChildren.length; j++) {
        var oldChild = oldChildren[j]
        if (
          // 2.1.1) by id
          (oldChild.node.id && oldChild.node.id === newChild.node.id) ||
          // 2.1.2) by .isSameNode check
          (oldChild.node.isSameNode && oldChild.node.isSameNode(newChild.node)) ||
          // 2.1.3) same text node
          (oldChild.node.nodeType === TEXT_NODE && oldChild.node.nodeValue === newChild.node.nodeValue)
        ) {
          newChild.old = oldChild
          oldChild.new = newChild
          break
        }
      }
    }
  }

  // 3) insert new children
  for (i = 0; i < newChildren.length; i++) {
    newChild = newChildren[i]
    if (newChild.old) continue
    newChild.old = oldChildren[i]
    insertAt(oldNode, newChild.node, i)
  }

  // 4) morph
  for (i = 0; i < newChildren.length; i++) {
    newChild = newChildren[i]
    oldChild = newChild.old
    if (!oldChild) continue
    var morphed = walk(newChild.node, oldChild.node)
    if (morphed !== oldChild.node) {
      oldNode.replaceChild(morphed, oldChild.node)
    }
  }

  // 5) remove old children
  for (i = 0; i < oldChildren.length; i++) {
    if (!oldChildren[i].new) oldNode.removeChild(oldChildren[i].node)
  }

  // 6) reorder
  for (i = 0; i < newChildren.length; i++) {
    newChild = newChildren[i]
    oldChild = newChild.old
    if (!oldChild || oldChildren.indexOf(oldChild) === i) continue
    insertAt(oldNode, newChild.node, i)
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
