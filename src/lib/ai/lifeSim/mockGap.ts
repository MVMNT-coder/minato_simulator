// ============================================================
// 年代間の経過モンタージュ モック (AI未接続時)
// 蓄積された価値観の重心・直近の制度・記憶を反映し、
// 「その◯年で何が起きたか」を決定論的に生成する (§6, §7)
// ============================================================
import type {
  GapNarrative,
  LifeAge,
  MinatoPersona,
} from "@/lib/game/lifeSim/types";
import type { SceneLine } from "@/lib/game/types";
import { dominantAxes } from "@/lib/game/lifeSim/persona";

const YEAR_BY_AGE: Record<number, number> = {
  20: 2046, 40: 2066, 60: 2086, 100: 2126,
};

// lean(重心軸)別の「この期間に起きたこと」テンプレート。
// {span} は年数、{last} は直近に選んだ制度名。
type Tmpl = { headline: string; mid: string[]; minato: string; summary: string };

const BY_LEAN: Record<string, Tmpl> = {
  autonomy: {
    headline: "自分で選び直し続けた歳月",
    mid: [
      "ミナトは何度か、用意された道から外れた。遠回りも多かったが、そのたびに「これは自分で決めたことだ」と言い聞かせられた。",
      "納得できないまま進むことだけは避けた。決断は遅く、しかし後悔は少なかった。",
    ],
    minato: "誰かに決めてもらえば楽だったと思う夜もあった。でも、僕は僕の速度で選んできた。",
    summary: "遠回りをしてでも、自分で決めることを手放さなかった時期。",
  },
  ambiguity: {
    headline: "答えを保留したまま過ぎた歳月",
    mid: [
      "ミナトは大きな問いをいくつも抱えたまま暮らした。白黒つけない代わりに、どちらの側の言い分も見えるようになった。",
      "周囲は次々と結論を出していったが、ミナトは急がなかった。",
    ],
    minato: "決めないでいることを、いつのまにか怖がらなくなっていた。",
    summary: "迷いを抱えたまま歩くことに、少しずつ慣れていった時期。",
  },
  security: {
    headline: "足場を固めることに費やした歳月",
    mid: [
      "ミナトは不確実なものを一つずつ減らしていった。暮らしは安定し、予定は狂わなくなった。",
      "守られた静けさの中で、時々「これでよかったのか」と立ち止まることもあった。",
    ],
    minato: "波風のない毎日は、安心なのに、少しだけ物足りなかった。",
    summary: "安定を積み上げた一方で、静けさへの物足りなさも芽生えた時期。",
  },
  community: {
    headline: "誰かの隣で過ごした歳月",
    mid: [
      "ミナトの時間の多くは、家族や身近な人のために使われた。頼られることが増え、自分の予定は後回しになった。",
      "支えた分だけ関係は深まったが、ふと自分の望みを思い出せない瞬間もあった。",
    ],
    minato: "誰かの役に立てているのは嬉しい。ただ、自分が何をしたいのかは、少しぼやけてきた。",
    summary: "人との関係を軸に生き、自分の輪郭が少し薄まった時期。",
  },
  curiosity: {
    headline: "知らない側へ踏み出し続けた歳月",
    mid: [
      "ミナトは効率の悪い寄り道を重ねた。安定は減ったが、そのぶん出会いと発見は多かった。",
      "計画通りにいかない日々を、いつしか面白がるようになっていた。",
    ],
    minato: "何が起きるか分からない毎日は疲れる。でも、退屈よりはずっといい。",
    summary: "安定より発見を選び、不安定でも刺激の多い日々を送った時期。",
  },
  embodiment: {
    headline: "手ざわりを確かめ続けた歳月",
    mid: [
      "ミナトはスコアや最適化より、実際に触れられるものを信じた。遠回りでも、身体で確かめる暮らしを続けた。",
      "数字では測れない小さな手ごたえが、日々の支えになった。",
    ],
    minato: "画面の向こうの正解より、この手に残る感触のほうを、僕は覚えている。",
    summary: "数値の外にある、温度のある経験を大切にした時期。",
  },
  system_wary: {
    headline: "制度と距離を測り続けた歳月",
    mid: [
      "ミナトは制度を使いながらも、判断そのものは手放さなかった。手間は増えたが、自分の頭で考える力は鈍らなかった。",
      "便利さに流されそうになるたび、一度立ち止まって問い直す癖がついた。",
    ],
    minato: "任せられるものは任せた。でも、最後に決めるのは自分だと決めていた。",
    summary: "制度に頼りつつ、要所では自分で判断する二重の暮らしを続けた時期。",
  },
  neutral: {
    headline: "揺れながら重ねた歳月",
    mid: [
      "ミナトの日々は、いくつもの小さな選択の積み重ねだった。派手な事件はなかったが、確かに何かが変わっていった。",
      "うまくいったことも、そうでないこともあった。それでも毎日は続いた。",
    ],
    minato: "気づけば、こんなに時間が経っていた。早かったような、長かったような。",
    summary: "大きな波はないまま、静かに価値観が変わっていった時期。",
  },
};

const AXIS_TO_LEAN: Record<string, string> = {
  autonomy: "autonomy",
  toleranceForAmbiguity: "ambiguity",
  security: "security",
  community: "community",
  curiosity: "curiosity",
  embodiment: "embodiment",
  trustInSystems: "security", // 制度信頼が高い→安定寄り
  efficiency: "security",
};

export function generateGapMock(
  persona: MinatoPersona,
  fromAge: LifeAge,
  toAge: LifeAge,
): GapNarrative {
  const span = toAge - fromAge;
  const ranked = dominantAxes(persona.valueProfile);
  const top = ranked[0];
  // trustInSystems が低い場合は system_wary を優先
  let leanKey =
    persona.valueProfile.trustInSystems <= 38
      ? "system_wary"
      : AXIS_TO_LEAN[top.axis] ?? "neutral";
  // 重心が弱い(50付近)なら neutral
  if (Math.abs(top.value - 50) < 6) leanKey = "neutral";

  const t = BY_LEAN[leanKey] ?? BY_LEAN.neutral;
  const lastRegime =
    persona.regimeHistory[persona.regimeHistory.length - 1]?.regimeName;
  const toYear = YEAR_BY_AGE[toAge];

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: `${span}年の時間が流れた。季節が巡り、ミナトの周りの景色は少しずつ変わっていった。` },
  ];
  if (lastRegime) {
    lines.push({
      speaker: "NARRATOR",
      text: `${lastRegime}は暮らしに溶け込み、当たり前になった。その恩恵を受けながら、ミナトは自分なりの折り合いをつけていった。`,
    });
  }
  for (const m of t.mid) lines.push({ speaker: "NARRATOR", text: m });
  lines.push({ speaker: "MINATO", text: t.minato });
  lines.push({
    speaker: "NARRATOR",
    text: `そして${toYear}年。ミナトは${toAge}歳になった。`,
  });

  return {
    fromAge,
    toAge,
    headline: t.headline,
    lines,
    summary: `${fromAge}〜${toAge}歳: ${t.summary}`,
  };
}
