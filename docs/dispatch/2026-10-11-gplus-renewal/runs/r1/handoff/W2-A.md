# 交回说明 · W2-A（SUB-001 → SUB-006）

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
