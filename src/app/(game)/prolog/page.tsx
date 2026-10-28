"use client";
import dynamic from "next/dynamic";

const VideoMessageScreen = dynamic(
  () => import("@/components/screens/VideoMessageScreen"),
  { ssr: false },
);

export default function PrologPage() {
  return <VideoMessageScreen />;
}
