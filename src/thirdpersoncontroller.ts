import * as THREE from 'three';
import {JoshuaTree} from './lib/joshuatree';
import {keys, mouse} from './lib/input';
const data = require('./content/character-controller.toml');

export default class ThirdPersonController {
    cam: THREE.Camera;
    character: THREE.Object3D;
    distance: THREE.Vector3; 
    speed: number;
    targetOffset: THREE.Vector3;

    constructor(cam: THREE.Camera, character: THREE.Object3D, tree: JoshuaTree) {
        this.distance = new THREE.Vector3(data.distance.x, data.distance.y, data.distance.z);
        this.targetOffset = new THREE.Vector3(data.offset.x, data.offset.y, data.offset.z);
        this.cam = cam;
        this.speed = data.speed;
        this.character = character;
    }

    tick(delta: number) {
        const moveDelta = new THREE.Vector3(0, 0, 0);
        
        if(keys.w) moveDelta.setZ(1);
        if(keys.s) moveDelta.setZ(-1);
        if(keys.d) moveDelta.setX(-1);
        if(keys.a) moveDelta.setX(1);    
        
        this.character.position.add(moveDelta.multiplyScalar(this.speed * delta));
       
        this.cam.position.lerp(this.character.position.clone().add(this.distance), data.lerp);
        this.cam.lookAt(this.character.position.clone().add(this.targetOffset));
    }
}