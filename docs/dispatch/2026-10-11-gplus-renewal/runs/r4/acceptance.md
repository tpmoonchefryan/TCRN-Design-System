# INIT-015 R4 · 验收（小轮：验收与判断由同一主力档代理一次完成）

被验对象：集成分支 `claude/init015-gplus-renewal`，HEAD 6a186ff。R4 唯一的包 P0（SUB-107 → 112）在 510c972 合入（第二父提交 b6a3d42，包树自 ee01f8f 切出），其后 6a186ff 只改 `runs/state.md` 与 `runs/r4/excerpts/acceptance-judgment.md`。输入：R4 拆分第 2.3、3 节；`R4/handoff/P0.md`、`R4/problems/P0.md`；R3 判断 §1、§2.2、§3、§4、§5.3；链上 Story 130、133、134 的 goal 与 GWT（会话 scratch `chain/r4/STORY-*.json`）与 Subtask 读回（`chain/r4-subtasks-readback.json`，version 1834）；R4 批末日志（会话 scratch `r4-final/`：verify 在 510c972 退出 0，storybook:build 退出 0）与 R3 批末日志（`r3-final/`，3f9d658）；与判据相关的仓内文件。本验收只读：没有改代码、门、回执或链，没有跑门、构建、开浏览器或运行引擎；只读探查脚本与输出在会话 scratch `tmp/r4-judgment/`。`R4` = `docs/dispatch/2026-10-11-gplus-renewal/runs/r4`，`R3` 同理，路径相对集成工作树。

读法（节行号）：§1 第 7 行；§2 第 38 行（SUB-107 第 40 行，SUB-108 第 48 行，SUB-109 第 56 行，SUB-110 第 62 行，SUB-111 第 71 行，SUB-112 第 84 行）；§3 第 95 行；§4 第 105 行；§5 第 113 行；§6 第 126 行。

## §1 一览

结论：六张 Subtask 判据全部达成，返工 0 条。130、133、134 的 GWT 复核没有不满足项：133 由门判，通过；130 与 134 的机器侧满足，判定人为 Owner，134 的前置（EPIC-039 至 042 全部 Story done）仍受 RM20 阻塞。其余 12 张没有回退。

| Subtask | 来源 | 结论 | 关键读数 |
| --- | --- | --- | --- |
| SUB-107 | R4-1（C3-2） | 达成 | `governance.ts:61` 新说明覆盖构图一五个样板与构图三；旧英文句在 apps、scripts 下 0 处；新词条四语与同语言其它词条 0 处同值（独立解析 2095 条）；R4 批末构建的静态页 37 页带新说明、0 页带旧句 |
| SUB-108 | R4-2（C3-1） | 达成 | README 两节的数字与门源码逐项一致：CHECK_IDS 10、STORY_PROBES 4、STORY_MUTATIONS 6、ROW_MUTATIONS 10、shellFrame 12/52/0.5；`storybook-visual-proof.mjs:491` 只改标签 |
| SUB-109 | R4-3（A3-1） | 达成 | diff 只有两行删除；R4 批末 zh-CN 新漏译 0、已登记债 104（与 R3 同） |
| SUB-110 | R4-4（C3-4） | 达成（方案 A 条件成立） | 面板加一个 Text；构建产物五语都在；故事高度门 ok、超限 0、宽限债 9（与 R3 同），未加宽限条目 |
| SUB-111 | R4-5（A3-2 (a)(b)、B3-1、C3-3、B §4、C §4） | 达成 | 七处与来源一致、未勾选、未加豁免；N-1 实测夜间 4.45、浅色 5.17，本验收按交回的计算色独立复算为 4.4451、5.1709 |
| SUB-112 | R4-6（批末再生、A3-2 (c)） | 达成 | 签名变化只有预期 3 条，写入 3、拒绝 0；R3 记录改名保留（同一 blob a9c7dfe）；映射报告 23/23；P18 改写，交回未复核的两处事实已由本验收核对 |

130、133、134 的 GWT 复核（链上 goal 与 acceptance 为准）：

| Story | GWT | R4 后结论 | 证据 |
| --- | --- | --- | --- |
| 130（判定人 Owner） | 1 映射每行有报告行且各项全绿 | 满足（机器侧） | R4 批末 verify 的 storybook:visual-proof：rows 23、rowsOk 23、redRows []；入仓报告 10f0ece（HEAD 1f0a18c）同读数 |
| | 2 删掉映射里一个 story 判红 | 满足（无回退） | 门的判定逻辑未改（R4 只改 `:491` 一行报告标签）；visual-proof 测试 16/16（交回）且 R4 批末 verify 退出 0 |
| | 目标条款与 R3 缺口 | C3-2、C3-1 已关 | 类目说明覆盖构图三（SUB-107）；报告标签不再写死数字（SUB-108、SUB-112）；差异 10 条照旧都带引用 |
| 133（门判） | 1 verify 执行新门且有报告 | 满足 | 真实 verify 在 510c972 退出 0，依次跑 32 个 pnpm 子脚本，含 contract:proof、geometry:measure、contract:static、doc-shell:proof |
| | 2 单跑 geometry:measure | 满足（无回退） | 脚本与参数未改 |
| | 3 CI 工作流含 verify | 满足（无回退） | CI 配置未改；没有推送 |
| | 目标条款「文档列出每门的判据、阈值、变异」 | 补齐（C3-1 关闭） | SUB-108，见 §2 |
| 134（判定人 Owner） | 1 pack:smoke 通过 | 满足 | R4 批末 verify 含 pack:smoke，退出 0 |
| | 2 迁移说明逐条对照 breaking 清单 | 满足（无回退） | CHANGELOG 与 `docs/migration-4.0.md` R4 未改 |
| | 3 目视清单每板一节 | 满足 | SUB-111、SUB-112 只改行内文字、新增一行，没有删节；scaffold:proof（含 changelog-release-sections 与 version-surface）在 R4 批末 verify 中通过 |
| | 前置与判定 | 未满足（RM20）；判定人 Owner | 120–133 在链上仍为 active（S-1） |

其余 12 张（120–129、131、132）只核 R4 没有回退：R4 合入的改动不碰 `packages/` 下任何文件，只改 Storybook 文案、一份台账、一行报告标签、文档与回执；R4 批末真实 verify（32 个 pnpm 子脚本，含 tokens:proof、contract:proof、geometry:proof、shell:parity、brand-asset:proof、pack:smoke、geometry:measure、storybook:visual-proof、internal-alpha:browser-proof、scan）退出 0，storybook:build 退出 0；verify 末尾的 internal-alpha 回执读数 requiredStoryCount 66、screenshotCount 310、axeViolationCount 0。browser-proof 汇总与 R3 批末（3f9d658）逐字段比对：38 个字段 37 个相同，只有非门读数 localeLeakRecorded.fr 3073 → 3083（新法语句，见 §5 第 6 条）；映射门汇总相同（23/23）。127、128、129 在 R3 summary 里挂给 R4 的三件事（Brand 行夜间色、样板说明、1024 读数）已由 SUB-111、SUB-110 做完。

## §2 逐张判据与证据

### SUB-107 · gplus-samples 类目说明（3e4229f）

- 只改 `governance.ts` 第 61 行 description：diff 只此一行。新句为「Five samples of the first five component families in a composition-one product shell, and a composition-three page with no side rail and a navigation bar across the top, light and night.」，覆盖构图一五个样板与构图三（无侧栏、顶部导航），保留 light and night，不带工单键、轮次与内部词。
- 词条：旧键整条删除（原第 2054 行），新键在 `storybook-content-text.ts:2055`，zh-CN、ja、ko、fr 四语同步改写。同值检查（本验收独立解析，2095 条，无重复键）：四语值与同语言其它词条同值 0 处。
- 其它类目未动（diff 只此一条）。
- 渲染位置与视觉后果：R4 批末构建的 `storybook-static` 里 37 个页面带新说明、0 个带旧句；包内第一次 browser-proof 的签名变化只有 SUB-110 的 3 条（交回 §5），说明本单没有改视觉签名。`story-coverage-manifest.json` 记了新说明的 zh-CN 文字，回执随 SUB-112 提交（824641d）。
- 判据读数：`git grep` 旧英文句在 apps、scripts 下 0 处（退出 1）；zh-CN 新漏译 0（R4 批末 verify 的 localeLeakZhCnNewLeaks 0）；局部门按交回 §11 为绿，批末 verify 覆盖 build、storybook 测试、public-output、internal-vocab。

### SUB-108 · 契约 README 两节与报告标签（4e0d778）

- 几何门一节（`docs/contract/README.md` 第 89–106 行）与门源码逐项对照：十项检查名单等于 `scripts/lib/gplus-measure.mjs:37–48` 的 CHECK_IDS（clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight、overlap、shellFrame）；STORY_PROBES 四个等于 `scripts/geometry-measure-proof.mjs:128–133`（含 iconStroke），iconStroke 的 16px、1.25px、non-scaling-stroke 等于 `:140` 的 ICON_STROKE；阈值表 shellFrame 一行等于 `:66` 的 THRESHOLDS（paperInsetPx 12、topBarHeightPx 52、tolerancePx 0.5），「上、尾、下三边，起始边不量」与 `gplus-measure.mjs:616–646` 的实现一致；STORY_MUTATIONS 六条等于 `:112–120`（含 shell-paper-inset-zero、shell-top-bar-68）。测试条数改为不写死。
- 映射门一节（第 117、120 行）：每行十项检查与几何门同一组（`storybook-visual-proof.mjs:27` 导入 CHECK_IDS）；ROW_MUTATIONS 十条等于 `:66–77`，rail 落在 typography-sample-billing、shellFrame 落在 actions-sample-project，其余在矩阵上，与 README 的说法一致。测试条数不写死。
- `storybook-visual-proof.mjs` 只改第 491 行：「八项测量」改为「测量项」；eightMeasurements、EIGHT_MEASUREMENTS 未改名（diff 只此一行）。
- 报告由 SUB-112 再生（10f0ece），diff 只有生成时间、HEAD 与标签一行，没有手改。
- 判据读数：两节数字与门源码一致（上列）；visual-proof 测试 16/16、readme:proof 1/1（交回）；R4 批末 verify 含 storybook:visual-proof 与 readme:proof，退出 0。

### SUB-109 · 译文债台账（865382b）

- diff 只有两行删除：density-spec 的「Document publishing is not wired in this static DS fixture」与 backlog-spec 的「Add record placeholder」；其余未动，符合台账头注「翻译时同提交删条目」。
- 判据读数：R4 批末 verify 的 browser-proof 汇总 localeLeakZhCnNewLeaks 0、localeLeakZhCnAllowlistedDebt 104（R3 同为 104；两串已译，不再泄漏，删条目不改债数，读数自洽）。
- 消费方为 `apps/storybook/src/smoke.test.ts` 与 `scripts/internal-alpha-browser-proof.mjs`，tests 下没有台账单测；storybook 测试 10/10（交回）。

### SUB-110 · 知识库样板的可见说明（122b17a）

- 条件：按交回与派工记录，派工前 Owner 没有把方案 A 改判为 B，本验收未见相反记录；本单执行有效。
- 改法：在 navigation-focused-shells-spec「Knowledge base bookmark shell」面板原有 Text 之后加一个 Text（`story-content.tsx:2142`），不在顶栏里；story 的 title 与 description 未改；例外、白名单与门未改（R4 合入的脚本改动只有台账与 `:491` 一行）。
- 词条：新键在 `storybook-content-text.ts:889`，五语齐；四语值与同语言其它词条 0 处同值；不带工单键与内部词（internal-vocab:scan 在批末 verify 中通过）。
- 构建产物：R4 批末构建的 `components-navigation-shells.html` 里 zh-CN、ja、ko、fr 各 1 处，en 3 处（词典与渲染各有出现；交回写「各 1 处」，差别不影响判据）。
- 高度：交回读数桌面 1126 → 1184（上限 2000，只量桌面）；R4 批末 storyHeightBudgetOk true、超限 0、过期宽限 0、宽限债 9（与 R3 同），`story-budget.mjs` 未改，没有加宽限条目。
- 视觉后果：本 story 三个视口签名越过容差（容差 meanAbsolute 2、maxCell 8；实测 maxCell 11、29、15），由 SUB-112 重收。

### SUB-111 · 目视清单七处（1f0a18c，行号为 HEAD）

1. 待裁第 10 行（:245）：删去「随 SUB-101 一起解决」（全文 grep「一起解决」0 处）；改为浏览器实测与读法（等字体、两帧与全部过渡结束；侧栏底色取最近的不透明祖先 `.tcrn-doc-sidebar`；按 alpha 0.78 在 sRGB 合成；WCAG 2 相对亮度，两位小数）；处置写「N-1：待 Owner 二选一，见收口文件 N-1；未答复时保持现状，不加豁免」。本验收按交回的计算色复算：合成底上浅色 5.1709、夜间 4.4451；字对侧栏本身浅色 4.858、夜间 4.886（与 O-2 的 4.86、4.89 一致）。
2. R2 表第 4 行（:209）改为两个原型名已由 SUB-105（4d0dfde）删去，回退说明补 4d0dfde；第 5 行（:210）补 R3 现状。80 个豁免节点的底色本验收在 `a11y-axe-summary.json` 现读：#ffffff 44、#efeeea 36。
3. Brand 第 128 行写成「浅色 #2c63c8、夜间 #7aa0f5（O-3，SUB-088）」；全文带 #2c63c8 的四行（:74、:128、:193、:237）都带 #7aa0f5。
4. 已知差距（:78）加 1024 宽一句，与 `R3/handoff/P1.md:79` 一致（纸面约 406、工具行折行、顶栏 147）。
5. Brand 收起态新目视项（:132，表格新行，两格未勾）：中心 26、16、22、26，与 `R3/handoff/P1.md:81–84` 一致（收起钮 7–45、标 5–27、品牌链接 5–47 即 42 宽、图标 14–30、侧栏 52）。
6. R3 节第 2 行（:225）补两种外观与 side-nav 例外设底色。
7. R3 节第 5 行（:228）补「没有悬停全文」。
- 未勾选：diff 里所有勾选格保持 `[ ]`。P18 不在本提交（归 SUB-112，97c1ec3）。
- 判据读数：七处与 R3 判断 §2.2 R4-5 所列来源一致（上列逐条）；`pnpm scan` 0 命中（交回）；R4 批末 verify 的 scan 步 hits []。
- 行号变化：:132 新增一行后，原 :132 及以后各行都下移一行。R3 判断（§1、§2.2、§3）引的清单行号 169、174、224、227、244、246、247、249 现为 170、175、225、228、245、247、248、250；收口文件以新行号或条目编号引用（判断 §3 已换算）。

### SUB-112 · 批末再生（7dd7102、824641d、10f0ece、97c1ec3）

- 第 0 步：SUB-107…111 的提交都在本单之前（提交顺序见交回 §1）。
- 第 1 步：第一次 browser-proof 非视觉检查全绿（交回 §6：axe 0、storyCoverageManifestOk、zh-CN 新漏译 0、高度 ok、clipped false、buttonFeedbackOk、记录容纳 24/24、shellFidelityDrift 0）。
- 第 2 步：签名回归 3、新增 0，全部是 navigation-focused-shells-spec 的三个视口，其它签名未动，未触发停下条件。
- 第 3 步：`git mv` 改名单独提交（7dd7102，改名 100%）；ee01f8f 的 `visual-selection-application.json` 与 510c972 的 `visual-selection-application-r3.json` 是同一 blob（a9c7dfe），192 条原样保留。R4 记录（824641d）3 条，处置 accepted-layout-change，理由与判据原文一致，evidence 记 HEAD 1f0a18c、inputSha256 前缀、距离与签名前后。写入 changes 3、refused 0；不重建复跑回归 0、新增 0。
- 第 4 步：824641d 只提交内容有变化的五份 internal-alpha 回执；其余再生而未变的没有提交；no-overclaim-scan.json 已还原；visual-selection-result.json 进 trash。R4 批末 verify 后工作树只多出惯常的两项（`r4-final/receipts-dirty/` 下的 no-overclaim-scan.json 与 visual-selection-result.json），说明入仓回执与集成树上的再生结果一致。fonts-vendor --check 通过（968 码位，与 R3 同），fonts:vendor 未执行，`packages/` 未变。
- 第 5 步：`--write-report` 后 storybook:visual-proof ok、rows 23、rowsOk 23、redRows []、行变异 10/10 判红；标签为「测量项 …，另有 overlap」。
- 第 6 步：P18（:250）按事实改写。交回 §12 说「51872c2」与「集成树批末 verify 复读回归 0、新增 0」取自判据原文、未复核；本验收核对：`R3/handoff/P4.md:3` 写包树自 51872c2 切出；R3 批末 verify（`r3-final/verify.meta`，3f9d658，退出 0）的 browser-proof 汇总 visualSignatureRegressions 0、visualSignatureNewBaselines 0。点名的 10 个 story、29 条与 `R3/handoff/P4.md` 第 4 节一致。R4 段写明 3 条重收、理由与「不代表目视通过」。
- R4 批末（集成树 510c972）复读：visualSignatureGated 199、RecordedOnly 111、Regressions 0、NewBaselines 0。

## §3 返工清单

本轮返工 0 条：六张都没有退回，也没有第二次返工。

同族余项（「同一族问题一次查全」时找到，不计返工，理由见各条）：

| 编号 | 现象 | 为何不计返工 | 去向 | 档位 |
| --- | --- | --- | --- | --- |
| R4A-F1 | 门的检查项由八项测量加 overlap 增到十项（R3 加 shellFrame）后，契约 README 与映射文档已改对，但还有 7 处写着「eight」：`apps/storybook/README.md:65`（说 geometry:measure 跑 eight measurements 加 overlap）；脚本注释 `geometry-measure-proof.mjs:3`、`:123`，`gplus-measure.mjs:5`，`storybook-visual-proof.mjs:11`、`:34`；测试标题 `tests/storybook-visual-proof.test.mjs:189`。其中应用 README 与 `storybook-visual-proof.mjs:11` 的列举漏了 shellFrame；`:34` 指 EPIC-042 原定的八项，不算错；其余逐处是否要改由后续批次判断 | 不对应任何 GWT 或硬线：133 目标里的文档条款由契约 README 满足，这几处是注释、测试标题和应用 README 里的顺带一句；130 的 GWT 原文自己就写「八项」；`storybook-map.md:9` 与 `storybook-map.json:4` 写的是八项加 overlap 加 shellFrame，是对的 | 后续批次，与 R3 判断 §2.3 第 4 条同列，收口列明 | 经济（文案） |

## §4 新的或变化的 Owner 事项

1. **N-1（有变化：静态估算已由浏览器实测证实）。** 夜间文档页侧栏 `.tcrn-doc-nav__category-count` 合成底上 4.45，低于 4.5；浅色 5.17。R4 拆分 §2.3 第 3 条（实测不低于 4.5 时由判断决定是否撤出）不适用，N-1 留在 Owner 清单。清单 :245 已写明读法与「待 Owner 二选一；未答复时保持现状，不加豁免」。两个选项的读数：(a) 文档层改 ink-2（静态约 7.87、7.00）；(b) 去掉计数自带底色，回到字对侧栏的浅色 4.86、夜间 4.89（R4 实测同值）。建议仍为 (a)。
2. **S-4 目视范围（有变化）。** 新增：navigation-focused-shells-spec 三个视口（R4 按渲染重收，新加一句说明）；清单 :128 的 Brand 夜间色、:132 的收起态中心线（N-5）、:78 的 1024 读数（N-3）、:225 与 :228 的补句（N-2、N-4）。清单第 131 行之后的行号都下移一行。
3. **N-2（有变化：多了一处要撤的内容）。** 方案 A 的说明现在在样板里可见。Owner 改选方案 B 时，除 R3 判断所列四条例外与两条白名单项外，还要撤回这句说明（`story-content.tsx:2142`、`storybook-content-text.ts:889`），并把这 3 条签名再重收一次。
4. **没有新的 N 项。** R4 只有一个包、一个经济档代理，由主线程合入，批末一次 verify，由一个主力档代理做验收与判断；按 git 历史与交回，R4 没有续派、没有跨包改动。M-1 的事后表态照旧；M-2、M-3 照旧维持。
5. **知悉：** fr 的「记录的漏译」把译好的法语也算进去（§5 第 6 条），不是门读数，不需要裁定。

## §5 口径判定（P0 交回 §12 的自定取舍与问题清单）

1. SUB-108 两节的测试条数写「以现跑为准，这里不写死」，没写现值：**可接受**。判据允许「不写死或写现值」，不写死就不会再过时。
2. SUB-110 新加一个 Text，不改原有句子的词条键；英文避开撇号，单位写 px：**可接受**。法语值里的撇号在双引号字符串内，没有问题；同值检查 0。
3. SUB-111 收起态目视项写成表格新行（两格未勾），注明是 R3 交回的读数、门不量：**可接受**，与清单其它目视项同一形式。
4. SUB-112 拆成四个提交（纯改名、签名与回执、映射报告、P18）：**可接受**。每个提交都在声明的文件集内，回退时可以逐项退。
5. P18 写的「51872c2」与「集成树批末 verify 复读回归 0、新增 0」取自判据原文，包内没有复核：**有条件，条件已满足**。本验收按 §2 SUB-112 第 6 步核对过，两处都属实。
6. 问题清单第 1 条（fr 记录值 3073 → 3083，因为检测器按拉丁多词片段计数，分不出没译的英文和法语译文）：**可接受，知悉**。这个读数是 recorded_report_only，不进门；要改检测口径就是改门的语义，不在 R4 授权内，也没有 GWT 依据。
7. 问题清单第 2 条（夜间侧栏底色在载入后有一段过渡，两帧后就读会读成 #7b7b78、3.31）：**可接受**。和 R1 lessons「门读计算颜色要等过渡结束」是同一件事，不另立新卡。
8. 问题清单第 3 条（N-1 留在 Owner 清单）：**可接受**，见 §4 第 1 条。
9. N-1 只在 `components-navigation-shells.html` 一个文档页上测：**可接受**。分类计数在所有文档页共用的侧栏里，两种主题各 23 个节点读数一样；没测其它页面记为盲区（§6）。
10. 交回 §14 的临时项（trash 里 110 MB 截图没有释放空间，`tmp/r4-P0/` 等判断读完再清）：**可接受**。清理放在收口步骤（判断 §5）。

## §6 证据盲区

- 本验收没有开浏览器：N-1 的计算色、23 个节点读数相同、平板与手机的故事高度，都来自包内的 scratch 探针；本验收只按交回的计算色复算了对比度。
- 签名距离和前后 sha256 来自交回与入仓的选择记录，本验收没有重算签名。
- 包内局部门的结果来自交回 §11。集成树上的批末 verify 覆盖了其中大部分；`fonts-vendor --check` 不在 verify 里，它的「通过」只有交回一处来源。
- 「派工前 Owner 没有改判方案 B」只依据交回与派工记录；本验收没有读纪要。
- 同值检查用的是本验收的逐行正则解析（每条词条占一行；解析出 2095 条，没有重复键），不是运行时代码。
- 映射门与几何门仍然只量 1440×900、en（R3 判断 §2.3 第 4 条的已知后续项），R4 没有改变这一点。
