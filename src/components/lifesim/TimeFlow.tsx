"use client";
// ============================================================
// TimeFlow — 年代遷移用「時間が流れる」全画面アニメーション(Canvas2D)
// 横に流れる光の筋 + ドリフト粒子。カラーは既存パレット。
// ============================================================
import { useEffect, useRef } from "react";

const ACCENT = "235, 97, 0";

export default function TimeFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // 横に流れる筋
    const streaks = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.05 + Math.random() * 0.22,
      sp: 0.15 + Math.random() * 0.6,
      a: 0.05 + Math.random() * 0.22,
      accent: Math.random() < 0.4,
    }));

    let raf = 0;
    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const s of streaks) {
        // 右へ流れる(時間が進む)
        const x = (s.x + t * s.sp) % 1.3 - 0.15;
        const y = s.y * H;
        const len = s.len * W;
        const col = s.accent ? ACCENT : "40, 44, 50";
        const grad = ctx.createLinearGradient(x * W, y, x * W + len, y);
        grad.addColorStop(0, `rgba(${col}, 0)`);
        grad.addColorStop(0.5, `rgba(${col}, ${s.a})`);
        grad.addColorStop(1, `rgba(${col}, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.accent ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(x * W, y);
        ctx.lineTo(x * W + len, y);
        ctx.stroke();
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="foi-timeflow-canvas" aria-hidden="true" />;
}
