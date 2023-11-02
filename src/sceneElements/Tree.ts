import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";
import SceneElement from "./SceneElement";
import { ISOMETRIC_ADJUSTED_PLANE, ROAD_WIDTH } from "../system/constants";

type Props = {
  multiplier: number;
};

export default class Tree extends SceneElement {
  constructor({ multiplier }: Props) {
    super(new Group());
    const geometry = new BoxGeometry(multiplier, multiplier, multiplier);

    const leaveDarkMaterial = new MeshLambertMaterial({ color: 0x91e56e });
    const leaveLightMaterial = new MeshLambertMaterial({ color: 0xa2ff7a });
    const stemMaterial = new MeshLambertMaterial({ color: 0x7d5a4f });

    const stem = new Mesh(geometry, stemMaterial);
    stem.castShadow = true;
    stem.position.set(0, 0, 0);
    stem.scale.set(0.3, 1.5, 0.3);

    const squareLeave01 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave01.castShadow = true;
    squareLeave01.position.set(
      0.5 * multiplier,
      1.6 * multiplier,
      0.5 * multiplier
    );
    squareLeave01.scale.set(0.8, 0.8, 0.8);

    const squareLeave02 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave02.castShadow = true;
    squareLeave02.position.set(
      -0.4 * multiplier,
      1.3 * multiplier,
      -0.4 * multiplier
    );
    squareLeave02.scale.set(0.7, 0.7, 0.7);

    const squareLeave03 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave03.castShadow = true;
    squareLeave03.position.set(
      0.4 * multiplier,
      1.7 * multiplier,
      -0.5 * multiplier
    );
    squareLeave03.scale.set(0.7, 0.7, 0.7);

    const leaveDark = new Mesh(geometry, leaveDarkMaterial);
    leaveDark.castShadow = true;
    leaveDark.position.set(0, 1.2 * multiplier, 0);
    leaveDark.scale.set(1, 2, 1);

    const leaveLight = new Mesh(geometry, leaveLightMaterial);
    leaveLight.castShadow = true;
    leaveLight.position.set(0, 1.2 * multiplier, 0);
    leaveLight.scale.set(1.1, 0.5, 1.1);

    this.element.add(leaveDark);
    this.element.add(leaveLight);
    this.element.add(squareLeave01);
    this.element.add(squareLeave02);
    this.element.add(squareLeave03);
    this.element.add(stem);
    this.element.position.y = 4;
    this.setRandomPosition(true);
  }

  setRandomPosition(firstTime: boolean) {
    const max = ISOMETRIC_ADJUSTED_PLANE / 2;
    const min = ROAD_WIDTH / 2 + 3;
    const side = Math.round(Math.random()) === 0 ? -1 : 1;
    const random = Math.random() * (max - min) + min;
    this.element.position.x = side * random;
    this.element.position.z = firstTime
      ? -Math.random() * ISOMETRIC_ADJUSTED_PLANE * 2
      : -Math.random() * ISOMETRIC_ADJUSTED_PLANE - ISOMETRIC_ADJUSTED_PLANE;
  }

  animate() {
    if (this.element.position.z >= ISOMETRIC_ADJUSTED_PLANE / 2) {
      this.setRandomPosition(false);
    } else {
      this.element.position.z += 1;
    }
  }
}
