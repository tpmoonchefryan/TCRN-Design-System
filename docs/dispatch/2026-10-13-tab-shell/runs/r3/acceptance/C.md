# R3 批末验收 · 分片 C（TCRN-DS-STORY-147 至 150）

节行号：§1 一览 第 7 行；§2 逐 Story 第 18 行（147 第 20、148 第 58、149 第 75、150 第 93、START 质量硬线 第 113）；§3 返工清单 第 127 行（C3-1 第 129、C3-2 第 135、C3-3 第 141、C3-4 第 148、C3-5 第 154、C3-6 第 160）；§4 只有 Owner 能定的事项 第 166 行；§5 实施口径判定 第 177 行；§6 证据盲区 第 217 行。

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD `c4d7780`（比摘录的 `df740e6` 多两个派工文档提交）；`git diff c45c529 HEAD` 只有 `docs/dispatch/**`，代码即批末 verify 的 `c45c529`。静态产物是批末之后 `storybook:build`（`storybook-build.exit` 0）的输出。批末 verify 改写的回执只有 `no-overclaim-scan.json` 与 `scaffold-proof.json`（`receipts-dirty/tracked.diff`），所以树上 `docs/verification/internal-alpha/*`、`shell-measure/report.json` 等与批末运行同字节。方法只读：读批末逐段日志（`NN log:行`，目录 scratch `r3-verify/`）、回执、源文件与包交回；在 scratch `acc-r3-C/` 写只读探针（Playwright 经本地静态服务开静态产物，脚本 `probe/*.mjs`，读数 `probe-doc.json`、`probe2.json`、`probe3.json`、`probe4b.out`，汇总 `probe-doc-sum.txt`、`probe2-sum.txt`、`probe3-sum.txt`、`gm-sum*.txt`、`parity.txt`、`bp.txt`、`mig2.txt`、`shots-dim.txt`）。未重跑门、未构建、未写链；工作树只新增本文件。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 147 文档壳 | 部分（GWT 与符合性的机器判据全满足；START 禁用清单一处） | GWT1–4 满足；R2 的未满足项（parity、浮层非真件、字标换字、弃用别名、30.02）全解决；剩：展开的故事标题画 3px 强调色左边条（START 禁用清单「左边条」）；视觉签名对高 story 只截到纸内可见的一段（门盲区） | 2（C3-1、C3-2），另可推迟 1（C3-6） |
| 148 五样板 | 阻塞于 Owner（O-2） | GWT1 部分（Brand 板无 D 段，O-2，无回退）；GWT2 由不满足转满足（23/23、overlap 0、样板壳高 640）；GWT3、GWT4 满足 | 1（C3-3 的 storybook-map.json） |
| 149 壳层门 | 阻塞于 Owner（O-4；C8 先交判断） | GWT1 真件 18 门 17 过、只剩 markText（O-4），变异与夹具全部判红；GWT2 不满足：批末 verify 红 13（C8 18 条）与 18（markText）；GWT3、GWT4 满足 | 0 |
| 150 4.0.0 候选 | 满足（机器判据；判定人 Owner 未签） | GWT1–4 满足；SUB-208 至 211 达成；文档质量两处（迁移说明开头与分消费方清单停在 M28、点名外旧文字两处）与视觉签名截图盲区 | 3（C3-2、C3-3、C3-4） |

返工共 6 条：主力 2（C3-2、C3-6），经济 4（C3-1、C3-3、C3-4、C3-5；C3-5 不属本片 Story，归属交判断）。对 R2：147 的 parity、30.02 转绿，文档壳浮层换成水合真件（≤ 760 开 Sheet），首行字标五语不换字，构建弃用提示 28 名 210 处 → 0；148 映射 19 → 23 绿；149 真件 13 过 5 红 → 17 过 1 红，prail 转绿，故事变异 21/22 → 22/22，壳层门第一次在批末 verify 里执行；150 无回退。R2 已返工过的目标在本片没有一条再不满足，所以本片没有按「再退回即交 Owner」规则转出的阻点；剩下的 Owner 阻点是既有待裁的 O-2、O-4 与 R3-8 新出的 C8（先交判断）。

## 2. 逐 Story

### 2.1 TCRN-DS-STORY-147 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 doc-shell:proof 包外类 0、例外清单为空 | 满足（无回退） | `12 log:29–31,46–47`（ok、`DOC_SHELL_CLASSES_PACKAGE_BACKED`、outOfPackageCount 0）、`:458` unmapped []；`06.10` 12 项计数全 0、docExceptionsUnused 0；search-static 的例外与白名单本轮也删掉，脚本现存 3 条例外（`shell-fidelity-proof.mjs:339,353,361`：tooltip、filter-bar、skip-link）都不是 SUB-101 的文档壳例外 |
| 2 顶带 52、纸 12 / 52 / 14、常驻侧栏 0 | 满足 | `probe-doc.json` 26 次（index、foundations、导航与壳层、change-log × 两主题 × 1440；foundations 与导航与壳层 × 1023、761、760、390 × 两主题；zh-CN 两页）：文档壳恰 1 个、全部水合；顶带 y 0、高 52、四边框 0、无阴影、底透明落在画布色上；纸 (12, 52)、右与底 12、圆角 14；纸外可见物 0、侧栏与收起类 0 |
| 3 目录在纸内 TocRail | 满足 | `[data-doc-toc] aside.tcrn-toc-rail` 全在纸内，标题 h2（SUB-202）；1440 时 x 1256、宽 144，导航与壳层页 11 项；窄屏与正文同列（1023 时 x 40、宽 943）仍在纸内（`probe2.json` toc、`probe-doc.json`） |
| 4 storybook:build 退出 0 | 满足 | `storybook-build.exit` 0；`storybook-build.log:67` 与 `03 log:87`「no deprecated token names in 55 file(s)」 |

符合性：
- 文档壳由 ProductShell 顶带态渲染：满足（R2 部分）。文档壳是水合真件（`[data-doc-shell-root][data-shell-hydrate]`，26 次都带 `data-shell-hydrated`）。点标按钮：1440、1023、761 开 `section.tcrn-shell-menu__panel`（1440 时顶 52 = 标按钮底 46 + 6、左 12、宽 952、搜索 936 × 40、行 32；底栏锁定块不在控件内、可聚焦子 0、右缘 = 面板右 − 16、带 `svg[data-logo=ds]`；761 时宽 737）；760、390 时壳根 `data-state="sheet"`，开 `section.tcrn-shell-sheet__panel`，行 44，无收起钮。Esc 关闭并回焦标按钮（20 组全过）；点纸（1440、1023、761）或点 Sheet 遮罩（760、390）都关闭（`probe2-sum.txt` SHEET、`probe3-sum.txt` sheetOutside）。26 次页面加载控制台错误 0。D1「壳只有一种」在 ≤ 760 成立。
- 内容居中 1040：满足（1440 正文 x 200、宽 1040，中心与纸中心差 0；窄屏随纸收窄，中心差 0）。
- 夜间分类计数 ink-2：满足（index、foundations、change-log 夜间 rgb(169, 166, 156)，浅色 rgb(79, 76, 67)）。
- 4 条例外与 2 条白名单删除、doc-shell 仍 0：满足。
- 判定人 shell:parity：满足（R2 不满足）。`11 log:5` ok true；9 角色基线全绿（redThenGreen：baselineRed false、mutationRed true、restoredGreen true）；package-nav-item 两侧行盒都读 `0px / 12.5px / 0 4 0 8`（文档侧普通行、包件侧可钉行复合读法），自检把包装右内距改 0 → paddingRight 4 对 0 判红（`parity.txt` rowBoxProbe）。
- 品牌字标原样：满足（R2 C2-3）。导航与壳层页 shell-brand-first-line 在 en、zh-CN、ja、ko、fr 下 DS 两枚首行锁定块的字与 title 都是「TCRN Design System」，锁定块根的可及名相同；只有 aria-hidden 子树里的标 svg 仍被换字（zh-CN「TCRN 设计系统」、fr「Design System TCRN」），不暴露给读屏（`probe2-sum.txt` BRAND LINE、`probe3-sum.txt` labels）。文档壳标按钮字标五语相同。
- START 禁用清单「左边条」：不满足（新发现，M8 问题 3 已记，本片实测确认）。文档页每个展开的故事标题 `article[data-story-collapsed="false"] > .tcrn-doc-story-disclosure__heading` 画 `box-shadow: inset 3px 0 0 var(--tcrn-color-acc)` 并加 padding-left（展开 navigation-shell-spec 后实测 `rgb(11, 107, 101) 3px 0px 0px 0px inset`、10px，`probe2-sum.txt` BAR），规则在 `alpha-styles.ts:237–240`；selection-grammar 不看 `[data-story-collapsed]`，门是绿的 → C3-1。
- 视觉签名：批末 30.02 门控 217 条、回归 0（`30.02 log:19`），但截图形态有盲区（M11 问题 1，本片复核）：`desktop-1440x900-i18n-theme-contract.png` 1040 × 1807，只有中段约 840 高画了 story，上约 450、下约 490 是画布底，文档壳顶带的固定项行压在 story 上缘；328 张截图里 44 张桌面截图高于 900（`shots-dim.txt`，`ai-consumption-contract` 1040 × 14290）。纸是滚动容器，元素截图只画得出纸内可见的一段 → C3-2。
- Owner 目视：不代签。

R2 未满足项复核（按 R2 编号）：
- C2-3、C2-4、C2-6：已解决（见上；R2 盲区 ja、ko 本轮实测）。
- C2-5：已解决。`browser-proof-summary.json` 复现性 normalizedBytesEqual true、两份投影 digest 相同；禁用项读回 3 个样本（三视口「Release notes」，原因「Opens after the release is published.」）ok；zh-CN 泄漏扫描各页 `shellBlockWaits` 全 settled、unsettled 空，新泄漏 0（`30.02 log:44`）；分类说明 categoryAriaFailures 三视口空；storyCoverageManifest ok（`30.02 log:36`）（`bp.txt`）。
- C2-8：已解决。构建弃用提示 0；死规则、例外、白名单项删掉（`git grep` `static-display` 与 `EX-INIT015-doc-product-shell-search-static` 在 apps、scripts 下 0 处）；`icon-roster.tsx:1` 写 38。余下另 6 个死类与 5 项无主白名单（M8 问题 1、2）不在 R3-27 点名范围 → C3-6（可推迟）。
- C2-10：①–⑥ 都已解决（axe 0 `30.02 log:12`；smoke 退出 0；clippedButtonText false `30.02 log:38`；geometry:proof 退出 0）；⑦ contract:static 的测试不变式已解决，但 R3-8 登记顶带后新出 C8 18 条（见 2.3）。
- 批末与本 Story 有关的步骤 06.10、10、11、12、17、30.01–30.04 全部退出 0。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-197 | 完成（B 类读法） | 一致：parity 退出 0、自检判红；读法判定见 §5 M2-2 |
| SUB-198 | 部分（(c) 无样本） | 完成（以实测为准）：M9 附录在 `navigation-primitives-spec` 样本块补了带原因的禁用 NavItem，批末读回 3 个样本 ok；(b)(d)(e) 批末都绿 |
| SUB-199 | 完成（根因 A） | 一致：批末 clippedButtonText false；探针 1440、390 下 AOS 实例 12 个变体的 h3、h4 裁切 0（`probe2-sum.txt` AOS） |
| SUB-200 | 完成 | 一致：`17 log:2244–2246,6043–6045` 两项 ok、failures []；两个 search-results 变体各 1 条结果；zh-CN 工作队列含「工作项」（1440、390） |
| SUB-201 | 部分（smoke.test 过期交 M9） | 完成（以实测为准）：M9 附录对齐后批末 storybook 单测 14/14（`05 log:330,344–347`）；四宽度 Sheet / 面板读数本片复测一致 |
| SUB-202 | 完成 | 一致：文档页目录标题 h2，批末 axe 0 |
| SUB-203 | 完成（无需门侧改动） | 一致 |
| SUB-204 | 完成 | 一致：前四个文件弃用名 0；M9 换完 story-content 后全站 0 |

### 2.2 TCRN-DS-STORY-148 · 阻塞于 Owner（O-2）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 五块成品板 D 段各有顶带壳样板、几何同 07b | 部分（阻于 O-2，无回退） | 本轮 `docs/design/visual-standard/**` 无改动（`git diff --stat 6f739b2 c45c529 -- docs/design` 只有 gplus-2026-10 下四个文件）；四板 D 段的 R1 几何结论不变；Brand 板仍无 D 段 |
| 2 23 行全绿，删一个 story 判红 | 满足（R2 不满足） | `19 log:4078–4079` rowsOk 23、redRows []；删 story 判红 `19 log:10,19` 两条过 |
| 3 shellFrame 夹具绿；顶带加 1px 底线判红 | 满足（无回退） | `18` 第一段 selfCheck ok；真件变异 shell-top-band-rule 读 1、shell-paper-inset-zero 读 12、shell-top-band-68 读 16，都判红；12 次样板 run shellFrame 偏差 0、overlap 0（`gm-sum2.txt`） |
| 4 五矩阵格数与对比度不变 | 满足（无回退） | `07 log:31` 6 板 306 格（44 / 28 / 10 / 116 / 42 / 66）逐格等于板 data-expect，最大差 0.00；`18` 第一段 contrast pass |

样板实测（`probe3-sum.txt`，展开故事后 1440 × 900、两主题）：12 个画框（6 样板 × 浅夜块）的画框、包装层（`style="block-size:100%"`）与壳都是 640，壳底与画框底差 0，浅夜块间距 12；纸内主区 overflow-y auto、clientHeight 576，typography 597、inputs 617 可滚，其余 576；标按钮 (12, 6) 134 × 40，纸 12 / 52 / 12 / 12、圆角 14，顶带 52 无底线无阴影，固定项间距 [8, 8, 8, 8]，侧栏与收起类 0。R2 的 C2-2 已解决。

符合性：样板换顶带壳、shellFrame 改量 52 / 12 / 14、矩阵格数与对比度不变：满足。成品画布原地替换、不新增版本：本轮未动画板，R2 读数不变。storybook-map：人读版已按 SHELL-D2 改；机读版 `storybook-map.json` 仍把 O-3 夜间 #7aa0f5 写成现行、DIFF-10 是旧值（第 33、123 行，M10 问题 1）；门只核对 md 的编号与 json 的 status，所以不红 → C3-3。Owner 目视（发布后）：不代签。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-205 | 完成 | 一致（见上；十个样板壳 640，本片两主题 12 个画框复测） |

### 2.3 TCRN-DS-STORY-149 · 阻塞于 Owner（O-4；C8 先交判断）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 18 门全绿；每条变异判红 | 阻塞于 Owner（O-4）；变异部分满足 | 真件（`18` 第三段，24 次 run）：17 门过，markText 红（`18 log:8245`）；四项检查 prail、pageCrumbs、settingsLayout、splitView 全过（R2 prail 红）；故事变异 22 / 22 判红（含 story-label-plus-40）；D 段 12 行 11 过，只剩「标按钮（v2）」（`18 log:12693`，与 markText 同根）。夹具（第二段）：两块板 18 门与 4 检查全过，板变异 20 / 20 判红，包件钩子夹具 3 / 3、页夹具 4 / 4 判红（`gm-sum4.txt`）。单测 41 / 41（`18 log:7373–7374`），含「149-GWT1 board side」「real-part side」（`:7348,7351`） |
| 2 verify 含壳层门且退出 0 | 不满足（阻于 O-4 与 C8） | 壳层门这次在批末 verify 里执行了（R2 被 gplus overlap 截停）；批末 30 步红 2：`13` contract:static 只剩 C8 18 条（R3-8 把顶带登记为工具栏后出现：`C8.yield-without-min-width` 1、`C8.story-yield-missing` 17，M2 交回第 4 节）；`18` 只剩 markText |
| 3 CI 必跑步骤含壳层门 | 满足（无回退） | `.github/workflows/verify.yml:59–63`；单测「149-GWT2 and 149-GWT3」过（`18 log:7349`） |
| 4 measure-shell.js 与门同读数（±0.5） | 满足 | `18 log:7344`；M1 三次改读法后都相等，measure-shell.js 无需镜像 |

markText 读数（`18` 第三段）：DS 首行 `lkr-line@22:design-system` 1.4，en 与 zh-CN 相同（`18 log:11594,11774,11954,12134`；R2 的 zh-CN −1.1 随 SUB-195 消失）；TMS 底栏锁定块 `lkr@22:tms` en 1.7（shell-top-band 的 ts-x-l、ts-x-n、ts-search-l，shell-narrow 的 ts-narrow-x-l，shell-matrix 两格；`18 log:8324–8336,8476–8488,8883,9016,10476–10482,10772–10778`），zh-CN 过。★`runs/r3/verify/steps.md:57` 与主线程问题 M4 只写了 DS 1.4，漏了 TMS 1.7（en 两主题 8 个 run）；两处同属 O-4，结论不变，交判断与 Owner 时应并列。

符合性：18 门齐、阈值只在 THRESHOLDS、每门一条变异、运行只在 1440 × 900 与 390 × 844、en 与 zh-CN：满足。「全绿且变异全红」：不满足，只差 markText（O-4）。行为：intro 首载 1、再载 0、减弱 0，[transform, opacity]、477 ms；focusLoop 的 ⌘K 落在被测屏自己的搜索；点外部关闭（两语）。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-206 | 完成 | 一致：真件 pinJitter 24 次全过（R2 菜单 8 个 run 红）；label-plus-40 夹具与真件判红；取法判定见 §5 M1-1 |
| SUB-207 | 完成 | 一致：真件 contrast 全过；夹具 srch-kbd-l 7.59、srch-kbd-n 6.11 等于期望（`18` 第二段 packageFixture readings）；退回祖先链的格 0 |

### 2.4 TCRN-DS-STORY-150 · 满足（机器判据）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pack:smoke | 满足 | `16 log:6` ok true，三个包 4.0.0 tarball |
| 2 迁移说明逐条有步骤 | 满足 | `docs/migration-4.0.md` M1–M48 共 48 节，每节都有「Do」（`mig2.txt`）；本轮追加 M38–M46（SUB-210）与 M47、M48（M11 附录），只追加、未改旧条目 |
| 3 清单每板一节，不含构图一与侧栏项 | 满足（无回退） | `owner-acceptance.md` 第 35、52、73、95、119、142、165、197 行八节对 8 板；「构图一」「侧栏」只在历史说明、F 段弃用别名说明、G-8 历史与删去项表（第 7、209、293、345–358 行） |
| 4 version-surface 7 处 4.0.0 | 满足 | `29 log:245–277` |

符合性：changelog 发布段 ok、pending [4.0.0]（`29 log:212–240`）；三个包 package.json 4.0.0；无 `v4*` tag，分支无 upstream：满足。迁移说明两批条目齐：满足；但开头仍写第二批是 M20 到 M29（第 6–7 行）、来源只指 INIT-016 r1 交回（第 26–29 行），「By consumer」三份清单只引用到 M28，M29–M48 一条没进（`mig2.txt`），消费方照清单做会漏 `landmarkLabel`、`menuShortcut`、按 `data-logo` 选标、AI 契约改名等步骤（M10 问题 4、清单 G-21 已记）→ C3-4。旧壳文字：R3-28 点名各处已清（M9 交回 §5 处置表、M10 交回第 2 节；本片抽查四个 README `git grep 7aa0f5|rail-w` 只剩写明「已退役」的一句）；点名外仍有两处：`storybook-map.json` 第 33、123 行（同 148）、`packages/ui-react/README.md:267`「37 names of tcrnIconNames (28 existing and 9 added)」（名册现为 38，M8 问题 6）→ C3-3。

SUB-211：视觉签名接受 217 条（回归 199、新增 18；A 类离群 24 条逐条写理由并进清单），批末 browser-proof 回归 0、新增 0（`30.02 log:19`），hardening ok（`30.04 log:2`）；清单「机器证据入口」、G-5、G-13、G-14 改为第三轮读数，G-15 至 G-21 补本轮差距，待裁表补齐 O-1 至 O-18（第 312–341 行）。截图形态的盲区见 C3-2：这 217 条基线只代表各 story 的可见一段。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-208 | 完成 | 一致：构建弃用提示 0（`03 log:87`）；`30.01 log:6` ok；smoke 0；残留词处置表在 M9 交回 §5；保留的「sidebar clones」一句判定见 §5 |
| SUB-209 | 完成 | 一致（文件集内）；`storybook-map.json` 不在文件集 → C3-3 |
| SUB-210 | 完成 | 一致；开头与分消费方清单不在授权内 → C3-4 |
| SUB-211 | 完成 | 一致；截图盲区 → C3-2 |

### 2.5 START 质量硬线

| 硬线 | 文档壳（147） | 样板（148） | 门（149 真件） | 结论 |
| --- | --- | --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 26 次纸外可见物 0、侧栏与收起类 0；面板与 Sheet 里收起钮 0 | 12 壳 0 | noCollapse 过 | 满足 |
| 顶带无底无线、中线 26 | 四边 0、无阴影、底透明；标按钮与字标中线 26 | 同 | strip、brandGeometry、barCentering 过 | 满足 |
| 三处间距相等 | 1440：标按钮→首项 8、项间 8（6 项，en 与 zh-CN）；< 1024 固定项整组收进菜单 | [8, 8, 8, 8] | pinSpacing 过 | 满足 |
| 接续 6 | 菜单顶 − 标按钮底 = 6（1440、1023、761） | — | continuation 过（含下拉） | 满足 |
| 锁定块只装饰 | 不在控件内、可聚焦子 0、右缘 = 面板右 − 16、带 `svg[data-logo=ds]` | — | lockupDecor 过 | 满足 |
| 品牌资产 digest | 字标五语原样；标 ds | 标与字标完整 | brandDigest 过（R2 红）；`14 log:7–8` BRAND_ASSET_SOURCE_VERIFIED | 满足（R2 不满足） |
| 标旁文字中线 | 字标盒中线 26 | — | markText 红：DS 首行 1.4、TMS 底栏 1.7（en） | 阻塞于 O-4 |
| 登入动画只用 transform 与 opacity | 文档页不播 | — | intro 过：[transform, opacity]、477 ms、首载 1、再载 0、减弱 0 | 满足 |
| 禁用清单「左边条」（第一批硬线，START 第 83 行） | 展开的故事标题 3px 强调色内阴影 | — | 无门量 | 不满足 → C3-1 |

## 3. 返工清单

### C3-1 文档页展开故事标题的 3px 强调色左边条（经济）
- 现象：每个展开的故事标题左侧画 3px `--tcrn-color-acc` 内阴影、加 padding-left 10，属 START 禁用清单「左边条」；selection-grammar 只看选中类标记，不看 `[data-story-collapsed]`，所以门绿。
- 证据：`probe2-sum.txt` BAR（导航与壳层页展开 navigation-shell-spec 后 `rgb(11, 107, 101) 3px 0px 0px 0px inset`、padding-left 10px；收起时 none）；`apps/storybook/src/alpha-styles.ts:237–240`；`START-INIT-016.md:83`；M8 问题 3。
- 改法：删 box-shadow 与随它加的 padding-left，展开态由 chevron 旋转表达。文档页可见变化：受影响 story 的视觉签名在同一批末一次重收，并进 Owner 目视。
- 文件：`apps/storybook/src/alpha-styles.ts`（重收落在 `docs/verification/**`）。涉及 147。

### C3-2 视觉签名截图只截到纸内可见的一段（主力）
- 现象：换顶带壳后 story 在纸内滚动区里，元素截图只绘出纸内可见的约一屏，其余是画布底，文档壳顶带的固定项行压在 story 上；高于一屏的 story 纸外内容改了门不红，顶带一改所有高 story 一起变。本轮 217 条基线按这个形态收下。
- 证据：M11 问题 1；`docs/verification/internal-alpha/screenshots/desktop-1440x900-i18n-theme-contract.png`（1040 × 1807：上约 450、下约 490 为空，固定项行横在 y ≈ 450）；`shots-dim.txt`（44 张桌面截图高于 900，`ai-consumption-contract` 1040 × 14290）。
- 改法：截图期间让被截 story 不受纸的裁切——临时去掉文档壳纸与主区的滚动裁切（高度随内容、overflow visible）并把文档壳顶带移出截图区，截完还原；或按纸内滚动分段截取再拼。截法改后整批重收一次基线（会再动全部高 story），选择文件逐条注明「截法变更」。阈值不改。属门的截图方式与判定口径，先交判断定口径。
- 文件：`scripts/internal-alpha-browser-proof.mjs`（截图段），必要时 `scripts/lib/visual-signature.mjs`；`docs/verification/internal-alpha/**`。涉及 147、150（SUB-211 的基线）。

### C3-3 点名外的旧文字两处（经济）
- 现象：(a) `docs/design/gplus-2026-10/storybook-map.json` 仍把 O-3 夜间 #7aa0f5 写成现行，DIFF-10 是旧夜间值与旧 status，refs 没有 SHELL-D2、SHELL-D7，与 md 分叉（md 第 3 行写「两份同源」）；(b) `packages/ui-react/README.md:267` 写 37 个图标名（28 + 9），名册现为 38（含 pin，M25）。
- 证据：json 第 33、123 行；M10 问题 1、M8 问题 6；`Icon.test.tsx` 断言 38。
- 改法：(a) 把 md 第 33、36、38、138 行原样搬进 json，同一提交，`differencesPendingOwner` 仍为 0；(b) README 改为 38 并指向 M25。不改门。
- 文件：`docs/design/gplus-2026-10/storybook-map.json`、`packages/ui-react/README.md`。涉及 148、150。
- 说明：R3-28 是 R2-29 的再返工，但这两处不在 R3-28 点名的行与 SUB-209 的文件集里（拆分漏列），本片按新发现列返工；判断若认定属同一目标，改列交 Owner 的阻点。

### C3-4 迁移说明开头与分消费方清单跟上 M29–M48（经济）
- 现象：开头写第二批是 M20 到 M29、来源只指 INIT-016 r1 交回；「By consumer」三份清单只引用 M1–M10、M14–M28，M29–M48 没进任何一份。
- 证据：`docs/migration-4.0.md:6–7,26–29`；`mig2.txt`；M10 问题 4；`owner-acceptance.md` G-21。
- 改法：开头改为第二批 M20–M48（三轮）、来源补 r2、r3 交回目录；三份清单按条补步骤（多壳页面传 `landmarkLabel` 与 `menuShortcut`、按 `data-logo` 选标的测试、TocRail `headingLevel`、AI 契约字段改名 M47 等）。这是改别人写的段落，须判断对这两段放开 C-11「只追加」；条目本身不动。CHANGELOG 摘要已列到 M48，不用改。
- 文件：`docs/migration-4.0.md`。涉及 150-GWT2 的可用性。

### C3-5 Disclosure 展开区按钮的底边描边被裁（经济；不属本片 Story，归属交判断）
- 现象：`interaction-disclosure-spec` 展开区里的次级按钮「Focusable only while expanded」，描边是外扩 1px 的 box-shadow（`0 0 0 1px rgba(22, 21, 15, 0.47)`），按钮底与 `.tcrn-collapsible-region__inner`（overflow hidden、padding-bottom 0）的底重合（1440、1024、390 三视口差 0），底边线被裁；违反第一批 C 段「任何元素不超出裁切祖先」。M11 问题 2 与清单 G-18 只记为疑似目视项，本片 DOM 实测确认。
- 证据：`probe4b.out`；`packages/ui-react/src/styles/base.css.ts:2395`。
- 改法：区域内层在块向末端留出描边宽度（token 化的 padding-block-end，或 `overflow: clip` 加 `overflow-clip-margin`），不改按钮描边画法；几何门补这一处 clip 读数。改后该 story 签名重收。
- 文件：`packages/ui-react/src/styles/base.css.ts`（必要时几何门脚本）。第一批 Disclosure 件，不在 147–150 判据内，交判断定归属。

### C3-6 旧壳遗留的死代码（主力；可推迟）
- 现象：(a) 文档层还有 6 个类的规则在源码与构建页都没有写入处（`.tcrn-doc-eyebrow`、`.tcrn-doc-claim`、`.tcrn-doc-brand`、`.tcrn-doc-search-results`、`-result`、`-empty`）；(b) shell-fidelity 白名单 5 项没有任何文档规则以它为主题，注释仍写已退役类；(c) storybook-smoke 约第 2392、1782 行读退役的侧栏切换钮与侧栏区，读回恒空、不判红；(d) 两份 AOS 视觉实例里 `searchLabel` 等 5 个文案字段无人读。
- 证据：M8 问题 1、2，M9 问题 5，M6 问题 5。
- 改法：同一提交删 (a)（改 `story-demo-styles.ts` 后跑 demo-styles:sync）与随之无用的 (b) 白名单项和注释，同步 `docs/style-scale.md`；(c) 删空读回或改为「已退役」反向断言；(d) 删字段。(b)(c) 是门的收紧与结构调整，须判断授权，故起主力。不影响任何判据，排在 C3-1 之后或下一批。
- 文件：`apps/storybook/src/alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`（同步段）、`scripts/shell-fidelity-proof.mjs`、`docs/style-scale.md`、`scripts/storybook-smoke.mjs`、两份 `visual-instances/aos-*.tsx`。涉及 147。

## 4. 只有 Owner 能定的事项

新发现：本片没有新的只能由 Owner 定的设计事项。C3-2（截图口径）、C3-4（对两段放开 C-11）、C3-6（收紧白名单）都交判断。

本片未满足项挂着的 Owner 项：
- O-4（149-GWT1、GWT2，硬线「标旁文字中线」，D 段「标按钮（v2）」）：两处读数，DS 首行 1.4（en、zh-CN）与 TMS 底栏锁定块 1.7（en）。建议同 R2 判断：±1 改量「首行大写顶到基线」，两行锁定块只量首行。不裁则 149 不能收口。
- C8（149-GWT2 依赖；R3-8 新出，M2 问题 1、2，清单 G-16）：先交判断。R3-8 是判断定的收紧，判断可以 (a) 保留登记，(b) 撤回顶带的 C8 登记，(c) 按 B 类在 `roles.json` 写明顶带的让步项可缺省、可收到 0（照板 `.ts-pins` 的 `min-width:0`），C8 对顶带只判固定项不收缩（已满足）。建议 (c)：板是几何权威，非零 min-width 与 D1「窄于 1024 整组收进菜单」的固定项行为对不上。只有选 (a) 时才交 Owner：给让步项一个板上没有的最小宽度，并定无固定项时是否渲染空让步位。待裁表（`owner-acceptance.md` 第 312–341 行）还没有这一行，判断定后补。
- O-2（148-GWT1）：建议同 R2，接受「四板 D 段 + 07a 第 1 段」，链上注解写明读法。
- O-1（文档壳与样板字标 61 / 117 截断带 title）、O-7、O-8：同 R2 建议，不阻本片机器判据。
- Owner 目视：147、148（发布后）、150 的判定人含 Owner，本片不代签；S-1 库门未声明前 4 张都不能转 done。本轮新增与变化的目视项已在清单「第三轮新增与变化的目视项」与离群 24 条；C3-1 改后加「展开故事标题无左边条」一项。

## 5. 实施口径判定

| 包-条 | 写明的选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| M1-1 | story-label-plus-40 改取完整菜单第一个可见组标题，先去截断再加 40 字 | 可接受 | 截断带 title 时加长是等价变异（13 处取样都不红），去截断才构成真实违例；夹具与真件都判红，G 段字句与 source 不变 |
| M1-2 | contrast 读底时临时让格可命中，经 style 属性还原；命中不到退回祖先链并标 backdrop | 可接受 | 读后无 style 残留有测试；退回 0 格；66 格 × 4 run 只 srch-kbd 两格变到板值 |
| M1-3 | 旧读法红用同页模拟复现 | 可接受 | 不另留旧代码，复现点准确 |
| M1-4 | o.prail 测试期望写入隐藏列图标 −12 | 有条件 | 把已知不对的读数写成期望；各门不判 o.prail，暂无害。条件：下一个壳层门持有者把 o.prail、o.rows、x.rowHeights 统一为只读渲染元素并镜像 measure-shell.js（M1 问题 5） |
| M2-2 | SUB-197 可钉行用复合行盒：四向内距 = 包装 + 贴边一侧行链接的内距，右侧只取包装；字号与最小高读行链接 | 可接受 | 判据字面会把包装继承的字号 13、min-height auto、左内距 0 读成三处假差；复合读法对应板上单元素 `.ts-it`（0 4 0 8、12.5），字段与精确判定不变，自检判红 |
| M2 其余 | SUB-181、189–191 的选择 | — | 归 140、143 所在片判 |
| M5-1 | 复现性：两探针投影字节相等且各自 openMenus = 由 aria-controls 派生的 expectedOpenMenus | 可接受 | 去掉常数 6；批末投影 digest 相同 |
| M5-2 | 禁用项读回范围扩到全部 story 正文 | 可接受 | 判定条件不变；样本由 M9 补齐 |
| M5-3 | 水合标记，等待 15 s，未落定的块令 zh-CN 门判红 | 可接受 | 收紧；批末各页 settled |
| M5-4 | describedby 两处统一按空白拆 | 可接受 | 批末 categoryAriaFailures 空 |
| M5-5 | 首行锁定块的可及名取字标 title | 可接受 | 五语实测可及名与看到的字一致；aria-hidden 子树内的换字不暴露 |
| M5-6 至 9 | SUB-195、186 的其余选择 | — | 归 140、145 所在片判 |
| M6-1 | StaticMarkup 加可选 style，只落包装层 | 可接受 | 不传时标记不变；十个样板 640 |
| M6-2 | frontend-shell-slice 整页进 content stack，块距 space-2h → space-5 | 可接受 | 与 owner-quality 和样板写法一致，避免多一个具名地标；块距变化已列目视 |
| M6-3 | 搜索结果取实例自己的 fixture，按查询词过滤 | 可接受 | 每个变体 1 条，与查询相符 |
| M6-4 | 工作队列标题下加「3 个开放工作项」计数行，fixture meta 6 → 3 | 有条件 | 为满足 requiredText 新增了可见内容，但内容真实（队列行数）且修掉了 6 对 3 的不符；条件：Owner 目视认这一行（已列） |
| M7-1、2 | 文档壳模型以英文 JSON 随页、客户端换字；正文静态标记只渲染一次 | 可接受 | 主题、语言实测正常，26 次加载控制台 0 |
| M7-3、4 | `tcrnDocShellLayers.setMenu(true, {presentation: "panel"})` 门专用；窄屏的菜单模型读数临时调到 1440 开面板读 | 有条件 | 读的是同一份模型，判定未改；但 ≤ 760 读者看到的是 Sheet，现有门没有一处读文档壳 Sheet 的内容，本片与 M7 的四宽度探针是唯一证据。条件：门专用选项只用于模型读数，不用于几何或视觉结论；文档壳 Sheet 进 Owner 目视（已列），或下一轮给 smoke 加一处 390 Sheet 读数 |
| M7-5、6 | 语言列表 Esc 只关列表；`shell-shortcut` 参数与导出 | 可接受 | 沿用 SUB-166 约定；SUB-179 归 138 所在片 |
| M8-1 至 5 | 别名一对一换名；删两条会自引用的字族规则；doc-class-map 只改 reason；注释不写例外号；重写 style-scale 一节 | 可接受 | 换名前后逐字比对相同、渲染不变；清单与脚本一致 |
| M9-1 | oracle 新名 `residentNav*`（0）、`bandHeight*`（52），旧名同值留到 4.1 | 可接受 | 0 明示「无常驻导航」，与 D1 一致；smoke 与单测断言新旧同值；已进 M47 |
| M9-2 | AI 契约字段改名与删除 | 可接受 | 已进 M47 |
| M9-3 | AOS 退役三个 collapsed 变体、`desktop-light-collapsed-work` 改名；带 expanded 的变体 id 不改 | 有条件 | 一边改机器键、一边说机器键不改，口径不一；`desktop-light-expanded-cockpit-search-rest`、`desktop-dark-expanded-cockpit` 的壳实为 closed，id 会误导按 id 取的 AI 消费方。条件：下一轮按同一别名口径改名（旧 id 留一版），或在 M48 写明 id 里的 expanded 只是历史 |
| M9-4 | 色板删两块重复色样 | 可接受 | 后继同 token；已列目视 |
| M9-5 至 7 | 样本块命名与禁用 NavItem；字典增删；契约清单两条规则改读水合壳标记 | 可接受 | axe 0、读回 3、contracts 0 |
| M9-保留 | `foundation-visual-standards.ts:833`「…sidebar clones」保留 | 可接受 | 该句是禁止消费方克隆侧栏，在顶带壳下仍成立；被 smoke、单测与泄漏台账钉着（M9 问题 3） |
| M10-1 | 为 internal-vocab:scan 跑一次构建 | 可接受 | 只产生被忽略产物，已移走；属判据要求的读数 |
| M10-2、4、5 | 同文件顺带清旧说法；迁移条目合并 M45、M46；M42 写明两处仍是产品键 | 可接受 | 按代码现读写，未改旧条目 |
| M10-3 | storybook-map 只改 md | 有条件 | 文件集如此；json 分叉由 C3-3 补 |
| M11-1 | 选择文件名 r3，上一份应用记录改名 r4 | 可接受 | KB-022；下次改名避开 `-r3` |
| M11-2 | table-work-index-spec 三条直接从基线 JSON 删去，留痕在 removedBeforeSelection | 有条件 | 绕过选择机制手改生成物，但只删注册表外三条，前后 sha 与 digest 都记了；条件：机制补「只对注册表外 id 的删除处置」，或判断认定为一次性处置（M11 问题 3） |
| M11-3 | 第三轮另变 19 条按「本轮 Subtask 有据」收入，含 color-palette 两条 | 可接受 | 逐条对到提交并列目视；与附录「只收换壳与换样板」字面有出入，判断确认即可 |
| M11-4 至 6 | 第 8 节机器判据同改；M47、M48 键号；geometry:measure 分步跑带 `--write-report` | 可接受 | — |

不可接受：0 条。

## 6. 证据盲区

- 未重跑任何门；批末读数取 `r3-verify/` 日志与树上回执（批末只改写 no-overclaim 与 scaffold 两份，其余回执与批末同字节）。149 的 D 段与板夹具只读报告，未用 measure-shell.js 复量板。
- 探针覆盖：文档壳 4 页 × 两主题 × 1440，2 页 × 1023、761、760、390 × 两主题；zh-CN 2 页；首行字标五语 1 页；样板页两主题；AOS 实例 1440 与 390；点外部只在 foundations 浅色测。其余 33 页未逐页量；文档壳头像菜单里的主题钮与语言列表本片未点（取 M7 读数与批末 smoke）。
- 视觉签名 217 条只看了 1 张截图，其余按尺寸推断；24 条离群未看。
- test:dom 不在批末 verify（O-18）。
- M7 问题 6（正文 DS ProductLogo 的 fr 描述行与契约不一致）：探针没找到正文样本，未复核。
- 链上实时状态未读；Story 原文取 scratch `chain/src/*.json` 快照。
- 残余：scratch `acc-r3-C/` 只有探针脚本与读数，随 scratch 回收；探针的本地静态服务随脚本退出，未留后台进程。
