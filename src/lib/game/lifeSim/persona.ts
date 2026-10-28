// ============================================================
// Persona helpers — 人格状態の純粋な操作ユーティリティ
// ============================================================
import type {
  MinatoPersona,
  ValueAxis,
  ValueDelta,
  ValueProfile,
  LifeAge,
} from "./types";

export const VALUE_AXES: ValueAxis[] = [
  "autonomy",
  "security",
  "efficiency",
  "community",
  "curiosity",
  "embodiment",
  "trustInSystems",
  "toleranceForAmbiguity",
];

// 軸の日本語ラベル(内部/デバッグ用。プレイヤーには見せない §12)
export const AXIS_LABEL: Record<ValueAxis, string> = {
  autonomy: "自律性",
  security: "安定志向",
  efficiency: "効率",
  community: "つながり",
  curiosity: "好奇心",
  embodiment: "身体性",
  trustInSystems: "制度への信頼",
  toleranceForAmbiguity: "迷いへの耐性",
};

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

// 生の増減マップ({axis: delta, reason})から ValueDelta[] を作る
export function buildDeltas(
  profile: ValueProfile,
  raw: { axis: ValueAxis; delta: number; reason: string }[],
): ValueDelta[] {
  return raw.map(({ axis, delta, reason }) => {
    const clampedDelta = Math.max(-8, Math.min(8, Math.round(delta)));
    const before = profile[axis];
    const after = clamp(before + clampedDelta);
    return { axis, before, after, delta: after - before, reason };
  });
}

export function applyDeltas(profile: ValueProfile, deltas: ValueDelta[]): ValueProfile {
  const next: ValueProfile = { ...profile };
  for (const d of deltas) {
    next[d.axis] = d.after;
  }
  return next;
}

// 最も強い(50から離れた)軸の並び
export function dominantAxes(profile: ValueProfile): { axis: ValueAxis; value: number }[] {
  return VALUE_AXES.map((axis) => ({ axis, value: profile[axis] }))
    .sort((a, b) => Math.abs(b.value - 50) - Math.abs(a.value - 50));
}

// 価値観プロファイルから、プレイヤーに見せる自然言語の要約を導出する (§12)
// 数値や診断名は使わず、ミナトの傾向として言葉にする。
export function deriveValueSummary(profile: ValueProfile): string[] {
  const out: string[] = [];
  const p = profile;
  // しきい値は控えめ(±6程度の一度の入力でも傾向が言葉になる)
  const HI = 56;
  const LO = 44;
  if (p.autonomy >= HI) out.push("自分で決めたいという気持ちが強い");
  else if (p.autonomy <= LO) out.push("大きな決断は誰かに委ねたくなる");

  if (p.toleranceForAmbiguity >= HI) out.push("すぐに答えを出さず、迷う時間を大切にする");
  else if (p.toleranceForAmbiguity <= LO) out.push("宙ぶらりんの状態が苦手で、早く決めたくなる");

  if (p.security >= HI) out.push("何より安心・安定を守りたい");
  if (p.efficiency >= HI) out.push("回り道より合理性を選びがち");
  else if (p.efficiency <= LO) out.push("効率では測れないものに惹かれる");

  if (p.community >= HI) out.push("自分より家族や周りの人を優先しやすい");
  else if (p.community <= LO) out.push("まず自分の輪郭を保とうとする");

  if (p.curiosity >= HI) out.push("知らない世界を覗いてみたくなる");
  if (p.embodiment >= HI) out.push("頭で考えるより、身体で確かめたい");

  if (p.trustInSystems >= HI) out.push("制度や仕組みを信じて頼る");
  else if (p.trustInSystems <= LO) out.push("制度に判断を明け渡すことへの警戒がある");

  return out.slice(0, 5);
}

// speechStyle を価値観から緩やかに導出(蓄積で変化 §7)
export function deriveSpeechStyle(profile: ValueProfile, age: LifeAge): string {
  const parts: string[] = [];
  if (profile.toleranceForAmbiguity >= 60) parts.push("言い切らず、含みを残す");
  else if (profile.toleranceForAmbiguity <= 40) parts.push("結論から先に言う");
  if (profile.autonomy >= 60) parts.push("自分の言葉で語ろうとする");
  if (profile.community >= 60) parts.push("相手の顔を思い浮かべながら話す");
  if (age >= 60) parts.push("急がず、間を取る");
  if (parts.length === 0) parts.push("率直で、少し自信なさげ");
  return parts.join("。") + "。";
}

// 蓄積された記憶・価値観を圧縮したテキスト(プロンプト用)
export function summarizePersonaForPrompt(persona: MinatoPersona): string {
  const lines: string[] = [];
  lines.push(`年齢: ${persona.age}歳`);
  if (persona.valueSummary.length) {
    lines.push(`価値観の傾向: ${persona.valueSummary.join(" / ")}`);
  }
  if (persona.regimeHistory.length) {
    lines.push(
      `過去に選んだ制度: ${persona.regimeHistory
        .map((r) => `${r.age}歳「${r.regimeName}」`)
        .join(", ")}`,
    );
  }
  if (persona.memories.length) {
    lines.push(
      "重要な記憶:\n" +
        persona.memories.map((m) => `- ${m.age}歳: ${m.title} — ${m.description}`).join("\n"),
    );
  }
  if (persona.unresolvedQuestions.length) {
    lines.push(`未解決の問い: ${persona.unresolvedQuestions.join(" / ")}`);
  }
  lines.push(`話し方: ${persona.speechStyle}`);
  lines.push(`現在の状況: ${persona.currentSituation}`);
  if (persona.currentConflict) lines.push(`現在の葛藤: ${persona.currentConflict}`);
  return lines.join("\n");
}
