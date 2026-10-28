"use client";
// ============================================================
// ProcessingOverlay — AI処理中の世界観ローディング演出 (§11)
// ============================================================

export default function ProcessingOverlay() {
  return (
    <div className="screen ls-processing">
      <div className="ls-proc-rings">
        <span />
        <span />
        <span />
      </div>
      <div className="ls-proc-title">価値観を解釈しています</div>
      <div className="ls-proc-sub">FUTURE VALUE ARCHIVE — INTERPRETING INPUT</div>
      <div className="ls-proc-steps">
        <span>入力の解釈</span>
        <span>人格状態の更新</span>
        <span>人生の再生成</span>
      </div>
    </div>
  );
}
