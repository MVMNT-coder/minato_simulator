"use client";
// ============================================================
// EndingPreview — エンディングをいつでもプレビュー
// URL同期(useSimSync)の外側で、EndingPanel をそのまま再生する。
// データの優先順位:
//   1. ?id=<archivedLifeId>  … 指定した人生(自分の記録 or サンプル)
//   2. 現在の進行に ending があればそれ
//   3. サンプル人生(SAMPLE_LIVES[0])
// ============================================================
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import EndingPanel from "./EndingPanel";
import { SAMPLE_LIVES, loadArchivedLives } from "@/lib/game/lifeSim/archive";
import { INITIAL_VALUE_PROFILE } from "@/lib/game/lifeSim/types";
import { useLifeSimStore } from "@/store/lifeSimStore";

export default function EndingPreview() {
  const router = useRouter();

  const [id] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null,
  );

  const storeEnding = useLifeSimStore((s) => s.ending);
  const storeAlbum = useLifeSimStore((s) => s.album);
  const storeRH = useLifeSimStore((s) => s.persona.regimeHistory);
  const storeVJ = useLifeSimStore((s) => s.persona.valueJourney);
  const storeVP = useLifeSimStore((s) => s.persona.valueProfile);

  const source = useMemo(() => {
    if (id) {
      const life = [...loadArchivedLives(), ...SAMPLE_LIVES].find((l) => l.id === id);
      if (life) {
        return {
          ending: life.ending,
          album: life.album,
          regimeHistory: life.regimeHistory,
          valueJourney: life.valueJourney ?? [],
          valueProfile: INITIAL_VALUE_PROFILE,
        };
      }
    }
    if (storeEnding && storeRH.length > 0) {
      return {
        ending: storeEnding,
        album: storeAlbum,
        regimeHistory: storeRH,
        valueJourney: storeVJ,
        valueProfile: storeVP,
      };
    }
    const s = SAMPLE_LIVES[0];
    return {
      ending: s.ending,
      album: s.album,
      regimeHistory: s.regimeHistory,
      valueJourney: s.valueJourney ?? [],
      valueProfile: INITIAL_VALUE_PROFILE,
    };
  }, [id, storeEnding, storeAlbum, storeRH, storeVJ, storeVP]);

  return (
    <EndingPanel
      ending={source.ending}
      album={source.album}
      regimeHistory={source.regimeHistory}
      valueJourney={source.valueJourney}
      valueProfile={source.valueProfile}
      preview
      onRestart={() => router.push("/archive")}
    />
  );
}
