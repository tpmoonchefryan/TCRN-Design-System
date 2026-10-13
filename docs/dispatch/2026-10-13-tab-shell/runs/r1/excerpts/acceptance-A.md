# 摘录 · R1 批末验收分片 A（STORY-135、136、137、138、139、140、141；EPIC-044 壳层 Shell）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 5a82dc5。批末 verify 逐步跑在 63e1ee2：结果表 `runs/r1/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r1-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
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

## 3. R1 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-113 | STORY-135 | 壳 token：shell.* 与 motion.intro 进 tokens.json 与 ui-tokens，三条旧壳 token 经弃用别名退役 | P1a |
| SUB-114 | STORY-136 | 标按钮 ShellBrandButton 与壳样式模块 shell.css.ts：两版随宽度，134×40，示意 20，3.5% 墨洗 | P1a |
| SUB-115 | STORY-137 | 顶带固定项 ShellPins：32 高、三处间距 8、无分割线、上限 6、窄于 1024 收进菜单 | P1a |
| SUB-116 | STORY-138 | 完整菜单 ShellMenu 结构：接续 6、宽 952、搜索 40、三列行 32、底栏锁定块只装饰、无收起钮 | P1b |
| SUB-117 | STORY-138 | 完整菜单行为：一段即开、Esc 与点外部即收、⌘K 聚焦搜索、方向键、回焦标按钮 | P1b |
| SUB-118 | STORY-139 | 下拉 ShellDropdown 与三四级级联：接续 6、宽 240、搜索 sm 28、级联 +4 同宽同高、点击展开 | P1b |
| SUB-119 | STORY-140 | ProductShell 顶带态：撤 sidebar 与 O-1 几何，顶带 52、纸 12/52/14、右上簇、头像菜单切换产品 | P1c |
| SUB-120 | STORY-140 | 固定项偏好契约：RequestPreferences 去 collapsed 加 pins，控制器读写与拖排，迁移条目 | P1c |
| SUB-121 | STORY-140 | 顶带壳四个 story 登记，shell-parity 包侧与 geometry-proof 品牌和菜单检查改顶带几何 | P1d |
| SUB-122 | STORY-141 | 登入动画 ShellIntro：120 + 240 + 100 ≤ 700，只用 transform 与 opacity，每会话一次 | P5 |

每张 Subtask 的判据原文在 `runs/r1/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - P1a：`runs/r1/handoff/P1a.md`、`runs/r1/problems/P1a.md`
  - P1b：`runs/r1/handoff/P1b.md`、`runs/r1/problems/P1b.md`
  - P1c：`runs/r1/handoff/P1c.md`、`runs/r1/problems/P1c.md`
  - P1d：`runs/r1/handoff/P1d.md`、`runs/r1/problems/P1d.md`
  - P5：`runs/r1/handoff/P5.md`、`runs/r1/problems/P5.md`
- 拆分问题清单 `runs/r1/problems/decomposition.md`（25 条，「默认」列是已排进 Subtask 的做法）。
- 主线程问题清单 `runs/r1/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r1/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r1/verify/steps.md`；复合步已逐段跑。

## 5. 交付

写 `runs/r1/acceptance/A.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 A1-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
