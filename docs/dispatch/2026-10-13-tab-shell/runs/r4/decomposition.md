# TCRN-DS-INIT-016 · R4 拆分

本文件是 R4 拆分子代理的产出：R3 判断 §2 的返工清单 R4-1…R4-9 拆成 13 张 Subtask（TCRN-DS-SUB-212 至 TCRN-DS-SUB-224），挂在原 Story 下，分 5 个包、3 个波次。口径按判断 §3.1「不裁时的默认」（O-19 的 C8 与 O-4 的 markText 不派）与 §3.4（视为约定）；分包照判断 §5 的 5 包 3 波，包名 M1…M5 改为 N1…N5（避免与 R3 的 M 包混淆），组成、档位、波次与前置不变，拆分的取舍见第 2.4 节。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。拆分时发现的矛盾与缺口见 `problems/decomposition.md`，包表、波次与共享文件先后见 `packages.md`，机读清单见 `subtasks.json`，落链载荷见 `subtasks-batch.json`（13 个 work-create 成员，由主线程落链）。

读法：本文件按节读。第 1 节是跨包约定（编号 C-1 起，每个包都必须遵守，改约定须回拆分）；第 2 节是总览（返工编号对照、Story 对照、依赖图、拆分取舍、风险）；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。文中行号是集成分支 claude/init016-tab-shell 上 HEAD 5a6ff91 的位置，先 grep 再改。

节行号：§1 L9；§2 L45；2.1 L47；2.2 L63；2.3 L78；2.4 L90；2.5 L99；§3 L110；SUB-212 L116；SUB-213 L135；SUB-214 L153；SUB-215 L171；SUB-216 L191；SUB-217 L213；SUB-218 L226；SUB-219 L240；SUB-220 L256；SUB-221 L275；SUB-222 L292；SUB-223 L305；SUB-224 L319。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 依据、沿用与作废。** 本轮工作全部来自 R3 判断（`runs/r3/judgment.md`）§2 的 R4-1…R4-9；Owner 待裁项按判断 §3.1「不裁时的默认」做（C-6），判断 §3.3 的授权外清单与 §3.4 的口径视为约定（C-7），分包照判断 §5。R3 拆分第 1 节（`runs/r3/decomposition.md` 第 9–52 行）按下表处置，与本节冲突时以本节为准。
   - 继续有效：R3 C-3（命令形态与红线，本节 C-3 重申）；R3 C-8（样式模块与段登记，本节 C-8 补本轮范围）；R3 C-9 的回执与生成物规则（本节 C-9 改持有者）；R3 C-10 的文案五语同源、渲染文本不含工单键与内部词、运行时换字只跳过品牌字标；R3 C-12 已落地的接口（以 `runs/r3/excerpts/cross-notes.md` 第 3 节各行指明的交回物行段为准）；R3 C-13（目视项与待发布清单的交法，本节 C-13 改持有者）；R3 C-14（质量硬线与停下条件，本节 C-14 补本轮授权范围）；R3 C-15（期望对齐，本节 C-15 列本轮接收单）；R3 C-17（前置列只写包号）。经 R3 C-1 继续有效的 R2、R1 各条照旧有效。
   - 改写：R3 C-2（本轮不新增 token，见 C-2）；R3 C-4（包树与分支名改 r4、包名 N1…N5，见 C-4）；R3 C-5（本轮已知红与过渡红，见 C-5）；R3 C-6（待裁默认扩到 20 项，见 C-6）；R3 C-7（授权范围按 R3 判断 §3.3、§3.4，见 C-7）；R3 C-11（迁移说明与 CHANGELOG 只由 SUB-223 改，并按判断 §3.4 第 6 条放开两段，见 C-11）；R3 C-16（一次做对与再退回的升档，见 C-16）。
   - 作废：R3 各条里按 R3 Subtask 与包写的持有者名单（C-2 的落地单，C-9 与 C-13 的 SUB-211，C-10 的每波字典持有，C-11 的 SUB-210，C-12 的落地单与消费单，C-15 的接收单），由本轮 `packages.md` 与本节 C-9 至 C-15 取代。
2. **C-2 本轮不新增 token。** 判断 §3.3：R4-3（SUB-216）只用现有 token，没有合适的就停下记问题；任何包需要新 token、改契约 `tokens.json` 或其生成物，停下记问题。契约生成物（tokens.json、icons.json、matrices.json、marks.json）本轮都不改。
3. **C-3 命令形态与红线。** 同 R3 C-3：局部门一律写成 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch。`--filter @tcrn/ui-react test` 之前先 `run build`（dist 未构建时 0 条测试也退出 0）；根 `pnpm test` 在第一个红的包就停（KB-030），看某个包用 `--filter` 单跑。不新增依赖，不改 `pnpm-lock.yaml` 与任何 `package.json`（安装是停点；本轮的自检都写在已有测试文件或门脚本内，不新增 package.json 脚本）。任何文件（含未跟踪文件、交回与问题文件）不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得有以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字（大小写都算）紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` overclaim 短语表里的英文短语（摘录与交回都不抄原文）。
4. **C-4 包树、合入、提交与交回。** 集成分支 `claude/init016-tab-shell`。每包在自己的工作树（会话 scratch 的 `pkg/r4-<包小写>`，如 `pkg/r4-n1`）与分支（`claude/init016-r4-<包小写>`）上做，从集成分支在前置包合入后的 HEAD 切出；同一波的包并行（上限 3）。合入由主线程按 `packages.md` 的波次与依赖顺序做，W1 的合入顺序是 N1 → N2 → N3；N3 合入前，主线程在集成树上只读复跑一次 `demo-styles-sync --check`（它读 dist，KB-019；判断 §3.4 第 8 条）；冲突交集成子代理。按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；作者 tpmoonchefryan，不加 Co-Authored-By；不推送、不打 tag、不发版、不部署。每包交回 `runs/r4/handoff/<包>.md`：提交列表；写明的选择与回显项（含 B 类改名）；「迁移条目」「目视项」「待发布清单」「待补五语键」「期望过期」各节，没有就写无；局部门结果摘要（读数对照判据逐条写）；接续点。见红只记写 `runs/r4/problems/<包>.md`（同一根因算一条）。局部门只跑本包列出的门，同一门不为求稳重复跑，不跑 verify。每包不超过 150 响应，逼近 180 时提交干净状态、写接续点交回。
5. **C-5 见红只记、已知红与过渡红。** 包内看到不属本包 Subtask 的红，记一句「既有红，归 SUB-NNN（<包>）」或「既有红，待 Owner（O-19 或 O-4）」，不修。开工时的已知红是 R3 批末 verify（c45c529：30 步红 2、44 段红 2）：第 13 步 contract:static 只剩顶带 C8 15 条（静态 `yield-without-min-width` 1、story 层 `story-yield-missing` 14，待 O-19）；第 18 步 geometry:measure 只剩 markText（DS 首行 `lkr-line@22:design-system` 1.4、底栏 TMS 锁定块 en 1.7，待 O-4）。两处 R4 都不派（判断 §2 首段、§3.4 第 1、2 条），全轮照红，任何包不为它们改门、加豁免、撤登记。本轮的过渡红与预期新发现：
   - SUB-216、SUB-218、SUB-219 的可见变化与 SUB-217 的新截法，让 internal-alpha:browser-proof 的视觉签名越容差，到 SUB-224（N5）整批重收前一直红；各包跑 browser-proof 只看 nonVisualProofOk 与本单判据，不重收基线。
   - SUB-220 的 (e) 与 SUB-222 的 (f) 是收紧，可能跑出新发现：selection-grammar 在 tokens:proof 末段，它的新发现会让批末 verify 的 tokens:proof 红；弃用提示没有门断言为 0，只记条目。都只记问题，交 R4 判断。
   - SUB-213 的新探针与 SUB-215 的归属变化若跑出新发现，同样只记，不改阈值、不改组件、不加豁免。
   - W1 三包并行，彼此的改动不在对方包树里；读数以本包树为准，交回写明包树 HEAD。
6. **C-6 Owner 待裁项的默认口径（判断 §3.1，共 20 项）。** 未裁前不改判据、不改 Story：O-1 长字标截断加 title，宽度不改；O-2 148-GWT1 记部分；O-3 级联越界维持现写法；O-4 墨迹中线照 ±1 判，markText 红；O-5 只改件数、不画实心态；O-6 图钉获焦才显；O-7 文档站头像与目录宽 144 维持现状；O-8 夜间后缀两主题同色、标红、pending；O-9 AOS 占位并标明；O-10 头像菜单现写法；O-11 窄屏按视口切；O-12 下拉不显示 ⌘K；O-13 纸升起 10；O-14 字重按板实现；O-15 Sheet 夜间遮罩与下一级现写法；O-16 纸内页标题行高 30；O-17 TreeNav 归宿现写法；O-18 批末 verify 不加 test:dom（SUB-214、SUB-216 的 DOM 用例只由局部门看）；O-19 顶带 C8 照判，contract:static 红，登记保留，SUB-113、125、142、155、178、191 保持 active；O-20 Sheet 实现照板，Story 144 的文字不改。O-19 与 O-4 本轮不派任何改动。
7. **C-7 授权范围（判断 §3.3、§3.4）。** 授权外不做：放宽任何阈值（markText 照 ±1；C8 照判；不给 checkedBatches 里的家族加豁免；不撤顶带登记；smoke、browser-proof 的期望不放宽；不抬扫描上限；视觉签名的阈值、签名算法与选择机制不改）；改 ShellPins 在 0 项时的渲染；给板补数值，改 Shell 两板、07b 字句与画布画法（measure-shell.js 只镜像门库读法，本轮不改）；新增 token，改第一批品牌尺度 38、28，新增 type scale token；O-1、O-5、O-11 裁前的改动；改 ⌘K 提示的行为（判断 §3.4 第 4 条）；给 AOS 视觉实例改 id；改字典的 fr 值；改 Story 文字（O-14、O-20）；把壳层门覆盖面扩到 DS、Mana 标按钮；改批末 verify 的组成（O-18）；声明或绕过库门（S-1）；推送、打 tag、发版、部署、发布画布。本轮能改的门判定语义只限判断 §3.4 第 3 条，都不放宽：SUB-217（R4-5）的截法（扩大覆盖面）；SUB-219、SUB-220、SUB-222（R4-7 的 (b)(c)(e)(f)）的收紧与结构调整；SUB-213（R4-2）给探针加被测物；SUB-215（R4-4）只改归属。其余判定语义、阈值或比对字段的改动停下记问题。
8. **C-8 样式模块与段登记。** 沿用 R3 C-8：包样式只进现有模块；状态规则特异性不高于变体、不含颜色；几何逐值来自 token。本轮只有 SUB-216 改包样式（`base.css.ts`），没有包新建段，`styles/index.ts` 与段首标记不动。文档层样式（`alpha-styles.ts`、`story-demo-styles.ts`）只归 N3；`storybook.css` 的演示层只由 `demo-styles:sync` 再生，不手改。
9. **C-9 回执、门报告与生成物。** `docs/verification/**`（回执、视觉签名基线与截图、各门报告）只由 SUB-224（N5）提交；其它包跑了会写这些路径的门（geometry-measure、geometry:proof、storybook:visual-proof、internal-alpha 各步、scan 等），跑完 `git -C <包树> checkout -- docs/verification`，新出现的未跟踪文件移进会话 scratch 的 trash；`visual-selection-result.json` 永不入仓；`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。`owner-acceptance.md` 只由 SUB-224 改，各包把目视项与读数写进交回。
10. **C-10 文案与五语。** 本轮没有新文案：`components/Navigation/shell-copy.ts`、`storybook-content-text.ts`、`storybook-locale-text.ts`、`locale-invariant-ledger.mjs` 本轮无人改；SUB-220 只删 AOS 视觉实例里无人读的文案字段，不动字典。需要新键时停下，写进交回「待补五语键」。
11. **C-11 迁移说明与 CHANGELOG。** `docs/migration-4.0.md` 与 `CHANGELOG.md` 本轮只由 SUB-223（N4）改；收录包排在所有产出迁移条目的包之后（R3 主线程问题 M3：N4 的前置是 N1、N2、N3；N5 不产出条目）。条目从 M49 起追加；判断 §3.4 第 6 条只对两段放开「只追加」：开头（第 6–7 行的批次范围与第 24–29 行的来源说明）与「By consumer」三份清单；M1–M48 正文不动。产出变化的单在交回「迁移条目」写一段中文，写明名字与默认值：SUB-212、SUB-214（标按钮与登入动画的 data-logo 为标的 id，M42 末句不再成立）；SUB-216（展开区内层的块向末端留白，只在采用改版式的写法时）；SUB-222（弃用提示的跳过规则）；N3 的文档站变化合写一句包外变化（SUB-218、SUB-219、SUB-220）；没有就写无。
12. **C-12 本轮新接口（默认名；落地单要改名须写进交回，消费单以合入后的代码为准）。**

   | 接口 | 落地单 | 默认写法 | 消费单 |
   | --- | --- | --- | --- |
   | 标的 id 取法 | SUB-212 | `components/Navigation/product-mark-id.ts` 导出 `productMarkIdOf(productId)`，返回标的 id（logos2 文件名：tms、ds、mana、einzbern）；不从 `components/Navigation/index.ts` 与 `src/index.tsx` 导出 | SUB-214；`Navigation.tsx` 第 641、728 行 |
   | 真件纸内焦点探针 | SUB-213 | `STORY_PROBES` 加 `{ id: "paperFocusRing", storyId: "shell-top-band" }`，接 `focusRingClipInPage`，报告 `probes[]` 带 regions | 批末 verify 的 geometry:measure；SUB-224 |
   | 视觉签名截法 | SUB-217 | 截 story 时纸与主区高随内容、`overflow: visible`，顶带移出截图区，截完复原；门内自检高 story 的下半部不是整片画布底 | SUB-224（整批重收） |
   | 家族表补登 | SUB-215 | `families.json` 的 navigation、shell、inputs 三族 `blocks` 共加 9 个根类 | 批末 verify 的 contract:static |
   | 弃用提示的跳过规则 | SUB-222 | 只跳产物目录（按相对路径），`apps/storybook/src/build` 照扫 | storybook:build 打印的提示；SUB-223 |

13. **C-13 Owner 目视与待发布清单。** `owner-acceptance.md` 只由 SUB-224 改（C-9）。各包把新增或变化的目视项写进交回「目视项」：Disclosure 描边（SUB-216，G-18）、展开故事标题无左边条（SUB-218）；截法变更后的离群项由 SUB-224 自己列。待发布清单：本轮预计为无（measure-shell.js 不改、不新增 token）；出现时写进交回，交设计会话，本轮不发布画布。
14. **C-14 质量硬线与停下条件。** START「质量硬线」两段（第一批 C1–C17 与壳层新增硬线）对每个包有效。遇到下列情况停下写进包问题文件，不扩大授权：要新增 token；要改 Icon 组件 API；要改 C-7 列表以外的门判定语义、阈值或比对字段；要改不在本包文件集里的文件（含别的波次持有的共享文件）；要改 Shell 两块成品板或 07b 字句；要新增依赖或 package.json 脚本；要恢复已删的豁免；要动 C8 的登记、判定或组件的让步项（O-19）；要改 markText 的量法（O-4）。批内发现的新工作只记问题，进下一轮，不插入本轮。
15. **C-15 期望对齐（R2 主线程问题 M2）。** 改动会让某个门的期望过期的包，在同包里对齐那条期望：门脚本或测试在本包文件集里的，本单直接改，并在交回写明改了哪条；不在本包文件集的，按 `packages.md`「期望对齐的接收」交给该文件的下一个持有者，在交回「期望过期」一节逐条写明（文件、行、旧期望、新读数、来源 Subtask）。本轮的接收：视觉签名基线（SUB-216、SUB-217、SUB-218、SUB-219 让它过期）由 SUB-224 整批重收；`ShellBrandButton.test.tsx` 由 SUB-212、geometry-measure 测试由 SUB-213、contract-static 测试由 SUB-215、shell-fidelity 白名单与 style-scale 由 SUB-219、storybook-smoke 与 selection-grammar 由 SUB-220、弃用提示测试由 SUB-222 各自同单对齐；迁移说明、CHANGELOG 与 ui-react README 由 SUB-223 按各包交回收录。
16. **C-16 一次做对与升档。** 每张 Subtask 的判据最后一项是「一次做对的验收」：交回必须给出该项要求的实测读数（不是只说「门绿」）；读数与判据不符时不得交回为完成，写进问题文件并说明差在哪里；读法、阈值、期望值一律不为求绿而改。R4 的项再被退回时按 START「起始档与升档」：经济档升主力，主力档交 Owner（判断 §2 首段）。
17. **C-17 前置列只写包号（R2 主线程问题 M5）。** `packages.md` 包表的「前置包」列只写包号并逐个列出（N5 写 N1、N2、N3、N4），不写「其余全部」之类的文字，调度工具按包号判断就绪。

## 2. 总览

### 2.1 返工编号 → Subtask（9 条，一条不漏）

| R4 项 | Subtask | 包 / 波 | 父 Story |
| --- | --- | --- | --- |
| R4-1 | TCRN-DS-SUB-212、TCRN-DS-SUB-214 | N1 / W1 | 136、141 |
| R4-2 | TCRN-DS-SUB-213 | N1 / W1 | 140 |
| R4-3 | TCRN-DS-SUB-216 | N1 / W1 | 146 |
| R4-4 | TCRN-DS-SUB-215 | N2 / W1 | 143 |
| R4-5 | TCRN-DS-SUB-217 | N2 / W1 | 147 |
| R4-6 | TCRN-DS-SUB-218 | N3 / W1 | 147 |
| R4-7 | TCRN-DS-SUB-219、TCRN-DS-SUB-220、TCRN-DS-SUB-222 | N3 / W1 | 147、150 |
| R4-8 | TCRN-DS-SUB-221、TCRN-DS-SUB-223 | N4 / W2 | 148、150 |
| R4-9 | TCRN-DS-SUB-224 | N5 / W3 | 150 |

注：R4-1 按 Story 拆成标按钮与共用模块（136）、登入动画（141）；R4-7 拆成 (a)(b)、(c)(d)(e)（147）与 (f)（150）；R4-8 拆成 (a)（148）与 (b)(c)(d)（150）。理由见第 2.4 节。

### 2.2 Story → Subtask

| Story | Subtask |
| --- | --- |
| 136 | TCRN-DS-SUB-212（N1） |
| 140 | TCRN-DS-SUB-213（N1） |
| 141 | TCRN-DS-SUB-214（N1） |
| 143 | TCRN-DS-SUB-215（N2） |
| 146 | TCRN-DS-SUB-216（N1） |
| 147 | TCRN-DS-SUB-217（N2）、TCRN-DS-SUB-218（N3）、TCRN-DS-SUB-219（N3）、TCRN-DS-SUB-220（N3） |
| 148 | TCRN-DS-SUB-221（N4） |
| 150 | TCRN-DS-SUB-222（N3）、TCRN-DS-SUB-223（N4）、TCRN-DS-SUB-224（N5） |

135、149 只等 Owner（O-19、O-4），137、138、139、142、144 没有 R4 返工项（判断 §1 结论表）；145 的两处可返工项由 SUB-212（同一属性只有一种取值）与 SUB-221（两主题同色的机读件）承接，没有直接挂单（问题文件第 5 条）。

### 2.3 依赖图

```
W1  N1: SUB-212 → SUB-214 → SUB-216 → SUB-213（硬依赖只有 SUB-214 ← SUB-212 的共用模块；其余是包内顺序：先改包件，再在同一次构建上跑真件探针）
    N2: SUB-215 → SUB-217（互不依赖）
    N3: SUB-218 → SUB-219 → SUB-220 → SUB-222（硬依赖只有 SUB-219 ← SUB-218，同改 alpha-styles.ts）
W2  N4: SUB-221；SUB-223 ← N1（SUB-212、SUB-213、SUB-214、SUB-216）、N2（SUB-215、SUB-217）、N3（SUB-218、SUB-219、SUB-220、SUB-222）的迁移条目
W3  N5: SUB-224 ← SUB-213（N1 末张）、SUB-217（N2 末张）、SUB-222（N3 末张）、SUB-223（N4 末张）
```

关键路径同判断 §5：N2 → N4 → N5。

### 2.4 拆分取舍（与判断 §5 的关系）

包的组成、档位、波次与前置全部照判断 §5，只把包名 M1…M5 改为 N1…N5。拆分的取舍有四处，都不改调度：

1. **R4-1 拆两张（136、141）。** 判断 R4-1 的 Story 行列了 136-GWT2、141-GWT4 与 145 符合性：标按钮与共用模块挂 136（SUB-212），登入动画挂 141（SUB-214，依赖 SUB-212 的共用模块）；145 的「同一属性只有一种取值」写进 SUB-212 的判据。
2. **R4-7 拆三张（147 两张、150 一张）。** (a)(b) 按判断同一提交删（SUB-219，与 SUB-218 同改 alpha-styles.ts，包内在后）；(c)(d)(e) 是三处门与视觉实例的过期口径（SUB-220）；(f) 属 150「构建弃用提示的覆盖面」（SUB-222）。
3. **R4-8 拆两张（148、150）。** (a) 映射机读件挂 148（SUB-221；145 的两主题同色机读件写进判据）；(b)(c)(d) 与 CHANGELOG 挂 150（SUB-223）。145 本轮因此没有直接挂单（问题文件第 5 条）。
4. **N1 包内先改包件再跑探针。** SUB-212 → SUB-214 → SUB-216 先改 ui-react 并跑单测，SUB-213 最后在包件定稿后的同一次 storybook:build 上跑真件探针。N3 把 (e) 排在 (a)(b) 之后，删掉的死规则不会作为 selection-grammar 的发现出现。

### 2.5 风险

- **R4-5 让 browser-proof 的时长与回执体积上升**（判断 §5）：SUB-217 包内先量，六份回执都守住 1,000,000 字节（KB-028）；改用分段截取拼接时时长再上升，交回写明。
- **R4-7 (e)(f) 可能跑出新发现**：只记，交 R4 判断；selection-grammar 的新发现会让批末 verify 的 tokens:proof 红（C-5，问题文件第 7、8 条）。
- **R4-9 重收会有新的 A 类离群**：进目视（判断 §5）；上一份应用记录改名要避开现有文件名（问题文件第 10 条）。
- **R4-3 找不到合适的现有 token 就停下记问题**；padding 方案会让收起态多出留白，clip 加 clip-margin 才不改展开动画几何（问题文件第 6 条）。
- **R4-2 的真件读数可能为 0 或判红**：探针的 story 不在 G+ 集合里，要单独解析路由、展开并等水合（问题文件第 2 条）；读不到就记问题，不改阈值。
- **R4-4 的归属变化可能带出新发现**：9 个类进已检查批次的家族后，按家族分档的条款（如 C7 的 title 口径）对它们改按已检查口径查；出现就逐条记问题。
- **O-19、O-4 不裁时 R4 全绿也停在 verify 第 13、18 步**（判断 §5），届时 R4 判断应写「R5 无返工、建议收口」。
- **规模**：实施 435 响应（判断 §5 表逐行相加：N1 90、N2 100、N3 85、N4 50、N5 110），加拆分约 60、验收约 300、判断约 100，整轮约 900。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-136 · 标按钮 ShellBrandButton：第一版纯标 / 第二版锁定块首行与标垂直居中，20 格展开收起示意，无轮廓，hover / open 3.5% 墨洗，aria-expanded 与 aria-haspopup

1 张：TCRN-DS-SUB-212（父单 work:73563c973ba4945683fbb15f）

#### TCRN-DS-SUB-212 · 标按钮的 data-logo 写标的 id：productMarkIdOf 抽到 Navigation 目录内的共用模块，ShellBrandButton 改用它，SVG 仍按产品键取源

- 承接：R4-1（新；经济）的标按钮与共用模块部分；来源 A3-1、B3-1、M4 问题 4、owner-acceptance G-20
- 包 / 波：N1 / W1（经济）；包内第 1 张（TCRN-DS-SUB-212 → TCRN-DS-SUB-214 → TCRN-DS-SUB-216 → TCRN-DS-SUB-213）
- 改动文件：`packages/ui-react/src/components/Navigation/product-mark-id.ts`（新建，默认名），`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`
- 依赖：无
- 判据：136-GWT2 与硬线「品牌资产 digest」、145 符合性（同一属性只有一种取值）：① `Navigation.tsx:343` 的模块内函数 `productMarkIdOf`（连同它按产品键找标的那一步）移到新模块 `product-mark-id.ts`（默认名，改名写进交回），`Navigation.tsx` 第 641、728 行改为从新模块导入，读数不变；新模块不从 `components/Navigation/index.ts` 与 `src/index.tsx` 导出，导出面不变。② `ShellBrandButton.tsx:84` 的 `data-logo={productId}` 改为 `productMarkIdOf(productId)`；`TcrnBrandMark` 仍收 `productId`（SVG 按产品键取源）。四个产品的读数：tms→tms、design-system→ds、mana-orchestrate→mana、einzbern→einzbern。③ `ShellBrandButton.test.tsx:79` 的正则改按 `mark.id` 断言，四个产品逐个过、SVG 主体仍与 `logos2/<mark.id>.svg` 同；同文件加一例：每个产品的标按钮与 `ProductLockup` 首行（`firstLine`）写的 data-logo 相同。④ 一次做对的验收（交回给实测读数）：storybook:build 后，构建页里 `data-logo="design-system"` 与 `data-logo="mana-orchestrate"` 各 0 处（改前文档壳标按钮写 design-system，验收 B §3 B3-1），文档壳标按钮与同页首行都写 `ds`；ui-react 单测、typecheck、exports:check 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：N1 的第 1 张。壳层门覆盖不扩：不把 DS、Mana 标按钮加进 brandDigest 的被测屏，壳层门读法余项也不在本轮（判断 §3.2）。拆分已 grep 全仓 data-logo 的消费者：产品键与标 id 只在 DS、Mana 两处不同，`smoke.test.ts:2010`、`matrix-stories.tsx:663`、`shell-intro.dom.spec.tsx:234/249` 与壳层门夹具写的都是 `tms`，不受影响；`brand-asset-source-proof.mjs:143` 只读 `ProductLockup` 首行，`geometry-proof.mjs:145/161` 只按选择器取元素，都不读标按钮的取值，没有别的门期望过期。迁移条目：标按钮与登入动画的 data-logo 也是标的 id，M42 末句不再成立（M42 正文不动），写进交回「迁移条目」，由 SUB-223 追加。

### TCRN-DS-STORY-140 · ProductShell 顶带态：移除 sidebar 布局与钉住态，顶带 52 画布色无底无线、纸离边 12 顶 52 圆角 14 s1，固定项为每用户每产品的服务端偏好（可钉分组、项、子菜单，上限 6，可拖排），切换产品进头像菜单

1 张：TCRN-DS-SUB-213（父单 work:e14a7f089a9cac4c7da39d52）

#### TCRN-DS-SUB-213 · focusRingClipInPage 在真件上读到纸内滚动区：STORY_PROBES 加带 ProductShell 的 shell-top-band，判定与阈值不变

- 承接：R4-2（新；经济）；来源 A3-2、M3 问题 6
- 包 / 波：N1 / W1（经济）；包内第 4 张（TCRN-DS-SUB-212 → TCRN-DS-SUB-214 → TCRN-DS-SUB-216 → TCRN-DS-SUB-213）
- 改动文件：`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/manifest.json`（按需）
- 依赖：无
- 判据：140（SUB-182 判据③的真件读数；硬线「焦点可见」）：① `STORY_PROBES`（第 138 行一带）加一项，默认 `{ id: "paperFocusRing", storyId: "shell-top-band", source: "140 SUB-182" }`（id 可改名，写进交回），`PAGE_PROBES`（第 356 行）把它接到 `focusRingClipInPage`。story id 已由拆分 grep 核实：`shell-top-band`（`governance.ts:121`、`story-content.tsx:2359`），默认屏 ts-closed-l 在 `shell-hydrate.tsx:135`。② 该 story 不在 `GPLUS_STORY_IDS` 里，全量运行的 `ids`（第 470–479、506 行）不含它：照第 548 行 `mutationRoutes` 的写法为探针单独解析路由，只改本文件，不改共享的 `scripts/lib/storybook-routes.mjs`；读之前展开该 story（`expandStory`），并等它的 `[data-shell-hydrate]` 块写出 `data-shell-hydrated`。③ 判定与阈值（`tolerancePx` 0.5、violations 计数）不变，`buttonGroupFocusRing` 照旧在 actions-matrix 上跑。④ `tests/geometry-measure-proof.test.mjs` 第 511 行的探针 id 清单加新 id；真件全量运行的断言（第 658 行一带）对新探针要求 status 为 pass 且 `regions ≥ 1`。⑤ 一次做对的验收：交回给真件读数（新探针的 checked、regions、violationCount）；regions 为 0 或判红，写进问题文件并写明差在哪里，不改阈值、不改判定。跑完按 C-9 还原 `docs/verification`。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
- 注意：N1 的末张：在 SUB-212、SUB-214、SUB-216 的包件改动之后，用同一次 storybook:build 跑真件。不跑完整 geometry:measure（其中壳层门的 markText 是已知红，待 O-4）。判断认定 SUB-182 的判据③字面已满足，本条是新的覆盖面目标，不按「同一目标」交 Owner。没有迁移条目。

### TCRN-DS-STORY-141 · 登入动画 ShellIntro：登入成功后播一次，登入卡第三版（标 128）收敛为顶带第二版（标 22），120 淡出 + 240 位移 + 100 纸升起 ≤ 700，只用 transform 与 opacity，刷新不重播，prefers-reduced-motion 下 0 次

1 张：TCRN-DS-SUB-214（父单 work:e2def1cb6cee96bcde0ea937）

#### TCRN-DS-SUB-214 · 登入动画飞行标的 data-logo 写标的 id：ShellIntro 改用共用模块，单测加 DS、Mana 两例

- 承接：R4-1（新；经济）的登入动画部分；来源 A3-1、B3-1、M4 问题 4、owner-acceptance G-20
- 包 / 波：N1 / W1（经济）；包内第 2 张（TCRN-DS-SUB-212 → TCRN-DS-SUB-214 → TCRN-DS-SUB-216 → TCRN-DS-SUB-213）
- 改动文件：`packages/ui-react/src/components/Navigation/ShellIntro.tsx`，`packages/ui-react/src/components/Navigation/ShellIntro.test.tsx`，`packages/ui-react/src/test/shell-intro.dom.spec.tsx`（按需）
- 依赖：TCRN-DS-SUB-212（N1 包内靠前）
- 判据：141-GWT4、145 符合性：① `ShellIntro.tsx:336` 的 `data-logo={productId}` 改为 `productMarkIdOf(productId)`（从 SUB-212 的共用模块导入），`TcrnBrandMark` 仍收 `productId`；第 161、212 行按 `svg[data-logo]` 取元素的选择器不变。② 单测加 DS、Mana 两例：飞行标的 data-logo 分别为 `ds`、`mana`，SVG 主体与 `logos2/<标 id>.svg` 相同。飞行标只在 playing 态渲染，SSR 单测读不到时，两例写进 `src/test/shell-intro.dom.spec.tsx`（与第 234、249 行的 tms 用例同写法）。③ 一次做对的验收：交回写明两例在改前代码上的读数（design-system、mana-orchestrate）与改后读数；ui-react 单测与 test:dom 退出 0，条数比改前多 2（写明落在哪个文件）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
- 注意：O-18 未裁，test:dom 不在批末 verify 里，DOM 用例只由本包局部门看，交回给条数。目视项「登入动画」不变。迁移条目随 SUB-212 一并写。

### TCRN-DS-STORY-143 · 导航家族焕新：NavGroup 与 TreeNav 进完整菜单与下拉，Breadcrumb 进 PageHeader，Tabs 合一（Tabs / SectionTabs / ModuleTabs / ViewTabs / SegmentedNav 归一个家族），TocRail 与书签栏作为页内空间，SideNav、SideNavCollapseButton、TopBar、ProductSwitcher、ProductLauncher 经弃用期退役

1 张：TCRN-DS-SUB-215（父单 work:1b03f6ae2b1a9e080fde1432）

#### TCRN-DS-SUB-215 · families.json 补登本 INIT 新增的 9 个根类：导航 2、壳层 5、表单控件 2，测试把顶带的容器、让步项与固定项都钉在 shell 族

- 承接：R4-4（新；主力）；来源 B3-2、M2 问题 3、B §5 M2-5 的条件
- 包 / 波：N2 / W1（主力）；包内第 1 张（TCRN-DS-SUB-215 → TCRN-DS-SUB-217）
- 改动文件：`docs/contract/families.json`，`tests/contract-static-proof.test.mjs`
- 依赖：无
- 判据：143 符合性（C1–C17 的家族表完整）、140：① 9 个类登进所属族的 `blocks`：navigation 加 `tcrn-nav-item-row`、`tcrn-nav-pin`；shell 加 `tcrn-shell-cluster`、`tcrn-shell-account`、`tcrn-shell-avatar`、`tcrn-shell-bell`、`tcrn-shell-sheet`；inputs 加 `tcrn-date-picker-wrap`、`tcrn-select-wrap`（只登记，不改组件）；`components`、`batch` 与 `scope.checkedBatches` 不动。② `tests/contract-static-proof.test.mjs` 第 580–583 行一带「容器与让步项在 shell 族」的断言扩到 `toolbar.fixed`（`tcrn-shell-brand`、`tcrn-shell-cluster`）；「一个类只属一个族」照旧过。③ 一次做对的验收（交回给改前改后对照，改前先跑一次存读数）：contract:static 的发现仍只有 C8 15 条（静态 `yield-without-min-width` 1、story 层 `story-yield-missing` 14），其余条款 0；这 9 个类在报告里的归属由 `unattributed` 变为所属族（逐类写）；按家族的计数写进交回；contract-static 测试、contract:proof、doc-shell:proof 退出 0。出现新发现就逐条记问题，不改组件、不加豁免、不动 `roles.json` 与 `exemptions.json`。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 注意：N2 的第 1 张。O-19 未裁：C8 的登记、判定与豁免都不动（判断 §3.1.1），contract-static-proof.mjs 退出 1 只因 C8，属已知红（C-5）。契约 README 与 clauses.md 写的是「16 个家族」，家族数不变，不改。没有迁移条目。

### TCRN-DS-STORY-146 · PageHeader 必有（面包屑 + 标题 + 动作，单行截断加 title）；Surface、Divider、SplitView、DetailLayout、SettingsLayout 在纸内重排；文档与设置页内容居中 1040

1 张：TCRN-DS-SUB-216（父单 work:792b63bc73100197f6f41e96）

#### TCRN-DS-SUB-216 · Disclosure 展开区按钮的底边描边不被裁：collapsible-region 内层在块向末端留出描边宽度，取不改展开动画几何的写法

- 承接：R4-3（新；经济；硬线）；来源 C3-5、M11 问题 2、owner-acceptance G-18
- 包 / 波：N1 / W1（经济）；包内第 3 张（TCRN-DS-SUB-212 → TCRN-DS-SUB-214 → TCRN-DS-SUB-216 → TCRN-DS-SUB-213）
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Layout/Layout.test.tsx`
- 依赖：无
- 判据：146 硬线「任何元素不超出裁切祖先」（layout 族在纸内的几何）：① `base.css.ts` 第 2396 行一带的 `.tcrn-collapsible-region__inner`（判断写 2393–2396；现为 `min-height: 0; overflow: hidden`，块向末端无内距）在块向末端留出不小于按钮描边（`0 0 0 1px` 外扩）的空间，二选一：现有 token 的 `padding-block-end`，或 `overflow: clip` 加 `overflow-clip-margin`（值也取现有 token）；取不改展开动画几何的那一种：收起态区域高仍为 0，`grid-template-rows` 的过渡不变。交回写明选了哪种、为什么，以及收起与展开两态的区域高读数。② 按钮描边画法不改；没有合适的现有 token 就停下记问题，不新增 token（C-2）。③ `Layout.test.tsx` 现有 collapsible region 用例旁加一例，断言内层规则的块向末端留白（读样式模块文本或计算样式）；去掉留白时该例判红。④ 一次做对的验收：ui-react 单测、test:dom、typecheck、tokens:proof、contract:proof 退出 0，contract:static 的发现仍只有 C8 15 条（O-19）；可选在会话 scratch 用一次性探针（不进仓）读 `interaction-disclosure-spec` 展开后次级按钮「Focusable only while expanded」底边描边在 1440、1024、390 三视口的读数，读了就写进交回。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
- 注意：几何门不改。可见变化：视觉签名由 SUB-224 重收，目视项「Disclosure 描边（G-18）」写进交回。layout 族属第 2 批（已全量检查），不加豁免。候选 token：`--tcrn-space-0h`（2px），用前核对语义；padding 方案在 `grid-template-rows: 0fr` 下内距仍占高，收起态会多出留白（见问题文件第 6 条）。迁移条目：采用改版式的写法时写进交回。

### TCRN-DS-STORY-147 · Storybook 文档站改同一套顶带壳：文档壳只用包的 ProductShell 顶带态，删 tcrn-doc- 骨架的壳层部分、4 条文档作用域例外与 2 条重复选择器白名单项，文档目录改页内 TocRail，包外 tcrn- 类保持 0

4 张：TCRN-DS-SUB-217、TCRN-DS-SUB-218、TCRN-DS-SUB-219、TCRN-DS-SUB-220（父单 work:6fd15b4e5366871194d862ab）

#### TCRN-DS-SUB-217 · 视觉签名截图不受纸的滚动裁切：截图期间被截 story 不受纸裁、顶带移出截图区，截完复原并断言，门内自检高 story 的下半部不是整片画布底

- 承接：R4-5（新；主力；门的截法，属收紧）；来源 C3-2、M11 问题 1、owner-acceptance G-17
- 包 / 波：N2 / W1（主力）；包内第 2 张（TCRN-DS-SUB-215 → TCRN-DS-SUB-217）
- 改动文件：`scripts/internal-alpha-browser-proof.mjs`，`scripts/lib/visual-signature.mjs`（按需）
- 依赖：无
- 判据：147（视觉签名的覆盖面）、150（SUB-211 基线的代表性）：① 第 1288 行一带 story 截图（`captureWithSignature(locator, …)`，定义在第 928 行）之前，临时把文档壳的纸与主区改为高度随内容、`overflow: visible`，把顶带移出截图区；截完复原，并断言内联样式与滚动位置（主区与窗口）逐项复原，复原不了判红。② 若因此改变了 story 的版式宽度（截前后 story 盒宽不等），改用纸内分段滚动截取再拼接；交回写明用了哪种、为什么。③ 阈值、签名算法（`SIGNATURE_TOLERANCE`、`computeSignature`）与选择机制（`--update-visual-baseline`、`validateBaselineSelection`）不改。④ 门内自检（本仓没有 browser-proof 的独立测试文件）：story 高于纸可见高时，截图下半部不得是整片画布底，违反判红并写进回执；自检在旧截法上判红（交回写明怎么验的）。⑤ 一次做对的验收，交回给读数：高于 900 的桌面截图数（改前 44）与自检通过数；`desktop-1440x900-i18n-theme-contract.png` 改前 1040×1807、上下各约 450–490 为空，改后的尺寸与空白读数；整次运行时长改前改后；六份回执的字节（都小于 1,000,000，KB-028）；nonVisualProofOk 为真。视觉签名越容差属预期（C-5 过渡红），本单不重收基线。跑完按 C-9 还原 `docs/verification`。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：N2 的末张。截法变更属判断 §3.4 第 3 条的收紧（扩大覆盖面）。截图输入摘要（第 896 行一带）含本脚本与 `visual-signature.mjs`，本单改后旧基线的输入摘要必然失配，由 SUB-224 一次重收；R4-9 依赖本条。没有迁移条目。

#### TCRN-DS-SUB-218 · 文档页展开故事标题删 3px 强调色左边条：去掉 inset box-shadow 与随它加的 padding-left，展开态只由 chevron 旋转表达

- 承接：R4-6（新；改动属经济级，随 N3 主力包；硬线）；来源 C3-1、M8 问题 3
- 包 / 波：N3 / W1（主力）；包内第 1 张（TCRN-DS-SUB-218 → TCRN-DS-SUB-219 → TCRN-DS-SUB-220 → TCRN-DS-SUB-222）
- 改动文件：`apps/storybook/src/alpha-styles.ts`
- 依赖：无
- 判据：147（START 硬线禁用清单「左边条」）：① `alpha-styles.ts` 第 235–238 行一带（判断写 237–240）`article[data-story-collapsed="false"] > .tcrn-doc-story-disclosure__heading` 的 `box-shadow: inset 3px 0 0 var(--tcrn-color-acc)` 与 `padding-left` 删掉，规则空了就整条删；chevron 旋转（第 230 行一带 `rotate(90deg)`）不动。② 一次做对的验收：grep `alpha-styles.ts` 的 `inset 3px` 为 0；storybook:build 后任一文档页展开一个 story，标题的计算 box-shadow 为 none、padding-left 与收起时相同（交回给读数，可在会话 scratch 用一次性探针读，不进仓）；tokens:proof（含 selection-grammar 与 demo-styles --check）、doc-shell:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 注意：N3 的第 1 张，与 SUB-219 同改 `alpha-styles.ts`（包内先做）。可见变化：视觉签名由 SUB-224 重收，目视项「展开故事标题无左边条」写进交回。迁移条目：与 SUB-219、SUB-220 合写一句文档站的包外变化。

#### TCRN-DS-SUB-219 · 删文档层 6 个无写入处的类与随之无用的 fidelity 白名单项：eyebrow、claim、doc-brand 连同两条放置规则、search-results/-result/-empty，style-scale 同步

- 承接：R4-7 (a)(b)（新；主力）；来源 C3-6（M8 问题 1、2，M9 问题 5，M6 问题 5）、M8 问题 4、5
- 包 / 波：N3 / W1（主力）；包内第 2 张（TCRN-DS-SUB-218 → TCRN-DS-SUB-219 → TCRN-DS-SUB-220 → TCRN-DS-SUB-222）
- 改动文件：`apps/storybook/src/alpha-styles.ts`，`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/storybook.css`，`scripts/shell-fidelity-proof.mjs`，`docs/style-scale.md`，`docs/design/gplus-2026-10/doc-class-map.json`（按需）
- 依赖：TCRN-DS-SUB-218（N3 包内靠前）
- 判据：147（「删 tcrn-doc- 骨架的壳层部分」的余项）：① (a) 同一提交删：`alpha-styles.ts` 第 166 行 `.tcrn-doc-eyebrow`、第 182 行 `.tcrn-doc-claim`；`story-demo-styles.ts` 第 563–605 行一带 `.tcrn-doc-brand` 连同两条放置规则（`.tcrn-doc-brand .tcrn-shell-brand-lockup__copy` 与 `__caption`）、第 606–645 行一带 `.tcrn-doc-search-results`、`-result`、`-empty`；`storybook.css` 是生成副本，按 build、`demo-styles:sync`、build 再生（KB-019），不手改。只删与这 6 个类名完全相等的选择器：`.tcrn-doc-brand-system*`、`.tcrn-doc-brand-lockups` 仍有写入处（`story-content.tsx:829–841`），不动。② (b) `shell-fidelity-proof.mjs` 的重复选择器白名单：第 102、103、107、108、115 行五项（无规则以它为主题）与 (a) 删后失去最后一条文档规则的项一并删，第 110–113 行注释改为现行说法（不再写已退役的类）；删后白名单每一项都至少有一条文档层规则以它为主题（交回逐项列）。③ `docs/style-scale.md` 第 249–253 行的白名单清单与脚本一致。④ 一次做对的验收：删前 grep 全仓消费者（KB-015、KB-027；拆分已 grep：这 6 个类在 dist、storybook-static、`docs/verification`、`docs/dispatch` 之外只剩定义处、`storybook.css` 副本与 fidelity 注释第 111 行），删后同一 grep 为 0；demo-styles-sync --check（在 tokens:proof 里）、shell:fidelity、doc-shell:proof 退出 0；storybook:build 通过。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
- 注意：grep 时排除 dist 与生成产物；`doc-class-map.json` 只在 doc-shell:proof 要求时改。N3 合入前主线程在集成树上只读复跑 `demo-styles-sync --check`（判断 §3.4 第 8 条）。迁移条目：与 SUB-218、SUB-220 合写一句文档站的包外变化。

#### TCRN-DS-SUB-220 · 文档层门的过期口径：smoke 删退役侧栏与切换钮的空读回，AOS 视觉实例删无人读的文案字段，selection-grammar 禁形补 G+ 名并自检

- 承接：R4-7 (c)(d)(e)（新；主力）；来源 C3-6（M8 问题 1、2，M9 问题 5，M6 问题 5）、M8 问题 4、5
- 包 / 波：N3 / W1（主力）；包内第 3 张（TCRN-DS-SUB-218 → TCRN-DS-SUB-219 → TCRN-DS-SUB-220 → TCRN-DS-SUB-222）
- 改动文件：`scripts/storybook-smoke.mjs`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`scripts/selection-grammar-proof.mjs`
- 依赖：无
- 判据：147（文档层的门）：① (c) `storybook-smoke.mjs` 约第 1782、2392 行（以 grep 为准：退役侧栏区与 `.tcrn-shell-side-nav-toggle__icon`、`[data-side-nav-icon]` 切换钮的读回）读回恒空、不判红：删掉空读回，或改为「已退役件不存在」的反向断言（选哪种写进交回）；改后 storybook:smoke 退出 0。② (d) 两份 AOS 视觉实例（`routeLabels` 一带）里无人读的文案字段（判断：`searchLabel` 等 5 个；拆分 grep 到 `searchLabel`、`searchPlaceholder`、`searchResultsLabel`、`emptyLabel` 只有定义处，第 5 个以 grep 为准）在 zh-CN 与 en 两块都删；删前逐个 grep 全仓确认无读取（KB-015、KB-027）；不改 story id（判断 §3.3）。③ (e) `selection-grammar-proof.mjs` 第 66–67 行两条禁形（`brand-colour`、`elevation-lift`）补 G+ 名（`--tcrn-color-acc`、`--tcrn-color-acc-2`、`--tcrn-shadow-s3`），第 151 行语法文字改用 G+ 名；脚本内自检补一例：用 G+ 名写的选中态必须判红（照第 145 行一带 `tabs-check-cannot-fail` 的写法）。④ 一次做对的验收：storybook:smoke 与 typecheck 退出 0；selection-grammar 的读数（sourcesScanned、selectionRulesScanned、findings）交回改前改后对照，自检的 G+ 例判红；(e) 跑出的新发现逐条记问题（文件、行、选择器、禁形），不改组件、不放宽、不加例外。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
- 注意：(e) 排在 SUB-219 删死规则之后跑，删掉的规则不会作为发现出现。selection-grammar 的 SOURCES 含包件样式模块（第 36–39 行），G+ 禁形可能在包件里跑出新发现：只记，交判断（C-5）；它在 tokens:proof 末段，新发现会让批末 verify 的 tokens:proof 红，属预期。迁移条目：与 SUB-218、SUB-219 合写一句文档站的包外变化。

### TCRN-DS-STORY-148 · 第一批五样板换新壳：Typography、Icon、Actions、Inputs、Brand 的组合样板按顶带壳重渲染，补入成品画布各板 D 段；storybook-map 与 shellFrame 门改为顶带几何；矩阵 story 保持逐格一致

1 张：TCRN-DS-SUB-221（父单 work:bad748579e7b1b7f0773bd53）

#### TCRN-DS-SUB-221 · storybook-map.json 与 md 同步：O-3 写已撤回，SHELL-D2 与 SHELL-D7 进 refs，DIFF-10 改现行，机读件写两主题同色

- 承接：R4-8 (a)（新；经济）；来源 C3-3、M10 问题 1
- 包 / 波：N4 / W2（经济）；包内第 1 张（TCRN-DS-SUB-221 → TCRN-DS-SUB-223）
- 改动文件：`docs/design/gplus-2026-10/storybook-map.json`
- 依赖：无
- 判据：148（映射两份同源）、145（两主题同色的机读件）：① 把 `storybook-map.md` 第 33（O-3 已撤回）、36（SHELL-D2）、38（SHELL-D7）、138（DIFF-10）行原样搬进 json：`refs.O-3` 改为已撤回的现行说法，`refs` 加 `SHELL-D2`、`SHELL-D7`，`differences` 里 DIFF-10 的各字段与 md 第 138 行一致；md 不改。② 一次做对的验收：json 能解析；storybook:visual-proof（先跑 `tests/storybook-visual-proof.test.mjs`）退出 0，报告的 `differencesPendingOwner` id 列表与改前相同（它由 `differences[].status` 是否含「待 Owner 裁定」算出），没有 `difference_ref_unknown`；改后 json 不再把 `#7aa0f5` 写成现行值（交回给 grep 读数）。跑完按 C-9 还原 `docs/verification`。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注意：N4 的第 1 张。md 第 3 行写「两份同源」，同步后成立，md 不改。`tests/geometry-measure-proof.test.mjs:451` 也读本 json（只读 rows），本单不改 rows。没有迁移条目。

### TCRN-DS-STORY-150 · 4.0.0 候选：版本面、CHANGELOG 发布段、消费方迁移说明（第一批破坏性变化 + 壳层退役项）、pack 冒烟、Storybook 构建、Owner 目视验收清单（第一批与第二批合一）

3 张：TCRN-DS-SUB-222、TCRN-DS-SUB-223、TCRN-DS-SUB-224（父单 work:b140305693da159bfdc615c8）

#### TCRN-DS-SUB-222 · 构建弃用提示只跳产物目录：token-deprecation-notice 按相对路径跳过构建产物，源码目录 apps/storybook/src/build 照扫，测试补样本

- 承接：R4-7 (f)（新；主力）；来源 C3-6、M8 问题 4、5
- 包 / 波：N3 / W1（主力）；包内第 4 张（TCRN-DS-SUB-218 → TCRN-DS-SUB-219 → TCRN-DS-SUB-220 → TCRN-DS-SUB-222）
- 改动文件：`scripts/token-deprecation-notice.mjs`，`tests/token-deprecation-notice.test.mjs`
- 依赖：无
- 判据：150（构建弃用提示的覆盖面）：① 第 28 行 `SKIPPED_DIRECTORIES` 按目录名跳过 `build`，把源码目录 `apps/storybook/src/build` 一起跳过：改为只跳产物目录，按相对路径判定（`node_modules`、`.git`、`dist`、`coverage`、`storybook-static`、`storybook-preview-static`、`.next`、`.turbo` 照跳），交回写明判定规则。② `tests/token-deprecation-notice.test.mjs` 补一例：某根下 `src/build/x.ts` 里的旧名被扫到并计数，同根顶层的 `build/` 产物仍跳过；旧规则下该例判红。③ 一次做对的验收：token-deprecation-notice 测试退出 0；storybook:build 打印的弃用提示改前改后的名数与处数写进交回（改前 0）；`src/build/*.ts` 里新出现的条目逐条记问题，不改那些文件、不放宽。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注意：N3 的末张。构建只打印提示、不因提示失败（`apps/storybook/src/build.tsx` 第 23–32 行），没有门断言提示为 0，新条目不会让门红。脚本头注释写明消费方可以对自己的树调用它，跳过规则的变化对消费方可见：写一条迁移条目进交回，由 SUB-223 决定收录。

#### TCRN-DS-SUB-223 · ui-react README 图标件数改 38，迁移说明开头与三份分消费方清单跟上第二至四轮，从 M49 起追加 R4 各包的迁移条目，CHANGELOG 摘要同步

- 承接：R4-8 (b)(c)(d)（新；经济）；来源 B3-3、C3-4、M10 问题 4、M8 问题 6、owner-acceptance G-21；判断 §3.4 第 4、7 条的两句说明
- 包 / 波：N4 / W2（经济）；包内第 2 张（TCRN-DS-SUB-221 → TCRN-DS-SUB-223）
- 改动文件：`packages/ui-react/README.md`，`docs/migration-4.0.md`，`CHANGELOG.md`
- 依赖：TCRN-DS-SUB-212（N1）、TCRN-DS-SUB-213（N1）、TCRN-DS-SUB-214（N1）、TCRN-DS-SUB-216（N1）、TCRN-DS-SUB-215（N2）、TCRN-DS-SUB-217（N2）、TCRN-DS-SUB-218（N3）、TCRN-DS-SUB-219（N3）、TCRN-DS-SUB-220（N3）、TCRN-DS-SUB-222（N3）
- 判据：150-GWT2（迁移说明好用）、145：① (b) README 第 267、272 行「37」改 38（与名册 38 一致），同段「28 existing and 9 added」按名册改，并指向迁移说明 M25。② (c) 按判断 §3.4 第 6 条只对两段放开「只追加」：开头第 6–7 行改为第二批 M20 起至本轮末号；第 24–29 行来源说明补 INIT-016 的 `runs/r2/handoff/`、`runs/r3/handoff/`、`runs/r4/handoff/`；「By consumer」三份清单（TCRN AOS 第 33 行起、TCRN TMS 第 76 行起、Einzbern portal 第 106 行起）按条补 M29 以后的步骤（landmarkLabel 与 menuShortcut、按 data-logo 选标、TocRail headingLevel、AI 契约改名 M47 等）；M1–M48 正文不动。③ (d) 从 M49 起追加 R4 各包交回「迁移条目」：至少一条写标按钮与登入动画的 data-logo 为标的 id，并写明它取代 M42 末句；其余按 N1、N2、N3 交回收录。另加两句：AOS 视觉实例 id 里的 expanded 是历史名；`menuShortcut={false}` 的壳仍按板画快捷键提示（README 壳控制段第 331 行一带同写）。④ CHANGELOG 4.0.0 段的迁移摘要（第 52 行一带列到 M48）同步列出 M49 起各条；迁移说明末尾的来源说明（第 1347–1352 行一带）同步。⑤ 一次做对的验收：交回逐条对照 N1、N2、N3 交回的迁移条目（收录或不收的理由）；scaffold:proof、readme:proof、scan、internal-vocab:scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：N4 的末张。迁移说明与 CHANGELOG 本轮只由本单改（C-11，判断 §3.4 第 6、8 条），收录包排在所有产出迁移条目的包之后（R3 主线程问题 M3）。⌘K 提示保持现状（判断 §3.4 第 4 条），只写明一句。scan 写的 `docs/verification` 文件跑完按 C-9 还原。

#### TCRN-DS-SUB-224 · 批末生成物再生与清单校正（SUB-211 在本轮的对应）：按新截法整批重收视觉签名基线，生成物一次再生，owner-acceptance 改本轮处置

- 承接：R4-9（新；主力；SUB-211 在本轮的对应）；来源 R4-3、R4-5、R4-6、R4-7 带来的可见变化与截法变化，三片与摘录的读数更正，判断新增的 O-19、O-20
- 包 / 波：N5 / W3（主力）；包内第 1 张（TCRN-DS-SUB-224）
- 改动文件：`docs/verification/**`，`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-213（N1）、TCRN-DS-SUB-217（N2）、TCRN-DS-SUB-222（N3）、TCRN-DS-SUB-223（N4）
- 判据：150（清单与基线）、147、149-GWT2 的证据：其余各包合入后，在同一构建上做。① 按 SUB-217 的新截法整批重收视觉签名基线：选择文件逐条注明「截法变更」或所属 R4 项（R4-3、R4-6、R4-7）；A 类离群（maxCell > 40）逐条写理由，列为 Owner 目视项；写入前先给上一份应用记录改名（KB-022；新名不得与现有 `visual-selection-application-r3.json`、`-r4.json` 冲突），选择文件按 `visual-baseline-selection-r<n>.json` 的样式新取（默认 `-r4`），交回写明；nonVisualProofOk 为假就停在①，交回写明哪一步为假。② 一次再生：几何（geometry:proof、geometry:measure）、壳层门报告、映射（storybook:visual-proof）、契约与 API 清单（internal-alpha:contracts）、internal-alpha 回执（browser-proof、hardening）。③ `owner-acceptance.md`：G-16 改为 15 条并写明 O-19；第 329 行 O-4 的「唯一挡住批末 verify 归 0 的项」改为与 O-19 并列；待裁表补 O-19、O-20；G-17、G-18、G-20、G-21 改写本轮处置；目视项补 R4 新增三类（展开故事标题无左边条、Disclosure 描边、截法变更后的离群项），并收各包交回的目视项。④ 本单是本轮唯一提交 `docs/verification` 与 `owner-acceptance.md` 的单；`visual-selection-result.json` 不入仓；`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。⑤ 一次做对的验收，交回给读数：重收条数（按截法变更与各 R4 项分列）、A 类离群条数与清单、再生后 geometry:measure 只剩 markText（O-4）、browser-proof 的 visualSignatureRegressions 与 visualSignatureNewBaselines 为 0、六份回执字节都小于 1,000,000。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：R4 的最后一张。browser-proof 先跑一次产出 `visual-selection-result.json`，应用选择后再跑一次确认（这两次不算重复跑）。verify 不在本包跑，批末由主线程跑一次（O-18 不加 test:dom）。没有迁移条目。
