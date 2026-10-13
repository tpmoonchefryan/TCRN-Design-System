# 摘录 · R1 批末验收分片 B（STORY-142、143、144、145、146；EPIC-045 导航 + EPIC-046 品牌与布局）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 5a82dc5。批末 verify 逐步跑在 63e1ee2：结果表 `runs/r1/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r1-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不运行 einzbern 引擎。需要时可在会话 scratch 下写只读探查脚本（读 dist、源文件、回执、门报告与静态 Storybook 产物 `apps/storybook/storybook-static/`），脚本不入仓；也可用 Playwright 只读打开静态 Storybook 产物量 DOM（不改产物）。输出先写进 scratch 文件再按需读（每次不超过 200 行，超过 32 KB 的文件按节读）。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条 GWT 给证据（日志行、文件行、回执或门报告字段、探查读数）。Story 的判定人写有「Owner 目视」的，只给机器判据结论，不代签。
- 库门：DS 库现为 0 个门（S-1，待 Owner 在 Atelier 声明 `verify`），引擎因此拒绝 Story 转 done；这不影响验收结论，只影响链上转态。

## 2. 本分片 Story 的链上原文

- STORY-142：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-142.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-143：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-143.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-144：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-144.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-145：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-145.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-146：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-146.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- 裁定：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/MIN-SHELL.json`（D1–D7）与 `MIN-INIT016.json`（D8）。
- 设计正本（字节真值）：`docs/design/visual-standard/boards/Shell.dc.html`（07a）、`Shell-2.dc.html`（07b）；壳层数据 `docs/design/gplus-2026-10/tools/build-shell2.mjs`（`geoRows` 428–444、`contract` 445–470、`tokens` 471–491、`gates` 492–514，行号以合入前为准，按名 grep）。

## 3. R1 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-123 | STORY-142 | NavItem 与 NavGroup 图钉位 24、aria-pressed、无抖动；图标名册加 pin 37 → 38 并同步 Icon 板 | P2 |
| SUB-124 | STORY-143 | 导航家族归位一：Tabs 五形合一、Breadcrumb 进 PageHeader 单行截断、NavGroup 与 TreeNav 归面板 | P8 |
| SUB-125 | STORY-143 | 导航家族归位二：SideNav 等五件弃用退役、CSS 移出组件样式表、TocRail 归纸内 | P8 |
| SUB-126 | STORY-144 | 手机 Sheet：390 只留纯标与示意，Sheet 行与搜索 44，INC-399 门改量标按钮与 Sheet | P7 |
| SUB-127 | STORY-145 | ProductLockup 首行变体（第二版）：首行与标垂直居中，标 22 加 12.5/600，资产取 E 段原样 | P2 |
| SUB-128 | STORY-145 | TMS 后缀夜间回通过稿同色 #2c63c8：撤 O-3 夜间值，恢复夜间豁免并引 D7 | P4 |
| SUB-129 | STORY-146 | PageHeader 必有：ProductShell 类型层必填，纸内首行，面包屑单行截断加 title | P6 |
| SUB-130 | STORY-146 | 纸内布局重排：五件留白从纸缘起算，文档与设置页内容 1040 居中，间距取 token | P6 |

每张 Subtask 的判据原文在 `runs/r1/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - P2：`runs/r1/handoff/P2.md`、`runs/r1/problems/P2.md`
  - P4：`runs/r1/handoff/P4.md`、`runs/r1/problems/P4.md`
  - P6：`runs/r1/handoff/P6.md`、`runs/r1/problems/P6.md`
  - P7：`runs/r1/handoff/P7.md`、`runs/r1/problems/P7.md`
  - P8：`runs/r1/handoff/P8.md`、`runs/r1/problems/P8.md`
- 拆分问题清单 `runs/r1/problems/decomposition.md`（25 条，「默认」列是已排进 Subtask 的做法）。
- 主线程问题清单 `runs/r1/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r1/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r1/verify/steps.md`；复合步已逐段跑。

## 5. 交付

写 `runs/r1/acceptance/B.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 B1-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
