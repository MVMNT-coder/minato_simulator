"use client";
import { useGameStore } from "@/store/gameStore";
import { useGameNavigation } from "@/lib/game/useGameNavigation";
import { useState } from "react";
import type { LifeObservationReport } from "@/lib/game/types";
import MemoryArchive from "@/components/ui/MemoryArchive";
import StatusPanel from "@/components/ui/StatusPanel";

export default function LifeObservationReportScreen() {
  const minatoState = useGameStore((s) => s.minatoState);
  const report = useGameStore((s) => s.report);
  const episodeMemories = useGameStore((s) => s.episodeMemories);
  const timeline = useGameStore((s) => s.timeline);
  const reset = useGameStore((s) => s.reset);
  const { navigateToPhase } = useGameNavigation();

  const [tab, setTab] = useState<"report" | "timeline" | "memories" | "state">("report");

  // For now, show a placeholder if no report is generated
  if (!report) {
    return (
      <div className="screen">
        <div className="eyebrow">LIFE OBSERVATION REPORT</div>
        <h1 className="h-mid" style={{ marginBottom: "3vh" }}>
          ミナトの人生の記録
        </h1>

        {/* Show timeline */}
        {timeline.length > 0 && (
          <div className="timeline-container" style={{ marginBottom: "4vh" }}>
            <div className="timeline-line" />
            {timeline.map((entry, i) => (
              <div key={i} className="timeline-entry" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="timeline-age">AGE {entry.age}</div>
                <div className="timeline-memory">{entry.memory}</div>
              </div>
            ))}
          </div>
        )}

        <div className="actions">
          <button className="btn btn-sub" onClick={() => { reset(); navigateToPhase("standby"); }}>
            RESTART
            <span className="btn-jp">最初から始める</span>
          </button>
        </div>
      </div>
    );
  }

  const REPORT_SECTIONS: { key: keyof LifeObservationReport; label: string }[] = [
    { key: "preserved", label: "ミナトが守ったもの" },
    { key: "lost", label: "ミナトが失ったもの" },
    { key: "inheritedFromPlayer", label: "プレイヤーから受け継いだもの" },
    { key: "rejectedOrReinterpreted", label: "拒否または再解釈したもの" },
    { key: "socialGains", label: "社会的に得たもの" },
    { key: "relationalLosses", label: "関係性のなかで失ったもの" },
    { key: "longestWord", label: "最も長く残った言葉" },
    { key: "sideEffectOfGoodIntent", label: "善意が生んだ副作用" },
    { key: "minatosCurrentView", label: "ミナト本人の現在の考え" },
    { key: "questionToPlayer", label: "プレイヤーへ返される問い" },
  ];

  return (
    <div className="screen scrollable">
      <div className="eyebrow">LIFE OBSERVATION REPORT</div>
      <h1 className="h-large" style={{ letterSpacing: "0.25em", fontSize: "clamp(28px,4vw,48px)" }}>
        MINATO — AGE 100
      </h1>
      <p className="lead" style={{ marginTop: "2vh" }}>
        2126年。ミナトの人生の記録。
      </p>

      <div className="report-tabs">
        {(["report", "timeline", "memories", "state"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`report-tab ${tab === t ? "active" : ""}`}
          >
            {t === "report" ? "LIFE RECORD" : t === "timeline" ? "TIMELINE" : t === "memories" ? "MEMORIES" : "STATE"}
          </button>
        ))}
      </div>

      {tab === "report" && (
        <div style={{ maxWidth: "760px", width: "100%", marginTop: "3vh" }}>
          {REPORT_SECTIONS.map(({ key, label }, i) => (
            <div
              key={key}
              className={`report-section ${key === "questionToPlayer" ? "highlight" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className="report-section-label"
                style={{ color: key === "questionToPlayer" ? "var(--accent)" : "var(--text-dim)" }}
              >
                {label.toUpperCase()}
              </div>
              <div className="report-section-text">
                {report[key]}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "timeline" && (
        <div style={{ marginTop: "3vh", width: "100%", maxWidth: "760px" }}>
          {timeline.length > 0 ? (
            <div className="timeline-container">
              <div className="timeline-line" />
              {timeline.map((entry, i) => (
                <div key={i} className="timeline-entry" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="timeline-age">AGE {entry.age}</div>
                  <div className="timeline-memory">{entry.memory}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lead">タイムラインは空です。</div>
          )}
        </div>
      )}

      {tab === "memories" && (
        <div style={{ marginTop: "3vh", width: "100%", maxWidth: "760px" }}>
          <MemoryArchive memories={episodeMemories} />
        </div>
      )}

      {tab === "state" && (
        <div style={{ marginTop: "3vh" }}>
          <StatusPanel state={minatoState} />
        </div>
      )}

      <div className="actions" style={{ marginTop: "4vh" }}>
        <button className="btn btn-sub" onClick={() => { reset(); navigateToPhase("standby"); }}>
          RESTART
          <span className="btn-jp">最初から始める</span>
        </button>
      </div>
    </div>
  );
}
