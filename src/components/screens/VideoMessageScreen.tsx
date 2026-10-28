"use client";
import { useGameStore } from "@/store/gameStore";
import { useGameNavigation } from "@/lib/game/useGameNavigation";
import { useRef, useState, useCallback } from "react";
import { withBase } from "@/lib/basePath";

export default function VideoMessageScreen() {
  const { navigateToPhase } = useGameNavigation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleEnded = useCallback(() => {
    setEnded(true);
  }, []);

  const handlePlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleContinue = () => {
    // Skip step 0 (video letter) since we just showed it
    // AgePlayScreen will start at step 1 (document viewer)
    useGameStore.setState({ currentStepIndex: 1 });
    navigateToPhase("agePlay");
  };

  return (
    <div className="screen dlg-screen">
      <div className="video-player-wrapper">
        <div className="video-player-frame">
          <div className="video-frame-corners" />

          {/* HUD overlay */}
          <div className="video-player-hud">
            <div className="rec-badge"><div className="rec-dot" />REC</div>
            <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: "var(--text-dim)" }}>
              FROM 2046
            </div>
          </div>

          {/* Actual video */}
          <video
            ref={videoRef}
            className="video-player-element"
            src={withBase("/videos/opening.mp4")}
            autoPlay
            playsInline
            onEnded={handleEnded}
            onPlay={handlePlay}
          />

          {/* Scan line overlay */}
          <div className="video-player-scanlines" />

          {/* Caption below video */}
          {playing && !ended && (
            <div className="video-player-caption">
              MINATO / AGE 20 / 2046
            </div>
          )}
        </div>
      </div>

      {/* Continue button — shown after video ends */}
      {ended && (
        <div className="video-player-end">
          <div className="video-player-end-text">
            ミナトからの映像が途切れた。
            <br />
            しかし、彼の問いかけはまだ残っている。
          </div>
          <div className="actions">
            <button className="btn" onClick={handleContinue}>
              続ける
              <span className="btn-jp">CONTINUE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
