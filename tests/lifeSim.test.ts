// ============================================================
// Life Sim (redesign) — 価値観がミナトの人格と人生へ反映されることの検証
// §4-1 / §15 : 同じ制度でも、価値観が違えばミナトの人生は変わる
// ============================================================
import { describe, it, expect } from "vitest";
import { INITIAL_PERSONA } from "@/lib/game/lifeSim/types";
import type { MinatoPersona, ValueInput } from "@/lib/game/lifeSim/types";
import { getMockScene } from "@/lib/game/lifeSim/mockScenes";
import { findRegime } from "@/lib/game/lifeSim/regimes";
import { interpretValueInputMock } from "@/lib/ai/lifeSim/mockResponse";
import {
  applyDeltas,
  deriveValueSummary,
} from "@/lib/game/lifeSim/persona";

function clone(p: MinatoPersona): MinatoPersona {
  return JSON.parse(JSON.stringify(p)) as MinatoPersona;
}

const REGIME_ID = "life_path_guarantee";

function setup() {
  const persona = clone(INITIAL_PERSONA);
  const regime = findRegime(20, REGIME_ID)!;
  const scene = getMockScene(20, REGIME_ID, persona);
  return { persona, regime, scene };
}

describe("Layer 2: モックシーン (オフライン動作)", () => {
  it("20歳の3制度すべてで、構造化シーンが生成される", () => {
    for (const id of ["life_path_guarantee", "curiosity_credit", "care_default"]) {
      const scene = getMockScene(20, id, clone(INITIAL_PERSONA));
      expect(scene.sceneTitle).toBeTruthy();
      expect(scene.worldDescription).toBeTruthy();
      expect(scene.dailyLife).toBeTruthy();
      expect(scene.benefit).toBeTruthy();
      expect(scene.conflict).toBeTruthy();
      expect(scene.minatoLines.length).toBeGreaterThan(0);
      expect(scene.question.choices.length).toBeGreaterThanOrEqual(3);
      expect(scene.question.reasonPrompt).toBeTruthy();
    }
  });

  it("制度には恩恵と葛藤の両面がある (§6)", () => {
    const scene = getMockScene(20, REGIME_ID, clone(INITIAL_PERSONA));
    expect(scene.benefit).not.toEqual(scene.conflict);
  });
});

describe("Layer 1: 同じ制度 × 異なる価値観 → 異なるミナト (§4-1, §15)", () => {
  it("自律重視の入力と安定重視の入力で、帰結・記憶・価値観が変わる", () => {
    const { persona, regime, scene } = setup();

    const autonomyInput: ValueInput = {
      choice: "自分で決めるための時間",
      reason: "急かされても、自分で決めたい。迷う時間も自分のものだから。",
    };
    const securityInput: ValueInput = {
      choice: "将来の安定",
      reason: "まず安心できる安定がほしい。確実に保障されるなら任せたい。",
    };

    const a = interpretValueInputMock(clone(persona), scene, regime, autonomyInput);
    const b = interpretValueInputMock(clone(persona), scene, regime, securityInput);

    // 人生の帰結・記憶・アルバムが異なる
    expect(a.lifeConsequence).not.toEqual(b.lifeConsequence);
    expect(a.memoryAdded).not.toEqual(b.memoryAdded);
    expect(a.albumEntry).not.toEqual(b.albumEntry);

    // 更新される価値観プロファイルが異なる
    const profA = applyDeltas(persona.valueProfile, a.valueDeltas);
    const profB = applyDeltas(persona.valueProfile, b.valueDeltas);
    expect(profA).not.toEqual(profB);
    // 自律入力は autonomy を、安定入力は security を押し上げる
    expect(profA.autonomy).toBeGreaterThan(persona.valueProfile.autonomy);
    expect(profB.security).toBeGreaterThan(persona.valueProfile.security);
    expect(profA.autonomy).toBeGreaterThan(profB.autonomy);
    expect(profB.security).toBeGreaterThan(profA.security);
  });

  it("選択肢が同じでも、自由記述の内容で結果が変わる (§15: 自由記述が反映される)", () => {
    const { persona, regime, scene } = setup();
    const choice = "自分で決めるための時間";

    const reasonCuriosity: ValueInput = {
      choice,
      reason: "まだ知らない可能性に挑戦してみたいから。新しい世界が見たい。",
    };
    const reasonCommunity: ValueInput = {
      choice,
      reason: "家族や母の安心を思うと、一緒に決めたい。誰かのために選びたい。",
    };

    const a = interpretValueInputMock(clone(persona), scene, regime, reasonCuriosity);
    const b = interpretValueInputMock(clone(persona), scene, regime, reasonCommunity);

    // 同じ選択肢でも解釈・帰結が変わる
    expect(a.lifeConsequence).not.toEqual(b.lifeConsequence);
    expect(a.interpretedValues).not.toEqual(b.interpretedValues);

    const profA = applyDeltas(persona.valueProfile, a.valueDeltas);
    const profB = applyDeltas(persona.valueProfile, b.valueDeltas);
    expect(profA.curiosity).toBeGreaterThan(profB.curiosity);
    expect(profB.community).toBeGreaterThan(profA.community);
  });

  it("自由記述に本人の言葉が解釈へ反映される", () => {
    const { persona, regime, scene } = setup();
    const input: ValueInput = {
      choice: "制度から外れる自由",
      reason: "制度に判断を明け渡したくない。自分の頭で決めたい。",
    };
    const r = interpretValueInputMock(clone(persona), scene, regime, input);
    // 記述の冒頭断片が interpretedValues に引用される
    expect(r.interpretedValues.join(" ")).toContain("制度に判断を明け渡したくない");
  });
});

describe("人格状態の蓄積とプレイヤー非開示 (§5, §12)", () => {
  it("valueSummary は自然言語で、数値やタイプ診断を含まない", () => {
    const { persona, regime, scene } = setup();
    const input: ValueInput = {
      choice: "自分で決めるための時間",
      reason: "迷う時間を自分で守りたい。",
    };
    const r = interpretValueInputMock(clone(persona), scene, regime, input);
    const prof = applyDeltas(persona.valueProfile, r.valueDeltas);
    const summary = deriveValueSummary(prof);
    expect(summary.length).toBeGreaterThan(0);
    const joined = summary.join(" ");
    // 数値・軸名・タイプ分類が露出していないこと
    expect(joined).not.toMatch(/[0-9]/);
    expect(joined).not.toMatch(/autonomy|security|型です|タイプ/);
  });

  it("valueDeltas は [-8, +8] にクランプされる", () => {
    const { persona, regime, scene } = setup();
    const input: ValueInput = { choice: "自分で決めるための時間", reason: "自分で決めたい" };
    const r = interpretValueInputMock(clone(persona), scene, regime, input);
    for (const d of r.valueDeltas) {
      expect(Math.abs(d.delta)).toBeLessThanOrEqual(8);
      expect(d.after).toBeGreaterThanOrEqual(0);
      expect(d.after).toBeLessThanOrEqual(100);
    }
  });
});

describe("価値観クイズ(MBTI風): 選択が人格を動かす (agency)", () => {
  it("違う選択セットは、違う軸を動かす", async () => {
    const { getValueQuiz, aggregateQuizDeltas } = await import("@/lib/game/lifeSim/valueQuiz");
    const quiz = getValueQuiz(20);
    expect(quiz.length).toBeGreaterThanOrEqual(5);

    // 各設問で「自律寄り」を選ぶ / 「制度・安定寄り」を選ぶ、を模擬
    const pick = (pred: (label: string) => boolean) =>
      quiz.map((q) => {
        let idx = q.options.findIndex((o) => pred(o.label));
        if (idx < 0) idx = 0;
        return { questionId: q.id, optionIndex: idx };
      });

    const autonomyAns = pick((l) => /自分で|自分の|とことん/.test(l));
    const systemAns = pick((l) => /まかせ|頼る|データ|スコア|最短/.test(l));

    const a = aggregateQuizDeltas(quiz, autonomyAns);
    const b = aggregateQuizDeltas(quiz, systemAns);

    const sum = (arr: { axis: string; delta: number }[], axis: string) =>
      arr.filter((d) => d.axis === axis).reduce((s, d) => s + d.delta, 0);

    // 自律寄りセットは autonomy を、制度寄りセットは trustInSystems を強める
    expect(sum(a, "autonomy")).toBeGreaterThan(sum(b, "autonomy"));
    expect(sum(b, "trustInSystems")).toBeGreaterThan(sum(a, "trustInSystems"));
    // 集計結果自体が異なる
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b));
  });
});

describe("ステートマシン: 冒頭〜制度選択の遷移が詰まらない", () => {
  it("name_entry → opening_intro → opening_video → age_intro → regime_select と進める", async () => {
    const { useLifeSimStore } = await import("@/store/lifeSimStore");
    const store = useLifeSimStore.getState();
    store.start();
    // 最初はプレイヤー名の入力
    expect(useLifeSimStore.getState().phase).toBe("name_entry");

    useLifeSimStore.getState().submitName("テスト太郎");
    expect(useLifeSimStore.getState().playerName).toBe("テスト太郎");
    expect(useLifeSimStore.getState().phase).toBe("opening_intro");

    useLifeSimStore.getState().advancePhase();
    expect(useLifeSimStore.getState().phase).toBe("opening_video");

    useLifeSimStore.getState().advancePhase();
    expect(useLifeSimStore.getState().phase).toBe("age_intro");

    // ここが以前は詰まっていた(READ_NEXT に age_intro が無かった)
    useLifeSimStore.getState().advancePhase();
    expect(useLifeSimStore.getState().phase).toBe("regime_select");
  });
});

describe("アーカイブ: 人生ラベルとサンプルの整合性", () => {
  it("価値観の重心からミナトの呼称が導かれる", async () => {
    const { buildLifeLabel, SAMPLE_LIVES } = await import("@/lib/game/lifeSim/archive");

    const autonomy = clone(INITIAL_PERSONA);
    autonomy.valueProfile.autonomy = 88;
    autonomy.valueSummary = ["自分で決めたいという気持ちが強い"];
    const a = buildLifeLabel(autonomy);
    expect(a.label).toContain("ミナト");
    expect(a.epithet).toBe("自分で決めたいという気持ちが強い");

    const community = clone(INITIAL_PERSONA);
    community.valueProfile.community = 88;
    const c = buildLifeLabel(community);
    expect(c.label).not.toEqual(a.label); // 重心が違えば呼称も違う

    // サンプル人生は表示に必要な要素をすべて持つ
    for (const s of SAMPLE_LIVES) {
      expect(s.source).toBe("sample");
      expect(s.album.length).toBe(4);
      expect(s.ending.closingWords).toBeTruthy();
      expect(s.regimeHistory.length).toBe(4);
    }
  });
});

describe("次の年代へ: 蓄積された人格がシーンに影響する (§4-1, §7)", () => {
  it("40歳の日常描写は、蓄積された価値観の重心で変わる", () => {
    const autonomyPersona = clone(INITIAL_PERSONA);
    autonomyPersona.age = 40;
    autonomyPersona.valueProfile.autonomy = 85;

    const communityPersona = clone(INITIAL_PERSONA);
    communityPersona.age = 40;
    communityPersona.valueProfile.community = 85;

    const regimeId = "family_time_credit";
    const sceneA = getMockScene(40, regimeId, autonomyPersona);
    const sceneC = getMockScene(40, regimeId, communityPersona);

    // 同じ制度でも、人格が違えば日常が違う
    expect(sceneA.dailyLife).not.toEqual(sceneC.dailyLife);
  });
});
