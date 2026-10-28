"use client";
// ============================================================
// ProgressTree — ビヘイビアーツリー型プログレス表示
// 左端の縦レール + 展開パネルで進行状況を可視化
// ============================================================
import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { getStepsForAge } from "@/lib/game/age20Data";
import { AGE_SEQUENCE } from "@/lib/game/types";
import type { Age, StepType, TimelineEntry } from "@/lib/game/types";

// ------ ヘルパー関数 ------

type NodeStatus = "completed" | "current" | "future";

function getAgeStatus(
  age: Age,
  currentAge: Age,
  timeline: TimelineEntry[]
): NodeStatus {
  const ageIdx = AGE_SEQUENCE.indexOf(age);
  const currentIdx = AGE_SEQUENCE.indexOf(currentAge);
  if (ageIdx < currentIdx || timeline.some((t) => t.age === age)) return "completed";
  if (age === currentAge) return "current";
  return "future";
}

function getStepTypeShape(type: StepType): string {
  switch (type) {
    case "narrative":
      return "pt-shape-circle";
    case "document":
      return "pt-shape-square";
    case "scenario":
      return "pt-shape-diamond";
    case "freeText":
      return "pt-shape-plus";
    case "result":
      return "pt-shape-star";
    case "timelineSave":
      return "pt-shape-triangle";
    case "montage":
      return "pt-shape-ring";
    default:
      return "pt-shape-circle";
  }
}

function getStepTypeLabel(type: StepType): string {
  switch (type) {
    case "narrative":
      return "語り";
    case "document":
      return "資料";
    case "scenario":
      return "選択";
    case "freeText":
      return "入力";
    case "result":
      return "結果";
    case "timelineSave":
      return "保存";
    case "montage":
      return "経過";
    default:
      return "";
  }
}

// ------ コンポーネント ------

export default function ProgressTree() {
  const currentAge = useGameStore((s) => s.currentAge);
  const currentStepIndex = useGameStore((s) => s.currentStepIndex);
  const phase = useGameStore((s) => s.phase);
  const timeline = useGameStore((s) => s.timeline);

  const [expanded, setExpanded] = useState(false);

  const steps = useMemo(() => getStepsForAge(currentAge), [currentAge]);

  // Only visible during agePlay
  const isHidden = phase !== "agePlay";

  return (
    <aside
      className="progress-tree"
      data-expanded={expanded}
      data-hidden={isHidden}
    >
      {/* Collapsed rail — always rendered */}
      <div
        className="pt-rail"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        aria-label={expanded ? "ツリーを閉じる" : "ツリーを開く"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
      >
        {AGE_SEQUENCE.map((age) => {
          const status = getAgeStatus(age, currentAge, timeline);
          return (
            <div
              key={age}
              className="pt-age-node"
              data-status={status}
              aria-label={`${age}歳`}
              aria-current={status === "current" ? "step" : undefined}
            >
              <span className="pt-age-number">{age}</span>
            </div>
          );
        })}
      </div>

      {/* Expanded panel */}
      <div className="pt-panel" role="navigation" aria-label="進行状況">
        <div className="pt-panel-header">
          <span className="pt-panel-age">AGE {currentAge}</span>
          <span className="pt-panel-counter">
            {currentStepIndex + 1}/{steps.length}
          </span>
        </div>

        <div className="pt-steps">
          {steps.map((step, i) => {
            const status: NodeStatus =
              i < currentStepIndex
                ? "completed"
                : i === currentStepIndex
                  ? "current"
                  : "future";
            return (
              <div key={step.id} className="pt-step" data-status={status}>
                <div className={`pt-icon ${getStepTypeShape(step.type)}`} data-status={status} />
                <div className="pt-step-info">
                  <span className="pt-step-label">
                    {step.title ?? getStepTypeLabel(step.type)}
                  </span>
                  {status === "current" && (
                    <span className="pt-step-indicator">NOW</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Age overview at bottom */}
        <div className="pt-ages-overview">
          {AGE_SEQUENCE.map((age) => {
            const status = getAgeStatus(age, currentAge, timeline);
            return (
              <div key={age} className="pt-age-overview-item" data-status={status}>
                <div className="pt-age-overview-dot" data-status={status} />
                <span className="pt-age-overview-label">{age}歳</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
