# 摘录 · R2 判断（INIT-016）

本摘录由主线程切出。判断代理只读本摘录与下面点名的文件、节或行段；不整读拆分与分包文件。链上 Story 的 goal、acceptance 与 body 是任务权威（导出在会话 scratch `chain/src/TCRN-DS-STORY-<n>.json` 的 `fields`）。

## 1. 被判对象

- 集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`。R2 的 13 个包全部合入（各包提交与合入点见 `runs/state.md` 的 R2 包表）；批末 verify 结果表 `runs/r2/verify/steps.md`（含主线程核对过的事实；逐段日志在会话 scratch `r2-verify/`）。
- 三片验收：`runs/r2/acceptance/A.md`（STORY-135…141）、`B.md`（142…146）、`C.md`（147…150），文首有节行号，按节读。
- 问题来源：R2 拆分 `runs/r2/problems/decomposition.md`；各包 `runs/r2/problems/K*.md`（13 份）；跨包通告 `runs/r2/excerpts/cross-notes.md`。验收已经把各包问题按 Story 收过一遍，包问题文件只在验收没覆盖或需要核对时按条读。
- 上一轮：`runs/r1/judgment.md` §3.1 待裁 15 条（O-1…O-15，「不裁时的默认」列）与 §3.4 口径仍有效；R2 返工项编号 R2-1…R2-36 与 R2 拆分第 2 节的对照表。

## 2. 判断要遵守的规则

- 批量处理原则 v3（容器 AGENTS.md 第三部分）：一轮的返工清单一次列全、同一根因合一条；下一轮（R3）一次拆分、一次实施、批末一次 verify 与一次验收。
- 档位与升档：孤立修复起经济档、改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义、ProductShell 的 prop 面）起主力档；**R2 已返工过的同一修复目标在 R3 再返工的，一律主力档；R3 再被退回的交 Owner，不再派**。
- 只有 Owner 能定的（A 类）：判据与范围的改动、破坏性动作、模型名、持久配置（含库门）、与既有裁定（MIN-20261013-SHELL D1–D7、D8）相抵、对外发布与推送、目视验收、设计正本（成品画布）的新画法、门的判定语义放宽。其余按建议先做（B 类），收口回显、Owner 可事后更正。
- START 质量硬线继续有效；判断不得把硬线降级为「已知差距」。
- 库门：DS 库现为 0 个门（S-1），引擎拒绝 Story 转 done；验收满足的 Story 仍保持 active，链上只写注解。
- 收口判定：若批末红与未满足的 GWT 全部只剩「只有 Owner 能定」的项（例：O-4 墨迹中线口径使 markText 门对 DS 首行判红），判断要明确写「R3 无可做返工、建议收口」，并逐项列出阻点、证据与 Owner 裁定后的具体改法（谁改、改哪个文件、预计规模）。否则列 R3 返工清单。

## 3. 交付

写两份文件到集成树（不提交）：

1. `runs/r2/judgment.md`（不超过 48 KB，文首列各节行号）：
   - §1 R2 结论表：Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别（可返工 / 只有 Owner 能定）| R3 返工项编号 | Owner 目视项。
   - §2 R3 返工清单（若有）：按可成包的组排，每条写编号（R3-1 起）、来源、现象、证据、改法、改动文件、依赖、档位（按第 2 节升档规则）、对应 Story 与 GWT；凡不改就会让批末 verify 红、又不是只等 Owner 的项必须在列；同一根因只留一条。若无可做返工，写明「R3 无返工」与理由。
   - §3 只有 Owner 能定的事项：§3.1 待裁（沿用 R1 O-1…O-15 与本轮新增；每项附建议、不裁时的默认与裁定后的改法与规模）；§3.2 知悉；§3.3 授权外；§3.4 按建议先做（含各包交回「写明的选择」的接受与否）；§3.5 停点。
   - §4 链写计划：§4.1 R2 的 37 张 Subtask（SUB-141…177，现在都是 planned）哪些转 done（三步）、哪些保持并由 R3 承接（两步，写承接编号）；R1 保持 active 的 22 张（SUB-113…140 中未 done 的）是否可转 done（其承接的 R2 返工已满足时）；§4.2 Story 不转 done；§4.3 每张 Story 的注解 summary（不超过 160 字节）；§4.4 INIT-016 注解要点；§4.5 知识卡；§4.6 不在本次链写内的。
   - §5 R3 规模估计与分包建议（若有 R3），或收口建议（若无）。
2. `runs/r2/lessons.json`：不超过 5 条，每条 `{subject, summary, snippet, body, tags, evidence}`，只写本轮新确立、可复用到以后批次的事实与教训；不要重复已有卡（TCRN-DS-KB-001…030 的主题，用 `node ~/.einzbern/engine/einzbern.mjs knowledge-list --workspace "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --at <UTC> --allow-trailing true --selection all --limit 200` 只读查）。

只写这两份文件；探查脚本与输出放会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/judge-r2/`。不改集成树里任何别的文件，不跑 git 写命令，不运行会写链的引擎动词，不重跑门、不构建。

交回（最后一条回复，不超过 25 行）：§1 一览、R3 返工项条数（主力与经济各几、分几组）或「R3 无返工」、Owner 待裁条数、两份文件字节数。
