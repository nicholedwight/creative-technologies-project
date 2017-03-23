function init() {
    canvasA = document.getElementById("container");
    createScene();
    createLights();

    createGround();
    createSun();
    createClouds();
    createEarth();
    createMoon();
    // createRocket();
    setupAudio();

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mousedown', onMousePress, false );
    document.addEventListener( 'mouseup', onMouseRelease, false );

    animate();

}


function animate() {
  requestAnimationFrame(animate);
  var timer = 0.00001 * Date.now();
  for (var i = 0, il = starsArray.length; i < il; i++) {
       var star = starsArray[i];
       star.position.x = 400 * Math.sin(timer + i);
       star.position.z = 400 * Math.sin(timer + i * 1.1);
   }
  sun.rotation.x += 0.009;
  sun2.rotation.y += 0.009;
  sun3.rotation.z += 0.009;
  sunAtmosphere.rotation.x += 0.0005;
  sunAtmosphere.rotation.y += 0.0005;
  render();
}

function render() {
  raycaster.setFromCamera( mouse, camera );
  intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {
			if (INTERSECTED) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      selection = intersects[0].object;
		}
    pointer = true;
    interactable = true;
    container.style.cursor="pointer";
	} else {
		selection = null;
    interactable = false;
    container.style.cursor="default";
	}

  rotateAroundWorldAxis(parent, new THREE.Vector3(0, 1, 0), targetRotationX);
  rotateAroundWorldAxis(parent, new THREE.Vector3(1, 0, 0), targetRotationY);
  rotateAroundWorldAxis(group, new THREE.Vector3(0, 0, 1), targetRotationZ);

  targetRotationY = targetRotationY;
  targetRotationX = targetRotationX;
  renderer.render(scene, camera);
}

function rotateAroundWorldAxis( object, axis, radians ) {

    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}



// MOUSE AND SCREEN EVENTS
function onWindowLoaded() {
  init();
  targetRotationY = 0;
  targetRotationX = 0;
  targetRotationZ = 0;
  // droneStart();
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


    // MOUSE DRAG ON MOON
    if (selection.name == 'moon') {

        mouseX = event.clientX - windowHalfX;

       targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025;

       mouseY = event.clientY - windowHalfY;

       targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;

       // CHANGES FREQUENCY OF MOON AUDIO BASED ON SCREEN POSITION
       changeFrequency('moon', mouseX, mouseY);
    }


    // MOUSE DRAG ON ROCKET
    if (selection.parent.name == "factory_rocket_01") {
      mouseX = event.clientX - windowHalfX;

    	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown );
      var max = 0.1; var min = -0.1;
      targetRotation = ( targetRotation - moon.rotation.y ) * 0.0006;
      if (targetRotation > max) {
        targetRotation = max;
      } else if (targetRotation < min) {
        targetRotation = min;
      }

      var vector = new THREE.Vector3(intersects[0].point.sub(offset).x, 30, 0);
      rocket.position.copy(vector);
    }


    // MOUSE DRAG ON CLOUD
    if (selection.name == 'fluff' || selection.name == 'fluff2' || selection.name == 'fluff3') {

     mouseY = event.clientY - windowHalfY;
     var lastPos = mouseY;
     targetRotationZ = ( mouseY - mouseYOnMouseDown ) * 0.00025;

     if (player1 == false) {
       Player[1].start();
       player1 = true;
       if (selection.position.y > lastPos) {
         Player[1].volume.rampTo(mouseY / window.innerWidth);
         console.log(lastPos);
         console.log('increasing');
       } else {
         Player[1].volume.rampTo(mouseY / window.innerWidth);
         console.log('decreasing');
       }
     }

    }

  } else if (!interactable && mouseIsDown == true) {
    // console.log('you didnt click an interactive object :(');
  }


}

function onMousePress(event) {
  mouseIsDown = true;
  mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;

  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDownX = targetRotationX;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationOnMouseDownY = targetRotationY;

  if (interactable && mouseIsDown == true) {

    // console.log(selection.name);

    // MOUSE CLICK ON MOON
    if (selection.name == 'moon') {
      if (synthesizers['moon']) {
        // MOON IS ALREADY PLAYING, STOP AUDIO AND REMOVE FROM SYNTHESIZERS OBJECT
        synthesizers['moon'].triggerRelease();

      } else {
        // MOON DOES NOT EXIST WITHIN SYNTHESIZERS OBJECT, START AUDIO
        attack('moon', mouseY);
      }
    }

    if (selection.name == 'sunAtmosphere' ) {
        var kick = new Tone.MembraneSynth({
          "envelope": {
            "sustain": Math.floor(Math.random() * 4) + 1,
            "attack": 0.06,
            "decay": 0.8
          },
          "octaves": 10
        }).toMaster();

        kick.triggerAttackRelease(Math.floor(Math.random() * 600) + 250, "9n");
      
// ROCKET SOUND  new Tone.MembraneSynth({
// "envelope": {
// "sustain": 0,
// "attack": 0.02,
// "decay": 0.8
// },
// "octaves": 10
// }).toMaster();
      // ANIMATE SUN ATMOSPHERE ON CLICK
      selection.scale.set(11, 11, 11);
    }
  }
}

function onMouseRelease() {
  mouseIsDown = false;
  interactable = false;
  targetRotationY = 0;
  targetRotationX = 0;
  targetRotationZ = 0;

  sunAtmosphere.scale.set(10, 10, 10);
  delete synthesizers['moon'];
}


window.addEventListener('load', onWindowLoaded, false);
