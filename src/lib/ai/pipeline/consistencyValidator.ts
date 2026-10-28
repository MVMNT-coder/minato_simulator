// ============================================================
// Pipeline Step 5: Consistency Validator
// Checks that scene output is coherent with state/history
// ============================================================
import type { AIProvider } from "../provider";
import { ConsistencyCheckSchema } from "@/lib/schemas/pipeline";
import type { ConsistencyCheckOutput, SceneWriterOutput } from "@/lib/schemas/pipeline";
import type { MinatoState } from "@/lib/game/types";

export async function validateConsistency(
  provider: AIProvider,
  scene: SceneWriterOutput,
  currentState: MinatoState,
  age: number
): Promise<ConsistencyCheckOutput> {
  const systemPrompt = `You are the Consistency Validator in a life simulation pipeline.
Check if the generated scene is consistent with Minato's current state.

Check for:
1. Does Minato's emotional tone match their state values?
2. Are there sudden extreme emotional swings without cause?
3. Is the scene too optimistic or too pessimistic for the state values?
4. Does the scene feel plausible for someone at this age?

Output JSON:
{
  "isConsistent": true|false,
  "issues": ["list of issues if any"],
  "repairNeeded": true|false
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          age,
          sceneFirstLine: scene.contextLines[0]?.text ?? "",
          minatoFirstThought: scene.minatoThoughtLines[0]?.text ?? "",
          state: {
            happiness: currentState.happiness,
            loneliness: currentState.loneliness,
            autonomy: currentState.autonomy,
          },
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return ConsistencyCheckSchema.parse(parsed);
}
