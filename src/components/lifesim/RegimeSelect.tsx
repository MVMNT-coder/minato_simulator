"use client";
// ============================================================
// RegimeSelect — 未来制度の選択 (§3 step2-3)
// 制度は硬質・制度的に提示。プレイヤーは1つを選ぶ。
// ============================================================
import { useState } from "react";
import type { Regime } from "@/lib/game/lifeSim/types";

interface Props {
  age: number;
  year: number;
  regimes: Regime[];
  onSelect: (regimeId: string) => void;
}

export default function RegimeSelect({ age, year, regimes, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = regimes.find((r) => r.id === selected);

  return (
    <div className="screen scrollable">
      <div className="eyebrow">{year} / AGE {age} — POLICY SELECTION</div>
      <div className="ls-section-title">ミナトが暮らす未来社会における新制度を選択</div>
      <div className="ls-section-note">
        未来の社会制度と生活者への影響を、現代人の視点から考える
      </div>

      <div className="ls-regime-grid">
        {regimes.map((r, i) => (
          <div
            key={r.id}
            className={`ls-regime-card${selected === r.id ? " selected" : ""}`}
            onClick={() => setSelected(r.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.code === "Enter" || e.code === "Space") {
                e.preventDefault();
                setSelected(r.id);
              }
            }}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="ls-regime-code">POLICY {String(i + 1).padStart(2, "0")}</div>
            <div className="ls-regime-name">{r.name}</div>
            <div className="ls-regime-tagline">{r.tagline}</div>
            <div className="ls-regime-desc">{r.description}</div>
            <div className="ls-regime-facets">
              <div className="ls-regime-facet ls-facet-up">
                <span className="ls-facet-label">いいところ</span>
                {r.upside}
              </div>
              <div className="ls-regime-facet ls-facet-down">
                <span className="ls-facet-label">むずかしくなること</span>
                {r.seededTension}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!chosen}
          onClick={() => chosen && onSelect(chosen.id)}
        >
          この制度を導入する
          <span className="btn-jp">{chosen ? chosen.name : "SELECT A POLICY"}</span>
        </button>
      </div>
    </div>
  );
}
