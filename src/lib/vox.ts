import * as path from 'path';
import * as THREE from 'three';

declare var vox: any;

const parser = new vox.Parser();

export default class VoxModel extends THREE.Object3D {
    data: any;
    animations: any;
    current: string;
    frame: number;
    timeout: number;

    constructor(voxData: any) {
        super();
        this.data = voxData
        const dir = './vox';

        Object.keys(this.data.animation).forEach(key => {
            const anim = this.data.animation[key];
            this.animations[key] = {
                ...anim,
                vox: parser. anim.vox.map(file => parser.parse(path.join(dir, file)).then(voxData =>  {
                    var builder = new vox.MeshBuilder(voxData, { voxelSize: anim.size });
                    return builder.createMesh();
                }))
            };
        });

        this.play(this.data.default);
    }

    play(animation: string) {
        if(this.timeout) clearInterval(this.timeout);
            
        this.current = animation;
        this.frame = 0;

        this.timeout = setInterval(this.tick.bind(this), this.animations[animation].speed);
    }

    stop() {
        clearTimeout(this.timeout);
    }

    async tick() {
        if(this.children[0])
            this.remove(this.children[0]);
        
        const mesh = await this.animations[this.current].vox[this.frame];
        this.add(mesh);
    }
}