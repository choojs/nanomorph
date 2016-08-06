const assert = require('assert')

module.exports = nanomorph

// morph one tree into another tree
// (obj, obj) -> obj
function nanomorph (newTree, oldTree) {
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')

  // no parent
  //   -> same: diff and recurse children
  //   -> not same: replace and return
  // old node doesn't exist
  //   -> insert new node
  // new node doesn't exist
  //   -> delete old node
  // nodes are not the same
  //   -> diff nodes and apply patch to old node
  // nodes are the same
  //   -> tbd
  const newRoot = (function recurse (parent, newNode, oldNode, index) {
    if (!oldNode) {
      parent.appendChild(newNode)
    } else if (!newNode) {
      parent.removeChild(parent.childNodes[index])
    } else if (!compare(newNode, oldNode)) {
      return diff(newNode, oldNode)
    } else {
    }
  })(null, newTree, oldTree, 0)

  return newRoot

  function compare (newNode, oldNode) {
    return newNode === oldNode
  }

  // diff elements and apply the resulting patch to the old node
  // (obj, obj) -> null
  function diff (newNode, oldNode) {
    return newNode
  }
}
