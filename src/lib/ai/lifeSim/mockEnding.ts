// ============================================================
// エンディング モック (§13) — AI未接続時
// 蓄積された人格・制度履歴・記憶から、人生全体を組み立てる。
// 単純なハッピー/バッドにせず、幸福と後悔を併記する。
// ============================================================
import type { EndingData, MinatoPersona } from "@/lib/game/lifeSim/types";
import { AXIS_LABEL, dominantAxes } from "@/lib/game/lifeSim/persona";

export function generateEndingMock(persona: MinatoPersona): EndingData {
  const ranked = dominantAxes(persona.valueProfile);
  const core = ranked[0];
  const secondary = ranked[1];
  const weakest = ranked[ranked.length - 1];

  const coreLabel = AXIS_LABEL[core.axis];
  const secondaryLabel = AXIS_LABEL[secondary.axis];
  const weakestLabel = AXIS_LABEL[weakest.axis];

  const regimes = persona.regimeHistory;
  const regimeNames = regimes.map((r) => `${r.age}歳「${r.regimeName}」`).join("、");

  const positiveMemory =
    persona.memories.find((m) => m.tone === "positive") ??
    persona.memories.find((m) => m.tone === "neutral") ??
    persona.memories[0];
  const hardMemory =
    persona.memories.find((m) => m.tone === "negative" || m.tone === "ambivalent") ??
    persona.memories[persona.memories.length - 1];

  return {
    currentState:
      "100歳になったミナトは、窓辺の椅子で、昔ほど急がずに時間を過ごしている。声は少しかすれ、間が長くなった。それでも、まなざしはまだ何かを問うている。",
    reflection:
      `長かったようで、短かった。${core.value >= 50 ? `僕はずっと、${coreLabel}を手放せない人間だったみたいだ。` : `僕はずっと、${coreLabel}が薄いことに引け目を感じていた。`}` +
      "いろんな制度が来て、去っていった。そのたびに、少しずつ自分の形が分かっていった気がする。",
    unchangedValue:
      `若い頃から変わらなかったのは、${coreLabel}への気持ちだと思う。何歳になっても、そこだけは譲れなかった。`,
    changedValue:
      `変わったのは、${weakestLabel}や${secondaryLabel}との付き合い方だ。昔は${weakestLabel}なんて要らないと思っていた。でも年を取るほど、それが自分に足りなかったものだと分かってきた。同じ言葉でも、20歳と100歳では、まるで意味が違って響く。`,
    regimeImpact: regimes.length
      ? `振り返ると、僕が選んだ制度——${regimeNames}——は、どれも僕を守ってくれた。でも守られるたびに、そこからこぼれ落ちる感情があった。制度が悪かったわけじゃない。ただ、制度の外にも僕の人生はあった。`
      : "制度は僕の暮らしを形づくった。それでも、そこに書かれていない時間こそが、僕の人生だった気がする。",
    happiness: positiveMemory
      ? `幸せだったのは、${positiveMemory.description} ああいう瞬間が、確かにあった。`
      : "何気ない朝に、余った時間をただ眺めていられたこと。あれは幸せだったと、今なら言える。",
    regret: hardMemory
      ? `後悔がないと言えば、嘘になる。${hardMemory.description} もう少し違うやり方があったかもしれない。`
      : "もっと早く、なぜそれを選ぶのかを、自分の言葉にしておけばよかった。",
    questionToPlayer:
      "ひとつ、君に聞いてもいいかな。君は今、自分の選択に理由を持っている? その理由は、誰かに手渡せるものだろうか。",
    closingWords:
      `不思議だね。君は僕の人生を育てているつもりだったかもしれない。でも今になって思うんだ——${coreLabel}を大切にし続けた僕を選びながら、君はきっと、自分が未来に残したい価値観を選んでいたんじゃないかな。ありがとう。君と過ごした百年だった。`,
  };
}
