var test = require('tap').test;
var detective = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/object-spread.js');

test('object-spread', function (t) {
    var opts = {
        parse: {
            plugins: [ 'objectRestSpread' ]
        }
    };
    t.plan(1);
    t.deepEqual(detective(src, opts), [ 'a' ]);
});
