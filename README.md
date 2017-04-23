# nanomorph [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Hyper fast diffing algorithm for real DOM nodes :zap:

## Usage
```js
var morph = require('nanomorph')
var html = require('bel')

var tree = html`<div>hello people</div>`
tree = morph(tree, html`<div>nanananana-na-no</div>`)
tree = morph(tree, html`<div>teeny, tiny, tin bottle</div>`)
```

## Clearing Input Values
To remove values from inputs, there's a few options:
```js
html`<input class="beep" value=${null}>` // set the value to null
html`<input class="beep">`               // omit property all together
```

## Reordering Lists
[tbi]

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
- [shama/bel](https://github.com/shama/bel)

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

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanomorph.svg?style=flat-square
[3]: https://npmjs.org/package/nanomorph
[4]: https://img.shields.io/travis/yoshuawuyts/nanomorph/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/nanomorph
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/nanomorph/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/nanomorph
[8]: http://img.shields.io/npm/dm/nanomorph.svg?style=flat-square
[9]: https://npmjs.org/package/nanomorph
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard

[mt]: https://en.wikipedia.org/wiki/Merkle_tree
[own-vdom-1]: https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
[own-vdom-2]: https://medium.com/@deathmood/write-your-virtual-dom-2-props-events-a957608f5c76
[hyperstream]: https://github.com/substack/hyperstream
