"use client";
// ============================================================
// Novel-game style dialogue window
// One line at a time, click to advance
// ============================================================
import { useEffect, useState, useCallback } from "react";
import type { SceneLine } from "@/lib/game/types";

interface Props {
  lines: SceneLine[];
  currentIndex: number;
  onAdvance: () => void;
  onComplete?: () => void;
}

export default function DialogueWindow({ lines, currentIndex, onAdvance, onComplete }: Props) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const currentLine = lines[currentIndex];
  const fullText = currentLine?.text ?? "";
  const isComplete = currentIndex >= lines.length;

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return;
    setDisplayText("");
    setCharIndex(0);
    setIsTyping(true);
  }, [currentIndex, currentLine]);

  useEffect(() => {
    if (!isTyping) return;
    if (charIndex >= fullText.length) {
      setIsTyping(false);
      return;
    }
    const timer = setTimeout(() => {
      setDisplayText(fullText.slice(0, charIndex + 1));
      setCharIndex((i) => i + 1);
    }, 28);
    return () => clearTimeout(timer);
  }, [isTyping, charIndex, fullText]);

  const handleClick = useCallback(() => {
    if (isTyping) {
      // Skip to full text
      setDisplayText(fullText);
      setCharIndex(fullText.length);
      setIsTyping(false);
      return;
    }
    if (isComplete) {
      onComplete?.();
      return;
    }
    onAdvance();
  }, [isTyping, isComplete, fullText, onAdvance, onComplete]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "ArrowRight") {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClick]);

  if (!currentLine && !isComplete) return null;

  return (
    <div
      className="dlg-window"
      data-speaker={currentLine?.speaker ?? ""}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.code === "Space" || e.code === "Enter") handleClick(); }}
    >
      {currentLine && currentLine.speaker === "SYSTEM" && (
        <div className="dlg-speaker dlg-speaker-system">
          <span className="dlg-speaker-icon">&#x25C8;</span>
          SYSTEM
        </div>
      )}
      {currentLine && currentLine.speaker !== "NARRATOR" && currentLine.speaker !== "SYSTEM" && (
        <div className="dlg-speaker dlg-speaker-character" data-speaker={currentLine.speaker}>
          <span className="dlg-speaker-dot" />
          {currentLine.speaker}
        </div>
      )}
      <div className="dlg-text" style={{ whiteSpace: "pre-wrap" }}>
        {isComplete ? (
          <span style={{ color: "var(--text-dim)", fontStyle: "italic" }}>
            — 次へ進みます —
          </span>
        ) : (
          <>
            {displayText}
            {isTyping && <span className="dlg-cursor" />}
          </>
        )}
      </div>
      <div className="dlg-progress">
        {isComplete ? "" : `${currentIndex + 1} / ${lines.length}`}
      </div>
      {(!isTyping || isComplete) && (
        <div className="dlg-adv" style={{ visibility: "visible" }}>
          <span className="lbl">クリック / スペース</span>▼
        </div>
      )}
    </div>
  );
}
