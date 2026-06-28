<p align="center">
  <img src="apps/storybook/assets/tcrn-brand-mark.svg" alt="" width="88" />
</p>

<h1 align="center">TCRN デザインシステム</h1>

<p align="center">TCRN 製品フロントエンド向けのパッケージ backed UI プリミティブ、セマンティックトークン、コピー状態語彙、Storybook 契約ドキュメント。</p>

<p align="center">
  <a href="README.md">English</a>
  · <a href="README.zh-CN.md">简体中文</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.fr.md">Français</a>
</p>

## これは何か

このリポジトリは TCRN Design System のソース管理入口です。製品フロントエンド実装者と AI agent は、Design System 準拠を主張する前に Storybook 契約と機械可読 AI 契約を読む必要があります。

- Storybook: [default](https://tcrn-design-system-storybook.vercel.app/)
- 日本語 Storybook: [`?locale=ja`](https://tcrn-design-system-storybook.vercel.app/?locale=ja)
- ダークシェル: [`?theme=dark`](https://tcrn-design-system-storybook.vercel.app/?theme=dark)
- AI 契約: [`ai-consumption-contract.json`](https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json)

## パッケージと境界

- `@tcrn/ui-tokens`: セマンティックトークンとライト/ダークテーマ上書き。
- `@tcrn/ui-copy-state`: `zh-CN`、`en`、`ja`、`ko`、`fr` のロケールとコピー状態。
- `@tcrn/ui-react`: パッケージ backed React UI プリミティブ。
- `apps/storybook`: 静的契約ドキュメント、合成ストーリー、ローカル証明。

Storybook は契約マップであり、AOS/TMS の製品採用を自動的に証明しません。ブランド表示例はビジュアルレビュー用ガイダンスであり、公開済みブランドコンポーネント export や最終ブランド承認を主張しません。

## 検証

```bash
pnpm build
pnpm test
pnpm storybook:smoke
node --test scripts/readme-public-contract.test.mjs
pnpm storybook:visual-proof -- --check
pnpm verify
```

この README は npm パッケージ公開、Storybook ドキュメント公開準備、hosted-doc readiness、製品採用、release readiness、製品受け入れ、最終 MVP 受け入れを主張しません。
