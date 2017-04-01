// MODELS
function createEarth() {
  var loader = new THREE.GLTFLoader();
  var url = "models/planet.gltf";

  var count = 0;
    loader.load(url, function (data) {
      gltf = data;
      var object = gltf.scene;
      earth = object;
      earth.position.z = 0;
      earth.position.x = 20;
      earth.position.y = 0;
      earth.dir = 2;
      earth.scale.set(0.3,0.3,0.3);
      earth.rotation.z = 0.5;
      earth.name = "earth";
      scene.add(earth);
  });
}

function createGround() {
  var loader = new THREE.GLTFLoader();
  var url = "models/ground.gltf";

  var count = 0;
    loader.load(url, function (data) {
        gltf = data;
        var object = gltf.scene;
        ground = object;
        ground.position.z = 650;
        ground.position.x = 0;
        ground.position.y = -358;
        ground.dir = 2;
        ground.scale.set(20,20,20);
        ground.rotation.z = 1.5;
        ground.name = "ground";
        scene.add(ground);
    });
}
function blenderMoon() {
  var loader = new THREE.GLTFLoader();
  var url = "models/moon.gltf";

  var count = 0;
    loader.load(url, function (data) {
        gltf = data;
        var object = gltf.scene;
        moon = object;
        moon.position.z = 0;
        moon.position.x = 250;
        moon.position.y = 0;
        moon.dir = 2;
        moon.scale.set(8,8,8);
        moon.rotation.z = 1.5;
        moon.name = "moon";
        scene.add(moon);
    });
}

function createMoon() {
    var geometry = new THREE.IcosahedronGeometry(50, 1);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });
    // THE PARENT IS WHAT IS ROTATED, REFER TO ANIMATE() IN _MAIN.JS -> rotateAroundWorldAxis()
    parent = new THREE.Object3D();
    // scene.add(parent);
    var pivot = new THREE.Object3D();
    pivot.rotation.set(10, 10, 10);
    parent.add(pivot);
    moon = new THREE.Mesh( geometry, material );
    moon.castShadow = true;
    moon.receiveShadow = true;
    parent.castShadow = true;
    moon.name = 'moon';
    moon.position.x = 250;
    pivot.add(moon);
}

function createAsteroid() {
  var loader = new THREE.GLTFLoader();
  var url = "models/asteroid.gltf";

  var count = 0;
    loader.load(url, function (data) {
        gltf = data;
        var object = gltf.scene;
        asteroid = object;
        asteroid.position.z = 100;
        asteroid.position.x = -300;
        asteroid.position.y = 200;
        asteroid.dir = 2;
        asteroid.scale.set(20,20,20);
        asteroid.rotation.z = 1.5;
        asteroid.name = "asteroid";
        scene.add(asteroid);
    });
}

function createSun() {
  var loader = new THREE.GLTFLoader();
  var url = "models/sun.gltf";

  var count = 0;
    loader.load(url, function (data) {
      gltf = data;
      var object = gltf.scene;
      sun = object;
      sun.position.z = 0;
      sun.position.x = 450;
      sun.position.y = 250;
      sun.dir = 2;
      sun.scale.set(6,6,6);
      sun.rotation.z = 1.5;
      sun.name = "sun";
      scene.add(sun);
  });

  var loader = new THREE.GLTFLoader();
  var url = "models/sun2.gltf";

  var count = 0;
    loader.load(url, function (data) {
      gltf = data;
      var object = gltf.scene;
      sun2 = object;
      sun2.position.z = 0;
      sun2.position.x = 450;
      sun2.position.y = 250;
      sun2.dir = 2;
      sun2.scale.set(6,6,6);
      sun2.rotation.z = 2.5;
      sun2.name = "sun2";
      scene.add(sun2);
  });

  var loader = new THREE.GLTFLoader();
  var url = "models/sun.gltf";

  var count = 0;
    loader.load(url, function (data) {
      gltf = data;
      var object = gltf.scene;
      sun3 = object;
      sun3.position.z = 0;
      sun3.position.x = 450;
      sun3.position.y = 250;
      sun3.dir = 2;
      sun3.scale.set(6,6,6);
      sun3.rotation.z = 0.5;
      sun3.name = "sun3";
      scene.add(sun3);
  });

  var sunAtmosGeo = new THREE.IcosahedronGeometry(13, 1);
  var sunAtmosMat = new THREE.MeshPhongMaterial({
    olor: 0xF66120,
    emissive: 0xF66120,
    specular: 0xFFED22,
    shininess: 10,
    wireframe: true,
    side: THREE.DoubleSide
  });
  sunAtmosphere = new THREE.Mesh(sunAtmosGeo, sunAtmosMat);
  sunAtmosphere.position.set(450, 250, 0);
  sunAtmosphere.scale.set(10, 10, 10);
  sunAtmosphere.name = 'sunAtmosphere';
  scene.add(sunAtmosphere);
}

function createClouds() {
  // SIMILAR TO THE SUN, BUT TIED TOGETHER IN A GROUPED OBJECT3D ARE THE CLOUD FLUFFS. THE 'GROUP' OBJECT IS WHAT IS ROTATED, REFER TO ANIMATE() IN _MAIN.JS AS WITH THE MOON
  group = new THREE.Object3D();
  group.name = 'cloudGroup';
  var geometry = new THREE.OctahedronBufferGeometry(10, 1);
  var material = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.SmoothShading,
    emissive: Colors.white
  });
  var fluff = new THREE.Mesh(geometry.clone(), material);
  fluff.castShadow = true;
  fluff.scale.set(2,2,2);
  fluff.position.set(70,80, 30);
  fluff.name = 'fluff';
  var fluff2 = new THREE.Mesh(geometry.clone(), material);
  fluff2.castShadow = true;
  fluff2.scale.set(2.5,2.5,2.5);
  fluff2.position.set(95,60, 30);
  fluff2.name = 'fluff2';
  var fluff3 = new THREE.Mesh(geometry.clone(), material);
  fluff3.castShadow = true;
  fluff3.scale.set(2,2,2);
  fluff3.position.set(110,35, 30);
  fluff3.name = 'fluff3';

  var cloudPivot = new THREE.Object3D();
  cloudPivot.name = 'CloudGroup';
  cloudPivot.rotation.set(10, 10, 10);
  cloudPivot.position.set(50, 40, 30);
  group.add(cloudPivot);
  cloudPivot.add(fluff, fluff2, fluff3);

  scene.add(group);
}


function createRocket(){
  var loader = new THREE.GLTFLoader();
  var url = "models/rocket.gltf";

	var count = 0;
    loader.load(url, function (data) {
				gltf = data;
				var object = gltf.scene;
				rocket = object;
				rocket.position.z = 0;
				rocket.position.x = -65;
				rocket.position.y = 30;
				rocket.dir = 2;
        rocket.scale.set(2,2,2);
        rocket.rotation.z = 1.5;
        rocket.name = "rocket";
        scene.add(rocket);
    });
}
