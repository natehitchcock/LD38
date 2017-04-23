import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import * as THREE from 'three';
import Vox from './o3d/vox';

interface IGameWindow extends Window {
    scene: THREE.Scene;
}

declare const window: IGameWindow;

const charData = require('./content/character/character.toml');
const testLevel = require('./content/testlevel.toml');

const character = new Vox(charData);
const scene = new THREE.Scene();

window.scene = scene;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new ThirdPersonController(camera, character);
const clock = new THREE.Clock();

camera.position.z = 5;
const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
const uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)},
};

const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

scene.add(new Vox(testLevel));
scene.add(character);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

const direction = 1;

const render = () => {
    const delta = clock.getDelta();

    requestAnimationFrame(render);
    controls.tick(delta);

    renderer.render(scene, camera);
};

render();
