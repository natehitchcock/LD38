/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = THREE;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var joshuatree_1 = __webpack_require__(5);
var maxNum = new joshuatree_1.Uint64([4294967295, 4294967295]);
var zeroNum = new joshuatree_1.Uint64([0, 0]);
var highBit = 0x800000;
var Position = (function () {
    function Position(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Position.prototype.Add = function (other) {
        return new Position(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Position.prototype.toString = function () {
        return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    };
    return Position;
}());
var maxDepth = 0;
var JTreeEntity = (function () {
    function JTreeEntity() {
    }
    JTreeEntity.prototype.generateJTree = function () {
        this.jtree = new joshuatree_1.JoshuaTree();
        this.generateJTree_internal(this.jtree, 0);
    };
    JTreeEntity.prototype.generateJTree_internal = function (root, depth) {
        if (depth > maxDepth) {
            return;
        }
        for (var i = 63; i >= 0; --i) {
            if (i % 2 === 1) {
                var jchild = new joshuatree_1.JoshuaTree();
                root.Add(i, jchild);
                this.generateJTree_internal(jchild, depth + 1);
            }
        }
    };
    // take the index of which bit a voxel is in
    // returns an un-scaled position (doesn't account for depth)
    JTreeEntity.prototype.indexToRelativePosition = function (index) {
        return new Position(index % 4, Math.floor(index / 4) % 4, Math.floor(index / 16));
    };
    JTreeEntity.prototype.indexToScaledRelativePosition = function (index, depth) {
        var scalePower = maxDepth - depth;
        var relPos = this.indexToRelativePosition(index);
        relPos.x *= Math.pow(4, scalePower);
        relPos.y *= Math.pow(4, scalePower);
        relPos.z *= Math.pow(4, scalePower);
        return relPos;
    };
    JTreeEntity.prototype.leafLoop = function (fn, node, offset) {
        for (var i = 63; i >= 0; --i) {
            var bitFlag = new joshuatree_1.Uint64();
            bitFlag.Set(i);
            if (!this.jtree.And(bitFlag).Empty()) {
                fn(offset.Add(this.indexToRelativePosition(i)));
                //console.log('hit' + i);
            }
        }
    };
    JTreeEntity.prototype.depthLoop = function (fn, node, depth, offset) {
        var _this = this;
        if (depth > maxDepth) {
            return;
        }
        if (node.Equals(maxNum)) {
            // Render a large cube
        }
        else if (node.Equals(zeroNum)) {
            // Skip this branch 
        }
        else {
            // Recurse or render leaf loop
            if (depth === maxDepth) {
                this.leafLoop(fn, node, offset);
            }
            else {
                // Call depth node on each child
                Object.keys(this.jtree.children).forEach(function (childKey) {
                    var child = _this.jtree.children[childKey];
                    if (child instanceof joshuatree_1.JoshuaTree) {
                        var keynum = parseInt(childKey);
                        _this.depthLoop(fn, child, depth + 1, offset.Add(_this.indexToScaledRelativePosition(keynum, depth)));
                    }
                });
            }
        }
    };
    JTreeEntity.prototype.spawnCubes = function (spawnFunc) {
        this.depthLoop(spawnFunc, this.jtree, 0, new Position(0, 0, 0));
    };
    return JTreeEntity;
}());
exports.default = JTreeEntity;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __webpack_require__(0);
var input_1 = __webpack_require__(4);
var data = __webpack_require__(6);
var ThirdPersonController = (function () {
    function ThirdPersonController(cam, character, tree) {
        this.distance = new THREE.Vector3(data.distance.x, data.distance.y, data.distance.z);
        this.targetOffset = new THREE.Vector3(data.offset.x, data.offset.y, data.offset.z);
        this.cam = cam;
        this.speed = data.speed;
        this.character = character;
    }
    ThirdPersonController.prototype.tick = function (delta) {
        var moveDelta = new THREE.Vector3(0, 0, 0);
        if (input_1.keys.w)
            moveDelta.setZ(1);
        if (input_1.keys.s)
            moveDelta.setZ(-1);
        if (input_1.keys.d)
            moveDelta.setX(-1);
        if (input_1.keys.a)
            moveDelta.setX(1);
        this.character.position.add(moveDelta.multiplyScalar(this.speed * delta));
        this.cam.position.lerp(this.character.position.clone().add(this.distance), data.lerp);
        this.cam.lookAt(this.character.position.clone().add(this.targetOffset));
    };
    return ThirdPersonController;
}());
exports.default = ThirdPersonController;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JTreeEntity_1 = __webpack_require__(1);
var thirdpersoncontroller_1 = __webpack_require__(2);
var THREE = __webpack_require__(0);
var parser = new vox.Parser();
parser.parse("./vox/chr_walkcycle-00.vox").then(function (voxelData) {
    var param = { voxelSize: 0.02 };
    var builder = new vox.MeshBuilder(voxelData, param);
    var mesh = builder.createMesh();
    character.add(mesh);
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var jtree = new JTreeEntity_1.default();
var character = new THREE.Object3D();
var controls = new thirdpersoncontroller_1.default(camera, character, jtree.jtree);
var clock = new THREE.Clock();
camera.position.z = 5;
var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
var uniforms = {
    color: { value: new THREE.Vector4(0, 1, 0, 1) }
};
var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
jtree.generateJTree();
jtree.spawnCubes(function (pos) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
    scene.add(cube);
    //console.log('hit ' + pos);
});
scene.add(character);
scene.add(new THREE.DirectionalLight());
scene.add(new THREE.AmbientLight());
var direction = 1;
var render = function () {
    var delta = clock.getDelta();
    requestAnimationFrame(render);
    controls.tick(delta);
    renderer.render(scene, camera);
};
render();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
document.addEventListener('keyup', function (e) {
    exports.keys[e.keyCode] = false;
    exports.keys[e.key] = false;
});
document.addEventListener('keydown', function (e) {
    exports.keys[e.keyCode] = true;
    exports.keys[e.key] = true;
});
document.addEventListener('mousemove', function (e) {
    exports.mouse.x = e.clientX;
    exports.mouse.y = e.clientY;
});
document.addEventListener('mousedown', function (e) {
    exports.mouse.left = true;
});
document.addEventListener('mouseup', function (e) {
    exports.mouse.left = false;
});
exports.keys = {};
exports.mouse = {
    x: 0,
    y: 0,
    left: false,
    right: false
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Uint64 = (function () {
    function Uint64(data) {
        if (data === void 0) { data = [0, 0]; }
        this.data = new Uint32Array(data);
    }
    Uint64.prototype.Copy = function (from) {
        this.data[0] = from.data[0];
        this.data[1] = from.data[1];
        return this;
    };
    Uint64.prototype.Xor = function (target) {
        return new Uint64([this.data[0] ^ target.data[0], this.data[1] ^ target.data[1]]);
    };
    Uint64.prototype.Not = function () {
        return new Uint64([~this.data[0], ~this.data[1]]);
    };
    Uint64.prototype.Or = function (target) {
        return new Uint64([this.data[0] | target.data[0], this.data[1] | target.data[1]]);
    };
    Uint64.prototype.And = function (target) {
        return new Uint64([this.data[0] & target.data[0], this.data[1] & target.data[1]]);
    };
    Uint64.prototype.Unset = function (location) {
        if (location > 31) {
            location -= 32;
            this.data[1] &= (1 << location);
        }
        else {
            this.data[0] &= (1 << location);
        }
        return this;
    };
    Uint64.prototype.Set = function (location) {
        if (location > 31) {
            location -= 32;
            this.data[1] |= (1 << location);
        }
        else {
            this.data[0] |= (1 << location);
        }
        return this;
    };
    Uint64.prototype.Empty = function () {
        return this.data[0] === 0 && this.data[1] === 0;
    };
    Uint64.prototype.Equals = function (target) {
        return target.data[0] === this.data[0] && target.data[1] === this.data[1];
    };
    return Uint64;
}());
exports.Uint64 = Uint64;
var JoshuaTree = (function (_super) {
    __extends(JoshuaTree, _super);
    function JoshuaTree() {
        var _this = _super.call(this) || this;
        _this.children = {};
        return _this;
    }
    JoshuaTree.prototype.FromJSON = function (json, treeClass) {
        var _this = this;
        if (treeClass === void 0) { treeClass = JoshuaTree; }
        this.parent = json.parent;
        Object.keys(json.children).forEach(function (key) {
            var child = json['children'][key];
            var numKey = parseInt(key, 10);
            child = child.children ? new treeClass().FromJSON(child) : child;
            _this.Add(numKey, child);
        });
        return this;
    };
    JoshuaTree.prototype.Remove = function (key) {
        if (this.children[key]) {
            var child = this.children[key];
            this.Copy(this.Xor(new Uint64().Set(key)));
            if (child instanceof JoshuaTree) {
                delete child.parent;
                delete child.key;
            }
            delete this.children[key];
            return true;
        }
        return false;
    };
    JoshuaTree.prototype.ToJSON = function () {
        return JSON.stringify(this);
    };
    JoshuaTree.prototype.Add = function (key, child, force) {
        if (!this.children[key]) {
            this.children[key] = child;
            if (child instanceof JoshuaTree) {
                child.parent = this;
                child.key = key;
            }
            this.Copy(this.Or(new Uint64().Set(key)));
            return true;
        }
        else if (force) {
            this.Remove(key);
            this.Add(key, child);
            return true;
        }
        return false;
    };
    JoshuaTree.prototype.ForEach = function (fn, key) {
        var _this = this;
        fn(this, key);
        Object.keys(this.children).forEach(function (childKey) {
            var child = _this.children[childKey];
            if (child instanceof JoshuaTree) {
                child.ForEach(fn, childKey);
            }
        });
    };
    return JoshuaTree;
}(Uint64));
exports.JoshuaTree = JoshuaTree;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports    = {
	"speed": 2,
	"lerp": 0.5,
	"distance": {
		"x": 0,
		"y": 2,
		"z": -0.5
	},
	"offset": {
		"x": 0,
		"y": 0,
		"z": 1
	}
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map