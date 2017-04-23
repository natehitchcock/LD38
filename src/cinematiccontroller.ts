import * as THREE from 'three';
import {keys, mouse} from './lib/input';
import SoundFX from './soundfx';

export default class CinematicController {
    camera: THREE.Camera;
    inputSound: SoundFX;

    constructor(camera) {
        this.camera = camera;
        this.camera.position.copy(new THREE.Vector3(0, 3, 10));

        this.inputSound = new SoundFX('./sfx/sacktap.wav');
    }

    tick(dt: number) {
        if(keys[' ']) this.inputSound.play();
    }
}
