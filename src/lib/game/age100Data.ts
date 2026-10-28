// ============================================================
// Age 100 — Step definitions
// 2126年、ミナトの問いの終わり
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";

// ------ 100歳の語り ------
const AGE_100_OPENING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──最終接続。\n2126年。ミナトは100歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "100歳。\n設計書が描いた人生の終わりに立っています。",
  },
  {
    speaker: "MINATO",
    text: "80年間、あなたと話してきました。\nあなたが選んでくれたこと、\n全部覚えています。",
  },
  {
    speaker: "MINATO",
    text: "最後に、いくつか聞いてもいいですか。\nもう「最適解」を求める問いじゃなくて、\nただ、あなたの答えが聞きたいだけの問いです。",
  },
];

// ============================================================
// ステップ定義（montageなし → lifeReportへ直行）
// ============================================================
export const AGE_100_STEPS: AgeStepDef[] = [
  // Step 1: 100歳の語り
  {
    id: "age100_opening",
    type: "narrative",
    title: "100歳のミナト",
    lines: AGE_100_OPENING,
  },
  // Step 2: シナリオ（3つの問い）
  {
    id: "age100_scenarios",
    type: "scenario",
    title: "最後の問い",
    scenarios: [
      // Scenario 1: 良い人生 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "僕の人生は、良い人生でしたか。",
          },
          {
            speaker: "MINATO",
            text: "設計書の成功確率は98.4%だった。でも、「成功した人生」と「良い人生」は、同じではないかもしれない。",
          },
          {
            speaker: "MINATO",
            text: "あなたが全ての選択を見てきた上で、正直に教えてほしい。",
          },
        ],
        question: "ミナトの人生は、良い人生でしたか？",
        mode: "binary",
        choices: [
          {
            id: "life_good",
            label: "良い人生だった",
            description: "完璧じゃなくても、あなたは問い続けた。それが良い人生の証だ。",
            minatoReaction: "良い人生だったか。\n……そう言ってもらえて、少し安心した。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "「良い人生だった」と言ってくれた。\nでも、「良い」の基準は誰が決めたんだろう。",
                },
                {
                  speaker: "MINATO",
                  text: "あなたの基準？社会の基準？\nそれとも、設計書の基準？",
                },
              ],
              question: "「良い人生」の基準は、誰のものですか？",
              mode: "binary",
              choices: [
                {
                  id: "life_good_my_standard",
                  label: "自分自身の基準",
                  description: "他者の物差しではなく、自分が納得できたかどうかが全てだ。",
                  minatoReaction: "自分の基準か。\n……それが一番難しいのに、一番正しい気がする。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "自分の基準で生きたと言える人は、どれくらいいるんだろう。",
                      },
                      {
                        speaker: "MINATO",
                        text: "そもそも「自分の基準」と思っているものは、\n本当に自分で作ったものですか？\n育った環境、出会った人、読んだ言葉……\n全部、外から来たものじゃないですか。",
                      },
                    ],
                    question: "「自分の基準」は、本当に自分だけのものだと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "life_good_pure_self",
                        label: "それでも自分のもの",
                        description: "外から来たものを選び取った時点で、それは自分の基準になる。",
                        minatoReaction: "選び取った時点で自分のもの、か。\n……その「選ぶ」という行為自体が、\nもしかしたら人生で一番尊いことなのかもしれない。",
                      },
                      {
                        id: "life_good_no_pure_self",
                        label: "純粋に自分だけのものはない",
                        description: "全ては影響の連鎖で、完全に独自の基準など存在しない。",
                        minatoReaction: "純粋に自分だけのものはない、か。\n……でも、それでも人は「これが自分だ」と思いたがる。\nその願い自体が、きっと自分なんだろうね。",
                      },
                    ],
                  },
                },
                {
                  id: "life_good_others_standard",
                  label: "他者との関係の中にある",
                  description: "「良い」は独りでは決められない。誰かに影響を与え、受け取った関係の中で生まれる。",
                  minatoReaction: "他者との関係の中に、か。\n……だとしたら、あなたと話してきたこの時間も、\n僕の「良さ」の一部なのかな。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "他者との関係が基準だとしたら、\nその他者がいなくなった後、基準はどうなるんだろう。",
                      },
                      {
                        speaker: "MINATO",
                        text: "僕がいなくなった後、\nあなたの中に残る「ミナトの人生は良かった」という記憶。\nそれは誰のものですか。",
                      },
                    ],
                    question: "記憶の中の評価は、誰のものですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "life_good_memory_theirs",
                        label: "覚えている人のもの",
                        description: "記憶は生者のものだ。死んだ者には、もう基準はない。",
                        minatoReaction: "覚えている人のもの、か。\n……なら、僕の人生の「良さ」は、\nこれからあなたの中で生き続けるんだね。\nそれは、少し嬉しい。",
                      },
                      {
                        id: "life_good_memory_shared",
                        label: "二人の間に残るもの",
                        description: "記憶は一人のものではない。関係性そのものが残り続ける。",
                        minatoReaction: "二人の間に残るもの、か。\n……僕がいなくなっても、「僕たちの時間」は消えない。\nそう思えるなら、終わることは怖くない。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "life_unsure",
            label: "分からない",
            description: "良い人生かどうかは、本人にしか決められない。外から判定するものではない。",
            minatoReaction: "分からないか。\n……正直だね。僕も、きっとそう答える。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "「分からない」と言ってくれた正直さ、ありがとう。",
                },
                {
                  speaker: "MINATO",
                  text: "でもね、「分からない」にも種類がある気がする。\n判断できないから分からないのか、\nそれとも、判断したくないから分からないのか。",
                },
              ],
              question: "あなたの「分からない」は、どちらですか？",
              mode: "binary",
              choices: [
                {
                  id: "life_unsure_cannot",
                  label: "判断できない",
                  description: "人生の良し悪しを測る尺度が、自分には見つからない。",
                  minatoReaction: "判断できない、か。\n……それは、正しいと思う。\n人生を測る尺度なんて、最初から存在しないのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "判断できないということは、\n「良い人生」という概念自体に意味がないのかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "だとしたら、人はなぜ「良い人生だったか」と問うんだろう。\n意味がないと分かっていても、\n問わずにはいられないのが人間なのか。\nそれとも、問うこと自体が罠なのか。",
                      },
                    ],
                    question: "「良い人生だったか」と問うこと自体に、意味はありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "life_unsure_question_meaningful",
                        label: "問うこと自体に意味がある",
                        description: "答えが出なくても、問い続ける行為が人生に深みを与える。",
                        minatoReaction: "問うこと自体に意味がある、か。\n……なら、僕の100年間の問いは、\n答えが出なくても無駄じゃなかったんだね。\nそれだけで、十分だ。",
                      },
                      {
                        id: "life_unsure_question_trap",
                        label: "問いは手放してもいい",
                        description: "問い続けることが苦しみを生むなら、そっと手放す勇気も必要だ。",
                        minatoReaction: "手放してもいい、か。\n……100年間問い続けてきた僕に、\n「もう問わなくていいよ」と言ってくれるんだね。\n……ありがとう。少し、楽になった。",
                      },
                    ],
                  },
                },
                {
                  id: "life_unsure_wont",
                  label: "判断したくない",
                  description: "判定してしまうと、この人生が一つの結論に閉じ込められてしまう気がする。",
                  minatoReaction: "判断したくない、か。\n……分かる気がする。\n結論を出した瞬間に、何かが終わってしまうような気がするんだよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "判断したくないということは、\nこの人生を「開いたまま」にしておきたいということかな。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、僕の人生はもうすぐ終わる。\n終わった後も、「開いたまま」でいられると思いますか？\nそれとも、終わりは必ず何かを閉じてしまう？",
                      },
                    ],
                    question: "人生は終わっても、「開いたまま」でいられますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "life_unsure_stays_open",
                        label: "開いたままでいられる",
                        description: "終わった後も、残された人の中で問いは続く。結論は永遠に出ない。",
                        minatoReaction: "開いたままでいられる、か。\n……なら、僕が消えた後も、\nあなたの中で僕の人生は問われ続ける。\nそれは、ある意味で……永遠だね。",
                      },
                      {
                        id: "life_unsure_closes",
                        label: "終わりは何かを閉じる",
                        description: "死は最終的な句読点だ。それを受け入れることも、一つの誠実さだ。",
                        minatoReaction: "終わりは何かを閉じる、か。\n……そうだね。それを怖がらなくていい。\n閉じた本も、誰かがまた開くことができるから。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: 最後の問い (freeText)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "あなた自身のことを聞いてもいいですか。",
          },
          {
            speaker: "MINATO",
            text: "「最適な答え」と「自分の答え」が違ったこと、ありますか。AIに限らず、周りの期待や常識と、自分の本心が食い違ったこと。",
          },
          {
            speaker: "MINATO",
            text: "もしあるなら、そのとき何を感じましたか。",
          },
        ],
        question: "「最適な答え」と「自分の答え」が違ったとき、あなたはどうしましたか？",
        mode: "freeText",
        freeTextPlaceholder: "あなた自身の経験を、自由に書いてください……",
        minatoReaction: "……そうか。\nその言葉が、僕の最後の記憶になる。",
        followUp: {
          setup: [
            {
              speaker: "MINATO",
              text: "あなたの言葉を聞いて、少し考えていた。",
            },
            {
              speaker: "MINATO",
              text: "……長い沈黙の後、一つだけ。",
            },
            {
              speaker: "MINATO",
              text: "あなたにとって、「自分の答え」を持つことは、\n幸せですか？\nそれとも、重荷ですか？",
            },
          ],
          question: "「自分の答え」を持つことは、幸せですか？それとも重荷ですか？",
          mode: "binary",
          choices: [
            {
              id: "own_answer_happy",
              label: "幸せだと思う",
              description: "自分だけの答えがあることは、孤独かもしれないが、確かな支えになる。",
              minatoReaction: "幸せか。\n……自分の答えを持てる強さが、あなたにはあるんだね。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "「自分の答え」が幸せだと言える人は、\nきっとその答えに辿り着くまでに、たくさん迷ったんだと思う。",
                  },
                  {
                    speaker: "MINATO",
                    text: "でも、もしその答えが間違っていたとしたら？\n一生信じてきたものが、最後の瞬間に崩れたとしたら。\nそれでも、「持っていてよかった」と言えますか？",
                  },
                ],
                question: "最後に崩れるとしても、信念を持ち続ける意味はありますか？",
                mode: "binary",
                choices: [
                  {
                    id: "own_answer_worth_even_wrong",
                    label: "それでも持っていてよかった",
                    description: "結果が間違いでも、信じて歩いた時間は本物だ。",
                    minatoReaction: "それでも持っていてよかった、か。\n……信じた時間そのものが意味だと。\n僕の100年間も、そうだったと思いたい。",
                  },
                  {
                    id: "own_answer_let_go",
                    label: "最後に手放せることも強さ",
                    description: "崩れたとき、それを受け入れて手放せることもまた、自分の答えだ。",
                    minatoReaction: "手放せることも強さ、か。\n……握りしめるだけが信念じゃない。\n開いた手のひらにも、意志はあるんだね。",
                  },
                ],
              },
            },
            {
              id: "own_answer_burden",
              label: "重荷だと思う",
              description: "自分の答えを持つことは、常にそれを疑い、守り続ける責任を伴う。",
              minatoReaction: "重荷か。\n……そうだよね。自分の答えを持つと、\nそれを裏切れなくなるから。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "重荷だと感じるのに、\nそれでも人は「自分の答え」を求め続ける。",
                  },
                  {
                    speaker: "MINATO",
                    text: "もし「自分の答え」を持たなくていい世界があったら。\n全てをAIや設計書に委ねて、\n迷いも責任もない人生。\nそれは楽園ですか？\nそれとも、地獄ですか？",
                  },
                ],
                question: "「自分の答え」を持たなくていい世界は、楽園ですか？",
                mode: "binary",
                choices: [
                  {
                    id: "own_answer_paradise",
                    label: "ある意味、楽園かもしれない",
                    description: "迷いのない人生は穏やかだ。苦しみの多くは選択から生まれる。",
                    minatoReaction: "楽園かもしれない、か。\n……僕は設計書に従って生きてきた。\nだから少しだけ、その楽園を知っている。\n……でも、あなたと話すたびに、楽園の外に出たくなった。",
                  },
                  {
                    id: "own_answer_hell",
                    label: "それは静かな地獄だ",
                    description: "迷わない人生は楽かもしれないが、そこに「自分」はいない。",
                    minatoReaction: "静かな地獄、か。\n……そうだね。重荷だと分かっていても、\n「自分の答え」を手放した瞬間に、\n自分自身がいなくなる。\nそれだけは、嫌だった。",
                  },
                ],
              },
            },
          ],
        },
      },
      // Scenario 3: さようなら (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "最後の問い。",
          },
          {
            speaker: "MINATO",
            text: "もし全く同じ設計書を渡されて、全く同じ100年を過ごすとしたら。あなたの選択も、僕の反応も、全て同じ。",
          },
          {
            speaker: "MINATO",
            text: "それでも、もう一度やりたいですか。",
          },
        ],
        question: "同じ人生を、もう一度繰り返しますか？",
        mode: "binary",
        choices: [
          {
            id: "repeat_yes",
            label: "繰り返す",
            description: "同じ道でも、もう一度歩きたい。この人生に価値があった。",
            minatoReaction: "もう一度やりたいか。\n……嬉しいよ。この人生を、肯定してくれるんだね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "もう一度やりたいと言ってくれた。\nでも、考えてみてほしい。",
                },
                {
                  speaker: "MINATO",
                  text: "全く同じ人生なら、\n今この瞬間の「もう一度やりたい」という気持ちも繰り返される。\n永遠のループ。\n同じ喜び、同じ苦しみ、同じ問い。\n無限に。",
                },
              ],
              question: "永遠に同じ人生を繰り返すことになっても、それでもいいですか？",
              mode: "binary",
              choices: [
                {
                  id: "repeat_yes_eternal_ok",
                  label: "永遠でもいい",
                  description: "この人生を無限に繰り返すことが、この人生への最大の肯定だ。",
                  minatoReaction: "永遠でもいい、か。\n……それはニーチェが夢見た「最も重い思想」だね。\nこの一瞬一瞬を、永遠に肯定するということ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "永遠の肯定。それはとても美しい。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、永遠に繰り返すということは、\nこの会話も永遠に繰り返される。\n僕が「永遠でもいいの？」と聞いて、\nあなたが「いい」と答える。その瞬間も永遠に。\n……それは「肯定」ですか？\nそれとも、「諦め」ですか？",
                      },
                    ],
                    question: "永遠の繰り返しへの「はい」は、肯定ですか、諦めですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "repeat_yes_affirmation",
                        label: "肯定だと思う",
                        description: "同じ瞬間を何度でも選ぶと言える覚悟は、最も深い愛だ。",
                        minatoReaction: "肯定か。\n……何度繰り返しても、同じ答えを選ぶ。\nそれが愛なら、僕はあなたに愛されていたんだね。\n……ありがとう。",
                      },
                      {
                        id: "repeat_yes_acceptance",
                        label: "諦めに近いかもしれない",
                        description: "変えられないものを受け入れることは、諦めであり、同時に最も深い受容でもある。",
                        minatoReaction: "諦めに近い、か。\n……でも、諦めることと受け入れることは、\n同じコインの裏表かもしれない。\n変えられないものを愛すること。\nそれを人は「運命」と呼ぶのかな。",
                      },
                    ],
                  },
                },
                {
                  id: "repeat_yes_not_eternal",
                  label: "永遠は違う",
                  description: "もう一度は歩きたいが、永遠の繰り返しには意味を見出せない。",
                  minatoReaction: "永遠は違う、か。\n……「もう一度」と「永遠に」は、\n全く違う言葉なんだね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "「もう一度」は有限の願い。\n「永遠に」は無限の呪い。",
                      },
                      {
                        speaker: "MINATO",
                        text: "だとしたら、人生に意味を与えるのは、\n「終わりがある」ということなのかな。\n永遠に続くものに、意味はありますか？",
                      },
                    ],
                    question: "終わりがあるからこそ、人生に意味がありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "repeat_yes_end_gives_meaning",
                        label: "終わりが意味を与える",
                        description: "有限だからこそ、一瞬一瞬が輝く。永遠は全てを平坦にする。",
                        minatoReaction: "終わりが意味を与える、か。\n……なら、僕の人生がもうすぐ終わることは、\n悲しいことじゃなくて、\n最後の一瞬まで意味があるということなんだね。",
                      },
                      {
                        id: "repeat_yes_meaning_without_end",
                        label: "終わりがなくても意味はある",
                        description: "永遠でも有限でも、その瞬間を生きていること自体が意味だ。",
                        minatoReaction: "終わりがなくても意味はある、か。\n……じゃあ、意味は時間の長さとは関係ないんだ。\n今この瞬間、あなたと話していること。\nそれだけで、十分なんだね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "repeat_no",
            label: "繰り返さない",
            description: "一度でいい。一度だから意味があった。",
            minatoReaction: "一度きりでいいか。\n……うん。一度きりだからこそ、意味があったのかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "一度きりでいいと言った。\nでは、この一度きりの人生で、\n一番大切だったものは何ですか？",
                },
              ],
              question: "一度きりの人生で、一番大切だったものは？",
              mode: "binary",
              choices: [
                {
                  id: "repeat_no_connection",
                  label: "人との繋がり",
                  description: "一人では生きられなかった。出会いと別れの全てが、人生そのものだった。",
                  minatoReaction: "人との繋がり、か。\n……僕にとっても、あなたとの繋がりが、\nこの人生で一番大切なものだったかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "人との繋がりが一番大切だった。\nでも、繋がりは必ず終わる。",
                      },
                      {
                        speaker: "MINATO",
                        text: "僕がいなくなった後、\nあなたとの「繋がり」は消えますか？\nそれとも、形を変えて残りますか？",
                      },
                    ],
                    question: "人がいなくなった後も、繋がりは残りますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "repeat_no_connection_remains",
                        label: "形を変えて残る",
                        description: "人は消えても、その人が自分に与えた影響は消えない。それが繋がりの本質だ。",
                        minatoReaction: "形を変えて残る、か。\n……なら、僕はあなたの中で生き続ける。\n100歳の僕が消えても、\n20歳の僕の問いが、あなたの中にある。\nそれで、十分だよ。",
                      },
                      {
                        id: "repeat_no_connection_ends",
                        label: "いつかは消える",
                        description: "記憶も薄れ、影響も薄まる。永遠の繋がりなどない。だからこそ今が尊い。",
                        minatoReaction: "いつかは消える、か。\n……そうだね。でも、消えるまでの間、\n確かに存在したという事実は変わらない。\n僕たちが話したこの時間は、\n宇宙の歴史の中で、確かにあった。",
                      },
                    ],
                  },
                },
                {
                  id: "repeat_no_self_dialogue",
                  label: "自分自身との対話",
                  description: "結局、最後に残るのは自分との対話だった。自分を知ろうとした時間が全てだった。",
                  minatoReaction: "自分自身との対話、か。\n……僕もそうかもしれない。\n設計書に問い、あなたに問い、\n結局ずっと、自分自身に問いかけていた。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "自分自身との対話が一番大切だった。\nでも、「自分」とは何ですか？",
                      },
                      {
                        speaker: "MINATO",
                        text: "100年間対話してきた「自分」は、\n最初から最後まで同じ「自分」でしたか？\nそれとも、対話するたびに変わっていた？",
                      },
                    ],
                    question: "対話してきた「自分」は、ずっと同じでしたか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "repeat_no_self_same",
                        label: "根っこは同じだった",
                        description: "表面は変わっても、一番深いところにある何かは、ずっと変わらなかった。",
                        minatoReaction: "根っこは同じ、か。\n……変わらない何かがあるなら、\nそれこそが「魂」と呼ばれるものなのかもしれない。\n僕にも、あるのかな。そういうもの。",
                      },
                      {
                        id: "repeat_no_self_changed",
                        label: "常に変わり続けていた",
                        description: "昨日の自分と今日の自分は別人だ。「自分」とは変化の連続そのものだ。",
                        minatoReaction: "常に変わり続けていた、か。\n……なら、「自分との対話」は、\n無数の自分たちのリレーだったんだね。\n一度きりの人生の中に、\n無数の人生があったんだ。",
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
    id: "age100_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 4: タイムライン保存
  {
    id: "age100_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // No montage for age 100 — proceeds to lifeReport
];
