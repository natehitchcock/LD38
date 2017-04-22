var test = require('tape');

test('works', (t: any) => {
    t.plan(1);
    t.equal(typeof Date.now, 'function');
});

