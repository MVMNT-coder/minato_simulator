import type { SceneLine } from "@/lib/game/types";

// ============================================================
// LIFE SIMULATION — Core type definitions (redesign)
// ------------------------------------------------------------
// これは「価値観を通じて一人の未来人(ミナト)の人生を育てる
// 人生シミュレーション」のための型定義です。
// 既存の step ベース(types.ts)とは独立しており、
// 段階的移行のため別名前空間 (lifeSim/) に置いています。
// ============================================================

// ------ 年代 ------
export type LifeAge = 20 | 40 | 60 | 100;
export const LIFE_AGE_SEQUENCE: LifeAge[] = [20, 40, 60, 100];

// ------ ゲーム進行ステートマシン (§14) ------
export type LifeSimPhase =
  | "name_entry" // プレイヤー(アーキビスト)名の入力
  | "opening_intro" // Connectから引き継ぐ導入テキスト(アーキビスト説明)
  | "opening_video" // 2046年のミナトからの映像メッセージ
  | "intro" // (旧)テキスト導入 — 現在は未使用のフォールバック
  | "age_intro" // 年代と社会背景の提示
  | "regime_select" // 未来制度の選択
  | "world_reveal" // 制度が定着した世界の提示
  | "daily_scene" // 制度の中で暮らすミナトの日常
  | "conflict" // 恩恵と、新たに生まれた葛藤
  | "question" // ミナトの相談 / 思考実験
  | "value_input" // プレイヤーの価値観入力
  | "ai_processing" // 入力の解釈中 (ローディング演出)
  | "minato_response" // ミナトの反応
  | "life_consequence" // その後の人生の変化
  | "future_news" // 未来ニュース
  | "album_update" // 人生アルバムへの記録
  | "age_transition" // 次の年代へ
  | "ending"; // 100歳エンディング

// ============================================================
// Layer 1 : 人格・人生状態エンジンが保持する状態 (§5)
// ============================================================

// 価値観プロファイル(8軸 / 0–100)。プレイヤーには数値では見せない (§12)。
export interface ValueProfile {
  autonomy: number; // 自律性 — 自分で決めたい
  security: number; // 安全・安定志向
  efficiency: number; // 効率・合理性
  community: number; // 共同体・他者とのつながり
  curiosity: number; // 好奇心・探究
  embodiment: number; // 身体性・具体的な生の実感
  trustInSystems: number; // 制度・仕組みへの信頼
  toleranceForAmbiguity: number; // 曖昧さ・迷いへの耐性
}

export type ValueAxis = keyof ValueProfile;

export const INITIAL_VALUE_PROFILE: ValueProfile = {
  autonomy: 50,
  security: 50,
  efficiency: 50,
  community: 50,
  curiosity: 50,
  embodiment: 50,
  trustInSystems: 55,
  toleranceForAmbiguity: 50,
};

// 監査可能な価値観の変化
export interface ValueDelta {
  axis: ValueAxis;
  before: number;
  after: number;
  delta: number; // clamp [-8, +8]
  reason: string;
}

export interface LifeMemory {
  age: LifeAge;
  title: string;
  description: string;
  tone: "positive" | "negative" | "ambivalent" | "neutral";
  keywords: string[];
}

export interface LifeRelationship {
  name: string;
  role: string; // 家族 / 友人 / 同僚 / 制度 など自由記述
  closeness: number; // 0–100
  note: string;
}

export interface LifeEvent {
  age: LifeAge;
  regimeId: string;
  summary: string;
}

export interface RegimeHistoryEntry {
  age: LifeAge;
  regimeId: string;
  regimeName: string;
}

// 価値観の変化(1軸ぶん) — ビジュアライズ用
export interface ValueShift {
  axis: ValueAxis;
  label: string; // 日本語ラベル(AXIS_LABEL)
  delta: number; // 符号付きの変化量
  after: number; // 変化後の値(0–100)
}

// 各年代の「価値観の変容」記録 — 制度→回答→解釈→変化 をノード化する素材
export interface ValueJourneyEntry {
  age: LifeAge;
  regimeId: string;
  regimeName: string;
  choiceSummary: string; // 問いにどう答えたか(選択の要約)
  interpretedValues: string[]; // AIが解釈した価値観(自然言語)
  emotion: string; // その結果ミナトが抱いた感情
  shifts: ValueShift[]; // 変化の大きい順(上位)
}

// ミナトの内部状態。数値プロファイル + 自然言語要約の併用 (§5)。
export interface MinatoPersona {
  age: LifeAge;
  valueProfile: ValueProfile;
  // 自然言語での価値観要約(蓄積)。プレイヤーへ返すのはこちら側の言葉 (§12)。
  valueSummary: string[];
  regimeHistory: RegimeHistoryEntry[];
  valueJourney: ValueJourneyEntry[];
  memories: LifeMemory[];
  relationships: LifeRelationship[];
  lifeHistory: LifeEvent[];
  currentSituation: string;
  currentConflict: string;
  currentEmotion: string;
  speechStyle: string; // ミナトの話し方(蓄積で変化)
  unresolvedQuestions: string[];
}

export const INITIAL_PERSONA: MinatoPersona = {
  age: 20,
  valueProfile: { ...INITIAL_VALUE_PROFILE },
  valueSummary: [],
  regimeHistory: [],
  valueJourney: [],
  memories: [],
  relationships: [
    { name: "母", role: "家族", closeness: 70, note: "少し過保護。ミナトの選択をいつも心配している。" },
  ],
  lifeHistory: [],
  currentSituation: "大学進学と就職を控え、人生経路の登録を求められている。",
  currentConflict: "",
  currentEmotion: "落ち着かない",
  speechStyle: "率直で、少し自信なさげ。語尾に迷いがにじむ。",
  unresolvedQuestions: [],
};

// ============================================================
// 制度 (Regime) — プレイヤーが選ぶ (§4-1)
// ============================================================
export interface Regime {
  id: string;
  age: LifeAge;
  name: string; // 制度名
  tagline: string; // 一行キャッチ
  description: string; // 制度の説明(硬質・制度的トーン)
  upside: string; // 社会を良くした側面
  seededTension: string; // 新たに生まれうる不自由・葛藤の種
}

// ============================================================
// Layer 2 : シナリオ生成エンジンの出力 (§10 前半 JSON)
// ============================================================
export type QuestionType =
  | "consult" // 相談
  | "thoughtExperiment" // 思考実験
  | "priority" // 優先順位
  | "discomfort" // 違和感の選択
  | "naming" // 名前をつける
  | "addLine" // 一文を追加する
  | "acrossTime"; // 時間を超えた問い

export interface ValueQuestion {
  type: QuestionType;
  prompt: string;
  choices: string[]; // 直感的な選択肢 (§9)
  reasonPrompt: string; // 「なぜそれを選んだか」自由記述の見出し (§9)
  shortInputPrompt?: string; // 必要に応じた短い一言入力 (§9)
}

// ------ MBTI 風の価値観クイズ(色々な角度からの選択式) ------
export interface ValueQuizOption {
  label: string;
  // 選ぶと動く価値観の軸(正=強める / 負=弱める)
  axes: Partial<Record<ValueAxis, number>>;
}
export interface ValueQuizQuestion {
  id: string;
  angle: string; // 設問の切り口(表示用)
  prompt: string;
  options: ValueQuizOption[];
}
export interface ValueQuizAnswer {
  questionId: string;
  optionIndex: number;
}

export interface SceneData {
  age: LifeAge;
  regimeId: string;
  sceneTitle: string;
  worldDescription: string; // 制度が定着した世界(硬質)
  dailyLife: string; // ミナトの日常(具体的・生活の細部)
  benefit: string; // 制度の恩恵
  conflict: string; // 制度によって生まれた葛藤
  minatoLines: string[]; // ミナトの発話(相談・思考実験へ導く)
  question: ValueQuestion;
}

// ============================================================
// プレイヤー入力 (§9)
// ============================================================
export interface ValueInput {
  choice: string; // 選択肢
  reason: string; // 選んだ理由(自由記述, 1–3文で可)
  shortInput?: string; // 必要に応じた一言
}

// ============================================================
// Layer 1 の応答 (§10 後半 JSON)
// ============================================================
export interface ValueResponse {
  interpretedValues: string[]; // AIが解釈した価値観(自然言語)
  valueDeltas: ValueDelta[]; // valueProfile への変化(内部用)
  minatoResponse: string[]; // ミナトの反応(発話)
  lifeConsequence: string; // その後の人生の変化
  memoryAdded: string; // 次の年代へ持ち越す記憶
  futureNews: string; // 未来ニュース
  albumEntry: string; // 人生アルバム用の短い記録
  // 内部更新用(UIには数値を見せない, §12)
  nextSituation?: string;
  nextEmotion?: string;
  newSpeechStyle?: string;
  newRelationship?: LifeRelationship;
  newUnresolvedQuestion?: string;
}

// ============================================================
// 人生アルバム
// ============================================================
export interface AlbumEntry {
  age: LifeAge;
  regimeName: string;
  headline: string; // 未来ニュース見出し
  entry: string; // アルバム本文
  memory: string; // 記憶
}

// ============================================================
// 年代間の経過(ギャップ)シナリオ — 例: 20歳→40歳の20年間に起きた出来事
// ============================================================
export interface GapNarrative {
  fromAge: LifeAge;
  toAge: LifeAge;
  headline: string; // 経過を象徴する見出し
  lines: SceneLine[]; // モンタージュ台詞(NARRATOR / MINATO)
  summary: string; // 次の年代へ持ち越す一行要約
}

// ============================================================
// 永続化されるゲーム状態
// ============================================================
export interface LifeSimSave {
  version: number;
  phase: LifeSimPhase;
  playerName: string;
  currentAge: LifeAge;
  persona: MinatoPersona;
  selectedRegimeIds: Record<number, string>; // age -> regimeId
  album: AlbumEntry[];
  // 現在シーン / 現在レスポンス(再開用)
  currentScene?: SceneData;
  currentInput?: ValueInput;
  currentResponse?: ValueResponse;
  currentGap?: GapNarrative;
  ending?: EndingData;
}

// ============================================================
// エンディング (§13)
// ============================================================
export interface EndingData {
  currentState: string; // 100歳のミナトの現在
  reflection: string; // 人生を振り返る言葉
  unchangedValue: string; // 若い頃から変わらなかった価値観
  changedValue: string; // 年齢とともに変化した価値観
  regimeImpact: string; // 過去に選んだ制度が人生へ与えた影響
  happiness: string; // 幸福だった点
  regret: string; // 後悔している点
  questionToPlayer: string; // プレイヤーへ返す問い
  closingWords: string; // 「君は自分が未来に残したい価値観を選んでいた」趣旨
}

export const LIFE_SIM_SAVE_VERSION = 1;

// ============================================================
// アーカイブ — 過去に育てられたミナトの人生(1プレイ=1人生)
// ============================================================
export interface ArchivedLife {
  id: string;
  createdAt: number; // epoch ms
  label: string; // 「◯◯なミナト」
  epithet: string; // 一行で表す価値観
  valueSummary: string[];
  regimeHistory: RegimeHistoryEntry[];
  valueJourney?: ValueJourneyEntry[]; // 価値観の変容(ビジュアライズ用)
  album: AlbumEntry[];
  ending: EndingData;
  source: "you" | "sample"; // 自分の記録か、他アーキビストのサンプルか
  archivist?: string; // サンプルの記録者名
}

export const ARCHIVE_KEY = "future_value_archive_lives";
