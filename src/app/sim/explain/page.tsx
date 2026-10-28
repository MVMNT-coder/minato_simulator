"use client";
// /sim/explain — このツールを紹介する ~1分の自動再生アニメ
import dynamic from "next/dynamic";

const ExplainAnimation = dynamic(
  () => import("@/components/lifesim/ExplainAnimation"),
  { ssr: false },
);

export default function SimExplainPage() {
  return (
    <main className="sim-main">
      <ExplainAnimation />
    </main>
  );
}
