// ============================================================
// AvatarAnimationController — AnimationMixer とクロスフェード (§15)
// motionState → クリップ名(animationMap) を解決し、存在しなければ idle。
// ============================================================
import * as THREE from "three";
import type { AvatarConfig, AvatarMotionState } from "./avatarTypes";

export class AvatarAnimationController {
  readonly mixer: THREE.AnimationMixer;
  private actions = new Map<string, THREE.AnimationAction>();
  private current: THREE.AnimationAction | null = null;
  private map: Partial<Record<AvatarMotionState, string>>;
  readonly hasClips: boolean;

  constructor(model: THREE.Object3D, clips: THREE.AnimationClip[], config: AvatarConfig) {
    this.mixer = new THREE.AnimationMixer(model);
    this.map = config.animationMap ?? {};
    for (const clip of clips) {
      this.actions.set(clip.name, this.mixer.clipAction(clip));
    }
    this.hasClips = clips.length > 0;
  }

  private resolveClipName(state: AvatarMotionState): string | undefined {
    const mapped = this.map[state];
    if (mapped && this.actions.has(mapped)) return mapped;
    // マップに無ければ、state 名と一致するクリップを探す
    if (this.actions.has(state)) return state;
    // idle フォールバック
    const idle = this.map.idle;
    if (idle && this.actions.has(idle)) return idle;
    if (this.actions.has("Idle")) return "Idle";
    if (this.actions.has("idle")) return "idle";
    return undefined;
  }

  play(state: AvatarMotionState) {
    const name = this.resolveClipName(state);
    if (!name) return;
    const next = this.actions.get(name);
    if (!next || next === this.current) return;
    next.reset().fadeIn(0.4).play();
    this.current?.fadeOut(0.4);
    this.current = next;
  }

  update(delta: number) {
    this.mixer.update(delta);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.actions.clear();
    this.current = null;
  }
}
