// ============================================================
// State utilities: clamp, delta, apply
// ============================================================
import type { MinatoState, StateDelta, StateKey } from "./types";

/** Clamp value to [0, 100] */
export function clampStat(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Clamp delta to [-5, +5] (max for a single change) */
export function clampDelta(delta: number): number {
  return Math.min(5, Math.max(-5, delta));
}

/**
 * Apply an array of deltas to a state, returning new state + auditable deltas.
 * Each delta is clamped to [-5, +5].
 */
export function applyDeltas(
  state: MinatoState,
  rawDeltas: Partial<Record<StateKey, { delta: number; reason: string }>>
): { newState: MinatoState; appliedDeltas: StateDelta[] } {
  const newState = { ...state };
  const appliedDeltas: StateDelta[] = [];

  for (const [key, change] of Object.entries(rawDeltas) as [
    StateKey,
    { delta: number; reason: string }
  ][]) {
    const clamped = clampDelta(change.delta);
    const before = state[key];
    const after = clampStat(before + clamped);
    newState[key] = after;
    appliedDeltas.push({
      key,
      before,
      after,
      delta: after - before,
      reason: change.reason,
    });
  }

  return { newState, appliedDeltas };
}

/** Merge two states (for memory inheritance across ages) */
export function inheritState(
  prev: MinatoState,
  next: MinatoState,
  inheritanceWeight = 0.3
): MinatoState {
  const result = {} as MinatoState;
  for (const key of Object.keys(prev) as StateKey[]) {
    // 70% new age value, 30% from previous age
    result[key] = clampStat(
      prev[key] * inheritanceWeight + next[key] * (1 - inheritanceWeight)
    );
  }
  return result;
}

/** Summarize state changes for display */
export function formatDelta(delta: StateDelta): string {
  const sign = delta.delta >= 0 ? "+" : "";
  return `${delta.key}: ${delta.before} → ${delta.after} (${sign}${delta.delta})`;
}
