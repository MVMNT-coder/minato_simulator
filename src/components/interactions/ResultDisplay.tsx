"use client";
import { useState, useEffect } from "react";

interface Props {
  headline: string;
  interpretation: string;
  memory: string;
  onComplete: () => void;
}

export default function ResultDisplay({
  headline,
  interpretation,
  memory,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<"headline" | "interpretation" | "memory" | "done">(
    "headline"
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("interpretation"), 1500));
    timers.push(setTimeout(() => setPhase("memory"), 3500));
    timers.push(setTimeout(() => setPhase("done"), 5000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const showInterpretation =
    phase === "interpretation" || phase === "memory" || phase === "done";
  const showMemory = phase === "memory" || phase === "done";
  const showButton = phase === "done";

  return (
    <div className="screen">
      <div className="result-container">
        <div className="result-headline">{headline}</div>

        {showInterpretation && (
          <div className="result-interpretation">{interpretation}</div>
        )}

        {showMemory && <div className="result-memory">{memory}</div>}

        {showButton && (
          <div className="actions">
            <button type="button" className="btn" onClick={onComplete}>
              次へ
              <span className="btn-jp">NEXT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
