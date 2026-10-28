// ============================================================
// Pipeline Orchestrator
// Runs all 7 stages in order for a given age
// ============================================================
import type { AIProvider } from "../provider";
import type {
  GameState,
  Age,
  StateDelta,
  AgeRecord,
} from "@/lib/game/types";
import { AGE_PHASES } from "@/lib/game/types";
import { applyDeltas } from "@/lib/game/state";
import { getInstitutions, buildWorldContext } from "@/lib/game/world";
import { interpretInput } from "./inputInterpreter";
import { simulateState } from "./stateSimulator";
import { directEvent } from "./eventDirector";
import { writePreInputScene, writePostInputScene } from "./sceneWriter";
import { validateConsistency } from "./consistencyValidator";
import { repairScene } from "./sceneRepair";
import { compressMemories } from "./memoryCompressor";
import { generateReport } from "./reportGenerator";

export interface PipelinePreInputResult {
  sceneLines: AgeRecord["sceneLines"];
  inputPrompt: string;
  perspectiveHint: string;
  debugLog: string[];
}

export interface PipelinePostInputResult {
  ageRecord: AgeRecord;
  debugLog: string[];
}

/** Step A: Generate the pre-input scene (before player types anything) */
export async function runPreInputPipeline(
  provider: AIProvider,
  gameState: GameState,
  age: Age
): Promise<PipelinePreInputResult> {
  const debugLog: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gs = gameState as any;
  const selectedRegimes = gs.selectedRegimes ?? {};
  const worldContext = buildWorldContext(age, selectedRegimes);

  // Extract regime context for the current phase
  const phase = AGE_PHASES.find((p) => p.inputAges.includes(age));
  const phaseRegimes = phase ? selectedRegimes[phase.label] : undefined;
  const regimeContext = phaseRegimes
    ? {
        socialRegime: phaseRegimes.social.name,
        naturalRegime: phaseRegimes.natural.name,
        socialEffect: phaseRegimes.social.worldEffect,
        naturalEffect: phaseRegimes.natural.worldEffect,
      }
    : undefined;

  debugLog.push(`[Scene Writer] Writing pre-input scene for Age ${age}`);
  if (regimeContext) {
    debugLog.push(`[Scene Writer] Regimes: ${regimeContext.socialRegime} / ${regimeContext.naturalRegime}`);
  }

  const scene = await writePreInputScene(
    provider,
    age,
    gameState.minatoState,
    gameState.episodeMemories,
    worldContext,
    regimeContext
  );

  debugLog.push(`[Consistency Validator] Checking scene...`);
  const check = await validateConsistency(provider, scene, gameState.minatoState, age);

  let finalScene = scene;
  if (check.repairNeeded) {
    debugLog.push(`[Scene Repair] Issues: ${check.issues.join(", ")}`);
    finalScene = await repairScene(provider, scene, check, gameState.minatoState, age);
    debugLog.push(`[Scene Repair] Scene repaired.`);
  } else {
    debugLog.push(`[Consistency Validator] Scene is consistent.`);
  }

  const allLines = [
    ...finalScene.contextLines,
    ...finalScene.conflictLines,
    ...finalScene.minatoThoughtLines,
  ];

  return {
    sceneLines: allLines,
    inputPrompt: finalScene.inputPrompt,
    perspectiveHint: finalScene.perspectiveHint,
    debugLog,
  };
}

/** Step B: Process player input, update state, generate post-input scene */
export async function runPostInputPipeline(
  provider: AIProvider,
  gameState: GameState,
  age: Age,
  rawPlayerInput: string
): Promise<PipelinePostInputResult> {
  const debugLog: string[] = [];
  const institutions = getInstitutions(age);

  // Step 1: Input Interpreter
  debugLog.push(`[Input Interpreter] Processing input...`);
  const interpretedValue = await interpretInput(provider, rawPlayerInput, age);
  debugLog.push(`[Input Interpreter] Theme: "${interpretedValue.coreTheme}"`);

  // Step 2: State Simulator (state confirmed BEFORE scene writing)
  debugLog.push(`[State Simulator] Calculating state changes...`);
  const stateSimResult = await simulateState(
    provider,
    gameState.minatoState,
    interpretedValue,
    age,
    institutions
  );

  const rawDeltas: Parameters<typeof applyDeltas>[1] = {};
  for (const d of stateSimResult.deltas) {
    rawDeltas[d.key] = { delta: d.delta, reason: d.reason };
  }
  const { newState, appliedDeltas } = applyDeltas(gameState.minatoState, rawDeltas);
  debugLog.push(`[State Simulator] Applied ${appliedDeltas.length} deltas.`);

  // Step 3: Event Director
  debugLog.push(`[Event Director] Selecting event...`);
  const worldEvent = await directEvent(
    provider,
    age,
    interpretedValue,
    newState,
    institutions
  );
  debugLog.push(`[Event Director] Event: "${worldEvent.title}"`);

  // Step 4: Scene Writer (uses interpreted value, NOT raw input)
  debugLog.push(`[Scene Writer] Writing post-input scene...`);
  const postScene = await writePostInputScene(
    provider,
    age,
    interpretedValue,
    worldEvent,
    gameState.minatoState,
    newState,
    gameState.episodeMemories
  );
  debugLog.push(`[Scene Writer] Scene complete.`);

  // Step 7: Memory Compressor (after accumulating new memory)
  const allMemories = postScene.newMemory
    ? [
        ...gameState.episodeMemories,
        {
          age,
          title: postScene.newMemory.title,
          description: postScene.newMemory.description,
          emotionalTone: postScene.newMemory.emotionalTone,
          keywords: postScene.newMemory.keywords,
        },
      ]
    : gameState.episodeMemories;

  if (allMemories.length >= 3) {
    debugLog.push(`[Memory Compressor] Compressing ${allMemories.length} memories...`);
    await compressMemories(provider, allMemories, age);
    debugLog.push(`[Memory Compressor] Compression complete.`);
  }

  // Build age record
  const stateDeltas: StateDelta[] = appliedDeltas;

  const ageRecord: AgeRecord = {
    age,
    playerInput: {
      age,
      rawText: rawPlayerInput,
      timestamp: Date.now(),
    },
    interpretedValue,
    stateBefore: gameState.minatoState,
    stateAfter: newState,
    stateDeltas,
    worldEvent: {
      id: worldEvent.id,
      age,
      title: worldEvent.title,
      description: worldEvent.description,
      benefit: worldEvent.benefit,
      cost: worldEvent.cost,
      institutionInvolved: worldEvent.institutionInvolved,
      statDeltas: stateDeltas,
    },
    sceneLines: postScene.sceneLines,
    newMemories: postScene.newMemory
      ? [
          {
            age,
            title: postScene.newMemory.title,
            description: postScene.newMemory.description,
            emotionalTone: postScene.newMemory.emotionalTone,
            keywords: postScene.newMemory.keywords,
          },
        ]
      : [],
    newConflicts: postScene.newConflict
      ? [
          {
            age,
            description: postScene.newConflict.description,
            involvedValues: postScene.newConflict.involvedValues,
          },
        ]
      : [],
  };

  return { ageRecord, debugLog };
}

export interface GapStoryResult {
  sceneLines: AgeRecord["sceneLines"];
  debugLog: string[];
}

/** Generate a story for a gap period (e.g. 30-40, 50-60, 70-80) */
export async function runGapStoryPipeline(
  provider: AIProvider,
  gameState: GameState,
  gapRange: [number, number]
): Promise<GapStoryResult> {
  const debugLog: string[] = [];
  const [startAge, endAge] = gapRange;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const worldContext = buildWorldContext(startAge, (gameState as any).selectedRegimes ?? {});

  debugLog.push(`[Gap Story] Generating story for ages ${startAge}-${endAge}`);

  const { writeGapStoryScene } = await import("./sceneWriter");
  const scene = await writeGapStoryScene(
    provider,
    startAge,
    endAge,
    gameState.minatoState,
    gameState.episodeMemories,
    gameState.beliefs,
    worldContext
  );

  debugLog.push(`[Gap Story] Scene complete with ${scene.sceneLines.length} lines.`);

  return {
    sceneLines: scene.sceneLines,
    debugLog,
  };
}

export { generateReport };
