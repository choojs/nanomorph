# nanomorph [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Hyper fast diffing algorithm for real DOM nodes :zap:

## Usage
```js
var morph = require('nanomorph')
var html = require('nanohtml')

var tree = html`<div>hello people</div>`
document.body.appendChild(tree)
// document.body === <body><div>hello people</div></body>

morph(tree, html`<div>nanananana-na-no</div>`)
// document.body === <body><div>nanananana-na-no</div></body>

morph(tree, html`<div>teeny, tiny, tin bottle</div>`)
// document.body === <body><div>teeny, tiny, tin bottle</div></body>
```

## Clearing Input Values
To remove values from inputs, there's a few options:
```js
html`<input class="beep" value=${null}>` // set the value to null
html`<input class="beep">`               // omit property all together
```

## Reordering Lists
It's common to work with lists of elements on the DOM. Adding, removing or
reordering elements in a list can be rather expensive. To optimize this you can
add an `id` attribute to a DOM node. When reordering nodes it will compare
nodes with the same ID against each other, resulting in far fewer re-renders.
This is especially potent when coupled with DOM node caching.

```js
var el = html`
  <section>
    <div id="first">hello</div>
    <div id="second">world</div>
  </section>
`
```

## Caching DOM elements
Sometimes we want to tell the algorithm to not evaluate certain nodes (and its
children). This can be because we're sure they haven't changed, or perhaps
because another piece of code is managing that part of the DOM tree. To achieve
this `nanomorph` evaluates the `.isSameNode()` method on nodes to determine if
they should be updated or not.

```js
var el = html`<div>node</div>`

// tell nanomorph to not compare the DOM tree if they're both divs
el.isSameNode = function (target) {
  return (target && target.nodeName && target.nodeName === 'DIV')
}
```

## Prevent Morphing Particular Elements
There are situations where two elements should never be morphed, but replaced.
`nanomorph` automatically does this for elements with different tag names. But if
we're implementing a custom component system, for example, components of
different types should probably be treated as if they had different tags—even
if they both render a `<div>` at their top level.

Nodes can have an optional `data-nanomorph-component-id` attribute. `nanomorph`
will only ever morph nodes if they both have the same value in this attribute.
If the values differ, the old node is replaced with the new one.

```js
var el = html`<div data-nanomorph-component-id="a">hello</div>`
var el2 = html`<div data-nanomorph-component-id="b">goodbye</div>`

assert.equal(nanomorph(el, el2), el2)
```

nanomorph doesn't have an opinion on the values of the `data-nanomorph-component-id`
attribute, so we can decide the meaning we give it on a case by case basis. There
could be a unique ID for every _type_ of component, or a unique ID for every
_instance_ of a component, or any other meaning.

## FAQ
### How is this different from morphdom?
It's quite similar actually; the API of this library is completely compatible
with `morphdom` and we've borrowed a fair few bits. The main difference is that
we copy event handlers like `onclick`, don't support browsers that are over a
decade old, and don't provide custom behavior by removing all hooks. This way
we can guarantee a consistent, out-of-the box experience for all your diffing
needs.

### Why doesn't this work in Node?
Node has no concept of a DOM - server side rendering is basically fancy string
concatenation. If you want to combine HTML strings in Node, check out
[hyperstream][hyperstream].

### This library seems cool, I'd like to build my own!
Nanomorph was optimized for simplicity, but different situations might require
different tradeoffs. So in order to allow folks to build their own
implementation we expose our test suite as a function you can call. So
regardless if you're doing it to solve a problem, or just for fun: you can use
the same tests we use for your own implementation. Yay! :sparkles:

## API
### tree = nanomorph(oldTree, newTree)
Diff a tree of HTML elements against another tree of HTML elements and create
a patched result that can be applied on the DOM.

:warning: nanomorph will modify the newTree and it should be discarded after use

## Installation
```sh
$ npm install nanomorph
```

## See Also
- [yoshuawuyts/nanoraf](https://github.com/yoshuawuyts/nanoraf)
- [yoshuawuyts/nanocomponent](https://github.com/yoshuawuyts/nanocomponent)
- [yoshuawuyts/nanotick](https://github.com/yoshuawuyts/nanotick)
- [bendrucker/document-ready](https://github.com/bendrucker/document-ready)
- [shama/on-load](https://github.com/shama/on-load)
- [choojs/nanohtml](https://github.com/choojs/nanohtml)

## Similar Packages
- [patrick-steele-idem/morphdom](https://github.com/patrick-steele-idem/morphdom)
- [tbranyen/diffhtml](https://github.com/tbranyen/diffhtml)

## Further Reading
- [how to write your own virtual dom 1][own-vdom-1]
- [how to write your own virtual dom 2][own-vdom-2]

## Authors
- [Kristofer Joseph](https://github.com/kristoferjoseph)
- [Yoshua Wuyts](https://github.com/yoshuawuyts)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanomorph.svg?style=flat-square
[3]: https://npmjs.org/package/nanomorph
[4]: https://img.shields.io/travis/choojs/nanomorph/master.svg?style=flat-square
[5]: https://travis-ci.org/choojs/nanomorph
[6]: https://img.shields.io/codecov/c/github/choojs/nanomorph/master.svg?style=flat-square
[7]: https://codecov.io/github/choojs/nanomorph
[8]: http://img.shields.io/npm/dm/nanomorph.svg?style=flat-square
[9]: https://npmjs.org/package/nanomorph
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard

[mt]: https://en.wikipedia.org/wiki/Merkle_tree
[own-vdom-1]: https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
[own-vdom-2]: https://medium.com/@deathmood/write-your-virtual-dom-2-props-events-a957608f5c76
[hyperstream]: https://github.com/substack/hyperstream
