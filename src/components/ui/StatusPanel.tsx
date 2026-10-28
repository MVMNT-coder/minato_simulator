"use client";
// ============================================================
// Status Panel — shows Minato's current numeric state
// ============================================================
import type { MinatoState } from "@/lib/game/types";

const STATE_LABELS: Record<keyof MinatoState, string> = {
  autonomy: "自律性",
  institutionalTrust: "制度への信頼",
  interpersonalTrust: "他者への信頼",
  riskTolerance: "リスク許容度",
  socialAdaptation: "社会適応",
  economicStability: "経済的安定",
  happiness: "幸福感",
  loneliness: "孤独感",
  publicConsciousness: "公共意識",
  playerTrust: "プレイヤーへの信頼",
  familyRelationship: "家族との関係",
  selfEfficacy: "自己効力感",
  futureOutlook: "将来への展望",
};

function StatBar({ value, label }: { value: number; label: string }) {
  const tier = value >= 70 ? "high" : value >= 40 ? "mid" : "low";
  const color =
    value >= 70 ? "#7df0d4" : value >= 40 ? "#6fd7ff" : "#ff5a6e";
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "5px" }}>
        <span style={{ color: "var(--text-dim)" }}>{label}</span>
        <span className="stat-value" style={{ color }}>{value}</span>
      </div>
      <div className="stat-bar-track">
        <div
          className={`stat-bar-fill stat-bar-${tier}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface Props {
  state: MinatoState;
  collapsed?: boolean;
}

export default function StatusPanel({ state, collapsed = false }: Props) {
  if (collapsed) {
    return (
      <div className="hud-panel" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "var(--text-dim)" }}>
        <div className="hud-title">MINATO STATE</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <span>自律: <b style={{ color: "var(--mint)" }}>{state.autonomy}</b></span>
          <span>幸福: <b style={{ color: "var(--mint)" }}>{state.happiness}</b></span>
          <span>安定: <b style={{ color: "var(--mint)" }}>{state.economicStability}</b></span>
        </div>
      </div>
    );
  }

  return (
    <div className="hud-panel" style={{ maxWidth: "320px" }}>
      <div className="hud-title">MINATO STATE PANEL</div>
      {(Object.keys(STATE_LABELS) as (keyof MinatoState)[]).map((key) => (
        <StatBar key={key} value={state[key]} label={STATE_LABELS[key]} />
      ))}
    </div>
  );
}
