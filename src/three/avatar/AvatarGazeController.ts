// ============================================================
// AvatarGazeController — 目/頭ボーンによる視線制御 (§18)
// Euler を補間。瞬間移動・常時凝視を避け、回転量を制限する。
// 毎フレーム新規オブジェクトを生成しない(事前確保)。
// ============================================================
import * as THREE from "three";
import { gazeOffsets } from "./avatarConfig";
import type { GazeDirection } from "./avatarTypes";

const HEAD_YAW_LIMIT = 0.18;
const HEAD_PITCH_LIMIT = 0.12;
const EYE_YAW_LIMIT = 0.28;
const EYE_PITCH_LIMIT = 0.2;

export class AvatarGazeController {
  private head: THREE.Object3D | null;
  private eyeL: THREE.Object3D | null;
  private eyeR: THREE.Object3D | null;

  private target = new THREE.Vector3(0, 0, 0);
  private current = new THREE.Vector3(0, 0, 0);

  // 感情由来の頭部傾き(z)ターゲット
  private headTiltTarget = 0;
  private headTiltCurrent = 0;

  // ベース回転(初期姿勢)を保持して加算する
  private baseHeadX = 0;
  private baseHeadZ = 0;

  constructor(head: THREE.Object3D | null, eyeL: THREE.Object3D | null, eyeR: THREE.Object3D | null) {
    this.head = head;
    this.eyeL = eyeL;
    this.eyeR = eyeR;
    if (head) {
      this.baseHeadX = head.rotation.x;
      this.baseHeadZ = head.rotation.z;
    }
  }

  setGaze(direction: GazeDirection) {
    const o = gazeOffsets[direction] ?? gazeOffsets.camera;
    this.target.set(o[0], o[1], o[2]);
  }

  setHeadTilt(rad: number) {
    this.headTiltTarget = rad;
  }

  update(delta: number) {
    const k = 1 - Math.pow(0.0001, delta); // 滑らかな補間
    this.current.lerp(this.target, k);
    this.headTiltCurrent += (this.headTiltTarget - this.headTiltCurrent) * k;

    // 目(あれば): offset.x→yaw, offset.y→pitch
    const eyeYaw = THREE.MathUtils.clamp(-this.current.x * 0.6, -EYE_YAW_LIMIT, EYE_YAW_LIMIT);
    const eyePitch = THREE.MathUtils.clamp(this.current.y * 0.6, -EYE_PITCH_LIMIT, EYE_PITCH_LIMIT);
    if (this.eyeL) { this.eyeL.rotation.y = eyeYaw; this.eyeL.rotation.x = eyePitch; }
    if (this.eyeR) { this.eyeR.rotation.y = eyeYaw; this.eyeR.rotation.x = eyePitch; }

    // 頭(あれば): 目より控えめに + 感情の傾き
    if (this.head) {
      const headYaw = THREE.MathUtils.clamp(-this.current.x * 0.35, -HEAD_YAW_LIMIT, HEAD_YAW_LIMIT);
      const headPitch = THREE.MathUtils.clamp(this.current.y * 0.3, -HEAD_PITCH_LIMIT, HEAD_PITCH_LIMIT);
      this.head.rotation.y = headYaw;
      this.head.rotation.x = this.baseHeadX + headPitch;
      this.head.rotation.z = this.baseHeadZ + this.headTiltCurrent;
    }
  }

  dispose() {
    this.head = null;
    this.eyeL = null;
    this.eyeR = null;
  }
}
