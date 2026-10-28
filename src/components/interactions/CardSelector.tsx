"use client";
import { useState, useCallback } from "react";
import type { CardOption } from "@/lib/game/types";

interface Props {
  prompt: string;
  cards: CardOption[];
  minSelect: number;
  maxSelect: number;
  allowCustom?: boolean;
  onComplete: (selectedIds: string[]) => void;
}

export default function CardSelector({
  prompt,
  cards,
  minSelect,
  maxSelect,
  allowCustom,
  onComplete,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [customCards, setCustomCards] = useState<CardOption[]>([]);

  const allCards = [...cards, ...customCards];

  const toggleCard = useCallback(
    (id: string) => {
      setSelected((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= maxSelect) return prev;
        return [...prev, id];
      });
    },
    [maxSelect]
  );

  const addCustom = useCallback(() => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const id = `custom_${Date.now()}`;
    setCustomCards((prev) => [...prev, { id, label: trimmed }]);
    setSelected((prev) => (prev.length < maxSelect ? [...prev, id] : prev));
    setCustomText("");
  }, [customText, maxSelect]);

  const canSubmit = selected.length >= minSelect && selected.length <= maxSelect;

  return (
    <div className="screen">
      <div className="card-prompt">{prompt}</div>

      <div className="card-grid">
        {allCards.map((card, i) => (
          <div
            key={card.id}
            className={`card-item${selected.includes(card.id) ? " selected" : ""}`}
            onClick={() => toggleCard(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.code === "Enter" || e.code === "Space") {
                e.preventDefault();
                toggleCard(card.id);
              }
            }}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="card-item-label">{card.label}</div>
            {card.description && (
              <div className="card-item-desc">{card.description}</div>
            )}
          </div>
        ))}
      </div>

      <div className="card-counter">
        {selected.length} / {maxSelect} 選択中
        {minSelect > 1 && selected.length < minSelect && (
          <span style={{ marginLeft: 12, color: "var(--text-muted)" }}>
            （{minSelect}つ以上選んでください）
          </span>
        )}
      </div>

      {allowCustom && (
        <div className="card-custom-input">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="自分で追加する…"
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustom();
            }}
          />
          <button type="button" onClick={addCustom}>
            追加
          </button>
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!canSubmit}
          onClick={() => onComplete(selected)}
        >
          決定
          <span className="btn-jp">CONFIRM</span>
        </button>
      </div>
    </div>
  );
}
