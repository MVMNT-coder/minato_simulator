"use client";
// ============================================================
// LifeSimStage — フェーズ(ステートマシン)に応じた画面描画
// 初期化とURL同期は useSimSync が担う(SimRuntime 参照)。
// ここは phase を見て「今この瞬間に出す画面」を選ぶだけ。
// ============================================================
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLifeSimStore } from "@/store/lifeSimStore";
import { getRegimes } from "@/lib/game/lifeSim/regimes";
import { getValueQuiz } from "@/lib/game/lifeSim/valueQuiz";
import {
  INTRO_LINES,
  ageBackgroundLines,
  ageYear,
} from "@/lib/game/lifeSim/narration";
import { LIFE_AGE_SEQUENCE } from "@/lib/game/lifeSim/types";

import NameEntry from "./NameEntry";
import OpeningIntro from "./OpeningIntro";
import OpeningVideo from "./OpeningVideo";
import ObservationShell from "./ObservationShell";
import ScenarioSplit from "./ScenarioSplit";
import ProceduralBackground from "./ProceduralBackground";
import StatusLoader from "./StatusLoader";
import LineReader from "./LineReader";
import RegimeSelect from "./RegimeSelect";
import ReadingPanel from "./ReadingPanel";
import ValueQuizPanel from "./ValueQuizPanel";
import GapMontage from "./GapMontage";
import TimeFlow from "./TimeFlow";
import ValueInstall from "./ValueInstall";
import EndingPanel from "./EndingPanel";
import { markSessionLeaving } from "@/lib/game/lifeSim/sessionExit";

export default function LifeSimStage() {
  const router = useRouter();
  const phase = useLifeSimStore((s) => s.phase);
  const currentAge = useLifeSimStore((s) => s.currentAge);
  const persona = useLifeSimStore((s) => s.persona);
  const scene = useLifeSimStore((s) => s.currentScene);
  const response = useLifeSimStore((s) => s.currentResponse);
  const gap = useLifeSimStore((s) => s.currentGap);
  const album = useLifeSimStore((s) => s.album);
  const ending = useLifeSimStore((s) => s.ending);
  const playerName = useLifeSimStore((s) => s.playerName);
  const isProcessing = useLifeSimStore((s) => s.isProcessing);

  const [quizProgress, setQuizProgress] = useState(0);

  const submitName = useLifeSimStore((s) => s.submitName);
  const advancePhase = useLifeSimStore((s) => s.advancePhase);
  const selectRegime = useLifeSimStore((s) => s.selectRegime);
  const submitValueQuiz = useLifeSimStore((s) => s.submitValueQuiz);
  const beginAgeTransition = useLifeSimStore((s) => s.beginAgeTransition);
  const proceedToNextAge = useLifeSimStore((s) => s.proceedToNextAge);
  const reset = useLifeSimStore((s) => s.reset);

  const nextAge = useMemo(() => {
    const idx = LIFE_AGE_SEQUENCE.indexOf(currentAge);
    return idx >= 0 && idx < LIFE_AGE_SEQUENCE.length - 1
      ? LIFE_AGE_SEQUENCE[idx + 1]
      : null;
  }, [currentAge]);

  // ---- 導入・結末は独立画面 ----
  if (phase === "name_entry") {
    return <NameEntry key="name_entry" onSubmit={(n) => submitName(n)} />;
  }
  if (phase === "opening_intro") {
    return <OpeningIntro key="opening_intro" playerName={playerName} onComplete={advancePhase} />;
  }
  if (phase === "opening_video") {
    return <OpeningVideo key="opening_video" onComplete={advancePhase} />;
  }
  if (phase === "ending") {
    if (!ending) {
      return (
        <ObservationShell>
          <StatusLoader />
        </ObservationShell>
      );
    }
    return (
      <EndingPanel
        ending={ending}
        album={album}
        onRestart={() => {
          markSessionLeaving();
          reset();
          router.push("/");
        }}
      />
    );
  }

  // ---- 制度選択: 画面はこの選択のみ(それだけ)を表示 ----
  if (phase === "regime_select") {
    return (
      <div className="foi-solo">
        <ProceduralBackground profile={persona.valueProfile} />
        <div className="foi-solo-inner">
          {isProcessing ? (
            <StatusLoader />
          ) : (
            <RegimeSelect
              age={currentAge}
              year={ageYear(currentAge)}
              regimes={getRegimes(currentAge)}
              onSelect={(id) => selectRegime(id)}
            />
          )}
        </div>
      </div>
    );
  }

  // ---- シナリオ提示/回答: 左=アバター / 右=本文・回答 ----
  if (
    phase === "world_reveal" ||
    phase === "daily_scene" ||
    phase === "conflict" ||
    phase === "question" ||
    phase === "value_input"
  ) {
    if (!scene) {
      return (
        <ScenarioSplit>
          <StatusLoader />
        </ScenarioSplit>
      );
    }
    const isQuiz = phase === "question" || phase === "value_input";
    return (
      <ScenarioSplit speaking={isQuiz} formProgress={isQuiz ? quizProgress : undefined}>
        {phase === "world_reveal" && (
          <ReadingPanel
            key="world"
            variant="system"
            boot
            kicker={`${ageYear(currentAge)} / こんな世界になった`}
            title={scene.sceneTitle}
            paragraphs={[scene.worldDescription]}
            onNext={advancePhase}
          />
        )}
        {phase === "daily_scene" && (
          <ReadingPanel
            key="daily"
            variant="narrator"
            kicker="ミナトの毎日"
            paragraphs={[scene.dailyLife]}
            onNext={advancePhase}
          />
        )}
        {phase === "conflict" && (
          <ReadingPanel
            key="conflict"
            variant="consequence"
            kicker="いいところ と、ちょっと困ること"
            paragraphs={[`いいところ: ${scene.benefit}`, `困っちゃうところ: ${scene.conflict}`]}
            onNext={advancePhase}
            nextLabel="ミナトの話を聞く"
            nextJp="LISTEN"
          />
        )}
        {isQuiz && (
          <ValueQuizPanel
            key={`quiz_${currentAge}_${scene.regimeId}`}
            quiz={getValueQuiz(currentAge, scene.regimeId)}
            minatoLines={scene.minatoLines}
            onSubmit={(answers, note) => submitValueQuiz(answers, note)}
            onProgress={setQuizProgress}
          />
        )}
      </ScenarioSplit>
    );
  }

  // ---- 年代遷移: 全画面の「時間が流れる」演出 + 生成シナリオ ----
  if (phase === "age_transition") {
    if (nextAge) {
      const previewLines = [
        { speaker: "SYSTEM", text: `あなたがここで残した価値観が、${nextAge}歳のミナトの生き方に静かに影を落とす。` },
      ];
      const lines = gap ? [...gap.lines, ...previewLines] : [];
      return (
        <div className="foi-timeflow">
          <TimeFlow />
          <div className="foi-timeflow-content">
            {!gap || isProcessing ? (
              <div className="foi-timeflow-load">
                <div className="foi-timeflow-era">
                  {currentAge}歳 <span className="ls-gap-arrow">→</span> {nextAge}歳
                </div>
                <div className="foi-timeflow-dates">
                  {ageYear(currentAge)} — {ageYear(nextAge)}
                </div>
                <div className="foi-timeflow-txt">時間が流れています…</div>
              </div>
            ) : (
              <GapMontage
                key={`trans_${currentAge}`}
                fromAge={currentAge}
                toAge={nextAge}
                fromYear={ageYear(currentAge)}
                toYear={ageYear(nextAge)}
                headline={gap.headline}
                lines={lines}
                onComplete={() => proceedToNextAge()}
              />
            )}
          </div>
        </div>
      );
    }
    // 100歳(次の年代なし): 最終遷移
    return (
      <div className="foi-solo">
        <ProceduralBackground profile={persona.valueProfile} />
        <div className="foi-solo-inner">
          <ReadingPanel
            key="trans"
            variant="transition"
            kicker="TIME PASSES"
            title="人生の終わりへ"
            paragraphs={["ミナトは100歳を迎えた。これまでの価値観が、最後の物語を形づくる。"]}
            onNext={() => proceedToNextAge()}
            nextLabel="人生を振り返る"
            nextJp="LIFE REVIEW"
          />
        </div>
      </div>
    );
  }

  // ---- 価値観のインストール処理: 全画面演出(完了後アバターへ戻る) ----
  if (phase === "ai_processing") {
    return (
      <div className="ls-install-screen">
        <ProceduralBackground profile={persona.valueProfile} />
        <ValueInstall emotion={persona.currentEmotion} />
      </div>
    );
  }

  // ---- 観測フェーズ: 下部 Dialogue Layer の内容を選ぶ ----
  const dock = (() => {
    if (isProcessing) return <StatusLoader />;

    switch (phase) {
      case "intro": // legacy fallback
        return <LineReader key="intro" lines={INTRO_LINES} onComplete={advancePhase} />;

      case "age_intro":
        return (
          <LineReader
            key={`ageintro_${currentAge}`}
            lines={ageBackgroundLines(currentAge)}
            onComplete={advancePhase}
            boot
          />
        );

      case "minato_response":
        if (!response) return <StatusLoader />;
        return (
          <LineReader key={`mresp_${currentAge}`} lines={response.minatoResponse.map((t) => ({ speaker: "MINATO", text: t }))} onComplete={advancePhase} />
        );

      case "life_consequence":
        if (!response) return <StatusLoader />;
        return (
          <ReadingPanel
            key="conseq"
            variant="consequence"
            kicker="それから、ミナトは…"
            paragraphs={[response.lifeConsequence]}
            extra={
              <div className="ls-interpreted">
                <div className="ls-interpreted-label">ミナトに残った“想い”</div>
                <ul>
                  {response.interpretedValues.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </div>
            }
            onNext={advancePhase}
          />
        );

      case "album_update":
        if (!response) return <StatusLoader />;
        return (
          <ReadingPanel
            key="album"
            variant="album"
            kicker="アルバムに記録"
            paragraphs={[response.albumEntry]}
            extra={
              <div className="ls-memory-saved">
                <span className="ls-memory-tag">MEMORY SAVED</span>
                {response.memoryAdded}
              </div>
            }
            onNext={() => beginAgeTransition()}
            nextLabel="時を進める"
            nextJp="ADVANCE TIME"
          />
        );

      default:
        return (
          <div className="foi-dock-msg">
            <div className="lead">未知のフェーズ: {phase}</div>
            <button className="btn" onClick={() => router.push("/")}>戻る</button>
          </div>
        );
    }
  })();

  return (
    <ObservationShell speaking={phase === "minato_response"}>
      {dock}
    </ObservationShell>
  );
}
