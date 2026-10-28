// ============================================================
// Anthropic AI Provider
// ============================================================
import Anthropic from "@anthropic-ai/sdk";
import type { AIMessage, AIProvider, AIResponse } from "./provider";

const DEFAULT_MODEL = "claude-opus-4-8";

export class AnthropicProvider implements AIProvider {
  name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model || process.env.AI_MODEL || DEFAULT_MODEL;
  }

  async complete(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role === "system" ? "user" : m.role,
        content: m.content,
      })),
    });

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return {
      content,
      model: this.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }
}
