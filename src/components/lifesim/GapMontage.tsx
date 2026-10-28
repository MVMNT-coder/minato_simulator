"use client";
// ============================================================
// GapMontage — 年代間の経過モンタージュ (例: 20歳→40歳の20年間)
// 経過を象徴する年代ラベル + 生成された台詞を一行ずつ送る。
// ============================================================
import LineReader from "./LineReader";
import type { SceneLine } from "@/lib/game/types";

interface Props {
  fromAge: number;
  toAge: number;
  fromYear: number;
  toYear: number;
  headline?: string;
  lines: SceneLine[];
  onComplete: () => void;
}

export default function GapMontage({
  fromAge,
  toAge,
  fromYear,
  toYear,
  headline,
  lines,
  onComplete,
}: Props) {
  return (
    <div className="ls-gap">
      <div className="ls-gap-era">
        <span className="ls-gap-years">
          {fromAge}歳 <span className="ls-gap-arrow">→</span> {toAge}歳
        </span>
        <span className="ls-gap-dates">
          {fromYear} — {toYear}
        </span>
        {headline && <span className="ls-gap-headline">{headline}</span>}
      </div>
      <LineReader lines={lines} onComplete={onComplete} />
    </div>
  );
}
