"use client";
// ============================================================
// useSimSync — ストアの phase/currentAge を URL に同期する
// ・マウント時に一度だけ init()(復元 or 新規開始)
// ・phase が変わったら、対応する章のルートへ router.replace()
//   (履歴を積まない = 不可逆なフローの戻る操作で状態がズレない)
// ・ルートが状態と食い違う場合(ディープリンク/リロード)も補正
// ============================================================
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { routeForState } from "@/lib/game/lifeSim/simRoutes";
import { clearSessionLeaving, isSessionLeaving } from "@/lib/game/lifeSim/sessionExit";

export function useSimSync() {
  const router = useRouter();
  const pathname = usePathname();
  const phase = useLifeSimStore((s) => s.phase);
  const currentAge = useLifeSimStore((s) => s.currentAge);
  const initialized = useLifeSimStore((s) => s.initialized);
  const init = useLifeSimStore((s) => s.init);

  useEffect(() => {
    clearSessionLeaving(); // 新たに /sim へ入ったら、前回の離脱フラグは無効化する
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized) return; // 復元完了までは補正しない(誤リダイレクト防止)
    if (isSessionLeaving()) return; // Topへ戻る最中は、reset()による phase 変化を追いかけない
    const target = routeForState(phase, currentAge);
    if (pathname !== target) router.replace(target);
  }, [initialized, phase, currentAge, pathname, router]);
}
