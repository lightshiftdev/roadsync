import { Group } from "three";

export default abstract class SceneElement {
  element: Group;

  constructor(element?: Group) {
    this.element = element || new Group();
  }

  get() {
    return this.element;
  }

  abstract animate(): void;
}
