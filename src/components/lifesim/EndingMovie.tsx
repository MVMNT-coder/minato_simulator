"use client";
// ============================================================
// EndingMovie — 100歳ミナトのエンディング(映像の代わり)
// 任意の音声に反応するパーティクルのオーディオビジュアル表現。
// 音声は /audio/ending.mp3(未配置ならフォールバック)。
// ============================================================
import AudioReactiveMinato from "./AudioReactiveMinato";
import { withBase } from "@/lib/basePath";

interface Props {
  onComplete: () => void;
}

export default function EndingMovie({ onComplete }: Props) {
  return (
    <AudioReactiveMinato
      src={withBase("/audio/ending.wav")}
      hud="A LIFE OF MINATO"
      caption="MINATO / AGE 100 / 2126"
      emotion="calm"
      loadingText="記録を再生しています"
      playLabel="映像を再生"
      endText={<>ミナトの人生が、いま閉じた。<br />歩んできた道を、見わたしてみよう。</>}
      ctaLabel="人生を見わたす"
      ctaJp="VISUALIZE LIFE"
      onComplete={onComplete}
    />
  );
}
