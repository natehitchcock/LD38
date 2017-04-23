import {Uint64, JoshuaTree} from './lib/joshuatree';
import * as THREE from 'three';

let maxNum: Uint64 = new Uint64([0xFFFFFFFF, 0xFFFFFFFF]);
let zeroNum: Uint64 = new Uint64([0, 0]);
let highBit: number = 0x800000;

let maxDepth = 3;

// [TODO] refactor jtree to use RTT to detect leaf nodes instead of max depth
// [TODO] add defines for common 64 bit ints to Uint64

export default class JTreeEntity extends THREE.Object3D{
    material: THREE.Material;
    mergedGeometry: THREE.Geometry;// for mesh combininb impl
    jtree: JoshuaTree;

    constructor(material: THREE.Material){
        super();

        this.material = material;

        // bind self to spawn functions, since they are passed around
        this.spawnMergeCubes = this.spawnMergeCubes.bind(this);
    }

    generateJTree(){
        this.jtree = new JoshuaTree();
        this.generateJTree_internal(this.jtree, 0);
    }
    generateJTree_internal(root: JoshuaTree, depth: number){
        if(depth > maxDepth){
            return;
        }
        
        for(let i = 0; i < 64; ++i){
            if(i%2 === 1){
                let jchild = new JoshuaTree(); 
                root.Add(i, jchild);
                this.generateJTree_internal(jchild, depth + 1);
            }
        }
    }

    generateJTreeSphere(center: THREE.Vector3, radius: number){
        //console.log('generating voxels');
        this.jtree = new JoshuaTree();
        this.generateJTreeSphere_internal(center, radius, this.jtree, new THREE.Vector3(0, 0, 0), 0);
    }
    pointWithinSphere(center: THREE.Vector3, radius: number, point: THREE.Vector3): boolean{
        let dvec = new THREE.Vector3().copy(point);
        dvec = dvec.sub(center);
        let distance = dvec.length();
        //console.log(distance);

        return distance <= radius;
    }
    calculateCorners(corner: THREE.Vector3, extent: number):THREE.Vector3[]{
        let corners = [];

        let center = new THREE.Vector3().copy(corner).add(new THREE.Vector3(extent, extent, extent));
        //console.log('corner ' + corner.x + ', ' + corner.y + ', ' + corner.z + ' extent ' + extent);

        let cornerRUF = new THREE.Vector3().copy(center);
        cornerRUF.add(new THREE.Vector3(extent, extent, extent));
        corners.push(cornerRUF);
        let cornerLUF = new THREE.Vector3().copy(center);
        cornerLUF.add(new THREE.Vector3(-extent, extent, extent));
        corners.push(cornerLUF);
        let cornerRDF = new THREE.Vector3().copy(center);
        cornerRDF.add(new THREE.Vector3(extent, -extent, extent));
        corners.push(cornerRDF);
        let cornerLDF = new THREE.Vector3().copy(center);
        cornerLDF.add(new THREE.Vector3(-extent, -extent, extent));
        corners.push(cornerLDF);
        let cornerRUB = new THREE.Vector3().copy(center);
        cornerRUB.add(new THREE.Vector3(extent, extent, -extent));
        corners.push(cornerRUB);
        let cornerLUB = new THREE.Vector3().copy(center);
        cornerLUB.add(new THREE.Vector3(-extent, extent, -extent));
        corners.push(cornerLUB);
        let cornerRDB = new THREE.Vector3().copy(center);
        cornerRDB.add(new THREE.Vector3(extent, -extent, -extent));
        corners.push(cornerRDB);
        let cornerLDB = new THREE.Vector3().copy(center);
        cornerLDB.add(new THREE.Vector3(-extent, -extent, -extent));
        corners.push(cornerLDB);

        return corners;
    }
    generateJTreeSphere_internal(center: THREE.Vector3, radius: number, root: JoshuaTree, rootPosition: THREE.Vector3, depth: number){
        let childVoxExtent = this.getScaledExtent(depth + 1);
        //console.log('extent ' + childVoxExtent);

        if(depth > maxDepth){
            //console.log('too deep');
            return;
        }

        for(let i = 0; i < 64; ++i){
            let voxCorner = new THREE.Vector3().copy(rootPosition).add(this.indexToScaledRelativePosition(i, depth));
            let corners = this.calculateCorners(voxCorner, childVoxExtent);
            let voxCenter = new THREE.Vector3().copy(voxCorner).add(new THREE.Vector3(childVoxExtent, childVoxExtent, childVoxExtent));

            let totallyWithinSphere = true;
            let totallyOutsideSphere = true;
            corners.forEach((currentValue: THREE.Vector3, index: number, array: THREE.Vector3[]) => {
                //console.log('testing ' + currentValue.x +', ' + currentValue.y +', '+ currentValue.z + ' against ' 
                //+ center.x + ', ' + center.y + ', ' + center.z + ' r ' + radius);
                if(this.pointWithinSphere(center, radius, currentValue)){
                    totallyOutsideSphere = false;
                }
                else{
                    totallyWithinSphere = false;
                }
            });

            // [TODO] Check if the sphere is within the vox
            //let sphereWithinVox = false;

            if(totallyWithinSphere) {
                //console.log('full');
                let jchild = new JoshuaTree();
                jchild.Copy(maxNum); 
                root.Add(i, jchild);
            } else if(totallyOutsideSphere) {
                //console.log('empty');
            } else {
                //console.log('digging');
                let jchild = new JoshuaTree(); 
                root.Add(i, jchild);
                //console.log('new root at ' + voxCorner.x + ', ' + voxCorner.y + ', ' + voxCorner.z)
                this.generateJTreeSphere_internal(center, radius, jchild, voxCorner, depth + 1);
            }
        }
    }

    // take a depth, give back the scaled extent for that level
    // and since we have cubes, a single extent will do
    // extents are the distance from the center to a side
    // ASSUMPTION, the deepest depth of the tree has an extent of 0.5
    getScaledExtent(depth: number){
        let scalePower = (maxDepth + 1) - depth;
        return Math.pow(4, scalePower) / 2;
    }

    // take the index of which bit a voxel is in
    // returns an un-scaled position (doesn't account for depth)
    indexToRelativePosition(index: number){
        return new THREE.Vector3(index % 4, Math.floor(index / 4) % 4, Math.floor(index / 16));
    }

    indexToScaledRelativePosition(index: number, depth: number): THREE.Vector3{
        let scalePower = maxDepth - depth;
        let relPos = this.indexToRelativePosition(index);

        relPos.x *= Math.pow(4, scalePower);
        relPos.y *= Math.pow(4, scalePower);
        relPos.z *= Math.pow(4, scalePower);

        return relPos;
    }

    leafLoop(fn: (pos: THREE.Vector3, extent: number) => void ,node: JoshuaTree, offset: THREE.Vector3){
        for(let i = 0; i < 64; ++i){
            let bitFlag = new Uint64();
            bitFlag.Set(i);

            let extent = 0.5;
            if(!node.And(bitFlag).Empty()){
                let toff = new THREE.Vector3().copy(offset);
                toff.add(this.indexToRelativePosition(i));
                toff.add(new THREE.Vector3(extent, extent, extent));
                fn(toff, extent);
                //console.log('hit' + i);
            }
        }
    }

    depthLoop(fn: (pos: THREE.Vector3, extent: number) => void,
     node: JoshuaTree, depth: number, offset: THREE.Vector3){
        if(depth > maxDepth){
            return;
        }

        let voxExtent = this.getScaledExtent(depth);

        if(node.Equals(maxNum)) {
            // Render a large cube
            let toff = new THREE.Vector3().copy(offset);
            toff.add(new THREE.Vector3(voxExtent, voxExtent, voxExtent))
            fn(toff, voxExtent);
            //console.log('found whole cube');
        } else if(node.Equals(zeroNum) ){
            // Skip this branch 
        } else {
            // Recurse or render leaf loop
            if(depth === maxDepth ){
                this.leafLoop(fn, node, offset);
            } else {
                // Call depth node on each child
                Object.keys(node.children).forEach((childKey: string) => {
                    const child = node.children[childKey];
                    if(child instanceof JoshuaTree) {
                        let toff = new THREE.Vector3().copy(offset);
                        let keynum = parseInt(childKey);
                        //console.log(childKey);
                        this.depthLoop(fn, child, depth + 1,
                         toff.add(this.indexToScaledRelativePosition(keynum, depth))); 
                    }    
                });
            }
        }
    }

    spawnMergeCubes(pos: THREE.Vector3, extent: number){
        var newGeometry = new THREE.BoxGeometry( extent * 2, extent * 2, extent * 2);
        this.mergedGeometry.merge(newGeometry,new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z));
    }

    spawnCubes(){
        this.mergedGeometry = new THREE.Geometry();

        this.depthLoop(this.spawnMergeCubes, this.jtree, 0, new THREE.Vector3(0, 0, 0));
        
        let mergedMesh = new THREE.Mesh(this.mergedGeometry, this.material);
        this.add(mergedMesh);
    }

    calculateCenterOfMass(): THREE.Vector3{
        let centerOfMass = new THREE.Vector3(0, 0, 0);
        let totalMass = 0;
        this.depthLoop((pos: THREE.Vector3, extent:number)=>{
            // Calculate mass assuming uniform density
            // [IDEA] give voxels non-uniform density values, 
            //      and manipulate them when explosions 'n stuff happen
            let density = 1;
            let sideLen = extent * 2;
            let volume = sideLen * sideLen * sideLen;
            let mass = density * volume;

            let weightedPos = new THREE.Vector3().copy(pos).multiplyScalar(mass);
            centerOfMass.add(weightedPos);
            totalMass += mass;
        }, this.jtree, 0, this.position);

        // normalize weights of vectors
        centerOfMass.divideScalar(totalMass);

        return centerOfMass;
    }

    detachSubtree(){
        // [TODO] separate a subtree and return it
        //      [ITR1] destroy the subtree
        //      [ITR2] separate subtree, destroy it
        //      [ITR3] separate subtree, give it a velocity and spin
        //      [ITR4] separate subtree, fragment it (sub- separations)
    }
}

