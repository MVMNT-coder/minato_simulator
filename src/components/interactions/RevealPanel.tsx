"use client";
import { useState, useEffect } from "react";
import type { RevealCondition } from "@/lib/game/types";

interface Props {
  title?: string;
  conditions: RevealCondition[];
  sliderValues: Record<string, number>;
  onComplete: () => void;
}

function matchesCondition(
  condition: RevealCondition,
  sliderValues: Record<string, number>
): boolean {
  const values = Object.values(sliderValues);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);

  switch (condition.thresholdType) {
    case "above":
      return avg >= condition.thresholdValue;
    case "below":
      return avg <= condition.thresholdValue;
    case "average":
      return avg > 30 && avg < 70;
    default:
      return false;
  }
}

export default function RevealPanel({
  title,
  conditions,
  sliderValues,
  onComplete,
}: Props) {
  const [revealed, setRevealed] = useState(false);

  const matchedConditions = conditions.filter((c) =>
    matchesCondition(c, sliderValues)
  );

  // If no conditions match, show the "average" one as fallback
  const displayConditions =
    matchedConditions.length > 0
      ? matchedConditions
      : conditions.filter((c) => c.thresholdType === "average");

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="screen">
      {title && <div className="step-title">{title}</div>}

      <div className="reveal-panel">
        {revealed &&
          displayConditions.map((condition, i) => (
            <div
              key={i}
              className="reveal-card"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div className="reveal-card-text">{condition.text}</div>
            </div>
          ))}
      </div>

      {revealed && (
        <div className="actions">
          <button type="button" className="btn" onClick={onComplete}>
            次へ
            <span className="btn-jp">NEXT</span>
          </button>
        </div>
      )}
    </div>
  );
}
