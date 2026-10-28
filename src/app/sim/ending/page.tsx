"use client";
// /sim/ending — エンディング(人生アルバム→送る→映像→ビジュアライズ)
import dynamic from "next/dynamic";

const SimRuntime = dynamic(() => import("@/components/lifesim/SimRuntime"), {
  ssr: false,
});

export default function SimEndingPage() {
  return (
    <main className="sim-main">
      <SimRuntime />
    </main>
  );
}