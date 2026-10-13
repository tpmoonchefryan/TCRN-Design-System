# 交回说明 · W3-A（SUB-002 → SUB-003）

两张 Subtask 都已完成，没有接续点。问题与待判定口径见 `runs/r1/problems/W3-A.md`。

## 已交付

- SUB-002：`scripts/token-contrast-proof.mjs` 已按 C1 重写，测试为 `tests/token-contrast-proof.test.mjs`。verify 影响表第 6d 行（tokens:proof › token-contrast-proof）在本包树上转绿。
- SUB-003：新增 `scripts/token-deprecation-notice.mjs` 与测试 `tests/token-deprecation-notice.test.mjs`。`apps/storybook/src/build.tsx` 在静态构建写完后调用一次通知脚本，不阻断构建（影响表第 3 行）。

## 对比度门（给 C5、contract、DOM 层各门）

- 取值只走 `createResolvedTokenMap(theme)`，脚本里没有任何颜色字面量，测试会检查这一点。rgba 色先按承载面合成再算比值，用的是画板 `tools/lib.mjs` 的 `cr`，所以打印的比值与画板一致。
- 阈值 `C1`：text 与 wordmark 4.5，edge 与 focus 3。图标用 currentColor，文字对已经覆盖了图标。
- 对表 `CONTRAST_PAIRS` 分两组。第一组是 GWT2 要求的：ink、ink-2、ink-3 于 panel 与 bg，on-acc 于 acc，line-ctl 于 panel 与 bg。第二组是旧门原有的对，换成 G+ 名：acc 于 panel 与 bg；red 于 panel，以及 red 于 red-bg 叠在 panel 上；ok、bad、warn 于 panel，以及各自叠在洗色上。焦点环的对从 `--tcrn-focus-ring` 的声明读出：环色对间隙色，环色对 panel。
- 失败按「前景 on 承载面 (主题)」点名，例如 `ink-3 on panel (light)`；焦点环与字标的名字前缀分别是 `focus ring `、`wordmark `。
- 哪些品牌后缀算字标文字，按契约判定：marks.json 里带 `suffix` 的标（tms、design-system）才算。einzbern 与 mana-orchestrate 的字标没有后缀，门会输出说明行，不会静默跳过。
- `WORDMARK_EXEMPTIONS` 逐条登记了 4 条豁免：design-system 浅色于 panel 与 bg，tms 夜间于 panel 与 bg。每条都引用 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 与 V2-B1-Brand 板 F 段，tms 两条另标「夜间值待 Owner」（拆分 P15）。以下情况都会判红：豁免指向非字标对，缺裁定引用，所指的对已经达标（stale），或者找不到对应的对。
- 导出 `runTokenContrastProof({ tokens, exemptions, resolve, wordmarkContract })`，返回 `{ ok, results, failures, notes, exemptions, lowest }`。另有 `formatReport`、`focusRingPairs`、`wordmarkSuffixPairs`、`pairLabel`。

## 弃用通知

- 用法：`node scripts/token-deprecation-notice.mjs [--label <名>] <文件或目录>...`。每个在用的旧名打印一行，措辞来自包的 `formatDeprecatedTokenNotices`，例如 `deprecated token <旧> (n uses): use <新> [文件]`；设置了旧名的地方另加 note。退出码恒为 0，只有路径不存在或缺参数时为 2。
- 旧名表读 `@tcrn/ui-tokens` dist 的 `tcrnDeprecatedTokenAliases`，无后继的名字来自 `tcrnDeprecatedTokens`。带 `tcrn-token-block` 标记的块，以及照抄的 `--旧: var(--新)` 声明，都不算使用。
- 导出 `runDeprecationNotice({ paths, label })`、`scanDeprecatedTokenUses(source, { stylesheet })`、`deprecatedTokenTable()`。
- storybook 构建扫描 `apps/storybook/src` 与 `.storybook`。现在打印 32 个旧名（P7）。脚本缺失或异常时只打印警告。

## 本包门结果（包树根执行）

`--filter @tcrn/ui-tokens build`、`token-contrast-proof`（最低文字比 4.59，ink-3 于 panel 夜间；最低边或焦点环比 3.06，line-ctl 于 bg 浅色；4 条豁免生效）、`node --test tests/token-contrast-proof.test.mjs`（10/10）、`node --test tests/token-deprecation-notice.test.mjs`（5/5）、`run storybook:build` 均通过。storybook 构建前先构建了 ui-copy-state 与 ui-react。

## 集外改动需求

1. 根 `package.json` 的 `tokens:proof` 接入两份新测试（P3）。
2. `packages/ui-tokens`：`findDeprecatedTokenUsages` 与脚本的定义判定口径对齐，或者提供 bin 入口；README 写明两种调用方式（P6，SUB-043 与 EPIC-043）。
3. 字标承载面是否只算 panel，由验收判定（P4）；tms 夜间值待 Owner 裁定（P5）。
