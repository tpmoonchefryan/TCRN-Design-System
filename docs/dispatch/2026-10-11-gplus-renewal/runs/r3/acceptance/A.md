# INIT-015 R3 · 批末验收分片 A（STORY-120、121、122、134）

各节行号：§1 一览 第 21 行；§2 逐 Story 第 32 行（2.1 第 34 行，2.2 第 46 行，2.3 第 58 行，2.4 第 69 行）；§3 返工清单 第 116 行（A3-1 第 120 行，A3-2 第 129 行，收口步骤 第 141 行）；§4 只有 Owner 能定的事项 第 146 行；§5 实施口径判定 第 162 行；§6 证据盲区 第 195 行。

被验对象：集成分支 `claude/init015-gplus-renewal`，HEAD a3f1893。R3 末次 verify 跑在 3f9d658（`runs/r3/verify/steps.md`）；真实 `corepack pnpm@10.12.1 run verify` 与 `storybook:build` 的退出码在会话 scratch `r3-final/verify.meta`：HEAD 3f9d6586…，verify_exit=0（22:28:47Z–22:38:07Z），storybook_build_exit=0。`git diff --stat 3f9d658 a3f1893` 只动 `runs/` 下 6 个调度文件（三份验收摘录、main.md、steps.md、state.md），被验代码与 verify 所见相同，工作树干净。各包 dist 与 storybook-static 是那次真实 verify 的构建产物。

覆盖的单：P0（SUB-104）、P3（SUB-105）、P4（SUB-106、SUB-046）。P1 的 SUB-088、SUB-090 改了 token 与壳，只按 120、121、122 的 GWT 复核有无回退。没有 R3 Subtask 的 120、121、122 只核无回退与 R3 改到的面（TMS 夜间后缀、壳几何、文档壳）。

方法：只读。不改代码、门、回执与链，不重跑门，不构建，不启动浏览器，不运行引擎。证据记作 `NN.MM log:行号`，指会话 scratch `r3-verify/` 的逐段日志；文件证据记作 `路径:行号`。另做了五项只读探查，脚本放在会话 scratch `tmp/r3-acc-A/`，不入仓：

1. tokens.css 三块的属性集比对、4 个壳层 token 与 TMS 后缀落在哪一块、四个字族栈；dist `tcrnTokenCss` 与源文件逐字比较。
2. dist `tcrnComponentCss` 状态规则的颜色字面量扫描。用仓内 `scripts/lib/css-rules.mjs` 的 `parseCss` 与 `colourLiterals`，口径沿用 R2：窄口径为状态伪类、ARIA 属性、`data-tcrn-preview-state`、`[readonly]`、`[disabled]`，`:not()` 与 `:has()` 内的条件不算；宽口径另加任意 `data-*` 属性，`data-tcrn-theme` 除外。
3. 阴影逐层解析。自写分层器，与门里的 `shadowLayers` 独立，读 dist `tcrnComponentCss` 与 `packages/ui-tokens/src/tokens.css`。
4. 回执读数：`visual-selection-application.json` 192 条的处置、理由引用与标注；`intentional-diff-manifest.json`、`internal-vocabulary-scan.json`；`no-overclaim-scan.json` 入仓版与 `r3-verify/receipts-dirty/` 存档的比较；`a11y-axe-summary.json` 的字标豁免按主题与底色分组。
5. SUB-104 词条：6 条新词条在 zh-CN、ja、ko、fr 下是否与英文不同的别的词条同值（可解析词条 2094 条），以及 storybook-static 各页内嵌词典是否带这些值。另按 token 值静态计算文档导航分类计数的对比度（sRGB 合成，与 token-contrast-proof 处理半透明色的方法相同）。

另读了 134-GWT2 点名的 EPIC-040 链上导出（会话 scratch `chain/EPIC-040.json`，2.2 KB，10-11 导出）的 body，用来对照 breaking 清单。

结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。

## 1 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-120 色彩轮廓 token 与对比度门 | 通过：GWT1–5 满足（GWT5 由 R2 的不满足转为满足） | 无 | 0 |
| STORY-121 字体与形状动效 token、字体自托管 | 通过：沿用 R2 满足，R3 无回退（GWT4 因纸面阴影重验） | 无 | 0 |
| STORY-122 契约数据与生成脚本 | 通过：沿用 R2 满足，R3 无回退（GWT2 因壳与 MultiSelect 的 CSS 改动重验）；4 条字面值仍按 O-6 默认保留 | 无 | 0 |
| STORY-134 4.0.0 候选 | 阻塞于 Owner：GWT1–3 满足，SUB-104、105、106、046 判据达成；判定人为 Owner，前置条件待链上转态（RM20） | 无 | 2（A3-1、A3-2） |

去重后返工 2 项，全部为经济档，主力档 0 项。R2 本片的三项返工：A2-1 的 internal-vocab 部分已关闭（a54355b），`pnpm scan` 部分是收口步骤（见第 3 节末）；A2-2 已由 SUB-096、SUB-097 关闭；A2-3 已由 SUB-106 与 SUB-046 关闭。新发现 1 条与既有 Owner 事项 O-2 相关（N-1 夜间余量不足），见第 4 节。不可接受的口径 0 条。

## 2 逐 Story

### 2.1 STORY-120（无 R3 Subtask；P1 的 SUB-088、SUB-090 改了 token）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `:root` 与 dark 两块属性名集合相同（C5） | 满足（R3 改了 token，已重新核对） | 探查 1：浅色块 `:root, [data-tcrn-theme="light"]`（tokens.css:2）86 个属性，主题无关块 `:root`（:91）121 个，夜间块（:215）86 个；两主题块双向差集为空，块内无重名。R3 新增的 4 个壳层 token（`--tcrn-shell-sidebar-width`、`--tcrn-shell-sidebar-width-collapsed`、`--tcrn-shell-topbar-height`、`--tcrn-radius-paper`）只在主题无关块；`--tcrn-brand-suffix-tms` 移进两个主题块（#2c63c8 与 #7aa0f5），所以主题块由 R2 的 85 变为 86。dist `tcrnTokenCss` 与源文件只差源文件首行的 `@import "../fonts/fonts.css"`，这是 tokens-sync.mjs:17 写明的设计。门：06.02:2「C5 theme blocks declare the same 86 properties」；13 log:90 C5 为 0 发现；单测 05 log:11–12。 |
| 2 ink、ink-2、ink-3 于 panel 与 bg ≥ 4.5，line-ctl ≥ 3 | 满足（R3 无回退） | 浅色 ink-3 为 5.64 与 4.86（06.05:8–9），夜间 4.59 与 4.89（:35–36）；line-ctl 浅色 3.16 与 3.06（:21–22），夜间 3.34 与 3.33（:48–49）；:60–61 最低文字 4.59、最低边 3.06，ALL PAIRS PASS。O-3 落地：夜间 TMS 后缀于 panel 6.86、于 bg 7.30，不靠豁免（:52–53）；豁免只剩 Design System 浅色两条（:27–28，:60 记 2 条）。 |
| 3 ink-3 改回 #8a8c93 判红并点名 | 沿用 R1 满足，R3 无回退 | 06.04:3–7。R3 另加 O-3 用例（06.04:11），过期豁免判红的用例仍在（:13）。 |
| 4 只引用旧名的消费方解析到新值并打印弃用提示 | 沿用 R1 满足，R3 无回退 | 06.06:2、:6–11；storybook 构建打印 31 个旧名、282 处（03 log:87）。 |
| 5 `pnpm verify` EXIT=0 | 满足（R2 为不满足） | steps.md：30 步、44 段全绿；真实 verify 退出 0（verify.meta），verify.log 里没有 ELIFECYCLE 或 Command failed。R2 记的余红 6 步（第 10、11、17、18、19、30 步）都退出 0。 |

本 Story 没有硬线违例。R2 判断写「R3 后 verify 全绿即转 done」，机器判据已满足；转态受 RM20（引擎要求库内声明覆盖该 Story 的门）约束，交 Owner。

### 2.2 STORY-121（无 R3 Subtask）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建产物搜索 googleapis 为 0 | 沿用 R2 满足，R3 无回退 | 06.08:8：321 个构建文件 0 处。21:8–9：storybook-static 49 个文本文件 0 处，37 页 190 次请求 0 次指向外部字体主机。三个包目录（不含 node_modules，覆盖各自 `files` 字段的全部条目）对 googleapis、gstatic、fonts.google 搜索为 0 处；正向对照 docs/migration-4.0.md 命中。 |
| 2 ui、heading、mono 三族并带 Noto 回退 | 沿用 R2 满足，R3 无回退 | 探查 1：ui 为 `"Hanken Grotesk","Noto Sans SC",…`，heading 与 serif 为 `"Source Serif 4","Noto Serif SC",…`，mono 为 `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`；门 06.08:10。 |
| 3 任一 woff2 改一个字节判红 | 沿用 R2 满足，R3 无回退 | 06.07:6；06.08:2（54 个文件，3,410,312 B）。 |
| 4 包内阴影模糊不超过 3px | 满足（R3 加了纸面阴影，已重新核对） | R3 的纸面规则 `.tcrn-product-shell__workspace` 为 `border-radius: var(--tcrn-radius-paper); box-shadow: var(--tcrn-shadow-s1)`，只在 `@media not all and (max-width: 760px)` 内。探查 3：dist `tcrnComponentCss` 有 165 条阴影类声明、127 个字面层，最大模糊 1；tokens.css 22 条、22 层，最大 3；超过 3 的为 0。探查列出的两条「无法解析」是名字含 spring 的动效 token，属名称过滤误收，不是阴影。门：06.10:6 softCloudShadows 0、:26 no drift；第 18 步 summary（18 log:7140 起）shadowBlur pass、worst 3。 |
| 5 中文标题「季度复盘」回落到 Noto Serif SC | 沿用 R2 满足，R3 无回退 | 21:21–28（含屏蔽 fonts/ 的对照）。06.08:7：中文分片覆盖 114 个源文件里的 968 个产品码位（R2 验收记为 967，多出的 1 个来自 R3 新文案），没有跑 fonts:vendor。 |

目的锚「圆角 8/12/3」：R3 新增的 `--tcrn-radius-paper` 14px 只用于构图一纸面，属 O-1 的授权范围（「纸离边 12（圆角 14 加 s1）」，B 类），不算回退；06.10:4 radiusLiterals 为 0。体积只报数：ui-tokens tarball 3,510,504 B（16 log:11）。本 Story 没有硬线违例。

### 2.3 STORY-122（无 R3 Subtask）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pairs.json 改一个 ink token，不重生成就判红 | 沿用 R2 满足，R3 无回退 | 07:9。 |
| 2 重生成后绿，且 tcrnComponentCss 里没有含颜色字面量的状态规则 | 满足（R3 改了壳与 MultiSelect 的 CSS，已重新核对） | 07:10、07:23–30：package-css 读 95 条状态规则，其中 39 条在目标基类上，都没有颜色字面量；只含 transparent 的 outline 放行 6 处（07:27）。探查 2：dist 767 条样式规则，窄口径状态规则 95 条，带颜色值的只有 6 条 `outline: 2px solid transparent`，正是门放行的 6 处；宽口径另有 65 条，含字面量的仍是 R2 记过的两条（`.tcrn-product-shell[data-theme-switching="true"]::after` 的 color-mix，收起侧栏无图标导航项 `::before` 的 currentColor），R3 没有新增。 |
| 3 icons.json 的 37 个名字与 tcrnIconNames 相同 | 沿用 R1 满足，R3 无回退 | 07:12、07:28。 |
| 4 marks.json 生成的 SVG 与 logos2 八个文件逐字节一致 | 沿用 R1 满足，R3 无回退 | 07:13、07:29；brand-asset:proof ok（14 log:7）。 |

目的锚：`packages/ui-react/src/styles/generated/typography.scale.ts` 仍只余 4 条字面值（:19 的 16px，:20 的 44px 与 48px，:23 的 11.5px），Typography.test.tsx:174–178 钉住，按 O-6 默认保留，不出返工。R2 的 A2-2 已关闭：docs/contract/README.md:47 改为整张表的状态规则；docs/design/gplus-2026-10/README.md:11 写明浅色选择器由夜间选择器属性派生、契约值不变，并列出刻度 token 与壳层组；inputs.pairs.ts:5 的段注释含 rf。这三处属 SUB-096、SUB-097，由 133 片判定。

### 2.4 STORY-134（SUB-104 · P0；SUB-105 · P3；SUB-106、SUB-046 · P4）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `pnpm pack:smoke` 通过 | 满足 | 16 log:5–27：ok 为 true，三个包都打出 4.0.0 的 tarball。三个 sha256（609c8d62…、9130b42e…、742d6fc1…）与 P4 交回第 6 节逐字相同，两次打包结果一致。 |
| 2 迁移说明对照 EPIC-040 的 breaking 清单，每条有迁移步骤 | 满足（R3 改了说明，已重新核对） | M1–M19 每节各有一条 Do（逐节计数）。EPIC-040 body 的条目与本 Story 目的锚的八项都有对应节：字体自托管 M1；token 改名与别名 M2 与「Deprecated token names」表（migration-4.0.md:476 起）；lucide 移除 M6；名册 37 个 M7；registry 改名 M8；后缀色 M9，含 TMS 夜间 #7aa0f5 与「解析 tokens.css 的断言要改」的 Do（:285–297）；Text 与 Heading M10；Highlight M11；Button lg M12（:341、:348）；ButtonGroup M13；Inputs M14，MultiSelect 纵向在 :383–385。R3 新增 M18（壳几何与 4 个 token，:436–463）与 M19（延期原型名册，:465–474），三个消费方清单各补一步（:49、:51、:74、:99）。 |
| 3 目视清单对照画布板数，每板一节 | 满足（R3 改了清单，已重新核对） | owner-acceptance.md 仍为 10 节（:34–182），顺序与 boards/canvas.json 的 order 相同，该文件自 308f8f2 以来没改过。R3 的目视项挂在第 3 节（:73–76）；新增的「R3 落地项」一节（:217–227）在 10 节之外。全文没有已勾选的项。 |

目的锚其余各项：version-surface 的 7 处读回都是 4.0.0，findings 为空（29 log:245–280）；changelog-release-sections 的待发布段为 4.0.0，findings 为空（29 log:212–242）；`git tag -l 'v4*'` 为空，分支没有上游。

前置条件「EPIC-039 至 042 全部 Story done」：会话 scratch 导出的链上记录（10-13 06:29）里 120–133 全是 active。本片 120、121、122 的机器判据已满足；转态受 RM20 约束，交 Owner。

**SUB-104（P0，经济档）：达成。**

- 词条：storybook-content-text.ts:144–149 新增 6 条五语词条（Add record placeholder、Promote、Dispatch、Inspect、Refresh、发布未接入的原因句）。探查 5：这 6 条在 zh-CN、ja、ko、fr 下都不与英文不同的其他词条同值，含 P0 特意避开的 Promotion 与 Knowledge publishing 两组，切换语言时不会被反查成别的原文。storybook-static 对应页的内嵌词典带这些译文：原因句只在 components-documents-and-collaboration.html，Add record placeholder 在 components-records-and-boards.html，Refresh 在 patterns-data-pages.html 等。
- 运行时读数取 P0 的浏览器探针：21 种 title 按 I1 的读法（两边都在词典里）为 21/21；逐字比较时余 fr 的 `Route` 一条，词典里它的法语值本来就是 Route（同形词）。读法判可接受，见第 5 节。
- zh-CN 新漏译为 0：30.02:41–42。
- 余项：两条已翻译的字串仍留在译文债台账里，见 A3-1。

**SUB-105（P3，主力档）：达成。**

- `git grep -n -E "DenseOperationsShellDemo|CompactToolShellDemo" -- apps packages scripts` 退出 1；ui-react dist 与 storybook-static 里也是 0 处。全仓只剩 CHANGELOG、migration-4.0.md 的迁移说明与调度文档。
- `.tcrn-doc-shell-demo--compact` 在 apps、packages、scripts 下 0 处。`denseShell*` 只剩 `denseShellMenuDensityRows`（navigation-rows.ts:21，被 story-content.tsx:195、:2127 使用）。component-rows.ts:31–33 只剩 KnowledgeBaseShellDemo 一行。
- 导出面：index.tsx:152–156 为 `["KnowledgeBaseShellDemo"]`，类型随之收窄；index.test.tsx:84 断言整份清单。
- 门：第 5、12、15 步（test、doc-shell:proof、exports:check）退出 0。

**SUB-106（P4，经济档）：达成；清单有三处文字与现状不符，见 A3-2。**

- 待裁表：第 1 行注 O-1、O-4，第 2 行 O-3，第 3 行 O-5，第 9 行 O-11；表头说明写明 O-1…O-4 为设计会话 B 类裁定、Owner 可更正，O-5…O-12 按默认执行（owner-acceptance.md:231）；补了 O-2（附 N-1）、O-6（含 RM8 四条）、O-8、O-9 四行（:244–247）。
- 原第 169 行的 MultiSelect 一行改为复核项（现在 :174，含 SUB-091、1a10b84 与读数）。
- 第 3 节加了构图三的映射行与四个目视项（:65、:73–76），节数仍为 10；已知差距按落地事实改写（:78）。
- CHANGELOG：Breaking 句（:12–15）、MultiSelect 纵向（:128–134）、TMS 夜间值（:150–154）、构图一壳几何与 4 个 token（:159 起一段）、两个原型名（:193–195）；门的判定变化只写在 CHANGELOG。迁移说明见 GWT2。
- packages/ui-tokens/README.md:42–59 的 86、121、86 与探查 1 相同，壳层 token、radius-paper 与 TMS 夜间值都写了。gplus README:11 写了 shell 组三条、r-paper 14 与 TMS 夜间 #7aa0f5，与 contract/tokens.json 的 themed 39、fixed 31、brand 4 一致。
- 读数：第 22–25 步与第 29 步退出 0；版本号未动。

**SUB-046（P4，经济档）：R3 重做达成。**

- 第 0 步：story-budget.mjs 的 7 条 recordedHeightPx 都变小，每条注释写了前后值与归因（a54355b）；doc-shell:proof 的差集未变，没有再生 doc-shell-class。
- 第 1 步：非视觉检查全绿后才生成选择（P4 交回第 4 节）。批末复读同样全绿：30.02:12 axe 0、:33 buttonFeedbackOk、:34 storyCoverageManifestOk、:36–39 clipped 为 false 且故事高度无超限、:41–42 zh-CN 新漏译 0。
- 第 2 步（探查 4）：`visual-selection-application.json` 的 changes 共 192 条，全部为 accepted-layout-change（regression 159、new 33，三个视口各 64）；每条理由都引纪要 D1、D6 与 O-1 裁定，都写「按当前渲染接受签名，不代表目视通过」，都带前后签名 sha256；「含未结缺陷」一类标注 0 条；refused 为空。
- 第 3 步：基线 sha256 由 162d5aca7e08… 变为 42fb42b13753…，与 application 记录的前后值相同；入仓的 intentional-diff-manifest 为 comparison-only、entries 为空。批末 verify 复读：30.02:17–20 gated 199、recordedOnly 111、回归 0、新增 0。
- 第 4 步：internal-vocabulary-scan.json 在 a54355b 再生，scannedPages 37（A2-1 的这一半已关闭）；hardening 两份在 7c6a3d0 再生。两次批末 verify 之后，`docs/verification/` 下只有 no-overclaim-scan.json 一处入仓文件变化（另一处是未跟踪的 visual-selection-result.json），说明其余入仓回执与批末产物逐字相同。fonts-vendor --check 通过，没有跑 fonts:vendor。
- 第 5 步：P18 现状写在 owner-acceptance.md:249；`pnpm scan` 在 f84302f 之后跑，回执随 7c6a3d0 入仓。入仓回执的 scannedFiles 为 643，批末 verify 为 646：多出的是 P4 自己随后提交的两份交回文档，以及未跟踪的 visual-selection-result.json；两份回执列出的文件清单相同。这属于收口时点，见第 3 节末。
- 第 6 步：pack 与 storybook:build 证据在 P4 交回第 6 节，与 16 log 一致。

判断：本 Story 的机器判据满足；判定人为 Owner（目视验收、四个停点与前置条件）。本片不代签。

## 3 返工清单

分包建议：两项都是经济档，可以进同一个经济包；A3-2 (a) 要开一次浏览器读数，读数结果写进清单。

### A3-1 两条已翻译的字串仍留在译文债台账里（134 · SUB-104）

- 现象：SUB-104（5ba9a05）把「Add record placeholder」与「Document publishing is not wired in this static DS fixture」补成五语，但 `scripts/lib/locale-invariant-ledger.mjs` 的 translationDebtAllowlist 仍列着它们：documents-and-collaboration-density-spec 在 :206，records-and-boards-backlog-spec 在 :273。台账头注（:22–26）要求翻译时在同一提交里删掉对应条目，否则门与实际渲染会分叉。P0 的文件集只许按机器词登记时改台账，所以没有删（problems/P0.md 第 7 条）。
- 证据：上述行号；30.02:41–43 的 zh-CN 新漏译 0、已登记债 104。这个读数来自 `allowlistedLeakCount`，计的是命中台账的漏译，不是条目数，删掉两条不会改变它；仓里也没有钉条目数的测试或断言。
- 建议改法：只删这两条，其余不动；跑 internal-alpha browser-proof 确认 zh-CN 新漏译仍为 0，跑完还原回执。
- 改动文件：`scripts/lib/locale-invariant-ledger.mjs`。
- 建议档位：经济档（台账数据维护，门的判定语义不变）。
- R2 是否改过同一目标：否。

### A3-2 目视清单有三处与 R3 现状不符（134 · SUB-106）

- 现象：
  - (a) owner-acceptance.md:244 待裁第 10 行写 N-1「随文档壳画布色侧栏（SUB-101）一起解决」。分类计数 `.tcrn-doc-nav__category-count`（apps/storybook/src/alpha-styles.ts:861–870）自带底色 `color-mix(in srgb, var(--tcrn-color-surface-muted) 78%, transparent)`，surface-muted 即 panel-2（tokens.css:53、:266；panel-2 为 :7 的 #f8f7f3 与 :220 的 #1f1f1b），字色 text-tertiary 即 ink-3，字号 11px、字重 800，不算大字。侧栏底为 surface-canvas 即 bg（alpha-styles.ts:115）。静态计算：浅色约 5.17，已解决；夜间约 4.45，低于 4.5，没有解决。axe 违规 0 不能说明它通过：runAxe 只读 `result.violations`（scripts/internal-alpha-browser-proof.mjs:650–664），入仓 axe 汇总里这个类出现 0 次，R2 已把这一点记为盲区。
  - (b) :208「R2 按建议先做的项」第 4 行仍写「组件清单页与导出面仍列着两个原型名（P6 问题 #6，进下一批）」，回退说明也只提 95f0e09。R3 已由 SUB-105（4d0dfde）删去两名。:209 第 5 行写「夜间样板侧栏 6 个 Design System 后缀节点（4.18:1）也被豁免」，这是 R2 的现状。批末入仓的 a11y-axe-summary.json 里 80 个豁免节点的底色全是 #ffffff 或 #efeeea：浅色页 72 个，夜间页 8 个也落在样板的浅色块里。夜间底上的 Design System 后缀已不再被豁免，与 R2 判断 §3.1 O-3 的预期一致。P4 只给第 8、10 行补了 R3 去向。
  - (c) 措辞：:249 的 P18 写「在集成树上构建一次」。实际是在 P4 包树（从集成分支 51872c2 切出）上构建并写入基线；集成树的批末 verify 复读为回归 0、新增 0。
- 证据：同上；本片探查 4、5。
- 建议改法：(a) 在浏览器里量一次夜间文档页的分类计数，取计算后的字色与合成底色，按实测值改写第 10 行 N-1 的现状。不加豁免，处置按第 4 节 N-1，由 Owner 或判断定。(b) 第 4 行改为现状，回退说明补上 4d0dfde；第 5 行补一句 R3 现状。(c) 按事实改一句。只写事实与建议，不勾选。
- 改动文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`。
- 建议档位：经济档（文档回写，判定不变）。
- R2 是否改过同一目标：否。A2-3 补的是待裁表的缺行、编号与 P18；本条是 R3 落地后才不成立的句子，以及 R2 表里 R3 没有回写的两行。

### 收口步骤（不计返工）：no-overclaim-scan 回执

- 现状：入仓回执 scannedFiles 643，批末 verify 为 646（见 2.4 SUB-046 第 5 步）。R3 的验收、判断、lessons 与链写还会提交调度文档，任何在这之前再生的回执都会落后。
- 建议：R3 收口（或 INIT 收口）最后一次文档提交之后，在 internal-alpha:browser-proof 之后、截图目录还在的树上跑一次 `pnpm scan`，提交这份回执；`visual-selection-result.json` 保持未跟踪。这是 R2 A2-1 后半「收口前最后一次文档提交之后再跑一次」的执行时点，不是 SUB-046 的缺陷，也不改门。

## 4 只有 Owner 能定的事项

新增 1 条，其余是既有事项与本片的关联。

- **N-1：文档导航分类计数在夜间仍低于 4.5（并入 O-2，按 O-2 的规则处理）。**
  - 现状：见 A3-2 (a)。浅色约 5.17，夜间约 4.45，都是静态计算，未经浏览器。O-2 的两类节点（锁定组合标语与壳品牌说明）是 ink-3 直接落在 bg 上，4.86 与 4.89，axe 为 0，已解决。N-1 的机制不同：计数自带 panel-2 底色，夜间的 panel-2 比 bg 亮，吃掉了 ink-3 的余量。R2 引的夜间 4.59 是 ink-3 直接落在 panel 上的值（06.05:35），没有算计数自己的底色；按同法算，R2 的夜间约 4.37。
  - 与既有裁定的关联：R2 判断 §3.1 O-2 写「若仍有这两类节点：不自行加豁免，收口交 Owner 在『字标豁免』与『改 ink-2』之间二选一」，N-1 已并入 O-2。
  - 建议：改 ink-2。静态计算浅色约 7.87、夜间约 7.00；只改文档层 `.tcrn-doc-nav__category-count` 的一条 color 声明，不碰包，经济档。「字标豁免」不适用于导航计数。另一个做法是去掉计数的底色，夜间回到 ink-3 于 bg 的 4.89。
  - 未答复时：保持现状，收口时列出；目视时请核对夜间文档页侧栏里的分类计数。
- **判定人与转态。** 134 的判定人为 Owner（目视验收与四个停点）。120、121、122 的机器判据满足，转 done 受 RM20 约束；134 的前置条件随之等待。
- **O-1、O-3、O-4（B 类，Owner 可更正）在本片的落点。** 120 的 C5 读数 86（O-3 让 TMS 后缀进两个主题块）；121 的 radius-paper 14 与纸面 s1 阴影；134 的 M9、M18、CHANGELOG 两段、ui-tokens README 的计数与清单第 3 节。Owner 更正时，除 R2 判断 §3.1 各条「Owner 更正时」所列的撤回外，这些文档也要同步改，ui-tokens README 的主题块计数会回到 85。
- **视觉签名 192 条（P18，知悉）。** 写入只表示按当前渲染接受签名。只带底盘与文档壳两类理由的 10 个 story、29 条（名单在 P4 交回第 4 节）最容易藏住意外变化，建议目视时优先看。
- **构图三与板的差（清单 :76）、文档壳的偏差（:227）**：都留作目视判定，本片不代签。
- **O-6**：4 条字面值保持，见 2.3。**O-8、O-9**：清单已点名（:246–247），本片不代 Owner 判定。
- **停点**：推送、打 tag、发版、部署与目视验收都由 Owner 本人做，本分片没有代签任何一项。

## 5 实施口径判定

| 来源 | 口径 | 判定 | 理由 |
| --- | --- | --- | --- |
| P0 SUB-104 第 1 点 | 新键 Add record placeholder 沿用 Add Work placeholder 的五语值 | 可接受 | 按页裁剪词典时旧键不在页上，运行时只能按英文原文找键；两键英文相同，译文相同不会造成反查歧义（探查 5）。 |
| P0 SUB-104 第 1 点 | Promote 的 ja、ko 与原因句的 ja、ko、fr 避开已有词条的译文 | 可接受 | 运行时按当前文字反查原文，同值会在切换语言时串键；探查 5 确认 6 条新词条在四种语言下都没有同值。 |
| P0 问题 6 | 按 I1 的读法（两边都在词典里）计 21/21，fr 的 Route 同形词算已翻译 | 可接受 | 判据要的是「非英文下不再半译」；Route 的法语值是词典里登记过的译文，恰好同形，不是漏译。逐字比较的读法会逼出一个只为异形而改的法语词，没有收益。 |
| P0 问题 7 | 台账不改（文件集只许按机器词登记时改） | 有条件 | 守住了文件集边界。条件：A3-1 删掉两条已翻译的债条目。拆分时给碰词条的单同时列上台账文件，可免这类残留。 |
| P1 第 3–4 节 | 4 个壳层 token 用判断建议的名字与值，主题无关，contractGroups 加 shell → container，不新增 TokenGroup 成员与导出 | 可接受 | 符合 §3.3 第 5 条；C5 不受影响（86 对 86）；ui-tokens README、CHANGELOG 与 M18 都写了。 |
| P1 第 5 节 | 侧栏画布色与壳顶栏最小高 52 在所有宽度生效，其余构图一几何只在 `@media not all and (max-width: 760px)` | 可接受 | 画布色无右边线在 O-1 范围内，而且 O-2 需要 ink-3 落在 bg 上；移动块一行未改；M18（:450–452）照实告诉消费方。 |
| P1 第 2 节（SUB-088） | TMS 后缀从主题无关块移进两个主题块 | 可接受 | O-3 的直接落点；C5 两块同为 86；M9 的 Do 提醒消费方改解析 tokens.css 的断言。 |
| P3 SUB-105 | index.test.tsx 断言清单正好是 `["KnowledgeBaseShellDemo"]`，不逐名断言不在清单里 | 可接受 | 一条断言同时满足「两名不在清单里」与「git grep 无命中」两条判据，也更严：清单多出任何名字都会红。 |
| P3 问题 4 第 1 条 | demo-styles-sync 读 dist，要先 build、再同步、再 build | 可接受 | 是流程事实，包内按这个顺序跑过。拆分里的局部门把同步排在 build 前，照抄会得到假绿，后续拆分应改顺序。 |
| R3M5、R3M6 | SUB-101 取方案 A：知识库样板的 4 个包件在文档作用域登记例外，删除条件是 Navigation 家族批次让独立件提供构图一几何；文档壳按构图一改；B、C 两个方案（改门的比对数据或选择器）不取 | 有条件（只从本片角度判） | 不改门的比对方式，也不碰包与 Navigation 的结构、API；例外逐条登记、带删除条件，06.10:22 docExceptionsUnused 为 0；第 11 步因此转绿，进而有了 120-GWT5；134 的清单「R3 落地项」（:223–227）与 CHANGELOG 照实写了偏差。条件：① 五处偏差（38 标与文案起点 66、文档页没有纸面、page-template 未改、样板描述截成一行）只作目视项，不计通过；② 4 条例外的删除条件随 Navigation 家族批次兑现，届时 style-scale.md 与清单同步改；③ shell-parity 期望右距 23.04 → 16 与 smoke.test.ts 1212–1215 行的钉值属 133 片按 §3.3 第 6 条判定，本片不判。 |
| P4 第 8 节第 2 项、问题 6 | SUB-106 在点名行之外按落地事实改了清单里的若干句子 | 可接受 | 抽核的几处与事实相符：证据入口 23 行与映射报告一致，第 6 节字标豁免余 2 条与 06.05:60 一致，DIFF-9、DIFF-8 的去向与 R2 判断 §3.3 第 1、2 条一致。漏了 R2 表第 4、5 行，归 A3-2 (b)。 |
| P4 第 8 节第 3 项 | CHANGELOG 的 Breaking 句加 ProductShell 与第四个公开 API；迁移说明新增 M18、M19，三个消费方清单各加一步 | 可接受 | 导出面少两个名字、壳几何变化都是消费方可见的破坏性变化，按 134-GWT2 本该各有迁移步骤。 |
| P4 第 8 节第 4 项 | ui-tokens README 的三块计数取 `parseTokenCssBlocks` 对 tokens.css 的读数 | 可接受 | 与本片探查 1 的 86、121、86 相同。 |
| P4 第 8 节第 5 项 | 选择生成器只改副本，副本加「nonVisualProofOk 不为 true 就不生成」的检查；R2 原件未动 | 可接受 | 只会更严；原件与副本都在会话 scratch（`tmp/r2-P12/`、`tmp/r3-P4/`）。 |
| P4 第 8 节第 6 项、问题 2 | doc-shell-class 不再生；r2-clearance.md 的两项旁证读数（静态命中 1、扫描源文件 64）已过时 | 可接受 | 判据只在差集变化时再生，差集未变（doc-shell:proof 13/13）；r2-clearance.md 按文件名就是 R2 时点的记录。 |
| P4 问题 3 | `visual-selection-application.json`（310,248 B）首次入仓 | 可接受 | 正常复跑会把 manifest 覆盖成 comparison-only，这是 192 条逐条理由与前后签名唯一的入仓记录；hardening 与 scan 不读它，批末 verify 带着它全绿。 |
| P4 问题 4 | 192 条理由按改动归因生成，没有逐张看截图 | 有条件 | 沿用 R2 P12 的口径，每条都写了不代表目视通过。条件：accepted-layout-change 不当作目视通过；第 4 节建议的 29 条进 Owner 目视的优先位。 |
| P4 问题 5 | 宽限表 7 条只记测量值，归因没有分解到单个改动 | 可接受 | 7 条都是变矮，只改 recordedHeightPx，没有放宽任何上限；注释写了前后值，口径同 R2 SUB-075。 |
| P4 问题 7 | SUB-046 跑了三次 browser-proof | 可接受 | 写入要求 nonVisualProofOk，陈旧宽限条目的现值只能从一次运行里读出；三次之间没有重建。 |
| R3M7 | verify 后 no-overclaim 计数与未跟踪的 visual-selection-result.json 存档后还原 | 有条件 | verify 不读它们的入仓值，退出码不受影响。条件：按第 3 节末的收口步骤，在最后一次文档提交之后再生并提交 no-overclaim 回执；visual-selection-result.json 不入仓。 |

R2 有条件口径的条件兑现情况（本片相关的）：

- P1「浅色选择器由生成器派生」，条件 R3-17：已兑现（gplus README:11）。
- P12「生成脚本只在 scratch」，条件是 R3-20 完成前不清理、轮换时移交：R3-20 已完成，原件与副本都在；判断读完后可以清理。
- P12「185 条选择」，条件是按届时捕获重生、去掉已修缺陷的标注：已兑现（192 条按当次捕获，「含未结缺陷」标注 0 条）。

本片不可接受的口径：0 条。P4 问题 1（SUB-078 的 shellFrame 不是 probe）与 P4 第 8 节第 1 项（SUB-103）属他片，本片不判。

## 6 证据盲区

1. 没有重跑任何门。证据是 3f9d658 上 R3 verify 的逐段日志与 HEAD 上的文件；HEAD 与 3f9d658 只差 `runs/` 下 6 个调度文件。
2. 没有启动浏览器。N-1 的夜间约 4.45 是按 token 值做的静态 sRGB 合成计算，没有量计算后的样式；SUB-104 的运行时译文取 P0 的浏览器探针，本片只核了词典与各页内嵌词典；所有目视效果都没有看。
3. 没有打包，也没有解 tarball。CDN 搜索按三个包目录（覆盖各自 `files` 字段的全部条目）做；pack 以第 16 步与 P4 交回的 sha256 相同作旁证。
4. 192 条选择只做了汇总核对（条数、处置、引用、标注、前后 sha256），没有逐条核对理由，也没有看截图。
5. 探查 2、3 的状态与阴影口径是自写的分类与名称过滤；名称里不含 shadow、elevation、edge、focus-ring、ring 的阴影值，门与探查都看不到。
6. 链上状态取自会话 scratch 的导出（10-13 06:29，120–134 都是 active），没有经引擎重读；EPIC-040 用的是 10-11 的导出。
7. SUB-101 方案 A 只从本片角度判定；SUB-078、SUB-103 与 shell-parity 期望值的改动由他片判定。
8. 本验收不对字体许可合规下结论（O-12）。
