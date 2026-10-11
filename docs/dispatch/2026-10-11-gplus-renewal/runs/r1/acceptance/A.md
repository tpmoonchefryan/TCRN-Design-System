# INIT-015 R1 · 批末验收分片 A（STORY-120、121、122、134）

被验对象：集成分支 `claude/init015-gplus-renewal`，HEAD 4c958f8。批末门跑在 d8586dd（`runs/r1/verify/steps.md`）；d8586dd..4c958f8 只改了 `runs/r1/problems/main.md`、`runs/r1/verify/steps.md`、`runs/state.md` 三份文档，被验代码与批末门所见相同。

覆盖的包：W1-A、W1-B、W1-C、W2-A、W2-G、W2-H、W3-A、W7-A。SUB-046（W8-A）按主线程问题清单 M6 排到 R2 返工之后，尚未执行。

方法：只读，不改代码、门、回执与链，不重跑门、不构建、不启动浏览器。证据以批末门日志为准，记作 `NN log:行号`，指会话 scratch 的 `r1-verify/NN-<步>.log`。另做了三项只读探查，脚本放在会话 scratch，不入仓：

1. 包内阴影层解析：读 `packages/ui-react/dist/styles` 下 11 个文件与 `packages/ui-tokens/src/tokens.css`，按逗号拆层，取第三个长度作模糊半径。
2. 状态规则颜色字面量扫描：用仓内 `scripts/lib/css-rules.mjs` 的 `parseCss` 与 `colourLiterals` 读 dist 的 `tcrnComponentCss`，状态条件取伪类 hover/active/focus*/checked/disabled 与 aria、`data-tcrn-preview-state` 属性。
3. 构建产物与随包文件里的 googleapis/gstatic 搜索，带正向对照。

结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。

## 1 一览

| Story | 结论 | 未满足的 GWT | 返工项 |
| --- | --- | --- | --- |
| STORY-120 色彩与轮廓 token、对比度门 | 不通过 | GWT5 不满足 | 2（A-1、A-6） |
| STORY-121 字体与形状动效 token、字体自托管 | 不通过 | GWT2 部分、GWT4 部分 | 4（A-1、A-2、A-3、A-9） |
| STORY-122 契约数据与生成脚本 | 不通过 | GWT2 部分；硬线「几何逐值来自 token」部分 | 3（A-4、A-5、A-10） |
| STORY-134 4.0.0 候选 | 不通过（GWT1–3 满足，但 SUB-046 未执行、前置条件未满足、文档待随 R2 回写） | 无 | 2（A-7、A-8） |

去重后返工 10 项，其中主力档 5 项（A-2、A-3、A-4、A-5、A-6）。A-1 同时挡住 120-GWT5 与 121 的字体门。只有 Owner 能定的事项 5 条，见第 4 节。

## 2 逐 Story

### 2.1 STORY-120（SUB-001 · W2-A；SUB-002、SUB-003 · W3-A）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `:root` 与 dark 块属性名集合相同 | 满足（按三块口径） | tokens-sync `--check`：「C5 theme blocks declare the same 85 properties」（06 log:29）。contract:static 的 C5 把 `@tcrn/ui-tokens/tokens.css` 一并解析，唯一发现是组件 CSS 的 `[data-theme-icon="light"]`（13 log:247–270），token 块没有发现。口径：tokens.css 分 `:root` 主题块、`:root` 主题无关块、dark 块，C5 比较带 `tcrn-token-block: theme` 标记的两块，主题无关块与主题块不重名（拆分 P11、跨包约定第 2 条）。 |
| 2 ink/ink-2/ink-3 于 panel 与 bg ≥ 4.5，line-ctl ≥ 3 | 满足 | 单测 06 log:31。门：ink-3 于 panel 浅色 5.64（06 log:59），ink-3 于 panel 夜间 4.59，是全表最低文字比（06 log:86、111）；line-ctl 于 bg 浅色 3.06，是最低边比（06 log:73）。06 log:112 为「ALL PAIRS PASS」。on-acc 于 acc 与焦点环对两主题都通过。 |
| 3 ink-3 改回 #8a8c93 判红并点名 | 满足 | 06 log:33–37：经门进程退出 1，点名 `ink-3 on panel (light)` 3.36 与 `ink-3 on bg (light)` 2.89。 |
| 4 只引用旧名的消费方仍解析到新值并打印弃用提示 | 满足（按拆分 P10 口径） | 06 log:113–118：夹具只用旧名；通知逐条打印旧名到新名，退出 0；浏览器里经随包 tokens.css 两主题解析到新值。storybook 构建实际打印 32 个旧名、298 处（03 log:87–119）。口径：DS 挂不进消费方的构建，所以提供仓内脚本与包导出函数，两者计数口径不同（W3-A P6），ui-tokens README 与迁移说明 M2 已写明。 |
| 5 `pnpm verify` EXIT=0 | 不满足 | steps.md：30 步中红 11 步。本分片负责第 6 步（A-1），以及第 18 步 contrast 红的一个根因（A-6）。其余红步（10、11、13、17、19、20、25、28、30，以及 18 的 rail）归其他分片的 Story。本条要等全部分片返工后重跑全量。 |

逐值核对：两块里 bg、panel、ink、ink-2、ink-3、acc、red 与正文一致，浅色为 #efeeea、#ffffff、#16150f、#4f4c43、#6b675d、#0b6b65、#8e2d24，夜间为 #121210、#191916、#ebe8df、#a9a69c、#85827a、#3fc7b7。line-ctl 浅色 rgba(22,21,15,.47)、夜间 rgba(255,255,255,.36)（D2）。新增的 line-ctl、surface、acc-ul、dis、wash、hover 六个 token 在两块里都有。`packages/ui-tokens/src/index.ts` 没有颜色字面量（grep 结果 0），颜色值全部取自 `gplus-tokens.generated.ts`，满足「夜间值从同一数据对象生成」。

硬线核对：浅色与夜间属性集同构，满足。选中墨洗浅色 .06，满足。token 表没有渐变（grep 结果 0），旧的进度渐变别名改指 acc。阴影最大模糊 3（见 121-GWT4）。本 Story 没有硬线违例。

口径判定：

- **W3-A P4 字标豁免与 bg 承载面：可接受，保留 bg。** 构图一的侧栏留在画布上（D1），侧栏里的产品锁定组件就落在 bg 上，所以 bg 是真实承载面，去掉它会把实际出现的组合排除在门外。豁免依据是 D2 与 V2-B1-Brand 板 F 段（字标按 logotype 免 4.5）。四条豁免逐条带裁定引用（06 log:78–79、103–104）。所指的对已达标时判 stale，豁免指向非字标对时判红，两种情况都有单测（06 log:40–43）。
- **W2-A P10 无 G+ 对应物的旧名别名目标：可接受。** 依据如下。G+ 板的状态只用墨色（`.st.ok{color:var(--ok)}`，没有着色底），ready/warning 底色指向 wash 与画板一致。渐变在禁用清单里，进度渐变改成纯 acc。selection-edge 旧值 #1c1d21、selection-fill 旧值 rgba(28,29,33,.06)（5814699 的 tokens.css:95–97）本来就是旧墨与 6% 墨洗，改指 ink 与 wash，语义不变。elevation-floating 改指 s3，符合画板 `.pop` 与模糊 ≤ 3。动效类没有对应物的保持原值，行为不变。另有两点：第二批以后家族的状态徽标会因此失去绿色与琥珀色底，是可见变化，建议在 owner-acceptance 加一行知悉（并入 A-8）；stamp 字栈仍以系统 Songti SC 打头，属后续家族，留给 stamp 负责方。

观察（不阻塞）：

- W3-A P1：ink-3 于 panel-2 夜间 4.31、bg-2 浅色 4.48、hover 叠 panel 夜间 4.19、wash 叠 panel 夜间 3.88。GWT2 只判 bg 与 panel。是否真有 ink-3 文字落在这些面上，要等 A-6 修好后由 DOM 层对比（SUB-035）复核；若确有，再交设计权威定。
- W3-A P2：Story 正文写的「3.44」按画板算法应为 3.36（白）与 2.89（bg）。随批末链写注解，不改正文。
- W2-A P12：AI 消费契约没有暴露 51 个弃用名，归 AI 契约负责方，不挡本 Story。
- 契约把 surface 注为「焦点环间隙色，跟随承载面（纸上为 panel）」，但包内没有任何规则改 `--tcrn-color-surface` 或重声明 `--tcrn-focus-ring`，所以纸面上焦点环的间隙仍是 bg 色。画板也是同样写法（`.gp` 上声明 `--focus`，`.paper` 只改 `--surface`），因此包与画板一致，只是注释与行为不符。见 O-5。

### 2.2 STORY-121（SUB-004、SUB-005 · W1-C；SUB-006 · W2-A；SUB-007 · W2-G）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建产物搜索 googleapis 为 0 | 满足 | storybook-static 49 个文本文件 0 处（21 log:8）；37 页共 190 次请求，googleapis/gstatic 0 次（21 log:9、27）。只读探查：ui-copy-state、ui-react、ui-tokens 三个 dist 与 storybook-static 均为 0 处，正向对照 `tcrn-fonts.css` 命中 37 个文件。附注：随包发布的 `packages/ui-tokens/FONT-LICENSES.md:6` 正文写了 CDN 主机名；如果把 pack 产物也算构建产物，字面搜索为 1 处（A-9，可选）。 |
| 2 ui/heading/mono 三族并带 Noto 回退 | 部分 | ui 与 heading 满足：tokens.css:93 为 Hanken Grotesk 后接 Noto Sans SC，:121 为 Source Serif 4 后接 Noto Serif SC。mono 不满足：tokens.css:94 为 `"IBM Plex Mono",ui-monospace,Menlo,monospace`，没有 Noto，来源是 `contract/tokens.json:53`；`scripts/fonts-proof.mjs:370` 的 mono 条目也没有中文回退要求。W2-A P6 把判读交给验收：按 GWT 字面与目标锚「三族加中文回退」，mono 也要带。改法见 A-2。 |
| 3 任一 woff2 改一个字节，fonts-proof 判红 | 满足 | 06 log:132：单测在副本里改一个字节，断言 digests 检查点名该文件。附注：门本体 `node scripts/fonts-proof.mjs` 批末没有执行（A-1）。 |
| 4 包内 box-shadow 经 shell-fidelity 的 MAX_SHADOW_BLUR_PX 检查，无超过 3px | 部分 | 事实成立。只读解析 dist 样式与 tokens.css 的 254 处阴影类声明、318 层，模糊超过 3 的为 0。geometry:measure 汇总里 shadowBlur 为 pass、最差 3（18 log:7303–7306）。contract:static 的 C11（含 cloud-shadow）为绿（13 log:93）。缺口有三处：GWT 点名的检查只扫文档层三个文件（`scripts/shell-fidelity-proof.mjs:29–33`），不扫包；批末它只经 internal-alpha 间接跑过（30 log:63，shellFidelityDrift 0），在 tokens:proof 里没跑到（A-1）；它的正则会把 `inset 0 0 0 5px`（`packages/ui-react/src/styles/inputs.css.ts:343`，这是扩展半径）读成模糊 5，直接扩到包上会误报。改法见 A-3。 |
| 5 中文标题「季度复盘」回退到 Noto Serif SC | 满足 | 21 log:21–23：heading 字族 400 与 600 两档都由 Noto Serif SC web font 绘制，document.fonts.check 为真。21 log:24–26：屏蔽 fonts/ 后回落到系统 Songti SC，说明对照有效。 |

目标锚数值（tokens.css）：字号行高 13/20、14/22、12/16、11/16，标题 36/40、26/30、20/26（:143–158）；字重 300/400/500/600/600（:122–123、:159–161）；caps 字距 .14em，tabular-nums lining-nums（:124–125）；圆角 control 8、panel 12、stamp 3，radius-surface 12 等于 panel（:95–99、:179）；s1–s3 最大模糊 3（:32–34、:241–243）；动效 cubic-bezier(.22,1,.36,1)，fill 120、press 80、move 240（:112–115）。

体积报数：随包 54 个 woff2，共 3,410,312 B（21 log:5）。五份 OFL 随包，storybook-static 里有逐字节相同的副本。@tcrn/ui-tokens tarball 3,506,261 B（第 16 步）。按拆分 P8 只报数，不设预算。

硬线核对：阴影 ≤ 3，满足。D4 义务方面，许可文本随包并随文档站分发，字体文件逐字节未改（fonts:render 的 copies 腿）。本 Story 没有硬线违例。

口径判定：

- **W1-C 额外拦截 data: URI：可接受。** Story 实施说明本就禁止用 data: URI 内嵌字体。检查只认 `data:font/…` 与 `data:application/font…`，只扫 dist 与 storybook-static，当前 0 处，误报面小，可以防止打包工具把字体静默内联。
- **W2-G 把 OFL 文本复制进 storybook-static：可接受。** 文档站对外提供 woff2，属于再分发，D4 义务要求附许可文本。五份副本与随包文件逐字节相同（21 log:5），public-output:scan 为绿（第 24 步）。上游三份 LICENSE 的版权行只写 Google Inc.，见 O-3。

观察：

- `--tcrn-type-numeric-tabular` 已定义，但包内没有任何规则引用它。G+ 板在根 `.board` 上全局开 tabular-nums；包内只在数字输入、表格计数、分页与 numeral 变体上写了字面值。正文「tabular-nums 全局」按 token 已落地判读；全局应用属于页面与壳层根，是后续家族的事。A-5 顺带把 numeral 变体改为引用该 token。
- 中文子集没有加「常用 3500 字」（拆分 P9），见 O-2。

### 2.3 STORY-122（SUB-008、SUB-009 · W1-A；SUB-010 · W1-B；SUB-011 · W2-H）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pairs.json 改一个 ink token，不重生成就判红 | 满足 | 07 log:7。 |
| 2 重生成后绿，且 tcrnComponentCss 里没有含颜色字面量的状态规则 | 部分 | 绿：07 log:8–9、21–24。生成的 25 条状态规则只切换 `--tcrn-pair-*`；pairs.json 目标基类的 38 条状态规则没有字面量。缺口：只读扫描 dist 的 `tcrnComponentCss` 全部 90 条状态规则，仍有 1 条含颜色字面量，即 `.tcrn-shell-locale-menu__trigger:hover` 与同组的 `[aria-expanded="true"]`（`packages/ui-react/src/styles/base.css.ts:63–69`，写了 `background: color-mix(…)` 与 `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12)`），与 W2-H P3 相同。contract-proof 的 package-css 只查 pairs.json 目标基类，所以门是绿的，但 GWT 后半句不成立。改法见 A-4。 |
| 3 icons.json 的 37 个名字与 tcrnIconNames 集合相同 | 满足 | 07 log:10、26。 |
| 4 marks.json 生成的 SVG 与 logos2 的八个文件逐字节一致 | 满足 | 07 log:11、27；brand-asset:proof 为绿（第 14 步）。 |

目标锚：contract 下六份 JSON 都在。生成器产出变体对段、字体刻度段、图标路径、产品标、token 数据与矩阵数据，文件头带「勿手改」与 contract-sha256，并与内存 `generate()` 逐字节相同（07 log:22），幂等由此成立。矩阵 240 格的期望与画板 data-expect 差 0（07 log:28）。W1-A 期间 boards 与 logos2 没有改动（5814699..HEAD 只有 6a35a29 新增两块板）。SUB-010 的等价证据见 `handoff/W1-B.md`（规范化规则 974 = 974 条，注释 79 = 79 条）；css-template-integrity 批末为绿（06 log 开头一段，findings 为空）。

目的锚缺口（「单一真值」，不是 GWT）：字体刻度没有进契约生成，见 A-5。

硬线核对：

- 生成段的状态规则只切换对，特异性 (0,1,0) 低于变体的 (0,2,0)：满足（07 log:23）。全包 C2 红 7 条，分布在 Typography 链接、Inputs 多选与壳层搜索框，归其他分片的 Story（13 log:142–245）。
- 几何逐值来自 token：部分。生成的 `packages/ui-react/src/styles/generated/typography.scale.ts` 共 50 条字体声明，全部是字面值（字号 15、行高 15、字重 10、字距 9、数字 1），没有一条经 `var(--tcrn-type-*)`。值与 token 相同，但两份平行，改契约后只靠 index.test.ts 的交叉核对防漂移。见 A-5。
- 品牌资产 digest 不变：满足。

口径判定：

- **W2-H 只含 transparent 的 outline 放行：可接受。** transparent 在常规模式下不绘制颜色；强制色模式下 UA 会把 outline 颜色换成系统色，它才成为可见的焦点环。这是拆分 P12 定下的回退做法。放行只限 outline 且唯一颜色为 transparent，门每次报出条数（当前 4 条，07 log:25），也有单测（07 log:6），与 contract-static C2 同口径。条件：不得扩到 background、border 等属性上的 transparent。
- **W1-B P5（tcrnComponentCss 的声明类型由字面量类型变为 string，值不变）：可接受。** 消费方按字符串使用，不受影响。

观察：

- W1-A P1：Actions 板 B 段的标签按值反查 token 名，primary 的 ink 显示为 panel。对比值无误；标签属画板字节，随下一次画布修订改。
- W1-A P2：secondary/danger 默认 edge 的抬升层是浅墨字面量，夜间照用，见 O-4。

### 2.4 STORY-134（SUB-043、SUB-044、SUB-045 · W7-A；SUB-046 · W8-A 未执行）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 `pnpm pack:smoke` 通过 | 满足 | 16-pack:smoke.log：ok 为 true，三包 tarball 都是 4.0.0。 |
| 2 迁移说明对照 breaking 清单，每条有迁移步骤 | 满足 | `docs/migration-4.0.md` 的 M1–M17 每节都有 Do 与 Source（:88–336）。EPIC-043 正文的破坏性清单逐条对上：lucide 移除对 M6，名册 37 件对 M7，注册表 workflow 改 einzbern 并新增 mana-orchestrate 对 M8，Text 新 prop 对 M10，Button lg 对 M12，后缀色对 M9，字体自托管对 M1。目标锚另列的 token 改名与别名对 M2 与 51 行弃用名表（:337 起）。EPIC-040 的五家族变化另由 M11、M13、M14 覆盖。EPIC-040 正文本身没有单列 breaking 清单，所以按 EPIC-043 的清单加 EPIC-040 的五家族一起对照。 |
| 3 目视验收清单对照画布板数，每板一节 | 满足 | `owner-acceptance.md` 共 10 节（:32、:54、:58、:73、:94、:112、:130、:150、:169、:173），与 canvas.json 的 order 10 块逐一对应。V2-Families 与 V2-Rejections 写明无渲染面。每节列两轨 story id、浅色与夜间两栏待勾项和机器证据。文首写明目视由 Owner 做，不代签（:3）。 |

目标锚：version-surface-proof 的 7 项读回都是 4.0.0；changelog-release-sections 的 pendingSections 为 4.0.0（29 log:212–240、245–277）。没有打 tag（`git tag -l` 为空），分支没有上游。CHANGELOG 4.0.0 段与迁移说明都写明未打 tag、未发布、未部署。

判不通过的原因：

1. SUB-046（W8-A）是本 Story 的 Subtask，按 M6 排在 R2 之后，尚未执行。在它之前，第 30 步的 155 条视觉签名回归（30 log:66）不能用作任何方向的证据。
2. 前置条件「EPIC-039 至 042 全部 Story done」未满足。
3. A-2、A-5、A-6 会改 mono 字栈、主题选择器与字体刻度机制，CHANGELOG、迁移说明与 README 要随之回写（A-8）。CHANGELOG.md:17–19 现在写「takes every value … generated into src/gplus-tokens.generated.ts」，字体刻度并不是这样生成的。

以上处置完后，本 Story 的判定人是 Owner：目视验收与四个停点。

硬线核对：本 Story 只交文档，没有组件改动，没有违例。

口径判定：

- **M6 把 SUB-046 移到返工之后：可接受。** 批量原则 v3 第 3、4 条要求生成物在批末、清单处置完之后各做一次，不随单条修改重做。R1 批末已知有契约静态门 8 条、axe 132 条（30 log:60）等返工；现在选基线会把违例写进基线，返工后又要作废。条件：R2 拆分把 SUB-046 列为全部返工包之后、R2 末次全量 verify 之前的唯一一次；在那之前第 30 步的红不计入任何 Story 的判定。

观察（不挡本轮）：W7-A P2，打 tag 时要改写两处 Status 句；P3，README 的「accepted」沿用 1.0.0 措辞，建议维持；P6，迁移说明的 TMS 一节以采用指南的记载为前提。

## 3 返工清单

建议的 R2 分包（供拆分参考）：A-2 → A-5 → A-6 → A-1 动同一组文件，宜进同一个主力档包并按此顺序做；A-3、A-4 各改一个门，可以合一包，也可以各成一包；A-9、A-10 为经济档小件；A-8 在 A-2、A-5、A-6 之后做；A-7 放在全部返工之后。

### A-1 tokens:proof 停在 fonts-proof 单测，后五个子门批末无结果

- 现象：第 6 步红。`tests/fonts-proof.test.mjs` 有 3 条失败，分别在第 58、72、151 行（06 log:131、133、140、146）。失败信息是 token-families 报 `--tcrn-type-family-ui|heading|serif|mono` 缺失（06 log:155–160）。成因：夹具 `openTokens`（测试第 13 行）只有旧名 `--tcrn-type-family-distributable-latin`；SUB-006（e532b52）给 `scripts/fonts-proof.mjs` 加了 token-families 检查，却没有更新这份 W1-C 的测试；W2-A 的局部门单里也没有这份测试（packages.md W2-A 行）。后果：`&&` 链中断，`node scripts/fonts-proof.mjs`、stamp-whitelist、shell-fidelity、token-extension、selection-grammar 五个子门在批末都没有执行，状态未知。
- 改法：`tests/fonts-proof.test.mjs` 的夹具改成四个 G+ 字族 token，值与契约一致，在 A-2 之后应包含 mono 的 Noto 回退；`distributable-*` 栈只留在专有字体用例里。补 token-families 的变异用例：缺 token 判红、缺中文回退判红、fonts.css 里有字族未被任何 token 点名判红。修后跑完整的 `tokens:proof`，把五个子门的结果记入 R2 证据。
- 档位：经济档（只改测试夹具，门的判定不变）。
- 所属：STORY-121 · SUB-005（测试），成因在 SUB-006；同时挡住 STORY-120-GWT5。
- 依赖：在 A-2 之后，或与 A-2 同包。

### A-2 mono 字族缺 Noto 回退（121-GWT2）

- 现象：`--tcrn-type-family-mono` 为 `"IBM Plex Mono",ui-monospace,Menlo,monospace`（tokens.css:94，来源 `contract/tokens.json:53`），等宽文本里的中文会落到系统字体；owner-acceptance 第 1 节的核对项「中文没有回落到系统字」也因此不成立。
- 改法：`docs/design/gplus-2026-10/contract/tokens.json` 的 mono 改为 `"IBM Plex Mono","Noto Sans SC",ui-monospace,Menlo,monospace`。Noto Sans SC 的分片 unicode-range 只覆盖中文，拉丁字形仍走 Plex 与系统等宽。然后依次 `node scripts/contract-generate.mjs`、`node scripts/tokens-sync.mjs`；`scripts/fonts-proof.mjs` 的 `TOKEN_FAMILY_STACKS` 给 mono 加 `fallback: "ui-zh-fallback"`；同步 `packages/ui-tokens/src/index.test.ts`；`scripts/fonts-render-proof.mjs` 可以加一条 mono 中文探针。
- 档位：主力档（改 `contract/*.json` 与 token 值）。
- 所属：STORY-121 · SUB-006（契约部分在 SUB-008）。
- 依赖：无。A-1、A-5、A-8 依赖它。

### A-3 shell-fidelity 的 MAX_SHADOW_BLUR_PX 不扫包内（121-GWT4）

- 现象：`scanShellFidelity` 的 SURFACES 只有 `apps/storybook/src/storybook.css`、`alpha-styles.ts`、`story-demo-styles.ts` 三个文档层文件（`scripts/shell-fidelity-proof.mjs:29–33`），包的段模块与 token 表都不在检查范围内，GWT4 写的「包内任一 box-shadow」没有被它点名的检查覆盖。现有正则（同文件第 240 行起）只取三个连续长度，`inset 0 0 0 5px` 会被读成模糊 5。事实层面目前是干净的，见 2.2 节 GWT4。
- 改法：把阴影检查扩到 `componentCssModules(root)` 的全部段与 token 表（`tcrnTokenCss` 或 `packages/ui-tokens/src/tokens.css`），用 `scripts/lib/css-rules.mjs` 的 `shadowLayers` 按层解析，正确区分扩展半径与 inset；补变异测试，在包段副本里注入 `0 8px 24px rgba(…)` 应判红，`inset 0 0 0 5px` 不得判红。
- 档位：主力档（改门的检查范围）。
- 所属：STORY-121 · SUB-006；读包源的门接线原属 SUB-010。
- 依赖：A-1，tokens:proof 要先能跑到 shell-fidelity。

### A-4 tcrnComponentCss 仍有含颜色字面量的状态规则（122-GWT2）

- 现象：dist 的 `tcrnComponentCss` 共 90 条状态规则，其中 `.tcrn-shell-locale-menu__trigger:hover` 与 `[aria-expanded="true"]` 一条写了 `color-mix(…)` 背景和 `rgba(15, 23, 42, 0.12)` 阴影（`packages/ui-react/src/styles/base.css.ts:63–69`，同时还在用弃用名）。contract-proof 的 package-css 只查 pairs.json 目标基类的 38 条，所以门是绿的。
- 改法：
  - `base.css.ts:63–69` 改用 token，例如 `background: var(--tcrn-color-hover)`、`box-shadow: var(--tcrn-shadow-s1)`，边线与文字改用 G+ 名。这是 GWT2 明确要求的最小改动，与拆分 P29 同类。
  - `scripts/contract-proof.mjs` 的 package-css 把字面量扫描扩到 `tcrnComponentCss` 的全部状态规则（pairs.json 条件加 aria 与 data 状态属性），保留只含 transparent 的 outline 放行。
  - `tests/contract-proof.test.mjs` 补一条非 pairs 目标的变异用例。
- 档位：主力档（改门的判定范围）；CSS 部分本身是经济档的工作量。
- 所属：STORY-122 · SUB-011（门）；base 段的改动需协调 base 段当前的归属方（W2 冻结后由 W3-D 处理）。
- 依赖：无。只禁字面量，不影响 contract-static C2 对壳层的现有豁免。

### A-5 字体刻度没有进契约生成（122 目的锚；硬线「几何逐值来自 token」；跨包约定第 1 条）

- 现象：
  - `gplus-tokens.generated.ts` 没有字体刻度；`packages/ui-tokens/src/index.ts:246–255、325–342` 手写 13px、20px 等值，由 index.test.ts 对 `contract/typography.json` 交叉核对（W2-A P4）。
  - `--tcrn-type-family-heading`、`-weight-light`、`-weight-semibold`、`-tracking-caps`、`-numeric-tabular`、`-line-meta`、`-line-heading-2`、`-line-heading-3` 没有登记在契约里（W2-A P5）。
  - 生成的 `typography.scale.ts` 有 50 条字面值字体声明，见 2.3 节硬线核对。
  - `CHANGELOG.md:17–19` 说 ui-tokens 的每个值都由契约生成，字体刻度不符。
- 改法：
  - `contract/tokens.json` 的 fixed（或 `typography.json`）登记上述名字并给 cssVar。
  - `scripts/contract-generate.mjs` 把字体刻度生成进 `gplus-tokens.generated.ts`；`typography.scale.ts` 改为引用 `var(--tcrn-type-size-*|line-*|weight-*|tracking-caps|numeric-tabular)`。
  - `index.ts` 改为从生成物取值，index.test.ts 的交叉核对可删。
  - 依次跑 contract-generate、tokens-sync；contract-proof 的 generated-sources 应保持绿。
- 档位：主力档（改 token 键集、`contract/*.json` 与生成器）。
- 所属：STORY-122 · SUB-009（index.ts 部分在 SUB-006）。
- 依赖：A-2（同改 tokens.json、contract-generate、index.ts），宜同包顺序做。

### A-6 嵌套的浅色区不恢复浅色 token（缺 `[data-tcrn-theme="light"]`）

- 现象：tokens.css 只有 `:root` 主题块与 `[data-tcrn-theme="dark"]` 块，`[data-tcrn-theme="light"]` 为 0 处（5814699 时也是 0）；生成物写死 `tcrnGplusThemeSelectors = { light: ":root", dark: … }`（`packages/ui-tokens/src/gplus-tokens.generated.ts:22`）。矩阵页有 7 个 `data-tcrn-theme="light"` 块，页面处于夜间时它们继承夜间值。geometry:measure 的 icon-matrix 夜间页 contrast 红（18 log:4394–4395），浅色格读到的是夜间值：`ink-wash-l` 期望 16.18、实测 12.15，`red-panel-l` 期望 8.23、实测 6.78，正是夜间的比值（18 log:4559–4580，对照 06 log 的夜间表）。这正是 M6 列的「浅色主题块」。Owner 在夜间文档页做目视时，浅色栏也会显示成夜间色。
- 改法：
  - 浅色主题块的选择器改为 `:root, [data-tcrn-theme="light"]`：`scripts/contract-generate.mjs` 写进 `tcrnGplusThemeSelectors.light`，`index.ts` 按它输出主题块，并保留 `tcrn-token-block: theme` 标记。
  - `parseTokenCssBlocks`、`compareTokenThemeBlocks` 与 `scripts/tokens-sync.mjs` 接受选择器列表，然后再生 storybook.css 的 token 块。
  - `scripts/contract-static-proof.mjs` 的 checkC5 把该列表视为浅色侧。这是 STORY-132 的门文件，需与其分片协调。
  - 补一条浏览器测试：夜间祖先内的浅色块解析到浅色值，写法同 token-deprecation-notice 的 GWT4 测试。
- 档位：主力档（改生成器的主题选择器与门的分组判定）。
- 所属：STORY-120 · SUB-001（生成器部分在 SUB-009）。症状出现在 STORY-129、131 的门上，其他分片若也列了这一条，属同一根因。
- 依赖：与 A-2、A-5 同改生成器与 index.ts，宜同包顺序做；修后复跑第 18、19、20 步，再看 ink-3 实际落面（2.1 节观察 W3-A P1）。

### A-7 SUB-046（W8-A）在 R2 返工全部合入后执行（排程项，不是缺陷）

- 内容：视觉签名基线选择文件（逐条写理由与证据）、internal-alpha、hardening、scaffold、readme 回执再生、pack 与 storybook:build 证据，之后跑 R2 末次全量 verify。
- 档位：经济档。
- 所属：STORY-134 · SUB-046。
- 依赖：全部 R2 返工项，包括其他分片的。

### A-8 STORY-134 文档随 R2 回写

- 改法：
  - `CHANGELOG.md` 4.0.0 段：mono 中文回退、浅色主题块选择器、字体刻度的生成方式；A-5 落地后改正 :17–19 的表述。
  - `docs/migration-4.0.md` 的 M1、M2、M3。
  - `packages/ui-tokens/README.md` 的三块结构说明。
  - `owner-acceptance.md`：机器证据入口里 fonts:proof 的现状，并加一行知悉「第二批以后家族的状态底色改为中性 wash」（2.1 节口径判定）。
- 档位：经济档。
- 所属：STORY-134 · SUB-043、SUB-044、SUB-045。
- 依赖：A-1、A-2、A-5、A-6。

### A-9 随包 FONT-LICENSES.md 正文含 CDN 主机名（可选，121-GWT1）

- 现象：`packages/ui-tokens/FONT-LICENSES.md:6` 写了 `fonts.googleapis.com` 与 `fonts.gstatic.com`，该文件在 ui-tokens 的 files 里，随 tarball 发布。按拆分口径（dist 与 storybook-static）GWT1 已满足；若把 pack 产物算进去，字面搜索为 1 处。
- 改法：改写为「Google Fonts CDN」之类不含主机名的说法。
- 档位：经济档。
- 所属：STORY-121 · SUB-004。
- 依赖：无。

### A-10 孤立脚本 s254-component-contract-proof.mjs 已失效（低优先）

- 现象：W1-B P2。它用正则从 Navigation.tsx 抽模板，SUB-010 之后匹配为空，八个构件的检查会全部失败；脚本不在 verify 链上，也没有其他文件引用它。
- 改法：退役（`git rm`），或改用 `scripts/lib/component-css-sources.mjs` 的 `componentCssText()`。
- 档位：经济档。
- 所属：STORY-122 · SUB-010。
- 依赖：无。

## 4 只有 Owner 能定的事项

**O-1 夜间品牌后缀色**（拆分 P15、W2-A P9、W3-A P5）。现状：后缀色两主题同值；TMS 的 #2c63c8 于夜间 panel 3.13、于夜间 bg 3.33，按字标豁免登记并标注「夜间值待 Owner」。建议夜间改用该标调色板里的浅色 #7aa0f5：同一 WCAG 算法下于 #191916 为 6.86、于 #121210 为 7.30，可以撤掉两条夜间豁免。Design System 的 #6577f3 夜间已达标（4.60、4.90），不用改。裁定后只改 `contract/tokens.json` 的 brand 条目与生成器的 brand 形状，门会把过期豁免判红，提示删除登记。

**O-2 中文子集是否加「常用 3500 字」**（拆分 P9、W1-C W1C-2）。现状：按产品用字选取上游切片，两款中文字体各 23 片（d8586dd 后新增覆盖「盃」的 52 号片），切片本身覆盖的码点远多于产品用字。建议不加；如需加，请 Owner 给定字表来源，由 fonts-vendor 加选切片。

**O-3 上游三份 LICENSE 的版权行只写 Google Inc.**（W1-C W1C-1，知悉）。现状：Source Serif 4、Noto Sans SC、Noto Serif SC 的 LICENSE 原样复制自上游包，sha256 可核，没有替上游补写版权行。建议维持原样；若要附上各项目自身的 OFL.txt，属于新增下载来源，由 Owner 决定。本验收不对许可合规下结论。

**O-4 secondary/danger 默认 edge 的抬升层是浅墨字面量**（W1-A P2，低）。现状：`0 1px 1px rgba(22,21,15,.04)` 两主题共用，与画板一致，夜间几乎不可见。建议本批维持画板现状；下一次画板修订时改为主题化 token（例如取 s1 的第一层），改契约后重生成即可。这属于对已目视通过的夜间外观的改动，需 Owner 同意。

**O-5 焦点环间隙色是否随承载面变化**（低）。现状：契约注释写「跟随承载面（纸上为 panel）」，包与画板实际都在纸面上显示 bg 色间隙，见 2.1 节观察。建议维持画板现状，把契约注释改成与行为一致；若要间隙随纸面变白，需要改焦点环的声明方式，并在容器上设置 surface，属于视觉改动，需 Owner 同意。

停点（不是待决事项，按 D8 记录）：推送 main、打 tag、发版、部署，以及 Owner 目视验收，都由 Owner 本人做，本分片没有代签任何一项。
