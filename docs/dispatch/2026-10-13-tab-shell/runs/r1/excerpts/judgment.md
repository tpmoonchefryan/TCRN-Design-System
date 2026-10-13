# 摘录 · R1 判断（INIT-016）

本摘录由主线程切出。判断代理只读本摘录与下面点名的文件、节或行段；不整读拆分与分包文件。链上 Story 的 goal、acceptance 与 body 是任务权威（导出在会话 scratch `chain/src/TCRN-DS-STORY-<n>.json` 的 `fields`）。

## 1. 被判对象

- 集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`。R1 的 18 个包全部合入（各包提交与合入点见 `runs/state.md` 的包表）；批末 verify 跑在 63e1ee2：30 步红 9、44 段红 12，`storybook:build` 退出 0（`runs/r1/verify/steps.md`，含主线程核对过的三处；逐段日志在会话 scratch `r1-verify/`）。
- 三片验收：`runs/r1/acceptance/A.md`（STORY-135…141）、`B.md`（142…146）、`C.md`（147…150），文首有节行号，按节读。
- 问题来源：拆分 `runs/r1/problems/decomposition.md`（25 条，默认列是已排进 Subtask 的做法）；主线程 `runs/r1/problems/main.md`（M1–M7）；各包 `runs/r1/problems/P*.md`（18 份）；跨包通告 `runs/r1/excerpts/cross-notes.md`。验收已经把各包问题按 Story 收过一遍，包问题文件只在验收没覆盖或需要核对时按条读。

## 2. 判断要遵守的规则

- 批量处理原则 v3（容器 AGENTS.md 第三部分）：一轮的返工清单一次列全、同一根因合一条，下一轮（R2）一次拆分、一次实施、批末一次 verify 与一次验收；不逐红开单。可以打断批的只有安全拒绝与硬阻塞。
- 档位：孤立修复起经济档（einzbern-economy，claude-opus-5-5 low）；改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义、ProductShell 的 prop 面）起主力档（einzbern-main，claude-opus-5-5 max）；同一修复目标被退回 1 次升主力，止于主力，再退回交 Owner。并行包上限 3，每包不超过 150 响应。
- 只有 Owner 能定的（A 类）：判据与范围的改动、破坏性动作、模型名、持久配置（含库门）、与既有裁定（MIN-20261013-SHELL D1–D7、D8）相抵、对外发布与推送、目视验收、设计正本（成品画布）的新画法。其余按建议先做（B 类），收口回显、Owner 可事后更正。门的判定语义变化（C-17）属于改共享契约，判断里明确给出接受或撤回。
- START 质量硬线（`docs/dispatch/2026-10-13-tab-shell/START-INIT-016.md`「质量硬线」节）继续有效；判断不得把硬线降级为「已知差距」。
- 库门：DS 库现为 0 个门（S-1，Owner 在 Atelier 声明），引擎拒绝 Story 转 done。验收结论满足的 Story 仍保持 active，链上只写注解；这一条不当作返工项。

## 3. 交付

写两份文件到集成树（不提交）：

1. `runs/r1/judgment.md`（不超过 48 KB，文首列各节行号）：
   - §1 R1 结论表：Story | 验收结论 | 机器判据是否已满足 | R2 返工项编号 | Owner 目视项。
   - §2 去重后的返工清单：按可成包的组排（组内按依赖顺序），每条写编号（R2-1 起）、来源（验收编号 / 问题编号）、现象、证据、改法、改动文件、依赖、建议档位、对应 Story 与 GWT。凡不改就会让批末 verify 红的项必须在列；同一根因只留一条。
   - §3 只有 Owner 能定的事项：§3.1 待裁（每项附建议与不裁时的默认做法）；§3.2 知悉；§3.3 授权外、不列返工；§3.4 按建议先做（实施侧自定，收口回显）；§3.5 停点（推送、发版、部署、目视、库门）。包交回里「写明的选择」逐条落到 §3.4（接受）或 §2（返工）。
   - §4 链写计划：§4.1 R1 的 28 张 Subtask 中哪些转 done（三步：ready → active → done）、哪些保持并由 R2 承接（写承接的返工编号）；§4.2 Story 不转 done（库门 0），只写注解；§4.3 每张 Story 的注解 summary（不超过 160 字节，写 R1 结论与 R2 编号）；§4.4 INIT-016 注解要点；§4.5 知识卡（对应 lessons.json）；§4.6 不在本次链写内的。
   - §5 R2 规模估计与分包建议（组 → 包、预计响应数、可并行的组、必须串行的依赖）。
2. `runs/r1/lessons.json`：不超过 5 条，每条 `{subject, summary, snippet, body, tags, evidence}`，只写本轮新确立的事实与教训（可复用到以后批次的），evidence 写仓内路径。

只写这两份文件；探查脚本与输出放会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/judge-r1/`。不改集成树里任何别的文件，不跑 git 写命令，不运行 einzbern 引擎，不重跑门、不构建。

交回（最后一条回复，不超过 25 行）：§1 一览、返工项条数（主力与经济各几、分几组）、Owner 待裁条数、R2 预计包数与响应数、两份文件字节数。
