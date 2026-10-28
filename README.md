# Minato 2100 — 未来価値観シミュレーター

ブラウザで体験: https://mvmnt-coder.github.io/minato_simulator/

## ローカル開発

```bash
npm install
cp .env.local.example .env.local   # 必要に応じて AI プロバイダを設定
npm run dev
```

http://localhost:3000 を開く。

## 公開(GitHub Pages)

`main` への push で `.github/workflows/pages.yml` が静的書き出し(`GITHUB_PAGES=true`)してデプロイします。
Pages 版は API ルートを含まず、AI 応答はクライアント側のモックで動作します(API キーは使いません)。
