# nanodiff [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Embeddable DOM diffing algorithm. Currently a fork of [morphdom][morphdom] with
hooks and IE7 support removed, and event copying added, but will probably
change in the future.

## Usage
```js
const nanodiff = require('nanodiff')
const bel = require('bel')

var tree = null

var el1 = bel`<div>hello people</div>`
var el2 = bel`<div>nanananana-na-no</div>`
var el2 = bel`<div>teeny, tiny, tin bottle</div>`

update(el1)
update(el2)
update(el3)

function update (el) {
  if (!tree) {
    tree = el
    document.body.appendChild(tree)
  } else {
    tree = nanodiff(el, tree)
  }
}
```

## API
### tree = nanodiff(newTree, oldTree)
Diff a tree of HTML elements against another tree of HTML elements and create
a patched result that can be applied on the DOM.

## FAQ
### Why are you building this?
Experimentin' is fun - all this is is a take on seeing how small we can get
with real DOM node diffing. And if we can make some good heuristics happen for
efficient tree updates ([Merkle trees][mt], anyone?) that'd be nice.

## Installation
```sh
$ npm install nanodiff
```

## See Also
- [morphdom][morphdom]
- [yo-yo][yo-yo]
- [virtual-raf](https://github.com/yoshuawuyts/virtual-raf)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanodiff.svg?style=flat-square
[3]: https://npmjs.org/package/nanodiff
[4]: https://img.shields.io/travis/yoshuawuyts/nanodiff/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/nanodiff
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/nanodiff/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/nanodiff
[8]: http://img.shields.io/npm/dm/nanodiff.svg?style=flat-square
[9]: https://npmjs.org/package/nanodiff
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[morphdom]: https://github.com/patrick-steele-idem/morphdom
[yo-yo]: https://github.com/maxogden/yo-yo
[mt]: https://en.wikipedia.org/wiki/Merkle_tree
