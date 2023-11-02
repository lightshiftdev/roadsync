import { Mesh, MeshStandardMaterial, PlaneGeometry } from "three";
import SceneElement from "./SceneElement";

export default class Ground extends SceneElement<Mesh> {
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
    const element = new Mesh(planeGeometry, planeMaterial);
    super(element);
    this.element.position.y = -0.9;
    this.element.receiveShadow = true;
  }

  animate() {}
}
