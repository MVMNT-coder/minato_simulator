// ============================================================
// 価値観クイズ — MBTI風・選択式。制度別の設問 + 一般設問。
// 選んだ世界/制度に関係する問いを先頭に置き、共通の切り口を続ける。
// ============================================================
import type {
  LifeAge,
  ValueAxis,
  ValueQuizAnswer,
  ValueQuizQuestion,
} from "./types";
import { AXIS_LABEL } from "./persona";

// ---- 一般設問(どの世界でも問える切り口)。年代ごとに別の3問を割り当て、被りを防ぐ ----
const GENERAL: ValueQuizQuestion[] = [
  // 20歳分
  {
    id: "g_decide", angle: "決め方", prompt: "大きな決断をするとき、きみは？",
    options: [
      { label: "自分でとことん考えて決める", axes: { autonomy: 3, toleranceForAmbiguity: 1 } },
      { label: "信頼できる仕組みや助言にまかせる", axes: { trustInSystems: 3, security: 1 } },
      { label: "まず動いてみて、試しながら決める", axes: { curiosity: 2, embodiment: 2 } },
    ],
  },
  {
    id: "g_unsure", angle: "迷い", prompt: "答えの出ないモヤモヤを抱えたら？",
    options: [
      { label: "じっくり抱えて考え続ける", axes: { toleranceForAmbiguity: 3, autonomy: 1 } },
      { label: "早くスッキリ決めちゃう", axes: { efficiency: 2, security: 2 } },
      { label: "誰かに話して整理する", axes: { community: 3 } },
    ],
  },
  {
    id: "g_new", angle: "変化", prompt: "知らない環境に飛び込むとき、心は？",
    options: [
      { label: "わくわくする！行ってみたい", axes: { curiosity: 3, security: -1 } },
      { label: "ちょっと不安、慎重にいきたい", axes: { security: 3, curiosity: -1 } },
    ],
  },
  // 40歳分
  {
    id: "g_others", angle: "人との関係", prompt: "自分の予定と、大切な人の都合がぶつかったら？",
    options: [
      { label: "自分のやりたいことを優先する", axes: { autonomy: 3, community: -1 } },
      { label: "大切な人を優先する", axes: { community: 3, autonomy: -1 } },
    ],
  },
  {
    id: "g_judge", angle: "判断材料", prompt: "何かを見極めるとき、信じるのは？",
    options: [
      { label: "自分の手ざわり・肌感覚", axes: { embodiment: 3, trustInSystems: -1 } },
      { label: "データやスコアなどの数字", axes: { efficiency: 1, trustInSystems: 2 } },
    ],
  },
  {
    id: "g_time", angle: "時間", prompt: "時間の使い方、どっちが好き？",
    options: [
      { label: "寄り道や余白を大事にする", axes: { curiosity: 2, embodiment: 1, efficiency: -1 } },
      { label: "テキパキ最短で片づける", axes: { efficiency: 3, security: 1 } },
    ],
  },
  // 60歳分
  {
    id: "g_help", angle: "手助け", prompt: "困っている人が目の前にいたら？",
    options: [
      { label: "手を止めて、まず助ける", axes: { community: 3 } },
      { label: "まず自分のことを片づける", axes: { autonomy: 2, efficiency: 1 } },
    ],
  },
  {
    id: "g_learn", angle: "学び", prompt: "新しいことを覚える機会が来たら？",
    options: [
      { label: "面白そうなら、すぐ学ぶ", axes: { curiosity: 3 } },
      { label: "必要になってからでいい", axes: { security: 1, efficiency: 2 } },
    ],
  },
  {
    id: "g_roots", angle: "居場所", prompt: "暮らす場所について、どっち？",
    options: [
      { label: "慣れた土地に根を張りたい", axes: { embodiment: 2, security: 1 } },
      { label: "新しい土地へ移ってみたい", axes: { curiosity: 2, autonomy: 1 } },
    ],
  },
  // 100歳分
  {
    id: "g_leave", angle: "残すもの", prompt: "いつか誰かに残すなら？",
    options: [
      { label: "答えより“問い”を残したい", axes: { curiosity: 2, toleranceForAmbiguity: 1 } },
      { label: "安心できる“居場所”を残したい", axes: { community: 2, security: 1 } },
    ],
  },
  {
    id: "g_alone", angle: "充電", prompt: "元気を取り戻すのは、どんな時間？",
    options: [
      { label: "ひとりで過ごす時間", axes: { autonomy: 2, embodiment: 1 } },
      { label: "誰かと過ごす時間", axes: { community: 2 } },
    ],
  },
  {
    id: "g_meaning", angle: "しあわせ", prompt: "きみにとって“しあわせ”に近いのは？",
    options: [
      { label: "手触りのある、小さな喜び", axes: { embodiment: 2, toleranceForAmbiguity: 1 } },
      { label: "目標をやりきる達成感", axes: { efficiency: 2, security: 1 } },
    ],
  },
];

// ---- 制度別設問(選んだ世界に直結) ----
const REGIME_QUESTIONS: Record<string, ValueQuizQuestion[]> = {
  // 20歳
  life_path_guarantee: [
    {
      id: "lpg_1", angle: "AI人生経路保障制度", prompt: "AIが“最適な進路”を保証してくれる。どうする？",
      options: [
        { label: "保証に乗る。安心が一番", axes: { security: 2, trustInSystems: 2 } },
        { label: "参考にはするけど、道は自分で選ぶ", axes: { autonomy: 3, trustInSystems: -1 } },
      ],
    },
    {
      id: "lpg_2", angle: "AI人生経路保障制度", prompt: "考えている間にも“選べる進路”が減っていく。",
      options: [
        { label: "急いで決めてしまう", axes: { efficiency: 2, security: 1 } },
        { label: "締切と交渉してでも、納得して決めたい", axes: { toleranceForAmbiguity: 2, autonomy: 1 } },
      ],
    },
  ],
  curiosity_credit: [
    {
      id: "cc_1", angle: "好奇心クレジット制", prompt: "寄り道や挑戦に“点”がつく社会。どう動く？",
      options: [
        { label: "点になるように、いろいろ試す", axes: { curiosity: 2, efficiency: 1 } },
        { label: "点にならなくても、好きに寄り道する", axes: { curiosity: 2, autonomy: 2, efficiency: -1 } },
      ],
    },
    {
      id: "cc_2", angle: "好奇心クレジット制", prompt: "「何のための経験？」と説明を求められたら？",
      options: [
        { label: "意味を説明できる経験を選ぶ", axes: { efficiency: 1, security: 1 } },
        { label: "意味がなくても、心が動く方へ", axes: { embodiment: 2, toleranceForAmbiguity: 1 } },
      ],
    },
  ],
  care_default: [
    {
      id: "cd_1", angle: "生活基盤ベーシック制", prompt: "衣食住が無条件で配られる暮らし。どう受け取る？",
      options: [
        { label: "ありがたく受け取る。安心が第一", axes: { security: 2, trustInSystems: 2 } },
        { label: "選べないのは、ちょっと物足りない", axes: { autonomy: 2, embodiment: 1 } },
      ],
    },
    {
      id: "cd_2", angle: "生活基盤ベーシック制", prompt: "働かなくても生きられる。時間を何に使う？",
      options: [
        { label: "誰かのため、つながりに使う", axes: { community: 3 } },
        { label: "好きなこと・未知の探究に使う", axes: { curiosity: 2, autonomy: 1 } },
      ],
    },
  ],
  // 40歳
  family_time_credit: [
    {
      id: "ftc_1", angle: "家族時間クレジット制", prompt: "家族と過ごす時間が“信用スコア”になる。",
      options: [
        { label: "家族を優先。評価もされて一石二鳥", axes: { community: 2, trustInSystems: 1 } },
        { label: "点のためじゃない。自分の時間も守る", axes: { autonomy: 2, community: -1 } },
      ],
    },
    {
      id: "ftc_2", angle: "家族時間クレジット制", prompt: "愛情が“実績”として測られることを？",
      options: [
        { label: "可視化されて助かる", axes: { trustInSystems: 2, efficiency: 1 } },
        { label: "測られたくない。手ざわりで感じたい", axes: { embodiment: 2, toleranceForAmbiguity: 1 } },
      ],
    },
  ],
  cognitive_augment: [
    {
      id: "ca_1", angle: "認知拡張インプラント制", prompt: "AIが判断ミスを防いでくれる拡張。入れる？",
      options: [
        { label: "入れる。ミスが減るなら", axes: { trustInSystems: 2, efficiency: 2 } },
        { label: "入れない。自分の頭で決めたい", axes: { autonomy: 3, embodiment: 1 } },
      ],
    },
    {
      id: "ca_2", angle: "認知拡張インプラント制", prompt: "本人の直感よりAIが優先される場面。",
      options: [
        { label: "合理的なら、従う", axes: { efficiency: 2, trustInSystems: 1 } },
        { label: "直感も信じたい", axes: { embodiment: 2, autonomy: 1 } },
      ],
    },
  ],
  relocation_lottery: [
    {
      id: "rl_1", angle: "気候適応移住割当制", prompt: "安全な土地へ、住まいが割り当てられる。",
      options: [
        { label: "安全なら従う", axes: { security: 2, trustInSystems: 1 } },
        { label: "住む場所は自分で選びたい", axes: { autonomy: 2, embodiment: 1 } },
      ],
    },
    {
      id: "rl_2", angle: "気候適応移住割当制", prompt: "思い出の場所を離れることになったら？",
      options: [
        { label: "割り切って、前へ進む", axes: { efficiency: 1, security: 1 } },
        { label: "できれば手放したくない", axes: { embodiment: 2, community: 1 } },
      ],
    },
  ],
  // 60歳
  relearning_mandate: [
    {
      id: "rm_1", angle: "生涯学び直し制", prompt: "高齢でも学び続けるのが“社会参加”の条件。",
      options: [
        { label: "どんどん学ぶ。いい刺激になる", axes: { curiosity: 2, community: 1 } },
        { label: "学ばない自由も、あっていい", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ],
    },
    {
      id: "rm_2", angle: "生涯学び直し制", prompt: "“学ばない人”が参加不足と見なされる。",
      options: [
        { label: "参加のため、まわりに合わせる", axes: { community: 1, security: 1 } },
        { label: "休みたい時は、休む", axes: { autonomy: 2, embodiment: 1 } },
      ],
    },
  ],
  memory_archive: [
    {
      id: "ma_1", angle: "意識アーカイブ制", prompt: "記憶や人格を、死後も遺せる。",
      options: [
        { label: "遺したい。知恵を継ぎたい", axes: { community: 2, trustInSystems: 1 } },
        { label: "遺さない。今を生きたい", axes: { embodiment: 2, autonomy: 1 } },
      ],
    },
    {
      id: "ma_2", angle: "意識アーカイブ制", prompt: "何を残し、何を消すかを生前に決める。",
      options: [
        { label: "きちんと選んで残す", axes: { efficiency: 1, security: 1 } },
        { label: "選びきれない。曖昧なままでいい", axes: { toleranceForAmbiguity: 2, curiosity: 1 } },
      ],
    },
  ],
  contribution_points: [
    {
      id: "cp_1", angle: "ケア貢献ポイント制", prompt: "助けた分がポイントで返ってくる。",
      options: [
        { label: "仕組みとして助け合えるのはいい", axes: { community: 1, trustInSystems: 2 } },
        { label: "見返り抜きで、手を貸したい", axes: { community: 2, autonomy: 1 } },
      ],
    },
    {
      id: "cp_2", angle: "ケア貢献ポイント制", prompt: "親切が“取引”に見えてきたら？",
      options: [
        { label: "効率よく回れば、それでいい", axes: { efficiency: 2 } },
        { label: "それでも、気持ちで動きたい", axes: { embodiment: 2, community: 1 } },
      ],
    },
  ],
  // 100歳
  quiet_completion: [
    {
      id: "qc_1", angle: "静穏完結支援制", prompt: "穏やかに人生を終う支援がある。",
      options: [
        { label: "もう十分。静かに受け入れる", axes: { security: 1, toleranceForAmbiguity: 1 } },
        { label: "まだ何か、残っている気がする", axes: { curiosity: 2, autonomy: 1 } },
      ],
    },
    {
      id: "qc_2", angle: "静穏完結支援制", prompt: "最期に、何を語りたい？",
      options: [
        { label: "感謝を、身近な人へ", axes: { community: 2, embodiment: 1 } },
        { label: "問いを、次の世代へ", axes: { curiosity: 2, toleranceForAmbiguity: 1 } },
      ],
    },
  ],
  intergenerational_bridge: [
    {
      id: "ib_1", angle: "世代架橋制", prompt: "最高齢者の声が、未来へ橋渡しされる。",
      options: [
        { label: "積極的に伝えたい", axes: { community: 2, curiosity: 1 } },
        { label: "そっとしておいてほしい", axes: { autonomy: 2, embodiment: 1 } },
      ],
    },
    {
      id: "ib_2", angle: "世代架橋制", prompt: "“賢い長老”であることを期待される。",
      options: [
        { label: "役割に、応えたい", axes: { community: 1, trustInSystems: 1 } },
        { label: "期待より、自分のままでいたい", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ],
    },
  ],
};

// 追加制度(各年代6つ)ぶんの設問
const EXTRA_REGIME_QUESTIONS: Record<string, ValueQuizQuestion[]> = {
  // 20歳
  emotion_assist: [
    { id: "ea_1", angle: "感情最適化アシスト制", prompt: "AIが気分を整えて、不調を防いでくれる。",
      options: [
        { label: "助かる。安定していたい", axes: { security: 2, trustInSystems: 2 } },
        { label: "揺れる気持ちも、自分のものにしたい", axes: { embodiment: 2, autonomy: 2 } },
      ] },
    { id: "ea_2", angle: "感情最適化アシスト制", prompt: "落ち込みも“補正”される社会。",
      options: [
        { label: "つらさが減るなら、それでいい", axes: { efficiency: 1, security: 1 } },
        { label: "落ち込む時間にも、意味があると思う", axes: { toleranceForAmbiguity: 2, embodiment: 1 } },
      ] },
  ],
  skill_share: [
    { id: "ss_1", angle: "スキル共有ネット制", prompt: "他人の技能を、その場で借りられる。",
      options: [
        { label: "どんどん借りて、いろいろ挑戦する", axes: { curiosity: 2, efficiency: 1 } },
        { label: "自分で身につけたい", axes: { autonomy: 2, embodiment: 2 } },
      ] },
    { id: "ss_2", angle: "スキル共有ネット制", prompt: "学ばなくても、多くのことができる。",
      options: [
        { label: "近道できるのはうれしい", axes: { efficiency: 2, security: 1 } },
        { label: "身につける手応えが欲しい", axes: { embodiment: 2, autonomy: 1 } },
      ] },
  ],
  reputation_open: [
    { id: "ro_1", angle: "評価透明化制", prompt: "行動がぜんぶ信頼スコアになる社会。",
      options: [
        { label: "信頼が見えるのは安心", axes: { trustInSystems: 2, security: 1 } },
        { label: "いつも見られるのは窮屈", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ] },
    { id: "ro_2", angle: "評価透明化制", prompt: "失敗も、みんなに見えてしまう。",
      options: [
        { label: "見られてる方が、きちんとやれる", axes: { trustInSystems: 1, efficiency: 1 } },
        { label: "こっそり失敗できる余地も欲しい", axes: { autonomy: 2, embodiment: 1 } },
      ] },
  ],
  // 40歳
  four_day_week: [
    { id: "fdw_1", angle: "週休4日標準制", prompt: "週4日労働が当たり前。余暇も記録される。",
      options: [
        { label: "余暇も充実させたい", axes: { community: 1, curiosity: 2 } },
        { label: "理由なく、ただ休みたい", axes: { autonomy: 2, embodiment: 1 } },
      ] },
    { id: "fdw_2", angle: "週休4日標準制", prompt: "“有意義な休み方”が評価される。",
      options: [
        { label: "せっかくなら意味あることを", axes: { efficiency: 1, community: 1 } },
        { label: "ぼーっとする時間も大事", axes: { toleranceForAmbiguity: 2, embodiment: 1 } },
      ] },
  ],
  auto_wealth: [
    { id: "aw_1", angle: "資産自動運用制", prompt: "お金のことはAIが全部やってくれる。",
      options: [
        { label: "まかせて安心したい", axes: { trustInSystems: 2, security: 2 } },
        { label: "自分で選んで動かしたい", axes: { autonomy: 3 } },
      ] },
    { id: "aw_2", angle: "資産自動運用制", prompt: "将来のお金の不安が、ほぼ消えた。",
      options: [
        { label: "身軽で最高", axes: { security: 2, efficiency: 1 } },
        { label: "選ぶ実感がないと物足りない", axes: { autonomy: 2, embodiment: 1 } },
      ] },
  ],
  health_score: [
    { id: "hs_1", angle: "健康スコア連動制", prompt: "生活習慣がスコアになり、支援に響く。",
      options: [
        { label: "健康になれるなら従う", axes: { security: 2, trustInSystems: 1 } },
        { label: "食べたい時に食べたい", axes: { autonomy: 2, embodiment: 2 } },
      ] },
    { id: "hs_2", angle: "健康スコア連動制", prompt: "体まで“管理される対象”になる。",
      options: [
        { label: "管理された方が続く", axes: { efficiency: 2, trustInSystems: 1 } },
        { label: "自分の体は自分で決めたい", axes: { autonomy: 2, embodiment: 1 } },
      ] },
  ],
  // 60歳
  second_career: [
    { id: "sc_1", angle: "セカンドキャリア割当制", prompt: "高齢期の新しい仕事を紹介される。",
      options: [
        { label: "働き続けたい。生きがいになる", axes: { community: 2, curiosity: 1 } },
        { label: "そろそろ、ゆっくり休みたい", axes: { autonomy: 2, embodiment: 1 } },
      ] },
    { id: "sc_2", angle: "セカンドキャリア割当制", prompt: "“引退して休む”が選びにくい空気。",
      options: [
        { label: "まわりに合わせて動く", axes: { community: 1, security: 1 } },
        { label: "自分のペースで休む", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ] },
  ],
  digital_twin: [
    { id: "dt_1", angle: "デジタル分身制", prompt: "自分の分身AIが、用事を代行してくれる。",
      options: [
        { label: "任せて活動を広げたい", axes: { efficiency: 2, curiosity: 1 } },
        { label: "自分の足で会いに行きたい", axes: { embodiment: 2, community: 1 } },
      ] },
    { id: "dt_2", angle: "デジタル分身制", prompt: "どこまでが本人か、曖昧になってくる。",
      options: [
        { label: "便利なら気にしない", axes: { trustInSystems: 2, efficiency: 1 } },
        { label: "本人として、直接いたい", axes: { embodiment: 2, autonomy: 1 } },
      ] },
  ],
  multigen_home: [
    { id: "mh_1", angle: "多世代同居支援制", prompt: "世代を超えた同居を、制度が後押し。",
      options: [
        { label: "賑やかに支え合いたい", axes: { community: 3 } },
        { label: "ひとりの時間も守りたい", axes: { autonomy: 2, embodiment: 1 } },
      ] },
    { id: "mh_2", angle: "多世代同居支援制", prompt: "距離感が近くなりすぎることも。",
      options: [
        { label: "近い方が安心", axes: { community: 1, security: 2 } },
        { label: "ほどよい距離がいい", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ] },
  ],
  // 100歳
  memory_bequest: [
    { id: "mb_1", angle: "記憶継承制", prompt: "記憶や技能を、望む人へ受け継げる。",
      options: [
        { label: "遺したい。次の誰かへ", axes: { community: 2, curiosity: 1 } },
        { label: "自分の中に、そっとしまう", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
      ] },
    { id: "mb_2", angle: "記憶継承制", prompt: "何を、誰に遺すかを選ぶ。",
      options: [
        { label: "きちんと選んで託す", axes: { efficiency: 1, community: 1 } },
        { label: "選びきれないまま、でいい", axes: { toleranceForAmbiguity: 2 } },
      ] },
  ],
  final_dialogue: [
    { id: "fd_1", angle: "終の対話AI制", prompt: "最期に、人生を語り尽くせる。",
      options: [
        { label: "言い残さず、伝えたい", axes: { community: 2, toleranceForAmbiguity: 1 } },
        { label: "言葉より、そばにいたい", axes: { embodiment: 2, autonomy: 1 } },
      ] },
    { id: "fd_2", angle: "終の対話AI制", prompt: "語るほど、語り切れないものに気づく。",
      options: [
        { label: "それでも、言葉に残したい", axes: { community: 1, curiosity: 1 } },
        { label: "こぼれ落ちるものも、それでいい", axes: { toleranceForAmbiguity: 2, embodiment: 1 } },
      ] },
  ],
  quiet_exit: [
    { id: "qe_1", angle: "静かな退場制", prompt: "望めば、そっと去ることを選べる。",
      options: [
        { label: "静かに、自分らしく去りたい", axes: { autonomy: 2, toleranceForAmbiguity: 1 } },
        { label: "見送られて、去りたい", axes: { community: 2, embodiment: 1 } },
      ] },
    { id: "qe_2", angle: "静かな退場制", prompt: "“誰にも気づかれず”の奥にある気持ち。",
      options: [
        { label: "それでいい。潔く", axes: { autonomy: 2, security: 1 } },
        { label: "少しは、誰かにいてほしい", axes: { community: 2 } },
      ] },
  ],
  entrust_future: [
    { id: "ef_1", angle: "未来託し制", prompt: "声や想いを、未来の誰かへ託せる。",
      options: [
        { label: "希望を、次の世代へ渡したい", axes: { community: 2, curiosity: 1 } },
        { label: "見返りは求めず、そっと託す", axes: { toleranceForAmbiguity: 2, autonomy: 1 } },
      ] },
    { id: "ef_2", angle: "未来託し制", prompt: "会えない相手に託す、不確かさ。",
      options: [
        { label: "届くと信じて託す", axes: { trustInSystems: 1, curiosity: 1 } },
        { label: "確かめられないのは、少し怖い", axes: { security: 2, embodiment: 1 } },
      ] },
  ],
};

// 選んだ制度の設問(先頭) + 年代ごとに“重複しない”一般設問3問
export function getValueQuiz(age: LifeAge, regimeId?: string): ValueQuizQuestion[] {
  if (!regimeId) return GENERAL; // 後方互換(制度未指定時は一般のみ)
  const rq = REGIME_QUESTIONS[regimeId] ?? EXTRA_REGIME_QUESTIONS[regimeId] ?? [];
  const idx = [20, 40, 60, 100].indexOf(age);
  const i = idx >= 0 ? idx : 0;
  const slice = GENERAL.slice(i * 3, i * 3 + 3);
  const generalPick = slice.length ? slice : GENERAL.slice(0, 3);
  return [...rq, ...generalPick];
}

// 回答 → 各軸の増減(raw)へ集計
export function aggregateQuizDeltas(
  quiz: ValueQuizQuestion[],
  answers: ValueQuizAnswer[],
): { axis: ValueAxis; delta: number; reason: string }[] {
  const sums = new Map<ValueAxis, number>();
  for (const a of answers) {
    const q = quiz.find((x) => x.id === a.questionId);
    const opt = q?.options[a.optionIndex];
    if (!opt) continue;
    for (const [axis, w] of Object.entries(opt.axes) as [ValueAxis, number][]) {
      sums.set(axis, (sums.get(axis) ?? 0) + w);
    }
  }
  return [...sums.entries()]
    .filter(([, v]) => v !== 0)
    .map(([axis, delta]) => ({
      axis,
      delta,
      reason: `「${AXIS_LABEL[axis]}」寄りの選択を重ねた`,
    }));
}

// 選んだ選択肢のラベルを連結(narrative/AI用の要約テキスト)
export function summarizeQuizChoices(
  quiz: ValueQuizQuestion[],
  answers: ValueQuizAnswer[],
): string {
  const parts: string[] = [];
  for (const a of answers) {
    const q = quiz.find((x) => x.id === a.questionId);
    const opt = q?.options[a.optionIndex];
    if (opt) parts.push(opt.label);
  }
  return parts.join("。");
}
