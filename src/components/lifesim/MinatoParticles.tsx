"use client";
// ============================================================
// MinatoParticles — GLBを使わない「パーティクル表現」のミナト
// 点群が散開⇄形成を繰り返しながら、人物バストの形をかたどる。
// three.js 標準API + MeshSurfaceSampler で人体サーフェスを点にサンプリング。
// 感情で発光色・形成の安定度・脈動が変化。呼吸/揺れあり。
// ============================================================
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { parseEmotion, type Emotion } from "./visual";

const ACCENT = new THREE.Color(0xd06030);
const WHITE = new THREE.Color(0xffffff);

// 音声解析からの駆動値(すべて 0..1)。外部の Analyser ループが毎フレーム書き込む。
export interface AudioLevels {
  level: number;  // 全体音量
  bass: number;   // 低音帯
  treble: number; // 高音帯
}

interface Props {
  emotion?: string;
  speaking?: boolean;
  // 0..1 を渡すと、値に応じて散開→人型の形成度を駆動する(回答が進むほど形づくる)
  formProgress?: number;
  // 音声反応: current に値が入っている間はオーディオビジュアル駆動になる
  audio?: { current: AudioLevels | null };
}

// 感情 → 形成の安定度(base/amp)・脈動速度・発光の暖かさ
function emotionParams(e: Emotion) {
  switch (e) {
    case "happy": return { formBase: 0.93, formAmp: 0.05, speed: 1.1, warmth: 0.95 };
    case "calm": return { formBase: 0.95, formAmp: 0.035, speed: 0.8, warmth: 0.7 };
    case "curious": return { formBase: 0.9, formAmp: 0.07, speed: 1.3, warmth: 0.82 };
    case "uneasy": return { formBase: 0.83, formAmp: 0.1, speed: 1.6, warmth: 0.45 };
    case "sad": return { formBase: 0.88, formAmp: 0.05, speed: 0.6, warmth: 0.3 };
    default: return { formBase: 0.91, formAmp: 0.06, speed: 1.0, warmth: 0.6 };
  }
}

export default function MinatoParticles({ emotion, speaking, formProgress, audio }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const emoRef = useRef<Emotion>(parseEmotion(emotion));
  const speakRef = useRef<boolean>(!!speaking);
  const progRef = useRef<number | undefined>(formProgress);
  const audioRef = useRef<{ current: AudioLevels | null } | undefined>(audio);

  useEffect(() => { emoRef.current = parseEmotion(emotion); }, [emotion]);
  useEffect(() => { speakRef.current = !!speaking; }, [speaking]);
  useEffect(() => { progRef.current = formProgress; }, [formProgress]);
  useEffect(() => { audioRef.current = audio; }, [audio]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.15, 4.0);
    camera.lookAt(0, 1.02, 0);

    const group = new THREE.Group();
    scene.add(group);

    // ---- 人体バストのサーフェスを点にサンプリング(頭/首/肩胴) ----
    const sampleInto = (geo: THREE.BufferGeometry, count: number, arr: Float32Array, offset: number) => {
      const mesh = new THREE.Mesh(geo);
      const sampler = new MeshSurfaceSampler(mesh).build();
      const p = new THREE.Vector3();
      for (let i = 0; i < count; i++) {
        sampler.sample(p);
        arr[(offset + i) * 3] = p.x;
        arr[(offset + i) * 3 + 1] = p.y;
        arr[(offset + i) * 3 + 2] = p.z;
      }
      geo.dispose();
    };

    const headGeo = new THREE.SphereGeometry(0.6, 24, 18);
    headGeo.scale(0.94, 1.08, 0.96); headGeo.translate(0, 1.5, 0);
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.26, 0.42, 16, 1);
    neckGeo.translate(0, 0.98, 0);
    const torsoGeo = new THREE.SphereGeometry(1.05, 24, 16);
    torsoGeo.scale(1.35, 0.8, 0.9); torsoGeo.translate(0, 0.05, 0);

    const N_HEAD = 2200, N_NECK = 420, N_TORSO = 2600;
    const N = N_HEAD + N_NECK + N_TORSO;
    const target = new Float32Array(N * 3);
    sampleInto(headGeo, N_HEAD, target, 0);
    sampleInto(neckGeo, N_NECK, target, N_HEAD);
    sampleInto(torsoGeo, N_TORSO, target, N_HEAD + N_NECK);

    // 散開位置(球状に散らす) + シマー用の位相
    const scatter = new Float32Array(N * 3);
    const phase = new Float32Array(N);
    const cx = 0, cy = 0.9, cz = 0;
    for (let i = 0; i < N; i++) {
      const u = Math.random(), v = Math.random();
      const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
      const r = 1.0 + Math.random() * 1.1;
      scatter[i * 3] = cx + r * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = cy + r * Math.cos(ph) * 0.9;
      scatter[i * 3 + 2] = cz + r * Math.sin(ph) * Math.sin(th);
      phase[i] = Math.random() * Math.PI * 2;
    }

    // 口元の重み(発話時に顔の下半分を強めに動かす)
    const mouthW = new Float32Array(N);
    const mx = 0, my = 1.4, mz = 0.5; // 口のおおよその位置(ローカル)
    for (let i = 0; i < N; i++) {
      const dx = target[i * 3] - mx;
      const dy = target[i * 3 + 1] - my;
      const dz = target[i * 3 + 2] - mz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      mouthW[i] = Math.max(0, 1 - d / 0.55); // 口元ほど1に近い
    }

    // 現在位置(初期は散開)
    const positions = new Float32Array(N * 3);
    positions.set(scatter);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: ACCENT.clone(),
      size: 0.022,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    group.add(points);

    // 足元の観測リング
    const ringGeo = new THREE.RingGeometry(1.05, 1.08, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT.clone(), transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2; ring.position.y = -0.78;
    group.add(ring);

    // ---- リサイズ ----
    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- アニメーション ----
    const clock = new THREE.Clock();
    let raf = 0;
    const cur = { formBase: 0.82, formAmp: 0.11, speed: 1.0, warmth: 0.6 };
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const tmp = new THREE.Color();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const tgt = emotionParams(emoRef.current);
      const k = 1 - Math.pow(0.0006, dt);
      // 進捗が渡されていれば、回答が進むほど散開→人型へ形成
      const prog = progRef.current;
      const formBaseTarget =
        prog != null ? 0.3 + 0.68 * THREE.MathUtils.clamp(prog, 0, 1) : tgt.formBase;
      const formAmpTarget = prog != null ? 0.02 : tgt.formAmp;
      cur.formBase += (formBaseTarget - cur.formBase) * k;
      cur.formAmp += (formAmpTarget - cur.formAmp) * k;
      cur.speed += (tgt.speed - cur.speed) * k;
      cur.warmth += (tgt.warmth - cur.warmth) * k;

      // 発話/音声エンベロープ。audio があれば音量で、無ければ speaking 相当で駆動。
      const aud = audioRef.current?.current ?? null;
      let talk: number;
      let bass = 0, treble = 0;
      if (aud) {
        talk = THREE.MathUtils.clamp(aud.level, 0, 1);
        bass = THREE.MathUtils.clamp(aud.bass, 0, 1);
        treble = THREE.MathUtils.clamp(aud.treble, 0, 1);
      } else {
        talk = speakRef.current
          ? THREE.MathUtils.clamp(
              0.35 + 0.65 * Math.abs(Math.sin(t * 3.6) * 0.7 + Math.sin(t * 2.1 + 1.2) * 0.3),
              0, 1,
            )
          : 0;
      }
      // 形成度(0..1): ゆっくり散開⇄形成を繰り返す = モーフィング
      const form = THREE.MathUtils.clamp(
        cur.formBase + cur.formAmp * Math.sin(t * 0.4 * cur.speed),
        0, 1,
      );
      const shimmer = (1 - form) * 0.15 + 0.008; // 形成が緩いほど揺らぎ大(控えめ=クッキリ)
      const freq = 0.7 + talk * 1.8 + treble * 2.4; // 高音ほど細かく震える

      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const ph = phase[i];
        // 発話時: 口元ほど強く揺れる
        const jig = shimmer + talk * (0.04 + 0.16 * mouthW[i]) + treble * 0.05 * mouthW[i];
        const sx = Math.sin(t * freq + ph) * jig;
        const sy = Math.sin(t * (freq * 0.85) + ph * 1.7) * jig;
        const sz = Math.cos(t * (freq * 0.92) + ph) * jig;
        arr[i3] = scatter[i3] + (target[i3] - scatter[i3]) * form + sx;
        arr[i3 + 1] = scatter[i3 + 1] + (target[i3 + 1] - scatter[i3 + 1]) * form + sy;
        arr[i3 + 2] = scatter[i3 + 2] + (target[i3 + 2] - scatter[i3 + 2]) * form + sz;
      }
      posAttr.needsUpdate = true;

      // 発光色/明滅(発話・音声で明るく・大きく)。低音は鼓動のように脈打つ。
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.1 * cur.speed);
      tmp.copy(ACCENT).lerp(WHITE, Math.min(0.7, 0.15 * pulse * cur.warmth + talk * 0.4 + bass * 0.2));
      material.color.copy(tmp);
      material.opacity = Math.min(1, (0.72 + 0.25 * form) * (0.65 + 0.35 * cur.warmth) + talk * 0.18);
      material.size = 0.018 + 0.005 * pulse + talk * 0.02 + bass * 0.02;
      ringMat.opacity = 0.18 + 0.12 * pulse + talk * 0.12 + bass * 0.15;

      // アイドル: 揺れ + 呼吸(ゆったり)。低音で軽く拡縮(鼓動)。
      group.rotation.y = Math.sin(t * 0.24) * 0.13;
      group.position.y = Math.sin(t * 0.8) * 0.02;
      group.scale.setScalar(1 + talk * 0.008 + bass * 0.03);
      ring.rotation.z = t * 0.08;

      renderer.render(scene, camera);
    };
    tick();

    // ---- クリーンアップ ----
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="foi-avatar3d" role="img" aria-label="ミナト(パーティクル表現)" />;
}
