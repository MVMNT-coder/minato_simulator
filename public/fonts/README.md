# Santral フォント配置

UIの主フォントに Santral を使用します。次のいずれかで有効になります。

1. 表示端末に Santral がインストール済み  → 自動的に使用（local() 参照）
2. 未インストールの場合 → 以下の woff2 をここに配置

- Santral-Regular.woff2  (weight 400)
- Santral-Medium.woff2   (weight 500)
- Santral-Bold.woff2     (weight 700)

いずれも無い場合は Noto Sans JP 等へフォールバックします（ビルドは壊れません）。
Santral は商用フォントのため、ライセンスに従って入手・配置してください。
日本語グリフは Santral に含まれないため、日本語は Noto Sans JP で表示されます。
