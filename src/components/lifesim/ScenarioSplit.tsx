"use client";
// ============================================================
// ScenarioSplit — シナリオ提示/回答用の2カラム
// 左: アバター(パーティクル) / 右: シナリオ本文・回答UI
// ============================================================
import type { ReactNode } from "react";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { ageYear } from "@/lib/game/lifeSim/narration";
import ProceduralBackground from "./ProceduralBackground";
import MinatoParticles from "./MinatoParticles";

interface Props {
  children: ReactNode; // 右カラムの内容
  speaking?: boolean;
  formProgress?: number; // 回答進捗(0..1)でアバターの形成度を駆動
}

export default function ScenarioSplit({ children, speaking, formProgress }: Props) {
  const persona = useLifeSimStore((s) => s.persona);
  const age = useLifeSimStore((s) => s.currentAge);

  return (
    <div className="foi-split">
      <ProceduralBackground profile={persona.valueProfile} />

      {/* 左: 人物 */}
      <div className="foi-split-avatar">
        <div className="foi-split-avatar-inner">
          <MinatoParticles emotion={persona.currentEmotion} speaking={speaking} formProgress={formProgress} />
        </div>
        <div className="foi-split-cap">
          <span className="foi-split-cap-k">SUBJECT · MINATO</span>
          <span className="foi-split-cap-e">{ageYear(age)} · AGE {age}</span>
        </div>
      </div>

      {/* 右: シナリオ・回答 */}
      <div className="foi-split-content">{children}</div>
    </div>
  );
}
