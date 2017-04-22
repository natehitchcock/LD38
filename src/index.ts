import * as THREE from 'three';
import FlyCharacter from './FlyCharacter';
import JTreeEntity from './JTreeEntity';

const ws = new WebSocket(`ws://${location.host}/ws`);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let character = new FlyCharacter(camera);

let clock = new THREE.Clock();

camera.position.z = 5;
var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

let jtree = new JTreeEntity();
jtree.generateJTree();
jtree.spawnCubes(pos =>{    
    var cube = new THREE.Mesh( geometry, material );
    cube.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
    scene.add( cube );
    //console.log('hit ' + pos);
});

let direction = 1;
var render = function () {
    requestAnimationFrame( render );

    character.update(clock);

    renderer.render(scene, camera);
};

render();