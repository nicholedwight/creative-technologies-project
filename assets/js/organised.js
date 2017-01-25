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
var intersects, tween;
var offset = new THREE.Vector3();
var MasterObject, World3D;
var ControllerList = [];
var controllers = [];
var floatTweens = [];
var fullX = 0;
var fullY = 0;
var units = 0;
var mouseX = 0;
var mouseY = 0;

var cxa;

function createScene() {

  raycaster = new THREE.Raycaster();

  // renderer = new THREE.WebGLRenderer({
  //     antialias: true,
  //     alpha: true
  // });
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

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

function Controller( name, positions, threeObject, threeFloat, size, mode, slider, event, text ) {
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
  TWEEN.update();
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
  var fluff2 = new THREE.Mesh(geometry.clone(), material);
  fluff2.scale.set(1.5,1.5,1.5);
  fluff2.position.set(75,60, 120);
  var fluff3 = new THREE.Mesh(geometry.clone(), material);
  fluff3.scale.set(1,1,1);
  fluff3.position.set(90,55, 120);
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

// TWEEN

function floatTo(obj,d) {

    var pos = { y: obj.ThreeFloat.position.y };
    var to;
    if (obj.ThreeFloat.position.y>0) {
        to = -0.02;
    } else {
        to = 0.02;
    }

    var tween = new TWEEN.Tween(pos);
    tween.to( { y: to }, 2000 );
    tween.delay(d*1000);
    tween.start();
    floatTweens.push(tween);

    tween.onUpdate(function() {
        obj.ThreeFloat.position.y = this.y;
    });

    tween.onComplete(function() {
       // if (windowFocussed) {
            floatTo(obj,0);
        //}
    });

    tween.easing( TWEEN.Easing.Sinusoidal.InOut );
}

// INTERACTIONS

ControllerList = [
    { // 0
        name: "Left",
        positions: [new Point3D(-1, 20, -0.1), new Point3D(-1, 0.75, -0.1), new Point3D(-1, 14, -0.1)],
        size: new Size(40, 80),
        mode: "leftRight",
        slider: {
            minVal: new Point(-20,0),
            maxVal: new Point(25,0),
            range: new Point(0.6,0),
            value: new Point(0,0),
            origins: [new Point(-1,1),new Point(-1.2,1)]
        }
    },

    { // 1
        name: "Top",
        positions: [new Point3D(0.37, 0.5, -0.2)],
        size: new Size(40, 80),
        mode: "upDown",
        slider: {
            minVal: new Point(0,-10),
            maxVal: new Point(0,10),
            range: new Point(0,0.5),
            value: new Point(0,0),
            origins: [new Point(0,0.35)]
        }
    },

    { // 2
        name: "Master",
        positions: [new Point3D(0, -0.3, -0.1),new Point3D(0.2, 14.5, -0.1)],
        size: new Size(70, 120),
        mode: "upDown",
        slider: {
            minVal: new Point(0,-20),
            maxVal: new Point(0,25),
            range: new Point(0,0.4),
            value: new Point(0,50),
            origins: [new Point(0,-0.45),new Point(0,14.35)]
        }
    },

    { // 3
        name: "FilterSynth",
        positions: [new Point3D(0.8, 20, 0.1), new Point3D(0.8, -0.5, 0.1), new Point3D(0.8, -15, 0.1)],
        size: new Size(70, 80),
        mode: "omni",
        slider: {
            minVal: new Point(-20,500),
            maxVal: new Point(20,12000),
            range: new Point(0.8,0.8),
            value: new Point(0,400),
            origins: [new Point(0.4,-0.6)]
        }
    },

    { // 6
        name: "Player2",
        positions: [new Point3D(0.8, 14, 0.1)],
        size: new Size(70, 80),
        mode: "upDown",
        slider: {
            minVal: new Point(0,-20),
            maxVal: new Point(0,25),
            range: new Point(0,0.5),
            value: new Point(0,-10),
            origins: [new Point(0,14)]
        }
    },

    { // 7
        name: "Arp",
        positions: [new Point3D(-0.9, 14.6, -0.15)],
        size: new Size(70, 80),
        mode: "omni",
        slider: {
            minVal: new Point(2,-45),
            maxVal: new Point(7,3),
            range: new Point(0.8,0.8),
            value: new Point(0,0),
            origins: [new Point(-1.3,14.5)]
        }
    },

    { // 18
        name: "SunSample1",
        positions: [new Point3D(-1, 99.6, 0.1)],
        size: new Size(70, 80),
        mode: "upDown",
        slider: {
            minVal: new Point(0,-20),
            maxVal: new Point(0,22),
            range: new Point(0,0.8),
            value: new Point(0,-10),
            origins: [new Point(0,99.6)]
        }
    },

    { // 29
        name: "FloatySample",
        positions: [new Point3D(0, 220.5, 0.1)],
        size: new Size(70, 80),
        mode: "upDown",
        slider: {
            minVal: new Point(0,-60),
            maxVal: new Point(0,-18),
            range: new Point(0,0.5),
            value: new Point(0,-15),
            origins: [new Point(0,220)]
        }
    }

];

function setup3D() {

    var i;
    MasterObject = new THREE.Object3D();
    scene.add(MasterObject);

    World3D = new THREE.Object3D();
    MasterObject.add(World3D);

    MasterObject.rotation.x = (Math.PI/180) * -20;
    MasterObject.rotation.y = (Math.PI/180) * -40;


    for (i=0; i<ControllerList.length; i++) {
        var controller = ControllerList[i];
        controllers.push ( createController(controller) );
        floatTo(controllers[i],Math.random()*2);
    }

    console.log(controllers);
}

function createController(controller) {

    // CREATE THREE.JS POSITION OBJECT //
    var threeController = new THREE.Object3D();
    World3D.add(threeController);
    threeController.position.set(controller.positions[0].x,controller.positions[0].y,controller.positions[0].z);
    var threeFloat = new THREE.Object3D();
    threeController.add(threeFloat);

    // CREATE CONTROLLER //
    return new Controller(controller.name,controller.positions,threeController,threeFloat,controller.size,controller.mode,controller.slider,controller.event,controller.text);
}

function rolloverCheck() {

    var pointer = false;

    for (var i=0; i<controllers.length; i++) {
        var controller = controllers[i];
        var pos = get2Dfrom3D(controller, camera);
        controller.RollOver = hitBox(pos.x - ((controller.Size.w*0.5)*units), pos.y - ((controller.Size.h*0.5)*units), controller.Size.w*units, controller.Size.h*units);
        console.log(controller.RollOver);
    }
}


function get2Dfrom3D(object,camera) {
    var point = new Point();
    var vector = new THREE.Vector3();
    var threeObj = object;
    if (object.ThreeObject) {
        threeObj = object.ThreeObject;
    }
    threeObj.updateMatrixWorld();
    var matrix = threeObj.matrixWorld;
    vector.setFromMatrixPosition(matrix);
    vector.project(camera);

    point.x = ((vector.x+1)*0.5) * fullX;
    point.y = ((-vector.y+1)*0.5) * fullY;
    return point;
}

function drawArrows(obj) {
  console.log('entering drawArrows');
    // set alpha //
    if (obj.RollOver) {
      console.log('butts');
        if (obj.ArrowAlpha < 100) {
            obj.ArrowAlpha += 5;
        }
    } else {
        if (obj.ArrowAlpha > 0) {
            obj.ArrowAlpha -= 5;
        }
    }

    if (obj.IsPressed) {
        obj.ArrowAlpha = 100;
    }

    // draw arrows //
    if (obj.ArrowAlpha>0 && interactable && !(selectedController.IsPressed && selectedController!==obj)) {
        console.log('drawing');
        var mode = obj.Mode;
        var pos = get2Dfrom3D(obj, camera3D);

        var size = 5*units;
        var distance = (8 + (obj.ArrowAlpha * 0.016))*units;
        var alpha = obj.ArrowAlpha/100;
        if (obj.Slider) {
            var floorX = comparison(obj.ThreeDest.x,obj.Slider.origin.x);
            var ceilX = comparison(obj.ThreeDest.x,obj.Slider.origin.x + obj.Slider.range.x);
            var floorY = comparison(obj.ThreeDest.y,obj.Slider.origin.y);
            var ceilY = comparison(obj.ThreeDest.y,obj.Slider.origin.y + obj.Slider.range.y);
        }

        var down = (mode=="upDown" || mode=="omni" || mode=="shiftDown");
        var up = (mode=="upDown" || mode=="omni" || mode=="shiftUp");
        var left = (mode=="leftRight" || mode=="omni" || mode=="shiftLeft");
        var right = (mode=="leftRight" || mode=="omni" || mode=="shiftRight");

        var low = 0.1;

        if (down) {

            if (floorY) {
                cxa.globalAlpha = alpha * low;
            } else {
                cxa.globalAlpha = alpha;
            }
            // down
            cxa.beginPath();
            cxa.moveTo(pos.x - size, pos.y + distance);
            cxa.lineTo(pos.x, pos.y + distance + size);
            cxa.lineTo(pos.x + size, pos.y + distance);

            cxa.lineTo(pos.x + size - (2*units), pos.y + distance);
            cxa.lineTo(pos.x, pos.y + distance + size - (2*units));
            cxa.lineTo(pos.x - size + (2*units), pos.y + distance);
            cxa.closePath();
            cxa.fill();

        }

        if (up) {

            if (ceilY) {
                cxa.globalAlpha = alpha * low;
            } else {
                cxa.globalAlpha = alpha;
            }
            // up
            cxa.beginPath();
            cxa.moveTo(pos.x - size, pos.y - distance);
            cxa.lineTo(pos.x, pos.y - distance - size);
            cxa.lineTo(pos.x + size, pos.y - distance);

            cxa.lineTo(pos.x + size - (2*units), pos.y - distance);
            cxa.lineTo(pos.x, pos.y - distance - size + (2*units));
            cxa.lineTo(pos.x - size + (2*units), pos.y - distance);
            cxa.closePath();
            cxa.fill();
        }

        if (left) {

            if (floorX) {
                cxa.globalAlpha = alpha * low;
            } else {
                cxa.globalAlpha = alpha;
            }
            // left
            cxa.beginPath();
            cxa.moveTo(pos.x - distance, pos.y - size);
            cxa.lineTo(pos.x - distance - size, pos.y);
            cxa.lineTo(pos.x - distance, pos.y + size);

            cxa.lineTo(pos.x - distance, pos.y + size - (2*units));
            cxa.lineTo(pos.x - distance - size + (2*units), pos.y);
            cxa.lineTo(pos.x - distance, pos.y - size + (2*units));
            cxa.closePath();
            cxa.fill();

        }

        if (right) {

            if (ceilX) {
                cxa.globalAlpha = alpha * low;
            } else {
                cxa.globalAlpha = alpha;
            }
            // right
            cxa.beginPath();
            cxa.moveTo(pos.x + distance, pos.y - size);
            cxa.lineTo(pos.x + distance + size, pos.y);
            cxa.lineTo(pos.x + distance, pos.y + size);

            cxa.lineTo(pos.x + distance, pos.y + size - (2*units));
            cxa.lineTo(pos.x + distance + size - (2*units), pos.y);
            cxa.lineTo(pos.x + distance, pos.y - size + (2*units));
            cxa.closePath();
            cxa.fill();

        }

        if (mode==="shiftUp" || mode==="shiftDown" || mode==="shiftLeft" || mode==="shiftRight") {
            cxa.globalAlpha = alpha;
            //cxa.fillRect(pos.x - size, pos.y - units, size * 2, 2*units);
            cxa.beginPath();
            cxa.moveTo(pos.x - (2*units), pos.y);
            cxa.lineTo(pos.x, pos.y - (2*units));
            cxa.lineTo(pos.x + (2*units), pos.y);
            cxa.lineTo(pos.x, pos.y + (2*units));
            cxa.closePath();
            cxa.fill();

            // TEXT //
            cxa.font = "400 " + midType + "px Raleway";
            cxa.textAlign = "center";
            cxa.font = "400 italic " + midType + "px PT Sans";

            setColor(shardCols[0]);
            /*cxa.globalAlpha = alpha * 0.9;
            var bw = cxa.measureText(obj.Text.toUpperCase()).width + (20*units);
            cxa.fillRect(pos.x - (bw*0.5), pos.y - (45*units), bw, (20*units));

            if (scene < 7) {
                setColor(shardCols[4]);
            } else {
                setColor(landCols[1]);
            }*/
            cxa.globalAlpha = alpha;
            cxa.fillText(obj.Text,pos.x, pos.y - (42*units));

            cxa.fillRect(pos.x - (6*units), pos.y - (36*units), 12*units, 2*units );




        }

    }

}

function draw() {
  for (i=0; i< controllers.length; i++) {
        var controller = controllers[i];
        drawArrows(controller);
    }
}

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
    container.style.cursor="pointer";
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
    interactable = false;
    container.style.cursor="default";
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
  rolloverCheck();
  if (interactable && mouseIsDown == true) {
    // dragController(true);
    // var targetZPos = { zPos: 100 };
    //     // Reset z-pos info:
    // actualZPos= 0;
    // currentZPos = { zPos: 0 };
    // var position = { x: selection.position.x}
    // tween = new TWEEN.Tween(position)
    //   .to({ x: mouse.x }, 1000)
    //   .onUpdate(function() {
    //     actualZPos = currentZPos.zPos;
    //     selection.translateX(mouse.x);
    //   }).start();
  } else if (!interactable && mouseIsDown == true) {
    console.log('you didnt click an interactive object :(');
  }
}

function onMousePress() {
  mouseIsDown = true;
}

function onMouseRelease() {
  mouseIsDown = false;
  interactable = false;
}

function Point( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}

function Point3D( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

function Size( w, h ) {
    this.w = w || 0;
    this.h = h || 0;
}

function hitBox(x,y,w,h) { // IS CURSOR WITHIN GIVEN BOUNDARIES
    var mx = mouseX;
    var my = mouseY;
    return (mx>x && mx<(x+w) && my>y && my<(y+h));
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
    setup3D();
    draw();
    createDysonsphere();
    createClouds();
    // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mousedown', onMousePress, false );
    document.addEventListener( 'mouseup', onMouseRelease, false );

    animate();

}

window.addEventListener('load', onWindowLoaded, false);
