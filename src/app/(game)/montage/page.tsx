"use client";
import dynamic from "next/dynamic";

const MontageScreen = dynamic(
  () => import("@/components/screens/MontageScreen"),
  { ssr: false },
);

export default function MontagePage() {
  return <MontageScreen />;
}
