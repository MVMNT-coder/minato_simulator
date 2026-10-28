"use client";
import { useGameNavigation } from "@/lib/game/useGameNavigation";
import { useState, useEffect } from "react";

const INTRO_LINES = [
  "はじめまして。",
  "FUTURE SIMULATORへようこそ。",
  "",
  "当サービスでは、依頼主、ミナトの",
  "「未来の人生」をシミュレーションすることができます。",
  "",
  "シミュレーションは、ライフステージごとに",
  "4つの段階で進行します。",
  "あなたは、それぞれのステージに対して、",
  "あなた自身の見解を示すことが可能です。",
  "",
  "重要なのは、最終的なシミュレーション結果だけではありません。",
  "その道中であなたが抱いた「気づき」や「違和感」──",
  "それ自体が、未来の依頼主にとって、",
  "今までにない有益な視点となることでしょう。",
  "",
  "それでは、シミュレーションを開始します──。",
];

export default function IntroScreen() {
  const { navigateToPhase } = useGameNavigation();
  const [visibleCount, setVisibleCount] = useState(0);
  const allVisible = visibleCount >= INTRO_LINES.length;

  useEffect(() => {
    if (visibleCount < INTRO_LINES.length) {
      const delay = INTRO_LINES[visibleCount] === "" ? 300 : 600;
      const timer = setTimeout(() => {
        setVisibleCount((c) => c + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const handleContinue = () => {
    navigateToPhase("opening");
  };

  const handleSkip = () => {
    if (!allVisible) {
      setVisibleCount(INTRO_LINES.length);
    } else {
      handleContinue();
    }
  };

  return (
    <div className="screen" onClick={handleSkip} style={{ cursor: "pointer" }}>
      <div className="eyebrow">FUTURE SIMULATOR</div>

      <div className="intro-text-block">
        {INTRO_LINES.slice(0, visibleCount).map((line, i) =>
          line === "" ? (
            <div key={i} className="intro-spacer" />
          ) : (
            <div
              key={i}
              className="intro-line"
              style={{ animationDelay: `${0}s` }}
            >
              {line}
            </div>
          ),
        )}
      </div>

      {allVisible && (
        <div className="actions" style={{ animationDelay: "0.5s" }}>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              handleContinue();
            }}
          >
            START
            <span className="btn-jp">シミュレーションを開始</span>
          </button>
        </div>
      )}
    </div>
  );
}
