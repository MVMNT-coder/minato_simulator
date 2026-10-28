// ============================================================
// AvatarModel — GLB/GLTF 読み込み + ボーン/モーフ抽出 (§8)
// Draco / KTX2 に対応(圧縮モデルでない場合は使われない)。
// ============================================================
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import type { AvatarConfig } from "./avatarTypes";
import {
  collectMorphs,
  findBoneByNames,
  setupAvatarMaterials,
  setupAvatarShadows,
  type MorphTarget,
} from "./AvatarMaterialSetup";

export interface AvatarModelBundle {
  model: THREE.Group;
  clips: THREE.AnimationClip[];
  bones: {
    chest: THREE.Object3D | null;
    head: THREE.Object3D | null;
    eyeL: THREE.Object3D | null;
    eyeR: THREE.Object3D | null;
  };
  morphs: {
    blink: MorphTarget[];
    mouth: MorphTarget[];
    browInner: MorphTarget[];
    smile: MorphTarget[];
  };
  baseChestRotationX: number;
}

export async function loadAvatarModel(
  config: AvatarConfig,
  renderer: THREE.WebGLRenderer,
  onProgress?: (p: number) => void,
): Promise<AvatarModelBundle> {
  const loader = new GLTFLoader();
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/");
  loader.setDRACOLoader(draco);
  const ktx2 = new KTX2Loader();
  ktx2.setTranscoderPath("/basis/");
  ktx2.detectSupport(renderer);
  loader.setKTX2Loader(ktx2);

  try {
    const gltf: GLTF = await loader.loadAsync(config.modelUrl, (event) => {
      const p = event.total > 0 ? event.loaded / event.total : 0;
      onProgress?.(p);
    });

    const model = gltf.scene as THREE.Group;
    model.scale.setScalar(config.scale);
    model.position.set(config.position[0], config.position[1], config.position[2]);
    model.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);

    setupAvatarMaterials(model);
    setupAvatarShadows(model);

    const chest = findBoneByNames(model, ["upperchest", "chest", "spine2", "spine_03", "J_Bip_C_Chest"]);
    const head = findBoneByNames(model, ["head", "J_Bip_C_Head"]);
    const eyeL = findBoneByNames(model, ["lefteye", "eye_l", "J_Adj_L_FaceEye"]);
    const eyeR = findBoneByNames(model, ["righteye", "eye_r", "J_Adj_R_FaceEye"]);

    const morphs = {
      blink: collectMorphs(model, ["blink", "eyeblinkleft", "eyeblinkright", "eyeblink_l", "eyeblink_r", "blink_l", "blink_r"]),
      mouth: collectMorphs(model, ["jawopen", "mouthopen", "viseme_aa", "aa"]),
      browInner: collectMorphs(model, ["browinnerup", "brow_inner", "browinner"]),
      smile: collectMorphs(model, ["mouthsmile", "mouthsmileleft", "mouthsmileright", "smile"]),
    };

    return {
      model,
      clips: gltf.animations ?? [],
      bones: { chest, head, eyeL, eyeR },
      morphs,
      baseChestRotationX: chest ? chest.rotation.x : 0,
    };
  } finally {
    draco.dispose();
    ktx2.dispose();
  }
}
