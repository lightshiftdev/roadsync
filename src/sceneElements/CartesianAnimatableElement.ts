import { Group, Mesh } from "three";
import SceneElement from "./SceneElement";
import ModelWithCoordinates from "../model/ModelWithCoordinates";

export default abstract class CartesianAnimatableElement extends SceneElement {
  smoothing: WeakMap<ModelWithCoordinates, { x: number; z: number }>;

  constructor(element: Group | Mesh) {
    super(element);
    this.smoothing = new WeakMap();
  }

  smoothPos(obj: ModelWithCoordinates) {
    if (!this.smoothing.has(obj)) {
      this.smoothing.set(obj, { x: obj.x, z: obj.z });
    }
    const smoothed = this.smoothing.get(obj) as ModelWithCoordinates;
    const dx = obj.x - smoothed.x;
    const dz = obj.z - smoothed.z;
    if (Math.abs(dx) < 50) smoothed.x += dx * 0.3;
    else smoothed.x = obj.x;
    if (Math.abs(dz) < 50) smoothed.z += dz * 0.3;
    else smoothed.z = obj.z;
    return smoothed;
  }

  cartesianAnimation(
    model: ModelWithCoordinates,
    xUpdate: boolean = true,
    zUpdate: boolean = true
  ) {
    const { x, z } = this.smoothPos(model);
    if (zUpdate) this.element.position.z = z;
    if (xUpdate) this.element.position.x = x;
  }
}
