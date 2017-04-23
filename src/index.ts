import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import * as THREE from 'three';
import Vox from './lib/vox';


const charData = require('./content/character/character.toml');

const character = new Vox(charData);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const jtree = new JTreeEntity();
const controls = new ThirdPersonController(camera, character, jtree.jtree);
const clock = new THREE.Clock();

camera.position.z = 5;
const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
const uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)},
};

const material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );


jtree.generateJTree();
jtree.spawnCubes(pos => {
    const cube = new THREE.Mesh( geometry, material );
    cube.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
    scene.add( cube );
});

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
