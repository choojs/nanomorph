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
  if (!newNode.childNodes || !oldNode.childNodes) return

  var oldIndex = 0    // keep track of the array of old nodes
  var newStartIndex
  var oldChildNode
  var oldId

  // Iterate over all old child nodes, and make sure they
  for (; oldIndex < oldNode.childNodes.length; oldIndex++) {
    oldChildNode = oldNode.childNodes[oldIndex]
    oldId = oldChildNode.id
    findNewChild()
  }

  // Append all remaining nodes from the new node onto the old node
  while (newNode.childNodes.length) {
    oldNode.appendChild(newNode.childNodes[0])
  }

  function findNewChild () {
    for (var newIndex = 0; newIndex < newNode.childNodes.length; newIndex++) {
      var currentChild = newNode.childNodes[newIndex]

      if (oldId === currentChild.id) {
        // Found child in new list, add the missing ones
        var newChildNode = walk(currentChild, oldChildNode)

        // The old node couldn't be morphed,
        // replace the old node with the new node
        if (newChildNode !== oldChildNode) {
          oldNode.replaceChild(newChildNode, oldChildNode)
        }

        return
      }
    }

    oldNode.removeChild(oldChildNode)
    oldIndex--
  }
}
