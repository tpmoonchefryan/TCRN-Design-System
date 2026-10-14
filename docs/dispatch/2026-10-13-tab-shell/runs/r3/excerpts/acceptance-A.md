# 摘录 · R3 批末验收分片 A（STORY-135、136、137、138、139、140、141；EPIC-044 壳层 Shell）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD df740e6。批末 verify 逐步跑在 c45c529：结果表 `runs/r3/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r3-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
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

## 3. R3 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-178 | STORY-135 | 壳件与首行的几何字面值改用 token：图标走 Icon 尺寸档，12、11 进 shell 组，首行标 22、44 读 token，补顶带 C8 样式 | M4 |
| SUB-179 | STORY-138 | ⌘K 只打开一个壳（挂载与门）：壳 story 默认关，门按页面参数开被测屏，focusLoop 断言焦点在被测屏搜索框 | M7 |
| SUB-180 | STORY-139 | 下拉定位与级联回退补 DOM 用例：按固定层祖先定位、顶带尺寸变化后重定位、级联 ← 回到可见的打开行 | M3 |
| SUB-181 | STORY-140 | geometry-proof 的 searchOverlay 只计所在面板之外的碰撞，并断言该面板两主题底色不透明 | M2 |
| SUB-182 | STORY-140 | 纸内滚动区的焦点内收可见，兜底规则不再盖掉头像等壳件自带的焦点对，focusRingClipInPage 纳入纸内滚动区 | M3 |
| SUB-183 | STORY-140 | 删死变量与死规则：--tcrn-motion-product-shell-search 连同其断言、门期望与登记，typographyCss03 连同其登记 | M3 |
| SUB-184 | STORY-140 | 地标名按实例区分：landmarkLabel 作壳内全部具名地标的前缀，TocRail 的 nav 取标题作名，两份样板传不同名 | M4 |
| SUB-185 | STORY-140 | ⌘K 只打开一个壳（包件）：ProductShell 透传 menuShortcut（默认开）给 ShellMenu，README 的壳控制边界同步 | M4 |
| SUB-186 | STORY-140 | 文档页样板接上拖排与产品切换：shell-top-band 收起屏接控制器的本地偏好并传 products | M5 |
| SUB-187 | STORY-141 | 登入动画读回渲染替换句：ShellIntroStory 的读回加上字典里已有的五语替换句 | M9 |

每张 Subtask 的判据原文在 `runs/r3/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - M2：`runs/r3/handoff/M2.md`、`runs/r3/problems/M2.md`
  - M3：`runs/r3/handoff/M3.md`、`runs/r3/problems/M3.md`
  - M4：`runs/r3/handoff/M4.md`、`runs/r3/problems/M4.md`
  - M5：`runs/r3/handoff/M5.md`、`runs/r3/problems/M5.md`
  - M7：`runs/r3/handoff/M7.md`、`runs/r3/problems/M7.md`
  - M9：`runs/r3/handoff/M9.md`、`runs/r3/problems/M9.md`
- 拆分问题清单 `runs/r3/problems/decomposition.md`（「默认」列是已排进 Subtask 的做法）。
- 上一轮：验收 `runs/r2/acceptance/A.md`（本分片各 Story 上一轮的逐条 GWT 结论与证据口径）；判断 `runs/r2/judgment.md` §1 本分片各行与 §2 本轮承接的返工项（按 R3 编号 grep 后读该条）、§3.1 待裁的「不裁时的默认」与 §3.4 按建议先做的口径。本轮的验收要逐条核上一轮未满足或部分的 GWT 是否已由本轮返工解决；上一轮已满足的只核无回退。
- 主线程问题清单 `runs/r3/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r3/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r3/verify/steps.md`；复合步已逐段跑。

## 5. 交付

写 `runs/r3/acceptance/A.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 A3-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
