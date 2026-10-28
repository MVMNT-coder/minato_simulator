"use client";
// ============================================================
// Game template — re-mounts on every route change,
// causing .screen's screenIn animation to re-fire naturally.
// ============================================================
export default function GameTemplate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
