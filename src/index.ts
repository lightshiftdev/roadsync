import * as THREE from "three";
import Road from "./Road";
import Car from "./Car";
import Tree from "./Tree";
import Ground from "./Ground";

const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const D = 70;
const ISOMETRIC_ADJUSTED_PLANE = D * 4 * ASPECT_RATIO;
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

const renderer = new THREE.WebGLRenderer();
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

const firstCar = new Car({ initialLane: "right", initialPosition: 30 });
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

  const light = new THREE.DirectionalLight(0xffffff, D / 10);
  light.position.set(D - 10, D + D / 2, D + 10);
  light.castShadow = true;
  scene.add(light);

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default
  // scene.add(new THREE.AxesHelper(40));

  camera.position.set(D, D, D);
  // camera.position.set(0, D, 0);
  camera.lookAt(scene.position);

  renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
  document.body.appendChild(renderer.domElement);

  scene.add(road.getRoad());
  scene.add(firstCar.getCar());
  scene.add(secondCar.getCar());

  const newTree = tree.getTree();
  newTree.position.x = 20;
  scene.add(newTree);

  scene.add(ground.getGround());

  actions();
}

function actions() {
  secondCar.accelerateCar();
  secondCar.changeLane();
  setTimeout(() => {
    secondCar.changeLane();
  }, 2000);
}

function render() {
  requestAnimationFrame(render);
  road.animateRoad();
  firstCar.animateCar();
  secondCar.animateCar();
  firstCar.animateCar();
  ground.animateGround();
  renderer.render(scene, camera);
}
