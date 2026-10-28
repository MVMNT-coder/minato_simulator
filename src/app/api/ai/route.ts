// ============================================================
// API Route: /api/ai
// Server-side only — API keys never exposed to client
// ============================================================
import { createProvider } from "@/lib/ai/factory";
import {
  runPreInputPipeline,
  runPostInputPipeline,
  runGapStoryPipeline,
  generateReport,
} from "@/lib/ai/pipeline/index";
import type { Age, GameState } from "@/lib/game/types";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      action: "preInput" | "postInput" | "report" | "gapStory";
      age?: Age;
      rawPlayerInput?: string;
      gapRange?: [number, number];
      gameState?: Partial<GameState>;
    };

    const provider = await createProvider();

    if (body.action === "preInput") {
      const age = body.age!;
      const gameState = body.gameState as GameState;
      const result = await runPreInputPipeline(provider, gameState, age);
      return Response.json(result);
    }

    if (body.action === "postInput") {
      const age = body.age!;
      const rawPlayerInput = body.rawPlayerInput!;
      const gameState = body.gameState as GameState;
      const result = await runPostInputPipeline(provider, gameState, age, rawPlayerInput);
      return Response.json(result);
    }

    if (body.action === "gapStory") {
      const gapRange = body.gapRange!;
      const gameState = body.gameState as GameState;
      const result = await runGapStoryPipeline(provider, gameState, gapRange);
      return Response.json(result);
    }

    if (body.action === "report") {
      const gameState = body.gameState as GameState;
      const report = await generateReport(provider, gameState);
      return Response.json({ report });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("[API/ai]", e);
    return Response.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
