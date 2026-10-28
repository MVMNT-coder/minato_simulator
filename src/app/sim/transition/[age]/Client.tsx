"use client";
// /sim/transition/[age] — 時間の遷移([age]→次の年代)
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