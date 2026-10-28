"use client";
// ============================================================
// LifeTree — ミナトの「価値観の変容」を家系図(左→右)でノード化
// 各年代:  選んだ制度 → 問いへの回答 → (回答から)価値観の変化ノードが上下に分岐
// 太い幹 = 実際に歩んだ道 / 破線 = 選ばなかった制度 / 実線細枝 = 価値観の変容
// ドラッグで移動 / スクロール(ピンチ)で拡大縮小(x/y 自由操作)
// ============================================================
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { getRegimes } from "@/lib/game/lifeSim/regimes";
import { ageYear } from "@/lib/game/lifeSim/narration";
import type {
  AlbumEntry,
  RegimeHistoryEntry,
  ValueJourneyEntry,
} from "@/lib/game/lifeSim/types";

interface Props {
  regimeHistory: RegimeHistoryEntry[];
  album: AlbumEntry[];
  journey?: ValueJourneyEntry[];
}

// ---- ワールド座標(px) 横向きレイアウト ----
const LEFT_PAD = 90;    // ルートノードのX
const CY = 560;         // 幹の中心Y(横ライン)
const AGE_SPAN = 1040;  // 年代(制度ノード)間の横間隔
const SUB = 340;        // 年代内サブノードの横間隔
const ROW = 160;        // 枝(選ばなかった制度)の縦間隔
const VROW = 138;       // 価値観の変容ノードの縦間隔
const WORLD_H = 1120;
const RIGHT_PAD = 130;

// ノード幅(接続線の端点計算用)
const ROOT_W = 130;
const REGIME_W = 232;
const ANSWER_W = 262;
const VALUE_W = 286;
const ALT_W = 188;
const SHIFT_W = 168;
const BUS_GAP = 170; // 制度ノード中心から左の母線までの距離

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// 選ばなかった制度の縦位置(中心から上下交互に広げる)
function altY(j: number): number {
  const side = j % 2 === 0 ? -1 : 1;
  const rank = Math.floor(j / 2) + 1;
  return CY + side * rank * ROW;
}
// 価値観の変容ノードの縦位置(回答から上下交互に分岐)
function shiftY(k: number): number {
  const side = k % 2 === 0 ? -1 : 1;
  const rank = Math.floor(k / 2) + 1;
  return CY + side * rank * VROW;
}

type EdgeKind = "main" | "alt" | "shift";
interface Line {
  x1: number; y1: number; x2: number; y2: number; kind: EdgeKind;
}

export default function LifeTree({ regimeHistory, journey }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ s: 0.6, tx: 0, ty: 0 });
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const n = regimeHistory.length;
  const regimeX = useCallback((i: number) => LEFT_PAD + AGE_SPAN * (i + 1), []);
  const journeyMap = new Map<number, ValueJourneyEntry>();
  (journey ?? []).forEach((j) => journeyMap.set(j.age, j));

  // 最終ノードのXからワールド幅を算出
  const lastHasJ = n > 0 && journeyMap.has(regimeHistory[n - 1].age);
  const WORLD_W =
    regimeX(n - 1) + (lastHasJ ? SUB * 2 + SHIFT_W / 2 : REGIME_W / 2) + RIGHT_PAD;

  // 高さにフィットさせて左端から表示(時系列を左→右へ辿る)
  const fit = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const h = el.clientHeight || 1;
    const s = clamp((h - 40) / WORLD_H, 0.22, 1.1);
    setView({ s, tx: 30, ty: (h - WORLD_H * s) / 2 });
  }, []);

  useLayoutEffect(() => { fit(); }, [fit, n]);

  const zoomAt = useCallback((clientX: number, clientY: number, factor: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    setView((p) => {
      const ns = clamp(p.s * factor, 0.2, 2.6);
      const k = ns / p.s;
      return { s: ns, tx: px - (px - p.tx) * k, ty: py - (py - p.ty) * k };
    });
  }, []);

  // ホイール: Ctrl(ピンチ)=ズーム / それ以外=パン
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.01));
      } else {
        setView((p) => ({ ...p, tx: p.tx - e.deltaX, ty: p.ty - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: ReactPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    setView((p) => ({ ...p, tx: d.tx + (e.clientX - d.x), ty: d.ty + (e.clientY - d.y) }));
  };
  const onPointerUp = () => { drag.current = null; };

  const zoomBtn = (factor: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  };

  if (!n) return null;

  // ---- 接続線 ----
  const lines: Line[] = [];
  let prevExit = { x: LEFT_PAD, w: ROOT_W }; // 直前の年代の末端(初回はルート), y は常に CY
  for (let i = 0; i < n; i++) {
    const age = regimeHistory[i].age;
    const j = journeyMap.get(age);
    const rx = regimeX(i);
    const alts = getRegimes(age).filter((a) => a.id !== regimeHistory[i].regimeId);
    const childYs = [CY, ...alts.map((_, k) => altY(k))];
    const busX = rx - BUS_GAP;

    // 親(直前の末端) → 母線(幹, 水平)
    lines.push({ x1: prevExit.x + prevExit.w / 2, y1: CY, x2: busX, y2: CY, kind: "main" });
    // 母線(縦) — 制度選択の分岐点
    lines.push({ x1: busX, y1: Math.min(...childYs), x2: busX, y2: Math.max(...childYs), kind: "alt" });
    // 各子へ(水平): 選んだ制度=幹 / それ以外=枝
    lines.push({ x1: busX, y1: CY, x2: rx - REGIME_W / 2, y2: CY, kind: "main" });
    alts.forEach((_, k) => {
      const y = altY(k);
      lines.push({ x1: busX, y1: y, x2: rx - ALT_W / 2, y2: y, kind: "alt" });
    });

    if (j) {
      const ax = rx + SUB;   // 回答ノード中心
      const vx = rx + SUB * 2; // 価値観ノード中心
      // 制度 → 回答(幹)
      lines.push({ x1: rx + REGIME_W / 2, y1: CY, x2: ax - ANSWER_W / 2, y2: CY, kind: "main" });

      if (j.shifts.length > 0) {
        // 回答 → 価値観の変容(上下に分岐)
        const bx = ax + ANSWER_W / 2 + 46; // 分岐点(縦母線)
        const ys = j.shifts.map((_, k) => shiftY(k));
        lines.push({ x1: ax + ANSWER_W / 2, y1: CY, x2: bx, y2: CY, kind: "main" });
        lines.push({ x1: bx, y1: Math.min(CY, ...ys), x2: bx, y2: Math.max(CY, ...ys), kind: "shift" });
        ys.forEach((y) => {
          lines.push({ x1: bx, y1: y, x2: vx - SHIFT_W / 2, y2: y, kind: "shift" });
        });
      } else {
        // 変化が小さい場合は幹上に1ノード
        lines.push({ x1: ax + ANSWER_W / 2, y1: CY, x2: vx - VALUE_W / 2, y2: CY, kind: "main" });
      }
      prevExit = { x: ax, w: ANSWER_W };
    } else {
      prevExit = { x: rx, w: REGIME_W };
    }
  }

  return (
    <div className="ls-tree2">
      <div className="ls-tree2-legend">
        <span className="ls-tree-lg ls-tree-lg-main"><i /> 歩んだ道</span>
        <span className="ls-tree-lg ls-tree-lg-shift"><i /> 価値観の変容</span>
        <span className="ls-tree-lg ls-tree-lg-alt"><i /> 選ばなかった制度</span>
        <span className="ls-tree2-hint">ドラッグで移動 ・ スクロール/ピンチで拡大縮小</span>
      </div>

      <div className="ls-tree2-controls">
        <button type="button" onClick={() => zoomBtn(1.25)} aria-label="拡大">＋</button>
        <button type="button" onClick={() => zoomBtn(0.8)} aria-label="縮小">−</button>
        <button type="button" onClick={fit} aria-label="リセット">⟳</button>
      </div>

      <div
        ref={wrapRef}
        className="ls-tree2-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="ls-tree2-canvas"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
          }}
        >
          <svg className="ls-tree2-edges" width={WORLD_W} height={WORLD_H}>
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                className={`ls-tree2-edge ${l.kind}`}
              />
            ))}
          </svg>

          {/* ルート(スタート) */}
          <div className="ls-tree2-root" style={{ left: LEFT_PAD, top: CY }}>
            ミナト誕生
          </div>

          {/* 年代ごとのノード連鎖 */}
          {regimeHistory.map((r, i) => {
            const rx = regimeX(i);
            const j = journeyMap.get(r.age);
            const alts = getRegimes(r.age).filter((a) => a.id !== r.regimeId);
            const vx = rx + SUB * 2;
            return (
              <div key={r.age}>
                {/* ① 選んだ制度 */}
                <div className="ls-tree2-node chosen regime" style={{ left: rx, top: CY }}>
                  <span className="ls-tree2-dot" />
                  <div className="ls-tree2-tag">選んだ制度</div>
                  <div className="ls-tree2-age">{r.age}歳 · {ageYear(r.age)}</div>
                  <div className="ls-tree2-regime">{r.regimeName}</div>
                </div>

                {/* 選ばなかった制度(枝) */}
                {alts.map((a, k) => (
                  <div
                    key={a.id}
                    className="ls-tree2-node alt"
                    style={{ left: rx, top: altY(k) }}
                  >
                    <div className="ls-tree2-alt-tag">選ばなかった道</div>
                    <div className="ls-tree2-regime">{a.name}</div>
                  </div>
                ))}

                {j && (
                  <>
                    {/* ② 問いへの回答 */}
                    <div className="ls-tree2-node chosen answer" style={{ left: rx + SUB, top: CY }}>
                      <div className="ls-tree2-tag">問いへの回答</div>
                      <div className="ls-tree2-answer">
                        {j.choiceSummary || "——（言葉にしなかった）"}
                      </div>
                      {j.interpretedValues.length > 0 && (
                        <div className="ls-tree2-interp">「{j.interpretedValues[0]}」</div>
                      )}
                    </div>

                    {/* ③ 回答から分岐する「価値観の変容」ノード群 */}
                    {j.shifts.length > 0 ? (
                      j.shifts.map((s, k) => (
                        <div
                          key={s.axis}
                          className={`ls-tree2-node vshift ${s.delta > 0 ? "up" : "down"}`}
                          style={{ left: vx, top: shiftY(k) }}
                        >
                          <span className="ls-tree2-vshift-label">{s.label}</span>
                          <span className="ls-tree2-vshift-arrow">{s.delta > 0 ? "↑" : "↓"}</span>
                        </div>
                      ))
                    ) : (
                      <div className="ls-tree2-node chosen value" style={{ left: vx, top: CY }}>
                        <div className="ls-tree2-tag">価値観の変化</div>
                        <div className="ls-tree2-answer">大きな揺れはなかった</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
