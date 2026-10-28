"use client";
// ============================================================
// ProceduralBackground — 人格状態に応じて変化する抽象ビジュアル
// 背景画像は使わず Canvas 2D でリアルタイム生成する。
// カラーは既存パレット(アクセント/グレー)に準拠。
// ============================================================
import { useEffect, useRef } from "react";
import type { ValueProfile } from "@/lib/game/lifeSim/types";
import { backgroundMode, type BgMode } from "./visual";

const ACCENT = [235, 97, 0]; // --accent #EB6100

function rgba(c: number[], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

export default function ProceduralBackground({ profile }: { profile: ValueProfile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<BgMode>(backgroundMode(profile));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    modeRef.current = backgroundMode(profile);
  }, [profile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- 各モチーフの静的シード ----
    const particles = Array.from({ length: 46 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 2.5,
      sp: 0.2 + Math.random() * 0.5,
      ph: Math.random() * Math.PI * 2,
      i,
    }));
    const nodes = Array.from({ length: 20 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
    }));
    const blobs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.18 + Math.random() * 0.22,
      ph: i,
    }));

    const start = performance.now();

    const drawParticles = (t: number) => {
      for (const p of particles) {
        const y = (p.y + t * 0.00004 * p.sp) % 1;
        const x = p.x + Math.sin(t * 0.0003 + p.ph) * 0.02;
        ctx.beginPath();
        ctx.arc(x * W, y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(ACCENT, 0.12 + 0.06 * Math.sin(t * 0.001 + p.ph));
        ctx.fill();
      }
    };

    const drawGrid = (t: number) => {
      const gap = 46;
      const off = (t * 0.01) % gap;
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba([255, 255, 255], 0.05);
      for (let x = -off; x < W; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -off; y < H; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // sweeping accent line
      const sx = (t * 0.05) % (W + 200) - 100;
      ctx.strokeStyle = rgba(ACCENT, 0.14);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, H);
      ctx.stroke();
    };

    const drawNetwork = (t: number) => {
      for (const n of nodes) {
        n.x += n.vx * 0.4;
        n.y += n.vy * 0.4;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W;
          const dy = (nodes[i].y - nodes[j].y) * H;
          const d = Math.hypot(dx, dy);
          if (d < 220) {
            ctx.strokeStyle = rgba(ACCENT, 0.1 * (1 - d / 220));
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(ACCENT, 0.28);
        ctx.fill();
      }
      void t;
    };

    const drawWaveform = (t: number) => {
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 3; k++) {
        const amp = 26 + k * 10;
        const yBase = H * 0.5;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const y =
            yBase +
            Math.sin(x * 0.006 + t * 0.001 + k) * amp * (0.6 + 0.4 * Math.sin(t * 0.0006));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(ACCENT, 0.09 - k * 0.02);
        ctx.stroke();
      }
    };

    const drawFluid = (t: number) => {
      for (const b of blobs) {
        const x = (b.x + Math.sin(t * 0.0002 + b.ph) * 0.06) * W;
        const y = (b.y + Math.cos(t * 0.00017 + b.ph) * 0.06) * H;
        const r = b.r * Math.min(W, H);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rgba(ACCENT, 0.06));
        g.addColorStop(1, rgba(ACCENT, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawGeometry = (t: number) => {
      const cx = W / 2;
      const cy = H / 2;
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= 5; ring++) {
        const R = ring * Math.min(W, H) * 0.08;
        const sides = 6;
        const rot = t * 0.0002 * (ring % 2 === 0 ? -1 : 1);
        ctx.beginPath();
        for (let s = 0; s <= sides; s++) {
          const a = rot + (s / sides) * Math.PI * 2;
          const x = cx + Math.cos(a) * R;
          const y = cy + Math.sin(a) * R;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(ACCENT, 0.08);
        ctx.stroke();
      }
    };

    const render = () => {
      const t = performance.now() - start;
      ctx.clearRect(0, 0, W, H);
      switch (modeRef.current) {
        case "particles": drawParticles(t); break;
        case "grid": drawGrid(t); break;
        case "network": drawNetwork(t); break;
        case "waveform": drawWaveform(t); break;
        case "geometry": drawGeometry(t); break;
        case "fluid":
        default: drawFluid(t); break;
      }
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="foi-bg-canvas" aria-hidden="true" />;
}
