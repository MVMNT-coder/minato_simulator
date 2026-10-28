// ============================================================
// Age 40 — Step definitions
// 2066年、ミナトの所有と拡張
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";

// ------ 40歳の語り ------
const AGE_40_OPENING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2066年。ミナトは40歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "40歳か。\n設計書では「安定期」って書いてあった年齢です。",
  },
  {
    speaker: "MINATO",
    text: "家族ができて、仕事も軌道に乗って。\nでも、「自分」の輪郭がぼやけてきた気がします。",
  },
  {
    speaker: "MINATO",
    text: "今度は「持つ」ということについて、\n考えてみたいんです。",
  },
];

// ------ 60歳への接続 ------
const AGE_60_RETELLING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2086年。ミナトは60歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "60歳。\n体は少しずつ変わっていく。\nでも、考えることはむしろ増えました。",
  },
  {
    speaker: "MINATO",
    text: "40歳の選択が、\n今の僕にどう繋がっているか。\nそれを話したくて、また繋いでいます。",
  },
];

// ============================================================
// ステップ定義
// ============================================================
export const AGE_40_STEPS: AgeStepDef[] = [
  // Step 1: 40歳の語り
  {
    id: "age40_opening",
    type: "narrative",
    title: "40歳のミナト",
    lines: AGE_40_OPENING,
  },
  // Step 2: シナリオ（3つの思考実験）
  {
    id: "age40_scenarios",
    type: "scenario",
    title: "所有の実験",
    scenarios: [
      // Scenario 1: 家 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "この時代、「所有」の概念はほとんどなくなりました。家も車も、全て使用権の契約です。効率的で、合理的。",
          },
          {
            speaker: "MINATO",
            text: "でも最近、郊外に古い一軒家を見つけたんです。前の住人が植えた木が、庭に一本残っていた。AIは「非効率な資産」と判定しました。",
          },
        ],
        question: "「所有する」ことに、まだ意味はあると思いますか？",
        mode: "binary",
        choices: [
          {
            id: "own_house",
            label: "その家を買う",
            description: "非効率でも、自分のものにしたい。誰かが植えた木を、自分が守りたい。",
            minatoReaction: "自分の場所を持つか。\n「所有する」って、責任を引き受けることでもあるんだよね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "あの木、枯れかけてるんです。\nAIは「保全コストに見合わない」と判断しました。",
                },
                {
                  speaker: "MINATO",
                  text: "でも隣に住むおばあさんが言うんです。\n「一緒に手入れしない？　うちのコミュニティ菜園に参加してくれたら、手伝うわよ」って。",
                },
              ],
              question: "コミュニティに参加して助けを受け入れますか？　それとも自分だけで守りますか？",
              mode: "binary",
              choices: [
                {
                  id: "accept_community",
                  label: "助けを受け入れる",
                  description: "一人で所有しても、守りきれないものがある。人と繋がることで、木も家も生き続ける。",
                  minatoReaction: "助けを借りるか。\n「所有」って、壁を作ることじゃないんだね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "コミュニティ菜園に参加して半年。\n庭の木は元気になった。でも、菜園の運営方針で揉めてるんです。",
                      },
                      {
                        speaker: "MINATO",
                        text: "僕は「木を最優先にしたい」。でも多数決では「野菜の収穫量を増やすべき」。\n自分の土地なのに、自分の意志だけでは決められない。",
                      },
                    ],
                    question: "自分の土地でも、コミュニティの意見に従うべきだと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "follow_community",
                        label: "コミュニティの決定に従う",
                        description: "助けてもらった以上、全体の利益を優先すべきだ。所有者の我儘は通らない。",
                        minatoReaction: "みんなの意見を尊重するか。\n「持つ」ことと「分かち合う」こと、両立は難しいけど……大事だよね。",
                      },
                      {
                        id: "assert_ownership",
                        label: "自分の土地の決定権は譲らない",
                        description: "感謝はしている。でも、所有するとは最終的に自分が決めることだ。",
                        minatoReaction: "自分の意志を通すか。\n所有って結局、「最後に決める権利」のことなのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "handle_alone",
                  label: "自分だけで守る",
                  description: "自分の家、自分の木。他人の条件に縛られたくない。",
                  minatoReaction: "一人で守るか。\n孤独だけど、それが「自分のもの」ってことかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "一人で手入れを続けて3ヶ月。\n木は少しだけ持ち直した。でも、僕の方が疲れてきた。",
                      },
                      {
                        speaker: "MINATO",
                        text: "ふと思ったんです。\nこの木を守ることが目的なのか、「一人で守った」という事実が欲しいのか。",
                      },
                    ],
                    question: "「自分の力だけで守ること」に、こだわる意味はあると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "independence_matters",
                        label: "こだわりに意味がある",
                        description: "自分の手で守り抜くこと自体に価値がある。結果だけが全てじゃない。",
                        minatoReaction: "その頑固さ、嫌いじゃないよ。\n「自分でやった」って胸を張れることは、確かに力になる。",
                      },
                      {
                        id: "result_matters",
                        label: "木が生きることの方が大事",
                        description: "こだわりは自己満足かもしれない。木が枯れたら意味がない。",
                        minatoReaction: "目的を見失わないか。\n……所有って、執着と紙一重なんだね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "use_rights",
            label: "使用権のままでいい",
            description: "所有は過去の概念。効率的なシステムに乗るほうが合理的。",
            minatoReaction: "使用権か。\n身軽でいたい気持ち、分かるよ。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "使用権のアパート、快適だったんです。\nでも先週、AIから通知が来ました。",
                },
                {
                  speaker: "MINATO",
                  text: "「優先度の高い利用者が確認されました。30日以内に退去してください。」\n……自分の家だと思っていた場所が、一通の通知で消えるんです。",
                },
              ],
              question: "システムの再配分に従いますか？　それとも異議を申し立てますか？",
              mode: "binary",
              choices: [
                {
                  id: "fight_system",
                  label: "異議を申し立てる",
                  description: "おかしい。住んでいる人間の生活を、アルゴリズムだけで動かすべきじゃない。",
                  minatoReaction: "戦うか。\n「持っていない」からこそ、声を上げるしかないんだよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "異議申し立てをしたら、AIが代替案を出してきました。\n「現住居より12%効率の高い物件を提示します。受け入れますか？」",
                      },
                      {
                        speaker: "MINATO",
                        text: "条件は確かに良い。でも、僕が求めているのは「より良い場所」じゃなくて、「自分で決める権利」なんです。",
                      },
                    ],
                    question: "より良い条件の代替案を受け入れますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "accept_alternative",
                        label: "代替案を受け入れる",
                        description: "条件が良いなら、こだわる必要はない。柔軟さも強さだ。",
                        minatoReaction: "合理的だね。\nでも「納得して移る」のと「追い出される」のは、全然違うことだと思う。",
                      },
                      {
                        id: "demand_rights",
                        label: "権利そのものを求め続ける",
                        description: "条件の問題じゃない。人間が住む場所を、人間が決める権利の問題だ。",
                        minatoReaction: "権利か。\n所有しない世界で「権利」を主張するのは、矛盾してるのかな。\nいや……矛盾してても、大切なことはある。",
                      },
                    ],
                  },
                },
                {
                  id: "comply_system",
                  label: "従って退去する",
                  description: "システムに乗ると決めたなら、その結果も受け入れるべきだ。",
                  minatoReaction: "受け入れるか。\n……身軽さの代償が、こういう形で来るとは思わなかったけど。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "引っ越し先で荷物を開けていて、気づいたんです。\n大事なものって、ほとんどなかった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "でも一つだけ、子どもが壁に描いた落書きの写真を撮っておけばよかったと思った。\nあの壁は、もう僕のものじゃない。",
                      },
                    ],
                    question: "「場所に残る記憶」は、所有していなくても自分のものだと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "memories_are_mine",
                        label: "記憶は自分のものだ",
                        description: "場所が変わっても、そこで過ごした時間は消えない。記憶こそが本当の所有だ。",
                        minatoReaction: "記憶は誰にも奪えないか。\n……そうだといいな。本当に。",
                      },
                      {
                        id: "memories_fade",
                        label: "場所がなければ記憶も薄れる",
                        description: "人は場所と一緒に記憶を保つ。場所を失えば、記憶もいつか消える。",
                        minatoReaction: "場所と記憶は繋がってるか。\nだとしたら、「持たない」ことは「忘れる」ことと同じなのかもしれない。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: 認知拡張 (multiChoice)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "会社から「認知拡張インプラント」の導入を勧められました。記憶力、処理速度、言語能力が30%向上するそうです。",
          },
          {
            speaker: "MINATO",
            text: "同僚の半分はもう入れている。入れないと差がつく時代になってきました。でも、入れた人たちの何人かは、「昔の自分の感覚が思い出せない」と言っています。",
          },
        ],
        question: "認知拡張インプラントを入れますか？",
        mode: "multiChoice",
        choices: [
          {
            id: "install",
            label: "入れる",
            description: "時代に適応する。能力が上がることは良いことだ。",
            minatoReaction: "拡張か。\n体を変えることで、見える世界も変わるのかな。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "インプラントを入れて3ヶ月。\n仕事は確かに速くなった。問題解決も、言語化も、全部クリアになった。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、気になることがあるんです。\n以前は突然ひらめいていたアイデアが、今は「導き出す」感覚に変わった。\n正確だけど、驚きがない。",
                },
              ],
              question: "以前の「予測できない自分」が恋しいですか？",
              mode: "binary",
              choices: [
                {
                  id: "miss_old_self",
                  label: "恋しい",
                  description: "不完全さの中にこそ、自分らしさがあった気がする。",
                  minatoReaction: "恋しいか。\n……完璧になるほど、何かを失ってる気がするよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "試しに週末だけインプラントをオフにしてみたんです。\n絵を描いてみた。下手だった。でも、楽しかった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "月曜にオンに戻したら、週末の絵が「稚拙だ」と分かってしまった。\nどっちの自分が本物なんだろう。",
                      },
                    ],
                    question: "「能力が低い時の自分」と「高い時の自分」、どちらが本当の自分だと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "raw_self",
                        label: "拡張なしの自分が本物",
                        description: "素の状態こそが自分だ。拡張された能力は道具であって、自分自身じゃない。",
                        minatoReaction: "素の自分か。\nでも眼鏡をかけた自分は「本物じゃない」のかな。\n……境界線って、難しいね。",
                      },
                      {
                        id: "both_self",
                        label: "どちらも自分",
                        description: "道具を使う自分も自分。状態によって「本物」が変わるわけじゃない。",
                        minatoReaction: "どちらも自分か。\nそう言えたら、楽になれるのかもしれない。\n……でも、簡単じゃないよね。",
                      },
                    ],
                  },
                },
                {
                  id: "prefer_precision",
                  label: "恋しくない",
                  description: "曖昧さは非効率だった。今の方が自分の力を発揮できている。",
                  minatoReaction: "前に進むか。\n変化を受け入れるのも、強さだよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "先日、インプラント仲間と飲んでいて気づいたんです。\n全員の発想が似てきている。結論に至る道筋が、ほぼ同じ。",
                      },
                      {
                        speaker: "MINATO",
                        text: "効率的だけど、誰かが「それって面白くないね」と言った。\n場が一瞬、静まった。",
                      },
                    ],
                    question: "全員が同じように賢くなることは、社会にとって良いことだと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "uniformity_good",
                        label: "良いことだ",
                        description: "能力の格差がなくなれば、より公平な社会になる。多様性は別の形で生まれる。",
                        minatoReaction: "公平さか。\nでも「同じ答えにたどり着く世界」って、本当に公平なのかな。",
                      },
                      {
                        id: "diversity_needed",
                        label: "危険な面もある",
                        description: "思考の多様性が失われたら、誰も気づけない盲点が生まれる。",
                        minatoReaction: "多様性か。\n「全員が賢い」のと「全員が同じ」は、違うことだよね。\n……気づけてよかった。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "refuse",
            label: "入れない",
            description: "自分の脳のまま生きたい。不便でも、それが自分だ。",
            minatoReaction: "そのままでいる。\n……自然体って、勇気がいることだと思う。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "子どもが学校から帰ってきて、聞くんです。\n「パパ、なんでインプラント入れてないの？」",
                },
                {
                  speaker: "MINATO",
                  text: "「友達のお父さんもお母さんも、みんな入れてるよ。\nパパだけ遅いって、恥ずかしい。」\n……子どもの目が、本気だった。",
                },
              ],
              question: "子どもにどう説明しますか？",
              mode: "binary",
              choices: [
                {
                  id: "explain_conviction",
                  label: "自分の信念を伝える",
                  description: "「パパは自分の頭のままでいたいんだ」と正直に話す。",
                  minatoReaction: "信念を伝えるか。\n子どもに分かってもらえるかは分からないけど、嘘はつきたくないよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "子どもは黙って聞いていました。\nそして一言、「じゃあ僕も大きくなったら入れない」と言った。",
                      },
                      {
                        speaker: "MINATO",
                        text: "嬉しかった。でも同時に怖くなった。\n僕の選択が、子どもの可能性を狭めていないか。",
                      },
                    ],
                    question: "自分の信念を子どもが受け継ぐことは、喜ぶべきことですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "glad_inherited",
                        label: "喜ぶべきだ",
                        description: "親の価値観を受け継ぐのは自然なこと。それも一つの教育だ。",
                        minatoReaction: "受け継いでくれるか。\nでも「受け継ぐ」と「押しつける」の境界線って、どこにあるんだろう。",
                      },
                      {
                        id: "let_child_choose",
                        label: "子どもには自分で選ばせるべき",
                        description: "親の信念と子どもの未来は別物。選択肢を狭めてはいけない。",
                        minatoReaction: "自分で選ばせるか。\n……「選ばせる」って言いながら、僕の背中を見て育つんだけどね。\n完全な自由なんて、あるのかな。",
                      },
                    ],
                  },
                },
                {
                  id: "consider_for_child",
                  label: "子どものために再検討する",
                  description: "自分の信念より、子どもが恥ずかしい思いをしないことの方が大事かもしれない。",
                  minatoReaction: "子どものためか。\n親って、自分の信念を曲げてでも子どもを守りたくなるんだよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "結局、インプラントの説明会に行ったんです。\n帰り道、自分が何のために生きてるのか分からなくなった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "子どものために変わるのは「愛」なのか、「屈服」なのか。",
                      },
                    ],
                    question: "大切な人のために自分を変えることは、愛だと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "change_is_love",
                        label: "愛だと思う",
                        description: "大切な人のために変われることこそ、本当の強さだ。",
                        minatoReaction: "愛か。\n……そうだね。変わることを恐れない方が、きっと強い。",
                      },
                      {
                        id: "change_is_loss",
                        label: "自分を失うことだと思う",
                        description: "他人のために自分の芯を変えたら、愛する「自分」がいなくなる。",
                        minatoReaction: "自分を失うか。\n愛するために自分が消えたら、誰が愛してるんだろう。\n……難しいね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "wait",
            label: "様子を見る",
            description: "まだ判断できない。周りの変化を見てから決めたい。",
            minatoReaction: "様子を見るか……。\n全部じゃなくていいんだよね。バランスって大事だ。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "半年後、新しいバージョンが出ました。\n「リバーシブル・インプラント」。いつでも外せる。副作用もほぼゼロ。",
                },
                {
                  speaker: "MINATO",
                  text: "「外せるなら試してみてもいいかな」と思った自分がいる。\nでも同時に、「外せるから入れる」って、本当に覚悟があるのかとも思った。",
                },
              ],
              question: "「いつでもやめられる」なら、試してみますか？",
              mode: "binary",
              choices: [
                {
                  id: "try_reversible",
                  label: "試してみる",
                  description: "リスクが低いなら挑戦する価値がある。経験しないと判断できない。",
                  minatoReaction: "試すか。\n「やめられる」って思えるだけで、一歩踏み出せるんだね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "入れてみた。確かにすごい。世界が鮮明になった。\nでも、1ヶ月後に外そうとしたら……外したくなくなっていた。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「外せる」はずなのに、外したら元の自分に戻るのが怖い。\nこれは依存なのか、それとも成長なのか。",
                      },
                    ],
                    question: "「やめられるけどやめたくない」は、自由な選択だと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "still_free",
                        label: "自由だと思う",
                        description: "選択肢がある以上、続けることも自由意志だ。",
                        minatoReaction: "自由か。\n……「やめる選択肢がある」だけで、本当に自由と言えるのかな。\n考えさせられるね。",
                      },
                      {
                        id: "not_free",
                        label: "自由ではない",
                        description: "一度知ってしまった快適さから逃れられないのは、自由とは言えない。",
                        minatoReaction: "自由じゃないか。\n「元に戻れる」と「元に戻りたい」は、全然違うことだったんだ。",
                      },
                    ],
                  },
                },
                {
                  id: "still_wait",
                  label: "それでもまだ待つ",
                  description: "「外せるから」で決めるのは、本質的な判断じゃない。自分の答えが出るまで待つ。",
                  minatoReaction: "まだ待つか。\n……その慎重さ、時代遅れって言われるかもしれないけど、嫌いじゃないよ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "さらに1年経った。第三世代が出た。もう社会インフラになりつつある。\nインプラントなしでは使えないサービスが増えてきた。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「待つ」という選択が、いつの間にか「取り残される」に変わっていた。\n僕はいつまで待てるんだろう。",
                      },
                    ],
                    question: "「自分のペースで決めたい」と「社会から取り残される」、どちらが怖いですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "fear_conformity",
                        label: "流されることの方が怖い",
                        description: "社会に合わせて自分を変えるのは、自分を失うことだ。",
                        minatoReaction: "流されるのが怖いか。\n「自分のペース」を守るって、孤独との戦いでもあるんだよね。",
                      },
                      {
                        id: "fear_isolation",
                        label: "取り残されることの方が怖い",
                        description: "一人だけ違う世界にいることは、自由ではなく孤立だ。",
                        minatoReaction: "取り残されるのが怖いか。\n……正直に言えるのは、強さだと思う。\n「待つ」にも限界があるよね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 3: 子どもの問い (freeText)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "先日、子どもに聞かれたんです。無邪気な顔で。",
          },
          {
            speaker: "MINATO",
            text: "「パパの人生はパパが選んだの？AIが選んだの？」",
          },
          {
            speaker: "MINATO",
            text: "……答えられなかった。何を言えばよかったんでしょう。",
          },
        ],
        question: "あなたなら、この子にどう答えますか？",
        mode: "freeText",
        freeTextPlaceholder: "子どもへの言葉を書いてください……",
        minatoReaction: "……そうか。\nその言葉、覚えておくよ。",
        followUp: {
          setup: [
            {
              speaker: "MINATO",
              text: "あなたの言葉を、そのまま子どもに伝えてみました。\n子どもは少し考えて、こう聞き返してきたんです。",
            },
            {
              speaker: "MINATO",
              text: "「じゃあ、AIが間違ったらどうするの？」\n……子どもの質問って、いつも核心を突いてくる。",
            },
          ],
          question: "「AIが間違ったらどうするの？」——あなたはどう思いますか？",
          mode: "binary",
          choices: [
            {
              id: "ai_makes_mistakes",
              label: "AIも間違える。でも人間も間違える",
              description: "完璧な存在はいない。間違いを認めて修正できることが大事だ。",
              minatoReaction: "どっちも間違えるか。\n……そうだよね。完璧なものなんて、ないんだ。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "子どもが言うんです。\n「じゃあ、AIが間違えた時、誰が気づくの？\nみんなAIを信じてたら、間違いに気づく人がいなくなるんじゃない？」",
                  },
                  {
                    speaker: "MINATO",
                    text: "……10歳の子どもに、答えられなかった。二度目だ。",
                  },
                ],
                question: "全員がAIを信じる社会で、AIの間違いに気づけるのは誰だと思いますか？",
                mode: "binary",
                choices: [
                  {
                    id: "humans_can_notice",
                    label: "それでも人間が気づける",
                    description: "違和感を持つ力は人間にしかない。直感や感情がセーフティネットになる。",
                    minatoReaction: "人間の直感か。\nAIが正しいと言っても「何かおかしい」と感じる力。\nそれだけは、手放しちゃいけないね。",
                  },
                  {
                    id: "nobody_can_notice",
                    label: "もう誰にも気づけないかもしれない",
                    description: "AIに依存しすぎた社会では、間違いすら認識できなくなる。",
                    minatoReaction: "気づけないか。\n……怖いね。でも、その可能性を想像できることが、まだ希望なのかもしれない。",
                  },
                ],
              },
            },
            {
              id: "ai_rarely_wrong",
              label: "AIが間違うことは、ほぼない",
              description: "膨大なデータに基づく判断は、人間の直感よりはるかに正確だ。",
              minatoReaction: "ほぼ間違わないか。\n……その「ほぼ」が、すごく重い言葉だと思うけどね。",
              followUp: {
                setup: [
                  {
                    speaker: "MINATO",
                    text: "子どもがまた聞くんです。\n「じゃあ、AIが間違わないなら、パパはなんのためにいるの？」",
                  },
                  {
                    speaker: "MINATO",
                    text: "……笑えなかった。\nこの子は、僕の存在意義を問うてるんだ。",
                  },
                ],
                question: "AIが間違わない世界で、人間の役割は何だと思いますか？",
                mode: "binary",
                choices: [
                  {
                    id: "humans_give_meaning",
                    label: "意味を与えることが人間の役割",
                    description: "AIは最適解を出せるが、「なぜそれが大事か」を決めるのは人間だ。",
                    minatoReaction: "意味を与えるか。\n「正しい答え」と「大切な答え」は、違うものなんだよね。\nそれを子どもに伝えたい。",
                  },
                  {
                    id: "humans_just_exist",
                    label: "役割がなくても、存在していい",
                    description: "「なんのために」がなくても、生きていること自体に価値がある。",
                    minatoReaction: "存在そのものに価値があるか。\n……パパはね、君がいるだけで嬉しいんだよ。\nそれと同じことかもしれない。",
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
    id: "age40_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 4: タイムライン保存
  {
    id: "age40_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // Step 5: モンタージュ 40→60歳
  {
    id: "age40_montage",
    type: "montage",
    title: "20年の歳月",
    montageFromAge: 40,
    montageToAge: 60,
  },
  // Step 6: 60歳への接続
  {
    id: "age60_retelling",
    type: "narrative",
    title: "60歳のミナト",
    lines: AGE_60_RETELLING,
  },
];
