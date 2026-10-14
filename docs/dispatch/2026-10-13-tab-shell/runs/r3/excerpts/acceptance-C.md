# 摘录 · R3 批末验收分片 C（STORY-147、148、149、150；EPIC-047 Storybook 壳 + EPIC-048 门 + EPIC-049 4.0.0 候选）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD df740e6。批末 verify 逐步跑在 c45c529：结果表 `runs/r3/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r3-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不运行 einzbern 引擎。需要时可在会话 scratch 下写只读探查脚本（读 dist、源文件、回执、门报告与静态 Storybook 产物 `apps/storybook/storybook-static/`），脚本不入仓；也可用 Playwright 只读打开静态 Storybook 产物量 DOM（不改产物）。输出先写进 scratch 文件再按需读（每次不超过 200 行，超过 32 KB 的文件按节读）。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条 GWT 给证据（日志行、文件行、回执或门报告字段、探查读数）。Story 的判定人写有「Owner 目视」的，只给机器判据结论，不代签。
- 库门：DS 库现为 0 个门（S-1，待 Owner 在 Atelier 声明 `verify`），引擎因此拒绝 Story 转 done；这不影响验收结论，只影响链上转态。

## 2. 本分片 Story 的链上原文

- STORY-147：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-147.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-148：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-148.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-149：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-149.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- STORY-150：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/TCRN-DS-STORY-150.json`（`fields.goal`、`fields.acceptance`、`fields.body`）
- 裁定：`/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/chain/src/MIN-SHELL.json`（D1–D7）与 `MIN-INIT016.json`（D8）。
- 设计正本（字节真值）：`docs/design/visual-standard/boards/Shell.dc.html`（07a）、`Shell-2.dc.html`（07b）；壳层数据 `docs/design/gplus-2026-10/tools/build-shell2.mjs`（`geoRows` 428–444、`contract` 445–470、`tokens` 471–491、`gates` 492–514，行号以合入前为准，按名 grep）。

## 3. R3 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-197 | STORY-147 | parity 的 package-nav-item 两侧量同一种行盒：普通行取 .tcrn-nav-item，可钉行取 .tcrn-nav-item-row | M2 |
| SUB-198 | STORY-147 | browser-proof 的期望与时机：复现性比投影、禁用项读打开的屏、泄漏扫描等水合标记、describedby 多 id 逐个取 | M5 |
| SUB-199 | STORY-147 | AOS 壳标题被判裁切：先读 browser-proof 的裁切判定定根因，是 story 塌陷就改视觉实例的画框或布局 | M6 |
| SUB-200 | STORY-147 | AOS 搜索结果变体渲染打开的菜单与结果，查清 mobile-dark-zh-cn-work-queue 缺「工作项」的来源并在原处修 | M6 |
| SUB-201 | STORY-147 | 文档壳浮层换成水合的真件：受控 menuOpen、页内索引作 searchProvider、主题与语言接现有脚本，≤ 760 打开 Sheet | M7 |
| SUB-202 | STORY-147 | 文档页 TocRail 传标题层级 2，heading-order 归 0 | M7 |
| SUB-203 | STORY-147 | AOS 标题裁切的门侧：按 SUB-199 的结论，门只读渲染出的元素，阈值不变 | M7 |
| SUB-204 | STORY-147 | 文档层弃用 token 换 G+ 新名，删 search-static 死规则、例外与白名单项，style-scale 与 icon-roster 去旧说法 | M8 |
| SUB-205 | STORY-148 | 样板画框里的壳与画框同高：StaticMarkup 包装层加 block-size 100%，壳高 640、纸内可滚、overlap 0 | M6 |
| SUB-206 | STORY-149 | pinJitter 与 story-label-plus-40 只读渲染出的元素：钉钮与文字宽只收有 client rect 的，label-plus-40 改选可见文字 | M1 |
| SUB-207 | STORY-149 | contrast 的底色按叠放取：对比度格按格中心 elementsFromPoint 的绘制栈往下合成到第一层不透明底 | M1 |
| SUB-208 | STORY-150 | 清掉代码与文案的旧壳残留：AI 契约、oracle、content rows、文档壳控制表、aos 两份与 smoke 交叉检查，弃用名换新 | M9 |
| SUB-209 | STORY-150 | 清掉纯文档里的旧壳残留：设计 README、storybook-map、契约 README、ui-tokens README 改顶带壳、两主题同色与四块 token | M10 |
| SUB-210 | STORY-150 | 迁移说明从 M38 起追加本轮条目，CHANGELOG 摘要同步 | M10 |
| SUB-211 | STORY-150 | 批末生成物再生与清单校正（SUB-177 续做）：视觉基线按分类重收，生成物一次再生，owner-acceptance 改批末读数 | M11 |

每张 Subtask 的判据原文在 `runs/r3/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - M1：`runs/r3/handoff/M1.md`、`runs/r3/problems/M1.md`
  - M10：`runs/r3/handoff/M10.md`、`runs/r3/problems/M10.md`
  - M11：`runs/r3/handoff/M11.md`、`runs/r3/problems/M11.md`
  - M2：`runs/r3/handoff/M2.md`、`runs/r3/problems/M2.md`
  - M5：`runs/r3/handoff/M5.md`、`runs/r3/problems/M5.md`
  - M6：`runs/r3/handoff/M6.md`、`runs/r3/problems/M6.md`
  - M7：`runs/r3/handoff/M7.md`、`runs/r3/problems/M7.md`
  - M8：`runs/r3/handoff/M8.md`、`runs/r3/problems/M8.md`
  - M9：`runs/r3/handoff/M9.md`、`runs/r3/problems/M9.md`
- 拆分问题清单 `runs/r3/problems/decomposition.md`（「默认」列是已排进 Subtask 的做法）。
- 上一轮：验收 `runs/r2/acceptance/C.md`（本分片各 Story 上一轮的逐条 GWT 结论与证据口径）；判断 `runs/r2/judgment.md` §1 本分片各行与 §2 本轮承接的返工项（按 R3 编号 grep 后读该条）、§3.1 待裁的「不裁时的默认」与 §3.4 按建议先做的口径。本轮的验收要逐条核上一轮未满足或部分的 GWT 是否已由本轮返工解决；上一轮已满足的只核无回退。
- 主线程问题清单 `runs/r3/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r3/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r3/verify/steps.md`；复合步已逐段跑。
- 150 相关：`CHANGELOG.md`、`docs/migration-4.0.md`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`、各 `package.json` 版本面。

## 5. 交付

写 `runs/r3/acceptance/C.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 C3-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
