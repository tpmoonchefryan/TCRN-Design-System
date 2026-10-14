# 摘录 · R3 判断（INIT-016）

本摘录由主线程切出。判断代理只读本摘录与下面点名的文件、节或行段；不整读拆分与分包文件。链上 Story 的 goal、acceptance 与 body 是任务权威（导出在会话 scratch `chain/src/TCRN-DS-STORY-<n>.json` 的 `fields`）。

## 1. 被判对象

- 集成分支 `claude/init016-tab-shell`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`。R3 的 11 个包全部合入（各包提交与合入点见 `runs/state.md` 的 R3 包表）；批末 verify 结果表 `runs/r3/verify/steps.md`（30 步只剩 13 `contract:static` 与 18 `geometry:measure` 两步红；逐段日志在会话 scratch `r3-verify/`）。
- 三片验收：`runs/r3/acceptance/A.md`（STORY-135…141）、`B.md`（142…146）、`C.md`（147…150），文首有节行号，按节读。三片的一览：A——137…141 机判满足、135（C8）与 136（D7）阻于 Owner，返工 A3-1、A3-2；B——142、144 满足，143 部分（C8、families.json 漏登 9 个根类），145 部分（O-4、data-logo 产品键、storybook-map.json），146 阻于 O-4，返工 B3-1…B3-3；C——150 机判满足，147 部分（展开故事标题 3px 左边条违反禁用清单、视觉签名截图盲区），148 阻于 O-2，149 阻于 O-4 与 C8，返工 C3-1…C3-6。
- 问题来源：R3 拆分 `runs/r3/problems/decomposition.md`；各包 `runs/r3/problems/M*.md`（11 份）；主线程 `runs/r3/problems/main.md`（M1–M4；**更正**：批末 C8 实为 15 条——静态 1、story 层 14——不是 18；markText 的失败读数除 DS 侧栏首行 1.4，还有底栏 TMS 锁定块 en 1.7，两处同根，都等 O-4）；跨包通告 `runs/r3/excerpts/cross-notes.md`。
- 上一轮：`runs/r2/judgment.md` §3.1 待裁 18 条（O-1…O-18）与 §3.4 口径仍有效；R3 返工项 R3-1…R3-30 与 R3 拆分第 2 节对照表；`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`（M11 更新到 R3 批末读数，含 G-15…G-21 与 24 个离群值目视项）。

## 2. 判断要遵守的规则

- 批量处理原则 v3：一轮的返工清单一次列全、同一根因合一条；下一轮（R4）一次拆分、一次实施、批末一次 verify 与一次验收。
- 档位与升档：孤立修复起经济档、改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义、ProductShell 的 prop 面）起主力档；**R2、R3 已返工过的同一修复目标在 R3 仍不满足的，不再派，转交 Owner（写清证据与建议）**；本轮新发现的目标可以进 R4。
- 只有 Owner 能定的（A 类）：判据与范围的改动、破坏性动作、模型名、持久配置（含库门）、与既有裁定（MIN-20261013-SHELL D1–D7、D8）相抵、对外发布与推送、目视验收、设计正本（成品画布）的新画法、门判定语义的放宽。其余按建议先做（B 类）。
- START 质量硬线（左边条、渐变等禁用清单、单行截断、品牌资产 digest、标旁文字中线等）继续有效；违反硬线的项必须进 R4 返工或明确交 Owner，不得降级为「已知差距」。
- 库门：DS 库现为 0 个门（S-1），引擎拒绝 Story 转 done；验收满足的 Story 仍保持 active，链上只写注解。
- **C8 的处置要明确定一种**：三片对顶带 C8 15 条的看法不一（A 建议加带板依据的 C8 豁免或 `roles.json` 字段并保留登记；B 认为同一目标第三轮、交 Owner；C 建议按 B 类在 `roles.json` 写明顶带让步项可缺省、可收到 0，与板 `.ts-pins` 的 `min-width:0` 一致）。判断要写清：这是门判定语义的放宽还是对板值的如实登记、归 B 类还是 A 类，以及选哪种。
- **收口判定**：若 R4 无可做返工（剩下的未满足项全部只等 Owner），写明「R4 无返工、建议收口」，并逐项列阻点、证据与 Owner 裁定后的改法与规模。若 R4 有可做返工，列 R4 清单并估规模；同时写出「R4 做完后预计只剩哪些 Owner 阻点」。

## 3. 交付

写两份文件到集成树（不提交）：

1. `runs/r3/judgment.md`（不超过 48 KB，文首列各节行号）：
   - §1 R3 结论表：Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别（可返工 / 只有 Owner 能定）| R4 返工项编号 | Owner 目视项。
   - §2 R4 返工清单（若有）：按可成包的组排，每条写编号（R4-1 起）、来源、现象、证据、改法、改动文件、依赖、档位、对应 Story 与 GWT；同一根因只留一条。若无可做返工，写明「R4 无返工」与理由。
   - §3 只有 Owner 能定的事项：§3.1 待裁（沿用 O-1…O-18，本轮新增从 O-19 起，例如 C8 若归 A 类、STORY-144 的 Sheet 文字与板不一致；每项附建议、不裁时的默认、裁定后的改法与规模、挡住哪一步 verify 或哪条 GWT）；§3.2 知悉；§3.3 授权外；§3.4 按建议先做（含三片列出的「有条件」口径的追认与否）；§3.5 停点（推送、发版、部署、目视、库门）。
   - §4 链写计划：§4.1 R3 的 34 张 Subtask（SUB-178…211，现在都是 planned）哪些转 done（三步）、哪些保持并由 R4 承接或转交 Owner（两步，summary 写承接编号或「交 Owner：O-n」）；R1、R2 保持 active 的 Subtask 中承接项已满足的转 done；§4.2 Story 不转 done；§4.3 每张 Story 的注解 summary（不超过 160 字节）；§4.4 INIT-016 注解要点；§4.5 知识卡；§4.6 不在本次链写内的。
   - §5 R4 规模估计与分包建议（若有），或收口建议（若无）。
2. `runs/r3/lessons.json`：不超过 5 条，每条 `{subject, summary, snippet, body, tags, evidence}`，只写本轮新确立、可复用到以后批次的事实与教训；不要重复已有卡（TCRN-DS-KB-001…035 的主题，用 `node ~/.einzbern/engine/einzbern.mjs knowledge-list --workspace "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --at <UTC> --allow-trailing true --selection all --limit 200` 只读查）。

只写这两份文件；探查脚本与输出放会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/abda5cf7-397c-4762-9912-1b5d36359429/scratchpad/judge-r3/`。不改集成树里任何别的文件，不跑 git 写命令，不运行会写链的引擎动词，不重跑门、不构建。

交回（最后一条回复，不超过 25 行）：§1 一览、R4 返工项条数（主力与经济各几、分几组）或「R4 无返工」、C8 的处置、Owner 待裁条数、两份文件字节数。
