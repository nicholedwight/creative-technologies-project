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
