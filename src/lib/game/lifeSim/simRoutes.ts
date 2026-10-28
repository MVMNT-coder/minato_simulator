// ============================================================
// simRoutes — フェーズ(ステートマシン) ⇄ URLルートの対応
// 各段階が固有URLを持つ:
//   /sim/intro            名前入力 + 導入テキスト
//   /sim/opening          音声反応オープニング
//   /sim/age/[age]        各年代の章(制度選択〜アルバム、価値観処理)
//   /sim/transition/[age] 時間の遷移([age]→次の年代)
//   /sim/ending           エンディング
// ============================================================
import type { LifeAge, LifeSimPhase } from "./types";

export function routeForState(phase: LifeSimPhase, age: LifeAge): string {
  switch (phase) {
    case "name_entry":
    case "opening_intro":
    case "intro":
      return "/sim/intro";
    case "opening_video":
      return "/sim/opening";
    case "age_transition":
      return `/sim/transition/${age}`;
    case "ending":
      return "/sim/ending";
    // age_intro / regime_select / world_reveal / daily_scene / conflict /
    // question / value_input / ai_processing / minato_response /
    // life_consequence / album_update
    default:
      return `/sim/age/${age}`;
  }
}
