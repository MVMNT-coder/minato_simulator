"use client";
// ============================================================
// MinatoAvatar3D — three.js による 3D デジタルヒューマン(ミナト)
// プロシージャルに造形したスタイライズド・ヒューマンのバスト。
// アイドルモーション(呼吸/揺れ/瞬き/視線) + 感情表情 + 発話。
// 背景は透過(後方の ProceduralBackground を活かす)。
// ※ GLBFLoader/VRM モデルを読み込めば写実化できる構造。
// ============================================================
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { parseEmotion, type Emotion } from "./visual";

const ACCENT = 0xd06030;
const CLAY = 0xc8ccd0; // 寒色寄りニュートラルグレー
const CLAY_DARK = 0x3b4046;
const FEATURE = 0x2f343a;

interface Props {
  emotion?: string;
  speaking?: boolean;
}

// 感情 → 表情ターゲット
function emotionTargets(e: Emotion) {
  switch (e) {
    case "happy": return { mouth: 1.0, eye: 0.9, brow: -0.05, browY: 0.02, tilt: 0.02 };
    case "calm": return { mouth: 0.45, eye: 0.78, brow: 0.0, browY: 0.0, tilt: 0.0 };
    case "curious": return { mouth: 0.25, eye: 1.0, brow: -0.12, browY: 0.03, tilt: 0.06 };
    case "uneasy": return { mouth: -0.2, eye: 1.0, brow: 0.18, browY: -0.02, tilt: -0.03 };
    case "sad": return { mouth: -0.7, eye: 0.72, brow: 0.24, browY: -0.03, tilt: -0.05 };
    default: return { mouth: 0.12, eye: 0.85, brow: 0.05, browY: 0.0, tilt: 0.0 };
  }
}

export default function MinatoAvatar3D({ emotion, speaking }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const emotionRef = useRef<Emotion>(parseEmotion(emotion));
  const speakingRef = useRef<boolean>(!!speaking);

  useEffect(() => { emotionRef.current = parseEmotion(emotion); }, [emotion]);
  useEffect(() => { speakingRef.current = !!speaking; }, [speaking]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.0, 5.9);
    camera.lookAt(0, 0.7, 0);

    // ---- ライティング(クールなスタジオ + アクセントのリムライト) ----
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa0a6, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(2.5, 4.2, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0006;
    key.shadow.radius = 5;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdfe3e8, 0.5);
    fill.position.set(-3, 1.5, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(ACCENT, 1.4);
    rim.position.set(-2.5, 2.5, -3);
    scene.add(rim);

    const clayMat = new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.72, metalness: 0.04 });
    const hairMat = new THREE.MeshStandardMaterial({ color: CLAY_DARK, roughness: 0.5, metalness: 0.1 });
    const featMat = new THREE.MeshStandardMaterial({ color: FEATURE, roughness: 0.5 });
    const specMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.2 });

    // ---- ルート/バスト ----
    const root = new THREE.Group();
    scene.add(root);

    // 接地シャドウ(プラットフォーム面)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.75;
    ground.receiveShadow = true;
    root.add(ground);

    // 肩・胴(なで肩のバスト)
    const torso = new THREE.Mesh(new THREE.SphereGeometry(1.1, 48, 36), clayMat);
    torso.scale.set(1.42, 0.82, 0.9);
    torso.position.y = 0.02;
    torso.castShadow = true;
    root.add(torso);
    // 鎖骨〜胸元の面取り(前面をわずかに平らに)
    const chest = new THREE.Mesh(new THREE.SphereGeometry(0.7, 36, 28), clayMat);
    chest.scale.set(1.5, 0.5, 0.4);
    chest.position.set(0, 0.5, 0.55);
    chest.castShadow = true;
    root.add(chest);
    // 首
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.42, 28), clayMat);
    neck.position.y = 0.96;
    neck.castShadow = true;
    root.add(neck);

    // ---- 頭部グループ(揺れ・傾き) ----
    const head = new THREE.Group();
    head.position.y = 1.5;
    root.add(head);

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, 56, 44), clayMat);
    skull.scale.set(0.94, 1.06, 0.96);
    skull.castShadow = true;
    head.add(skull);

    // 顎(下部を少しシャープに)
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.44, 40, 32), clayMat);
    jaw.scale.set(0.86, 0.7, 0.82);
    jaw.position.set(0, -0.34, 0.04);
    jaw.castShadow = true;
    head.add(jaw);

    // 鼻(頭ローカル座標: skull中心=原点)
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 16), clayMat);
    nose.scale.set(0.8, 1.1, 1.2);
    nose.position.set(0, -0.02, 0.6);
    head.add(nose);

    // 耳
    const earL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 16), clayMat);
    earL.scale.set(0.5, 1, 0.7);
    earL.position.set(-0.58, 0.02, 0.04);
    const earR = earL.clone();
    earR.position.x = 0.58;
    head.add(earL, earR);

    // 髪(後頭〜頭頂のキャップ)
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.64, 44, 36, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
    hair.scale.set(0.99, 1.14, 1.02);
    hair.position.y = 0.03;
    hair.rotation.x = -0.16;
    hair.castShadow = true;
    head.add(hair);
    // 前髪(額のバング)
    const bang = new THREE.Mesh(new THREE.SphereGeometry(0.5, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.4), hairMat);
    bang.scale.set(1.06, 0.7, 1.06);
    bang.position.set(0, 0.34, 0.16);
    bang.rotation.x = 0.5;
    head.add(bang);

    // 目(白目 + 瞳 + ハイライト)。blink 用に group.scale.y を操作。
    const makeEye = (x: number) => {
      const g = new THREE.Group();
      const white = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 20), new THREE.MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.3 }));
      white.scale.set(1, 0.72, 0.6);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 16), featMat);
      iris.position.set(0, 0, 0.06);
      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), specMat);
      spec.position.set(0.02, 0.02, 0.1);
      g.add(white, iris, spec);
      g.position.set(x, 0.07, 0.52);
      head.add(g);
      return { g, iris };
    };
    const eyeL = makeEye(-0.22);
    const eyeR = makeEye(0.22);

    // 眉
    const BROW_Y = 0.22;
    const makeBrow = (x: number) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.028, 0.05), featMat);
      b.position.set(x, BROW_Y, 0.54);
      head.add(b);
      return b;
    };
    const browL = makeBrow(-0.22);
    const browR = makeBrow(0.22);

    // 口(スマイル/フラウンを scale.y の符号で表現)
    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.16, 0, 0),
      new THREE.Vector3(0, 0.09, 0),
      new THREE.Vector3(0.16, 0, 0),
    );
    const mouth = new THREE.Mesh(new THREE.TubeGeometry(mouthCurve, 20, 0.022, 8, false), featMat);
    mouth.position.set(0, -0.2, 0.55);
    head.add(mouth);

    // こめかみの観測マーカー(HUD調・発光)
    const markMat = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.8, roughness: 0.4 });
    const markL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), markMat);
    markL.position.set(-0.64, 0.08, 0.12);
    const markR = markL.clone();
    markR.position.x = 0.64;
    head.add(markL, markR);

    // 観測プラットフォーム(足元のホログラム調リング)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.15, 1.22, 64),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.75;
    root.add(ring);
    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.73, 48),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.2, side: THREE.DoubleSide }),
    );
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = -0.75;
    root.add(ring2);

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
    const cur = { mouth: 0.1, eye: 0.85, brow: 0.05, browY: 0, tilt: 0 };
    let blinkT = 2 + Math.random() * 3;
    let eyeLid = 1; // 1=開 0=閉
    let raf = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // 目標へイージング
      const tgt = emotionTargets(emotionRef.current);
      const k = 1 - Math.pow(0.001, dt); // 時間ベースの補間
      cur.mouth += (tgt.mouth - cur.mouth) * k;
      cur.eye += (tgt.eye - cur.eye) * k;
      cur.brow += (tgt.brow - cur.brow) * k;
      cur.browY += (tgt.browY - cur.browY) * k;
      cur.tilt += (tgt.tilt - cur.tilt) * k;

      // アイドル: 呼吸・揺れ・視線
      root.position.y = Math.sin(t * 1.2) * 0.015;
      torso.scale.y = 0.9 + Math.sin(t * 1.2) * 0.006;
      head.rotation.y = Math.sin(t * 0.5) * 0.14;
      head.rotation.x = cur.tilt + Math.sin(t * 0.37) * 0.04;
      head.rotation.z = Math.sin(t * 0.3) * 0.02;
      // 視線(瞳のわずかな移動)
      const lookX = Math.sin(t * 0.6) * 0.02;
      eyeL.iris.position.x = lookX;
      eyeR.iris.position.x = lookX;

      // 瞬き
      blinkT -= dt;
      if (blinkT <= 0) {
        eyeLid = 0;
        if (blinkT < -0.12) { eyeLid = 1; blinkT = 3 + Math.random() * 3.5; }
      }
      const openY = cur.eye * (0.35 + 0.65 * eyeLid);
      eyeL.g.scale.y = openY;
      eyeR.g.scale.y = openY;

      // 眉
      browL.position.y = BROW_Y + cur.browY;
      browR.position.y = BROW_Y + cur.browY;
      browL.rotation.z = cur.brow;
      browR.rotation.z = -cur.brow;

      // 口(感情 + 発話)
      let my = cur.mouth;
      if (speakingRef.current) my *= 1 + 0.4 * Math.sin(t * 18);
      mouth.scale.y = Math.abs(my) < 0.06 ? 0.06 * Math.sign(my || 1) : my;

      // プラットフォームの回転
      ring.rotation.z = t * 0.15;
      ring2.rotation.z = -t * 0.22;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // ---- クリーンアップ ----
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="foi-avatar3d" aria-label="ミナト(3D)" role="img" />;
}
