// ============================================================
// Report Generator — produces LIFE OBSERVATION REPORT
// ============================================================
import type { AIProvider } from "../provider";
import { LifeObservationReportSchema } from "@/lib/schemas/pipeline";
import type { LifeObservationReportOutput } from "@/lib/schemas/pipeline";
import type { GameState } from "@/lib/game/types";

export async function generateReport(
  provider: AIProvider,
  gameState: GameState
): Promise<LifeObservationReportOutput> {
  const systemPrompt = `You are generating a LIFE OBSERVATION REPORT for Minato's life simulation.
This is NOT a personality test or success/failure evaluation.
It is a nuanced record of what a life looked like — what was kept, what was lost, what came back.

RULES:
- Do NOT judge Minato's life as good or bad, success or failure
- Show complexity and ambiguity
- The "questionToPlayer" must be genuinely challenging — not rhetorical
- The "longestWord" must be a specific phrase or sentence from the simulation
- The "sideEffectOfGoodIntent" must show how something well-meaning had unintended consequences

Output JSON with ALL these fields:
{
  "preserved": "what Minato protected throughout their life",
  "lost": "what Minato lost",
  "inheritedFromPlayer": "what came from the player's inputs",
  "rejectedOrReinterpreted": "what Minato rejected or changed the meaning of",
  "socialGains": "what Minato gained from society",
  "relationalLosses": "what was lost in relationships",
  "longestWord": "the phrase that lasted longest through time",
  "sideEffectOfGoodIntent": "an unintended consequence of a positive intent",
  "minatosCurrentView": "Minato's perspective now at age 100",
  "questionToPlayer": "a genuine question returned to the player"
}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gs = gameState as any;
  const playerInputThemes = (gs.playHistory ?? [])
    .map((p: { rawText: string }) => p.rawText.substring(0, 50))
    .join("; ");

  const memoryTitles = gameState.episodeMemories
    .map((m) => `[${m.age}] ${m.title} (${m.emotionalTone})`)
    .join("; ");

  const finalState = gameState.minatoState;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          finalAge: 100,
          finalState,
          playerInputThemes,
          memoryTitles,
          unresolvedConflicts: (gs.unresolvedConflicts ?? []).map((c: { description: string }) => c.description),
          beliefs: gameState.beliefs.map((b) => b.text),
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return LifeObservationReportSchema.parse(parsed);
}
