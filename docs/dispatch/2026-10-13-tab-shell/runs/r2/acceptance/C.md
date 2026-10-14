# R2 批末验收 · 分片 C（TCRN-DS-STORY-147 至 150）

节行号：§1 一览 第 7 行；§2 逐 Story 第 18 行（147 第 20、148 第 62、149 第 85、150 第 109、START 质量硬线 第 127）；§3 返工清单 第 140 行；§4 只有 Owner 能定的事项 第 202 行；§5 实施口径判定 第 214 行；§6 证据盲区 第 245 行。

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD `70e5074`（比摘录的 `537ab3c` 多三个派工文档提交）；`git diff 6f739b2 HEAD` 除 `docs/dispatch/**` 外为空，代码即批末 verify 的 `6f739b2`，而 `6f739b2` 与 K12 合入 `0689a1d` 之间只差 `runs/state.md`。静态产物是批末 `storybook:build`（`storybook-build.exit` 0）的输出。方法只读：读批末逐段日志（`NN log:行`，目录 scratch `r2-verify/`）、门报告与回执、源文件与包交回；在会话 scratch `acc-r2-C/` 写只读探针（Playwright 经本地静态服务开静态产物），读数文件名随证据写。未重跑门、未构建、未写链；工作树只新增本文件。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| 147 文档壳 | 部分 | GWT1–4 读数满足、无回退；符合性未满足：判定人 shell:parity 仍红（余 1 角色，取行口径）；文档壳浮层仍是文档层脚本（≤760 开面板不开 Sheet）；品牌首行 story 的 DS 字标在 zh-CN 被换字；构建仍出 28 个弃用别名提示；批末 30.02 红（本片门的期望与时机 4 处，另他片 axe 14） | 6（C2-3 至 C2-8），共因 C2-10 |
| 148 五样板 | 部分 | GWT2 不满足（映射 23 行 19 绿，4 行 overlap：两个样板伸出 640 画框）；GWT1 部分（Brand 板无 D 段，O-2 待 Owner） | 1（C2-2） |
| 149 壳层门 | 不满足 | GWT1 真件不满足（18 门 13 过 5 红，prail 检查红，故事变异 21/22）；GWT2 不满足（verify 7 步红，壳层三段在批末 verify 里仍未执行）；GWT3、GWT4 满足 | 1（C2-1），共因 C2-2、C2-10 |
| 150 4.0.0 候选 | 部分 | GWT1–4 满足；SUB-177 部分（视觉签名未重收、清单 3 处过时）；AI 消费契约仍有摘录外的旧壳说法 | 2（C2-7、C2-9），共因 C2-5 |

返工共 10 条：主力 7（C2-1、C2-4、C2-5、C2-6、C2-7、C2-9、C2-10），经济 3（C2-2、C2-3、C2-8）。对 R1：147 的 06.10、28 转绿，smoke 失败项 560 → 3、axe 164 → 14；148 映射 12 → 19 绿；149 真件 8 过 9 红 1 n/a → 13 过 5 红；150 无回退。

## 2. 逐 Story

### 2.1 TCRN-DS-STORY-147 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 doc-shell:proof 包外类 0、例外清单为空 | 满足（无回退） | `12 log:29–31,46–47`（ok、`DOC_SHELL_CLASSES_PACKAGE_BACKED`、outOfPackageCount 0）；R3M5 的 4 条例外与 2 条白名单仍不在（`scripts/shell-fidelity-proof.mjs:124,334` 只剩注释） |
| 2 顶带 52、纸 12 / 52 / 14、常驻侧栏 0 | 满足 | `probe-doc.json` 21 次（8 页 × 两主题、zh-CN 两次、1023、390 两次，汇总 `39-sum-doc.txt`）：文档壳恰 1 个；顶带 y 0、高 52、四边框 0、无阴影；纸 12 / 52 / 12 / 12、圆角 14；纸外侧栏 0、收起钮 0、`[data-shell-close]` 0 |
| 3 目录在纸内 TocRail | 满足 | 同上：`aside.tcrn-toc-rail` 在文档壳自己的纸里，1440 时 x 1256、宽 144，1023 与 390 时在正文上方 |
| 4 storybook:build 退出 0 | 满足 | `storybook-build.exit` 0 |

符合性：
- 文档壳由 ProductShell 顶带态渲染：部分。服务端标记是包的 ProductShell：标按钮 134 × 40 在 (12, 6)、中线 26；固定项 6 个，间距全 8；完整菜单顶 52 = 46 + 6、左 12、宽 952、搜索 936 × 40、行 12.5 / 32、组标题 10 / 500、底栏 52 带 1px 分隔、锁定块右缘 = 面板右 − 16 且带 `svg[data-logo]`；Esc 关闭并回焦标按钮，点标按钮开、点外部收。但浮层仍由文档层 `docShellLayerScript` 开合，没换成水合真件（K5 交回 SUB-151「部分」、问题 7）：1023 与 390 下文档页打开的是 `data-panel="expanded"` 面板（390 时宽 366、行 32），不是 Sheet（行 44）；文档页 `data-shell-hydrate` 0 处。D1「壳只有一种」在 ≤ 760 不成立 → C2-6。
- 内容居中 1040：满足（正文列 x 200、宽 1040，中心 720 = 纸中心）。
- 夜间分类计数 ink-2：满足（foundations、components、change-log 夜间 rgb(169,166,156)，浅色 rgb(79,76,67)）。
- 4 条例外与 2 条白名单删除、doc-shell 仍 0：满足。
- 判定人 shell:parity：不满足。`11 log:5`：9 角色 8 同值，10 个样板角色已退役（`retiredSampleRoles` 10）；余 `package-nav-item` 的 paddingRight 文档 4px 对 story 0px。实测两侧取的是不同行型：文档菜单 30 行全是普通行（可钉行 0），首行 Welcome 右内距 4；`ts-x-l` 12 行全是可钉行（普通行 0），首行 Roster 是 `.tcrn-nav-item-row` 里的链接，链接右内距 0、包装右内距 4（`44-probe-shell-sum.txt`）。两种行的右缘留白都是 4，等于板 `.ts-it` 的 `padding:0 4px 0 8px`（`shell-screen.mjs:88`）。不是包件偏差，是角色取行口径 → C2-4。
- Owner 目视：不代签。

R1 未满足项复核（按 R1 编号）：
- C1-1 换字跳过：文档壳与页内壳的字标在 zh-CN 保持「TCRN Design System」（截断 61 / 117 带 title），底栏锁定块首行不换、描述行「设计系统」照常换，full-surface 转绿（`28` 退出 0）。但 SUB-161 新加的品牌首行 story 用 `b.tcrn-brand-lockup__word`，不在跳过表（`client-scripts.ts:310`），zh-CN 下 DS 两枚锁定块读作「TCRN 设计系统」（宽 85 / 108，en 117 / 148）→ C2-3。
- C1-2 h1：已解决（每个文档页纸内恰一个可见 h1，page-has-heading-one 0）。
- C1-3 地标：文档壳两条 nav 改名「TCRN Design System · Pinned items」「Current location」，不再与页内壳重名；landmark-unique 余项属他片（K11 问题 7）→ C2-10。
- C1-4 axe 字标豁免：`.tcrn-shell-brand__suffix` 已入（豁免节点 32）；新载体 `.tcrn-brand-lockup__suffix` 仍红 → C2-10。
- C1-5、C1-6：已解决（`06.10` 0；zh-CN「变更日志」；`30.02 log:22` localeMenuFocusReturnOk true；分类说明与 zh-CN IA 不再红）。
- C1-7 门口径：样板角色退役、索引页当前项、smoke 比较器与静态项（`17 log:40` missing []）、contrast 豁免格只列不比都已落地；parity 余 1 角色 → C2-4。
- C1-8 契约与 oracle：判断点名的几处已改（30.01、28 退出 0）；同文件其余旧壳字段仍在 → C2-7。
- C1-16 静态挂载：壳 story 已水合（intro、focusLoop、noCollapse、touch 真件过）；文档壳浮层未换 → C2-6。

批末红里与本 Story 有关的（★ 为包交回未记或记错的）：
- `30.02 log:7–51`：axe 14（C2-10）；storyCoverageManifest 红在 brandMarkLocaleChecks（zh-CN、ja、ko 期望后缀「设计系统」等，与 SUB-166 字标不换字相反，K12 问题 4）与 packageBackedDisabledNavItemReasonReadback 读到 0 个（收起的顶带不渲染菜单行）；browserProofSummary 红在 reproducibility 的 `openMenus === 6`（`internal-alpha-browser-proof.mjs:1385`，DOM 派生后为 14）；★localeLeakZhCn 新增 13（shell-mobile 10、shell-intro 3，`receipts-dirty/tracked.diff:60–155`），K12 在同一代码上读到 0——扫描（第 2623 行）不等水合跟随语言，结果随竞态翻（K11 问题 9 记过现象，本次批末复现）。四处合为 C2-5。另 clippedButtonText（AOS 壳标题，C2-10）与视觉签名回归 199、新增 18（C2-9）。
- `17 log:2245–2247,5707–5710`：smoke 余 3 条，全是 AOS 视觉实例（两个 search-results 变体渲染关着的壳；`mobile-dark-zh-cn-work-queue` 缺「工作项」）→ C2-10。
- `storybook-build.log:67`：文档层仍有 28 个弃用别名 210 处，SUB-167 判据「构建不再出弃用 token 提示」未达 → C2-8。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-165 | 完成 | 一致：菜单搜索 936 × 40、行 12.5 / 32、组标题 10 / 500 ink-3，parity group-title 值差 0，continuation 真件过；parity 余项属取行口径（C2-4） |
| SUB-166 | 完成 | 部分：判据所列都达到（字标不换、描述换、变更日志单一来源、Esc 只关列表、full-surface 0）；跳过表按类名列举，漏了后加的 `.tcrn-brand-lockup__word`（C2-3），browser-proof 的后缀期望未同步（C2-5） |
| SUB-167 | 完成（自注弃用提示只部分） | 部分：06.10 绿、demo-styles 同步、演示框改名；弃用提示 28 名 210 处仍在 |
| SUB-168 | 完成 | 判据内一致（parity 退役 10 角色、smoke 比较器与静态项、索引当前项、railReachability、文档壳契约 30.01 绿、selection-grammar 06.12 绿）；parity 余项不在其判据 |
| SUB-169 | 完成 | 一致：settingsLayout 23 例 ok（`30.02 log:28–29`）、豁免加 `.tcrn-shell-brand__suffix`、回执 431,657 字节且 receiptSizeOk（`30.02 log:32–33`）、30.03 绿；30.02、30.04 仍红为别因 |
| SUB-170 | 完成 | 一致：`page-template.tsx:301–316` 按 `/* tcrn:shell-layer-start */` 切段，缺失与重复各有报错码；标记在 `packages/ui-react/dist/styles/shell.css.js`，构建 0 |
| SUB-171 | 完成 | 判据内一致（治理表两行、ProductShell spec 读回）；同表其余旧行未改（C2-7） |

### 2.2 TCRN-DS-STORY-148 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 五块成品板 D 段各有顶带壳样板、几何同 07b | 部分（阻于 O-2） | 四板 D 段本轮未动：Actions、Inputs 自 R1 未改，Icon、Typography 只改件数行（4c18e4c 的 diff 只落在 h1、meta、名册标题与契约框）；R1 的几何结论不变。Brand 板仍无 D 段（O-2，判断默认「GWT1 记部分」） |
| 2 23 行全绿，删一个 story 判红 | 不满足 | `19 log:4177–4178` rows 23、rowsOk 19；红的 4 行（typography.D、inputs.D、compositions.1.typography、compositions.1.inputs）都是浅夜 overlap，clip 全过（R1 的 11 行 clip 已消）；删 story 判红：`19 log:10,19` 两条过 |
| 3 shellFrame 夹具绿；顶带加 1px 底线判红 | 满足 | `18 log:46–52` 绿红夹具与 4 个变异按声明；真件变异 shell-top-band-rule 读 1 判红；22 次真件 shellFrame 全过 |
| 4 五矩阵格数与对比度不变 | 满足 | `07 log:31` 6 板 306 格（44 / 28 / 10 / 116 / 42 / 66）逐格等于板 data-expect；`18 log` 五矩阵 10 次 contrast 过 |

overlap 的根因（★ K11 问题 11、K12 问题 7 只记现象）：样板外框 `[data-shell-frame]` 定高 640（`composition-one.tsx:150,196`），壳的父元素却是 `StaticMarkup` 的 `<div data-gplus-static-markup>`（`matrix-renderer.tsx:256`，无高度），壳的 `block-size:100%` 落空成内容高：typography 两壳 661、inputs 两壳 681，伸出外框 21 / 41，减去块间距 12 即 overlap 9 / 29；icon 两壳 635 只是恰好装下。纸内没有滚动容器在滚（`44-probe-shell-sum.txt` SAMPLES 行 `scrollers` 空），「壳一屏高、纸内滚动」在样板上没有成立 → C2-2。

符合性：
- 样板换顶带壳：满足。24 个样板壳（6 样板 × 浅夜块 × 两主题页）纸外侧栏 0、收起钮 0、关闭钮 0，顶带 52 无边无影，标按钮 (12, 6) 134 × 40、中线 26，固定项间距 8，纸 12 / 52 / 12、圆角 14，TMS 字标 60 / 60 不截（`50-samples.txt`）。
- shellFrame 改量 52 / 12 / 14：满足。
- 成品画布原地替换、不新增版本：满足。`canvas.json` 8 板的 h 与 `heights.json` 逐项相等，y 以 120 间距递推到 Shell-2 的 34840，顺序与 id 不变（6baccc0）。
- D4 文字与格值一致：Icon 板「38 件」7 处、Typography 板 1 处，两板与五语描述无「37 件」；`gplus/icon-roster.tsx:1` 的注释仍写「37 icons」（不上页面，C2-8 顺带）。
- R1 的 C1-9 至 C1-13：C1-9 已解决（clip 0，样板 singleLine 过，字标 b 高 19 无纵向溢出）；C1-10、C1-11 已解决（`05 log:24–27,332–335`，storybook 12 / 12）；C1-12 已解决；C1-13 (a) 已解决，(b) prail 判定已立但真件红（C2-1）。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-172 | 完成 | 一致 |
| SUB-173 | 完成 | 一致：`05 log` 全过（ui-tokens 15、copy-state 10、ui-react 246、storybook 12、两 pilot 各 1）；样板五语标题与描述已按顶带壳；shell-intro 读回替换句只进字典未渲染（K12 问题 9，归 141 所在片） |

### 2.3 TCRN-DS-STORY-149 · 不满足

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 18 门全绿；每条变异判红 | 不满足（真件）／满足（板） | 板：`logs/r2-k12/177-shell-measure-fixtures.log` 两块成品板 18 门与 prail、pageCrumbs、settingsLayout、splitView 全过，变异 20 / 20 判红。真件：`docs/verification/shell-measure/report.json`（5a5cad2，K12 在与批末相同的代码上跑）18 门 13 过 5 红（brandDigest、markText、pinJitter、contrast、singleLine），检查 prail 红；故事变异 22 条 21 条判红（story-label-plus-40 仍过）；D 段 12 行 9 过 3 红（标按钮 v2、图钉位、面包屑） |
| 2 verify 含壳层门且退出 0 | 不满足 | 根 verify 串入 geometry:measure，后者串入壳层三段（静态满足）；批末 30 步红 7（10、11、13、17、18、19、30.02，另 30.04 随之）；`18 log:84–7376` 第二段 gplus 红在 overlap（C2-2）后 `&&` 链停，壳层三段在批末 verify 里第二轮仍一段没执行 |
| 3 CI 必跑步骤含壳层门 | 满足（无回退） | `.github/workflows/verify.yml:59–63` 跑 `pnpm verify` 并注明壳层门 |
| 4 measure-shell.js 与门同读数（±0.5） | 满足 | `logs/r2-k12/177-shell-measure-test.log:15`「149-GWT4 … read the same numbers」，35 / 35（批末 verify 未执行到） |

真件 5 红与 prail 的实测归因（本片探针 `44-probe-shell-sum.txt`、`45-kbd.json`、`51-kbd2.json`）：
- ★pinJitter「pinButton 0x0」：`ts-x-l`、`ts-x-n` 各 19 个 `[data-pin-button]`，15 个 24 × 24，4 个 0 × 0 全在 `.tcrn-shell-menu__col--pinned`（≥ 1024 按设计 display:none 的「已固定」列）。读数（`shell-measure.mjs:404–405`）把面板里所有钉钮的尺寸收进集合，不排除不渲染的；K7 写明的选择 6 有意把 display:none 读成 0 × 0。包件不缺：行内保留 24 轨道、钉钮静止 opacity 0。门读法问题 → C2-1。同根：story-label-plus-40 改的是同一隐藏列的组标题，门读不到，所以仍过（K5 问题 6）。
- ★contrast srch-kbd-l / -n 读 8.58 / 7.23，板 7.59 / 6.11：两格都是 `kbd.tcrn-search-input__shortcut`（absolute，叠在 `input.tcrn-search-input__control` 上，input 底色为 6% 墨洗）。门的 `effBg`（`shell-measure.mjs:199`）只沿祖先找底色，跳过叠放的兄弟 input，取到面板白或夜间面板色。按「ink-2 于洗底」算正好 7.59，即板值；视觉与板一致，是读法问题 → C2-1（K2 问题 5 的「归属未定」可结）。
- ★prail 图标 19 对 16：包件引导图标是 16 宽的 `svg`（左 19、中心 27），板上是 22 宽带 3 内距的 `svg.ic`（左 16、中心 27，`shell-screen.mjs:89`、`Shell.dc.html:334`）；字形同位，文字都在 48。K7 的包件夹具 `package-menu.html:28` 把引导图标写成 22 宽带内距，不是包件真实 DOM，所以夹具绿、真件红 → C2-1。
- singleLine `cut:nav.tcrn-breadcrumb` 50.6 / 18.3（ts-settings-m、ts-roster-m，en）：门把纸内面包屑 nav 当单行载体读，与 pageCrumbs（逐段省略号加 title，已过）读法冲突（K11 问题 3，SUB-164 归 146 所在片）→ C2-10。
- brandDigest：品牌首行 story 的 mana-orchestrate、design-system 两枚 `mark.source` 对不上 `logos2/<product>.svg`，锁定块参照找不到 Brand E 行（K11 问题 5，145 所在片）→ C2-10。
- markText：TMS 底栏锁定块 en 1.7（zh-CN 过）、DS 首行 en 1.4，属 O-4（下行字母）同族，待 Owner；★zh-CN 的 DS −1.1 不是 K11 问题 4 推测的字体回退，而是 C2-3 的换字让被量文字成了「TCRN 设计系统」。

符合性：18 门齐、阈值只在 THRESHOLDS、每门一条板变异（夹具 20 / 20）、运行只在 1440 × 900 与 390 × 844、en 与 zh-CN（报告 viewports；24 次 run = 6 story × 2 语 × 2 主题）：满足。「全绿且变异全红」：不满足（上列）。行为：intro 首载 1、再载 0、减弱 0，只用 transform 与 opacity、475 ms；focusLoop、点外部关闭两语都过（report.behaviour）。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-174 | 完成 | 部分：夹具与单测一致（批末前 35 / 35）；pinJitter、contrast（srch-kbd）、prail 三处读法在真件上读的不是板上那一物，致真件 3 红；写明的选择 6 不可接受（§5） |
| SUB-175 | 部分（治理元数据未转绿） | 完成（以实测为准）：storyHeightBudgetOk 真、violations 0、staleAllowlist 0（`30.02 log:39–42`），shell-matrix 叠放 1664 ≤ 2000；治理元数据由 K9 附录（ffdb1f0）改 smoke 后，批末 `17 log:40` missing [] |

### 2.4 TCRN-DS-STORY-150 · 部分

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 pack:smoke | 满足 | `16 log:6` ok true，三个包 4.0.0 tarball |
| 2 迁移说明逐条有步骤 | 满足 | `docs/migration-4.0.md` M1–M37 共 37 节、37 处「Do:」；第二批新增 M30–M37（逐件处置表、新 prop、分类说明、h1、地标名、二轮细项、挂载时机与画框） |
| 3 清单每板一节，不含构图一与侧栏项 | 满足 | `owner-acceptance.md` 第 35、52、73、95、119、142、165、197 行八节对 canvas 八板；「构图一」「侧栏」只在历史说明、F 段 token 说明与删去项表 |
| 4 version-surface 7 处 4.0.0 | 满足 | `29 log:245–277` |

符合性：changelog 发布段 ok、pending [4.0.0]（`29 log:212–241`）；无 `v4*` tag，分支无 upstream：满足。SUB-177 部分：视觉签名 0 条重收（`nonVisualProofOk` 假，K12 停下正确）。验收清单：R1 指出的两处过头已改为读数，G-10 至 G-14 已补；仍有三处过时或遗漏：第 178 行写「brand-asset:proof，本轮批末没有跑」，批末 `14` 已跑且退出 0；G-5（第 240 行）仍写「读不了 8 格、仍拿豁免格比期望」，SUB-174 已补三类读法并只列不比；「待 Owner 裁定（两批）」表（第 251 行起）只有第一批 10 条与 D7、AOS 两条，R1 判断 §3.1 的 O-3、O-5、O-7、O-10 至 O-15 不在表里，O-1、O-4、O-6、O-8 只散见于 G 行 → C2-9。

AI 消费契约（随静态产物发布为 `ai-consumption-contract.json`）在点名几行之外仍按旧壳写：`ai-consumption-contract.ts:1060` 要消费方引入 TopBar、SideNav、SideNavCollapseButton（M23 已弃用）；`:1077` visualSkin 写侧栏滚动与桌面侧栏 / 顶栏；`:1079` themeTransition 写 sidebar；`:435–436` searchMotionTimeline 仍列 flex-basis / width / max-width（SUB-145 已删宽度过渡）；`:445–450` ownerQualitySideNavCollapsePolicy、sideNavToggle；`:31–33` 依赖弃用 token `--tcrn-shell-sidebar-width-collapsed`（K9 问题 2–4）→ C2-7。

| Subtask | 包自报 | 实测 |
| --- | --- | --- |
| SUB-176 | 完成 | 判据内一致：第 1039、1046 行改写，search 936 / 228，#7aa0f5 只余历史与待裁说明，oracle 两段、内容行、CHANGELOG、ui-tokens README 已改，30.01、29 退出 0；摘录外旧壳字段见 C2-7 |
| SUB-177 | 部分 | 一致：字体子集（06.08 绿）、几何、壳层门、映射、契约与 API 清单、internal-alpha 回执已再生，清单大部同步；视觉签名未重收；清单三处过时（上文） |

### 2.5 START 质量硬线

| 硬线 | 文档壳（147） | 样板（148） | 门（149 真件） | 结论 |
| --- | --- | --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 21 次：纸外侧栏 0、收起钮 0、关闭钮 0 | 24 壳 0 / 0 / 0 | noCollapse 几何与点外部两半都过 | 满足 |
| 顶带无底无线、中线 26 | 四边 0、无阴影；标按钮中线 26 | 同 | strip、brandGeometry、barCentering 过 | 满足 |
| 三处间距相等 | 标按钮→首项 8，项间 8（6 项，en 与 zh-CN） | [8, 8, 8, 8] | pinSpacing 过 | 满足 |
| 接续 6 | 菜单顶 − 标按钮底 = 6（1440、1023、390） | — | continuation 过（含下拉） | 满足 |
| 锁定块只装饰 | 底栏锁定块不在控件内、无可聚焦子、右缘 = 面板右 − 16、带 `svg[data-logo]` | — | lockupDecor 过 | 满足 |
| 品牌资产 digest | 标 design-system、不透明 1；字标 61 / 117 截断带 title（O-1 默认） | TMS 标与字标完整 | brandDigest 红（命名映射，C2-10）；brand-asset:proof 绿（`14`）；品牌首行 DS 字标 zh-CN 被换字（C2-3） | 不满足 |
| 标旁文字中线 | 字标盒中线 26 | — | markText 红：en 两处属 O-4，zh-CN 一处属 C2-3 | 部分（阻于 O-4 与 C2-3） |
| 登入动画只用 transform 与 opacity | 文档页不播 | — | intro 过：[transform, opacity]、475 ms、首载 1、再载 0、减弱 0（两语） | 满足 |

## 3. 返工清单

### C2-1 壳层门三处读法在真件上读的不是板上那一物（主力）
- 现象：§2.3 前三条（隐藏列钉钮读成 0 × 0、kbd 底色漏掉叠放的 input、16 宽图标比 22 宽图标的左缘）；story-label-plus-40 取样落在同一隐藏列；包件夹具 `package-menu.html` 按板写 22 宽图标、没有隐藏列与叠放 kbd，所以夹具绿而真件红。
- 证据：`report.json` gates、checks、mutations；`44-probe-shell-sum.txt`；`45-kbd.json`、`51-kbd2.json`；`shell-measure.mjs:199,404–405`；`package-menu.html:25–30`；K7 交回 §5 第 6 条；K5 问题 6。
- 改法：① 钉钮尺寸只收渲染出来的钮（自身与祖先都非 display:none、盒非零），保留撤轨道的变异；story-label-plus-40 改取 1440 下可见的组标题。② 底色读法加「格下方叠放元素」（如 `elementsFromPoint` 取格中心下方的底），或给 kbd 格写 `data-probe` 指到 input。③ prail 改比图标中心（板 16 + 11 = 27，包件 19 + 8 = 27）或内容盒左缘（19），THRESHOLDS 随之改名；先交判断定口径（门判定语义，C-7 列表外）。④ `package-menu.html` 按包件真实 DOM 改（16 宽图标、隐藏的已固定列、叠在 input 上的 kbd），让同类错误在夹具上能复现。改后真件 pinJitter、contrast、prail 与 D 段「图钉位」应转绿。
- 文件：`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/shell-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/shell/{package-menu.html,mutations.json,manifest.json}`。涉及 149-GWT1、142-GWT1、137-GWT5。

### C2-2 样板画框不定高，壳伸出 640 画框（经济）
- 现象：映射与几何的 overlap 4 行（typography、inputs 两样板浅夜）；已量的三个样板壳都是内容高（635 / 661 / 681），纸内不滚。
- 证据：`19 log:4177–4214`；`18 log:1112,1143` 起各 run 的 overlap；`44-probe-shell-sum.txt` SAMPLES；`composition-one.tsx:147–151,196`；`matrix-renderer.tsx:253–258`。
- 改法：让壳的父级与画框同高：画框里的 `StaticMarkup` 包装层取 `block-size:100%`（样板 story 样式 `[data-shell-frame] > [data-gplus-static-markup] { block-size: 100% }`，或给 `StaticMarkup` 加 style 入参），不改壳组件。改后复量：样板壳高 640、纸内滚动区可滚、overlap 0、shellFrame 与映射行仍绿；视觉签名 B 类 18 条会再变，留给 C2-9 一次重收。
- 文件：`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`（必要时 `gplus/matrix-renderer.tsx`）。涉及 148-GWT2、149-GWT2（解开 verify 串联）。144 所在片若对 SUB-160 画框另记同条，合并。

### C2-3 品牌首行 story 的 DS 字标在 zh-CN（推及 ja、ko）被换字（经济）
- 现象：`b.tcrn-brand-lockup__word > em` 的「Design System」被运行时换成「设计系统」；壳层门 markText 与 brandDigest 的 zh-CN 读数都量在换过字的文字上。
- 证据：该 story 服务端标记为英文；`44-probe-shell-sum.txt` zh-CN brand 行；`client-scripts.ts:310` 跳过表只有三个类；`storybook-content-text.ts:89`。
- 改法：跳过表与台账 `exemptSubtreeSelectors` 同时加 `.tcrn-brand-lockup__word`（K2 交回 §5：两处一起改）；改后复读 zh-CN 扫描与壳层门 markText、brandDigest。
- 文件：`apps/storybook/src/build/client-scripts.ts`、`scripts/lib/locale-invariant-ledger.mjs`。涉及 147（硬线品牌资产原样）、145、149-GWT1。

### C2-4 shell:parity 的 package-nav-item 两侧取不同行型（主力）
- 现象：parity 只剩这一处值差：文档首行是普通行（右内距 4），story 首行是可钉行里的链接（右内距 0、包装 4）。文档菜单没有可钉行，`ts-x-l` 没有普通行。
- 证据：`11 log:5`；`44-probe-shell-sum.txt`（DOCMENU、firstRow、firstPlainRow）；`shell-screen.mjs:88`；K2 问题 1、K5 问题 1。
- 改法：该角色改比「行的右缘留白」——普通行取行自身，可钉行取 `.tcrn-nav-item-row` 包装（两侧都是 4）；或在 story 侧另选一个含普通行的屏作样本。属门取样口径，先交判断确认再改。147 的判定人 parity 由此转绿。
- 文件：`scripts/shell-parity-proof.mjs` 及其测试。涉及 147。

### C2-5 browser-proof 的四处期望与时机跟不上 R2 的改动（主力）
- 现象：(a) brandMarkLocaleChecks 仍要 zh-CN、ja、ko 的锁定块后缀为「设计系统」「デザインシステム」「디자인 시스템」，与 SUB-166 相反；(b) reproducibility 仍要 `openMenus === 6`，两探针现都是 14；(c) 禁用导航项读回在收起的顶带上读到 0 个；(d) zh-CN 泄漏扫描不等壳 story 水合跟随语言就读，批末 13 条、K12 同代码 0 条。
- 证据：`internal-alpha-browser-proof.mjs:1385,2623,2839–2846,3802–3816`；`story-coverage-manifest.json` 的 `localeRouteCheck.brandMarkLocaleChecks[0,2,3]` 与 `packageBackedDisabledNavItemReasonReadback` ok 假；`receipts-dirty/tracked.diff:60–155`；K12 问题 4、5，K11 问题 9。
- 改法：(a) 后缀期望各语言取字标原样「Design System」，描述行另查换字；(b) 比两探针投影相等，不钉常数；(c) 禁用项读回改读打开菜单的屏或含禁用 NavItem 的页内样本；(d) 等页上全部 `[data-shell-hydrate]` 块挂载并跟随语言后再读（挂载入口在块挂载、换语言后写标记属性）。阈值不放宽。
- 文件：`scripts/internal-alpha-browser-proof.mjs`（必要时 `apps/storybook/src/build/shell-hydrate.tsx` 加标记）。涉及 147、150（30.02、30.04）。

### C2-6 文档壳浮层换成水合真件（主力，承接 K5 问题 7）
- 现象：文档壳服务端是包的 ProductShell，开合、搜索、主题、语言却由文档层脚本操作隐藏标记；≤ 760 文档页打开的是面板（390 宽 366、行 32）而不是 Sheet（行 44），开态 chevron 仍是关态图标（P10 问题 5②）。
- 证据：`probe-doc.json` 1023 与 390 的 `panelKind: expanded`；文档页 `data-shell-hydrate=` 0 处；K5 交回 SUB-151 与问题 7。
- 改法：按 K5 问题 7：文档壳由挂载入口水合真件——ProductShell 受控 `menuOpen`，`searchProvider` 读页内搜索索引，`onThemeChange`、`onLocaleChange` 接现有脚本；同改 smoke 与 browser-proof 的文档壳读法（railReachability、文档壳比较器）。门判定不改。
- 文件：`apps/storybook/src/build/page-template.tsx`、`client-scripts.ts`、`shell-hydrate.tsx`、`scripts/storybook-smoke.mjs`、`scripts/internal-alpha-browser-proof.mjs`。涉及 147（D1 壳只有一种）、144、141；与 141 所在片同条合并。

### C2-7 消费面旧壳文字残留（主力）
- 现象：AI 消费契约在点名几行之外仍按旧壳写（§2.4）；内容行 `navigationStrategyRows` 三行（顶栏与紧凑搜索、可收起侧栏、抽屉菜单）与 `storybookOnlyPrototypeRows`；oracle 字段名 `desktopSidebarWidthPx`、`desktopTopbarHeightPx` 与读回标签「Desktop sidebar width」；`docs/design/gplus-2026-10/README.md:11` 仍写夜间 #7aa0f5 与 rail-w 220。这些字段被 smoke 的契约交叉检查钉着（K3 问题 7），单改文字会翻红。
- 证据：`ai-consumption-contract.ts:31–33,224,435–450,1060,1077–1079`；K9 问题 2–4；K8 交回 §2 第 8 条。
- 改法：按顶带壳与 M23 改写：引入面列现行件、弃用件写成「已弃用，见 M23」；visualSkin、themeTransition 改为顶带与纸；删宽度过渡与侧栏收起策略；oracle 字段改名并留旧名指向新名一个版本；smoke 交叉检查与 smoke.test 断言同改，五语补齐。
- 文件：`apps/storybook/src/build/ai-consumption-contract.ts`、`foundation-visual-standards.ts`、`contract-stories/content/navigation-rows.ts`、`component-rows.ts`、`contract-stories/story-content.tsx`、`locales/storybook-content-text.ts`、`scripts/storybook-smoke.mjs`、`apps/storybook/src/smoke.test.ts`、`docs/design/gplus-2026-10/README.md`。涉及 150、147。

### C2-8 文档层旧规则与弃用别名（经济）
- 现象：构建仍提示 28 个弃用别名 210 处；`alpha-styles.ts:445` 的 `.tcrn-doc-product-shell-search--static-display` 规则已无标记使用，它的例外 `EX-INIT015-doc-product-shell-search-static`（until 已满足，R2-24 要删）与白名单 `.tcrn-product-shell-search__results` 仍在；`docs/style-scale.md:234–246,278` 仍举旧演示类名；`gplus/icon-roster.tsx:1` 注释写 37。
- 证据：`storybook-build.log:67–96`；`shell-fidelity-proof.mjs:118–122,371–378`；K2 问题 3、4，K11 问题 2。
- 改法：文档层五个文件按提示换 G+ 新名（别名与新名两主题同值，`token-deprecation-notice.test.mjs` 已证），build → demo-styles:sync → build；同一提交删死规则、例外条目与白名单项；改 style-scale 两段与注释。复跑 shell:fidelity、doc-shell:proof、tokens:proof。
- 文件：`apps/storybook/src/alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`（同步段）、`contract-stories/story-content.tsx`、`internal-dev/overlay-family-lab/OverlayFamilyLab.tsx`、`scripts/shell-fidelity-proof.mjs`、`docs/style-scale.md`、`contract-stories/gplus/icon-roster.tsx`。涉及 147、135-GWT4。

### C2-9 SUB-177 续做：视觉签名重收与清单校正（主力：同一目标第二次派，判断 G6）
- 现象：视觉签名 0 条重收（回归 199、新增 18）；清单三处过时或遗漏（§2.4）。
- 证据：K12 交回 §2–§4 与问题 1；`owner-acceptance.md:178,240,251–267`；`30.02 log:17–20`。
- 改法：C2-1 至 C2-8 与他片返工合入后，在同一构建上跑一次 browser-proof；`nonVisualProofOk` 为真后按 K12 的分类脚本重分类，A 类离群 14 个 story 逐页看过只来自换壳与样板，再写选择文件并 `--update-visual-baseline`；`table-work-index-spec` 三条交判断。清单：第 178 行改为批末读数（brand-asset:proof 退出 0、brandDigest 红的原因）；G-5 改为「SUB-174 已补三类读法、豁免格只列不比，余 srch-kbd 读法」；待裁表补第二批 O 项（R1 判断 §3.1 尚未进表的各条）；G 行补本轮新差距（品牌首行 zh-CN 换字、文档页 ≤ 760 不开 Sheet、样板纸内不滚），已修的随修改写。
- 文件：`docs/verification/**`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`。涉及 150。

### C2-10 本片门红的他片根因（主力，汇总；与 A、B 片同条合并，不重复派）
- 现象与归属：① 壳层门 singleLine 把纸内面包屑当单行载体读（K11 问题 3，SUB-164，146）；② brandDigest 的产品键与 logos2 文件名、Brand E 参照映射（K11 问题 5，145）；③ axe 14：品牌首行锁定块后缀 color-contrast（扩豁免到 `.tcrn-brand-lockup__suffix`，按 2026-10-11 D2 交判断，K11 问题 6）、TocRail 标题 h3 致 heading-order（K11 问题 8）、landmark-unique（包内置名不带 landmarkLabel 前缀、TocRail 无名 nav、demos 与矩阵两处未传名，K11 问题 7）；④ smoke 3：AOS 两个 search-results 变体渲染关着的壳（K3 问题 4、K11 问题 12）、`mobile-dark-zh-cn-work-queue` 缺「工作项」（K3 问题 5）；⑤ clippedButtonText（AOS 壳标题，K5 问题 13）；⑥ geometry:proof 的 searchOverlay 碰撞判定（K11 问题 1）；⑦ contract:static 的测试不变式（主线程 M3）。
- 证据：`30.02 log:7–51`、`a11y-axe-summary.json`、`17 log:2245–2247,5707–5710`、`10`、`13` 日志、`report.json`。
- 改法：按各条持有片的返工；本片只要求合入后复读 147、149、150 的门。
- 文件：见各条。涉及 147、149-GWT1 / GWT2、150。

## 4. 只有 Owner 能定的事项

新发现：本片没有只能由 Owner 定的新事项。C2-1 的 prail 口径、C2-4 的 parity 取样、C2-10③ 的 axe 豁免扩展都是门口径，按 C-7 与 2026-10-11 D2 交判断。

本片仍挂着的 Owner 项（R1 判断 §3.1，读数本轮复核）：
- O-2（148-GWT1）：Brand 板无 D 段。建议接受「四板 D 段 + 07a 第 1 段」，链上注解写明读法。
- O-4（149 markText 的 en 两处：TMS 底栏锁定块 1.7、DS 首行 1.4）：建议 ±1 改量「大写顶到基线」；不裁则 markText 与 D 段「标按钮（v2）」按 ±1 继续红。
- O-1（文档壳字标 61 / 117 截断带 title，G-10）：建议同 R1（宽度至少 134、随字标加宽）；现按默认截断，不阻机器判据。
- O-8（夜间 TMS 后缀 3.07 / 3.13 / 3.33，G-1、G-11）与 O-7（文档站无登录头像、目录宽 144）：同 R1 建议。
- Owner 目视：147、148（发布后）、150 的判定人含 Owner，本片不代签；S-1 库门未声明前 4 张都不能转 done。
- 建议新加的目视项（C2-9 写进清单）：视觉签名 A 类离群 14 个 story 是否只来自换壳。

## 5. 实施口径判定

| 包-条 | 写明的选择 | 判定 | 理由 |
| --- | --- | --- | --- |
| K2-1 | 比对副本 = 前缀化家族段 + settings + 前缀化壳层段（壳层段最后） | 可接受 | 读数合板；每页多 27 KB（37 页约 1.01 MB），现无门管页面字节，记知悉 |
| K2-2 | 跳过表按类名认三种字标载体，台账同步，不另设文档层钩子 | 有条件 | 后加的 `.tcrn-brand-lockup__word` 漏掉（C2-3）；条件：跳过表与台账随每个新字标载体同改，或改用专用钩子 |
| K2-3 | 变更日志单一来源取 group 键，ja、ko、fr 壳内文字随页标题 | 可接受 | 只有一个来源，与页标题一致 |
| K2-4 | Esc 用 defaultPrevented 告知外层 | 可接受 | K5 再收窄为只认本壳头像菜单内处理过的 Esc，行为已核 |
| K2-5 | 演示类名改 `tcrn-doc-demo-frame`、`tcrn-doc-demo-pager` | 可接受 | 文档层私有类；style-scale 未跟（C2-8） |
| K2-6 | 删参考页索引格按下缩放 | 可接受 | G+ 按钮家族不缩放，属文档层，目视时看 |
| K3-1/2/3/5/6 | 自检改挂现存角色；比较器只量关着的壳与头像菜单；当前位置只查存在；索引页目录计数期望 0；AOS 两项另写切片检查 | 可接受 | 判定语义不变或属判断 §3.4 第 1 条已认口径 |
| K3-4 | railReachability 量文档壳自己的菜单 | 可接受 | C2-6 换真件后读法要跟 |
| K5-170 | 切段认段首标记，缺失、重复、错序各有报错码，标记不进切片 | 可接受 | 实测一致 |
| K5-151 | 文档壳只补 `data-shell-brand` 随视口，浮层留到下一轮 | 有条件 | R2-22 对文档壳的部分未达；条件：C2-6 下一轮做（SUB-151 其余由 141 所在片判） |
| K5-160 | 画框定高 640，壳以自身 style `block-size:100%` 填满 | 有条件 | 写法方向对，样板里包装层无高度致落空（C2-2）；其余落点由 144 所在片判 |
| K7-1 | css-template：连进 `tcrnRetiredComponentCss` 的段不计家族段 | 有条件 | 合理（该段注明非家族段）；须判断确认属「正则放宽」授权 |
| K7-2/3/4/5 | 只列不比须同时带 data-exempt 且在 listOnly；遮罩为第二读数；无 data-probe 的格自动选读法；prail 放在 18 门之外 | 可接受 | 防靠加豁免变绿；与 measure-shell.js 同读数；G 段 18 门名单不变 |
| K7-6 | pinJitter 尺寸半边把 display:none 钉钮读成 0 × 0 | 不可接受 | 包件按设计在 ≥ 1024 隐藏「已固定」列，真件因此恒红；撤轨道的新变异已能判红，尺寸半边应只读渲染出来的钮（C2-1） |
| K8-4 | SUB-172 按 heights.json 与 120 间距排 | 可接受 | 实测一致 |
| K8-6 | shell-matrix 不并排、不进 grace | 可接受 | 1664 ≤ 2000；并排有 40 处越框 |
| K8-7 | 九条台账按复刻读法的现测值 | 可接受 | 批末 stale 0、violations 0 |
| K8-8 | SUB-171 只改三处，同表其余旧行留给 smoke 钉着 | 有条件 | 消费面仍有旧说法；条件：C2-7 连 smoke 一并改 |
| K8-1/2/3/5 | SUB-153、SUB-157 的选择 | — | 归 142、143 所在片判 |
| K9-1 | 保留 `storybookRestWidthPx` 等字段名 | 有条件 | 兼容可以，但「rest / expanded」已无所指；C2-7 改名时旧名保留一个版本 |
| K9-2 至 K9-10 | 保留 `data-doc-shell`；oracle 值走派生字典键；smoke required 换四条新规则；README 与 contract README 事实修正；M9 就地改并注明；CHANGELOG 只追加 M30–M37；迁移条目照录各包；字典换 11 键 | 可接受 | 都在授权内（拆分问题第 9 条、C-11），与门、契约、页面现状一致 |
| K12-1/2/3/5/6/7 | 构图三用字面屏名；文案检查只剔除固定组标题；intro 块不带 contain:layout；样板描述照页面写；两门为写报告补跑；视觉签名不重收 | 可接受 | 读数一致；不重收是判据前提未满足时的正确停法 |
| K12-4 | 替换句先进字典，渲染留给 story-content 持有者 | 有条件 | 读回仍缺这句；141 所在片补渲染 |
| K12-8 | 清单只改有据的行 | 有条件 | 第 178 行、G-5、待裁表三处过时或遗漏（C2-9） |

不可接受 1 条：K7-6。

## 6. 证据盲区

- 壳层三段在批末 verify 里没执行（gplus overlap 处串联停）；149 真件读数取 K12 在同一代码上的运行（`report.json` 5a5cad2、`logs/r2-k12/177-shell-measure*.log`），没有在批末构建上复跑。
- 未重跑任何门；C2-1 三条归因来自本片探针对同一 DOM 的读数与门源码，改法合入前未在门上验证。
- ja、ko 的品牌首行换字只按字典（`storybook-content-text.ts:89`）推断，未开 ja、ko 页量。
- 文档页 ≤ 760 开面板只在两页 390 与一页 1023 量过，其余页按同一脚本推断；样板壳高只量了 typography、inputs、icon。
- 视觉签名 217 条变化未逐张看截图；四板 D 段本轮未用 measure-shell.js 复量（依据「D 段字节未动」）；AOS 实例缺「工作项」的原因未查。
- 链上实时状态未读；Story 原文取自 scratch `chain/src/*.json` 快照。
- 残余：scratch `acc-r2-C/` 只有探针脚本与读数（约 0.55 MB）；一次误扫的 102 MB 输出已清空为 0 字节（`acc-r2-C/trash/`），随 scratch 回收。
