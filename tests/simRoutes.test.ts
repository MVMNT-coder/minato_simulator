import { describe, it, expect } from "vitest";
import { routeForState } from "@/lib/game/lifeSim/simRoutes";

describe("routeForState", () => {
  it("intro 系は /sim/intro", () => {
    expect(routeForState("name_entry", 20)).toBe("/sim/intro");
    expect(routeForState("opening_intro", 20)).toBe("/sim/intro");
    expect(routeForState("intro", 20)).toBe("/sim/intro");
  });
  it("opening_video は /sim/opening", () => {
    expect(routeForState("opening_video", 20)).toBe("/sim/opening");
  });
  it("年代フェーズは /sim/age/[age]", () => {
    expect(routeForState("regime_select", 20)).toBe("/sim/age/20");
    expect(routeForState("question", 40)).toBe("/sim/age/40");
    expect(routeForState("album_update", 100)).toBe("/sim/age/100");
  });
  it("age_transition は /sim/transition/[age]", () => {
    expect(routeForState("age_transition", 60)).toBe("/sim/transition/60");
    expect(routeForState("age_transition", 100)).toBe("/sim/transition/100");
  });
  it("ending は /sim/ending (opening に飛ばない)", () => {
    expect(routeForState("ending", 100)).toBe("/sim/ending");
    expect(routeForState("ending", 20)).toBe("/sim/ending");
  });
});
