"use client";
// ============================================================
// ExplainAnimation — このツールを紹介する ~1分の自動再生アニメ (/sim/explain)
// タイムラインで章を自動送り。既存のデザイントークン/パーティクルを再利用。
// スキップ/リプレイ/最後に「はじめる」CTA。
// ============================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MinatoParticles from "./MinatoParticles";

// 浮遊ダスト(シネマティックな粒子)。決定的に配置。
const DUST = Array.from({ length: 22 }, (_, i) => {
  const a = (i * 137.5) % 100;      // 擬似的な散らばり(黄金角)
  const b = (i * 71.3) % 100;
  const size = 1.5 + ((i * 13) % 5);
  const dur = 9 + ((i * 7) % 11);
  const delay = -((i * 3) % 12);
  const drift = ((i % 2 === 0 ? 1 : -1) * (8 + (i % 5) * 5));
  return { left: a, top: b, size, dur, delay, drift };
});

// 各章の尺(ms)。合計 ~60秒。最後の CTA 章は自動送りしない。
const SCENES: { id: string; dur: number }[] = [
  { id: "title", dur: 7000 },
  { id: "concept", dur: 8500 },
  { id: "step1", dur: 8000 },
  { id: "step2", dur: 8000 },
  { id: "step3", dur: 8500 },
  { id: "timeflow", dur: 9000 },
  { id: "lifetree", dur: 8000 },
  { id: "cta", dur: Infinity },
];

const TIMED_TOTAL = SCENES.reduce((s, x) => s + (isFinite(x.dur) ? x.dur : 0), 0);
const AGES = [20, 40, 60, 100];

export default function ExplainAnimation() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1(全体)
  const startRef = useRef<number>(0);
  const rafRef = useRef(0);

  // タイムライン駆動(開始 or リプレイで呼ぶ)
  const runTimeline = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const boundaries: number[] = [];
    let acc = 0;
    for (const s of SCENES) {
      acc += isFinite(s.dur) ? s.dur : 0;
      boundaries.push(acc);
    }
    startRef.current = performance.now();
    setIdx(0);
    setProgress(0);
    const loop = () => {
      const elapsed = performance.now() - startRef.current;
      setProgress(Math.min(1, elapsed / TIMED_TOTAL));
      let i = boundaries.findIndex((b) => elapsed < b);
      if (i === -1) i = SCENES.length - 1; // CTA
      setIdx(i);
      if (elapsed < TIMED_TOTAL) rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    runTimeline();
    return () => cancelAnimationFrame(rafRef.current);
  }, [runTimeline]);

  const scene = SCENES[idx].id;
  const isCta = scene === "cta";
  const dust = useMemo(() => DUST, []);

  return (
    <div className={`ls-explain scene-${scene}`}>
      {/* シネマティック背景FX(常時) */}
      <div className="ls-explain-fx" aria-hidden>
        <div className="ls-explain-aurora" />
        <div className="ls-explain-aurora two" />
        <div className="ls-explain-grid" />
        <div className="ls-explain-dust">
          {dust.map((d, i) => (
            <span
              key={i}
              style={{
                left: `${d.left}%`,
                top: `${d.top}%`,
                width: d.size,
                height: d.size,
                // @ts-expect-error custom props
                "--dur": `${d.dur}s`,
                "--delay": `${d.delay}s`,
                "--drift": `${d.drift}px`,
              }}
            />
          ))}
        </div>
        <div className="ls-explain-scan" />
        <div className="ls-explain-vignette" />
      </div>

      {/* シネマ レターボックス */}
      <div className="ls-explain-bar top" aria-hidden />
      <div className="ls-explain-bar bottom" aria-hidden />

      {/* 上部プログレス */}
      <div className="ls-explain-progress">
        <span style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>

      <div className="ls-explain-brand">FUTURE VALUE ARCHIVE</div>

      {/* シーン切替の光スイープ */}
      <div className="ls-explain-sweep" key={`sweep-${scene}`} aria-hidden />

      {/* 章(キーで入場アニメを再生) */}
      <div className="ls-explain-stage" key={scene}>
        {scene === "title" && (
          <div className="ls-ex-scene ls-ex-title">
            <div className="ls-ex-kicker">MINATO 2100</div>
            <h1 className="ls-ex-h1 kinetic">
              <span className="kw" style={{ animationDelay: "0.15s" }}>未来人ミナトの人生を、</span>
              <br />
              <span className="kw em" style={{ animationDelay: "0.5s" }}>あなたの価値観</span>
              <span className="kw" style={{ animationDelay: "0.75s" }}>で育てる。</span>
            </h1>
            <div className="ls-ex-titleline" />
            <div className="ls-ex-sub">2100年をめぐる、価値観の育成シミュレーション</div>
          </div>
        )}

        {scene === "concept" && (
          <div className="ls-ex-scene ls-ex-split">
            <div className="ls-ex-avatar">
              <MinatoParticles emotion="curious" speaking />
            </div>
            <div className="ls-ex-copy">
              <div className="ls-ex-kicker"> CONCEPT</div>
              <p className="ls-ex-lead ls-ex-lead-1line">
                これは、ひとりの未来人「<em>ミナト</em>」。
              </p>
              <p className="ls-ex-body">
                2046年に生まれ、100歳まで生きる。<br />
                あなたの選択と価値観が、ミナトの生き方を少しずつ形づくっていく。
              </p>
            </div>
          </div>
        )}

        {scene === "step1" && (
          <div className="ls-ex-scene ls-ex-step">
            <div className="ls-ex-stepnum">①</div>
            <h2 className="ls-ex-h2">未来の社会制度を、ひとつ選ぶ</h2>
            <div className="ls-ex-cards">
              <span className="ls-ex-card is-lit">ベーシックインカム</span>
              <span className="ls-ex-card">AI統治</span>
              <span className="ls-ex-card">community 共同体</span>
            </div>
            <p className="ls-ex-note">その制度が根づいた世界で、ミナトは暮らしはじめる。</p>
          </div>
        )}

        {scene === "step2" && (
          <div className="ls-ex-scene ls-ex-step">
            <div className="ls-ex-stepnum">②</div>
            <h2 className="ls-ex-h2">いろんな角度の問いに、直感で答える</h2>
            <div className="ls-ex-quiz">
              <div className="ls-ex-q">「迷ったとき、どうする？」</div>
              <div className="ls-ex-opts">
                <span className="ls-ex-opt is-pick">自分で決める</span>
                <span className="ls-ex-opt">誰かに相談する</span>
                <span className="ls-ex-opt">時間をおく</span>
              </div>
            </div>
            <p className="ls-ex-note">決めるのは「何を大切にするか」。答えが価値観になる。</p>
          </div>
        )}

        {scene === "step3" && (
          <div className="ls-ex-scene ls-ex-split">
            <div className="ls-ex-avatar">
              <MinatoParticles emotion="calm" speaking />
            </div>
            <div className="ls-ex-copy">
              <div className="ls-ex-stepnum small">③</div>
              <h2 className="ls-ex-h2">AIがミナトの人格に反映する</h2>
              <div className="ls-ex-install">
                <span className="ls-ex-axis up">自律性 ↑</span>
                <span className="ls-ex-axis up">好奇心 ↑</span>
                <span className="ls-ex-axis down">安定志向 ↓</span>
              </div>
              <p className="ls-ex-body">
                あなたの答えが解釈され、ミナトの価値観として積み重なっていく。
              </p>
            </div>
          </div>
        )}

        {scene === "timeflow" && (
          <div className="ls-ex-scene ls-ex-timeflow">
            <div className="ls-ex-kicker">TIME PASSES</div>
            <h2 className="ls-ex-h2">20歳 から 100歳 まで、時を進める</h2>
            <div className="ls-ex-ages">
              {AGES.map((a, i) => (
                <span key={a} className="ls-ex-age" style={{ animationDelay: `${0.5 + i * 1.2}s` }}>
                  {a}<i>歳</i>
                </span>
              ))}
            </div>
            <p className="ls-ex-note">
              残した価値観は、次の年代のミナトの生き方に影を落とす。
            </p>
          </div>
        )}

        {scene === "lifetree" && (
          <div className="ls-ex-scene ls-ex-tree">
            <div className="ls-ex-kicker">LIFE VISUALIZED</div>
            <h2 className="ls-ex-h2">価値観の変容が、一本の樹になる</h2>
            <svg className="ls-ex-treeviz" viewBox="0 0 520 220" aria-hidden>
              <line className="ex-trunk" x1="40" y1="110" x2="490" y2="110" />
              <line className="ex-branch" x1="150" y1="110" x2="200" y2="60" />
              <line className="ex-branch" x1="150" y1="110" x2="200" y2="165" />
              <line className="ex-branch" x1="320" y1="110" x2="370" y2="55" />
              <line className="ex-branch" x1="320" y1="110" x2="370" y2="160" />
              <circle className="ex-node root" cx="40" cy="110" r="9" />
              <circle className="ex-node" cx="150" cy="110" r="11" />
              <circle className="ex-node" cx="320" cy="110" r="11" />
              <circle className="ex-node" cx="470" cy="110" r="11" />
              <circle className="ex-leaf" cx="200" cy="60" r="6" />
              <circle className="ex-leaf" cx="200" cy="165" r="6" />
              <circle className="ex-leaf" cx="370" cy="55" r="6" />
              <circle className="ex-leaf" cx="370" cy="160" r="6" />
            </svg>
            <p className="ls-ex-note">選んだ道も、選ばなかった道も、まとめて振り返れる。</p>
          </div>
        )}

        {isCta && (
          <div className="ls-ex-scene ls-ex-cta">
            <div className="ls-ex-kicker">START YOUR ARCHIVE</div>
            <h1 className="ls-ex-h1 kinetic">
              <span className="kw" style={{ animationDelay: "0.15s" }}>さあ、あなたの価値観で</span>
              <br />
              <span className="kw em" style={{ animationDelay: "0.45s" }}>ミナトの100年</span>
              <span className="kw" style={{ animationDelay: "0.7s" }}>を育てよう。</span>
            </h1>
            <div className="ls-ex-actions">
              <Link className="btn" href="/sim">
                はじめる
                <span className="btn-jp">START ARCHIVE</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
