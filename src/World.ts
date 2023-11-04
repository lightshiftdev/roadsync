// import Loop from "./system/Loop";
import { createCamera } from "./system/camera";
import { createLight } from "./system/light";
import { createRenderer } from "./system/renderer";
import { createScene } from "./system/scene";
import Road from "./sceneElements/Road";
import Car from "./sceneElements/Car";
import Tree from "./sceneElements/Tree";
import Ground from "./sceneElements/Ground";
import {
  ISOMETRIC_ADJUSTED_PLANE,
  ROAD_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "./system/constants";
import { View } from "@croquet/croquet";
import SimModel from "./model/SimModel";
import { Raycaster, Vector2 } from "three";
// import { CameraHelper } from "three";

export class World extends View {
  model;
  camera;
  scene;
  light;
  renderer;
  road: Road;
  trees: Map<string, Tree>;
  cars: Map<string, Car>;

  // loop;

  constructor(model: SimModel) {
    super(model);
    this.model = model;
    this.scene = createScene();
    this.camera = createCamera();
    this.light = createLight();
    this.renderer = createRenderer();
    this.trees = new Map();
    this.cars = new Map();
    this.road = new Road(ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH);
    // this.loop = new Loop(this.camera, this.scene, this.renderer, this.model);
    this.init();
  }

  init() {
    // scene.add(new THREE.AxesHelper(40));
    // this.scene.add(new CameraHelper(this.light.shadow.camera));
    this.scene.add(this.light);
    this.camera.lookAt(this.scene.position);

    const ground = new Ground(
      ISOMETRIC_ADJUSTED_PLANE,
      ISOMETRIC_ADJUSTED_PLANE,
      30,
      30
    );

    this.scene.add(this.road.get(), ground.get());
    this.render();

    document.onkeydown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          this.publish(this.viewId, "accelerate");
          break;
        case "s":
        case "S":
        case "ArrowDown":
          this.publish(this.viewId, "decelerate");
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          this.publish(this.viewId, "change-left");
          break;
        case "d":
        case "D":
        case "ArrowRight":
          this.publish(this.viewId, "change-right");
          break;
      }
    };

    this.renderer.domElement.addEventListener("pointerdown", (event) => {
      const mouse = new Vector2();
      mouse.x = (event.clientX / WINDOW_WIDTH) * 2 - 1;
      mouse.y = -(event.clientY / WINDOW_HEIGHT) * 2 + 1;

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObjects(this.scene.children);
      console.log("Intersects:", intersects[0].object);
    });
  }

  update(_: number): void {
    this.road.animate(this.model.road);
    this.updateCars();
    this.updateTrees();
    this.renderer.render(this.scene, this.camera);
  }

  updateTrees() {
    for (const [treeId, treeM] of this.model.trees) {
      let tree = this.trees.get(treeId);
      if (!tree) {
        tree = new Tree({
          multiplier: 7,
          x: treeM.x,
          z: treeM.z,
          id: treeM.id,
        });
        this.trees.set(treeId, tree);
        this.scene.add(tree.get());
      }
      tree.animate(treeM);
    }
  }

  updateCars() {
    for (const [viewId, carM] of this.model.cars) {
      let car = this.cars.get(viewId);
      if (!car) {
        car = new Car({
          speed: carM.speed,
          lane: carM.lane,
          colors: {
            body: 0x1f617d,
            cabin: 0x2d9ecf,
          },
          viewId,
        });
        this.cars.set(viewId, car);
        this.scene.add(car.get());
      }
      car.speed = carM.speed;
      car.changeLane(carM.lane);
      car.animate(carM);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
