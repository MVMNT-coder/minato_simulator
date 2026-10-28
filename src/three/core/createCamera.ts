// ============================================================
// createCamera — 対話に適したポートレートカメラ (§7)
// ============================================================
import * as THREE from "three";

export function createCamera(
  aspect: number,
  position: [number, number, number],
): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
  camera.position.set(position[0], position[1], position[2]);
  return camera;
}
