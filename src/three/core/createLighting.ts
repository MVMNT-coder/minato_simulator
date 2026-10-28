// ============================================================
// createLighting — 人物撮影に近い4点ライティング + Environment (§13,§14)
// 青紫の強いSF照明にはせず、肌色が自然に見えることを優先。
// ============================================================
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface LightingHandle {
  keyLight: THREE.DirectionalLight;
  dispose: () => void;
}

export function createLighting(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
): LightingHandle {
  // Environment(映り込み・柔らかい間接光) — RoomEnvironment を PMREM 化
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  room.dispose();
  pmrem.dispose();

  // Key
  const keyLight = new THREE.DirectionalLight(0xfff3e6, 2.4);
  keyLight.position.set(2.2, 3.5, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 12;
  keyLight.shadow.camera.left = -2;
  keyLight.shadow.camera.right = 2;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -2;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);

  // Fill(影を柔らかく。影は落とさない)
  const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.8);
  fillLight.position.set(-2.5, 2, 2);
  scene.add(fillLight);

  // Rim(輪郭を起こす)
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  rimLight.position.set(-1.5, 2.8, -2.5);
  scene.add(rimLight);

  // Soft ambient
  const ambient = new THREE.HemisphereLight(0xffffff, 0x303030, 0.45);
  scene.add(ambient);

  return {
    keyLight,
    dispose: () => {
      scene.remove(keyLight, fillLight, rimLight, ambient);
      keyLight.dispose();
      fillLight.dispose();
      rimLight.dispose();
      ambient.dispose();
      envRT.texture.dispose();
      if (scene.environment === envRT.texture) scene.environment = null;
    },
  };
}
