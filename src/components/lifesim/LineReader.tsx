"use client";
// ============================================================
// LineReader — 自己完結型のノベル台詞リーダー (§11)
// DialogueWindow を包み、行インデックスを内部で管理する。
// ============================================================
import { useState, useCallback } from "react";
import DialogueWindow from "@/components/ui/DialogueWindow";
import type { SceneLine } from "@/lib/game/types";

interface Props {
  lines: SceneLine[];
  onComplete: () => void;
  boot?: boolean; // 起動アニメーション
}

export default function LineReader({ lines, onComplete, boot = false }: Props) {
  const [index, setIndex] = useState(0);
  const advance = useCallback(() => {
    setIndex((i) => Math.min(i + 1, lines.length));
  }, [lines.length]);

  return (
    <div className={`screen dlg-screen${boot ? " ls-boot" : ""}`}>
      <DialogueWindow
        lines={lines}
        currentIndex={index}
        onAdvance={advance}
        onComplete={onComplete}
      />
    </div>
  );
}
