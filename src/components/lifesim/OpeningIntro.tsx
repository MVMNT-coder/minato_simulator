"use client";
// ============================================================
// OpeningIntro — Connect から引き継ぐ導入テキスト(タイプライター)
// 既存の intro-* スタイルを再利用。クリックで送り/スキップ。
// ============================================================
import { useState, useEffect, useMemo } from "react";
import { OPENING_INTRO_LINES } from "@/lib/game/lifeSim/narration";

interface Props {
  onComplete: () => void;
  playerName?: string;
}

export default function OpeningIntro({ onComplete, playerName }: Props) {
  const lines = useMemo(() => {
    const name = (playerName ?? "").trim();
    if (!name) return OPENING_INTRO_LINES;
    // 冒頭2行を名前入りの挨拶に差し替える
    return [`${name} さん、はじめまして。`, "FUTURE VALUE ARCHIVE へようこそ。", ...OPENING_INTRO_LINES.slice(2)];
  }, [playerName]);

  const [visibleCount, setVisibleCount] = useState(0);
  const allVisible = visibleCount >= lines.length;

  useEffect(() => {
    if (visibleCount < lines.length) {
      const delay = lines[visibleCount] === "" ? 240 : 520;
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), delay);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, lines]);

  const handleSkip = () => {
    if (!allVisible) setVisibleCount(lines.length);
    else onComplete();
  };

  return (
    <div className="screen" onClick={handleSkip} style={{ cursor: "pointer" }}>
      <div className="eyebrow">FUTURE VALUE ARCHIVE</div>

      <div className="intro-text-block">
        {lines.slice(0, visibleCount).map((line, i) => {
          if (line === "") return <div key={i} className="intro-spacer" />;
          const isStep = /^[①②③]/.test(line);
          if (isStep) {
            return (
              <div key={i} className="intro-line intro-step">
                <span className="intro-step-num">{line.slice(0, 1)}</span>
                <span className="intro-step-text">{line.slice(1).trim()}</span>
              </div>
            );
          }
          return (
            <div key={i} className="intro-line">
              {line}
            </div>
          );
        })}
      </div>

      {allVisible && (
        <div className="actions" style={{ animationDelay: "0.4s" }}>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
START
            <span className="btn-jp">ムービーを見る</span>
          </button>
        </div>
      )}
    </div>
  );
}
