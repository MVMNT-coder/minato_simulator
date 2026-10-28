"use client";
// ============================================================
// ScenarioPanel — 心理テスト/思考実験形式のインタラクション
// setup対話 → 問い → 入力 → リアクション → (フォローアップ or 次シナリオ)
// ============================================================
import { useState, useCallback } from "react";
import type { ScenarioDef, ScenarioAnswer } from "@/lib/game/types";
import DialogueWindow from "@/components/ui/DialogueWindow";

interface Props {
  scenarios: ScenarioDef[];
  onComplete: (answers: ScenarioAnswer[]) => void;
}

export default function ScenarioPanel({ scenarios, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ScenarioAnswer[]>([]);
  const [phase, setPhase] = useState<"setup" | "question" | "reaction">("setup");
  const [dialogueLineIndex, setDialogueLineIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [freeText, setFreeText] = useState("");
  const [reactionText, setReactionText] = useState("");
  const [depth, setDepth] = useState(0);
  const [activeScenario, setActiveScenario] = useState<ScenarioDef>(scenarios[0]);

  const handleDialogueAdvance = useCallback(() => {
    setDialogueLineIndex((i) => i + 1);
  }, []);

  const handleDialogueComplete = useCallback(() => {
    setPhase("question");
  }, []);

  const advanceToNext = useCallback(
    (newAnswers: ScenarioAnswer[]) => {
      if (currentIndex + 1 >= scenarios.length) {
        onComplete(newAnswers);
      } else {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setActiveScenario(scenarios[nextIdx]);
        setDepth(0);
        setPhase("setup");
        setDialogueLineIndex(0);
        setSelected(null);
        setFreeText("");
        setReactionText("");
      }
    },
    [currentIndex, scenarios, onComplete]
  );

  const advanceAfterReaction = useCallback(() => {
    // Check if the chosen choice has a follow-up
    let followUp: ScenarioDef | undefined;
    if (activeScenario.mode === "freeText") {
      followUp = activeScenario.followUp;
    } else if (selected) {
      followUp = activeScenario.choices?.find((c) => c.id === selected)?.followUp;
    }

    if (followUp && depth < 2) {
      // Enter follow-up scenario
      setActiveScenario(followUp);
      setDepth((d) => d + 1);
      setPhase("setup");
      setDialogueLineIndex(0);
      setSelected(null);
      setFreeText("");
      setReactionText("");
    } else {
      // Advance to next main scenario
      advanceToNext(answers);
    }
  }, [activeScenario, selected, depth, answers, advanceToNext]);

  const handleConfirm = useCallback(() => {
    const answer: ScenarioAnswer = {
      scenarioIndex: currentIndex,
      mode: activeScenario.mode,
      depth,
    };
    if (activeScenario.mode === "freeText") {
      answer.text = freeText.trim();
    } else {
      answer.choiceId = selected ?? undefined;
    }

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Get reaction text
    let reaction: string | undefined;
    if (activeScenario.mode === "freeText") {
      reaction = activeScenario.minatoReaction;
    } else if (selected) {
      reaction = activeScenario.choices?.find((c) => c.id === selected)?.minatoReaction;
    }

    if (reaction) {
      setReactionText(reaction);
      setPhase("reaction");
    } else {
      advanceAfterReaction();
    }
  }, [currentIndex, activeScenario, selected, freeText, answers, depth, advanceAfterReaction]);

  if (!activeScenario) return null;

  // Setup phase: show dialogue
  if (phase === "setup") {
    // If no setup lines, skip directly to question
    if (!activeScenario.setup || activeScenario.setup.length === 0) {
      setPhase("question");
      return null;
    }

    return (
      <div className="screen dlg-screen">
        <div className="scenario-progress">
          {currentIndex + 1} / {scenarios.length}
          {depth > 0 && <span className="scenario-depth-badge">深掘り {depth}</span>}
        </div>
        <DialogueWindow
          lines={activeScenario.setup}
          currentIndex={dialogueLineIndex}
          onAdvance={handleDialogueAdvance}
          onComplete={handleDialogueComplete}
        />
      </div>
    );
  }

  // Reaction phase: show Minato's response to the choice
  if (phase === "reaction") {
    return (
      <div className="screen">
        <div className="scenario-reaction">
          <div className="scenario-reaction-speaker">
            <span className="dlg-speaker-dot" />
            MINATO
          </div>
          <div className="scenario-reaction-text">{reactionText}</div>
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={advanceAfterReaction}
            >
              次へ
              <span className="btn-jp">NEXT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question phase
  return (
    <div className="screen">
      <div className="scenario-progress">
        {currentIndex + 1} / {scenarios.length}
        {depth > 0 && <span className="scenario-depth-badge">深掘り {depth}</span>}
      </div>
      <div className="scenario-panel">
        <div className="scenario-question">{activeScenario.question}</div>

        {activeScenario.mode === "binary" && activeScenario.choices && (
          <div className="scenario-binary">
            {activeScenario.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`scenario-binary-card ${selected === choice.id ? "selected" : ""}`}
                onClick={() => setSelected(choice.id)}
              >
                <div className="scenario-card-label">{choice.label}</div>
                {choice.description && (
                  <div className="scenario-card-desc">{choice.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeScenario.mode === "multiChoice" && activeScenario.choices && (
          <div className="scenario-multi">
            {activeScenario.choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                className={`scenario-multi-card ${selected === choice.id ? "selected" : ""}`}
                onClick={() => setSelected(choice.id)}
              >
                <div className="scenario-card-label">{choice.label}</div>
                {choice.description && (
                  <div className="scenario-card-desc">{choice.description}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {activeScenario.mode === "freeText" && (
          <div className="free-text-panel">
            <textarea
              className="free-text-area"
              placeholder={activeScenario.freeTextPlaceholder ?? "ここに書いてください……"}
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
            />
          </div>
        )}

        <div className="actions">
          <button
            type="button"
            className="btn"
            disabled={
              (activeScenario.mode !== "freeText" && !selected) ||
              (activeScenario.mode === "freeText" && freeText.trim().length === 0)
            }
            onClick={handleConfirm}
          >
            決定
            <span className="btn-jp">CONFIRM</span>
          </button>
        </div>
      </div>
    </div>
  );
}
