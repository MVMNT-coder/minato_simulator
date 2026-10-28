"use client";
// ============================================================
// Memory Archive — shows accumulated episode memories
// ============================================================
import type { EpisodeMemory } from "@/lib/game/types";

interface Props {
  memories: EpisodeMemory[];
}

const TONE_COLORS = {
  positive: "#7df0d4",
  negative: "#ff5a6e",
  ambivalent: "#a9c8ff",
  neutral: "#8fa4b5",
};

export default function MemoryArchive({ memories }: Props) {
  if (memories.length === 0) {
    return (
      <div className="doc-panel">
        <div className="doc-kicker">MEMORY ARCHIVE</div>
        <div className="doc-title">記憶の記録</div>
        <div style={{ color: "var(--text-dim)", fontSize: "14px", letterSpacing: "0.05em" }}>
          まだ記憶が蓄積されていません。
        </div>
      </div>
    );
  }

  return (
    <div className="doc-panel">
      <div className="doc-kicker">MEMORY ARCHIVE — {memories.length} EPISODES</div>
      <div className="doc-title">ミナトの記憶</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {memories.map((mem, i) => {
          const color = TONE_COLORS[mem.emotionalTone];
          return (
            <div key={i} className="memory-card">
              <div className="memory-card-accent" style={{ background: color }} />
              <div className="memory-card-header" style={{ paddingLeft: "12px" }}>
                <span className="memory-age-badge" style={{ color, background: `${color}12` }}>
                  AGE {mem.age}
                </span>
                <span style={{ color: "var(--text)", fontSize: "15px", letterSpacing: "0.05em" }}>
                  {mem.title}
                </span>
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: "13px", lineHeight: 1.9, paddingLeft: "12px", letterSpacing: "0.04em" }}>
                {mem.description}
              </div>
              <div className="memory-keywords" style={{ paddingLeft: "12px" }}>
                {mem.keywords.map((kw, j) => (
                  <span
                    key={j}
                    className="memory-keyword"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}40`,
                      color,
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
