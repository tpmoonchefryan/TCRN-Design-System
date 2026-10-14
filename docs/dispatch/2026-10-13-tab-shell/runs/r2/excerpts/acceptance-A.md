# 摘录 · R2 批末验收分片 A（STORY-135、136、137、138、139、140、141；EPIC-044 壳层 Shell）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 537ab3c。批末 verify 逐步跑在 6f739b2：结果表 `runs/r2/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r2-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不运行 einzbern 引擎。需要时可在会话 scratch 下写只读探查脚本（读 dist、源文件、回执、门报告与静态 Storybook 产物 `apps/storybook/storybook-static/`），脚本不入仓；也可用 Playwright 只读打开静态 Storybook 产物量 DOM（不改产物）。输出先写进 scratch 文件再按需读（每次不超过 200 行，超过 32 KB 的文件按节读）。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条 GWT 给证据（日志行、文件行、回执或门报告字段、探查读数）。Story 的判定人写有「Owner 目视」的，只给机器判据结论，不代签。
- 库门：DS 库现为 0 个门（S-1，待 Owner 在 Atelier 声明 `verify`），引擎因此拒绝 Story 转 done；这不影响验收结论，只影响链上转态。

## 2. 本分片 Story 的链上原文

- STORY-135：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-135.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-136：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-136.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-137：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-137.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-138：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-138.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-139：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-139.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-140：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-140.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-141：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-141.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- 裁定：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/MIN-SHELL.json`（D1–D7）与 `MIN-INIT016.json`（D8）。
- 设计正本（字节真值）：`docs/design/visual-standard/boards/Shell.dc.html`（07a）、`Shell-2.dc.html`（07b）；壳层数据 `docs/design/gplus-2026-10/tools/build-shell2.mjs`（`geoRows` 428–444、`contract` 445–470、`tokens` 471–491、`gates` 492–514，行号以合入前为准，按名 grep）。

## 3. R2 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-141 | STORY-135 | ui-tokens 同源测试改读 shell-screen.mjs 的板 CSS 默认值，pnpm test 不再停在首包 | K1 |
| SUB-142 | STORY-135 | 壳层几何字面值进 token：标 22、触摸 44、面包屑图标 11，粗指针切换移到 token 层，C10 扫描扩到 shell*.css.ts | K4 |
| SUB-143 | STORY-136 | 标按钮与首行：夜间后缀断言按 D7，字标列取内容宽不截 TMS，后缀 em 不越出 b | K1 |
| SUB-144 | STORY-138 | 底栏锁定块按 C-6 出 DOM：svg[data-logo]、b > em 与 small，侧栏尺度只留 brand.css.ts 一处 | K1 |
| SUB-145 | STORY-140 | 撤 O-1 残留与旧顶栏搜索尺寸，包样式表壳层段首加稳定标记 | K1 |
| SUB-146 | STORY-140 | 纸内滚动区可聚焦；铃铛悬停按 07a B 段改 6% 墨洗 | K1 |
| SUB-147 | STORY-140 | ShellMenu 受控搜索词与菜单分类说明，ProductShell 透传 | K6 |
| SUB-148 | STORY-140 | ProductShell 地标名按实例区分：landmarkLabel 作两个 nav 可及名前缀 | K6 |
| SUB-149 | STORY-140 | 固定项拖排：指针就地移位，键盘 Alt+← / Alt+→，onPinsReorder 接 movePin | K6 |
| SUB-150 | STORY-140 | 消费新 prop：已输入结果屏、searchOverlay 宿主与 open-menus 取 DOM、两类壳分传地标名、页内壳传层级 2、页模板传分类说明 | K11 |
| SUB-151 | STORY-141 | 静态页加客户端挂载：壳 story 与文档壳浮层水合真件，ProductShell 透传 previewStates，下拉静态桥退场 | K5 |

每张 Subtask 的判据原文在 `runs/r2/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - K1：`runs/r2/handoff/K1.md`、`runs/r2/problems/K1.md`
  - K11：`runs/r2/handoff/K11.md`、`runs/r2/problems/K11.md`
  - K4：`runs/r2/handoff/K4.md`、`runs/r2/problems/K4.md`
  - K5：`runs/r2/handoff/K5.md`、`runs/r2/problems/K5.md`
  - K6：`runs/r2/handoff/K6.md`、`runs/r2/problems/K6.md`
- 拆分问题清单 `runs/r2/problems/decomposition.md`（「默认」列是已排进 Subtask 的做法）。
- 上一轮：验收 `runs/r1/acceptance/A.md`（本分片各 Story 上一轮的逐条 GWT 结论与证据口径）；判断 `runs/r1/judgment.md` §1 本分片各行与 §2 本轮承接的返工项（按 R2 编号 grep 后读该条）、§3.1 待裁的「不裁时的默认」与 §3.4 按建议先做的口径。本轮的验收要逐条核上一轮未满足或部分的 GWT 是否已由本轮返工解决；上一轮已满足的只核无回退。
- 主线程问题清单 `runs/r2/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r2/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r2/verify/steps.md`；复合步已逐段跑。

## 5. 交付

写 `runs/r2/acceptance/A.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 A2-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
