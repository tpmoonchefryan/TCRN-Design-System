# INIT-015 R1 · W1-C 交回说明（SUB-004 → SUB-005）

两张 Subtask 都已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 给 SUB-006（token 字族链接）

- `@font-face` 的族名固定为 `"Hanken Grotesk"`、`"Source Serif 4"`、`"IBM Plex Mono"`、`"Noto Sans SC"`、`"Noto Serif SC"`。token 字族栈要逐字使用这些名字，121-GWT2 与 GWT5 才对得上；不要用 fontsource 的 `… Variable` 后缀名。
- 字重范围：Hanken Grotesk 100–900；Source Serif 4 200–900，另有 opsz 8–60，浏览器按字号自动选光学尺寸；IBM Plex Mono 只有 400 与 500；Noto Sans SC 100–900；Noto Serif SC 200–900。全部为 normal，没有 italic。
- 样式表入口是 `@tcrn/ui-tokens/fonts.css`（文件在 `packages/ui-tokens/fonts/fonts.css`，已列入 sideEffects）。`src/tokens.css` 没有 @import 它。Story 正文说「随 tokens.css 导出」：若要 tokens.css 自带字体，在 tokens.css 顶部加 `@import "../fonts/fonts.css";`。这是 SUB-006 的文件，由 SUB-006 定。
- 名字里带 distributable 的栈不能出现专有字体，fonts-proof 的 proprietary 检查继续生效。

## 给 SUB-007 与 storybook、样板页（121-GWT5）

- 页面要加载 fonts.css，`document.fonts.check` 对「季度复盘」与 Noto Serif SC 才会为真。「季度复盘」已固定计入产品用字，Noto Serif SC 的分片覆盖这四个字。
- 打包工具把 woff2 复制进 storybook-static 或 dist 时，副本必须与随包文件逐字节相同；fonts-proof 允许这种副本。改名可以，改内容不行。不要把字体内联成 data: URI，build-output 检查会判红。

## 给集成与批末

- 产品用字的取值规则（新增文案的包请对照）：扫描 `packages/*/src`、`apps/storybook/src`，以及存在时的 `docs/design/gplus-2026-10/contract/**/*.json`。取 zh-CN 键下的字符串，加上不在任何语言键下、且不含假名与谚文的字符串；en、ja、ko、fr 键下的字符串不计；`*.test.*`、`*.spec.*` 与 test 目录不计。另外固定加上「季度复盘」。
- 合并后跑 `node scripts/fonts-vendor.mjs --check`。报 selection would add，或 fonts-proof 的 coverage 判红时，跑 `pnpm fonts:vendor` 再提交 `packages/ui-tokens/fonts`。
- fonts-proof 需要先构建：proprietary 检查读 `packages/ui-tokens/dist/index.js`，build-output 检查没有任何 `packages/*/dist` 时判红。verify 里 tokens:proof 排在 pnpm build 之后，满足这个前提。
- 可复用的接口：`scripts/fonts-proof.mjs` 导出 `runFontsProof({ root, tokens })`；`scripts/fonts-vendor.mjs` 导出 `FAMILIES`、`collectProductCodepoints(root)`、`planVendor(root)`、`checkVendor(root)`、`renderFontsCss(manifest)`。

## 本包文件集以外需要的改动

1. `packages/ui-tokens/README.md`：补 `@import "@tcrn/ui-tokens/fonts.css"` 的用法，并指向 FONT-LICENSES.md。建议由 SUB-006 或 SUB-043 补。
2. `CHANGELOG.md`：第 346–348 行是旧版本的历史条目（当时写的是不随包字体），保持原样；4.0.0 条目要写明随包字体与 OFL 文本（SUB-043）。
3. `src/tokens.css` 是否 @import fonts.css（见上，SUB-006）。
4. pack:smoke 回执里 @tcrn/ui-tokens 的体积会变大（本包实测打包产物 3,365,238 字节），回执由 W8-A 提交。
