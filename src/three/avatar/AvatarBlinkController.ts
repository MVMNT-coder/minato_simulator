// ============================================================
// AvatarBlinkController — MorphTarget によるランダム瞬き (§17)
// 2.5〜6秒間隔、0→1→0 の短いカーブ、時々二重瞬き。
// ============================================================
import { setMorph, type MorphTarget } from "./AvatarMaterialSetup";

export class AvatarBlinkController {
  private targets: MorphTarget[];
  private timer: number;
  private blinking = false;
  private phase = 0; // 0..1(1回の瞬き進行)
  private multiplier = 1;
  private pendingDouble = false;

  constructor(targets: MorphTarget[]) {
    this.targets = targets;
    this.timer = this.nextInterval();
  }

  get hasTargets() {
    return this.targets.length > 0;
  }

  setMultiplier(m: number) {
    this.multiplier = Math.max(0.4, m);
  }

  private nextInterval() {
    // 2.5〜6秒。感情で頻度が上がるほど短く。
    return (2.5 + Math.random() * 3.5) / this.multiplier;
  }

  update(delta: number) {
    if (this.targets.length === 0) return;

    if (this.blinking) {
      // 約0.16秒で 0→1→0
      this.phase += delta / 0.16;
      let v: number;
      if (this.phase < 0.5) v = this.phase / 0.5; // 0→1
      else v = 1 - (this.phase - 0.5) / 0.5; // 1→0
      v = Math.max(0, Math.min(1, v));
      setMorph(this.targets, v);
      if (this.phase >= 1) {
        this.blinking = false;
        setMorph(this.targets, 0);
        if (this.pendingDouble) {
          this.pendingDouble = false;
          this.timer = 0.09; // 二重瞬き
        } else {
          this.timer = this.nextInterval();
        }
      }
      return;
    }

    this.timer -= delta;
    if (this.timer <= 0) {
      this.blinking = true;
      this.phase = 0;
      // 15% の確率で二重瞬き
      this.pendingDouble = Math.random() < 0.15;
    }
  }

  dispose() {
    setMorph(this.targets, 0);
    this.targets = [];
  }
}
