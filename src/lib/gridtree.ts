import { JoshuaTree } from './joshuatree';
import net from './network';
import * as uuid from 'uuid';

interface TreeUpdate {
    add: boolean;
    location: number[];
    payload?: any;
}

interface Remote {
    send(msgs: any);
}

class GridTree extends JoshuaTree {
    id: string;
    messages: TreeUpdate[];
    parent: GridTree;

    constructor(remote?: Remote) {
        super();

        if(!this.parent) {
            this.messages = [];
        } 
    }

    startNetwork() {
        this.id = uuid.v4();
        net.addHandler(this.id, (msg) => {
            if(msg.type === net.MessageType.TREE) {
                msg.payload.forEach((msg: TreeUpdate) => {
                    this.onMessage(msg);
                })
            }
        });
    }

    stopNetwork() {
        net.removeHandler(this.id);
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
        if(!this.parent) {
            net.send({
                type: net.MessageType.TREE,
                payload: this.messages
            });
            
            this.messages = [];
        }
    }
}