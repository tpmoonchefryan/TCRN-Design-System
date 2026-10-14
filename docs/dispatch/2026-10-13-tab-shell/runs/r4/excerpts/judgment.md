# 摘录 · R4 判断（INIT-016）

本摘录由主线程切出。判断代理只读本摘录与下面点名的文件、节或行段；不整读拆分与分包文件。链上 Story 的 goal、acceptance 与 body 是任务权威（导出在会话 scratch `chain/src/TCRN-DS-STORY-<n>.json` 的 `fields`）。

## 1. 被判对象

- 集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`。R4 的 5 个包全部合入（`runs/state.md` 的 R4 包表）；批末 verify 结果表 `runs/r4/verify/steps.md`（30 步只剩 13 `contract:static` 的 C8 15 条（O-19）与 18 `geometry:measure` 的 markText（品牌首行锁定块 DS 1.4、底栏 TMS 锁定块 en 1.7，O-4）；**措辞更正**：steps.md 与 `runs/r4/problems/main.md` 写的「DS 侧栏首行」实为品牌首行锁定块，壳里没有侧栏，读数本身无误）。
- 三片验收：`runs/r4/acceptance/A.md`、`B.md`、`C.md`（文首有节行号）。一览：A——137–141 机判满足，135 阻于 O-19、136 阻于 O-8，返工 A4-1（只改 `owner-acceptance.md` 两处）；B——142、144 满足，143 阻于 O-19，145 阻于 O-4，146 部分（B4-1：Disclosure 内层裁切余量 2px 小于焦点环外扩 4px，获焦焦点环底边与起始边被裁，三视口与夜间同），返工 B4-1、B4-2（迁移说明 M30 末段过期）；C——147、150 机判满足，148 阻于 O-2，149 阻于 O-4 与 O-19，返工 C4-1（M30、`owner-acceptance.md` 第 201/208 行与 R3 离群表、`scripts/doc-shell-class-proof.mjs:147` 注释）、C4-2（两份门脚本里的退役件空读回，可推迟）。三片均无新 Owner 事项、无不可接受的口径。
- 问题来源：R4 拆分 `runs/r4/problems/decomposition.md`；各包 `runs/r4/problems/N*.md`；主线程 `runs/r4/problems/main.md`；跨包通告 `runs/r4/excerpts/cross-notes.md`。
- 上一轮：`runs/r3/judgment.md` §3.1 待裁 20 条（O-1…O-20）与 §3.4 口径；`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`。

## 2. 判断要遵守的规则

- 批量处理原则 v3：一轮的返工清单一次列全、同一根因合一条。**小轮合并**：若 R5 的实施包不超过 2 个，R5 的验收与判断由一个主力档代理一次完成（仍写验收、判断与 lessons 三份文件），并顺带写出下一轮的拆分文件；R5 的拆分由一个经济档代理做。
- 档位与升档：孤立修复起经济档、改共享契约起主力档；同一修复目标被退回 1 次升主力（B4-1 是 R4-3 的同一目标第一次退回，起主力），R5 再被退回交 Owner。
- 只有 Owner 能定的（A 类）：判据与范围的改动、破坏性动作、模型名、持久配置（含库门）、与既有裁定相抵、对外发布与推送、目视验收、设计正本的新画法、门判定语义的放宽。其余按建议先做（B 类）。
- START 质量硬线继续有效（「任何元素不超出裁切祖先」「焦点环」类违反要么进 R5、要么写清交 Owner 的理由）。
- 库门：DS 库现为 0 个门（S-1），Story 不转 done，只写注解。
- **收口判定**：若 R5 无可做返工（剩下的未满足项全部只等 Owner 或只属可推迟的无判据影响项），写明「R5 无返工、建议收口」，并逐项列阻点与 Owner 裁定后的改法与规模；若 R5 有可做返工，列清单、估规模，并写出「R5 做完后预计只剩哪些 Owner 阻点」。C4-2 这类不碰判据、可推迟的项，判断定是进 R5 还是记入收口的已知差距（写理由）。

## 3. 交付

写两份文件到集成树（不提交）：

1. `runs/r4/judgment.md`（不超过 40 KB，文首列各节行号）：
   - §1 R4 结论表：Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别（可返工 / 只有 Owner 能定）| R5 返工项编号 | Owner 目视项。
   - §2 R5 返工清单（若有）：编号 R5-1 起，每条写来源、现象、证据、改法、改动文件、依赖、档位、对应 Story 与 GWT；或写明「R5 无返工」与理由。
   - §3 只有 Owner 能定的事项：§3.1 待裁（O-1…O-20 逐条写现状与建议；本轮无新增则写明）；§3.2 知悉；§3.3 授权外；§3.4 按建议先做；§3.5 停点（推送、发版、部署、目视、库门、画布与 F 段发布）。
   - §4 链写计划：§4.1 R4 的 13 张 Subtask（SUB-212…224，现在都是 planned）哪些转 done（三步）、哪些保持由 R5 承接（两步，summary 写承接编号）；R1–R3 保持 active 的 Subtask 中承接项已满足的转 done；§4.2 Story 不转 done；§4.3 每张 Story 的注解 summary（不超过 160 字节）；§4.4 INIT-016 注解要点；§4.5 知识卡；§4.6 不在本次链写内的。
   - §5 R5 规模与分包建议（若有），或收口建议（若无）。
2. `runs/r4/lessons.json`：不超过 5 条，每条 `{subject, summary, snippet, body, tags, evidence}`，只写本轮新确立、可复用的事实与教训；不重复已有卡（TCRN-DS-KB-001…040 的主题，用 `node ~/.einzbern/engine/einzbern.mjs knowledge-list --workspace "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --at <UTC> --allow-trailing true --selection all --limit 200` 只读查）；本轮没有新教训可以少于 5 条。

只写这两份文件；探查脚本与输出放会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/judge-r4/`。不改集成树里任何别的文件，不跑 git 写命令，不运行会写链的引擎动词，不重跑门、不构建。

交回（最后一条回复，不超过 20 行）：§1 一览、R5 返工项条数与档位或「R5 无返工」、Owner 待裁条数、两份文件字节数。
