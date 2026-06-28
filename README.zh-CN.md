<p align="center">
  <img src="apps/storybook/assets/tcrn-brand-mark.svg" alt="" width="88" />
</p>

<h1 align="center">TCRN 设计系统</h1>

<p align="center">TCRN 产品前端使用的包级 UI 原语、语义令牌、文案状态词汇和 Storybook 契约文档。</p>

<p align="center">
  <a href="README.md">English</a>
  · <a href="README.zh-CN.md">简体中文</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.fr.md">Français</a>
</p>

## 这是什么

本仓库是 TCRN Design System 的源码入口。产品前端实现者和 AI agent 在声称符合设计系统前，必须先阅读 Storybook 契约和机器可读 AI 契约。

- Storybook: [默认入口](https://tcrn-design-system-storybook.vercel.app/)
- 中文 Storybook: [zh-CN](https://tcrn-design-system-storybook.vercel.app/?locale=zh-CN)
- 深色外壳: [`?theme=dark`](https://tcrn-design-system-storybook.vercel.app/?theme=dark)
- AI 契约: [`ai-consumption-contract.json`](https://tcrn-design-system-storybook.vercel.app/ai-consumption-contract.json)
- AI 首读入口: [`llms.txt`](https://tcrn-design-system-storybook.vercel.app/llms.txt) 与 HTML head discovery；回传字段必须包括 contractVersion, contractPayloadDigest, artifact, route, readAt, coveredRules, requiredProof, noOverclaimBoundaries。

## 包与边界

- `@tcrn/ui-tokens`: 语义令牌和浅色/深色主题覆盖。
- `@tcrn/ui-copy-state`: `zh-CN`、`en`、`ja`、`ko`、`fr` 本地化与文案状态。
- `@tcrn/ui-react`: 包级 React UI 原语。
- `apps/storybook`: 静态契约文档、合成故事和本地证明。

Storybook 是契约地图，不自动证明 AOS/TMS 产品采用。品牌标识示例是视觉评审指南，不是已发布的品牌组件导出，也不声明最终品牌验收。

## 验证

```bash
pnpm build
pnpm test
pnpm storybook:smoke
node --test scripts/readme-public-contract.test.mjs
pnpm storybook:visual-proof -- --check
pnpm verify
```

本 README 不声明 npm 包发布、Storybook 文档发布就绪、hosted-doc readiness、产品采用、release readiness、产品验收或最终 MVP 验收。
