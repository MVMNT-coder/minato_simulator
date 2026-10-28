"use client";
// /sim/opening — 音声反応オープニング
import dynamic from "next/dynamic";

const SimRuntime = dynamic(() => import("@/components/lifesim/SimRuntime"), {
  ssr: false,
});

export default function SimOpeningPage() {
  return (
    <main className="sim-main">
      <SimRuntime />
    </main>
  );
}