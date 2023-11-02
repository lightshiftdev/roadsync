import { Group, Mesh, MeshLambertMaterial } from "three";
import SceneElement from "./SceneElement";
import { LEFT_LANE, RIGHT_LANE } from "../index";

export default class Vehicle extends SceneElement {
  actualLane: "left" | "right";
  wheels: Group;
  blinkers: Group;
  speed: number;
  blinkingRight?: ReturnType<typeof setInterval>;
  blinkingLeft?: ReturnType<typeof setInterval>;

  constructor(
    actualLane: "left" | "right",
    wheels: Group,
    blinkers: Group,
    speed: number
  ) {
    super(new Group());
    this.actualLane = actualLane;
    this.wheels = wheels;
    this.blinkers = blinkers;
    this.speed = speed;
    this.element.position.x = actualLane === "left" ? LEFT_LANE : RIGHT_LANE;
  }

  animate(): void {
    this.wheels.children.forEach((wheel) => {
      wheel.rotateX(-0.1 * this.speed);
    });
    this.get().position.z -= this.speed - 1;
    const lastLanePosition =
      this.actualLane === "right" ? RIGHT_LANE : LEFT_LANE;
    if (lastLanePosition > this.get().position.x) {
      this.startBlinkers("right");
      this.stopBlinkers("left");
      this.get().position.x += 0.5;
    } else if (lastLanePosition < this.get().position.x) {
      this.startBlinkers("left");
      this.stopBlinkers("right");
      this.get().position.x -= 0.5;
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

  accelerate() {
    if (this.speed <= 2) {
      this.speed += 1;
    }
  }

  decelerate() {
    if (this.speed >= 0) {
      this.speed -= 1;
    }
  }

  changeLane() {
    this.actualLane = this.actualLane === "left" ? "right" : "left";
  }
}
