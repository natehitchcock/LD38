import * as THREE from 'three';
import {keys, mouse} from './lib/input';

export default class FlyCharacter{
    cameraRef: THREE.Camera;
    speed: number = 3;
    rotationSpeedX: number = 4;
    rotationSpeedY: number = 4;
    forward: THREE.Vector3;
    right: THREE.Vector3;
    up: THREE.Vector3;

    // Keep track of rotation to manually rotate (avoiding Order of Operation fuckery)
    rotX: number;
    rotY: number;

    constructor(cam: THREE.Camera){
        this.cameraRef = cam;
        this.forward = new THREE.Vector3(0, 0, -1);
        this.right = new THREE.Vector3(1, 0, 0);
        this.up = new THREE.Vector3(0, 1, 0);
    }

    _updateMovement(dt: number){
        if(keys.a){
            let rightMove = new THREE.Vector3().copy(this.right);
            rightMove.multiplyScalar(-this.speed * dt);

            console.log(rightMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                rightMove);
        }
        if(keys.d){
            let rightMove = new THREE.Vector3().copy(this.right);
            rightMove.multiplyScalar(this.speed * dt);

            console.log(rightMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                rightMove);
        }
        if(keys.w){
            let forwardMove = new THREE.Vector3().copy(this.forward);
            forwardMove.multiplyScalar(this.speed * dt);

            console.log(forwardMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                forwardMove);
        }
        if(keys.s){
            let forwardMove = new THREE.Vector3().copy(this.forward);
            forwardMove.multiplyScalar(-this.speed * dt);

            console.log(forwardMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                forwardMove);
        }
        if(keys.e){
            let upMove = new THREE.Vector3().copy(this.up);
            upMove.multiplyScalar(this.speed * dt);

            console.log(upMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                upMove);
        }
        if(keys.q){
            let upMove = new THREE.Vector3().copy(this.up);
            upMove.multiplyScalar(-this.speed * dt);

            console.log(upMove); 
            this.cameraRef.position.addVectors(
                this.cameraRef.position, 
                upMove);
        }
    }

    _updateRotation(dt: number){
        let left = 37;
        let up = 38;
        let right = 39;
        let down = 40;

        if(keys[up]){
            //this.cameraRef.rotateX(this.rotationSpeedX * dt);
        }
        if(keys[down]){
            //this.cameraRef.rotateX(-this.rotationSpeedX * dt);
        }
        if(keys[left]){
            this.cameraRef.rotateY(this.rotationSpeedY * dt);
        }
        if(keys[right]){
            this.cameraRef.rotateY(-this.rotationSpeedY * dt);
        }

        // [TODO] Update character orientation vectors here
    }

    update(clock: THREE.Clock){
        let dt = clock.getDelta();

        this._updateMovement(dt);
        this._updateRotation(dt);
    }
}