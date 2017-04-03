function init() {
    // Commented but used for benchmarking
    // var loadStartTime = Date.now();
    // var status = document.getElementById("status");
    createScene();
    createLights();

    createGround();
    createSun();
    createClouds();
    createEarth();
    createMoon();
    createStars();
    createAsteroid();
    setupAudio();

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mousedown', onMousePress, false );
    document.addEventListener( 'mouseup', onMouseRelease, false );
    document.addEventListener( 'mouseover', onMouseOver, false );

    animate();
    // Commented but used for benchmarking
    // var loadEndTime = Date.now();
		// var loadTime = (loadEndTime - loadStartTime) / 1000;
		// status.innerHTML = "Load time: " + loadTime.toFixed(2) + " seconds.";
}

function createScene() {
  raycaster = new THREE.Raycaster();

  renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
  });
  // renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.sortObjects = false;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  var fov = 35;
  var aspect = window.innerWidth / window.innerHeight;
  var near = 1;
  var far = 65536;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 1000);
  // var controls = new THREE.OrbitControls(camera, renderer.domElement);
  scene = new THREE.Scene();
  scene.add(camera);

  var dragControls = new THREE.DragControls( asteroidArray, camera, renderer.domElement );

  window.addEventListener('resize', onWindowResize, false);
}


function createLights() {
  ambientLight = new THREE.AmbientLight(0x663344,0.3);
  scene.add(ambientLight);

  light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.set(200,100,200);
  light.castShadow = true;
  light.shadow.camera.left = -400;
  light.shadow.camera.right = 400;
  light.shadow.camera.top = 400;
  light.shadow.camera.bottom = -400;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  scene.add(light);
}
