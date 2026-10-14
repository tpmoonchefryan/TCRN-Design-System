# K9 附录（主线程补派，R2）

`scripts/storybook-smoke.mjs` 在 R2 只归 K3，K3 已合入。之后 K1、K8 与你的 SUB-176 都让这个脚本里的期望过期，R2 没有别的持有者。下面三处期望对齐交给你（只改这三类期望，不改别的检查、不放宽阈值），和 SUB-176 放在同一个包里做：

1. **旧搜索尺寸。** K1 的 SUB-145 已删掉 260 / 420 的搜索尺寸规则，脚本仍要求它们：搜 `flex-basis: 260px`、`flex-basis: 420px`、`searchRestWidth`（`maxPx !== 260`、`expandedMaxPx !== 420`）与 `visualFitControlContract?.search`（`storybookRestWidthPx !== 260`、`storybookExpandedWidthPx !== 360`）。改为现行几何：完整菜单搜索 936 × 40、下拉搜索 228 × 28（K2 交回第 2 节有文档页实测读数；值的来源是 `docs/design/gplus-2026-10/tools/build-shell2.mjs` 与 token）。其中 `visualFitControlContract` 读的是 AI 契约里的字段，随 SUB-176 改契约时一起改。
2. **AI 契约断言。** K3 问题第 7 条：脚本里对 AI 契约（`apps/storybook/src/build/ai-consumption-contract.ts`）文字的断言仍描述旧壳。SUB-176 重写契约时，把这些断言在同一提交里改成新契约的说法。
3. **shell-matrix 的归属源。** K8 问题与交回第 11 节：`owningSourcePath` 的条件只认五块家族矩阵与样板，shell-matrix 的 source path 实为 `apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`。在矩阵分支的条件里加上 `|| story.id === shellMatrixStory.id`，并在文件头引入 `shellMatrixStory`（导出位置按 P9 交回：`apps/storybook/src/contract-stories/gplus/` 下）。

局部门加跑 `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`，在交回物里写这三处改前改后的红项对比。
