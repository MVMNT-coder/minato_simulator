"use client";
import { useState } from "react";

interface Props {
  prompt: string;
  placeholder?: string;
  onComplete: (text: string) => void;
}

export default function FreeTextInput({ prompt, placeholder, onComplete }: Props) {
  const [text, setText] = useState("");

  const canSubmit = text.trim().length > 0;

  return (
    <div className="screen">
      <div className="free-text-panel">
        <div className="free-text-prompt">{prompt}</div>
        <textarea
          className="free-text-area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn"
          disabled={!canSubmit}
          onClick={() => onComplete(text.trim())}
        >
          送信
          <span className="btn-jp">SEND</span>
        </button>
      </div>
    </div>
  );
}
