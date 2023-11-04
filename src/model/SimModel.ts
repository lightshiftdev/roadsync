import { Model } from "@croquet/croquet";
import CarModel from "./CarModel";
import TreeModel from "./TreeModel";
import RoadModel from "./RoadModel";

export default class SimModel extends Model {
  cars: Map<string, CarModel> = new Map();
  trees: Map<string, TreeModel> = new Map();
  road: RoadModel = RoadModel.create({});

  init(_options: any): void {
    this.cars = new Map<string, CarModel>();
    this.trees = new Map<string, TreeModel>();
    this.road = RoadModel.create({});
    for (let i = 0; i < 17; i++) {
      const tree = TreeModel.create({});
      this.trees.set(tree.id, tree);
    }

    this.subscribe(this.sessionId, "view-join", this.viewJoined);
    this.subscribe(this.sessionId, "view-exit", this.viewExited);

    this.mainLoop();
  }

  viewJoined(viewId: string) {
    const car = CarModel.create({ viewId });
    car.setPosition(this.cars.size * 50, "right");
    this.cars.set(viewId, car);
  }

  viewExited(viewId: string) {
    const car = this.cars.get(viewId);
    this.cars.delete(viewId);
    car?.destroy();
  }

  mainLoop() {
    this.future(60).mainLoop();
    for (const car of this.cars.values()) car.move();
    for (const tree of this.trees.values()) tree.move();
    this.road.move();
  }
}

SimModel.register("SimModel");
