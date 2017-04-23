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

let sphereCenter = new THREE.Vector3(80, 80, 80);
let sphereRadius = 40;
let jtree = new JTreeEntity(material);

jtree.position.copy(new THREE.Vector3(0, 0, 0));
jtree.generateJTreeSphere(sphereCenter, sphereRadius);
jtree.spawnCubes();

let debugControls = true;
if(debugControls){
    flyControls = new FlyCharacter(camera);
}else{
    const character = new Vox(charData);
    controls = new ThirdPersonController(camera, character);
    scene.add(character);
}

//scene.add(new Vox(testLevel));
scene.add(jtree);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

const direction = 1;

const render = () => {
    requestAnimationFrame(render);
    
    if(debugControls){
        flyControls.update(clock);
    }else{
        const delta = clock.getDelta();
        controls.tick(delta);
    }
    
    renderer.render(scene, camera);
};

render();
