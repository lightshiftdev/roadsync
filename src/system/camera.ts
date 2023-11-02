import { OrthographicCamera } from "three";
import { ASPECT_RATIO, D } from "./constants";

export function createCamera() {
  const camera = new OrthographicCamera(
    -D * ASPECT_RATIO,
    D * ASPECT_RATIO,
    D,
    -D,
    1,
    1000
  );

  camera.position.set(D, D, D);
  // camera.position.set(0, D, 0);
  return camera;
}
