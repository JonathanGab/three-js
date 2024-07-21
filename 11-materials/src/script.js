import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
/**
 * GUI
 */

const gui = new GUI();

const debugObject = {};
const torusFolder = gui.addFolder("torus");
const torusSubdivision = torusFolder.addFolder("subdivision");
const positionFolder = torusFolder.addFolder("position");
const textureFolder = torusFolder.addFolder("texture");
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// texture
const textureLoader = new THREE.TextureLoader();

const doorColor = textureLoader.load("/textures/door/color.jpg");
doorColor.colorSpace = THREE.SRGBColorSpace;
const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbient = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeight = textureLoader.load("/textures/door/height.jpg");
const doorMetal = textureLoader.load("/textures/door/metalness.jpg");
const doorNormal = textureLoader.load("/textures/door/normal.jpg");
const doorRough = textureLoader.load("/textures/door/roughness.jpg");

const firstMatsCaps = textureLoader.load("/textures/matcaps/1.png");
firstMatsCaps.colorSpace = THREE.SRGBColorSpace;
const firstgradients = textureLoader.load("/textures/gradients/3.jpg");
// Scene
const scene = new THREE.Scene();

// material
//const material = new THREE.MeshBasicMaterial();
// material.map = doorColor;
// material.color = new THREE.Color("green");

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColor;
// material.aoMap = doorAmbient;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.roughnessMap = doorRough;
// material.metalnessMap = doorMetal;
// material.normalMap = doorNormal;
// material.normalScale.set(1, 1);
// material.transparent = true;
// material.alphaMap = doorAlpha;

// textureFolder.add(material, "metalness").min(0).max(1).step(0.0001);
// textureFolder.add(material, "roughness").min(0).max(1).step(0.0001);

const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
material.color = new THREE.Color("#FFC000");
// material.map = doorColor;
// material.aoMap = doorAmbient;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeight;
// material.displacementScale = 0.1;
// material.roughnessMap = doorRough;
// material.metalnessMap = doorMetal;
// material.normalMap = doorNormal;
// material.normalScale.set(1, 1);
// material.transparent = true;
// material.alphaMap = doorAlpha;

textureFolder.add(material, "metalness").min(0).max(1).step(0.0001);
textureFolder.add(material, "roughness").min(0).max(1).step(0.0001);
debugObject.color = "#62b288";
textureFolder.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

// clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
// gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

//sheen

// irid
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, "iridescence").min(0).max(1).step(0.0001);
// gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.0001);
// gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(1);
// gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(1);

// transmission

material.transmission = 1;
material.ior = 1.55;
material.thickness = 0.5;

gui.add(material, "transmission").min(0).max(1).step(0.0001);
gui.add(material, "ior").min(1).max(10).step(0.0001);
gui.add(material, "thickness").min(0).max(1).step(0.0001);

// sphere

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);

sphere.position.x = -1.5;

// torus

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);

debugObject.subdivision = 2;

torusSubdivision
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    torus.geometry.dispose();
    torus.geometry = new THREE.TorusGeometry(
      0.3,
      0.2,
      16,
      32,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision
    );
  });

torus.position.x = 1.5;

positionFolder.add(torus.position, "x").min(-10).max(10).step(0.1);
positionFolder.add(torus.rotation, "y").min(-100).max(100).step(0.1);

// plan

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

/**
 * scene
 */
scene.add(sphere, torus, plane);

/**
 * Light
 */

// const ambienLight = new THREE.AmbientLight(0xffffff, 1);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);

// scene.add(ambienLight, pointLight);
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (envMap) => {
  console.log(envMap);
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

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

  //   sphere.rotation.y = 0.1 * elapsedTime;
  //   plane.rotation.y = 0.1 * elapsedTime;
  //   torus.rotation.y = 0.1 * elapsedTime;

  //   sphere.rotation.x = -0.15 * elapsedTime;
  //   plane.rotation.x = -0.15 * elapsedTime;
  //   torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
