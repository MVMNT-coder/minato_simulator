"use client";
// ============================================================
// AI Debug Panel
// ============================================================
import { useState } from "react";
import type { AgeRecord } from "@/lib/game/types";

interface Props {
  logs: string[];
  ageRecords: AgeRecord[];
}

export default function DebugPanel({ logs, ageRecords }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"logs" | "records">("logs");

  return (
    <div style={{
      position: "fixed",
      bottom: "32px",
      right: "16px",
      zIndex: 100,
      fontSize: "11px",
      fontFamily: "monospace",
    }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "rgba(4,7,13,0.9)",
          border: "1px solid rgba(120,200,220,0.3)",
          color: "#6fd7ff",
          padding: "6px 14px",
          cursor: "pointer",
          letterSpacing: "0.2em",
          fontSize: "11px",
        }}
      >
        {open ? "▼ DEBUG" : "▶ DEBUG"}
      </button>
      {open && (
        <div style={{
          position: "absolute",
          bottom: "36px",
          right: 0,
          width: "360px",
          maxHeight: "400px",
          background: "rgba(4,7,13,0.95)",
          border: "1px solid rgba(120,200,220,0.2)",
          overflowY: "auto",
          padding: "12px",
        }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
            {(["logs", "records"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? "rgba(111,215,255,0.15)" : "transparent",
                  border: "1px solid rgba(120,200,220,0.3)",
                  color: "#6fd7ff",
                  padding: "3px 10px",
                  cursor: "pointer",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                }}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          {tab === "logs" && (
            <div>
              {logs.slice(-30).map((log, i) => (
                <div key={i} style={{ color: "#7df0d4", lineHeight: 1.8, borderBottom: "1px solid rgba(120,200,220,0.1)", paddingBottom: "2px" }}>
                  {log}
                </div>
              ))}
              {logs.length === 0 && <div style={{ color: "rgba(143,164,181,0.5)" }}>No logs yet.</div>}
            </div>
          )}
          {tab === "records" && (
            <div>
              {ageRecords.map((rec, i) => (
                <div key={i} style={{ marginBottom: "12px", borderBottom: "1px solid rgba(120,200,220,0.1)", paddingBottom: "8px" }}>
                  <div style={{ color: "#6fd7ff" }}>Age {rec.age}</div>
                  {rec.interpretedValue && (
                    <div style={{ color: "rgba(143,164,181,0.8)", marginLeft: "8px" }}>
                      Theme: {rec.interpretedValue.coreTheme}
                    </div>
                  )}
                  {rec.stateDeltas?.slice(0, 3).map((d, j) => (
                    <div key={j} style={{ color: d.delta >= 0 ? "#7df0d4" : "#ff5a6e", marginLeft: "8px" }}>
                      {d.key}: {d.before}→{d.after} ({d.delta >= 0 ? "+" : ""}{d.delta})
                    </div>
                  ))}
                </div>
              ))}
              {ageRecords.length === 0 && <div style={{ color: "rgba(143,164,181,0.5)" }}>No records yet.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
