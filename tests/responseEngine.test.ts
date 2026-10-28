import { describe, it, expect } from "vitest";
import {
  generateAge20Result,
  generateMontageLines,
  generateAgeResult,
  generateMontageLinesForAge,
} from "@/lib/game/responseEngine";
import type { PlayerResponse } from "@/lib/game/types";

// Helper to build a minimal PlayerResponse with scenario answers
function makeScenarioResponse(
  stepId: string,
  answers: Array<{ scenarioIndex: number; mode: string; choiceId?: string; text?: string }>,
  age: PlayerResponse["age"] = 20
): PlayerResponse {
  return { stepId, age, type: "scenario", data: { answers }, timestamp: Date.now() };
}

// ============================================================
// Age 20 — generateAge20Result
// ============================================================

describe("generateAge20Result", () => {
  it("returns headline, interpretation, and memory", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "enter_cafe" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_career" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_followed" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result).toHaveProperty("headline");
    expect(result).toHaveProperty("interpretation");
    expect(result).toHaveProperty("memory");
    expect(result.headline.length).toBeGreaterThan(0);
    expect(result.interpretation.length).toBeGreaterThan(0);
    expect(result.memory.length).toBeGreaterThan(0);
  });

  it("classifies seeker + present correctly", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "enter_cafe" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_career" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_followed" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result.headline).toBe("安全を手にした探求者");
  });

  it("classifies seeker + questioning correctly", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "enter_cafe" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_risk" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_deviated" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result.headline).toBe("問い続ける冒険者");
    expect(result.memory).toBe("20歳のミナトは、未知の道を選び、後悔すら受け入れる覚悟を持っていた。");
  });

  it("classifies follower + present correctly", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_nothing" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_followed" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result.headline).toBe("設計書を信じた旅人");
    expect(result.memory).toBe("20歳のミナトは、設計書を信じ、安定した未来を選んだ。");
  });

  it("classifies follower + questioning correctly", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_nothing" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_deviated" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result.headline).toBe("安定の中の懐疑者");
  });

  it("classifies ambivalent when choices are mixed", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_career" },
        { scenarioIndex: 2, mode: "binary", choiceId: "letter_deviated" },
      ]),
    ];
    const result = generateAge20Result(responses);
    expect(result.headline).toBe("迷いを抱えた思索者");
  });

  it("returns fallback values when no responses exist", () => {
    const result = generateAge20Result([]);
    expect(result.headline).toBeTruthy();
    expect(result.interpretation).toBeTruthy();
    expect(result.memory).toBeTruthy();
  });
});

// ============================================================
// Age 20 — generateMontageLines
// ============================================================

describe("generateMontageLines", () => {
  it("always starts with narrator line about time passing", () => {
    const lines = generateMontageLines([]);
    expect(lines[0].speaker).toBe("NARRATOR");
    expect(lines[0].text).toBe("時間が過ぎていく。");
  });

  it("always ends with narrator line about turning 30", () => {
    const lines = generateMontageLines([]);
    const last = lines[lines.length - 1];
    expect(last.speaker).toBe("NARRATOR");
    expect(last.text).toContain("30歳");
  });

  it("branches on cafe choice (enter_cafe)", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "enter_cafe" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_nothing" },
      ]),
    ];
    const lines = generateMontageLines(responses);
    const texts = lines.map((l) => l.text).join(" ");
    expect(texts).toContain("推奨ルートを外れる");
  });

  it("branches on cafe choice (follow_route)", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_nothing" },
      ]),
    ];
    const lines = generateMontageLines(responses);
    const texts = lines.map((l) => l.text).join(" ");
    expect(texts).toContain("設計書を何度も読み返した");
  });

  it("branches on rewrite choice (rewrite_nothing)", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_nothing" },
      ]),
    ];
    const lines = generateMontageLines(responses);
    const texts = lines.map((l) => l.text).join(" ");
    expect(texts).toContain("何も変えたくない");
  });

  it("branches on rewrite choice (rewrite_career)", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age20_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "follow_route" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "rewrite_career" },
      ]),
    ];
    const lines = generateMontageLines(responses);
    const texts = lines.map((l) => l.text).join(" ");
    expect(texts).toContain("環境適応型データアーキテクト");
  });

  it("returns at least 3 lines regardless of input", () => {
    const lines = generateMontageLines([]);
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================
// Age 30 — generateAgeResult
// ============================================================

describe("generateAge30Result", () => {
  it("classifies loyal + self_driven + vivid", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age30_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "help_friend" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "prove_self" },
        { scenarioIndex: 2, mode: "binary", choiceId: "memorable" },
      ], 30),
    ];
    const result = generateAgeResult(30, responses);
    expect(result.headline).toBe("絆を選んだ冒険者");
  });

  it("classifies cautious + system_driven + comfort", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age30_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "keep_distance" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "accept_system" },
        { scenarioIndex: 2, mode: "binary", choiceId: "comfortable" },
      ], 30),
    ];
    const result = generateAgeResult(30, responses);
    expect(result.headline).toBe("静かな合理主義者");
  });
});

// ============================================================
// Age 40 — generateAgeResult
// ============================================================

describe("generateAge40Result", () => {
  it("classifies owner + enhance", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age40_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "own_house" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "install" },
        { scenarioIndex: 2, mode: "freeText", text: "自分で選んだよ" },
      ], 40),
    ];
    const result = generateAgeResult(40, responses);
    expect(result.headline).toBe("進化する居場所の守り手");
  });

  it("classifies user + natural", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age40_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "use_rights" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "refuse" },
        { scenarioIndex: 2, mode: "freeText", text: "パパが選んだよ" },
      ], 40),
    ];
    const result = generateAgeResult(40, responses);
    expect(result.headline).toBe("軽やかな自然体");
  });
});

// ============================================================
// Age 60 — generateAgeResult
// ============================================================

describe("generateAge60Result", () => {
  it("classifies archive + activist + righteous", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age60_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "archive_join" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "bench_petition" },
        { scenarioIndex: 2, mode: "binary", choiceId: "choose_right" },
      ], 60),
    ];
    const result = generateAgeResult(60, responses);
    expect(result.headline).toBe("正義を刻む人");
  });

  it("classifies ephemeral + accepter + devoted", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age60_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "archive_refuse" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "bench_accept" },
        { scenarioIndex: 2, mode: "binary", choiceId: "choose_dear" },
      ], 60),
    ];
    const result = generateAgeResult(60, responses);
    expect(result.headline).toBe("静かに愛す人");
  });
});

// ============================================================
// Age 80 — generateAgeResult
// ============================================================

describe("generateAge80Result", () => {
  it("classifies summarizable + question", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age80_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "can_summarize" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "legacy_question" },
        { scenarioIndex: 2, mode: "freeText", text: "大丈夫だよ" },
      ], 80),
    ];
    const result = generateAgeResult(80, responses);
    expect(result.headline).toBe("問いの種を蒔く語り手");
  });

  it("classifies unsummarizable + nothing", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age80_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "cannot_summarize" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "legacy_nothing" },
        { scenarioIndex: 2, mode: "freeText", text: "楽しめ" },
      ], 80),
    ];
    const result = generateAgeResult(80, responses);
    expect(result.headline).toBe("沈黙を選んだ人");
  });
});

// ============================================================
// Age 100 — generateAgeResult
// ============================================================

describe("generateAge100Result", () => {
  it("classifies good + repeat", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age100_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "life_good" },
        { scenarioIndex: 1, mode: "freeText", text: "自分を信じた" },
        { scenarioIndex: 2, mode: "binary", choiceId: "repeat_yes" },
      ], 100),
    ];
    const result = generateAgeResult(100, responses);
    expect(result.headline).toBe("永遠を望む肯定者");
  });

  it("classifies unsure + once", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age100_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "life_unsure" },
        { scenarioIndex: 1, mode: "freeText", text: "分からなかった" },
        { scenarioIndex: 2, mode: "binary", choiceId: "repeat_no" },
      ], 100),
    ];
    const result = generateAgeResult(100, responses);
    expect(result.headline).toBe("問いのまま終わる人");
  });
});

// ============================================================
// Montage dispatchers
// ============================================================

describe("generateMontageLinesForAge", () => {
  it("generates montage for age 30", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age30_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "help_friend" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "prove_self" },
        { scenarioIndex: 2, mode: "binary", choiceId: "memorable" },
      ], 30),
    ];
    const lines = generateMontageLinesForAge(30, responses);
    expect(lines[0].text).toContain("時間が過ぎていく");
    const last = lines[lines.length - 1];
    expect(last.text).toContain("40歳");
  });

  it("generates montage for age 60", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age60_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "archive_refuse" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "bench_accept" },
        { scenarioIndex: 2, mode: "binary", choiceId: "choose_dear" },
      ], 60),
    ];
    const lines = generateMontageLinesForAge(60, responses);
    expect(lines.length).toBeGreaterThanOrEqual(3);
    const last = lines[lines.length - 1];
    expect(last.text).toContain("80歳");
  });

  it("generates montage for age 80", () => {
    const responses: PlayerResponse[] = [
      makeScenarioResponse("age80_scenarios", [
        { scenarioIndex: 0, mode: "binary", choiceId: "can_summarize" },
        { scenarioIndex: 1, mode: "multiChoice", choiceId: "legacy_story" },
        { scenarioIndex: 2, mode: "freeText", text: "頑張れ" },
      ], 80),
    ];
    const lines = generateMontageLinesForAge(80, responses);
    expect(lines.length).toBeGreaterThanOrEqual(3);
    const last = lines[lines.length - 1];
    expect(last.text).toContain("100歳");
  });

  it("returns fallback for unknown age", () => {
    const lines = generateMontageLinesForAge(50 as PlayerResponse["age"], []);
    expect(lines.length).toBe(2);
    expect(lines[1].text).toContain("60歳");
  });
});
