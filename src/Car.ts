import {
  BoxGeometry,
  ColorRepresentation,
  Group,
  Mesh,
  MeshLambertMaterial,
} from "three";
import { LEFT_LANE, RIGHT_LANE } from "./index";

type Props = {
  initialLane: "left" | "right";
  initialPosition?: number;
  colors?: {
    body: ColorRepresentation;
    cabin: ColorRepresentation;
    rims?: ColorRepresentation;
  };
};

export default class Car {
  car: Group;
  actualLane: "left" | "right";
  frontWheels: Group;
  backWheels: Group;
  blinkers: Group;
  carSpeed: number;
  blinkingRight: any;
  blinkingLeft: any;

  constructor({ initialLane, initialPosition, colors }: Props) {
    this.car = new Group();
    this.carSpeed = 1;
    this.actualLane = initialLane;
    const backWheel = this.createWheels(colors?.rims);
    backWheel.position.y = 6;
    backWheel.position.z = -6;
    this.car.add(backWheel);

    const frontWheel = this.createWheels(colors?.rims);
    frontWheel.position.y = 6;
    frontWheel.position.z = 6;
    this.car.add(frontWheel);

    this.frontWheels = frontWheel;
    this.backWheels = backWheel;

    const main = new Mesh(
      new BoxGeometry(14, 7, 25),
      new MeshLambertMaterial({ color: colors?.body || 0xe33327 })
    );
    main.position.y = 8;
    this.car.add(main);

    const cabin = new Mesh(
      new BoxGeometry(12, 6, 16),
      new MeshLambertMaterial({ color: colors?.cabin || 0xffffff })
    );
    cabin.position.z = 2;
    cabin.position.y = 14;
    this.car.add(cabin);

    this.blinkers = this.createBlinkers();
    this.car.add(this.blinkers);

    this.car.position.z = initialPosition || 0;
    this.car.position.x = initialLane === "left" ? LEFT_LANE : RIGHT_LANE;
  }

  private createBlinkers() {
    const blinkers = new Group();

    const leftBlinker = new Mesh(
      new BoxGeometry(2, 2, 1),
      new MeshLambertMaterial({ color: 0xfdffbf })
    );
    leftBlinker.position.z = 13;
    leftBlinker.position.y = 9;
    leftBlinker.position.x = -5;
    blinkers.add(leftBlinker);

    const rightBlinker = new Mesh(
      new BoxGeometry(2, 2, 1),
      new MeshLambertMaterial({ color: 0xfdffbf })
    );
    rightBlinker.position.z = 13;
    rightBlinker.position.y = 9;
    rightBlinker.position.x = 5;
    blinkers.add(rightBlinker);

    return blinkers;
  }

  private createWheels(rimsColor?: ColorRepresentation) {
    const wheel = new Group();
    const geometry = new BoxGeometry(18, 6, 6);
    const material = new MeshLambertMaterial({ color: 0x333333 });
    const tire = new Mesh(geometry, material);
    wheel.add(tire);
    const rims = new Mesh(
      new BoxGeometry(19, 4, 4),
      new MeshLambertMaterial({ color: rimsColor || 0xe8f8ff })
    );
    rims.position.x = 0;
    wheel.add(tire);
    wheel.add(rims);
    return wheel;
  }

  getCar() {
    return this.car;
  }

  animateCar() {
    this.frontWheels.rotateX(-0.1 * this.carSpeed);
    this.backWheels.rotateX(-0.1 * this.carSpeed);
    this.car.position.z -= this.carSpeed - 1;
    const lastLanePosition =
      this.actualLane === "right" ? RIGHT_LANE : LEFT_LANE;
    if (lastLanePosition > this.car.position.x) {
      this.startBlinkers("right");
      this.car.position.x += 0.5;
    } else if (lastLanePosition < this.car.position.x) {
      this.startBlinkers("left");
      this.car.position.x -= 0.5;
    } else {
      this.stopBlinkers();
    }
  }

  startBlinkers(side?: "left" | "right") {
    const leftMaterial = (this.blinkers.children[0] as Mesh)
      .material as MeshLambertMaterial;
    const rightMaterial = (this.blinkers.children[1] as Mesh)
      .material as MeshLambertMaterial;
    if (side !== "left" && !this.blinkingRight) {
      this.blinkingRight = setInterval(() => {
        const actualColor = rightMaterial.color.getHex();
        if (actualColor === 0xfdffbf) {
          rightMaterial.color.setHex(0xff9900);
        } else if (actualColor === 0xff9900) {
          rightMaterial.color.setHex(0xfdffbf);
        }
      }, 100);
    }
    if (side !== "right" && !this.blinkingLeft) {
      this.blinkingLeft = setInterval(() => {
        const actualColor = leftMaterial.color.getHex();
        if (actualColor === 0xfdffbf) {
          leftMaterial.color.setHex(0xff9900);
        } else if (actualColor === 0xff9900) {
          leftMaterial.color.setHex(0xfdffbf);
        }
      }, 100);
    }
  }

  stopBlinkers(side?: "left" | "right") {
    const leftMaterial = (this.blinkers.children[0] as Mesh)
      .material as MeshLambertMaterial;
    const rightMaterial = (this.blinkers.children[1] as Mesh)
      .material as MeshLambertMaterial;

    if (side !== "left" && !!this.blinkingRight) {
      clearInterval(this.blinkingRight);
      this.blinkingRight = undefined;
      rightMaterial.color.setHex(0xfdffbf);
    }

    if (side !== "right" && !!this.blinkingLeft) {
      clearInterval(this.blinkingLeft);
      this.blinkingLeft = undefined;
      leftMaterial.color.setHex(0xfdffbf);
    }
  }

  accelerateCar() {
    this.carSpeed = 2;
  }

  changeLane() {
    this.actualLane = this.actualLane === "left" ? "right" : "left";
  }
}
