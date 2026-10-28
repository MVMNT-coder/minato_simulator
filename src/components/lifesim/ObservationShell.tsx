"use client";
// ============================================================
// ObservationShell — Future Observation Interface(未来観測端末)
// 4レイヤー: ①中央=人物 ②左=Life Archive ③右=Future Society
//            ④下=Dialogue Layer(children)
// 背景は人格連動のプロシージャル生成。上部にOSのHUD。
// ============================================================
import type { ReactNode } from "react";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { ageYear } from "@/lib/game/lifeSim/narration";
import ProceduralBackground from "./ProceduralBackground";
import MinatoParticles from "./MinatoParticles";
import LifeArchivePanel from "./LifeArchivePanel";
import SocietyDashboard from "./SocietyDashboard";

interface Props {
  children: ReactNode; // 下部 Dialogue Layer の内容
  speaking?: boolean;
  expandedDock?: boolean; // 制度選択など、下部を広く使いたいとき
}

export default function ObservationShell({ children, speaking, expandedDock }: Props) {
  const persona = useLifeSimStore((s) => s.persona);
  const playerName = useLifeSimStore((s) => s.playerName);
  const age = useLifeSimStore((s) => s.currentAge);
  const reset = useLifeSimStore((s) => s.reset);
  const start = useLifeSimStore((s) => s.start);

  const handleRestart = () => {
    if (typeof window !== "undefined" && !window.confirm("最初からやり直しますか?（進行中の記録は消えます）")) return;
    reset();
    start();
  };

  return (
    <div className={`foi${expandedDock ? " foi--dock-lg" : ""}`}>
      <ProceduralBackground profile={persona.valueProfile} />

      {/* ---- 上部 HUD ---- */}
      <header className="foi-hud">
        <div className="foi-hud-l">
          <span className="foi-hud-title">FUTURE OBSERVATION INTERFACE</span>
          <span className="foi-hud-ver">v2.126 / OBSERVING</span>
        </div>
        <div className="foi-hud-c">
          <span className="foi-hud-k">RECORDER</span>
          <span className="foi-hud-v">{playerName || "—"}</span>
        </div>
        <div className="foi-hud-r">
          <span className="foi-hud-k">SUBJECT</span>
          <span className="foi-hud-v">MINATO · {ageYear(age)} · AGE {age}</span>
          <span className="foi-hud-live"><span className="foi-hud-live-dot" />LIVE</span>
          <button className="foi-hud-restart" onClick={handleRestart} title="最初から">↺</button>
        </div>
      </header>

      {/* ---- 左: Life Archive ---- */}
      <LifeArchivePanel />

      {/* ---- 中央: 人物レイヤー ---- */}
      <section className="foi-center">
        <div className="foi-center-frame">
          <div className="foi-corner tl" />
          <div className="foi-corner tr" />
          <div className="foi-corner bl" />
          <div className="foi-corner br" />
          <MinatoParticles emotion={persona.currentEmotion} speaking={speaking} />
        </div>
        <div className="foi-center-cap">
          <span className="foi-center-cap-k">SUBJECT ID · MINATO-2046</span>
          <span className="foi-center-cap-e">
            {persona.currentEmotion ? `STATE: ${persona.currentEmotion}` : "STATE: 観測中"}
          </span>
        </div>
      </section>

      {/* ---- 右: Future Society ---- */}
      <SocietyDashboard />

      {/* ---- 下: Dialogue Layer ---- */}
      <div className="foi-dock">{children}</div>
    </div>
  );
}
