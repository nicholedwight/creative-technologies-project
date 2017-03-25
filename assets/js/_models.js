// MODELS

function createStars() {
  var geoSphere = new THREE.SphereGeometry(Math.random() * 1, 20, 20);
    for (var i = 0; i < 500; i++) {
        starMat = new THREE.MeshPhongMaterial({
            emissive: '#fff'
        });
        starsArray.push(new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 1, 20, 20), starMat));
    }
    for (var i = 0; i < starsArray.length; i++) {
        starsArray[i].position.set(Math.random() * 1200 - 600, Math.random() * 800 - 400, Math.random() * 300 - 400);
        scene.add(starsArray[i]);
    }
}

function createGround() {
  var planeMaterial = new THREE.MeshPhongMaterial({
    specular: 0xfb8717,
    color: 0xFF4E50,
    emissive: 0xFF4E50,
    shininess: 30,
    shading: THREE.FlatShading
  });

  widthSegs = 75, heightSegs = 35;

  groundGeometry = new THREE.SphereGeometry( 90, widthSegs, heightSegs );

  var knead = function( vertices, amplitude ) {
    for ( var i = 0; i < vertices.length; i++ ) {
      if ( i % ( widthSegs + 1 ) == 0 )
        vertices[i] = vertices[i + widthSegs];
      else
        vertices[i][["x", "y", "z"][~~( Math.random() * 3 )]] += Math.random() * amplitude;
    }
  };

  knead(groundGeometry.vertices, 10);
  ground = new THREE.Mesh(groundGeometry, planeMaterial);
  ground.name = "ground";
  ground.position.set(0, -98, 950);
  ground.rotateX(2);
  scene.add(ground);
}

function createEarth() {
  // CODE FOR CREATING EARTH WAS ADAPTED FROM SAM SACCONE AT: http://codepen.io/s/details/kAcDI
  // ANOTHER METHOD OF DOING THIS IS TO USE NOISE, THIS METHOD WAS USED WHEN CREATING THE ASTEROID
  widthSegs = 25, heightSegs = 15;
  baseGeom = new THREE.SphereGeometry( 80, widthSegs, heightSegs );
  terrainHeightGeom = new THREE.SphereGeometry( 79, widthSegs, heightSegs );
  terrainGeom = new THREE.SphereGeometry( 77, widthSegs, heightSegs );

  // creating fluctuation in terrain height to look more like a planet
  var knead = function( vertices, amplitude ) {
    for ( var i = 0; i < vertices.length; i++ ) {
      if ( i % ( widthSegs + 1 ) == 0 )
        vertices[i] = vertices[i + widthSegs];
      else
        vertices[i][["x", "y", "z"][~~( Math.random() * 3 )]] += Math.random() * amplitude;
    }
  };

  knead(baseGeom.vertices, 10);
  knead(terrainGeom.vertices, 13);
  knead(terrainHeightGeom.vertices, 13);

  baseMat = new THREE.MeshLambertMaterial( {
    color: 0x76acda,
    transparent: true,
    opacity: 0.75,
    shading: THREE.FlatShading
  } );
  terrainMat = new THREE.MeshLambertMaterial( {
    color: 0xe3c97f,
    shading: THREE.FlatShading
  } );
  terrainHighMat = new THREE.MeshLambertMaterial( {
    color: 0xb8e058,
    shading: THREE.FlatShading
  } );

  base = new THREE.Mesh( baseGeom, baseMat );
  terrain = new THREE.Mesh( terrainGeom, terrainMat );
  terrainHeight = new THREE.Mesh( terrainHeightGeom, terrainHighMat );
  base.receiveShadow = true;
  terrain.receiveShadow = true;
  terrainHeight.receiveShadow = true;
  scene.add( base );
  base.add( terrain );
  base.add( terrainHeight );

}

function createMoon() {
    var geometry = new THREE.IcosahedronGeometry(50, 1);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });
    // THE PARENT IS WHAT IS ROTATED, REFER TO ANIMATE() IN _MAIN.JS -> rotateAroundWorldAxis()
    parent = new THREE.Object3D();
    scene.add(parent);
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
  var geometry = new THREE.DodecahedronGeometry(30, 1);
  geometry.vertices.forEach(function(v) {
    v.x += (0-Math.random()*(35/4));
    v.y += (0-Math.random()*(35/4));
    v.z += (0-Math.random()*(35/4));
  });
  var color = 0x756363;
  var material = new THREE.MeshStandardMaterial({
    color: color,
    shading: THREE.FlatShading,
    roughness: 0.8,
    metalness: 1
  });
  var asteroid = new THREE.Mesh(geometry, material);
  asteroid.castShadow = true;
  asteroid.receiveShadow = true;
  asteroid.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
  asteroid.position.set(-300, 200, 100);
  asteroid.name = 'asteroid';
  asteroidArray.push(asteroid);
  scene.add(asteroid);
}

function createSun() {
  // THE SUN IS CREATED BY OVERLAPPING 3 ICOSAHEDRONS ALL ROTATING IN SLIGHTLY DIFFERENT DIRECTIONS, THE ATMOSPHERE IS CREATED BY USING THE WIREFRAME OF ONE ICOSAHEDRON
  var sunMat = new THREE.MeshPhongMaterial({
      color: 0xF66120,
      emissive: 0xF66120,
      specular: 0xFFED22,
      shininess: 10,
      shading: THREE.FlatShading,
      transparent: 1,
      opacity: 1
  });
  var sunMat2 = new THREE.MeshPhongMaterial({
      color: 0xF66120,
      emissive: 0xF66120,
      specular: 0xFFED22,
      shininess: 10,
      shading: THREE.FlatShading,
      transparent: 1,
      opacity: 1
  });
  sun = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), sunMat);
  scene.add(sun);
  sun.name = 'sun';
  sun.scale.set(10, 10, 10);
  sun.position.set(450, 250, 0);
  sun2 = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), sunMat2);
  sun2.rotation.x = 1;
  sun2.scale.set(10, 10, 10);
  sun2.position.set(450, 250, 0);
  scene.add(sun2);
  sun2.name = 'sun';
  sun3 = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), sunMat2);
  sun3.rotation.x = 1;
  sun3.scale.set(10, 10, 10);
  sun3.position.set(450, 250, 0);
  sun3.name = 'sun';
  scene.add(sun3);

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
  var url = "rocket.gltf";

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
