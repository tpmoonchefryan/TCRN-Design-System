# 交回说明 · W2-B（SUB-012 → SUB-013）

两张 Subtask 都已完成，没有接续点。问题清单在 `runs/r1/problems/W2-B.md`。

## 已交付

- SUB-012（e7ef431）：`Text` 新增 `size`（body、reading、meta、caption）、`tone`（default、strong）、`variant`（numeral、caps），类型 `TextProps`、`TextSize`、`TextTone`、`TextVariant` 经现有的 `export *` 从包入口导出（index.tsx 无需改动）。不传 prop 仍只输出 `class="tcrn-text"`。`Heading` 1–4 级与 Text 的两个单行变体把文本内容作为 title（显式传入的 title 优先，没有文本时不加）。`styles/typography.css.ts` 的 typographyCss01 改为：标题基础规则（margin 0、字距 0、min-width 0，让标题能在 flex 与 grid 轨道里收缩出省略号）→ 生成段 `typographyScaleCss` → 家族规则（段落 Text 恢复原有上外距 `var(--tcrn-space-2) 0 0`，numeral 与 caps 外距归零，caps 截断出省略号）。旧的 clamp 字号与各级字号规则已删。
- SUB-013（4e5b798）：`Highlight` 的 mark 改用契约类名 `tcrn-highlight__mark`，样式来自生成段（只加 acc-bg 底，2px 晕用 box-shadow 画在行内盒外，字重、字距、字号、内距继承）；旧 `.tcrn-highlight-mark` 规则删除，typographyCss12 只剩 `.tcrn-highlight-text`。`scripts/component-modifier-proof.mjs` 期望表加 Text 的 size、tone、variant 修饰类（共 7 条），emittedFamilies 加三项。
- 单测（`Typography.test.tsx`，11 条）：标题四级的类名与 title、契约字号行高字重与单行截断、旧 clamp 已不在；Text 默认标记与 13/20 次墨及上外距；修饰类映射；numeral「4,280.00」为衬线 300 且 tabular-nums；caps 截断；mark 标记与中性（任何能命中 mark 的规则都不改字体、字距、内外距）；契约链接规则在样式表里。链接的生效级联一条是 todo，原因见下文第 2 条。

## 集外改动需求

### Navigation.test 与 base 段（W2 冻结，交 W3-D：SUB-018 / SUB-021）

1. `packages/ui-react/src/components/Navigation/Navigation.test.tsx:399`：`/\.tcrn-highlight-mark\b/` 改为 `/\.tcrn-highlight__mark\b/`。不改则 test:ssr 红。
2. `packages/ui-react/src/styles/base.css.ts` 2528–2546（baseCss30）：删除以 `/* A record link cannot rely on colour alone` 开头的注释和其后的 `.tcrn-link`、`.tcrn-link:hover`、`.tcrn-link:focus-visible` 三条规则，保留 2548 行起的 Pagination 段。契约的链接规则（acc、acc-ul 下划线、hover acc-2、焦点环）已在生成段里，这一块排在它们之后并胜出。删除后把 `Typography.test.tsx` 中测试「a link is accent ink with the 70% underline, accent-2 on hover and the focus ring」的 `{ todo: … }` 选项去掉，它应转为通过（scratchpad 模拟已验证）。分页的上一页、下一页链接沿用 `tcrn-link` 类，随之变为契约样式。
3. `base.css.ts:2247`（baseCss28）：`.tcrn-surface__head :is(h2,h3)` 去掉 `font-size: var(--tcrn-type-size-heading-3)`，或改成 `:is(h2,h3):not(.tcrn-heading)`，让 Surface 头里的 Heading 按 visualLevel 取契约刻度。
4. 壳内链接的焦点环同样被 baseCss08 的 `.tcrn-product-shell :focus-visible:not(.tcrn-search-input__control) { …; box-shadow: none }` 压掉，与 W2-D 交回第 5 条同一处，一并处理即可。

### 契约（typography.json，改后由 `node scripts/contract-generate.mjs` 重生成）

5. caps 加 `"truncate": true`（C7 单行角色）；生成器输出截断后，删除 typography.css.ts 里 `.tcrn-text.tcrn-text--caps { overflow; text-overflow }` 这条家族规则。
6. Text 外距：生成段写 `.tcrn-text{margin:0}`，家族规则为保持现有默认而恢复上外距。若契约本意是零外距，需要设计权威或 Owner 裁定；否则把外距写进契约，删掉家族规则。
7. numeral 是否截断、生成段几何字面量是否改用 token（C10），见问题清单 P5、P7。

本包没有改 `styles/base.css.ts`、`styles/index.ts`、`packages/ui-react/src/index.tsx`、生成物与契约。

## 给后续包（矩阵与样板 story）

- 标题：`<Heading level={1..4} visualLevel={…}>`；正文：`<Text size tone variant>`。numeral 的单位放在子元素 `<small>` 里，caps 的编号前缀放在 `<b>` 里（生成段按这两个元素排版）。`tcrn-text--numeral-inline`、`tcrn-text--numeral-large`、`tcrn-text--mono` 没有 prop，经 className 加。
- 链接：`<a class="tcrn-link">`；静态态用 `data-tcrn-preview-state="hover|focus"`。搜索命中：`<Highlight text query />`。

## 局部门（包树根执行，日志在 scratchpad/logs/r1-W2-B-*.log）

typecheck、`--filter @tcrn/ui-react build`、`node --test …/Typography.test.js`（11 条：10 过、1 todo、0 失败）、css-template-integrity-proof、component-modifier-proof 全绿。没有跑会写回执的脚本。

## 未做完

无。
