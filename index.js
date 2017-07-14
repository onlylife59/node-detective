var defined = require('defined');
var babylon = require('babylon');
var traverse = require('babel-traverse').default;

var requireRe = /\brequire\b/;

function parse (src, opts) {
    return babylon.parse(src, {
        sourceType: defined(opts.sourceType, 'module'),
        allowReturnOutsideFunction: defined(
            opts.allowReturnOutsideFunction, true
        ),
        plugins: defined(opts.plugins, []),
    });
}

var exports = module.exports = function (src, opts) {
    return exports.find(src, opts).strings;
};

exports.find = function (src, opts) {
    if (!opts) opts = {};
    if (!opts.parse) opts.parse = {};

    var word = opts.word === undefined ? 'require' : opts.word;
    if (typeof src !== 'string') src = String(src);

    var isRequire = opts.isRequire || function (node) {
        return node.callee.type === 'Identifier'
            && node.callee.name === word
        ;
    };

    var modules = { strings : [], expressions : [] };
    if (opts.nodes) modules.nodes = [];

    var wordRe = word === 'require' ? requireRe : RegExp('\\b' + word + '\\b');
    if (!wordRe.test(src)) return modules;

    var ast = parse(src, opts.parse);

    function visit ({ node, parent }) {
        var hasRequire = wordRe.test(src.slice(node.start, node.end));
        if (!hasRequire) return;
        if (node.type !== 'CallExpression') return;
        if (isRequire(node)) {
            if (node.arguments.length) {
                var arg = node.arguments[0];

                if (arg.type === 'StringLiteral') {
                    modules.strings.push(arg.value);
                }
                else {
                    modules.expressions.push(src.slice(arg.start, arg.end));
                }
            }
            if (opts.nodes) {
                if (opts.parse.range) {
                    node.range = [ node.start, node.end ];
                }

                modules.nodes.push(node);
            }
        }
    }

    traverse(ast, {
        Statement: visit,
        Expression: visit
    })

    return modules;
};
