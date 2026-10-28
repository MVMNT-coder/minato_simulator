// ============================================================
// Layer 1 モック — 価値観入力の解釈と人格更新 (AI未接続時)
// ------------------------------------------------------------
// 決定論的でありながら、選択肢だけでなく「自由記述の内容」で
// 結果が変わることを保証する (§4-1, §15)。
// キーワード解析で価値観の傾向(lean)を判定し、
// 傾向 × 制度 × 年齢 から ValueResponse を組み立てる。
// ============================================================
import type {
  LifeAge,
  MinatoPersona,
  Regime,
  SceneData,
  ValueInput,
  ValueResponse,
  ValueAxis,
} from "@/lib/game/lifeSim/types";
import { buildDeltas } from "@/lib/game/lifeSim/persona";

type Lean =
  | "autonomy"
  | "ambiguity"
  | "security"
  | "community"
  | "curiosity"
  | "embodiment"
  | "system_wary"
  | "ambivalent";

// キーワード辞書(部分一致)。自由記述を最も重く見る。
const KEYWORDS: Record<Exclude<Lean, "ambivalent">, string[]> = {
  autonomy: ["自分で", "自分の", "決め", "選び", "選ぶ", "納得", "主体", "コントロール"],
  ambiguity: ["迷", "悩", "保留", "猶予", "待", "考える時間", "無駄", "余白", "曖昧", "宙ぶらり", "決めたくない", "焦ら"],
  security: ["安定", "安心", "確実", "保障", "守り", "守りたい", "安全", "リスク", "堅実", "任せ", "頼"],
  community: ["家族", "母", "一緒", "誰か", "みんな", "周り", "助け", "支え", "つながり", "子ども", "人の", "相手"],
  curiosity: ["新しい", "知らない", "挑戦", "試", "冒険", "面白", "好奇", "可能性", "意味", "ワクワク", "未知"],
  embodiment: ["手", "触", "体", "身体", "味", "歩", "温", "顔", "声", "焦げ", "実感", "肌", "におい"],
  system_wary: ["外れ", "逆ら", "従わ", "疑", "押し付け", "採点", "管理", "記録され", "監視", "縛られ", "制度は"],
};

function scan(text: string): Record<Lean, number> {
  const scores: Record<Lean, number> = {
    autonomy: 0,
    ambiguity: 0,
    security: 0,
    community: 0,
    curiosity: 0,
    embodiment: 0,
    system_wary: 0,
    ambivalent: 0,
  };
  if (!text) return scores;
  for (const key of Object.keys(KEYWORDS) as Exclude<Lean, "ambivalent">[]) {
    for (const kw of KEYWORDS[key]) {
      if (text.includes(kw)) scores[key] += 1;
    }
  }
  return scores;
}

function pickLean(input: ValueInput): { lean: Lean; scores: Record<Lean, number> } {
  const total: Record<Lean, number> = {
    autonomy: 0, ambiguity: 0, security: 0, community: 0,
    curiosity: 0, embodiment: 0, system_wary: 0, ambivalent: 0,
  };
  const sources: [string, number][] = [
    [input.choice ?? "", 1],
    [input.reason ?? "", 2], // 自由記述を最重視 (§15)
    [input.shortInput ?? "", 1],
  ];
  for (const [text, weight] of sources) {
    const s = scan(text);
    for (const k of Object.keys(total) as Lean[]) total[k] += s[k] * weight;
  }
  let best: Lean = "ambivalent";
  let bestScore = 0;
  for (const k of Object.keys(total) as Lean[]) {
    if (k === "ambivalent") continue;
    if (total[k] > bestScore) {
      bestScore = total[k];
      best = k;
    }
  }
  return { lean: best, scores: total };
}

// 各 lean の valueProfile への影響
const LEAN_DELTAS: Record<Exclude<Lean, "ambivalent">, { axis: ValueAxis; delta: number }[]> = {
  autonomy: [
    { axis: "autonomy", delta: 6 },
    { axis: "toleranceForAmbiguity", delta: 2 },
    { axis: "trustInSystems", delta: -2 },
  ],
  ambiguity: [
    { axis: "toleranceForAmbiguity", delta: 7 },
    { axis: "efficiency", delta: -3 },
    { axis: "autonomy", delta: 2 },
  ],
  security: [
    { axis: "security", delta: 6 },
    { axis: "trustInSystems", delta: 3 },
    { axis: "toleranceForAmbiguity", delta: -2 },
  ],
  community: [
    { axis: "community", delta: 7 },
    { axis: "autonomy", delta: -2 },
    { axis: "embodiment", delta: 1 },
  ],
  curiosity: [
    { axis: "curiosity", delta: 7 },
    { axis: "toleranceForAmbiguity", delta: 2 },
    { axis: "security", delta: -2 },
  ],
  embodiment: [
    { axis: "embodiment", delta: 7 },
    { axis: "efficiency", delta: -3 },
    { axis: "curiosity", delta: 1 },
  ],
  system_wary: [
    { axis: "trustInSystems", delta: -6 },
    { axis: "autonomy", delta: 4 },
    { axis: "security", delta: -1 },
  ],
};

const LEAN_LABEL: Record<Lean, string> = {
  autonomy: "自分で決めることを何より大切にする",
  ambiguity: "すぐに答えを出さず、迷う時間そのものを守ろうとする",
  security: "安心と安定を守りに置く",
  community: "自分より、大切な人の安心を優先する",
  curiosity: "まだ知らない可能性のほうへ心が動く",
  embodiment: "数値や効率より、手触りのある実感を信じる",
  system_wary: "制度に判断を明け渡すことへ、静かに抵抗する",
  ambivalent: "どれか一つに決めきらず、揺れを抱えたまま考える",
};

function fragment(reason: string): string {
  const t = (reason ?? "").trim().replace(/\s+/g, "");
  if (!t) return "";
  return t.length > 22 ? t.slice(0, 22) + "…" : t;
}

// lean × 年齢 でミナトの反応・帰結を組み立てる
function composeResponse(
  lean: Lean,
  age: LifeAge,
  regime: Regime,
  input: ValueInput,
): Omit<ValueResponse, "valueDeltas"> {
  const frag = fragment(input.reason);
  const label = LEAN_LABEL[lean];

  const interpretedValues: string[] = [label];
  if (frag) interpretedValues.push(`「${frag}」という言葉に、その気持ちがにじんでいた`);

  // lean 別の反応・帰結
  const byLean: Record<Lean, {
    response: string[];
    consequence: string;
    memory: string;
    news: string;
    album: string;
    situation: string;
    emotion: string;
    speech: string;
    question?: string;
  }> = {
    autonomy: {
      response: [
        "そっか。誰かに決めてもらうんじゃなくて、自分で決めるんだね。",
        "ちょっと緊張するけど、その方が「自分の人生だ」って思える気がするよ。",
      ],
      consequence: `ミナトは${regime.name}に従うか拒むかではなく、自分の基準を確かめてから動く道を選んだ。手続きは少し遅れたけれど、決めたことにはちゃんと納得があった。`,
      memory: `${age}歳のとき、急かされても自分で決めることを手放さなかった。`,
      news: `${regime.name}に「熟考のための猶予」を求める市民が静かに増加。`,
      album: `${age}歳、ミナトは決めないためではなく、納得して決めるための時間を選んだ。`,
      situation: "自分の判断で人生を進めている。迷うこともあるけれど、その手応えが気に入っている。",
      emotion: "少し緊張しつつ、前向き",
      speech: "言葉を選びながら、それでも自分の意見を口にするようになった。",
      question: "自分で決めることは、いつも幸せと同じだろうか。",
    },
    ambiguity: {
      response: [
        "すぐに決めなくてもいい、って言ってくれるんだね。",
        "じゃあ僕は、もう少しだけ、この宙ぶらりんの中にいてみる。",
      ],
      consequence: `ミナトは結論を保留したまま生きる練習を始めた。${regime.name}は答えを急がせたが、ミナトは迷いを弱さではなく、確かめる時間として扱うようになった。`,
      memory: `${age}歳のとき、答えを急がされる中で、迷う時間を権利として守ろうとした。`,
      news: `${regime.name}の下で「即答しない自由」を掲げる声が広がる。`,
      album: `${age}歳、ミナトは迷いを、埋めるべき空白ではなく、大事な余白として抱えた。`,
      situation: "白黒つけないまま物事を持ち歩くことに慣れ、判断は遅いが浅くはなくなった。",
      emotion: "落ち着かないが、急いではいない",
      speech: "言い切らず、含みを残して話すようになった。",
      question: "迷い続けることは、いつか決めることから逃げているだけだろうか。",
    },
    security: {
      response: [
        "……うん。まず、安心できる場所を確保したいんだ。",
        "冒険は、足元が崩れないって分かってからでも遅くない気がする。",
      ],
      consequence: `ミナトは${regime.name}を積極的に受け入れ、不確実性を減らす方へ舵を切った。暮らしは安定し、余計な不安が消えた。守られた静けさは、思っていたより心地よかった。`,
      memory: `${age}歳のとき、まず安心を手に入れることを選んだ。`,
      news: `${regime.name}の利用率が過去最高に。「安心を選ぶ」ことが主流化。`,
      album: `${age}歳、ミナトは冒険よりも、崩れない足場を選んだ。`,
      situation: "安定した基盤の中で、落ち着いて暮らしている。安心できるのは、やっぱりいい。",
      emotion: "安心して、ほっとしている",
      speech: "結論から先に、はっきり言うようになった。",
      question: "守られていることと、満たされていることは、同じだろうか。",
    },
    community: {
      response: [
        "自分のことより、やっぱりあの人の顔が浮かんじゃうんだ。",
        "みんなと一緒に、いい形にしたいんだよね。",
      ],
      consequence: `ミナトは自分の望みと同じくらい、身近な人の安心を大事にした。${regime.name}の中でも、まず誰かのために動くようになった。感謝されると、自分まで少し満たされる気がした。`,
      memory: `${age}歳のとき、自分より大切な人の安心を先に置いた。`,
      news: `${regime.name}で「他者のための選択」を支援する仕組みが拡充。`,
      album: `${age}歳、ミナトは自分の願いも大事にしつつ、誰かの隣に立った。`,
      situation: "人との関係を軸に暮らしている。頼られるのは、正直うれしい。",
      emotion: "誰かの役に立てて、うれしい",
      speech: "相手の顔を思い浮かべながら、やわらかく話すようになった。",
      question: "誰かのための選択を続けると、自分はどこへ行くのだろう。",
    },
    curiosity: {
      response: [
        "安全なのはわかってる。でも、その先に何があるのか見てみたいんだ。",
        "知らないままにしておくの、なんだかもったいないでしょ？",
      ],
      consequence: `ミナトは推奨から外れ、まだ知らない側へ足を踏み出した。${regime.name}は非効率だと警告したが、その回り道でしか出会えないものがあった。安定は少し減ったけれど、景色はぐっと増えた。`,
      memory: `${age}歳のとき、安全より、まだ見ぬ可能性を選んだ。`,
      news: `${regime.name}の「想定外の使い方」をする市民が話題に。`,
      album: `${age}歳、ミナトは最短ルートを外れて、寄り道の中に意味を見つけた。`,
      situation: "計画の外を覗きに行く癖がついた。ちょっと不安定だけど、毎日に発見があって楽しい。",
      emotion: "落ち着かないが、わくわくしている",
      speech: "問いかけが増え、話が横道に逸れることを恐れなくなった。",
      question: "好奇心は、いつまで生活を犠牲にしていいものだろう。",
    },
    embodiment: {
      response: [
        "数字はいいんだ。でも、僕は自分の手で確かめたい。",
        "画面の向こうじゃなくて、この手に残る感触を信じたい。",
      ],
      consequence: `ミナトはスコアや最適化より、手触りのある経験を選んだ。${regime.name}が差し出す効率を一部手放し、遠回りでも身体で確かめる暮らしを続けた。`,
      memory: `${age}歳のとき、効率より、手で確かめられる実感を選んだ。`,
      news: `${regime.name}の外で「手作業」や「対面」を選ぶ人々が静かに増える。`,
      album: `${age}歳、ミナトは数値の外にある、温度のあるものへ手を伸ばした。`,
      situation: "効率を一部手放し、身体で世界に触れる時間を大切にしている。",
      emotion: "地に足がついている",
      speech: "抽象論より、具体的な情景で話すようになった。",
      question: "手で確かめられないものは、信じなくていいのだろうか。",
    },
    system_wary: {
      response: [
        "便利なのはわかる。でも、判断まで預けたら、僕は何になるんだろう。",
        "従わないわけじゃない。ただ、鵜呑みにはしたくないんだ。",
      ],
      consequence: `ミナトは${regime.name}を使いながらも、判断そのものは明け渡さないと決めた。制度と距離を取る分だけ手間は増えたが、自分の頭で考える筋力は落ちなかった。`,
      memory: `${age}歳のとき、制度に判断を明け渡すことへ、静かに抵抗した。`,
      news: `${regime.name}に「人間の最終判断」を残すよう求める運動が起きる。`,
      album: `${age}歳、ミナトは制度を疑うことを、反抗ではなく手入れとして続けた。`,
      situation: "制度を利用しつつ、要所では自分で判断する二重の暮らしを送っている。",
      emotion: "警戒しているが、頑なではない",
      speech: "制度の前提を一度立ち止まって問い直すようになった。",
      question: "疑い続けることは、信じないことと同じだろうか。",
    },
    ambivalent: {
      response: [
        "……正直、まだ決めきれてないんだ。",
        "でも、決めきれないことを、あなたは責めないでいてくれるんだね。",
      ],
      consequence: `ミナトはどれか一つに寄りきらず、揺れを抱えたまま${regime.name}と付き合っていくことにした。答えは出なかったが、問いの形は少し変わった。`,
      memory: `${age}歳のとき、答えを一つに絞らず、揺れたまま前に進んだ。`,
      news: `${regime.name}を「様子を見ながら使う」慎重派が一定数を占める。`,
      album: `${age}歳、ミナトは白黒つけないことを、優柔不断ではなく誠実さとして選んだ。`,
      situation: "複数の価値の間で揺れながら、そのつど判断している。",
      emotion: "揺れているが、投げ出してはいない",
      speech: "断定を避け、両面を並べて話すようになった。",
      question: "揺れ続けることに、いつか疲れてしまわないだろうか。",
    },
  };

  const t = byLean[lean];
  return {
    interpretedValues,
    minatoResponse: t.response,
    lifeConsequence: t.consequence,
    memoryAdded: t.memory,
    futureNews: t.news,
    albumEntry: t.album,
    nextSituation: t.situation,
    nextEmotion: t.emotion,
    newSpeechStyle: t.speech,
    newUnresolvedQuestion: t.question,
  };
}

export function interpretValueInputMock(
  persona: MinatoPersona,
  scene: SceneData,
  regime: Regime,
  input: ValueInput,
): ValueResponse {
  const { lean, scores } = pickLean(input);
  const composed = composeResponse(lean, persona.age, regime, input);

  // deltas: 主 lean + 補助的に反応した lean を少しずつ
  const rawDeltas: { axis: ValueAxis; delta: number; reason: string }[] = [];
  if (lean !== "ambivalent") {
    for (const d of LEAN_DELTAS[lean]) {
      rawDeltas.push({ ...d, reason: `「${LEAN_LABEL[lean]}」傾向を強めた` });
    }
  } else {
    // 揺れ: 迷いへの耐性を少し上げる
    rawDeltas.push({ axis: "toleranceForAmbiguity", delta: 3, reason: "決めきらずに揺れを引き受けた" });
  }
  // 自由記述で副次的に反応した軸も反映(free text が結果に効く)
  for (const k of Object.keys(scores) as Lean[]) {
    if (k === "ambivalent" || k === lean) continue;
    if (scores[k] > 0) {
      const first = LEAN_DELTAS[k][0];
      rawDeltas.push({ axis: first.axis, delta: 2, reason: `記述に「${LEAN_LABEL[k]}」の要素も見えた` });
    }
  }

  const valueDeltas = buildDeltas(persona.valueProfile, rawDeltas);

  return { ...composed, valueDeltas };
}
