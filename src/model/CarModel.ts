import SimModel from "./SimModel";
import ModelWithCoordinates from "./ModelWithCoordinates";

const CAR_SIZE = 45;

export type Lane = "left" | "right";
type Speed = -1 | 0 | 1;

export default class CarModel extends ModelWithCoordinates {
  lane: Lane = "right";
  speed = 0;
  viewId = "";

  get game() {
    return this.wellKnownModel("modelRoot") as SimModel;
  }

  init({ viewId }: { viewId: string }): void {
    this.lane = "right";
    this.speed = 0;
    this.viewId = viewId;

    this.subscribe(viewId, "accelerate", this.accelerate);
    this.subscribe(viewId, "decelerate", this.decelerate);
    this.subscribe(viewId, "change-left", this.changeLeft);
    this.subscribe(viewId, "change-right", this.changeRight);
  }

  changeLeft() {
    this.lane = "left";
  }

  changeRight() {
    this.lane = "right";
  }

  accelerate() {
    this.speed = Math.min(this.speed + 1, 1);
  }

  decelerate() {
    this.speed = Math.max(this.speed - 1, -1);
  }

  setPosition(z: number, lane: Lane) {
    this.lane = lane;
    this.z = z;
  }

  setSpeed(speed: Speed) {
    this.speed = speed;
  }

  move() {
    if (
      Array.from(this.game.cars.values())
        .filter((c) => c.viewId !== this.viewId)
        .find(
          (c) => c.z === this.z + CAR_SIZE * -this.speed && c.lane === this.lane
        )
    ) {
      this.speed = 0;
    }
    this.z = this.z - this.speed;
  }
}

CarModel.register("CarModel");
