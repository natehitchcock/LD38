import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import FlyCharacter from './FlyCharacter';
import CinematicController from './cinematiccontroller';
import * as THREE from 'three';
import Vox from './o3d/vox';
import {keys, mouse} from './lib/input';
import * as Howl from 'howler';
import AI from './o3d/ai';
import Weapon from './o3d/weapon';

interface IGameWindow extends Window {
    scene: THREE.Scene;
}

declare const window: IGameWindow;

const charData = require('./content/character/character.toml');
const testLevel = require('./content/testlevel.toml');
const dinoMite = require('./content/character/dinomite.toml');
const weapon = require('./content/weapons/meteor_shower.toml');
const dinostrip = new Vox(require('./content/character/dinostrip.toml'));

const scene = new THREE.Scene();

window.scene = scene;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let controls: FlyCharacter;
const clock = new THREE.Clock();

camera.position.z = 10;
camera.position.y = 2;

controls =  new FlyCharacter(camera);

const uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)},
};

const material = new THREE.MeshPhongMaterial( {color: 0xf4a460} );

const sphereCenter = new THREE.Vector3(0, 0, 0);
const sphereRadius = 20;
const jtree = new JTreeEntity(material);

jtree.position.copy(new THREE.Vector3(0, 0, -64));
console.log('generating sphere jtree...');
//jtree.generateJTreeSphere(sphereCenter, sphereRadius);
jtree.generateJTree();
console.log('spawning voxels...');
jtree.spawnCubes();

scene.add(jtree);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

let exploded = false;
const render = () => {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    controls.update(delta);

    if(keys.x && !exploded) {
        exploded = true;
        jtree.detachSubtreeSphere(new THREE.Vector3(0, 0, 0), 40);
    }

    renderer.render(scene, camera);
};

render();
