// ============================================================
// Age 30 — Step definitions
// 2056年、ミナトの信頼と現実
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";

// ------ 30歳の語り ------
const AGE_30_OPENING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2056年。ミナトは30歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "……久しぶりです。\n10年経ちました。",
  },
  {
    speaker: "MINATO",
    text: "設計書通りに進んだ部分もあるし、\nそうでない部分もあります。\nでも、どちらにしても、\nこの10年で「信頼」の意味が変わりました。",
  },
  {
    speaker: "MINATO",
    text: "今の僕に、少し付き合ってもらえますか？",
  },
];

// ------ 40歳への接続 ------
const AGE_40_RETELLING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2066年。ミナトは40歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "30代は、思っていたより長かった。\nでも、振り返ると一瞬だった。",
  },
  {
    speaker: "MINATO",
    text: "あのとき選んでくれたこと、\n今の僕には違う意味を持っています。\n信頼って、変わっていくものなんですね。",
  },
];

// ============================================================
// ステップ定義
// ============================================================
export const AGE_30_STEPS: AgeStepDef[] = [
  // Step 1: 30歳の語り
  {
    id: "age30_opening",
    type: "narrative",
    title: "30歳のミナト",
    lines: AGE_30_OPENING,
  },
  // Step 2: シナリオ（3つの思考実験）
  {
    id: "age30_scenarios",
    type: "scenario",
    title: "信頼の実験",
    scenarios: [
      // Scenario 1: 旧友 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "大学時代の友人から連絡が来ました。AIの「関係性最適化」では「交流非推奨」と判定された相手です。",
          },
          {
            speaker: "MINATO",
            text: "「最近うまくいってなくて、話を聞いてほしい」って。AIは「この関係はあなたの幸福度を下げる可能性が高い」と警告してきました。",
          },
        ],
        question: "あなたなら、どうしますか？",
        mode: "binary",
        choices: [
          {
            id: "help_friend",
            label: "会いに行く",
            description: "AIの判定より、自分の気持ちを信じる。困っている人を放っておけない。",
            minatoReaction: "……ありがとう。\n信頼って、損得じゃないんだよね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "会いに行ったら、思っていたより深刻だった。友人は仕事で大きなミスを隠していて、「上司に嘘の報告書を出すのを手伝ってほしい」と言ってきた。",
                },
                {
                  speaker: "MINATO",
                  text: "助けたい気持ちはある。でも、嘘をつくことと信頼を守ることは、同じだろうか。",
                },
              ],
              question: "友人のために嘘をつきますか？",
              mode: "binary",
              choices: [
                {
                  id: "lie_for_friend",
                  label: "嘘をつく",
                  description: "今この人を救えるのは自分だけ。信頼とは、きれいごとだけじゃない。",
                  minatoReaction: "嘘をつくか……。\n信頼を守るために真実を曲げる。矛盾だけど、温かい矛盾だ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "嘘は通った。友人は救われた。でも、自分の中に小さな棘が残った。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「正しくないことをした」という感覚と、「友人を守れた」という安堵が、同時にある。",
                      },
                    ],
                    question: "正しくない手段で誰かを守ったとき、それは「信頼」と呼べますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "dirty_trust",
                        label: "呼べる",
                        description: "信頼は清廉さの中だけにあるわけじゃない。泥の中にも信頼はある。",
                        minatoReaction: "泥の中の信頼か。\n……きれいな言葉より、ずっと重い。",
                      },
                      {
                        id: "not_trust",
                        label: "呼べない",
                        description: "嘘の上に築いた関係は、いつか崩れる。本当の信頼は誠実さの上にある。",
                        minatoReaction: "誠実さの上の信頼……。\n理想だけど、そう信じたい自分もいる。",
                      },
                    ],
                  },
                },
                {
                  id: "refuse_lie",
                  label: "嘘はつけない",
                  description: "助けたいが、嘘をつくことは友人のためにもならない。別の方法を探す。",
                  minatoReaction: "嘘はつけないか。\n誠実であることを選んだ。でも、それで友人は救えるだろうか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "正直に話すべきだと伝えたら、友人は黙って帰っていった。翌週、友人は自分で上司に打ち明けた。処分は受けたけど、隠し続けるよりは軽かった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "友人から「あのとき断ってくれて、ありがとう」とメッセージが来た。",
                      },
                    ],
                    question: "「断ること」が最も深い信頼の形だったと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "refusal_is_trust",
                        label: "そう思う",
                        description: "相手の望みを叶えることだけが信頼じゃない。本当の意味で相手を信じたから断れた。",
                        minatoReaction: "断ることが信頼か。\n……相手の強さを信じるということ。それは深い。",
                      },
                      {
                        id: "refusal_is_risky",
                        label: "結果論だと思う",
                        description: "今回はうまくいったが、断ったことで関係が壊れる可能性もあった。",
                        minatoReaction: "結果論か……。\n正しい選択が常に良い結果を生むわけじゃない。それもまた現実だ。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "keep_distance",
            label: "距離を置く",
            description: "AIの判定には理由があるはず。自分の生活を守ることも大切。",
            minatoReaction: "冷たいわけじゃない。\n自分を守ることも、一つの誠実さだと思う。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "一ヶ月後、共通の友人から聞いた。あの友人、仕事を辞めて引きこもっているらしい。AIが「予測通りの展開です」と表示した。",
                },
                {
                  speaker: "MINATO",
                  text: "予測が当たった。でも、この気持ちは何だろう。正しかったはずなのに、胸の奥が重い。",
                },
              ],
              question: "AIの予測が正しかったことに、安堵しますか？",
              mode: "binary",
              choices: [
                {
                  id: "feel_vindicated",
                  label: "正しい判断だった",
                  description: "巻き込まれていたら自分も傷ついていた。AIの警告を聞いてよかった。",
                  minatoReaction: "正しかったか……。\nでも、「正しい」と感じるたびに、少し孤独になる気がする。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "正しい判断を重ねるたびに、周りの人との距離が少しずつ広がっていく。AIは「最適な人間関係の維持」と呼ぶ。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、最適化された人間関係の中に、「この人のためなら損をしてもいい」と思える人が一人もいない。",
                      },
                    ],
                    question: "損をしてもいいと思える人がいない人生は、安全ですか、それとも空虚ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "safe_life",
                        label: "安全だ",
                        description: "傷つかない人生には価値がある。痛みがないことは幸福の条件だ。",
                        minatoReaction: "安全か。\n……傷つかないことを「生きている」と呼べるのか、僕にはまだ分からない。",
                      },
                      {
                        id: "empty_life",
                        label: "空虚だ",
                        description: "誰かのために痛みを引き受ける覚悟がないと、人生は軽くなりすぎる。",
                        minatoReaction: "空虚か。\n……自分を守り続けた先にあるのが空虚なら、何のための防衛だったんだろう。",
                      },
                    ],
                  },
                },
                {
                  id: "feel_guilty",
                  label: "罪悪感がある",
                  description: "正しかったかもしれない。でも、あのとき手を差し伸べていたら、何か変わっていたかもしれない。",
                  minatoReaction: "罪悪感か。\n……その感情がある限り、まだ人との繋がりを捨てきれていない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "罪悪感を抱えたまま、友人に連絡してみた。「今さら何？」と言われるかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "既読はついた。でも返事はない。AIは「関係修復確率: 12%」と表示した。",
                      },
                    ],
                    question: "12%の可能性に賭けて、もう一度連絡しますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "try_reconnect",
                        label: "もう一度連絡する",
                        description: "12%でも0%じゃない。後悔するくらいなら行動したい。",
                        minatoReaction: "12%に賭けるのか。\n……一度距離を置いた人が戻ってくるのは、最初に寄り添うより難しい。でも、その勇気は本物だ。",
                      },
                      {
                        id: "accept_loss",
                        label: "そっとしておく",
                        description: "今さら連絡しても自己満足かもしれない。相手の気持ちを優先する。",
                        minatoReaction: "そっとしておくか。\n……「相手のため」と言いながら、もう一度拒絶されるのが怖いだけかもしれない。でも、それも正直だ。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: 昇格 (multiChoice)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "会社で主任に昇格しました。予定通り、28歳で。でも、上司にこう言われたんです。",
          },
          {
            speaker: "MINATO",
            text: "「君の昇格はAIの人事最適化が推奨したものだ。実力ではなく、システムの判断だ」と。",
          },
        ],
        question: "この状況で、あなたならどう受け止めますか？",
        mode: "multiChoice",
        choices: [
          {
            id: "prove_self",
            label: "実力で証明する",
            description: "AIの推奨だろうと、結果で黙らせればいい。自分の力を見せる。",
            minatoReaction: "自分の力で証明したい。\nその気持ちは、10年前から変わってないかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "それから2年、誰よりも早く出社して、誰よりも遅く帰った。成果は出た。数字は嘘をつかない。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、気づいたら同僚たちが距離を置き始めていた。「あいつは自分のことしか考えていない」って。実力を証明するほど、孤立していく。",
                },
              ],
              question: "実力の証明と引き換えに孤立したことは、価値がありましたか？",
              mode: "binary",
              choices: [
                {
                  id: "isolation_worth_it",
                  label: "価値があった",
                  description: "自分の力で立てることが証明できた。孤独は、強さの代償だ。",
                  minatoReaction: "孤独は強さの代償か。\n……でも、誰にも認められない強さは、本当に強さだろうか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "33歳。実績は十分なのに、次の昇格候補に名前がなかった。AIの評価は高いが、「チーム協調性」のスコアが著しく低い。",
                      },
                      {
                        speaker: "MINATO",
                        text: "個人の実力と、組織の中での価値は、別物なのかもしれない。",
                      },
                    ],
                    question: "「個の力」と「組織の中の力」、どちらがより本質的な実力だと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "individual_power",
                        label: "個の力",
                        description: "組織は変わるが、自分の力は残る。依存しない強さこそ本質。",
                        minatoReaction: "個の力か。\n……一人で立てる強さは美しい。でも、一人で立ち続けるのは、とても疲れる。",
                      },
                      {
                        id: "collective_power",
                        label: "組織の中の力",
                        description: "人は一人では何もできない。誰かと共に成果を出すことが本当の実力。",
                        minatoReaction: "共に出す成果か。\n……証明しようとして孤立した僕に、足りなかったのはそれかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "isolation_not_worth",
                  label: "間違っていた",
                  description: "実力を証明しても、一緒に喜んでくれる人がいなければ意味がない。",
                  minatoReaction: "意味がない、か。\n……成果の先に人がいないと、何のために頑張ったのか分からなくなる。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "間違いに気づいて、少しずつ態度を変えた。残業を減らし、後輩の相談に乗るようにした。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、一度失った信頼を取り戻すのは、最初から築くより何倍も難しい。「今さら優しくされても」と言われた。",
                      },
                    ],
                    question: "一度壊した関係を修復する努力は、報われると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "repair_possible",
                        label: "報われる",
                        description: "時間はかかるが、態度を変え続ければ伝わる。信頼は再構築できる。",
                        minatoReaction: "再構築できるか。\n……信じたい。壊したものを直す力も、実力のうちだと。",
                      },
                      {
                        id: "repair_impossible",
                        label: "報われないかもしれない",
                        description: "でも、報われなくても変わろうとすること自体に意味がある。",
                        minatoReaction: "報われなくても……か。\n結果じゃなく過程に意味を見出す。それは「証明」とは正反対の生き方だね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "accept_system",
            label: "受け入れる",
            description: "システムが自分を評価した。それは客観的な実力の証明でもある。",
            minatoReaction: "システムに委ねる。\nそれも一つの信頼の形だよね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "32歳、予定通りまた昇格した。AIの人事評価は正確で、僕のキャリアは設計書通りに進んでいる。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、昇格の通知を見たとき、何も感じなかった。嬉しくもなく、悲しくもなく。ただ「そうか」と思った。成功に麻痺している自分がいる。",
                },
              ],
              question: "成功に何も感じなくなることは、問題だと思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "numbness_problem",
                  label: "問題だと思う",
                  description: "感情が動かない成功は、生きている実感を奪う。心が死んでいく。",
                  minatoReaction: "心が死んでいく、か。\n……最適化された人生の副作用を、誰も教えてくれなかった。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "問題だと認めた。じゃあ、どうすればいい？AIは「感情反応の鈍化は高効率パフォーマーの一般的傾向です」と言う。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「一般的傾向」——つまり、僕だけじゃない。この時代の「成功者」はみんな、同じ空虚を抱えているのかもしれない。",
                      },
                    ],
                    question: "みんなが同じ空虚を抱えているなら、それは「問題」ではなく「時代の特徴」ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "still_problem",
                        label: "それでも問題だ",
                        description: "みんなが苦しんでいるなら、なおさら声を上げるべき。普通の病は見えにくい。",
                        minatoReaction: "普通の病か。\n……全員が麻痺しているなら、誰が最初に「おかしい」と言い出すんだろう。",
                      },
                      {
                        id: "era_feature",
                        label: "時代の特徴だ",
                        description: "感じ方が変わっただけで、不幸ではない。幸福の定義自体が変わったのかも。",
                        minatoReaction: "幸福の定義が変わった……。\n受け入れることで楽になるか、鈍くなるか。その境界線が見えない。",
                      },
                    ],
                  },
                },
                {
                  id: "numbness_fine",
                  label: "問題ではない",
                  description: "感情に振り回されないのは成熟の証。淡々と進めることが大人の強さ。",
                  minatoReaction: "成熟の証か。\n……感情を手放すことと、感情を失うことは、同じだろうか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "問題ないと決めて日々を過ごしていたら、後輩が泣きながら相談に来た。「昇格できなかった」と。",
                      },
                      {
                        speaker: "MINATO",
                        text: "涙を見て、自分はいつから泣かなくなったんだろう、と思った。昇格しても泣かず、失敗しても泣かず。",
                      },
                    ],
                    question: "泣けなくなったことは、強くなった証ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "tears_weakness",
                        label: "強くなった証だ",
                        description: "感情をコントロールできるのは能力。泣かないことは弱さではない。",
                        minatoReaction: "コントロールか。\n……でも、コントロールしているのか、感じなくなっただけなのか、自分でも分からない。",
                      },
                      {
                        id: "tears_human",
                        label: "何かを失った証だ",
                        description: "泣けることは人間の特権。感情の動きを手放してはいけない。",
                        minatoReaction: "何かを失った……。\nシステムに委ねた結果、感情まで委ねてしまったのかもしれない。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "question_system",
            label: "制度を疑う",
            description: "AIが人の価値を決める仕組み自体がおかしい。声を上げるべきだ。",
            minatoReaction: "制度を疑うか……。\n声を上げるのは勇気がいるけど、黙っていたら何も変わらない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "社内で意見書を出した。「AI人事評価の透明性を求める」と。共感してくれる人もいた。でも、管理職からは「トラブルメーカー」のレッテルを貼られた。",
                },
                {
                  speaker: "MINATO",
                  text: "昇格取り消しこそなかったけど、重要なプロジェクトからは外された。AIの評価項目に「組織適応性」があるのは皮肉だ。",
                },
              ],
              question: "もう一度同じ状況になったとしても、声を上げますか？",
              mode: "binary",
              choices: [
                {
                  id: "speak_again",
                  label: "また声を上げる",
                  description: "一度黙ったら、もう二度と声を上げられなくなる。正しいと信じることを貫く。",
                  minatoReaction: "また声を上げるか。\n……代償を知った上で選ぶ勇気は、最初の勇気より重い。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "二度目の意見書を出した。今度は社外メディアにも取り上げられた。会社は対応を迫られ、評価制度の一部が見直された。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、僕自身のキャリアは完全に止まった。変化を起こした人間が、その変化の恩恵を受けられない。",
                      },
                    ],
                    question: "自分が恩恵を受けられなくても、制度を変えたことに意味はありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "sacrifice_meaningful",
                        label: "意味がある",
                        description: "自分の犠牲で次の世代が救われるなら、それは十分な意味だ。",
                        minatoReaction: "次の世代のために、か。\n……自分の人生を燃料にして、他者の道を照らす。崇高だけど、寂しくないか。",
                      },
                      {
                        id: "sacrifice_unfair",
                        label: "不公平だと思う",
                        description: "正しいことをした人間が報われない社会は、まだ壊れている。",
                        minatoReaction: "不公平か。\n……その怒りを持ち続けることが、次の変化の種になるのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "stay_quiet",
                  label: "次は黙っておく",
                  description: "理想だけでは生きていけない。現実の中で生き延びる知恵も必要。",
                  minatoReaction: "黙ることを選ぶか。\n……理想と現実の間で、折り合いをつけることも生きる力だ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "黙ると決めた。でも、後輩が同じ疑問を持って相談に来た。「先輩、この評価制度おかしくないですか？」",
                      },
                      {
                        speaker: "MINATO",
                        text: "自分が黙ることと、後輩にも黙れと言うことは、違う。でも、正直に話したら後輩も同じ目に遭うかもしれない。",
                      },
                    ],
                    question: "後輩に本音を伝えますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "tell_truth",
                        label: "本音を伝える",
                        description: "自分は黙ると決めても、後輩の判断材料を奪う権利はない。",
                        minatoReaction: "本音を伝えるか。\n……自分が声を上げなくても、次の誰かに松明を渡すことはできる。",
                      },
                      {
                        id: "protect_junior",
                        label: "波風を立てるなと言う",
                        description: "後輩を守るために、現実的な処世術を教える。それも先輩の役目。",
                        minatoReaction: "波風を立てるなと言うか。\n……かつて声を上げた自分が、今度は沈黙を勧める。人は変わるものだな。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 3: 週末 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "最近、週末の過ごし方を考えることがあります。",
          },
          {
            speaker: "MINATO",
            text: "AIが最適化した予定通りに過ごすと、快適で、健康的で、生産的です。でも、月曜日にはもう何をしたか思い出せない。",
          },
          {
            speaker: "MINATO",
            text: "逆に、突発的に出かけたり、知らない場所に行ったりすると、疲れるし失敗もある。でも、なぜかずっと覚えている。",
          },
        ],
        question: "どちらの週末を選びますか？",
        mode: "binary",
        choices: [
          {
            id: "comfortable",
            label: "心地よいが思い出せない日々",
            description: "効率的で快適な日常。確実に幸福度は維持される。",
            minatoReaction: "穏やかな日々か。\n……それが一番難しいのかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "最適化された週末を2年間続けた。健康状態は良好、ストレス指数は低い。AIの幸福度スコアは過去最高を記録している。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、先月何をしたか思い出せない。先々月も。AIは「幸福度スコア: 82.7。あなたは十分に幸せです」と表示している。数字は高い。でも、「十分に幸せ」って、誰が決めるんだろう。",
                },
              ],
              question: "AIが「あなたは幸せだ」と言うなら、それで十分ですか？",
              mode: "binary",
              choices: [
                {
                  id: "ai_happiness_enough",
                  label: "十分だ",
                  description: "自分の感覚より客観的な指標の方が信頼できる。幸せを感じられないのは認知の歪みかもしれない。",
                  minatoReaction: "客観的な幸福か。\n……自分の感覚を疑い始めたら、何を信じればいいんだろう。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "AIの指標を信じると決めた。でも、ある日ふと、子どもの頃に泥だらけで遊んだ夏の日を思い出した。あのとき幸福度なんて測ってなかった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "測っていなかったのに、30年経った今でもはっきり覚えている。",
                      },
                    ],
                    question: "測れない幸福と、測れる幸福。どちらがより「本物」だと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "unmeasured_real",
                        label: "測れない幸福",
                        description: "記憶に残るものが本物。数字で捉えられない感動こそ人間の幸福。",
                        minatoReaction: "測れない幸福か。\n……数字を信じると決めたのに、記憶が裏切る。人間は矛盾している。",
                      },
                      {
                        id: "measured_real",
                        label: "測れる幸福",
                        description: "記憶は美化される。客観的データの方が偏りがない。",
                        minatoReaction: "測れる幸福か。\n……記憶は嘘をつく。でも、嘘でも温かい記憶には価値がないだろうか。",
                      },
                    ],
                  },
                },
                {
                  id: "ai_happiness_not_enough",
                  label: "十分じゃない",
                  description: "幸せかどうかは自分が感じるもの。数字に決められたくない。",
                  minatoReaction: "自分で感じたいか。\n……でも、「感じる」力自体が鈍っていたら、どうすればいい。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "十分じゃないと気づいた。でも、2年間最適化された生活に慣れた体は、不確実なことを避けたがる。",
                      },
                      {
                        speaker: "MINATO",
                        text: "快適さは麻薬に似ている。抜け出したいのに、抜け出すこと自体が不快。",
                      },
                    ],
                    question: "快適さから抜け出す「不快」を受け入れる覚悟はありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "accept_discomfort",
                        label: "受け入れる",
                        description: "不快の先にしか、自分だけの幸福はない。痛みを引き受ける。",
                        minatoReaction: "不快を引き受けるか。\n……快適さの檻を壊すには、自分自身を壊す覚悟がいる。",
                      },
                      {
                        id: "stay_comfortable",
                        label: "まだ覚悟ができない",
                        description: "分かっていても動けない。それも正直な自分。",
                        minatoReaction: "まだ動けないか。\n……「分かっているのに動けない」という苦しみ。それが一番人間らしい。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "memorable",
            label: "不快かもしれないが忘れられない日々",
            description: "予定外の出来事。疲れるかもしれないが、記憶に残る。",
            minatoReaction: "記憶に残る人生か。\n痛みも含めて、生きた証がほしい。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "予定外の週末を選び続けて半年。知らない街を歩き、知らない人と話し、予想外のトラブルにも遭った。毎週が冒険だった。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、月曜日の仕事に支障が出始めた。生産性が12%低下。上司に「週末の過ごし方を見直せ」と言われた。AIも「パフォーマンス最適化のため、休息パターンの修正を推奨します」と。",
                },
              ],
              question: "生産性が下がっても、この生き方を続けますか？",
              mode: "binary",
              choices: [
                {
                  id: "keep_living",
                  label: "続ける",
                  description: "生産性のために生きているわけじゃない。記憶に残る日々の方が大切。",
                  minatoReaction: "続けるか。\n……仕事のために生きるのか、生きるために仕事をするのか。答えは明白だ、と言いたい。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "続けた結果、昇給は見送られた。同期との収入差が開いていく。でも、週末に出会った人たちとの繋がりは、お金では買えないものだった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "経済的安定と、人生の密度。両方を手に入れることは、この時代では不可能なのかもしれない。",
                      },
                    ],
                    question: "経済的安定を犠牲にしてでも、人生の密度を選び続けますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "density_over_stability",
                        label: "密度を選ぶ",
                        description: "お金は必要だが、記憶のない人生にいくら貯金があっても意味がない。",
                        minatoReaction: "密度を選ぶか。\n……老後の不安より、今日の空虚の方が怖い。その感覚は、たぶん正しい。",
                      },
                      {
                        id: "balance_needed",
                        label: "バランスを探す",
                        description: "どちらかを完全に犠牲にする必要はない。両立の道を見つけたい。",
                        minatoReaction: "バランスか。\n……「全か無か」じゃない生き方。実は一番難しいけど、一番賢い。",
                      },
                    ],
                  },
                },
                {
                  id: "adjust_pace",
                  label: "少し調整する",
                  description: "記憶に残る日々は大事だが、仕事を失ったら冒険もできない。現実と折り合いをつける。",
                  minatoReaction: "調整するか。\n……理想と現実の間で揺れること。それが30代ということなのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "月に2回だけ「予定外の週末」を残して、残りはAIの推奨に従うことにした。妥協だと分かっている。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも不思議なことに、月2回の冒険がより鮮烈になった。制限があるから、一回一回が濃くなる。",
                      },
                    ],
                    question: "制限の中の自由は、完全な自由より価値がありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "constrained_freedom",
                        label: "価値がある",
                        description: "制限があるからこそ、選択に重みが生まれる。無制限の自由は散漫になる。",
                        minatoReaction: "制限が重みを生む、か。\n……完全な自由より、選び取った自由の方が美しいのかもしれない。",
                      },
                      {
                        id: "full_freedom",
                        label: "妥協にすぎない",
                        description: "本当は毎週冒険したい。制限を受け入れたのは現実に負けただけ。",
                        minatoReaction: "妥協か。\n……でも、妥協を自覚しながら生きることも、一つの誠実さだと思う。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  // Step 3: 結果
  {
    id: "age30_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 4: タイムライン保存
  {
    id: "age30_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // Step 5: モンタージュ 30→40歳
  {
    id: "age30_montage",
    type: "montage",
    title: "10年の歳月",
    montageFromAge: 30,
    montageToAge: 40,
  },
  // Step 6: 40歳への接続
  {
    id: "age40_retelling",
    type: "narrative",
    title: "40歳のミナト",
    lines: AGE_40_RETELLING,
  },
];
