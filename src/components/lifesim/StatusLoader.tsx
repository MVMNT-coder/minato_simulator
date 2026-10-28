"use client";
// ============================================================
// StatusLoader — 未来OSらしい処理演出(スピナーは使わない)
// 「Synchronizing Personality...」等のステータスを順に点灯させる。
// ============================================================
import { useEffect, useState } from "react";

const STEPS = [
  "Synchronizing Personality",
  "Updating Memories",
  "Simulating Life",
  "Predicting Future",
  "Reconstructing Timeline",
];

export default function StatusLoader({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % (STEPS.length + 1));
    }, 460);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`foi-status ${compact ? "is-compact" : ""}`}>
      <div className="foi-status-title">
        <span className="foi-status-dot" />
        FUTURE OBSERVATION SYSTEM — PROCESSING
      </div>
      <ul className="foi-status-list">
        {STEPS.map((s, i) => {
          const state = i < active ? "done" : i === active ? "active" : "pending";
          return (
            <li key={s} className={`foi-status-line is-${state}`}>
              <span className="foi-status-mark">
                {state === "done" ? "✓" : state === "active" ? "▶" : "·"}
              </span>
              <span className="foi-status-label">{s}</span>
              {state === "active" && <span className="foi-status-caret" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
