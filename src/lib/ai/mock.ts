// ============================================================
// Mock AI Provider — deterministic, no API key required
// ============================================================
import type { AIMessage, AIProvider, AIResponse } from "./provider";

/**
 * Deterministic hash of a string — used to select mock responses.
 * Same input always produces same number.
 */
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Fixed mock response templates keyed by detected intent
const MOCK_RESPONSES: Record<string, string[]> = {
  interpret: [
    JSON.stringify({
      coreTheme: "自由と責任の共存",
      tension: "制度の安定性と個人の自律性の間の葛藤",
      keywords: ["自由", "選択", "責任", "迷い", "自分らしさ"],
      autonomyBias: "high",
      institutionalStance: "ambivalent",
    }),
    JSON.stringify({
      coreTheme: "つながりと孤独の境界",
      tension: "社会に属することと、自分を保つことの矛盾",
      keywords: ["つながり", "孤独", "関係", "距離", "理解"],
      autonomyBias: "neutral",
      institutionalStance: "ambivalent",
    }),
    JSON.stringify({
      coreTheme: "意味と効率の優先順位",
      tension: "役に立つことと、好きなことの間で揺れる",
      keywords: ["意味", "効率", "好奇心", "役割", "価値"],
      autonomyBias: "high",
      institutionalStance: "distrust",
    }),
    JSON.stringify({
      coreTheme: "安定と変化のバランス",
      tension: "現状維持の安心感と変化への渇望",
      keywords: ["安定", "変化", "成長", "リスク", "現状"],
      autonomyBias: "low",
      institutionalStance: "trust",
    }),
  ],
  simulate: [
    JSON.stringify({
      deltas: [
        { key: "autonomy", delta: 3, reason: "プレイヤーの言葉が自律性への問いを強化した" },
        { key: "playerTrust", delta: 2, reason: "言葉の誠実さに信頼が高まった" },
        { key: "institutionalTrust", delta: -2, reason: "制度への依存への疑問が芽生えた" },
      ],
      benefitRealized: "自分自身の選択基準を言語化する契機を得た",
      costIncurred: "制度的な安心感が薄れ、不確実性が増した",
    }),
    JSON.stringify({
      deltas: [
        { key: "riskTolerance", delta: 2, reason: "価値観の表明がリスク許容度を高めた" },
        { key: "selfEfficacy", delta: 1, reason: "自己の考えを持つ力を確認できた" },
        { key: "loneliness", delta: -1, reason: "誰かとの接続感が孤独を和らげた" },
      ],
      benefitRealized: "自己効力感の微増と方向性の手がかりを得た",
      costIncurred: "従来の生活パターンへの依存が一部揺らいだ",
    }),
    JSON.stringify({
      deltas: [
        { key: "futureOutlook", delta: 2, reason: "将来への具体的なイメージが広がった" },
        { key: "interpersonalTrust", delta: -1, reason: "他者との価値観の違いを意識し始めた" },
        { key: "happiness", delta: 1, reason: "自分の考えを持つことへの満足感" },
      ],
      benefitRealized: "将来への見通しが少し明確になった",
      costIncurred: "周囲との差異を意識するようになり、摩擦が生じやすくなった",
    }),
  ],
  event: [
    JSON.stringify({
      id: "ev_autonomy_test",
      title: "選択の岐路",
      description: "制度が推薦した選択と、自分の感覚が示す選択が食い違う瞬間が訪れた。どちらを選んでも、何かを手放すことになる。",
      benefit: "自分の基準で選ぶことで、自律性と自己効力感が高まる",
      cost: "制度の支援から外れ、経済的不安定さが増す可能性がある",
      institutionInvolved: "AIライフデザイン",
    }),
    JSON.stringify({
      id: "ev_community_shift",
      title: "共同体の変容",
      description: "かつて親しかったコミュニティが、制度の変化とともに変質しつつある。残るか、新しい場所を探すか。",
      benefit: "新しいコミュニティで多様な視点と出会う機会",
      cost: "慣れ親しんだ関係性と記憶の場所を失う",
      institutionInvolved: "気候移住割当制",
    }),
    JSON.stringify({
      id: "ev_care_burden",
      title: "ケアの問い",
      description: "家族のケアを必要とする状況が生まれた。制度に任せることと、自分でやることの間で立ちすくむ。",
      benefit: "制度を利用することで、自分の時間と精神的余裕を保てる",
      cost: "関係の自発性が失われ、ケアが義務的なものに変わる",
      institutionInvolved: "ケア貢献ポイント制",
    }),
  ],
  write: [
    JSON.stringify({
      contextLines: [
        { speaker: "SYSTEM", text: "2046年。社会体制が人生の輪郭を決める時代。ミナトのもとに、制度からの通知が届いている。" },
        { speaker: "NARRATOR", text: "画面には推薦された進路が表示されている。この社会では、アルゴリズムの推薦に従うことが「合理的な選択」とされる。逸脱には、支援の打ち切りという静かな罰が伴う。" },
        { speaker: "NARRATOR", text: "窓の外では、気候移住の行列がまた一つ、南の安全区域に向かって出発していく。かつての海沿いの街は、もう地図から消えている。" },
        { speaker: "MINATO", text: "……通知が来た。推薦通りにすれば、住む場所も奨学金も確定する。でも、画面を閉じられない。" },
      ],
      conflictLines: [
        { speaker: "MINATO", text: "この社会では「従う」ことが安定につながる。それは事実だ。でも、従った先に、自分で選んだという感覚はあるんだろうか。" },
        { speaker: "MINATO", text: "友達は気候移住の割当で故郷を離れた。制度は彼女を守った。でも、彼女は泣いていた。守られることと、幸せなことは、違うのかもしれない。" },
      ],
      minatoThoughtLines: [
        { speaker: "MINATO", text: "あなたの時代には、こういう「推薦」はなかったんですよね。自分で選ぶしかなかった時代。" },
        { speaker: "MINATO", text: "制度が用意してくれた安全な道と、自分の足で歩く不確かな道。あなたなら、どちらを信じますか？" },
      ],
      inputPrompt: "この世界で生きるミナトに、あなたはどんな言葉を渡しますか？制度の安全と自分の選択の間で揺れるミナトに、あなたが大切にしていることを伝えてください。",
      perspectiveHint: "制度に従うことは「諦め」とは限らない。制度を利用しながら自分を保つ方法もある。あなたにとって「自分で選ぶ」とは何を意味しますか？",
    }),
    JSON.stringify({
      contextLines: [
        { speaker: "SYSTEM", text: "2051年。社会の仕組みが日常を形づくる時代、ミナトは25歳になった。" },
        { speaker: "NARRATOR", text: "この社会では生活のあらゆる面が最適化されている。食事の推薦、移動の最適ルート、人間関係の相性スコア。不便は減った。でも、何かが足りない。" },
        { speaker: "NARRATOR", text: "気候の影響で季節感が変わった。桜の開花は予測不能になり、代わりに人工的な花見イベントが「推薦」される。参加率は高い。しかし、誰もがどこか上の空だ。" },
        { speaker: "MINATO", text: "不便なことが減った。でも、なぜか豊かになった気がしない。あの頃、あなたが言ってくれた言葉をまだ覚えている。" },
      ],
      conflictLines: [
        { speaker: "MINATO", text: "最適化された生活は快適だ。でも、自分が何かを「選んだ」感覚がない。推薦を受け入れることと、自分で決めることの境界が分からなくなってきた。" },
        { speaker: "MINATO", text: "この前、推薦されていない古い喫茶店に入った。非効率だった。でも、そこで飲んだコーヒーの味は、なぜかずっと覚えている。" },
      ],
      minatoThoughtLines: [
        { speaker: "MINATO", text: "効率と意味は、同じじゃない。それがこの5年で一番大きな気づきかもしれない。" },
        { speaker: "MINATO", text: "あなたは今の自分の生活の中で、「効率的じゃないけど大切なもの」って、ありますか？" },
      ],
      inputPrompt: "25歳のミナトが感じている「効率と意味のずれ」について、あなた自身の経験や考えを言葉にしてください。",
      perspectiveHint: "「非効率なものに価値がある」とは限らない。効率の中にも意味は見つけられるかもしれない。あなたが「これは効率では測れない」と感じるものは何ですか？",
    }),
  ],
  postWrite: [
    JSON.stringify({
      sceneLines: [
        { speaker: "NARRATOR", text: "その言葉は、静かにミナトの中に降り積もっていった。" },
        { speaker: "MINATO", text: "……そういう考え方をしたことは、なかった。" },
        { speaker: "MINATO", text: "違う、という感じじゃない。でも、簡単に「そうだ」とも言えない。" },
        { speaker: "NARRATOR", text: "AIの推薦通知は、まだ画面の隅に残っている。締め切りまで、あと三日。" },
        { speaker: "MINATO", text: "もう少しだけ、考えてみる。" },
      ],
      newMemory: {
        title: "画面の前の静止",
        description: "選択の前で立ち止まった。答えは出なかったが、問いの形が少し変わった。",
        emotionalTone: "ambivalent",
        keywords: ["選択", "迷い", "問い"],
      },
    }),
    JSON.stringify({
      sceneLines: [
        { speaker: "SYSTEM", text: "数週間後。" },
        { speaker: "NARRATOR", text: "ミナトは、あの言葉を何度も思い返した。" },
        { speaker: "MINATO", text: "あなたが言っていたことは、正しいとも間違いとも言えない。" },
        { speaker: "MINATO", text: "でも、それがむしろ助かった。正解を押しつけられなかったから。" },
        { speaker: "NARRATOR", text: "制度の推薦通知は、まだ有効だった。ミナトはまだ、決めていない。" },
        { speaker: "MINATO", text: "この迷いが、何かを決めるための時間なんだと、最近は思っている。" },
      ],
    }),
    JSON.stringify({
      sceneLines: [
        { speaker: "NARRATOR", text: "ミナトは、その言葉を少し誤解した。" },
        { speaker: "MINATO", text: "「自由」……か。でも、僕にとっての自由って何なんだろう。" },
        { speaker: "MINATO", text: "制度を外れることが自由とは、限らない気がする。" },
        { speaker: "NARRATOR", text: "プレイヤーの意図とは少し違う解釈だったかもしれない。でも、それがミナトの言葉になった。" },
        { speaker: "MINATO", text: "……ちょっと、整理する時間をください。" },
      ],
      newConflict: {
        description: "「自由」という言葉の意味が、制度の内側と外側で全く異なって見える",
        involvedValues: ["自由", "制度", "選択"],
      },
    }),
  ],
  validate: [
    JSON.stringify({
      isConsistent: true,
      issues: [],
      repairNeeded: false,
    }),
    JSON.stringify({
      isConsistent: false,
      issues: ["感情の変化が急激すぎる可能性があります"],
      repairNeeded: true,
    }),
  ],
  repair: [
    JSON.stringify({
      contextLines: [
        { speaker: "MINATO", text: "……少し混乱していたかもしれない。" },
        { speaker: "MINATO", text: "でも、その混乱は本物だった。" },
      ],
      conflictLines: [
        { speaker: "MINATO", text: "矛盾したことを感じている。それが今の正直なところだ。" },
      ],
      minatoThoughtLines: [
        { speaker: "MINATO", text: "だから、もう少し時間をかけて考えたい。" },
      ],
      inputPrompt: "ミナトは今、整理の途中です。あなたは何を伝えますか？",
      perspectiveHint: "答えがなくても構いません。あなたが感じた違和感を言葉にしてください。",
    }),
  ],
  compress: [
    JSON.stringify({
      summary: "20歳のときに受け取った「自分で選ぶ」という問いが、その後の価値観の核となった。",
      keywords: ["選択", "自律", "迷い"],
    }),
    JSON.stringify({
      summary: "制度の外で生きることへの怖れと、制度の中で失うものへの怖れが、常に並走してきた。",
      keywords: ["制度", "自由", "恐れ"],
    }),
  ],
  gapStory: [
    JSON.stringify({
      sceneLines: [
        { speaker: "NARRATOR", text: "時間が流れた。季節が何度も巡り、ミナトの周りの景色は少しずつ変わっていった。" },
        { speaker: "MINATO", text: "あの頃の自分に言いたいことがある。でも、言葉にすると、違うものになってしまう気がする。" },
        { speaker: "NARRATOR", text: "制度が変わり、街が変わり、人々の暮らし方が変わった。しかしミナトの中にある問いは、形を変えながらも消えなかった。" },
        { speaker: "MINATO", text: "失ったものもある。でも、それは手放したのかもしれない。" },
        { speaker: "NARRATOR", text: "新しい出会いがあり、古い関係が変容した。すべてが計画通りではなかったが、それでも人生は続いた。" },
        { speaker: "MINATO", text: "あなたが残してくれた言葉は、まだここにある。少し、形は変わったけれど。" },
        { speaker: "NARRATOR", text: "そして、次の章が始まろうとしている。" },
      ],
    }),
    JSON.stringify({
      sceneLines: [
        { speaker: "NARRATOR", text: "10年という時間は、思ったよりも早く、しかし確実にミナトを変えた。" },
        { speaker: "MINATO", text: "気づいたら、自分が「大人」と呼ばれる側にいた。それが不思議でもあり、少し寂しくもある。" },
        { speaker: "NARRATOR", text: "社会の仕組みが変わるたびに、ミナトは自分の立ち位置を確認した。流されているのか、選んでいるのか。" },
        { speaker: "MINATO", text: "答えは出なかった。でも、問い続けることが、たぶん自分のやり方なんだと思う。" },
        { speaker: "NARRATOR", text: "ミナトは振り返ることが増えた。過去の選択の意味を、今の自分の目で見つめ直すようになった。" },
        { speaker: "MINATO", text: "後悔は……あまりない。ただ、もう少し早く気づけたらと思うことは、ある。" },
        { speaker: "NARRATOR", text: "新しい年齢の扉が開く。ミナトは、静かにそこへ踏み出す。" },
      ],
    }),
  ],
  report: [
    JSON.stringify({
      preserved: "自分で選んだという感覚を守り続けた。たとえ小さな選択であっても、それが自分の人生だという確信を手放さなかった。",
      lost: "制度の外に出たことで、いくつかの関係性と経済的な安定感を失った。失うことを怖れていたものを、実際に失った。",
      inheritedFromPlayer: "「自分で選ぶことの意味」という問いを受け取り、それを生涯の指針とした。",
      rejectedOrReinterpreted: "「失敗しないこと」を成功と見なす価値観を、途中から「自分の言葉で生きること」として再解釈した。",
      socialGains: "非推薦のコミュニティとのつながりと、制度外の知識体系を獲得した。",
      relationalLosses: "効率を優先した時代に、時間をかけた深い関係を育てる機会を逃した。",
      longestWord: "「迷うことは、自分の輪郭を確かめる時間だった」",
      sideEffectOfGoodIntent: "自律を守ろうとするあまり、助けを求めることを後回しにし続けた。",
      minatosCurrentView: "正解のない選択をしてきたことを、今は後悔していない。ただ、もっと早く「なぜ選ぶのか」を言葉にしておけばよかったと思う。",
      questionToPlayer: "あなたは、自分の選択に理由を持っていますか？その理由は、誰かに渡せるものですか？",
    }),
  ],
};

function detectIntent(messages: AIMessage[], systemPrompt?: string): string {
  // Use precise stage-name detection to avoid keyword collisions
  const sys = (systemPrompt ?? "").toLowerCase();
  if (sys.includes("input interpreter")) return "interpret";
  if (sys.includes("state simulator")) return "simulate";
  if (sys.includes("event director")) return "event";
  if (sys.includes("scene repair")) return "repair";
  if (sys.includes("post-input sequence")) return "postWrite";
  if (sys.includes("scene writer")) return "write";
  if (sys.includes("consistency validator")) return "validate";
  if (sys.includes("memory compressor")) return "compress";
  if (sys.includes("gap period")) return "gapStory";
  if (sys.includes("life observation report")) return "report";
  // Fallback: check user content keywords
  const content = messages.map((m) => m.content).join(" ").toLowerCase();
  if (content.includes("interpret") && content.includes("age")) return "interpret";
  if (content.includes("state simulator") || (content.includes("delta") && content.includes("state"))) return "simulate";
  if (content.includes("event director")) return "event";
  if (content.includes("report") && content.includes("observation")) return "report";
  return "write";
}

export class MockProvider implements AIProvider {
  name = "mock";

  async complete(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    // Simulate a small async delay
    await new Promise((r) => setTimeout(r, 50));

    const intent = detectIntent(messages, systemPrompt);
    const candidates = MOCK_RESPONSES[intent] ?? MOCK_RESPONSES["write"];

    // Deterministic selection based on input hash
    const inputStr = (systemPrompt ?? "") + messages.map((m) => m.content).join("");
    const idx = simpleHash(inputStr) % candidates.length;
    const content = candidates[idx];

    return {
      content,
      model: "mock-deterministic-v1",
      usage: { inputTokens: 0, outputTokens: 0 },
    };
  }
}
