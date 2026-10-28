// ============================================================
// createRenderer — 人物PBRが自然に見える WebGLRenderer 設定 (§6)
// ============================================================
import * as THREE from "three";

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true, // 背景透過 → 後方の抽象背景(OS)を活かす
    powerPreference: "high-performance",
  });

  // 4KでもpixelRatioは上げすぎない(展示GPU負荷対策)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  return renderer;
}
