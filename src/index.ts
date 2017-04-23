import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import FlyCharacter from './FlyCharacter';
import * as THREE from 'three';
import Vox from './o3d/vox';

interface IGameWindow extends Window {
    scene: THREE.Scene;
}

declare const window: IGameWindow;

const charData = require('./content/character/character.toml');
const testLevel = require('./content/testlevel.toml');

const scene = new THREE.Scene();

window.scene = scene;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let flyControls: FlyCharacter;
let controls: ThirdPersonController;
const clock = new THREE.Clock();

camera.position.z = 5;

const uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)},
};

const material = new THREE.MeshPhongMaterial( {color: 0xA0522D} );

const sphereCenter = new THREE.Vector3(80, 80, 80);
const sphereRadius = 40;
const jtree = new JTreeEntity(material);

jtree.position.copy(new THREE.Vector3(-80, -122, -80));
console.log('generating jtree sphere shape...');
jtree.generateJTreeSphere(sphereCenter, sphereRadius);
console.log('generating and combining meshes...');
jtree.spawnCubes();

const debugControls = true;
if(debugControls) {
    flyControls = new FlyCharacter(camera);
}else{
    const character = new Vox(charData);
    controls = new ThirdPersonController(camera, character);
    scene.add(character);
}

const jtreeCoM = jtree.calculateCenterOfMass();
console.log('center of mass is ' + jtreeCoM.x + ', ' + jtreeCoM.y + ', ' + jtreeCoM.z);

scene.add(jtree);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

const direction = 1;

const render = () => {
    requestAnimationFrame(render);

    if(debugControls) {
        flyControls.update(clock);
    }else {
        const delta = clock.getDelta();
        controls.tick(delta);
    }

    renderer.render(scene, camera);
};

render();
