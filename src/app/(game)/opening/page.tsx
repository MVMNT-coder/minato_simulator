"use client";
import dynamic from "next/dynamic";

const IntroScreen = dynamic(
  () => import("@/components/screens/IntroScreen"),
  { ssr: false },
);

export default function OpeningPage() {
  return <IntroScreen />;
}
