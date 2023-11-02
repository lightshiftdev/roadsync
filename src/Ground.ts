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
    planeGeometry.rotateX(-Math.PI * 0.5);
    const planeMaterial = new MeshStandardMaterial({ color: 0x64c460 });
    this.ground = new Mesh(planeGeometry, planeMaterial);
    this.ground.position.y = -0.9;
    this.ground.receiveShadow = true;
  }

  getGround() {
    return this.ground;
  }

  animateGround() {}
}
