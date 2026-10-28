"use client";
// ============================================================
// LifeArchivePanel — 左レイヤー: 人生アーカイブ(記憶オブジェクト)
// 年代が進むごとに増える。プレイヤーの価値観から生まれた記憶。
// ============================================================
import { useLifeSimStore } from "@/store/lifeSimStore";
import type { LifeMemory } from "@/lib/game/lifeSim/types";

const TONE_LABEL: Record<LifeMemory["tone"], string> = {
  positive: "うれしい記憶",
  negative: "つらい記憶",
  ambivalent: "揺れた記憶",
  neutral: "静かな記憶",
};

export default function LifeArchivePanel() {
  const memories = useLifeSimStore((s) => s.persona.memories);
  const album = useLifeSimStore((s) => s.album);
  const age = useLifeSimStore((s) => s.currentAge);

  const ordered = [...memories].reverse(); // 新しい記憶を上に

  return (
    <aside className="foi-panel foi-left">
      <div className="foi-panel-h">
        <span className="foi-panel-h-en">LIFE ARCHIVE</span>
        <span className="foi-panel-h-jp">人生アーカイブ</span>
      </div>

      <div className="foi-metrics-row">
        <div className="foi-metric">
          <span className="foi-metric-n">{memories.length}</span>
          <span className="foi-metric-l">記憶</span>
        </div>
        <div className="foi-metric">
          <span className="foi-metric-n">{album.length}</span>
          <span className="foi-metric-l">記録</span>
        </div>
        <div className="foi-metric">
          <span className="foi-metric-n">{age}</span>
          <span className="foi-metric-l">歳</span>
        </div>
      </div>

      <div className="foi-mem-list foi-scroll">
        {ordered.length === 0 && (
          <div className="foi-empty">まだ思い出はないよ。</div>
        )}
        {ordered.map((m, i) => (
          <div key={`${m.age}-${i}`} className={`foi-mem tone-${m.tone}`}>
            <div className="foi-mem-top">
              <span className="foi-mem-age">{m.age}歳</span>
              <span className="foi-mem-tone">{TONE_LABEL[m.tone]}</span>
            </div>
            <div className="foi-mem-title">{m.title}</div>
            <div className="foi-mem-desc">{m.description}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
