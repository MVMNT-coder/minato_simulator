# ミナト 3Dモデル配置ディレクトリ

デジタルヒューマン用の GLB を以下の名前で配置すると、Future Observation Interface の
中央アバターが three.js で表示されます。未配置の場合は抽象シルエット(フォールバック)を表示します。

- minato-20.glb  (20歳 / 必須。他年代が無い場合のフォールバック)
- minato-40.glb  (40歳 / 任意)
- minato-60.glb  (60歳 / 任意)
- minato-80.glb  (80歳 / 任意)
- minato-100.glb (100歳 / 任意)

## 推奨GLB仕様
- glTF 2.0 (.glb, Draco/KTX2 圧縮可)
- PBRマテリアル(baseColor/normal/roughness/metalness/ao)。マテリアル名に
  skin/face/head/body, eye/cornea, hair/eyelash/brow を含めると部位別最適化が効く
- モーフターゲット: 瞬き(blink / eyeBlinkLeft / eyeBlinkRight)、
  口(jawOpen / mouthOpen / viseme_aa)、眉(browInnerUp)、口角(mouthSmile)
- ボーン: head, leftEye/rightEye, chest/upperChest(呼吸)
- アニメーション(任意): Idle / Talking / Thinking / Listening / Positive / Negative
- テクスチャは2K〜4K(8K非推奨)
