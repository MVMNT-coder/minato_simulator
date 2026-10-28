"use client";
import { useState, useEffect } from "react";
import type { TimelineEntry } from "@/lib/game/types";

interface Props {
  entry: TimelineEntry;
  allEntries: TimelineEntry[];
  onComplete: () => void;
}

export default function TimelineSaveAnim({
  entry,
  allEntries,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<"saving" | "saved" | "timeline">("saving");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("saved"), 1500));
    timers.push(setTimeout(() => setPhase("timeline"), 3000));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="screen">
      <div className="timeline-save-anim">
        {phase === "saving" && (
          <>
            <div className="timeline-save-label">SAVING TO TIMELINE...</div>
            <div className="timeline-save-text">{entry.memory}</div>
          </>
        )}

        {phase === "saved" && (
          <>
            <div className="timeline-save-label">SAVED</div>
            <div className="timeline-save-text">{entry.memory}</div>
          </>
        )}

        {phase === "timeline" && (
          <>
            <div className="step-title">LIFE TIMELINE</div>
            <div className="timeline-container">
              <div className="timeline-line" />
              {allEntries.map((e, i) => (
                <div
                  key={i}
                  className="timeline-entry"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <div className="timeline-age">AGE {e.age}</div>
                  <div className="timeline-memory">{e.memory}</div>
                </div>
              ))}
              <div
                className="timeline-entry"
                style={{
                  animationDelay: `${allEntries.length * 0.15}s`,
                }}
              >
                <div className="timeline-age">AGE {entry.age}</div>
                <div className="timeline-memory">{entry.memory}</div>
              </div>
            </div>

            <div className="actions">
              <button type="button" className="btn" onClick={onComplete}>
                次へ
                <span className="btn-jp">NEXT</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
