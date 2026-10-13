# 摘录 · W3-B（INIT-015 R1）

本摘录由主线程从 R1 拆分文件切出，只含本包需要的部分；不要去读整份拆分文件。链上 Story 的 scope 仍是任务权威。

## 1. 跨包约定（实施包必须遵守，改动须先回拆分）

1. **Token 变量名由契约定。** `docs/design/gplus-2026-10/contract/tokens.json` 每条带 `cssVar`。颜色用 `--tcrn-color-<短横线键名>`：bg、bg-2、panel、panel-2、line、line-2、line-3、line-ctl、rule、ink、ink-2、ink-3、acc、acc-2、acc-3、acc-bg、acc-ul、on-acc、red、red-bg、red-bg-2、ok、warn、bad、bad-bg、wash、hover、dis、glass、chrome、av-bg、av-ink、knob、surface（焦点环间隙色，跟随承载面）。阴影 `--tcrn-shadow-s1|s2|s3|edge`，焦点环 `--tcrn-focus-ring`，品牌后缀 `--tcrn-brand-suffix-<tms|design-system|einzbern|mana-orchestrate>`（aos 保持现状）。字族、字号行高、圆角、控件高、内距、动效沿用现有 `--tcrn-type-*`、`--tcrn-radius-*`、`--tcrn-motion-*` 体系，新增项的变量名同样写在 tokens.json。旧名（`--tcrn-color-text-*`、`--tcrn-color-border-*`、`--tcrn-color-surface-*`、`--tcrn-color-brand-*` 等）在 SUB-001 里保留为指向新名的弃用别名。
2. **夜间选择器**是 `[data-tcrn-theme="dark"]`（与仓库及 STORY-120/129 一致），不是画板的 `.gp.night`。C5 比较的是主题相关 token 的 `:root` 块与 dark 块；主题无关 token 放独立 `:root` 块（SUB-001 定，门按同一口径比较）。
3. **状态对变量。** 变体声明 `--tcrn-pair-fill-<态>`、`--tcrn-pair-ink-<态>`、`--tcrn-pair-edge-<态>`（Actions 态键 d/h/a/f/x/l/s；Inputs 文本类 d/h/f/r/x/e/ef，勾选类与开关类的附加元组由 pairs.json 定名），基础规则读生效对 `--tcrn-pair-fill|ink|edge|weight`。变体选择器特异性 (0,2,0)，如 `.tcrn-button.tcrn-button--primary`；状态规则写成 `.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])`，特异性 (0,1,0)，排在基础规则之后，只切换生效对、不写颜色。SUB-010 让 token-extension-proof 接受 `--tcrn-pair-*` 局部变量。
4. **静态状态呈现**用属性 `data-tcrn-preview-state="hover|active|focus"`（矩阵 story 用，与真实伪类共用同一对表），不用无前缀的 `.is-hover` 类。
5. **CSS 段归属。** SUB-010 之后 `tcrnComponentCss` 由 `packages/ui-react/src/styles/index.ts` 按原顺序拼接；家族包只改自己的 `styles/<家族>.css.ts`，并在其中引入 `styles/generated/` 的生成段。`styles/index.ts` 只由 SUB-010 写。`styles/base.css.ts` 在 W2 冻结：家族包若需要改 base 里的家族上下文规则，写进本包交回说明 `runs/r1/handoff/<包号>.md`，由 W3-D（SUB-018、SUB-021）统一处理。
6. **生成物只由生成器写。** `styles/generated/**`、`components/Icon/icon-paths.generated.ts`、`components/Navigation/product-marks.generated.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`apps/storybook/src/contract-stories/gplus/generated/**` 只由 `node scripts/contract-generate.mjs` 写，文件头注明「由 contract 生成，勿手改」；改契约后重生成。
7. **story id 预先定死**（并行包据此对齐）：矩阵 `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix`；样板 `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members`。真 Storybook 轨的 CSF 标题为 Typography/Icon/Brand/Actions/Inputs，导出 Matrix、SampleBilling、SampleProject、SampleProduct、SampleMembers，对应 Storybook id `typography--matrix`、`typography--sample-billing` 等（STORY-130 用例）。id 与标题不含 aos/tms/workflow（public-naming-proof）。
8. **新门读包 CSS 一律从 dist 导入。** doc-shell-class、contract-static、contract-proof 从 `packages/ui-react/dist/index.js` 导入 `tcrnComponentCss`（先 build），与源文件布局无关；读源文件的旧门由 SUB-010 改用 `scripts/lib/component-css-sources.mjs`。
9. **测量库 API 在 W1 定稿。** `scripts/lib/gplus-measure.mjs`（浏览器注入的八项测量与重叠检查，加 Node 侧运行入口）与 `scripts/lib/storybook-routes.mjs`（story id → 静态页路由）由 SUB-034 定稿；W5 的 SUB-028、SUB-033、SUB-035 只读复用，不改签名，需要改的记问题清单。
10. **命令形态。** 局部门一律在包树根以 `corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> run <脚本>` 执行，不 cd、不 rm。局部门只跑本表列出的门，不跑全量 verify。
11. **回执不在实施包里提交。** `docs/verification/internal-alpha/**`、hardening、scaffold、readme 回执只由 W8-A（SUB-046）提交；其它包若跑了会写回执的脚本，跑完用 `git -C <包树> checkout -- <回执路径>` 还原。各新门自己的报告目录（`docs/verification/doc-shell-class/`、`geometry-measure/`、`storybook-visual-proof/`）归对应 Subtask。
12. **渲染文本约束。** story 渲染文本不含工单键（TCRN-DS-*、STORY-*、EPIC-*、INIT-*）与 Codex（internal-vocabulary-scan）；新可见文案五语齐，或作为机器词登记进 `scripts/lib/locale-invariant-ledger.mjs`。
13. **提交。** 按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署）。

## 本包（packages.md）

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W3-B | SUB-025 → SUB-026 | `apps/storybook/src/storybook.css`<br>`apps/storybook/src/story-demo-styles.ts`<br>`scripts/demo-styles-sync.mjs`<br>`package.json`<br>`scripts/selection-grammar-proof.mjs`<br>`scripts/shell-fidelity-proof.mjs`<br>`docs/style-scale.md`<br>`apps/storybook/src/alpha-styles.ts` | 100 | storybook.css、story-demo-styles.ts、alpha-styles.ts 清零与相关门源列表 |

包内局部门：

- W3-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-025 · storybook.css 与 story-demo-styles.ts 清零（CSS 侧），同步豁免表与读这些文件的门

- 包 / 波：W3-B / W3
- 文件：`apps/storybook/src/storybook.css`，`apps/storybook/src/story-demo-styles.ts`，`scripts/demo-styles-sync.mjs`，`package.json`，`scripts/selection-grammar-proof.mjs`，`scripts/shell-fidelity-proof.mjs`，`docs/style-scale.md`
- 依赖：TCRN-DS-SUB-024，TCRN-DS-SUB-001，TCRN-DS-SUB-006
- 判据：128 goal「文档私有类一律 tcrn-doc-」：按 doc-class-map.json 删除组件平行实现、骨架改 tcrn-doc- 前缀、无用删除；保留 tokens-sync 管的 :root 与 dark token 块标记；story-demo-styles.ts 若清空则退役 demo-styles-sync（同步改根 package.json 的 tokens:proof 链），否则保持 --check 绿；selection-grammar 与 shell-fidelity 的文档层源列表随文件变化更新；docs/style-scale.md 豁免表同步；不改 tcrn-doc-* 外观；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`

#### TCRN-DS-SUB-026 · alpha-styles.ts 清零（静态轨文档层）

- 包 / 波：W3-B / W3
- 文件：`apps/storybook/src/alpha-styles.ts`
- 依赖：TCRN-DS-SUB-025
- 判据：128-GWT1 的 CSS 侧：alphaStoryCss 里包外 tcrn-* 定义按 doc-class-map.json 处置（删除或改 tcrn-doc-）；page-template 的切片逻辑不受影响；C13
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 6b | tokens:proof › tokens-sync --check | tokens.css 与 storybook.css token 块同源 | 新 token 再生；加 C5 同构断言 | SUB-001、SUB-006；SUB-025 保留块标记 | W2 |
| 6c | tokens:proof › demo-styles-sync --check | story-demo-styles 与 storybook.css 副本一致 | 文档层清零后退役或保持同步 | SUB-025（退役时同步改 tokens:proof 链） | W3 |
| 6g | tokens:proof › shell-fidelity | 文档层无装饰渐变、圆角字面量、模糊 >3 阴影；包源列表 | 包源列表改 styles/；文档层文件变化 | SUB-010、SUB-025/026；各家族 CSS 圆角走 token、阴影 ≤3 | W1、W3 |
| 6i | tokens:proof › selection-grammar | 选中态只用 ink，不加品牌轴 | 源列表变化；家族遵守 C6 | SUB-010、SUB-025；家族自守 | W1、W3 |
| 11 | doc-shell:proof | 模板类须有定义 | 改为包外类计数门，先红 | SUB-024（W1 先红）、SUB-025/026/027 清到 0 | W3 |

## 跨包交回（r1/handoff/W1-D.md）

### W1-D 交回说明（INIT-015 R1，SUB-024）

## 集外改动（本包未改）

- `package.json`：`doc-shell:proof` 现在只跑脚本，新测试没有接进任何命令。建议改为 `node --test tests/doc-shell-class-proof.test.mjs && node scripts/doc-shell-class-proof.mjs`，与 `ds:consumption:proof` 的写法一致。

## 给 W3（SUB-025/026/027）的用法

- 先 `pnpm build`，再在仓库根跑 `node scripts/doc-shell-class-proof.mjs`。输出里的 `baseline.newSinceBaseline` 和 `baseline.clearedSinceBaseline` 是相对首跑基线的增减，`classMap.unmapped` 列出 map 里没有的新包外类。加 `--details` 会给出每个类的定义、使用与点名位置。
- `--write-baseline` 会改写 `docs/verification/doc-shell-class/baseline.json`。基线是首跑记录，清理期间不要改写；`tests/doc-shell-class-proof.test.mjs` 断言 map 与基线逐类一一对应。
- 处置以 `docs/design/gplus-2026-10/doc-class-map.json` 为准：rename 项的新名写在 `target`；`references` 列出同一提交里要一起改的 proofs/tests。
- 转绿的判据是 `outOfPackageCount` 为 0 且 `templateClassCheck.ok`。`packageEmittedWithoutRule` 只回显、不计数，口径见 `problems/W1-D.md` 第 2 条。

## 可复用的导出

`scripts/doc-shell-class-proof.mjs` 导出：`classListTokens`、`cssSelectorTokens`、`markupClassTokens`、`selectorTokens`、`codeClassOccurrences`、`htmlClassOccurrences`、`packageCssClasses`、`packageEmittedVocabulary`、`computeOutOfPackage`、`templateClassCheck`、`runDocShellClassProof`、`stringifyCompact`，以及 `DEFAULT_PATHS`、`DOC_CLASS_DISPOSITIONS`。

## 跨包交回（r1/handoff/W2-A.md）

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

