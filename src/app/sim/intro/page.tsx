"use client";
// /sim/intro — 名前入力 + 導入テキスト
import dynamic from "next/dynamic";

const SimRuntime = dynamic(() => import("@/components/lifesim/SimRuntime"), {
  ssr: false,
});

export default function SimIntroPage() {
  return (
    <main className="sim-main">
      <SimRuntime />
    </main>
  );
}