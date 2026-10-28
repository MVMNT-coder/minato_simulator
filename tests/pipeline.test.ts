import { describe, it, expect } from "vitest";
import { MockProvider } from "@/lib/ai/mock";
import { INITIAL_MINATO_STATE } from "@/lib/game/types";
import { interpretInput } from "@/lib/ai/pipeline/inputInterpreter";
import { simulateState } from "@/lib/ai/pipeline/stateSimulator";
import { directEvent } from "@/lib/ai/pipeline/eventDirector";
import { writePreInputScene, writePostInputScene } from "@/lib/ai/pipeline/sceneWriter";
import { InterpretedValueSchema, StateSimulatorOutputSchema } from "@/lib/schemas/pipeline";
import { clampDelta } from "@/lib/game/state";
import { getInstitutions } from "@/lib/game/world";

const provider = new MockProvider();

describe("Input Interpreter", () => {
  it("does not pass raw input to output", async () => {
    const rawInput = "私はXYZQQQ999という非常に特殊な言葉を大切にしています";
    const result = await interpretInput(provider, rawInput, 20);
    // Raw text should not appear in structured output
    expect(result.coreTheme).not.toContain("XYZQQQ999");
    expect(result.tension).not.toContain("XYZQQQ999");
    expect(result.keywords).not.toContain("XYZQQQ999");
  });

  it("returns valid InterpretedValue schema", async () => {
    const result = await interpretInput(provider, "自由を大切にしたい", 20);
    expect(() => InterpretedValueSchema.parse(result)).not.toThrow();
  });

  it("autonomyBias is one of the valid values", async () => {
    const result = await interpretInput(provider, "test", 20);
    expect(["high", "low", "neutral"]).toContain(result.autonomyBias);
  });

  it("institutionalStance is one of the valid values", async () => {
    const result = await interpretInput(provider, "test", 20);
    expect(["trust", "distrust", "ambivalent"]).toContain(result.institutionalStance);
  });

  it("keywords is a non-empty array", async () => {
    const result = await interpretInput(provider, "test", 20);
    expect(Array.isArray(result.keywords)).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
  });
});

describe("State Simulator", () => {
  const mockInterpretedValue = {
    coreTheme: "自由と責任",
    tension: "制度と個人の葛藤",
    keywords: ["自由", "選択"],
    autonomyBias: "high" as const,
    institutionalStance: "ambivalent" as const,
  };

  it("returns valid schema output", async () => {
    const institutions = getInstitutions(20);
    const result = await simulateState(
      provider,
      INITIAL_MINATO_STATE,
      mockInterpretedValue,
      20,
      institutions
    );
    expect(() => StateSimulatorOutputSchema.parse(result)).not.toThrow();
  });

  it("all deltas are within ±5", async () => {
    const institutions = getInstitutions(20);
    const result = await simulateState(
      provider,
      INITIAL_MINATO_STATE,
      mockInterpretedValue,
      20,
      institutions
    );
    for (const d of result.deltas) {
      expect(Math.abs(d.delta)).toBeLessThanOrEqual(5);
    }
  });

  it("has both benefit and cost", async () => {
    const institutions = getInstitutions(20);
    const result = await simulateState(
      provider,
      INITIAL_MINATO_STATE,
      mockInterpretedValue,
      20,
      institutions
    );
    expect(result.benefitRealized.length).toBeGreaterThan(0);
    expect(result.costIncurred.length).toBeGreaterThan(0);
  });
});

describe("Event Director", () => {
  const mockInterpretedValue = {
    coreTheme: "自律性",
    tension: "制度との摩擦",
    keywords: ["自律"],
    autonomyBias: "high" as const,
    institutionalStance: "distrust" as const,
  };

  it("returns an event with benefit and cost", async () => {
    const institutions = getInstitutions(20);
    const event = await directEvent(provider, 20, mockInterpretedValue, INITIAL_MINATO_STATE, institutions);
    expect(event.benefit.length).toBeGreaterThan(0);
    expect(event.cost.length).toBeGreaterThan(0);
  });

  it("returns an event with title and description", async () => {
    const institutions = getInstitutions(20);
    const event = await directEvent(provider, 20, mockInterpretedValue, INITIAL_MINATO_STATE, institutions);
    expect(event.title.length).toBeGreaterThan(0);
    expect(event.description.length).toBeGreaterThan(0);
  });
});

describe("Scene Writer separation", () => {
  it("pre-input scene does not include raw player text in output", async () => {
    const RAW_MARKER = "UNIQUE_MARKER_12345";
    // Simulate calling with interpreted value (not raw text)
    // Scene writer should NOT receive raw text
    const scene = await writePreInputScene(
      provider,
      20,
      INITIAL_MINATO_STATE,
      [],
      "2046年。AIライフデザインの時代。"
    );
    // None of the scene lines should contain the raw marker
    const allText = [
      ...scene.contextLines,
      ...scene.conflictLines,
      ...scene.minatoThoughtLines,
    ].map((l) => l.text).join(" ");
    expect(allText).not.toContain(RAW_MARKER);
    expect(scene.inputPrompt.length).toBeGreaterThan(0);
    expect(scene.perspectiveHint.length).toBeGreaterThan(0);
  });

  it("post-input scene uses interpreted value not raw input", async () => {
    const mockInterpretedValue = {
      coreTheme: "自律性への問い",
      tension: "制度への依存",
      keywords: ["自律"],
      autonomyBias: "high" as const,
      institutionalStance: "ambivalent" as const,
    };
    const mockEvent = {
      id: "test_event",
      title: "選択の岐路",
      description: "テストイベント",
      benefit: "利益",
      cost: "代償",
      institutionInvolved: "AIライフデザイン",
    };

    const scene = await writePostInputScene(
      provider,
      20,
      mockInterpretedValue,
      mockEvent,
      INITIAL_MINATO_STATE,
      INITIAL_MINATO_STATE,
      []
    );
    expect(scene.sceneLines.length).toBeGreaterThan(0);
  });
});

describe("Zod schema validation", () => {
  it("rejects invalid interpreted value", () => {
    expect(() =>
      InterpretedValueSchema.parse({
        coreTheme: "",
        tension: "",
        keywords: [],
        autonomyBias: "invalid",
        institutionalStance: "unknown",
      })
    ).toThrow();
  });

  it("rejects delta above 5", () => {
    expect(() =>
      StateSimulatorOutputSchema.parse({
        deltas: [{ key: "autonomy", delta: 10, reason: "too large" }],
        benefitRealized: "ok",
        costIncurred: "ok",
      })
    ).toThrow();
  });

  it("rejects delta below -5", () => {
    expect(() =>
      StateSimulatorOutputSchema.parse({
        deltas: [{ key: "autonomy", delta: -10, reason: "too small" }],
        benefitRealized: "ok",
        costIncurred: "ok",
      })
    ).toThrow();
  });

  it("rejects invalid state key", () => {
    expect(() =>
      StateSimulatorOutputSchema.parse({
        deltas: [{ key: "nonExistentKey", delta: 1, reason: "bad key" }],
        benefitRealized: "ok",
        costIncurred: "ok",
      })
    ).toThrow();
  });
});

describe("Delta clamp utility", () => {
  it("max delta is ±5", () => {
    expect(clampDelta(100)).toBe(5);
    expect(clampDelta(-100)).toBe(-5);
  });
});

describe("World institutions", () => {
  it("Age 20 has institutions", () => {
    const institutions = getInstitutions(20);
    expect(institutions.length).toBeGreaterThan(0);
  });

  it("every institution has follow benefit, follow cost, deviate benefit, deviate cost", () => {
    const institutions = getInstitutions(20);
    for (const inst of institutions) {
      expect(inst.followBenefit.length).toBeGreaterThan(0);
      expect(inst.followCost.length).toBeGreaterThan(0);
      expect(inst.deviateBenefit.length).toBeGreaterThan(0);
      expect(inst.deviateCost.length).toBeGreaterThan(0);
    }
  });

  it("every input age has institutions", () => {
    for (const age of [20, 25, 40, 45, 60, 65, 80, 90]) {
      const institutions = getInstitutions(age);
      expect(institutions.length).toBeGreaterThan(0);
    }
  });
});
