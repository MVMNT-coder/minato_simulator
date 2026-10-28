"use client";
// ============================================================
// ValueQuizPanel — MBTI風の価値観クイズ(色々な角度から選択)
// 1問ずつテンポよく選び、選択の積み重ねで「自分で選んだ」感覚を出す。
// 最後に任意のひとこと。→ submitValueQuiz へ。
// ============================================================
import { useEffect, useMemo, useState } from "react";
import type { ValueQuizAnswer, ValueQuizQuestion } from "@/lib/game/lifeSim/types";

interface Props {
  quiz: ValueQuizQuestion[];
  minatoLines: string[];
  onSubmit: (answers: ValueQuizAnswer[], note: string) => void;
  onProgress?: (p: number) => void; // 回答進捗(0..1)
}

export default function ValueQuizPanel({ quiz, minatoLines, onSubmit, onProgress }: Props) {
  const total = quiz.length;
  const [step, setStep] = useState(0); // 0..total-1 = 設問, total = 仕上げ(ひとこと)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");

  const answeredCount = Object.keys(answers).length;
  const atFinish = step >= total;
  const q = !atFinish ? quiz[step] : null;

  // 回答が進むほど 0..1 を通知(アバターの形成度に使う)
  useEffect(() => {
    onProgress?.(total ? answeredCount / total : 0);
  }, [answeredCount, total, onProgress]);

  const answerList: ValueQuizAnswer[] = useMemo(
    () =>
      quiz
        .filter((x) => answers[x.id] !== undefined)
        .map((x) => ({ questionId: x.id, optionIndex: answers[x.id] })),
    [quiz, answers],
  );

  const choose = (optionIndex: number) => {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.id]: optionIndex }));
    // 少し余韻を置いて次へ(選んだ実感)
    window.setTimeout(() => setStep((s) => Math.min(s + 1, total)), 180);
  };

  const finish = () => onSubmit(answerList, note.trim());

  return (
    <div className="screen scrollable">
      {/* ミナトの相談(導入) */}
      {step === 0 && minatoLines.length > 0 && (
        <div className="ls-minato-quote">
          {minatoLines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      )}

      {/* 進捗 */}
      <div className="ls-quiz-progress">
        <div className="ls-quiz-progress-bar">
          <span style={{ width: `${Math.round((Math.min(step, total) / total) * 100)}%` }} />
        </div>
        <div className="ls-quiz-progress-txt">
          {atFinish ? `${answeredCount} / ${total} こたえた` : `Q${step + 1} / ${total}`}
        </div>
      </div>

      {/* 設問 */}
      {q && (
        <div className="ls-quiz-card" key={q.id}>
          <div className="ls-quiz-angle">{q.angle}</div>
          <div className="ls-quiz-prompt">{q.prompt}</div>
          <div className="ls-choice-list">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className={`ls-choice${answers[q.id] === i ? " selected" : ""}`}
                onClick={() => choose(i)}
              >
                <span className="ls-choice-mark" />
                {opt.label}
              </button>
            ))}
          </div>
          <div className="ls-quiz-nav">
            {step > 0 && (
              <button type="button" className="ls-quiz-back" onClick={() => setStep((s) => s - 1)}>
                ← もどる
              </button>
            )}
          </div>
        </div>
      )}

      {/* 仕上げ: 任意のひとこと + 決定 */}
      {atFinish && (
        <div className="ls-quiz-finish">
          <div className="ls-quiz-done">選び終わったよ！</div>
          <label className="ls-reason-label">最後に、ひとことあれば（任意）</label>
          <textarea
            className="ls-reason-area"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="なくてもOK！ 気持ちがあれば書いてね。"
            rows={2}
          />
          <div className="ls-quiz-nav">
            <button type="button" className="ls-quiz-back" onClick={() => setStep(total - 1)}>
              ← 選び直す
            </button>
          </div>
          <div className="actions">
            <button type="button" className="btn" onClick={finish}>
              これがミナトに伝わる！
              <span className="btn-jp">ARCHIVE VALUES</span>
            </button>
          </div>
        </div>
      )}

      <div className="ls-input-hint">
        ※ 決めるのは「どうするか」じゃなくて、「何を大切にするか」だよ。
      </div>
    </div>
  );
}
