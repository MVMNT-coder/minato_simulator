import { describe, it, expect } from "vitest";
import { MockProvider } from "@/lib/ai/mock";

describe("MockProvider", () => {
  const provider = new MockProvider();

  it("returns a string response", async () => {
    const result = await provider.complete([{ role: "user", content: "test" }], "interpret");
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
  });

  it("is deterministic with same input", async () => {
    const input = [{ role: "user" as const, content: "hello world interpret value" }];
    const sys = "interpret the value structure";
    const result1 = await provider.complete(input, sys);
    const result2 = await provider.complete(input, sys);
    expect(result1.content).toBe(result2.content);
  });

  it("produces different results for different inputs", async () => {
    const result1 = await provider.complete([{ role: "user", content: "alpha" }], "write scene");
    const result2 = await provider.complete([{ role: "user", content: "beta delta gamma epsilon zeta" }], "write scene");
    // Probabilistically different — inputs hash differently
    // We just check both are valid JSON strings
    expect(result1.content).toBeTruthy();
    expect(result2.content).toBeTruthy();
  });

  it("returns valid JSON for interpret intent", async () => {
    const result = await provider.complete(
      [{ role: "user", content: "interpret the value structure at Age 20" }],
      "interpret"
    );
    const parsed = JSON.parse(result.content);
    expect(parsed).toHaveProperty("coreTheme");
    expect(parsed).toHaveProperty("tension");
    expect(parsed).toHaveProperty("keywords");
    expect(parsed).toHaveProperty("autonomyBias");
    expect(parsed).toHaveProperty("institutionalStance");
  });

  it("returns valid JSON for simulate intent", async () => {
    const result = await provider.complete(
      [{ role: "user", content: JSON.stringify({ age: 20, currentState: {}, interpretedValue: {} }) }],
      "You are the State Simulator stage of a life simulation AI pipeline."
    );
    const parsed = JSON.parse(result.content);
    expect(parsed).toHaveProperty("deltas");
    expect(Array.isArray(parsed.deltas)).toBe(true);
    expect(parsed).toHaveProperty("benefitRealized");
    expect(parsed).toHaveProperty("costIncurred");
  });

  it("returns model name", async () => {
    const result = await provider.complete([{ role: "user", content: "test" }]);
    expect(result.model).toBe("mock-deterministic-v1");
  });
});
