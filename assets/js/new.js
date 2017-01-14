(function () {
    'use strict';

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    var container = document.getElementById('container');

    var scene;
    var renderer;
    var camera;
    var controls;
    var objects = [];
    var control;

    function init() {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        container.appendChild(renderer.domElement);

        var fov = 35;
        var aspect = window.innerWidth / window.innerHeight;
        var near = 1;
        var far = 65536;

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 30);

        scene = new THREE.Scene();
        scene.add(camera);


        // controls = new THREE.TrackballControls(camera);
				// controls.rotateSpeed = 1.0;
				// controls.zoomSpeed = 1.2;
				// controls.panSpeed = 0.8;
				// controls.noZoom = false;
				// controls.noPan = false;
				// controls.staticMoving = true;
				// controls.dynamicDampingFactor = 0.3;

        createTriangle();

        // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);

        animate();
    }

    function createTriangle() {
      var light, light2, mesh;
    	light = new THREE.DirectionalLight(0xa0590c,1);
    	light2 = new THREE.HemisphereLight(0x9030ff, 0x30ff33, 1);
    	light.position.set(20,-20,0);
    	scene.add(light,light2);

    	var material = new THREE.ShaderMaterial({
    		vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    		wireframe: true

    	});
    	var geometry = new THREE.OctahedronGeometry(2);
      control = new THREE.TransformControls(camera, renderer.domElement);
      control.addEventListener( 'change', render );

  		mesh = new THREE.Mesh(geometry, material);
  		mesh.rotation.z = Math.random() * (0.4 - -0.4) - 0.4;
  		mesh.position.set(-4.68, -0.042, 0.57);
  		mesh.scale.set(0.5, 1.148, 0.5);
  		mesh.direction = -1;
      control.attach(mesh);
      scene.add( control );
  		scene.add(mesh);
      objects.push(mesh);

    }

    function render() {
      // controls.update();
      renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    function onWindowLoaded() {
        init();
    }

    /** Window load event kicks off execution */
    window.addEventListener('load', onWindowLoaded, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener( 'keydown', function ( event ) {
      switch ( event.keyCode ) {
        case 81: // Q
          control.setSpace( control.space === "local" ? "world" : "local" );
          break;
        case 17: // Ctrl
          control.setTranslationSnap( 100 );
          control.setRotationSnap( THREE.Math.degToRad( 15 ) );
          break;
        case 87: // W
          control.setMode( "translate" );
          break;
        // case 69: // E
        //   control.setMode( "rotate" );
        //   break;
        // case 82: // R
        //   control.setMode( "scale" );
        //   break;
        // case 187:
        // case 107: // +, =, num+
        //   control.setSize( control.size + 0.1 );
        //   break;
        // case 189:
        // case 109: // -, _, num-
        //   control.setSize( Math.max( control.size - 0.1, 0.1 ) );
        //   break;
      }
    });
})();
