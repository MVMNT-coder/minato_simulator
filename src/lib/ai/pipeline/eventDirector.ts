// ============================================================
// Pipeline Step 3: Event Director
// Selects the world event that Minato experiences this age
// Events embed institutional causality
// ============================================================
import type { AIProvider } from "../provider";
import { WorldEventSchema } from "@/lib/schemas/pipeline";
import type { WorldEventOutput } from "@/lib/schemas/pipeline";
import type { InterpretedValue, MinatoState } from "@/lib/game/types";
import type { InstitutionRule } from "@/lib/game/world";

export async function directEvent(
  provider: AIProvider,
  age: number,
  interpretedValue: InterpretedValue,
  currentState: MinatoState,
  institutions: InstitutionRule[]
): Promise<WorldEventOutput> {
  const systemPrompt = `You are the Event Director stage of a life simulation AI pipeline.
Select ONE world event that Minato experiences at this age, shaped by:
1. The institutional pressures of the era
2. Minato's current state
3. The values they've been building

RULES:
- The event must have BOTH a concrete benefit AND a concrete cost
- The event must involve at least one named institution
- The event should NOT be a simple win or simple loss
- The event should be plausible in a near-future Japan (2046-2126)
- Do NOT make the event melodramatic or over-the-top

Output JSON:
{
  "id": "unique_event_id",
  "title": "short title",
  "description": "2-4 sentences describing what happens",
  "benefit": "concrete benefit of this event",
  "cost": "concrete cost of this event",
  "institutionInvolved": "name of the institution involved"
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          age,
          interpretedValue,
          currentState: {
            autonomy: currentState.autonomy,
            institutionalTrust: currentState.institutionalTrust,
            economicStability: currentState.economicStability,
          },
          availableInstitutions: institutions,
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return WorldEventSchema.parse(parsed);
}
