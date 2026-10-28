"use client";
// ============================================================
// QuitToTopButton — ゲームセッション中(/sim 配下)、画面下に常時表示する
// 「Topに戻る」ボタン。IdleSessionGuard と同じくルートレイアウトに常駐させ、
// フェーズ遷移によるルート変更(useSimSync)で再マウントされないようにする。
// ============================================================
import { usePathname } from "next/navigation";
import { useBackToTop } from "@/components/lifesim/useBackToTop";

export default function QuitToTopButton() {
  const pathname = usePathname();
  const backToTop = useBackToTop();
  const inSession = pathname === "/sim" || pathname.startsWith("/sim/");

  if (!inSession) return null;

  return (
    <button type="button" className="quit-to-top-btn" onClick={backToTop}>
      ⌂ Topに戻る
    </button>
  );
}
