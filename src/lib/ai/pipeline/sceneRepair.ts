// ============================================================
// Pipeline Step 6: Scene Repair
// Repairs scene if consistency check fails
// ============================================================
import type { AIProvider } from "../provider";
import { SceneWriterOutputSchema } from "@/lib/schemas/pipeline";
import type { SceneWriterOutput, ConsistencyCheckOutput } from "@/lib/schemas/pipeline";
import type { MinatoState } from "@/lib/game/types";

export async function repairScene(
  provider: AIProvider,
  originalScene: SceneWriterOutput,
  issues: ConsistencyCheckOutput,
  currentState: MinatoState,
  age: number
): Promise<SceneWriterOutput> {
  if (!issues.repairNeeded) return originalScene;

  const systemPrompt = `You are the Scene Repair stage of a life simulation pipeline.
The original scene had consistency issues. Repair it while keeping the core narrative.

Issues to fix: ${issues.issues.join(", ")}

Output the same JSON schema as the original scene writer:
{
  "contextLines": [...],
  "conflictLines": [...],
  "minatoThoughtLines": [...],
  "inputPrompt": "...",
  "perspectiveHint": "..."
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          age,
          originalScene,
          issues: issues.issues,
          targetState: {
            happiness: currentState.happiness,
            loneliness: currentState.loneliness,
          },
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return SceneWriterOutputSchema.parse(parsed);
}
