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

function animate() {
  requestAnimationFrame(animate);
  render();
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

  if (interactable && mouseIsDown == true) {

    console.log(selection);
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


window.addEventListener('load', onWindowLoaded, false);
