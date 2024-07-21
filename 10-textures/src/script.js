import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("on start");
};
loadingManager.onLoad = () => {
  console.log("on load");
};
loadingManager.onProgress = () => {
  console.log("on progress");
};
loadingManager.onError = (error) => {
  console.log("error", error);
};

const textureLoader = new THREE.TextureLoader(loadingManager);
// color
const colorTexture = textureLoader.load("/textures/minecraft.png");
colorTexture.colorSpace = THREE.SRGBColorSpace;
// alpha
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
alphaTexture.colorSpace = THREE.SRGBColorSpace;
// ambient
const ambientTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
ambientTexture.colorSpace = THREE.SRGBColorSpace;
// height
const heightTexture = textureLoader.load("/textures/door/height.jpg");
heightTexture.colorSpace = THREE.SRGBColorSpace;
// metal
const metalTexture = textureLoader.load("/textures/door/metalness.jpg");
metalTexture.colorSpace = THREE.SRGBColorSpace;
// normal
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
normalTexture.colorSpace = THREE.SRGBColorSpace;
// rough
const roughTexture = textureLoader.load("/textures/door/roughness.jpg");
roughTexture.colorSpace = THREE.SRGBColorSpace;

// colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.z = 1;

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
