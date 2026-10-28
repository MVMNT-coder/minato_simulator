"use client";
// ============================================================
// Standalone montage screen (for between-age transitions)
// ============================================================
import { useGameStore } from "@/store/gameStore";
import { useGameNavigation } from "@/lib/game/useGameNavigation";

export default function MontageScreen() {
  const advanceAge = useGameStore((s) => s.advanceAge);
  const { navigateToPhase } = useGameNavigation();

  const handleNext = () => {
    const nextPhase = advanceAge();
    navigateToPhase(nextPhase);
  };

  return (
    <div className="screen montage-screen">
      <div className="montage-phase-label">TRANSITIONING</div>
      <div className="actions">
        <button type="button" className="btn" onClick={handleNext}>
          次の時代へ
          <span className="btn-jp">NEXT ERA</span>
        </button>
      </div>
    </div>
  );
}
