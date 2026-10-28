"use client";
// /sim/age/[age] — 各年代の章(制度選択〜アルバム、価値観処理)
import dynamic from "next/dynamic";

const SimRuntime = dynamic(() => import("@/components/lifesim/SimRuntime"), {
  ssr: false,
});

export default function Client() {
  return (
    <main className="sim-main">
      <SimRuntime />
    </main>
  );
}