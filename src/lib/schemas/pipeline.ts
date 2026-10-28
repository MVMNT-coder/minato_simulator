// ============================================================
// Zod schemas for all AI pipeline outputs
// ============================================================
import { z } from "zod";

// ------ Input Interpreter output ------
export const InterpretedValueSchema = z.object({
  coreTheme: z.string().min(1).max(100),
  tension: z.string().min(1).max(200),
  keywords: z.array(z.string()).min(1).max(10),
  autonomyBias: z.enum(["high", "low", "neutral"]),
  institutionalStance: z.enum(["trust", "distrust", "ambivalent"]),
});

// ------ State delta from State Simulator ------
const StateDeltaSchema = z.object({
  key: z.enum([
    "autonomy",
    "institutionalTrust",
    "interpersonalTrust",
    "riskTolerance",
    "socialAdaptation",
    "economicStability",
    "happiness",
    "loneliness",
    "publicConsciousness",
    "playerTrust",
    "familyRelationship",
    "selfEfficacy",
    "futureOutlook",
  ]),
  delta: z.number().min(-5).max(5),
  reason: z.string().min(1).max(200),
});

export const StateSimulatorOutputSchema = z.object({
  deltas: z.array(StateDeltaSchema).min(0).max(8),
  benefitRealized: z.string(),
  costIncurred: z.string(),
});

// ------ Event Director output ------
export const WorldEventSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  benefit: z.string().min(1).max(200),
  cost: z.string().min(1).max(200),
  institutionInvolved: z.string().min(1).max(100),
});

// ------ Scene Writer output ------
const SceneLineSchema = z.object({
  speaker: z.string().min(1).max(30),
  text: z.string().min(1).max(1000),
});

export const SceneWriterOutputSchema = z.object({
  contextLines: z.array(SceneLineSchema).min(3).max(12),
  conflictLines: z.array(SceneLineSchema).min(2).max(6),
  minatoThoughtLines: z.array(SceneLineSchema).min(2).max(6),
  inputPrompt: z.string().min(1).max(300),
  perspectiveHint: z.string().min(1).max(300),
});

// ------ Post-input scene (after player input) ------
export const PostInputSceneSchema = z.object({
  sceneLines: z.array(SceneLineSchema).min(4).max(16),
  newMemory: z
    .object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(500),
      emotionalTone: z.enum(["positive", "negative", "ambivalent", "neutral"]),
      keywords: z.array(z.string()).min(1).max(5),
    })
    .optional(),
  newConflict: z
    .object({
      description: z.string().min(1).max(300),
      involvedValues: z.array(z.string()).min(1).max(5),
    })
    .optional(),
});

// ------ Life Observation Report ------
export const LifeObservationReportSchema = z.object({
  preserved: z.string().min(1).max(300),
  lost: z.string().min(1).max(300),
  inheritedFromPlayer: z.string().min(1).max(300),
  rejectedOrReinterpreted: z.string().min(1).max(300),
  socialGains: z.string().min(1).max(300),
  relationalLosses: z.string().min(1).max(300),
  longestWord: z.string().min(1).max(100),
  sideEffectOfGoodIntent: z.string().min(1).max(300),
  minatosCurrentView: z.string().min(1).max(500),
  questionToPlayer: z.string().min(1).max(300),
});

// ------ Consistency Validator output ------
export const ConsistencyCheckSchema = z.object({
  isConsistent: z.boolean(),
  issues: z.array(z.string()),
  repairNeeded: z.boolean(),
});

export type InterpretedValueOutput = z.infer<typeof InterpretedValueSchema>;
export type StateSimulatorOutput = z.infer<typeof StateSimulatorOutputSchema>;
export type WorldEventOutput = z.infer<typeof WorldEventSchema>;
export type SceneWriterOutput = z.infer<typeof SceneWriterOutputSchema>;
export type PostInputSceneOutput = z.infer<typeof PostInputSceneSchema>;
export type LifeObservationReportOutput = z.infer<
  typeof LifeObservationReportSchema
>;
export type ConsistencyCheckOutput = z.infer<typeof ConsistencyCheckSchema>;
