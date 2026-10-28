"use client";
// ============================================================
// ArchiveScreen — 過去に育てられたミナトの人生アーカイブ (/archive)
// 実際にプレイした記録(localStorage)のみを一覧・閲覧する。
// ============================================================
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadArchivedLives, deleteArchivedLife } from "@/lib/game/lifeSim/archive";
import type { ArchivedLife, EndingData } from "@/lib/game/lifeSim/types";
import LifeTree from "./LifeTree";

const ENDING_SECTIONS: { key: keyof EndingData; label: string }[] = [
  { key: "currentState", label: "100歳のミナト" },
  { key: "reflection", label: "人生を振り返って" },
  { key: "unchangedValue", label: "変わらなかったもの" },
  { key: "changedValue", label: "変わっていったもの" },
  { key: "regimeImpact", label: "選んだ制度が遺したもの" },
  { key: "happiness", label: "幸福だったこと" },
  { key: "regret", label: "後悔していること" },
];

function formatDate(ms: number): string {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ArchiveScreen() {
  const [mine, setMine] = useState<ArchivedLife[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setMine(loadArchivedLives());
  }, []);

  const selected = mine.find((l) => l.id === selectedId) ?? null;

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("この記録を削除しますか?")) return;
    deleteArchivedLife(id);
    setMine(loadArchivedLives());
    if (selectedId === id) setSelectedId(null);
  };

  // ---- 詳細ビュー ----
  if (selected) {
    return (
      <div className="screen scrollable">
        <button className="ls-arch-back" onClick={() => setSelectedId(null)}>
          ← 一覧へ戻る
        </button>

        <div className="ls-arch-detail-head">
          <div className="ls-arch-tag">
            あなたの記録{selected.archivist ? ` — ${selected.archivist}` : ""}
          </div>
          <h1 className="ls-arch-detail-title">{selected.label}</h1>
          <p className="ls-arch-detail-epithet">{selected.epithet}</p>
        </div>

        {selected.valueSummary.length > 0 && (
          <div className="ls-arch-values">
            {selected.valueSummary.map((v, i) => (
              <span key={i} className="ls-arch-chip">{v}</span>
            ))}
          </div>
        )}

        <div className="ls-tree-fullbleed">
          <div className="ls-tree-heading">分岐の記録 — 歩んだ道</div>
          <LifeTree
            regimeHistory={selected.regimeHistory}
            album={selected.album}
            journey={selected.valueJourney}
          />
        </div>

        <div className="ls-album">
          <div className="ls-album-heading">人生アルバム</div>
          {selected.album.map((a, i) => (
            <div key={i} className="ls-album-row">
              <div className="ls-album-age">{a.age}歳</div>
              <div className="ls-album-content">
                <div className="ls-album-regime">{a.regimeName}</div>
                <div className="ls-album-entry">{a.entry}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ls-ending-body" style={{ marginTop: 8 }}>
          {ENDING_SECTIONS.map(({ key, label }) => (
            <div key={key} className="ls-ending-section">
              <div className="ls-ending-label">{label}</div>
              <p className="ls-ending-text">{selected.ending[key]}</p>
            </div>
          ))}
          <div className="ls-ending-question">
            <div className="ls-ending-label">ミナトから、あなたへの問い</div>
            <p className="ls-ending-text">{selected.ending.questionToPlayer}</p>
          </div>
          <div className="ls-ending-closing">{selected.ending.closingWords}</div>
        </div>

        <div className="actions">
          <Link className="btn" href={`/sim/ending/preview?id=${selected.id}`}>
            この人生のエンディングを再生
            <span className="btn-jp">PLAY ENDING</span>
          </Link>
          <button className="btn btn-sub" onClick={() => setSelectedId(null)}>
            一覧へ戻る
            <span className="btn-jp">BACK TO LIST</span>
          </button>
        </div>
      </div>
    );
  }

  // ---- 一覧ビュー ----
  return (
    <div className="screen scrollable">
      <div className="eyebrow">FUTURE VALUE ARCHIVE — PAST LIVES</div>
      <div className="ls-section-title">過去に育てられたミナトたち</div>
      <div className="ls-section-note">
        価値観が違えば、ミナトの人生もぜんぜん違う。
        これまで育てられた、いろんなミナトが集まっているよ。
      </div>

      {mine.length === 0 && (
        <div className="ls-arch-empty">
          きみの記録はまだないよ。ミナトを最後まで育てると、ここに残るんだ。
        </div>
      )}

      <div className="ls-arch-grid">
        {mine.map((life) => (
          <div
            key={life.id}
            className="ls-arch-card"
            onClick={() => setSelectedId(life.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.code === "Enter" || e.code === "Space") {
                e.preventDefault();
                setSelectedId(life.id);
              }
            }}
          >
            <div className="ls-arch-card-top">
              <span className="ls-arch-badge is-you">
                {life.archivist || "あなたの記録"}
              </span>
              <span className="ls-arch-date">{formatDate(life.createdAt)}</span>
            </div>
            <div className="ls-arch-card-title">{life.label}</div>
            <div className="ls-arch-card-epithet">{life.epithet}</div>
            <div className="ls-arch-card-foot">
              {life.regimeHistory.length}の制度を選んだ人生
              <button
                className="ls-arch-del"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(life.id);
                }}
                aria-label="削除"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <Link className="btn" href="/sim">
新しいミナトを育てる！
          <span className="btn-jp">START ARCHIVE</span>
        </Link>
        <Link className="btn btn-sub" href="/sim/ending/preview">
          エンディングをプレビュー
          <span className="btn-jp">PREVIEW ENDING</span>
        </Link>
        <Link className="btn btn-sub" href="/">
          タイトルへ
          <span className="btn-jp">TITLE</span>
        </Link>
      </div>
    </div>
  );
}
