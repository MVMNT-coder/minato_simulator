// ============================================================
// Phase ↔ Route mapping utilities
// ============================================================
import type { GamePhase } from "./types";

const PHASE_TO_ROUTE: Record<GamePhase, string> = {
  standby: "/",
  intro: "/opening",
  opening: "/prolog",
  agePlay: "/play",
  montage: "/montage",
  lifeReport: "/report",
};

const ROUTE_TO_PHASE: Record<string, GamePhase> = {};

// Build reverse map from PHASE_TO_ROUTE
Object.entries(PHASE_TO_ROUTE).forEach(([phase, route]) => {
  ROUTE_TO_PHASE[route] = phase as GamePhase;
});

export function phaseToRoute(phase: GamePhase): string {
  return PHASE_TO_ROUTE[phase] ?? "/";
}

export function routeToPhase(pathname: string): GamePhase {
  return ROUTE_TO_PHASE[pathname] ?? "standby";
}
