"use client";
import { useRouter } from "next/navigation";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { useEffect, useState } from "react";
import { withBase } from "@/lib/basePath";

export default function StandbyScreen() {
  const router = useRouter();
  const [canResume, setCanResume] = useState(false);

  useEffect(() => {
    setCanResume(useLifeSimStore.getState().hasSave());
  }, []);

  // CONNECT = Value Archive を最初から(導入テキスト→映像→本編)
  const handleStart = () => {
    useLifeSimStore.getState().reset();
    router.push("/sim");
  };

  // RESUME = 保存済みの続きから
  const handleResume = () => {
    router.push("/sim");
  };

  return (
    <div className="screen" style={{ position: "relative" }}>
      <div className="standby-bg" />
      <div className="standby-rings" style={{ top: "50%", left: "50%", transform: "translate(-50%, -60%)" }} />

      <div className="eyebrow">FUTURE VALUE ARCHIVE</div>
      <h1 className="standby-title">MINATO</h1>
      <div className="standby-meta">
        <em>FUTURE VALUE ARCHIVE</em><br />
        2046 → 2126
        <br /><br />
きみの価値観で、未来のミナトを育てよう！
      </div>

      <div className="connection-status">
        TEMPORAL LINK AVAILABLE
      </div>

      <div className="actions">
        <button className="btn connect-btn" onClick={handleStart}>
          CONNECT
          <span className="btn-jp">接続を開始する</span>
        </button>
        {canResume && (
          <button className="btn btn-sub" onClick={handleResume}>
            RESUME
            <span className="btn-jp">続きから再開</span>
          </button>
        )}
        <a className="btn btn-sub" href={withBase("/archive")}>
          ARCHIVE
          <span className="btn-jp">過去のミナトたちを見る</span>
        </a>
      </div>
    </div>
  );
}
