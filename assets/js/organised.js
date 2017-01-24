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
var canvas = document.getElementById('container');
var scene, renderer, camera, controls, control, raycaster;
var mouse = new THREE.Vector2(), INTERSECTED;
var mouseIsDown = false;
var selection = null;
var intersects;
var offset = new THREE.Vector3();

function createScene() {

  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  canvas.appendChild(renderer.domElement);

  var fov = 35;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 65536;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 600);
  scene = new THREE.Scene();
  scene.add(camera);

  window.addEventListener('resize', onWindowResize, false);
}

function createLights() {
  // var ambientLight = new THREE.AmbientLight(0x999999 );
  // scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 1);
  lights[0].position.set(-1, 0, -0.5);
  lights[1] = new THREE.DirectionalLight(0x11E8BB, 1);
  lights[1].position.set(-0.75, -1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200C9, 1);
  lights[2].position.set(0.75, 0, 0.5);
  lights[3] = new THREE.DirectionalLight(0x999999, 0.5);
  lights[3].position.set(-10, 3, 1);
  lights[3].castShadow = true;
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
  scene.add(lights[3]);
}

// SETTING UP 3D MODELS

Stars = function() {
  this.mesh = new THREE.Points();
  this.mesh.name = "star";
  var geometry = new THREE.SphereGeometry(1000, 100, 50);
  var starAmount = 20000;
  var material = {
    size: 1.0,
    opacity: 0.7
  };
  var mesh = new THREE.PointsMaterial(material);

  for (var i = 0; i < starAmount; i++) {
    var starVertex = new THREE.Vector3();
    starVertex.x = Math.random() * 1000 - 500;
    starVertex.y = Math.random() * 1000 - 500;
    starVertex.z = Math.random() * 800 - 500;
    geometry.vertices.push(starVertex);
  }
  stars = new THREE.Points(geometry, mesh);
  this.mesh.add(stars);
}

// MODELS
function drawSkies() {
  stars = new Stars();
  scene.add(stars.mesh);
}

function createPlanet() {
  this.mesh = new THREE.Object3D();
  this.mesh.name = 'planet';
  var geometry = new THREE.IcosahedronGeometry(7, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  var planet = new THREE.Mesh(geometry, material);
  planet.scale.x = planet.scale.y = planet.scale.z = 8;
  scene.add(planet);
}

function Controller( name, positions, threeObject, threeFloat, size, mode, slider, event, shards, text ) {
    this.Name = name || "No Name";
    this.Positions = positions || [new Point()];
    this.ThreeObject = threeObject || MasterObject;
    this.ThreeFloat = threeFloat || MasterObject;
    this.ThreeDest = new Point(this.ThreeObject.position.x, this.ThreeObject.position.y);
    this.Size = size || new Size();
    this.RollOver = false;
    this.Mode = mode || "omni";
    this.ArrowAlpha = 0;
    this.Slider = slider;
    if (slider) {
        this.Slider.origin = this.Slider.origins[0];
    }
    this.Event = event;
    this.Shards = shards || [];
    this.IsPressed = false;
    this.Text = text || "";
}

function createDysonsphere() {
  var geometry = new THREE.IcosahedronGeometry(15, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide

  });
  var dysonSphere = new THREE.Mesh(geometry, material);
  dysonSphere.scale.x = dysonSphere.scale.y = dysonSphere.scale.z = 5;
  scene.add(dysonSphere);
}

function createCube() {
  cube = new Cube();
  scene.add(cube.mesh);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function createClouds() {
  var geometry = new THREE.OctahedronBufferGeometry(10, 1);
  var material = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.SmoothShading,
    emissive: Colors.white
  });
  var fluff = new THREE.Mesh(geometry.clone(), material);
  fluff.scale.set(1,1,1);
  fluff.position.set(60,60, 120);
  fluff.rotation.z = Math.random()*Math.PI*2;
  fluff.rotation.y = Math.random()*Math.PI*2;
  var fluff2 = new THREE.Mesh(geometry.clone(), material);
  fluff2.scale.set(1.5,1.5,1.5);
  fluff2.position.set(75,60, 120);
  fluff2.rotation.z = Math.random()*Math.PI*2;
  fluff2.rotation.y = Math.random()*Math.PI*2;
  var fluff3 = new THREE.Mesh(geometry.clone(), material);
  fluff3.scale.set(1,1,1);
  fluff3.position.set(90,55, 120);
  fluff3.rotation.z = Math.random()*Math.PI*2;
  fluff3.rotation.y = Math.random()*Math.PI*2;
  var edgeGeometry = new THREE.EdgesGeometry(fluff.geometry);
  var edgeGeometry2 = new THREE.EdgesGeometry(fluff2.geometry);
  var edgeGeometry3 = new THREE.EdgesGeometry(fluff3.geometry);
  var edgeMaterial = new THREE.LineBasicMaterial({color: 0xA8A8A8, linewidth: 2});
  var edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  var edges2 = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  var edges3 = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  fluff.add(edges);
  fluff2.add(edges2);
  fluff3.add(edges3);
  scene.add(fluff, fluff2, fluff3);
}

// MATHS

function comparison(a,b,precision) {
    precision = precision || 50;
    return Math.round(a*precision) === Math.round(b*precision);
}

// INTERACTIONS

function render() {
  raycaster.setFromCamera( mouse, camera );
  intersects = raycaster.intersectObjects(scene.children);
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
      selection = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
		}
    pointer = true;
    interactable = true;
    canvas.style.cursor="pointer";
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
    interactable = false;
    canvas.style.cursor="default";
	}

  renderer.render(scene, camera);
}



// MOUSE AND SCREEN EVENTS
function onWindowLoaded() {
  init();
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onMouseMove(event) {
	event.preventDefault();
  var pointer = false;
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight)  * 2 + 1;
  if (interactable && mouseIsDown == true) {
    dragController(true);
  } else if (!interactable && mouseIsDown == true) {
    console.log('you didnt click an interactive object :(');
  }
}

function onMousePress() {
  mouseIsDown = true;
}

function onMouseRelease() {
  mouseIsDown = false;
}

function Point( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}

function dragController(toCursor) {
    // console.log(INTERSECTED);
    var objPos = new Point(INTERSECTED.position.x, INTERSECTED.position.y);
    // var slider = controller.Slider;
    //
    // var enableX = slider.range.x!==0;
    // var enableY = slider.range.y!==0;
    //
    var originX = INTERSECTED.x;
    var originY = INTERSECTED.y;
    // var t = 0.1;
    //
    // // UPDATE POSITION & VALUE //
    var newPos = objPos;
    if (toCursor) {
        var cursorPos = new Point(mouse.x, mouse.y);
        var posDif = new Point(objPos - cursorPos);
        newPos = new Point(cursorPos.x + posDif.x, cursorPos.y + posDif.y);
    }
    selection.position.copy(intersects[0].point.subVectors(offset));
    console.log(intersects[0].point);
    //
    // if (enableX) {
    //     objPos.x = newPos.x;
    //     objPos.x = ValueInRange(objPos.x,originX,originX + slider.range.x);
    //     slider.value.x = getValue(controller,"x");
    //     if (slider.functions) {
    //         slider.functions[0](slider.value.x,t,true);
    //     }
    // }
    // if (enableY) {
    //     objPos.y = newPos.y;
    //     objPos.y = ValueInRange(objPos.y,originY,originY + slider.range.y);
    //     slider.value.y = getValue(controller,"y");
    //     if (slider.functions) {
    //         slider.functions[1](slider.value.y,t,true);
    //     }
    // }
}


function init() {
    createScene();
    createLights();

    // drawSkies();
    createPlanet();
    createDysonsphere();
    createClouds();
    // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mousedown', onMousePress, false );
    document.addEventListener( 'mouseup', onMouseRelease, false );

    animate();
}

window.addEventListener('load', onWindowLoaded, false);
