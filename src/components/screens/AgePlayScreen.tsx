"use client";
// ============================================================
// AgePlayScreen — Step orchestrator
// Renders the right interaction component based on currentStepIndex
// ============================================================
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useGameNavigation } from "@/lib/game/useGameNavigation";
import { getStepsForAge } from "@/lib/game/age20Data";
import { generateAgeResult, generateMontageLinesForAge } from "@/lib/game/responseEngine";
import type { PlayerResponse, SceneLine } from "@/lib/game/types";

import DialogueWindow from "@/components/ui/DialogueWindow";
import DocumentViewer from "@/components/interactions/DocumentViewer";
import ScenarioPanel from "@/components/interactions/ScenarioPanel";
import FreeTextInput from "@/components/interactions/FreeTextInput";
import ResultDisplay from "@/components/interactions/ResultDisplay";
import TimelineSaveAnim from "@/components/interactions/TimelineSaveAnim";

export default function AgePlayScreen() {
  const currentAge = useGameStore((s) => s.currentAge);
  const stepIndex = useGameStore((s) => s.currentStepIndex);
  const playerResponses = useGameStore((s) => s.playerResponses);
  const timeline = useGameStore((s) => s.timeline);
  const advanceStep = useGameStore((s) => s.advanceStep);
  const recordResponse = useGameStore((s) => s.recordResponse);
  const addTimelineEntry = useGameStore((s) => s.addTimelineEntry);
  const advanceAge = useGameStore((s) => s.advanceAge);
  const setDialogueLines = useGameStore((s) => s.setDialogueLines);
  const advanceDialogueLine = useGameStore((s) => s.advanceDialogueLine);
  const dialogue = useGameStore((s) => s.dialogue);
  const { navigateToPhase } = useGameNavigation();

  const [exiting, setExiting] = useState(false);

  const steps = useMemo(() => getStepsForAge(currentAge), [currentAge]);
  const step = steps[stepIndex];
  const ageResponses = useMemo(
    () => playerResponses.filter((r) => r.age === currentAge),
    [playerResponses, currentAge]
  );

  const handleStepComplete = useCallback(
    (response?: PlayerResponse) => {
      if (exiting) return;
      setExiting(true);

      setTimeout(() => {
        if (response) recordResponse(response);
        if (stepIndex + 1 >= steps.length) {
          const nextPhase = advanceAge();
          if (nextPhase !== "agePlay") {
            navigateToPhase(nextPhase);
          }
        } else {
          advanceStep();
        }
        setExiting(false);
      }, 350);
    },
    [exiting, stepIndex, steps.length, recordResponse, advanceStep, advanceAge, navigateToPhase]
  );

  // Initialize dialogue lines when a narrative step mounts
  useEffect(() => {
    if (step?.type === "narrative" && step.lines) {
      setDialogueLines(step.lines);
    }
  }, [stepIndex, step, setDialogueLines]);

  if (!step) {
    return (
      <div className="screen">
        <div className="lead">ステップデータがありません</div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (step.type) {
      case "narrative": {
        const lines = step.lines ?? [];
        return (
          <div className="screen dlg-screen">
            <DialogueWindow
              lines={lines}
              currentIndex={dialogue.currentLineIndex}
              onAdvance={() => advanceDialogueLine()}
              onComplete={() => handleStepComplete()}
            />
          </div>
        );
      }

      case "document":
        return (
          <DocumentViewer
            title={step.title ?? ""}
            sections={step.documentSections ?? []}
            onComplete={() => handleStepComplete()}
          />
        );

      case "scenario":
        return (
          <ScenarioPanel
            scenarios={step.scenarios ?? []}
            onComplete={(answers) =>
              handleStepComplete({
                stepId: step.id,
                age: currentAge,
                type: step.type,
                data: { answers },
                timestamp: Date.now(),
              })
            }
          />
        );

      case "freeText":
        return (
          <>
            {step.title && <div className="step-title">{step.title}</div>}
            <FreeTextInput
              prompt={step.freeTextPrompt ?? ""}
              placeholder={step.freeTextPlaceholder}
              onComplete={(text) =>
                handleStepComplete({
                  stepId: step.id,
                  age: currentAge,
                  type: step.type,
                  data: { text },
                  timestamp: Date.now(),
                })
              }
            />
          </>
        );

      case "result": {
        const result = generateAgeResult(currentAge, ageResponses);
        return (
          <ResultDisplay
            headline={result.headline}
            interpretation={result.interpretation}
            memory={result.memory}
            onComplete={() => {
              handleStepComplete({
                stepId: step.id,
                age: currentAge,
                type: step.type,
                data: { ...result },
                timestamp: Date.now(),
              });
            }}
          />
        );
      }

      case "timelineSave": {
        const resultResponse = ageResponses.find((r) => r.stepId === `age${currentAge}_result`);
        const entry = {
          age: currentAge,
          memory: (resultResponse?.data as { memory?: string })?.memory ?? "記憶が保存されました。",
          headline: (resultResponse?.data as { headline?: string })?.headline ?? "",
          interpretation: (resultResponse?.data as { interpretation?: string })?.interpretation ?? "",
        };
        return (
          <TimelineSaveAnim
            entry={entry}
            allEntries={timeline}
            onComplete={() => {
              addTimelineEntry(entry);
              handleStepComplete();
            }}
          />
        );
      }

      case "montage": {
        const montageLines = generateMontageLinesForAge(currentAge, ageResponses);
        return (
          <MontageView
            fromAge={step.montageFromAge ?? 20}
            toAge={step.montageToAge ?? 30}
            lines={montageLines}
            onComplete={() => handleStepComplete()}
          />
        );
      }

      default:
        return (
          <div className="screen">
            <div className="lead">不明なステップタイプ: {step.type}</div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className={`step-content ${exiting ? "step-exit" : "step-enter"}`}
        key={stepIndex}
      >
        {renderStepContent()}
      </div>
      {exiting && (
        <div className="glitch-overlay" aria-hidden="true">
          <div className="scan-line" />
        </div>
      )}
    </>
  );
}

// Inline montage view (uses DialogueWindow)
function MontageView({
  fromAge,
  toAge,
  lines,
  onComplete,
}: {
  fromAge: number;
  toAge: number;
  lines: SceneLine[];
  onComplete: () => void;
}) {
  const dialogue = useGameStore((s) => s.dialogue);
  const setDialogueLines = useGameStore((s) => s.setDialogueLines);
  const advanceDialogueLine = useGameStore((s) => s.advanceDialogueLine);

  // Initialize dialogue lines when montage mounts
  useEffect(() => {
    setDialogueLines(lines);
  }, [lines, setDialogueLines]);

  return (
    <div className="screen montage-screen">
      <div className="montage-phase-label">
        {fromAge}歳 → {toAge}歳
      </div>
      <div className="montage-counter">
        <small>AGE</small>
        {fromAge}–{toAge}
      </div>
      <div className="montage-dialogue">
        <DialogueWindow
          lines={lines}
          currentIndex={dialogue.currentLineIndex}
          onAdvance={() => advanceDialogueLine()}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}
