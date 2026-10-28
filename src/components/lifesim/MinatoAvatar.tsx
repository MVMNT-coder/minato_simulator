"use client";
// ============================================================
// MinatoAvatar — クレイ調のミナト(SVG)。アイドルモーション:
// 呼吸(breathing) / 瞬き(blink) / 視線(pupil drift) / 軽い姿勢変化(sway)。
// 感情に応じて表情(眉・目・口)が変わる。背景画像は使わない。
// ※将来 three.js のクレイモデルに差し替え可能な独立コンポーネント。
// ============================================================
import { useMemo } from "react";
import { parseEmotion, type Emotion } from "./visual";

interface Props {
  emotion?: string; // persona.currentEmotion(自由記述)
  age?: number;
  speaking?: boolean;
}

// 感情ごとの表情パラメータ(クールめ: 頬の赤みは控えめ、目はやや細く)
function faceParams(e: Emotion) {
  switch (e) {
    case "happy":
      return { mouth: "M 88 150 Q 110 166 132 150", eyeH: 9, browY: -2, browRot: 0, cheek: 0.28 };
    case "calm":
      return { mouth: "M 92 152 Q 110 158 128 152", eyeH: 8, browY: 0, browRot: 0, cheek: 0.14 };
    case "curious":
      return { mouth: "M 101 153 Q 110 150 119 153", eyeH: 12, browY: -4, browRot: -8, cheek: 0.1 };
    case "uneasy":
      return { mouth: "M 92 155 Q 110 151 128 155", eyeH: 12, browY: -2, browRot: 11, cheek: 0 };
    case "sad":
      return { mouth: "M 92 157 Q 110 150 128 157", eyeH: 7, browY: 2, browRot: 15, cheek: 0 };
    default:
      return { mouth: "M 93 153 Q 110 156 127 153", eyeH: 9, browY: 0, browRot: 3, cheek: 0.08 };
  }
}

export default function MinatoAvatar({ emotion, speaking }: Props) {
  const e = useMemo(() => parseEmotion(emotion), [emotion]);
  const f = faceParams(e);

  return (
    <div className="foi-avatar" data-emotion={e}>
      <div className="foi-avatar-sway">
        <div className="foi-avatar-breath">
          <svg viewBox="0 0 220 300" className="foi-avatar-svg" role="img" aria-label="ミナト">
            <defs>
              {/* 寒色寄りのニュートラルグレー(クールな質感) */}
              <linearGradient id="clayBody" x1="30%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#eef1f3" />
                <stop offset="55%" stopColor="#c8ccd0" />
                <stop offset="100%" stopColor="#9aa0a6" />
              </linearGradient>
              <linearGradient id="clayHead" x1="28%" y1="6%" x2="82%" y2="100%">
                <stop offset="0%" stopColor="#f1f3f5" />
                <stop offset="55%" stopColor="#ccd0d4" />
                <stop offset="100%" stopColor="#a0a6ac" />
              </linearGradient>
              <filter id="claySoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="1.1" />
              </filter>
              <filter id="platGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <radialGradient id="cheekG" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(235,97,0,0.5)" />
                <stop offset="100%" stopColor="rgba(235,97,0,0)" />
              </radialGradient>
              <radialGradient id="platG" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(235,97,0,0.22)" />
                <stop offset="100%" stopColor="rgba(235,97,0,0)" />
              </radialGradient>
            </defs>

            {/* 観測プラットフォーム(ホログラム調のリング) */}
            <ellipse cx="110" cy="288" rx="80" ry="16" fill="url(#platG)" filter="url(#platGlow)" />
            <ellipse cx="110" cy="288" rx="66" ry="12" fill="none" stroke="rgba(235,97,0,0.4)" strokeWidth="1" />
            <ellipse cx="110" cy="288" rx="40" ry="7" fill="none" stroke="rgba(235,97,0,0.22)" strokeWidth="1" />

            {/* 胴体(シャープめのシルエット) */}
            <path
              d="M 62 292 C 58 236 74 202 110 200 C 146 202 162 236 158 292 Z"
              fill="url(#clayBody)"
            />
            {/* 胴のハイライト */}
            <path
              d="M 82 290 C 78 240 86 214 104 208"
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="5" strokeLinecap="round" filter="url(#claySoft)"
            />
            {/* リムライト(アクセント: 右エッジ) */}
            <path
              d="M 158 292 C 162 236 146 202 110 200"
              fill="none" stroke="rgba(235,97,0,0.35)" strokeWidth="2" strokeLinecap="round"
            />

            {/* 首 */}
            <rect x="99" y="182" width="22" height="24" rx="9" fill="#b4b9be" />

            {/* 頭(ややシャープな卵形) */}
            <path
              d="M 110 50 C 148 50 168 82 168 118 C 168 158 144 186 110 186 C 76 186 52 158 52 118 C 52 82 72 50 110 50 Z"
              fill="url(#clayHead)"
            />
            {/* 頭のリムライト(右) */}
            <path
              d="M 168 118 C 168 158 144 186 110 186"
              fill="none" stroke="rgba(235,97,0,0.32)" strokeWidth="2" strokeLinecap="round"
            />
            {/* 頭頂ハイライト */}
            <ellipse cx="90" cy="82" rx="20" ry="14" fill="rgba(255,255,255,0.35)" filter="url(#claySoft)" />

            {/* こめかみの観測マーカー(HUD調) */}
            <g stroke="rgba(235,97,0,0.55)" strokeWidth="1.4">
              <line x1="46" y1="118" x2="52" y2="118" />
              <line x1="168" y1="118" x2="174" y2="118" />
            </g>

            {/* 頬(クールめに控えめ) */}
            <circle cx="78" cy="138" r="11" fill="url(#cheekG)" opacity={f.cheek} />
            <circle cx="142" cy="138" r="11" fill="url(#cheekG)" opacity={f.cheek} />

            {/* 眉(細く) */}
            <g stroke="#5b6169" strokeWidth="3.2" strokeLinecap="round">
              <line x1="80" y1={106 + f.browY} x2="98" y2={106 + f.browY} transform={`rotate(${-f.browRot} 89 ${106 + f.browY})`} />
              <line x1="122" y1={106 + f.browY} x2="140" y2={106 + f.browY} transform={`rotate(${f.browRot} 131 ${106 + f.browY})`} />
            </g>

            {/* 目 + 瞬き + 視線 */}
            <g className="foi-eyes">
              <g>
                <ellipse cx="89" cy="124" rx="8" ry={f.eyeH / 2} fill="#f4f6f8" />
                <circle className="foi-pupil" cx="89" cy="124" r="4" fill="#2f343a" />
                <circle cx="90.6" cy="122.4" r="1.1" fill="rgba(255,255,255,0.9)" />
              </g>
              <g>
                <ellipse cx="131" cy="124" rx="8" ry={f.eyeH / 2} fill="#f4f6f8" />
                <circle className="foi-pupil" cx="131" cy="124" r="4" fill="#2f343a" />
                <circle cx="132.6" cy="122.4" r="1.1" fill="rgba(255,255,255,0.9)" />
              </g>
              {/* まぶた(瞬き用) */}
              <rect className="foi-lid" x="80" y="113" width="18" height="13" rx="5" fill="url(#clayHead)" />
              <rect className="foi-lid" x="122" y="113" width="18" height="13" rx="5" fill="url(#clayHead)" />
            </g>

            {/* 口(感情) */}
            <path
              d={f.mouth}
              fill="none" stroke="#5b6169" strokeWidth="3.4" strokeLinecap="round"
              className={speaking ? "foi-mouth foi-mouth-speaking" : "foi-mouth"}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
