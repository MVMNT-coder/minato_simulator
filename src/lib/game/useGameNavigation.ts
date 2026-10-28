"use client";
// ============================================================
// useGameNavigation — setPhase + router.push in one call
// ============================================================
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { phaseToRoute } from "./navigation";
import type { GamePhase } from "./types";

export function useGameNavigation() {
  const router = useRouter();
  const setPhase = useGameStore((s) => s.setPhase);

  const navigateToPhase = useCallback(
    (phase: GamePhase) => {
      setPhase(phase);
      router.push(phaseToRoute(phase));
    },
    [setPhase, router],
  );

  return { navigateToPhase };
}
