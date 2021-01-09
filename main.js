const URL = "./"

// gui helper
class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
}

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
    var main_color = 0xB1E1FF;

	// Create scene, camera and render
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(main_color);

	const FOV = 90;
	const ASPECT = window.innerWidth/window.innerHeight;
	const NEAR = 0.1;
	const FAR = 100;
	
    var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    camera.position.x = 0;
    camera.position.z = 0;
    camera.position.y = 10;

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

    // constants
    const textureLoader = new THREE.TextureLoader();
    // plane drawing
    function drawPlane(x=0, y=0, z=0, xAngle=0, yAngle=0, zAngle=0, planeSize=20, texturePath="", repeats=1, wMul=1, hMul=1) {
        var planeTexture = textureLoader.load(texturePath);
        planeTexture.wrapS = THREE.RepeatWrapping;
        planeTexture.wrapT = THREE.RepeatWrapping;
        planeTexture.magFilter = THREE.NearestFilter;
        planeTexture.repeat.set(repeats, repeats);

        var geometry = new THREE.PlaneBufferGeometry(planeSize*wMul, planeSize*hMul);
        var material = new THREE.MeshPhongMaterial({
            map: planeTexture,
            side: THREE.DoubleSide,
        });
        var plane = new THREE.Mesh(geometry, material);

        // position
        plane.position.set(x, y, z);
        plane.rotation.x = xAngle;
        plane.rotation.y = yAngle;
        plane.rotation.z = zAngle;
        plane.receiveShadow = true;
        
        scene.add(plane);
    }
    // asphalt
    drawPlane(0, 0, 0, Math.PI * -0.5, 0, 0, 20, URL + "/textures/asphalt.jpg", 3, 3, 1);
    // sidewalk
    drawPlane(0, 0.89, -10, Math.PI * -0.5, 0, 0, 20, URL + "/textures/sidewalk.jpg", 6, 3, 0.5);

    // curb drawing
    function drawCurb(x=0, y=0, z=0, width=10, height=10, depth=10) {
        var geometry = new THREE.BoxGeometry(width, height, depth);
        var material = new THREE.MeshBasicMaterial({
            map: textureLoader.load('../textures/curb.jpg'),
        });
        var curb = new THREE.Mesh(geometry, material);
        curb.position.x = x;
        curb.position.y = y;
        curb.position.z = z;
        scene.add(curb);
    }
    for (var i = -30; i < 31; i += 3)
        drawCurb(i, 0, -5, 2.9, 2, 0.5);

    // draw flashlights
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
        var lampLightDistance = 20;
        const lampLight = new THREE.PointLight( 0xffffff, lampLightIntensity, lampLightDistance);
        lampLight.position.set(x, y+stickHeight, z-6);
        lampLight.castShadow = true;
        scene.add(lampLight)
    }
    //drawLamp(0, 0, 0)
    for (var i = -30; i < 31; i += 15)
        drawLamp(i, 0, 9);


    // shop 1
    loadObj(URL + "models/shop_1.mtl", URL + "models/shop_1.obj",
    (shop) => {
        //
        shop.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        shop.position.set(-22, 3.5, -9.5);
        shop.rotation.y = Math.PI;
        scene.add(shop);
       

    });

    // shop 2
    loadObj(URL + "models/shop_2.mtl", URL + "models/shop_2.obj",
    (shop) => {
        //
        shop.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        shop.position.set(-14.8, 4.5, -9.5);
        shop.scale.set(15, 20, 15);
        scene.add(shop);
       

    });

    // shop 3
    loadObj(URL + "models/shop_3.mtl", URL + "models/shop_3.obj",
    (shop) => {
        //
        shop.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        shop.position.set(14, 5.5, -9.5);
        shop.rotation.y = -Math.PI/4*3-Math.PI/8;
        shop.scale.set(70, 70, 70);
        scene.add(shop);
       

    });

    // garden
    loadObj(URL + "models/Garden.mtl", URL + "models/Garden.obj",
    (garden) => {
        //
        garden.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        garden.position.set(24, 1, -10);
        garden.scale.set(0.4, 0.4, 0.4);
        scene.add(garden);
       

    });

    // car
    loadObj(URL + "models/1385 Jeep.mtl", URL + "models/1385 Jeep.obj",
    (car) => {
        //
        car.traverse(function(child) {
            child.castShadow = true;
            child.receiveShadow = true;
        });
        car.position.set(10, -0.1, -2.2);
        car.rotation.y = Math.PI/2;
        car.scale.set(0.08, 0.08, 0.08);
        scene.add(car);
       

    });

    // benches addition
    function AddBench(x=0, y=0, z=0, yAngle=0) {
        loadObj(URL + "models/bench.mtl", URL + "models/bench.obj",
        (bench) => {
            //
            bench.traverse(function(child) {
                child.castShadow = true;
                child.receiveShadow = true;
            });
            bench.position.set(x, y, z);
            bench.rotation.y = yAngle;
            bench.scale.set(0.015, 0.015, 0.015);
            scene.add(bench);
            

        });
    }
    AddBench(5, 1.5, -9.5);
    AddBench(-5, 1.5, -9.5);


    
    // adding ambient light
    const h_light = new THREE.HemisphereLight(main_color, 0xB97A20, 0.5);
    scene.add(h_light);

    // animate
	var animate = function() {
		requestAnimationFrame(animate);

		controls.update();

		renderer.render(scene, camera);
    }
    
    // gui
    const gui = new dat.GUI();
    // ambient controls
    gui.addColor(new ColorGUIHelper(h_light, 'color'), 'value').name('color');
    gui.add(h_light, 'intensity', 0, 2, 0.01);
    animate();
}

main();
