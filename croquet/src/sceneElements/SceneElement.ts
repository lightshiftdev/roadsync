import { Model } from "@croquet/croquet";
import { Group, Mesh } from "three";

export default abstract class SceneElement {
  element: Group | Mesh;

  constructor(element: Group | Mesh) {
    this.element = element;
  }

  get() {
    return this.element;
  }

  abstract animate(model: Model): void;
}
