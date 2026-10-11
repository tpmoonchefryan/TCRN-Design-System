# R2 批末验收 · 分片 C（STORY-128 至 STORY-133）

节行号：§1 一览 第 11 行；§2 逐 Story 第 28 行（2.1 第 30、2.2 第 61、2.3 第 80、2.4 第 93、2.5 第 107、2.6 第 120 行）；§3 返工清单 第 142 行；§4 Owner 事项 第 211 行；§5 实施口径 第 227 行；§6 证据盲区 第 267 行。

验收对象：集成工作树 `.worktrees/TCRN-Design-System/init015-gplus-renewal`，分支 `claude/init015-gplus-renewal`，HEAD 6630655。被验代码是 e643d74（批末 verify 跑在这里），其后 61b0556、6630655 只改 runs/ 下的调度文档。下文 `R` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r2`，其余路径相对工作树。

证据写法：「NN log:L」指会话 scratch `r2-verify/` 下批末逐段日志第 L 行（段号同 `R/verify/steps.md`）；「回执」指 HEAD 上 `docs/verification/internal-alpha/` 的入仓回执，批末运行后工作树干净，a11y-axe-summary、browser-proof-summary、story-coverage-manifest 与批末运行一致（steps.md 记的三份被改写回执已还原，不在此列）；「file:行」指 HEAD 上的文件。本验收只读：没有重跑门、构建、开浏览器，没有改代码、门、回执或链。

结论取值：GWT 为 满足 / 不满足 / 部分 / 阻塞于 Owner；Story 为 通过 / 不通过 / 阻塞于 Owner。返工编号 C2-n；档位按摘录第 7 节：改共享契约（token 键集、contract/*.json、导出面、门的判定语义）起主力，孤立修复起经济；同一修复目标第二次返工，经济升主力，主力再退回交 Owner。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 相关返工项 | 项数 |
| --- | --- | --- | --- | --- |
| STORY-128 文档层清零 | 通过 | — | C2-4、C2-6、C2-7（均不影响本 Story 的 GWT 结论） | 3 |
| STORY-129 矩阵与构图一样板 | 阻塞于 Owner | GWT3 阻塞于 Owner（O-1） | — | 0 |
| STORY-130 画布板到 story 映射 | 阻塞于 Owner | GWT1 阻塞于 Owner（样板 10 行 rail，O-1） | C2-8（不阻断） | 1 |
| STORY-131 八项 DOM 测量门 | 阻塞于 Owner | GWT4 阻塞于 Owner（样板 rail，O-1） | — | 0 |
| STORY-132 契约静态门 | 通过 | — | C2-5（不阻断） | 1 |
| STORY-133 门接入 verify 与 CI | 不通过 | GWT1 部分 | C2-1、C2-2、C2-3、C2-4、C2-6 | 5 |

去重后返工 8 项：主力 4 项（C2-1、C2-2、C2-3、C2-7），经济 4 项（C2-4、C2-5、C2-6、C2-8）。C2-1 是同一修复目标的第二次返工（R1 C-16 → R2 SUB-080，P6 主力档整包执行后退回，RM15），R3 再退回即交 Owner。

R2 批末 6 个红步里，不归 Owner 的红只剩四项：第 10 步 searchOverlay（C2-1）、第 17 步 14 条同根（C2-2）、第 30 步的 mobileHashAnchorOcclusion（C2-3）与 zh-CN 3 条新漏译（C2-4）。其余红步待 Owner：第 11、18、19 步待 O-1，第 30 步 axe 12 条待 O-2。

须更正的一条归因：steps.md 红步表、P12 问题 3b 与 RM18 都把 mobileHashAnchorOcclusionCheck 写成「手机视口文档顶栏过高，待 C-21/O-1」。实测四次读数的失败字段都是 `mobile-layer-transparent:searchInput:rgba(0, 0, 0, 0)`，标题与正文都在顶栏下方可读。原因是 SUB-064 让文档顶栏搜索包裹层按 G+ 不作画，而门的这一条读数循环没有沿用同一门里另一循环已有的 G+ 半透明层放行（C2-3）。因此 SUB-046 视觉基线写入的三项阻塞里，只有 O-2 一项归 Owner。

## 2. 逐 Story

### 2.1 STORY-128 文档层清零 · 通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 构建后 tcrn-* 类与包 CSS 差集为空 | 满足 | 12 log:28–29、45：`ok: true`、`DOC_SHELL_CLASSES_PACKAGE_BACKED`、`outOfPackageCount: 0`；log:211 `newSinceBaseline: []`；log:389 `unmapped: []`；log:392–393 模板类子检查绿。13 log 的 `inputs.outOfPackage.count` 为 0（C13 同源）。 |
| 2 新增 tcrn-foo 判红 | 满足 | 12 log:13 `✔ 128-GWT2 …turns the gate red`；doc-shell:proof 先跑测试再跑门。 |
| 3 任一 story 组件外观与矩阵一致 | 满足（按 R1 已判可接受的 W5-C 口径及其三项条件） | 20 log:21 `ok: true`；log:1252 起 totals：compared 2868、docStylesheet 0、storyInlineStyle 0、failing 0（R1 为 72）；文档层变异 `doc-override-button-fill` killed（log:4962–4970）。R1 的条件②规则级守卫已落地：06.10 log:20、22 `packageClassAppearance: 0`、`docExceptionsUnused: 0`，自检变异 `.tcrn-doc-x .tcrn-button{background:red}` 判红（`scripts/shell-fidelity-proof.mjs:596`，第 625 行每次运行调用）。条件③ package-context 142 处仍按家族交后续批次（§3.3）；条件① `--strict` 未设默认。 |

R1 记的三处目的锚缺口都已关闭：

1. 文档 CSS 改包外观。R1 点名的全局字标字号、顶栏字标、`.tcrn-sr-only` 与 `.tcrn-skip-link` 副本、知识库壳锁定组合清零规则、顶栏搜索框的 panel 底与 38px 都已删除（P5 的 1fe5bcb、496c1d7、461306d），守卫 0 发现。图标样例只留 `justify-self: center`（`apps/storybook/src/story-demo-styles.ts:286-288`）。
2. 原型渲染成裸元素。密集与紧凑原型已退役（95f0e09）；navigation-focused-shells-spec 不再超高（30.02 log:37–39，`storyHeightViolations: 0`）。
3. text-styles 两条泄漏。browser-proof-summary 的 `localeLeakScan.zhCn.perStory` 里 text-styles 的 newLeaks 为 `[]`。

本 Story 范围内的余项（不改变 GWT 结论）：

- 守卫只认主体复合选择器带包类的规则。`.tcrn-doc-knowledge-shell-layout [data-navigation-primitive="nav-item"]:not(…)` 用 data 属性点名包导航项并写 background，不在守卫范围内（P5 问题 5）。它属于 Navigation 家族（后续批次），矩阵里没有这个家族，不进 GWT3。口径见 §5。
- `.tcrn-doc-shell-demo--compact` 规则已没有元素使用；组件清单与 ui-react 导出面仍列着已退役的原型 → C2-7。
- `docs/style-scale.md` 对守卫的描述过时 → C2-6。
- SUB-064 带出的第 30 步两条红（C2-3、C2-4）计入 133，不属文档层外观。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-063 | 达成 | doc:sample-style failing 0；demo-styles-sync `--check` 绿（06.03 log）；shell-fidelity 绿；W2-E P13 的 `.tcrn-checkbox` 规则在 R1 的 564f352 已删。 |
| SUB-064 | 达成，带出两条红 | 包裹层不作画：冒烟无 `storybook-skin-search-wrapper-paints`；回执 story-coverage-manifest 的 firstStoryHashShellParityCheck 与 mobileKnowledgeDocShellLayeringCheck 为 ok。shell:parity 只红 brand-lockup、sidebar、shell-relations，search 与 element-inventory 绿（11 log）。oracle 改为 32 / `rgba(0, 0, 0, 0)` / 8（`apps/storybook/src/build/foundation-visual-standards.ts:618-625`）。带出的红：① oracle 改值后，zh-CN 词条「260px rest, 360px expanded, 36px high」（`storybook-content-text.ts:1301`）对不上新串，产生 3 条新漏译 → C2-4（RM16 ④ 记作 28933c7，实为 496c1d7）；② 包裹层透明后 mobileHashAnchorOcclusionCheck 转红 → C2-3。 |
| SUB-065 | 达成 | 落在 shell-fidelity（拆分首选）；摆放属性表在 `scripts/shell-fidelity-proof.mjs:262-271`；5 条 EX-INIT015-doc-* 例外都带裁定引用与删除条件（P5 交回表）；未用例外 0。口径见 §5。 |
| SUB-066 | 达成，有残留 | 三件事在同一提交 95f0e09；测量宿主改指后 badge、brand、copy 先红后绿（10 log:5 `redThenGreen`）；storybook 单测 9/9（05 log:240–243）。连带的 openMenus 8→6 见 C2-1，残留见 C2-7。 |
| SUB-067 | 达成（就本单） | text-styles 的 newLeaks 为 `[]`；s254 改查 `.tcrn-doc-story-disclosure`（`scripts/s254-story-dom-proof.mjs:43`）。批末第 30 步仍有 3 条 zh-CN 新漏译，来自 SUB-064（C2-4），不是本单那两条。s254 不在 verify 里，storyExpanded 为 true 取自 P6 交回。 |
| SUB-068 | 达成 | `story-content.tsx:1156` 的 status 在卡内 div 上；axe 由 16 条降到 12 条，余下全是 color-contrast（回执 a11y-axe-summary）。 |
| SUB-069 | 达成 | `docs/verification/doc-shell-class/r2-clearance.md`：171→0，按处置 38/86/32/15 并引 doc-class-map；baseline.json 未改。 |

### 2.2 STORY-129 矩阵与构图一样板 · 阻塞于 Owner（GWT3）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 格数与画布一致且每格含 data-cell | 满足 | 19 log 各 B 行的 `themes.*.cells`：typography 44、icon 28、brand 10、actions 116、inputs 42，两种主题都是 expected = rendered = declared，missing 0、duplicated 0、expectMismatches 0。inputs.B 由 R1 的 40 变为 42（SUB-070）。 |
| 2 切到夜间测量，每格对比度与画布夜间列一致 | 满足 | 18 log：五个矩阵在浅色页、夜间页两轮的 contrast 都是 pass，worstValue 0（log:6728 起 summary；逐格见各 run 的 `verdict.checks.contrast.cells`）。R1 的夜间页浅色块读夜间值（C-13）与 err-msg 偏差（C-14）已消。 |
| 3 侧栏图标左 16、文字 48，纸离边 12 | 阻塞于 Owner（O-1） | 18 log：五个样板在两轮都只红 rail，guideLefts [16, 49]、textLefts [48, 77]，偏 33px（如 log:3466 起）。纸离边与顶栏高度没有门在量，见 §4 O-1 与 §6。 |

R1 记的本 Story 其余缺陷都已关闭：axe landmark-unique 为 0（回执 a11y-axe-summary 只有 color-contrast）；internal-vocab 0 命中（25 log:25、177，扫 37 页）；隐私扫描 ok（30.03 log:6）；故事高度预算 ok、stale 0（30.02 log:37–39）；夜间样板主题钮图标的 C5 红已消（13 log:90，修复属 A/B 分片的 SUB-057）。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-070 | 达成（另待目视） | 见 GWT1；opt-sel-l、opt-sel-n 两格可量（P7 交回读数 16.18、12.15 与期望相同）。静态展开态不可交互、列表在触发器右侧，已列 `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md:169`。 |
| SUB-071 | 达成 | 回执 a11y-axe-summary 无 landmark-unique（R1 为 110 个节点）；新文案五语齐，无工单键（P7 交回表）。 |
| SUB-072 | 达成 | 删掉整列（判据的第一种做法），未加扫描豁免；25 log:177 `hits: []`。DIFF-9 状态见 C2-8。 |
| SUB-073 | 达成 | 30.03 log:6 `ok: true`，scannedFiles 605；扫描口径未改。 |
| SUB-074 | 达成 | data-h 32 共 140 个、28 共 16 个（P7 交回）；actions-matrix、inputs-matrix 两轮 controlHeight 都是 pass，checksNeverApplied 为 `[]`（18 log:6727）。 |
| SUB-075 | 达成 | `scripts/lib/story-budget.mjs` 的 8 条刷新，前后值与原因见 P12 交回第 2 节（§3.2 知悉）；navigation-focused-shells-spec 不在宽限表；storyHeightStaleAllowlist 0（30.02 log:39）。 |

### 2.3 STORY-130 画布板到 story 映射 · 阻塞于 Owner（GWT1）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 映射每行有报告行且八项全绿 | 阻塞于 Owner（O-1） | 19 log:32–33 报告带 UTC 与 HEAD e643d74；log:4249–4251 rows 22、rowsOk 12。红的 10 行正好是五个 D 段与五个构图一行，reasons 只有 `light:rail`、`dark:rail`（DIFF-1，O-1）。矩阵 12 行全绿，含 actions.A、inputs.A 的 controlHeight 实测。九条行变异全部 killed（log:4174 起）。入仓报告已再生（f6362c5，rowsOk 12）。 |
| 2 删掉映射里一个 story 判红 | 满足 | 19 log:10（单元测试）、log:19（构建后测试）。 |

门核对：映射行的 requiredChecks 与门的 REQUIRED_CHECKS 一致（P8 新测试逐 story 断言，`scripts/geometry-measure-proof.mjs:87-98`）；DIFF-6 状态已改为「测量库已支持 before-bg（W5-C）」；待 Owner 的差异仍是 DIFF-1、2、3、8（O-4）。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-076 | 部分 | 报告已再生，余红逐行列了原因，期望值未改。「样板 10 行注明 O-1」写不进生成报告（生成器没有注记输入），现在只能经 DIFF-1 关联；C2-8 给 DIFF-1、DIFF-3 的 refs 补 O-1。包自报同为部分。 |

### 2.4 STORY-131 八项 DOM 测量门 · 阻塞于 Owner（GWT4）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 选中行首格加 padding-left 8px，行对齐判红 | 满足（载体按拆分 P17 调整，同 R1） | 18 log:6634 `row-first-cell-padding` killed。 |
| 2 mark 加 padding 2px 判红 | 满足 | 18 log:6644 `mark-padding` killed。 |
| 3 box-shadow 改 4px 模糊判红 | 满足 | 18 log:6654 `shadow-blur-4px` killed。 |
| 4 现仓矩阵与样板八项全绿 | 阻塞于 Owner（O-1） | 18 log：20 个 run 里矩阵 10 个全绿；样板 10 个只红 rail（33px）。notApplicableRequired 全空（如 log:1098、1481），checksNeverApplied 为 `[]`（log:6727）。controlHeight 在两矩阵两轮实测为 pass（R1 从未实测）。样板必测项改为 rail，四个带 TableShell 的样板另测 rowAlign，不再错配 contrast。selfCheck ok（log:147 起），测试 64/64（log:69–72）。probes 4 项 pass，含 iconStroke（74 枚，1.25px，non-scaling-stroke；log:6674 起）。 |

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-077 | 达成 | `scripts/geometry-measure-proof.mjs:76-98`；映射同步，DIFF-6 已改；样板 rail 按判据在 O-1 前保持红。actions.A 与构图一行加 rowAlign 超出字面，见 §5。 |
| SUB-078 | 部分 | `docs/verification/geometry-measure/report.json` 已再生（c5e7f81）：notApplicableRequired、checksNeverApplied 为空，probes 含 iconStroke。「注明 O-1」与 SUB-076 同理写不进，经 C2-8 关联。 |

### 2.5 STORY-132 契约静态门 · 通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 注入 `.x .tcrn-button:hover{background:#fff}`，C2 红 | 满足 | 13 log:11。 |
| 2 夜间选中态单加 inset 阴影，C5 与 C6 红 | 满足 | 13 log:12。 |
| 3 加 linear-gradient 底，C11 红 | 满足 | 13 log:13；测试 69/69（log:74–77）。 |
| 4 现仓全绿 | 满足 | 13 log:85–95：`ok: true`、`CONTRACT_STATIC_CLAUSES_HOLD`，C2、C5、C6、C7、C8、C11、C13 都是 0 发现（R1 的 C2 7 条、C5 1 条已消）。豁免 12 条，未用的 EX-INIT015-identity 不影响判定；story 层读入 65 个 story、markupErrors 0。C7 已收紧：第一批承载元素的 title 须含可见文字（log:67–68 用例），变异「title 改成与标签无关的原因」判红（log:49）；C7 的 1602 个豁免全部落在后续家族条目上（`clauses.C7.exemptedByEntry`）。 |

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-079 | 达成 | `docs/contract/clauses.md` 的 C7 改为两档口径；Button 有禁用原因时 title 为「标签 — 原因」，原因仍走 aria-describedby（`Button.tsx` 的 buttonTitle）；Button.test 同步，Clipboard.test 由 I1 修；ui-react 162/162（05 log:219–222）。P10 按渲染元素实测 Actions 有 28 处（判断记 20），新口径下 0 发现。余项：21 种组合 title 里有 7 种在非英文下只译了一半（RM16 ③）→ C2-5；门读不到 title（RM16 ①）见 §6。 |

### 2.6 STORY-133 门接入 verify 与 CI · 不通过

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pnpm verify 运行时新门全部执行且有报告 | 部分 | 接线满足且没变：R2 未改 package.json 与 `.github/`，verify 仍是 30 段。逐段运行里新门都执行并出报告：第 12、13、20、21 步绿，第 18、19 步只红样板 rail（O-1）。执行不满足：真实 `pnpm verify` 是 && 链，会停在第 10 步 geometry:proof（10 log:5：searchOverlay 的 baseline 与 restored 都是 ok false，openMenus 6，结果面板 420×138 压住 h3 与首段），第 12 步以后的新门在真实命令下都不执行。第 10 步不归 Owner（C2-1）。另有第 17 步 14 条同根（C2-2）；第 30.02 段四类红中，axe 12（O-2）与视觉基线未写入（随其余三项）之外，mobileHashAnchorOcclusion（C2-3）与 zh-CN 3 条（C2-4）也不归 Owner；第 11、18、19 步待 O-1。 |
| 2 单跑 pnpm geometry:measure 只跑该门 | 满足（沿用 R1，R2 无回退） | package.json 的 `geometry:measure` 仍为 `node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs`；18 log 只有该门的测试与报告。 |
| 3 CI 配置含 verify | 满足（只写配置，沿用 R1） | `.github/workflows/verify.yml` 在 R2 没有改动：push、pull_request、workflow_dispatch 触发，corepack pnpm 10.12.1，跑 `pnpm verify`；未推送。 |

R1 红而 R2 转绿：第 6 步（tokens:proof 12 段全绿，含 R1 未执行的 shell-fidelity 与 selection-grammar 两段文档层守卫）、第 13、20、25、28 步。冒烟输出完整：17 log 共 1,055,352 B，可整体解析为一个 JSON 对象（R1 断在 65,750 B）。

| Subtask | 判据 | 实测与说明 |
| --- | --- | --- |
| SUB-080 | 未达成 | 见 C2-1；包自报未达成，实测一致。 |
| SUB-081 | 达成 | 冒烟失败清单里已没有 `searchControl:background-color`（17 log，14 条全是 focus-outline-width）。 |
| SUB-082 | 达成 | `scripts/storybook-smoke.mjs:3860-3864` 设 `process.exitCode = 1`；日志完整，见上。 |
| SUB-083 | 达成 | `buttonFeedbackOk: true`（30.02 log:33），读数存在回执 browser-proof-summary 的 `buttonFeedbackReadback`；full-surface:proof 绿（28 log）。 |
| SUB-084 | 达成 | `clippedButtonText: false`（30.02 log:36），P9 记录 288→0；无 title 的真实截断照记（P9 六例反证）。 |
| SUB-085 | 达成 | `axeWordmarkContrastExemptedNodes: 94`（30.02 log:13）；条目取自 `WORDMARK_EXEMPTIONS`，带 D2 与 V2-B1-Brand 板 F 段引用；标语与壳说明不在豁免内；token-contrast 门结果不变（06.05 log）。口径见 §4 O-3 与 §5。 |
| SUB-086 | 达成 | 五份 README 的命令改为 `pnpm storybook:visual-proof`，各有一处指向 `docs/contract/README.md`；`foundation-visual-standards.ts:546` 写明现行门；readme:proof 绿（22 log）。 |

目标的其余条款：「更新 style-scale.md 与机器消费契约文档」在 R2 改门之后已过时 → C2-6。

## 3. 返工清单

**C2-1 导航壳故事的搜索结果面板压住正文（第 10 步）**
- 现象：navigation-product-shell-spec 的静态搜索结果面板（420×138，top 230）压住 h3「Package-backed AOS shell boundary」与首段；geometry:proof 的 searchOverlay 三态都是 ok false，真实 verify 停在第 10 步。
- 证据：10 log:5 的 searchOverlay（openMenus 6、overlays 1、textTargets 碰撞）与 `redThenGreen.searchOverlay.green: false`；`scripts/geometry-proof.mjs:227、251` 写死 `openMenus === 8`；第 449 行的变异样式与包的默认绝对定位相同；`docs/design/gplus-2026-10/doc-class-map.json:39` 把 `tcrn-product-shell-search--static-display` 判为 delete-package-provided，理由「doc size modifier」不成立，它是这道门依赖的静态展示态；P6 问题 1、2。
- 建议改法：
  1. 展开计数只数 searchStory 内的展开元素；或改为 6，并在提交说明里引 SUB-066 退役（§3.4 第 4 项）。这是原型退役的直接后果，不是改质量阈值。
  2. 恢复静态展示态。story-content.tsx 的 search 入参恢复一个 `tcrn-doc-` 前缀的类；不能沿用原名，否则 128-GWT1 的包外类会回到 1。文档规则在该容器内让 `.tcrn-product-shell-search__results` 取 position static、inset auto、width 100%、margin-block-start space-2。position 与 inset 不在守卫的摆放属性内，须按 EX-INIT015-doc-* 写法登记例外：裁定引用本条与 R2 判断，删除条件为「Navigation 家族批次由包提供静态结果展示」。doc-class-map 该条改为 rename-tcrn-doc 并写新名，baseline.json 不改。
  3. 验收标准：baseline 与 restored 绿，broken 红。
- 文件：`scripts/geometry-proof.mjs`；`apps/storybook/src/contract-stories/story-content.tsx`；`apps/storybook/src/alpha-styles.ts` 或 `story-demo-styles.ts`（storybook.css 由 demo-styles-sync 写）；`scripts/shell-fidelity-proof.mjs`（例外）；`docs/design/gplus-2026-10/doc-class-map.json`。
- 档位：主力（改门的计数口径与守卫例外）。R2 已改过同一目标：是。R1 C-16 → SUB-080，P6 主力档整包执行后停在越级处（RM15 记为主力档第一次退回）；R3 再退回即写进收口文件交 Owner。

**C2-2 冒烟的搜索包裹层获焦 outline-width 期望过时（第 17 步）**
- 现象：storybook:smoke 共 14 条失败，全是 `searchInput:focus-outline-width:3px`（comparator 1、visual-instance parity 5、owner-quality 8），没有其他失败。包裹层的 outline-style 为 none，与期望相符；Chromium 149 在 none 时报初始值 3px（P6 问题 3 的探针）。steps.md 把 designSystemVisualInstanceParityReadback、ownerQualityProductShellProof 两项留给验收核对，结论是同根，没有「包裹层作画」。
- 证据：17 log:22、4141 起，共 14 处；`scripts/storybook-smoke.mjs:293` 期望 `outlineWidth: "0px", outlineStyle: "none"`，第 2068–2074 行逐项比较是否相等。
- 建议改法：focus 比较中 outlineStyle 为 none 时不比 outlineWidth，其余期望不改；smoke.test.ts 若钉了该期望，一并改。
- 文件：`scripts/storybook-smoke.mjs`（必要时 `apps/storybook/src/smoke.test.ts`）。
- 档位：主力（门的比较规则）。R2 已改过同一目标：否（SUB-081 修的是 searchControl background-color）。

**C2-3 移动端锚点读数没有沿用 G+ 半透明层放行（第 30 步）**
- 现象：第 30 步 `storyCoverageManifestOk: false` 只因 mobileHashAnchorOcclusionCheck 失败；四次读数都报 `mobile-layer-transparent:searchInput:rgba(0, 0, 0, 0)`。titleReadableBelowTopbar 与 articleReadableBelowTopbar 都为 true；顶栏 395px，R1 入仓回执里是 398.69px 且通过，所以失败原因不是顶栏过高。
- 证据：回执 story-coverage-manifest 的 `mobileHashAnchorOcclusionCheck.readbacks[*].failures`。`scripts/internal-alpha-browser-proof.mjs:40-48` 已为 G+ 定义 `gplusMobileHeaderFillLayers`（searchInput 只许透明，themeToggle 只许 Actions 填充）；第 2116–2129 行的知识库壳循环用了它，第 1789–1797 行的锚点循环没有用。SUB-064 让包裹层按 G+ 不作画以后，这条循环转红。
- 建议改法：锚点循环对这些层的处理与知识库壳循环相同，header 不透明底层的要求不放宽；同时更正 steps.md 红步表、P12 问题 3b、RM18 里「C-21/O-1」的归因。
- 文件：`scripts/internal-alpha-browser-proof.mjs`。
- 档位：主力（门的判定）。R2 已改过同一目标：否。落地后 SUB-046 的基线写入只剩 O-2 阻塞。

**C2-4 foundation-visual-standards 的 3 条 zh-CN 新漏译（第 30 步）**
- 现象：zh-CN 下出现「px rest」「px expanded」「px high」3 条新漏译，`localeLeakZhCnOk: false`。
- 证据：30.02 log:41–42；browser-proof-summary 的 `localeLeakScan.zhCn.newLeaks`。`story-content.tsx:1482` 用 oracle 值拼出「260px rest, 360px expanded, 32px high」，词典键仍是「…36px high」（`storybook-content-text.ts:1301`）。来源是 496c1d7（SUB-064）。
- 建议改法：仿 SUB-067，尺寸由 oracle 值拼接，只翻译三个片段；或把键与五语值改为 32px。不加豁免。
- 文件：`apps/storybook/src/build/locales/storybook-content-text.ts`（必要时 `story-content.tsx`）。
- 档位：经济。R2 已改过同一目标：否。

**C2-5 七种「标签 — 原因」title 在非英文下只译了一半（不阻断）**
- 现象：21 种组合 title 中有 7 种只有一边在词典里，非英文下半译；门读不到 title，所以不显红。
- 证据：`R/problems/I1.md`（RM16 ③）与 I1 交回的只读探针。
- 建议改法：给这 7 种补上缺的那一边的五语词条。
- 文件：`apps/storybook/src/build/locales/storybook-content-text.ts`（或 `storybook-locale-text.ts`，按持有方）。
- 档位：经济。R2 已改过同一目标：否。

**C2-6 style-scale 与契约门清单在 R2 后过时（133 目标条款，不影响 GWT 结论）**
- 现象：`docs/style-scale.md` 的「Three gates hold that line」仍说 shell-fidelity 按包类主体白名单判，白名单仍列 `.tcrn-brand-wordmark*`、`.tcrn-sr-only`，还说文档壳逐字复刻 sr-only 与 skip-link（第 179–187、232–237 行）；规则级守卫的摆放属性表、EX-INIT015-doc-* 例外与扫描面（含 story-demo-styles.ts）都没写。`docs/contract/README.md:47` 的 package-css 描述过时（RM2）。
- 建议改法：按 `scripts/shell-fidelity-proof.mjs` 的 PLACEMENT_PROPERTIES 与 DOC_PACKAGE_CLASS_EXCEPTIONS 改写这两段；README 第 47 行按 P3 给的正文改。顺带清掉三处过时注释：`scripts/storybook-visual-proof.mjs:62-64`、`storybook-map.md`「读法」第 5 条（P8 提醒）、`packages/ui-react/src/styles/inputs.css.ts:166`（P12 问题 4）。
- 文件：`docs/style-scale.md`、`docs/contract/README.md`，以及可选的三处注释。
- 档位：经济。R2 已改过同一目标：否。RM9、RM12 ④ 已把它排进下一批，此处补上验收依据。

**C2-7 原型退役在 SUB-066 文件集外的残留（不阻断）**
- 现象：
  - `.tcrn-doc-shell-demo--compact` 规则已没有元素使用（`story-demo-styles.ts:563`、`storybook.css:870`）。
  - `apps/storybook/src/contract-stories/content/component-rows.ts:32、34` 仍把两个已删的 helper 列为「Storybook prototype; … deferred」。
  - ui-react 导出面 `componentLibraryDeferredPrototypeNames` 仍含两名（`packages/ui-react/src/index.tsx:153、155`；`index.test.tsx:82、84`）。
  - `content/navigation-rows.ts` 的 denseShell* 导出已无人使用（P6 问题 6）。
- 建议改法：
  1. 删 compact 文档规则（走 demo-styles-sync）、清单里的两行和无用的内容导出。
  2. 导出面去掉两名并改测试，CHANGELOG 与迁移说明各记一行。
  3. 复核 smoke.test.ts 第 842、844 行两条断言：若只剩清单行能命中，就删掉。
  4. 若 Owner 更正 §3.4 第 4 项、要保留原型，本项作废。
- 文件：`story-demo-styles.ts`、`storybook.css`、`content/component-rows.ts`、`content/navigation-rows.ts`、`packages/ui-react/src/index.tsx`、`index.test.tsx`、`CHANGELOG.md`、`docs/migration-4.0.md`、`apps/storybook/src/smoke.test.ts`。
- 档位：主力（含导出面）。R2 已改过同一目标：否（SUB-066 判据明确不改这两处）。

**C2-8 映射差异记录两处更正（不阻断）**
- 现象：
  - DIFF-9（品牌样板删去资产 ID 列）的状态写「已裁定」，只引 R2-25。R2-25 是实施侧返工项；删整列虽是 SUB-072 判据的第一种做法，但它让 story 与 Brand 板 D 段出现可见差异，比照 DIFF-7 应记「待 Owner 知悉」。
  - DIFF-1、DIFF-3 的 refs 只写 P1、D6，没有 O-1，所以生成报告无法逐行指向 O-1（SUB-076、SUB-078 的「注明 O-1」）。
- 证据：`docs/design/gplus-2026-10/storybook-map.json` 的 differences（DIFF-1、3、7、9）；P8 回显第 4 条；owner-acceptance.md:129 已就此问 Owner。
- 建议改法：DIFF-9 状态改为「待 Owner 知悉」；DIFF-1、DIFF-3 的 refs 加 O-1；storybook-map.md 同步；下次 `--write-report` 时报告随之更新，不手改报告。
- 文件：`docs/design/gplus-2026-10/storybook-map.json`、`storybook-map.md`。
- 档位：经济（只改状态与引用文字，不动 requiredChecks）。R2 已改过同一目标：否。

## 4. 只有 Owner 能定的事项

本分片没有新增 O 号事项。与 O-1…O-12 的关联如下；建议与未答复时的处理除注明外，都沿用 R1 判断 §3.1。

- **O-1 影响面更正与补充。**
  - 更正：第 30 步手机视口锚点读数不受 O-1 影响（C2-3），应从 O-1 的影响列表和 SUB-046 的阻塞列表里删去。
  - 仍受影响的项：129-GWT3、130-GWT1 的样板 10 行、131-GWT4 的样板 rail、第 11 步 shell:parity、133-GWT1 的 verify 全绿。
  - 补充：129-GWT3 的「纸离边 12」和 127-GWT4 的「顶栏 52」现在没有门在量。geometry-measure 只量 rail（`scripts/lib/gplus-measure.mjs:344` 起）。Owner 授权 O-1 后，拆分须补这两项测量，否则 GWT3 只能靠目视证明。
- **O-2 现为第 30 步唯一的 Owner 阻塞。** C2-3、C2-4 落地后，第 30 步非视觉证明只剩 axe 12 条。这 12 条全是标语 line-two 与壳锁定说明（ink-3）落在 acc-bg 上，浅色 4.36、夜间 4.17（回执 a11y-axe-summary）。它同时卡住 SUB-046 的视觉基线写入与 133-GWT1 第 30 步。建议不变。
- **O-3 与 RM6（axe 字标豁免的匹配面）。**
  - 现状：豁免按「后缀选择器 + 登记的后缀色」匹配，不看主题与承载面。夜间样板侧栏 #172421 上 6 个 DS 后缀节点（4.18）因此也被豁免，而 token-contrast 只登记了 DS 浅色。
  - 建议：维持。logotype 豁免不以对比度为条件，回执逐个列出 94 个豁免节点及读数。Owner 若要求与 token 表严格同源，在匹配里加上节点所在的 data-tcrn-theme 即可。
  - 未答复时：维持。
- **O-4 与 DIFF-9。** 建议记为「待 Owner 知悉」（C2-8），owner-acceptance.md:129 已提问。未答复时按 C2-8 改状态，不恢复该列。
- O-5…O-12 与本分片没有新关联。

## 5. 实施口径判定

| 包 | 口径 | 判定 | 理由与条件 |
| --- | --- | --- | --- |
| P5 | 守卫把行向尺寸（width、min/max-width、inline-size 一组）与换行（white-space、overflow-wrap、word-break）算作摆放（回显 1） | 有条件 | 依据 style-scale.md 的「grid area, track width, wrapping」。条件：换行属性不得对 C7 单行承载类（roles.json）放行，否则文档 CSS 能把 `tcrn-button__label` 改回折行而守卫不报。下一批在守卫里排除承载类，并加一条变异。 |
| P5 | 知识库壳搜索框保留 260px 轨道宽（回显 2） | 可接受 | 属摆放；删掉后 shell:parity 由高度离群变成宽度离群（P5 交回 SUB-063 第 4 点）。 |
| P5 | oracle 的 searchBorderColor 记静止时可见边的颜色，即透明（回显 3） | 可接受 | G+ 搜索框没有 border，边由 pair 阴影画，静止时透明；border-top-color 的计算值只是 currentColor，比它没有意义。 |
| P5 | 跳转链接、tooltip 静态预览、筛选栏登记为例外而不删（回显 4，例外第 1–3 条） | 可接受 | 都属后续家族，带裁定引用与删除条件；删掉跳转链接规则会让 fixed 定位脱离证明框，这一行为未经门验证。 |
| P5 | 文档壳品牌收起与窄屏隐藏按 C-21 登记例外（回显 5） | 可接受 | 依 §3.4 第 10 项暂缓，删除条件为 O-1 答复。 |
| P5 | 生成的 demo 副本不重复扫描；未用例外只列出、不判红（回显 6） | 可接受 | demo-styles-sync 的同步检查为绿（06.03 log）；未用例外现为 0。 |
| P5 | 守卫落在 shell-fidelity（RM12） | 可接受 | 拆分写明这是首选落点。 |
| P5 | 守卫不扩到 data 属性主体（RM12 ⑤） | 有条件 | 扩大扫描面属于改门的语义，停下记录是对的；现存命中属 Navigation 家族。条件：Navigation 家族进入批次时把 data 属性主体纳入（主力档）。 |
| P6 | smoke.test.ts 第 842、844 行两条断言保留 | 可接受 | 遵守「与原型无关的断言不减少」；C2-7 清掉清单行后再复核。 |
| P6 | geometry-proof 测量宿主改指 navigation-product-shell-spec | 可接受 | 判据允许；10 log:5 显示 badge、brand、copy 先红后绿。 |
| P6 | 删 81 条不再渲染的词条 | 可接受 | 只删源文本已不在任何静态页上的词条，对应 story 没有新漏译。 |
| P6 | SUB-080 停在越级处，不改门的计数（RM15） | 可接受 | 判据写明「门不改」；两处根因属实，见 C2-1。 |
| P6 | SUB-081 等有限动画结束，删掉写死的 190ms 等待 | 可接受 | 不写死时长，期望值未改。 |
| P6 | 冒烟 3px 归为门的期望值过时（RM15 #3） | 可接受 | 实测 14 条同根（C2-2）。 |
| P7 | MultiSelect 静态样例去掉 `data-choice-presentation`（RM7 ①） | 有条件 | 目的只是在故事根内展示展开态；clip、overlap 通过，42 格可量。条件：列表在右侧、不可交互的排法以 Owner 目视为准（清单第 169 行）；目视不接受时，改由包提供展开态入口（第二批）。 |
| P7 | 样板壳 landmark 全部按样板命名，矩阵分节去掉 aria-label（RM7 ②） | 可接受 | 只改夜间壳名消不掉浅色壳之间的重名；新文案五语齐、无工单键；landmark-unique 已为 0。 |
| P7 | 删整列，并从 ledger 删去 4 个资产 ID | 可接受 | 删列是判据的第一种做法；ledger 在包文件集内，只删不再渲染的项。DIFF-9 的状态另见 P8 一行。 |
| P8 | actions.A 与构图一四行加 rowAlign（RM13 ①，回显 1–2） | 可接受 | 映射须与门一致；构图一画板本身带表格。 |
| P8 | iconStroke 另要求图标实际渲染 16px（回显 3） | 可接受 | 只是收紧选取条件，防止选错行。 |
| P8 | DIFF-9 记「已裁定」（RM13 ②，回显 4） | 有条件 | 删列在 R2-25 范围内；但这是画板上看得见的差异，又没有 Owner 裁定，应比照 DIFF-7 记「待 Owner 知悉」→ C2-8。 |
| P8 | 未知探针 id 报 error（回显 5） | 可接受 | 防止误落到 Highlight 探针。 |
| P9 | SUB-083 等运行中的有限动画（最多 20 轮，跳过无限动画） | 可接受 | 不写死时长；`buttonFeedbackOk: true`。 |
| P9 | SUB-084 接受最近带 title 的祖先，没有照搬 C7 的同角色计数保护 | 有条件 | title 须含该元素的可见文字，误放行的风险低。条件：R3 拆分时与收紧后的 C7 对齐，或在 contract README 写明两者的差异。 |
| P9 | SUB-085 豁免不分主题与承载面（RM6） | 有条件 | 见 §4 O-3。条件：回执继续逐节点列出豁免；Owner 可要求改为跟随主题。 |
| P10 | 取「标签 — 原因」及三项位置定义（回显 1–4） | 可接受 | 与设计板「变成 title 与 sr 文本」一致；C7 与 clipped 的读法一致；能避免出现「原因 — 原因」。 |
| P11 | 每份 README 加门清单指针（SUB-086） | 可接受 | 判据要求如此；readme:proof 绿。 |
| P11 | foundation 标准页该字段保留计划键 pre-INIT-001、INIT-002（RM17 ③） | 有条件 | 这是原有文字，P11 只做了追加；但该字段会进 AI 消费契约 JSON，而内部词汇扫描只扫 HTML。条件：下一批（RM9）去掉计划键，或把 AI 契约 JSON 纳入扫描。 |
| P12 | 8 条宽限记录刷新，逐条记前后值（SUB-075） | 可接受 | §3.2 知悉，收口时列给 Owner。 |
| P12 | 「注明 O-1」写在交回而不写进生成报告（SUB-076、SUB-078） | 有条件 | 不手改生成报告是对的。条件：C2-8 给 DIFF-1、DIFF-3 加 O-1 引用，让报告行能机读关联。 |
| P12 与主线程 | 把 mobileHashAnchorOcclusion 归为 C-21/O-1（steps.md 红步表、P12 问题 3b、RM18） | 不可接受 | 实测失败字段是 searchInput 透明层（C2-3），与 O-1 无关；这一归因把非 Owner 红记成了 Owner 阻塞，也报错了 SUB-046 的阻塞面。 |
| I1 | 值里有多处「 — 」时逐个切分点试，两边都查得到的优先 | 可接受 | 属实现细节；探针显示四种语言下没有整串英文残留。 |
| 主线程 | RM16 ④ 把 3 条漏译记到 28933c7 | 更正（不涉及取舍） | 实际来源是 496c1d7（SUB-064）对 oracle 值的修改。 |
| 各包 | 只读命令里带 cd（RM4） | 知悉 | 未弹框，未改文件。 |

R1 §3.4 落到本分片的按建议先做项：第 4 项（R2-17 原型退役）已做，残留见 C2-7；第 5 项（R2-30）与第 7 项（R2-29、R2-31）已做，见 P9、P10 两行；第 8 项（R2-16 例外登记）已逐条列出，见 P5 各行；第 10 项（C-21 暂缓）已遵守。以上判可接受，条件见对应各行。

## 6. 证据盲区

1. 没有重跑任何门。读数来自 e643d74 的批末逐段日志与入仓回执。入仓的 internal-vocabulary-scan 回执是 35 页，批末运行是 37 页（RM18）；SUB-046 的回执一致性不在本分片，留给 A/B 分片或判断。本分片 SUB-072 的结论只用了 25 log（37 页，0 命中）。
2. 目视项一概没有看图：MultiSelect 静态展开态的排法、样板壳 landmark 名、Button title 的悬停文字、文档顶栏搜索框外观、导航壳搜索面板的现状。Owner 清单已列。
3. s254-story-dom-proof 不在 verify 里，storyExpanded 取自 P6 交回。非英文下 title 的翻译情况取自 I1 的只读探针；门（ja 检查与 localeLeakScan）只读 innerText，读不到 title。
4. package-context 142 处没有逐条复核（按 §3.3 交后续批次）。
5. 纸离边与顶栏 52 没有门测量（§4 O-1）。
6. CI 在 Linux 上的浏览器门没有实跑；没有推送。
7. 守卫对 storybook.css 文档块的覆盖靠读 story-demo-styles.ts 代替，二者一致由 demo-styles-sync `--check` 保证，本验收没有另行逐字比对。
8. 规则级守卫看不到 data 属性主体的规则（P5 问题 5）。第一批家族里有没有同类规则，只做了正则粗扫（未见），没有逐条解析。
