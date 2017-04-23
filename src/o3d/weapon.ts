import Vox, {IAnimation, IVoxData} from './vox';

interface IAmmoData extends IVoxData {
    speed: number;
    ttl: number;
    rate: number;
}

interface IWeaponData extends IVoxData {
    ammo: IAmmoData;
}

class Weapon extends Vox {
    data: IWeaponData;
    ammo: Vox;
    spawned: THREE.Object3D[];
    count: number;

    constructor(data: IWeaponData) {
        super(data);
        this.ammo = new Vox(this.data.ammo);
        this.spawned = [];
    }

    fire() {
        this.parent.add(this.ammo.clone());
    }

    tick(delta: number) {
        this.count += delta;


    }
}
