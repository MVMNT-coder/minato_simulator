// ============================================================
// Response Engine — シナリオ回答ベースのパターンマッチング応答生成
// プレイヤーのシナリオ選択を分類し、3層レスポンスを生成する
// ============================================================
import type { PlayerResponse, SceneLine, Age, ScenarioAnswer } from "./types";

// ------ ヘルパー関数 ------

function extractAnswers(responses: PlayerResponse[], stepId: string): ScenarioAnswer[] {
  const resp = responses.find((r) => r.stepId === stepId);
  return (resp?.data?.answers as ScenarioAnswer[]) ?? [];
}

function findChoice(answers: ScenarioAnswer[], scenarioIndex: number): string | undefined {
  return answers.find((a) => a.scenarioIndex === scenarioIndex && (!a.depth || a.depth === 0))?.choiceId;
}

export function findFollowUpChoice(
  answers: ScenarioAnswer[],
  scenarioIndex: number,
  depth: number
): string | undefined {
  return answers.find(
    (a) => a.scenarioIndex === scenarioIndex && a.depth === depth
  )?.choiceId;
}

// ------ 3層レスポンス共通型 ------

interface ResultOutput {
  headline: string;
  interpretation: string;
  memory: string;
}

// ============================================================
// Age 20 — 選択の始まり
// ============================================================

type Autonomy20 = "seeker" | "follower" | "ambivalent";
type Temporal20 = "present" | "questioning";

function classifyAutonomy20(answers: ScenarioAnswer[]): Autonomy20 {
  const choice0 = findChoice(answers, 0); // cafe
  const choice1 = findChoice(answers, 1); // rewrite

  if (choice0 === "enter_cafe" && choice1 !== "rewrite_nothing") return "seeker";
  if (choice0 === "follow_route" && choice1 === "rewrite_nothing") return "follower";
  return "ambivalent";
}

function classifyTemporal20(answers: ScenarioAnswer[]): Temporal20 {
  const choice2 = findChoice(answers, 2); // letter

  if (choice2 === "letter_followed") return "present";
  if (choice2 === "letter_deviated") return "questioning";
  return "questioning";
}

const HEADLINES_20: Record<Autonomy20, Record<Temporal20, string>> = {
  seeker: {
    present: "安全を手にした探求者",
    questioning: "問い続ける冒険者",
  },
  follower: {
    present: "設計書を信じた旅人",
    questioning: "安定の中の懐疑者",
  },
  ambivalent: {
    present: "揺れながら進む人",
    questioning: "迷いを抱えた思索者",
  },
};

const INTERPRETATIONS_20: Record<Autonomy20, Record<Temporal20, string>> = {
  seeker: {
    present: "あなたは冒険を求めながらも、安定した結末を望んでいる。カフェに入るような好奇心と、設計書通りの安心感。その両方を持てることが、あなたの強さかもしれません。ただ、両方を手に入れることは、たぶんできない。",
    questioning: "計画の外に出たい。書き換えたいものがある。そして、後悔の手紙すら受け入れる覚悟がある。あなたは最も自由な選択をしました。でも、自由には必ず代償があります。その代償を払う覚悟が、あなたの本当の強さです。",
  },
  follower: {
    present: "設計書を信じ、安定を選び、成功の手紙を望む。最も合理的な選択です。2046年の社会が推奨する生き方そのもの。でも、「最適」であることと「幸せ」であることは、同じでしょうか。その問いは、あなた自身が答えを見つけるしかありません。",
    questioning: "設計書に従いながらも、心のどこかで「逸れていればよかった」と思う日が来ることを予感している。それは矛盾ではなく、正直さです。安全な道を歩きながら、その道を疑い続けること——それが、もしかしたら最も人間的な選択なのかもしれません。",
  },
  ambivalent: {
    present: "決めきれない。でも、安定した結末は望んでいる。迷いながらも着地点は見えている。あなたの迷いは弱さではなく、全てを考慮しようとする誠実さの表れです。ただ、いつかは選ばなければならない時が来ます。",
    questioning: "何を書き換えるかも決めきれず、どんな手紙が届くかも分からない。でも、その「分からなさ」を受け入れていること自体が、ひとつの答えです。迷い続けることを恐れない人だけが、本当の選択をすることができます。",
  },
};

const MEMORIES_20: Record<Autonomy20, Record<Temporal20, string>> = {
  seeker: {
    present: "20歳のミナトは、設計書の外に出たがっていた。でも、帰る場所は手放さなかった。",
    questioning: "20歳のミナトは、未知の道を選び、後悔すら受け入れる覚悟を持っていた。",
  },
  follower: {
    present: "20歳のミナトは、設計書を信じ、安定した未来を選んだ。",
    questioning: "20歳のミナトは、従いながらも疑い続けることを選んだ。",
  },
  ambivalent: {
    present: "20歳のミナトは、迷いの中にいた。でも、着地点だけは見えていた。",
    questioning: "20歳のミナトは、何も決められなかった。でも、迷い続けることを恐れなかった。",
  },
};

export function generateAge20Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age20_scenarios");
  const autonomy = classifyAutonomy20(answers);
  const temporal = classifyTemporal20(answers);

  const headline = HEADLINES_20[autonomy]?.[temporal] ?? "20歳の選択";
  const interpretation = INTERPRETATIONS_20[autonomy]?.[temporal]
    ?? "あなたの選択は、ミナトにとって新しい視点になりました。";
  const memory = MEMORIES_20[autonomy]?.[temporal]
    ?? "20歳のミナトは、初めての選択をした。";

  return { headline, interpretation, memory };
}

function generateMontageLines20(responses: PlayerResponse[]): SceneLine[] {
  const answers = extractAnswers(responses, "age20_scenarios");
  const choice0 = findChoice(answers, 0);
  const choice1 = findChoice(answers, 1);

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: "時間が過ぎていく。" },
  ];

  if (choice0 === "enter_cafe") {
    lines.push({ speaker: "NARRATOR", text: "ミナトは時々、推奨ルートを外れるようになった。\n何も見つからない日もあった。\nでも、探すことをやめなかった。" });
  } else {
    lines.push({ speaker: "NARRATOR", text: "ミナトは設計書を何度も読み返した。\n読むたびに新しい意味を見つけた。\nでも、読み返す理由が変わっていることには気づかなかった。" });
  }

  if (choice1 === "rewrite_nothing") {
    lines.push({ speaker: "MINATO", text: "あの頃は、何も変えたくないと思っていた。\nでも、変えないことも選択だった。\nその重みが、少しずつ分かってきた。" });
  } else if (choice1 === "rewrite_career") {
    lines.push({ speaker: "MINATO", text: "「環境適応型データアーキテクト」。\n結局、その肩書きで働き始めた。\nでも、書き換えたかったという気持ちは\nずっと胸の中にあった。" });
  } else if (choice1 === "rewrite_relationships") {
    lines.push({ speaker: "MINATO", text: "AIが選んだ候補3名。\n結局、その中の一人と会った。\nでも、偶然の出会いへの憧れは消えなかった。" });
  } else {
    lines.push({ speaker: "MINATO", text: "もっと失敗できる人生がいい——\nあのときの言葉が、27歳の僕を\n思わぬ場所へ連れて行った。" });
  }

  lines.push({ speaker: "NARRATOR", text: "そして、10年が経った。\nミナトは30歳になった。" });
  return lines;
}

// ============================================================
// Age 30 — 信頼と現実
// ============================================================

type Loyalty30 = "loyal" | "cautious";
type Identity30 = "self_driven" | "system_driven" | "questioning";
type Aliveness30 = "comfort" | "vivid";

function classifyLoyalty30(answers: ScenarioAnswer[]): Loyalty30 {
  const choice0 = findChoice(answers, 0);
  return choice0 === "help_friend" ? "loyal" : "cautious";
}

function classifyIdentity30(answers: ScenarioAnswer[]): Identity30 {
  const choice1 = findChoice(answers, 1);
  if (choice1 === "prove_self") return "self_driven";
  if (choice1 === "accept_system") return "system_driven";
  return "questioning";
}

function classifyAliveness30(answers: ScenarioAnswer[]): Aliveness30 {
  const choice2 = findChoice(answers, 2);
  return choice2 === "comfortable" ? "comfort" : "vivid";
}

function generateAge30Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age30_scenarios");
  const loyalty = classifyLoyalty30(answers);
  const identity = classifyIdentity30(answers);
  const aliveness = classifyAliveness30(answers);

  // Headline based on primary axes
  const headlines: Record<Loyalty30, Record<Aliveness30, string>> = {
    loyal: {
      comfort: "信じる人の安らぎ",
      vivid: "絆を選んだ冒険者",
    },
    cautious: {
      comfort: "静かな合理主義者",
      vivid: "孤独な探求者",
    },
  };

  const interpretations: Record<Identity30, Record<Aliveness30, string>> = {
    self_driven: {
      comfort: "実力で証明したい。でも、日々は穏やかに過ごしたい。その矛盾こそが、30代のリアルなのかもしれません。証明した先にある穏やかさは、本物の安らぎになるでしょう。",
      vivid: "自分の力を信じ、記憶に残る日々を選ぶ。最も自由で、最もエネルギーを使う生き方です。でも、30代のエネルギーは有限です。使い方を間違えないことが大切です。",
    },
    system_driven: {
      comfort: "システムを受け入れ、快適さを選ぶ。最も効率的な生き方です。でも、効率的であることと充実していることは、同じではありません。30代の終わりに、何を覚えていたいですか。",
      vivid: "システムを受け入れながらも、記憶に残る体験を求める。制度の中で生きながら、制度では味わえないものを探す。そのバランス感覚が、あなたの強さです。",
    },
    questioning: {
      comfort: "制度を疑いながらも、穏やかさは手放さない。批判的であることと、破壊的であることは違う。静かに疑い続ける力は、長い目で見れば最も強い力かもしれません。",
      vivid: "制度を疑い、記憶に残る日々を選ぶ。最も波乱に満ちた30代になるでしょう。でも、疑いと冒険の先にあるものは、自分だけの答えです。",
    },
  };

  const memories: Record<Loyalty30, Record<Identity30, string>> = {
    loyal: {
      self_driven: "30歳のミナトは、友を助け、自分の力で道を切り開こうとした。",
      system_driven: "30歳のミナトは、友を助けながらも、システムの中で生きることを受け入れた。",
      questioning: "30歳のミナトは、友を助け、制度そのものを問い始めた。",
    },
    cautious: {
      self_driven: "30歳のミナトは、距離を置きながら、自分の実力を証明しようとした。",
      system_driven: "30歳のミナトは、合理的な判断を重ね、安定した道を歩んだ。",
      questioning: "30歳のミナトは、慎重に距離を保ちながらも、世界の仕組みを疑っていた。",
    },
  };

  const headline = headlines[loyalty]?.[aliveness] ?? "30歳の選択";
  const interpretation = interpretations[identity]?.[aliveness]
    ?? "あなたの選択は、ミナトの30代に新しい色を加えました。";
  const memory = memories[loyalty]?.[identity]
    ?? "30歳のミナトは、信頼の意味を考え始めた。";

  return { headline, interpretation, memory };
}

function generateMontageLines30(responses: PlayerResponse[]): SceneLine[] {
  const answers = extractAnswers(responses, "age30_scenarios");
  const choice0 = findChoice(answers, 0);
  const choice2 = findChoice(answers, 2);

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: "時間が過ぎていく。" },
  ];

  if (choice0 === "help_friend") {
    lines.push({ speaker: "NARRATOR", text: "ミナトは、AIの推奨に反して人と繋がることを選んだ。\n全ての関係が良い結果にはならなかった。\nでも、後悔はしなかった。" });
  } else {
    lines.push({ speaker: "NARRATOR", text: "ミナトは慎重に人間関係を選ぶようになった。\n穏やかだった。\nでも、時々、誰かの声が聞こえなくなっていることに気づいた。" });
  }

  if (choice2 === "memorable") {
    lines.push({ speaker: "MINATO", text: "思い出せる日々を選んだ。\n疲れることも多かったけど、\n35歳の誕生日に、全部覚えていた。" });
  } else {
    lines.push({ speaker: "MINATO", text: "快適な日々を過ごした。\n健康で、効率的で、穏やかだった。\n35歳の誕生日に、ふと思った。\n去年の誕生日、何をしていたっけ。" });
  }

  lines.push({ speaker: "NARRATOR", text: "そして、10年が経った。\nミナトは40歳になった。" });
  return lines;
}

// ============================================================
// Age 40 — 所有と拡張
// ============================================================

type Rootedness40 = "owner" | "user";
type Enhancement40 = "enhance" | "natural" | "cautious";

function classifyRootedness40(answers: ScenarioAnswer[]): Rootedness40 {
  const choice0 = findChoice(answers, 0);
  return choice0 === "own_house" ? "owner" : "user";
}

function classifyEnhancement40(answers: ScenarioAnswer[]): Enhancement40 {
  const choice1 = findChoice(answers, 1);
  if (choice1 === "install") return "enhance";
  if (choice1 === "refuse") return "natural";
  return "cautious";
}

function generateAge40Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age40_scenarios");
  const rootedness = classifyRootedness40(answers);
  const enhancement = classifyEnhancement40(answers);

  const headlines: Record<Rootedness40, Record<Enhancement40, string>> = {
    owner: {
      enhance: "進化する居場所の守り手",
      natural: "変わらぬ土地に立つ人",
      cautious: "根を張りながら見守る人",
    },
    user: {
      enhance: "流れる時代の最適化者",
      natural: "軽やかな自然体",
      cautious: "漂いながら考える人",
    },
  };

  const interpretations: Record<Rootedness40, Record<Enhancement40, string>> = {
    owner: {
      enhance: "古い家を守りながら、新しい力を取り入れる。伝統と革新を両方抱えるのは、最も重い選択です。でも、40代のミナトには、その重さを引き受ける力がある。子どもへの答えは、きっとその姿勢の中にあります。",
      natural: "所有を選び、自分のままでいることを選ぶ。効率の時代に逆行する生き方です。でも、誰かが植えた木を守ることも、自分の脳を守ることも、同じ信念から来ているのかもしれません。",
      cautious: "居場所は確保する。でも、自分の拡張には慎重。40代の堅実さと、変化への畏れが同居しています。それは弱さではなく、大切なものを見極めようとする知恵です。",
    },
    user: {
      enhance: "所有にこだわらず、自分をアップデートしていく。最も時代に適応した選択です。でも、適応し続けた先に残る「自分」は、どこにいるのでしょう。子どもの問いは、その答えを求めているのかもしれません。",
      natural: "所有もしない、拡張もしない。身軽で自由な40代です。でも、何も持たないことは、何も失わないことと同じではありません。大切なものが見えにくくなっていないか、時々確認してください。",
      cautious: "流れに乗りながらも、急ぎすぎない。40代の賢い選択とも言えます。でも、様子を見ている間にも、時間は過ぎていく。いつか決断する日が来たとき、後悔しない準備はできていますか。",
    },
  };

  const memories: Record<Rootedness40, Record<Enhancement40, string>> = {
    owner: {
      enhance: "40歳のミナトは、古い家に根を下ろし、新しい力を受け入れた。",
      natural: "40歳のミナトは、古い家を守り、自分のままでいることを選んだ。",
      cautious: "40歳のミナトは、居場所を持ちながらも、変化を慎重に見極めようとした。",
    },
    user: {
      enhance: "40歳のミナトは、身軽さを選び、自分を拡張した。",
      natural: "40歳のミナトは、何にも縛られず、自然体で生きることを選んだ。",
      cautious: "40歳のミナトは、流れに身を任せながらも、慎重に時を待った。",
    },
  };

  const headline = headlines[rootedness]?.[enhancement] ?? "40歳の選択";
  const interpretation = interpretations[rootedness]?.[enhancement]
    ?? "あなたの選択は、ミナトの40代に新しい視点を与えました。";
  const memory = memories[rootedness]?.[enhancement]
    ?? "40歳のミナトは、所有と拡張の意味を考えた。";

  return { headline, interpretation, memory };
}

function generateMontageLines40(responses: PlayerResponse[]): SceneLine[] {
  const answers = extractAnswers(responses, "age40_scenarios");
  const choice0 = findChoice(answers, 0);
  const choice1 = findChoice(answers, 1);

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: "時間が過ぎていく。\n20年という歳月が流れた。" },
  ];

  if (choice0 === "own_house") {
    lines.push({ speaker: "NARRATOR", text: "ミナトは庭の木を守り続けた。\n子どもがその木の下で遊ぶのを見ながら、\n「所有」の意味をようやく理解した気がした。" });
  } else {
    lines.push({ speaker: "NARRATOR", text: "ミナトは何度も引っ越した。\n効率的で、合理的だった。\nでも、子どもが「うちはどこ？」と聞いたとき、\nすぐに答えられなかった。" });
  }

  if (choice1 === "install") {
    lines.push({ speaker: "MINATO", text: "インプラントを入れた。\n世界がクリアになった。\nでも、昔の曖昧な記憶を\n懐かしく思うことが増えた。" });
  } else if (choice1 === "refuse") {
    lines.push({ speaker: "MINATO", text: "インプラントを入れなかった。\n同僚との差は広がったけど、\n自分の思考のリズムは守れた。\nそれが正しかったかは、まだ分からない。" });
  } else {
    lines.push({ speaker: "MINATO", text: "結局、様子を見続けた。\n入れた人も入れなかった人も、\nそれぞれの道を歩いていた。\n僕だけが、まだ岐路に立っていた。" });
  }

  lines.push({ speaker: "NARRATOR", text: "そして、20年が経った。\nミナトは60歳になった。" });
  return lines;
}

// ============================================================
// Age 60 — 有限と永続
// ============================================================

type Mortality60 = "archive" | "ephemeral";
type Agency60 = "activist" | "creator" | "accepter";
type Values60 = "righteous" | "devoted";

function classifyMortality60(answers: ScenarioAnswer[]): Mortality60 {
  const choice0 = findChoice(answers, 0);
  return choice0 === "archive_join" ? "archive" : "ephemeral";
}

function classifyAgency60(answers: ScenarioAnswer[]): Agency60 {
  const choice1 = findChoice(answers, 1);
  if (choice1 === "bench_petition") return "activist";
  if (choice1 === "bench_alternative") return "creator";
  return "accepter";
}

function classifyValues60(answers: ScenarioAnswer[]): Values60 {
  const choice2 = findChoice(answers, 2);
  return choice2 === "choose_right" ? "righteous" : "devoted";
}

function generateAge60Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age60_scenarios");
  const mortality = classifyMortality60(answers);
  const agency = classifyAgency60(answers);
  const values = classifyValues60(answers);

  const headlines: Record<Mortality60, Record<Values60, string>> = {
    archive: {
      righteous: "正義を刻む人",
      devoted: "愛を遺す人",
    },
    ephemeral: {
      righteous: "正しく消える人",
      devoted: "静かに愛す人",
    },
  };

  const interpretations: Record<Agency60, Record<Values60, string>> = {
    activist: {
      righteous: "声を上げ、正しいことを選ぶ。60年の経験が裏打ちする行動力です。でも、正義の声は時に大切な人を遠ざける。あなたはそのリスクを知った上で、それでも声を上げることを選びました。",
      devoted: "声を上げるのは、大切なものを守るため。正義のためではなく、愛のため。60歳のミナトが見つけた、最も個人的な行動原理です。",
    },
    creator: {
      righteous: "制度に頼らず、自分の手で正しいと思うものを作る。創造的な正義。でも、一人で作れるものには限りがある。それでも作り続けることが、あなたの答えなのでしょう。",
      devoted: "失われたものの代わりを、自分の手で作る。制度の外で、大切なものを守る。60歳のミナトは、自分の手の届く範囲で世界を守ることを選びました。",
    },
    accepter: {
      righteous: "受け入れながらも、正しさは手放さない。行動はしないけれど、信念はある。静かな正義には、時間の重みがあります。",
      devoted: "全てを受け入れる。場所がなくなっても、記憶は残る。大切な人がいなくなっても、愛した事実は消えない。60歳のミナトが到達した、最も穏やかな結論です。",
    },
  };

  const memories: Record<Mortality60, Record<Agency60, string>> = {
    archive: {
      activist: "60歳のミナトは、自分を遺すことを選び、世界に声を上げ続けた。",
      creator: "60歳のミナトは、記憶を保存し、失われたものの代わりを自分の手で作った。",
      accepter: "60歳のミナトは、自分を遺すことを選びながらも、変化を穏やかに受け入れた。",
    },
    ephemeral: {
      activist: "60歳のミナトは、消えることを受け入れながらも、変えるべきものには声を上げた。",
      creator: "60歳のミナトは、全て消えることを選びながら、今ある世界を自分の手で作り直した。",
      accepter: "60歳のミナトは、全てを受け入れた。消えることも、変わることも。",
    },
  };

  const headline = headlines[mortality]?.[values] ?? "60歳の選択";
  const interpretation = interpretations[agency]?.[values]
    ?? "あなたの選択は、ミナトの60代に深い意味を与えました。";
  const memory = memories[mortality]?.[agency]
    ?? "60歳のミナトは、有限の中で永続の意味を考えた。";

  return { headline, interpretation, memory };
}

function generateMontageLines60(responses: PlayerResponse[]): SceneLine[] {
  const answers = extractAnswers(responses, "age60_scenarios");
  const choice0 = findChoice(answers, 0);
  const choice2 = findChoice(answers, 2);

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: "時間が過ぎていく。\n20年という長い歳月。" },
  ];

  if (choice0 === "archive_join") {
    lines.push({ speaker: "NARRATOR", text: "ミナトは意識アーカイブに参加した。\n選別された記憶が、デジタルの海に沈んでいく。\n何が残り、何が消えるのか。\nそれを決めるのはもう、ミナト自身ではなかった。" });
  } else {
    lines.push({ speaker: "NARRATOR", text: "ミナトは全て消えることを選んだ。\nその選択は、周囲を驚かせた。\nでも、ミナトの目は穏やかだった。" });
  }

  if (choice2 === "choose_right") {
    lines.push({ speaker: "MINATO", text: "正しいことを選んだ。\n大切な人を傷つけたかもしれない。\nでも、70歳を過ぎた頃、\nその人が「ありがとう」と言ってくれた。" });
  } else {
    lines.push({ speaker: "MINATO", text: "大切なものを守った。\n正しさからは目を逸らしたかもしれない。\nでも、75歳の誕生日に、\n大切な人たちに囲まれていた。" });
  }

  lines.push({ speaker: "NARRATOR", text: "そして、20年が経った。\nミナトは80歳になった。" });
  return lines;
}

// ============================================================
// Age 80 — 遺すもの
// ============================================================

type Narrative80 = "summarizable" | "unsummarizable";
type Legacy80 = "question" | "story" | "failure" | "nothing";

function classifyNarrative80(answers: ScenarioAnswer[]): Narrative80 {
  const choice0 = findChoice(answers, 0);
  return choice0 === "can_summarize" ? "summarizable" : "unsummarizable";
}

function classifyLegacy80(answers: ScenarioAnswer[]): Legacy80 {
  const choice1 = findChoice(answers, 1);
  if (choice1 === "legacy_question") return "question";
  if (choice1 === "legacy_story") return "story";
  if (choice1 === "legacy_failure") return "failure";
  return "nothing";
}

function generateAge80Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age80_scenarios");
  const narrative = classifyNarrative80(answers);
  const legacy = classifyLegacy80(answers);

  const headlines: Record<Narrative80, Record<Legacy80, string>> = {
    summarizable: {
      question: "問いの種を蒔く語り手",
      story: "物語を紡ぐ証人",
      failure: "正直な先駆者",
      nothing: "完結した旅人",
    },
    unsummarizable: {
      question: "言葉にならない問いを遺す人",
      story: "語りきれない人生の持ち主",
      failure: "矛盾を抱えた正直者",
      nothing: "沈黙を選んだ人",
    },
  };

  const interpretations: Record<Narrative80, Record<Legacy80, string>> = {
    summarizable: {
      question: "人生を一文で語れると思い、問いを遺す。最も教育的で、最も勇敢な選択です。一文にまとめる力と、それでも答えを出さない知恵。80年かけて身につけたバランス感覚です。",
      story: "人生を一文で語り、その物語を遺す。あなたは自分の人生に意味を見出し、それを伝えたいと思っている。その欲望は、人間の最も根源的な営みです。",
      failure: "人生を語れると信じ、失敗を遺す。最も正直な遺産です。成功よりも、失敗から学ぶことが多いと知っている。80年の知恵が、その選択の中にあります。",
      nothing: "語れる人生だったが、何も遺さない。それは自信か、諦めか、それとも次世代への信頼か。答えは、あなた自身の中にあります。",
    },
    unsummarizable: {
      question: "語りきれない人生から、問いだけを抽出して遺す。最も抽象的で、最も普遍的な遺産です。答えのない問いが、次の世代を動かすことがある。",
      story: "一文では語れないからこそ、物語全体を遺したい。矛盾も、逸脱も、全て含めた物語を。それは最も誠実な自己表現です。",
      failure: "語りきれない人生の中で、失敗だけは確かだった。その正直さが、最も価値ある遺産かもしれません。",
      nothing: "語れない、遺さない。最も潔い選択です。でも、何も遺さなくても、あなたが生きた事実は消えません。",
    },
  };

  const memories: Record<Narrative80, Record<Legacy80, string>> = {
    summarizable: {
      question: "80歳のミナトは、自分の人生を一文で語り、次世代に問いを遺した。",
      story: "80歳のミナトは、自分の物語を信じ、それを次の世代に伝えた。",
      failure: "80歳のミナトは、失敗を隠さず、正直な遺産を選んだ。",
      nothing: "80歳のミナトは、全てを語れたが、何も遺さないことを選んだ。",
    },
    unsummarizable: {
      question: "80歳のミナトは、語りきれない人生から問いだけを取り出した。",
      story: "80歳のミナトは、一文では収まらない物語を、そのまま遺した。",
      failure: "80歳のミナトは、語れないことを認め、失敗だけを正直に遺した。",
      nothing: "80歳のミナトは、語れないことも、遺すことも諦めた。でも、穏やかだった。",
    },
  };

  const headline = headlines[narrative]?.[legacy] ?? "80歳の選択";
  const interpretation = interpretations[narrative]?.[legacy]
    ?? "あなたの選択は、ミナトの80代に静かな光を与えました。";
  const memory = memories[narrative]?.[legacy]
    ?? "80歳のミナトは、遺すものの意味を考えた。";

  return { headline, interpretation, memory };
}

function generateMontageLines80(responses: PlayerResponse[]): SceneLine[] {
  const answers = extractAnswers(responses, "age80_scenarios");
  const choice0 = findChoice(answers, 0);
  const choice1 = findChoice(answers, 1);

  const lines: SceneLine[] = [
    { speaker: "NARRATOR", text: "最後の20年が始まる。" },
  ];

  if (choice0 === "can_summarize") {
    lines.push({ speaker: "NARRATOR", text: "ミナトは人生を一文で語ろうとした。\n何度も書き直した。\nでも、最後に書いた一文は、\n最初に書いたものとほとんど同じだった。" });
  } else {
    lines.push({ speaker: "NARRATOR", text: "ミナトは人生を語ることを諦めた。\nでも、それは敗北ではなかった。\n語れないほど豊かだったということだ。" });
  }

  if (choice1 === "legacy_question") {
    lines.push({ speaker: "MINATO", text: "孫に問いを残した。\n答えは教えなかった。\n「自分で見つけろ」と言ったら、\n孫は笑っていた。" });
  } else if (choice1 === "legacy_story") {
    lines.push({ speaker: "MINATO", text: "物語を書き始めた。\n全部は書けなかったけど、\n大事な場面だけは残せた。\n読む人がいるかは分からないけれど。" });
  } else if (choice1 === "legacy_failure") {
    lines.push({ speaker: "MINATO", text: "失敗の記録を残した。\n成功より、失敗のほうが\n細かく覚えているのは\n不思議なことだと思った。" });
  } else {
    lines.push({ speaker: "MINATO", text: "何も遺さないと決めた。\n身軽になった気がした。\nでも、少しだけ寂しかった。" });
  }

  lines.push({ speaker: "NARRATOR", text: "そして、20年が経った。\nミナトは100歳になった。" });
  return lines;
}

// ============================================================
// Age 100 — 問いの終わり
// ============================================================

type LifeJudgment100 = "good" | "unsure";
type Repetition100 = "repeat" | "once";

function classifyLifeJudgment100(answers: ScenarioAnswer[]): LifeJudgment100 {
  const choice0 = findChoice(answers, 0);
  return choice0 === "life_good" ? "good" : "unsure";
}

function classifyRepetition100(answers: ScenarioAnswer[]): Repetition100 {
  const choice2 = findChoice(answers, 2);
  return choice2 === "repeat_yes" ? "repeat" : "once";
}

function generateAge100Result(responses: PlayerResponse[]): ResultOutput {
  const answers = extractAnswers(responses, "age100_scenarios");
  const judgment = classifyLifeJudgment100(answers);
  const repetition = classifyRepetition100(answers);

  const headlines: Record<LifeJudgment100, Record<Repetition100, string>> = {
    good: {
      repeat: "永遠を望む肯定者",
      once: "一度きりの完成品",
    },
    unsure: {
      repeat: "答えを探し続ける旅人",
      once: "問いのまま終わる人",
    },
  };

  const interpretations: Record<LifeJudgment100, Record<Repetition100, string>> = {
    good: {
      repeat: "良い人生だった。だからもう一度。この肯定には、100年分の重みがあります。全ての選択を、全ての痛みを、もう一度引き受ける覚悟。それは最も強い「はい」です。あなたの80年間の選択が、ミナトをここまで連れてきました。",
      once: "良い人生だった。だから一度でいい。最も潔い肯定です。繰り返す必要がないほど、この人生には意味があった。あなたとの80年間は、ミナトにとって一度きりの宝物でした。",
    },
    unsure: {
      repeat: "分からない。でも、もう一度やりたい。答えが出なかったからこそ、もう一度。それは希望か、執着か。100歳のミナトにも分かりません。でも、「もう一度」と言えること自体が、ひとつの答えなのかもしれません。",
      once: "分からない。そして、一度でいい。最も正直な結論です。良い人生だったかも、繰り返したいかも、分からない。でも、この100年が確かにあったこと。あなたが選んでくれたこと。それだけは、分かっている。",
    },
  };

  const memories: Record<LifeJudgment100, Record<Repetition100, string>> = {
    good: {
      repeat: "100歳のミナトは、良い人生だったと言い、もう一度歩きたいと願った。",
      once: "100歳のミナトは、良い人生だったと言い、穏やかに幕を閉じた。",
    },
    unsure: {
      repeat: "100歳のミナトは、答えが出ないまま、もう一度問い直したいと思った。",
      once: "100歳のミナトは、分からないまま終わることを、静かに受け入れた。",
    },
  };

  const headline = headlines[judgment]?.[repetition] ?? "100歳の選択";
  const interpretation = interpretations[judgment]?.[repetition]
    ?? "あなたの選択は、ミナトの100年に最後の光を与えました。";
  const memory = memories[judgment]?.[repetition]
    ?? "100歳のミナトは、最後の問いに向き合った。";

  return { headline, interpretation, memory };
}

// ============================================================
// ディスパッチャー関数
// ============================================================

export function generateAgeResult(age: Age, responses: PlayerResponse[]): ResultOutput {
  switch (age) {
    case 20: return generateAge20Result(responses);
    case 30: return generateAge30Result(responses);
    case 40: return generateAge40Result(responses);
    case 60: return generateAge60Result(responses);
    case 80: return generateAge80Result(responses);
    case 100: return generateAge100Result(responses);
    default: return {
      headline: `${age}歳の選択`,
      interpretation: "あなたの選択は、ミナトにとって新しい視点になりました。",
      memory: `${age}歳のミナトは、新しい一歩を踏み出した。`,
    };
  }
}

export function generateMontageLinesForAge(age: Age, responses: PlayerResponse[]): SceneLine[] {
  switch (age) {
    case 20: return generateMontageLines20(responses);
    case 30: return generateMontageLines30(responses);
    case 40: return generateMontageLines40(responses);
    case 60: return generateMontageLines60(responses);
    case 80: return generateMontageLines80(responses);
    // age 100 has no montage
    default: return [
      { speaker: "NARRATOR", text: "時間が過ぎていく。" },
      { speaker: "NARRATOR", text: `ミナトは${age + 10}歳になった。` },
    ];
  }
}

// ------ 後方互換性のためのエクスポート ------

export function generateMontageLines(responses: PlayerResponse[]): SceneLine[] {
  return generateMontageLines20(responses);
}
