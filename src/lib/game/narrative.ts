// ============================================================
// Fixed narrative content (opening, system, transitions)
// ============================================================
import type { SceneLine } from "./types";

export const MINATO_OPENING: SceneLine[] = [
  { speaker: "MINATO", text: "──録画スタート。" },
  {
    speaker: "MINATO",
    text: "あ、繋がった！\nはじめまして。2046年からアクセスしています。\n20歳のミナトです。",
  },
  {
    speaker: "MINATO",
    text: "まさか、20年前の人にメッセージを送れるサービスがあるなんて、\n正直、まだ半信半疑なんですけど……届いてますか？",
  },
  {
    speaker: "MINATO",
    text: "僕の人生は、たぶん失敗していません。\nでも、失敗していない人生が、\nこんなに不安になるなんて思いませんでした。",
  },
  {
    speaker: "MINATO",
    text: "実は、僕らの時代では、\nAIが「最適な人生」をほとんど決めてくれます。\n進路も、仕事も、住む場所も、\n誰と関係を結ぶべきかさえ、\n失敗しないように提案してくれる。",
  },
  {
    speaker: "MINATO",
    text: "僕もその通りに生きてきました。\n大きな失敗はありませんでした。\n……でも最近、すごくモヤモヤするんです。",
  },
  {
    speaker: "MINATO",
    text: "間違えてはいない。\nでも、自分で選んだ気がしない。\nレールを歩いているだけなんじゃないかって。",
  },
  {
    speaker: "MINATO",
    text: "だから、まだ「人間が不合理に選ぶ余地」が残っていた時代のあなたに、\n初めてこのサービスを使ってSOSを送ってみました。",
  },
  {
    speaker: "MINATO",
    text: "あなたへのお願いです。\n今、あなたがいる時代から、\nどんな言葉を僕に残してくれますか。\nこれからの80年間、僕は必ずそれを受け取ります。",
  },
  {
    speaker: "MINATO",
    text: "初めての挑戦が、\n画面の向こうのあなたに届きますように。\n……待っています。",
  },
  { speaker: "MINATO", text: "──録画、終了。" },
];

export const BOOT_LINES = [
  "CONNECTING TO LIFE ARCHIVE...",
  "RECONSTRUCTING POSSIBLE LIFE PATHS...",
  "ACCESSING ENVIRONMENTAL VARIABLES...",
  "CALIBRATING VALUE COHERENCE ENGINE...",
  "OPENING SIMULATION LAYER...",
];

export const SYSTEM_EXPLANATION: SceneLine[] = [
  {
    speaker: "SYSTEM",
    text: "FUTURE SIMULATORへようこそ。",
  },
  {
    speaker: "SYSTEM",
    text: "あなたはこれから、\nミナトの人生に直接介入するのではなく、\n彼が選び直すための「言葉」を渡します。\n正しい答えではなく、問いを。\n助言ではなく、違和感を。",
  },
  {
    speaker: "SYSTEM",
    text: "各ステージでは、\nミナトが直面している状況と葛藤が届きます。\nあなたが書いた言葉は、\nミナトの価値観として蓄積されます。",
  },
  {
    speaker: "SYSTEM",
    text: "重要なのは、ミナトがあなたの言葉を\n素直に受け入れるとは限らないことです。\n誤解する。拒否する。時間をかけて変容する。\nそれが、人生の普通のことです。",
  },
  {
    speaker: "SYSTEM",
    text: "過去に渡した言葉が、\n時間を経て別の意味を持って返ってくる。\nそれが、このシミュレーションの中心にある体験です。",
  },
  {
    speaker: "SYSTEM",
    text: "それでは、シミュレーションを開始します。\nAge 20のミナトへ接続します。",
  },
];

export const AGE_TRANSITION_MESSAGES: Record<number, SceneLine[]> = {
  20: [
    {
      speaker: "SYSTEM",
      text: "Age 20。\n2046年。\nミナトは今日、20歳になりました。",
    },
    {
      speaker: "SYSTEM",
      text: "AIによる進路推薦が届いています。\nこれから80年間が、どんな形で始まるか。\nミナトはまだ知りません。",
    },
    {
      speaker: "SYSTEM",
      text: "ミナトから、あなたへのメッセージが届きました。\n彼の声を聞いてください。",
    },
  ],
  25: [
    {
      speaker: "SYSTEM",
      text: "Age 25。\n2051年。\nあなたが残した言葉を持ったまま、\nミナトは五年を過ごしました。",
    },
    {
      speaker: "SYSTEM",
      text: "社会では、気候移住の第一波が始まっています。\n住む場所を選ぶことと、\n自分を選ぶことが、区別しにくくなってきた時代です。",
    },
  ],
  40: [
    {
      speaker: "SYSTEM",
      text: "Age 40。\n2066年。\n空白の10年を経て、ミナトは中年期を迎えました。",
    },
    {
      speaker: "SYSTEM",
      text: "食・移動・エネルギーが統合プラットフォームに収束しています。\n効率は極まり、しかしその代償として、\n「不便さの中にあった自由」が静かに消えつつあります。",
    },
  ],
  45: [
    {
      speaker: "SYSTEM",
      text: "Age 45。\n2071年。\nミナトは、静かに変わっています。",
    },
    {
      speaker: "SYSTEM",
      text: "身体拡張技術の格差が表面化し、\n所有から使用権への移行が加速しています。\n「自分のもの」という感覚が、\n制度的に再定義されつつあります。",
    },
  ],
  60: [
    {
      speaker: "SYSTEM",
      text: "Age 60。\n2086年。\nミナトは人生の後半を歩んでいます。",
    },
    {
      speaker: "SYSTEM",
      text: "意識転送技術の初期実験が始まり、\n「人間であること」の定義が揺れています。\n老いと向き合うことと、\n技術で老いを超えることの間で、\n社会は新たな分断を経験しています。",
    },
  ],
  65: [
    {
      speaker: "SYSTEM",
      text: "Age 65。\n2091年。\n定年という概念が消えた時代。",
    },
    {
      speaker: "SYSTEM",
      text: "長寿社会において、65歳は「まだ途中」です。\nしかしミナトの中で、\n何かが確かに変わり始めています。",
    },
  ],
  80: [
    {
      speaker: "SYSTEM",
      text: "Age 80。\n2106年。\nミナトは、長い旅路の終盤にいます。",
    },
    {
      speaker: "SYSTEM",
      text: "世界は、ミナトが20歳のときには想像もできなかった姿になっています。\nしかし人間の根本的な問いは、変わっていません。\nあなたが最初に渡した言葉は、まだここにあります。",
    },
  ],
  90: [
    {
      speaker: "SYSTEM",
      text: "Age 90。\n2116年。",
    },
    {
      speaker: "SYSTEM",
      text: "ミナトはここまで来ました。\nあなたが20歳に残した言葉が、\n今のミナトの中にどんな形で残っているか。\n最後の状況を聞いてください。",
    },
  ],
};

export const GAP_STORY_INTROS: Record<string, { title: string; subtitle: string }> = {
  "30-40": {
    title: "空白の10年 — 30歳から40歳",
    subtitle: "2056年〜2066年。ミナトが青年期を終え、中年期へと歩んだ時代。",
  },
  "50-60": {
    title: "空白の10年 — 50歳から60歳",
    subtitle: "2076年〜2086年。ミナトが社会の中心から、静かに距離を取り始めた時代。",
  },
  "70-80": {
    title: "空白の10年 — 70歳から80歳",
    subtitle: "2096年〜2106年。ミナトが老いと和解し、次の世代に何を渡すかを考えた時代。",
  },
};
