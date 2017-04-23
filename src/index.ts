
import JTreeEntity from './JTreeEntity';
import ThirdPersonController from './thirdpersoncontroller';
import * as THREE from 'three';

declare var vox: any;

var parser = new vox.Parser();
parser.parse("./vox/chr_walkcycle-00.vox").then(function(voxelData) {
    var param = { voxelSize: 0.02 };
    var builder = new vox.MeshBuilder(voxelData, param);
    var mesh = builder.createMesh();
    character.add(mesh);
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const character = new THREE.Object3D();
let controls = new ThirdPersonController(camera, character);
let clock = new THREE.Clock();

camera.position.z = 5;
var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let uniforms = {
    color: {value: new THREE.Vector4(0, 1, 0, 1)}
};

var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );

let jtree = new JTreeEntity();
jtree.generateJTree();
jtree.spawnCubes(pos =>{    
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
    scene.add( cube );
    //console.log('hit ' + pos);
});

scene.add(character);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());

let direction = 1;

var render = function () {
    const delta = clock.getDelta();
    requestAnimationFrame(render);
    controls.tick(delta);

    renderer.render(scene, camera);
};

render();