"use client";
// ============================================================
// ReadingPanel — 段階表示用の汎用パネル (§11)
// world_reveal / daily_scene / life_consequence / future_news /
// album_update / age_transition で使い回す。
// ============================================================
import type { ReactNode } from "react";

interface Props {
  kicker?: string;
  title?: string;
  paragraphs?: string[];
  variant?: "system" | "narrator" | "consequence" | "news" | "album" | "transition";
  extra?: ReactNode;
  onNext: () => void;
  nextLabel?: string;
  nextJp?: string;
  boot?: boolean; // 世界観解説スタート時の起動アニメーション
}

export default function ReadingPanel({
  kicker,
  title,
  paragraphs = [],
  variant = "narrator",
  extra,
  onNext,
  nextLabel = "次へ",
  nextJp = "NEXT",
  boot = false,
}: Props) {
  return (
    <div className="screen scrollable">
      <div className={`ls-panel ls-panel-${variant}${boot ? " ls-boot" : ""}`}>
        {kicker && <div className="ls-panel-kicker">{kicker}</div>}
        {title && <div className="ls-panel-title">{title}</div>}
        {paragraphs.map((p, i) => (
          <p key={i} className="ls-panel-body">
            {p}
          </p>
        ))}
        {extra}
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={onNext}>
          {nextLabel}
          <span className="btn-jp">{nextJp}</span>
        </button>
      </div>
    </div>
  );
}
