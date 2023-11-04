import SimModel from "./SimModel";
import ModelWithCoordinates from "./ModelWithCoordinates";

const CAR_SIZE = 45;

export type Lane = "left" | "right";
type Speed = -1 | 0 | 1;

export default class CarModel extends ModelWithCoordinates {
  lane: Lane = "right";
  speed = 0;
  address = "";
  destination?: number;

  get game() {
    return this.wellKnownModel("modelRoot") as SimModel;
  }

  init({ address }: { address: string }): void {
    super.init({ address });
    this.lane = "right";
    this.speed = 0;
    this.address = address;

    this.subscribe(address, "accelerate", this.accelerate);
    this.subscribe(address, "decelerate", this.decelerate);
    this.subscribe(address, "change-left", this.changeLeft);
    this.subscribe(address, "change-right", this.changeRight);
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

  goTo(z: number) {
    this.destination = z;
    if (z < this.z) {
      this.lane = "left";
      setTimeout(() => {
        this.speed = 1;
      }, 500);
    } else {
      setTimeout(() => {
        this.speed = -1;
      }, 500);
    }
  }

  move() {
    if (typeof this.destination !== "undefined") {
      if (this.z === this.destination) {
        this.speed = 0;
        this.lane = "right";
        this.destination = undefined;
      }
    } else if (
      Array.from(this.game.cars.values())
        .filter((c) => c.address !== this.address)
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
