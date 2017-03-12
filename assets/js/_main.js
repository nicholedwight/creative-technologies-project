function init() {
    createScene();
    createLights();

    createGround();
    createSun();
    createClouds();
    createEarth();
    createMoon();
    createRocket();
    // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
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
  // group.rotation.z += 0.01;
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
    rotationMatrix.multiply( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}



// MOUSE AND SCREEN EVENTS
function onWindowLoaded() {
  init();
  targetRotationY = 0;
  targetRotationX = 0;
  targetRotationZ = 0;
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
    // console.log(selection);

    if (selection.name == 'moon') {
      // mouseX = event.clientX - windowHalfX;
      //
    	// targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown);
      // var max = 0.1; var min = -0.1;
      // targetRotation = ( targetRotation - cube.rotation.y ) * 0.0006;
      // if (intersects[0].point.sub(offset).x > max) {
      //   targetRotation = max;
      // } else if (intersects[0].point.sub(offset).x < min) {
      //   targetRotation = min;
      // }
      // var vector = new THREE.Vector3(0, targetRotation, 0);
      // parent.rotation.set(vector);
      // // parent.rotation.x += targetRotation;
      // console.log('dragging moon');
      // console.log(vector);

        mouseX = event.clientX - windowHalfX;

       targetRotationX = ( mouseX - mouseXOnMouseDown ) * 0.00025;

       mouseY = event.clientY - windowHalfY;

       targetRotationY = ( mouseY - mouseYOnMouseDown ) * 0.00025;
    //  console.log(targetRotationY,targetRotationX);
    }

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

      var vector = new THREE.Vector3(intersects[0].point.sub(offset).x, 0, 0);
      // console.log(vector);
      rocket.position.copy(vector);
      console.log('dragging rocket');
    }

    // console.log(selection.parent.name);

    if (selection.name == 'fluff' || selection.name == 'fluff2' || selection.name == 'fluff3') {

     mouseY = event.clientY - windowHalfY;

     targetRotationZ = ( mouseY - mouseYOnMouseDown ) * 0.00025;
    }
    console.log(selection.name);



  } else if (!interactable && mouseIsDown == true) {
    console.log('you didnt click an interactive object :(');
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

}

function onMouseRelease() {
  mouseIsDown = false;
  interactable = false;
  targetRotationY = 0;
  targetRotationX = 0;
  targetRotationZ = 0;
}


window.addEventListener('load', onWindowLoaded, false);
