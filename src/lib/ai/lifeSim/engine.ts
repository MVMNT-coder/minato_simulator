// ============================================================
// LIFE SIM ENGINE — 二層エンジンの公開API (§5)
// ------------------------------------------------------------
// 既定はオフラインの決定論モック(AI未接続でも全体を体験できる §16)。
// NEXT_PUBLIC_LIFESIM_AI==="1" のとき /api/lifesim 経由で実AIを使い、
// 失敗時は必ずモックにフォールバックする。
// ============================================================
import type {
  EndingData,
  GapNarrative,
  LifeAge,
  MinatoPersona,
  Regime,
  SceneData,
  ValueInput,
  ValueResponse,
} from "@/lib/game/lifeSim/types";
import { getMockScene } from "@/lib/game/lifeSim/mockScenes";
import { interpretValueInputMock } from "./mockResponse";
import { generateEndingMock } from "./mockEnding";
import { generateGapMock } from "./mockGap";

export interface EngineOptions {
  useAI?: boolean;
  signal?: AbortSignal;
  playerName?: string; // プレイヤー(アーキビスト)名 — ミナトが語りかける相手
}

function aiEnabled(opts?: EngineOptions): boolean {
  if (opts?.useAI !== undefined) return opts.useAI;
  if (typeof process !== "undefined") {
    return process.env.NEXT_PUBLIC_LIFESIM_AI === "1";
  }
  return false;
}

async function callApi<T>(
  action: string,
  payload: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch("/api/lifesim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
    signal,
  });
  if (!res.ok) throw new Error(`lifesim api ${action} failed: ${res.status}`);
  return (await res.json()) as T;
}

// ---- Layer 2: シーン生成 ----
export async function generateScene(
  persona: MinatoPersona,
  regime: Regime,
  age: LifeAge,
  opts?: EngineOptions,
): Promise<SceneData> {
  if (aiEnabled(opts)) {
    try {
      const scene = await callApi<SceneData>(
        "scene",
        { persona, regime, age, playerName: opts?.playerName },
        opts?.signal,
      );
      if (scene && scene.question && Array.isArray(scene.minatoLines)) return scene;
    } catch (e) {
      console.warn("[lifeSim] scene AI failed, using mock:", e);
    }
  }
  return getMockScene(age, regime.id, persona);
}

// ---- Layer 1: 価値観の解釈と人格更新 ----
export async function interpretValueInput(
  persona: MinatoPersona,
  scene: SceneData,
  regime: Regime,
  input: ValueInput,
  opts?: EngineOptions,
): Promise<ValueResponse> {
  if (aiEnabled(opts)) {
    try {
      const resp = await callApi<ValueResponse>(
        "interpret",
        { persona, scene, regime, input, playerName: opts?.playerName },
        opts?.signal,
      );
      if (resp && Array.isArray(resp.minatoResponse) && Array.isArray(resp.valueDeltas)) {
        return resp;
      }
    } catch (e) {
      console.warn("[lifeSim] interpret AI failed, using mock:", e);
    }
  }
  return interpretValueInputMock(persona, scene, regime, input);
}

// ---- 年代間の経過(ギャップ)シナリオ ----
export async function generateGap(
  persona: MinatoPersona,
  fromAge: LifeAge,
  toAge: LifeAge,
  opts?: EngineOptions,
): Promise<GapNarrative> {
  if (aiEnabled(opts)) {
    try {
      const gap = await callApi<Partial<GapNarrative>>(
        "gap",
        { persona, fromAge, toAge, playerName: opts?.playerName },
        opts?.signal,
      );
      if (gap && Array.isArray(gap.lines) && gap.lines.length > 0) {
        return { fromAge, toAge, headline: gap.headline ?? "", lines: gap.lines, summary: gap.summary ?? "" };
      }
    } catch (e) {
      console.warn("[lifeSim] gap AI failed, using mock:", e);
    }
  }
  return generateGapMock(persona, fromAge, toAge);
}

// ---- エンディング ----
export async function generateEnding(
  persona: MinatoPersona,
  opts?: EngineOptions,
): Promise<EndingData> {
  if (aiEnabled(opts)) {
    try {
      const ending = await callApi<EndingData>(
        "ending",
        { persona, playerName: opts?.playerName },
        opts?.signal,
      );
      if (ending && ending.closingWords) return ending;
    } catch (e) {
      console.warn("[lifeSim] ending AI failed, using mock:", e);
    }
  }
  return generateEndingMock(persona);
}
