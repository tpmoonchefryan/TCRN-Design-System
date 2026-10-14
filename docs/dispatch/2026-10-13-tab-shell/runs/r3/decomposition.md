# TCRN-DS-INIT-016 · R3 拆分

本文件是 R3 拆分子代理的产出：R2 判断 §2 的返工清单 R3-1…R3-30 拆成 34 张 Subtask（TCRN-DS-SUB-178 至 TCRN-DS-SUB-211），挂在原 Story 下，分 11 个包、5 个波次。口径按判断 §3.1「不裁时的默认」（Owner 未裁前不改判据）与 §3.4（视为约定）；分包照判断 §5 的 11 包 5 波，包的组成、档位与波次不变，偏离只在第 2.4 节所列四处（前置列的显式化、一句文档与一处页面侧余项的落点）。链上 Story 的 scope 是任务权威；本文件只是拆分与分包，不是第二份 scope。拆分时发现的矛盾与缺口见 `problems/decomposition.md`，包表、波次与共享文件先后见 `packages.md`，机读清单见 `subtasks.json`，落链载荷见 `subtasks-batch.json`（34 个 work-create 成员，由主线程落链）。

读法：本文件超过 32 KB，按节读。第 1 节是跨包约定（编号 C-1 起，每个包都必须遵守，改约定须回拆分）；第 2 节是总览（返工编号对照、Story 对照、依赖图、偏离、风险）；第 3 节按 Story 列 Subtask，每张一节，节标题为 `#### TCRN-DS-SUB-NNN · 标题`，可按节切摘录。文中行号是集成分支 claude/init016-tab-shell 上 HEAD a99416c 的位置，先 grep 再改。

节行号：1 L9；2 L54；2.1 L56；2.2 L93；2.3 L113；2.4 L136；2.5 L145；3 L155；TCRN-DS-STORY-135 L157；TCRN-DS-STORY-138 L184；TCRN-DS-STORY-139 L204；TCRN-DS-STORY-140 L220；TCRN-DS-STORY-141 L320；TCRN-DS-STORY-142 L338；TCRN-DS-STORY-143 L360；TCRN-DS-STORY-145 L433；TCRN-DS-STORY-146 L468；TCRN-DS-STORY-147 L487；TCRN-DS-STORY-148 L602；TCRN-DS-STORY-149 L620；TCRN-DS-STORY-150 L654。

## 1. 跨包约定（实施包必须遵守，改约定须回拆分）

1. **C-1 依据、沿用与作废。** 本轮工作全部来自 R2 判断（`runs/r2/judgment.md`）§2 的 R3-1…R3-30；Owner 待裁项按判断 §3.1「不裁时的默认」做（C-6），判断 §3.4 的口径视为约定（C-7）。R2 拆分第 1 节（`runs/r2/decomposition.md` 第 7–48 行）按下表处置，与本节冲突时以本节为准。
   - 继续有效：R2 C-2 已落地的三条 token（shell.mark、shell.touch、shell.crumb-icon）与粗指针块落在 token 层的写法；R2 C-3（命令形态与红线，本节 C-3 重申）；R2 C-8（样式模块、段登记随段走、段首标记字面 `/* tcrn:shell-layer-start */`）；R2 C-9 的回执与生成物规则（本节 C-9 改持有者）；R2 C-10 的文案五语同源与运行时换字只跳过品牌字标；R2 C-12 已落地的接口（以 `runs/r2/excerpts/cross-notes.md` 第 3 节各行指明的交回物行段为准）；R2 C-13（目视项与待发布清单的交法）；R2 C-14（质量硬线与停下条件，本节 C-14 补本轮的授权范围）。经 R2 C-1 继续有效的 R1 各条（R1 C-4、C-5、C-6、C-7、C-9、C-11、C-16、C-17）照旧有效。
   - 改写：R2 C-4（包树与分支名改 r3，见 C-4）；R2 C-5（本轮已知红与过渡红，见 C-5）；R2 C-6（待裁默认扩到 18 项，见 C-6）；R2 C-7（授权范围按 R2 判断 §3.3、§3.4，见 C-7）；R2 C-11（迁移说明与 CHANGELOG 只由 SUB-210 追加，见 C-11）。
   - 作废：R2 各条里按 R2 Subtask 与包写的持有者名单（C-9 的 SUB-142、SUB-158、SUB-177 持有，C-10 的每波字典持有，C-11 的 K9、K12 分工，C-12 的落地单与消费单），由本轮 `packages.md` 与本节 C-10、C-12 取代。
2. **C-2 本轮新增 token（SUB-178 落地，默认名）。** R3-18 要把三处 12 与语言菜单箭头 11 改用 token：有同值同义的现有 token 就用，没有就在 shell 组新设；brand.css.ts 本 INIT 新增的 44 也读 token（22 读已有的 `--tcrn-shell-mark`）。名字属 B 类（判断 §3.4 第 2 条），下表是本拆分定的默认名，落地单可以改名，改名在 tokens.json、ui-tokens `index.ts` 与引用处一次改齐并写进交回。三条都是主题无关 token，进 shell 组。

   | F 段名 | key | cssVar | 值 | 用处 |
   | --- | --- | --- | --- | --- |
   | shell.chevron | shell-chevron | --tcrn-shell-chevron | 12px | ShellMenu.tsx:293 下一级箭头、:807 菜单底栏位置分隔符；ShellPins.tsx:326 固定项下拉箭头 |
   | shell.locale-chevron | shell-locale-chevron | --tcrn-shell-locale-chevron | 11px | base.css.ts:539–540 头像菜单的语言切换箭头（与 `--tcrn-shell-crumb-icon` 同值不同义，默认不复用） |
   | shell.mark-lg | shell-mark-lg | --tcrn-shell-mark-lg | 44px | brand.css.ts:161 首行锁定块大尺度的标 |

   铃铛 20、无账户头像图标 14、示意钮 16 改用 Icon 的 lg、sm、md 尺寸档（值不变），不新设 token。brand.css.ts 第一批的 38、28 不动（判断 §3.2、§3.3）。除本表外本轮不新增 token，需要时停下记问题。
3. **C-3 命令形态与红线。** 同 R2 C-3：局部门一律写成 `corepack pnpm@10.12.1 -C <包树> run <脚本>`、`corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> --filter <包名> <脚本>`；git 用 `git -C <包树>`；不 cd、不 rm（仓内删除用 `git rm`，临时产物移进会话 scratch 的 trash）；只写包树与会话 scratch。`--filter @tcrn/ui-react test` 之前先 `--filter @tcrn/ui-react build`（dist 未构建时 0 条测试也退出 0）；根 `pnpm test` 在第一个红的包就停，看某个包用 `--filter` 单跑。不新增依赖，不改 `pnpm-lock.yaml` 与任何 `package.json`（安装是停点；本轮的自检都写在已有测试文件或门脚本内，不新增 package.json 脚本）。任何文件（含未跟踪文件、交回与问题文件）不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得有以 KEY、TOKEN、SECRET、PASSWORD、SESSION、AUTH、API 结尾的名字（大小写都算）紧跟等号开头的行，不得写入 `scripts/no-private-input-scan.mjs` overclaim 短语表里的英文短语（摘录与交回都不抄原文）。
4. **C-4 包树、合入、提交与交回。** 集成分支 `claude/init016-tab-shell`。每包在自己的工作树（会话 scratch 的 `pkg/r3-<包小写>`）与分支（`claude/init016-r3-<包小写>`）上做，从集成分支在前置包合入后的 HEAD 切出；同一波的包并行（上限 3），合入由主线程按 `packages.md` 的波次与依赖顺序做，冲突交集成子代理。按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；作者 tpmoonchefryan，不加 Co-Authored-By；不推送、不打 tag、不发版、不部署。每包交回 `runs/r3/handoff/<包>.md`：提交列表；写明的选择与回显项（含 B 类改名）；「迁移条目」「目视项」「待发布清单」「待补五语键」「期望过期」（本包让别的门过期、交给后续持有者的期望，见 C-15）各节，没有就写无；局部门结果摘要（读数对照判据逐条写）；接续点。见红只记写 `runs/r3/problems/<包>.md`（同一根因算一条）。局部门只跑本包列出的门，同一门不为求稳重复跑，不跑 verify。每包不超过 150 响应，逼近 180 时提交干净状态、写接续点交回。
5. **C-5 见红只记、已知红与过渡红。** 包内看到不属本包 Subtask 的红，记一句「既有红，归 SUB-NNN（<包>）」，不修。本轮开工时的已知红见 R2 判断 §2.9（批末 verify 6f739b2：30 步红 7、44 段红 8）与 §1 结论表。另有几类在持有者合入前必然存在的过渡红：SUB-191（M2）登记顶带后，C8 的发现在 SUB-178（M4）补样式前红；M4、M5、M6 让 storybook-smoke 期望过期的项在 SUB-201（M7）对齐前红；M4 至 M8 让 smoke.test 与 story-budget 台账过期的项在 SUB-208（M9）对齐前红；构建的弃用 token 提示在 SUB-208 换完 story-content.tsx 前不为 0；W1 的 M3 跑壳层门时，M1 的新读法还不在它的包树里；W1 的 M3 跑 contract:static 时 SUB-189 还没改测试不变式，`node --test` 一步必红，所以 M3 直跑 `contract-static-proof.mjs` 看发现；O-4 未裁时 markText（DS 侧栏首行 1.4、底栏锁定块 1.7）预计一直红（判断 §3.1）。
6. **C-6 Owner 待裁项的默认口径（判断 §3.1，共 18 项）。** 未裁前不改判据、不改 Story：O-1 长字标截断加 title，宽度 134 不改；O-2 148-GWT1 记部分；O-3 级联越界维持现写法；O-4 墨迹中线照 ±1 判，markText 红，145-GWT2、149 记部分；O-5 只改件数、不画实心态；O-6 图钉获焦才显；O-7 文档站头像与目录宽 144 维持现状；O-8 夜间后缀两主题同色、标红、pending；O-9 AOS 占位并标明；O-10 头像菜单现写法；O-11 窄屏按视口切；O-12 下拉不显示 ⌘K；O-13 纸升起 10；O-14 字重按板实现；O-15 Sheet 夜间遮罩与下一级现写法；O-16 纸内页标题行高 30；O-17 TreeNav 归宿现写法；O-18 批末 verify 不加 test:dom（SUB-180、SUB-184、SUB-185 的 DOM 用例只由局部门看）。
7. **C-7 授权范围（判断 §3.3、§3.4）。** 授权外不做：放宽任何阈值（O-4 裁前 markText 照 ±1；searchOverlay 检查保留；axe 只按 2026-10-11 D2 加首行后缀；不抬扫描上限；smoke、browser-proof 期望不放宽）；B2-2 的 `justify-self: start` 与 C2-1③ 的改门口径；C11 方案 (b)；碰第 3、5 批与其他家族的豁免和焦点画法；改第一批品牌尺度（38、28）；新增 type scale token；O-11、O-5、O-1 裁前的改动；改 Shell 两板、07b 字句与画布画法（measure-shell.js 只镜像门库读法）；改批末 verify 组成；声明或绕过库门；推送、打 tag、发版、部署、发布画布。本轮能改的门判定语义只限判断 §3.4 第 1 条：R3-1、2、3、4、5、19、23 的读法；R3-6、7 的豁免判定与归属；R3-20 的期望与 axe 豁免；R3-30 删已改名 story 的基线；R3-8、10、16 属收紧。另有一处由本拆分按 B 类先做、在交回与收口回显、Owner 可事后更正：SUB-194 让 `scripts/brand-asset-source-proof.mjs:143` 的比对键随 data-logo 改为标的 id（R3-17 的直接后果，检查本身不放宽；problems/decomposition.md 第 4 条）。其余判定语义、阈值或比对字段的改动停下记问题。
8. **C-8 样式模块与段登记。** 沿用 R2 C-8：包样式只进现有模块；状态规则特异性不高于变体、不含颜色；几何逐值来自 token（C-2）。本轮没有包新建段；SUB-183 删 `typographyCss03` 时，同一提交删 `styles/index.ts` 的 import 与级联登记（第 24、73 行），`styles/index.ts` 本轮只归 M3。段首标记不动。
9. **C-9 回执、门报告与生成物。** `docs/verification/**`（回执、视觉签名基线、各门报告）只由 SUB-211（M11）提交；其它包跑了会写这些路径的门（geometry-measure、壳层门真件、geometry:proof、storybook:visual-proof、internal-alpha 各步、scan 等），跑完 `git -C <包树> checkout -- docs/verification`，新出现的未跟踪文件移进会话 scratch 的 trash；`visual-selection-result.json` 永不入仓；`internal-alpha/no-overclaim-scan.json` 由主线程在最后一次文档提交时再生。契约生成物只由改了契约的单提交：tokens.json 本轮只由 SUB-178 改（新设 token 时五个生成物头的 contract-sha256 同变）；icons.json、matrices.json、marks.json 本轮不改（需要时停下）。`owner-acceptance.md` 只由 SUB-211 改，各包把目视项与读数写进交回。
10. **C-10 文案与五语。** 壳件文案进 `components/Navigation/shell-copy.ts`（本轮只 M4 写），五语同源；story 文案进 `apps/storybook/src/build/locales/`；渲染文本不含工单键与内部词；运行时换字只跳过品牌字标（SUB-195 让首行锁定块也被跳过）。字典每波只一个包写：`storybook-content-text.ts` 为 W2 M6（只在「工作项」确实丢在字典时）、W4 M9；`storybook-locale-text.ts` 为 W4 M9（只在确需时）；`locale-invariant-ledger.mjs` 为 W2 M5、W4 M9（只在确需时）。需要别包字典的新键写进交回「待补五语键」。
11. **C-11 迁移说明与 CHANGELOG。** 两份文件本轮只由 SUB-210（M10）从 M38 起追加，不改别人写的条目。产出变化的单在交回「迁移条目」写一段中文，写明名字与默认值：SUB-183（删除的变量与样式段）、SUB-184（landmarkLabel 覆盖全部地标、TocRail 的 nav 名）、SUB-193（TocRail headingLevel）、SUB-185（menuShortcut）、SUB-194（data-logo 为标的 id）、SUB-178（新 token、Icon 尺寸档）；SUB-179、SUB-198 的新属性对消费方可见时也写。「previewStates 只供文档与测试使用」由 SUB-210 照判断写。
12. **C-12 本轮新接口（默认名；落地单要改名须写进交回，消费单以合入后的代码为准）。**

   | 接口 | 落地单 | 默认写法 | 消费单 |
   | --- | --- | --- | --- |
   | 已全量检查的批次 | SUB-189 | families.json `scope.checkedBatches: [1, 2]`，validateExemptions 与测试读同一字段 | SUB-190、SUB-209 |
   | 顶带 C8 登记 | SUB-191 | roles.json `toolbars` 一项：容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster` | SUB-178、SUB-209 |
   | 地标名覆盖 | SUB-184 | landmarkLabel 经 `landmarkOf` 作壳内全部具名地标的前缀；TocRail 的 nav 取标题作名 | SUB-179、SUB-202 |
   | TocRail 标题层级 | SUB-193 | TocRail `headingLevel?: 2 \| 3`（默认 3） | SUB-202 |
   | 菜单快捷键开关 | SUB-185 | ProductShell `menuShortcut?: boolean`（默认 true），原样传 ShellMenu `shortcut` | SUB-179、SUB-201 |
   | 门选被测屏 | SUB-179 | 页面地址参数 `shell-shortcut=<屏 id>`，只有该屏注册 ⌘K | 壳层门 focusLoop |
   | 水合完成标记 | SUB-198 | 每个 `[data-shell-hydrate]` 块在水合提交后与每次换语言后写 `data-shell-hydrated="<当前语言>"` | SUB-198 的泄漏扫描、SUB-201 |
   | data-logo 的值 | SUB-194 | 标的 id（`asset.markId`，即 logos2 文件名） | 壳层门 brandDigest、brand-asset:proof |
   | 新 token | SUB-178 | C-2 三条 | SUB-209、SUB-210 |
   | 文档壳水合 | SUB-201 | 文档壳经 shell-hydrate 水合真件，`data-doc-shell` 保留，≤ 760 开 Sheet | SUB-179、SUB-208 |

13. **C-13 Owner 目视与待发布清单。** `owner-acceptance.md` 只由 SUB-211 改（C-9）。各包把新增或变化的目视项写进交回「目视项」：纸内焦点环（SUB-182）、⌘K 只开一个壳（SUB-185、SUB-179）、拖排与产品切换（SUB-186）、zh-CN 首行（SUB-195）、文档壳 ≤ 760 开 Sheet（SUB-201）、样板壳高 640（SUB-205）、视觉签名离群项（SUB-211）。待发布清单：measure-shell.js 若镜像改过（M1）、C-2 新 token 补进 F 段（SUB-178），交设计会话，本轮不发布画布。
14. **C-14 质量硬线与停下条件。** START「质量硬线」两段（第一批 C1–C17 与壳层新增硬线）对每个包有效。遇到下列情况停下写进包问题文件，不扩大授权：要新增 C-2 以外的 token；要改 Icon 组件 API；要改 C-7 列表以外的门判定语义、阈值或比对字段；要改不在本包文件集里的文件（含别的波次持有的共享文件）；要改 Shell 两块成品板或 07b 字句；要新增依赖或 package.json 脚本；要恢复已删的豁免；C8 的发现需要板上没有的数值（交 Owner，不自定数值）。批内发现的新工作只记问题，进下一轮，不插入本轮。
15. **C-15 期望对齐（R2 主线程问题 M2）。** 改动会让某个门的期望过期的包，在同包里对齐那条期望：门脚本在本包文件集里的，本单直接改，并在交回写明改了哪条；不在本包文件集的，按 `packages.md`「期望对齐的接收」交给该文件的下一个持有者，在交回「期望过期」一节逐条写明（文件、行、旧期望、新读数、来源 Subtask）；接收单的判据里已写明要对齐哪些包的交回。本轮的接收单：storybook-smoke 先 SUB-201（M7）再 SUB-208（M9）；smoke.test 与 story-budget 为 SUB-208（M9）；shell-fidelity-proof 为 SUB-204（M8）；brand-asset-source-proof 由 SUB-194 同包对齐；壳层门的被测屏参数由 SUB-179 同包对齐。
16. **C-16 一次做对（标「R2-x 再返工」的 22 条）。** 判断 §2：这 22 条一律主力，R3 再被退回就交 Owner，不再派；新出的 8 条退回一次升主力（本轮已是主力，退回即交 Owner）。承接这些条目的 Subtask，判据最后一项写的是「一次做对的验收」：交回必须给出该项要求的实测读数（不是只说「门绿」）；读数与判据不符时不得交回为完成，写进问题文件并说明差在哪里；读法、阈值、期望值一律不为求绿而改。
17. **C-17 前置列只写包号（R2 主线程问题 M5）。** `packages.md` 包表的「前置包」列只写包号并逐个列出（M11 写 M1、M2、M3、M4、M5、M6、M7、M8、M9、M10），不写「其余全部」之类的文字，调度工具按包号判断就绪。

## 2. 总览

### 2.1 返工编号 → Subtask（30 条，一条不漏）

| R3 项 | Subtask | 包 / 波 | 父 Story |
| --- | --- | --- | --- |
| R3-1 | TCRN-DS-SUB-206 | M1 / W1 | 149 |
| R3-2 | TCRN-DS-SUB-207 | M1 / W1 | 149 |
| R3-3 | TCRN-DS-SUB-196 | M1 / W1 | 146 |
| R3-4 | TCRN-DS-SUB-181 | M2 / W1 | 140 |
| R3-5 | TCRN-DS-SUB-197 | M2 / W1 | 147 |
| R3-6 | TCRN-DS-SUB-189 | M2 / W1 | 143 |
| R3-7 | TCRN-DS-SUB-190 | M2 / W1 | 143 |
| R3-8 | TCRN-DS-SUB-178、TCRN-DS-SUB-191 | M4 / W2、M2 / W1 | 135、143 |
| R3-9 | TCRN-DS-SUB-188 | M3 / W1 | 142 |
| R3-10 | TCRN-DS-SUB-182 | M3 / W1 | 140 |
| R3-11 | TCRN-DS-SUB-192 | M3 / W1 | 143 |
| R3-12 | TCRN-DS-SUB-183 | M3 / W1 | 140 |
| R3-13 | TCRN-DS-SUB-180 | M3 / W1 | 139 |
| R3-14 | TCRN-DS-SUB-179、TCRN-DS-SUB-184 | M7 / W3、M4 / W2 | 138、140 |
| R3-15 | TCRN-DS-SUB-193、TCRN-DS-SUB-202 | M4 / W2、M7 / W3 | 143、147 |
| R3-16 | TCRN-DS-SUB-179、TCRN-DS-SUB-185 | M7 / W3、M4 / W2 | 138、140 |
| R3-17 | TCRN-DS-SUB-194 | M4 / W2 | 145 |
| R3-18 | TCRN-DS-SUB-178、TCRN-DS-SUB-209 | M4 / W2、M10 / W4 | 135、150 |
| R3-19 | TCRN-DS-SUB-198 | M5 / W2 | 147 |
| R3-20 | TCRN-DS-SUB-195 | M5 / W2 | 145 |
| R3-21 | TCRN-DS-SUB-201 | M7 / W3 | 147 |
| R3-22 | TCRN-DS-SUB-205 | M6 / W2 | 148 |
| R3-23 | TCRN-DS-SUB-199、TCRN-DS-SUB-203 | M6 / W2、M7 / W3 | 147 |
| R3-24 | TCRN-DS-SUB-200 | M6 / W2 | 147 |
| R3-25 | TCRN-DS-SUB-186 | M5 / W2 | 140 |
| R3-26 | TCRN-DS-SUB-187 | M9 / W4 | 141 |
| R3-27 | TCRN-DS-SUB-204、TCRN-DS-SUB-208 | M8 / W3、M9 / W4 | 147、150 |
| R3-28 | TCRN-DS-SUB-208、TCRN-DS-SUB-209 | M9 / W4、M10 / W4 | 150 |
| R3-29 | TCRN-DS-SUB-210 | M10 / W4 | 150 |
| R3-30 | TCRN-DS-SUB-211 | M11 / W5 | 150 |

注：R3-8 的样式修补随 SUB-178（判断 R3-18 改法末句）；R3-14 的屏内 SectionTabs 余项在 SUB-179；R3-18 的契约说明句在 SUB-209；R3-27 的 story-content.tsx 弃用名在 SUB-208（判断 R3-27 原文「由 M9 换」）。

### 2.2 Story → Subtask

| Story | Subtask |
| --- | --- |
| 135 | TCRN-DS-SUB-178（M4） |
| 138 | TCRN-DS-SUB-179（M7） |
| 139 | TCRN-DS-SUB-180（M3） |
| 140 | TCRN-DS-SUB-181（M2）、TCRN-DS-SUB-182（M3）、TCRN-DS-SUB-183（M3）、TCRN-DS-SUB-184（M4）、TCRN-DS-SUB-185（M4）、TCRN-DS-SUB-186（M5） |
| 141 | TCRN-DS-SUB-187（M9） |
| 142 | TCRN-DS-SUB-188（M3） |
| 143 | TCRN-DS-SUB-189（M2）、TCRN-DS-SUB-190（M2）、TCRN-DS-SUB-191（M2）、TCRN-DS-SUB-192（M3）、TCRN-DS-SUB-193（M4） |
| 145 | TCRN-DS-SUB-194（M4）、TCRN-DS-SUB-195（M5） |
| 146 | TCRN-DS-SUB-196（M1） |
| 147 | TCRN-DS-SUB-197（M2）、TCRN-DS-SUB-198（M5）、TCRN-DS-SUB-199（M6）、TCRN-DS-SUB-200（M6）、TCRN-DS-SUB-201（M7）、TCRN-DS-SUB-202（M7）、TCRN-DS-SUB-203（M7）、TCRN-DS-SUB-204（M8） |
| 148 | TCRN-DS-SUB-205（M6） |
| 149 | TCRN-DS-SUB-206（M1）、TCRN-DS-SUB-207（M1） |
| 150 | TCRN-DS-SUB-208（M9）、TCRN-DS-SUB-209（M10）、TCRN-DS-SUB-210（M10）、TCRN-DS-SUB-211（M11） |

136、137、144 本轮没有直接挂单：136、137 的硬线差由 SUB-178 处理，144 的 GWT3 与 ≤ 760 开 Sheet 由 SUB-181、SUB-201 处理（判断 §1 结论表）。

### 2.3 依赖图

```
W1  M1: SUB-206 → SUB-207 → SUB-196
    M2: SUB-181；SUB-197；SUB-189 → SUB-190 → SUB-191
    M3: SUB-188 → SUB-182 → SUB-192 → SUB-183；SUB-180
W2  M4: (M3 全部) → SUB-184 → SUB-193
                    SUB-184 → SUB-185 → SUB-194 → SUB-178 ← SUB-191（M2）
    M5: SUB-198 → SUB-195；SUB-198 → SUB-186
    M6: SUB-205；SUB-199 → SUB-200
W3  M7: SUB-201 ← SUB-184、SUB-185（M4），SUB-195、SUB-186（M5）
        SUB-179 ← SUB-201，SUB-185（M4），SUB-196（M1）
        SUB-202 ← SUB-193（M4），SUB-179
        SUB-203 ← SUB-199（M6）
    M8: SUB-204 ← SUB-178（M4），SUB-192（M3）
W4  M9: SUB-187；SUB-208 ← SUB-187，SUB-184（M4），SUB-186（M5），SUB-200（M6），SUB-201（M7），SUB-204（M8）
    M10: SUB-209 ← SUB-178（M4），SUB-201（M7）
         SUB-210 ← SUB-209，SUB-183（M3），SUB-184、SUB-193、SUB-185、SUB-194、SUB-178（M4），SUB-179、SUB-202（M7）
W5  M11: SUB-211 ← 各包末张 SUB-196、SUB-191、SUB-180、SUB-178、SUB-186、SUB-200、SUB-203、SUB-204、SUB-208、SUB-210
```

关键路径同判断 §5：M3 → M4 → M7 → M9 → M11。

### 2.4 偏离判断 §5 的地方

包的组成、档位与波次全部照判断 §5，偏离只有下列四处，都不改调度顺序：

1. **M8 的前置由「无」改为 M3、M4。** `apps/storybook/src/storybook.css` 走 M4 → M8（SUB-178 新设 token 时 tokens-sync 改它的 token 块，SUB-204 换文档层弃用名）；shell-fidelity 的过期期望由 SUB-192（M3）交 SUB-204 对齐（C-15）。M8 本在 W3，W2 合入后才切出，调度不变。
2. **M9 前置补写 M5，M10 前置补写 M3。** smoke.test 与 story-budget 走 M5 → M9；SUB-210 要写 SUB-183（M3）的迁移条目。二者原经 M7、M4 传递已是前置，显式写出以便校验，调度不变。
3. **R3-18 的契约说明句移到 SUB-209（M10）。** 判断 R3-18 写「契约说明写定粗指针映射以 ui-tokens 的 tcrnCoarsePointerTokens 为唯一来源」，契约文档（`docs/contract/README.md`）本轮只在 W4 由 M10 持有；SUB-178 在交回「待补文档」写明那一句，SUB-209 照写。
4. **R3-14 的页面侧余项落在 SUB-179（M7）。** 屏内 SectionTabs（`shell-hydrate.tsx:263`，默认名「Section navigation」）与文档页 `.tcrn-doc-package-nav-proof` 的分段导航同名，是 landmark-unique 归 0 的最后一处（K11 问题 7 末句）；shell-hydrate.tsx 在 W3 归 M7，按判断 R3-14「等处各传不同名」放进 SUB-179。

### 2.5 风险

- **M4（145）与 M7（140）贴近上限。** M4 逼近时按判断 §5 把 SUB-178（R3-18）拆成 M4b：M4 提交干净状态、写接续点交回，M4b 进 W3。M4b 与 M8 同改 `apps/storybook/src/storybook.css`（M4b 的 tokens-sync 改 token 块，M8 改文档层弃用名），所以 M4b 必须先于 M8 合入（M8 从 M4b 合入后的集成分支切出），或把 M8 移到 W4 与 M9、M10 同波（W4 仍是 3 个包），M9 的前置不变。M7 逼近时，SUB-203（只在 SUB-199 定为门的原因时才有改动）顺延到下一轮，SUB-201 与 SUB-179 优先。
- **R3-8 登记后的 C8 红量未知**（判断 §5）。需要板外数值的交 Owner，SUB-178 不自定。
- **O-4 不裁时 R3 全绿也停在 markText**（判断 §2.9 末句），届时判断写「无可做返工、建议收口」。
- **过渡红**（C-5）在 W2–W4 期间存在，属预期，各包按「既有红，归 SUB-NNN」记，不修。
- **SUB-180 的新用例可能暴露 ShellDropdown 的缺陷**：按其注意写成 todo，进下一轮。
- **O-18 未裁**：SUB-180、SUB-184、SUB-185 的 DOM 用例不在批末 verify 里，验收只能读各包局部门的读数。
- **规模**：实施 1,270 响应（判断 §5 表逐行相加；判断正文写约 1,370），加验收约 400、判断约 120。

## 3. 按 Story 的 Subtask

### TCRN-DS-STORY-135 · 壳 token：shell.* 与 motion.intro 进 ui-tokens，rail-w / rail-w-collapsed / topbar-h 经弃用别名退役，契约 tokens.json 同步

1 张：TCRN-DS-SUB-178（父单 work:1ad3c63c6fe6468a9d553758）

#### TCRN-DS-SUB-178 · 壳件与首行的几何字面值改用 token：图标走 Icon 尺寸档，12、11 进 shell 组，首行标 22、44 读 token，补顶带 C8 样式

- 承接：R3-18（R2-11 再返工）；R3-8 的 shell.css.ts 修补（判断 R3-18 改法末句：「R3-8 需要的 shell.css.ts 修补也在本包」）
- 包 / 波：M4 / W2（主力）；包内第 5 张（TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178）
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`，`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`（按需），`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.tsx`，`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`（按需），`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/brand.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`docs/design/gplus-2026-10/contract/tokens.json`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`packages/ui-react/src/styles/generated/actions.pairs.ts`，`packages/ui-react/src/styles/generated/inputs.pairs.ts`，`packages/ui-react/src/styles/generated/typography.scale.ts`，`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`，`packages/ui-tokens/src/index.ts`，`packages/ui-tokens/src/index.test.ts`，`packages/ui-tokens/src/tokens.css`，`apps/storybook/src/storybook.css`
- 依赖：TCRN-DS-SUB-194（M4 包内靠前）、TCRN-DS-SUB-191（M2）
- 判据：135、136、137、138、140、145 的硬线「几何逐值来自 token」（§0 第 5 条列出的字面值）：① Navigation.tsx:2272 铃铛 `size={20}` 改 `"lg"`、:2288 无账户头像图标 `size={14}` 改 `"sm"`，ShellBrandButton.tsx:98 示意钮 `size={16}` 改 `"md"`，渲染出的 width、height 与改前逐个相等（20、14、16，Icon 的 sm、md、lg 由 token 换算，`Icon.tsx:34–38`）。② ShellMenu.tsx:293（下一级箭头）、:807（底栏位置分隔符）与 ShellPins.tsx:326（固定项下拉箭头）的 12 读 C-2 的 `--tcrn-shell-chevron`，写法沿用 Navigation.tsx 第 1241–1248 行面包屑分隔符（模块加载时从 tcrnTokens 取像素值传给 Icon，Icon API 不变）；base.css.ts:539–540 语言菜单箭头的 11px 改 `var(--tcrn-shell-locale-chevron)`；先查 tokens.json，有同值同义的现有 token 就用它、不新设，并在交回写明。③ brand.css.ts:168、:214 的 22px 改 `var(--tcrn-shell-mark)`，:161 的 44px 改 `var(--tcrn-shell-mark-lg)`；:20、:33 的 38、28 是第一批品牌尺度，不动（§3.3）。④ 新 token 按 C-2 落 tokens.json、ui-tokens `index.ts` 与 `index.test.ts`（逐条断言）、tokens.css 与 storybook.css 的 token 块（tokens-sync 写），五个生成物头的 contract-sha256 同变，只由本单提交（C-9）。⑤ SUB-191 交回「C8 发现」里标为「只需现有 token 补 min-width 或 flex-shrink 0」的，在 shell.css.ts 补齐；标为「需要板上没有的数值」的不补，写 problems/M4.md 交 Owner。⑥ 一次做对的验收：上列每一处 grep 复核为 0 个数字字面值（Breadcrumb 的 `breadcrumbSeparatorSize` 这类从 token 取值的变量不算）；contract:static 的 C8 静态层与 story 层 0 条（只剩交 Owner 的条目时逐条写明）；tokens-sync --check、tokens:proof、shell:fidelity（shellGeometryLiteral）、contract:static、contract:proof、ui-tokens 与 ui-react 单测退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 注意：M4 的末张。token 名属 B 类（判断 §3.4 第 2 条），按 C-2 默认名落地，改名在 tokens.json、ui-tokens `index.ts` 与引用处一次改齐并写进交回；新 token 写进交回「交设计会话补进 F 段」与「迁移条目」。判断写的「契约说明写定粗指针映射以 tcrnCoarsePointerTokens 为唯一来源」落在契约文档，本波无人持有，改由 SUB-209（M10）写，本单在交回「待补文档」写明那一句（偏离见第 2.4 节）。本单逼近包上限时按第 2.5 节拆成 M4b：提交干净状态、写接续点交回。

### TCRN-DS-STORY-138 · 完整菜单 ShellMenu：标按钮一段即开，顶 52 = 标按钮底 46 + 6、左 12、宽 952、搜索 40、三列行 32、底栏 52 放当前位置与侧栏尺度锁定块（只装饰）、无收起钮、选中 / Esc / 点外部即收、⌘K

1 张：TCRN-DS-SUB-179（父单 work:3d8ec5e9bbaaa3623c3315c8）

#### TCRN-DS-SUB-179 · ⌘K 只打开一个壳（挂载与门）：壳 story 默认关，门按页面参数开被测屏，focusLoop 断言焦点在被测屏搜索框

- 承接：R3-16 的挂载与门（新，门收紧）；R3-14 页面侧余项：屏内 SectionTabs 与文档页分段导航同名（problems/decomposition.md 第 5 条）
- 包 / 波：M7 / W3（主力）；包内第 2 张（TCRN-DS-SUB-201 → TCRN-DS-SUB-179 → TCRN-DS-SUB-202 → TCRN-DS-SUB-203）
- 改动文件：`apps/storybook/src/build/shell-hydrate.tsx`，`apps/storybook/src/build/page-template.tsx`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/manifest.json`（按需）
- 依赖：TCRN-DS-SUB-201（M7 包内靠前）、TCRN-DS-SUB-185（M4）、TCRN-DS-SUB-196（M1）
- 判据：138-GWT4、140：① 文档页的文档壳（page-template.tsx:437 起）保持 `menuShortcut` 开；shell-hydrate.tsx 水合的各屏默认传 `menuShortcut={false}`，只有门在页面地址上用参数（C-12 默认名 `shell-shortcut=<屏 id>`）选中的被测屏打开，页面带该参数时文档壳也不注册；同一页按一次 ⌘K（含 Ctrl+K），只有一个壳的菜单 `aria-expanded` 变 true。② shell-measure-proof.mjs 的 focusLoop 收紧：⌘K 之后 `document.activeElement` 必须在被测屏自己的 `[data-shell-search]` 内，否则判红；tests/shell-measure-proof.test.mjs 加两条：同页两个壳都注册时判红、只开被测屏时判绿；原 focusLoop 变异仍判红；阈值只在 THRESHOLDS，不改。③ shell-hydrate.tsx:263 屏内的 SectionTabs 传 `label`（取屏名），与文档页 `.tcrn-doc-package-nav-proof` 的分段导航不再同名（K11 问题 7 末句；R2 验收 C 片 axe 明细 `components-navigation-shells.html` 一行）。④ geometry:measure 的壳层门真件 focusLoop 绿；storybook:smoke 退出 0，或只剩已登记的既有红。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 注意：参数名属 B 类，在交回写明；门的读法注释同步写明「按页面参数只开被测屏」。夹具 manifest 只在门需要登记被测屏参数时改。门只收紧不放宽（判断 §3.4 第 1 条：R3-16 属收紧）。

### TCRN-DS-STORY-139 · 固定二级菜单下拉 ShellDropdown：从固定项纵向下拉，顶 = 项底 42 + 6、左 = 项左、宽 240、内距 6、搜索 sm 28 只搜该子树、行 32 无图标列文字起点 16；三、四级按点击向右 4 级联，同宽，高 = 左列高

1 张：TCRN-DS-SUB-180（父单 work:09e0986c769bddf72859897f）

#### TCRN-DS-SUB-180 · 下拉定位与级联回退补 DOM 用例：按固定层祖先定位、顶带尺寸变化后重定位、级联 ← 回到可见的打开行

- 承接：R3-13（新；判断标经济，本包整包主力）
- 包 / 波：M3 / W1（主力）；包内第 5 张（TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180）
- 改动文件：`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx`
- 依赖：无
- 判据：139-GWT1、GWT4：在现有 `src/test/shell-dropdown.dom.spec.tsx`（SUB-118 所建，5 条用例；判断写「新建」，见 problems/decomposition.md 第 1 条）追加三条：① 下拉的起点按最近的固定层祖先（不是视口）算，祖先平移后仍是左 = 项左、顶 = 项底 + 接续；② 顶带尺寸变化（改顶带宽或固定项文字使项左移动）后，已打开的下拉重定位，接续读 `--tcrn-shell-menu-gap`（ShellDropdown.tsx 第 6 行注释所写的 token），不写死 6；③ 级联开到第三级后按 ArrowLeft，焦点回到上一级中可见且 `aria-expanded="true"` 的行。`run test:dom` 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
- 注意：只加测试，不改组件（ShellDropdown.tsx 本波不在 M3 文件集）。新用例若暴露组件缺陷：该条写成 node:test 的 todo（写明期望），不提交会红的用例，缺陷记 problems/M3.md，进下一轮（批量原则第 3 条）。

### TCRN-DS-STORY-140 · ProductShell 顶带态：移除 sidebar 布局与钉住态，顶带 52 画布色无底无线、纸离边 12 顶 52 圆角 14 s1，固定项为每用户每产品的服务端偏好（可钉分组、项、子菜单，上限 6，可拖排），切换产品进头像菜单

6 张：TCRN-DS-SUB-181、TCRN-DS-SUB-182、TCRN-DS-SUB-183、TCRN-DS-SUB-184、TCRN-DS-SUB-185、TCRN-DS-SUB-186（父单 work:e14a7f089a9cac4c7da39d52）

#### TCRN-DS-SUB-181 · geometry-proof 的 searchOverlay 只计所在面板之外的碰撞，并断言该面板两主题底色不透明

- 承接：R3-4（R2-24 再返工）
- 包 / 波：M2 / W1（主力）；包内第 1 张（TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191）
- 改动文件：`scripts/geometry-proof.mjs`
- 依赖：无
- 判据：140（SUB-150 判据）、144-GWT3、146：① geometry-proof.mjs 的碰撞（第 300–311 行一带）改为「结果框 ∩ 纸内文字 − 所在面板盒」，并断言该面板的 backgroundColor alpha = 1（浅色、夜间各一次）；openMenus 仍由 DOM 派生；searchOverlay 检查保留（R1 §3.3）。② 变异段（第 538–594 行一带）：现有 searchBroken 照留且判红；新增「面板底透明」变异（面板 background 改 transparent）判红；复原判绿。③ 一次做对的验收：同一构建上基线碰撞 0、原变异 ≥ 1（与 K11 探针「只计面板外时基线 0、变异 1」一致），新变异 ≥ 1，geometry:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- 注意：仓里没有 geometry-proof 的独立测试文件（判断写「及其测试」），自检写在门内变异段，不新增 package.json 脚本（problems/decomposition.md 第 2 条）。阈值不改。

#### TCRN-DS-SUB-182 · 纸内滚动区的焦点内收可见，兜底规则不再盖掉头像等壳件自带的焦点对，focusRingClipInPage 纳入纸内滚动区

- 承接：R3-10（R2-8 再返工）
- 包 / 波：M3 / W1（主力）；包内第 2 张（TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180）
- 改动文件：`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`scripts/geometry-measure-proof.mjs`，`tests/geometry-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/all.green.html`（按需），`tests/fixtures/geometry-measure/manifest.json`（按需）
- 依赖：TCRN-DS-SUB-188（M3 包内靠前）
- 判据：140（R2-8）、硬线 C2（WCAG 2.4.7）：① shell.css.ts:934 `.tcrn-product-shell__paper > .tcrn-product-shell__main` 基础规则声明焦点 pair（读 `--tcrn-focus-ring` 一组 token），形态内收（inset 或负 outline-offset）；`:where(:focus-visible)` 只切 pair，不写颜色；获焦时整圈环落在纸的 overflow 盒内。② 第 950 行兜底规则排除自带焦点 pair 的壳件（以 grep 核实名单：第 132–137 行标按钮、245–248 行固定项、469–472 行菜单行、570–573 行搜索结果、816、843–848 行铃铛与头像），头像的 inset 1px 细线（第 816 行 `--tcrn-pair-edge-f`）获焦时保留；别的家族不动（§3.3）。③ geometry-measure-proof.mjs:154 focusRingClipInPage 把纸内滚动区纳入（收紧）；tests/geometry-measure-proof.test.mjs 第 549–552 行一带加：外扩环被 overflow hidden 裁掉判红、内收环判绿。④ Navigation.test.tsx 断言滚动区的 pair 声明与兜底排除名单（头像细线保留）。⑤ 一次做对的验收：A 片 `probe3-mainfocus.png` 的情形（环整圈被裁）在测试里复现为红、改后为绿；ui-react 单测与 geometry-measure 两步退出 0；直跑 `contract-static-proof.mjs` 的 C2、C6 无新增发现（`run contract:static` 的 `node --test` 一步在 SUB-189 合入前仍因测试不变式红，属既有红）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
- 注意：第一批夹具 all.green.html 与上级 manifest.json 只在 focusRingClipInPage 的页面探针需要纸内滚动区样本时改（K10 已把 all.green.html 换成顶带壳）。geometry-measure-proof 会写 docs/verification，跑完按 C-9 还原。

#### TCRN-DS-SUB-183 · 删死变量与死规则：--tcrn-motion-product-shell-search 连同其断言、门期望与登记，typographyCss03 连同其登记

- 承接：R3-12（R2-7 再返工）
- 包 / 波：M3 / W1（主力）；包内第 4 张（TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180）
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`scripts/storybook-smoke.mjs`，`scripts/token-extension-proof.mjs`，`packages/ui-react/src/styles/typography.css.ts`，`packages/ui-react/src/styles/index.ts`
- 依赖：TCRN-DS-SUB-192（M3 包内靠前）
- 判据：140（O-1 撤出）、146：① base.css.ts:13 的 `--tcrn-motion-product-shell-search` 删除；Navigation.test.tsx:614 的存在断言改为不存在断言（第 622 行的不使用断言保留）；storybook-smoke.mjs:994（判断写 1065，行号已漂）的期望字面删除；token-extension-proof.mjs:33 的登记删除。② typography.css.ts:57 的 `typographyCss03`：先在构建产物里 grep 证明它的选择器不命中任何元素，再删导出、styles/index.ts 第 24、73 行的 import 与级联登记、相关注释依赖，同一个提交。③ 一次做对的验收：`git -C <包树> grep -n` 这两个名字在 packages、apps、scripts、tests 下 0 处（docs/dispatch 历史记录除外）；ui-react 单测、typecheck、css-template-integrity、token-extension-proof、tokens:proof、storybook:smoke 退出 0（只剩已登记的既有红时逐条写明）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 注意：迁移条目（删 `--tcrn-motion-product-shell-search` 与 `typographyCss03`）写进交回，SUB-210 追加（C-11）。styles/index.ts 本波只归 M3（共享登记处表）。

#### TCRN-DS-SUB-184 · 地标名按实例区分：landmarkLabel 作壳内全部具名地标的前缀，TocRail 的 nav 取标题作名，两份样板传不同名

- 承接：R3-14（R2-17 再返工）
- 包 / 波：M4 / W2（主力）；包内第 1 张（TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178）
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`，`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`，`packages/ui-react/src/components/Navigation/shell-copy.ts`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`（按需），`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`，`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`
- 依赖：TCRN-DS-SUB-188（M3）、TCRN-DS-SUB-182（M3）、TCRN-DS-SUB-192（M3）、TCRN-DS-SUB-183（M3）、TCRN-DS-SUB-180（M3）
- 判据：140（SUB-148）、147、143：① 传了 landmarkLabel 时，壳内全部具名地标都经 shell-copy 的 `landmarkOf(prefix, name)` 组装（五语同源）：固定项 nav、面包屑 nav（已有），加完整菜单面板（ShellMenu.tsx:765 `copy.navigation`）、Sheet 面板（:714）、底栏位置 nav（:801 `copy.currentPosition`）、下拉面板（ShellDropdown.tsx:245 `source.label`）与内容区 region；不传时名称与现在逐字相同。② TocRail（DomainDisplay.tsx:1190–1197）的 `<nav>` 取其标题作可及名（`aria-labelledby` 指向标题，或 `aria-label` = label）。③ storybook-shell-demos.tsx:39 与 matrix-stories.tsx:628 的 ProductShell 各传不同的 landmarkLabel；demos 的页内页头传 headingLevel 2（K11 问题 7：页面多出的 h1）。④ 单测：同页渲染两个带不同 landmarkLabel 的壳（含菜单打开、下拉打开两态），收集全部带名地标（nav、region、dialog、aside 等）的可及名，断言互不相同；不传时与改前相同。⑤ 一次做对的验收：A2-3 列的四类固定名（Navigation、Current location、下拉名、内容区）与 TocRail 无名 nav，在本地 browser-proof 的 axe landmark-unique 里 0 个节点；余项只许是 SUB-179 处理的屏内 SectionTabs，逐条写进交回。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：browser-proof 会写 docs/verification，跑完按 C-9 还原。不加新 prop；迁移条目（landmarkLabel 覆盖全部地标、TocRail 的 nav 名）写进交回。shell-menu.dom.spec.tsx 只在 DOM 用例需要时改。storybook-smoke 与 smoke.test 若因样板改名、改层级而过期，写进交回，分别由 SUB-201（M7）与 SUB-208（M9）对齐（M2 约定）。

#### TCRN-DS-SUB-185 · ⌘K 只打开一个壳（包件）：ProductShell 透传 menuShortcut（默认开）给 ShellMenu，README 的壳控制边界同步

- 承接：R3-16 的包件部分（新，prop 面）
- 包 / 波：M4 / W2（主力）；包内第 3 张（TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178）
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`packages/ui-react/src/components/Navigation/ShellMenu.tsx`（按需），`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`，`packages/ui-react/README.md`，`packages/ui-react/src/test/shell-menu.dom.spec.tsx`（按需）
- 依赖：TCRN-DS-SUB-184（M4 包内靠前）
- 判据：138-GWT4、140：① ProductShell 新增 `menuShortcut?: boolean`（默认 true，名属 B 类），原样传给 ShellMenu 已有的 `shortcut`（ShellMenu.tsx:532、558、613）；为 false 时 document 上不注册 keydown 监听。② DOM 用例：同页两个壳，一个 `menuShortcut={false}`，按 ⌘K 与 Ctrl+K 都只有另一个打开，焦点进它自己的搜索框；两个都不传时（现行为）两个都打开，用来证明开关起作用。③ ui-react README 第 303 行起的「Storybook Shell Control Boundary」写明 menuShortcut 与「同页多个壳时只让一个注册」（K3 问题 11）。④ ui-react 单测、test:dom、typecheck、internal-alpha:contracts 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
- 注意：挂载与门在 SUB-179（M7）。internal-alpha:contracts 会写 docs/verification，跑完按 C-9 还原。迁移条目（menuShortcut 与默认值）写进交回。

#### TCRN-DS-SUB-186 · 文档页样板接上拖排与产品切换：shell-top-band 收起屏接控制器的本地偏好并传 products

- 承接：R3-25（新；判断标经济，本包整包主力）
- 包 / 波：M5 / W2（主力）；包内第 3 张（TCRN-DS-SUB-198 → TCRN-DS-SUB-195 → TCRN-DS-SUB-186）
- 改动文件：`apps/storybook/src/build/shell-hydrate.tsx`，`apps/storybook/src/smoke.test.ts`，`scripts/lib/story-budget.mjs`
- 依赖：TCRN-DS-SUB-198（M5 包内靠前）
- 判据：140-GWT3、GWT4：① shell-top-band 的现有收起屏（不新登记屏）用 `useProductShellController` 的 `productShellControlProps` 接本地偏好：固定项可用指针与 Alt+← / Alt+→ 拖排，刷新后顺序保留；② 传 `products`：TMS 为当前，加 AOS 等已有五语名的产品（名取现有来源，不新增字典键），头像菜单出现产品切换且当前项为 TMS；③ smoke.test.ts 与 story-budget.mjs 的期望在本单对齐，台账行改为现测值（M2 约定）；④ 一次做对的验收：静态页上实测拖一次、刷新、顺序保留，头像菜单列出产品，写进交回；storybook 单测、storybook:smoke 与 browser-proof 的 story-height 预算退出 0（只剩已登记的既有红时逐条写明）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：新登记屏要动壳层夹具 manifest（M1 → M7 持有），本单不登记，确需时记问题。storybook-smoke.mjs 若因本单过期，写进交回，由 SUB-201（M7）对齐。目视项：拖排与产品切换。browser-proof 会写 docs/verification，跑完按 C-9 还原。

### TCRN-DS-STORY-141 · 登入动画 ShellIntro：登入成功后播一次，登入卡第三版（标 128）收敛为顶带第二版（标 22），120 淡出 + 240 位移 + 100 纸升起 ≤ 700，只用 transform 与 opacity，刷新不重播，prefers-reduced-motion 下 0 次

1 张：TCRN-DS-SUB-187（父单 work:e2def1cb6cee96bcde0ea937）

#### TCRN-DS-SUB-187 · 登入动画读回渲染替换句：ShellIntroStory 的读回加上字典里已有的五语替换句

- 承接：R3-26（新；判断标经济，本包整包主力）
- 包 / 波：M9 / W4（主力）；包内第 1 张（TCRN-DS-SUB-187 → TCRN-DS-SUB-208）
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`
- 依赖：无
- 判据：141：story-content.tsx:650 的 ShellIntroStory 读回加一行 `<Text>`，渲染 K12 已进 `storybook-content-text.ts` 且五语齐的登入动画替换句（K12 问题 9、K5 问题 9；不新增字典键）；zh-CN、ja、ko、fr 页面上该句是对应语言，zh-CN 泄漏扫描对 shell-intro 0 条；storybook 单测与 storybook:smoke 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 注意：先读 runs/r2/problems/K12.md 第 9 条与 K12 交回，确认那句的键名再动手。story-content.tsx 本轮只在 M9（判断 §3.4 第 4 条）。

### TCRN-DS-STORY-142 · NavItem 图钉：24 常驻图钉位、钮 24 × 24 图标 16（名册 pin 描边 / 实心），hover 与获焦同现、aria-pressed、可见名「固定到顶带：<项名>」，分组、项、子菜单都可钉，rest 与 hover 文字盒宽相等

1 张：TCRN-DS-SUB-188（父单 work:27344937d9f099034b0c773e）

#### TCRN-DS-SUB-188 · 菜单引导列图标按板 .ic 的盒画：宽高 22、内距 3、border-box、贴轨道起点，字形左缘 19，Sheet 行按板核对

- 承接：R3-9（R2-27、R2-13 再返工；撤回 B2-2 与 C2-1③）
- 包 / 波：M3 / W1（主力）；包内第 1 张（TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180）
- 改动文件：`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/styles/shell-sheet.css.ts`（按需），`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`
- 依赖：无
- 判据：142 目的锚（B 段 NavItem 行 1:1）、138、149 prail：① shell.css.ts:455 `.tcrn-shell-menu .tcrn-nav-item > .tcrn-icon` 改为板 `.ic` 的盒（`docs/design/gplus-2026-10/tools/shell-screen.mjs:89`）：宽高 `calc(var(--tcrn-icon-size-md) + var(--tcrn-space-1h))`、内距 `calc(var(--tcrn-space-1h) / 2)`、`box-sizing: border-box`、贴轨道起点；字形 16、文字起点 48、行 32 不变。② Sheet 行（shell-sheet.css.ts:85 的 22 宽轨道）按板核对：板的 Sheet 行若也用 `.ic` 盒就同改，否则不改，核对结论写进交回。③ ShellMenu.test.tsx 断言盒 22 × 22、内距 3、border-box；DOM 量得盒左缘距面板 16、字形左缘 19。④ 一次做对的验收：门不改，真件 prail 的 12 个 run 读 icons 16、texts 48，与板相同（本地 shell-measure-proof 真件报告）；不做 B2-2 的 `justify-self: start`，不改门口径（§3.3）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
- 注意：M3 的首张。同波 M1 改 shell-measure 的读法，但不碰 prail；本单只改样式。真件 prail 仍非 16 时不改门，写出盒与字形的实测记 problems/M3.md。shell-measure-proof 会写 docs/verification，跑完按 C-9 还原。

### TCRN-DS-STORY-143 · 导航家族焕新：NavGroup 与 TreeNav 进完整菜单与下拉，Breadcrumb 进 PageHeader，Tabs 合一（Tabs / SectionTabs / ModuleTabs / ViewTabs / SegmentedNav 归一个家族），TocRail 与书签栏作为页内空间，SideNav、SideNavCollapseButton、TopBar、ProductSwitcher、ProductLauncher 经弃用期退役

5 张：TCRN-DS-SUB-189、TCRN-DS-SUB-190、TCRN-DS-SUB-191、TCRN-DS-SUB-192、TCRN-DS-SUB-193（父单 work:1b03f6ae2b1a9e080fde1432）

#### TCRN-DS-SUB-189 · contract:static 的测试不变式随豁免到期更新：families.json 列已全量检查的批次，NOT_CHECKED_HERE.C10 补 shellGeometryLiterals

- 承接：R3-6（R2-12 再返工；主线程问题 M3）
- 包 / 波：M2 / W1（主力）；包内第 3 张（TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191）
- 改动文件：`tests/contract-static-proof.test.mjs`，`scripts/contract-static-proof.mjs`，`docs/contract/families.json`
- 依赖：无
- 判据：135-GWT4、143（C1–C17）、140、146：① families.json 的 scope 加 `checkedBatches: [1, 2]`（默认名，B 类），`scope.batch` 的去留写明（并存时以 checkedBatches 为判定来源）；② validateExemptions（contract-static-proof.mjs:174）与测试第 517、524 行读同一字段：在列批次的家族不得有豁免，不在列的必须有；五族断言改为「在列批次的家族」（第一批五族加 navigation、shell、layout）；③ NOT_CHECKED_HERE.C10（第 81–92 行）写明 shellGeometryLiterals（shell-fidelity 的 shellGeometryLiteral 检查）；④ 测试加两条自检：给在列批次加一条豁免 → 报错；删掉不在列批次的一条豁免 → 报错；⑤ 一次做对的验收：`run contract:static` 的 `node --test` 一步退出 0，门脚本执行到底，报告余项只有 SUB-190 处理的 C11 34 条。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：families.json、exemptions.json、roles.json 本波只归 M2（共享登记处表）。豁免判定属判断 §3.4 第 1 条的 B 类授权，不恢复已删的豁免。

#### TCRN-DS-SUB-190 · C11 卡套卡按组合件的家族归属：同带两个家族根类时归组合件，只带 layout 根类的仍记 layout

- 承接：R3-7（R2-12 再返工；取 B 片方案 (a)）
- 包 / 波：M2 / W1（主力）；包内第 4 张（TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191）
- 改动文件：`scripts/contract-static-proof.mjs`，`tests/contract-static-proof.test.mjs`，`docs/contract/exemptions.json`
- 依赖：TCRN-DS-SUB-189（M2 包内靠前）
- 判据：143、146（C1–C17 卡套卡）：① C11 的静态层（contract-static-proof.mjs:661 一带）与 story 层（:959 一带）判卡套卡时，一个元素同时带两个家族根类（如 `section.tcrn-surface` 加组合件根类），归组合件的家族；ReadbackPanel（feedback，第 3 批）与 RecordInspector（inspection，第 5 批）的 34 条照列在报告里，按 exemptions.json 的 EX-INIT015-feedback、EX-INIT015-inspection 豁免；② exemptions.json 只改这两条的说明，写明 C11 的 34 条随第 3、5 批到期（不改 clauses、until 的语义）；③ 只带 layout 根类的卡套卡仍记 layout；测试加两条自检：Surface 套 Surface 判 layout 红、同带两个根类时归组合件家族；④ 一次做对的验收：contract:static 退出 0，报告里 34 条列为豁免、layout 族 0 条。方案 (b) 不做（越权）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：不碰第 3、5 批组件与其他家族的豁免（§3.3）。

#### TCRN-DS-SUB-191 · 把顶带登记为 C8 工具栏：容器 tcrn-shell-strip、让步项 tcrn-shell-pins、固定项标按钮与右簇，跑 C8 静态层与 story 层

- 承接：R3-8（新，门收紧；样式修补在 SUB-178）
- 包 / 波：M2 / W1（主力）；包内第 5 张（TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191）
- 改动文件：`docs/contract/roles.json`，`tests/contract-static-proof.test.mjs`，`docs/contract/clauses.md`（按需）
- 依赖：TCRN-DS-SUB-190（M2 包内靠前）
- 判据：143、140（C8）：① roles.json 的 `toolbars`（现为空）加一项：容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`（类名以 grep 核实，Navigation.tsx:2245 一带），字段形状按 checkC8（contract-static-proof.mjs:605–630）与 story 层（:861–917）的读法；② 跑 C8 静态层与 story 层，每条发现写进交回「C8 发现」，并标明「只需现有 token 补 min-width 或 flex-shrink 0」（交 SUB-178 在 shell.css.ts 补）或「需要板上没有的数值」（交 Owner，不自定数值）；③ 测试第 527 行的 toolbars 断言对新项成立；④ 本单不改样式：C8 只因样式未补而红时，contract:static 在 SUB-178 合入前红是预期（C-5），写明条数；clauses.md 第 115 行登记的「顶栏」若需改成顶带，只改那一行。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注意：C8 在壳层家族原无被测物（判断 §0 第 4 条）；登记属收紧（§3.4 第 1 条）。

#### TCRN-DS-SUB-192 · 导航项单行截断写进基础规则：.tcrn-nav-item__label 加 nowrap、ellipsis、overflow hidden、min-width 0，有文字就带 title

- 承接：R3-11（R2-5 再返工）
- 包 / 波：M3 / W1（主力）；包内第 3 张（TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180）
- 改动文件：`packages/ui-react/src/styles/base.css.ts`，`packages/ui-react/src/styles/shell.css.ts`，`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`
- 依赖：TCRN-DS-SUB-182（M3 包内靠前）
- 判据：143（C7）、142：① base.css.ts:343 `.tcrn-nav-item__label` 加 `white-space: nowrap`、`text-overflow: ellipsis`、`overflow: hidden`、`min-width: 0`；shell.css.ts:505 菜单规则里与之重复的声明删除（菜单特有的保留）；② NavItem 只要有文字就带 `title`（= 文字）；③ 单测覆盖菜单内（ShellMenu 里的 NavItem）与菜单外（SideNav 等独立 NavItem）两种：都单行截断、都带 title；④ 一次做对的验收：删掉菜单规则后，直跑 `contract-static-proof.mjs` 的 C7 静态层仍无发现（证明靠基础规则；`run contract:static` 在 SUB-189 合入前因测试不变式红，属既有红）；ui-react 单测、typecheck 退出 0；shell:fidelity 若因删重复声明过期，写进交回，由 SUB-204（M8，持有 shell-fidelity-proof.mjs）对齐。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
- 注意：Navigation.tsx 与 base.css.ts 走 M3 → M4（判断 §3.4 第 4 条）。

#### TCRN-DS-SUB-193 · TocRail 加可选标题层级（2 或 3，默认 3）：包件与单测

- 承接：R3-15 的包件部分（新，导出件 prop 面）
- 包 / 波：M4 / W2（主力）；包内第 2 张（TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178）
- 改动文件：`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`，`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`
- 依赖：TCRN-DS-SUB-184（M4 包内靠前）
- 判据：143、146、147：TocRail（DomainDisplay.tsx:1190）加 `headingLevel?: 2 | 3`（默认 3，名属 B 类），标题元素随之为 h2 或 h3，其余渲染不变；SUB-184 定的 nav 可及名仍取该标题；单测断言默认 h3、传 2 出 h2、nav 名不变；ui-react 单测与 typecheck 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
- 注意：文档页传 2 在 SUB-202（M7）。迁移条目（headingLevel 与默认值）写进交回。

### TCRN-DS-STORY-145 · ProductLockup 首行变体（第二版）：锁定块首行与标垂直居中，侧栏尺度标 22 + 字标 12.5/600，SVG 与文案取自 Brand 板 E 段原样，后缀 #2c63c8 两主题同色（夜间低于 4.5 记已知待裁）

2 张：TCRN-DS-SUB-194、TCRN-DS-SUB-195（父单 work:f19ca0b68e52842e947dcafc）

#### TCRN-DS-SUB-194 · data-logo 改写标的 id：首行与底栏锁定块的 data-logo 用 asset.markId，品牌资产门的比对键同包对齐

- 承接：R3-17（R2-4 再返工）
- 包 / 波：M4 / W2（主力）；包内第 4 张（TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178）
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`，`packages/ui-react/src/components/Navigation/Navigation.test.tsx`，`scripts/brand-asset-source-proof.mjs`
- 依赖：TCRN-DS-SUB-185（M4 包内靠前）
- 判据：145-GWT1、硬线「品牌资产 digest」、149-GWT1：① Navigation.tsx:630 与 :717 的 `data-logo` 改为 `asset.markId`（Mana → mana、DS → ds，与 logos2 文件名及 Brand 板一致）；按产品键选这两枚的测试同步改；② brand-asset-source-proof.mjs:143 的期望由 `file.productId` 改为该文件的标 id（第 61 行的 `mark.id`，即 logos2 文件名）——同包对齐期望（M2 约定，见 C-7 与 problems/decomposition.md 第 4 条）；③ 一次做对的验收：brand-asset:proof 退出 0；真件 shell-measure 的 brandDigest 对品牌首行 story 的 4 个 run 全绿（含 DS、Mana）；壳层门与板的口径不动。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：smoke.test.ts:1974 断言的 `data-logo="tms"` 不受影响（TMS 的标 id 与产品键相同），若不同写进交回由 SUB-208 对齐。shell-measure-proof 会写 docs/verification，跑完按 C-9 还原。迁移条目（data-logo 现为标的 id）写进交回。

#### TCRN-DS-SUB-195 · 品牌字标保持原样：首行锁定块的 __word、__suffix 进换字跳过表、台账与 axe 字标后缀表，三张名单载体一致

- 承接：R3-20（R2-19、R2-26 再返工）
- 包 / 波：M5 / W2（主力）；包内第 2 张（TCRN-DS-SUB-198 → TCRN-DS-SUB-195 → TCRN-DS-SUB-186）
- 改动文件：`apps/storybook/src/build/client-scripts.ts`，`scripts/lib/locale-invariant-ledger.mjs`，`scripts/internal-alpha-browser-proof.mjs`，`apps/storybook/src/smoke.test.ts`
- 依赖：TCRN-DS-SUB-198（M5 包内靠前）
- 判据：145-GWT2、145 符合性、147、硬线「品牌资产原样」：① client-scripts.ts:310 的跳过选择器与 locale-invariant-ledger.mjs 第 30 行起的 `exemptSubtreeSelectors` 加 `.tcrn-brand-lockup__word`；② internal-alpha-browser-proof.mjs:94 的 `AXE_WORDMARK_SUFFIX_SELECTORS` 加 `.tcrn-brand-lockup__suffix`（2026-10-11 D2 同一口径，不加别的选择器）；③ 第 2839 行一带的 `expectedDesignSystemSuffixByLocale` 各语言都取字标原样，描述行另查换字；④ smoke.test.ts 加一条测试：读三处源码里的名单，断言三张名单收的字标载体集合相同（不新增 package.json 脚本）；⑤ 一次做对的验收：本地复读 zh-CN 下 DS 首行不再换成「TCRN 设计系统」，shell-measure 的 markText 在 zh-CN 的读数与 en 相同（只剩 O-4 的 1.4）、brandDigest 绿；axe 不再报首行后缀；brandMarkLocaleChecks 全过。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：axe 豁免属判断 §3.4 第 1 条（执行 2026-10-11 D2）。browser-proof 与 shell-measure-proof 会写 docs/verification，跑完按 C-9 还原。目视项：zh-CN 首行。

### TCRN-DS-STORY-146 · PageHeader 必有（面包屑 + 标题 + 动作，单行截断加 title）；Surface、Divider、SplitView、DetailLayout、SettingsLayout 在纸内重排；文档与设置页内容居中 1040

1 张：TCRN-DS-SUB-196（父单 work:792b63bc73100197f6f41e96）

#### TCRN-DS-SUB-196 · singleLine 对纸内面包屑逐段读：收每一段 pageCrumb，每段照判单行、省略号与 title，夹具加溢出又无省略号的一段

- 承接：R3-3（R2-28 再返工）
- 包 / 波：M1 / W1（主力）；包内第 3 张（TCRN-DS-SUB-206 → TCRN-DS-SUB-207 → TCRN-DS-SUB-196）
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/package-menu.html`，`tests/fixtures/geometry-measure/shell/package-pages.html`，`tests/fixtures/geometry-measure/shell/mutations.json`，`tests/fixtures/geometry-measure/shell/manifest.json`，`docs/design/gplus-2026-10/measure-shell.js`（按需）
- 依赖：TCRN-DS-SUB-207（M1 包内靠前）
- 判据：146 几何门、143-GWT4、149-GWT1：① shell-measure.mjs:503 的 singleLine 载体不再收整条 `nav.tcrn-breadcrumb`（选择器 :174），改收每一段（:180 `pageCrumb` = `.tcrn-breadcrumb__crumb`），每段照判单行、溢出时有省略号且带 title；板侧 `.ts-crumbs` 同口径（:118、:126）。② 夹具（package-pages.html）加一段溢出又没有省略号的面包屑，证明判红；原有截断带 title 的面包屑判绿。③ 一次做对的验收：真件 ts-settings-m（50.6）、ts-roster-m（18.3）的 singleLine 由红转绿，D 段面包屑绿；原 label-plus-40 板变异仍判红；149-GWT4（tests/shell-measure-proof.test.mjs:274）仍等，不等时同一改动镜像到 measure-shell.js；阈值只在 THRESHOLDS，不改。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：M1 的末张。pageCrumbs 检查（截断带 title）不撤。真件运行会写 docs/verification，跑完按 C-9 还原。measure-shell.js 若镜像改过，写进交回「待发布清单」（量板用新版）。

### TCRN-DS-STORY-147 · Storybook 文档站改同一套顶带壳：文档壳只用包的 ProductShell 顶带态，删 tcrn-doc- 骨架的壳层部分、4 条文档作用域例外与 2 条重复选择器白名单项，文档目录改页内 TocRail，包外 tcrn- 类保持 0

8 张：TCRN-DS-SUB-197、TCRN-DS-SUB-198、TCRN-DS-SUB-199、TCRN-DS-SUB-200、TCRN-DS-SUB-201、TCRN-DS-SUB-202、TCRN-DS-SUB-203、TCRN-DS-SUB-204（父单 work:6fd15b4e5366871194d862ab）

#### TCRN-DS-SUB-197 · parity 的 package-nav-item 两侧量同一种行盒：普通行取 .tcrn-nav-item，可钉行取 .tcrn-nav-item-row

- 承接：R3-5（R2-25 再返工）
- 包 / 波：M2 / W1（主力）；包内第 2 张（TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191）
- 改动文件：`scripts/shell-parity-proof.mjs`
- 依赖：无
- 判据：140（R1 SUB-121）、147（判定人 parity）：① shell-parity-proof.mjs:46 的 package-nav-item 两侧都量行盒：普通行取 `.tcrn-nav-item`，可钉行取 `.tcrn-nav-item-row`（包装，右内距 4），按行是否可钉逐个配对；字段（minHeight、fontSize、四向 padding）与阈值不变；② 门内自检：把可钉行包装的右内距改成 0 → 判红；③ 一次做对的验收：shell:parity 退出 0（判断 2.9：本段只差 paddingRight 一处）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
- 注意：仓里没有 parity 的独立测试文件，自检写在门内（problems/decomposition.md 第 2 条）。

#### TCRN-DS-SUB-198 · browser-proof 的期望与时机：复现性比投影、禁用项读打开的屏、泄漏扫描等水合标记、describedby 多 id 逐个取

- 承接：R3-19（R2-26 再返工）
- 包 / 波：M5 / W2（主力）；包内第 1 张（TCRN-DS-SUB-198 → TCRN-DS-SUB-195 → TCRN-DS-SUB-186）
- 改动文件：`scripts/internal-alpha-browser-proof.mjs`，`apps/storybook/src/build/shell-hydrate.tsx`
- 依赖：无
- 判据：147、150（30.02、30.04）：① (b) 第 1385 行的 `openMenus === 6` 改为：两个探针的投影相等，且等于 DOM 派生的 `[aria-expanded="true"]` 数（第 1361 行）；② (c) 禁用项读回改读菜单打开的屏，或带禁用 NavItem 的页内样本（第 504 行一带），读到 ≥ 1 个禁用项及其说明；③ (d) shell-hydrate.tsx 在 hydrateRoot 提交后与每次换语言后，在每个 `[data-shell-hydrate]` 块写 `data-shell-hydrated="<当前语言>"`（C-12 默认名）；zh-CN 泄漏扫描（第 2615–2713 行一带）等全部块带上 zh-CN 标记再读；④ (e) aria-describedby 按空白拆开逐个取说明（第 2566 行；第 505 行已是拆法，两处统一）；⑤ 阈值不放宽；⑥ 一次做对的验收：同一构建连跑两次 browser-proof，泄漏条数相同；这四处在本地回执里不再红（只剩已登记的既有红时逐条写明）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：M5 的首张。browser-proof 会写 docs/verification，跑完按 C-9 还原。

#### TCRN-DS-SUB-199 · AOS 壳标题被判裁切：先读 browser-proof 的裁切判定定根因，是 story 塌陷就改视觉实例的画框或布局

- 承接：R3-23 的 story 侧（R2-23 再返工）
- 包 / 波：M6 / W2（主力）；包内第 2 张（TCRN-DS-SUB-205 → TCRN-DS-SUB-199 → TCRN-DS-SUB-200）
- 改动文件：`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`
- 依赖：无
- 判据：147、140、150：① 读 internal-alpha-browser-proof.mjs 第 351–410 行的 clippedButtonText 判定与 R1 探针（AOS 的 h3、h4 及其祖先高 0），在交回写明根因：A「story 塌陷」或 B「门读了不渲染的变体」，附读数；② A：在两份 aos 视觉实例里改画框或布局，三个视口的 AOS h3、h4 不再判裁切；B：不改 story，写清门该怎样按 R3-1 的口径只读渲染出的元素，交 SUB-203（M7）；③ 阈值不变；④ 一次做对的验收：A 时本地 browser-proof 三视口这两类标题 0 条裁切。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：browser-proof 本波归 M5，本单只读不改。跑完按 C-9 还原 docs/verification。

#### TCRN-DS-SUB-200 · AOS 搜索结果变体渲染打开的菜单与结果，查清 mobile-dark-zh-cn-work-queue 缺「工作项」的来源并在原处修

- 承接：R3-24（新；判断标经济，本包整包主力）
- 包 / 波：M6 / W2（主力）；包内第 3 张（TCRN-DS-SUB-205 → TCRN-DS-SUB-199 → TCRN-DS-SUB-200）
- 改动文件：`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`（按需）
- 依赖：TCRN-DS-SUB-199（M6 包内靠前）
- 判据：147、150（17）：① aos-frontend-shell-slice.tsx:49 `desktop-light-expanded-cockpit-search-results` 与 aos-owner-quality-product-shell.tsx:134 `desktop-light-operations-search-results` 用 SUB-147 的 `menuOpen`、`menuQuery` 渲染打开的完整菜单与结果（不再是收起的壳），storybook:smoke 的 openMenus 与 noHiddenOverflow 对这两个变体绿；② `mobile-dark-zh-cn-work-queue`（aos-owner-quality-product-shell.tsx:122）渲染出「工作项」（storybook-smoke.mjs:747 的 requiredText），交回写明丢在哪里（story 文案还是字典）并在原处修；③ smoke 期望不放宽；④ 一次做对的验收：storybook:smoke 第 17 段这两项归 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：storybook-content-text.ts 只在「工作项」确实丢在字典时改（本波只归 M6）。smoke.test.ts 若因本单过期写进交回，由 SUB-208（M9）对齐；storybook-smoke.mjs 若需改，交 SUB-201（M7）。

#### TCRN-DS-SUB-201 · 文档壳浮层换成水合的真件：受控 menuOpen、页内索引作 searchProvider、主题与语言接现有脚本，≤ 760 打开 Sheet

- 承接：R3-21（R2-22 再返工）
- 包 / 波：M7 / W3（主力）；包内第 1 张（TCRN-DS-SUB-201 → TCRN-DS-SUB-179 → TCRN-DS-SUB-202 → TCRN-DS-SUB-203）
- 改动文件：`apps/storybook/src/build/page-template.tsx`，`apps/storybook/src/build/client-scripts.ts`，`apps/storybook/src/build/shell-hydrate.tsx`，`scripts/storybook-smoke.mjs`，`scripts/internal-alpha-browser-proof.mjs`
- 依赖：TCRN-DS-SUB-184（M4）、TCRN-DS-SUB-185（M4）、TCRN-DS-SUB-195（M5）、TCRN-DS-SUB-186（M5）
- 判据：147（D1）、144、141：① 文档壳经挂载入口（shell-hydrate.tsx）水合真件 ProductShell：受控 `menuOpen`，`searchProvider` 读页内索引，`onThemeChange`、`onLocaleChange` 接 client-scripts 的现有脚本，保留 `data-doc-shell`（page-template.tsx:459）；文档层脚本对隐藏标记的开合、搜索、主题、语言操作删除（client-scripts.ts:531 一带）；② 视口 ≤ 760 打开的是 Sheet（壳根 `data-state="sheet"`），> 760 打开完整菜单面板；③ focus() 拦截（shell-hydrate.tsx:459 一带）按块 try / finally 还原，某块失败也放行其余块；④ storybook-smoke 与 browser-proof 的文档壳读法同包对齐（选择器与回执字段），门判定不改；M4、M5、M6 交回列出的 storybook-smoke 过期期望在本单一并对齐（M2 约定）；⑤ 一次做对的验收：390、760、761、1440 四个宽度实测（≤ 760 为 Sheet，> 760 为面板）写进交回；storybook:smoke、browser-proof、doc-shell:proof 与 storybook 单测退出 0（只剩 O-4 等已登记的既有红时逐条写明）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 注意：M7 的首张。client-scripts、shell-hydrate、browser-proof 走 M5 → M7，storybook-smoke 走 M3 → M7 → M9（判断 §3.4 第 4 条）。smoke.test.ts 若过期写进交回，由 SUB-208（M9）对齐。目视项：文档壳 Sheet（≤ 760）。

#### TCRN-DS-SUB-202 · 文档页 TocRail 传标题层级 2，heading-order 归 0

- 承接：R3-15 的 page-template 部分（新）
- 包 / 波：M7 / W3（主力）；包内第 3 张（TCRN-DS-SUB-201 → TCRN-DS-SUB-179 → TCRN-DS-SUB-202 → TCRN-DS-SUB-203）
- 改动文件：`apps/storybook/src/build/page-template.tsx`
- 依赖：TCRN-DS-SUB-193（M4）、TCRN-DS-SUB-179（M7 包内靠前）
- 判据：147（heading-order 归 0）、146：page-template.tsx:472 的 TocRail 传 `headingLevel={2}`（SUB-193 的默认名，落地改名照其交回）；一次做对的验收：本地 browser-proof 的 axe heading-order 节点为 0（R2 记 4）。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：browser-proof 会写 docs/verification，跑完按 C-9 还原。

#### TCRN-DS-SUB-203 · AOS 标题裁切的门侧：按 SUB-199 的结论，门只读渲染出的元素，阈值不变

- 承接：R3-23 的门侧（R2-23 再返工；只在 SUB-199 定为 B 时改代码）
- 包 / 波：M7 / W3（主力）；包内第 4 张（TCRN-DS-SUB-201 → TCRN-DS-SUB-179 → TCRN-DS-SUB-202 → TCRN-DS-SUB-203）
- 改动文件：`scripts/internal-alpha-browser-proof.mjs`
- 依赖：TCRN-DS-SUB-199（M6）
- 判据：147、140、150：SUB-199 交回定为 B「门读了不渲染的变体」时：clippedButtonText（第 351–410 行）只收 `getClientRects().length > 0` 的元素（R3-1 同口径），高为 0 的祖先下的标题不计；门内自检：渲染出且真被裁切的标题仍判红；一次做对的验收：三视口 AOS h3、h4 不再判裁切。定为 A 时本单不改代码，交回写「无需门侧改动」并附 SUB-199 的读数。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注意：M7 的末张。读法改动属判断 §3.4 第 1 条（R3-23）。

#### TCRN-DS-SUB-204 · 文档层弃用 token 换 G+ 新名，删 search-static 死规则、例外与白名单项，style-scale 与 icon-roster 去旧说法

- 承接：R3-27（R2-21、R2-24 再返工）
- 包 / 波：M8 / W3（主力）；包内第 1 张（TCRN-DS-SUB-204）
- 改动文件：`apps/storybook/src/alpha-styles.ts`，`apps/storybook/src/story-demo-styles.ts`，`apps/storybook/src/storybook.css`，`apps/storybook/src/internal-dev/overlay-family-lab/OverlayFamilyLab.tsx`，`scripts/shell-fidelity-proof.mjs`，`docs/style-scale.md`，`apps/storybook/src/contract-stories/gplus/icon-roster.tsx`，`docs/design/gplus-2026-10/doc-class-map.json`（按需）
- 依赖：TCRN-DS-SUB-178（M4）、TCRN-DS-SUB-192（M3）
- 判据：147：① 构建时的弃用 token 提示（build.tsx 第 23 行起调 `scripts/token-deprecation-notice.mjs`；集成分支实测 28 名 210 处，分布在 alpha-styles.ts、story-demo-styles.ts、storybook.css、OverlayFamilyLab.tsx 与 story-content.tsx 五个文件）对前四个文件为 0 处；story-content.tsx 的由 SUB-208 换；按 build → demo-styles:sync → build 跑；② 同一提交删 alpha-styles.ts:441–450 的 `.tcrn-doc-product-shell-search--static-display` 死规则、shell-fidelity-proof.mjs:372 的 EX-INIT015-doc-product-shell-search-static 例外与第 119–121 行的白名单项 `.tcrn-product-shell-search__results`；doc-class-map.json:39 的该类条目在 doc-shell:proof 要求时同改；③ docs/style-scale.md:234–246、278 不再举旧类名，icon-roster.tsx:1 的「37 icons」改 38；④ SUB-192 交回若列出 shell-fidelity 的过期期望，本单对齐；⑤ 一次做对的验收：`node scripts/token-deprecation-notice.mjs --label storybook apps/storybook/src apps/storybook/.storybook` 只剩 story-content.tsx；shell:fidelity、doc-shell:proof、tokens:proof 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
- 注意：demo-styles:sync 读 dist：先 build，再 sync，再 build（判断原文）；同一门不为求稳重复跑。storybook.css 走 M4 → M8（SUB-178 的 tokens-sync 改 token 块），本包从 M4 合入后的集成分支切出。

### TCRN-DS-STORY-148 · 第一批五样板换新壳：Typography、Icon、Actions、Inputs、Brand 的组合样板按顶带壳重渲染，补入成品画布各板 D 段；storybook-map 与 shellFrame 门改为顶带几何；矩阵 story 保持逐格一致

1 张：TCRN-DS-SUB-205（父单 work:bad748579e7b1b7f0773bd53）

#### TCRN-DS-SUB-205 · 样板画框里的壳与画框同高：StaticMarkup 包装层加 block-size 100%，壳高 640、纸内可滚、overlap 0

- 承接：R3-22（R2-23 再返工）
- 包 / 波：M6 / W2（主力）；包内第 1 张（TCRN-DS-SUB-205 → TCRN-DS-SUB-199 → TCRN-DS-SUB-200）
- 改动文件：`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`，`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`（按需）
- 依赖：无
- 判据：148-GWT2、149-GWT2、146：① 画框内的 StaticMarkup 包装层（matrix-renderer.tsx:253–257 的 `[data-gplus-static-markup]`）在样板画框里带 `block-size: 100%`，优先在 composition-one.tsx 一侧做，必要时改 matrix-renderer.tsx；不改壳组件；② 复量：五个样板的壳高 = 640（原 661、681），纸内可滚，geometry:measure 的 gplus 段 overlap 0，storybook:visual-proof 映射 4 行 overlap 归 0，shellFrame 与其余映射行仍绿；③ 视觉签名交 SUB-211 重收，本单不提交 docs/verification；④ 一次做对的验收：五个样板逐个的壳高读数写进交回。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注意：M6 的首张。geometry:measure 含壳层门真件，同波 M1 改读法，本单只看 gplus 段与 overlap，壳层门的红按既有红记。样板高度变化影响 story-budget 台账时写进交回，由 SUB-208（M9）以现测值对齐。

### TCRN-DS-STORY-149 · 壳层门：07b 板 G 段 18 条门（标按钮几何、品牌资产 digest、顶带、三缘对齐、固定项间距、接续、底栏居中、标旁文字居中、级联、无收起钮与常驻侧栏、图钉位无抖动、锁定块只装饰、每格对比度、单行与溢出、阴影模糊、登入动画、焦点回路、触摸端）接入 geometry-measure、verify 与 CI，每门一条会红的变异

2 张：TCRN-DS-SUB-206、TCRN-DS-SUB-207（父单 work:854cd021e8bb869b2b585fe0）

#### TCRN-DS-SUB-206 · pinJitter 与 story-label-plus-40 只读渲染出的元素：钉钮与文字宽只收有 client rect 的，label-plus-40 改选可见文字

- 承接：R3-1（R2-27 再返工；K7-6 不接受）
- 包 / 波：M1 / W1（主力）；包内第 1 张（TCRN-DS-SUB-206 → TCRN-DS-SUB-207 → TCRN-DS-SUB-196）
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/package-menu.html`，`tests/fixtures/geometry-measure/shell/package-pages.html`，`tests/fixtures/geometry-measure/shell/mutations.json`，`tests/fixtures/geometry-measure/shell/manifest.json`，`docs/design/gplus-2026-10/measure-shell.js`（按需）
- 依赖：无
- 判据：142-GWT1、149-GWT1（D 段图钉位）、137-GWT5：① shell-measure.mjs 第 404–405 行一带的钉钮尺寸与文字宽分组只收 `getClientRects().length > 0` 的元素；静止时 opacity 0 的钉钮照收（槽常驻是判据）；② package-menu.html 夹具补真件 DOM：≥ 1024 时按设计隐藏的已固定列（列里 4 个钉钮），证明旧读法红（读成 0×0）、新读法绿；③ mutations.json 第 149 行的 story-label-plus-40 改选 1440 下可见、不截断的文字（不再是隐藏列的组标题），在夹具上证明判红；撤轨道的变异保持判红；④ 一次做对的验收：真件 8 个菜单 run 的 pinJitter 绿；故事变异 22 / 22 判红；149-GWT4 仍等，不等才镜像到 measure-shell.js；阈值只在 THRESHOLDS，不改。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：M1 的首张。夹具 manifest 只在新增夹具屏或变异登记时改。真件运行会写 docs/verification，跑完按 C-9 还原。

#### TCRN-DS-SUB-207 · contrast 的底色按叠放取：对比度格按格中心 elementsFromPoint 的绘制栈往下合成到第一层不透明底

- 承接：R3-2（R2-27 再返工）
- 包 / 波：M1 / W1（主力）；包内第 2 张（TCRN-DS-SUB-206 → TCRN-DS-SUB-207 → TCRN-DS-SUB-196）
- 改动文件：`scripts/lib/shell-measure.mjs`，`scripts/shell-measure-proof.mjs`，`tests/shell-measure-proof.test.mjs`，`tests/fixtures/geometry-measure/shell/package-menu.html`，`tests/fixtures/geometry-measure/shell/package-pages.html`，`tests/fixtures/geometry-measure/shell/mutations.json`，`tests/fixtures/geometry-measure/shell/manifest.json`，`docs/design/gplus-2026-10/measure-shell.js`（按需）
- 依赖：TCRN-DS-SUB-206（M1 包内靠前）
- 判据：138 符合性、137-GWT5、139、149-GWT1：① shell-measure.mjs:199 的 effBg 只沿祖先取；对比度格（:680 一带）的底色改为按格中心 `document.elementsFromPoint` 的绘制栈往下合成到第一层不透明底（`own-bg` 等现有 fills 的语义不变）；期望值不改；② package-menu.html 夹具加叠放的 kbd（叠在 6% 墨洗 input 上的兄弟），证明旧读法（读到面板底，8.58、7.23）红、新读法绿；③ 一次做对的验收：与 R2 批末的 report.json（`docs/verification/shell-measure/report.json`，6f739b2）逐格比，只有 srch-kbd-l、srch-kbd-n 两格变到 7.59、6.11（±0.05），其余各格读数不变，差表写进交回；149-GWT4 仍等，不等才镜像。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 注意：measure-shell.js 是量测工具，不是板（判断组 A 说明）。

### TCRN-DS-STORY-150 · 4.0.0 候选：版本面、CHANGELOG 发布段、消费方迁移说明（第一批破坏性变化 + 壳层退役项）、pack 冒烟、Storybook 构建、Owner 目视验收清单（第一批与第二批合一）

4 张：TCRN-DS-SUB-208、TCRN-DS-SUB-209、TCRN-DS-SUB-210、TCRN-DS-SUB-211（父单 work:b140305693da159bfdc615c8）

#### TCRN-DS-SUB-208 · 清掉代码与文案的旧壳残留：AI 契约、oracle、content rows、文档壳控制表、aos 两份与 smoke 交叉检查，弃用名换新

- 承接：R3-28 的代码与文案部分（R2-29 再返工）；顺带换 story-content 的弃用 token 名（R3-27 余项）
- 包 / 波：M9 / W4（主力）；包内第 2 张（TCRN-DS-SUB-187 → TCRN-DS-SUB-208）
- 改动文件：`apps/storybook/src/build/ai-consumption-contract.ts`，`apps/storybook/src/build/foundation-visual-standards.ts`，`apps/storybook/src/contract-stories/content/navigation-rows.ts`，`apps/storybook/src/contract-stories/content/component-rows.ts`，`apps/storybook/src/contract-stories/story-content.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`，`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`，`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`，`apps/storybook/src/build/locales/storybook-content-text.ts`，`apps/storybook/src/build/locales/storybook-locale-text.ts`（按需），`scripts/storybook-smoke.mjs`，`apps/storybook/src/smoke.test.ts`，`scripts/lib/story-budget.mjs`（按需），`scripts/lib/locale-invariant-ledger.mjs`（按需）
- 依赖：TCRN-DS-SUB-187（M9 包内靠前）、TCRN-DS-SUB-201（M7）、TCRN-DS-SUB-200（M6）、TCRN-DS-SUB-204（M8）、TCRN-DS-SUB-184（M4）、TCRN-DS-SUB-186（M5）
- 判据：150、147、145（两主题同色）：① ai-consumption-contract.ts 第 31–33、224、435–450、1060、1077–1079 行与点名行之外仍按旧壳写的地方，按顶带壳与 M23 改写：弃用件写「已弃用，见 M23」；visualSkin、themeTransition 改顶带与纸；删宽度过渡与收起策略；② navigation-rows.ts:14 `navigationStrategyRows` 三行与 component-rows.ts:31 `storybookOnlyPrototypeRows` 改顶带壳；③ oracle 字段 `desktopSidebarWidthPx`（foundation-visual-standards.ts:576、621）等改名为顶带口径（新名属 B 类，交回写明），旧名留一个版本且与新名同值；文档壳控制表其余行同改；④ aos 两份的 collapsed 变体（aos-frontend-shell-slice.tsx:85 等）退役或改为现有态，`data-visual-instance-slots`（:492、aos-owner-quality-product-shell.tsx:613）改用顶带词汇；⑤ matrix-stories 与 story-content 的旧壳说法改为顶带壳与两主题同色；story-content.tsx 的弃用 token 名换 G+ 新名；⑥ storybook-smoke.mjs 的交叉检查、smoke.test.ts 与五语字典在本单同包改；另把 M4、M5、M6、M7、M8 交回列出的 smoke.test 与 storybook-smoke 过期期望在本单对齐，story-budget 台账行改为现测值（M2 约定）；⑦ 一次做对的验收：交回附「残留词 → 处置」表；token-deprecation-notice 扫 apps/storybook 为 0 名 0 处；storybook:smoke、storybook 单测、internal-alpha:contracts、internal-vocab:scan、scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：M9 的末张。browser-proof 第 958 行仍读旧 oracle 字段名；旧名留一个版本，本轮不改 browser-proof（M7 之后无持有者），写进交回。字典、台账、标题字典只在确需时改。internal-alpha:contracts 会写 docs/verification，跑完按 C-9 还原。

#### TCRN-DS-SUB-209 · 清掉纯文档里的旧壳残留：设计 README、storybook-map、契约 README、ui-tokens README 改顶带壳、两主题同色与四块 token

- 承接：R3-28 的纯文档部分（R2-29 再返工）；R3-18 的契约说明句（自 M4 移来，见第 2.4 节）
- 包 / 波：M10 / W4（主力）；包内第 1 张（TCRN-DS-SUB-209 → TCRN-DS-SUB-210）
- 改动文件：`docs/design/gplus-2026-10/README.md`，`docs/design/gplus-2026-10/storybook-map.md`，`docs/contract/README.md`，`packages/ui-tokens/README.md`
- 依赖：TCRN-DS-SUB-178（M4）、TCRN-DS-SUB-201（M7）
- 判据：150、145：① 设计 README:11 与 storybook-map.md:33、136：写两主题同色（#2c63c8）、夜间待 D7，O-3 行标「撤回」，去掉 #7aa0f5 与 rail-w；② ui-tokens README 第 38 行一带的 token 块：集成分支已写 four blocks，逐条核对四块（含粗指针块）的内容与 SUB-178 新设的 token；第 65 行的 #7aa0f5 说法改为两主题同色；③ 契约 README 写定：粗指针映射以 ui-tokens 的 `tcrnCoarsePointerTokens` 为唯一来源（R3-18 的契约说明句）、顶带登记为 C8 工具栏（SUB-191）、checkedBatches（SUB-189）；④ 本单文件集内写 37 件的地方改 38（icon-roster.tsx:1 归 SUB-204）；⑤ 一次做对的验收：本单文件集内 `git -C <包树> grep -n "7aa0f5\|rail-w"` 只剩写明「已撤回」或「已退役」的句子；scan 与 internal-vocab:scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 注意：M10 的首张。纯文档，不跑构建。新 token 名与粗指针说法以 SUB-178 交回为准。

#### TCRN-DS-SUB-210 · 迁移说明从 M38 起追加本轮条目，CHANGELOG 摘要同步

- 承接：R3-29（新；判断标经济，本包整包主力）
- 包 / 波：M10 / W4（主力）；包内第 2 张（TCRN-DS-SUB-209 → TCRN-DS-SUB-210）
- 改动文件：`docs/migration-4.0.md`，`CHANGELOG.md`
- 依赖：TCRN-DS-SUB-209（M10 包内靠前）、TCRN-DS-SUB-183（M3）、TCRN-DS-SUB-184（M4）、TCRN-DS-SUB-193（M4）、TCRN-DS-SUB-185（M4）、TCRN-DS-SUB-194（M4）、TCRN-DS-SUB-178（M4）、TCRN-DS-SUB-179（M7）、TCRN-DS-SUB-202（M7）
- 判据：150-GWT2、143、140：① docs/migration-4.0.md 现到 M37（第 1000 行），从 M38 起只追加（C-11）：R3-12（删 `--tcrn-motion-product-shell-search` 与 `typographyCss03`）、R3-14（landmarkLabel 覆盖全部地标、TocRail 的 nav 名）、R3-15（TocRail `headingLevel`）、R3-16（`menuShortcut`）、R3-17（data-logo 为标的 id）、R3-18（新 token 与 Icon 尺寸档），以及「previewStates 只供文档与测试使用」；名字与默认值照各包交回「迁移条目」；② 迁移说明末尾的来源说明（第 1129 行一带）与 CHANGELOG 摘要同步列出 M38 起各条；③ 不改别人写的条目；scaffold:proof（CHANGELOG 发布段）与 scan 退出 0。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：迁移说明与 CHANGELOG 本轮只由本单追加（判断 §3.4 第 4 条）。

#### TCRN-DS-SUB-211 · 批末生成物再生与清单校正（SUB-177 续做）：视觉基线按分类重收，生成物一次再生，owner-acceptance 改批末读数

- 承接：R3-30（R2-36 再返工；SUB-177 续做）
- 包 / 波：M11 / W5（主力）；包内第 1 张（TCRN-DS-SUB-211）
- 改动文件：`docs/verification/**`，`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`
- 依赖：TCRN-DS-SUB-196（M1）、TCRN-DS-SUB-191（M2）、TCRN-DS-SUB-180（M3）、TCRN-DS-SUB-178（M4）、TCRN-DS-SUB-186（M5）、TCRN-DS-SUB-200（M6）、TCRN-DS-SUB-203（M7）、TCRN-DS-SUB-204（M8）、TCRN-DS-SUB-208（M9）、TCRN-DS-SUB-210（M10）
- 判据：150（SUB-139、140、177）、149-GWT2、135-GWT4：其余各包合入后在同一构建上做。① nonVisualProofOk 为真后，按 K12 的分类重分视觉签名差异：A 类离群（maxCell > 40）在新的选择文件里逐条写理由并列为 Owner 目视项，用 `--update-visual-baseline <选择文件>` 应用（先把上一份应用记录改名留档，KB-022）；visual-signature-baseline.json:162–164 的 `table-work-index-spec` 三条以「已改名、注册表无此 id（b29f15f）」删除并记出处（机制不支持删除时，只对注册表外的 id 加删除处置）；nonVisualProofOk 仍为假就停在①，交回写明哪一步为假；② 一次再生：几何（geometry:proof、geometry:measure）、壳层门报告、映射（storybook:visual-proof）、契约与 API 清单（internal-alpha:contracts）、internal-alpha 回执（browser-proof、hardening）；③ owner-acceptance.md：第 178 行改批末读数，G-5（第 240 行）改现行读法，待裁表补齐 R1 §3.1 未进表各条与 O-16 至 O-18，G 行补本轮差距，各包交回的目视项补进表；④ 本单是本轮唯一提交 docs/verification 的单，visual-selection-result.json 不入仓。
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注意：R3 的最后一张。verify 不在本包跑，批末由主线程跑一次（O-18 获准才加 test:dom）。选择文件名照 docs/verification/internal-alpha 现有 visual-baseline-selection-r<n>.json 的样式新取，交回写明。
