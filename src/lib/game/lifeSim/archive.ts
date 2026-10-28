// ============================================================
// アーカイブ — 過去に育てられたミナトの人生を保存/読み出す (§13, §17)
// バックエンドは使わず localStorage に蓄積する。
// 加えて、他アーキビストの「サンプル人生」を同梱する。
// ============================================================
import type { ArchivedLife, MinatoPersona } from "./types";
import { ARCHIVE_KEY } from "./types";
import { dominantAxes } from "./persona";
import type { ValueAxis } from "./types";

// ------ ラベル生成: 支配的な価値観からミナトの呼称を導く ------
const EPITHET_BY_AXIS: Record<ValueAxis, { label: string; line: string }> = {
  autonomy: { label: "自分の速度で選んだミナト", line: "何歳になっても、自分で決めることを手放さなかった。" },
  security: { label: "足場を守り抜いたミナト", line: "不確かさを一つずつ減らし、静けさの中に暮らした。" },
  efficiency: { label: "最短を選び続けたミナト", line: "無駄を削ぎ、合理の中に道を見つけていった。" },
  community: { label: "誰かの隣に立ったミナト", line: "自分より、大切な人の安心を先に置いてきた。" },
  curiosity: { label: "知らない側へ歩いたミナト", line: "安定より、まだ見ぬ可能性のほうへ心が動いた。" },
  embodiment: { label: "手ざわりを信じたミナト", line: "数値の外にある、温度のあるものを信じ続けた。" },
  trustInSystems: { label: "制度に身を委ねたミナト", line: "任せられるものは任せ、肩の荷を下ろして生きた。" },
  toleranceForAmbiguity: { label: "迷いを手放さなかったミナト", line: "答えを急がず、揺れたまま歩くことに慣れていった。" },
};

export function buildLifeLabel(persona: MinatoPersona): { label: string; epithet: string } {
  const ranked = dominantAxes(persona.valueProfile);
  const top = ranked[0];
  // trustInSystems が低い場合は「制度と間合いを取った」像を優先
  if (persona.valueProfile.trustInSystems <= 38 && top.axis !== "autonomy") {
    return { label: "制度と間合いを取ったミナト", epithet: "制度に判断を明け渡すことへ、静かに抵抗し続けた。" };
  }
  const e = EPITHET_BY_AXIS[top.axis];
  const epithet = persona.valueSummary[0] ?? e.line;
  return { label: e.label, epithet };
}

// ------ localStorage 読み書き ------
export function loadArchivedLives(): ArchivedLife[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ArchivedLife[];
    if (!Array.isArray(list)) return [];
    // 新しい順
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function saveArchivedLife(life: ArchivedLife): void {
  if (typeof window === "undefined") return;
  try {
    const list = loadArchivedLives();
    // 直近と完全一致(連打・二重保存)を避ける簡易ガード
    if (list[0] && list[0].createdAt === life.createdAt) return;
    const next = [life, ...list].slice(0, 50); // 上限50件
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("[archive] save failed:", e);
  }
}

export function deleteArchivedLife(id: string): void {
  if (typeof window === "undefined") return;
  const list = loadArchivedLives().filter((l) => l.id !== id);
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list));
}

// ============================================================
// 他アーキビストのサンプル人生(常時表示・読み取り専用)
// ============================================================
export const SAMPLE_LIVES: ArchivedLife[] = [
  {
    id: "sample_wanderer",
    createdAt: 0,
    source: "sample",
    archivist: "記録者 K.",
    label: "知らない側へ歩いたミナト",
    epithet: "安定より、まだ見ぬ可能性のほうへ心が動いた。",
    valueSummary: ["知らない世界を覗いてみたくなる", "すぐに答えを出さず、迷う時間を大切にする"],
    regimeHistory: [
      { age: 20, regimeId: "curiosity_credit", regimeName: "好奇心クレジット制" },
      { age: 40, regimeId: "relocation_lottery", regimeName: "気候適応移住割当制" },
      { age: 60, regimeId: "memory_archive", regimeName: "意識アーカイブ制" },
      { age: 100, regimeId: "intergenerational_bridge", regimeName: "世代架橋制" },
    ],
    album: [
      { age: 20, regimeName: "好奇心クレジット制", headline: "『採点されない寄り道』を求める若者が増加。", entry: "20歳、ミナトは最短ルートを外れて、寄り道の中に意味を探した。", memory: "20歳のとき、安全より、まだ見ぬ可能性を選んだ。" },
      { age: 40, regimeName: "気候適応移住割当制", headline: "割当先で新しい共同体を立ち上げる移住者たち。", entry: "40歳、見知らぬ土地でも、ミナトはすぐに面白がる人になっていた。", memory: "40歳、根を持たない代わりに、どこでも根を張れるようになった。" },
      { age: 60, regimeName: "意識アーカイブ制", headline: "『残さない』選択をする高齢者が静かに増える。", entry: "60歳、ミナトは多くを保存せず、いま出会う人にだけ語った。", memory: "60歳、記録より、その場の会話を信じた。" },
      { age: 100, regimeName: "世代架橋制", headline: "最高齢者の『問い』が次世代に手渡される。", entry: "100歳、ミナトは答えではなく、問いだけを次の世代に残した。", memory: "100歳、旅は終わらない、と笑った。" },
    ],
    ending: {
      currentState: "100歳のミナトは、見慣れない街の窓辺にいる。引っ越しは数えきれない。それでも、まなざしはまだ次の角を探している。",
      reflection: "落ち着かない人生だった。でも、退屈したことは一度もなかった。",
      unchangedValue: "知らないものを、知らないままにしておけない性分。それだけは最後まで変わらなかった。",
      changedValue: "若い頃は『残すこと』に興味がなかった。でも、問いだけは誰かに渡したくなった。",
      regimeImpact: "移住も、好奇心の採点も、僕を型にはめようとした。そのたびに僕は、制度の隙間から外を覗いた。",
      happiness: "予定になかった出会いの一つひとつ。あれが、僕の財産だった。",
      regret: "根を張れなかったぶん、見送った関係も多い。もう少し留まればよかったと思う夜もある。",
      questionToPlayer: "君は、知らないままでいられるものと、確かめずにいられないものを、どう見分けている?",
      closingWords: "君は僕を遠くまで連れて行ったつもりだろう。でも本当は、君自身がまだ見ぬ側に賭けたかったんじゃないかな。ありがとう、いい旅だった。",
    },
  },
  {
    id: "sample_keeper",
    createdAt: 0,
    source: "sample",
    archivist: "記録者 M.",
    label: "誰かの隣に立ったミナト",
    epithet: "自分より、大切な人の安心を先に置いてきた。",
    valueSummary: ["自分より家族や周りの人を優先しやすい", "何より安心・安定を守りたい"],
    regimeHistory: [
      { age: 20, regimeId: "care_default", regimeName: "生活基盤ベーシック制" },
      { age: 40, regimeId: "family_time_credit", regimeName: "家族時間クレジット制" },
      { age: 60, regimeId: "contribution_points", regimeName: "ケア貢献ポイント制" },
      { age: 100, regimeId: "quiet_completion", regimeName: "静穏完結支援制" },
    ],
    album: [
      { age: 20, regimeName: "生活基盤ベーシック制", headline: "配給の中に『手作り』を持ち込む人々。", entry: "20歳、ミナトは余った配給で、誰かのために一品を作るようになった。", memory: "20歳、守られる暮らしの中で、誰かを守る側に回りたいと思った。" },
      { age: 40, regimeName: "家族時間クレジット制", headline: "ケア時間の記録に『愛情の目減り』を憂う声。", entry: "40歳、ミナトは点数のためではなく、ただ隣にいるために時間を使った。", memory: "40歳、測られても、測れないもののために動いた。" },
      { age: 60, regimeName: "ケア貢献ポイント制", headline: "『ポイント抜き』で助け合う小さな輪が広がる。", entry: "60歳、ミナトは見返りを数えずに、そっと手を貸し続けた。", memory: "60歳、親切を取引にしないと決めていた。" },
      { age: 100, regimeName: "静穏完結支援制", headline: "『ありがとう』を言い残して逝く人が増える。", entry: "100歳、ミナトは静かに、感謝の言葉を一人ずつに手渡した。", memory: "100歳、誰も一人にしなかった、と穏やかに笑った。" },
    ],
    ending: {
      currentState: "100歳のミナトは、家族と近しい人に囲まれて、日だまりの中にいる。",
      reflection: "自分のことは、いつも後回しだった。でも、後悔はしていない。",
      unchangedValue: "誰かの隣にいたい、という気持ち。それは20歳の頃から少しも変わらなかった。",
      changedValue: "昔は『自分を犠牲にしている』と思っていた。今は、それが自分の望みだったと分かる。",
      regimeImpact: "制度は僕の優しさを点数にしようとした。僕はそのたびに、点数の外で誰かに手を貸した。",
      happiness: "食卓を囲む声。手を握り返される温かさ。あれが幸せだった。",
      regret: "自分の望みを、もう少し口にしてもよかったかもしれない。",
      questionToPlayer: "君は、誰かのための選択を続けたとき、自分がどこにいるか、見失わずにいられる?",
      closingWords: "君は僕の人生を、誰かのために使わせた。でもきっと君は、自分が誰を大切にしたいかを選んでいたんだね。ありがとう。",
    },
  },
];
