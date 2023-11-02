import { PCFSoftShadowMap, WebGLRenderer } from "three";

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(2);
  document.body.appendChild(renderer.domElement);

  return renderer;
}
