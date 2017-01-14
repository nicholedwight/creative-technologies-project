(function () {
    'use strict';

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    var hud = document.getElementById('hud');
    var container = document.getElementById('container');

    var loadingContainer = document.getElementById('loading-container');
    var loadingMessage = document.getElementById('loading-message');

    var normVertShader = document.getElementById('norm-vert-shader');
    var normFragShader = document.getElementById('norm-frag-shader');

    var scene;
    var renderer;
    var camera;
    var clock;
    var controls;
    var stats;

    var moon;
    var starfield;
    var light = {
        speed: 0.1,
        distance: 1000,
        position: new THREE.Vector3(0, 0, 0),
        orbit: function (center, time) {
            this.position.x =
                (center.x + this.distance) * Math.sin(time * -this.speed);

            this.position.z =
                (center.z + this.distance) * Math.cos(time * this.speed);
        }
    };

    function createMoon(textureMap, normalMap) {
        var radius = 50;
        var xSegments = 50;
        var ySegments = 50;
        var geo = new THREE.SphereGeometry(radius, xSegments, ySegments);

        var mat = new THREE.ShaderMaterial({
            uniforms: {
                lightPosition: {
                    type: 'v3',
                    value: light.position
                },
                textureMap: {
                    type: 't',
                    value: textureMap
                },
                normalMap: {
                    type: 't',
                    value: normalMap
                },
                uvScale: {
                    type: 'v2',
                    value: new THREE.Vector2(1.0, 1.0)
                }
            },
            vertexShader: normVertShader.innerText,
            fragmentShader: normFragShader.innerText
        });

        var mesh = new THREE.Mesh(geo, mat);
        mesh.geometry.computeTangents();
        mesh.position.set(200, 90, 0);
        mesh.rotation.set(0, 180, 0);
        scene.add(mesh);
        return mesh;
    }

    function createSkybox(texture) {
        var size = 15000;

        var cubemap = THREE.ShaderLib.cube;
        cubemap.uniforms.tCube.value = texture;

        var mat = new THREE.ShaderMaterial({
            fragmentShader: cubemap.fragmentShader,
            vertexShader: cubemap.vertexShader,
            uniforms: cubemap.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        var geo = new THREE.CubeGeometry(size, size, size);

        var mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        return mesh;
    }

    function init() {
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true
        });

        renderer.setClearColor(0x000000, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        var fov = 35;
        var aspect = window.innerWidth / window.innerHeight;
        var near = 1;
        var far = 65536;

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.set(0, 0, 800);

        scene = new THREE.Scene();
        scene.add(camera);

        // controls = new THREE.TrackballControls(camera);
        // controls.rotateSpeed = 0.5;
        // controls.dynamicDampingFactor = 0.5;

        clock = new THREE.Clock();
    }

    function animate() {
        requestAnimationFrame(animate);
        light.orbit(moon.position, clock.getElapsedTime());
        // controls.update(camera);
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    function loadAssets(options) {
        var paths = options.paths;
        var onBegin = options.onBegin;
        var onComplete = options.onComplete;
        var onProgress = options.onProgress;
        var total = 0;
        var completed = 0;
        var textures = { };
        var key;

        for (key in paths)
            if (paths.hasOwnProperty(key)) total++;

        for (key in paths) {
            if (paths.hasOwnProperty(key)) {
                var path = paths[key];
                if (typeof path === 'string')
                    THREE.ImageUtils.loadTexture(path, null, getOnLoad(path, key));
                else if (typeof path === 'object')
                    THREE.ImageUtils.loadTextureCube(path, null, getOnLoad(path, key));
            }
        }

        function getOnLoad(path, name) {
            return function (tex) {
                textures[name] = tex;
                completed++;
                if (typeof onProgress === 'function') {
                    onProgress({
                        path: path,
                        name: name,
                        total: total,
                        completed: completed
                    });
                }
                if (completed === total && typeof onComplete === 'function') {
                    onComplete({
                        textures: textures
                    });
                }
            };
        }
    }

    /** When the window loads, we immediately begin loading assets. While the
        assets loading Three.JS is initialized. When all assets finish loading
        they can be used to create objects in the scene and animation begins */
    function onWindowLoaded() {
        loadAssets({
            paths: {
                moon: 'assets/maps/moon.jpg',
                moonNormal: 'assets/maps/normal.jpg',
                starfield: [
                    'assets/starfield/front.png',
                    'assets/starfield/back.png',
                    'assets/starfield/left.png',
                    'assets/starfield/right.png',
                    'assets/starfield/top.png',
                    'assets/starfield/bottom.png'
                ]
            },
            onComplete: function (evt) {
                var textures = evt.textures;
                moon = createMoon(textures.moon, textures.moonNormal);
                starfield = createSkybox(textures.starfield);
                animate();
            }
        });

        init();
    }

    /** Window load event kicks off execution */
    window.addEventListener('load', onWindowLoaded, false);
    window.addEventListener('resize', onWindowResize, false);
})();
