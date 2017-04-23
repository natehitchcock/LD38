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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
var joshuatree_1 = __webpack_require__(7);
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __webpack_require__(8);
var THREE = __webpack_require__(0);
var parser = new vox.Parser();
var VoxModel = (function (_super) {
    __extends(VoxModel, _super);
    function VoxModel(voxData) {
        var _this = _super.call(this) || this;
        _this.data = voxData;
        var dir = './vox';
        _this.animations = {};
        Object.keys(_this.data.animation).forEach(function (key) {
            var anim = _this.data.animation[key];
            _this.animations[key] = __assign({}, anim, { vox: anim.vox.map(function (file) { return parser.parse(path.join(dir, file)).then(function (voxelBin) {
                    var builder = new vox.MeshBuilder(voxelBin, { voxelSize: anim.size });
                    return builder.createMesh();
                }); }) });
        });
        _this.play(_this.data.default);
        return _this;
    }
    VoxModel.prototype.play = function (animation) {
        if (this.timeout)
            clearInterval(this.timeout);
        this.current = animation;
        this.frame = 0;
        this.timeout = setInterval(this.tick.bind(this), this.animations[animation].speed);
    };
    VoxModel.prototype.stop = function () {
        clearTimeout(this.timeout);
    };
    VoxModel.prototype.tick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var voxList, mesh;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.children[0])
                            this.remove(this.children[0]);
                        voxList = this.animations[this.current].vox;
                        return [4 /*yield*/, voxList[this.frame]];
                    case 1:
                        mesh = _a.sent();
                        this.add(mesh);
                        this.frame = this.frame + 1 === voxList.length ? this.frame = 0 : this.frame + 1;
                        return [2 /*return*/];
                }
            });
        });
    };
    return VoxModel;
}(THREE.Object3D));
exports.default = VoxModel;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __webpack_require__(0);
var input_1 = __webpack_require__(6);
var data = __webpack_require__(10);
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
/* 4 */
/***/ (function(module, exports) {

module.exports    = {
	"default": "walk",
	"animation": {
		"walk": {
			"size": 0.02,
			"speed": 100,
			"vox": [
				"characters/player/chr_walkcycle-00.vox",
				"characters/player/chr_walkcycle-01.vox",
				"characters/player/chr_walkcycle-02.vox",
				"characters/player/chr_walkcycle-03.vox",
				"characters/player/chr_walkcycle-04.vox",
				"characters/player/chr_walkcycle-05.vox"
			]
		}
	}
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JTreeEntity_1 = __webpack_require__(1);
var thirdpersoncontroller_1 = __webpack_require__(3);
var THREE = __webpack_require__(0);
var vox_1 = __webpack_require__(2);
var charData = __webpack_require__(4);
var character = new vox_1.default(charData);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var jtree = new JTreeEntity_1.default();
var controls = new thirdpersoncontroller_1.default(camera, character, jtree.jtree);
var clock = new THREE.Clock();
camera.position.z = 5;
var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
var uniforms = {
    color: { value: new THREE.Vector4(0, 1, 0, 1) },
};
var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
jtree.generateJTree();
jtree.spawnCubes(function (pos) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z));
    scene.add(cube);
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
/* 6 */
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
    right: false,
};


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports    = {
	"speed": 2,
	"lerp": 0.5,
	"distance": {
		"x": 0,
		"y": 1.2,
		"z": -0.7
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