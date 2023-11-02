import { PCFSoftShadowMap, WebGLRenderer } from "three";

export function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);
  document.body.appendChild(renderer.domElement);

  return renderer;
}
