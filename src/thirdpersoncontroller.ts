import * as THREE from 'three';
import {JoshuaTree} from './lib/joshuatree';
import {keys, mouse} from './lib/input';
import Vox from './lib/vox';

const data = require('./content/character-controller.toml');
const weapon = require('./content/weapons/bolter.toml');

export default class ThirdPersonController {
    cam: THREE.Camera;
    character: Vox;
    distance: THREE.Vector3;
    speed: number;
    targetOffset: THREE.Vector3;

    constructor(cam: THREE.Camera, character: Vox, tree: JoshuaTree) {
        this.distance = new THREE.Vector3(data.distance.x, data.distance.y, data.distance.z);
        this.targetOffset = new THREE.Vector3(data.offset.x, data.offset.y, data.offset.z);
        this.cam = cam;
        this.speed = data.speed;
        this.character = character;
        this.character.add(new Vox(weapon));
    }

    tick(delta: number) {
        const moveDelta = new THREE.Vector3(0, 0, 0);

        if(keys.w) moveDelta.setZ(1);
        if(keys.s) moveDelta.setZ(-1);
        if(keys.d) moveDelta.setX(-1);
        if(keys.a) moveDelta.setX(1);

        const moved = moveDelta.x || moveDelta.z || moveDelta.y;
        if(moved && this.character.current === 'idle') {
            this.character.play('walk');
        }

        if(!moved && this.character.current === 'walk') {
            this.character.play('idle');
        }

        this.character.position.add(moveDelta.multiplyScalar(this.speed * delta));

        this.cam.position.lerp(this.character.position.clone().add(this.distance), data.lerp);
        this.cam.lookAt(this.character.position.clone().add(this.targetOffset));
    }
}
