var scene;
var camera;
var renderer;
var container;
var iridescenceLookUp;
var iridescenceMaterial;
var torus;

window.onload = function () {
    init();
    initScene();
    animate();
}

function init() {
    container = document.getElementById("webglcontainer");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera.position.z = 30;
    scene.add(camera);

}

function initScene() {

    const torusGeo = new THREE.TorusGeometry(8, 3, 15 , 100);
    // let tex = new ThinFilmFresnelMap();
    const torusMat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const torus = new THREE.Mesh( torusGeo, torusMat );

    // LIGHT CREATION
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );

    // ADDING TO SCENE
    scene.add( torus );
    scene.add( light );
}


function animate() {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

animate();