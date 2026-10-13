# 摘录附件 · W7-A（W2-A W2-B W2-C）：给消费方的变更事实（迁移说明与 CHANGELOG 的来源）

只读各交回里会影响消费方的条目：改名、删除、新增导出、默认值变化、需要的新引入（如 fonts.css）、弃用别名。


## 交回 W2-A

### 交回说明 · W2-A（SUB-001 → SUB-006）

两张 Subtask 都已完成，没有接续点。本文记录 W3-A、W3-B 与各家族包需要对齐的事实。问题与风险见 `runs/r1/problems/W2-A.md`。

## 已交付

- SUB-001：`packages/ui-tokens/src/index.ts` 从 `gplus-tokens.generated.ts` 取全部 G+ 值，生成三块样式。旧名保留为弃用别名。`scripts/tokens-sync.mjs` 加了 C5 断言与弃用摘要，tokens.css 与 storybook.css 的 token 块已再生。
- SUB-006：字族、字号行高、字重、圆角、阴影、动效按 G+ 落地。`--tcrn-type-family-heading` 是新增的标题字族，不借 stamp。`scripts/fonts-proof.mjs` 新增 `token-families` 检查。

## 三块结构与 C5 口径

tokens.css 的内容依次是：`@import "../fonts/fonts.css";`、`:root` 主题块、`:root` 主题无关块、`[data-tcrn-theme="dark"]` 块。JS 导出 `tcrnTokenCss` 不含 @import，storybook 的 token 块用的就是它。每块的第一行是标记注释：主题块与 dark 块为 `/* tcrn-token-block: theme */`，主题无关块为 `/* tcrn-token-block: theme-independent */`。

- 主题块与 dark 块的属性名集合相同，共 85 个：契约 themed 39 个（颜色、s1–s3、edge、grain、blend），`--tcrn-color-surface`、`--tcrn-focus-ring`，再加 44 个颜色、selection、elevation 别名。
- 凡是值引用了主题 token 的项，都在两个主题块里各声明一次，文本相同。这样嵌套的 `[data-tcrn-theme="dark"]` 区域会重新解析它们，不会继承根上的浅色结果。
- 主题无关块共 118 个，与主题块不重名。内容是字族、字号、字重、圆角、控件高与内距、图标尺寸、动效、品牌后缀色，以及保留的 space、container、z-index 等。
- 比较规则只有一份：`compareTokenThemeBlocks(css)`（从 `@tcrn/ui-tokens` 导出）。tokens-sync `--check`、`index.test.ts`，以及后续的 C5 门和 contract 门都应调用它。`parseTokenCssBlocks(css)` 可以取得各块的声明。

## 给家族包（W3-A、W3-B 及其他）

- 新组件只用 G+ 名：颜色 `--tcrn-color-<键>`，阴影 `--tcrn-shadow-s1|s2|s3|edge`，焦点环 `--tcrn-focus-ring`，控件高 `--tcrn-control-height-sm|md|lg`（28/32/40），内距 `--tcrn-control-padding-sm|md|lg`（10/12/16），控件字号 `--tcrn-type-size-control-sm|(无后缀)|-lg`（12/13/14），图标 `--tcrn-icon-size-sm|md|lg`（14/16/20），圆角 `--tcrn-radius-control|small|panel|check|stamp`（8/6/12/4/3），动效 `--tcrn-motion-ease` 与 `--tcrn-motion-duration-fill|press|move|loop`（120/80/240/900ms）。
- 字体：`--tcrn-type-family-ui`（Hanken Grotesk → Noto Sans SC），`--tcrn-type-family-heading` 与 `--tcrn-type-family-serif`（Source Serif 4 → Noto Serif SC，两者值相同），`--tcrn-type-family-mono`（IBM Plex Mono）。字重 `--tcrn-type-weight-light|regular|medium|semibold|strong` = 300/400/500/600/600。另有 `--tcrn-type-tracking-caps`（.14em）与 `--tcrn-type-numeric-tabular`（tabular-nums lining-nums）。
- 字号行高：ui/body 13/20，reading 14/22，meta 12/16（行高 `--tcrn-type-line-meta`），caption 11/16，page 36/40，heading-2 26/30（`--tcrn-type-line-heading-2`），section 与 heading-3 都是 20/26（`--tcrn-type-line-heading-3`）。行高现在带 px 单位。
- 过渡写法：`--tcrn-motion-fast`、`-instant`、`-standard`、`-emphasis`、`--tcrn-selection-glide` 保留原名，值改为由契约拼出的「时长 + G+ ease」字面值（120/80/240/240/240ms）。`--tcrn-motion-press-scale` 仍是 0.97，但已标弃用：G+ 的按压只改填充，不缩放。
- 焦点环在声明处计算。改了 `--tcrn-color-surface` 的容器（例如面板上改为 panel），要同时重声明 `--tcrn-focus-ring`，或在组件规则里现拼 `0 0 0 2px var(--tcrn-color-surface),0 0 0 4px var(--tcrn-color-acc)`。forced-colors 回退按拆分问题清单（problems/decomposition.md）P12 保留透明 outline。
- 新导出：`tcrnGplusThemedTokens`、`tcrnGplusFixedTokens`、`tcrnGplusBrandTokens`、`tcrnGplusThemeSelectors`（契约原样）；`createResolvedTokenMap(theme)`（展开 var() 链后的具体值，供对比度与几何检查用）；`tcrnDeprecatedTokenAliases`（旧→新）；`tcrnDeprecatedTokens`（含无后继项）；`findDeprecatedTokenUsages(source)` 与 `formatDeprecatedTokenNotices(usages)`（打印弃用提示）；`tcrnTokenStylesheet`（tokens.css 全文）；`DesignToken` 新增可选字段 `scope` 与 `deprecated`。
- 品牌后缀色 `--tcrn-brand-suffix-tms|design-system|einzbern|mana-orchestrate` 位于主题无关块，两主题同值。夜间值待 Owner 裁定（拆分问题清单 P15，本包问题清单 P9）。

## 新旧变量名表（弃用别名）

旧名的值是 `var(<新名>)`，所以能解析到新值。表中「所在块」指别名声明的位置。

| 旧名 | 新名 | 所在块 |
| --- | --- | --- |
| `--tcrn-color-text-primary` | `--tcrn-color-ink` | 主题块（两块同文） |
| `--tcrn-color-text-secondary` | `--tcrn-color-ink-2` | 主题块（两块同文） |
| `--tcrn-color-text-muted` | `--tcrn-color-ink-3` | 主题块（两块同文） |
| `--tcrn-color-text-tertiary` | `--tcrn-color-ink-3` | 主题块（两块同文） |
| `--tcrn-color-text-inverse` | `--tcrn-color-on-acc` | 主题块（两块同文） |
| `--tcrn-color-surface-canvas` | `--tcrn-color-bg` | 主题块（两块同文） |
| `--tcrn-color-surface-panel` | `--tcrn-color-panel` | 主题块（两块同文） |
| `--tcrn-color-surface-muted` | `--tcrn-color-panel-2` | 主题块（两块同文） |
| `--tcrn-color-neutral-calibration-canvas` | `--tcrn-color-bg` | 主题块（两块同文） |
| `--tcrn-color-neutral-calibration-panel` | `--tcrn-color-panel` | 主题块（两块同文） |
| `--tcrn-color-neutral-calibration-muted` | `--tcrn-color-panel-2` | 主题块（两块同文） |
| `--tcrn-color-neutral-calibration-border` | `--tcrn-color-line-ctl` | 主题块（两块同文） |
| `--tcrn-color-border-subtle` | `--tcrn-color-line` | 主题块（两块同文） |
| `--tcrn-color-border-strong` | `--tcrn-color-line-2` | 主题块（两块同文） |
| `--tcrn-color-border-control` | `--tcrn-color-line-ctl` | 主题块（两块同文） |
| `--tcrn-color-brand-teal` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-brand-primary` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-brand-primary-bg` | `--tcrn-color-acc-bg` | 主题块（两块同文） |
| `--tcrn-color-brand-secondary` | `--tcrn-color-acc-2` | 主题块（两块同文） |
| `--tcrn-color-brand-secondary-bg` | `--tcrn-color-acc-bg` | 主题块（两块同文） |
| `--tcrn-color-brand-accent` | `--tcrn-color-red` | 主题块（两块同文） |
| `--tcrn-color-brand-accent-bg` | `--tcrn-color-red-bg` | 主题块（两块同文） |
| `--tcrn-color-brand-neutral` | `--tcrn-color-ink-2` | 主题块（两块同文） |
| `--tcrn-color-brand-neutral-bg` | `--tcrn-color-panel-2` | 主题块（两块同文） |
| `--tcrn-color-focus-ring` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-focus-ring-calibrated` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-progress-track-calibrated` | `--tcrn-color-wash` | 主题块（两块同文） |
| `--tcrn-color-progress-fill-start-calibrated` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-progress-fill-end-calibrated` | `--tcrn-color-acc` | 主题块（两块同文） |
| `--tcrn-color-state-ready` | `--tcrn-color-ok` | 主题块（两块同文） |
| `--tcrn-color-state-ready-bg` | `--tcrn-color-wash` | 主题块（两块同文） |
| `--tcrn-color-state-blocked` | `--tcrn-color-bad` | 主题块（两块同文） |
| `--tcrn-color-state-blocked-bg` | `--tcrn-color-bad-bg` | 主题块（两块同文） |
| `--tcrn-color-state-warning` | `--tcrn-color-warn` | 主题块（两块同文） |
| `--tcrn-color-state-warning-bg` | `--tcrn-color-wash` | 主题块（两块同文） |
| `--tcrn-color-state-warning-calibrated` | `--tcrn-color-warn` | 主题块（两块同文） |
| `--tcrn-color-state-warning-calibrated-bg` | `--tcrn-color-wash` | 主题块（两块同文） |
| `--tcrn-color-state-danger-calibrated` | `--tcrn-color-bad` | 主题块（两块同文） |
| `--tcrn-color-state-danger-calibrated-bg` | `--tcrn-color-bad-bg` | 主题块（两块同文） |
| `--tcrn-type-family-latin` | `--tcrn-type-family-ui` | 主题无关块 |
| `--tcrn-type-family-distributable-latin` | `--tcrn-type-family-ui` | 主题无关块 |
| `--tcrn-type-family-distributable-zh-cn` | `--tcrn-type-family-ui` | 主题无关块 |
| `--tcrn-type-family-distributable-mono` | `--tcrn-type-family-mono` | 主题无关块 |
| `--tcrn-type-family-zh-cn` | `--tcrn-type-family-ui` | 主题无关块 |
| `--tcrn-elevation-floating` | `--tcrn-shadow-s3` | 主题块（两块同文） |
| `--tcrn-selection-fill` | `--tcrn-color-wash` | 主题块（两块同文） |
| `--tcrn-selection-fill-hover` | `--tcrn-color-hover` | 主题块（两块同文） |
| `--tcrn-selection-edge` | `--tcrn-color-ink` | 主题块（两块同文） |
| `--tcrn-elevation-focus` | `--tcrn-focus-ring` | 主题块（两块同文） |
| `--tcrn-motion-ease-out` | `--tcrn-motion-ease` | 主题无关块 |
| `--tcrn-motion-press-scale` | （无后继，保留定义） | 主题无关块 |

沿用原名、只换成 G+ 值的项（不是别名）：`--tcrn-type-family-ui`、`--tcrn-type-family-mono`、`--tcrn-radius-control`、`--tcrn-radius-panel`、`--tcrn-radius-surface`（等于 panel）、`--tcrn-type-size-control`，以及上面列出的字号、行高、字重和动效组合。

## 集外改动需求

1. `packages/ui-tokens/README.md`：写明 tokens.css 自带 fonts.css 的 @import、三块结构、弃用别名表与提示函数，以及 FONT-LICENSES.md 的位置（SUB-043）。
2. `scripts/token-contrast-proof.mjs`：改用 G+ 对与 `createResolvedTokenMap`（问题清单 P2）。
3. `apps/storybook/src/smoke.test.ts` 与 `.storybook/preview.ts`：canvas 断言改用 `--tcrn-color-bg` 的具体值（P3）。
4. `apps/storybook/src/build/ai-consumption-contract.ts`：在 `publicTokenAliases` 里暴露弃用名（P12）。
5. 契约（`docs/design/gplus-2026-10/contract/`）与 `scripts/contract-generate.mjs`：登记本包新增的名字，并导出字体刻度（P4、P5）；mono 是否加 Noto 回退待验收判定（P6）。
6. 集成时跑 `pnpm fonts:vendor`，补上「盃」的分片（P1）。

## 本包门结果（包树根执行）

`--filter @tcrn/ui-tokens build`、`tokens-sync`、`tokens-sync --check`、`--filter @tcrn/ui-tokens test`（8/8）、`stamp-whitelist-proof`、`token-extension-proof`（radius 12px/12px）均通过。`fonts-proof` 中 token-families 与 proprietary 通过；coverage 仍是基线就有的红（P1）。日志在派工 scratchpad 的 `logs/r1-W2-A-final-*.log`。

## 交回 W2-B

### 交回说明 · W2-B（SUB-012 → SUB-013）

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

## 交回 W2-C

### 交回说明 · W2-C（SUB-014 → SUB-015）

两张 Subtask 都已完成，没有接续点。本文记录 W2-D（包入口）、W2-F（story-content.tsx）、W3-C/W3-D、W4-A（icon 矩阵）、W6-B 与集成需要对齐的事实。问题与风险见 `runs/r1/problems/W2-C.md`。

## 已交付

- SUB-014（863ab1e）：`Icon.tsx` 改为从 `icon-paths.generated.ts` 渲染，组件里没有任何手写路径。svg 带 `viewBox="0 0 20 20"`、`fill="none"`、`stroke="currentColor"`、`stroke-width="1.25"`、round 端点和 round 拐角；每个子元素都带 `vector-effect="non-scaling-stroke"`（这个属性在 SVG 里不继承，所以要逐个加）。生成物里的子元素标记按一套封闭语法读成 React 元素：只认 path、circle、ellipse、rect，属性只认 d、cx、cy、r、rx、ry、x、y、width、height。契约以后要是出现别的元素或属性，该图标渲染时会直接抛错，不会悄悄只画出一半。`sm`、`md`、`lg` 从 `@tcrn/ui-tokens` 的 `--tcrn-icon-size-sm|md|lg` 读像素值（14、16、20），数字尺寸照原样用；尺寸写在 width、height 属性上，宿主的 CSS 仍然可以覆盖。`strokeWidth` 已经从 `IconProps` 里拿掉；强行传进来也会被契约描边压掉。decorative 与 aria 的行为照旧，children 仍然追加在契约路径后面。`styles/icon.css.ts` 的 `iconCss01` 加了 loader-circle 的旋转：`animation: tcrn-icon-spin var(--tcrn-motion-loading-loop) infinite`，减少动态效果时为 `animation: none`。`Icon.test.tsx` 共 6 条用例：37 个名字与 icons.json 同集同序（新增 9 个也同序）；每个图标的子元素逐个等于契约路径且都是非缩放描边；三档尺寸等于 token；名册外的名字和 strokeWidth 都用 `@ts-expect-error` 锁住；aria 行为；loader 的 CSS。
- SUB-015（52065c0）：`packages/ui-react/package.json` 去掉了 lucide-react。锁文件只删了 12 行 lucide 条目（importer 项、packages 项、snapshots 项各一处）。pnpm 10.12.1 删掉的 26 行 `libc:` 已经按 W1-C 的做法保留，`corepack pnpm@10.12.1 install` 回读时报 Lockfile is up to date。README 的图标段改成自绘 37 件名册（现有 28 件加新增 9 件），并写明尺寸、描边、可及性和 loader 的规则。`scripts/package-contract-manifest.mjs` 的 `iconLibraryContract` 改为把 icons.json 记为来源，字段有 source、sourceContract 和它的 sha256、生成物路径、viewBox、strokeWidth；新增四项检查进 ok：`iconNamesMatchContract`（导出名册与契约同序）、`thirdPartyIconDependencies`（ui-react 清单的四个依赖段里不得有 lucide*）、`packageSourceThirdPartyIconImports`（ui-react 源码里不得 import lucide*）、`storybookThirdPartySourceClaims`（Storybook 运行时源文件不得再写 `data-icon-library-source="lucide…"`）。原来的 sourcePackage、lucide 依赖版本与精确版本检查、ISC 许可要求都已删除。回执还原了，没有提交。

## 包入口（W2-D）

- 不需要改动。`index.tsx` 里有 `export * from "./components/Icon/index.js"`。Icon.tsx 的运行时导出还是 `Icon` 和 `tcrnIconNames`，类型导出还是 `IconName` 和 `IconProps`，名字都没变。
- 类型有变化，但不需要改入口：`tcrnIconNames` 现在就是生成物里的 `tcrnIconPathNames`（37 个名字的只读元组），`IconName` 等于 `TcrnIconPathName`（联合类型从 28 个扩到 37 个）。`IconProps` 去掉了 `strokeWidth`。整个工作区的 typecheck 通过，没有消费方因此报错。
- 可选：icon 矩阵（W4-A）如果要标出哪些是新增图标，或者要显示网格和描边的数值，需要从入口导出 `tcrnIconNewNames`、`tcrnIconViewBox`、`tcrnIconStrokeWidth`。做法是在 `index.tsx` 加 `export { tcrnIconNewNames, tcrnIconViewBox, tcrnIconStrokeWidth } from "./components/Icon/icon-paths.generated.js"`，再把这三个名字加进 `componentLibraryPublicUtilityNames`。本包没有替入口扩大公开 API。

## 集外改动需求

1. story-content.tsx 的「Icon library contract」块（第 1063–1103 行，表格在 1078–1092 行，本波归 W2-F）。建议改成：`data-icon-library-source="tcrn-icon-contract"`，与 manifest 里 `iconLibraryContract.source` 的值一致；去掉 `data-icon-library-license`，或者改成包自身的许可 `Apache-2.0`；wrapper 和 brand-boundary 两个属性保留，manifest 的 `storybookContractVisible` 还要用。表格三行改为：Source library 写「37 icons drawn for @tcrn/ui-react from the design contract, exposed through Icon」，boundary 写「Downstream UI imports TCRN icon primitives instead of drawing its own SVGs」；License readback 这一行删掉，或者改写成「Icons are package source under the package license」；Brand boundary 一行不变。新文案要在 `storybook-content-text.ts` 里写齐五语，同时删掉第 506、507、509 行三条旧条目，以及 `scripts/lib/locale-invariant-ledger.mjs` 第 160 行的 `"Lucide React"`。
2. smoke.test.ts 第 667、669 行（W3-C 等）：跟着第 1 条一起改成新值，并加一条不得出现 lucide 的反向断言（问题清单 P3）。
3. `allowedLicenseGroups` 加 OFL-1.1（问题清单 P1，待主线程或 Owner 定）。
4. `.tcrn-icon` 基础规则要不要进包，待 Owner 裁定（问题清单 P6）。裁定前不要改 `styles/icon.css.ts` 以外的地方。
5. base.css.ts 与 styles/index.ts 都不需要改：`iconCss01` 本来就在拼接列表里，位置在 root 自定义属性之后、第一条 actions 规则之前。

## 给后续包

- Icon 的标记依次为 `xmlns`、`width`、`height`、调用方传入的其余属性，再接 `viewBox`、`fill`、`stroke`、`stroke-width`、`stroke-linecap`、`stroke-linejoin`、`aria-*`、`role`、`data-icon-name`、`class`、`focusable`。smoke.test.ts 第 566 行反向断言 `viewBox="0 0 20 20" focusable="false" aria-hidden="true"`，用来抓手写的 svg；Icon 的 `viewBox` 后面紧跟 `fill`，不会命中这条。Icon 测试里也锁了这一点。
- 矩阵 story 要实测「16px 下描边 1.25」（124-GWT1 的测量部分），对象是 `svg.tcrn-icon` 的子元素：`vector-effect` 写在子元素上，svg 元素本身没有。
- 新图标名（Clipboard 的 copy、DatePicker 的 calendar）现在已经在名册里，W3-D 可以直接用。
- `Icon.tsx` 现在会在运行时 import `@tcrn/ui-tokens`。这本来就是 ui-react 的 dependencies 项，tsconfig 也已经引用了它。

## 局部门（包树根执行）

typecheck、`--filter @tcrn/ui-react build`、`node --test packages/ui-react/dist/components/Icon/Icon.test.js`（6/6）、`install`（Lockfile is up to date）全部通过。`grep -c lucide packages/ui-react/package.json` 输出 0，退出码 1 是 grep「没有匹配」的正常退出码。`package-contract-manifest.mjs` 退出 1，红在两处：OFL-1.1（基线即红，P1）和 story-content.tsx 的 lucide 来源声明（P2）。脚本写出的两份回执已经 `git checkout` 还原。
