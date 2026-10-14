# 摘录 · R4 批末验收分片 C（STORY-147、148、149、150；EPIC-047 Storybook 壳 + EPIC-048 门 + EPIC-049 4.0.0 候选）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 682fc94。批末 verify 逐步跑在 682fc94：结果表 `runs/r4/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r4-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
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

## 3. R4 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-217 | STORY-147 | 视觉签名截图不受纸的滚动裁切：截图期间被截 story 不受纸裁、顶带移出截图区，截完复原并断言，门内自检高 story 的下半部不是整片画布底 | N2 |
| SUB-218 | STORY-147 | 文档页展开故事标题删 3px 强调色左边条：去掉 inset box-shadow 与随它加的 padding-left，展开态只由 chevron 旋转表达 | N3 |
| SUB-219 | STORY-147 | 删文档层 6 个无写入处的类与随之无用的 fidelity 白名单项：eyebrow、claim、doc-brand 连同两条放置规则、search-results/-result/-empty，style-scale 同步 | N3 |
| SUB-220 | STORY-147 | 文档层门的过期口径：smoke 删退役侧栏与切换钮的空读回，AOS 视觉实例删无人读的文案字段，selection-grammar 禁形补 G+ 名并自检 | N3 |
| SUB-221 | STORY-148 | storybook-map.json 与 md 同步：O-3 写已撤回，SHELL-D2 与 SHELL-D7 进 refs，DIFF-10 改现行，机读件写两主题同色 | N4 |
| SUB-222 | STORY-150 | 构建弃用提示只跳产物目录：token-deprecation-notice 按相对路径跳过构建产物，源码目录 apps/storybook/src/build 照扫，测试补样本 | N3 |
| SUB-223 | STORY-150 | ui-react README 图标件数改 38，迁移说明开头与三份分消费方清单跟上第二至四轮，从 M49 起追加 R4 各包的迁移条目，CHANGELOG 摘要同步 | N4 |
| SUB-224 | STORY-150 | 批末生成物再生与清单校正（SUB-211 在本轮的对应）：按新截法整批重收视觉签名基线，生成物一次再生，owner-acceptance 改本轮处置 | N5 |

每张 Subtask 的判据原文在 `runs/r4/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - N2：`runs/r4/handoff/N2.md`、`runs/r4/problems/N2.md`
  - N3：`runs/r4/handoff/N3.md`、`runs/r4/problems/N3.md`
  - N4：`runs/r4/handoff/N4.md`、`runs/r4/problems/N4.md`
  - N5：`runs/r4/handoff/N5.md`、`runs/r4/problems/N5.md`
- 拆分问题清单 `runs/r4/problems/decomposition.md`（「默认」列是已排进 Subtask 的做法）。
- 上一轮：验收 `runs/r3/acceptance/C.md`（本分片各 Story 上一轮的逐条 GWT 结论与证据口径）；判断 `runs/r3/judgment.md` §1 本分片各行与 §2 本轮承接的返工项（按 R4 编号 grep 后读该条）、§3.1 待裁的「不裁时的默认」与 §3.4 按建议先做的口径。本轮的验收要逐条核上一轮未满足或部分的 GWT 是否已由本轮返工解决；上一轮已满足的只核无回退。
- 主线程问题清单 `runs/r4/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r4/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r4/verify/steps.md`；复合步已逐段跑。
- 150 相关：`CHANGELOG.md`、`docs/migration-4.0.md`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`、各 `package.json` 版本面。

## 5. 交付

写 `runs/r4/acceptance/C.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 C4-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
