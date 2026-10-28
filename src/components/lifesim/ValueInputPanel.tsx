"use client";
// ============================================================
// ValueInputPanel — 価値観の入力 (§9)
// 直感的な選択肢 + 選んだ理由の自由記述 (+ 任意の一言)。
// 結末を選ばせるのではなく、価値観を問う。長文は強制しない。
// ============================================================
import { useState } from "react";
import type { ValueInput, ValueQuestion } from "@/lib/game/lifeSim/types";

const TYPE_LABEL: Record<string, string> = {
  consult: "ミナトの相談",
  thoughtExperiment: "もしもの問い",
  priority: "何を大切にする？",
  discomfort: "気になることを選ぶ",
  naming: "名前をつける",
  addLine: "ひとことを加える",
  acrossTime: "時をこえた問い",
};

interface Props {
  question: ValueQuestion;
  minatoLines: string[];
  onSubmit: (input: ValueInput) => void;
}

export default function ValueInputPanel({ question, minatoLines, onSubmit }: Props) {
  const [choice, setChoice] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [shortInput, setShortInput] = useState("");

  const canSubmit = !!choice;

  return (
    <div className="screen scrollable">
      <div className="ls-question-kicker">{TYPE_LABEL[question.type] ?? "問い"}</div>

      {minatoLines.length > 0 && (
        <div className="ls-minato-quote">
          {minatoLines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )}

      <div className="ls-question-prompt">{question.prompt}</div>

      <div className="ls-choice-list">
        {question.choices.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`ls-choice${choice === c ? " selected" : ""}`}
            onClick={() => setChoice(c)}
          >
            <span className="ls-choice-mark" />
            {c}
          </button>
        ))}
      </div>

      <div className="ls-reason-block">
        <label className="ls-reason-label">{question.reasonPrompt}</label>
        <textarea
          className="ls-reason-area"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="ひとことでもOK！ 思ったことを気軽にどうぞ。"
          rows={3}
        />
      </div>

      {question.shortInputPrompt && (
        <div className="ls-short-block">
          <label className="ls-reason-label">{question.shortInputPrompt}</label>
          <input
            className="ls-short-input"
            type="text"
            value={shortInput}
            onChange={(e) => setShortInput(e.target.value)}
            placeholder="任意"
          />
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!canSubmit}
          onClick={() =>
            choice &&
            onSubmit({
              choice,
              reason: reason.trim(),
              shortInput: shortInput.trim() || undefined,
            })
          }
        >
          これを残す！
          <span className="btn-jp">ARCHIVE VALUE</span>
        </button>
      </div>
      <div className="ls-input-hint">
        ※ 決めるのは「どうするか」じゃなくて、「何を大切にするか」だよ。
      </div>
    </div>
  );
}
