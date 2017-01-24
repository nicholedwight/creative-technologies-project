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
    var raycaster;
		var mouse;
    var mesh, stars, skeleton, circle;

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
        camera.position.set(0, 0, 600);
        scene = new THREE.Scene();
        scene.add(camera);

        // createTriangle();
        drawStars();
        dysonPlanet();

        // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
        animate();
    }
    // End init

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

    function drawStars() {
      var starGeometry = new THREE.SphereGeometry(1000, 100, 50);
      var starAmount = 20000;
      var starMaterial = {
        size: 1.0,
        opacity: 0.7
      };
      var starMesh = new THREE.PointsMaterial(starMaterial);

      for (var i = 0; i < starAmount; i++) {
        var starVertex = new THREE.Vector3();
        starVertex.x = Math.random() * 1000 - 500;
        starVertex.y = Math.random() * 1000 - 500;
        starVertex.z = Math.random() * 800 - 500;
        starGeometry.vertices.push(starVertex);
      }
      stars = new THREE.Points(starGeometry, starMesh);
      scene.add(stars);
    }

    function dysonPlanet() {
      circle = new THREE.Object3D();
      skeleton = new THREE.Object3D();

      scene.add(circle);
      scene.add(skeleton);

      var geometry = new THREE.TetrahedronGeometry(2, 0);
      var geom = new THREE.IcosahedronGeometry(7, 1);
      var geom2 = new THREE.IcosahedronGeometry(15, 1);

      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
      });

      var mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
      });

      var mat2 = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        wireframe: true,
        side: THREE.DoubleSide

      });

      var planet = new THREE.Mesh(geom, mat);
      planet.scale.x = planet.scale.y = planet.scale.z = 8;
      circle.add(planet);

      var dysonSphere = new THREE.Mesh(geom2, mat2);
      dysonSphere.scale.x = dysonSphere.scale.y = dysonSphere.scale.z = 5;
      skeleton.add(dysonSphere);

      var ambientLight = new THREE.AmbientLight(0x999999 );
      scene.add(ambientLight);

      var lights = [];
      lights[0] = new THREE.DirectionalLight(0xffffff, 1);
      lights[0].position.set(-1, 0, -0.5);
      lights[1] = new THREE.DirectionalLight(0x11E8BB, 1);
      lights[1].position.set(-0.75, -1, 0.5);
      lights[2] = new THREE.DirectionalLight(0x8200C9, 1);
      lights[2].position.set(0.75, 1, 0.5);
      scene.add(lights[0]);
      scene.add(lights[1]);
      scene.add(lights[2]);
      control = new THREE.TransformControls(camera, renderer.domElement);
      control.addEventListener( 'change', render );
      control.attach(dysonSphere);
      scene.add(control);
      objects.push(dysonSphere);
    }

    function render() {
      renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        circle.rotation.x -= 0.0020;
        circle.rotation.y -= 0.0030;
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

    // Tone js code

    var count = 0;
    var pad = "0000000000";
    var previousBinarySet = pad.split('');
    var notes = ["D4", "E4", "F4", "G4", "A5", "C5", "D5", "E5", "F5", "G5"];
    var times = [1.7, 1.5, 1.3, 1.1, .9, .7, .5, .5, .5, .5];

    function toBinary(number){
      return (number >>> 0).toString(2);
    }

    function padNumber(numberString) {
      return pad.substring(0, pad.length - numberString.length) + numberString;
    }

    var synth = new Tone.PolySynth(16, Tone.SimpleSynth).set({
      "volume" : -8,
      "oscillator" : {
        "type" : "sine",
        frequency: 90,
        detune: 0,
        phase: 0
      },
      "envelope" : {
        "attack" :  0.025,
        "decay" :  0.35,
        "sustain" :  0.18,
        "release" :  0.2,
      },
    }).toMaster();

    var isplaying = false;
    function play() {

      Tone.Transport.bpm.value = 50;

      Tone.Transport.scheduleRepeat(function(time) {

        var number = Math.floor(count);
        count = count + 1;
        var numberString = padNumber(toBinary(number));

        var binaryArray = numberString.split('');

        for( var i = 0; i < binaryArray.length; i++ ) {
          if( binaryArray[i] === "1" && previousBinarySet[i] !== binaryArray[i]) {
            synth.triggerAttackRelease(notes[i], times[i], time);
          }
        }

        previousBinarySet = binaryArray;

        if( count > 1023 ) {
          count = 0;
        }
      }, "32i");

      Tone.Transport.start();
      isplaying = true;
    }

    /* End Tone.js code */
    var isMouseDown = false
    var originalmeshx;

    function onDocumentMouseDown( event ) {
      originalmeshx = objects[0].position.x;
			event.preventDefault();
			mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
			raycaster.setFromCamera( mouse, camera );

			var intersects = raycaster.intersectObjects( objects );

			if ( intersects.length > 0 ) {
        console.log('clicked');
        isMouseDown = true;
        if (isplaying === false) {
          play();
        } else {
          console.log('already playing music');
        }
		  } else {
        console.log('cant click');
      }
    }

    function onDocumentMouseMove() {
      // Need to fix so it's on mousedown and move
      // if (isMouseDown === true) {
          if (objects[0].position.x < originalmeshx) {
            console.log('moved left');
            synth.volume.value = objects[0].position.x;
          } else if (objects[0].position.x > originalmeshx) {
            console.log('moved right');
            synth.volume.value = objects[0].position.x;
          }
      // }
    }

    function onDocumentMouseUp() {
      isMouseDown = false;
    }

    function stopMusic() {
      Tone.Transport.stop();
      isplaying = false;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var stopButton = document.getElementById('stop');
    stopButton.addEventListener('click', stopMusic);
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousemove', onDocumentMouseUp, false );
    window.addEventListener('load', onWindowLoaded, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener( 'keydown', function ( event ) {
      // switch ( event.keyCode ) {
      //   case 81: // Q
      //     control.setSpace( control.space === "local" ? "world" : "local" );
      //     break;
      //   case 17: // Ctrl
      //     control.setTranslationSnap( 100 );
      //     control.setRotationSnap( THREE.Math.degToRad( 15 ) );
        //   break;
        // case 87: // W
        //   control.setMode( "translate" );
        //   break;
        // case 69: // E
          control.setMode( "rotate" );
          // break;
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
      // }
    });
})();
