function animate() {
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
  // framecount ++;
  // stats.begin();
  render();
  // stats.end();

  // Commented but used for benchmarking
  // var nowTime = performance.now();
	// var elapseSeconds = nowTime - startTime;
	// if (elapseSeconds >= 1000) {
	// 	// console.log(framecount);
	// 	if (fps.length <= 29) {
	// 		fps.push(framecount);
	// 	}
  //
	// 	if (fps.length == 30) {
	// 		console.log(fps);
	// 		let sum = fps.reduce((previous, current) => current += previous);
	// 		let avg = sum / fps.length;
	// 		console.log("avg is " + avg);
	// 	}
	// 	startTime = nowTime;
	// 	framecount = 0;
	// }

  requestAnimationFrame(animate);
}

function render() {
  raycaster.setFromCamera( mouse, camera );
  // SCENE.CHILDREN IS USED TO DETERMINE WHICH OBJECTS SHOULD BE INTERACTABLE, I COULD'VE PUSHED SPECIFIC MODELS TO AN ARRAY AND USED THAT INSTEAD, WHICH WOULD LEAVE OTHER MODELS ACTING AS NOT INTERACTIVE
  intersects = raycaster.intersectObjects(interactableObjects, true);

  // IF MOUSE IS HOVERING OVER AN INTERSECTED OBJECT, IT IS INTERACTABLE
	if (intersects.length > 0) {
    selection = intersects[0].object;
    pointer = true;
    interactable = true;
    container.style.cursor="pointer";
	} else {
		selection = null;
    interactable = false;
    container.style.cursor="default";
	}

  // THESE ARE USED FOR THE CLOUD(GROUP) AND MOON(PARENT) MODELS TO ROTATE AROUND THE PLANET, THIS CODE WAS BASED OFF OF: https://codepen.io/OpherV/pen/YXwwNR
  parent.rotation.y += ( targetRotationX - parent.rotation.y ) * 0.05;
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
  // SETTING BASE TARGETROTATIONS SO MODELS DON'T AUTO ROTATE WITHOUT USER INTERACTION
  targetRotationY = 0;
  targetRotationX = 0;
  targetRotationZ = 0;
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onMousePress(event) {
  mouseIsDown = true;
  mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
  targetRotationOnMouseDownX = targetRotationX;
  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationOnMouseDownY = targetRotationY;

  // CREATING BASE SYNTH, USED IN ONCLICK OF SUN (RANDOMISES ATTRIBUTES FOR A DIFFERENT SOUND EACH CLICK - SEE SELECTION.NAME = SUNATMOSPHERE)
  var kick = new Tone.MembraneSynth({
    "envelope": {
      "sustain": Math.floor(Math.random() * 4) + 1,
      "attack": 0.06,
      "decay": 0.8
    },
    "octaves": 10
  }).toMaster();

  // CLICKING ON AN INTERACTABLE OBJECT
  if (interactable && mouseIsDown == true) {
    // MOUSE CLICK ON MOON
    if (selection.name == 'moon') {
      // MOON DOES NOT EXIST WITHIN SYNTHESIZERS OBJECT, START AUDIO (_MOONAUDIO.JS)
      if (synthesizers['moon']) {
        console.log('moon is already playing');
      } else {
        attack('moon', mouseY);
      }
    }

    if (selection.name == 'sunAtmosphere' ) {
      kick.sustain = Math.floor(Math.random() * 4) + 1;
      kick.triggerAttackRelease(Math.floor(Math.random() * 600) + 250, "9n");
      setTimeout(function () {
           kick.dispose();
       }, 2000);

      // ANIMATE SUN ATMOSPHERE ON CLICK
      selection.scale.set(11, 11, 11);
    }
  }
}

function onMouseMove(event) {
	event.preventDefault();
  var pointer = false;
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight)  * 2 + 1;

  // IF CLICKING ON AN INTERACTABLE OBJECT WITHIN THE SCENE
  if (interactable && mouseIsDown == true) {

    // MOUSE DRAG ON MOON
    if (selection.name == 'moon') {
      // DETERMINING TARGETROTATIONS FOR THE MOON TO MOVE AROUND PLANET
      mouseX = event.clientX - windowHalfX;
      targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.007;
      mouseY = event.clientY - windowHalfY;

      // CHANGES FREQUENCY OF MOON AUDIO BASED ON SCREEN POSITION
      changeFrequency('moon', mouseX, mouseY);
    }

    // MOUSE DRAG ON CLOUD, BECAUSE INTERSECTED OBJECTS IS SEARCHING THROUGH THE SCENE.CHILDREN, THE CLOUD IS A GROUPED OBJECT SO IT ONLY DETERMINES PARTS OF THE OBJECT, RATHER THAN THE WHOLE
    if (selection.name == 'fluff' || selection.name == 'fluff2' || selection.name == 'fluff3') {

     mouseY = event.clientY - windowHalfY;
     var lastPos = mouseY;
     targetRotationZ = ( mouseY - mouseYOnMouseDown ) * 0.00055;

     // STARTING PLAYER1 AUDIO ON DRAG
     if (player1 == false) {
       Player[1].start();
       player1 = true;
     }
     // CHANGING VOLUME TO MATCH X POSITION WITHIN SCENE
     Player[1].volume.rampTo(group.rotation.z * 3);
     console.log(group.rotation.z * 3);
    }

    // MOUSE DRAG ON ASTEROID
    if (selection.name == 'asteroid') {
      if (player0 == false) {
        Player[0].start();
        player0 = true;
      }
      // CHANGING VOLUME TO MATCH X POSITION WITHIN SCENE, Y POSITION WAS NOT USED HERE BECAUSE IT WOULD BE LOUDER TOWARDS THE BOTTOM OF THE SCENE AND QUIETER TOWARDS THE TOP
      Player[0].volume.rampTo(event.clientX / 50);
    }

  } else if (!interactable && mouseIsDown == true) {
    // THIS JUST MEANS THE USER DIDN'T CLICK AN INTERACTABLE OBJECT
  }
}


function onMouseRelease() {
  mouseIsDown = false;
  interactable = false;
  targetRotationY = 0;
  targetRotationZ = 0;
  // RESETTING SUN ATMOSPHERE SIZE ON MOUSE UP
  sunAtmosphere.scale.set(10, 10, 10);
  // TRIGGERS RELEASE ON MOON'S AUDIO SO IT DOESN'T CREATE A NEVERENDING ANNOYING PITCH
  if (synthesizers['moon']) {
    stopFrequency('moon');
  }
  Tone.Transport.pause();
}

function onMouseOver() {
  container.style.cursor="pointer";
}

window.addEventListener('load', onWindowLoaded, false);
