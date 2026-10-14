# 摘录 · R5 验收与判断（小轮合并，INIT-016）

本摘录由主线程切出。R5 只有两个实施包（Q1、Q2），按批量处理原则 v3 第 6 条的小轮合并，本轮的验收与判断由你一个主力档代理一次完成，仍分别写验收、判断与 lessons 三份文件；判断若定 R6 有返工，顺带写 R6 的拆分文件。只读本摘录与下面点名的文件、节或行段；不整读拆分、分包、判断与验收文件。链上 Story 的 goal、acceptance（GWT）与 body 是任务权威。

## 1. 被验与被判对象

- 集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，HEAD 60ff2ef（代码同 Q2 合入点 73bac9f；之后只提交调度记录）。R5 两包都已合入：Q1（SUB-225）合入点 a7d4ac8，Q2（SUB-226 → 227 → 228）合入点 73bac9f（包表见 `runs/state.md` 的 R5 节）。
- 批末 verify 逐步跑在 60ff2ef：结果表 `runs/r5/verify/steps.md`；逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/r5-verify/`（引用写作 `NN.MM log:行号`）；`storybook:build` 的日志与退出码在同目录 `storybook-build.log`、`storybook-build.exit`。R4 的同表 `runs/r4/verify/steps.md`（682fc94）是对照基线。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不跑 git 写命令，不运行会写库的引擎动词（`status`、`work-show`、`work-list`、`gates-config-list`、`knowledge-list` 这类只读动词可用）。需要时在会话 scratch 下的 `judge-r5/` 写只读探查脚本（读 dist、源文件、回执、门报告与静态 Storybook 产物 `apps/storybook/storybook-static/`），也可用 Playwright 只读打开静态产物量 DOM；脚本不入仓。输出先写进 scratch 文件再按需读，每次不超过 200 行，超过 32 KB 的文件按节读。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条给证据（日志行、文件行、回执或门报告字段、探查读数）。判定人写有「Owner 目视」的只给机器判据结论，不代签。

## 2. 库门的新状态（R5 开工时读到，主线程问题清单 `runs/r5/problems/main.md` M1–M3）

- Owner 已在 Atelier 声明 `verify`（command `["corepack","pnpm@10.12.1","run","verify"]`，root `.`，required、enabled 为真，releaseOnly 为假；covers 含 INIT-016 的 16 个与 INIT-015 的 12 个 Story id）。引擎已升到 2.0.3：已启用的必需门默认适用于库内每张 Story；Story 转 done 要求最新一次 `--work-id` 含该 Story 的门运行在当前树上全绿；树摘要 v2 只算该 Story 及其 Subtask 键号出现在提交信息里的提交碰过的路径。
- 按 START「库门」节对 INIT-015 的 12 张跑 `gates-run` 被拒（`GATES_PROJECT_UNKNOWN`）：本机设备登记里 DS 条目没有 projectId。补登记要写本机设备配置，主线程按 AGENTS.md 第五节交 Owner（M2 有完整命令）。START 写的「13 张」实为 12 张（M3）。
- INIT-016 的 16 张即使补了登记也过不了门：批末 verify 只要还有红步（R4 是第 13 步 C8 待 O-19、第 18 步 markText 待 O-4），`gates-run` 就是红。

## 3. 读什么

- Story 原文：会话 scratch `chain/src/TCRN-DS-STORY-<135…150>.json`（`fields.goal`、`fields.acceptance`、`fields.body`）；裁定 `chain/src/MIN-SHELL.json`（D1–D7）与 `MIN-INIT016.json`（D8）。
- R4 基线（按行段读）：`runs/r4/judgment.md` §1 结论表 L11–32、§2 R5-1…R5-4 L34–84、§3.1 待裁 O-1…O-20 L114–141、§3.2 知悉 L143–151、§3.3 L153–159、§3.4 按建议先做 L161–186、§3.5 停点 L188–193、§4 链写格式 L195–268；R4 验收分片 `runs/r4/acceptance/{A,B,C}.md`（文首有节行号，只在需要某条 GWT 的上一轮证据口径时按节读）。
- R5 拆分：`runs/r5/decomposition.md` 第 1 节跨包约定 C-1…C-17（L9–34，按需）、第 2 节总览（L35–85）、第 3 节四张 Subtask 的判据（SUB-225 L92–113、SUB-226 L119–130、SUB-227 L136–149、SUB-228 L150–159）；`runs/r5/packages.md`（局部门与共享文件先后）。
- R5 包的交回与问题：`runs/r5/handoff/Q1.md`（第 2 节④读数 L37–84、第 3 节 L117–126、第 4 节 C-9 L128–136、第 5 节目视项 L138–147）、`runs/r5/handoff/Q2.md`（第 2 节 SUB-226 L15–22、第 3 节 SUB-227 L23–63、第 4 节 SUB-228 新行号 L64–83、第 5 节局部门 L84–98、第 6 节接口与 C-9 L99–113、第 7 节给验收 L114–120）；`runs/r5/problems/{decomposition,Q1,Q2,main}.md`；跨包通告 `runs/r5/excerpts/cross-notes.md`。
- 被改的文档：`CHANGELOG.md`、`docs/migration-4.0.md`（M53 与开头区间、分消费方清单、末尾轮次说明）、`scripts/doc-shell-class-proof.mjs` 第 147 行、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`（421 行上下，按 Q2 交回的新行号读改动处）。
- 本 INIT 改过的设计文件（给收口的 STORY-148 发布清单）：`git -C <工作树> diff --name-only 69aa195..HEAD -- docs/design`（69aa195 是候选分支切出时的 main）。

## 4. 规则

- 批量处理原则 v3：返工清单一次列全、同一根因合一条。小轮合并照上文。R6 若有返工：R6 拆分由你顺带写（Subtask 键号从 `TCRN-DS-SUB-229` 起，包名用 S1、S2…，写 `runs/r6/decomposition.md`、`subtasks.json`、`subtasks-batch.json`（schema `tcrn.work-batch.v1`，只含 work-create，summary 不超过 160 字节，parentId 取 Story 导出的 `record.id`）、`packages.md`、`problems/decomposition.md`，格式照 `runs/r5/` 同名文件）。
- 升档与转交：R5-1（Q1）是 R4-3 同一修复目标第一次退回后的升档返工；它若仍不满足，不再派，按 START 交 Owner（写清证据与建议）。Q2 的项被退回升主力。
- 只有 Owner 能定的（A 类）：判据与范围的改动、破坏性动作、模型名、持久配置（含库门与本机设备登记）、与既有裁定（MIN-20261013-SHELL D1–D7、D8）相抵、对外发布与推送、目视验收、设计正本的新画法、门判定语义的放宽、执行方法的增删改。其余按建议先做（B 类）。
- START 质量硬线继续有效。
- 回执的批末再生：Q2 问题 3 记 `docs/verification/scaffold-proof.json` 的输入摘要自 R3 起与现文件不符（读数与判定未变），verify 每次都会改写它；INIT-015 收口时按 J-3 只在收口提交后刷新了 no-overclaim 回执。判断定收口时是否连同 scaffold-proof.json 一起提交再生的回执（批量处理原则 v3 第 4 条：生成物批末各做一次），并据此写清 Owner 跑库门时 START「库门」第 3 步的收干净清单（批末 verify 改写了哪些已跟踪文件、新生成了哪些未跟踪文件，见会话 scratch `r5-verify/status-after.txt` 与 `diff-stat.txt`）。
- 收口判定：若 R6 无可做返工（剩下的未满足项全部只等 Owner，或只属不碰判据、可推迟的项），写明「R6 无返工、建议收口」，并在判断 §5 给出收口材料；若 R6 有可做返工，列清单、估规模，写出「R6 做完后预计只剩哪些 Owner 阻点」，并写 R6 拆分文件。

## 5. 交付（写进工作树，不提交）

1. `runs/r5/acceptance/R5.md`（不超过 40 KB，文首列各节行号）：
   - §1 一览：16 张 Story 每张一行：Story | R5 结论 | 与 R4 相比的变化 | 未满足或部分的 GWT | 返工项数。
   - §2 R5 四张 Subtask 逐条判据是否达成（包自报与实测不一致时以实测为准并写明）：SUB-225 对 146 的 START 硬线「任何元素不超出裁切祖先」与焦点可见要复核（R4 B4-1 的同一读法）；SUB-226 对 147 的 SUB-219 判据④；SUB-227、SUB-228 对 150（M53、CHANGELOG、`owner-acceptance.md` 与 R4、R5 批末读数一致）。
   - §3 其余 Story 无回退的核对：批末 verify 与 R4 逐步比；`git diff 682fc94..HEAD -- packages apps scripts docs/design` 的改动面落到哪些 Story。
   - §4 返工清单（编号 R5A-1 起，写现象、证据、改法、改动文件、建议档位）；§5 新的 Owner 事项；§6 Q1、Q2 交回物里「写明的选择」逐条判可接受 / 有条件 / 不可接受；§7 证据盲区。
2. `runs/r5/judgment.md`（不超过 40 KB，文首列各节行号）：
   - §1 R5 结论表：Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别（可返工 / 只有 Owner 能定）| R6 返工项 | Owner 目视项。
   - §2 R6 返工清单（编号 R6-1 起）或「R6 无返工」与理由。
   - §3 只有 Owner 能定的事项：§3.1 待裁（O-1…O-20 逐条写现状与建议；本轮新增从 O-21 起，例如本机设备登记；每项附不裁时的默认、裁后改法与规模、挡住哪一步）；§3.2 知悉；§3.3 授权外；§3.4 按建议先做；§3.5 停点（推送、发版、部署、目视、库门运行与本机登记、画布与 F 段发布、INIT-015 的 12 张）。
   - §4 链写计划（主线程一次 work-batch；表格式照下，主线程脚本按它解析）：
     - §4.1 Subtask。SUB-225…228 现在都是 planned：满足的一张一行，`| SUB-2NN | work:<id> | R5 验收满足：… |`（三步 ready → active → done，前两步 summary 由主线程写「R5 包已合入集成分支，批末验收已出」）；不满足的 `| SUB-2NN | work:<id> | R5 部分满足：… |`（两步到 active）。R4 留下由 R5 承接的 SUB-216（work:fc422bdf469d7f7fdc966381）与 SUB-219（work:4faddab0a4c1b0c5e65acde1），现在是 active：承接项满足的写 `| SUB-216 | work:… | R5 承接项满足：… |`（一步 → done），不满足的写明保持。R1–R3 留下的 9 张 active（113、114、125、127、137、142、155、178、191）承接的都是 Owner 项，写明是否仍只等 Owner。
     - §4.2 Story 不转 done 的理由（库门运行被拒与 verify 红步各挡哪几张）。
     - §4.3 Story 注解：`| Story | id | summary |`，16 行，每行 `| 1NN | work:<id> | R5 … |`，summary 以「R5 」开头、不超过 160 字节（id 取 Story 导出的 `record.id`）。
     - §4.4 INIT 注解：两行 `- INIT-016 summary：「…」` 与 `- INIT-015 summary：「…」`（各不超过 160 字节；INIT-016 写收口摘要或 R6 状态，INIT-015 写库门与 12 张的状态），另写 INIT-016 的正文要点。
     - §4.5 知识卡（列 lessons 的主题）；§4.6 不在本次链写内的。
   - §5 若「R6 无返工」：收口材料——(a) 16 张 Story 的收口结论表（Story | 机器判据结论 | 证据路径 | 待 Owner 的事）；(b) 已知差距（R4 判断 §3.2、§3.4 第 7、8 条的各项，加上 R5 新增的，每条写交给谁、可清理条件）；(c) Owner 停点与建议动作（本机登记命令、之后 INIT-015 的 12 张怎么跑门与转态、INIT-016 在 O-19 与 O-4 裁定和返工后怎么合入主检出跑门转 16 张、目视验收按 `owner-acceptance.md`、推送与发版）；(d) STORY-148 等改过的设计文件清单，交设计会话发布（成品板、草案板、`canvas.json`、`heights.json` 与生成工具分开列）。若 R6 有返工：§5 写 R6 规模与分包建议。
3. `runs/r5/lessons.json`：不超过 5 条，每条 `{subject, summary, snippet, body, tags, evidence}`，只写本轮新确立、可复用的事实与教训；不重复已有卡（TCRN-DS-KB-001…045，用 `node ~/.einzbern/engine/einzbern.mjs knowledge-list --workspace "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --allow-trailing true --selection all --limit 200` 只读查；若该动词报 `--at` 缺失就补 `--at <当前 UTC>`）。没有新教训可以少于 5 条。
4. 仅当 R6 有返工：R6 拆分文件（见第 4 节）。

只写这些文件；探查脚本与输出放 scratch `judge-r5/`。

交回（最后一条回复，不超过 20 行）：§1 一览、R6 返工项条数与档位或「R6 无返工」、Owner 待裁条数（含新增）、各文件字节数。
