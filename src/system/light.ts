import { DirectionalLight } from "three";
import { ASPECT_RATIO, D } from "./constants";

export function createLight() {
  const light = new DirectionalLight(0xffffff, D / 15);
  light.position.set(20, 100, 25);
  light.castShadow = true;

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 1; // default
  light.shadow.camera.far = 130; // default
  light.shadow.camera.bottom = -D * ASPECT_RATIO - 30;
  light.shadow.camera.top = D * ASPECT_RATIO;
  light.shadow.camera.left = D * ASPECT_RATIO;
  light.shadow.camera.right = -D * ASPECT_RATIO;

  return light;
}
