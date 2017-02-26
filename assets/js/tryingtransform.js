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

  window.addEventListener('resize', onWindowResize, false);
}

function createLights() {
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
  var geometry = new THREE.IcosahedronGeometry(7, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });
  var planet = new THREE.Mesh(geometry, material);
  planet.scale.x = planet.scale.y = planet.scale.z = 8;
  planet.position.set(-300, 0, 0);
  planet.name = 'planet';
  // control = new THREE.TransformControlsX(camera, renderer.domElement, "x");
  // control.attach(planet);
  // scene.add(control);
  scene.add(planet);
}

function createDysonsphere() {
  var geometry = new THREE.IcosahedronGeometry(15, 1);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    wireframe: true,
    side: THREE.DoubleSide
  });
  dysonSphere = new THREE.Mesh(geometry, material);
  dysonSphere.scale.x = dysonSphere.scale.y = dysonSphere.scale.z = 5;
  dysonSphere.name = 'dysonSphere';
  dysonSphere.position.set(-300, 0, 0);
  // Creating the control which calls the Translate function for the X axis
  // control = new THREE.TransformControlsX(camera, renderer.domElement, "x");
  // Attaching control to the mesh
  // control.attach(dysonSphere);
  // Adding both the control and the mesh to the scene
  // scene.add(control);
  scene.add(dysonSphere);
}

function createEarth() {
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

    //----------
    // materials

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


    //----------
    // meshes

    base = new THREE.Mesh( baseGeom, baseMat );
    terrain = new THREE.Mesh( terrainGeom, terrainMat );
    terrainHeight = new THREE.Mesh( terrainHeightGeom, terrainHighMat );

    scene.add( base );
    base.add( terrain );
    base.add( terrainHeight );

    // PIVOT
    // cubePivot = new THREE.Object3D();
    // base.add(cubePivot);

    var geometry = new THREE.SphereGeometry(50, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    var material = new THREE.MeshNormalMaterial();
    parent = new THREE.Object3D();
    scene.add(parent);
    var pivot = new THREE.Object3D();
    pivot.rotation.set(10, 10, 10);
    parent.add(pivot);
    cube = new THREE.Mesh( geometry, material );
    cube.name = 'moon';
    cube.position.x = 250;
    pivot.add(cube);
}


function createClouds() {
  group = new THREE.Object3D();
  group.name = 'cloudGroup';
  var geometry = new THREE.OctahedronBufferGeometry(10, 1);
  var material = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.SmoothShading,
    emissive: Colors.white
  });
  var fluff = new THREE.Mesh(geometry.clone(), material);
  fluff.scale.set(2,2,2);
  fluff.position.set(50,60, 120);
  fluff.name = 'fluff';
  var fluff2 = new THREE.Mesh(geometry.clone(), material);
  fluff2.scale.set(2.5,2.5,2.5);
  fluff2.position.set(75,60, 120);
  fluff2.name = 'fluff2';
  var fluff3 = new THREE.Mesh(geometry.clone(), material);
  fluff3.scale.set(2,2,2);
  fluff3.position.set(100,55, 120);
  fluff3.name = 'fluff3';
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
  group.add(fluff, fluff2, fluff3);
  // controlY = new THREE.TransformControlsY(camera, renderer.domElement, "y");
  // controlY.attach(group);
  // scene.add(controlY);
  scene.add(group);
}
