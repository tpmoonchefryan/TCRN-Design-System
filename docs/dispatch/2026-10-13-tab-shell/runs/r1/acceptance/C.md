# R1 批末验收 · 分片 C（TCRN-DS-STORY-147 至 150）

节行号：§1 一览 第 7 行；§2 逐 Story 第 18 行（147 第 20、148 第 51、149 第 72、150 第 94、START 质量硬线 第 111）；§3 返工清单 第 124 行；§4 只有 Owner 能定的事项 第 234 行；§5 实施口径判定 第 244 行；§6 证据盲区 第 283 行。

被验对象：集成分支 `claude/init016-tab-shell`，HEAD `03bcf25`（比摘录的 `5a82dc5` 只多两次派工文档提交；代码同批末 verify 的 `63e1ee2`，`git diff --stat` 已核）。静态产物是批末 `storybook:build`（退出 0）的输出。方法只读：读批末 verify 逐段日志（`NN log:行`，目录 `scratchpad/r1-verify/`）、门报告、源文件与包交回；另在会话 scratch `acc-r1-C/` 写只读探针（Playwright，本地静态服务或 file://），输出文件名见证据。未重跑门、未构建、未写链；工作树只新增本文件。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 147 Storybook 文档壳改顶带壳 | 部分 | GWT1–4 机器读数全满足；符合性未满足：判定人 shell:parity 红；换壳带出 5 处批末红（06.10、17、28、30.02 的 axe 164 与焦点回路）与 2 处品牌文案不原样 | 9（C1-1 至 C1-8、C1-15 共因） |
| 148 第一批五样板换新壳 | 部分 | GWT2 不满足（映射 23 行 12 绿，11 个样板行 clip 红）；GWT1 部分（四板满足，Brand 板按拆分默认不加 D 段，与字面「五块」不符，交 Owner） | 5（C1-9 至 C1-13） |
| 149 壳层 18 门接入 | 不满足 | GWT1 真件侧不满足（8 过 9 红 1 n/a，真件变异 14/18）；GWT2 不满足（verify 非 0，且壳层三段在批末 verify 里未执行）；GWT3、GWT4 满足 | 4（C1-14 至 C1-17，另 C1-9、C1-15 共因） |
| 150 4.0.0 候选 | 部分 | GWT1–4 满足；挂在本单的 SUB-140 部分（视觉签名基线与 internal-alpha 回执未重收）；验收清单漏列本分片新发现的差距 | 1（C1-18） |

返工共 18 条：主力 6（C1-2、C1-3、C1-4、C1-7、C1-16、C1-17），经济 12。

## 2. 逐 Story

### 2.1 TCRN-DS-STORY-147 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 doc-shell:proof 包外类 0、例外清单为空 | 满足 | `12 log:29–31,46–47`（ok、`DOC_SHELL_CLASSES_PACKAGE_BACKED`、outOfPackageCount 0）；SUB-101 方案 A 的 4 条 R3M5 例外与 `.tcrn-nav-group__label`、`.tcrn-nav-item` 两条白名单已删（2cc712c；`scripts/shell-fidelity-proof.mjs:124,293` 注释，例外表只剩 4 条 Overlay / Navigation 家族的 EX-INIT015-*，不在本单范围） |
| 2 顶带 52、纸 12 / 52 / 14、常驻侧栏 0 | 满足 | `probe-doc.json` 21 次运行（8 页 × 两主题、zh-CN 两次、1023、390 两次）：文档壳 `[data-shell="doc"]` 恰 1 个；顶带 y 0、高 52；纸 left 12、top 52、右距 12、底距 12、四角 14px；纸外 aside / 侧栏 0、收起钮 0、`[data-shell-close]` 0 |
| 3 目录在纸内 TocRail | 满足 | 同上：`.tcrn-doc-page__toc > aside.tcrn-toc-rail` 的最近纸就是文档壳自己的纸；1440 时 x 1256、宽 144，1023 与 390 时在正文上方 |
| 4 storybook:build 退出 0 | 满足 | `r1-verify/storybook-build.exit` = 0 |

符合性逐项：
- 文档壳由 ProductShell 顶带态渲染：满足。标按钮 134 × 40 在 (12, 6)、中线 26；完整菜单顶 52（标按钮底 46 + 6）、左 12、宽 952、搜索 40、行 32、组标题 10px / 500、底栏 52 带 1px 分隔线、锁定块右缘 = 面板右 − 16；Esc 关闭且焦点回标按钮，点标按钮开、点外部收（`probe-doc.json` 的 open / afterEscape / afterClick / afterOutside）。
- 内容居中 1040：满足。正文列 x 200、宽 1040，中心 720 = 纸中心 720；token `--tcrn-layout-content-max-w` = 1040px。
- 夜间分类计数 ink-2：满足。foundations、components、change-log 夜间 rgb(169,166,156) = #a9a69c，浅色 #4f4c43（与 contract/tokens.json 的 ink-2 一致）。
- 4 条例外与 2 条白名单删除、doc-shell:proof 仍 0：满足；但删后 `06.10 log:18–33` shell-fidelity 红（死规则未删，C1-5）。
- 判定人 shell:parity：不满足。`11 log:5`（JSON baseline）文档侧 9 角色 7 同值；2 处值差：组标题文档 10px / 500 对 story 11px / 600，行文档 12.5px、min-height 0、上内距 0 对 story 12px、30、4。实测两侧对 07a（`docs/design/gplus-2026-10/tools/shell-screen.mjs:87–88` `.ts-grp h6` 10px / 500 ink-3，`.ts-it` 12.5px、高 32、上内距 0）：文档侧与板一致，偏的是 story 侧的可钉行（`probe-rows.out`：ts-x-l 行 12px，组标题 11px / 600 ink-2），门报的 `document-lags` 方向与板相反，根因 C1-15。另 10 个样板角色仍读 `.tcrn-doc-global-bar`、`.tcrn-doc-sidebar`、`.tcrn-doc-knowledge-shell__*`，全部缺节点判红（P13 按 C-17 停下，C1-7）。
- tcrn-doc- 只留文档排版：基本满足；剩 `story-demo-styles.ts` 与 `storybook.css` 各 40 处 `tcrn-doc-knowledge-shell*` 死规则（C1-5），`ai-consumption-contract.ts:1039,1046` 仍写文档页用自有壳、ProductShell 不得替代（C1-8）。

换壳带出的批末红（本单根因，包交回未记或记错归属的加 ★）：
- ★`28 log:30` full-surface `proof-proof-governance.html/zh-CN: visible settings explanation not translated`。P13 记为「既有红、原因未定」，实为 SUB-131 回归：6d10851 把运行时换字的跳过选择器从 `[data-storybook-visual-instance]` 放宽为再加 `[data-locale-invariant]`（`apps/storybook/src/build/client-scripts.ts:296–298`），而 AI 契约故事整块 `section[data-ai-consumption-contract-story][data-locale-invariant]` 带该属性，zh-CN 下该格保持英文（`probe-fullsurface.json` exactZh 0、`probe-fs2.out`）。C1-1。
- ★品牌文案不原样（硬线「品牌资产」）：zh-CN 文档页完整菜单底栏锁定块读作「TCRN 设计系统 设计系统」（en「TCRN Design System · Design System」），字标后缀被换字成「设计系统」，Brand 板 E 段是「TCRN Design System」加描述「设计系统」；navigation-shells 页两个 `data-shell=""` 的 ProductShell story 标按钮字标在 zh-CN 也成「TCRN 设计系统」（`probe-doc.json` zh-CN open.lockup、`probe-samples.json` zh-CN）。同根 C1-1。
- ★文档站标按钮放不下「TCRN Design System」：`b` 宽 60、内容需 117，省略号截断（带 title），所有文档页可见（`probe-doc.json` word）；P14 问题 1 顺带提过，未进待 Owner 表。交 Owner（O-1）。
- ★`30.02 log:12` axe 违规 0 → 164（批末 browser-proof 的 ok 含 axe 为 0，`scripts/internal-alpha-browser-proof.mjs:4017`）：page-has-heading-one 108（文档页没有 h1：P10 删了页头标题，纸内 PageHeader 标题恒为 h2，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx:272`；四个静态页 `<h1` 计数 0）、color-contrast 30（标按钮后缀 `em.tcrn-shell-brand__suffix--design-system` 3.29，字标豁免选择器没覆盖新载体，exemptedNodeCount 80 → 1）、landmark-unique 24（文档壳 `nav[aria-label="Pinned items"]`、页头 `nav[aria-label="Breadcrumbs"]` 与页内 story 壳重名）、scrollable-region-focusable 2（proof-visual-instances 的 cockpit 搜索结果，不归文档壳）。明细 `acc-r1-C/axe-diff.txt`（取自 `r1-verify/receipts-dirty/tracked.diff` 第 60–5131 行）。C1-2、C1-3、C1-4。
- `17 log:7101` zh-CN IA 缺「变更日志」、分类说明 0 / 23；`17 log:13139` 与 `30.02 log:22` 语言列表 Esc 后焦点落头像钮（P13 问题 13–15）。C1-6。
- `17 log:61,1350,3099` 三个 ProductShell 比较器读旧侧栏钮、顶栏搜索与主题钮，`17 log:40` 静态段 8 条缺失项（P13 问题 6）。C1-7。
- `30.02 log:42` zh-CN 新泄漏 3（oracle 的 px 单位），`06.10` 漂移在 `30.02 log:253–259` 复现，视觉签名回归 199（`30.02 log:19`，归 SUB-140）。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-131 | 完成 | 几何、目录、1040、ink-2 与自报一致；但同时引入 full-surface zh-CN 回归、品牌字标被换字、axe 164 中的 h1 与地标两类，交回与问题文件都没记 → 部分 |
| SUB-132 | 部分（接续点 3 未做） | 一致：例外与白名单已删、doc-shell 0、文档侧 parity 9 角色改读新壳；样板角色、比较器三段、7 条静态项未处置；full-surface 的根因判断有误（见上） |

### 2.2 TCRN-DS-STORY-148 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 五块成品板 D 段各有顶带壳样板，几何同 07b | 部分 | Typography、Icon、Actions、Inputs 四块成品板（与草稿 V2-B1-Typography、V2-B1-Actions）D 段各两屏 `ty/ic/ac/in-l/-n`，measure-shell.js 读数（标按钮、纸、簇、标、顶带、行中线、三缘、固定项 4 项间距 8）与 `Shell.dc.html` 的 ts-closed-l / -n 逐项相同（`probe-samples.json` frameSame、pinsSame 全 true）；D4 关键词四板 0。Brand 板无 D 段（拆分问题 4 默认：以 07a 第 1 段代替），与 GWT 字面「五块」不符 → O-2 |
| 2 storybook-map 23 行全绿，删一个 story 判红 | 不满足 | `19 log:4461` summary：23 行 12 绿，11 个样板行全是 light:clip、dark:clip；「删一个 story 判红」单测过（`19 log:21–24` 16 / 16），映射结构问题 0、13 块板覆盖齐。根因 C1-9 |
| 3 shellFrame 夹具绿；顶带加 1px 底线判红 | 满足 | `18 log` selfCheck：shell-frame-green 过、shell-frame-red 红、纸贴边 / 顶带底线 / 顶带 68 / 纸直角四个变异全红；真件变异 shell-top-band-rule 读数 1 判红；样板 run 的 shellFrame 全过（`18 log:7457` summary shellFrame pass，复合门退出 1 只因 clip） |
| 4 第一批五矩阵格数与对比度不变 | 满足 | `07 log:31` matrix-expect 6 板 306 格（44 / 28 / 10 / 116 / 42 / 66）、最大差 0.00；`19 log` 各矩阵 cells expected = rendered、expectMismatches 空 |

符合性：
- 样板 story 渲染顶带壳：满足。12 个样板壳（ty / ic / br / ac / in / c3 × 浅夜）顶带 52、无边无影、透明；纸 12 / 52 / 12 / 12、圆角 14；标按钮 (12, 6) 134 × 40、中线 26；固定项 4 项间距 8、高 32；簇右缘 = 纸右缘；纸外 aside 0（`probe-samples2.json`，story 展开后量）。唯一缺陷是字标后缀上下各超出 `b` 1px（em 17.5–34.5 对 b 18.5–33.5），C1-9。
- shellFrame 改量 52 / 12 / 14：满足（读 C-5 钩子，只认被量壳自己的顶带与纸）。
- 成品画布原地替换、不新增版本：仓内四板原地改、heights.json 已改；`visual-standard/canvas.json` 的 h 与 y 未跟（P11 问题 2），C1-12；Icon 板 6 处、Typography 板 1 处（许可表「图标 37 件」，`build-typography.mjs:259`）仍写 37 件，名册已 38，违反 D4「文字与格值不得前后矛盾」，C1-13（P11 只记了 Icon）。
- ★`05 log:16,36` pnpm test 首包即红：ui-tokens 测试从 `build-shell2.mjs` 读 `.scr.ts` 默认值，SUB-133 把 `screen()` 与 CSS 抽到 `shell-screen.mjs` 后读到 undefined；之后 ui-react、storybook、两个 pilot 的测试批末都没执行。P11 局部门不含 pnpm test，未记。C1-10。
- storybook 单测（据 P13、P14 交回，批末未执行到）：构图一 rail 断言、构图三旧 TopBar 断言仍红；样板五语标题与描述仍写构图一（P14 问题 2、3）。C1-11。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-133 | 完成 | 四板 D 段几何实测与 07a 相同；Shell 两板未提交（字面守护在改动前就红，按等价守护）；但抽模块打断 ui-tokens 测试（C1-10），Typography 板的 37 件未处理 → 部分 |
| SUB-134 | 部分 | 一致：映射、夹具、shellFrame、样板换壳都在；11 行红只因包内字标 1px 裁切（C1-9） |

### 2.3 TCRN-DS-STORY-149 · 不满足

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 18 门全绿；每条变异判红 | 不满足（真件）／满足（画板） | 画板：`scratchpad/logs/r1-p15/sub140-sm-fixtures.log` 两块成品板 18 门全过、18 条变异按声明全红。真件：`docs/verification/shell-measure/report.json`（f98b298 入仓）gates 8 过 9 红 1 n/a（brandDigest、continuation、noCollapse、lockupDecor、contrast、singleLine、intro、focusLoop、touch 红，pinJitter n/a），真件变异 14 / 18（去掉会话标记、关闭时不还焦点、行高 32 不可区分，图钉位 n/a）；D 段 12 行 5 过 6 红 1 n/a |
| 2 pnpm verify 含壳层门且退出 0 | 不满足 | 根 `package.json` 的 verify 含 `geometry:measure`，后者串入壳层三段（静态满足）；但批末 verify 退出非 0，且 `18 log:86` 第二段 geometry-measure-proof 红后 `&&` 链停（`18 log:7500` ELIFECYCLE，日志里没有壳层三段的输出），壳层门在批末 verify 里一段都没执行 |
| 3 CI 工作流的必跑步骤含壳层门 | 满足 | `.github/workflows/verify.yml:56–63`「Run the gate chain」跑 `pnpm verify`，注释点名 `scripts/shell-measure-proof.mjs` 三段 |
| 4 measure-shell.js 与门对同屏读数相同（±0.5） | 满足 | `logs/r1-p15/sub140-sm-test.log`「149-GWT4 … read the same numbers」过，25 / 25（批末 verify 未执行到该段） |

符合性：18 门实现齐（`scripts/shell-measure-proof.mjs` GATES）；阈值只在 THRESHOLDS、库不导出阈值（P3 测试）；每门一条变异（mutations.json 18 条 + storyMutations 18 条）；运行只在 1440 × 900 与 390 × 844、en 与 zh-CN（report viewports、20 次 run）：满足。「全绿且变异全红」：不满足。真件红的分类与归属：
- 静态页无客户端挂载：intro、focusLoop、noCollapse 的点外部半边、touch 的 Sheet。本分片复现：按门的步骤展开 `shell-top-band` 后点 ts-closed-l 标按钮，点击命中，但壳仍 `data-state="closed"`、`aria-expanded="false"`（`probe-click.out`）。门报告 behaviour 记的是「tab click: Timeout 3000ms」，与本复现不同，原因未查明（§6）。C1-16。
- contrast 20 格：P12 问题 7（c）怀疑格落在包装元素上；本分片核对格位落点正确，是包件 CSS 让次级墨失效：`it-chev-l` 是 `svg.tcrn-shell-menu__sub`，`shell.css.ts:496–499` 定 ink-3，实算 rgb(79,76,67) = ink-2；`grp-hover-l` 组标题 ink-2（板 ink-3）；`it-hover-l` 静态悬停字色仍 ink-2（板 17.04 = ink 于洗底）（`probe-matrix2.json`、`probe-matrix.json`）。与 147 的 parity 值差同根，C1-15。豁免格照比（P9 问题 1）属门口径，C1-7。铃铛悬停 3.5% 对 6% 已在验收清单 G-6。
- 品牌资产 digest、锁定块只装饰：底栏锁定块是 ProductLogo（`svg[data-product-mark]`，无 `svg[data-logo]` 与 `b > em`、`small`），门读不到产品键与标 22；接续：下拉搜索包裹被拉到 260；图钉位：菜单行无 `data-text="prail"`；singleLine：字标 1px（C1-9）与 ts-m-s。均为他片件的缺口（P12 问题 2–5），C1-17 汇总。
- ★shell-matrix 桌面高 2240 > 2000（`30.02 log:37,261`），另 9 条高度台账随换壳过期（`30.02 log:262–270`），C1-14。
- 映射说明 I16-P24 称菜单引导列 16 / 48 由壳层门 prail 负责：库只读 `o.prail`（`scripts/lib/shell-measure.mjs:372–374`），门脚本无 prail 判定（grep 0），第一批 rail 在顶带壳上已无被测物（C1-13，§4 交判断）。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-135 | 完成 | 一致：夹具模式 18 门全绿、变异全红，149-GWT4 测试过 |
| SUB-136 | 完成 | 部分：66 格与 07a 一致、contract:proof 0；但 story 高超预算（C1-14），3 类格读不出（P9 问题 1） |
| SUB-137 | 完成（GWT1 真件未满足） | 一致：接线、CI 注释、真件运行齐；红全部来自包外缺口与静态页 |

### 2.4 TCRN-DS-STORY-150 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pnpm pack:smoke 通过 | 满足 | `16 log:5–27` ok true，三个包 4.0.0 tarball |
| 2 迁移说明对 EPIC-040 与 049 的 breaking 每条有步骤 | 满足 | `docs/migration-4.0.md` M1–M29 每节都有「Do:」；16 条对应：lucide M6、名册 M7 / M25、registry M8、Text M10、Button lg M12、后缀色 M9 → M28、字体 M1、token 别名 M2；壳改顶带 M20、sidebar 与钉住态 M20–M21、三条壳 token M24、SideNav 等 M23、Tabs 合一 M22、名册 38 M25、ProductLockup M26、PageHeader 必有 M27 |
| 3 目视清单每板一节，不含构图一与侧栏项 | 满足 | `owner-acceptance.md` 第 35、52、73、95、119、142、165、196 行八节对应 canvas 八板；「构图一」「侧栏」只出现在「从第一批清单删去的项」（261–273）与差距说明里；无「已通过」类结论 |
| 4 version-surface-proof 7 处读回 4.0.0 | 满足 | `29 log:245–277` registerSize 7，七处 4.0.0 |

符合性：changelog-release-sections ok、pendingSections [4.0.0]（`29 log:212–241`）；无 `v4*` tag，分支无 upstream（未推送）：满足。挂在本单的 SUB-140：部分——build、storybook:build、pack:smoke 0，几何、壳层门、映射报告与两份清单、脚手架回执已重生；视觉签名基线（回归 199、新增 15）与 internal-alpha 回执未重收（P15 问题 1、2）。验收清单问题：第 178 行把「品牌资产 digest」写成由 brand-asset:proof 覆盖，而壳层门 brandDigest 是红的；第 202 行称引导列由壳层门逐行量定，门里没有该判定；已知差距表 G-1 至 G-9 漏列文档站字标截断、zh-CN 锁定块字标被换字、axe 164、夜间后缀 3.07。C1-18。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-138 | 完成 | 一致 |
| SUB-139 | 完成 | 结构满足；两处覆盖说法过头、漏 4 项差距（C1-18） |
| SUB-140 | 部分 | 一致（接续点写在 P15 交回第 1 节） |

### 2.5 START 质量硬线（本分片被测物上逐条核）

| 硬线 | 文档壳（147，`probe-doc.json`） | 样板（148，`probe-samples2.json`） | 门（149，真件报告） | 结论 |
| --- | --- | --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 纸外侧栏 0、收起钮 0、菜单内关闭钮 0（21 次运行） | 12 壳纸外 aside 0 | noCollapse 几何半边 16 次全过；点外部半边 unopened | 满足（行为半边阻于 C1-16） |
| 顶带无底无线、中线 26 | 四边框 0、无阴影、透明；标按钮、固定项、簇中线 26 | 同 | strip、brandGeometry 过 | 满足 |
| 三处间距相等 | 标按钮→首项 8，项间 8（6 项，en 与 zh-CN） | [8,8,8,8] | pinSpacing 过 | 满足 |
| 接续 6 | 菜单顶 − 标按钮底 = 6（1440、1023、390） | — | 下拉搜索包裹 260 判红 | 部分 |
| 锁定块只装饰 | 底栏锁定块 div role=img，不在控件内、无可聚焦子、右缘 = 面板右 − 16 | — | lockupDecor 红：读不到标 22（钩子缺口） | 部分 |
| 品牌资产 digest | 标 `data-logo="design-system"`、不透明 1；字标截为 60 / 117；zh-CN 锁定块后缀被换字 | TMS 标 | brandDigest 红（底栏锁定块）；brand-asset:proof 绿 | 不满足 |
| 标旁文字中线 | 标中线 26，字标盒 18.5–33.5（盒中线 26；墨迹未量） | — | markText 过（20 次） | 满足（墨迹以门为准） |
| 登入动画只用 transform 与 opacity | 静态页不播 | — | intro 红（首载 0 次）；包单测断言 keyframes 只含 opacity、transform（`ShellIntro.test.tsx:58–62`，批末未执行到） | 阻于 C1-16 |

## 3. 返工清单

### C1-1 文档页运行时换字的跳过范围错（经济）
- 现象：跳过选择器借用了台账的 `[data-locale-invariant]`，一头把 AI 契约故事整块排除（zh-CN 设置说明不译，full-surface 红），另一头没保护锁定块与 story 里的品牌字标（zh-CN「TCRN 设计系统」）。
- 证据：`28 log:30`；`client-scripts.ts:296–298`（6d10851）；`probe-fs2.out`；`probe-doc.json` zh-CN lockup；Brand 板 E 段。
- 改法：跳过规则改成只认品牌字标（标按钮 `b`、锁定块首行 `b` 与 `em`，或新加一个文档层专用钩子），`[data-locale-invariant]` 只给台账；锁定块描述行照常换字。改后跑 full-surface:proof、storybook:smoke、internal-alpha:browser-proof。
- 文件：`apps/storybook/src/build/client-scripts.ts`、`apps/storybook/src/build/page-template.tsx`。涉及 147（SUB-131）。

### C1-2 文档页没有 h1（主力）
- 现象：axe page-has-heading-one 108；页标题只在纸内 PageHeader，恒为 h2。
- 证据：axe-diff；`DomainDisplay.tsx:253,272`；静态页 `<h1` 0。
- 改法：PageHeader 加标题层级选项（默认仍 2），ProductShell 纸内页头用 1；文档页随之有 h1。动 PageHeader / ProductShell 的 prop 面，迁移说明 M27 补一句。若判断不许动 prop 面，退而在页模板补一个文档层 h1。
- 文件：`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`、`packages/ui-react/src/components/Navigation/Navigation.tsx`、`apps/storybook/src/build/page-template.tsx`、`docs/migration-4.0.md`。涉及 147、146。

### C1-3 文档壳地标与页内 story 壳重名（主力）
- 现象：axe landmark-unique 24：文档壳 `nav[aria-label="Pinned items"]` 与面包屑 `nav[aria-label="Breadcrumbs"]` 和页内 ProductShell story 的同名。
- 证据：axe-diff 第 836–933 行一带；`ShellPins.tsx:68`（只认 props 的 aria-label）。
- 改法：给文档壳自己的固定项与面包屑地标换专名（ProductShell 需开放这两处的可及名，动 prop 面）。
- 文件：`Navigation.tsx`（ProductShell）、`ShellPins.tsx`、`page-template.tsx`、`shell-copy.ts`（五语）。涉及 147、140。

### C1-4 axe 字标豁免没覆盖新载体（主力）
- 现象：color-contrast 30：`em.tcrn-shell-brand__suffix--design-system` 3.29；豁免名单只认 `.tcrn-product-logo__line-one-suffix` 与 `.tcrn-brand-wordmark__suffix*`，豁免节点 80 → 1。
- 证据：axe-diff 第 53–63 行。
- 改法：按 2026-10-11 D2（字标按标识体豁免 4.5）把 `.tcrn-shell-brand__suffix` 加进豁免选择器，同时保留夜间 TMS 的 pending 标注。属门的豁免口径，先经判断。
- 文件：`scripts/internal-alpha-browser-proof.mjs`。涉及 147（SUB-132）。

### C1-5 shell-fidelity 漂移：知识库旧壳死规则（经济）
- 现象：删例外后 4 条 packageClassAppearance、2 条 duplicateSelectors；同块还带弃用 token `--tcrn-shell-sidebar-width` 的构建提示。
- 证据：`06.10 log:18–33`；`30.02 log:253–259`；`story-demo-styles.ts:693–715`；静态页每页 40 处 `tcrn-doc-knowledge-shell` 只在样式里。
- 改法：删 `story-demo-styles.ts` 的 `.tcrn-doc-knowledge-shell*` 块，build → demo-styles-sync → build 同步 `storybook.css`；`storybook-shell-demos.tsx` 的演示框类名按 P10 问题 6③ 一并改名。
- 文件：`apps/storybook/src/story-demo-styles.ts`、`apps/storybook/src/storybook.css`、`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`。涉及 147。

### C1-6 文档壳文案与行为三处（经济）
- 现象：zh-CN「Change Log」两套译名（更新日志 / 变更日志）；完整菜单分类行无说明（smoke 0 / 23、internal-alpha 111 页）；语言列表按 Esc 连头像菜单一起关、焦点落头像钮。
- 证据：`17 log:7101,13139`；`30.02 log:22`；P13 问题 13、14（a）、15。
- 改法：Change Log 只留一个词典来源；页模板把五语 `category.description` 作为菜单行说明（aria-describedby）传给包件；`docShellLayerScript` 在内层列表已处理 Esc 时不再关头像菜单。
- 文件：`page-template.tsx`、`client-scripts.ts`、`apps/storybook/src/build/locales/storybook-content-text.ts`。涉及 147。

### C1-7 SUB-132 与 SUB-137 留下的门口径（主力，先定口径）
- 现象：shell:parity 10 个样板角色读旧选择器；索引与参考页「当前 story」的读法；storybook:smoke 三个 ProductShell 比较器与 7 条静态项仍按旧家族；壳层门 contrast 对 B 段标「按设计不读 / 不进门」的豁免格照比，另有彩色标、面板对画布、遮罩下的纸三类读不出。
- 证据：`11 log:5`；`17 log:40,61,1350,3099`；P13 问题 2、6、14（b）；P9 问题 1；P12 问题 7（a）。
- 改法：按 §4 交判断的建议定口径后一次改：退役样板角色；索引页认菜单当前分区行；比较器与静态项按新家族事实改期望；豁免格只列不比，并补三类读法。
- 文件：`scripts/shell-parity-proof.mjs`、`scripts/storybook-smoke.mjs`、`scripts/internal-alpha-browser-proof.mjs`、`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`。涉及 147、149。

### C1-8 过期的契约文字与 oracle 文案（经济）
- 现象：AI 消费契约仍写全站页用 Storybook 自有文档壳、ProductShell 不得替代，visualFitControlContract.search 仍 260 / 360，brandSurfaceDisposition 仍写夜间 #7aa0f5；oracle 两段 disposition 仍写侧栏与顶栏；oracle 的 px 单位带出 zh-CN 新泄漏 3；smoke.test.ts 仍断言旧 oracle 值。
- 证据：`ai-consumption-contract.ts:1039,1046`；`30.02 log:42`；P10 问题 4，P13 问题 12、16，P15 问题 6。
- 改法：契约与 oracle 文案改成顶带壳说法并补五语，泄漏台账按新数值登记，smoke.test.ts 的 oracle 断言改成 0、0、0、52、936、936、999。
- 文件：`apps/storybook/src/build/ai-consumption-contract.ts`、`foundation-visual-standards.ts`、`locales/storybook-content-text.ts`、`scripts/lib/locale-invariant-ledger.mjs`、`apps/storybook/src/smoke.test.ts`。涉及 147、150。

### C1-9 标按钮字标后缀上下各超出 1px（经济）
- 现象：`b.tcrn-shell-brand__word` 行高 15、overflow hidden，`em` 内容区 17 → 样板 clip 红、壳层门 singleLine ×36；是 148-GWT2 与 149-GWT1 的共同阻点。
- 证据：`probe-samples2.json`（em 17.5–34.5、b 18.5–33.5）；`19 log:4461`；P14 问题 1。
- 改法：字标容器行高不小于后缀行内框，或只做行内方向裁切；与 136 所在分片的同一条合并处置。
- 文件：`packages/ui-react/src/styles/shell.css.ts`（标按钮段）。涉及 148、149、136。

### C1-10 ui-tokens 单测随 screen() 抽模块失效（经济）
- 现象：pnpm test 首包红，其后各包测试批末未执行。
- 证据：`05 log:16,34–50`；SUB-133 把 `.scr.ts` 默认值移到 `shell-screen.mjs`。
- 改法：测试改读 `docs/design/gplus-2026-10/tools/shell-screen.mjs` 的 SCREEN_CSS（断言语义不变），再跑一次 pnpm test 看后续包。
- 文件：`packages/ui-tokens/src/index.test.ts`。涉及 148（SUB-133）。

### C1-11 样板 story 的单测与五语文案仍按构图一（经济）
- 现象：smoke.test.ts 构图一 rail 断言与构图三旧 TopBar 断言红；六个样板的五语标题与描述仍写侧栏、顶栏与项目页。
- 证据：P14 问题 2（a）（b）、3；P9 问题 6。
- 改法：按 P14 问题 2 的逐条改法写断言；改五语标题与描述（Actions 样板改名册页，id 不变）与 `gplusSampleStoryText`。
- 文件：`apps/storybook/src/smoke.test.ts`、`apps/storybook/src/build/locales/storybook-locale-text.ts`、`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`。涉及 148。

### C1-12 成品画布 canvas.json 未随板高更新（经济）
- 现象：heights.json 已改四板高，canvas.json 的 h 与后续各板 y 未顺延，发布会叠板。
- 证据：P11 问题 2（附建议值），P15 问题 10，主线程 M7。
- 改法：按 P11 给的值改 canvas.json；或明确交设计会话在发布时改，并写进收口待发布清单。
- 文件：`docs/design/visual-standard/canvas.json`。涉及 148。

### C1-13 板与说明里的两处不实（经济）
- 现象：（a）Icon 板 6 处、Typography 板 1 处仍写「37 件」；（b）映射说明 I16-P24 与验收清单第 202 行称引导列 16 / 48 由壳层门负责，门里没有判定。
- 证据：四板 grep；`build-typography.mjs:259`；`storybook-map.md:40`；`shell-measure.mjs:372–374`。
- 改法：（a）生成器改由 `ICON_NAMES.length` 出数后重生两板（Icon 板 A 段属 142，与其持有者合并）；（b）改说明为「顶带壳没有侧栏引导列，rail 在样板上退役」，若判断要立菜单引导列断言则另开门单。
- 文件：`docs/design/gplus-2026-10/tools/build-icon.mjs`、`build-typography.mjs` 与重生的四块板、`docs/design/gplus-2026-10/storybook-map.json` / `.md`、`owner-acceptance.md`。涉及 148、149、150。

### C1-14 shell-matrix 超高度预算与台账过期（经济）
- 现象：shell-matrix 2240 > 2000；9 条台账的 recordedHeightPx 随换壳过期。
- 证据：`30.02 log:37,260–270`；P9 问题 5 已预见。
- 改法：两块并排（不改 story id），或进 `STORY_HEIGHT_GRACE_ALLOWLIST` 带 owedTo；9 条台账改成现测值。
- 文件：`scripts/lib/story-budget.mjs`、`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`（若并排）。涉及 149（SUB-136）。

### C1-15 壳菜单可钉行与分组标题偏离 07a（经济）
- 现象：可钉行字号 12（板 12.5）、组标题 11 / 600 ink-2（板 10 / 500 ink-3）、行内 chevron 被盖成 ink-2（`.tcrn-shell-menu__sub` 定的 ink-3 失效）、静态悬停字色不变。同时造成 147 的 shell:parity 两处值差与 149 的 contrast 12 格。
- 证据：`probe-rows.out`；`probe-matrix2.json`；`shell.css.ts:440–499`；`shell-screen.mjs:86–88`。
- 改法：在 `.tcrn-shell-menu` 作用域里把可钉行与组标题的字号、字重、墨色对齐板（提高相应规则的特异性或改 base.css 的 nav-item 段），改后看 parity 与 contrast 两门。件归 138、142 所在分片，合并去重。
- 文件：`packages/ui-react/src/styles/shell.css.ts`、`packages/ui-react/src/styles/base.css.ts`。涉及 147、149、138、142。

### C1-16 静态页没有客户端挂载（主力，既有已知、本轮未排单）
- 现象：登入动画、浮层开合、焦点回路、方向键、点外部、Sheet 在静态 story 与文档页 ≤ 760 都不出现；壳层门 intro、focusLoop、noCollapse 半边、touch 因此红，4 条行为变异不可区分。
- 证据：`probe-click.out`；report behaviour；跨包通告第 1 节第 2 条；P5 问题 2、P12 问题 1、P10 问题 5。
- 改法：给静态页加客户端挂载（壳件水合或文档层挂载入口），定挂载归属后一次接入，门不用改。
- 文件：`apps/storybook/src/build/page-template.tsx`、`client-scripts.ts` 或新挂载入口；可能动 ProductShell 的导出面。涉及 149、141、144、147。

### C1-17 壳层门真件红的包件钩子缺口（主力，他片件汇总）
- 现象：底栏锁定块无 `svg[data-logo]`、`b > em`、`small`；下拉搜索包裹被拉到 260；菜单行无 `data-text` / `data-guide="prail"`；ts-m-s 不是 Sheet、Sheet 打开时壳根仍报 expanded；铃铛悬停包与板不一（Owner 已在 G-6）。
- 证据：report gates 与 dSection；P12 问题 2–5，P9 问题 2。
- 改法：按 C-5 补钩子（动包件 DOM 契约），下拉搜索框高取 `--tcrn-shell-drop-srch-h`；与 138、139、142、144 所在分片的返工合并，不重复派。
- 文件：`ShellMenu.tsx`、`ShellDropdown.tsx`、`Navigation.tsx`、`apps/storybook/src/contract-stories/story-content.tsx`。涉及 149。

### C1-18 SUB-140 接续与验收清单补差距（经济，排在上列修复之后）
- 现象：视觉签名基线 202 条未重收（回归 199、新增 15），internal-alpha 回执未入仓；验收清单两处覆盖说法过头、漏 4 项差距。
- 证据：P15 交回第 1 节接续点、问题 1、2；`30.02 log:19–20`；`owner-acceptance.md:178,202,226–238`。
- 改法：上列返工合入后在同一构建上跑一次 browser-proof，按 P15 问题 2 的分类逐条写选择文件后重收；几何、壳层门与映射报告同批重生；清单改两处说法并补 G-10 起四项（文档站字标截断、zh-CN 锁定块字标被换字、axe 回归、夜间后缀 3.07）。
- 文件：`docs/verification/**`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`。涉及 150。

## 4. 只有 Owner 能定的事项

- O-1 文档站标按钮放不下「TCRN Design System」：134 宽里字标只剩 60（需 117），省略号截断。建议：第二版宽度改为「至少 134、随字标加宽」，三处间距仍 8，07b 补一屏长名产品；不同意则文档站用第一版纯标。
- O-2 STORY-148 GWT1 写「五块成品板」，D4 只退出四板的构图一样板；拆分默认 Brand 板不加 D 段、以 07a 第 1 段代替。建议接受默认，链上注解 GWT1 按四板加 07a 第 1 段读。
- O-3 夜间 TMS 后缀在展开态标按钮墨洗上读 3.07，D7 只列了 3.13、3.33。建议随 S-6 与 D7 一并裁（同 D7 的建议值）。
- O-4 Shell 两块成品板的板内 token 块落后于契约，字面守护「重生后逐字节不变」恒红，实施侧按 C-16 不能改。建议设计会话下次发布 07b 时按现契约重生两板，之前接受「抽模块前后输出相同」作守护（P11 问题 1，未进待 Owner 表）。
- O-5 文档站壳两项设计待定（P10 问题 6①②，未进待 Owner 表）：无登录读者时头像位为默认人形、菜单只放主题与语言；1440 下纸内目录宽 144、长标题单行截断。建议都接受现状。

交判断（若判断认定属判据变更则升 Owner）：shell:parity 退役 10 个样板角色（建议退役，几何由壳层门与 shellFrame 承担）；索引与参考页的「当前」改认菜单当前分区行（建议）；壳层门 contrast 对豁免格只列不比（建议，与 B 段标注一致）；P12 加的「390 打开的层必须是 Sheet」（建议保留，来自 D 段「Sheet 行 44」）；第一批 rail 在顶带壳上退役而不另立菜单引导列断言（建议，07b D 段没有 16 / 48）；axe 字标豁免扩到 `.tcrn-shell-brand__suffix`（建议，依 2026-10-11 D2）。

## 5. 实施口径判定

| 包 · 选择 | 判定 | 理由 |
| --- | --- | --- |
| P3 · 1 固定项中线按 26 | 可接受 | 拆分问题 1 已定，G 段 20 是笔误 |
| P3 · 2 digest 按产品键取 logos2、比规范绘制形 | 可接受 | 拆分问题 17；不读 -mono |
| P3 · 3 底栏居中扣分隔线 | 可接受 | 量法与板一致，另断锁定块右缘 |
| P3 · 4 无 title 的截断计溢出 | 可接受 | 直接出自 START 硬线「单行截断加 title」 |
| P3 · 5–7、9–11 变异写法、簇内容右缘、alsoFails、触摸只量无浮层屏、字体本地应答、行为夹具 | 可接受 | 都不放宽判定，写明在头注释与 mutations.json |
| P3 · 8 夜间后缀 4 格 pending | 有条件 | 依 D7；3.07 不在 D7 数字里，须随 O-3 一并裁 |
| P9 · 1–5、8–9 格序、新名、open 键、夜间红格 exempt false、contract-proof 比对、探针词与文案复用 | 可接受 | 与板逐格相等，改名会被抓到 |
| P9 · 6 浮层只改定位、无壳根 | 有条件 | 只服务对比度；静态页壳样式问题 P9 问题 4 已随 P10 每页带壳段而消解，格位核对正确 |
| P9 · 7 标按钮 open 用 hover 预览 | 可接受 | 两对同值，免加真状态 |
| P10 · 1–2 菜单两级、六个分区固定项 | 可接受 | 静态页无客户端，三级点不开；固定项正好上限 6 |
| P10 · 3 两个浮层隐藏携带、文档脚本开合 | 有条件 | 行为实测对；≤ 760 仍是面板（C1-16） |
| P10 · 4–5 主题与语言进头像菜单、搜索并入菜单 | 可接受 | 拆分问题 14 |
| P10 · 6 壳文案按序配对进页词典、运行时跳过 `[data-locale-invariant]` | 不可接受 | 造成 full-surface zh-CN 回归与品牌字标被换字（C1-1） |
| P10 · 7 按 `\n.tcrn-shell-brand {` 切包样式 | 有条件 | 找不到即构建失败、不静默；建议包侧加段首标记 |
| P10 · 8 纸为滚动容器、锚点偏移 14 | 可接受 | 锚点与 scroll-spy 实测过（P13） |
| P10 · 9 删页头标题等 | 不可接受 | 删掉了页面唯一 h1，axe 108（C1-2） |
| P11 · 1 以「抽模块前后输出相同」守护 | 可接受 | 字面门改动前就红；两板未提交（O-4） |
| P11 · 2–4 只画顶带态、名册页等内容、SAMPLE_CSS 去注释 | 可接受 | Actions 名册页即 Story 用例；去注释只为审计词 |
| P11 · 5 顺带刷新四板 token 块 | 可接受 | C-16 允许 SUB-133 改这四板 |
| P11 · 6 高度取自然高度上取整 | 有条件 | 口径对；canvas.json 未跟（C1-12） |
| P11 · 7 Brand 不加 D 段 | 有条件 | 依拆分问题 4；与 GWT 字面不符（O-2） |
| P12 · 1 touch 加「390 必须是 Sheet」 | 有条件 | 有 D 段依据，但属新增比对项，须判断确认 |
| P12 · 2–7 缺钩子判不过、按渲染读版本、红基线须加出新失败、translate 变异、两语各探一次、`--story` 只跑选中 | 可接受 | 都更严，不放宽 |
| P13 · 包词表认「经类名形参传入的字面量」 | 有条件 | 是读法纠错（包确实写了该类），有单测；story-content 的下拉静态桥仍应按 P1d 问题 5 退场 |
| P13 · (1)(3)(4)(5) 计数、分层、滚动容器、Esc 等待 | 可接受 | 只改读法，判定不变 |
| P13 · (2) 「侧栏可见」改读标按钮可见 | 有条件 | 字段名已失真，下一轮随 oracle 改名 |
| P13 · shell:parity 样板角色按 C-17 停下 | 可接受 | 停得对，口径见 §4 |
| P13 · full-surface 记为「既有红、原因未定」 | 不可接受（归因） | 根因是 SUB-131 的跳过选择器（C1-1） |
| P14 · 拆分问题 24 选第二种（样板去 rail） | 有条件 | 选项本身被拆分允许；但「prail 负责 16 / 48」不实（C1-13） |
| P14 · 样板屏照四板 D 段、김하늘、构图三页头随纸宽、底线与填充计入 shellFrame | 可接受 | DIFF-11 已待 Owner 知悉 |
| P15 · 1–4 只追加不改他人条目、不改私有版本号、第一批清单原文保留 | 可接受 | C-14 |
| P15 · 5–6 复合门逐段带 `--write-report`、构建后补跑两门写回执 | 可接受 | 是生成物再生，不是为求稳重跑 |
| P15 · 7–8 不写 baseline、中断后不重跑 | 可接受 | C-12、C-15 |
| P15 · 9 红报告照实入仓 | 有条件 | 诚实；返工后须在同一构建上重生（C1-18） |

## 6. 证据盲区

- 没跑任何门：壳层门三段在批末 verify 里未执行，149-GWT1、GWT4 的读数取自 P15 分段日志与入仓报告（P15 分支即集成树代码，未在 HEAD 上复跑）。
- pnpm test 首包即停：ui-react、storybook、两个 pilot 的单测批末没有读数；storybook 单测的红取自 P13、P14 交回，ui-react 的既有红（ShellBrandButton 夜间对比度，主线程 M3）未复核。
- 门报告 behaviour 里「tab click: Timeout 3000ms」没能复现（本分片同步骤点击成功、层不开）；超时原因未查。
- 成品板探针拦掉外部字体请求，板与板之间可比，绝对字宽可能与门的字体应答不同；草稿板只抽查了 V2-B1-Typography、V2-B1-Actions。
- 未量墨迹中线（标旁文字只量了盒中线）；未看 ja、ko、fr；未看 1024 平板视口。
- 批末 browser-proof 的 settingsLayoutBrowserProof（23 例）与 storyCoverageManifest 为假，未归因（P13 记设置布局不是文档壳读数）。
- 视觉签名 199 条回归没有逐条分类，属 SUB-140 接续。
- CI 只读了 verify.yml 文本；GitHub 上该检查是否设为必需无法看到。
- 画布发布与 Owner 目视项不在本分片判断之内，未打开画布。
