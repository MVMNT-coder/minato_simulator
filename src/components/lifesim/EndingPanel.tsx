"use client";
// ============================================================
// EndingPanel — 100歳エンディング (§13)
// 構成: ①人生アルバム → ②ミナトに送る → ③エンディング映像 → ④ビジュアライズ
// ============================================================
import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  AlbumEntry,
  EndingData,
  RegimeHistoryEntry,
  ValueJourneyEntry,
  ValueProfile,
} from "@/lib/game/lifeSim/types";
import { useLifeSimStore } from "@/store/lifeSimStore";
import ProceduralBackground from "./ProceduralBackground";
import EndingMovie from "./EndingMovie";
import LifeTree from "./LifeTree";

interface Props {
  ending: EndingData;
  album: AlbumEntry[];
  onRestart: () => void;
  // 未指定ならストア(現在のミナト)を使う。プレビューでは外部データを渡す。
  regimeHistory?: RegimeHistoryEntry[];
  valueJourney?: ValueJourneyEntry[];
  valueProfile?: ValueProfile;
  preview?: boolean; // プレビュー時: バッジ表示 / 終了ボタンの文言変更
}

type Step = "album" | "send" | "movie" | "visualize";

const SECTIONS: { key: keyof EndingData; label: string }[] = [
  { key: "currentState", label: "100歳のミナト" },
  { key: "reflection", label: "人生を振り返って" },
  { key: "unchangedValue", label: "変わらなかったもの" },
  { key: "changedValue", label: "変わっていったもの" },
  { key: "regimeImpact", label: "選んだ制度が遺したもの" },
  { key: "happiness", label: "幸福だったこと" },
  { key: "regret", label: "後悔していること" },
];

export default function EndingPanel({
  ending, album, onRestart,
  regimeHistory: rhProp, valueJourney: vjProp, valueProfile: vpProp, preview,
}: Props) {
  const storeRegimeHistory = useLifeSimStore((s) => s.persona.regimeHistory);
  const storeValueJourney = useLifeSimStore((s) => s.persona.valueJourney);
  const storeValueProfile = useLifeSimStore((s) => s.persona.valueProfile);
  const regimeHistory = rhProp ?? storeRegimeHistory;
  const valueJourney = vjProp ?? storeValueJourney;
  const valueProfile = vpProp ?? storeValueProfile;
  const [step, setStep] = useState<Step>("album");

  // ---- ② ミナトに送る: 送信演出のあと映像へ ----
  useEffect(() => {
    if (step !== "send") return;
    const id = window.setTimeout(() => setStep("movie"), 4200);
    return () => window.clearTimeout(id);
  }, [step]);

  // ---- ① 人生アルバム(まとめ内包) ----
  if (step === "album") {
    return (
      <div className="screen scrollable">
        {preview && <div className="ls-preview-badge">PREVIEW</div>}
        <div className="eyebrow">FUTURE VALUE ARCHIVE — LIFE COMPLETE</div>
        <h1 className="ls-ending-title">ミナトの人生</h1>

        <div className="ls-album">
          <div className="ls-album-heading">人生アルバム</div>
          {album.map((a, i) => (
            <div key={i} className="ls-album-row">
              <div className="ls-album-age">{a.age}歳</div>
              <div className="ls-album-content">
                <div className="ls-album-regime">{a.regimeName}</div>
                <div className="ls-album-entry">{a.entry}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ls-ending-body">
          {SECTIONS.map(({ key, label }) => (
            <div key={key} className="ls-ending-section">
              <div className="ls-ending-label">{label}</div>
              <p className="ls-ending-text">{ending[key]}</p>
            </div>
          ))}

          <div className="ls-ending-question">
            <div className="ls-ending-label">ミナトから、あなたへの問い</div>
            <p className="ls-ending-text">{ending.questionToPlayer}</p>
          </div>

          <div className="ls-ending-closing">{ending.closingWords}</div>
        </div>

        <div className="actions">
          <button type="button" className="btn" onClick={() => setStep("send")}>
            ミナトに送る
            <span className="btn-jp">SEND TO MINATO</span>
          </button>
        </div>
      </div>
    );
  }

  // ---- ② ミナトに送る(送信演出) ----
  if (step === "send") {
    return (
      <div className="ls-send-screen">
        <ProceduralBackground profile={valueProfile} />
        <div className="ls-send-inner">
          <div className="ls-send-orb">
            <span />
            <span />
            <span />
          </div>
          <div className="ls-send-title">ミナトに送っています</div>
          <div className="ls-send-sub">
            あなたが育てた価値観と、100年ぶんの記憶を、ミナトへ。
          </div>
          <div className="ls-send-bar">
            <span />
          </div>
        </div>
        <button className="ls-skip" type="button" onClick={() => setStep("movie")}>
          スキップ ▶
        </button>
      </div>
    );
  }

  // ---- ③ エンディング映像 ----
  if (step === "movie") {
    return <EndingMovie onComplete={() => setStep("visualize")} />;
  }

  // ---- ④ ビジュアライズ(分岐の樹形図のみ) ----
  return (
    <div className="ls-visualize">
      {preview && <div className="ls-preview-badge">PREVIEW</div>}
      <div className="ls-visualize-head">
        <div className="eyebrow">FUTURE VALUE ARCHIVE — LIFE VISUALIZED</div>
        <h1 className="ls-ending-title">ミナトが歩んだ道</h1>
      </div>

      <LifeTree regimeHistory={regimeHistory} album={album} journey={valueJourney} />

      <div className="actions ls-visualize-actions">
        <button type="button" className="btn" onClick={onRestart}>
          {preview ? "プレビューを終了" : "Topに戻る"}
          <span className="btn-jp">{preview ? "EXIT PREVIEW" : "BACK TO TOP"}</span>
        </button>
        <Link className="btn btn-sub" href="/archive">
          過去のミナトたちを見る
          <span className="btn-jp">VIEW ARCHIVE</span>
        </Link>
      </div>
    </div>
  );
}
