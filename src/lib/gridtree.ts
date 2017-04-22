import { JoshuaTree } from './joshuatree';
import * as uuid from 'uuid';

interface TreeUpdate {
    add: boolean;
    location: number[];
    payload?: any;
}

interface Remote {
    send(msgs: any);
}

export default class GridTree extends JoshuaTree {
    id: string;
    messages: TreeUpdate[];
    parent: GridTree;
    net: any;

    constructor() {
        super();

        if(!this.parent) {
            this.messages = [];
        } 
    }

    startNetwork(network: any) {
        this.net = network;
        this.id = uuid.v4();
        this.net.addHandler(this.id, (msg) => {
            if(msg.type === this.net.MessageType.TREE) {
                msg.payload.forEach((msg: TreeUpdate) => {
                    this.onMessage(msg);
                })
            }
        });
    }

    stopNetwork() {
        this.net.removeHandler(this.id);
    }

    onMessage(msg: TreeUpdate) {
        const loc = msg.location.pop();
        if(msg.location.length > 0) {
            this.children[loc].onMessage(msg);
        } 
        else {
            if(msg.add) {
                this.Add(loc, msg.payload);
            } else {
                this.Remove(loc);
            }
        }
    }

    AddMessage(msg: TreeUpdate) {
        msg.location.unshift(this.key);

        if(this.parent) {
            this.parent.AddMessage(msg);
        }
        else {
            this.messages.push(msg);
        }
    }

    Remove(key: number): boolean {
        this.AddMessage({
            add: false,
            location: []
        });

        return super.Remove(key);
    }

    Add(key: number, child: JoshuaTree | any, force?: boolean): boolean {
        this.AddMessage({
            add: true,
            location: [],
            payload: child
        });

        return super.Add(key, child, force);
    }

    Sync() {
        if(!this.parent && this.net) {
            this.net.send({
                type: this.net.MessageType.TREE,
                payload: this.messages
            });

            this.messages = [];
        }
    }
}