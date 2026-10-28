// ============================================================
// AvatarMaterialSetup — GLB本来のPBRを維持しつつ最小限の補正 (§9〜§14)
// モデル全体の単色マテリアル上書きは行わない。
// ============================================================
import * as THREE from "three";

export interface MorphTarget {
  mesh: THREE.Mesh;
  index: number;
}

function materialsOf(mesh: THREE.Mesh): THREE.Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function nameIncludes(name: string, keys: string[]): boolean {
  const n = name.toLowerCase();
  return keys.some((k) => n.includes(k));
}

// ---- §9 テクスチャの色空間だけ整える(色は上書きしない) ----
export function setupAvatarMaterials(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;

    for (const material of materialsOf(mesh)) {
      const std = material as THREE.MeshStandardMaterial;
      // baseColor / emissive は sRGB
      if (std.map) std.map.colorSpace = THREE.SRGBColorSpace;
      if (std.emissiveMap) std.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      // normal/roughness/metalness/ao は Linear のまま(触らない)

      // 部位別の限定補正
      if (material.name) {
        applySkinMaterial(material);
        applyHairMaterial(material);
        applyEyeMaterial(material);
      }
      material.needsUpdate = true;
    }
  });
}

// ---- §10 肌: クレイ/プラスチックに見えないよう限定補正(色は変えない) ----
function isSkinMaterial(material: THREE.Material): boolean {
  return nameIncludes(material.name, ["skin", "face", "head", "body"]);
}
function applySkinMaterial(material: THREE.Material): void {
  if (!isSkinMaterial(material)) return;
  const std = material as THREE.MeshStandardMaterial;
  if (typeof std.roughness === "number") {
    std.roughness = Math.min(Math.max(std.roughness, 0.38), 0.62);
  }
  if (typeof std.metalness === "number") std.metalness = 0;
  const phys = material as THREE.MeshPhysicalMaterial;
  if ((phys as unknown as { isMeshPhysicalMaterial?: boolean }).isMeshPhysicalMaterial) {
    phys.clearcoat = Math.min(phys.clearcoat ?? 0, 0.08);
    phys.clearcoatRoughness = 0.7;
  }
}

// ---- §11 髪/まつげ/眉: 透明描画順の問題を軽減 ----
function applyHairMaterial(material: THREE.Material): void {
  if (!(material as unknown as { isMeshStandardMaterial?: boolean }).isMeshStandardMaterial) return;
  if (!nameIncludes(material.name, ["hair", "eyelash", "brow"])) return;
  const std = material as THREE.MeshStandardMaterial;
  std.transparent = false;
  std.alphaTest = 0.35;
  std.depthWrite = true;
  std.side = THREE.DoubleSide;
  std.needsUpdate = true;
}

// ---- §12 目: 肌と同処理にせず、控えめな反射を残す ----
function applyEyeMaterial(material: THREE.Material): void {
  if (!nameIncludes(material.name, ["eye", "cornea"])) return;
  const phys = material as THREE.MeshPhysicalMaterial;
  if (!(phys as unknown as { isMeshPhysicalMaterial?: boolean }).isMeshPhysicalMaterial) return;
  phys.roughness = 0.15;
  phys.metalness = 0;
  phys.clearcoat = 0.2;
  phys.clearcoatRoughness = 0.1;
}

// ---- §14 影: castShadow のみ(Key Light 1灯で十分) ----
export function setupAvatarShadows(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
  });
}

// ---- ボーン検索(優先順) ----
export function findBoneByNames(
  root: THREE.Object3D,
  names: string[],
): THREE.Object3D | null {
  const lowered = names.map((n) => n.toLowerCase());
  let found: THREE.Object3D | null = null;
  let bestRank = Infinity;
  root.traverse((o) => {
    const n = o.name.toLowerCase();
    for (let i = 0; i < lowered.length; i++) {
      if (n === lowered[i] || n.includes(lowered[i])) {
        if (i < bestRank) {
          bestRank = i;
          found = o;
        }
        break;
      }
    }
  });
  return found;
}

// ---- MorphTarget 収集(候補名にマッチする mesh+index を全て) ----
export function collectMorphs(
  root: THREE.Object3D,
  candidates: string[],
): MorphTarget[] {
  const lowered = candidates.map((c) => c.toLowerCase());
  const out: MorphTarget[] = [];
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    const dict = mesh.morphTargetDictionary;
    if (!dict) return;
    for (const key of Object.keys(dict)) {
      const k = key.toLowerCase();
      if (lowered.some((c) => k === c || k.includes(c))) {
        out.push({ mesh, index: dict[key] });
      }
    }
  });
  return out;
}

export function setMorph(targets: MorphTarget[], value: number): void {
  for (const t of targets) {
    const infl = t.mesh.morphTargetInfluences;
    if (infl) infl[t.index] = value;
  }
}
