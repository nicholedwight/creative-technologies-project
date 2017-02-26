function init() {
    createScene();
    createLights();

    // drawSkies();
    createPlanet();
    createDysonsphere();
    createClouds();
    createEarth();
    // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    setupAudio();

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mousedown', onMousePress, false );
    document.addEventListener( 'mouseup', onMouseRelease, false );

    animate();

}

function animate() {
  requestAnimationFrame(animate);
  // cubePivot.rotation.y += 0.05;
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
    // console.log(selection);

    if (selection.name == 'moon') {
      mouseX = event.clientX - windowHalfX;

    	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown);
      var max = 0.1; var min = -0.1;
      targetRotation = ( targetRotation - cube.rotation.y ) * 0.0006;
      if (targetRotation > max) {
        targetRotation = max;
      } else if (targetRotation < min) {
        targetRotation = min;
      }
      parent.rotation.y += targetRotation;
      // parent.rotation.x += targetRotation;
      console.log('dragging moon');
      // console.log('target rotation ', targetRotation);
    }

    if (selection.name == 'dysonSphere') {
      mouseX = event.clientX - windowHalfX;

    	targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown );
      var max = 0.1; var min = -0.1;
      targetRotation = ( targetRotation - cube.rotation.y ) * 0.0006;
      if (targetRotation > max) {
        targetRotation = max;
      } else if (targetRotation < min) {
        targetRotation = min;
      }
      // dysonSphere.position.x += targetRotation * 30;
      var vector = new THREE.Vector3(intersects[0].point.sub(offset).x, 0, 0);
      // vector.add();
      console.log(vector);
      dysonSphere.position.copy(vector);

      // console.log(intersects[0].point.sub(offset).x,intersects[0].point.sub(offset).y, intersects[0].point.sub(offset).z);
      // console.log(mouse.x, mouse.y);
      console.log('dragging dysonSphere');


    }



  } else if (!interactable && mouseIsDown == true) {
    console.log('you didnt click an interactive object :(');
  }


}

function onMousePress(event) {
  mouseIsDown = true;
  mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
  // _raycaster.setFromCamera( _mouse, camera );
  //
	// 	var intersects = _raycaster.intersectObjects(scene.children, true );
  //
	// 	if ( intersects.length > 0 ) {
  //
	// 		_selected = intersects[ 0 ].object;
  //
	// 		if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {
  //
	// 			_offset.copy( _intersection ).sub( _selected.position );
  //
	// 		}
  //
  //
	// 	}

}

function onMouseRelease() {
  mouseIsDown = false;
  interactable = false;
}


window.addEventListener('load', onWindowLoaded, false);
