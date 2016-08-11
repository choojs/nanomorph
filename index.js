const morph = require('./morph')

module.exports = nanomorph

// walk and morph one dom tree into another dom tree
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
function nanomorph (newNode, oldNode) {
  if (!oldNode) {
    return newNode
  } else if (!newNode) {
    return null
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

  const newLength = newNode.childNodes.length
  const oldLength = oldNode.childNodes.length
  const length = Math.max(oldLength, newLength)

  for (var i = 0; i < length; i++) {
    const newChildNode = newNode.childNodes[i]
    const oldChildNode = oldNode.childNodes[i]
    const retChildNode = walk(newChildNode, oldChildNode)
    if (!retChildNode) {
      if (oldChildNode) oldNode.removeChild(oldChildNode)
    } else if (!oldChildNode) {
      if (retChildNode) oldNode.appendChild(retChildNode)
    } else if (retChildNode !== oldChildNode) {
      oldNode.replaceChild(retChildNode, oldChildNode)
    }
  }
}
