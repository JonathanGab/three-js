import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// fonts
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const materials = new THREE.MeshMatcapMaterial({ matcap: texture });
  const text = new THREE.Mesh(textGeometry, materials);
  scene.add(text);

  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
  const sphereGeometry = new THREE.SphereGeometry(0.5, 18, 8);
  const squareGeometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i <= 20; i++) {
    const torus = new THREE.Mesh(torusGeometry, materials);

    torus.position.x = (Math.random() - 0.5) * 10;
    torus.position.y = (Math.random() - 0.5) * 10;
    torus.position.z = (Math.random() - 0.5) * 10;

    torus.rotation.x = Math.random() * Math.PI;
    torus.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    torus.scale.set(scale, scale, scale);

    scene.add(torus);
  }
  for (let i = 0; i <= 20; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, materials);

    sphere.position.x = (Math.random() - 0.5) * 10;
    sphere.position.y = (Math.random() - 0.5) * 10;
    sphere.position.z = (Math.random() - 0.5) * 10;

    sphere.rotation.x = Math.random() * Math.PI;
    sphere.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    sphere.scale.set(scale, scale, scale);

    scene.add(sphere);
  }
  for (let i = 0; i <= 20; i++) {
    const square = new THREE.Mesh(squareGeometry, materials);

    square.position.x = (Math.random() - 0.5) * 10;
    square.position.y = (Math.random() - 0.5) * 10;
    square.position.z = (Math.random() - 0.5) * 10;

    square.rotation.x = Math.random() * Math.PI;
    square.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();

    square.scale.set(scale, scale, scale);

    scene.add(square);
  }

  console.timeEnd("donut");
});

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * axes helper
 */

// const axesHelper = new THREE.AxesHelper();

// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("/textures/matcaps/8.png");
texture.colorSpace = THREE.SRGBColorSpace;
console.log(texture);

/**
 * Object
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
