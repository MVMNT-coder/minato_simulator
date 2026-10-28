// ============================================================
// OpenAI Provider
// ============================================================
import OpenAI from "openai";
import type { AIMessage, AIProvider, AIResponse } from "./provider";

const DEFAULT_MODEL = "gpt-4o";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model || process.env.AI_MODEL || DEFAULT_MODEL;
  }

  async complete(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      allMessages.push({ role: "system", content: systemPrompt });
    }
    for (const m of messages) {
      allMessages.push({ role: m.role === "system" ? "user" : m.role, content: m.content });
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: allMessages,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content ?? "";
    return {
      content,
      model: this.model,
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
      },
    };
  }
}
