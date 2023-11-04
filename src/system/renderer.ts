import { PCFSoftShadowMap, WebGLRenderer } from "three";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "./constants";

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  renderer.setPixelRatio(2);
  document.body.appendChild(renderer.domElement);

  return renderer;
}
