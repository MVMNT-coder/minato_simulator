"use client";
// ============================================================
// Life Sim Store — 価値観育成型 人生シミュレーションの状態管理
// ステートマシン (§14) と人格蓄積 (§5, §7) を担う。
// 既存 gameStore とは独立(別 localStorage キー)。
// ============================================================
import { create } from "zustand";
import type {
  AlbumEntry,
  EndingData,
  GapNarrative,
  LifeAge,
  LifeMemory,
  LifeSimPhase,
  LifeSimSave,
  MinatoPersona,
  SceneData,
  ValueInput,
  ValueResponse,
} from "@/lib/game/lifeSim/types";
import {
  INITIAL_PERSONA,
  LIFE_AGE_SEQUENCE,
  LIFE_SIM_SAVE_VERSION,
} from "@/lib/game/lifeSim/types";
import {
  applyDeltas,
  buildDeltas,
  deriveSpeechStyle,
  deriveValueSummary,
  AXIS_LABEL,
} from "@/lib/game/lifeSim/persona";
import { findRegime } from "@/lib/game/lifeSim/regimes";
import { buildLifeLabel, saveArchivedLife } from "@/lib/game/lifeSim/archive";
import {
  getValueQuiz,
  aggregateQuizDeltas,
  summarizeQuizChoices,
} from "@/lib/game/lifeSim/valueQuiz";
import type {
  ArchivedLife,
  ValueAxis,
  ValueQuizAnswer,
  ValueJourneyEntry,
  ValueShift,
} from "@/lib/game/lifeSim/types";
import {
  generateScene,
  interpretValueInput,
  generateGap,
  generateEnding,
} from "@/lib/ai/lifeSim/engine";

const SAVE_KEY = "future_simulator_lifesim_v1";

// モックでも「処理中」の演出が見えるように、わずかな間を置く (§11)
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// 「読むだけ」の遷移順(クリックで進む)
const READ_NEXT: Partial<Record<LifeSimPhase, LifeSimPhase>> = {
  opening_intro: "opening_video",
  opening_video: "age_intro",
  intro: "age_intro",
  age_intro: "regime_select",
  world_reveal: "daily_scene",
  daily_scene: "conflict",
  conflict: "question",
  minato_response: "life_consequence",
  life_consequence: "album_update", // 未来ニュースは表示しない
  // album_update → age_transition は beginAgeTransition() で非同期に経過生成を挟む
};

function toneFromEmotion(emotion?: string): LifeMemory["tone"] {
  const e = emotion ?? "";
  if (/(誇|わくわく|満た|安心|地に足|前向|うれし|ほっと|楽し|希望)/.test(e)) return "positive";
  if (/(寂|後悔|置き去り|つら|沈)/.test(e)) return "negative";
  return "ambivalent";
}

function deepClonePersona(p: MinatoPersona): MinatoPersona {
  return JSON.parse(JSON.stringify(p)) as MinatoPersona;
}

interface LifeSimStore {
  phase: LifeSimPhase;
  playerName: string;
  currentAge: LifeAge;
  persona: MinatoPersona;
  selectedRegimeIds: Record<number, string>;
  album: AlbumEntry[];
  currentScene?: SceneData;
  currentInput?: ValueInput;
  currentResponse?: ValueResponse;
  currentGap?: GapNarrative;
  ending?: EndingData;
  isProcessing: boolean;
  initialized: boolean;

  // actions
  init: () => void; // ルート横断で一度だけ load()/start() する
  start: () => void;
  submitName: (name: string) => void; // 名前入力 → 導入へ
  advancePhase: () => void; // 読むだけの遷移
  selectRegime: (regimeId: string) => Promise<void>;
  submitValueInput: (
    input: ValueInput,
    rawDeltas?: { axis: ValueAxis; delta: number; reason: string }[],
  ) => Promise<void>;
  submitValueQuiz: (answers: ValueQuizAnswer[], note: string) => Promise<void>;
  beginAgeTransition: () => Promise<void>; // album_update → 経過生成 → age_transition
  proceedToNextAge: () => Promise<void>;

  save: () => void;
  load: () => boolean;
  hasSave: () => boolean;
  reset: () => void;
}

function freshState() {
  return {
    phase: "name_entry" as LifeSimPhase,
    playerName: "",
    currentAge: 20 as LifeAge,
    persona: deepClonePersona(INITIAL_PERSONA),
    selectedRegimeIds: {} as Record<number, string>,
    album: [] as AlbumEntry[],
    currentScene: undefined,
    currentInput: undefined,
    currentResponse: undefined,
    currentGap: undefined,
    ending: undefined,
    isProcessing: false,
  };
}

export const useLifeSimStore = create<LifeSimStore>((set, get) => ({
  ...freshState(),
  initialized: false,

  // 最初のマウント時に一度だけ: 保存があれば復元、無ければ新規開始
  init: () => {
    if (get().initialized) return;
    const restored = get().load();
    if (!restored) get().start();
    set({ initialized: true });
  },

  start: () => {
    set(freshState());
    get().save();
  },

  submitName: (name) => {
    set({ playerName: name.trim(), phase: "opening_intro" });
    get().save();
  },

  advancePhase: () => {
    const { phase } = get();
    const next = READ_NEXT[phase];
    if (next) {
      set({ phase: next });
      get().save();
    }
  },

  // 制度を選ぶ → Layer2でシーン生成 → world_reveal へ
  selectRegime: async (regimeId) => {
    const { currentAge, persona } = get();
    const regime = findRegime(currentAge, regimeId);
    if (!regime) return;

    set({ isProcessing: true });
    await delay(500);
    const scene = await generateScene(persona, regime, currentAge, {
      playerName: get().playerName,
    });

    const updatedPersona: MinatoPersona = {
      ...deepClonePersona(persona),
      regimeHistory: [
        ...persona.regimeHistory,
        { age: currentAge, regimeId: regime.id, regimeName: regime.name },
      ],
      currentConflict: scene.conflict,
    };

    set((s) => ({
      persona: updatedPersona,
      selectedRegimeIds: { ...s.selectedRegimeIds, [currentAge]: regimeId },
      currentScene: scene,
      isProcessing: false,
      phase: "world_reveal",
    }));
    get().save();
  },

  // MBTI風クイズ → 選択を集計して価値観を動かし、narrative は Layer1 で生成
  submitValueQuiz: async (answers, note) => {
    const { currentAge, currentScene } = get();
    const quiz = getValueQuiz(currentAge, currentScene?.regimeId);
    const rawDeltas = aggregateQuizDeltas(quiz, answers);
    const choicesText = summarizeQuizChoices(quiz, answers);
    // narrative 用に、選んだ内容を理由文へまとめる(mock/AI 双方が解釈できる)
    const input: ValueInput = {
      choice: answers.length ? summarizeQuizChoices(quiz, answers.slice(0, 1)) : "",
      reason: [note, choicesText].filter(Boolean).join(" / "),
    };
    await get().submitValueInput(input, rawDeltas);
  },

  // 価値観入力 → Layer1で解釈 → 人格更新 → minato_response へ
  submitValueInput: async (input, rawDeltas) => {
    const { currentAge, persona, currentScene } = get();
    if (!currentScene) return;
    const regime = findRegime(currentAge, currentScene.regimeId);
    if (!regime) return;

    set({ phase: "ai_processing", isProcessing: true, currentInput: input });
    await delay(2200); // インストール演出を見せる間

    const response = await interpretValueInput(persona, currentScene, regime, input, {
      playerName: get().playerName,
    });

    // 選択式クイズがある場合は、プレイヤーの選択そのものを人格変化に反映(agency)
    if (rawDeltas && rawDeltas.length) {
      response.valueDeltas = buildDeltas(persona.valueProfile, rawDeltas);
    }

    // ---- 人格状態を更新 (§5, §7) ----
    const newProfile = applyDeltas(persona.valueProfile, response.valueDeltas);
    const tone = toneFromEmotion(response.nextEmotion);

    const newMemory: LifeMemory = {
      age: currentAge,
      title: `${regime.name}の中で`,
      description: response.memoryAdded,
      tone,
      keywords: response.interpretedValues.slice(0, 3),
    };

    // 価値観の変容(ビジュアライズ用): 変化の大きい軸を上位で記録
    const shifts: ValueShift[] = response.valueDeltas
      .filter((d) => d.delta !== 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 4)
      .map((d) => ({
        axis: d.axis,
        label: AXIS_LABEL[d.axis],
        delta: d.delta,
        after: d.after,
      }));
    const journeyEntry: ValueJourneyEntry = {
      age: currentAge,
      regimeId: regime.id,
      regimeName: regime.name,
      choiceSummary: (input.reason || input.choice || "").trim(),
      interpretedValues: response.interpretedValues.slice(0, 3),
      emotion: response.nextEmotion ?? persona.currentEmotion,
      shifts,
    };

    const updatedPersona: MinatoPersona = {
      ...deepClonePersona(persona),
      valueProfile: newProfile,
      valueSummary: deriveValueSummary(newProfile),
      valueJourney: [...(persona.valueJourney ?? []), journeyEntry],
      memories: [...persona.memories, newMemory],
      lifeHistory: [
        ...persona.lifeHistory,
        { age: currentAge, regimeId: regime.id, summary: response.lifeConsequence },
      ],
      currentSituation: response.nextSituation ?? persona.currentSituation,
      currentEmotion: response.nextEmotion ?? persona.currentEmotion,
      speechStyle:
        response.newSpeechStyle ?? deriveSpeechStyle(newProfile, currentAge),
      unresolvedQuestions: response.newUnresolvedQuestion
        ? [...persona.unresolvedQuestions, response.newUnresolvedQuestion]
        : persona.unresolvedQuestions,
    };

    const albumEntry: AlbumEntry = {
      age: currentAge,
      regimeName: regime.name,
      headline: response.futureNews,
      entry: response.albumEntry,
      memory: response.memoryAdded,
    };

    set((s) => ({
      persona: updatedPersona,
      currentResponse: response,
      album: [...s.album, albumEntry],
      isProcessing: false,
      phase: "minato_response",
    }));
    get().save();
  },

  // album_update の後: 次の年代があれば経過(ギャップ)を生成してから age_transition へ
  beginAgeTransition: async () => {
    const { currentAge, persona } = get();
    const idx = LIFE_AGE_SEQUENCE.indexOf(currentAge);
    const isLast = idx < 0 || idx >= LIFE_AGE_SEQUENCE.length - 1;

    if (isLast) {
      // 100歳: 経過は挟まず、そのまま最終遷移へ
      set({ currentGap: undefined, phase: "age_transition" });
      get().save();
      return;
    }

    const nextAge = LIFE_AGE_SEQUENCE[idx + 1];
    // すぐに全画面の時間経過アニメへ(アバター画面を挟まない)。生成はその裏で行う。
    set({ currentGap: undefined, phase: "age_transition", isProcessing: true });
    await delay(700);
    const gap = await generateGap(persona, currentAge, nextAge, {
      playerName: get().playerName,
    });

    // 経過の要約を記憶へ折り込み、次の年代のシーン生成に反映させる (§7)
    const gapMemory: LifeMemory = {
      age: currentAge,
      title: `${currentAge}〜${nextAge}歳の日々`,
      description: gap.summary,
      tone: "neutral",
      keywords: [],
    };
    const updatedPersona: MinatoPersona = {
      ...deepClonePersona(persona),
      memories: [...persona.memories, gapMemory],
    };

    set({
      persona: updatedPersona,
      currentGap: gap,
      isProcessing: false,
      phase: "age_transition",
    });
    get().save();
  },

  // age_transition から次の年代へ(または エンディング)
  proceedToNextAge: async () => {
    const { currentAge, persona } = get();
    const idx = LIFE_AGE_SEQUENCE.indexOf(currentAge);
    const isLast = idx < 0 || idx >= LIFE_AGE_SEQUENCE.length - 1;

    if (isLast) {
      set({ isProcessing: true });
      await delay(900);
      const ending = await generateEnding(persona, { playerName: get().playerName });

      // 完成した人生をアーカイブへ保存(過去のミナトとして /archive で閲覧可能に)
      const { album, playerName } = get();
      const { label, epithet } = buildLifeLabel(persona);
      const life: ArchivedLife = {
        id: `life_${Date.now()}`,
        createdAt: Date.now(),
        source: "you",
        archivist: playerName || undefined,
        label,
        epithet,
        valueSummary: persona.valueSummary,
        regimeHistory: persona.regimeHistory,
        valueJourney: persona.valueJourney,
        album,
        ending,
      };
      saveArchivedLife(life);

      set({ ending, phase: "ending", isProcessing: false });
      get().save();
      return;
    }

    const nextAge = LIFE_AGE_SEQUENCE[idx + 1];
    const updatedPersona: MinatoPersona = {
      ...deepClonePersona(persona),
      age: nextAge,
      currentConflict: "",
    };
    set({
      currentAge: nextAge,
      persona: updatedPersona,
      currentScene: undefined,
      currentInput: undefined,
      currentResponse: undefined,
      currentGap: undefined,
      phase: "age_intro",
    });
    get().save();
  },

  save: () => {
    if (typeof window === "undefined") return;
    const s = get();
    const data: LifeSimSave = {
      version: LIFE_SIM_SAVE_VERSION,
      phase: s.phase,
      playerName: s.playerName,
      currentAge: s.currentAge,
      persona: s.persona,
      selectedRegimeIds: s.selectedRegimeIds,
      album: s.album,
      currentScene: s.currentScene,
      currentInput: s.currentInput,
      currentResponse: s.currentResponse,
      currentGap: s.currentGap,
      ending: s.ending,
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("[lifeSim] save failed:", e);
    }
  },

  load: () => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw) as LifeSimSave;
      if (!data.persona || !data.phase) return false;
      set({
        phase: data.phase,
        playerName: data.playerName ?? "",
        currentAge: data.currentAge,
        persona: data.persona,
        selectedRegimeIds: data.selectedRegimeIds ?? {},
        album: data.album ?? [],
        currentScene: data.currentScene,
        currentInput: data.currentInput,
        currentResponse: data.currentResponse,
        currentGap: data.currentGap,
        ending: data.ending,
        isProcessing: false,
      });
      return true;
    } catch {
      return false;
    }
  },

  hasSave: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(SAVE_KEY);
  },

  reset: () => {
    if (typeof window !== "undefined") localStorage.removeItem(SAVE_KEY);
    set(freshState());
  },
}));
