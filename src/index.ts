import * as THREE from 'three';
import FlyCharacter from './FlyCharacter';
import JTreeEntity from './JTreeEntity';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let character = new FlyCharacter(camera);

let clock = new THREE.Clock();

camera.position.z = 25;
var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let uniforms = {
    fcolor: {value: new THREE.Vector4(0, 1, 0, 1)}
};

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
});

let mergedGeometry = new THREE.Geometry();

let jtree = new JTreeEntity();
jtree.generateJTreeSphere(new THREE.Vector3(0, 0, 0), 4.5);
//jtree.generateJTree();
jtree.spawnCubes((pos, extent) => {
    var newGeometry = new THREE.BoxGeometry( extent * 2, extent * 2, extent * 2);
    mergedGeometry.merge(newGeometry,new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z));
    console.log('generated vox ' + pos + '  size  ' + extent);
});

let mergedMesh = new THREE.Mesh(mergedGeometry, material);
scene.add( mergedMesh );

var render = function () {
    requestAnimationFrame( render );

    character.update(clock);

    renderer.render(scene, camera);
};

render();