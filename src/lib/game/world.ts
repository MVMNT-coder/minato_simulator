// ============================================================
// World Rules — Future Japan 2046–2126
// ============================================================
// Each institution defines: what following gains/costs,
// what deviating gains/costs.

export interface InstitutionRule {
  name: string;
  category: string;
  description: string;
  followBenefit: string;
  followCost: string;
  deviateBenefit: string;
  deviateCost: string;
}

export interface WorldEra {
  ages: number[];
  title: string;
  context: string;
  institutions: InstitutionRule[];
}

export const WORLD_ERAS: WorldEra[] = [
  {
    ages: [20, 25],
    title: "最適化の黎明 (2046–2051)",
    context:
      "AIによる人生設計が社会インフラとなり、進路・職業・居住地の「推薦」が奨学金や住居支援と連動している。気候変動による移住圧力が始まり、若者の選択肢は制度との整合性で測られる。",
    institutions: [
      {
        name: "AIライフデザイン",
        category: "教育・労働",
        description: "AIが適性・家庭環境・社会需要をもとに進路を推薦する制度",
        followBenefit: "奨学金、住居支援、就労接続が自動承認される",
        followCost: "自分で選んだ記憶が薄れ、理由のわからない選択ができなくなる",
        deviateBenefit: "自分の言葉で選択を説明する力が育ち、自律性が高まる",
        deviateCost: "生活支援が一部失われ、経済的不安定が増す",
      },
      {
        name: "気候移住割当制",
        category: "住居・気候",
        description: "洪水・熱波リスク地域からの移住が行政により割り当てられる",
        followBenefit: "安全な居住地と生活インフラが保証される",
        followCost: "故郷・記憶・コミュニティとの断絶",
        deviateBenefit: "場所と記憶のつながりを保持できる",
        deviateCost: "インフラ格差・保険適用外・社会的孤立",
      },
      {
        name: "関係推薦アルゴリズム",
        category: "家族・共同体",
        description: "AIが相性と社会的安定度から交際・同居パートナーを推薦",
        followBenefit: "摩擦の少ない関係と社会的認定",
        followCost: "偶発的な出会いや予測不能な愛着の経験が減る",
        deviateBenefit: "予測不能な関係から深い他者理解が生まれる",
        deviateCost: "制度的サポートが得られにくく、関係維持コストが増す",
      },
    ],
  },
  {
    ages: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    title: "空白期：再編の予兆 (2056–2066)",
    context:
      "プラットフォームが生活全域に浸透し始め、食・移動・エネルギーが統合サブスクに包まれる。ミナトは青年期を終え、社会の中での立ち位置を模索する。",
    institutions: [
      {
        name: "統合生活サブスク",
        category: "食・移動・エネルギー",
        description: "食事・交通・電力・通信が一つのプラットフォームで管理される",
        followBenefit: "生活コスト低減、最適化された消費体験",
        followCost: "行動データの完全な可視化、選択の自由の喪失",
        deviateBenefit: "自律した消費と不透明な自由",
        deviateCost: "割高なコストと社会的非効率のスティグマ",
      },
    ],
  },
  {
    ages: [40, 45],
    title: "再編と分断 (2066–2071)",
    context:
      "プラットフォームが生活全域に浸透し、食・移動・エネルギーが統合サブスクに包まれる。身体拡張技術が一部普及し、肉体的・認知的格差が生まれる。所有の概念が流動化し、住居・道具・情報が「使用権」に移行。",
    institutions: [
      {
        name: "統合生活サブスク",
        category: "食・移動・エネルギー",
        description: "食事・交通・電力・通信が一つのプラットフォームで管理される",
        followBenefit: "生活コスト低減、最適化された消費体験",
        followCost: "行動データの完全な可視化、選択の自由の喪失",
        deviateBenefit: "自律した消費と不透明な自由",
        deviateCost: "割高なコストと社会的非効率のスティグマ",
      },
      {
        name: "身体拡張格差",
        category: "身体・医療",
        description:
          "認知補助・身体補正技術が一部の人のみがアクセスできる状態で普及",
        followBenefit: "生産性・健康寿命・社会参加機会の向上",
        followCost: "技術依存と、拡張なしの自分への疎外感",
        deviateBenefit: "非拡張の感覚・経験・つながりを保持できる",
        deviateCost: "経済的・社会的機会の格差が固定化される",
      },
      {
        name: "使用権経済",
        category: "所有・住居",
        description: "住居・家電・交通手段が所有から使用権に移行",
        followBenefit: "初期コスト低減、柔軟な生活移動",
        followCost: "場所と物への愛着が生まれにくく、根を下ろす感覚が失われる",
        deviateBenefit: "物や場所への固有のつながりを育てられる",
        deviateCost: "割高な維持費と社会的少数派としての不便",
      },
    ],
  },
  {
    ages: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    title: "空白期：転換の静寂 (2076–2086)",
    context:
      "社会参加の形が多様化しつつ、参加できない人の不可視化が進む。ミナトは社会の中心から距離を取り始め、自分の生き方を再考する。",
    institutions: [
      {
        name: "社会参加ログ制度",
        category: "社会参加・老い",
        description: "ボランティア・地域活動・投票が記録され、信用スコアに影響",
        followBenefit: "社会的信頼スコアの向上と機会へのアクセス",
        followCost: "見えない活動、記録されないケア、内面的動機が消える",
        deviateBenefit: "記録されない行動に自分のための価値を置ける",
        deviateCost: "社会的不可視化と機会損失",
      },
    ],
  },
  {
    ages: [60, 65],
    title: "存在の再定義 (2086–2091)",
    context:
      "意識転送技術の初期実験が始まり、「人間であること」の定義が揺れている。長寿化により60代は「まだ途中」であり、老いと技術の間で新たな選択を迫られる。公共空間の再定義が進み、居場所の意味が問い直されている。",
    institutions: [
      {
        name: "意識アーカイブ制度",
        category: "身体・存在",
        description: "記憶と人格の一部をデジタル保存し、後世に伝えることができる制度",
        followBenefit: "自分の経験と知恵を次世代に残せる",
        followCost: "「何を残すか」の選別が、自己の部分的な否定につながる",
        deviateBenefit: "記録されない自分をそのまま受け入れる勇気",
        deviateCost: "死後の不可視化と、遺志の伝達手段の喪失",
      },
      {
        name: "公共空間再定義法",
        category: "公共空間・所有",
        description: "公園・広場・図書館が維持費不足から民間に開放される",
        followBenefit: "サービス水準の向上、清潔で便利な空間",
        followCost: "無目的に居られる場所が消え、存在を正当化し続けなければならない",
        deviateBenefit: "非効率で雑然とした場所に滞在することで偶発性が生まれる",
        deviateCost: "制度的承認なしの活動が不可視化される",
      },
      {
        name: "ケア貢献ポイント制",
        category: "ケア・老い",
        description: "家族・地域ケアをポイント化し、老後の社会保障と連動させる",
        followBenefit: "ケアへの社会的評価と将来の保障",
        followCost: "愛情が計量化され、ケアの動機が変容する",
        deviateBenefit: "無条件の関係性を維持できる",
        deviateCost: "老後の保障が脆弱になる",
      },
    ],
  },
  {
    ages: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    title: "空白期：静かなる継承 (2096–2106)",
    context:
      "超長寿社会において、70代は「次の世代に何を渡すか」が問われる時期。制度的な老後設計と、個人的な記憶の選別が交差する。",
    institutions: [
      {
        name: "世代間ケア分担制",
        category: "家族・ケア",
        description: "親のケア責任が子の社会参加記録と連動して分配される",
        followBenefit: "ケアの社会化と個人の負担軽減",
        followCost: "家族のケアが制度的な義務に転じ、関係の自発性が失われる",
        deviateBenefit: "制度外での親密なケアの実践が可能",
        deviateCost: "経済的・時間的負担が増大する",
      },
    ],
  },
  {
    ages: [80, 90],
    title: "老いと受け渡し (2106–2116)",
    context:
      "超長寿化により80代は「第三の人生」と呼ばれる。ミナトは自分の人生を振り返り、次世代へ何を渡すかが問われる。100歳まで生きることが珍しくない時代、「生きた証」の意味が根本から問い直されている。",
    institutions: [
      {
        name: "長寿ライフプラン再設計制度",
        category: "老い・社会参加",
        description: "80歳時に「最終章設計」の提出が義務付けられる",
        followBenefit: "社会保障の継続と終末期の安定",
        followCost: "老いを「管理すべき課題」として見なす視点の内面化",
        deviateBenefit: "老いを自分の言葉で受け止め直すことができる",
        deviateCost: "制度的サポートが条件付きとなり、将来の不確実性が増す",
      },
      {
        name: "世代間ケア分担制",
        category: "家族・ケア",
        description: "親のケア責任が子の社会参加記録と連動して分配される",
        followBenefit: "ケアの社会化と個人の負担軽減",
        followCost: "家族のケアが制度的な義務に転じ、関係の自発性が失われる",
        deviateBenefit: "制度外での親密なケアの実践が可能",
        deviateCost: "経済的・時間的負担が増大する",
      },
    ],
  },
];

export function getWorldEra(age: number): WorldEra | undefined {
  return WORLD_ERAS.find((era) => era.ages.includes(age));
}

export function getInstitutions(age: number): InstitutionRule[] {
  return getWorldEra(age)?.institutions ?? [];
}

// ============================================================
// Regime Options — player-chosen world conditions per phase
// ============================================================
import type { RegimeOption, SelectedRegimes, Age } from "./types";
import { AGE_PHASES } from "./types";

export interface PhaseRegimeConfig {
  phaseLabel: string;
  socialOptions: RegimeOption[];
  naturalOptions: RegimeOption[];
}

export const PHASE_REGIME_OPTIONS: PhaseRegimeConfig[] = [
  // ── Phase 1: 20-30歳 (2046-2056) ──
  {
    phaseLabel: "20-30",
    socialOptions: [
      {
        id: "p1_social_optimized",
        category: "social",
        name: "最適化社会",
        nameEn: "Optimization Society",
        description: "AI人生設計が完全に社会インフラ化。進路・職業・住居・人間関係まで、アルゴリズムの推薦に従えば安定した生活が保障される。逸脱には経済的・社会的ペナルティが伴う。",
        worldEffect: "社会システムは順応に物質的安定を与える。逸脱した若者は経済的不安定に直面するが、自己決定力は高まる。制度への信頼は高いが個人の主体性は低い。",
      },
      {
        id: "p1_social_fragmented",
        category: "social",
        name: "分散自治",
        nameEn: "Fragmented Autonomy",
        description: "大規模なAIアルゴリズムの偏向スキャンダルにより中央集権的な人生設計への信頼が崩壊。地域ごとに自治クラスターが形成され、若者は根本的な自由を手にするがインフラは不安定。",
        worldEffect: "制度的支援は不安定。若者は自ら人脈を構築し、地域コミュニティと直接交渉する必要がある。経済的不安定性は高いが個人の主体性は大幅に拡大。社会的結束は地域によって大きく異なる。",
      },
      {
        id: "p1_social_dualtrack",
        category: "social",
        name: "二重制度",
        nameEn: "Dual-Track System",
        description: "社会が「誘導トラック」（AI計画型）と「自由トラック」（自己決定型）に分裂。トラック間の移動は可能だが、官僚的摩擦と双方からの社会的偏見を伴う。大半は親が選んだトラックに留まる。",
        worldEffect: "二つの並行する社会システムが共存する。誘導トラックは安定を、自由トラックは自由を提供する。トラック間の移動は可能だが社会的コストが高い。新たな階級分断が生まれている。",
      },
    ],
    naturalOptions: [
      {
        id: "p1_natural_managed",
        category: "natural",
        name: "管理された撤退",
        nameEn: "Managed Retreat",
        description: "気候移住は秩序立っているが容赦ない。30年気候予測に基づき、沿岸部・洪水地域からの行政主導の移住が進む。インフラは「安全区域」に集中。放棄された地域は再野生化区域に。",
        worldEffect: "物理的地理が人生の選択を制約する。安全区域は過密で高コスト。場所の記憶は制度的に断絶される。移住拒否者はインフラ劣化の中で孤立する。",
      },
      {
        id: "p1_natural_crisis",
        category: "natural",
        name: "加速する危機",
        nameEn: "Accelerating Crisis",
        description: "気候の臨界点がモデルの予測より早く到達。台風シーズンは壊滅的。食料サプライチェーンが寸断。緊急措置が恒久化。若者は「危機の日常化」——大災害が生活の背景となる感覚の中で育つ。",
        worldEffect: "資源不足と環境の不安定さがあらゆる決断を左右する。リスク許容度は常に試される。共有された危機を通じてコミュニティの絆は強まるが、長期計画は無意味に感じられる。経済的安定は脆く緊急システムに依存。",
      },
    ],
  },
  // ── Phase 2: 40-50歳 (2066-2076) ──
  {
    phaseLabel: "40-50",
    socialOptions: [
      {
        id: "p2_social_platform",
        category: "social",
        name: "プラットフォーム統治",
        nameEn: "Platform Governance",
        description: "三大メガプラットフォームが食料・住居・エネルギー・医療・社会信用を管理。市民は「国民」ではなく「会員」。民主的プロセスは存在するが形骸化。身体拡張技術はプレミアム会員向け。",
        worldEffect: "プラットフォーム内では生活は摩擦がない。異議は罰せられないが不可視化される——プラットフォーム外の活動はどのシステムにも登録されない。所有はアクセス権に完全置換。拡張された個人が新たなエリートを形成。",
      },
      {
        id: "p2_social_cooperative",
        category: "social",
        name: "協同組合復興",
        nameEn: "Cooperative Revival",
        description: "プラットフォーム独占への反動として協同組合型所有が復興。労働者所有企業、コミュニティ土地信託、相互扶助ネットワークがプラットフォームモデルに挑戦。技術はオープンソース。進歩は遅いが分配は公平。",
        worldEffect: "経済生活には統治への能動的参加が求められる。意思決定疲れは現実だが、真の集団的所有もまた現実。身体拡張は存在するが集合的に管理され、誰もプレミアムアクセスを得ない。変化のペースは遅いがより民主的に方向付けられる。",
      },
      {
        id: "p2_social_transparency",
        category: "social",
        name: "透明性社会",
        nameEn: "Transparency Society",
        description: "プラットフォームの濫用への対応として、急進的透明性が法制化。個人・企業・政府のすべてのデータが公開。プライバシーは時代遅れの概念とされる。社会的信頼は高いが、相互尊重ではなく相互監視に基づく。",
        worldEffect: "すべての人の生活が全員に可視化される。信頼は関係性から構築されるのではなく透明性により強制される。逸脱は罰されないが隠すことも不可能。公私の境界は消失。プライバシーを求める者は疑いの目で見られる。",
      },
    ],
    naturalOptions: [
      {
        id: "p2_natural_engineered",
        category: "natural",
        name: "気候工学時代",
        nameEn: "Geoengineering Era",
        description: "大規模気候介入（太陽遮蔽、海洋アルカリ化）が地球気温を安定化。しかし新たな気象パターンと地政学的緊張を生む。日本の気候は人工的に穏やか。自然は「管理されたもの」に。",
        worldEffect: "自然界は目に見えて人工的。季節は予測可能だが不気味。食料生産は安定しているが継続的な工学に依存。システムが失敗した場合の深い不安が根底にある。生態学的知識は工学的知識に置き換えられている。",
      },
      {
        id: "p2_natural_adaptation",
        category: "natural",
        name: "適応と共生",
        nameEn: "Adaptation & Coexistence",
        description: "気候工学は拒否または失敗。より温暖で嵐の多い現実に適応する方向を選択。建築・農業・日常生活が気候現実に合わせて再設計。耐熱作物、浮遊集落、季節的移住が日常に。",
        worldEffect: "気候変動との共生が日常的な交渉。利便性に代わりレジリエンスが核心的価値に。うまく適応したコミュニティは繁栄し、できなかったコミュニティは放棄される。自然との新しい関係——支配でも屈服でもなく、継続的な適応。",
      },
    ],
  },
  // ── Phase 3: 60-70歳 (2086-2096) ──
  {
    phaseLabel: "60-70",
    socialOptions: [
      {
        id: "p3_social_consciousness",
        category: "social",
        name: "意識拡張社会",
        nameEn: "Consciousness-Extended Society",
        description: "意識転送技術が実験段階を超え初期採用へ。「デジタル永続」——生物学的死を超えて意識を保存・拡張する能力——が富裕層に利用可能。社会は「永続者」と「終了者」に分裂。",
        worldEffect: "老いと死の意味が根本的に変容。デジタル永続を選ぶ者は生物学的関心から離脱し始める。拒否する者はなぜ死が重要かを言語化する必要に迫られる。一方が無限に生きうる場合、ケア関係は複雑化する。",
      },
      {
        id: "p3_social_bioconservative",
        category: "social",
        name: "生命保守主義",
        nameEn: "Bioconservative Movement",
        description: "意識転送と急進的寿命延長を拒否する強力な文化・政治運動。「自然死」が政治的アイデンティティとなる。宗教的・哲学的・生態学的論拠が有限な生の価値に収束。技術進歩派との緊張は激しい。",
        worldEffect: "社会は死の問題をめぐりイデオロギー的に二極化。自然に老い死ぬことを選ぶことは政治的声明であり個人的哲学。ケアシステムは有限の生に合わせて再設計。「何が人生を完全にするか」が文化的議論の中心に。",
      },
      {
        id: "p3_social_mosaic",
        category: "social",
        name: "モザイク社会",
        nameEn: "Mosaic Society",
        description: "合意は生まれない。意識転送を受け入れるコミュニティ、拒否するコミュニティ、両方を混在させるコミュニティが共存。「人」「死」「ケア」の意味がコミュニティごとに異なるパッチワーク社会。法的枠組みは追いつけない。",
        worldEffect: "日常生活では存在についての根本的に異なる価値観を持つコミュニティ間の絶え間ないコンテキスト切り替えが必要。コミュニティ境界を越えた関係は複雑だが豊か。「良い人生とは何か」に唯一の答えはない——多くの共存する答えがあるだけ。",
      },
    ],
    naturalOptions: [
      {
        id: "p3_natural_restored",
        category: "natural",
        name: "生態系復元期",
        nameEn: "Ecosystem Restoration Era",
        description: "数十年の再野生化と生態系修復が成果を見せ始める。放棄された都市部に森が戻り、野生動物回廊が主要都市を繋ぐ。人間と自然の関係が再交渉されている——支配でも保全でもなく、共棲として。",
        worldEffect: "自然はもはや背景ではなく日常生活の能動的な存在。郊外に野生動物が現れる。季節のリズムが再び主張し始める。高齢者にとって、この自然との再接続は慰めと無常の気づきの両方を提供する。",
      },
      {
        id: "p3_natural_scarred",
        category: "natural",
        name: "傷跡の地球",
        nameEn: "Scarred Earth",
        description: "多くの地域で気候ダメージは不可逆。かつての農業地帯は砂漠化。沿岸都市は水没した廃墟。日本は居住可能だが生態学的崩壊の目に見える傷跡を抱える。資源は安定しているが環境喪失の心理的重みは深い。",
        worldEffect: "喪失が風景に刻み込まれている。すべての高齢者がもはや存在しない世界を記憶している。環境的悲嘆は認知された症状。しかし傷跡から新しい生態系が現れつつある——古いものではないが、予想外のもの。もはや育った世界ではない世界を愛せるか、という問い。",
      },
    ],
  },
  // ── Phase 4: 80-100歳 (2106-2126) ──
  {
    phaseLabel: "80-100",
    socialOptions: [
      {
        id: "p4_social_longevity",
        category: "social",
        name: "超長寿制度",
        nameEn: "Hyper-Longevity System",
        description: "100歳寿命が標準。80歳での「最終章設計」提出が義務——終末期ケア・相続・記憶伝達を決定する官僚的プロセス。老いは公衆衛生インフラの課題として管理される。効率的だが非人格的。",
        worldEffect: "人生の終わりが手続き化される。国は包括的ケアを提供するが詳細な計画を要求する。個人の希望は制度的枠組みの中で対応される。管理される快適さと自分の終わりを選ぶ尊厳の間の緊張。",
      },
      {
        id: "p4_social_communal",
        category: "social",
        name: "共同体終老",
        nameEn: "Communal Aging",
        description: "施設型高齢者介護が世代間コミューンに置き換わる。若者と高齢者が設計されたコミュニティで共住し、ケアは相互的——高齢者は知恵を、若者は身体的サポートを提供。うまくいく場所もあれば、そうでない場所も。",
        worldEffect: "老いは施設ではなくコミュニティの中で起こる。関係は世代を超える。ケアの負担は共有されるが不均等。一部の高齢者は花開き、他の者は聴衆のために知恵を演じているように感じる。ケア関係における真正性の問いが常に存在する。",
      },
    ],
    naturalOptions: [
      {
        id: "p4_natural_equilibrium",
        category: "natural",
        name: "新たな均衡",
        nameEn: "New Equilibrium",
        description: "数十年の激動を経て、新しい生態学的均衡が出現。2026年の世界ではないが安定している。新しい種が古い種に取って代わり、気候は異なるが予測可能。古い世界を覚えている者にとって、新しい世界は美しくも異質。",
        worldEffect: "自然界は癒されたが、認識できない姿に。桜は違う時期に咲く。馴染みの鳥はいなくなり、新しい鳥に置き換わった。古い世界を覚えている80歳にとって、あらゆる風景が変化・喪失・再生についての瞑想。",
      },
      {
        id: "p4_natural_uncertain",
        category: "natural",
        name: "不確実な未来",
        nameEn: "Uncertain Horizon",
        description: "あらゆる介入にもかかわらず、気候システムは予測不能のまま。新たな臨界点が近づいている可能性。次世代は地球が居住可能であり続けるかどうかの真の不確実性に直面。高齢者には問いが投げかけられる——生き残れないかもしれない世界に何を残すか。",
        worldEffect: "未来は本当に不確実。次世代に物を渡すことは、それを使える世界があるかどうか分からないという重みを伴う。遺産は物質的な相続よりも、何が来ようと役立つかもしれない価値観・物語・在り方に向かう。",
      },
    ],
  },
];

/** Get regime options for a given phase label */
export function getPhaseRegimeConfig(phaseLabel: string): PhaseRegimeConfig | undefined {
  return PHASE_REGIME_OPTIONS.find((c) => c.phaseLabel === phaseLabel);
}

/** Build enriched world context string incorporating selected regimes */
export function buildWorldContext(
  age: number,
  selectedRegimes: Record<string, SelectedRegimes>
): string {
  const era = getWorldEra(age);
  if (!era) return "Future Japan 2046-2126";

  const phase = AGE_PHASES.find((p) => p.inputAges.includes(age as Age));
  const phaseRegimes = phase ? selectedRegimes[phase.label] : undefined;

  if (!phaseRegimes) return `${era.title}: ${era.context}`;

  return (
    `${era.title}: ${era.context}\n\n` +
    `[社会体制] ${phaseRegimes.social.name}: ${phaseRegimes.social.worldEffect}\n\n` +
    `[自然環境] ${phaseRegimes.natural.name}: ${phaseRegimes.natural.worldEffect}`
  );
}
