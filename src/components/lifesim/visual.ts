// ============================================================
// 観測端末の視覚状態ヘルパー — 人格 → 背景モード / 表情 を導く
// ============================================================
import type { ValueProfile } from "@/lib/game/lifeSim/types";
import { dominantAxes } from "@/lib/game/lifeSim/persona";

export type BgMode =
  | "particles" // 自由・好奇心: 余白の広い有機的な粒子
  | "grid" // 効率: グリッドと直線
  | "network" // 共同体: ネットワーク状の接続
  | "waveform" // 身体性: ゆっくり脈動する波形
  | "fluid" // 曖昧さ: 流体的なノイズ
  | "geometry"; // 安全・制度信頼: 整然とした幾何学

export function backgroundMode(profile: ValueProfile): BgMode {
  const top = dominantAxes(profile)[0];
  // 重心が弱ければ穏やかな流体
  if (Math.abs(top.value - 50) < 6) return "fluid";
  switch (top.axis) {
    case "autonomy":
    case "curiosity":
      return "particles";
    case "efficiency":
      return "grid";
    case "community":
      return "network";
    case "embodiment":
      return "waveform";
    case "toleranceForAmbiguity":
      return "fluid";
    case "security":
    case "trustInSystems":
      return "geometry";
    default:
      return "fluid";
  }
}

export type Emotion = "happy" | "calm" | "uneasy" | "sad" | "curious" | "neutral";

export function parseEmotion(text: string | undefined): Emotion {
  const e = text ?? "";
  if (/(誇|わくわく|嬉|満た|地に足)/.test(e)) return "happy";
  if (/(穏|落ち着いて|安心|静けさ)/.test(e)) return "calm";
  if (/(わくわく|好奇)/.test(e)) return "curious";
  if (/(寂|後悔|薄く|置き去|静かすぎ)/.test(e)) return "sad";
  if (/(揺|迷|こわ|落ち着かない|そわ|警戒|急)/.test(e)) return "uneasy";
  return "neutral";
}
