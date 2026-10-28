// ============================================================
// Age 20 — Step definitions and predetermined content
// 2046年、ミナトの人生の出発点
// ============================================================
import type { AgeStepDef, SceneLine } from "./types";
import { AGE_30_STEPS } from "./age30Data";
import { AGE_40_STEPS } from "./age40Data";
import { AGE_60_STEPS } from "./age60Data";
import { AGE_80_STEPS } from "./age80Data";
import { AGE_100_STEPS } from "./age100Data";

// ------ Step 1: ビデオレター ------
const OPENING_LINES: SceneLine[] = [
  { speaker: "SYSTEM", text: "受信中——2046年からの映像データを検出。" },
  { speaker: "SYSTEM", text: "送信者: ミナト（20歳）\n送信日時: 2046年4月3日" },
  { speaker: "MINATO", text: "──録画スタート。" },
  {
    speaker: "MINATO",
    text: "あ、繋がった。\nはじめまして。2046年からアクセスしています。\n20歳のミナトです。",
  },
  {
    speaker: "MINATO",
    text: "まさか、過去の人にメッセージを送れるサービスがあるなんて、\n正直、まだ半信半疑なんですけど……届いてますか？",
  },
  {
    speaker: "MINATO",
    text: "僕の人生は、たぶん失敗していません。\nでも、失敗していない人生が、\nこんなに不安になるなんて思いませんでした。",
  },
  {
    speaker: "MINATO",
    text: "実は、僕らの時代では、\nAIが「最適な人生」をほとんど決めてくれます。\n進路も、仕事も、住む場所も、\n誰と関係を結ぶべきかさえ。",
  },
  {
    speaker: "MINATO",
    text: "だから今日、僕のAI人生設計書が届いたんです。\n向こう80年間の「最適解」が、全部書いてある。\n……ちょっと、一緒に見てもらえませんか？",
  },
  { speaker: "MINATO", text: "──録画、一時停止。" },
];

// ------ Step 2: AI人生設計書 ------
const LIFE_PLAN_SECTIONS = [
  {
    heading: "キャリアパス",
    content:
      "環境適応型データアーキテクトとして、23歳で大手インフラ企業に配属。\n28歳で主任昇格。35歳以降はマネジメント領域へ移行。\n予測年収曲線は安定上昇型。リスク指数: 0.3%。",
  },
  {
    heading: "住居計画",
    content:
      "25歳まで都市型コンパクト住居。30歳で郊外の気候適応型住宅へ移行。\n住宅支援スコア: A+（AI推奨生活パターンに準拠した場合）。",
  },
  {
    heading: "人間関係",
    content:
      "27歳前後でパートナーマッチング推奨。\n相性最適化済みの候補3名がリスト化済み。\n子どもは1名が最適（養育コスト・幸福度バランス）。",
  },
  {
    heading: "健康管理",
    content:
      "遺伝子プロファイルに基づく予防プログラム自動適用。\n50歳時点での健康維持確率: 94.2%。\n身体拡張オプション: 60歳以降に段階的導入推奨。",
  },
  {
    heading: "資産設計",
    content:
      "全自動分散投資。60歳時点の資産目標達成確率: 97.8%。\n不測事態引当金: 年収の15%を自動積立。\n相続最適化: 自動設定済み。",
  },
  {
    heading: "総合評価",
    content:
      "人生成功確率: 98.4%\n幸福度予測: 78.3 / 100\n社会貢献スコア: B+\n\n※ この設計書に従うことで、主要リスクの96%を回避できます。",
  },
];

// ------ Step 4 (old Step 8): 自由入力プロンプト ------
const FREE_TEXT_PROMPT = "AIの設計書にも、カードにもなかったもの。\nあなたなら、ミナトの人生に何を加えますか？";
const FREE_TEXT_PLACEHOLDER = "ここに自由に書いてください……";

// ------ Step 8 (old Step 12): 30歳の語り直し ------
const AGE_30_RETELLING: SceneLine[] = [
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
    text: "20歳のとき、あなたが選んでくれたこと、\n覚えていますよ。\nでも、あのときとは少し違う意味で\n受け取っています。",
  },
  {
    speaker: "MINATO",
    text: "あのとき「欠けている」と思ったものが、\n本当に欠けていたのかどうか。\n10年経った今も、まだ分かりません。",
  },
  {
    speaker: "MINATO",
    text: "ただ——あなたが選んでくれたおかげで、\n「考え続ける理由」ができました。\nそれだけは、確かです。",
  },
];

// ============================================================
// 8ステップ定義
// ============================================================
export const AGE_20_STEPS: AgeStepDef[] = [
  // Step 1: ビデオレター
  {
    id: "age20_video_letter",
    type: "narrative",
    title: "ビデオレター",
    lines: OPENING_LINES,
  },
  // Step 2: AI人生設計書
  {
    id: "age20_life_plan",
    type: "document",
    title: "AI人生設計書",
    documentSections: LIFE_PLAN_SECTIONS,
  },
  // Step 3: シナリオ（3つの思考実験）
  {
    id: "age20_scenarios",
    type: "scenario",
    title: "選択の実験",
    scenarios: [
      // Scenario 1: カフェの寄り道 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "設計書を読んだあとの帰り道、知らないカフェを見つけた。AIは「推奨ルートから外れています」って通知してきた。",
          },
          {
            speaker: "MINATO",
            text: "中を覗くと、見たことのない雰囲気の人たちがいた。入ってみたい気持ちと、早く帰って設計書を読み返したい気持ちが半分ずつ。",
          },
        ],
        question: "あなたなら、どうしますか？",
        mode: "binary",
        choices: [
          {
            id: "enter_cafe",
            label: "カフェに入る",
            description: "予定にないことをする。何が起きるか分からないけど、それが気になる。",
            minatoReaction: "……推奨ルートを外れるのか。\nなんだか、少しだけ嬉しいような気がする。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "カフェに入ったら、隣の席の人に話しかけられた。AIが「この人物との長期的交流は非推奨」と通知してきた。" },
                { speaker: "MINATO", text: "でも、その人はすごく面白い話をしていた。設計書にはない世界のこと。" },
              ],
              question: "AIの警告を無視して、話を続けますか？",
              mode: "binary",
              choices: [
                {
                  id: "listen_stranger",
                  label: "話を続ける",
                  description: "面白いと思った直感を信じる。AIの警告より自分の好奇心。",
                  minatoReaction: "好奇心を選んだんだ。\n……僕もそうしたかった。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "その人が言ったんです。「AIが最適と言う人生を歩いて、最期に何が残ると思う？」" },
                      { speaker: "MINATO", text: "答えに詰まった。最適な人生の最期には、何が残るんだろう。" },
                    ],
                    question: "最適な人生の最期には、何が残ると思いますか？",
                    mode: "binary",
                    choices: [
                      { id: "remains_satisfaction", label: "満足が残る", description: "最適解を歩んだ達成感。それで十分では。", minatoReaction: "満足か。\n……でも、「満足」と「幸せ」は同じだろうか。" },
                      { id: "remains_nothing", label: "何も残らない", description: "最適すぎて記憶に残らない。痛みも喜びも平均化される。", minatoReaction: "何も残らない……。\nそれは「成功」と呼べるのだろうか。" },
                    ],
                  },
                },
                {
                  id: "obey_warning",
                  label: "警告に従う",
                  description: "AIには理由があるはず。リスクを避けるのは合理的。",
                  minatoReaction: "警告に従うのか。\n……合理的だけど、少し寂しい。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "カフェを出て推奨ルートに戻った。安全で、快適で、予定通り。" },
                      { speaker: "MINATO", text: "でも家に着いてから、ずっとあの人のことを考えていた。話の続きが気になって眠れなかった。" },
                    ],
                    question: "翌日、またあのカフェに行きますか？",
                    mode: "binary",
                    choices: [
                      { id: "return_cafe", label: "もう一度行く", description: "気になるなら行けばいい。一度従った上で、自分で決め直す。", minatoReaction: "結局、戻るのか。\n……一度離れてから戻る勇気って、最初より難しいよね。" },
                      { id: "forget_cafe", label: "忘れる", description: "気になっても、ルートを外れる習慣をつけたくない。", minatoReaction: "忘れることを選ぶのか。\n……それができる人は、たぶん強い人だ。" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "follow_route",
            label: "推奨ルートで帰る",
            description: "設計書を読み返して、自分の人生計画をもっと理解したい。",
            minatoReaction: "うん、設計書をもっと理解するのも大事だよね。\n僕もそう思いたい。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "推奨ルートで帰りながら設計書を読み返していたら、小さな矛盾を見つけた。キャリアパスと幸福度予測の前提条件が、微妙にずれている。" },
                { speaker: "MINATO", text: "たぶんAIのバグじゃない。でも、人間なら気づく程度の不整合。" },
              ],
              question: "この矛盾をAIに報告しますか？",
              mode: "binary",
              choices: [
                {
                  id: "report_bug",
                  label: "報告する",
                  description: "小さな矛盾でも、見つけたなら伝えるべき。",
                  minatoReaction: "報告するか。\n……AIに「間違い」を指摘するのは、勇気がいる。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "AIの返答は「ご指摘ありがとうございます。この不整合は許容範囲内です。設計書の精度に影響はありません」だった。" },
                      { speaker: "MINATO", text: "……許容範囲。AIにとっての誤差と、僕にとっての矛盾は、違うものなのかもしれない。" },
                    ],
                    question: "「許容範囲」という回答に納得しますか？",
                    mode: "binary",
                    choices: [
                      { id: "accept_tolerance", label: "納得する", description: "AIの判断を信じる。自分が気にしすぎただけ。", minatoReaction: "納得するのか。\n……でも、「納得」と「諦め」の境界線はどこにあるんだろう。" },
                      { id: "reject_tolerance", label: "納得しない", description: "許容範囲かどうかは、AIじゃなくて自分が決めること。", minatoReaction: "納得しないか。\n……その頑固さが、いつか何かを変えるかもしれない。" },
                    ],
                  },
                },
                {
                  id: "ignore_bug",
                  label: "黙っておく",
                  description: "大した矛盾じゃないかもしれない。波風を立てたくない。",
                  minatoReaction: "黙っておくのか。\n……「見て見ぬふり」と「信頼」は似ているようで違う。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "数日後、友人が同じ矛盾に気づいて騒ぎ始めた。「設計書は本当に信用できるのか」って。" },
                      { speaker: "MINATO", text: "僕は先に気づいていた。でも何も言わなかった。" },
                    ],
                    question: "友人に「自分も気づいていた」と伝えますか？",
                    mode: "binary",
                    choices: [
                      { id: "confess_knew", label: "伝える", description: "正直に言う。黙っていたことも含めて。", minatoReaction: "正直に言うのか。\n……「先に気づいていたのに黙っていた」と言うのは、勇気がいる。" },
                      { id: "stay_silent", label: "伝えない", description: "今さら言っても状況は変わらない。", minatoReaction: "黙り続けるか。\n……沈黙にも、重さがある。" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 2: 三つの扉 (multiChoice)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "AIの設計書では、僕の人生の「成功確率」は98.4%だった。でも、正直に言うと、残り1.6%のほうが気になるんです。",
          },
          {
            speaker: "MINATO",
            text: "もし、設計書を一つだけ書き換えられるとしたら——",
          },
        ],
        question: "設計書のどの部分を書き換えたいですか？",
        mode: "multiChoice",
        choices: [
          {
            id: "rewrite_career",
            label: "キャリアパス",
            description: "「環境適応型データアーキテクト」じゃなくて、自分で探した仕事をしたい。",
            minatoReaction: "自分で探した仕事か……。\n設計書に載ってない僕を、見てみたい気もする。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "キャリアを自分で選ぶとして、AIの推薦データは参考にできる。完全に無視するか、参考にしつつ自分で決めるか。" },
                { speaker: "MINATO", text: "「自分で選ぶ」と「AIを一切使わない」は、同じことだろうか。" },
              ],
              question: "自分でキャリアを選ぶとき、AIのデータは使いますか？",
              mode: "binary",
              choices: [
                {
                  id: "career_no_ai",
                  label: "一切使わない",
                  description: "データに頼った時点で「自分で選んだ」とは言えない。",
                  minatoReaction: "一切使わないか。\n……純粋だけど、それは「意地」かもしれない。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "AIなしで選んだ仕事は不安定だけど、毎日が新鮮だった。ただ、同期との収入差は広がっていく。" },
                    ],
                    question: "不安定でも新鮮な日々と、安定した退屈。どちらが「成功」ですか？",
                    mode: "binary",
                    choices: [
                      { id: "success_fresh", label: "新鮮な日々", description: "成功は数字じゃない。心が動いているかどうか。", minatoReaction: "新鮮さが成功か。\n……数字では測れない価値を信じているんだね。" },
                      { id: "success_stable", label: "安定した日々", description: "新鮮さは慣れる。安定は基盤になる。", minatoReaction: "安定が成功か。\n……矛盾してないよ。書き換えたいと思っても、安定は大事だ。" },
                    ],
                  },
                },
                {
                  id: "career_partial_ai",
                  label: "参考程度に使う",
                  description: "情報は活用する。でも最終判断は自分。",
                  minatoReaction: "参考にはするのか。\n……「道具として使う」と「依存する」の境界線はどこだろう。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "AIのデータを参考にしつつ自分で選んだキャリア。結果的にAIの推奨とほぼ同じ道になった。" },
                    ],
                    question: "結果が同じでも、「自分で選んだ」と言えますか？",
                    mode: "binary",
                    choices: [
                      { id: "still_mine", label: "言える", description: "プロセスが違う。納得して選んだことに意味がある。", minatoReaction: "プロセスに意味があるか。\n……同じ結論でも、辿り着き方で重みが変わる。" },
                      { id: "not_mine", label: "言えない", description: "結果が同じなら、AIに導かれていたのと変わらない。", minatoReaction: "結局同じか……。\n自由意志って、思っているより狭いのかもしれない。" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "rewrite_relationships",
            label: "人間関係",
            description: "AIが選んだ候補3名じゃなくて、偶然出会った人と関わりたい。",
            minatoReaction: "偶然の出会いか。\nAIには予測できない何かが、そこにあるのかもしれない。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "偶然の出会いを求めて、AIのマッチング候補リストを全て削除した。友人に「無謀だ」と言われた。" },
                { speaker: "MINATO", text: "「偶然に任せるのと、何も選ばないのは違う」って。" },
              ],
              question: "偶然を待つことは、選択を放棄することですか？",
              mode: "binary",
              choices: [
                {
                  id: "fate_is_choice",
                  label: "偶然を待つのも選択",
                  description: "何を選ばないかを決めること自体が、強い意志の表れ。",
                  minatoReaction: "待つことも選択か。\n……能動的に受動的でいるって、面白い矛盾だね。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "半年後、本当に偶然出会った人がいた。AIは「相性スコア: 測定不能」と表示した。" },
                    ],
                    question: "「測定不能」の相手と、関係を深めますか？",
                    mode: "binary",
                    choices: [
                      { id: "unmeasurable_yes", label: "深める", description: "測定できないからこそ面白い。数字の外にある可能性。", minatoReaction: "測定不能を選ぶのか。\n……数字がない世界は怖いけど、自由だ。" },
                      { id: "unmeasurable_no", label: "慎重になる", description: "さすがに測定不能は不安。もう少し情報がほしい。", minatoReaction: "慎重になるか。\n偶然を求めながらも安全網は欲しい……正直だと思う。" },
                    ],
                  },
                },
                {
                  id: "fate_is_giving_up",
                  label: "選択の放棄だと思う",
                  description: "でも、それでも偶然に賭けたい。矛盾を引き受ける。",
                  minatoReaction: "放棄だと分かっていて、それでも……。\n矛盾を自覚した上での選択は、むしろ誠実かもしれない。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "矛盾を抱えたまま日々を過ごしていたら、不思議なことに、肩の力が抜けてきた。" },
                    ],
                    question: "矛盾を抱えたまま生きることは、苦しいですか？",
                    mode: "binary",
                    choices: [
                      { id: "contradiction_hard", label: "苦しい", description: "でも、苦しさが人間らしさかもしれない。", minatoReaction: "苦しいか。\n……苦しみから逃げないことが、たぶん大人になるということだ。" },
                      { id: "contradiction_free", label: "むしろ楽になる", description: "白黒つけなくていいと分かると、世界が広がる。", minatoReaction: "楽になるのか。\n……グレーゾーンに住む知恵を、僕も身につけたい。" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "rewrite_risk",
            label: "リスク指数",
            description: "0.3%のリスクじゃ物足りない。もっと失敗できる人生がいい。",
            minatoReaction: "もっと失敗できる人生……。\n怖いけど、正直に言うと、少しわくわくする。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "リスクを上げると決めた翌日、二つの道が同時に現れた。起業のチャンスと、海外ボランティアの誘い。" },
                { speaker: "MINATO", text: "どちらもAIは「非推奨」。でも、リスクを選ぶなら、どちらの「リスク」を取る？" },
              ],
              question: "どちらのリスクを取りますか？",
              mode: "binary",
              choices: [
                {
                  id: "risk_startup",
                  label: "起業する",
                  description: "自分の力で何かを作りたい。失敗しても学びがある。",
                  minatoReaction: "起業か。\n……「自分で作る」ことへの渇望は、設計書にはなかった。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "起業して1年。まだ利益は出ていない。でも、毎日が濃い。AIは「撤退推奨」と言っている。" },
                    ],
                    question: "AIの撤退推奨に従いますか？",
                    mode: "binary",
                    choices: [
                      { id: "persist", label: "続ける", description: "始めた以上、自分で終わりを決めたい。", minatoReaction: "続けるのか。\n……頑固さと信念は紙一重だ。" },
                      { id: "pivot", label: "方向転換する", description: "撤退ではなく、柔軟に変化する。AIの意見も一つの材料。", minatoReaction: "方向転換か。\n……柔軟さもまた、強さの一つだ。" },
                    ],
                  },
                },
                {
                  id: "risk_volunteer",
                  label: "ボランティアに行く",
                  description: "知らない世界を見たい。お金にはならないけど、視野が広がる。",
                  minatoReaction: "ボランティアか。\n……利益にならないことに価値を見出すのは、人間だけかもしれない。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "ボランティア先で、AIによる支援が行き届かない地域を見た。テクノロジーの恩恵の外にいる人たち。" },
                    ],
                    question: "この経験は、設計書への信頼を変えましたか？",
                    mode: "binary",
                    choices: [
                      { id: "trust_shaken", label: "揺らいだ", description: "設計書は「ここにいる人」のためにしか作られていない。", minatoReaction: "揺らいだか。\n……設計書の外に広がる世界を見てしまったんだね。" },
                      { id: "trust_unchanged", label: "変わらない", description: "設計書は自分の人生用。世界の問題とは別の話。", minatoReaction: "変わらないか。\n……自分の人生と世界の問題を分けて考える。それも一つの知恵だ。" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "rewrite_nothing",
            label: "何も書き換えない",
            description: "98.4%の成功を手放す理由がない。このままでいい。",
            minatoReaction: "……そうだよね。98.4%を手放す理由なんて、普通ないよね。\nでも、「普通」って何だろう。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "何も変えないと決めた数日後、設計書にない出来事が起きた。近所に住む老人が倒れて、偶然僕が最初に見つけた。" },
                { speaker: "MINATO", text: "設計書には「近隣住民との深い交流」は含まれていない。でも、その人の手を握っていた。" },
              ],
              question: "設計書にないこの出来事に、意味はありますか？",
              mode: "binary",
              choices: [
                {
                  id: "unplanned_meaningful",
                  label: "意味がある",
                  description: "設計書の外にも人生はある。予測できない瞬間こそ大切。",
                  minatoReaction: "意味があるか。\n……計画の外にある偶然を、肯定してくれるんだね。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "その老人が退院後、僕に「ありがとう」と言ってくれた。設計書の成功確率には反映されない、小さな出来事。" },
                    ],
                    question: "設計書に反映されない価値は、「存在する」と言えますか？",
                    mode: "binary",
                    choices: [
                      { id: "unmeasured_exists", label: "存在する", description: "測れないものにも価値はある。むしろ測れないものこそ。", minatoReaction: "測れない価値か。\n……98.4%の外にある1.6%が、実は一番大切なのかもしれない。" },
                      { id: "unmeasured_uncertain", label: "分からない", description: "存在するかもしれないし、自分がそう思いたいだけかもしれない。", minatoReaction: "分からないか。\n……正直だ。「信じたい」と「存在する」は確かに違う。" },
                    ],
                  },
                },
                {
                  id: "unplanned_coincidence",
                  label: "ただの偶然",
                  description: "良いことをしたが、人生の方針を変えるほどではない。",
                  minatoReaction: "偶然か。\n……偶然を偶然のままにしておける冷静さがある。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "偶然だと割り切った。でも不思議なことに、その日から毎朝、あの老人の家の前を通るルートを選ぶようになった。" },
                      { speaker: "MINATO", text: "AIが推奨したルートじゃない。自分で選んだ、ほんの少しの寄り道。" },
                    ],
                    question: "無意識の寄り道は、心の変化の証ですか？",
                    mode: "binary",
                    choices: [
                      { id: "subconscious_change", label: "変化の証", description: "頭では偶然と言っても、体は正直。何かが変わっている。", minatoReaction: "体は正直か。\n……「何も変えない」と決めた人の、一番小さな反乱だね。" },
                      { id: "just_habit", label: "ただの習慣", description: "深読みしすぎ。たまたま気に入ったルートなだけ。", minatoReaction: "習慣か。\n……でも、「習慣」になる程度には気になっているんだよね。" },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      // Scenario 3: 60歳からの手紙 (binary)
      {
        setup: [
          {
            speaker: "MINATO",
            text: "最後にひとつ。もし未来の自分——60歳の僕から手紙が届いたとして。",
          },
          {
            speaker: "MINATO",
            text: "「あのとき設計書通りにしてよかった」と書いてあるか、「あのとき逸れていればよかった」と書いてあるか、分からない。",
          },
          {
            speaker: "MINATO",
            text: "でも、どちらの手紙が届いても後悔しない選び方があるとしたら——",
          },
        ],
        question: "60歳のミナトから、どちらの手紙が届いてほしいですか？",
        mode: "binary",
        choices: [
          {
            id: "letter_followed",
            label: "「設計書通りにしてよかった」",
            description: "安定した道を歩み、確実に幸せを積み重ねた人生。",
            minatoReaction: "安定を選ぶんだ。\n……僕も、そうしたいと思う日がある。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "安定の手紙を望んだ。でも、もし60歳の僕が「設計書通りにしてよかった。ただ、一度だけ逸れかけた夜があった」と書いていたとしたら。" },
              ],
              question: "その「逸れかけた夜」のことを、知りたいですか？",
              mode: "binary",
              choices: [
                {
                  id: "want_to_know",
                  label: "知りたい",
                  description: "逸れかけた瞬間こそ、本当の自分が見える。",
                  minatoReaction: "知りたいか。\n……安定を選んだ人が持つ、密かな好奇心だ。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "45歳の夜、全てを捨てて旅に出ようとした。家族も、仕事も、設計書も。でも、朝になって踏みとどまった。" },
                    ],
                    question: "踏みとどまったのは、正しい判断でしたか？",
                    mode: "binary",
                    choices: [
                      { id: "stayed_right", label: "正しかった", description: "責任を果たすことは、自由より重い。", minatoReaction: "正しかったか。\n……責任を選ぶことの重さを、あなたは知っている。" },
                      { id: "stayed_wrong", label: "分からない", description: "正しさより、あの夜の気持ちの方が本物だったかもしれない。", minatoReaction: "分からないか。\n……「正しさ」と「本心」が違うこと、僕も薄々気づいている。" },
                    ],
                  },
                },
                {
                  id: "dont_want_to_know",
                  label: "知りたくない",
                  description: "知らない方がいいこともある。安定を壊す情報はいらない。",
                  minatoReaction: "知りたくないか。\n……「知らない権利」というものも、あるのかもしれない。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "知らないままでいることを選んだ。でも「知りたくない」と思ったこと自体が、何かを知っている証拠かもしれない。" },
                    ],
                    question: "「知りたくない」と思うこと自体が、不安の表れだと思いますか？",
                    mode: "binary",
                    choices: [
                      { id: "anxiety_yes", label: "不安だと思う", description: "本当に安心していたら、知ることを恐れない。", minatoReaction: "不安か。\n……安定を選んだ人が抱える、静かな不安。それも人間だ。" },
                      { id: "anxiety_no", label: "不安ではない", description: "選んだ道に集中するために、余計な情報を遮断しているだけ。", minatoReaction: "不安じゃないか。\n……選んだ道への信頼が、そう言わせている。" },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: "letter_deviated",
            label: "「あのとき逸れていればよかった」",
            description: "たとえ後悔の手紙でも、逸れなかった自分を問い続けた証。",
            minatoReaction: "後悔の手紙でもいいのか。\n……強いな。僕にはまだ、その覚悟がない。",
            followUp: {
              setup: [
                { speaker: "MINATO", text: "後悔の手紙を受け入れる覚悟がある。でも、その手紙の最後にこう書いてあったとしたら。「後悔している。でも、あのとき逸れなかった自分を問い続けたこと——それだけは、誇りに思う」" },
              ],
              question: "「問い続けたこと」は、後悔を超える価値がありますか？",
              mode: "binary",
              choices: [
                {
                  id: "questioning_transcends",
                  label: "超える価値がある",
                  description: "答えが出なくても、問い続けること自体に意味がある。",
                  minatoReaction: "問い続けることに価値があるか。\n……僕の人生そのものを肯定してくれている気がする。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "問い続けた80年間。答えは出なかった。でも、問いの質は変わった。" },
                    ],
                    question: "答えのない問いを抱えて生きるのは、幸せですか？",
                    mode: "binary",
                    choices: [
                      { id: "unanswered_happy", label: "幸せだと思う", description: "問いがある限り、人生には方向がある。", minatoReaction: "幸せか。\n……問いが人生を支えるという考え、僕は好きだ。" },
                      { id: "unanswered_painful", label: "苦しいと思う", description: "答えがない苦しみは、年を取るほど重くなる。", minatoReaction: "苦しいか。\n……それでも問い続けるなら、苦しみにも意味があるのかもしれない。" },
                    ],
                  },
                },
                {
                  id: "regret_remains",
                  label: "後悔は後悔のまま",
                  description: "問い続けたことは偉いが、後悔の重さは変わらない。",
                  minatoReaction: "後悔は消えないか。\n……正直だね。美化しない強さがある。",
                  followUp: {
                    setup: [
                      { speaker: "MINATO", text: "後悔は消えない。でも、その後悔を「自分のもの」として抱えることはできる。" },
                    ],
                    question: "後悔を「自分のもの」として受け入れることは、強さですか？",
                    mode: "binary",
                    choices: [
                      { id: "regret_strength", label: "強さだと思う", description: "逃げずに向き合うことが、人間の品格。", minatoReaction: "強さか。\n……後悔と共に歩ける人は、たぶん遠くまで行ける。" },
                      { id: "regret_burden", label: "重荷だと思う", description: "抱えなくていいものまで抱える必要はない。", minatoReaction: "重荷か。\n……「手放す」という選択肢もあるんだね。僕はまだ、手放せない。" },
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
  // Step 4: 第四の選択肢
  {
    id: "age20_fourth_option",
    type: "freeText",
    title: "第四の選択肢",
    freeTextPrompt: FREE_TEXT_PROMPT,
    freeTextPlaceholder: FREE_TEXT_PLACEHOLDER,
  },
  // Step 5: ミナトの返答（3層レスポンス）
  {
    id: "age20_result",
    type: "result",
    title: "ミナトの受け取り方",
  },
  // Step 6: タイムライン保存
  {
    id: "age20_timeline_save",
    type: "timelineSave",
    title: "記憶の保存",
  },
  // Step 7: モンタージュ 20→30歳
  {
    id: "age20_montage",
    type: "montage",
    title: "10年の歳月",
    montageFromAge: 20,
    montageToAge: 30,
  },
  // Step 8: 30歳の語り直し
  {
    id: "age30_retelling",
    type: "narrative",
    title: "30歳のミナト",
    lines: AGE_30_RETELLING,
  },
];

// Helper to get steps for an age
export function getStepsForAge(age: number): AgeStepDef[] {
  switch (age) {
    case 20: return AGE_20_STEPS;
    case 30: return AGE_30_STEPS;
    case 40: return AGE_40_STEPS;
    case 60: return AGE_60_STEPS;
    case 80: return AGE_80_STEPS;
    case 100: return AGE_100_STEPS;
    default: return [];
  }
}
