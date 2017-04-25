import * as THREE from 'three';
import {keys, mouse} from './lib/input';

export default class FlyCharacter {
    cameraRef: THREE.Camera;
    speed: number = 3;
    rotationSpeedX: number = 90;
    rotationSpeedY: number = 90;
    forward: THREE.Vector3;
    right: THREE.Vector3;
    up: THREE.Vector3;

    // Keep track of rotation to manually rotate (avoiding Order of Operation fuckery)
    // Wrapped within [0, 360]
    rotX: number = 0;
    rotY: number = 0;

    constructor(cam: THREE.Camera) {
        this.cameraRef = cam;
        this.forward = new THREE.Vector3(0, 0, -1);
        this.right = new THREE.Vector3(1, 0, 0);
        this.up = new THREE.Vector3(0, 1, 0);
    }

    _updateMovement(dt: number) {
        const moveVec = new THREE.Vector3(0, 0, 0);

        if(keys.a) moveVec.sub(this.right);
        if(keys.d) moveVec.add(this.right);
        if(keys.w) moveVec.add(this.forward);
        if(keys.s) moveVec.sub(this.forward);
        if(keys.e) moveVec.add(this.up);
        if(keys.q) moveVec.sub(this.up);

        moveVec.multiplyScalar(dt * this.speed);
        this.cameraRef.position.add(moveVec);
    }

    _updateRotation(dt: number) {
        const left = 37;
        const up = 38;
        const right = 39;
        const down = 40;

        if(keys[up]) {
            this.rotX += this.rotationSpeedX * dt;
            this.rotX %= 360;
        }
        if(keys[down]) {
            this.rotX -= this.rotationSpeedX * dt;
            this.rotX %= 360;
        }
        if(keys[left]) {
            this.rotY += this.rotationSpeedY * dt;
            this.rotY %= 360;
        }
        if(keys[right]) {
            this.rotY -= this.rotationSpeedY * dt;
            this.rotY %= 360;
        }

        const degToRad = 3.14159/180;
        const rotYRad = this.rotY * degToRad;
        const rotXRad = this.rotX * degToRad;

        // Order is very important for the next three lines of camera rotation
        this.cameraRef.rotation.setFromVector3(new THREE.Vector3(0, 0, 0));
        this.cameraRef.rotateY(rotYRad);
        this.cameraRef.rotateX(rotXRad);

        this.forward = new THREE.Vector3(-Math.sin(rotYRad), 0, -Math.cos(rotYRad));
        this.right = new THREE.Vector3(Math.cos(rotYRad), 0, -Math.sin(rotYRad));
    }

    update(dt: number) {

        this._updateMovement(dt);
        this._updateRotation(dt);
    }
}
