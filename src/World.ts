import Loop from "./system/Loop";
import { createCamera } from "./system/camera";
import { createLight } from "./system/light";
import { createRenderer } from "./system/renderer";
import { createScene } from "./system/scene";
import Road from "./sceneElements/Road";
import Car from "./sceneElements/Car";
import Tree from "./sceneElements/Tree";
import Ground from "./sceneElements/Ground";
import { ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH } from "./system/constants";
// import { CameraHelper } from "three";

export class World {
  camera;
  scene;
  light;
  renderer;
  loop;

  constructor() {
    this.scene = createScene();
    this.camera = createCamera();
    this.light = createLight();
    this.renderer = createRenderer();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
  }

  init() {
    // scene.add(new THREE.AxesHelper(40));
    // this.scene.add(new CameraHelper(this.light.shadow.camera));
    this.scene.add(this.light);
    this.camera.lookAt(this.scene.position);

    const road = new Road(ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH);
    const trees: Tree[] = [];
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

    for (let i = 0; i < Math.round(ISOMETRIC_ADJUSTED_PLANE) / 10; i++) {
      trees.push(new Tree({ multiplier: 7 }));
    }

    this.loop.updatables.push(road, firstCar, secondCar, ...trees, ground);
    this.scene.add(
      road.get(),
      firstCar.get(),
      secondCar.get(),
      ...trees.map((t) => t.get()),
      ground.get()
    );
    this.actions(secondCar);
  }

  actions(car: Car) {
    // TODO: Change this to tween if possible
    setTimeout(() => {
      car.accelerate();
      setTimeout(() => {
        car.changeLane();
        setTimeout(() => {
          car.changeLane();
        }, 1500);
      }, 900);
    }, 2000);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}
