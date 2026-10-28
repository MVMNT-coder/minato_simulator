"use client";
// ============================================================
// SocietyDashboard — 右レイヤー: 未来社会ダッシュボード
// 制度概要 / 未来ニュース / 社会指標(公共データ)。
// プレイヤーの選択(蓄積価値観)で指標・ニュースが少し変化する。
// ※ここに表示するのはプレイヤー個人の診断値ではなく、社会側の公共統計。
// ============================================================
import { useMemo } from "react";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { findRegime } from "@/lib/game/lifeSim/regimes";
import { ageYear } from "@/lib/game/lifeSim/narration";
import type { ValueProfile } from "@/lib/game/lifeSim/types";

// 蓄積された価値観 → 社会側の傾向(ぱっと見で分かる平易な言葉に)
function societyMetrics(p: ValueProfile) {
  return [
    { label: "自分で決めたい人", v: p.autonomy },
    { label: "じっくり考えたい人", v: Math.round((p.autonomy + p.toleranceForAmbiguity) / 2) },
    { label: "助け合いを大切にする人", v: p.community },
    { label: "制度にまかせたい人", v: p.trustInSystems },
    { label: "効率を重視する人", v: p.efficiency },
    { label: "ふれあいを選ぶ人", v: p.embodiment },
  ];
}

export default function SocietyDashboard() {
  const age = useLifeSimStore((s) => s.currentAge);
  const selectedRegimeIds = useLifeSimStore((s) => s.selectedRegimeIds);
  const profile = useLifeSimStore((s) => s.persona.valueProfile);

  const regime = useMemo(() => {
    const id = selectedRegimeIds[age];
    return id ? findRegime(age, id) : undefined;
  }, [age, selectedRegimeIds]);

  const metrics = societyMetrics(profile);

  return (
    <aside className="foi-panel foi-right">
      <div className="foi-panel-h">
        <span className="foi-panel-h-en">FUTURE SOCIETY</span>
        <span className="foi-panel-h-jp">未来社会 {ageYear(age)}</span>
      </div>

      <div className="foi-scroll foi-right-scroll">
        {/* 制度概要 */}
        <div className="foi-sub">いまの制度</div>
        {regime ? (
          <div className="foi-regime-box">
            <div className="foi-regime-name">{regime.name}</div>
            <div className="foi-regime-tag">{regime.tagline}</div>
            <div className="foi-regime-facet"><span>いいところ</span>{regime.upside}</div>
            <div className="foi-regime-facet is-down"><span>むずかしいところ</span>{regime.seededTension}</div>
          </div>
        ) : (
          <div className="foi-empty">まだ制度を選んでいません。</div>
        )}

        {/* 社会指標 */}
        <div className="foi-sub">みんなの傾向（この時代）</div>
        <div className="foi-bars">
          {metrics.map((m) => (
            <div key={m.label} className="foi-bar-row">
              <span className="foi-bar-label">{m.label}</span>
              <span className="foi-bar-track">
                <span className="foi-bar-fill" style={{ width: `${m.v}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
