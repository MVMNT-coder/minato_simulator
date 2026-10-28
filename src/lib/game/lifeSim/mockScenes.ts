// ============================================================
// Layer 2 モックシーン — AI未接続でも動作する決定論的シーン (§16, §6)
// 20歳は制度ごとにbespoke。40歳以降は人格連動のテンプレート生成。
// ============================================================
import type { LifeAge, MinatoPersona, Regime, SceneData } from "./types";
import { dominantAxes } from "./persona";
import { findRegime } from "./regimes";

// ------ 20歳: 制度別 bespoke シーン ------
const AGE20_SCENES: Record<string, Omit<SceneData, "age" | "regimeId">> = {
  life_path_guarantee: {
    sceneTitle: "決める期限",
    worldDescription:
      "AI人生経路保障制度が一般化した2046年。進学・住居・就職は、承認ひとつで一括保障される。逸脱は罰されない——ただ、支援が静かに減っていくだけだ。",
    dailyLife:
      "ミナトは志望登録画面を開いたまま、朝から動けずにいる。画面の右上には〈残り推薦枠〉のカウンターがあり、見ているあいだにも数字がひとつ減った。母からは『早く承認しなさい』と三度目の通知。",
    benefit: "承認すれば、学費も住まいも、その先の仕事まで確定する。もう何も怖くない。",
    conflict:
      "考えている時間そのものに、締め切りがある。迷えば迷うほど、選べる未来が減っていく。",
    minatoLines: [
      "学費も、家も、そのあとの仕事まで用意されてるんだ。",
      "そんな条件を出されたら、嫌だって言うほうがわがままみたいじゃない？",
      "……でも、まだ、指が承認ボタンに届かないんだ。",
    ],
    question: {
      type: "priority",
      prompt: "この状況で、ミナトが一番守りたいものは？",
      choices: [
        "自分で決めるための時間",
        "将来の安定",
        "母や周りの安心",
        "制度から外れる自由",
      ],
      reasonPrompt: "なぜ、それを守りたいと思いましたか？(1〜3文でどうぞ)",
    },
  },
  curiosity_credit: {
    sceneTitle: "採点される寄り道",
    worldDescription:
      "好奇心クレジット制が根づいた2046年。回り道や失敗にも社会が投資する。ただし、あらゆる寄り道は記録され、『何のための経験か』が採点される。",
    dailyLife:
      "ミナトは知らない路地の古い映画館に入った。上映後、端末が『体験を登録しますか?』と尋ねる。登録すればクレジットが付くが、動機の記述欄が空欄だと評価は保留になる。ただ、なんとなく入っただけなのに。",
    benefit: "型にはまらない挑戦がしやすくなった。寄り道が、堂々と肯定される時代だ。",
    conflict:
      "純粋な寄り道さえ、目的を説明できないと評価されない。意味のない時間が、居場所を失っていく。",
    minatoLines: [
      "面白そうだから入った。それだけじゃ、だめなのかな。",
      "『何のため?』って聞かれると、急に、その時間が薄っぺらく感じる。",
      "意味を答えられない好奇心は、好奇心じゃないのかな。",
    ],
    question: {
      type: "thoughtExperiment",
      prompt:
        "もし、迷っている時間や意味のない寄り道にも料金がかかるとしたら——それでもミナトに残しておいてほしい『無駄』はある?",
      choices: [
        "ある。理由のない時間こそ残したい",
        "あるが、少しは説明できるようにしたい",
        "ない。意味を持てる時間にしたい",
      ],
      reasonPrompt: "その『無駄』は、ミナトにとって何だと思いますか?",
      shortInputPrompt: "その時間に、名前をつけるなら?(任意・一言)",
    },
  },
  care_default: {
    sceneTitle: "余る配給",
    worldDescription:
      "生活基盤ベーシック制が定着した2046年。衣食住と医療は無条件で配給される。飢えは消えた。ただし、中身を細かく選ぶことはできない。",
    dailyLife:
      "今朝もミナトの部屋に、栄養最適化された配給パックが届いた。健康値は満点。けれど冷蔵庫の奥には、口に合わずに残したパックが静かに積み上がっている。子どもの頃、母が作った少し焦げた卵焼きを、ふと思い出した。",
    benefit: "生きるための労働から解放された。誰も飢えず、医療の格差も消えた。",
    conflict:
      "守られてはいる。でも、『好きなものを選んで食べる』という小さな贅沢が、選択肢から静かに消えた。",
    minatoLines: [
      "何も足りないものはない。ほんとうに、何も。",
      "なのに、余った配給を捨てるとき、なぜか少しだけ胸が痛むんだ。",
      "満たされることと、守られることって、同じじゃないのかな。",
    ],
    question: {
      type: "discomfort",
      prompt: "この暮らしの中で、ミナトが一番『嫌だ』と感じるのはどれ?",
      choices: [
        "好きな食べ物を選べないこと",
        "余ったものを捨てること",
        "働く理由がなくなること",
        "不満を言うと贅沢だと思われること",
      ],
      reasonPrompt: "なぜ、それが一番ひっかかるのだと思いますか?",
    },
  },
};

export function getAge20Scene(regime: Regime): SceneData {
  const base = AGE20_SCENES[regime.id];
  if (base) return { ...base, age: 20, regimeId: regime.id };
  return buildGenericScene(20, regime, null);
}

// ------ 40歳以降: 人格連動のテンプレート生成 ------
// 蓄積された価値観の傾向で、日常描写・葛藤・問いの重心を変える (§4-1, §7)
export function buildGenericScene(
  age: LifeAge,
  regime: Regime,
  persona: MinatoPersona | null,
): SceneData {
  const top = persona ? dominantAxes(persona.valueProfile)[0].axis : "autonomy";

  const dailyByAxis: Record<string, string> = {
    autonomy: `${age}歳のミナトは、${regime.name}の通知を前に、まず自分の頭で考えようとする癖が抜けない。周りは先に承認を済ませている。`,
    security: `${age}歳のミナトは、${regime.name}が用意した安全な枠の内側で、静かに日々を送っている。波風はない。ないからこそ、時々そわそわする。`,
    efficiency: `${age}歳のミナトは、${regime.name}を最短で使いこなしている。手続きは滞りない。ただ、効率のよさが少し寂しく感じる朝がある。`,
    community: `${age}歳のミナトは、${regime.name}の中でも、まず家族や近しい人の顔を思い浮かべてから動く。自分のことは、いつも後回しだ。`,
    curiosity: `${age}歳になっても、ミナトは${regime.name}の『想定外』の使い方を試してみたくなる。制度の隙間に、まだ知らない何かがある気がして。`,
    embodiment: `${age}歳のミナトは、${regime.name}の数値やスコアより、手触りや温度を信じている。画面の外の世界を、まだ手で確かめたい。`,
    trustInSystems: `${age}歳のミナトは、${regime.name}を素直に信頼して暮らしている。任せられるものは任せる。それで肩の荷が下りた。`,
    toleranceForAmbiguity: `${age}歳のミナトは、${regime.name}が求める『はっきりした答え』を、まだ保留にしている。白黒つかないまま持ち歩くのに慣れてきた。`,
  };

  return {
    age,
    regimeId: regime.id,
    sceneTitle: `${age}歳の${regime.name}`,
    worldDescription: `${regime.description} ${regime.upside}`,
    dailyLife: dailyByAxis[top] ?? dailyByAxis.autonomy,
    benefit: regime.upside,
    conflict: regime.seededTension,
    minatoLines: [
      `${age}歳になったよ。またこの季節が来た。`,
      `${regime.name}のおかげで、暮らしは楽になった。それは本当なんだ。`,
      "でも、楽になったぶん、見えなくなったものもある気がして。",
    ],
    question: {
      type: age >= 100 ? "acrossTime" : "priority",
      prompt:
        age >= 100
          ? `${age}歳のミナトから、若い頃の自分に一言だけ残すとしたら——何を選ぶ?`
          : `${regime.name}の中で、ミナトが一番手放したくないものは?`,
      choices:
        age >= 100
          ? ["迷ってよかった、と伝える", "もっと早く決めろ、と伝える", "そのままでいい、と伝える", "何も言わずにおく"]
          : ["自分で決める余地", "大切な人との時間", "安心できる暮らし", "まだ知らない可能性"],
      reasonPrompt: "なぜ、そう思いましたか?(1〜3文でどうぞ)",
    },
  };
}

// 制度IDからシーンを取得(20歳bespoke / それ以降generic)
export function getMockScene(
  age: LifeAge,
  regimeId: string,
  persona: MinatoPersona | null,
): SceneData {
  const regime = findRegime(age, regimeId);
  if (!regime) {
    // 保険: 制度が見つからない場合の最小シーン
    return buildGenericScene(age, {
      id: regimeId,
      age,
      name: "未知の制度",
      tagline: "",
      description: "",
      upside: "",
      seededTension: "",
    }, persona);
  }
  if (age === 20) return getAge20Scene(regime);
  return buildGenericScene(age, regime, persona);
}
