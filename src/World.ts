import Loop from "./system/Loop";
import { createCamera } from "./system/camera";
import { createLight } from "./system/light";
import { createRenderer } from "./system/renderer";
import { createScene } from "./system/scene";
import Road from "./sceneElements/Road";
import Car from "./sceneElements/Car";
import Tree from "./sceneElements/Tree";
import Ground from "./sceneElements/Ground";
import { D, ISOMETRIC_ADJUSTED_PLANE } from "./system/constants";

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
    this.scene.add(this.light);
    this.camera.lookAt(this.scene.position);

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

    const newTree = tree.get();
    newTree.position.x = 40;

    this.loop.updatables.push(road, firstCar, secondCar, tree, ground);
    this.scene.add(
      road.get(),
      firstCar.get(),
      secondCar.get(),
      newTree,
      ground.get()
    );
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
