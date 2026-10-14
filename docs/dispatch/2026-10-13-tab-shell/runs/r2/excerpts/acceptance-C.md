# 摘录 · R2 批末验收分片 C（STORY-147、148、149、150；EPIC-047 Storybook 壳 + EPIC-048 门 + EPIC-049 4.0.0 候选）

本摘录由主线程切出。验收子代理只读本摘录与下面点名的文件、节或行段；不整读拆分、分包文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 537ab3c。批末 verify 逐步跑在 6f739b2：结果表 `runs/r2/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r2-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。
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

## 3. R2 落到本分片的 Subtask

| Subtask | Story | 标题 | 包 |
| --- | --- | --- | --- |
| SUB-165 | STORY-147 | .story-body 比对副本不再压过壳层段：纳入三类壳层段并排其后 | K2 |
| SUB-166 | STORY-147 | 运行时换字只跳过品牌字标；zh-CN 变更日志单一来源；语言列表 Esc 不连带关头像菜单 | K2 |
| SUB-167 | STORY-147 | shell-fidelity 漂移与文档层弃用 token：删知识库壳块与重复选择器，演示框改类名 | K2 |
| SUB-168 | STORY-147 | 文档与 Storybook 门按新家族改期望：parity、smoke、索引当前项、railReachability、文档壳契约、selection-grammar | K3 |
| SUB-169 | STORY-147 | browser-proof 三处：放行未截断的 C7 载体，axe 豁免加字标后缀，回执逐页只留失败项并自检体积 | K3 |
| SUB-170 | STORY-147 | 页模板改按段首标记切壳层段 | K5 |
| SUB-171 | STORY-147 | story-content.tsx 的读回文字改顶带壳与两主题同色说法 | K8 |
| SUB-172 | STORY-148 | visual-standard/canvas.json 的板高与后续各板 y | K8 |
| SUB-173 | STORY-148 | apps/storybook 单测与样板五语文案改顶带壳 | K12 |
| SUB-174 | STORY-149 | 壳层门读法与判定补齐：contrast 豁免格只列不比并补三类读法，pinJitter、prail 与 css-template 正则 | K7 |
| SUB-175 | STORY-149 | shell-matrix 的高度、台账与所属页治理元数据 | K8 |
| SUB-176 | STORY-150 | 契约文字、oracle、content rows、台账与 #7aa0f5 残留改顶带壳与两主题同色说法 | K9 |
| SUB-177 | STORY-150 | 批末生成物一次再生，验收清单同步 | K12 |

每张 Subtask 的判据原文在 `runs/r2/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。拆分第 1 节是跨包约定 C-1…（按需读）。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回物与问题文件：
  - K12：`runs/r2/handoff/K12.md`、`runs/r2/problems/K12.md`
  - K2：`runs/r2/handoff/K2.md`、`runs/r2/problems/K2.md`
  - K3：`runs/r2/handoff/K3.md`、`runs/r2/problems/K3.md`
  - K5：`runs/r2/handoff/K5.md`、`runs/r2/problems/K5.md`
  - K7：`runs/r2/handoff/K7.md`、`runs/r2/problems/K7.md`
  - K8：`runs/r2/handoff/K8.md`、`runs/r2/problems/K8.md`
  - K9：`runs/r2/handoff/K9.md`、`runs/r2/problems/K9.md`
- 拆分问题清单 `runs/r2/problems/decomposition.md`（「默认」列是已排进 Subtask 的做法）。
- 上一轮：验收 `runs/r1/acceptance/C.md`（本分片各 Story 上一轮的逐条 GWT 结论与证据口径）；判断 `runs/r1/judgment.md` §1 本分片各行与 §2 本轮承接的返工项（按 R2 编号 grep 后读该条）、§3.1 待裁的「不裁时的默认」与 §3.4 按建议先做的口径。本轮的验收要逐条核上一轮未满足或部分的 GWT 是否已由本轮返工解决；上一轮已满足的只核无回退。
- 主线程问题清单 `runs/r2/problems/main.md`（集成、调度、跨包消息与交 Owner 的项）。
- 跨包通告 `runs/r2/excerpts/cross-notes.md`（各包给下游的接口与已知红）。
- 批末 verify：`runs/r2/verify/steps.md`；复合步已逐段跑。
- 150 相关：`CHANGELOG.md`、`docs/migration-4.0.md`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`、各 `package.json` 版本面。

## 5. 交付

写 `runs/r2/acceptance/C.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号）：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 与符合性判据的结论与证据；各 Subtask 判据是否达成（包自报与实测不一致时以实测为准并写明）；START 质量硬线（壳内常驻侧栏与收起钮 0、顶带无底无线中线 26、三处间距相等、接续 6、锁定块只装饰、品牌资产 digest、标旁文字中线、登入动画只用 transform 与 opacity）逐条核。
3. 返工清单：编号 C2-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面——起主力，孤立修复起经济）。同一根因合一条。
4. 只有 Owner 能定的事项：新发现的（含目视项、设计待定项）与建议。
5. 实施口径判定：本分片各包交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
