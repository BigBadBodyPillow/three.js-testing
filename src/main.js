import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// css
import "./style.css";

//assets
import skybox from "./assets/dota_stars_wallpaper.jpg";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

// setup
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

//lights
// const skyColor = 0x8006d9; // purple
// const groundColor = 0xe8b962; // orange
const intensity = 5;
// const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

const color = 0xffffff; // purple
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(0, 5, 0);
scene.add(light);
scene.add(light.target);

// lighting controler gui
class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return "#" + this.object[this.prop].getHexString();
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function updateLight() {
  lightHelper.update();
}

const gui = new GUI();
// gui.addColor(new ColorGUIHelper(light, "color"), "value").name("skyColor");
// gui
//   .addColor(new ColorGUIHelper(light, "groundColor"), "value")
//   .name("groundColor");
gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
gui.add(light, "intensity", 0, 5, 0.01);
// x
gui.add(light.target.position, "x", -10, 10).onChange(() => updateLight());
// y
gui.add(light.target.position, "y", 0, 10).onChange(() => updateLight());
// z
gui.add(light.target.position, "z", -10, 10).onChange(() => updateLight());

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// cylinder
{
  const cylinderRadius = 2;
  const cylinderHeight = 5;
  const geometry = new THREE.CylinderGeometry(
    cylinderRadius,
    cylinderRadius,
    cylinderHeight,
  );
  const material = new THREE.MeshPhongMaterial({ color: "#ffff00" });
  const cylinder = new THREE.Mesh(geometry, material);
  cylinder.position.set(5, cylinderHeight / 2, 0);
  scene.add(cylinder);
}

//sphere
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions,
  );
  const sphereMat = new THREE.MeshPhongMaterial({
    color: "rgb(103, 113, 255)",
  });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}
// backgeround
const bgTexture = new THREE.TextureLoader().load(skybox);
bgTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = bgTexture;

// Helpers
const lightHelper = new THREE.DirectionalLightHelper(light);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper, lightHelper);

// controler
const controls = new OrbitControls(camera, renderer.domElement);

// animation loop
function animate(time) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  controls.update();
  updateLight();
  renderer.render(scene, camera);
}
