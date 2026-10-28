// ============================================================
// Pipeline Step 7: Memory Compressor
// Compresses episode memories to manageable summaries
// Preserves themes that have crossed multiple ages
// ============================================================
import type { AIProvider } from "../provider";
import type { EpisodeMemory } from "@/lib/game/types";
import { z } from "zod";

const CompressedMemorySchema = z.object({
  summary: z.string().min(1).max(300),
  keywords: z.array(z.string()).min(1).max(5),
});

export async function compressMemories(
  provider: AIProvider,
  memories: EpisodeMemory[],
  currentAge: number
): Promise<{ summary: string; keywords: string[] }> {
  if (memories.length === 0) {
    return { summary: "記憶なし", keywords: [] };
  }

  const systemPrompt = `You are the Memory Compressor in a life simulation pipeline.
Compress multiple episode memories into a single thematic summary.
Identify recurring keywords that have persisted across multiple ages.
These keywords will be used to show how early values echo in later life.

Output JSON:
{
  "summary": "string (max 300 chars) — thematic summary of the memories",
  "keywords": ["list", "of", "1-5", "recurring", "themes"]
}`;

  const response = await provider.complete(
    [
      {
        role: "user",
        content: JSON.stringify({
          currentAge,
          memories: memories.map((m) => ({
            age: m.age,
            title: m.title,
            emotionalTone: m.emotionalTone,
            keywords: m.keywords,
          })),
        }),
      },
    ],
    systemPrompt
  );

  const parsed = JSON.parse(response.content);
  return CompressedMemorySchema.parse(parsed);
}
