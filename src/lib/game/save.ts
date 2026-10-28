// ============================================================
// Save / Load — localStorage-based persistence
// ============================================================
import type { GameState } from "./types";
import { INITIAL_GAME_STATE } from "./types";

const SAVE_KEY = "future_simulator_minato_v2";

export function saveGame(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify({ ...state, saveVersion: 2 });
    localStorage.setItem(SAVE_KEY, serialized);
  } catch (e) {
    console.warn("[Save] Failed to save:", e);
  }
}

export function loadGame(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // Basic validation
    if (!parsed.minatoState || !parsed.phase) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(SAVE_KEY);
}

/** Restore save or return initial state */
export function restoreOrInit(): GameState {
  const saved = loadGame();
  if (saved) return saved;
  return { ...INITIAL_GAME_STATE };
}
