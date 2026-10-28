"use client";
import dynamic from "next/dynamic";
import { useGameStore } from "@/store/gameStore";

const AgePlayScreen = dynamic(
  () => import("@/components/screens/AgePlayScreen"),
  { ssr: false },
);

export default function PlayPage() {
  const currentAge = useGameStore((s) => s.currentAge);
  return <AgePlayScreen key={currentAge} />;
}
