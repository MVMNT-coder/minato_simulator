"use client";
// ============================================================
// Zustand Game Store — Redesigned for step-based game flow
// ============================================================
import { create } from "zustand";
import type {
  GameState,
  GamePhase,
  Age,
  SceneLine,
  PlayerResponse,
  TimelineEntry,
  LifeObservationReport,
} from "@/lib/game/types";
import {
  INITIAL_GAME_STATE,
  AGE_SEQUENCE,
  INITIAL_MINATO_STATE,
} from "@/lib/game/types";
import { saveGame, loadGame, clearSave } from "@/lib/game/save";

interface DialogueState {
  currentLines: SceneLine[];
  currentLineIndex: number;
}

interface GameStore extends GameState {
  // Dialogue display state (not persisted)
  dialogue: DialogueState;

  // Actions
  setPhase: (phase: GamePhase) => void;
  advanceStep: () => void;
  recordResponse: (response: PlayerResponse) => void;
  addTimelineEntry: (entry: TimelineEntry) => void;
  getResponsesForAge: (age: Age) => PlayerResponse[];
  advanceAge: () => GamePhase;

  // Dialogue actions
  setDialogueLines: (lines: SceneLine[]) => void;
  advanceDialogueLine: () => void;

  // Report
  setReport: (report: LifeObservationReport) => void;

  // Persistence
  save: () => void;
  load: () => boolean;
  reset: () => void;
}

const INITIAL_DIALOGUE: DialogueState = {
  currentLines: [],
  currentLineIndex: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_GAME_STATE,
  dialogue: INITIAL_DIALOGUE,

  setPhase: (phase) => {
    set({ phase });
    get().save();
  },

  advanceStep: () => {
    set((s) => ({ currentStepIndex: s.currentStepIndex + 1 }));
    get().save();
  },

  recordResponse: (response) => {
    set((s) => ({
      playerResponses: [...s.playerResponses, response],
    }));
    get().save();
  },

  addTimelineEntry: (entry) => {
    set((s) => ({
      timeline: [...s.timeline, entry],
    }));
    get().save();
  },

  getResponsesForAge: (age) => {
    return get().playerResponses.filter((r) => r.age === age);
  },

  advanceAge: (): GamePhase => {
    const state = get();
    const currentIdx = AGE_SEQUENCE.indexOf(state.currentAge);

    if (currentIdx < 0 || currentIdx >= AGE_SEQUENCE.length - 1) {
      // Last age — go to life report
      set({ phase: "lifeReport" });
      get().save();
      return "lifeReport";
    } else {
      const nextAge = AGE_SEQUENCE[currentIdx + 1];
      set({
        currentAge: nextAge,
        currentStepIndex: 0,
        phase: "agePlay",
      });
      get().save();
      return "agePlay";
    }
  },

  // Dialogue
  setDialogueLines: (lines) => {
    set({
      dialogue: { currentLines: lines, currentLineIndex: 0 },
    });
  },

  advanceDialogueLine: () => {
    set((s) => ({
      dialogue: {
        ...s.dialogue,
        currentLineIndex: Math.min(
          s.dialogue.currentLineIndex + 1,
          s.dialogue.currentLines.length
        ),
      },
    }));
  },

  setReport: (report) => {
    set({ report });
    get().save();
  },

  save: () => {
    const s = get();
    saveGame({
      phase: s.phase,
      currentAge: s.currentAge,
      currentStepIndex: s.currentStepIndex,
      timeline: s.timeline,
      playerResponses: s.playerResponses,
      minatoState: s.minatoState,
      beliefs: s.beliefs,
      episodeMemories: s.episodeMemories,
      debugLog: s.debugLog,
      saveVersion: 2,
    });
  },

  load: () => {
    const saved = loadGame();
    if (!saved) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = saved as any;
    set({
      phase: s.phase as GamePhase,
      currentAge: s.currentAge as Age,
      currentStepIndex: s.currentStepIndex ?? 0,
      timeline: s.timeline ?? [],
      playerResponses: s.playerResponses ?? [],
      minatoState: s.minatoState,
      beliefs: s.beliefs ?? [],
      episodeMemories: s.episodeMemories ?? [],
      report: s.report,
      debugLog: s.debugLog ?? [],
    });
    return true;
  },

  reset: () => {
    clearSave();
    set({
      ...INITIAL_GAME_STATE,
      minatoState: { ...INITIAL_MINATO_STATE },
      dialogue: INITIAL_DIALOGUE,
    });
  },
}));
