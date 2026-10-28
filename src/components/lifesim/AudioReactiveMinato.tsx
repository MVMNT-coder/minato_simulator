"use client";
// ============================================================
// AudioReactiveMinato — 映像の代わりに、任意の音声に反応する
// パーティクルアバターのオーディオビジュアル表現。
// public の音声ファイル(/audio/*.mp3)を再生し、Web Audio の
// Analyser で 音量/低音/高音 を取り出して MinatoParticles を駆動する。
// 音声未配置/再生不可でも行き止まりにしない(フォールバック)。
// ============================================================
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import MinatoParticles, { type AudioLevels } from "./MinatoParticles";

interface Props {
  src: string;
  hud: string;         // HUD右上ラベル
  caption: string;     // 下部キャプション
  emotion?: string;
  loadingText: string;
  playLabel: string;   // 再生ボタン
  endText: ReactNode;  // 終了時メッセージ
  ctaLabel: string;    // 次へ
  ctaJp: string;
  onComplete: () => void;
}

type Stage = "loading" | "idle" | "playing" | "ended" | "failed";

export default function AudioReactiveMinato({
  src, hud, caption, emotion, loadingText, playLabel, endText, ctaLabel, ctaJp, onComplete,
}: Props) {
  const audioElRef = useRef<HTMLAudioElement>(null);
  const levelsRef = useRef<AudioLevels | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const srcNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef(0);

  const [stage, setStage] = useState<Stage>("loading");

  // 受信ローディング(少しだけ)
  useEffect(() => {
    const t = window.setTimeout(() => setStage("idle"), 1600);
    return () => window.clearTimeout(t);
  }, []);

  // Analyser ループ: 音量/低音/高音を 0..1 に正規化して levelsRef へ
  const runAnalyser = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bins = analyser.frequencyBinCount;
    const data = new Uint8Array(bins);
    const loop = () => {
      analyser.getByteFrequencyData(data);
      const bassEnd = Math.max(2, Math.floor(bins * 0.08));
      const trebleStart = Math.floor(bins * 0.5);
      let sum = 0, bassSum = 0, trebSum = 0;
      for (let i = 0; i < bins; i++) {
        sum += data[i];
        if (i < bassEnd) bassSum += data[i];
        if (i >= trebleStart) trebSum += data[i];
      }
      const level = sum / bins / 255;
      const bass = bassSum / bassEnd / 255;
      const treble = trebSum / (bins - trebleStart) / 255;
      // 少し持ち上げて見栄えよく
      levelsRef.current = {
        level: Math.min(1, level * 1.6),
        bass: Math.min(1, bass * 1.5),
        treble: Math.min(1, treble * 2.2),
      };
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(async () => {
    const el = audioElRef.current;
    if (!el) return;
    try {
      // AudioContext / Analyser を(初回のみ)構築
      if (!ctxRef.current) {
        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        const node = ctx.createMediaElementSource(el);
        node.connect(analyser);
        analyser.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
        srcNodeRef.current = node;
      }
      await ctxRef.current.resume();
      await el.play();
      setStage("playing");
      runAnalyser();
    } catch {
      // 自動再生ブロック等 → idle のままボタン提示(ユーザー操作待ち)
      setStage((s) => (s === "playing" ? s : "idle"));
    }
  }, [runAnalyser]);

  // idle に入ったら一度だけ自動再生を試みる(失敗すればボタンで待つ)
  useEffect(() => {
    if (stage === "idle") start();
  }, [stage, start]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      try { srcNodeRef.current?.disconnect(); } catch (e) { void e; }
      try { analyserRef.current?.disconnect(); } catch (e) { void e; }
      try { ctxRef.current?.close(); } catch (e) { void e; }
    };
  }, []);

  const handleEnded = () => {
    cancelAnimationFrame(rafRef.current);
    levelsRef.current = null;
    setStage("ended");
  };
  const handleError = () => setStage("failed");

  const active = stage === "playing";
  // 再生中は音声で駆動 / 失敗時はアンビエントに揺らす(speaking)
  const speaking = stage === "failed";

  if (stage === "loading") {
    return (
      <div className="screen dlg-screen ls-areactive-screen">
        <div className="ls-vloader">
          <div className="ls-vloader-badge"><span className="rec-dot" />{hud}</div>
          <div className="ls-vloader-title">
            {loadingText}<span className="ls-vloader-dots"><i /><i /><i /></span>
          </div>
          <div className="ls-vloader-bar"><span /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen dlg-screen ls-areactive-screen">
      <div className="video-player-wrapper ls-areactive-wrapper">
        <div className="video-player-frame">
          <div className="video-frame-corners" />
          <div className="video-player-hud">
            <div className="rec-badge"><div className="rec-dot" />{active ? "ON AIR" : "READY"}</div>
            <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: "var(--text-dim)" }}>{hud}</div>
          </div>

          <div className="ls-areactive-stage">
            <MinatoParticles emotion={emotion} audio={levelsRef} speaking={speaking} />
          </div>

          <div className="video-player-scanlines" />

          {active && <div className="video-player-caption">{caption}</div>}

          {stage === "idle" && (
            <button type="button" className="ls-areactive-play" onClick={start}>
              ▶ {playLabel}
            </button>
          )}
        </div>
      </div>

      {stage === "ended" || stage === "failed" ? (
        <div className="video-player-end">
          <div className="video-player-end-text">
            {stage === "failed" ? "（音声は準備中）" : endText}
          </div>
          <div className="actions">
            <button className="btn" onClick={onComplete}>
              {ctaLabel}
              <span className="btn-jp">{ctaJp}</span>
            </button>
          </div>
        </div>
      ) : (
        <button className="ls-skip" type="button" onClick={onComplete}>
          スキップ ▶
        </button>
      )}

      <audio ref={audioElRef} src={src} preload="auto" onEnded={handleEnded} onError={handleError} />
    </div>
  );
}
