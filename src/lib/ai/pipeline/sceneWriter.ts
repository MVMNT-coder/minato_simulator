// ============================================================
// Pipeline Step 4: Scene Writer
// Writes the narrative scene AFTER state/event are confirmed
// NEVER receives raw player input — only interpreted values
// ============================================================
import type { AIProvider } from "../provider";
import { SceneWriterOutputSchema, PostInputSceneSchema } from "@/lib/schemas/pipeline";
import type { SceneWriterOutput, PostInputSceneOutput } from "@/lib/schemas/pipeline";
import type { InterpretedValue, MinatoState, EpisodeMemory, Belief, SceneLine } from "@/lib/game/types";
import type { WorldEventOutput } from "@/lib/schemas/pipeline";

export interface RegimeContext {
  socialRegime: string;
  naturalRegime: string;
  socialEffect: string;
  naturalEffect: string;
}

/** Pre-input scene: shows context, conflict, Minato's thoughts, then prompts for input */
export async function writePreInputScene(
  provider: AIProvider,
  age: number,
  currentState: MinatoState,
  recentMemories: EpisodeMemory[],
  worldContext: string,
  regimeContext?: RegimeContext
): Promise<SceneWriterOutput> {
  const regimeBlock = regimeContext
    ? `
REGIME CONTEXT (CRITICAL — the story MUST emerge from these regime choices):
The player chose:
  - Social regime: 「${regimeContext.socialRegime}」— ${regimeContext.socialEffect}
  - Natural regime: 「${regimeContext.naturalRegime}」— ${regimeContext.naturalEffect}

Your scene must depict a CONCRETE situation that exists BECAUSE of these regime choices.
The conflict Minato faces must be a direct consequence of living in this specific world.
The question to the player must arise naturally from this regime-shaped reality.
Do NOT describe the regimes abstractly — show their effects through specific daily-life details, encounters, and dilemmas.`
    : "";

  const systemPrompt = `You are the Scene Writer stage of a life simulation pipeline.
Write a novel-game style scene for Minato at Age ${age}.
${regimeBlock}

The scene structure:
1. contextLines (3-4 lines): Depict a concrete situation in the regime-shaped world.
   Show specific details — a notification, a conversation, a place, an encounter —
   that reveal what daily life looks like under these regimes.
2. conflictLines (2-3 lines): Show a conflict that arises FROM this world.
   This must be a dilemma that would NOT exist in a different regime.
3. minatoThoughtLines (2-3 lines): Minato reflects and turns toward the player.
   The reflection should connect the regime-specific situation to a deeper human question.
4. inputPrompt: An open-ended question that emerges naturally from the story.
   The player should feel that answering this question matters because of what they just read.
5. perspectiveHint: A second angle that creates productive tension with the obvious answer.

CRITICAL RULES:
- Do NOT lecture or moralize at the player
- Do NOT suggest "correct" choices or easy answers
- Minato speaks in first person, conversationally
- The scene builds SLOWLY — do not rush to the question
- Show, don't tell — use concrete scenes, not abstract descriptions of regimes
- The inputPrompt must feel like a genuine question born from THIS specific story
- Write all dialogue and narration in Japanese

Output JSON:
{
  "contextLines": [{"speaker": "NARRATOR"|"SYSTEM"|"MINATO", "text": "..."}],
  "conflictLines": [{"speaker": "MINATO", "text": "..."}],
  "minatoThoughtLines": [{"speaker": "MINATO", "text": "..."}],
  "inputPrompt": "string asking player for their words",
  "perspectiveHint": "string offering a different angle to consider"
}`;

  const userPayload: Record<string, unknown> = {
    age,
    currentState: {
      autonomy: currentState.autonomy,
      happiness: currentState.happiness,
      loneliness: currentState.loneliness,
      playerTrust: currentState.playerTrust,
    },
    recentMemories: recentMemories.slice(-3).map((m) => ({
      title: m.title,
      emotionalTone: m.emotionalTone,
    })),
    worldContext,
  };

  if (regimeContext) {
    userPayload.chosenRegimes = {
      social: { name: regimeContext.socialRegime, effect: regimeContext.socialEffect },
      natural: { name: regimeContext.naturalRegime, effect: regimeContext.naturalEffect },
    };
  }

  const response = await provider.complete(
    [{ role: "user", content: JSON.stringify(userPayload) }],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return SceneWriterOutputSchema.parse(parsed);
}

/** Post-input scene: shows how Minato receives/processes the player's value */
export async function writePostInputScene(
  provider: AIProvider,
  age: number,
  interpretedValue: InterpretedValue,
  worldEvent: WorldEventOutput,
  stateBefore: MinatoState,
  stateAfter: MinatoState,
  allMemories: EpisodeMemory[]
): Promise<PostInputSceneOutput> {
  const systemPrompt = `You are the Scene Writer for the post-input sequence.
Write how Minato RECEIVES and PROCESSES the player's value (do NOT quote it directly).
Show how the world event unfolds, and how Minato's state changes.

RULES:
- Minato may REJECT, MISREAD, or PARTIALLY ACCEPT the value
- Show both the benefit and cost of what happened
- Include echoes of past memories if relevant
- Do NOT make the player feel they did the "right" thing or "wrong" thing
- The scene should feel like real life — ambiguous, incomplete, ongoing

Output JSON:
{
  "sceneLines": [{"speaker": "NARRATOR"|"MINATO"|"SYSTEM", "text": "..."}],
  "newMemory": {"title": "...", "description": "...", "emotionalTone": "positive"|"negative"|"ambivalent"|"neutral", "keywords": ["..."]},
  "newConflict": {"description": "...", "involvedValues": ["..."]}
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          age,
          interpretedValue: {
            coreTheme: interpretedValue.coreTheme,
            tension: interpretedValue.tension,
          },
          worldEvent,
          stateDelta: {
            autonomy: stateAfter.autonomy - stateBefore.autonomy,
            happiness: stateAfter.happiness - stateBefore.happiness,
            loneliness: stateAfter.loneliness - stateBefore.loneliness,
          },
          pastMemoriesCount: allMemories.length,
          oldestMemoryTheme: allMemories[0]?.keywords?.[0] ?? null,
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return PostInputSceneSchema.parse(parsed);
}

export interface GapStoryScene {
  sceneLines: SceneLine[];
}

/** Generate a narrative for a gap period (e.g. ages 30-40) */
export async function writeGapStoryScene(
  provider: AIProvider,
  startAge: number,
  endAge: number,
  currentState: MinatoState,
  recentMemories: EpisodeMemory[],
  beliefs: Belief[],
  worldContext: string
): Promise<GapStoryScene> {
  const systemPrompt = `You are the Scene Writer for a gap period in a life simulation.
Write a narrative covering what happened to Minato between age ${startAge} and age ${endAge}.
This is a period the player did NOT directly interact with.

The story should:
1. Show how Minato's values and beliefs evolved during this time
2. Reference consequences of earlier player input
3. Show both gains and losses during this period
4. Feel like time passing — multiple small moments, not one big event
5. End with a sense of transition to the next era

Write 6-10 dialogue lines mixing NARRATOR and MINATO speakers.
MINATO's lines should show internal reflection and growth.
NARRATOR's lines should show the passage of time and external changes.

Output JSON:
{
  "sceneLines": [{"speaker": "NARRATOR"|"MINATO"|"SYSTEM", "text": "..."}]
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          startAge,
          endAge,
          currentState: {
            autonomy: currentState.autonomy,
            happiness: currentState.happiness,
            loneliness: currentState.loneliness,
            playerTrust: currentState.playerTrust,
            selfEfficacy: currentState.selfEfficacy,
          },
          recentMemories: recentMemories.slice(-3).map((m) => ({
            title: m.title,
            emotionalTone: m.emotionalTone,
          })),
          beliefs: beliefs.slice(-3).map((b) => b.text),
          worldContext,
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return { sceneLines: parsed.sceneLines ?? [] };
}
