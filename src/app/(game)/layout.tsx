"use client";
// ============================================================
// Game route group layout — shared UI + route↔store sync
// ============================================================
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { routeToPhase, phaseToRoute } from "@/lib/game/navigation";
import { loadGame } from "@/lib/game/save";
import DebugPanel from "@/components/ui/DebugPanel";
import ProgressTree from "@/components/ui/ProgressTree";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const setPhase = useGameStore((s) => s.setPhase);
  const phase = useGameStore((s) => s.phase);
  const debugLog = useGameStore((s) => s.debugLog);

  // Route → store sync (handles browser back/forward)
  useEffect(() => {
    const routePhase = routeToPhase(pathname);
    if (routePhase !== phase) {
      setPhase(routePhase);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial mount: check saved state vs current route
  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      // No save — only "/" is valid
      if (pathname !== "/") {
        router.replace("/");
      }
      return;
    }
    // If on "/" and there's a saved game in progress, don't redirect
    // (user might intentionally be on standby)
    // But if on a game route with no matching save phase, redirect
    const routePhase = routeToPhase(pathname);
    if (routePhase !== "standby" && routePhase !== saved.phase) {
      router.replace(phaseToRoute(saved.phase));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ProgressTree />
      <main>{children}</main>
      <div className="footnote">
        FUTURE SIMULATOR — LIFE DESIGN TRANSMISSION SYSTEM / 2026 ⇄ 2126
      </div>
      <DebugPanel logs={debugLog} ageRecords={[]} />
    </>
  );
}
