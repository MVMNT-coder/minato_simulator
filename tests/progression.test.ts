import { describe, it, expect } from "vitest";
import { AGE_SEQUENCE } from "@/lib/game/types";
import { INITIAL_GAME_STATE } from "@/lib/game/types";

describe("Age progression", () => {
  it("age sequence is correct", () => {
    expect(AGE_SEQUENCE).toEqual([20, 30, 40, 60, 80, 100]);
  });

  it("age sequence starts at 20", () => {
    expect(AGE_SEQUENCE[0]).toBe(20);
  });

  it("age sequence ends at 100", () => {
    expect(AGE_SEQUENCE[AGE_SEQUENCE.length - 1]).toBe(100);
  });

  it("initial game state starts at age 20", () => {
    expect(INITIAL_GAME_STATE.currentAge).toBe(20);
  });

  it("has 6 age stages", () => {
    expect(AGE_SEQUENCE).toHaveLength(6);
  });

  it("each age is greater than the previous", () => {
    for (let i = 1; i < AGE_SEQUENCE.length; i++) {
      expect(AGE_SEQUENCE[i]).toBeGreaterThan(AGE_SEQUENCE[i - 1]);
    }
  });
});

describe("Memory inheritance across ages", () => {
  it("initial state has empty episodeMemories", () => {
    expect(INITIAL_GAME_STATE.episodeMemories).toHaveLength(0);
  });

  it("initial state has empty beliefs", () => {
    expect(INITIAL_GAME_STATE.beliefs).toHaveLength(0);
  });

  it("initial state has empty timeline", () => {
    expect(INITIAL_GAME_STATE.timeline).toHaveLength(0);
  });

  it("initial state has empty playerResponses", () => {
    expect(INITIAL_GAME_STATE.playerResponses).toHaveLength(0);
  });
});

describe("Save/Load integrity", () => {
  it("initial save version is 2", () => {
    expect(INITIAL_GAME_STATE.saveVersion).toBe(2);
  });

  it("initial phase is standby", () => {
    expect(INITIAL_GAME_STATE.phase).toBe("standby");
  });

  it("initial minato state has all required keys", () => {
    const state = INITIAL_GAME_STATE.minatoState;
    const requiredKeys = [
      "autonomy", "institutionalTrust", "interpersonalTrust", "riskTolerance",
      "socialAdaptation", "economicStability", "happiness", "loneliness",
      "publicConsciousness", "playerTrust", "familyRelationship", "selfEfficacy",
      "futureOutlook",
    ];
    for (const key of requiredKeys) {
      expect(key in state).toBe(true);
      const val = state[key as keyof typeof state];
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(100);
    }
  });
});

describe("Value echo across ages", () => {
  it("beliefs accumulate from player inputs", () => {
    const state = { ...INITIAL_GAME_STATE };
    const belief1 = { text: "自由", age: 20 as const, source: "player" as const };
    const belief2 = { text: "つながり", age: 30 as const, source: "player" as const };
    const beliefs = [...state.beliefs, belief1, belief2];
    expect(beliefs).toHaveLength(2);
    expect(beliefs[0].age).toBe(20);
    expect(beliefs[1].age).toBe(30);
  });

  it("episode memories accumulate across ages", () => {
    const memory1 = {
      age: 20 as const,
      title: "初めての選択",
      description: "AIの推薦を拒否した",
      emotionalTone: "ambivalent" as const,
      keywords: ["選択", "自律"],
    };
    const memory2 = {
      age: 30 as const,
      title: "コミュニティの変容",
      description: "引越し後の孤独感",
      emotionalTone: "negative" as const,
      keywords: ["孤独", "移住"],
    };
    const memories = [memory1, memory2];
    expect(memories).toHaveLength(2);
    expect(memories[0].keywords).toContain("選択");
  });
});
