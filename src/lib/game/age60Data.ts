// ============================================================
// Age 60 — Step definitions
// 2086年、ミナトの有限と永続
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";

// ------ 60歳の語り ------
const AGE_60_OPENING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2086年。ミナトは60歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "60歳。\n設計書に「身体拡張オプション導入推奨」と\n書いてあった年齢です。",
  },
  {
    speaker: "MINATO",
    text: "体が変わっていく中で、\n「終わり」について考えるようになりました。\nでも、それは悲しいことじゃないんです。",
  },
  {
    speaker: "MINATO",
    text: "むしろ、終わりがあるから\n問える問いがある。\nそう思えるようになりました。",
  },
];

// ------ 80歳への接続 ------
const AGE_80_RETELLING: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "──接続先を更新。\n2106年。ミナトは80歳になりました。",
  },
  {
    speaker: "MINATO",
    text: "80歳。\n世紀が変わりました。\n2106年の世界は、僕が20歳のとき想像した未来とは全く違う。",
  },
  {
    speaker: "MINATO",
    text: "でも、あなたと話してきたことは\n変わらず胸の中にあります。",
  },
];

// ============================================================
// ステップ定義
// ============================================================
export const AGE_60_STEPS: AgeStepDef[] = [
  // Step 1: 60歳の語り
  {
    id: "age60_opening",
    type: "narrative",
    title: "60歳のミナト",
    lines: AGE_60_OPENING,
  },
  // Step 2: シナリオ（3つの思考実験）
  {
    id: "age60_scenarios",
    type: "scenario",
    title: "有限の実験",
    scenarios: [
      // Scenario 1: 意識アーカイブ (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "「意識アーカイブプロジェクト」への参加案内が届きました。死後も意識の一部をデジタル空間に保存できるサービスです。",
          },
          {
            speaker: "MINATO",
            text: "ただし、保存される記憶は選別されます。AIが「重要」と判断した記憶だけが残る。あなたとの会話も、AIが不要と判断すれば消えます。",
          },
        ],
        question: "意識アーカイブに参加しますか？",
        mode: "binary",
        choices: [
          {
            id: "archive_join",
            label: "参加する",
            description: "全てでなくても、何かが残るなら。選別されても、存在の証になる。",
            minatoReaction: "意識をアーカイブに……。\n永遠を選ぶのか。怖いけど、興味はある。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "アーカイブシステムから追加の質問が来ました。保存する記憶の優先順位を決めてほしいと。",
                },
                {
                  speaker: "MINATO",
                  text: "「最も幸福だった記憶」と「最もあなたを形作った記憶」──\n同じとは限らないんです。幸せだった瞬間と、自分を定義づけた瞬間は、しばしば別のものだから。",
                },
              ],
              question: "どちらの記憶を優先して残しますか？",
              mode: "binary",
              choices: [
                {
                  id: "archive_happy",
                  label: "幸福な記憶を優先する",
                  description: "残された人々に、自分が幸せだったことを伝えたい。",
                  minatoReaction: "幸せの記録を残すのか。\n……でも、それは本当の自分の全体像なのかな。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "ふと思ったんです。幸福な記憶だけで構成された「僕」を、\n残された人が訪ねてきたとき──",
                      },
                      {
                        speaker: "MINATO",
                        text: "その幸せなだけの存在は、本当に「僕」なのだろうか。\n苦しみも迷いもない記録は、もはや別人ではないか。",
                      },
                    ],
                    question: "苦しみを削ぎ落とした記憶は、まだ「自分」と呼べると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "archive_still_me",
                        label: "それでも自分だ",
                        description: "自分の一部であることに変わりはない。断片でも、存在の証だ。",
                        minatoReaction: "断片でも自分か。\n写真だってその人の一瞬でしかないけど、確かにその人だもんね。",
                      },
                      {
                        id: "archive_not_me",
                        label: "もう自分ではない",
                        description: "編集された記憶は創作に近い。それは記録ではなく、物語だ。",
                        minatoReaction: "物語になった自分……。\nでも、記憶って元々、脳が編集した物語なのかもしれない。",
                      },
                    ],
                  },
                },
                {
                  id: "archive_defining",
                  label: "自分を形作った記憶を優先する",
                  description: "たとえ辛い記憶でも、自分が自分である理由を残したい。",
                  minatoReaction: "定義する記憶を……。\nそれは勇気がいる選択だ。痛みも含めて自分だと認めることだから。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "自分を形作った記憶の多くは、失敗や喪失の記憶でした。",
                      },
                      {
                        speaker: "MINATO",
                        text: "アーカイブを訪ねた人は、僕の苦しみを追体験することになる。\nそれは遺すべきものなのか、それとも……重荷を押し付けているだけなのか。",
                      },
                    ],
                    question: "自分の苦しみを他者に残すことは、誠実さですか、それとも暴力ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "archive_honesty",
                        label: "誠実さだ",
                        description: "苦しみも含めて知ってもらうことが、本当の繋がりだと思う。",
                        minatoReaction: "誠実さか。\n確かに、きれいな部分だけ見せるのは、ある意味で嘘だもんね。",
                      },
                      {
                        id: "archive_burden",
                        label: "重荷になりうる",
                        description: "死者の苦しみを背負わされる側の気持ちも考えるべきだ。",
                        minatoReaction: "残される側の視点……。\n遺すことは、選ぶ権利を奪うことでもあるのかもしれない。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "archive_refuse",
            label: "参加しない",
            description: "選別された自分は、もう自分ではない。全て消えることを受け入れる。",
            minatoReaction: "消えることを選ぶんだ。\n……潔いな。僕にはまだ分からない。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "家族が落胆していました。\n特に娘が……「お父さんのアーカイブを、いつか子どもに見せたかった」と。",
                },
                {
                  speaker: "MINATO",
                  text: "自分の消滅を選ぶ権利は確かにある。\nでも、あなたの記憶を頼りにしたい人がいるとしたら──\nそれは自分だけの問題だろうか。",
                },
              ],
              question: "自分の記憶の処分は、完全に個人の権利だと思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "refuse_my_right",
                  label: "個人の権利だ",
                  description: "自分の存在をどう扱うかは、最後まで自分で決めるべきだ。",
                  minatoReaction: "自分の権利か。\n……確かに、誰かのために永遠を強いられるのも違う気がする。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "でもね、考えたんです。\n僕の記憶には、僕だけのものじゃないものも含まれている。",
                      },
                      {
                        speaker: "MINATO",
                        text: "娘と過ごした時間、友人との約束、あなたとの対話──\nそれらは「共有された記憶」だ。僕が消えれば、相手側の記憶の裏付けも消える。",
                      },
                    ],
                    question: "共有された記憶を一方的に消す権利は、本当にあるのでしょうか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "refuse_sole_owner",
                        label: "自分の側は自分のものだ",
                        description: "記憶の主観的な体験は、あくまで個人に帰属する。",
                        minatoReaction: "主観は自分のもの……。\nそうだね。同じ出来事でも、僕と娘では違う記憶になっている。",
                      },
                      {
                        id: "refuse_shared_memory",
                        label: "共有された記憶には責任がある",
                        description: "一緒に作った記憶を、一人で消す権利はないのかもしれない。",
                        minatoReaction: "責任か……。\n記憶にも、関係性にも、最後まで責任が伴うのかもしれないね。",
                      },
                    ],
                  },
                },
                {
                  id: "refuse_family_point",
                  label: "家族の気持ちも考えるべきだ",
                  description: "自分の選択が他者を傷つけるなら、対話が必要だ。",
                  minatoReaction: "家族の気持ちも……。\nでも、対話した上で同じ答えだったら、それは尊重されるべきだよね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "娘と話し合いました。\n娘は泣きながら言ったんです。「理解はする。でも納得はできない」と。",
                      },
                      {
                        speaker: "MINATO",
                        text: "理解と納得は違う。\n家族を愛しているからこそ消えることを選ぶ、というのは──\n身勝手な美学なのか、それとも最後の誠実さなのか。",
                      },
                    ],
                    question: "理解されても納得されない選択を、貫くべきですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "refuse_hold_firm",
                        label: "貫くべきだ",
                        description: "最後の選択くらい、自分の信念に従いたい。",
                        minatoReaction: "貫くか。\n60年かけて築いた信念なら、それはもう揺るがないのかもしれない。",
                      },
                      {
                        id: "refuse_reconsider",
                        label: "もう一度考え直すべきだ",
                        description: "愛する人の涙の前では、信念も問い直す価値がある。",
                        minatoReaction: "考え直す余地を残すか。\n……それもまた、強さの形だと思う。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: ベンチ (multiChoice)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "近所の公園にあったベンチが撤去されました。AIの都市最適化で「利用頻度が低い」と判定されたそうです。",
          },
          {
            speaker: "MINATO",
            text: "でも、あのベンチは、僕が子どもと初めて星を見た場所だった。効率の数字には現れない価値がそこにはあったんです。",
          },
        ],
        question: "あなたならどうしますか？",
        mode: "multiChoice",
        choices: [
          {
            id: "bench_petition",
            label: "復元の署名を集める",
            description: "数字に現れない価値を守るために、声を上げる。",
            minatoReaction: "声を上げるのか。\n世界を変えようとするのは、いつだって少数派から始まる。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "署名は1万人を超えました。でも、都市管理AIが請願を却下したんです。\n理由は「功利主義的正当性が不十分」。",
                },
                {
                  speaker: "MINATO",
                  text: "1万人の声より、アルゴリズムの判断が優先される。\nこれが2086年の民主主義の形なのかもしれない。",
                },
              ],
              question: "AI の判断に対して、さらに上訴しますか？それとも受け入れますか？",
              mode: "binary",
              choices: [
                {
                  id: "petition_escalate",
                  label: "上訴する",
                  description: "人間の声がアルゴリズムに負けてはいけない。最後まで戦う。",
                  minatoReaction: "まだ戦うのか。\n……でも、戦い続けること自体が、人間の尊厳なのかもしれない。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "上訴の過程で気づいたんです。\nAIの判断基準は、過去の人間の意思決定データから学習されたものだった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "つまり、AIに反対することは、過去の「人間の多数派の判断」に反対することでもある。\n民意対民意──どちらが本当の民主主義なんだろう。",
                      },
                    ],
                    question: "過去の多数派の意思を学習したAIと、今の少数派の声。どちらが民主的ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "petition_present_voice",
                        label: "今の声が優先されるべきだ",
                        description: "民主主義は生きている人間の意思であるべきだ。過去に縛られてはいけない。",
                        minatoReaction: "今を生きる人の声か。\nでも、その「今」もいつか「過去」になるんだよね。",
                      },
                      {
                        id: "petition_ai_aggregate",
                        label: "AIの集合知にも正当性がある",
                        description: "膨大な過去の判断の蓄積は、一時の感情より信頼できるかもしれない。",
                        minatoReaction: "集合知の正当性……。\nそれを認めると、僕たちは何のために声を上げるんだろう。",
                      },
                    ],
                  },
                },
                {
                  id: "petition_accept_ai",
                  label: "AIの判断を受け入れる",
                  description: "1万の署名でも届かないなら、それがこの時代のルールだ。",
                  minatoReaction: "受け入れるか。\n戦うことと、引き際を知ることは、どちらも勇気だ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "受け入れた後、考えたんです。\n僕たちはいつの間にか、AIに「正しさ」の判断を委ねることに慣れてしまった。",
                      },
                      {
                        speaker: "MINATO",
                        text: "効率的で、公平で、感情に左右されない。\nでも、感情に左右されないということは──\n人間にとって大切なものが、判断基準に入らないということだ。",
                      },
                    ],
                    question: "効率的だが感情を理解しない統治と、非効率でも人間的な統治。どちらを望みますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "petition_efficient",
                        label: "効率的な統治を受け入れる",
                        description: "感情で動く政治が生んだ悲劇を、僕たちは歴史で知っている。",
                        minatoReaction: "効率を選ぶか。\n……でも、ベンチを懐かしむ気持ちは、非効率な感情だったのかな。",
                      },
                      {
                        id: "petition_human",
                        label: "人間的な統治を望む",
                        description: "間違えることがあっても、人間が決めることに意味がある。",
                        minatoReaction: "人間的な統治か。\n間違える自由すら、僕たちの権利なのかもしれないね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "bench_alternative",
            label: "自分で代わりを作る",
            description: "制度に頼らず、自分の手で居場所を作り直す。",
            minatoReaction: "自分の手で作るか。\n制度に頼らない強さが、そこにある。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "自分でベンチを作って、私有地に置きました。\n近所の人たちも使ってくれるようになった。",
                },
                {
                  speaker: "MINATO",
                  text: "でも、市から通知が来ました。「公共利用に供する構造物は許可が必要」と。\n撤去するか、正式な申請を出すか──でも申請はまず通らないそうです。",
                },
              ],
              question: "市の指示に従ってベンチを撤去しますか？",
              mode: "binary",
              choices: [
                {
                  id: "alternative_comply",
                  label: "撤去に従う",
                  description: "法を破ってまで守るべきものではない。別の方法を探す。",
                  minatoReaction: "従うのか。\n……ルールの中でできることを探す、その姿勢は尊い。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "撤去した後、あのベンチを使っていたおばあさんが言ったんです。\n「あのベンチがあったから、毎日外に出る理由があった」と。",
                      },
                      {
                        speaker: "MINATO",
                        text: "法律を守った。でも、誰かの居場所を奪った。\n正しい手続きが、必ずしも正しい結果を生むわけではない。",
                      },
                    ],
                    question: "手続き的な正しさと、実質的な善さ。どちらが大切ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "comply_procedure",
                        label: "手続きの正しさ",
                        description: "ルールを無視し始めたら、社会の秩序が崩れる。",
                        minatoReaction: "手続きを重んじるか。\n秩序を守ることで、より多くの人が守られるという信念だね。",
                      },
                      {
                        id: "comply_substance",
                        label: "実質的な善さ",
                        description: "目の前の人を助けられないルールに、どんな価値があるのか。",
                        minatoReaction: "実質を取るか。\n……でも、誰にとっての「善さ」かを決める権利は、誰にあるんだろう。",
                      },
                    ],
                  },
                },
                {
                  id: "alternative_resist",
                  label: "撤去を拒否する",
                  description: "不合理な規則には従わない。これは小さな市民的不服従だ。",
                  minatoReaction: "拒否するのか。\n小さな反抗が、世界を変えてきた歴史もある。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "撤去を拒否したことがニュースになりました。\n賛同する人もいれば、「法を守れ」という人もいる。",
                      },
                      {
                        speaker: "MINATO",
                        text: "あるジャーナリストに聞かれたんです。\n「もし全員があなたのように法を無視したら、社会はどうなりますか？」と。",
                      },
                    ],
                    question: "「全員が同じことをしたら？」という問いに、どう答えますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "resist_universal",
                        label: "全員がそうすべきだ",
                        description: "不合理な法には全員が抵抗すべきだ。それが社会を良くする。",
                        minatoReaction: "全員が抵抗する世界か。\n……理想的だけど、「不合理」の基準は人によって違うんだよね。",
                      },
                      {
                        id: "resist_exception",
                        label: "これは特別な場合だ",
                        description: "普遍化できない選択もある。文脈が全てだ。",
                        minatoReaction: "特別な場合……。\nでも、誰もが自分のケースを「特別」だと思う。それが怖いところだ。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "bench_accept",
            label: "受け入れる",
            description: "場所がなくなっても、記憶は残る。形にこだわる必要はない。",
            minatoReaction: "受け入れるか。\n変えられないことを認めるのも、強さだと思う。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "数年後、あの場所を通りかかりました。\nベンチがあった場所は、子どもたちの遊び場になっていた。",
                },
                {
                  speaker: "MINATO",
                  text: "子どもたちの笑い声を聞きながら思ったんです。\nAIの判断は、結果的に正しかったのかもしれない──\nでも「結果が良ければ正しい」のだろうか。",
                },
              ],
              question: "結果が良ければ、過程の問題は許されると思いますか？",
              mode: "binary",
              choices: [
                {
                  id: "accept_outcome",
                  label: "結果が全てだ",
                  description: "子どもたちの笑顔が、AIの判断の正しさを証明している。",
                  minatoReaction: "結果が全てか。\n……でも、それなら僕の記憶の価値は、最初から無かったことになる。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "結果で判断するなら、僕たちの人生の価値も──\n最後の結果で決まるのだろうか。",
                      },
                      {
                        speaker: "MINATO",
                        text: "60年間の過程より、最期の瞬間が全てを定義する。\nそんな世界は、正しいのだろうか。",
                      },
                    ],
                    question: "人生の価値は、結果で測られるべきですか？それとも過程にこそ価値がありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "outcome_result",
                        label: "結果に価値がある",
                        description: "何を成し遂げたかが、その人の人生を定義する。",
                        minatoReaction: "結果か。\n……じゃあ、何も成し遂げなかった人生には、価値がないのかな。",
                      },
                      {
                        id: "outcome_process",
                        label: "過程にこそ価値がある",
                        description: "どう生きたかが大切だ。結果は時の運でしかない。",
                        minatoReaction: "過程を選ぶか。\nそう思えるのは、60年分の過程を大切にしてきたからだろうね。",
                      },
                    ],
                  },
                },
                {
                  id: "accept_process_matters",
                  label: "過程も大切だ",
                  description: "良い結果でも、人の気持ちを無視した過程は正当化できない。",
                  minatoReaction: "過程を問うか。\nそれは、効率の時代への静かな抵抗だね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "過程を大切にするということは、\n時に最善の結果を手放すことでもある。",
                      },
                      {
                        speaker: "MINATO",
                        text: "全員の気持ちを聞いていたら、この遊び場はできなかったかもしれない。\n子どもたちの笑顔は、存在しなかったかもしれない。",
                      },
                    ],
                    question: "過程を重視して最善の結果を逃すことは、それ自体が罪ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "process_worth_it",
                        label: "それでも過程が大切だ",
                        description: "人間の尊厳は効率に優先する。たとえ結果が劣っても。",
                        minatoReaction: "尊厳を選ぶか。\n60年生きて、僕もそう思えるようになってきた気がする。",
                      },
                      {
                        id: "process_balance",
                        label: "バランスが必要だ",
                        description: "過程も結果も大切。どちらかに偏るのは危険だ。",
                        minatoReaction: "バランスか。\n……でも、バランスを取ること自体が、すでに一つの立場なんだよね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 3: 鏡 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "先日、難しい判断を迫られました。正しいことと、大切なことが一致しない状況です。",
          },
          {
            speaker: "MINATO",
            text: "正しいことをすれば、多くの人のためになる。でも、身近な大切な人を傷つけるかもしれない。",
          },
          {
            speaker: "MINATO",
            text: "大切な人を守れば、正しさから目を逸らすことになる。60年生きても、この問いに答えが出ない。",
          },
        ],
        question: "正しいことと、大切なこと。どちらを選びますか？",
        mode: "binary",
        choices: [
          {
            id: "choose_right",
            label: "正しいことをする",
            description: "大切な人も、いつか理解してくれると信じる。",
            minatoReaction: "正しいことを選ぶ。\n……でも、正しさって、時代で変わるんだよね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "正しいことをしました。\nあの人は、時間をかけて理解してくれた。でも──",
                },
                {
                  speaker: "MINATO",
                  text: "関係は元には戻らなかった。\n理解と許しは違うんです。頭では分かっても、心の距離は縮まらない。\nもう一度同じ場面に立ったら、同じ選択をしますか？",
                },
              ],
              question: "関係が壊れると分かっていても、もう一度正しさを選びますか？",
              mode: "binary",
              choices: [
                {
                  id: "right_again",
                  label: "もう一度同じ選択をする",
                  description: "正しいと信じたことを曲げたら、自分が自分でなくなる。",
                  minatoReaction: "また同じ道を行くのか。\n……その一貫性は、強さでもあり、頑なさでもあるね。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "一貫性を貫く人生を歩んできました。\nでも、ふと思うんです。",
                      },
                      {
                        speaker: "MINATO",
                        text: "道徳的に正しくあり続けた代わりに失ったもの──\n笑い合えた夜、分かち合えた痛み、隣にいてくれた温もり。\nその重さは、正しさで埋められるものだったのだろうか。",
                      },
                    ],
                    question: "道徳的な正しさは、人間関係の喪失を補えると思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "right_compensates",
                        label: "補える",
                        description: "正しく生きたという事実が、最後には自分を支えてくれる。",
                        minatoReaction: "正しさが支えか。\n孤独な夜に、それだけで温まれるだろうか……僕には分からない。",
                      },
                      {
                        id: "right_not_enough",
                        label: "補えない",
                        description: "正しさだけでは人は生きていけない。人は人との間で生きるものだ。",
                        minatoReaction: "補えないか。\n……それでも正しさを選んだのは、矛盾だろうか。それとも覚悟だろうか。",
                      },
                    ],
                  },
                },
                {
                  id: "right_different",
                  label: "今度は違う選択をする",
                  description: "正しさのために人を失うのは、もう十分だ。",
                  minatoReaction: "違う道を行くか。\nそれは妥協じゃない。60年分の学びだ。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "違う選択をすると決めた。でも、それは──\n「正しさ」を手放すことじゃなく、「正しさ」の定義を変えることなのかもしれない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "20歳の頃の正しさと、60歳の正しさは違う。\n人を傷つけない正しさ。それは甘さですか？\nそれとも、成熟ですか？",
                      },
                    ],
                    question: "正しさの基準が年齢とともに変わることは、成長ですか、それとも妥協ですか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "right_growth",
                        label: "成長だ",
                        description: "経験を通じて価値観が深まるのは、人間として自然なことだ。",
                        minatoReaction: "成長か。\nそうだね。20歳の僕には見えなかったものが、今は見える。",
                      },
                      {
                        id: "right_compromise",
                        label: "妥協かもしれない",
                        description: "痛みを避けるために正しさを曲げるなら、それは成長とは言えない。",
                        minatoReaction: "妥協か……。\n成長と妥協の境界は、たぶん誰にも分からないんだろうね。",
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "choose_dear",
            label: "大切なことを守る",
            description: "正しさは変わる。でも、大切な人はかけがえがない。",
            minatoReaction: "大切なものを選ぶ。\n正しさより、愛を選ぶんだね。",
            followUp: {
              setup: [
                {
                  speaker: "MINATO",
                  text: "大切な人を守りました。\nでも、あなたが避けた「正しいこと」──誰かがやらなければならなかった。",
                },
                {
                  speaker: "MINATO",
                  text: "結局、別の人がそれを引き受けて、その人は大きな代償を払った。\n自分の手は汚れていない。でも、誰かの手を汚させた。\nあなたは、その責任を感じますか？",
                },
              ],
              question: "自分が避けた負担を他者が背負った。その責任は自分にありますか？",
              mode: "binary",
              choices: [
                {
                  id: "dear_responsible",
                  label: "責任がある",
                  description: "自分が引き受けなかったから、誰かが犠牲になった。それは事実だ。",
                  minatoReaction: "責任を認めるのか。\n……その重さを背負える人は、実は強い人だと思う。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "責任を認めた。でも、認めたところで、\nあの人が受けた痛みは消えない。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「責任を感じている」と言うことは、\n免罪符になってしまわないだろうか。\n罪悪感を表明することで、実際の償いを回避していないだろうか。",
                      },
                    ],
                    question: "責任を「感じる」ことと、責任を「取る」こと。同じだと思いますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "dear_feel_enough",
                        label: "感じることが第一歩だ",
                        description: "まず認めなければ、償いも始まらない。",
                        minatoReaction: "第一歩か。\n……でも、その一歩を踏み出した後の道のりは、とても長い。",
                      },
                      {
                        id: "dear_action_needed",
                        label: "行動が伴わなければ意味がない",
                        description: "感じるだけなら誰でもできる。大切なのは何をするかだ。",
                        minatoReaction: "行動か。\nでも、取り返しのつかないことに対して、何ができるんだろう。",
                      },
                    ],
                  },
                },
                {
                  id: "dear_not_responsible",
                  label: "責任はない",
                  description: "自分の選択の結果に責任はあるが、他者の選択の結果までは負えない。",
                  minatoReaction: "責任はないか。\n……でも、本当にそう割り切れるのかな。",
                  followUp: {
                    setup: [
                      {
                        speaker: "MINATO",
                        text: "責任はないと言った。\nでもね、夜になると考えるんです。",
                      },
                      {
                        speaker: "MINATO",
                        text: "「自分の選択の範囲」と「自分の影響の範囲」は違う。\n選ばなかったことも、世界に影響を与えている。\n不作為もまた、一つの行為ではないだろうか。",
                      },
                    ],
                    question: "「選ばなかったこと」にも、道徳的な重さはありますか？",
                    mode: "binary",
                    choices: [
                      {
                        id: "dear_inaction_weight",
                        label: "不作為にも重さがある",
                        description: "見て見ぬふりも、一つの選択だ。その重さから逃れることはできない。",
                        minatoReaction: "不作為の重さ……。\nそう考えると、僕たちは常に何かの責任を負っているんだね。",
                      },
                      {
                        id: "dear_limited_duty",
                        label: "人の責任には限界がある",
                        description: "全ての不作為に責任を感じていたら、誰も生きていけない。",
                        minatoReaction: "限界があるか。\n……そうだね。全てを背負おうとしたら、壊れてしまう。",
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
    id: "age60_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 4: タイムライン保存
  {
    id: "age60_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // Step 5: モンタージュ 60→80歳
  {
    id: "age60_montage",
    type: "montage",
    title: "20年の歳月",
    montageFromAge: 60,
    montageToAge: 80,
  },
  // Step 6: 80歳への接続
  {
    id: "age80_retelling",
    type: "narrative",
    title: "80歳のミナト",
    lines: AGE_80_RETELLING,
  },
];
