import Vox, {IAnimation, IVoxData} from './vox';
import * as THREE from 'three';

interface IAIData extends IVoxData {
    distance: number;
}

export default class Ai extends Vox {
    data: IAIData;
    count: number;
    clock: THREE.Clock;

    constructor(data: IAIData) {
        super(data);
        this.clock = new THREE.Clock();

        this.tick();
    }


    tick() {
        const delta = this.clock.getDelta();

        requestAnimationFrame(this.tick.bind(this));
    }
}
