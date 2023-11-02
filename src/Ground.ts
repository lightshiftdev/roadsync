import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export default class Ground {
  ground: Mesh;

  constructor(
    width?: number | undefined,
    height?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined
  ) {
    const planeGeometry = new PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );
    const planeMaterial = new MeshStandardMaterial({ color: 0x64c460 });
    this.ground = new Mesh(planeGeometry, planeMaterial);
    this.ground.position.y = 5;
    this.ground.receiveShadow = true;
    this.ground.rotateZ(71);
    this.ground.rotateY(71);
    this.ground.rotateX(71);
  }

  getGround() {
    return this.ground;
  }

  animateGround() {}
}
