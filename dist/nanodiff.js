(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.nanodiff = require('./index.js')

},{"./index.js":2}],2:[function(require,module,exports){
var defaultEvents = require('./update-events.js')

// Create a range object for efficently rendering strings to elements.
var range

var XHTML = 'http://www.w3.org/1999/xhtml'
var ELEMENT_NODE = 1
var TEXT_NODE = 3
var COMMENT_NODE = 8

function hasAttributeNS (el, namespaceURI, name) {
  return el.hasAttributeNS(namespaceURI, name)
}

function empty (o) {
  for (var k in o) {
    if (o.hasOwnProperty(k)) {
      return false
    }
  }
  return true
}

function toElement (str) {
  if (!range && document.createRange) {
    range = document.createRange()
    range.selectNode(document.body)
  }

  var fragment
  if (range && range.createContextualFragment) {
    fragment = range.createContextualFragment(str)
  } else {
    fragment = document.createElement('body')
    fragment.innerHTML = str
  }
  return fragment.childNodes[0]
}

var specialElHandlers = {
  /**
   * Needed for IE. Apparently IE doesn't think that "selected" is an
   * attribute when reading over the attributes using selectEl.attributes
   */
  OPTION: function (fromEl, toEl) {
    fromEl.selected = toEl.selected
    if (fromEl.selected) fromEl.setAttribute('selected', '')
    else fromEl.removeAttribute('selected', '')
  },
  /**
   * The "value" attribute is special for the <input> element since it sets
   * the initial value. Changing the "value" attribute without changing the
   * "value" property will have no effect since it is only used to the set the
   * initial value.  Similar for the "checked" attribute, and "disabled".
   */
  INPUT: function (fromEl, toEl) {
    fromEl.checked = toEl.checked
    if (fromEl.checked) fromEl.setAttribute('checked', '')
    else fromEl.removeAttribute('checked')

    if (fromEl.value !== toEl.value) fromEl.value = toEl.value
    if (!hasAttributeNS(toEl, null, 'value')) fromEl.removeAttribute('value')

    fromEl.disabled = toEl.disabled
    if (fromEl.disabled) fromEl.setAttribute('disabled', '')
    else fromEl.removeAttribute('disabled')
  },

  TEXTAREA: function (fromEl, toEl) {
    var newValue = toEl.value
    if (fromEl.value !== newValue) fromEl.value = newValue
    if (fromEl.firstChild) fromEl.firstChild.nodeValue = newValue
  }
}

/**
 * Returns true if two node's names and namespace URIs are the same.
 *
 * @param {Element} a
 * @param {Element} b
 * @return {boolean}
 */
function compareNodeNames (a, b) {
  return a.nodeName === b.nodeName &&
    a.namespaceURI === b.namespaceURI
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS (name, namespaceURI) {
  return !namespaceURI || namespaceURI === XHTML
    ? document.createElement(name)
    : document.createElementNS(namespaceURI, name)
}

/**
 * Loop over all of the attributes on the target node and make sure the original
 * DOM node has the same attributes. If an attribute found on the original node
 * is not on the new node then remove it from the original node.
 *
 * @param  {Element} fromNode
 * @param  {Element} toNode
 */
function morphAttrs (fromNode, toNode) {
  var attrs = toNode.attributes
  var i
  var attr
  var attrName
  var attrNamespaceURI
  var attrValue
  var fromValue

  for (i = attrs.length - 1; i >= 0; i--) {
    attr = attrs[i]
    attrName = attr.name
    attrValue = attr.value
    attrNamespaceURI = attr.namespaceURI

    if (attrNamespaceURI) {
      attrName = attr.localName || attrName
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName)
    } else {
      fromValue = fromNode.getAttribute(attrName)
    }

    if (fromValue !== attrValue) {
      if (attrNamespaceURI) {
        fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
      } else {
        fromNode.setAttribute(attrName, attrValue)
      }
    }
  }

  // Remove any extra attributes found on the original DOM element that
  // weren't found on the target element.
  attrs = fromNode.attributes

  for (i = attrs.length - 1; i >= 0; i--) {
    attr = attrs[i]
    if (attr.specified !== false) {
      attrName = attr.name
      attrNamespaceURI = attr.namespaceURI

      if (!hasAttributeNS(toNode, attrNamespaceURI, attrNamespaceURI ? attrName = attr.localName || attrName : attrName)) {
        fromNode.removeAttributeNode(attr)
      }
    }
  }
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren (fromEl, toEl) {
  var curChild = fromEl.firstChild
  while (curChild) {
    var nextChild = curChild.nextSibling
    toEl.appendChild(curChild)
    curChild = nextChild
  }
  return toEl
}

function getNodeKey (node) {
  return node.id
}

function morphdom (fromNode, toNode) {
  if (typeof toNode === 'string') {
    if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
      var toNodeHtml = toNode
      toNode = document.createElement('html')
      toNode.innerHTML = toNodeHtml
    } else {
      toNode = toElement(toNode)
    }
  }

  // XXX optimization: if the nodes are equal, don't morph them
  /*
  if (fromNode.isEqualNode(toNode)) {
    return fromNode
  }
  */

  var savedEls = {} // Used to save off DOM elements with IDs
  var unmatchedEls = {}
  var movedEls = []

  function removeNodeHelper (node, nestedInSavedEl) {
    var id = getNodeKey(node)
    // If the node has an ID then save it off since we will want
    // to reuse it in case the target DOM tree has a DOM element
    // with the same ID
    if (id) {
      savedEls[id] = node
    } else if (!nestedInSavedEl) {
    }

    if (node.nodeType === ELEMENT_NODE) {
      var curChild = node.firstChild
      while (curChild) {
        removeNodeHelper(curChild, nestedInSavedEl || id)
        curChild = curChild.nextSibling
      }
    }
  }

  function walkDiscardedChildNodes (node) {
    if (node.nodeType === ELEMENT_NODE) {
      var curChild = node.firstChild
      while (curChild) {
        // We only want to handle nodes that don't have an ID to avoid double
        // walking the same saved element.
        // Walk recursively
        if (!getNodeKey(curChild)) walkDiscardedChildNodes(curChild)
        curChild = curChild.nextSibling
      }
    }
  }

  function removeNode (node, parentNode, alreadyVisited) {
    parentNode.removeChild(node)
    if (alreadyVisited) {
      if (!getNodeKey(node)) walkDiscardedChildNodes(node)
    } else {
      removeNodeHelper(node)
    }
  }

  function morphEl (fromEl, toEl, alreadyVisited) {
    var toElKey = getNodeKey(toEl)
    // If an element with an ID is being morphed then it is will be in the final
    // DOM so clear it out of the saved elements collection
    if (toElKey) delete savedEls[toElKey]

    copyEvents(fromEl, toEl)
    morphAttrs(fromEl, toEl)

    if (fromEl.nodeName !== 'TEXTAREA') {
      var curToNodeChild = toEl.firstChild
      var curFromNodeChild = fromEl.firstChild
      var curToNodeId

      var fromNextSibling
      var toNextSibling
      var savedEl
      var unmatchedEl

      outer: while (curToNodeChild) {
        toNextSibling = curToNodeChild.nextSibling
        curToNodeId = getNodeKey(curToNodeChild)

        while (curFromNodeChild) {
          var curFromNodeId = getNodeKey(curFromNodeChild)
          fromNextSibling = curFromNodeChild.nextSibling

          if (!alreadyVisited) {
            if (curFromNodeId && (unmatchedEl = unmatchedEls[curFromNodeId])) {
              unmatchedEl.parentNode.replaceChild(curFromNodeChild, unmatchedEl)
              morphEl(curFromNodeChild, unmatchedEl, alreadyVisited)
              curFromNodeChild = fromNextSibling
              continue
            }
          }

          var curFromNodeType = curFromNodeChild.nodeType

          if (curFromNodeType === curToNodeChild.nodeType) {
            var isCompatible = false

            // Both nodes being compared are Element nodes
            if (curFromNodeType === ELEMENT_NODE) {
              if (compareNodeNames(curFromNodeChild, curToNodeChild)) {
                // We have compatible DOM elements
                if (curFromNodeId || curToNodeId) {
                  // If either DOM element has an ID then we
                  // handle those differently since we want to
                  // match up by ID
                  if (curToNodeId === curFromNodeId) {
                    isCompatible = true
                  }
                } else {
                  isCompatible = true
                }
              }

              if (isCompatible) {
                // We found compatible DOM elements so transform
                // the current "from" node to match the current
                // target DOM node.
                morphEl(curFromNodeChild, curToNodeChild, alreadyVisited)
              }
            // Both nodes being compared are Text or Comment nodes
            } else if (curFromNodeType === TEXT_NODE || curFromNodeType === COMMENT_NODE) {
              isCompatible = true
              // Simply update nodeValue on the original node to
              // change the text value
              curFromNodeChild.nodeValue = curToNodeChild.nodeValue
            }

            if (isCompatible) {
              curToNodeChild = toNextSibling
              curFromNodeChild = fromNextSibling
              continue outer
            }
          }

          // No compatible match so remove the old node from the DOM
          // and continue trying to find a match in the original DOM
          removeNode(curFromNodeChild, fromEl, alreadyVisited)
          curFromNodeChild = fromNextSibling
        }

        if (curToNodeId) {
          if ((savedEl = savedEls[curToNodeId])) {
            morphEl(savedEl, curToNodeChild, true)
            // We want to append the saved element instead
            curToNodeChild = savedEl
          } else {
            // The current DOM element in the target tree has an ID
            // but we did not find a match in any of the
            // corresponding siblings. We just put the target
            // element in the old DOM tree but if we later find an
            // element in the old DOM tree that has a matching ID
            // then we will replace the target element with the
            // corresponding old element and morph the old element
            unmatchedEls[curToNodeId] = curToNodeChild
          }
        }

        if (curToNodeChild.nodeType === ELEMENT_NODE &&
          (curToNodeId || curToNodeChild.firstChild)) {
          // The element that was just added to the original DOM may
          // have some nested elements with a key/ID that needs to be
          // matched up with other elements. We'll add the element to
          // a list so that we can later process the nested elements
          // if there are any unmatched keyed elements that were
          // discarded
          movedEls.push(curToNodeChild)
        }

        curToNodeChild = toNextSibling
        curFromNodeChild = fromNextSibling
      }

      // We have processed all of the "to nodes". If curFromNodeChild is
      // non-null then we still have some from nodes left over that need
      // to be removed
      while (curFromNodeChild) {
        fromNextSibling = curFromNodeChild.nextSibling
        removeNode(curFromNodeChild, fromEl, alreadyVisited)
        curFromNodeChild = fromNextSibling
      }
    }

    var specialElHandler = specialElHandlers[fromEl.nodeName]
    if (specialElHandler) {
      specialElHandler(fromEl, toEl)
    }
  } // END: morphEl(...)

  var morphedNode = fromNode
  var morphedNodeType = morphedNode.nodeType
  var toNodeType = toNode.nodeType

  // Handle the case where we are given two DOM nodes that are not
  // compatible (e.g. <div> --> <span> or <div> --> TEXT)
  if (morphedNodeType === ELEMENT_NODE) {
    if (toNodeType === ELEMENT_NODE) {
      if (!compareNodeNames(fromNode, toNode)) {
        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI))
      }
    } else {
      // Going from an element node to a text node
      morphedNode = toNode
    }
  } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
    if (toNodeType === morphedNodeType) {
      morphedNode.nodeValue = toNode.nodeValue
      return morphedNode
    } else {
      // Text node to something else
      morphedNode = toNode
    }
  }

  if (morphedNode === toNode) {
  } else {
    morphEl(morphedNode, toNode, false)

    /**
     * What we will do here is walk the tree for the DOM element that was
     * moved from the target DOM tree to the original DOM tree and we will
     * look for keyed elements that could be matched to keyed elements that
     * were earlier discarded.  If we find a match then we will move the
     * saved element into the final DOM tree.
     */
    var handleMovedEl = function (el) {
      var curChild = el.firstChild
      while (curChild) {
        var nextSibling = curChild.nextSibling

        var key = getNodeKey(curChild)
        if (key) {
          var savedEl = savedEls[key]
          if (savedEl && compareNodeNames(curChild, savedEl)) {
            curChild.parentNode.replaceChild(savedEl, curChild)
            // true: already visited the saved el tree
            morphEl(savedEl, curChild, true)
            curChild = nextSibling
            if (empty(savedEls)) {
              return false
            }
            continue
          }
        }

        if (curChild.nodeType === ELEMENT_NODE) {
          handleMovedEl(curChild)
        }

        curChild = nextSibling
      }
    }

    // The loop below is used to possibly match up any discarded
    // elements in the original DOM tree with elemenets from the
    // target tree that were moved over without visiting their
    // children
    if (!empty(savedEls)) {
      handleMovedElsLoop:
      while (movedEls.length) {
        var movedElsTemp = movedEls
        movedEls = []
        for (var i = 0; i < movedElsTemp.length; i++) {
          if (handleMovedEl(movedElsTemp[i]) === false) {
            // There are no more unmatched elements so completely end
            // the loop
            break handleMovedElsLoop
          }
        }
      }
    }

    // Fire the "onNodeDiscarded" event for any saved elements
    // that never found a new home in the morphed DOM
    for (var savedElId in savedEls) {
      if (savedEls.hasOwnProperty(savedElId)) {
        var savedEl = savedEls[savedElId]
        walkDiscardedChildNodes(savedEl)
      }
    }
  }

  if (morphedNode !== fromNode && fromNode.parentNode) {
    // If we had to swap out the from node with a new node because the old
    // node was not compatible with the target node then we need to
    // replace the old DOM node in the original DOM tree. This is only
    // possible if the original DOM node was part of a DOM tree which
    // we know is the case if it has a parent node.
    fromNode.parentNode.replaceChild(morphedNode, fromNode)
  }

  return morphedNode
}

module.exports = morphdom

function copyEvents (f, t) {
  // copy events:
  var events = defaultEvents
  for (var i = 0; i < events.length; i++) {
    var ev = events[i]
    if (t[ev]) { // if new element has a whitelisted attribute
      f[ev] = t[ev] // update existing element
    } else if (f[ev]) { // if existing element has it and new one doesnt
      f[ev] = undefined // remove it from existing element
    }
  }
  // copy values for form elements
  if ((f.nodeName === 'INPUT' && f.type !== 'file') || f.nodeName === 'TEXTAREA' || f.nodeName === 'SELECT') {
    if (t.getAttribute('value') === null) t.value = f.value
  }
}

},{"./update-events.js":3}],3:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}]},{},[1]);
