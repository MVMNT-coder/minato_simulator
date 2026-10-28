"use client";
import { useState, useCallback } from "react";
import type { SliderDef } from "@/lib/game/types";

interface Props {
  prompt: string;
  sliders: SliderDef[];
  previousValues: Record<string, number>;
  onComplete: (changed: boolean, newValues?: Record<string, number>) => void;
}

export default function ConfirmPanel({
  prompt,
  sliders,
  previousValues,
  onComplete,
}: Props) {
  const [choice, setChoice] = useState<"keep" | "change" | null>(null);
  const [values, setValues] = useState<Record<string, number>>(previousValues);

  const handleChange = useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <div className="screen">
      <div className="confirm-panel">
        <div className="confirm-prompt">{prompt}</div>

        <div className="confirm-options">
          <div
            className={`confirm-option${choice === "keep" ? " selected" : ""}`}
            onClick={() => setChoice("keep")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.code === "Enter") setChoice("keep");
            }}
          >
            変えない
          </div>
          <div
            className={`confirm-option${choice === "change" ? " selected" : ""}`}
            onClick={() => setChoice("change")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.code === "Enter") setChoice("change");
            }}
          >
            調整する
          </div>
        </div>

        {choice === "change" && (
          <div className="slider-panel" style={{ marginTop: "4vh" }}>
            {sliders.map((slider) => (
              <div key={slider.id} className="slider-item">
                <div className="slider-label">
                  <span className="slider-label-text">{slider.label}</span>
                  <span className="slider-value">{values[slider.id]}%</span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  value={values[slider.id]}
                  onChange={(e) =>
                    handleChange(slider.id, Number(e.target.value))
                  }
                />
                <div className="slider-range-labels">
                  <span>{slider.minLabel}</span>
                  <span>{slider.maxLabel}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {choice && (
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() =>
                onComplete(
                  choice === "change",
                  choice === "change" ? values : undefined
                )
              }
            >
              決定
              <span className="btn-jp">CONFIRM</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
