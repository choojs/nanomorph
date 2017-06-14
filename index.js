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
  var oldChildren = oldNode.childNodes
  var newChildren = newNode.childNodes

  if (!newChildren || !oldChildren) return

  var oldIndex = 0    // keep track of the array of old nodes
  var newIndex = 0    // keep track of the array of new nodes
  var newStartIndex
  var oldChildNode
  var oldId

  // Iterate over all old child nodes, and make sure they
  for (; oldIndex < oldChildren.length; oldIndex++) {
    oldChildNode = oldChildren[oldIndex]
    oldId = oldChildNode.id
    newStartIndex = newIndex
    findNewChild()
  }

  // Append all remaining nodes from the new array onto the old array
  while (newChildren[newIndex]) {
    oldNode.appendChild(newChildren[newIndex])
  }

  function findNewChild () {
    for (; newIndex < newChildren.length; newIndex++) {
      var currentChild = newChildren[newIndex]

      if (oldId === currentChild.id) {
        // Found child in new list, add the missing ones
        var newChildNode = walk(currentChild, oldChildNode)

        // The old node couldn't be morphed,
        // replace the old node with the new node
        if (newChildNode !== oldChildNode) {
          oldNode.replaceChild(newChildNode, oldChildNode)
          newIndex--
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
