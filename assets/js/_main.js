function init() {
    createScene();
    createLights();

    // drawSkies();
    createPlanet();
    createDysonsphere();
    createClouds();
    // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    setupAudio();

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
    if (selection.name == 'dysonSphere') {
      // control = new THREE.HorizontalControls();
      // control.attach(selection);
    } else if (selection.parent.name == 'cloudGroup') {
      // control = new THREE.VerticalControls();
    }
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
