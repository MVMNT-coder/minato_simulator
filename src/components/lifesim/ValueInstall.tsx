"use client";
// ============================================================
// ValueInstall — 価値観をミナトに“インストール”する全画面演出
// パーティクルのミナトが集束・脈動しながら、価値観が統合されていく様子。
// 完了(phaseがminato_responseへ)で親側がアバター表示へ戻す。
// ============================================================
import MinatoParticles from "./MinatoParticles";
import StatusLoader from "./StatusLoader";

interface Props {
  emotion?: string;
}

export default function ValueInstall({ emotion }: Props) {
  return (
    <div className="ls-install">
      {/* 集束・脈動するミナト(粒子) */}
      <div className="ls-install-figure">
        <MinatoParticles emotion={emotion} speaking />
      </div>

      {/* 走査リング */}
      <div className="ls-install-scan" />
      <div className="ls-install-scan ls-install-scan2" />

      {/* インストール表示 */}
      <div className="ls-install-overlay">
        <div className="ls-install-title">
          INSTALLING VALUES <span className="ls-install-arrow">▶</span> MINATO
          <span className="ls-install-sub">価値観をミナトに統合しています…</span>
        </div>
        <div className="ls-install-bar">
          <span />
        </div>
        <StatusLoader compact />
      </div>
    </div>
  );
}
