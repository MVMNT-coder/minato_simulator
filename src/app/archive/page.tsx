"use client";
// ============================================================
// /archive — 過去に育てられたミナトの人生アーカイブ
// (game) ルートグループの外に置き、旧ストアのリダイレクト制御を回避する。
// ============================================================
import dynamic from "next/dynamic";

const ArchiveScreen = dynamic(
  () => import("@/components/lifesim/ArchiveScreen"),
  { ssr: false },
);

export default function ArchivePage() {
  return (
    <>
      <main className="sim-main">
        <ArchiveScreen />
      </main>
      <div className="footnote">
        FUTURE VALUE ARCHIVE — 過去のミナトたち / 2046 → 2126
      </div>
    </>
  );
}
