"use client";
// ============================================================
// /sim — エントリ。ストアの状態に応じて正しい章ルートへ補正する。
// 実体は各章ルート(/sim/intro, /sim/opening, /sim/age/[age], …)。
// ============================================================
import dynamic from "next/dynamic";

const SimRuntime = dynamic(() => import("@/components/lifesim/SimRuntime"), {
  ssr: false,
});

export default function SimPage() {
  return (
    <main className="sim-main">
      <SimRuntime />
    </main>
  );
}