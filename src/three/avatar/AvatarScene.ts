// ============================================================
// AvatarScene — three.js シーン管理(§22)
// init / setState / setAge / resize / start / stop / dispose
// 呼吸・瞬き・視線・簡易リップシンク・感情・カメラ補間を統合。
// ============================================================
import * as THREE from "three";
import { createRenderer } from "@/three/core/createRenderer";
import { createCamera } from "@/three/core/createCamera";
import { createLighting, type LightingHandle } from "@/three/core/createLighting";
import { disposeThreeObject } from "@/three/core/disposeThreeObject";
import { loadAvatarModel, type AvatarModelBundle } from "./AvatarModel";
import { AvatarAnimationController } from "./AvatarAnimationController";
import { AvatarBlinkController } from "./AvatarBlinkController";
import { AvatarGazeController } from "./AvatarGazeController";
import { setMorph } from "./AvatarMaterialSetup";
import {
  cameraMoodPositions,
  emotionPresets,
  resolveAvatarConfig,
} from "./avatarConfig";
import type {
  AvatarConfig,
  AvatarRuntimeState,
  AvatarSceneCallbacks,
} from "./avatarTypes";

const DEFAULT_STATE: AvatarRuntimeState = {
  motionState: "idle",
  emotion: "neutral",
  gazeDirection: "camera",
  cameraMood: "standard",
  isSpeaking: false,
  speechAmplitude: 0,
};

export class AvatarScene {
  private container: HTMLElement;
  private config: AvatarConfig;
  private callbacks: AvatarSceneCallbacks;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private lighting!: LightingHandle;
  private avatarGroup = new THREE.Group();
  private backgroundGroup = new THREE.Group();

  private bundle: AvatarModelBundle | null = null;
  private anim: AvatarAnimationController | null = null;
  private blink: AvatarBlinkController | null = null;
  private gaze: AvatarGazeController | null = null;

  private clock = new THREE.Clock();
  private rafId = 0;
  private running = false;
  private ro: ResizeObserver | null = null;

  private state: AvatarRuntimeState = { ...DEFAULT_STATE };

  // 感情モーフの現在値/目標値
  private browCur = 0;
  private browTarget = 0;
  private smileCur = 0;
  private smileTarget = 0;
  private mouthCur = 0;

  // カメラ補間用の事前確保
  private desiredCameraPos = new THREE.Vector3();
  private currentTarget = new THREE.Vector3();
  private configTarget = new THREE.Vector3();

  // モデル寸法に応じた自動フレーミング結果
  private fitTargetY: number | null = null;
  private moodZ: Record<string, number> | null = null;
  private modelBaseY = 0;
  private _v1 = new THREE.Vector3();
  private _v2 = new THREE.Vector3();

  constructor(container: HTMLElement, config: AvatarConfig, callbacks: AvatarSceneCallbacks = {}) {
    this.container = container;
    this.config = config;
    this.callbacks = callbacks;
  }

  async init(): Promise<void> {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.container.appendChild(canvas);

    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;

    this.renderer = createRenderer(canvas);
    this.renderer.setSize(w, h, false);

    this.scene = new THREE.Scene();
    this.scene.add(this.backgroundGroup); // 背景(現状は透過→OS側の抽象背景を使用)
    this.scene.add(this.avatarGroup); // 人物(別Group)

    this.camera = createCamera(w / h, this.config.cameraPosition);
    this.desiredCameraPos.set(...this.config.cameraPosition);
    this.configTarget.set(...this.config.cameraTarget);
    this.currentTarget.copy(this.configTarget);

    this.lighting = createLighting(this.scene, this.renderer);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.container);

    await this.loadModel();
  }

  private async loadModel(): Promise<void> {
    // 既存モデルを破棄
    this.disposeModel();
    try {
      const bundle = await loadAvatarModel(this.config, this.renderer, (p) =>
        this.callbacks.onProgress?.(p),
      );
      this.bundle = bundle;
      this.avatarGroup.add(bundle.model);

      // モデル寸法からカメラを自動フレーミング(任意サイズのGLBを確実に画面へ)
      this.frameModel(bundle.model);

      this.anim = new AvatarAnimationController(bundle.model, bundle.clips, this.config);
      this.blink = new AvatarBlinkController(bundle.morphs.blink);
      this.gaze = new AvatarGazeController(bundle.bones.head, bundle.bones.eyeL, bundle.bones.eyeR);

      // 現在の状態を反映
      this.applyEmotion(this.state.emotion);
      this.gaze.setGaze(this.state.gazeDirection);
      this.anim.play(this.state.motionState);
      this.applyCameraMood(this.state.cameraMood);

      this.callbacks.onLoaded?.();
    } catch (error) {
      this.bundle = null;
      console.error("Failed to load avatar:", error);
      this.callbacks.onError?.(error);
    }
  }

  private disposeModel() {
    this.anim?.dispose();
    this.blink?.dispose();
    this.gaze?.dispose();
    this.anim = null;
    this.blink = null;
    this.gaze = null;
    if (this.bundle) {
      this.avatarGroup.remove(this.bundle.model);
      disposeThreeObject(this.bundle.model);
      this.bundle = null;
    }
  }

  private applyEmotion(emotion: AvatarRuntimeState["emotion"]) {
    const preset = emotionPresets[emotion] ?? emotionPresets.neutral;
    this.blink?.setMultiplier(preset.blinkMultiplier);
    this.gaze?.setHeadTilt(preset.headTilt);
    // 明示的な gazeDirection 指定が無ければ感情プリセットの視線を使う
    this.gaze?.setGaze(this.state.gazeDirection ?? preset.gaze);
    this.browTarget = preset.browInner;
    this.smileTarget = Math.max(0, preset.mouthSmile);
  }

  // モデルの実寸に合わせて接地・水平中央化し、カメラ距離/注視点を算出
  private frameModel(model: THREE.Object3D) {
    model.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(model);
    if (!isFinite(box.min.x) || box.isEmpty()) return;
    const size = box.getSize(this._v1);
    const center = box.getCenter(this._v2);

    // 水平中央 & 底面を y=0 に接地
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    this.modelBaseY = model.position.y;

    // フレーミング余白と寄り具合(小さいほどズームイン)
    const FRAME_MARGIN = 1.08; // 上下左右の余白(1.0=ぴったり)
    const FRAME_ZOOM = 0.8; // さらに寄せる係数
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const aspect = this.camera.aspect || 1;
    const halfH = (size.y / 2) * FRAME_MARGIN;
    const distH = halfH / Math.tan(fov / 2);
    const halfW = (size.x / 2) * FRAME_MARGIN;
    const distW = halfW / (Math.tan(fov / 2) * Math.max(aspect, 0.4));
    const dist = (Math.max(distH, distW, 0.4) + size.z * 0.5) * FRAME_ZOOM;

    this.fitTargetY = size.y * 0.66; // 顔〜上半身を中心に
    this.moodZ = { standard: dist, close: dist * 0.82, wide: dist * 1.18 };

    this.configTarget.set(0, this.fitTargetY, 0);
    this.currentTarget.copy(this.configTarget);
    this.applyCameraMood(this.state.cameraMood);
    // 初回はスナップ(補間で寄っていく待ちを避ける)
    this.camera.position.set(0, this.fitTargetY, this.moodZ.standard);
  }

  private applyCameraMood(mood: AvatarRuntimeState["cameraMood"]) {
    if (this.moodZ && this.fitTargetY != null) {
      this.desiredCameraPos.set(0, this.fitTargetY, this.moodZ[mood] ?? this.moodZ.standard);
      return;
    }
    const p = cameraMoodPositions[mood] ?? cameraMoodPositions.standard;
    this.desiredCameraPos.set(p[0], p[1], p[2]);
  }

  // ---- 公開API: 状態更新(UIからは詳細実装に触れない) ----
  setState(partial: Partial<AvatarRuntimeState>): void {
    Object.assign(this.state, partial);
    if (partial.emotion) this.applyEmotion(partial.emotion);
    if (partial.gazeDirection) this.gaze?.setGaze(partial.gazeDirection);
    if (partial.motionState) this.anim?.play(partial.motionState);
    if (partial.cameraMood) this.applyCameraMood(partial.cameraMood);
  }

  async setAge(age: number): Promise<void> {
    const cfg = resolveAvatarConfig(age);
    if (cfg.modelUrl === this.config.modelUrl && this.bundle) return; // 重複ロード回避
    this.config = cfg;
    this.configTarget.set(...cfg.cameraTarget);
    await this.loadModel();
  }

  resize(): void {
    const w = this.container.clientWidth || 1;
    const h = this.container.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const animate = () => {
      this.rafId = requestAnimationFrame(animate);
      this.update();
    };
    this.rafId = requestAnimationFrame(animate);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private update() {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    this.anim?.update(delta);

    // 呼吸(胸ボーン優先。無ければ極小の上下)
    if (this.bundle?.bones.chest) {
      this.bundle.bones.chest.rotation.x =
        this.bundle.baseChestRotationX + Math.sin(elapsed * 1.25) * 0.006;
    } else if (this.bundle) {
      // ボーンが無いモデル(静的メッシュ)は接地基準でごく僅かに上下
      this.bundle.model.position.y = this.modelBaseY + Math.sin(elapsed * 1.25) * 0.004;
    }

    // リグの無い静的モデルは、固まって見えないよう極めて緩い揺れを付与
    if (this.bundle && !this.bundle.bones.head) {
      this.avatarGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.05;
      this.avatarGroup.rotation.x = Math.sin(elapsed * 0.33) * 0.015;
    }

    this.blink?.update(delta);
    this.gaze?.update(delta);

    // 感情モーフ(眉/口角)を滑らかに反映
    const mk = 1 - Math.pow(0.0001, delta);
    this.browCur += (this.browTarget - this.browCur) * mk;
    this.smileCur += (this.smileTarget - this.smileCur) * mk;
    if (this.bundle) {
      setMorph(this.bundle.morphs.browInner, this.browCur);
      setMorph(this.bundle.morphs.smile, this.smileCur);
    }

    // 簡易リップシンク
    const amp = this.state.speechAmplitude ?? 0;
    const mouthTarget = this.state.isSpeaking
      ? Math.max(0, 0.08 + Math.sin(elapsed * 7.5) * 0.04 + amp * 0.12)
      : 0;
    this.mouthCur += (mouthTarget - this.mouthCur) * (1 - Math.pow(0.001, delta));
    if (this.bundle) setMorph(this.bundle.morphs.mouth, this.mouthCur);

    // カメラ補間(lerp)
    this.camera.position.lerp(this.desiredCameraPos, 0.05);
    this.currentTarget.lerp(this.configTarget, 0.05);
    this.camera.lookAt(this.currentTarget);

    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    this.ro?.disconnect();
    this.ro = null;
    this.disposeModel();
    this.lighting?.dispose();
    this.scene?.clear();
    const canvas = this.renderer?.domElement;
    this.renderer?.dispose();
    if (canvas && canvas.parentNode === this.container) {
      this.container.removeChild(canvas);
    }
  }
}
