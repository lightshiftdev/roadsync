import { BoxGeometry, Group, Mesh, MeshLambertMaterial } from "three";

type Props = {
  multiplier: number;
};

export default class Tree {
  tree: Group;

  constructor({ multiplier }: Props) {
    const geometry = new BoxGeometry(multiplier, multiplier, multiplier);

    const leaveDarkMaterial = new MeshLambertMaterial({ color: 0x91e56e });
    const leaveLightMaterial = new MeshLambertMaterial({ color: 0xa2ff7a });
    const stemMaterial = new MeshLambertMaterial({ color: 0x7d5a4f });

    const stem = new Mesh(geometry, stemMaterial);
    stem.position.set(0, 0, 0);
    stem.scale.set(0.3, 1.5, 0.3);

    const squareLeave01 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave01.position.set(
      0.5 * multiplier,
      1.6 * multiplier,
      0.5 * multiplier
    );
    squareLeave01.scale.set(0.8, 0.8, 0.8);

    const squareLeave02 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave02.position.set(
      -0.4 * multiplier,
      1.3 * multiplier,
      -0.4 * multiplier
    );
    squareLeave02.scale.set(0.7, 0.7, 0.7);

    const squareLeave03 = new Mesh(geometry, leaveDarkMaterial);
    squareLeave03.position.set(
      0.4 * multiplier,
      1.7 * multiplier,
      -0.5 * multiplier
    );
    squareLeave03.scale.set(0.7, 0.7, 0.7);

    const leaveDark = new Mesh(geometry, leaveDarkMaterial);
    leaveDark.position.set(0, 1.2 * multiplier, 0);
    leaveDark.scale.set(1, 2, 1);

    const leaveLight = new Mesh(geometry, leaveLightMaterial);
    leaveLight.position.set(0, 1.2 * multiplier, 0);
    leaveLight.scale.set(1.1, 0.5, 1.1);

    this.tree = new Group();
    this.tree.add(leaveDark);
    this.tree.add(leaveLight);
    this.tree.add(squareLeave01);
    this.tree.add(squareLeave02);
    this.tree.add(squareLeave03);
    this.tree.add(stem);
  }

  getTree() {
    return this.tree;
  }
}
