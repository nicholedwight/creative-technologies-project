//COLORS
var Colors = {
  red:0xf25346,
  white:0xd8d0d1,
  brown:0x59332e,
  brownDark:0x23190f,
  pink:0xF5986E,
  yellow:0xf4ce93,
  blue:0x68c3c0,
};

// VARIABLES
var container = document.getElementById('container');
var canvas = document.getElementsByTagName('canvas');
var scene, renderer, camera, controls, control, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED;
var mouseIsDown = false;
var selection = null;
var intersects, groupIntersects;
var offset = new THREE.Vector3();
var control, controlY;
var group;
var x, y;
var player1 = false;
var player2 = false;
var plangroup;
var dysonSphere;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var targetRotationX = 0.5;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0.2;
var targetRotationOnMouseDownY = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var slowingFactor = 0.25;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var parent;
var cube, cubePivot;
// var MasterObject, World3D;
// var ControllerList = [];
// var controllers = [];
// var floatTweens = [];
// var fullX = 0;
// var fullY = 0;
// var units = 0;
// var mouseX = 0;
// var mouseY = 0;
//
// var cxa;


var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	var _selected = null, _hovered = null;

var animate, e,
        nbSBaseSegX, nbSBaseSegY,
        base, terran, terranHigh, gun, barrel,
        baseGeom, terranGeom, terranHighGeom, gunGeom,
        baseMat, terranMat, terranHighMat, gunMat,
        dirLight, ambLight
    ;
