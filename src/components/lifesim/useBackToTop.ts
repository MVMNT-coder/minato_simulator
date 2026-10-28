"use client";
// ============================================================
// useBackToTop — 途中でゲームセッションをやめて、確認の上で
// タイトル(スタンバイ画面 "/")へ戻るための共通ハンドラ。
// IdleSessionGuard の自動タイムアウトと同じ後始末(reset → "/")を、
// プレイヤーの明示的な操作からも呼べるようにする。
// ============================================================
import { useRouter } from "next/navigation";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { markSessionLeaving } from "@/lib/game/lifeSim/sessionExit";

export function useBackToTop() {
  const router = useRouter();
  const reset = useLifeSimStore((s) => s.reset);

  return () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Topに戻りますか?(進行中の記録は消えます)")
    ) {
      return;
    }
    markSessionLeaving();
    reset();
    router.push("/");
  };
}
