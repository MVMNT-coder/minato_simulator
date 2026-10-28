"use client";
// ============================================================
// NameEntry — 最初にプレイヤー(未来価値観アーキビスト)の名前を入力
// ============================================================
import { useState } from "react";

interface Props {
  onSubmit: (name: string) => void;
}

export default function NameEntry({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const canSubmit = name.trim().length > 0;
  const submit = () => {
    if (canSubmit) onSubmit(name.trim());
  };

  return (
    <div className="screen">
      <div className="eyebrow">FUTURE VALUE ARCHIVE</div>

      <div className="ls-name-block">
        <div className="ls-name-prompt">きみの名前、教えて！</div>
        <div className="ls-name-sub">
          この名前で「未来価値観の記録者」として登録されるよ。
        </div>
        <input
          className="ls-name-input"
          type="text"
          value={name}
          maxLength={24}
          placeholder="例: ミナモト"
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
      </div>

      <div className="actions">
        <button type="button" className="btn" disabled={!canSubmit} onClick={submit}>
          はじめる！
          <span className="btn-jp">CONNECT</span>
        </button>
      </div>
    </div>
  );
}
