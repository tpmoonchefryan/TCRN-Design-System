# 问题清单 · W6-B（SUB-041 → SUB-042）

见红只记不修。下列红项不是期望常量能处理的：要么依赖并行包 W5-C，要么是真实缺陷或待裁定事项，落点都在本包文件集以外。期望值一律按 G+ 契约与 token 写，没有放宽判据，也没有加豁免。

## P1 依赖 W5-C：静态页作用域改写吃掉 `:where()` 状态规则

- 现象：story 作用域里的 CSS 改写按逗号切选择器，`:where(:focus-visible,[data-tcrn-preview-state="focus"])` 被切开，整条状态规则失效。实测 `components-navigation-shells.html` 里有 `.story-body :where(.tcrn-button-group)>.tcrn-button:where(:focus-visible,.story-body [data-tcrn-preview-state="focus"])` 这类改写结果。
- 受影响的门与断言（期望已按契约写好，W5-C 合入后复核）：
  - storybook:smoke 三个比较器（productShellComparator、aosFrontendShellVisualInstance、aosOwnerQualityProductShell）中：themeToggle 与 sideNavToggle 的 `focus.boxShadow` 应带 2px 间隙环加 4px acc 环（`--tcrn-focus-ring`，pairs.json actions.secondary.f）；searchControl 的 `focus.boxShadow` 应带 inset 1px acc 边，再加焦点环（pairs.json inputs-text.default.f，search 变体沿用）。现测值分别是默认 edge 和 `rgba(0, 0, 0, 0) 0px 0px 0px 0px`。
  - internal-alpha `buttonFeedbackOk`：primary 按钮的 rest 应为 acc，hover 应为 acc-2（pairs.json actions.primary.d/h）。hover 规则失效时，hover 读回等于 rest。
- 处置：等 W5-C 合入后重跑 `storybook:smoke` 与 internal-alpha，不改期望。

## P2 待设计裁定：外壳切换钮与语言触发器的尺寸不在 G+ 控件高刻度上

- base 段（`packages/ui-react/src/styles/base.css.ts`）的主题钮是 36 胶囊，侧栏钮是 38 方形，语言触发器 min-height 36。G+ 控件高刻度为 28/32/40（IconButton md 为 32 方形，圆角取 `--tcrn-radius-control`）。W2-D 交回已经标注「36px 与胶囊圆角是否保留由设计定」。
- 比较器沿用包的现行几何（36/36/999、38/38/control 圆角、min-height 36），只把侧栏钮圆角改成了 token 值 8。设计裁定后，由 W3-D 改 base 段，再同步改比较器的这几个常量。

## P3 真实缺陷：文档壳搜索框的包裹层仍按旧外观作画

- `apps/storybook/src/alpha-styles.ts:317-325`：`.tcrn-doc-header-search .tcrn-search-input` 写了 `background: var(--tcrn-color-surface-panel)`，块高 `calc(var(--tcrn-space-6) + var(--tcrn-space-1h))`（实测 38）。按 G+ 工具形态（SUB-020），包裹层不应作画，控件本身就是盒子（wash 底，高 32，圆角 8）。现状是圆角控件背后垫着一块直角白底。
- 受影响的门：
  - storybook:smoke 的 cross-section 七条路由报 `storybook-skin-search-wrapper-paints:none:rgb(255, 255, 255)`。
  - internal-alpha 的 firstStoryHashShellParity 报同一条；mobile layering 的 searchInput 层按 G+ 应透明。
  - shell:parity 的 element-inventory 报 topbar 搜索框高度离群：样本 32，文档壳 38。
- 同源的陈旧契约：`apps/storybook/src/build/ai-consumption-contract.ts` 的 `storybookDocShellVisualOracle.shellMetrics` 仍记录 `searchBorderColor: rgb(142, 142, 136)`、`searchBorderRadiusPx: 4`、`searchHeightPx: 36`，描述的是已退役的描边输入框。smoke 与 internal-alpha 已不读前两项，改按 G+ 校验控件的 wash 底与 control 圆角；第三项仍读（36±2），因为它是该契约声明的文档壳值，没有列入本单的改动范围。

## P4 shell:parity 基线红：知识库壳样本与文档壳结构不同构

- 样本 `[data-standard-shell="online-docs"] > .tcrn-side-nav` 已是包 SideNav（W3-C SUB-027）。它没有文档侧栏的内距（16 / 23.04 / 18 / 28.8），也没有 acc-bg 浅洗，gap 是 16 而文档侧栏是 0。
- shell-relations：brandSurfaceLeft 20（真值 0），brandSurfaceRight -4.81，sidebarTopFromBrandBottom 14.85，navItemLeft 0（真值 28.8）。
- brand-lockup：surfaceTopGap 13.84（真值 0）。
- 这是 W3-C 改结构带来的差异。侧栏底色本身也待 Owner 裁定（W5-A 差值表第 5 行：构图一用画布色，包壳用 acc 8%）。门是关系判据，没有常量可改；由集成方与 W3-C 的后续处理。

## P5 geometry:proof 基线红：搜索结果浮层盖住正文

- `navigation` 外壳故事里，搜索结果浮层（420×138，top 230）压住了「Package-backed AOS shell boundary」h3 和随后的 p。故事文案声称「the card text remains readable」，实际没有做到。
- 这是 G+ 字号与搜索几何变化后的版面缺陷。落点在 story 内容的间距，或 ProductShellSearch 结果面板的位置。门是关系判据，本包未改。
- W2-F 交回第 6 条（品牌变异穿过 `display: none`）：本树上品牌腿红绿都成立，未改 geometry-proof。

## P6 full-surface:proof 红：MultiSelect 下拉触发器与 Select 参照不一致

- 判据在 `scripts/lib/multi-select-dropdown-proof.mjs`（集外）：closed-select-family-empty 与 public-popup-family-dark 两例的触发器 `padding-right` 为 10px，而 Select 参照为 30px；`min-height` 为 0px，参照为 auto。
- 原因：SUB-021 让 Select 为 chevron 预留了末端 30px，dropdown 触发器没有跟进。
- 处置：交 Inputs 家族（W3-D）补齐触发器的末端预留（或在该库里按裁定改参照），本包不改判据。

## P7 internal-alpha `clippedButtonText`：G+ 标题截断盒报裁切

- 共 295 次捕获，涉及 h1/h2/h3，例如「Work queue」「Gates and evidence」「AOS Operations Cockpit」。G+ 标题 `truncate: true`（typography.json），即 overflow hidden 单行；衬线字体的内容区高于 30px 行高（Source Serif 4 26px），于是 scrollHeight 大于 clientHeight。窄视口下也可能有真实的横向截断。
- 处置：交字体排印家族判断字形是否被切，可选改法有 `overflow-y` 设回可见、改用 `overflow: clip` 加 clip-margin、或补块向内距。判据不改。

## P8 internal-alpha zh-CN 新泄漏 2 条

- text-styles 故事里的「Page title」「Section title」（W3-C 把字号样本改成了 Heading 与 Text）。需要在 `apps/storybook/src/build/locales/storybook-content-text.ts` 补五语，或登记为机器词。

## P9 internal-alpha 故事高度预算

- 2 个新超预算故事，9 条陈旧的豁免项（`STORY HEIGHT BUDGET DRIFT`），豁免表在本包文件集以外。交 W8-A 或豁免表的属主。

## P10 internal-alpha axe 与视觉签名

- axe 违规 132 条：基线跑出来就是这个数，本包改动前后不变，需单独分诊。
- 视觉签名回归 154 条、新基线 30 条：由 W8-A（SUB-046）统一再生，本包未动基线选择文件，也未提交回执。
