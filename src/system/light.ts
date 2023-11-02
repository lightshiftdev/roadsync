import { DirectionalLight } from "three";
import { D, ISOMETRIC_ADJUSTED_PLANE } from "./constants";

export function createLight() {
  const light = new DirectionalLight(0xffffff, 5);
  light.position.set(20, ISOMETRIC_ADJUSTED_PLANE / 4, 25);
  light.castShadow = true;

  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 1; // default
  light.shadow.camera.far = ISOMETRIC_ADJUSTED_PLANE / 4 + 77; // default
  light.shadow.camera.bottom = -ISOMETRIC_ADJUSTED_PLANE / 2;
  light.shadow.camera.top = ISOMETRIC_ADJUSTED_PLANE / 2;
  light.shadow.camera.left = ISOMETRIC_ADJUSTED_PLANE / 2;
  light.shadow.camera.right = -ISOMETRIC_ADJUSTED_PLANE / 2;
  console.log(ISOMETRIC_ADJUSTED_PLANE);

  return light;
}
