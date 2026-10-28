// ============================================================
// FUTURE SIMULATOR — MINATO : Core Type Definitions
// ============================================================

// ------ Age stages ------
export type Age = 20 | 30 | 40 | 60 | 80 | 100;
export const AGE_SEQUENCE: Age[] = [20, 30, 40, 60, 80, 100];

// ------ Step-based game flow ------
export type StepType =
  | "narrative"        // ダイアログ表示のみ
  | "document"         // ドキュメント閲覧
  | "scenario"         // 心理テスト/思考実験
  | "cardSelect"       // カード選択 (legacy)
  | "slider"           // スライダー設定 (legacy)
  | "reveal"           // 追加情報表示 (legacy)
  | "confirm"          // 変更確認 (legacy)
  | "freeText"         // 自由入力
  | "result"           // 3層レスポンス
  | "timelineSave"     // タイムライン保存アニメーション
  | "montage";         // 時間経過モンタージュ

export interface CardOption {
  id: string;
  label: string;
  description?: string;
}

export interface SliderDef {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  minLabel: string;
  maxLabel: string;
}

export interface RevealCondition {
  thresholdType: "above" | "below" | "average";
  thresholdValue: number;
  text: string;
}

// ------ Scenario (心理テスト/思考実験) ------
export type ScenarioMode = "binary" | "multiChoice" | "freeText";

export interface ScenarioChoice {
  id: string;
  label: string;
  description?: string;
  minatoReaction?: string;
  followUp?: ScenarioDef;
}

export interface ScenarioDef {
  setup: SceneLine[];
  question: string;
  mode: ScenarioMode;
  choices?: ScenarioChoice[];
  freeTextPlaceholder?: string;
  minatoReaction?: string;
  followUp?: ScenarioDef;
}

export interface ScenarioAnswer {
  scenarioIndex: number;
  mode: ScenarioMode;
  choiceId?: string;
  text?: string;
  depth?: number;
}

export interface AgeStepDef {
  id: string;
  type: StepType;
  title?: string;
  // narrative
  lines?: SceneLine[];
  // document
  documentSections?: { heading: string; content: string }[];
  // scenario
  scenarios?: ScenarioDef[];
  // cardSelect (legacy)
  cards?: CardOption[];
  minSelect?: number;
  maxSelect?: number;
  allowCustom?: boolean;
  prompt?: string;
  // slider (legacy)
  sliders?: SliderDef[];
  // reveal (legacy)
  reveals?: RevealCondition[];
  revealSourceStepId?: string;
  // confirm (legacy)
  confirmSourceStepId?: string;
  confirmPrompt?: string;
  // freeText
  freeTextPrompt?: string;
  freeTextPlaceholder?: string;
  // montage
  montageFromAge?: number;
  montageToAge?: number;
}

// ------ Legacy: Age phases (kept for pipeline compatibility) ------
export interface AgePhase {
  label: string;
  inputAges: Age[];
  gapRange?: [number, number];
}
export const AGE_PHASES: AgePhase[] = [];

// ------ Game phases ------
export type GamePhase =
  | "standby"
  | "intro"         // ストーリー導入テキスト
  | "opening"       // notification + videoMessage
  | "agePlay"       // ステップ進行中
  | "montage"       // ギャップ期間
  | "lifeReport";   // 最終レポート

// ------ Minato's numeric state (0–100) ------
export interface MinatoState {
  // Core identity
  autonomy: number;           // 自律性
  institutionalTrust: number; // 制度への信頼
  interpersonalTrust: number; // 他者への信頼
  riskTolerance: number;      // リスク許容度
  socialAdaptation: number;   // 社会適応
  // Material
  economicStability: number;  // 経済的安定
  // Psychological
  happiness: number;          // 幸福感
  loneliness: number;         // 孤独感
  publicConsciousness: number; // 公共意識
  playerTrust: number;        // プレイヤーへの信頼
  // Relational
  familyRelationship: number; // 家族との関係
  // Agency
  selfEfficacy: number;       // 自己効力感
  futureOutlook: number;      // 将来への展望
}

export const INITIAL_MINATO_STATE: MinatoState = {
  autonomy: 50,
  institutionalTrust: 60,
  interpersonalTrust: 55,
  riskTolerance: 40,
  socialAdaptation: 60,
  economicStability: 50,
  happiness: 55,
  loneliness: 45,
  publicConsciousness: 50,
  playerTrust: 50,
  familyRelationship: 65,
  selfEfficacy: 50,
  futureOutlook: 55,
};

export type StateKey = keyof MinatoState;

// ------ State delta (auditable) ------
export interface StateDelta {
  key: StateKey;
  before: number;
  after: number;
  delta: number; // clamped to [-5, +5]
  reason: string;
}

// ------ Beliefs (qualitative) ------
export interface Belief {
  text: string;
  age: Age;
  source: "player" | "experience" | "institution";
}

// ------ Episode memory ------
export interface EpisodeMemory {
  age: Age;
  title: string;
  description: string;
  emotionalTone: "positive" | "negative" | "ambivalent" | "neutral";
  keywords: string[];
}

// ------ Unresolved conflict ------
export interface UnresolvedConflict {
  age: Age;
  description: string;
  involvedValues: string[];
}

// ------ Relationship ------
export interface Relationship {
  name: string;
  type: "family" | "friend" | "colleague" | "community" | "institution";
  quality: number; // 0–100
  notes: string;
}

// ------ Scene lines (novel game format) ------
export interface SceneLine {
  speaker: "MINATO" | "SYSTEM" | "NARRATOR" | string;
  text: string;
}

// ------ Timeline entry (one per age, saved after result step) ------
export interface TimelineEntry {
  age: Age;
  memory: string;          // 一行メモリ
  headline: string;        // ポップな見出し
  interpretation: string;  // ミナト解釈(2-4文)
}

// ------ Player response per step ------
export interface PlayerResponse {
  stepId: string;
  age: Age;
  type: StepType;
  data: Record<string, unknown>;
  timestamp: number;
}

// ------ Life Observation Report ------
export interface LifeObservationReport {
  preserved: string;
  lost: string;
  inheritedFromPlayer: string;
  rejectedOrReinterpreted: string;
  socialGains: string;
  relationalLosses: string;
  longestWord: string;
  sideEffectOfGoodIntent: string;
  minatosCurrentView: string;
  questionToPlayer: string;
}

// ------ Full game state ------
export interface GameState {
  phase: GamePhase;
  currentAge: Age;
  currentStepIndex: number;
  timeline: TimelineEntry[];
  playerResponses: PlayerResponse[];
  minatoState: MinatoState;
  beliefs: Belief[];
  episodeMemories: EpisodeMemory[];
  report?: LifeObservationReport;
  debugLog: string[];
  saveVersion: number;
}

export const INITIAL_GAME_STATE: GameState = {
  phase: "standby",
  currentAge: 20,
  currentStepIndex: 0,
  timeline: [],
  playerResponses: [],
  minatoState: INITIAL_MINATO_STATE,
  beliefs: [],
  episodeMemories: [],
  debugLog: [],
  saveVersion: 2,
};

// ============================================================
// Legacy types (kept for AI pipeline compatibility)
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegimeCategory {}
export interface RegimeOption {
  id: string;
  category: "social" | "natural";
  name: string;
  nameEn: string;
  description: string;
  worldEffect: string;
}
export interface SelectedRegimes {
  social: RegimeOption;
  natural: RegimeOption;
}
export interface PlayerInput {
  age: Age;
  rawText: string;
  timestamp: number;
}
export interface InterpretedValue {
  coreTheme: string;
  tension: string;
  keywords: string[];
  autonomyBias: "high" | "low" | "neutral";
  institutionalStance: "trust" | "distrust" | "ambivalent";
}
export interface WorldEvent {
  id: string;
  age: Age;
  title: string;
  description: string;
  benefit: string;
  cost: string;
  institutionInvolved: string;
  statDeltas: StateDelta[];
}
export interface AgeRecord {
  age: Age;
  playerInput?: PlayerInput;
  interpretedValue?: InterpretedValue;
  stateBefore?: MinatoState;
  stateAfter?: MinatoState;
  stateDeltas?: StateDelta[];
  worldEvent?: WorldEvent;
  sceneLines?: SceneLine[];
  newMemories?: EpisodeMemory[];
  newConflicts?: UnresolvedConflict[];
  relationshipUpdates?: Relationship[];
}
