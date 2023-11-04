import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import SceneElement from "../sceneElements/SceneElement";
import { Model } from "@croquet/croquet";

export default class Loop {
  camera;
  scene;
  renderer;
  updatables: SceneElement<any>[];
  model;

  constructor(
    camera: OrthographicCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    model: Model
  ) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = [];
    this.model = model;
  }

  tick() {
    for (const object of this.updatables) {
      // object.tick(delta);
      object.animate(this.model);
    }
  }
}
