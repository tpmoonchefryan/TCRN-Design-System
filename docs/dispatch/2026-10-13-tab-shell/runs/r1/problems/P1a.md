# 问题 · P1a（INIT-016 R1，W1）

本包局部门全部退出 0。以下是见红只记、数据缺口与待判断项，同一根因记一条，本包都没有修。

1. **退役名仍被引用（预期，未修）。** 三条退役 token 仍有消费方：`packages/ui-react/src/styles/base.css.ts`（ProductShell 读 `--tcrn-shell-sidebar-width`、`--tcrn-shell-sidebar-width-collapsed`、`--tcrn-shell-topbar-height`），以及文档壳 `apps/storybook/src/alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`、`smoke.test.ts`。tokens-sync 现报 storybook.css 用到 20 个弃用名、88 处；`run build` 的弃用提示里 `--tcrn-shell-topbar-height` 有 10 处，两条宽度有 7 处。三条名都还能解析，门未红。持有者：base.css.ts 归 SUB-119（撤 O-1 几何），文档壳读数归 SUB-132（C-12）。
2. **板上字号与标尺寸不在刻度或 token 里（数据缺口）。** 固定项标签与标按钮字标的 12.5px 是板值，字体刻度里没有 12.5（最近的是 12 与 13）；标 22px 是品牌侧栏档的值，也没有 token。两处都按板写成字面值，标的写法与 brand.css.ts 的侧栏档一致。本批除 C-2 外不新增 token（C-17），是否进刻度或成为 token 交判断。
3. **Story 136 的字重与板不一致。** Story 136 的 Use Case 写「TCRN 墨色 500、TMS 600」，Brand 板 E 段 `.lkr b` 与 build-shell2 的 `.ts-brand b` 都是整行 600（C-6 也写 12.5/600）。实现取板的 600；Story 文本是否改交判断。
4. **触摸 44 落在组件层的 `:root`。** row-h 与 srch-h 的 pointer: coarse 切换写在 `shell.css.ts` 的 `@media (pointer: coarse) { :root {…} }`，不在 token 表里，原因见交回 3.1。若壳层门（SUB-137）或判断要求切换进 token 层，需要改 `parseTokenCssBlocks` 与 C5 的块模型（门语义），属 C-17 停下条件，交判断。
5. **DS 后缀在墨洗上低于 4.5（记录）。** 136-GWT3 的「后缀于墨洗 ≥ 4.5」只对 TMS 测（浅色约 4.53，夜间高于 6）。Design System 后缀 `#6577f3` 在浅色 3.5% 墨洗上约 3.1。Brand 板 F 段让字标豁免 4.5，07a 板也只画 TMS；DS 是否另有要求交判断。
6. **长名截断（待判断）。** 第二版宽度固定为 `--tcrn-shell-brand-w`（134）。「Mana Orchestrate」与「TCRN Design System」超出时，字标单行截断并带完整名 title。板只覆盖 TMS，长名产品的第二版是否改宽或改用第一版交判断。
