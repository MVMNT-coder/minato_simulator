// ============================================================
// API Route: /api/lifesim  (server-side only)
// 二層エンジンのAIバックエンド。API未設定/失敗時はモックへフォールバック。
// クライアントは既定でモックを直接使うため、これは AI 有効時のみ呼ばれる。
// ============================================================
import { createProvider } from "@/lib/ai/factory";
import {
  SCENARIO_ENGINE_SYSTEM,
  LIFE_STATE_ENGINE_SYSTEM,
  ENDING_ENGINE_SYSTEM,
  GAP_ENGINE_SYSTEM,
} from "@/lib/ai/lifeSim/prompts";
import { getMockScene } from "@/lib/game/lifeSim/mockScenes";
import { interpretValueInputMock } from "@/lib/ai/lifeSim/mockResponse";
import { generateEndingMock } from "@/lib/ai/lifeSim/mockEnding";
import { generateGapMock } from "@/lib/ai/lifeSim/mockGap";
import { summarizePersonaForPrompt } from "@/lib/game/lifeSim/persona";
import type {
  LifeAge,
  MinatoPersona,
  Regime,
  SceneData,
  ValueInput,
} from "@/lib/game/lifeSim/types";

function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("no json found in AI response");
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      action: "scene" | "interpret" | "ending" | "gap";
      persona: MinatoPersona;
      regime?: Regime;
      age?: LifeAge;
      scene?: SceneData;
      input?: ValueInput;
      fromAge?: LifeAge;
      toAge?: LifeAge;
      playerName?: string;
    };

    const provider = await createProvider();
    const isMock = provider.name === "mock";

    // プレイヤー(アーキビスト)名。ミナトはこの人物に語りかける。
    const who = (body.playerName ?? "").trim();
    const whoLine = who
      ? `\n## プレイヤー(未来価値観の記録者)\n名前: ${who}。ミナトはこの人物に語りかけている。自然な範囲で名前を呼んでよい(毎回は不要)。`
      : "";

    if (body.action === "scene") {
      const { persona, regime, age } = body;
      if (isMock || !regime || !age) {
        return Response.json(getMockScene(age ?? persona.age, regime?.id ?? "", persona));
      }
      const userMsg = [
        "## ミナトの人格状態",
        summarizePersonaForPrompt(persona),
        whoLine,
        "",
        "## 選択された制度",
        `${regime.name}: ${regime.description}\n恩恵: ${regime.upside}\n葛藤の種: ${regime.seededTension}`,
        "",
        `この制度の中で暮らす${age}歳のミナトのシーンを、指定JSONで生成してください。`,
      ].join("\n");
      try {
        const res = await provider.complete([{ role: "user", content: userMsg }], SCENARIO_ENGINE_SYSTEM);
        const parsed = extractJson(res.content) as Partial<SceneData>;
        if (parsed && parsed.question && Array.isArray(parsed.minatoLines)) {
          return Response.json({ ...parsed, age, regimeId: regime.id });
        }
      } catch (e) {
        console.warn("[/api/lifesim scene] fallback to mock:", e);
      }
      return Response.json(getMockScene(age, regime.id, persona));
    }

    if (body.action === "interpret") {
      const { persona, scene, regime, input } = body;
      if (isMock || !scene || !regime || !input) {
        return Response.json(
          interpretValueInputMock(persona, scene!, regime!, input!),
        );
      }
      const userMsg = [
        "## ミナトの人格状態",
        summarizePersonaForPrompt(persona),
        whoLine,
        "",
        "## 現在のシーン",
        `${scene.sceneTitle} / ${scene.conflict}`,
        `問い: ${scene.question.prompt}`,
        "",
        "## プレイヤーが入力した価値観",
        `選択: ${input.choice}`,
        `理由(自由記述): ${input.reason}`,
        input.shortInput ? `一言: ${input.shortInput}` : "",
        "",
        "この価値観を解釈し、ミナトの人格を更新して、指定JSONで返してください。自由記述の内容を必ず反映すること。",
      ].join("\n");
      try {
        const res = await provider.complete([{ role: "user", content: userMsg }], LIFE_STATE_ENGINE_SYSTEM);
        const parsed = extractJson(res.content) as Record<string, unknown>;
        if (parsed && Array.isArray(parsed.minatoResponse) && Array.isArray(parsed.valueDeltas)) {
          return Response.json(parsed);
        }
      } catch (e) {
        console.warn("[/api/lifesim interpret] fallback to mock:", e);
      }
      return Response.json(interpretValueInputMock(persona, scene, regime, input));
    }

    if (body.action === "gap") {
      const { persona, fromAge, toAge } = body;
      const from = fromAge ?? persona.age;
      const to = toAge ?? persona.age;
      if (isMock) return Response.json(generateGapMock(persona, from, to));
      const userMsg = [
        "## ミナトの人格状態",
        summarizePersonaForPrompt(persona),
        whoLine,
        "",
        `## 期間`,
        `${from}歳 → ${to}歳（${to - from}年間）`,
        "",
        `この${to - from}年間にミナトの身に起きた出来事を、蓄積された価値観を反映して指定JSONで生成してください。`,
      ].join("\n");
      try {
        const res = await provider.complete([{ role: "user", content: userMsg }], GAP_ENGINE_SYSTEM);
        const parsed = extractJson(res.content) as { lines?: unknown };
        if (parsed && Array.isArray(parsed.lines) && parsed.lines.length > 0) {
          return Response.json({ ...parsed, fromAge: from, toAge: to });
        }
      } catch (e) {
        console.warn("[/api/lifesim gap] fallback to mock:", e);
      }
      return Response.json(generateGapMock(persona, from, to));
    }

    if (body.action === "ending") {
      const { persona } = body;
      if (isMock) return Response.json(generateEndingMock(persona));
      const userMsg = [
        "## ミナトの人生(人格状態)",
        summarizePersonaForPrompt(persona),
        whoLine,
        "",
        "100歳のミナトのエンディングを、指定JSONで生成してください。",
      ].join("\n");
      try {
        const res = await provider.complete([{ role: "user", content: userMsg }], ENDING_ENGINE_SYSTEM);
        const parsed = extractJson(res.content) as { closingWords?: string };
        if (parsed && parsed.closingWords) return Response.json(parsed);
      } catch (e) {
        console.warn("[/api/lifesim ending] fallback to mock:", e);
      }
      return Response.json(generateEndingMock(persona));
    }

    return Response.json({ error: "unknown action" }, { status: 400 });
  } catch (e) {
    console.error("[/api/lifesim]", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
