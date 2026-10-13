# R3 批末验收 · 分片 C（STORY-128 至 STORY-133）

节行号：§1 一览 第 11 行；§2 逐 Story 第 26 行（2.1 第 28、2.2 第 42、2.3 第 57、2.4 第 72、2.5 第 86、2.6 第 97 行）；§3 返工清单 第 121 行；§4 Owner 事项 第 159 行；§5 实施口径 第 175 行；§6 证据盲区 第 213 行。

验收对象：集成工作树 `.worktrees/TCRN-Design-System/init015-gplus-renewal`，分支 `claude/init015-gplus-renewal`，HEAD a3f1893。被验代码是 3f9d658：批末逐段 verify 与真实 `corepack pnpm@10.12.1 run verify` 都跑在这里（`verify.meta` 记 `verify_exit=0`、`storybook_build_exit=0`）。其后 a3f1893 只改 `docs/dispatch/` 下的调度文档，`git diff --name-only 3f9d658 HEAD` 除 `docs/dispatch/` 外为空。下文 `R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r3`，其余路径相对工作树。

证据写法：「NN log:L」指会话 scratch `r3-verify/` 下逐段日志第 L 行（段号同 `R/verify/steps.md`）；「verify.log:L」指会话 scratch `r3-final/verify.log`（真实 verify 的整段输出）；「file:行」指 HEAD 上的文件。本验收只读：没有重跑门、构建、开浏览器，没有改代码、门、回执或链；探查脚本与输出只在会话 scratch `tmp/r3-acc-C/`。

结论取值：GWT 为 满足 / 不满足 / 部分 / 阻塞于 Owner；Story 为 通过 / 不通过 / 阻塞于 Owner。O-1…O-4 按设计会话 B 类裁定判，O-5…O-12 按默认判（摘录第 5 节）。130 的判定人是 Owner，本文件只给机器判据结论；129 的「Owner 目视」另行，不代签（R2 判断 §3.3 第 9 条）。返工编号 C3-n，档位按摘录第 7 节。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 相关返工项 | 项数 |
| --- | --- | --- | --- | --- |
| STORY-128 文档层清零 | 通过（R2 已判，R3 重验无回退） | — | C3-4（不影响 GWT 结论） | 1 |
| STORY-129 矩阵与构图一样板 | 通过（机器判据；Owner 目视另行，不代签） | — | C3-3（目视清单补一条） | 1 |
| STORY-130 画布板到 story 映射 | 阻塞于 Owner（判定人为 Owner；两条 GWT 的机器判据都满足） | — | C3-1（报告标签）、C3-2 | 2 |
| STORY-131 八项 DOM 测量门 | 通过 | — | — | 0 |
| STORY-132 契约静态门 | 通过（R2 已判，R3 无回退） | — | — | 0 |
| STORY-133 门接入 verify 与 CI | 通过 | — | C3-1（目标条款「文档列出每门的判据、阈值、变异」） | 1 |

去重后返工 4 项，全部经济档（C3-1…C3-4），没有主力档；四项都是各自目标的第一次返工，不升档，也没有一项改变本分片任何 GWT 的结论。

R2 本分片的四处 GWT 缺口都已关闭：129-GWT3、130-GWT1（样板 10 行）、131-GWT4 随 O-1 落地（SUB-090、SUB-094）转为满足；133-GWT1 由「部分」转为满足——真实 `pnpm verify` 在 3f9d658 跑完 30 步、退出 0。R2 不归 Owner 的四项红（第 10 步 searchOverlay、第 17 步焦点宽度 14 条、第 30 步锚点遮挡、zh-CN 3 条新漏译）与待 O-1、O-2 的红（第 11、18、19 步，axe 12 条）都已消。

## 2. 逐 Story

### 2.1 STORY-128 文档层清零 · 通过（R3 重验无回退）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建后 tcrn-* 类与包 CSS 差集为空 | 满足（R3 重验） | 12 log:28–29 `ok: true`、`DOC_SHELL_CLASSES_PACKAGE_BACKED`；log:45 `outOfPackageCount: 0`；log:211 `newSinceBaseline: []`；log:389 `unmapped: []`；log:392–393 模板类子检查绿。真实运行 verify.log:879、896 同值。13 log:95 C13 0 发现。R3 新增的构图三 story 与 SUB-100 恢复的 `tcrn-doc-product-shell-search--static-display`（`docs/design/gplus-2026-10/doc-class-map.json:39` 改为 rename-tcrn-doc）都没有带出包外类。 |
| 2 新增 tcrn-foo 判红 | 满足（R3 无回退） | 12 log:13 `✔ 128-GWT2: adding one tcrn-foo documentation class turns the gate red`。 |
| 3 任一 story 组件外观与矩阵一致 | 满足（R3 重验；按 R1 已判可接受的 W5-C 口径） | 20 log:21 `ok: true`；log:1270–1278 compared 2972（R2 2868）、docStylesheet 0、storyInlineStyle 0、failing 0；文档层变异 `doc-override-button-fill` killed（log:4980–4988，failing 7）。规则级守卫 06.10 log `packageClassAppearance: 0`、`docExceptionsUnused: 0`。 |

本 Story 范围内的余项（不改变 GWT 结论）：

- R3 为知识库样板新登记 4 条文档作用域例外（`scripts/shell-fidelity-proof.mjs:340–371`，R3M5 方案 A）。其中 `EX-INIT015-doc-knowledge-shell-side-nav` 放行的 `background` 是填色属性，文档 CSS 因此改了包 SideNav 的底色；TopBar 一条让独立 TopBar 在知识库样板里显示为 52，而构图三样板里同一个独立 TopBar 按包默认显示为 68（DIFF-2）。这几件属 Navigation 家族，不在 23 件矩阵里，GWT3 不比对；但与本 Story 目的锚「Storybook 只渲染包」相抵。口径见 §5 第 19 条，处置见 C3-4 与 §4 第 1 条。
- `docs/verification/doc-shell-class/r2-clearance.md` 的两项旁证读数已过时（静态命中 1 → 0、扫描源文件 64 → 66；P4 问题 2），差集没变。口径见 §5 第 28 条。
- R3 没有落到本 Story 的 Subtask（R3-13 挂 134；R3-18 即 SUB-103，挂 133）。链上本 Story 仍为 active（R2 判断已定转 done，受 RM20 影响），本验收未用引擎核对。

### 2.2 STORY-129 矩阵与构图一样板 · 通过（机器判据；Owner 目视另行）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 格数与画布一致且每格含 data-cell | 满足（R3 重验） | 19 log 五个 B 行（起于 log:436、927、1418、1913、2407）两种主题的 cells：typography 44、icon 28、brand 10、actions 116、inputs 42，expected = rendered = declared，missing 0、duplicated 0、expectMismatches 0。07 log:30 `matrix-expect: 5 boards, 240 cells (44/28/10/116/42)`。SUB-091 改 MultiSelect 后 inputs 仍为 42/42。 |
| 2 切到夜间测量，每格对比度与画布夜间列一致 | 满足（R3 重验） | 同五行在浅色页与夜间页两轮的 contrast 都是 pass、最差值 0；18 log 五个矩阵夜间轮 ok，summary contrast pass（log:7165）。TMS 夜间后缀改为 #7aa0f5（SUB-088）后 brand 行仍 10/10。 |
| 3 侧栏图标左 16、文字 48，纸离边 12 | 满足（O-1 落地） | 18 log：五个样板 × 两主题共 10 个 run，rail 与 shellFrame 都是 pass、偏差 0（如 typography-sample-billing 浅色 log:3429、3494；inputs-sample-members 夜间 log:6812、6877）；summary rail pass、worstValue 0（log:7153），shellFrame pass、worstValue 0（log:7177）；阈值 rail 16 / 48、shellFrame 纸离边 12 与顶栏 52，容差都是 0.5（log:81 起 thresholds）。纸离边按构图板 `.sheet{margin:12px 12px 12px 0}`（`docs/design/gplus-2026-10/boards/V2-GPlus-Compositions.dc.html`）量上、尾、下三边，起始边贴侧栏不量。R2 的 guideLefts [16, 49]、textLefts [48, 77] 已消。 |

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-090 | 达成 | `docs/design/gplus-2026-10/contract/tokens.json:59、77–79` 新增四个壳层 token（220、52、52、14，沿用判断建议的名字）；`packages/ui-react/src/styles/base.css.ts:159、172` 局部变量的默认值与收起值改引宽度 token，:294 壳顶栏 min-height 引 topbar token，:552 起构图一几何限定在 `@media not all and (max-width: 760px)`，:569 纸面圆角引 radius-paper；composition-one.tsx 不再有 220 覆写；独立 TopBar 仍为 68（P1 交回 §4）。读数见 GWT3。ui-react 163/163（05 log:220–223）。 |
| SUB-091 | 达成（第二次返工，主力） | `packages/ui-react/src/styles/inputs.css.ts:521` 为 flex column + stretch；28 log:16–19 测试 11/11，log:34–36 multiSelectDropdown ok；18 log inputs-matrix 两轮 ok、controlHeight pass；19 log inputs.A、inputs.B 两种主题 ok。「列表在触发器下方、同宽」取自 P5 交回的浏览器实测（偏移 0、宽差 0、左缘差 0），本验收未复测（§6）。静态 0 与运行时 8px 的间距差已列在 owner-acceptance.md:174。 |

目视另行（不代签）：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md:73` 构图一壳几何、:174 MultiSelect 复核。另 P1 交回 §7（`R/handoff/P1.md:79`）实测 1024 宽下样板纸面约 406、工具行折行、壳顶栏长到 147，目视清单没有这条 → C3-3、§4 第 2 条。

### 2.3 STORY-130 画布板到 story 映射 · 阻塞于 Owner（判定人；机器判据都满足）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 映射每行有报告行且八项全绿 | 满足（机器判据） | 19 log:32–33 报告带 UTC 与 HEAD 3f9d658；log:114 rowsInScope 23；log:4066–4067 rowsOk 23、redRows []。23 行含五个 D 段与构图一五行（requiredChecks 为 rail、shellFrame，带表格的四个另测 rowAlign）和新加的构图三一行（任意页四项 clip、singleLine、shadowBlur、overlap）。log:3982 起 ROW_MUTATIONS 10 条全部 killed，含新加的 `shell-frame-sample-paper-flush`（log:4056）。map problems 为 []（log:118），differencesPendingOwner 为 []（log:117），notInMap 为 []（log:272）。真实运行 verify.log:38356–38357、42389 同值。 |
| 2 删掉映射里一个 story 判红 | 满足（R3 重验） | 19 log:10（单元测试）、log:19（构建后测试）；测试 16/16（log:21–24）。 |

差异记录核对（`docs/design/gplus-2026-10/storybook-map.json` 的 differences 10 条，.md 同步）：DIFF-1「已按 O-1 实现（设计会话 B 类裁定）」，refs P1、O-1；DIFF-2「已裁定：构图三样板随 O-1 补（O-4）」，refs P1、COMP、O-4，story 文字写了独立 TopBar 68 对板 56、导航在搜索之后、SubNav 胶囊、1024 下折 4 行；DIFF-3「已裁定：以构图板 220/52 为准（O-4，设计会话 B 类）」；DIFF-7、8、9「待 Owner 知悉」各带 refs；DIFF-10「已裁定（O-3，设计会话 B 类）」。目标「差异为 0 或逐条有裁定引用」机器侧满足。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-092 | 达成 | `apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx` 只用包组件，内容宽 1040 写在样板（:33），无 [data-shell]、无新 token；doc-shell 包外类 0（12 log:45）；storybook 测试 10/10（05 log:242–245）；zh-CN 新漏译 0（30.02 log:42）、高度违例 0（30.02 log:38）；contract:static、doc-shell:proof 绿。余项：gplus-samples 类目说明仍写「第一批五个家族在构图一产品外壳中」，没覆盖构图三（`apps/storybook/src/contract-stories/governance.ts:61`）→ C3-2。 |
| SUB-093 | 达成（包自报的测试 15/16 已由 I-P2b 消除，实测 16/16） | 差异按裁定改完（见上段）；`storybook-map.md:10–11`「读法」与 :64「十一个 story 全部被引用」、`scripts/storybook-visual-proof.mjs:62–65` 注释已改；visual-proof 脚本 ok。 |
| SUB-076 | 达成 | `docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md` 再生于 d8927a9（报告记 HEAD e58937d，其后到 3f9d658 只改预算、基线、回执与文档，不改映射内的 story）：23/23、redRows []、全文无 O-1 注记。余项：`.md` 第 9 行「八项测量」后面列了九个检查名，生成器 `scripts/storybook-visual-proof.mjs:491` 的标签没有随 shellFrame 改 → C3-1。 |

### 2.4 STORY-131 八项 DOM 测量门 · 通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 选中行首格加 padding-left 8px，行对齐判红 | 满足（R3 重验） | 18 log:7026 `row-first-cell-padding`（rowAlign，131-GWT1）status fail、value 4、killed。 |
| 2 mark 加 padding 2px 判红 | 满足（R3 重验） | 18 log:7036 `mark-padding` killed。 |
| 3 box-shadow 改 4px 模糊判红 | 满足（R3 重验） | 18 log:7046 `shadow-blur-4px` killed。 |
| 4 现仓矩阵与样板全绿 | 满足（O-1 落地） | 18 log:84 `ok: true`；22 个 run（11 个 story × 两主题）全部 ok，notApplicableRequired 全空，checksNeverApplied 为 []（log:7139）；summary 十项全 pass（log:7140–7182）；selfCheck ok，coverage 的 missingRed、missingGreen 为空（log:157–162）；测试 68/68（log:73–76）；probes 四项 pass，iconStroke 查 74 枚（log:7086 起）。真实运行 verify.log:31214、31225 同值。按 SUB-094 判据，正文的「八项」读作全部必测项，现为十项。 |

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-094 | 达成 | THRESHOLDS 有 shellFrame（12、52、0.5）；变异 `shell-paper-inset-zero`（log:7066，偏差 12）与 `shell-top-bar-68`（log:7076，偏差 16）都 killed；夹具红绿与两条干净页变异（log:46–49）；样板 10 行的 requiredChecks 含 shellFrame。余项：`docs/contract/README.md` 几何门一节没随本单更新 → C3-1。 |
| SUB-078 | 达成（判据字面「probes 含 shellFrame」按检查项读） | `docs/verification/geometry-measure/report.json`（df4ba02）：probes 四项，无 shellFrame——它是第十个检查项，不是探针；summary.shellFrame pass、worstValue 0；checksNeverApplied 为 []；notApplicableRequired 非空的 run 0 个；全文无 O-1。P4 问题 1 自报同此，实测一致。 |

### 2.5 STORY-132 契约静态门 · 通过（R3 无回退）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 注入 `.x .tcrn-button:hover{background:#fff}`，C2 红 | 满足（R3 无回退） | 13 log:11。 |
| 2 夜间选中态单加 inset 阴影，C5 与 C6 红 | 满足（R3 无回退） | 13 log:12。 |
| 3 加 linear-gradient 底，C11 红 | 满足（R3 无回退） | 13 log:13；测试 69/69（log:74–77）。 |
| 4 现仓全绿 | 满足（R3 重验） | 13 log:85–95 `ok: true`、`CONTRACT_STATIC_CLAUSES_HOLD`，七个条款 0 发现；story 层读入 66 个 story（R2 65，多出构图三），markupErrors 0（log:115–116）；C7 豁免 1630（R2 1602），全部落在后续家族条目（log:189–197）；未用豁免仍只有 EX-INIT015-identity（log:138–140，同 R2）。真实运行 verify.log:1334–1335 同值。 |

R3 没有落到本 Story 的 Subtask；R3-16（title 半译）挂 134，不在本分片。链上仍为 active（同 128）。

### 2.6 STORY-133 门接入 verify 与 CI · 通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pnpm verify 运行时新门全部执行且有报告 | 满足（R2 部分 → R3 满足） | `verify.meta`：3f9d658，`verify_exit=0`（22:28:47Z–22:38:07Z）。verify.log 里各新门都执行并出报告：contract:proof 起于 :629；doc-shell:proof :853（ok :879，outOfPackageCount :896）；contract:static :1251（:1334–1335）；geometry:measure :31143（测试 68 于 :31214，ok :31225）；storybook:visual-proof :38325（测试 16 于 :38344，HEAD 与 ok :38356–38357，rowsOk 23 于 :42389）；doc:sample-style :42406（ok :42425）；fonts:render :47862。逐段 30 步 44 段全绿（`R/verify/steps.md`）。R2 四项非 Owner 红的去向：第 10 步 searchOverlay 的 baseline、restored ok，openMenus 6，broken 判红（10 log:5）；第 17 步 ok，focusComparatorSelfCheck ok，焦点宽度失败 0 条，三个子证明 ok、failures 0（17 log:6–8、52–53、4169–4170、12383–12384）；第 30 步锚点遮挡见 SUB-099；zh-CN 新漏译 0（30.02 log:42）。待 O-1、O-2 的红：第 11 步 shell:parity ok（19 个角色全绿，brandLockup 矩阵 4/4，红后转绿成立；11 log:5），第 18、19 步见 131、130，axe 违规 0（30.02 log:12）。 |
| 2 单跑 pnpm geometry:measure 只跑该门 | 满足（沿用 R2，R3 无回退） | package.json 与 `.github/` 从 R2 验收的 6630655 到 3f9d658 没有改动；`geometry:measure` 仍为 `node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs`（18 log:2–3）。 |
| 3 CI 配置含 verify | 满足（只写配置，沿用 R2） | `.github/workflows/verify.yml` 未改：push、pull_request、workflow_dispatch 触发（:10–14），corepack pnpm 10.12.1，:59 跑 `pnpm verify`；未推送。 |

目标其余条款：「文档列出每门的判据、阈值、变异与豁免登记方式」——`docs/style-scale.md` 已按现状改写（SUB-103）；`docs/contract/README.md` 的几何门与映射门两节没有随 shellFrame（R3）与 iconStroke 探针（R2）更新 → C3-1，不影响 GWT。

另记（交判断，R3M7）：真实运行与逐段运行后工作树都多出 `no-overclaim-scan.json` 的 scannedFiles 643 → 646 与未跟踪的 `visual-selection-result.json`，已存档并还原；退出码不受影响。verify 跑完工作树不干净，与 R2 同类。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-095 | 达成 | `apps/storybook/src/build/locales/storybook-content-text.ts:1309` 的键与五语值为 32px；30.02 log:42 新漏译 0。 |
| SUB-096 | 达成 | `docs/contract/README.md:68` 写明 internal-alpha 的 clipped 判定接受最近带 title 的祖先、与收紧后的 C7 不同；`docs/design/gplus-2026-10/README.md:11` 加「浅色选择器由契约夜间选择器的属性派生」，:12 Inputs 文本类补 rf，:16 补 29 条刻度 token 与链接对表；`docs/contract/roles.json` 的 description 写明第一批承载元素的 title 须含可见文字。readme:proof、public-output、internal-vocab、contract:static 绿（22、24、25、13 log）。 |
| SUB-097 | 达成 | `packages/ui-react/src/styles/generated/inputs.pairs.ts:5` 注释为 d/h/f/x/r/rf/e/ef；07 log:24 generated-sources PASS。 |
| SUB-098 | 达成（包自报部分；冒烟退出 1 的来源路径问题由 I-P2b 修掉，实测退出 0） | `scripts/storybook-smoke.mjs:2004–2019` 的 `focusStyleMismatches` 在两侧 outline-style 都为 none 时跳过宽度与偏移，:2130 是 validateMetric 里唯一的焦点比较；自检 :2021 起三例，:3840 在开浏览器前运行；17 log:6–8 ok。 |
| SUB-099 | 达成 | `scripts/internal-alpha-browser-proof.mjs:48` 起两个循环共用层判定，:62 自检；回执 `docs/verification/internal-alpha/story-coverage-manifest.json` 的 mobileHashAnchorOcclusionCheck ok，layerSelfCheck 三例 ok，四次回读 failures 为空；30.02 log:34 storyCoverageManifestOk true。 |
| SUB-100 | 达成（第二次返工，主力；承接 SUB-080） | 10 log:5 searchOverlay baseline、restored ok，openMenus 6，broken 判红；16a15b3 的提交说明逐个列出 6 个菜单，并说明原 8 个减去的是两个原型菜单钮；`apps/storybook/src/contract-stories/story-content.tsx:2256` 用 tcrn-doc- 前缀类，`apps/storybook/src/alpha-styles.ts:1160` 是规则，例外登记在 `scripts/shell-fidelity-proof.mjs:332–338`；12 log:45 包外类 0；06.10 log docExceptionsUnused 0。SUB-080 可随 R3 链写转 done。 |
| SUB-101 | 判据读数达成，带偏差（包自报部分，R3M5 续派后完成） | shell:parity ok：19 个角色全绿，含 package-topbar、package-group-title、package-nav-item、sidebar-surface、brand-lockup、sidebar、shell-relations；brandLockup 4/4；样板四个矩阵全绿；红后转绿成立（11 log:5）。两条暂缓例外与 JUDGMENT_C21 已删（`shell-fidelity-proof.mjs` 无命中）；oracle 侧栏 220、顶栏 52（`apps/storybook/src/build/foundation-visual-standards.ts:612` 一带）；axe 0、豁免节点 80（30.02 log:12–13），O-2 的三类节点没有出现，未加豁免。做法与偏差（方案 A 的四条新例外、品牌锁定组合 38 标与文案起点 66、文档页无纸面、样板顶栏描述截成一行）见 §5 第 19–26 条与 §4。 |
| SUB-102 | 达成 | `scripts/shell-fidelity-proof.mjs:282–290` 承载类名单从 roles.json 读，:403–407 对承载类不把换行属性算作摆放；自检 :637–641 三条（两条判红，一条摆放不红），:670 每次运行都调用；06.10 log 0 发现。 |
| SUB-103 | 达成 | `docs/style-scale.md:179–200` 门清单与守卫描述按现状（含 C7 承载类排除），:259 起的登记例外含 SUB-100 一条、方案 A 四条，:286 记删除的两条；`foundation-visual-standards.ts` 无 pre-INIT-001、INIT-002；`scripts/lib/story-budget.mjs:120–126` color-palette 说明为 73 格；24、25 log 绿；zh-CN 新漏译 0。 |

## 3. 返工清单

**C3-1　门文档与报告标签没有随第十个检查项 shellFrame（及 R2 的 iconStroke 探针）更新**

- 现象：`docs/contract/README.md` 几何门一节写「九项检查都要在某个 story 上适用」「STORY_PROBES 三条」「STORY_MUTATIONS 在真实 story 上注入四条变异」「测试现有 60 条」，阈值表没有 shellFrame 行；映射门一节写「九项检查」「ROW_MUTATIONS 九条」。生成的映射报告 `.md` 第 9 行「八项测量」后面列了九个名字。
- 证据：README.md:89–90、93–103、105、116、119；18 log:73（测试 68）、7024–7085（STORY_MUTATIONS 6 条）、7086–7138（probes 4 项）；19 log:3982 起（ROW_MUTATIONS 10 条）；`gplus-map-report.md:9`；`scripts/storybook-visual-proof.mjs:36、491`。README 最后一次改在 a731c6a（SUB-096），早于 SUB-094。
- 建议改法：README 两节按门现状改：十项检查；四个探针（加 iconStroke）；阈值表加 shellFrame（ProductShell 根内纸面离壳上、尾、下 12，壳顶栏 52，容差 0.5，起始边贴侧栏不量）；STORY_MUTATIONS 六条（加 shell-paper-inset-zero、shell-top-bar-68）；ROW_MUTATIONS 十条；测试条数不写死或写现值。报告标签把「八项测量」改成不带数字的说法，只改 :491 的字串，JSON 字段 `eightMeasurements` 不改名；报告随批末 SUB-076 再生，不手改。
- 改动文件：`docs/contract/README.md`；`scripts/storybook-visual-proof.mjs`（只改第 491 行标签）；批末再生 `docs/verification/storybook-visual-proof/gplus-map-report.md`。
- 建议档位：经济（文档与标签，判定不变）。R2 未改过同一目标（R2 C2-6 是 style-scale.md；R3 SUB-096 只改 README 第 47 行一带）。
- 归属：133 目标条款；133 若先转 done，按 R2 判断 §3.3 第 11 条的做法挂 134。

**C3-2　gplus-samples 类目说明没有覆盖构图三**

- 现象：类目说明是「The first five component families in a composition-one product shell, light and night.」，构图三（无侧栏、顶部导航）已登记在这个类目里，说明对它不成立。
- 证据：`apps/storybook/src/contract-stories/governance.ts:61`；该串的五语词条在 `apps/storybook/src/build/locales/storybook-content-text.ts:2054`；R3M2 记 P0「授权外未做：gplus-samples 类目说明过时」。
- 建议改法：改写说明，同时覆盖构图一五个样板与构图三的顶部导航页；五语词条同步改键与值，不带工单键。局部门：design-system-storybook test、internal-alpha（zh-CN 新漏译 0，跑完还原回执）、internal-vocab:scan。
- 改动文件：`apps/storybook/src/contract-stories/governance.ts`；`apps/storybook/src/build/locales/storybook-content-text.ts`（以词条实际所在文件为准）。
- 建议档位：经济（文案，判定不变）。第一次返工。
- 归属：130（SUB-092 余项）。

**C3-3　目视清单缺 1024 宽下构图一样板的读数**

- 现象：P1 交回 §7 实测 1024 宽下样板纸面约 406 宽、工具行折行、壳顶栏长到 147。几何门与映射门只在 1440×900、en 下量（18 log 的 run.viewport；19 log 的 scope），owner-acceptance 的「已知差距」没有这条，Owner 在窄桌面目视时没有上下文。
- 证据：`R/handoff/P1.md:79`；`owner-acceptance.md:73、78`。
- 建议改法：在 `owner-acceptance.md:78`「已知差距」加一句：1024 宽下文档页里的样板受文档侧栏挤压，纸面约 406 宽，工具行折行，壳顶栏高到 147；门只量 1440。只写事实，不代勾选。
- 改动文件：`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`。
- 建议档位：经济（文档）。第一次返工。
- 归属：129（目视）。

**C3-4　知识库样板没有交代它的顶栏与侧栏取的是文档作用域几何（条件：Owner 没有把 R3M5 改判为方案 B）**

- 现象：方案 A 的四条例外让知识库样板里的独立 TopBar 显示为 52、SideNav 取画布色与 16 内距；包的独立 TopBar 默认 68，构图三样板按包默认显示 68。说明只写在 CSS 注释里，样板的可见文字没有交代，读者会以为独立件就是这样渲染。
- 证据：`apps/storybook/src/story-demo-styles.ts:686–714`；`scripts/shell-fidelity-proof.mjs:340–371`；`storybook-map.json` DIFF-2（独立 TopBar 68）；`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx:55–57`。
- 建议改法：在知识库样板的 story 说明里（不放进顶栏）加一句：Navigation 家族批次之前，顶栏 52、侧栏画布色与 16 内距由文档作用域例外提供，包的独立 TopBar 默认 68；五语词条同步。Owner 若改选方案 B，撤回四条例外与两条白名单，本条作废。
- 改动文件：story 说明所在的词条文件（`apps/storybook/src/build/locales/storybook-locale-text.ts` 或 `storybook-content-text.ts`）；不改例外与门。
- 建议档位：经济（文案，判定不变）。第一次返工。
- 归属：128 目的锚（不影响 GWT）；建议挂 134。

## 4. 只有 Owner 能定的事项

新发现（建议一并列入收口）：

1. **独立导航件在 Storybook 里呈现两种外观（R3M5 方案 A 的后果）。** 知识库样板：独立 TopBar 52，SideNav 画布色与 16 内距，由文档作用域例外提供，其中 side-nav 一条放行 `background` 填色；构图三：独立 TopBar 68（包默认，DIFF-2）。关联：R2 判断 §3.1 O-1（Navigation 家族其余行为留第二批）、R3M5、owner-acceptance.md:224（R3 节第 2 行）。建议：维持方案 A 到 Navigation 家族批次，做 C3-4；若 Owner 认为文档层不应给包件改填色，改选方案 B（把样板角色的这几项比对移到 Navigation 批次，改门的比对数据须 Owner 明示）。
2. **构图一样板在 1024 宽下壳顶栏高 147。** 门只量 1440×900，目视清单没有这条（C3-3）。关联：O-1、owner-acceptance.md:73、78。建议：先按 C3-3 补进清单；窄桌面下工具行是否必须不折行、壳顶栏是否必须保持 52，归 Navigation 或页面模板批次，本批不改。
3. **知识库样板顶栏的描述截成一行加省略号，没有办法看到全文。** `storybook-shell-demos.tsx:55–57` 的描述 span 没有 title，`story-demo-styles.ts:727–756` 规定单行省略。owner-acceptance.md:227（R3 节第 5 行）已列，本条补「没有悬停全文」这一点。建议：不接受截断时，把描述移出顶栏、放到样板内容区首行（经济，不改包）；不建议加 title，title 不经词典翻译，扫描也读不到（RM16 ①）。

既有事项的关联（不新增）：

- STORY-130 的判定（R2 判断 §3.4 第 2 条）：两条 GWT 的机器判据都满足；差异 10 条都带 refs，待 Owner 裁定 0 条，待 Owner 知悉 3 条（DIFF-7、8、9）。
- 129 的目视（D8）：owner-acceptance.md:70–76、:174 与 R3 节第 1–5 行。
- O-1 若被更正为不授权：按 R2 判断 §3.1 撤回 R3-1、R3-4、R3-10、R3-11 与 DIFF-1、DIFF-3 状态，129-GWT3、130-GWT1、131-GWT4 回到阻塞；方案 A 的四条例外与两条白名单随之撤回。
- R3M6 的文档壳偏差（38 标、文案起点 66、文档页无纸面、page-template 未改）已在 owner-acceptance.md:227，归目视。
- R3M1 的 MultiSelect 静态与运行时间距（owner-acceptance.md:174），归目视。

## 5. 实施口径判定

| # | 来源 | 取舍 | 判定 | 理由 |
| --- | --- | --- | --- | --- |
| 1 | P0 · SUB-092 | CSF 适配新建 `compositions.stories.tsx`，id `composition-three-sample` | 可接受 | 拆分允许二选一；注册、来源路径与 CSF 适配有测试断言 |
| 2 | P0 · SUB-092 | 1040 写在样板内联，不加 token；TopBar 与板的差写进交回，不改 TopBar | 可接受 | §3.3 第 5 条；停下条件没有触发，差异已进 DIFF-2 与目视清单 |
| 3 | P0（R3M2） | 授权外未做：类目说明过时、ledger 两条已译的译文债未删、TopBar 无导航槽 | 有条件 | 类目说明按 C3-2 补；ledger 两条属 134（R3-16）分片；导航槽属 Navigation 家族，已在 DIFF-2 与目视清单 |
| 4 | P0 · SUB-095 | 改词典键，不加豁免，不改 story-content | 可接受 | §3.3 第 7 条 |
| 5 | 主线程（R3M2） | 摘录写入禁用短语原文致 scan 红，3113b5e 改为指向脚本 | 可接受 | 已修，30.03 段绿；本文件同样不写原文 |
| 6 | P1 · SUB-090 | 四个 token 用判断建议的名字；contractGroups 加 shell → container，不加导出 | 可接受 | §3.3 第 5 条；token-extension 绿 |
| 7 | P1 · SUB-090 | 构图一几何限定在 `@media not all and (max-width: 760px)`；侧栏画布色与壳顶栏 min-height 52 全宽生效 | 有条件 | 移动块按判据不改；手机宽下顶栏上下内距仍为 12（P1 §7），已列 owner-acceptance.md:78，由目视定 |
| 8 | P1 · SUB-090 | 导航项起始内距写成 calc(space-1 − 1px + 深度缩进)；纸面底取 panel | 可接受 | 抵消 1px 透明边框而不加局部变量；构图板 `.sheet` 背景是 panel |
| 9 | P2 · SUB-094 | shellFrame 只量纸面上、尾、下与顶栏高，起始边不量；只在本身是 ProductShell 根的 [data-shell] 里量 | 可接受 | 与构图板 `.sheet{margin:12px 12px 12px 0}` 一致；构图三无壳，n/a 正确 |
| 10 | P2 · SUB-094 | 两条变异放在 icon-sample-project；干净夹具页加 ProductShell 纸面与顶栏；测试标题去掉「four」「nine」 | 可接受 | 避免 `--family brand` 的变异数变化；夹具是本项自检所需，其余各项读数不变 |
| 11 | P2 · SUB-093 | 测试的合成注册表加构图三；DIFF-1 断言改查 P1、O-1；DIFF-1、3 的 story 文字去掉 280 / 92；unmapped 删构图三；description 写 shellFrame | 可接受 | 原断言与 O-1 裁定直接冲突；其余是映射改动的直接后果 |
| 12 | P2 · I-P2 | 冒烟 `?? 92` 缺省改读 token | 可接受 | 同族旧值，不改判定 |
| 13 | P2 · I-P2b | storyKind 按注册表类目取值，不改 storybook-routes；冒烟来源路径按注册导出判；可复现性探针 8 → 6 | 可接受 | 不扩大十个固定 id 的波及面；8 → 6 在 §3.3 第 4 条内，openMenus [6, 6] 逐个核对过 |
| 14 | P2 · SUB-098 | 比较函数导出，自检写在脚本内，不新增测试文件；full-surface 两个文件没改 | 可接受 | 判据要求；P1 清单没有列 full-surface 的旧壳期望 |
| 15 | P2 · SUB-099 | 两个循环共用层判定，新增失败名 `mobile-layer-fill` | 可接受 | header 的不透明要求没有放宽，自检三例 |
| 16 | P3 · SUB-100 | 规则写在 alpha-styles.ts；重复选择器白名单加回 `.tcrn-product-shell-search__results`（P3 问题 2） | 可接受 | 白名单项随例外一起删，守卫仍只放行 position、inset |
| 17 | P3 · SUB-102 | 承载类名单从 roles.json 读，不另抄 | 可接受 | 判据要求 |
| 18 | P3（问题 4） | demo-styles-sync 读 dist，须 build → 同步 → build | 可接受（知悉） | 包按正确顺序跑过；建议以后拆分的局部门顺序照此写 |
| 19 | 主线程（R3M5）· SUB-101 | 方案 A：为知识库样板的独立 TopBar、SideNav、NavGroup 标题、NavItem 登记 4 条文档作用域例外 | 有条件 | 方案 B、C 要改门的比对数据，属 Owner；方案 A 可逆，守卫照常拦其余属性，例外逐条带裁定与删除条件，四条都被用到（docExceptionsUnused 0）。但 side-nav 一条放行 `background`，是文档层给包件改填色，与 128 目的锚「Storybook 只渲染包」相抵，并让独立 TopBar 在知识库样板（52）与构图三（68）呈现两种高度。条件：① 收口作为 B 类裁定列给 Owner（owner-acceptance.md:224 已列，§4 第 1 条补两种外观这一点），Owner 可改选方案 B；② 做 C3-4 |
| 20 | P3（R3M6） | 重复选择器白名单加 `.tcrn-nav-group__label`、`.tcrn-nav-item` | 有条件 | 随方案 A，条件同第 19 条 |
| 21 | P3（R3M6） | `scripts/shell-parity-proof.mjs:534` 样板切换钮期望右距 23.04 → 16 | 可接受 | 原值来自旧文档壳公式，比对方式与容差不变，§3.3 第 6 条 |
| 22 | P3（R3M6）与 b024f0e | `smoke.test.ts` 1212–1215 钉值 288 / 280 / 360 / 96 → 220 / 220 / 220 / 52；冒烟 5 处旧钉值改读壳层 token | 可接受 | 同一 oracle 的后果；读 token 比钉字面值更不易过时 |
| 23 | P3（R3M6） | 品牌锁定组合仍为 38 标、文案起点 66（构图一为 22、48） | 有条件 | 缩放要给包类写自定义属性，不在授权内；shell:parity 的 brand-lockup 绿只证关系，不证尺寸。已列 owner-acceptance.md:227，由目视定；不接受时归 Navigation 批次 |
| 24 | P3（R3M6） | 文档页没有离边 12 的纸面；`page-template.tsx` 不改，品牌留在顶栏 DOM、用负外边距成为侧栏顶端 | 可接受 | 不在授权内，门也不量；element-inventory 与 string-source 两个角色要求品牌在顶栏 DOM 里 |
| 25 | P3（R3M6） | 知识库样板顶栏描述截成一行加省略号，没有悬停全文 | 有条件 | 是顶栏 52 的直接后果，全文仍在 DOM；属可见截断，交 Owner 目视（§4 第 3 条） |
| 26 | P3 · SUB-101 | 收起与极窄态的文案 max-width 0，由文档盒子裁掉，不再淡出 | 可接受 | 跟随包的行为，正是删掉 C-21 暂缓例外的本意 |
| 27 | P4 · SUB-078 | shellFrame 按检查项读，不改报告结构 | 可接受 | 判据字面与门的结构不对应；summary 与各 run 里都有 shellFrame |
| 28 | P4（问题 2） | `r2-clearance.md` 的旁证读数过时，没有再生 | 有条件 | 差集没变，SUB-046 只在差集变化时再生；条件：判断授权在下次批末再生，或在该文件加一行注明 R3 读数（静态命中 0、扫描源文件 66） |
| 29 | P4 · SUB-103 | color-palette 说明按现状并入 SUB-046 的刷新 | 可接受 | 73 格是现值 |
| 30 | P5 · SUB-091 | 静态展开态列表紧贴触发器（0），运行时浮层 8px，不加 gap | 可接受 | 判据只要求在下方、同宽；已列 owner-acceptance.md:174 |
| 31 | P5 · SUB-091 | 顺手改 inputs.css.ts 第 163–166 行过时注释 | 可接受 | 判据点名 |
| 32 | 主线程（R3M4、R3M5） | 不另派代理，用 SendMessage 续派原 P2、P3 代理做集成修复与 SUB-101 余项 | 不判 | 属派工方法，不是实施口径；结果经批末逐段与真实 verify 复核没有问题；是否合 Owner 的执行方法规则由判断核对 |
| 33 | P3（过程） | 一条只读命令带 cd | 知悉 | 没有弹框、没有写入；同 RM4 |

## 6. 证据盲区

1. 没有开浏览器。SUB-091 静态展开态的读数（P5）、1024 与 390 宽的读数（P1 §7）、文档壳品牌区与样板顶栏的截断、构图三 1040 居中（1440 下 story 框只有 956），都取自包的交回或代码，没有复测。
2. 几何门与映射门只在 1440×900、en 下量（18 log 的 run；19 log 的 scope）。其它视口与语言下的 rail、shellFrame 没有门。
3. shellFrame 不量纸面起始边（与构图板一致），纸面与侧栏之间若出现缝隙，门看不到。
4. doc:sample-style 只比 23 件矩阵组件（128-GWT3 口径）；方案 A 的四件 Navigation 件与 package-context 142 处不在比对范围。
5. SUB-098、SUB-099「去掉放行即红」的比较函数变异是包在会话 scratch 里单独跑的（P2 交回），仓内只有脚本自检三例；本验收只读到自检结果。
6. shell-fidelity 的自检不打印结果；判断依据是 :670 每次运行都调用、失败即 exit 1，以及 06.10 段退出 0。
7. verify.log（2.8 MB）只按脚本起始行与新门的判定行读取，没有逐行读全文；逐段日志按 grep 与解析脚本读取，没有整读。
8. 链：STORY-128、132 链上仍为 active，未用引擎核对；SUB-080 转 done 留给 R3 链写。
9. verify 后被改写的两处回执（R3M7）只读了 steps.md 的说明，没有读存档的 receipts-dirty。
