// ============================================================
// Pipeline Step 1: Input Interpreter
// Converts raw player text → structured interpreted value
// Raw input is NEVER passed to Scene Writer directly
// ============================================================
import type { AIProvider } from "../provider";
import { InterpretedValueSchema } from "@/lib/schemas/pipeline";
import type { InterpretedValueOutput } from "@/lib/schemas/pipeline";

export async function interpretInput(
  provider: AIProvider,
  rawInput: string,
  age: number
): Promise<InterpretedValueOutput> {
  const systemPrompt = `You are the Input Interpreter stage of a life simulation AI pipeline.
Your job is to extract the VALUE STRUCTURE from a player's free-text input.
Do NOT include the raw text in your output. Abstract it into themes and tensions.

Output MUST be valid JSON matching this schema:
{
  "coreTheme": "string (max 100 chars) - the central value or belief expressed",
  "tension": "string (max 200 chars) - what this value conflicts with in Minato's world",
  "keywords": ["array", "of", "1-10", "thematic", "words"],
  "autonomyBias": "high" | "low" | "neutral",
  "institutionalStance": "trust" | "distrust" | "ambivalent"
}

Rules:
- Do NOT use the player's exact words
- Extract the underlying value structure
- Consider how this might conflict with future institutions
- autonomyBias: high = values personal choice, low = values stability/conformity
- institutionalStance: trust = believes institutions help, distrust = skeptical, ambivalent = mixed`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: `Player input at Age ${age}: "${rawInput}"\n\nExtract the value structure as JSON.`,
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return InterpretedValueSchema.parse(parsed);
}
