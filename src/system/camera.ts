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

  // Isometric:
  camera.position.set(D, D, D);
  // Side:
  // camera.position.set(D, 0, 0);
  // Top:
  // camera.position.set(0, D, 0);
  // Front:
  // camera.position.set(0, 0, D);
  return camera;
}
