export class Uint64 {
    data: Uint32Array;

    constructor(data: number[] = [0, 0]) {
        this.data = new Uint32Array(data);
    }

    Copy(from: Uint64): Uint64 {
        this.data[0] = from.data[0];
        this.data[1] = from.data[1];
        return this;
    }

    Xor(target: Uint64): Uint64 {
         return new Uint64([this.data[0] ^ target.data[0], this.data[1] ^ target.data[1]]);
    }

    Not(): Uint64 {
        return new Uint64([~this.data[0], ~this.data[1]]);
    }

    Or(target: Uint64): Uint64 {
        return new Uint64([this.data[0] | target.data[0], this.data[1] | target.data[1]]);
    }

    And(target: Uint64): Uint64 {
        return new Uint64([this.data[0] & target.data[0], this.data[1] & target.data[1]]);
    }

    Unset(location: number): Uint64 {
        if(location > 31) {
            location -= 32;
            this.data[1] &= (1 << location);
        } else {
            this.data[0] &= (1 << location);
        }

        return this;
    }

    Set(location: number): Uint64 {
        if(location > 31) {
            location -= 32;
            this.data[1] |= (1 << location);
        } else {
            this.data[0] |= (1 << location);
        }

        return this;
    }

    Empty(): boolean {
        return this.data[0] === 0 && this.data[1] === 0;
    }

    Equals(target: Uint64): boolean {
        return target.data[0] === this.data[0] && target.data[1] === this.data[1];
    }
}

export class JoshuaTree extends Uint64 {
    children: {[key: string]: JoshuaTree | any};
    parent: JoshuaTree;
    key: number;

    constructor(data?: number[]) {
        super(data);
        this.children = {};
    }

    FromJSON(json: any): JoshuaTree {
        this.parent = json.parent;
        Object.keys(json.children).forEach(key => {
            this.children[key] = new JoshuaTree().FromJSON(json['children'][key]);
        });

        return this;
    }

    Remove(key: number): boolean {
        if(this.children[key]) {
            const child = this.children[key];
            this.Copy(this.Xor(new Uint64().Set(key)));
            if(child instanceof JoshuaTree) {
                delete child.parent;
                delete child.key;
            }
            delete this.children[key];
            return true;
        }

        return false;
    }

    ToJSON(): string {
        return JSON.stringify(this);
    }

    Add(key: number, child: JoshuaTree | any, force?: boolean): boolean {
        if(!this.children[key]) {
            this.children[key] = child;
            if(child instanceof JoshuaTree) {
                child.parent = this;
                child.key = key;
            }
            this.Copy(this.Or(new Uint64().Set(key)));
            return true;
        } else if(force) {
            this.Remove(key);
            this.Add(key, child);
            return true;
        }

        return false;
    }

    ForEach(fn: (node: JoshuaTree, key?: string) => void, key?: string) {
        fn(this, key);
        
        Object.keys(this.children).forEach((childKey: string) => {
            const child = this.children[childKey];
            if(child instanceof JoshuaTree) {
                child.ForEach(fn, childKey);
            }    
        });
    }
}