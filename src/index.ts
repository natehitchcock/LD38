import * as THREE from 'three';
import FlyCharacter from './FlyCharacter'

const ws = new WebSocket(`ws://${location.host}/ws`);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let character = new FlyCharacter(camera);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

let clock = new THREE.Clock();

camera.position.z = 5;

let direction = 1;
var render = function () {
    requestAnimationFrame( render );

    character.update(clock);

    renderer.render(scene, camera);
};

render();