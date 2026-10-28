"use client";
import dynamic from "next/dynamic";

const StandbyScreen = dynamic(
  () => import("@/components/screens/StandbyScreen"),
  { ssr: false },
);

export default function StandbyPage() {
  return <StandbyScreen />;
}
