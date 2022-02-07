var scene;
var camera;
var renderer;
var container;
var iridescenceLookUp;
var iridescenceMaterial;
var torus;
var controls;

const loader = new THREE.OBJLoader();

window.onload = function() {
    init();
    
    initScene();
    onResize();
    render();
    
    window.addEventListener("resize", onResize, false);
};

function addButterfly() {
    // var geometry = new THREE.SphereGeometry(1, 10)
    // var radiance = loadCubeMap("assets/skybox/radiance");
    // var irradiance = loadCubeMap("assets/skybox/irradiance");
    
    // iridescenceMaterial = new IridescentMaterial(irradiance, radiance, iridescenceLookUp, 8);
    // const butterfly = new THREE.Mesh( geometry, iridescenceMaterial );

    // const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));
    // butterfly.position.set(x, y, z);
    // scene.add(butterfly);
}

// function loadButterfly() {
//     loader.load(
//         'assets/obj/Butterfly.obj'
//     );
// }

function init() {
    container = document.getElementById("bg");
    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xeeeeee, 1.0);
    // renderer.setClearColor(0xeeeeee, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 0, 0);
    container.appendChild(renderer.domElement);
    iridescenceLookUp = new ThinFilmFresnelMap();  
    
    // Array(90).fill().forEach(addButterfly);
    scene.add(camera);
}

function initScene() {
    var radiance = loadCubeMap("assets/skybox/radiance");
    var irradiance = loadCubeMap("assets/skybox/irradiance");
    
    var torusGeom = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    iridescenceMaterial = new IridescentMaterial(irradiance, radiance, iridescenceLookUp, 8);
    torus = new THREE.Mesh(torusGeom, iridescenceMaterial);
    torus.position.z = -55;
    scene.add(torus);
}

function render() {
    torus.rotation.y += .001;
    torus.rotation.x += .0009;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    renderer.setSize(width, height);
    renderer.domElement.style.width = width + "px";
    renderer.domElement.style.height = height + "px";
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function loadCubeMap(path) {
    var files = [
        path + "/posX.jpg",
        path + "/negX.jpg",
        path + "/posY.jpg",
        path + "/negY.jpg",
        path + "/posZ.jpg",
        path + "/negZ.jpg"
    ];
    
    var loader = new THREE.CubeTextureLoader();
    return loader.load(files);
}

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    torus.rotation.x += 0.001;
    torus.rotation.y += 0.001;
    torus.rotation.z += 0.001;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;