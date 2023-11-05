import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";
import TreeModel from "../model/TreeModel";
import CartesianAnimatableElement from "./CartesianAnimatableElement";

type Props = {
  multiplier: number;
  x: number;
  z: number;
  id: string;
};

export default class Tree extends CartesianAnimatableElement {
  id: string;
  initialZ: number;

  constructor({ multiplier, x, z, id }: Props) {
    super(new Group());
    const geometry = new BoxGeometry(multiplier, multiplier, multiplier);
    this.id = id;
    this.initialZ = z;

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
    this.element.position.x = x;
    this.element.position.z = z;
  }

  animate(model: TreeModel) {
    this.cartesianAnimation(model);
  }
}
