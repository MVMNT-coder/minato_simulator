import { describe, it, expect } from "vitest";
import { clampStat, clampDelta, applyDeltas, inheritState } from "@/lib/game/state";
import { INITIAL_MINATO_STATE } from "@/lib/game/types";
import type { MinatoState } from "@/lib/game/types";

describe("clampStat", () => {
  it("clamps values below 0 to 0", () => {
    expect(clampStat(-10)).toBe(0);
    expect(clampStat(-0.5)).toBe(0);
  });

  it("clamps values above 100 to 100", () => {
    expect(clampStat(110)).toBe(100);
    expect(clampStat(100.1)).toBe(100);
  });

  it("rounds to nearest integer", () => {
    expect(clampStat(50.7)).toBe(51);
    expect(clampStat(50.2)).toBe(50);
  });

  it("passes through valid values", () => {
    expect(clampStat(0)).toBe(0);
    expect(clampStat(50)).toBe(50);
    expect(clampStat(100)).toBe(100);
  });
});

describe("clampDelta", () => {
  it("clamps delta above +5 to +5", () => {
    expect(clampDelta(10)).toBe(5);
    expect(clampDelta(5.5)).toBe(5);
  });

  it("clamps delta below -5 to -5", () => {
    expect(clampDelta(-10)).toBe(-5);
    expect(clampDelta(-5.5)).toBe(-5);
  });

  it("passes through valid deltas", () => {
    expect(clampDelta(3)).toBe(3);
    expect(clampDelta(-3)).toBe(-3);
    expect(clampDelta(5)).toBe(5);
    expect(clampDelta(-5)).toBe(-5);
  });
});

describe("applyDeltas", () => {
  it("applies positive deltas correctly", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 50 };
    const { newState, appliedDeltas } = applyDeltas(base, {
      autonomy: { delta: 3, reason: "test" },
    });
    expect(newState.autonomy).toBe(53);
    expect(appliedDeltas[0].key).toBe("autonomy");
    expect(appliedDeltas[0].before).toBe(50);
    expect(appliedDeltas[0].after).toBe(53);
    expect(appliedDeltas[0].delta).toBe(3);
  });

  it("applies negative deltas correctly", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, happiness: 60 };
    const { newState } = applyDeltas(base, {
      happiness: { delta: -3, reason: "sad" },
    });
    expect(newState.happiness).toBe(57);
  });

  it("clamps delta to max ±5", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 50 };
    const { newState, appliedDeltas } = applyDeltas(base, {
      autonomy: { delta: 10, reason: "large change" },
    });
    expect(newState.autonomy).toBe(55); // clamped to +5
    expect(appliedDeltas[0].delta).toBe(5);
  });

  it("clamps resulting value to 0-100", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 98 };
    const { newState } = applyDeltas(base, {
      autonomy: { delta: 5, reason: "overflow" },
    });
    expect(newState.autonomy).toBe(100);
  });

  it("clamps resulting value to minimum 0", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 2 };
    const { newState } = applyDeltas(base, {
      autonomy: { delta: -5, reason: "underflow" },
    });
    expect(newState.autonomy).toBe(0);
  });

  it("returns auditable deltas", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE };
    const { appliedDeltas } = applyDeltas(base, {
      autonomy: { delta: 2, reason: "reason1" },
      happiness: { delta: -1, reason: "reason2" },
    });
    expect(appliedDeltas).toHaveLength(2);
    expect(appliedDeltas.every((d) => d.reason.length > 0)).toBe(true);
  });

  it("does not mutate original state", () => {
    const base: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 50 };
    applyDeltas(base, { autonomy: { delta: 5, reason: "test" } });
    expect(base.autonomy).toBe(50);
  });
});

describe("inheritState", () => {
  it("produces values between prev and next", () => {
    const prev: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 40 };
    const next: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 80 };
    const result = inheritState(prev, next);
    expect(result.autonomy).toBeGreaterThan(40);
    expect(result.autonomy).toBeLessThan(80);
  });

  it("stays within 0-100 range", () => {
    const prev: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 0 };
    const next: MinatoState = { ...INITIAL_MINATO_STATE, autonomy: 100 };
    const result = inheritState(prev, next);
    expect(result.autonomy).toBeGreaterThanOrEqual(0);
    expect(result.autonomy).toBeLessThanOrEqual(100);
  });
});
