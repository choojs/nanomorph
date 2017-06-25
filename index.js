var assert = require('assert')
var morph = require('./lib/morph')

var TEXT_NODE = 3
var debug = true

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
  if (debug) console.log(
    'nanomorph\nold\n  %s\nnew\n  %s',
    oldTree && oldTree.outerHTML,
    newTree && newTree.outerHTML
  )
  assert.equal(typeof oldTree, 'object', 'nanomorph: oldTree should be an object')
  assert.equal(typeof newTree, 'object', 'nanomorph: newTree should be an object')
  var tree = walk(newTree, oldTree)
  if (debug) console.log('=> morphed\n  %s', tree.outerHTML)
  return tree
}

// Walk and morph a dom tree
function walk (newNode, oldNode) {
  if (debug) console.log(
    'walk\nold\n  %s\nnew\n  %s',
    oldNode && oldNode.outerHTML,
    newNode && newNode.outerHTML
  )
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
  if (debug) console.log(
    'updateChildren\nold\n  %s\nnew\n  %s',
    oldNode && oldNode.outerHTML,
    newNode && newNode.outerHTML
  )
  var oldChild, newChild, morphed, oldMatch
  var offset = 0
  for (var i = 0; ; i++) {
    oldChild = oldNode.childNodes[i]
    newChild = newNode.childNodes[i - offset]
    if (debug) console.log(
      '===\n- old\n  %s\n- new\n  %s',
      oldChild && oldChild.outerHTML,
      newChild && newChild.outerHTML
    )
    if (!oldChild && !newChild) {
      break
    } else if (!newChild) {
      oldNode.removeChild(oldChild)
      i--
    } else if (!oldChild) {
      oldNode.appendChild(newChild)
      offset++
    } else if (same(newChild, oldChild)) {
      morphed = walk(newChild, oldChild)
      if (morphed !== oldChild) {
        oldNode.replaceChild(morphed, oldChild)
        offset++
      }
    } else {
      oldMatch = null
      for (var j = i; j < oldNode.childNodes.length; j++) {
        if (same(oldNode.childNodes[j], newChild)) {
          oldMatch = oldNode.childNodes[j]
          break
        }
      }
      if (oldMatch) {
        morphed = walk(newChild, oldMatch)
        if (morphed !== oldMatch) offset++
        oldNode.insertBefore(morphed, oldChild)
      } else {
        oldNode.insertBefore(newChild, oldChild)
        offset++
      }
    }
  }
}

function same (a, b) {
  if (a.id) return a.id === b.id
  if (a.isSameNode) return a.isSameNode(b)
  if (a.tagName !== b.tagName) return false
  if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue
  return false
}
