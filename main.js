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
	// Create scene, camera and render
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0x485E5C);

	const FOV = 90;
	const ASPECT = window.innerWidth/window.innerHeight;
	const NEAR = 0.1;
	const FAR = 100;
	
	var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    camera.position.z = -5;
    camera.position.y = 5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();
	
	// Floor
	const planeSize = 10;
	const textureLoader = new THREE.TextureLoader();
	
	const floorTexture = textureLoader.load(URL + "models/textures/kover.jpg");
	floorTexture.wrapS = THREE.RepeatWrapping;
	floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.magFilter = THREE.NearestFilter;
	
	const repeats = 6;
	floorTexture.repeat.set(repeats, repeats);

	const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: floorTexture,
		side: THREE.DoubleSide,
	});
	
	const floor = new THREE.Mesh(planeGeo, planeMat);
	floor.rotation.x = Math.PI * -0.5;
	floor.position.set(0, 0.1, 0);
	floor.receiveShadow = true;
	
	scene.add(floor);

	// // Adding room walls
	// let width = 10;
	// let height = 5;
	// let depth = 10;
	
	// var geometry = new THREE.BoxGeometry(width, height, depth);
	// var material = new THREE.MeshPhongMaterial({
	// 	color: 0xffffff,
	// 	side: THREE.DoubleSide
	// });

	// var roomCube = new THREE.Mesh(geometry, material);
	// roomCube.receiveShadow = true;
	// roomCube.position.set(0, 2.5, 0);
	
    // scene.add(roomCube);
    
    // drow bowl
    function drowBowl(x=0, y=0, z=0, colorBowl=0xff0000, colorFood=0x057D9F) {
        // top part
        var radius = 3;
        var height = 3;
        
        var fiberGeometry = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial = new THREE.MeshPhongMaterial({
            color: colorBowl,
        });
        var food = new THREE.Mesh(fiberGeometry, fiberMaterial);
        food.position.set(1 + x, 0.2 + y, -4 + z);
        food.scale.set(0.1, 0.1, 0.1);
        
        scene.add(food);
        // bottom part
        var radius = 4;
        var height = 2;
        
        var fiberGeometry = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial = new THREE.MeshPhongMaterial({
            color: colorBowl,
        });
        var food = new THREE.Mesh(fiberGeometry, fiberMaterial);
        food.position.set(1 + x, 0.1 + y, -4 + z);
        food.scale.set(0.1, 0.1, 0.1);
        
        scene.add(food);

        // dog food
        var radius = 2;
        var height = 3;
        
        var fiberGeometry = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial = new THREE.MeshPhongMaterial({
            color: colorFood,
        });
        var food = new THREE.Mesh(fiberGeometry, fiberMaterial);
        food.position.set(1 + x, 0.21 + y, -4 + z);
        food.scale.set(0.1, 0.1, 0.1);
        scene.add(food);
    }

    drowBowl();
    drowBowl(-1, 0, 0, 0xBC008D, 0x431B19)
    
    // drow lamp
    function drowLamp(x=0, y=0, z=0, colorSteec=0xff0000, colorLamp=0xffff00) {
        // top part
        var radius = 0.05;
        var height = 3;
        
        var fiberGeometry1 = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial1 = new THREE.MeshPhongMaterial({
            color: colorSteec,
        });
        var p1 = new THREE.Mesh(fiberGeometry1, fiberMaterial1);
        p1.position.set(x, 1.5 + y, z);
        
        scene.add(p1);

        var radius = 0.5;
        var height = 0.5;
        // scene.add(p2)
        var geometry = new THREE.ConeBufferGeometry( radius, height );
        var material = new THREE.MeshBasicMaterial({
            color: colorLamp
        });
        var cone = new THREE.Mesh( geometry, material);
        cone.position.set(x, 3 + y, z);
        scene.add(cone);
        
        // bottom part
        var radius = 0.4;
        var height = 0.2;
        
        var fiberGeometry2 = new THREE.CylinderGeometry(radius,
            radius, height);
        var fiberMaterial2 = new THREE.MeshPhongMaterial({
            color: colorSteec,
        });
        var p2 = new THREE.Mesh(fiberGeometry2, fiberMaterial2);
        p2.position.set(x, 0.1 + y,z);
        
        scene.add(p2);

        return p1;
    }
    drowLamp(-0.5, 0, 3)

	// Lamp light
	var lampLightIntensity = 1;
	var lampLightDistance = 10;

	const lampLight1 = new THREE.PointLight( 0xffffff, lampLightIntensity,
		 lampLightDistance);
	lampLight1.position.set(0, 4.5, -5);
	lampLight1.castShadow = true;
	
    scene.add(lampLight1);
    
    // "window" light
	var lampLightIntensity = 1;
	var lampLightDistance = 5;

	const lampLight2 = new THREE.PointLight( 0xFFED90, lampLightIntensity,
		 lampLightDistance);
    lampLight2.position.set(-0.5, 2.5, 3);
    lampLight2.castShadow = true;

    scene.add(lampLight2);

    scaleSet = function(obj, k) {
        obj.scale.set(k, k, k)
    }

	// dining room
	loadObj(URL + "models/dr.mtl", URL + "models/dr.obj",
		(dr) => {
			// First chair
			dr.traverse(function(child) {
				child.castShadow = true;
				child.receiveShadow = true;
			});

            scaleSet(dr, 60);
            dr.rotation.y = Math.PI * -0.3;
			
			dr.position.set(-0.2, 2.35, 2.5);

			scene.add(dr);
		 }
    );
    // poly_chair
    loadObj(URL + "models/poly_chair.mtl", URL + "models/poly_chair.obj",
    (dog) => {
        //
        dog.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        scaleSet(dog, 0.7)
        dog.position.set(-1, 0.1, -1.5);

        scene.add(dog);
    });

    // Mesh_Beagle
    loadObj(URL + "models/Mesh_Beagle.mtl", URL + "models/Mesh_Beagle.obj",
    (dog) => {
        //
        dog.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        dog.position.set(0, 0.1, 0.5);

        scene.add(dog);
    });

    // Mesh_Poodle
    loadObj(URL + "models/Mesh_Poodle.mtl", URL + "models/Mesh_Poodle.obj",
    (dog) => {
        //
        dog.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        scaleSet(dog, 1.2)
        dog.position.set(-1, 0.1, 0);
        scene.add(dog);
    });

	var animate = function() {
		requestAnimationFrame(animate);

		controls.update();

		renderer.render(scene, camera);
	}

	animate();
}

main();
