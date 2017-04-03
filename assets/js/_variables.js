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
var scene, renderer, camera, controls, control, raycaster, stats;
var mouse = new THREE.Vector2(), INTERSECTED;
var mouseIsDown = false;
var selection = null;
var group, cloudPivot;
var x, y;
var player0 = false;
var player1 = false;
var player2 = false;
var sun, sun2, sun3, sunAtmosphere, moon;
var asteroidArray = [];
var starsArray = [];

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var targetRotationX = 0.5;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0.2;
var targetRotationOnMouseDownY = 0;

var targetRotationZ = 0.2;
var targetRotationOnMouseDownZ = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var mouseY = 0;
var mouseYOnMouseDown = 0;

var slowingFactor = 0.25;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var parent;
var cube, cubePivot;

var startTime = performance.now();
var framecount = 0;

var fps = [];

var interactableObjects = [];
