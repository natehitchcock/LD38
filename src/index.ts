import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import * as THREE from 'three';
import Vox from './lib/vox';

declare var vox: any;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let jtree = new JTreeEntity();
const character = new THREE.Object3D();
let controls = new ThirdPersonController(camera, character, jtree.jtree);
let clock = new THREE.Clock();

camera.position.z = 25;
var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let uniforms = {
    fcolor: {value: new THREE.Vector4(0, 1, 0, 1)}
};

var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

let mergedGeometry = new THREE.Geometry();

jtree.generateJTreeSphere(new THREE.Vector3(0, 0, 0), 4.5);
//jtree.generateJTree();
jtree.spawnCubes((pos, extent) => {
    var newGeometry = new THREE.BoxGeometry( extent * 2, extent * 2, extent * 2);
    mergedGeometry.merge(newGeometry,new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z));
    console.log('generated vox ' + pos + '  size  ' + extent);
});

let mergedMesh = new THREE.Mesh(mergedGeometry, material);

scene.add( mergedMesh );
scene.add(character);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

var render = function () {
    const delta = clock.getDelta();
    requestAnimationFrame(render);
    controls.tick(delta);

    renderer.render(scene, camera);
};

render();