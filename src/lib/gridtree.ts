import { JoshuaTree } from './joshuatree';

interface Message {
    add: boolean;
    location: number[];
    payload?: any;
}

interface Remote {
    send(msgs: Message[]);
}

class GridTree extends JoshuaTree {
    remote: Remote;
    messages: Message[];
    parent: GridTree;

    constructor(remote?: Remote) {
        super();

        if(!this.parent) {
            this.remote = remote;
            this.messages = [];
        } 
    }

    onMessage(msg: Message) {
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

    AddMessage(msg: Message) {
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
            this.remote.send(this.messages);
            this.messages = [];
        }
    }
}