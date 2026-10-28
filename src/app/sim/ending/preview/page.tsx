"use client";
// /sim/ending/preview — エンディングをいつでもプレビュー(URL同期の外側)
// ?id=<archivedLifeId> で特定の人生を指定可能。
import dynamic from "next/dynamic";

const EndingPreview = dynamic(() => import("@/components/lifesim/EndingPreview"), {
  ssr: false,
});

export default function SimEndingPreviewPage() {
  return (
    <main className="sim-main">
      <EndingPreview />
    </main>
  );
}
