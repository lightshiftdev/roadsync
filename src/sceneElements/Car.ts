import {
  BoxGeometry,
  ColorRepresentation,
  Group,
  Mesh,
  MeshLambertMaterial,
} from "three";
import Vehicle from "./Vehicle";
import { Address } from "viem";

type Props = {
  lane: "left" | "right";
  speed: number;
  address: Address;
  colors?: {
    body: ColorRepresentation;
    cabin: ColorRepresentation;
    rims?: ColorRepresentation;
  };
};

export default class Car extends Vehicle {
  constructor({ speed, lane, colors, address }: Props) {
    const wheels = Car.createWheels(colors?.rims);

    const main = new Mesh(
      new BoxGeometry(14, 7, 25),
      new MeshLambertMaterial({ color: colors?.body || 0xe33327 })
    );
    main.position.y = 8;
    main.castShadow = true;

    const cabin = new Mesh(
      new BoxGeometry(12, 6, 16),
      new MeshLambertMaterial({ color: colors?.cabin || 0xffffff })
    );
    cabin.name = address;
    cabin.castShadow = true;
    cabin.position.z = 2;
    cabin.position.y = 14;

    const blinkers = Car.createBlinkers();
    super(lane, wheels, blinkers, speed);

    this.element.add(wheels);
    this.element.add(main);
    this.element.add(cabin);
    this.element.add(blinkers);
    this.element.position.y = -3;
  }

  private static createBlinkers() {
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

  private static createWheels(rimsColor?: ColorRepresentation) {
    const wheels = new Group();
    const backWheel = Car.createWheel(rimsColor);
    backWheel.position.y = 6;
    backWheel.position.z = -6;
    wheels.add(backWheel);

    const frontWheel = Car.createWheel(rimsColor);
    frontWheel.position.y = 6;
    frontWheel.position.z = 6;
    wheels.add(frontWheel);

    return wheels;
  }

  private static createWheel(rimsColor?: ColorRepresentation) {
    const wheel = new Group();
    const geometry = new BoxGeometry(18, 6, 6);
    const material = new MeshLambertMaterial({ color: 0x333333 });
    const tire = new Mesh(geometry, material);
    wheel.add(tire);
    const rims = new Mesh(
      new BoxGeometry(19, 4, 4),
      new MeshLambertMaterial({ color: rimsColor || 0xe8f8ff })
    );
    rims.castShadow = true;
    rims.position.x = 0;
    wheel.add(tire);
    wheel.add(rims);
    return wheel;
  }
}
