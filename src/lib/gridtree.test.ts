import * as test from 'tape';
import GridTree from './gridtree';

class Network {
    handlers: any;
    remote: Network;

    constructor() {
        this.handlers = {};
    }

    bind(network:Network) {
        this.remote = network;
    }

    get(msg) {
        Object.keys(this.handlers).forEach(key => {
            this.handlers[key](msg);
        });
    }

    send(msg) {
        this.remote.get(msg);
    }

    addHandler(name, handler) {
        this.handlers[name] = handler;
    }

    removeHandler(name) {
        delete this.handlers[name];
    }
}

test('Grid Tree even works', (t) => {
    t.plan(1);
    const g1 = new GridTree();
    const n1 = new Network();
    const g2 = new GridTree();
    const n2 = new Network();

    n1.bind(n2);
    n2.bind(n1);

    g1.startNetwork(n1);
    g2.startNetwork(n2);

    g1.Add(1, true);
   
    t.equal(g1.children[1], g2.children[1]);
});

