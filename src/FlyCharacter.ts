import * as THREE from 'three';
import input from './lib/input';

export default class FlyCharacter{
    cameraRef: THREE.Camera;

    constructor(cam: THREE.Camera){
        this.cameraRef = cam;
    }

    update(){
        this.cameraRef.position
    }
}