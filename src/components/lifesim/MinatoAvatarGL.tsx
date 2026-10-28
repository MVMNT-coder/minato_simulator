"use client";
// ============================================================
// MinatoAvatarGL — AvatarScene(three.js) を中央人物レイヤーへ載せる
// React ラッパー。persona 状態を setState で反映し、
// 読み込み中/失敗時のフォールバックを中央領域内だけに表示する。
// three.js は useEffect 内で動的 import(SSR回避)。
// ============================================================
import { useEffect, useRef, useState, useCallback } from "react";
import MinatoAvatar from "./MinatoAvatar"; // 抽象シルエット(フォールバック)
import { emotionFromText } from "@/three/avatar/avatarConfig";
import type { AvatarScene } from "@/three/avatar/AvatarScene";
import type { CameraMood, MinatoEmotion } from "@/three/avatar/avatarTypes";

interface Props {
  emotion?: string; // persona.currentEmotion(日本語)
  speaking?: boolean;
  age: number;
}

function moodFor(emo: MinatoEmotion): CameraMood {
  return emo === "thoughtful" || emo === "anxious" || emo === "conflicted" || emo === "sad"
    ? "close"
    : "standard";
}

export default function MinatoAvatarGL({ emotion, speaking, age }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<AvatarScene | null>(null);
  const latest = useRef({ emotion, speaking, age });

  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const [progress, setProgress] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  // 最新 props を ref に反映(render 中には触らない)
  useEffect(() => {
    latest.current = { emotion, speaking, age };
  });

  // シーン生成/破棄
  useEffect(() => {
    let disposed = false;
    let scene: AvatarScene | null = null;
    setStatus("loading");
    setProgress(0);

    (async () => {
      const container = containerRef.current;
      if (!container) return;
      const [{ AvatarScene }, { resolveAvatarConfig }] = await Promise.all([
        import("@/three/avatar/AvatarScene"),
        import("@/three/avatar/avatarConfig"),
      ]);
      if (disposed) return;

      scene = new AvatarScene(container, resolveAvatarConfig(latest.current.age), {
        onProgress: (p) => setProgress(p),
        onLoaded: () => setStatus("loaded"),
        onError: () => setStatus("failed"),
      });
      sceneRef.current = scene;
      await scene.init();
      if (disposed) {
        scene.dispose();
        sceneRef.current = null;
        return;
      }
      scene.start();
      // 現在の props を反映
      const emo = emotionFromText(latest.current.emotion);
      scene.setState({
        emotion: emo,
        motionState: latest.current.speaking ? "talking" : "idle",
        isSpeaking: !!latest.current.speaking,
        cameraMood: moodFor(emo),
      });
    })();

    return () => {
      disposed = true;
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [reloadKey]);

  // 感情/発話 → setState
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const emo = emotionFromText(emotion);
    s.setState({
      emotion: emo,
      motionState: speaking ? "talking" : "idle",
      isSpeaking: !!speaking,
      cameraMood: moodFor(emo),
    });
  }, [emotion, speaking]);

  // 年代 → モデル差し替え
  useEffect(() => {
    sceneRef.current?.setAge(age);
  }, [age]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className="foi-avatar-gl">
      <div ref={containerRef} data-avatar-container className="foi-avatar3d" />

      {status === "loading" && (
        <div className="foi-avatar-overlay">
          <div className="foi-avatar-loadtxt">LOADING DIGITAL HUMAN</div>
          <div className="foi-avatar-bar">
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="foi-avatar-overlay foi-avatar-fallback">
          <MinatoAvatar emotion={emotion} speaking={speaking} />
          <div className="foi-avatar-fallnote">
            3Dモデル未配置 — /models/minato/minato-{age}.glb を配置すると
            デジタルヒューマンに切り替わります。
          </div>
          <button type="button" className="foi-skip" onClick={reload}>
            再読み込み ↻
          </button>
        </div>
      )}
    </div>
  );
}
