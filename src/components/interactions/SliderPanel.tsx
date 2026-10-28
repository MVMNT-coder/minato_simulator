"use client";
import { useState, useCallback } from "react";
import type { SliderDef } from "@/lib/game/types";

interface Props {
  title?: string;
  sliders: SliderDef[];
  onComplete: (values: Record<string, number>) => void;
}

export default function SliderPanel({ title, sliders, onComplete }: Props) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const s of sliders) init[s.id] = s.defaultValue;
    return init;
  });

  const handleChange = useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <div className="screen">
      {title && <div className="step-title">{title}</div>}

      <div className="slider-panel">
        {sliders.map((slider, i) => (
          <div
            key={slider.id}
            className="slider-item"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="slider-label">
              <span className="slider-label-text">{slider.label}</span>
              <span className="slider-value">{values[slider.id]}%</span>
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              value={values[slider.id]}
              onChange={(e) => handleChange(slider.id, Number(e.target.value))}
            />
            <div className="slider-range-labels">
              <span>{slider.minLabel}</span>
              <span>{slider.maxLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn"
          onClick={() => onComplete(values)}
        >
          決定
          <span className="btn-jp">CONFIRM</span>
        </button>
      </div>
    </div>
  );
}
