// ============================================================
// AI Provider Factory — server-side only
// ============================================================
import type { AIProvider } from "./provider";
import { MockProvider } from "./mock";

export type ProviderName = "mock" | "anthropic" | "openai";

export async function createProvider(): Promise<AIProvider> {
  const providerName = (process.env.AI_PROVIDER ?? "mock") as ProviderName;
  const allowMockFallback = process.env.ALLOW_MOCK_FALLBACK !== "false";

  if (providerName === "mock") {
    return new MockProvider();
  }

  if (providerName === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      if (allowMockFallback) {
        console.warn("[AI Factory] ANTHROPIC_API_KEY not set, falling back to mock provider");
        return new MockProvider();
      }
      throw new Error("ANTHROPIC_API_KEY is required when AI_PROVIDER=anthropic");
    }
    const { AnthropicProvider } = await import("./anthropic");
    return new AnthropicProvider(apiKey, process.env.AI_MODEL);
  }

  if (providerName === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      if (allowMockFallback) {
        console.warn("[AI Factory] OPENAI_API_KEY not set, falling back to mock provider");
        return new MockProvider();
      }
      throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
    }
    const { OpenAIProvider } = await import("./openai");
    return new OpenAIProvider(apiKey, process.env.AI_MODEL);
  }

  // Default fallback
  return new MockProvider();
}
