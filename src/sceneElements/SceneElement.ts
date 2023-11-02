import { Group } from "three";

export default abstract class SceneElement<T = Group> {
  element: T;

  constructor(element: T) {
    this.element = element;
  }

  get() {
    return this.element;
  }

  abstract animate(): void;
}
