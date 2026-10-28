// ============================================================
// AI Provider Interface
// ============================================================

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIProvider {
  name: string;
  complete(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse>;
}
