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

function init() {
    container = document.getElementById("skillsbg");
    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setClearColor(0xeeeeee, 1.0);
    renderer.setClearColor(0xeeeeee, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 0, 0);
    container.appendChild(renderer.domElement);
    iridescenceLookUp = new ThinFilmFresnelMap();  
    
    scene.add(camera);
}

function initScene() {
    var radiance = loadCubeMap("assets/skybox/radiance");
    var irradiance = loadCubeMap("assets/skybox/irradiance");
    
    var torusGeom = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    iridescenceMaterial = new IridescentMaterial(irradiance, radiance, iridescenceLookUp, 9);
    torus = new THREE.Mesh(torusGeom, iridescenceMaterial);
    torus.position.z = -50;
    // torus.position.y =-6;
    scene.add(torus);
}

function render() {
    torus.rotation.y += .002;
    torus.rotation.x += .0015;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    renderer.setSize(width, height);
    renderer.domElement.style.width = width / 2 + "px";
    renderer.domElement.style.height = (height + 10) / 2 + "px";
    
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

    const multiplier = 8;

    torus.rotation.x += 0.001 * multiplier;
    torus.rotation.y += 0.001 * multiplier;
    torus.rotation.z += 0.001 * multiplier;

    camera.position.z = t * -0.01 * multiplier;
    camera.position.x = t * -0.0002 * multiplier;
    camera.position.y = t * -0.0002 * multiplier;
}

document.body.onscroll = moveCamera;