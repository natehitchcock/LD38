import * as THREE from 'three';
import {keys, mouse} from './lib/input';

export default class ThirdPersonController {
    cam: THREE.Camera;
    character: THREE.Object3D;
    distance: THREE.Vector3; 
    speed: number;

    constructor(cam: THREE.Camera, character: THREE.Object3D) {
        this.distance = new THREE.Vector3(0, 1, -0.5);
        this.cam = cam;
        this.speed = 2;
        this.character = character;
    }

    tick(delta: number) {
        const moveDelta = new THREE.Vector3(0, 0, 0);
        
        if(keys.w) moveDelta.setZ(1);
        if(keys.s) moveDelta.setZ(-1);
        if(keys.d) moveDelta.setX(-1);
        if(keys.a) moveDelta.setX(1);    
        
        this.character.position.add(moveDelta.multiplyScalar(this.speed * delta));
       
        this.cam.position.lerp(this.character.position.clone().add(this.distance), .4);
        this.cam.lookAt(this.character.position);
        
    }

}