"use client";
// ============================================================
// SimRuntime — 各 /sim ルートの共通ランタイム
// URL⇄フェーズ同期(useSimSync) + フェーズ描画(LifeSimStage)。
// どのルートでも同じランタイムを載せ、URL はストアの状態に追従する。
// ============================================================
import { useSimSync } from "./useSimSync";
import LifeSimStage from "./LifeSimStage";

export default function SimRuntime() {
  useSimSync();
  return <LifeSimStage />;
}
