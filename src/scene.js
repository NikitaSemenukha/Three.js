import * as THREE from './../node_modules/three/build/three.module.js';

// Scene settings
const scene = new THREE.Scene();
const spaceTexture = new THREE.TextureLoader().load('./assets/space.jpg');
scene.background = spaceTexture;

// Camera settings
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer settings
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.body.appendChild(renderer.domElement);

// Global lighting
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Earth settings
const earthTexture = new THREE.TextureLoader().load('./assets/01-3.jpg');
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
        map: earthTexture,
    })
);
earth.position.z = -5;
scene.add(earth);

// Add stars in the background
function addStar() {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(90));

    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// Animation | Every frame
function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.003;
    earth.rotation.x += 0.002;
    earth.rotation.z += 0.002;

    renderer.render(scene, camera);
}

// Start the animation
animate();

// Handler for scrolling
document.body.onscroll = handlerScroll;

function handlerScroll() {
    const t = document.body.getBoundingClientRect().top;

    if (camera.position.z < -1.4) {
        if (earth.position.x > -0.8) {
            earth.position.x -= 0.02;
        }
    } else {
        earth.position.x = 0;
    }

    camera.position.z = t * 0.001;
}

// Export the scene, camera, and renderer objects
export { scene, camera, renderer };
