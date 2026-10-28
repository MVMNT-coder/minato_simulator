"use client";
// ============================================================
// MinatoMesh — GLB を使わない「メッシュ表現」のミナト(three.js)
// ワイヤーフレーム + 頂点ポイントで人物バストを手続き生成。
// 観測OSに合う“デジタル再構成”の見た目。呼吸/揺れ + 感情で発光が変化。
// ============================================================
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { parseEmotion, type Emotion } from "./visual";

const ACCENT = new THREE.Color(0xd06030);
const LINE = new THREE.Color(0x2b2f36);

interface Props {
  emotion?: string;
  speaking?: boolean;
}

// 感情 → 発光の強さ・色みの寄り(0=グレー寄り,1=アクセント寄り)・脈動速度・頭の傾き
function emotionParams(e: Emotion) {
  switch (e) {
    case "happy": return { warmth: 0.95, pulse: 1.2, tilt: 0.04 };
    case "calm": return { warmth: 0.7, pulse: 0.8, tilt: 0.02 };
    case "curious": return { warmth: 0.8, pulse: 1.4, tilt: 0.05 };
    case "uneasy": return { warmth: 0.45, pulse: 1.7, tilt: -0.03 };
    case "sad": return { warmth: 0.3, pulse: 0.6, tilt: -0.05 };
    default: return { warmth: 0.6, pulse: 1.0, tilt: 0 };
  }
}

export default function MinatoMesh({ emotion, speaking }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const emoRef = useRef<Emotion>(parseEmotion(emotion));
  const speakRef = useRef<boolean>(!!speaking);

  useEffect(() => { emoRef.current = parseEmotion(emotion); }, [emotion]);
  useEffect(() => { speakRef.current = !!speaking; }, [speaking]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.18, 4.0);
    camera.lookAt(0, 1.05, 0);

    const avatar = new THREE.Group();
    scene.add(avatar);

    // 部品(ワイヤーフレーム + 頂点ポイント)を作る
    const lineMats: THREE.LineBasicMaterial[] = [];
    const pointMats: THREE.PointsMaterial[] = [];
    const makePart = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number],
      scale: [number, number, number],
      pointSize: number,
    ) => {
      const g = new THREE.Group();
      const wire = new THREE.WireframeGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ color: LINE.clone(), transparent: true, opacity: 0.42 });
      lineMats.push(lineMat);
      g.add(new THREE.LineSegments(wire, lineMat));
      const ptMat = new THREE.PointsMaterial({ color: ACCENT.clone(), size: pointSize, sizeAttenuation: true, transparent: true, opacity: 0.9 });
      pointMats.push(ptMat);
      g.add(new THREE.Points(geo, ptMat));
      g.position.set(...pos);
      g.scale.set(...scale);
      avatar.add(g);
      return { g, wire, geo };
    };

    // 頭(低ポリ) / 首 / 肩・胴
    const head = makePart(new THREE.IcosahedronGeometry(0.6, 2), [0, 1.5, 0], [0.94, 1.08, 0.96], 0.03);
    makePart(new THREE.CylinderGeometry(0.2, 0.26, 0.42, 10, 1), [0, 0.98, 0], [1, 1, 1], 0.022);
    makePart(new THREE.SphereGeometry(1.05, 16, 10), [0, 0.05, 0], [1.35, 0.8, 0.9], 0.02);

    // 足元の観測リング(メッシュ的ライン)
    const ringGeo = new THREE.RingGeometry(1.05, 1.08, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT.clone(), transparent: true, opacity: 0.28, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.78;
    avatar.add(ring);

    // ---- リサイズ ----
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- アニメーション ----
    const clock = new THREE.Clock();
    let raf = 0;
    const cur = { warmth: 0.6, pulse: 1, tilt: 0 };
    const tmpColor = new THREE.Color();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const tgt = emotionParams(emoRef.current);
      const k = 1 - Math.pow(0.0008, dt);
      cur.warmth += (tgt.warmth - cur.warmth) * k;
      cur.pulse += (tgt.pulse - cur.pulse) * k;
      cur.tilt += (tgt.tilt - cur.tilt) * k;

      // アイドル: 揺れ + 呼吸
      avatar.rotation.y = Math.sin(t * 0.4) * 0.16;
      avatar.rotation.x = cur.tilt + Math.sin(t * 0.33) * 0.02;
      avatar.position.y = Math.sin(t * 1.2) * 0.02;
      head.g.scale.y = 1.08 + Math.sin(t * 1.2) * 0.004;

      // 脈動(発話中は強め)
      const speak = speakRef.current ? 1.6 : 1;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 * cur.pulse * speak);
      // 線色: グレー↔アクセントを warmth で補間、脈動で少し明滅
      for (const m of lineMats) {
        tmpColor.copy(LINE).lerp(ACCENT, cur.warmth * 0.5);
        m.color.copy(tmpColor);
        m.opacity = 0.34 + 0.16 * pulse;
      }
      for (const m of pointMats) {
        tmpColor.copy(ACCENT).lerp(new THREE.Color(0xffffff), 0.12 * pulse);
        m.color.copy(tmpColor);
        m.opacity = (0.6 + 0.4 * pulse) * (0.5 + 0.5 * cur.warmth);
      }
      ringMat.opacity = 0.2 + 0.14 * pulse;
      ring.rotation.z = t * 0.15;

      renderer.render(scene, camera);
    };
    tick();

    // ---- クリーンアップ ----
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const any = o as THREE.Mesh & { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
        any.geometry?.dispose?.();
        const mat = any.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="foi-avatar3d" role="img" aria-label="ミナト(メッシュ表現)" />;
}
