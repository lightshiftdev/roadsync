import * as THREE from "three";
import Road from "./sceneElements/Road";
import Car from "./sceneElements/Car";
import Tree from "./sceneElements/Tree";
import Ground from "./sceneElements/Ground";

const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const D = 70;
export const ISOMETRIC_ADJUSTED_PLANE = D * 4 * ASPECT_RATIO;
export const LEFT_LANE = -D / 6;
export const RIGHT_LANE = D / 6;
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  -D * ASPECT_RATIO,
  D * ASPECT_RATIO,
  D,
  -D,
  1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const road = new Road(ISOMETRIC_ADJUSTED_PLANE, D / 1.5);

const tree = new Tree({ multiplier: 7 });

const ground = new Ground(
  ISOMETRIC_ADJUSTED_PLANE,
  ISOMETRIC_ADJUSTED_PLANE,
  30,
  30
);

const firstCar = new Car({ initialLane: "right", initialPosition: -10 });
const secondCar = new Car({
  initialLane: "right",
  initialPosition: 110,
  colors: {
    body: 0x1f617d,
    cabin: 0x2d9ecf,
  },
});

init();
render();

function init() {
  // scene.background = new THREE.Color(0x64c460);

  const light = new THREE.DirectionalLight(0xffffff, D / 15);
  light.position.set(20, 100, 25);
  light.castShadow = true;

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 1; // default
  light.shadow.camera.far = 130; // default
  light.shadow.camera.bottom = -D * ASPECT_RATIO - 30;
  light.shadow.camera.top = D * ASPECT_RATIO;
  light.shadow.camera.left = D * ASPECT_RATIO;
  light.shadow.camera.right = -D * ASPECT_RATIO;
  /*
   */
  scene.add(light);
  // scene.add(new THREE.AxesHelper(40));

  camera.position.set(D, D, D);
  // camera.position.set(0, D, 0);
  camera.lookAt(scene.position);

  renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
  document.body.appendChild(renderer.domElement);

  scene.add(road.get());
  scene.add(firstCar.get());
  scene.add(secondCar.get());

  const newTree = tree.get();
  newTree.position.x = 40;
  scene.add(newTree);

  scene.add(ground.get());

  // const helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add(helper);

  actions();
}

function actions() {
  setTimeout(() => {
    secondCar.accelerate();
    setTimeout(() => {
      secondCar.changeLane();
      setTimeout(() => {
        secondCar.changeLane();
      }, 2000);
    }, 1000);
  }, 2000);
}

function render() {
  requestAnimationFrame(render);
  road.animate();
  firstCar.animate();
  secondCar.animate();
  firstCar.animate();
  ground.animate();
  tree.animate();
  renderer.render(scene, camera);
}
