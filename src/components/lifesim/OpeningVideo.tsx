"use client";
// ============================================================
// OpeningVideo — 2046年のミナトからのメッセージ(オープニング)
// mp4 に代えて、任意の音声に反応するパーティクルのオーディオビジュアル表現。
// 音声は /audio/opening.mp3(未配置ならフォールバック)。
// ============================================================
import AudioReactiveMinato from "./AudioReactiveMinato";
import { withBase } from "@/lib/basePath";

interface Props {
  onComplete: () => void;
}

export default function OpeningVideo({ onComplete }: Props) {
  return (
    <AudioReactiveMinato
      src={withBase("/audio/opening.wav")}
      hud="FROM 2046"
      caption="MINATO / AGE 20 / 2046"
      emotion="curious"
      loadingText="映像を受信しています"
      playLabel="映像を再生"
      endText={<>映像はここでおしまい。<br />さあ、ミナトの人生をはじめよう！</>}
      ctaLabel="はじめる！"
      ctaJp="START ARCHIVE"
      onComplete={onComplete}
    />
  );
}
