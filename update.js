var nanomorph = require('./')

module.exports = create

function create (initialTree) {
  var tree = initialTree

  return function update (newTree) {
    var oldTree = tree
    tree = nanomorph(newTree, tree)
    if (newTree === oldTree) {
      return tree
    } else {
      oldTree.parentNode.replaceChild(tree, oldTree)
      return tree
    }
  }
}
