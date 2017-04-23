import {Uint64, JoshuaTree} from './lib/joshuatree';

let maxNum: Uint64 = new Uint64([4294967295, 4294967295]);
let zeroNum: Uint64 = new Uint64([0, 0]);
let highBit: number = 0x800000;


class Position {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    Add(other: Position){
        return new Position(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    toString(){
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    }
}

let maxDepth = 0;

export default class JTreeEntity{
    jtree: JoshuaTree;

    generateJTree(){
        this.jtree = new JoshuaTree();
        this.generateJTree_internal(this.jtree, 0);
    }
    generateJTree_internal(root: JoshuaTree, depth: number){
        if(depth > maxDepth){
            return;
        }
        
        for(let i = 63; i >= 0; --i){
            if(i%2 === 1){
                let jchild = new JoshuaTree(); 
                root.Add(i, jchild);
                this.generateJTree_internal(jchild, depth + 1);
            }
        }
    }

    // take the index of which bit a voxel is in
    // returns an un-scaled position (doesn't account for depth)
    indexToRelativePosition(index: number){
        return new Position(index % 4, Math.floor(index / 4) % 4, Math.floor(index / 16));
    }

    indexToScaledRelativePosition(index: number, depth: number){
        let scalePower = maxDepth - depth;
        let relPos = this.indexToRelativePosition(index);

        relPos.x *= Math.pow(4, scalePower);
        relPos.y *= Math.pow(4, scalePower);
        relPos.z *= Math.pow(4, scalePower);

        return relPos;
    }

    leafLoop(fn: (pos: Position) => void ,node: JoshuaTree, offset: Position){
        for(let i = 63; i >= 0; --i){
            let bitFlag = new Uint64();
            bitFlag.Set(i);

            if(!this.jtree.And(bitFlag).Empty()){
                fn(offset.Add(this.indexToRelativePosition(i)))
                //console.log('hit' + i);
            }
        }
    }

    depthLoop(fn: (pos: Position) => void, node: JoshuaTree, depth: number, offset: Position){
        if(depth > maxDepth){
            return;
        }

        if(node.Equals(maxNum)) {
            // Render a large cube
        } else if(node.Equals(zeroNum) ){
            // Skip this branch 
        } else {
            // Recurse or render leaf loop
            if(depth === maxDepth){
                this.leafLoop(fn, node, offset);
            } else {
                // Call depth node on each child
                Object.keys(this.jtree.children).forEach((childKey: string) => {
                    const child = this.jtree.children[childKey];
                    if(child instanceof JoshuaTree) {
                        let keynum = parseInt(childKey);
                        this.depthLoop(fn, child, depth + 1, offset.Add(this.indexToScaledRelativePosition(keynum, depth))); 
                    }    
                });
            }
        }
    }

    spawnCubes(spawnFunc: (pos: Position)=> void){
        this.depthLoop(spawnFunc, this.jtree, 0, new Position(0,0,0));
    }
}
