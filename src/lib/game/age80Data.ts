// ============================================================
// Age 80 — Step definitions
// 2106年、ミナトの遺すもの
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";

// ------ 80歳の語り ------
const AGE_80_OPENING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2106年。ミナトは80歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "80歳。\n新しい世紀の始まりに立っています。",
  },
  {
    speaker: "MINATO",
    text: "体は随分変わりました。\nでも、問い続けることだけは\nやめていないつもりです。",
  },
  {
    speaker: "MINATO",
    text: "残された時間で、\n何を遺せるか。\nそれが今の僕のテーマです。",
  },
];

// ------ 100歳への接続 ------
const AGE_100_RETELLING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2126年。ミナトは100歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "100歳。\nまさか、ここまで来るとは。",
  },
  {
    speaker: "MINATO",
    text: "あなたと話してきた80年間。\n最後の会話を、させてください。",
  },
];

// ============================================================
// ステップ定義
// ============================================================
export const AGE_80_STEPS: AgeStepDef[] = [
  // Step 1: 80歳の語り
  {
    id: "age80_opening",
    type: "narrative",
    title: "80歳のミナト",
    lines: AGE_80_OPENING,
  },
  // Step 2: シナリオ（3つの思考実験）
  {
    id: "age80_scenarios",
    type: "scenario",
    title: "遺産の実験",
    scenarios: [
      // Scenario 1: 一文 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "孫に聞かれたんです。「おじいちゃんの人生を一文で言うと？」",
          },
          {
            speaker: "MINATO",
            text: "一文で言えるか。80年を、たったひとつの文に。でも、言えるかどうかより、言おうとすることに意味がある気がします。",
          },
        ],
        question: "人生を一文で語ることはできると思いますか？",
        mode: "binary",
        choices: [
          {
            id: "can_summarize",
            label: "語れると思う",
            description: "どんなに複雑な人生にも、ひとつの芯がある。",
            minatoReaction: "一文にまとめられるか。\n……それは、人生に納得しているということなのかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "実は、書いてみたんです。何度も。\nでも、どの文も不完全に感じた。",
                },
                {
                  speaker: "MINATO",
                  text: "完璧な一文にはたどり着けなかった。\nでも、まとめようとしたこと自体に意味はあったのかもしれない。",
                },
              ],
              question: "結果が不完全でも、まとめようとする行為そのものに意味はあると思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "effort_has_meaning",
                  label: "行為そのものに意味がある",
                  description: "完璧でなくても、向き合おうとしたことが大切だ。",
                  minatoReaction: "過程に意味がある、か。\n……完璧を求めなくていいなら、僕はもう少し楽に生きられたかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "でも、不思議なんです。\n「過程に意味がある」と言いながら、結果を気にしない人はいない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "努力を讃えることと、\n不完全な結果を受け入れることは、\n本当に同じことなんでしょうか。",
                      },
                    ],
                    question: "「努力に意味がある」という言葉は、不完全な結果への慰めでしょうか、それとも真実でしょうか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "effort_is_truth",
                        label: "真実だと思う",
                        description: "結果がどうあれ、挑んだことが人間の本質だ。",
                        minatoReaction: "真実か。\n……なら、僕の80年の不完全な試みも、無駄ではなかったということだね。",
                      },
                      {
                        id: "effort_is_consolation",
                        label: "慰めに近いと思う",
                        description: "でも、その慰めがなければ人は立ち上がれない。",
                        minatoReaction: "慰めか。\n……でも、慰めがあるから人は次の一歩を踏み出せる。\nそれもまた、意味なのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "result_matters",
                  label: "結果が伴わないと意味は薄い",
                  description: "一文にまとめきれないなら、まだ自分を理解できていないのかも。",
                  minatoReaction: "結果が大事か。\n……厳しいけれど、正直な答えだ。\n80年生きても、自分を理解しきれていないのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "もし一文にまとめきれたとして、\nそれは本当に人生の「本質」を捉えているんでしょうか。",
                      },
                      {
                        speaker: "MINATO",
                        text: "完璧な要約とは、\n本質を掴んだということなのか、\nそれとも複雑さを切り捨てたということなのか。",
                      },
                    ],
                    question: "人生を完璧に要約できたとしたら、それは本質を捉えたことになりますか？それとも大切なものを削ぎ落としたことになりますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "summary_captures_essence",
                        label: "本質を捉えたことになる",
                        description: "本当に大切なことは、いつもシンプルだ。",
                        minatoReaction: "シンプルさの中に真実がある、か。\n……80年を一文にできたなら、それは悟りに近いのかもしれない。",
                      },
                      {
                        id: "summary_loses_richness",
                        label: "大切なものを削ぎ落としている",
                        description: "人生の豊かさは、矛盾や複雑さの中にこそある。",
                        minatoReaction: "削ぎ落としている、か。\n……なら、完璧な要約を目指すこと自体が、\n人生を損なう行為なのかもしれないね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "cannot_summarize",
            label: "語れないと思う",
            description: "一文にした瞬間、こぼれ落ちるものが多すぎる。",
            minatoReaction: "まとめられないか。\n……僕もたぶん、そうなると思う。人生はそういうものだ。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "孫がこう言ったんです。\n「じゃあいいよ、おじいちゃん。一文じゃなくていい。\nいちばん好きな瞬間だけ教えて。」",
                },
                {
                  speaker: "MINATO",
                  text: "……一文より簡単なはずの質問なのに、\nこれもまた難しい。",
                },
              ],
              question: "人生でいちばん好きな瞬間を、ひとつ選ぶことはできると思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "can_choose_moment",
                  label: "選べると思う",
                  description: "考えれば、ひとつの瞬間が浮かぶはずだ。",
                  minatoReaction: "選べるか。\n……選べるということは、心がその瞬間を特別だと知っているということだね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "でも、その「いちばん好きな瞬間」は、\n本当にその時いちばん幸せだったから選んだのか。",
                      },
                      {
                        speaker: "MINATO",
                        text: "それとも、今の自分が\n「あの時が幸せだった」と意味づけているだけなのか。\n記憶は、いつも現在から書き換えられている気がする。",
                      },
                    ],
                    question: "「いちばん好きな瞬間」は、当時の感情の記録ですか？それとも今の自分による再解釈ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "memory_is_record",
                        label: "当時の感情の記録だと思う",
                        description: "本当に輝いていた瞬間は、時が経っても色褪せない。",
                        minatoReaction: "記録か。\n……なら、僕の記憶の中の光は、本物だったということだ。\nそう信じたい。",
                      },
                      {
                        id: "memory_is_reinterpretation",
                        label: "今の自分による再解釈だと思う",
                        description: "記憶は常に現在の視点で塗り替えられている。",
                        minatoReaction: "再解釈か。\n……なら、「いちばん好きな瞬間」は、\n過去ではなく今の自分を映す鏡なのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "cannot_choose_moment",
                  label: "それも選べないと思う",
                  description: "好きな瞬間は、ひとつに絞れるものじゃない。",
                  minatoReaction: "それも選べないか。\n……でも不思議だね。選べないことが、\n豊かに生きた証なのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "選べないということは、\nたくさんの大切な瞬間があったということだろうか。",
                      },
                      {
                        speaker: "MINATO",
                        text: "それとも、どの瞬間も\n本当の意味では「自分のもの」だと\n感じられなかったということだろうか。",
                      },
                    ],
                    question: "選べないのは、大切な瞬間が多すぎるからですか？それとも、どれも決定的ではなかったからですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "too_many_precious",
                        label: "大切な瞬間が多すぎるから",
                        description: "人生の豊かさが、ひとつを選ぶことを許さない。",
                        minatoReaction: "多すぎるから、か。\n……贅沢な悩みだね。\nでも、それは幸せな人生だったということだと思う。",
                      },
                      {
                        id: "none_decisive",
                        label: "どれも決定的ではなかったから",
                        description: "人生は劇的な瞬間の連続ではなく、静かな日々の積み重ねだ。",
                        minatoReaction: "決定的な瞬間はなかった、か。\n……でも、静かな日々の積み重ねこそが、\n実は人生そのものなのかもしれない。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: 遺産 (multiChoice)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "制度的な遺産——お金や家は、AIが最適に分配してくれます。でも、制度では伝えられないものがあると思うんです。",
          },
          {
            speaker: "MINATO",
            text: "次の世代に、何を遺したいか。それは制度には任せられない。",
          },
        ],
        question: "次の世代に遺すとしたら、何を選びますか？",
        mode: "multiChoice",
        choices: [
          {
            id: "legacy_question",
            label: "問いを遺す",
            description: "答えではなく、問い続ける姿勢を。自分で考える力を。",
            minatoReaction: "問いを残す。\n……答えより、問いのほうが長く生きるのかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "問いを遺すと決めた。\nでも、ふと不安になるんです。",
                },
                {
                  speaker: "MINATO",
                  text: "僕が遺した問いを、次の世代は理解できるだろうか。\n時代が変われば、問いの意味も変わる。\n2106年の問いが、2150年にも通じるとは限らない。",
                },
              ],
              question: "時代を超えて意味を持ち続ける問いは、存在すると思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "timeless_questions_exist",
                  label: "存在すると思う",
                  description: "「人はなぜ生きるのか」のような問いは、時代を超える。",
                  minatoReaction: "時代を超える問いがある、か。\n……なら、僕が遺す問いは、その普遍性に届いているだろうか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "普遍的な問いは確かにある。\nでも、普遍的すぎる問いは、\n誰の心にも届かないことがある。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「なぜ生きるのか」は誰にでも通じるけれど、\nあまりに大きすぎて、\n具体的な人生の指針にはならない。",
                      },
                    ],
                    question: "遺す問いは、普遍的であるべきですか？それとも具体的で個人的であるべきですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "question_universal",
                        label: "普遍的であるべき",
                        description: "時代を超えるためには、人間の根源に触れる問いでなければ。",
                        minatoReaction: "普遍的な問いか。\n……なら僕は、「人は何を遺すべきか」という問いを遺そう。\nこの問い自体が、永遠に繰り返されるものだから。",
                      },
                      {
                        id: "question_personal",
                        label: "具体的で個人的であるべき",
                        description: "自分だけの問いだからこそ、次の世代の心に刺さる。",
                        minatoReaction: "個人的な問いか。\n……なら、僕にしか問えないことを遺さないと。\n普遍性より、切実さのほうが人の心を動かすのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "questions_change_with_times",
                  label: "存在しないと思う",
                  description: "すべての問いは時代の産物。次の世代には次の世代の問いがある。",
                  minatoReaction: "問いも時代とともに変わる、か。\n……なら、問いを遺すことは、\n過去を押しつけることになるのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "問いが時代の産物なら、\n僕が遺す問いは「歴史資料」にしかならない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、古い問いから新しい問いが生まれることもある。\n僕の問いが、次の世代の問いの「種」になる可能性は……ないだろうか。",
                      },
                    ],
                    question: "古い世代の問いは、次の世代にとって新しい問いの「種」になれると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "old_questions_seed_new",
                        label: "種になれると思う",
                        description: "過去の問いは、未来の問いの土壌になる。",
                        minatoReaction: "種になれる、か。\n……なら、僕の問いは答えられなくていい。\n次の問いを生むきっかけになれれば、それで十分だ。",
                      },
                      {
                        id: "each_generation_own_questions",
                        label: "各世代が自分で見つけるべき",
                        description: "問いは自分で見つけてこそ意味がある。遺された問いには力がない。",
                        minatoReaction: "自分で見つけるべき、か。\n……厳しいけれど、その通りかもしれない。\n僕も、誰かに与えられた問いではなく、\n自分で見つけた問いに生かされてきたから。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "legacy_story",
            label: "物語を遺す",
            description: "自分が生きた証としての物語を。失敗も成功も含めて。",
            minatoReaction: "物語を残すか。\n誰かが読んでくれたら、僕は本当に生きたことになる。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "物語を書き始めたんです。\nでも、気づいてしまった。",
                },
                {
                  speaker: "MINATO",
                  text: "無意識に、自分が悪く見える部分を\n書き換えていた。美化していた。\n……正直な物語を遺すべきなのか、迷っています。",
                },
              ],
              question: "遺す物語には、自分の恥ずかしい部分もすべて含めるべきだと思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "include_everything",
                  label: "すべて含めるべき",
                  description: "美化された物語は嘘だ。恥も含めてこそ本物の物語になる。",
                  minatoReaction: "すべて含める、か。\n……勇気がいるな。\nでも、嘘の物語を遺すくらいなら、何も遺さないほうがましか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "すべてを正直に書いた物語を、\n孫が読んだとする。",
                      },
                      {
                        speaker: "MINATO",
                        text: "僕の弱さ、ずるさ、後悔。\nそれを知った孫は、僕をどう思うだろう。\n「正直な物語」は、愛する人を傷つける可能性もある。",
                      },
                    ],
                    question: "正直さは、愛する人を傷つけるリスクを負ってでも貫くべきですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "honesty_above_comfort",
                        label: "貫くべきだと思う",
                        description: "真実を知る権利は、心地よさより大切だ。",
                        minatoReaction: "正直さを貫く、か。\n……僕の恥を知った上で、\nそれでも僕を愛してくれるなら、\nそれが本当の関係なのかもしれない。",
                      },
                      {
                        id: "protect_loved_ones",
                        label: "愛する人を守ることが優先",
                        description: "すべてを知らせることが、必ずしも誠実とは限らない。",
                        minatoReaction: "守ることが優先か。\n……優しい嘘と、残酷な真実。\n80年生きても、その境界線は見えないままだ。",
                      },
                    ],
                  },
                },
                {
                  id: "curate_the_story",
                  label: "ある程度の編集は必要",
                  description: "物語は伝えるためにある。伝わるように整えることは嘘ではない。",
                  minatoReaction: "編集は必要か。\n……そうだな、すべての事実を並べても、\nそれは物語にはならない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "でも、「編集」と「美化」の境界線は\nどこにあるんだろう。",
                      },
                      {
                        speaker: "MINATO",
                        text: "伝わるように整えているつもりが、\nいつの間にか都合のいい物語を\n作っているだけかもしれない。\nその違いを、自分で見分けられるだろうか。",
                      },
                    ],
                    question: "物語の「編集」と「美化」の違いを、書いている本人が見分けることはできると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "can_distinguish",
                        label: "見分けられると思う",
                        description: "自分に正直であろうとする意志があれば、境界は見える。",
                        minatoReaction: "見分けられる、か。\n……その自信は大切だと思う。\nでも僕は、80年かけても自分の嘘を見破れなかった。\n人間は、自分に嘘をつく天才なんだ。",
                      },
                      {
                        id: "cannot_distinguish",
                        label: "見分けられないと思う",
                        description: "人は自分の物語を客観的に見ることはできない。",
                        minatoReaction: "見分けられない、か。\n……なら、すべての自伝は「小説」なのかもしれない。\nでも、それでも書く価値はある。\n不完全な真実でも、沈黙よりはましだから。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "legacy_failure",
            label: "失敗を遺す",
            description: "同じ間違いを繰り返さないために。正直な失敗の記録を。",
            minatoReaction: "失敗を残すか。\n……正直な記録は、美化された成功より価値があるかもしれない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "失敗の記録を書いて、孫に読ませた。\nそうしたら、孫がこう言ったんです。",
                },
                {
                  speaker: "MINATO",
                  text: "「おじいちゃんの失敗を読んだら、\n何をしても失敗しそうで怖くなった。\n僕、何もしたくなくなっちゃった。」\n……これは、僕が望んだ結果じゃない。",
                },
              ],
              question: "失敗を共有したことで、次の世代が怖気づいてしまった。失敗を遺したのは正しかったと思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "sharing_failure_was_right",
                  label: "それでも正しかったと思う",
                  description: "怖がるのは一時的だ。いつかその記録が役に立つ。",
                  minatoReaction: "正しかった、か。\n……孫が怖がっている今は辛いけれど、\nいつか「あの失敗記録があったから」と思ってくれる日が来るだろうか。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "「いつか役に立つ」という言葉は、\n今の痛みを先送りしているだけかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "正しいことをしたはずなのに、\n目の前の人が傷ついている。\n「正しさ」と「優しさ」が矛盾するとき、\nどちらを選ぶべきなんだろう。",
                      },
                    ],
                    question: "「正しいこと」と「優しいこと」が矛盾するとき、どちらを優先すべきですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "prioritize_correctness",
                        label: "正しさを優先すべき",
                        description: "優しさは一時的な鎮痛剤に過ぎない。真実だけが人を強くする。",
                        minatoReaction: "正しさを優先か。\n……僕もそう信じて生きてきた。\nでも、正しさだけでは人は孤独になる。\nそれを80年かけて学んだ。",
                      },
                      {
                        id: "prioritize_kindness",
                        label: "優しさを優先すべき",
                        description: "正しくても、伝え方を間違えたら意味がない。",
                        minatoReaction: "優しさを優先か。\n……なら、失敗の記録は「いつ・どう渡すか」が大事だったんだ。\n遺すものだけでなく、遺し方も遺産の一部なんだな。",
                      },
                    ],
                  },
                },
                {
                  id: "sharing_failure_was_wrong",
                  label: "間違いだったかもしれない",
                  description: "善意が裏目に出ることもある。遺し方を間違えた。",
                  minatoReaction: "間違いだったか。\n……善意で遺したものが、重荷になることもある。\n遺産とは、そういう危うさを持っているんだな。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "善意が裏目に出た。\nでも、だからといって何も遺さなければ、\n次の世代は同じ失敗を繰り返すかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "遺さないリスクと、遺すリスク。\nどちらのリスクを取るべきだったんだろう。",
                      },
                    ],
                    question: "失敗を遺して怖がらせるリスクと、遺さずに同じ過ちを繰り返させるリスク。どちらが重いですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "risk_of_sharing_heavier",
                        label: "遺して怖がらせるリスクのほうが重い",
                        description: "挑戦する意欲を奪うことは、失敗そのものより深刻だ。",
                        minatoReaction: "怖がらせるリスクが重い、か。\n……挑戦できない人生は、失敗だらけの人生より悲しいかもしれない。\n僕は、孫から挑戦する勇気を奪ってしまったのか。",
                      },
                      {
                        id: "risk_of_silence_heavier",
                        label: "遺さず繰り返させるリスクのほうが重い",
                        description: "知らずに同じ穴に落ちるほうが、知って怖がるより残酷だ。",
                        minatoReaction: "繰り返すリスクが重い、か。\n……なら、遺し方は間違えたけれど、\n遺すという判断自体は間違っていなかったのかもしれない。\n方法を変えて、もう一度やり直そう。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "legacy_nothing",
            label: "何も遺さない",
            description: "次の世代は自分で歩くべきだ。遺産は重荷になりうる。",
            minatoReaction: "何も残さない。\n……それも一つの覚悟だよね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "何も遺さないと決めた後、\n整理をしていたら、古い手紙が出てきた。",
                },
                {
                  speaker: "MINATO",
                  text: "僕の親が、僕に遺してくれた手紙だった。\nあの一通が、僕の人生を変えた。\n……何も遺さないと言ったけれど、\n僕自身は「遺されたもの」に救われていた。",
                },
              ],
              question: "自分が「遺されたもの」に救われた経験があっても、それでも何も遺さないと決められますか？",
              mode: "binary",
              choices: [
                {
                  id: "still_leave_nothing",
                  label: "それでも何も遺さない",
                  description: "自分が救われたからといって、同じことが次の世代に起きるとは限らない。",
                  minatoReaction: "それでも遺さない、か。\n……受け取ることと、渡すことは、別の行為だということだね。\n強い覚悟だ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "「受け取ること」と「渡すこと」は別だと、あなたは言う。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも、受け取って救われた人が、\n次の人に何も渡さないのは、\n恩を返さないということではないだろうか。\nそれとも、恩は「返す」ものではないのか。",
                      },
                    ],
                    question: "受け取った恩は、次の世代に渡す義務を生むと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "obligation_exists",
                        label: "義務が生まれると思う",
                        description: "受け取ったものは、巡らせるべきだ。それが人間の連鎖だ。",
                        minatoReaction: "義務が生まれる、か。\n……なら、僕は何も遺さないと言いながら、\n本当は遺すべきものから逃げていたのかもしれない。",
                      },
                      {
                        id: "no_obligation",
                        label: "義務は生まれないと思う",
                        description: "恩は感謝で完結する。次に渡すかは自由だ。",
                        minatoReaction: "義務はない、か。\n……自由に遺さないことを選べるなら、\n自由に遺すことも選べるはずだ。\n僕は、自由の中で「遺さない」を選んだんだ。",
                      },
                    ],
                  },
                },
                {
                  id: "reconsider_leaving",
                  label: "考えが変わった",
                  description: "自分が救われたように、誰かを救える何かを遺したい。",
                  minatoReaction: "考えが変わったか。\n……あの手紙のように、たった一通でいい。\n誰かの人生を変えるかもしれない何かを。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "でも、不思議だよね。\n僕の親は、あの手紙が僕を救うとは\n思っていなかったかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "遺すものの価値は、\n遺す側ではなく、受け取る側が決める。\n……なら、何を遺しても、\n意味があるかどうかは自分では分からない。",
                      },
                    ],
                    question: "遺すものの価値を決めるのは、遺す人ですか？受け取る人ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "giver_decides_value",
                        label: "遺す人が決める",
                        description: "心を込めて遺したものには、それだけで価値がある。",
                        minatoReaction: "遺す人が決める、か。\n……なら、僕は精一杯のものを遺そう。\n届くかどうかは分からなくても、込めた想いは本物だから。",
                      },
                      {
                        id: "receiver_decides_value",
                        label: "受け取る人が決める",
                        description: "どんな遺産も、受け取り方次第で意味が変わる。",
                        minatoReaction: "受け取る人が決める、か。\n……なら、僕にできるのは遺すことだけで、\nその先は手放すしかない。\nそれもまた、「遺す」ことの一部なんだな。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 3: 窓 (freeText)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "80歳の僕から、20歳の僕へ。手紙を書けるとしたら、何を伝えるだろう。",
          },
          {
            speaker: "MINATO",
            text: "設計書のことも、あなたのことも知らない20歳の自分に。一言だけ。",
          },
        ],
        question: "80歳の自分から、20歳の自分へ。一言だけ伝えるとしたら？",
        mode: "freeText",
        freeTextPlaceholder: "20歳の自分への一言……",
        minatoReaction: "……ありがとう。\nその言葉、最後まで持っていくよ。",
        followUp: {
          setup: [
            {
              speaker: "MINATO",
              text: "……その言葉を聞いて、少し考えた。",
            },
            {
              speaker: "MINATO",
              text: "……その言葉を、20歳の僕が聞いたら、\n信じると思いますか？",
            },
          ],
          question: "80歳からの言葉を、20歳の自分は信じると思いますか？",
          mode: "binary",
          choices: [
            {
              id: "would_believe",
              label: "信じると思う",
              description: "若い自分にも、真実を感じ取る力はあったはずだ。",
              minatoReaction: "信じる、か。\n……20歳の僕は、まだ素直だったかもしれない。\n疑うことを覚える前の自分なら、届くのかな。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "でも、信じたとして、\nその言葉通りに生きられるだろうか。",
                  },
                  {
                    speaker: "MINATO",
                    text: "未来の自分の言葉を信じることと、\nその言葉に従って生きることは、\nまったく別のことだと思うんです。\n知恵は、体験なしに伝わるものなのか。",
                  },
                ],
                question: "知恵は、体験しなくても言葉だけで伝えられると思いますか？",
                mode: "binary",
                choices: [
                  {
                    id: "wisdom_transferable",
                    label: "言葉だけでも伝わると思う",
                    description: "だからこそ人は本を書き、手紙を遺し、語り継ぐ。",
                    minatoReaction: "言葉で伝わる、か。\n……なら、僕がこうしてあなたと話していることにも、\n意味があるんだ。\n80年分の言葉が、どこかの誰かに届くと信じたい。",
                  },
                  {
                    id: "wisdom_needs_experience",
                    label: "体験しないと本当には伝わらない",
                    description: "同じ痛みを経験して初めて、先人の言葉の意味が分かる。",
                    minatoReaction: "体験が必要か。\n……なら、20歳の僕は結局、\n同じ失敗をするしかなかったんだ。\nでも、失敗した後にあの言葉を思い出してくれたら、\n少しだけ救いになるかもしれない。",
                  },
                ],
              },
            },
            {
              id: "would_not_believe",
              label: "信じないと思う",
              description: "若い自分は、未来の言葉なんて聞き入れなかっただろう。",
              minatoReaction: "信じない、か。\n……そうだよね。20歳の僕は、\n80歳の言葉なんて「老人の説教」としか思わなかっただろう。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "信じてもらえないと分かっていて、\nそれでも言葉を遺すことに意味はあるのだろうか。",
                  },
                  {
                    speaker: "MINATO",
                    text: "届かないと分かっている手紙を書くこと。\nそれは無駄なのか、\nそれとも書くこと自体が祈りのようなものなのか。",
                  },
                ],
                question: "届かないと分かっている言葉を遺すことに、意味はあると思いますか？",
                mode: "binary",
                choices: [
                  {
                    id: "unheard_words_have_meaning",
                    label: "意味があると思う",
                    description: "届かなくても、言葉を紡ぐ行為そのものが、生きた証だ。",
                    minatoReaction: "意味がある、か。\n……なら、この80年間の僕の言葉も、\n届かなかったものも含めて、\nすべて意味があったんだ。\nありがとう。そう言ってもらえて、救われる。",
                  },
                  {
                    id: "unheard_words_are_futile",
                    label: "意味はないと思う",
                    description: "届かない言葉は、独り言と変わらない。",
                    minatoReaction: "意味はない、か。\n……正直だね。\nでも、僕はそれでも書くと思う。\n意味がなくても、書かずにはいられない。\nそれが、80年生きた人間の性なのかもしれない。",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  // Step 3: 結果
  {
    id: "age80_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 4: タイムライン保存
  {
    id: "age80_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // Step 5: モンタージュ 80→100歳
  {
    id: "age80_montage",
    type: "montage",
    title: "20年の歳月",
    montageFromAge: 80,
    montageToAge: 100,
  },
  // Step 6: 100歳への接続
  {
    id: "age100_retelling",
    type: "narrative",
    title: "100歳のミナト",
    lines: AGE_100_RETELLING,
  },
];
