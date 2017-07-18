# detective

*This is a fork of [`detective`](https://www.npmjs.com/package/detective) which uses [Babylon](https://github.com/babel/babylon) parser instead of [`acorn`](https://www.npmjs.com/package/acorn).*

Finds all calls to `require()` by walking the AST.

# example

## strings

strings_src.js:

``` js
var a = require('a');
var b = require('b');
var c = require('c');
```

strings.js:

``` js
var detective = require('@zdychacek/detective');
var fs = require('fs');

var src = fs.readFileSync(__dirname + '/strings_src.js');
var requires = detective(src);
console.dir(requires);
```

output:

```
$ node examples/strings.js
[ 'a', 'b', 'c' ]
```

# methods

``` js
var detective = require('@zdychacek/detective');
```

## detective(src, opts)

Give some source body `src`, return an array of all the `require()` calls with
string arguments.

The options parameter `opts` is passed along to `detective.find()`.

## var found = detective.find(src, opts)

Give some source body `src`, return `found` with:

* `found.strings` - an array of each string found in a `require()`
* `found.expressions` - an array of each stringified expression found in a
`require()` call
* `found.nodes` (when `opts.nodes === true`) - an array of AST nodes for each
argument found in a `require()` call

Optionally:

* `opts.word` - specify a different function name instead of `"require"`
* `opts.nodes` - when `true`, populate `found.nodes`
* `opts.isRequire(node)` - a function returning whether an AST `CallExpression`
node is a require call
* `opts.parse` - supply options directly to
[babylon](https://npmjs.org/package/babylon) with some support for esprima-style
options `range` and `loc`.
* `opt.parse.plugins` - used to specify a list of `babylon` plugins

# install

With [npm](https://npmjs.org) do:

```
npm install @zdychacek/detective
```

# license

MIT
