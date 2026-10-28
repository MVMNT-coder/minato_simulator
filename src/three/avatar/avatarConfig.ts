// ============================================================
// Avatar 設定 — 年代別モデル / 感情プリセット / 視線 / カメラ
// ============================================================
import { withBase } from "@/lib/basePath";
import type {
  AvatarConfig,
  CameraMood,
  GazeDirection,
  MinatoEmotion,
} from "./avatarTypes";

// 年代別モデル設定。存在しない年代は 20 歳へフォールバック。
export const minatoAvatarConfigs: Record<number, AvatarConfig> = {
  20: {
    modelUrl: withBase("/models/minato/minato-20.glb"),
    scale: 1,
    position: [0, -1.1, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.45, 3.2],
    cameraTarget: [0, 1.4, 0],
    animationMap: {
      idle: "Idle",
      talking: "Talking",
      thinking: "Thinking",
      listening: "Listening",
      positive: "Positive",
      negative: "Negative",
    },
  },
  40: {
    modelUrl: withBase("/models/minato/minato-40.glb"),
    scale: 1,
    position: [0, -1.1, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.45, 3.2],
    cameraTarget: [0, 1.4, 0],
  },
  60: {
    modelUrl: withBase("/models/minato/minato-60.glb"),
    scale: 1,
    position: [0, -1.1, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.45, 3.2],
    cameraTarget: [0, 1.4, 0],
  },
  100: {
    modelUrl: withBase("/models/minato/minato-100.glb"),
    scale: 1,
    position: [0, -1.1, 0],
    rotation: [0, 0, 0],
    cameraPosition: [0, 1.45, 3.2],
    cameraTarget: [0, 1.4, 0],
  },
};

// 対象年代が無ければ 20 歳へフォールバック
export function resolveAvatarConfig(age: number): AvatarConfig {
  return minatoAvatarConfigs[age] ?? minatoAvatarConfigs[20];
}

// カメラ気分ごとの位置(標準/寄り/引き)
export const cameraMoodPositions: Record<CameraMood, [number, number, number]> = {
  standard: [0, 1.45, 3.2],
  close: [0, 1.48, 2.75],
  wide: [0, 1.4, 3.7],
};

// 視線オフセット(頭/目のローカル回転に変換して使用)
export const gazeOffsets: Record<GazeDirection, [number, number, number]> = {
  camera: [0, 0, 0],
  down: [0, -0.35, 0],
  "down-left": [-0.25, -0.3, 0],
  "down-right": [0.25, -0.3, 0],
  left: [-0.35, 0, 0],
  right: [0.35, 0, 0],
  away: [0.5, 0.1, -0.2],
};

export type EmotionPreset = {
  headTilt: number; // rad(頭部 z 傾き)
  blinkMultiplier: number; // 瞬き頻度倍率
  gaze: GazeDirection;
  cameraMood: CameraMood;
  browInner: number; // 眉モーフ強度(0..1) — モデルにあれば使用
  mouthSmile: number; // 口角モーフ強度(-1..1) — モデルにあれば使用
};

export const emotionPresets: Record<MinatoEmotion, EmotionPreset> = {
  neutral: { headTilt: 0, blinkMultiplier: 1, gaze: "camera", cameraMood: "standard", browInner: 0, mouthSmile: 0.05 },
  thoughtful: { headTilt: 0.04, blinkMultiplier: 1.15, gaze: "down-left", cameraMood: "close", browInner: 0.2, mouthSmile: 0 },
  anxious: { headTilt: -0.02, blinkMultiplier: 1.4, gaze: "away", cameraMood: "close", browInner: 0.5, mouthSmile: -0.15 },
  relieved: { headTilt: 0.02, blinkMultiplier: 0.9, gaze: "camera", cameraMood: "standard", browInner: 0.1, mouthSmile: 0.3 },
  hopeful: { headTilt: 0.03, blinkMultiplier: 0.95, gaze: "camera", cameraMood: "standard", browInner: 0.15, mouthSmile: 0.4 },
  conflicted: { headTilt: 0.05, blinkMultiplier: 1.25, gaze: "down", cameraMood: "close", browInner: 0.45, mouthSmile: -0.1 },
  sad: { headTilt: -0.03, blinkMultiplier: 0.8, gaze: "down", cameraMood: "close", browInner: 0.6, mouthSmile: -0.35 },
  warm: { headTilt: 0.02, blinkMultiplier: 1, gaze: "camera", cameraMood: "standard", browInner: 0.1, mouthSmile: 0.5 },
};

// persona.currentEmotion(日本語自由記述) → MinatoEmotion へ写像
export function emotionFromText(text: string | undefined): MinatoEmotion {
  const e = text ?? "";
  if (/(誇|わくわく|嬉|満た|地に足)/.test(e)) return "warm";
  if (/(希望|前向き|楽しみ)/.test(e)) return "hopeful";
  if (/(穏|安心|落ち着いて|静けさ)/.test(e)) return "relieved";
  if (/(警戒|急|焦)/.test(e)) return "anxious";
  if (/(寂|後悔|薄く|置き去|静かすぎ)/.test(e)) return "sad";
  if (/(揺|迷|こわ|そわ|落ち着かない|矛盾)/.test(e)) return "conflicted";
  if (/(考|問い|思案)/.test(e)) return "thoughtful";
  return "neutral";
}
