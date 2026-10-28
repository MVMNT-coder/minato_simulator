// ============================================================
// Pipeline Step 2: State Simulator
// Determines how the interpreted value changes Minato's state
// State update is CONFIRMED before scene writing
// ============================================================
import type { AIProvider } from "../provider";
import { StateSimulatorOutputSchema } from "@/lib/schemas/pipeline";
import type { StateSimulatorOutput } from "@/lib/schemas/pipeline";
import type { MinatoState, InterpretedValue } from "@/lib/game/types";
import type { InstitutionRule } from "@/lib/game/world";

export async function simulateState(
  provider: AIProvider,
  currentState: MinatoState,
  interpretedValue: InterpretedValue,
  age: number,
  institutions: InstitutionRule[]
): Promise<StateSimulatorOutput> {
  const systemPrompt = `You are the State Simulator stage of a life simulation AI pipeline.
Based on an interpreted value and the current world context, determine how Minato's internal state changes.

State keys available:
- autonomy (自律性)
- institutionalTrust (制度への信頼)
- interpersonalTrust (他者への信頼)
- riskTolerance (リスク許容度)
- socialAdaptation (社会適応)
- economicStability (経済的安定)
- happiness (幸福感)
- loneliness (孤独感)
- publicConsciousness (公共意識)
- playerTrust (プレイヤーへの信頼)
- familyRelationship (家族との関係)
- selfEfficacy (自己効力感)
- futureOutlook (将来への展望)

STRICT RULES:
- Each delta must be between -5 and +5
- Normal change is -3 to +3, only use -5/+5 for major events
- Minato can REJECT, MISREAD, or PARTIALLY ACCEPT player values
- Every event has BOTH a benefit AND a cost realized
- Include 2-5 deltas that reflect realistic, nuanced change

Output JSON:
{
  "deltas": [{"key": "autonomy", "delta": 2, "reason": "..."}],
  "benefitRealized": "string",
  "costIncurred": "string"
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          age,
          currentState,
          interpretedValue,
          activeInstitutions: institutions.map((i) => i.name),
          worldContext: institutions.map((i) => ({
            name: i.name,
            followBenefit: i.followBenefit,
            followCost: i.followCost,
          })),
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return StateSimulatorOutputSchema.parse(parsed);
}
