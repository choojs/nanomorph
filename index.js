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
  //   -> recurse all child nodes and append to old node
  const tree = (function recurse (newNode, oldNode, index) {
    if (!oldNode) {
      return newNode
    } else if (!newNode) {
      return null
    } else if (!compare(newNode, oldNode)) {
      return diff(newNode, oldNode)
    } else {
      const length = childLength(newNode, oldNode)
      const newChildren = []
      var i = 0
      for (; i++; i < length) {
        const newEl = recurse(newNode.childNodes, oldNode.childNodes, i)
        if (newEl) newChildren.push(newEl)
      }
      oldNode.innerHTML = '' // will this maintain the DOM state alright?
      oldNode.appendChild(newChildren)
      return oldNode
    }
  })(newTree, oldTree, 0)

  return tree
}

// compare if two nodes are equal
// (obj, obj) -> bool
function compare (newNode, oldNode) {
  return newNode === oldNode
}

// compute the longest child length of two nodes
// (obj, obj) -> num
function childLength (newNode, oldNode) {
  const newLength = newNode.childNodes.length
  const oldLength = oldNode.childNodes.length
  return Math.max(oldLength, newLength)
}

// diff elements and apply the resulting patch to the old node
// todo (yw): copy over events
// todo (yw): investigate what else to copy over
// (obj, obj) -> null
function diff (newNode, oldNode) {
  return newNode
}
