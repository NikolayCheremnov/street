const URL = "./"

// Load .obj model with .mtl
function loadObj(mtlURL, objURL, setPosition) {
	const objLoader = new THREE.OBJLoader();
	const mtlLoader = new THREE.MTLLoader();
	mtlLoader.load(mtlURL, (materials) => {
		materials.preload();
		objLoader.setMaterials(materials);
		
		objLoader.load(objURL, setPosition);
	})
}

function main() {
    // main color
    var main_color = 0xFFFFFF

	// Create scene, camera and render
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(main_color);

	const FOV = 90;
	const ASPECT = window.innerWidth/window.innerHeight;
	const NEAR = 0.1;
	const FAR = 100;
	
    var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    camera.position.x = 5;
    camera.position.z = -5;
    camera.position.y = 5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();
    
    // axes
    function drawStretch(x1=0, y1=0, z1=0, x2=1, y2=1, z2=1, color=0x000000) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x1,y1,z1));
        geometry.vertices.push(new THREE.Vector3(x2,y2,z2));
        var material = new THREE.LineBasicMaterial({color: color});
        var line = new THREE.Line(geometry, material);
        scene.add(line)
    }
    // axes drawing. x : red, y: green, z: blue
    drawStretch(0, 0, 0, 100, 0, 0, 0xFF0000);
    drawStretch(0, 0, 0, 0, 100, 0, 0x00FF00);
    drawStretch(0, 0, 0, 0, 0, 100, 0x0000FF);

    // spehere adding
    function drawSphhere() {
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshBasicMaterial({color:0x00EF00});
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.y = 5;
        scene.add(sphere);
    }

	// Floor
	const planeSize = 20;
	const textureLoader = new THREE.TextureLoader();
	
	const floorTexture = textureLoader.load(URL + "/textures/asphalt.jpg");
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.magFilter = THREE.NearestFilter;
	
	const repeats = 3;
	floorTexture.repeat.set(repeats, repeats);

	const planeGeo = new THREE.PlaneBufferGeometry(planeSize*3, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: floorTexture,
		side: THREE.DoubleSide,
	});
	
	const floor = new THREE.Mesh(planeGeo, planeMat);
	floor.rotation.x = Math.PI * -0.5;
	floor.position.set(0, 0, 0);
	floor.receiveShadow = true;
	
	scene.add(floor);

    // adding ambient light
    const ambient_light = new THREE.AmbientLight(main_color, 1)
    scene.add(ambient_light)

    // draw flashkights
    function drawLamp(x=0, y=0, z=0, steelColor=0x574C4C, lampColor=0xffff00) {
        // stick
        var radius = 0.1;
        var stickHeight = 8;
        
        var fiberGeometry1 = new THREE.CylinderGeometry(radius,
            radius, stickHeight);
        var fiberMaterial1 = new THREE.MeshPhongMaterial({
            color: steelColor,
        });
        var p1 = new THREE.Mesh(fiberGeometry1, fiberMaterial1);
        p1.position.set(x, y + stickHeight / 2, z);
        
        scene.add(p1);

        var radiusTop = 0.25;
        var radiusBottom = 0.5;
        var height = 1;
        
        // steel cone
        var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height);
        var material = new THREE.MeshBasicMaterial({
            color: steelColor,
        });
        var cone = new THREE.Mesh( geometry, material);
        cone.position.set(x, y + stickHeight - 0.3, z-0.3);
        cone.rotation.x = Math.PI / 4;
        scene.add(cone); 

        // lamp cone
        var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height);
        var material = new THREE.MeshBasicMaterial({
            color: lampColor,
        });
        var cone = new THREE.Mesh( geometry, material);
        cone.position.set(x, y + stickHeight-0.4, z-0.4);
        cone.rotation.x = Math.PI / 4;
        scene.add(cone); 

        // bottom part
        var radius = 0.4;
        var height = 0.2;
        
        var fiberGeometry2 = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial2 = new THREE.MeshPhongMaterial({
            color: steelColor,
        });
        var p2 = new THREE.Mesh(fiberGeometry2, fiberMaterial2);
        p2.position.set(x, 0.1 + y,z);
        
        scene.add(p2);

        // light adding
        var lampLightIntensity = 2;
        var lampLightDistance = 15;
        const lampLight = new THREE.PointLight( 0xffffff, lampLightIntensity, lampLightDistance);
        lampLight.position.set(x, y+stickHeight, z-6);
        lampLight.castShadow = true;
        scene.add(lampLight)
    }
    //drawLamp(0, 0, 0)
    for (var i = -30; i < 31; i += 15)
        drawLamp(i, 0, 9)

    // animate
	var animate = function() {
		requestAnimationFrame(animate);

		controls.update();

		renderer.render(scene, camera);
	}

	animate();
}

main();
