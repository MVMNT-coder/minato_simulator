"use client";
// ============================================================
// IdleSessionGuard — 90秒間無操作なら現在のゲームセッションを終了し、
// 短い演出を挟んでタイトル(スタンバイ画面 "/")へ戻す。
// ルートレイアウトに常駐させ、フェーズ遷移によるルート変更(useSimSync)
// で再マウントされないようにする(でないと無操作でも計測がリセットされてしまう)。
// ============================================================
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { markSessionLeaving } from "@/lib/game/lifeSim/sessionExit";

const IDLE_LIMIT_MS = 90_000;
const CHECK_INTERVAL_MS = 1000;
const TRANSITION_MS = 1800;
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

export default function IdleSessionGuard() {
  const pathname = usePathname();
  const router = useRouter();
  // ゲームセッション中(/sim 配下)のみ計測する。タイトル(スタンバイ)ではタイマーを止める。
  const inSession = pathname === "/sim" || pathname.startsWith("/sim/");

  const lastActivityRef = useRef(0);
  const [ending, setEnding] = useState(false);

  // セッションに出入りするたびに計測をリセット(スタンバイに長時間放置後の誤発火を防ぐ)。
  // 依存は inSession のみ = セッション内でのフェーズ遷移(ルート変更)では発火しない。
  useEffect(() => {
    lastActivityRef.current = Date.now();
    setEnding(false);
  }, [inSession]);

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((ev) =>
      window.addEventListener(ev, markActive, { passive: true })
    );
    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, markActive));
    };
  }, []);

  useEffect(() => {
    if (!inSession) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastActivityRef.current >= IDLE_LIMIT_MS) {
        setEnding(true);
      }
    }, CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [inSession]);

  useEffect(() => {
    if (!ending) return;
    const t = window.setTimeout(() => {
      markSessionLeaving();
      useLifeSimStore.getState().reset();
      router.push("/");
    }, TRANSITION_MS);
    return () => window.clearTimeout(t);
  }, [ending, router]);

  if (!inSession || !ending) return null;

  return (
    <div className="idle-end-overlay" role="alert">
      <div className="idle-end-rings">
        <span />
        <span />
        <span />
      </div>
      <div className="idle-end-title">
        しばらく操作がなかったため
        <br />
        セッションを終了します
      </div>
      <div className="idle-end-sub">NO INPUT DETECTED — RETURNING TO STANDBY</div>
    </div>
  );
}
