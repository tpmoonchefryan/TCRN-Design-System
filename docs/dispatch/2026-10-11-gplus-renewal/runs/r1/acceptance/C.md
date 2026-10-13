# R1 批末验收 · 分片 C（STORY-128 至 STORY-133）

验收对象：集成工作树 `.worktrees/TCRN-Design-System/init015-gplus-renewal`，分支 `claude/init015-gplus-renewal`，HEAD 4c958f8（批末门跑在 d8586dd，之后只多一笔 dispatch 文档提交）。下文路径相对该树，`R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r1`。

证据写法：「步 NN 日志第 L 行」指批末逐步日志（会话 scratch 的 `r1-verify/NN-<步>.log`，步号同 `R/verify/steps.md`）；「脏回执」指同目录 `receipts-dirty/` 里运行后存档的回执；`file:行` 指 HEAD 上的文件。本验收只读：没有重跑门、没有构建、没有开浏览器、没有改代码、门、回执或链。

结论取值：GWT 为 满足 / 不满足 / 部分 / 阻塞于 Owner；Story 为 通过 / 不通过 / 阻塞于 Owner。返工项编号 C-n；档位按派工规则：改共享契约（token 键集与输出、`contract/*.json`、导出面）或门的判定语义的从主力档起，其余经济档。

## 1. 一览表

| Story | 结论 | 不满足的 GWT | 须落地的返工项 | 项数 |
| --- | --- | --- | --- | --- |
| STORY-128 文档层清零 | 不通过 | GWT3 | C-1 C-2 C-3 C-4 C-5 | 5 |
| STORY-129 矩阵与构图一样板 | 不通过（GWT3 另阻塞于 Owner） | GWT1、GWT2；GWT3 阻塞于 Owner（O-1） | C-6 C-7 C-8 C-9 C-13 C-14 C-19 | 7 |
| STORY-130 画布板到 story 映射 | 不通过 | GWT1 | C-6 C-12 C-13 C-14；样板行另待 O-1 | 4 |
| STORY-131 八项 DOM 测量门 | 不通过 | GWT4 | C-12 C-13 C-14；样板 rail 另待 O-1 | 3 |
| STORY-132 契约静态门 | 不通过 | GWT4 | C-9 C-10 C-11 C-20 | 4 |
| STORY-133 门接入 verify 与 CI | 不通过 | GWT1（部分） | C-2 C-15 C-16 C-17 C-18 C-21 C-22 C-23 | 8 |

去重后返工 23 项，主力档 7 项：C-2、C-3、C-4、C-10、C-12、C-13、C-20（C-11 若要在 `pairs.json` 新定元组名也升主力档）。修复落点在其他分片 Story 的 6 项标「跨分片」：C-10、C-11、C-13、C-14、C-15、C-23；C-20 的组件一半在 STORY-125。批末 11 步红里，10 步与本分片有关，逐条落点见第 4 节；步 6 不属本分片。Owner 事项 5 条见第 5 节，其中 O-1 卡住 129-GWT3、131-GWT4 与 130-GWT1 的样板部分。

## 2. 逐 Story

### 2.1 STORY-128 文档层清零 · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建后 tcrn-* 类与包 CSS 差集为空 | 满足 | 步 12 日志第 28、45 行：`ok: true`、`outOfPackageCount: 0`（reasonCode `DOC_SHELL_CLASSES_PACKAGE_BACKED`）；第 211 行 `newSinceBaseline: []`，首跑基线 171 类全部进 `clearedSinceBaseline`；第 389 行 map `unmapped: []`；第 392–395 行 INC-010 子检查绿（75 个模板类都有定义）。扫描 37 页、1 个脚本包、64 个文档源。 |
| 2 新增 tcrn-foo 判红 | 满足 | 步 12 日志第 13 行 `✔ 128-GWT2: adding one tcrn-foo documentation class turns the gate red`；`doc-shell:proof` 先跑测试再跑门（根 package.json）。 |
| 3 任一 story 组件外观与矩阵一致 | 不满足 | 步 20 日志第 21 行 `ok: false`；第 1252–1261 行 totals：比较 2952、doc-stylesheet 72、package-context 142、未覆盖 1248、failing 72。72 处全在 icons-motion：两种主题各 36 个图标 18px，矩阵同签名 16px；来源 `apps/storybook/src/story-demo-styles.ts:284-289` 的 `.tcrn-doc-icon-sample svg[data-icon-name]`（宽高 18px、颜色 brand-primary，storybook.css 同步副本同）。→ C-1 |

门核对：会红的变异有两条在 verify 内，一是 128-GWT2 测试，二是 doc-sample-style 每次运行自带的文档层变异 `doc-override-button-fill`，批末判红（步 20 日志第 6410 行 `killed: true`）。没有无条件 skip。豁免只有 `tcrn-doc-` 前缀，来自 Story 原文，没有其他登记入口。

GWT 原文没有覆盖到、但违背目的锚（Storybook 只渲染包）和修复项「组件样式删（由包提供）」的三处：

1. **文档 CSS 仍在改包组件外观，现有门都量不到。** `apps/storybook/src/alpha-styles.ts:1230` 的 `.tcrn-shell-brand-lockup .tcrn-brand-wordmark{font-size}` 没挂文档容器，每个 story 里的包 ShellBrandLockup 都被它改了字号；`alpha-styles.ts:647-661` 改文档顶栏里第一批的 brand wordmark；`story-demo-styles.ts:736、1042` 去掉知识库壳样例里包锁定组合的底色、阴影和内距；`alpha-styles.ts:317-325、1208` 给文档顶栏 SearchInput 垫 panel 底、块高 38；`alpha-styles.ts:1160、1213、1223` 复刻了包已定义的 `.tcrn-sr-only`、`.tcrn-skip-link`（包定义在 `packages/ui-react/src/styles/base.css.ts:131、1943、1954`）。doc-sample-style 抓不到这些规则：签名 `span.tcrn-brand-wordmark[]` 的 20 处在 uncoveredSignatures 里（矩阵没有同签名样本），文档顶栏也不是 story。shell-fidelity 的白名单（`scripts/shell-fidelity-proof.mjs:86` 起）还放行 `.tcrn-search-input`、`.tcrn-top-bar`、`.tcrn-field`、`.tcrn-brand-wordmark*`、`.tcrn-product-logo__copy` 作文档规则主体。→ C-1、C-2、C-3
2. **密集与紧凑壳原型按 W3-C 口径删类留元素，现在渲染成无样式的原生元素。** 静态页 `components-navigation-shells.html` 里，`data-shell-pattern="dense-product-nav"` 段 62 个标签中 31 个没有 class，compact 段 78 个中 26 个没有 class，都是裸 `<a>`、`<button>`、`<section>`。连带的批末红：步 30 日志第 258 行 navigation-focused-shells-spec 高 2520px，超出 2000 预算（新增）；第 121 行同一 story 视觉漂移 mean 25.434、maxCell 172，全表最大；W1-F P1 在 `.tcrn-doc-shell-demo--compact` 里测到 top-bar 越界 393px。→ C-4
3. **两条新的 zh-CN 英文泄漏。** W3-C 把字号样本改成 Heading 与 Text 后，text-styles 多出「Page title」「Section title」两条（脏回执 browser-proof-summary 的 `localeLeakScan.zhCn.newLeaks`；步 30 日志第 89 行 `localeLeakZhCnNewLeaks: 2`）。→ C-5

Implementation Notes 要求「清到 0 的那次提交附差集证据」，这一条没有落进提交：清零发生在 a4572d0（合入 W3-C），提交信息里没有差集证据，证据只在 `runs/state.md` 第 57 行和当时的 scratch 日志里。批末再生时把 doc-shell 报告（0，clearedSinceBaseline 171）入仓即可，见第 4 节。

### 2.2 STORY-129 矩阵与构图一样板 · 不通过（GWT3 另阻塞于 Owner）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 格数与画布一致且每格含 data-cell | 不满足 | 步 19 逐行 cells：typography.B 44/44、icon.B 28/28、brand.B 10/10、actions.B 116/116 齐全；inputs.B 声明 42、实际可见 40，两种主题都缺 opt-sel-l、opt-sel-n。静态页里这两格的标记在 MultiSelect 收起的 listbox 里：`matrix-stories.tsx:415` 的 cellEdit 打在不可见的选项上。→ C-6 |
| 2 切到夜间，每格对比度与画布夜间列一致 | 不满足 | 步 18 浅色页运行：夜间块只有 err-msg-n 偏离（实测 6.27，期望 6.88，差 −0.61，阈值 0.05）。夜间页运行：浅色块读到夜间 token，五个矩阵的 contrast 全红（typography 21、icon 13、brand 4、actions 58、inputs 20 格，最大差 4.03；summary 段第 7294 行起）。「夜间切换只改 data-tcrn-theme」成立（步 5 日志第 232 行样板测试）。→ C-13、C-14 |
| 3 侧栏图标左 16、文字 48，纸离边 12 | 阻塞于 Owner | 步 18：十个壳的 rail 全部 fail，guideLefts [16, 49]、textLefts [48, 77]，最大偏差 33px；纸离边 0、顶栏 68（`R/handoff/W5-A.md` 差值表第 2–4 行）。根因在包 ProductShell 的几何，属拆分 P1，待 Owner 裁定。→ O-1 |

目标的其余条款：23 件的分节齐全（步 5 日志第 231 行）；样板用通用产品内容（账单、项目、成员、产品）。批末红里另有四处本 Story 的缺陷：

- **夜间样板块的壳主题按钮没有图标**（W5-A P2）。`packages/ui-react/src/styles/base.css.ts:602-612` 的图标显隐按 `html[data-tcrn-theme]` 写，块级主题够不到；同一组规则也是 132 的 C5 红。→ C-9
- **axe landmark-unique 共 110 个节点，全部在 G+ 页。** 矩阵两块各有一个同名 `<section aria-label="Heading" class="tcrn-surface">`（`matrix-renderer.tsx:106`，92 个节点）；样板两只壳的 nav 与内容区同名（18 个节点）。依据是脏回执 a11y-axe-summary（批末 132 条违规，提交版为 0）。→ C-7
- **步 25 internal-vocab 的唯一命中。** 在 components-gplus-samples：品牌样板表的 Asset ID 列显示 `tcrn-design-system-two-line`，命中 vault-path 规则（步 25 日志第 177–180 行；`composition-one.tsx:292`）。→ C-8
- **步 30 故事高度宽限表有 8 条陈旧记录**（日志第 259–266 行）。宽限表 `scripts/lib/story-budget.mjs:63` 属本 Story 的文件集。→ C-19

批末读数确认已关闭的旧问题：作用域修复之后，浅色页的状态格全部吻合。ck-on、ck-dis、rd-on、sw-on，以及 typography 的 sel、icon 的 ink-wash 与 dis，差值都是 0（步 18 浅色运行的 cells）。W4-A 问题 1、W5-A P3，以及 W5-B 的 P1、P4、P5、P6（err-msg 除外）随之关闭。

口径：拆分 P5「每板一个矩阵 story，23 件各有带标签的分节」可以接受。STORY-130 的用例本身就是 `typography--matrix`。

### 2.3 STORY-130 画布板到 story 映射 · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 映射每行有报告行且八项全绿 | 不满足 | 步 19 日志第 32–33 行：报告带 UTC 与 HEAD d8586dd；第 5336 行 `rowsOk: 0`，22 行全红。原因分四类：矩阵 12 行 dark:contrast（含 logos.A-E、logos.I）→ C-13；inputs.A、inputs.B 浅色 contrast（err-msg）→ C-14；inputs.B 缺格 → C-6；样板 10 行（五个 D 段与五个构图一行）light/dark rail → O-1。 |
| 2 删映射里一个 story 判红 | 满足 | 步 19 日志第 10、19 行，单元测试与构建后测试各一条 130-GWT2。 |

门核对：
- 九条行变异批末全部判红（clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight、overlap）。
- 阈值取 geometry-measure 的 THRESHOLDS，映射文件不带阈值。
- 没有 skip：`--kind`、`--theme`、`--no-mutations` 只供开发期，verify 不带。
- 映射有 22 行；25 条无 story 条目，都带原因与引用；8 条差异都带引用。DIFF-1、DIFF-2、DIFF-3、DIFF-8 待 Owner（第 111 行 differencesPendingOwner）。

问题：
- DIFF-6 的状态还写「待测量库支持」，但 W5-C 已经在测量库加了 before-bg 探针（`R/handoff/W5-C.md`），sw-on 两格批末吻合。并入 C-12 改状态。
- 矩阵行的 controlHeight 与 rail 恒为 n/a（W5-B P8），「八项全绿」里有一项从未实测过。→ C-12
- 已入仓的报告 `docs/verification/storybook-visual-proof/gplus-map-report.json` 停在 ab00f44（2026-10-11T00:55:39Z）。批末运行没有写报告，因为 verify 不带 `--write-report`。R2 之后再生，见第 4 节。

### 2.4 STORY-131 八项 DOM 测量门 · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 选中行首格加 padding-left 8px，行对齐判红 | 满足（载体按拆分 P17 调整） | 步 18 mutations：`row-first-cell-padding`（table-record-index-spec，rowAlign）killed。包里没有 `.tcrn-table`，TableShell 也没有选中行，所以改用首条数据行。注入是把原内距换成 8px，实测起点差 4px，仍判红（W5-C P8）。 |
| 2 mark 加 padding 2px 判红 | 满足 | `mark-padding`（typography-matrix）killed；步 18 日志第 57、63 行。 |
| 3 box-shadow 改 4px 模糊判红 | 满足 | `shadow-blur-4px`（actions-matrix）killed。 |
| 4 现仓矩阵与样板八项全绿 | 不满足 | 步 18 summary（第 7294 行起）：rail fail 33（样板，O-1）；contrast fail 4.03（夜间页浅色块 → C-13；inputs err-msg → C-14）。第 7291 行 `checksNeverApplied: ["controlHeight"]`。五个样板 `notApplicableRequired: ["contrast"]`：样板没有 data-cell，REQUIRED_CHECKS 却含 contrast（→ C-12）。浅色页的 typography、icon、brand、actions 四个矩阵九项全绿。 |

门核对：
- 八项各有红夹具、干净夹具与注入变异，overlap 另算一项（selfCheck coverage `missingRed: []`、`missingGreen: []`，步 18 日志第 147 行；测试 60/60）。
- 阈值写在门里，报告逐项带数值。
- 三条探针（ButtonGroup 焦点环、DatePicker 指示器、Highlight 宽度）批末 pass。
- 没有 skip，也没有豁免登记表；对比度豁免只来自契约的 `exempt`。

补充事实（C-12 的依据）：
- 画布五块 B1 板的 data-cell 数正好等于矩阵格数（44/28/10/116/42）。D 段的壳只带 data-shell 与 data-guide，十块板没有一处 data-h。
- 所以画布上的控件高度这一项同样从未实测过，样板必测 contrast 在画布上也没有依据。
- 样板真正该必测的是 rail，而现在的 REQUIRED_CHECKS 不含 rail（`scripts/geometry-measure-proof.mjs:79-91`，样板只有 ANY_PAGE_CHECKS）。

### 2.5 STORY-132 契约静态门 · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 注入 `.x .tcrn-button:hover{background:#fff}`，C2 红 | 满足 | 步 13 日志第 11 行。 |
| 2 夜间选中态单加 inset 阴影，C5 与 C6 红 | 满足 | 步 13 日志第 12 行。 |
| 3 加 linear-gradient 底，C11 红 | 满足 | 步 13 日志第 13 行；测试 65/65。 |
| 4 现仓全绿 | 不满足 | 步 13 日志第 82–84 行：`CONTRACT_STATIC_C2_RED`、`CONTRACT_STATIC_C5_RED`。C2 共 7 条：`.tcrn-link` 悬停写色、焦点写 box-shadow（dist `tcrnComponentCss` 第 1224–1225 行）；`.tcrn-link--quiet:hover`（第 3166 行）；MultiSelect 选项悬停 (0,3,0) 且写底色，aria-selected 写底色（第 4074–4075 行）；`.tcrn-product-shell .tcrn-search-input:focus-within` (0,3,0)（第 321 行）。C5 共 1 条：`[data-theme-icon="light"]` 只在夜间声明 display（第 1079 行）。C6、C7、C8、C11、C13 绿。→ C-9、C-10、C-11 |

门核对：
- 每条规则各有转红变异：C2.specificity 与 C2.colour、C5、C6 三种、C7、C8、C11 七种。story 层另有 18 条变异各自转红；读不到 story 时判红、不跳过（步 13 测试列表）。
- story 层批末读入 65 个 story（第 114 行），已含矩阵与样板，W4-B Q10 关闭。
- 豁免 12 条（`docs/contract/exemptions.json`）：11 条按后续家族登记，1 条按类登记 LockHint 🔒。每条 `ruling` 都引 INIT-015 scope 不授权段与拆分 P4，LockHint 一条另引 SUB-037 判据。第一批家族不能登记（有测试）。
- EX-INIT015-identity 本次未命中（第 137 行 unusedExemptions），不影响判定。

口径（W1-E P9、W4-B Q9）的判定见 2.7。

### 2.6 STORY-133 门接入 verify 与 CI · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pnpm verify 运行时新门全部执行且有报告 | 部分 | 接线满足：根 package.json 的 verify 含 contract:proof、doc-shell:proof、contract:static、geometry:measure、storybook:visual-proof、doc:sample-style、fonts:render，都排在 build 之后；每条先跑测试再跑门，门各自输出 JSON 报告（批末逐步运行里步 7、12、13、18、19、20、21 都执行并出了报告）。执行不满足：真实 `pnpm verify` 撞第一条红就停，现在停在步 6（06 日志第 131、133、140 行，fonts-proof 三条测试，不属本分片），新门在真实命令下一条都跑不到；逐步运行里另有 10 步红。 |
| 2 单跑 pnpm geometry:measure 只跑该门 | 满足 | `geometry:measure` = `node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs`；W6-A 实测参数能传到门（`contract:static --family actions`）。 |
| 3 CI 配置含 verify | 满足（只写配置） | `.github/workflows/verify.yml`：触发 push 任意分支、pull_request、workflow_dispatch；corepack pnpm 10.12.1，装 Playwright Chromium，跑 `pnpm verify`。没有推送；Linux 上的浏览器门没实跑过（W6-A P8）。 |

目标的其余条款：
- `docs/contract/README.md` 逐门写了判据、阈值、变异与豁免登记方式。
- `docs/style-scale.md` 有 G+ 刻度（圆角 8/12/3 等、控件 28/32/40、字号行高）和文档层豁免表。
- 没加无条件 skip：新门与测试里没有环境变量开关，也没有 skip、todo（grep 为空）；开发期参数不进 verify。

SUB-041/042 的判据「pnpm verify 全绿」没有达到：步 10、11、17、28、30 仍红，落点见第 3、4 节。步 5 test 是绿的（smoke.test.ts 9/9）。

README 五份仍写 `pnpm storybook:visual-proof -- --check`（README.md:85，四份译本第 44 行），`apps/storybook/src/build/foundation-visual-standards.ts:546` 没提新门（W6-A P10）。→ C-22

### 2.7 按建议先做的口径判定

| 口径 | 判定 | 理由与条件 |
| --- | --- | --- |
| W1-D：包组件写出、但包 CSS 没有规则的类不计入包外类（首跑 40 个，批末 39 个，步 12 日志第 48 行） | 可接受 | 这些类由包的已编译组件写出（字面量，或 `tcrn-x--${density}` 一类模板）。Storybook 渲染它们就是在渲染包，符合目的锚 D6。严格读法要求改第二批以后的家族或停写这些类名，INIT 不授权。防滥用的守卫已经有：文档源自己写出的同名字面量照样计数（步 12 日志第 11 行测试）。条件：继续在报告里逐类回显。其中属第一批的只有 `tcrn-multi-select-dropdown__validation`、`__value` 两个，都是无样式钩子。 |
| W4-B C7：title 非空即满足 | 部分可接受 | 作为门的下限可以保留。但 C7 和质量硬线要求加 title，是为了截断后能读到全文。Actions 有 20 处 title 写的是禁用原因而不是标签（W4-B Q9a），标签被截断时读不到全文。第一批的承载元素须收紧为「title 含可见文字」。→ C-20 |
| W5-C：doc-sample-style 只按文档层原因判红，`--strict` 为字面口径 | 可接受，附条件 | 目的锚和 Story 标题都指向文档层。package-context 的 142 处里有比较器自己的假差：签名不含组内位置，ButtonGroup 首尾按钮的圆角被拿去和别的位置比（actions-sample-project 的 Day/Week，8px 对 0px）；mark 的行高跟随父级（20px 对 13px，参照是按钮里的 mark）。默认开 `--strict` 会出假红。条件：①不把 `--strict` 设为默认；②矩阵签名覆盖不到的 1248 处由规则级守卫补（C-3）；③package-context 发现按家族交后续批次（报告已逐条列出）。 |
| W1-E：C2、C6、C11 口径（只含 transparent 的 outline 不算写色；左边条从 2px 起算；没有变体规则的类按 (0,2,0) 比） | 可接受 | 透明 outline 只是强制色模式的焦点环，常态不着色，而且只放行 outline 与 outline-color（`scripts/contract-static-proof.mjs:346`）。2px 阈值只用于一般规则的 C11.left-bar（第 647、649 行）；选中规则的 C6.left-border 不论多宽，只要可见就判红（第 525 行），1px 选中左条漏不掉。(0,2,0) 就是跨包约定 3 的变体特异性（第 104 行），状态规则写色另有 C2.colour 兜住。 |
| W3-C：密集与紧凑壳原型只删类、留元素 | 不可接受（作为终态） | 结果是公开 Storybook 里两组无样式的原生元素，带来新的超高故事（2520px）、全表最大的视觉漂移和 clip 红（2.1 第 2 条）。map 给的处置是 delete-demo。按 C-4 退役原型，并删掉只守护这些原型的断言；结果回显给 Owner，可事后更正（O-4）。 |
| W6-A：verify 新顺序与脚本命名 | 可接受 | 新门全在 build 之后；contract:static 紧跟 doc-shell:proof（C13 取后者的差集）；浏览器门排在 storybook:smoke 之后。脚本名 contract:proof、contract:static、geometry:measure、doc:sample-style、fonts:render 与 SUB-038 判据、133-GWT2 一致；统一「先测试后门」，便于给门传参。提醒：批末逐步运行只把 verify 拆到步，`tokens:proof` 内部仍是 && 链。本次它停在 fonts 测试，后面的 fonts-proof 门本体、stamp-whitelist、shell-fidelity、token-extension、selection-grammar 都没执行，状态未知；其中 shell-fidelity 与 selection-grammar 是 128 的文档层守卫。R2 批末宜把这一步拆到子命令。 |

## 3. 返工清单

**C-1 清除文档层改包组件外观的覆写** · STORY-128 / SUB-025、SUB-026 · 经济档 · 依赖：无
- 现象：步 20 红 72 处，来源 `apps/storybook/src/story-demo-styles.ts:284-289`。另有几条改包外观的文档规则在门的判定面以外：`alpha-styles.ts:1230-1232`（全局改 ShellBrandLockup 字标字号）、`alpha-styles.ts:647-661`、`story-demo-styles.ts:736、784、800、1042`，以及 `alpha-styles.ts:1160、1213、1223` 对包已定义类的复刻。
- 改法：
  - 图标样例改用 Icon 的 size 入参（按 Icon 板取 md 16 或 lg 20），不在文档层覆盖尺寸和颜色；改完跑 `node scripts/demo-styles-sync.mjs` 同步 storybook.css 副本。
  - 删掉全局的 `.tcrn-shell-brand-lockup .tcrn-brand-wordmark` 规则。
  - `.tcrn-doc-global-brand .tcrn-brand-wordmark*` 与 `.tcrn-doc-knowledge-shell__brand` 只留摆放类声明，改外观的声明删去。
  - 删掉 `.tcrn-sr-only`、`.tcrn-skip-link` 的文档副本。
  - `.tcrn-doc-knowledge-shell__actions .tcrn-search-input` 只留摆放。
  - `scripts/shell-fidelity-proof.mjs:86` 起的白名单里，规则删了的条目同步删掉。
- 复核：doc:sample-style、tokens:proof（demo-styles-sync --check、shell-fidelity）、doc-shell:proof。

**C-2 文档壳顶栏搜索框改按包工具形态渲染，同步改壳视觉 oracle** · STORY-128 / SUB-026 与 STORY-133 / SUB-041 · 主力档 · 依赖：无
- 现象：`alpha-styles.ts:317-325、1208` 给 `.tcrn-doc-header-search .tcrn-search-input` 设 38px 块高和 panel 底。由此造成：
  - 步 11 element-inventory 的顶栏搜索框高度离群（样本 32，文档壳 38；步 11 日志第 5 行 baseline.roles）；
  - 步 17 的搜索包裹层作画（W6-B P3）；
  - 步 30 的 firstStoryHashShellParity，以及 mobile layering 的 searchInput 层。
- 同源的陈旧契约：`apps/storybook/src/build/ai-consumption-contract.ts` 的 `storybookDocShellVisualOracle.shellMetrics` 仍记 36px、4px 圆角、描边色。
- 改法：
  - 删掉这两处的块高变量和 panel 底，包裹层不作画，控件取包的 32px、wash 底与 control 圆角。
  - shellMetrics 三项按 G+ token 重写或退役；smoke 与 internal-alpha 里读 searchHeightPx 的比较器改从同一来源取值，不放宽。
- oracle 被标为 Owner 声明的文档壳标准（拆分 P18），收口时列给 Owner 知悉（O-5）。

**C-3 规则级守卫：文档层规则不得改包类外观** · STORY-128 / SUB-028（门） · 主力档 · 依赖：C-1、C-2
- 现象：doc-sample-style 只比得到矩阵里有同签名的样本，未覆盖 1248 处（其中 `span.tcrn-brand-wordmark[]` 20 处）。C-1 里那条全局字标规则躲过了全部门。
- 改法：在 `scripts/shell-fidelity-proof.mjs` 的 docsPackageSelectorDuplication（或 doc-shell-class-proof）加一条规则级检查：三份文档样式源里，凡是主体复合选择器带包类的规则，只准声明摆放类属性（grid-area、order、外边距、自身对齐等），其余属性一律判红；例外只能逐条登记并带裁定引用。同时加一条变异测试，例如注入 `.tcrn-doc-x .tcrn-button{background:red}` 必须判红，接在现有 tokens:proof 链里。

**C-4 密集与紧凑壳原型按 delete-demo 退役** · STORY-128 / SUB-027 · 主力档（删门内断言） · 依赖：无
- 现象：见 2.1 第 2 条。步 30 新增超高故事 2520px，视觉漂移全表最大，并有 clip 红。
- 改法：在同一提交里完成以下三件事，提交信息逐条列出删掉的断言，并引 doc-class-map 的 delete-demo 条目作依据：
  - 从 `apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx` 及对应 story 删掉 dense 与 compact 原型块；
  - 删掉 `apps/storybook/src/smoke.test.ts` 里只守护这些原型的断言（约第 784–817 行，如 `data-shell-layer="mega-menu"`、`data-directory-layout="hub-tiles"`）；
  - 删掉 `scripts/storybook-smoke.mjs` 里同类断言（约第 1016 行起）。
- 备选：Owner 要保留原型，就在第二批用包组件重画（O-4）。

**C-5 SUB-027 残项** · STORY-128 / SUB-027 · 经济档 · 依赖：无
- `apps/storybook/src/build/locales/storybook-content-text.ts`：补「Page title」「Section title」五语，或登记为机器词（步 30 zh-CN 新泄漏 2 条）。
- `scripts/s254-story-dom-proof.mjs:43` 仍查询 `.tcrn-story-disclosure`，`storyExpanded` 恒为 false，应改 `.tcrn-doc-story-disclosure`。该门不在 verify 里，但属 map 的 references。

**C-6 inputs 矩阵的 opt-sel 两格不可见** · STORY-129 / SUB-029 · 经济档 · 依赖：无
- 现象：129-GWT1 与步 19 inputs.B 实际可见 40 格（声明 42）；格标记在收起的 listbox 里（`matrix-stories.tsx:415`）。
- 改法：矩阵里那只 MultiSelect 以静态展开态渲染（用包的展开状态入口；没有的话，用 StaticMarkup 改写展开属性），让选中项可见并带 data-cell。不写文档 CSS。

**C-7 矩阵与样板的 landmark 名重复** · STORY-129 / SUB-029、SUB-031 · 经济档 · 依赖：无
- 现象：axe landmark-unique 110 个节点（见 2.2）。
- 改法：
  - `matrix-renderer.tsx:106`：分节 Surface 的 aria-label 加上本地化的块名（浅色、夜间），或去掉 aria-label，让分节不成为 landmark。
  - `samples/composition-one.tsx`：夜间块壳的 nav 与内容区换不同的可访问名，走 ProductShell 入参；没有入参就用已用于 rail 钩子的 StaticMarkup 改写。新文案五语齐。

**C-8 品牌样板的 Asset ID 列触发内部词扫描** · STORY-129 / SUB-031 · 经济档 · 依赖：无
- `composition-one.tsx:292`：删掉 Asset ID 列，或改显示不含仓库名的标识；不给扫描器加豁免。复核步 25。

**C-9 主题图标显隐挂在 html 级主题上，且只写夜间** · STORY-132 GWT4（C5）与 STORY-129（W5-A P2） · 经济档 · 依赖：无
- 改法：`packages/ui-react/src/styles/base.css.ts:602-612` 删掉三条显隐规则里 `[data-theme-icon]` 的部分，显隐交给主题按钮已有的 `data-current-theme` 透明度规则（`base.css.ts:88-99`）；侧栏图标的规则保留。复核 contract:static C5，并看夜间样板块的按钮图标。

**C-10 文字链接状态改走对表**（跨分片：STORY-123 / SUB-013 的文件） · 为 STORY-132 GWT4 · 主力档（改 `contract/typography.json` 与生成器） · 依赖：无
- 改法按 W4-B Q1、Q2：`docs/design/gplus-2026-10/contract/typography.json` 的链接状态改为状态对，改 `scripts/contract-generate.mjs` 的链接段后重生成；`base.css.ts:2500` 把 `.tcrn-link--quiet:hover` 从与面包屑共用的选择器列表里拿掉，quiet 并入同一对表。复核步 13（C2 减 3 条）与 contract:proof。

**C-11 inputs.css.ts 两处状态规则越级**（跨分片：STORY-126 / SUB-019、SUB-021 的文件） · 为 STORY-132 GWT4 · 经济档（若要在 `pairs.json` 新定元组名则主力档） · 依赖：无
- MultiSelect 选项（`inputs.css.ts:519-520`）：悬停与选中改为只切换生效对，状态包进 `:where()`（Q3）。
- `inputs.css.ts:23` 的 `.tcrn-product-shell .tcrn-search-input:focus-within`：改写成 `:where(.tcrn-product-shell) .tcrn-search-input:where(:focus-within)`，或者删掉（Q4）。
- 复核步 13（C2 减 4 条）。

**C-12 几何门的必测项与测量钩子** · STORY-131 / SUB-035，连同 STORY-129 / SUB-029（data-h）与 STORY-130 / SUB-032（映射） · 主力档（改门的判定配置） · 依赖：无；rail 在 O-1 之前保持红
- 改法：
  - `scripts/geometry-measure-proof.mjs:79-91`：样板的必测项去掉 contrast、加上 rail；有 TableShell 行的样板加 rowAlign。
  - `matrix-stories.tsx`：给 Actions 与 Inputs 矩阵的控件加 data-h（28/32/40）；actions-matrix、inputs-matrix 的必测项加 controlHeight。
  - `docs/design/gplus-2026-10/storybook-map.json` 与 `.md`：对应行的 requiredChecks 同步；DIFF-6 状态改为「测量库已支持 before-bg（W5-C）」。
  - `tests/geometry-measure-proof.test.mjs` 的必测项测试随之改。
- 复核步 18（notApplicableRequired、checksNeverApplied 清空）与步 19。

**C-13 浅色主题 token 块**（跨分片：STORY-120 / SUB-001） · 为 129-GWT2、130-GWT1、131-GWT4 · 主力档（改 token 输出结构） · 依赖：无
- 改法：tokens.css 输出一块 `[data-tcrn-theme="light"]`，取值与 `:root` 的主题相关块相同；storybook.css 的 token 副本经 tokens-sync 同步。token 测试与 contract-static 的 C5 口径都按「light 块 = `:root` 主题块」处理。
- 复核步 18 夜间运行（五个矩阵）与步 19 的 12 行 dark:contrast。

**C-14 Field 错误文字的墨色**（跨分片：STORY-126 / SUB-020） · 为 129-GWT2、130-GWT1、131-GWT4 · 经济档 · 依赖：无
- 现象与改法：`packages/ui-react/src/styles/inputs.css.ts:159-161` 用的是旧名 `--tcrn-color-state-blocked`，契约的 ink 是 `bad`，改为 `var(--tcrn-color-bad)`。err-msg-l 现为 6.20（期望 6.69），err-msg-n 现为 6.27（期望 6.88）。

**C-15 MultiSelect 触发器的末端预留**（跨分片：STORY-126 / SUB-021） · 为 STORY-133 / SUB-042（步 28） · 经济档 · 依赖：无
- 现象：步 28 日志第 30 行，closed-select-family-empty 与 public-popup-family-dark 两例的触发器 padding-right 10px，参照 Select 为 30px；min-height 0，参照 auto（W6-B P6）。
- 改法：在 inputs.css.ts 给触发器补上与 Select 相同的 chevron 末端预留。判据不改。

**C-16 导航壳故事的搜索结果浮层压住正文** · STORY-133 / SUB-042 · 经济档 · 依赖：无
- 现象：步 10 日志第 5 行 searchOverlay 的 baseline 与 restored 都是 ok false。结果面板 420×138、top 230，压住了 h3「Package-backed AOS shell boundary」和后面的段落。
- 改法：调整 `apps/storybook/src/contract-stories/story-content.tsx:2281` 一带的版面，让声称可读的正文落在面板之外。门不改。

**C-17 internal-alpha 的按钮悬停读数时机** · STORY-133 / SUB-041 · 经济档 · 依赖：无
- 现象：步 30 日志第 80 行 `buttonFeedbackOk: false`。读数在悬停后等 80ms（`scripts/internal-alpha-browser-proof.mjs:2567-2568`）就要求精确等于 acc-2。但页面开着 reducedMotion（第 1165 行），减弱动效下按钮底色按 `--tcrn-motion-comprehension` 160ms linear 过渡（`actions.css.ts:213-216`，tokens.css 第 184 行），80ms 时读到的是过渡中途的颜色。这是推断，回执没有留下读数。
- 改法：等过渡结束再读（连读两次相同为止，或等满解析出的过渡时长），或只对这次读数注入 `transition: none`。期望值不变。

**C-18 storybook-smoke 的输出被截断，余红待分诊** · STORY-133 / SUB-041 · 经济档 · 依赖：C-2
- 现象：步 17 日志在 65,750 B 处断在对象中间。原因是 `scripts/storybook-smoke.mjs:3822` 先 console.log 整份 JSON，第 3838 行紧接 process.exit(1)，管道输出被截断。能看到的唯一失败是 productShellComparator 的 `desktop:searchControl:background-color:rgb(255, 255, 255)`（日志第 22 行）。
- 改法：改用 `process.exitCode = 1`，或者把 JSON 写进报告文件；C-2 合入后再看完整失败清单，逐条分诊。

**C-19 故事高度宽限表的 8 条陈旧记录** · STORY-129 / SUB-030（story-budget.mjs 的属主） · 经济档 · 依赖：无
- 现象：步 30 日志第 259–266 行，8 条 recorded-drift：owner-quality-product-shell、frontend-shell-slice、component-family-index、display-primitives-spec、ai-consumption-contract、color-palette、foundation-visual-standards、icons-motion。
- 改法：把 `scripts/lib/story-budget.mjs:63` 起这 8 条的 recordedHeightPx 刷成实测值；变高的条目在收口里逐条列出前后值，供 Owner 知悉（P24，O-5）。新增的超高故事由 C-4 处理，不进宽限表。

**C-20 收紧 C7 的 title 口径（第一批承载元素）** · STORY-132 / SUB-037（门），连同 STORY-125 / SUB-016（Button 的 title，跨分片） · 主力档 · 依赖：门与组件同一轮落地
- 改法：
  - `C7.story-title-missing` 对第一批承载元素改为要求 title 含可见文字（空白规范化后比较）。
  - Button 带禁用原因时，title 写成「标签 — 原因」；或者 title 只写标签，原因走 aria-describedby。
  - `docs/contract/clauses.md` 的 C7 同步改；加一条变异（title 与标签无关时判红）。
- 复核步 13（含 Actions 的 20 处）。

**C-21 文档壳跟随包壳几何（shell:parity 的侧栏与品牌关系）** · STORY-133 / SUB-042 · 经济档 · 依赖：O-1
- 现象：步 11 日志第 5 行 baseline.roles 有三组差异：
  - sidebar：内距 0 对 16/23.04/18/28.8，gap 16 对 0；
  - shell-relations：brandSurfaceLeft 20 对 0，navItemLeft 0 对 28.8 等；
  - brand-lockup：surfaceTopGap 13.84 对 0。
- 改法：按 D6，文档站自己的壳（alpha-styles.ts 里的 tcrn-doc-* 外框）跟随包壳几何。等 O-1 定下包壳几何后一次对齐；shell:parity 的判据不改。

**C-22 门命令文字残留** · STORY-133 / SUB-040 · 经济档 · 依赖：无
- README.md:85 与 `README.{zh-CN,ja,ko,fr}.md` 第 44 行：改成 `pnpm storybook:visual-proof`，并指向 `docs/contract/README.md` 的门清单。
- `apps/storybook/src/build/foundation-visual-standards.ts:546`：写明新门。
- 版本行不动（SUB-043 管）。

**C-23 SearchInput 快捷键提示的墨色低于 C1 文字阈值**（跨分片：STORY-126 / SUB-020） · 为 STORY-133（步 30 axe） · 经济档 · 依赖：无
- 现象：脏回执 a11y-axe-summary 里，`kbd.tcrn-search-input__shortcut` 夜间 3.89–3.9（#85827a 对 #272724、#282724，10px），共 52 个节点；C1 要求文字 ≥ 4.5。
- 改法：快捷键文字改用 ink-2，或其他夜间达到 4.5 的 token。若 Inputs 板本身就画成 ink-3，则与 C1 冲突，转交 Owner，并入 O-3 一起定。

分包提示（供 R2 拆分参考，按共用文件归组）：
- C-1、C-2、C-3：文档样式源与 shell-fidelity。
- C-4、C-5、C-16：story-content、原型与冒烟断言。
- C-6、C-7、C-12：矩阵与样板文件；C-12 另带几何门与映射。
- C-11、C-14、C-15、C-23：都在 inputs.css.ts，跨分片。
- C-17、C-18：都是浏览器门脚本，C-18 等 C-2。
- C-9、C-10：都碰 base.css.ts。
- C-13：单独成包。

## 4. 批末红步骤落点与生成物

| 步 | 门 | 落点 |
| --- | --- | --- |
| 6 | tokens:proof | 不属本分片：STORY-121 的 fonts-proof 测试三条红（06 日志第 131、133、140 行）。连带影响：后段子门（shell-fidelity、selection-grammar 等）批末没执行，见 2.7 末行。 |
| 10 | geometry:proof | C-16 |
| 11 | shell:parity | C-2（顶栏搜索框高度离群）；C-21（侧栏与品牌关系，待 O-1） |
| 13 | contract:static | C-9（C5）；C-10、C-11（C2）；C-20 是收紧口径，落地后需复核 |
| 17 | storybook:smoke | C-18（截断与分诊）；C-2（搜索包裹层作画） |
| 18 | geometry:measure | C-12、C-13、C-14；样板 rail 待 O-1 |
| 19 | storybook:visual-proof | C-6、C-12、C-13、C-14；样板 10 行待 O-1 |
| 20 | doc:sample-style | C-1 |
| 25 | internal-vocab:scan | C-8 |
| 28 | full-surface:proof | C-15 |
| 30 | internal-alpha:proof | 本分片：C-17（buttonFeedback）、C-5（zh-CN 新泄漏 2 条）、C-4（新超高故事、最大视觉漂移）、C-19（8 条陈旧宽限记录）、C-7（landmark-unique 110 个节点）、C-23（kbd 对比度）、C-2（firstStoryHashShellParity）。待 Owner：O-3（锁定组合后缀与标语的对比度）。不属本分片：clippedButtonText（G+ 标题截断盒，STORY-123，W6-B P7）；storyCoverageManifest 与 browserProofSummary 回执、视觉签名回归 155 与新基线 30（SUB-046，按 M6 排到 R2 之后）；其余 color-contrast（如 visual-instances 的 reduced-motion 实例 12 个节点）与 aria-allowed-role 4 个节点（`.tcrn-card--neutral[role="status"]`）按 a11y 摘要交对应家族分诊。 |

生成物与证据（批末再生，不计返工；按 M6 放在 R2 合入之后一次做）：
- `node scripts/storybook-visual-proof.mjs --write-report`：现入仓报告停在 ab00f44。
- `node scripts/geometry-measure-proof.mjs --write-report`：现入仓报告来自 W5-C 包树。
- doc-shell 清零证据（0，clearedSinceBaseline 171）写进 `docs/verification/doc-shell-class/`，补上 128 的 Implementation Notes。
- 批末逐步运行把 tokens:proof 拆到子命令。

## 5. 只有 Owner 能定的事项

**O-1 构图一的壳层几何是否算 G+ 底盘、纳入 INIT-015**（拆分 P1；映射 DIFF-1）
- 卡住的项：129-GWT3、131-GWT4 的样板 rail、130-GWT1 的 10 个样板行，以及 C-21。
- 现状：样板引导列 16/49/77，纸离边 0，顶栏 68；构图一要求 16/48、12、52。
- 建议：按 D1「页面构图采用构图一」授权，只改 ProductShell 的这几项几何：引导列 16/48、纸离边 12（带 14 圆角与 s1）、顶栏 52、侧栏画布色且无右边线、收起 52。Navigation 家族的其余行为仍留第二批。
- 不授权的话：请把 129-GWT3 与 127-GWT4 的 52px 部分移到 Navigation 批次，样板行的 rail 改按包现有几何记差异。

**O-2 映射里另外三条待裁差异**
- DIFF-3：画布内部两处不一致（212/48 对 220/52），建议以构图板的 220/52 为准。
- DIFF-2：构图三没有 story，建议随 O-1 一起定。授权的话下一轮补一个构图三样板；否则记到页面模板批次。
- DIFF-8：产品标的六档尺寸阶梯与贴片没有 story，建议放到第二批品牌。
- DIFF-7（因高度预算把并排改为上下叠放）只需知悉。

**O-3 产品锁定组合文字的对比度**（D2、D5；夜间后缀色是拆分 P15 的待裁项）
- axe 在品牌后缀和标语上报 color-contrast：
  - DS 后缀 #6577f3：对白 3.82，对文档顶栏 #ecf4f3 3.42，对样板侧栏 #dde4df 2.95；
  - 夜间 TMS 后缀 #2c63c8 对 #191916：3.12；
  - 标语与壳锁定组合说明 #85827a 对 #172421：4.17。
- 建议：
  - 裁定锁定组合里的后缀与标语属于商标字标（WCAG 1.4.3 的 logotype 例外）。internal-alpha 的 axe 只对这几个锁定组合文字选择器按此裁定排除色彩对比规则，并在门里写明裁定引用。
  - 夜间后缀改用 D5 中同产品标的浅色（TMS #7aa0f5，其余由 Owner 指定）。
  - C-23 若查明 Inputs 板本身画的就是 ink-3，一并在此定。

**O-4 事后可更正：C-4 退役密集与紧凑壳原型，并删掉守护它们的断言**
- 这些断言是旧 Story 留下的冒烟判据，map 给原型的处置是 delete-demo。
- 建议照做。若 Owner 要保留原型，改为第二批用包组件重画。

**O-5 知悉**
- C-2 改写文档壳视觉 oracle：AI 契约把它标为 Owner 声明的原文档壳标准（拆分 P18），这次随 G+ 整体替换。
- C-19 刷新 8 条宽限记录，其中变高的条目逐条列出前后值（拆分 P24）。
