declare var vox: any;

const parser = new vox.Parser();
parser.parse("./vox/chr_walkcycle-00.vox").then(function(voxelData) {
    var param = { voxelSize: 0.02 };
    var builder = new vox.MeshBuilder(voxelData, param);
    var mesh = builder.createMesh();
});

class VoxModel extends THREE.Object3D {
    data: any;

    constructor(voxData: any) {
        super();
        this.data = voxData;

        Object.keys(this.data.animation).forEach(key => {
            const anim = this.data.animation[key];
            
        });
    }

    play(animation: string) {
        
    }

    tick(delta) {

    }
}