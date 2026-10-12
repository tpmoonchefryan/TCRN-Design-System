# 摘录 · R3 问题清单判断（INIT-015）

本摘录由主线程切出。判断子代理只读本摘录与下面点名的文件、节或行范围；超过 32 KB 的文件按节读（三份验收文件文首都有节行号）。链上 Story 的 scope 与 GWT 是任务权威。

## 1. 现状

- 集成分支 `claude/init015-gplus-renewal`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，HEAD 见第 3 节（R3 六包与全部集成修复合入 3f9d658，其后只改 runs/ 下的调度文档）。
- R3 批末：逐段 verify 30 步 44 段全绿；真实 `corepack pnpm@10.12.1 run verify` 退出 0、`storybook:build` 退出 0（`runs/r3/verify/steps.md`）。每次 verify 后工作树多出 no-overclaim-scan 计数（643 → 646）与未跟踪的 visual-selection-result.json，主线程已存档并还原。
- 三片验收：A——120、121、122 通过，134 的 GWT 全部满足但判定人为 Owner、前置要等 120–133 在链上 done（受 RM20 约束）；B——123、124、125、126、127 通过；C——128、131、132、133 通过，129 机器判据通过、Owner 目视待做，130 两条 GWT 机器侧满足、判定人为 Owner。返工共 7 条，全为经济档、全为第一次返工、都不改变 GWT 结论：A3-1（ledger 两条已译债务）、A3-2（owner-acceptance 三处过时）、B3-1（owner-acceptance 第 128 行 TMS 夜间色）、C3-1（契约 README 的测量门与映射门说明、映射报告「八项」字样）、C3-2（构图样板类目说明未含构图三）、C3-3（目视清单缺 1024 下顶栏 147 的读数）、C3-4（知识库样板说明几何来自文档作用域例外）。另 A 的收口步骤：最后一次文档提交之后重跑 `pnpm scan` 并提交回执。
- 新的 Owner 事项（验收提出）：N-1 文档导航分类计数夜间约 4.45:1（低于 4.5，按 token 静态算），按 O-2 规则二选一（A 建议文档层改 ink-2）；独立 TopBar 在 Storybook 里两种高（知识库样板 52 经文档例外、构图三 68 为包默认），与 STORY-128「Storybook 只渲染包」的目的冲突（C 建议维持方案 A 到 Navigation 批次并做 C3-4）；1024 下构图一样板顶栏高 147；样板顶栏描述截成一行；收起 52 栏里标、收起钮与导航图标三条中心线不齐（B 提出，目视）。
- 链上：Story 转 done 被引擎拒（RM20，需库内声明覆盖 Story 的 required gate 并跑 gates-run，属 A 类持久配置，交 Owner）；R2 的 8 张通过 Story 现为 active、summary 写「转 done 待库门配置」。R3 的 19 张新 Subtask（SUB-088…106）均 planned；SUB-046、076、078、080 为 active。

## 2. 规则（START 与批量原则 v3，判断必须遵守）

- 档位：改共享契约的返工从主力档起，孤立修复从经济档起；同一修复目标被退回 1 次升主力，主力档项再被退回即停下写进收口文件交 Owner。
- 批量原则：批内发现的新工作进下一批；一批一次链写；Owner 事项成批列出、每项附建议；不阻塞工作的按建议先做并回显、Owner 事后可更正；不为单步派代理；小轮（实施包不超过 2 个或验收只有一片）时，验收与判断由一个主力档代理一次完成并顺带写出下一轮的拆分文件。
- goal 的终态是「15 张 Story 全部 done、verify 全绿、storybook:build 成功、收口文件写出并停在推送前」，或「剩余工作全部阻塞于只有 Owner 能做的决定且每个阻点已在收口文件说明」。判断要明说：R4 是否需要、范围与规模；R4 之后剩余工作是否全部阻塞于 Owner（若是，R4 之后即写收口文件）；R4 不做时直接写收口文件的条件。
- 链上状态词：本库已用 planned、ready、active、done（planned 不能直接 active）；Story 转 done 受 RM20 约束，不要计划会被引擎拒的转态。
- 主线程在 R3 做过三类派工方法上的选择，请判断复核并写进 §3 供收口回显：① 集成修复项续派原包代理（SendMessage，P2 的 I-P2b、P3 的 SUB-101 续做与冒烟钉值），而不另派集成代理；② SUB-101 的方案 A 由主线程按批量原则第 5 条先做；③ 额度触顶时停在原地、改挂一次性定时唤醒（设计会话指示「触顶停在原地等重置，不要为此改方法」）。

## 3. 输入（按需读，范围如下）

- 验收 A：`runs/r3/acceptance/A.md`（33 KB）——§1 第 21 行、§2 第 32 行（2.1 第 34、2.2 第 46、2.3 第 58、2.4 第 69 行）、§3 第 116 行（A3-1 第 120、A3-2 第 129、收口步骤第 141 行）、§4 第 146 行、§5 第 162 行、§6 第 195 行。
- 验收 B：`runs/r3/acceptance/B.md`（29 KB）——§1 第 16 行、§2 第 35 行（123 第 37、124 第 56、125 第 69、126 第 88、127 第 118 行）、§3 第 153 行、§4 第 168 行、§5 第 187 行、§6 第 217 行。
- 验收 C：`runs/r3/acceptance/C.md`（36.6 KB）——§1 第 11 行、§2 第 26 行（2.1 第 28、2.2 第 42、2.3 第 57、2.4 第 72、2.5 第 86、2.6 第 97 行）、§3 第 121 行、§4 第 159 行、§5 第 175 行、§6 第 213 行。
- 主线程问题清单 `runs/r3/problems/main.md`（R3M1–R3M7）；批末 verify 表 `runs/r3/verify/steps.md`；R2 主线程问题清单 `runs/r2/problems/main.md` 的 RM20（Story 转 done 的门配置）。
- R2 判断 `runs/r2/judgment.md`：§3 Owner 事项、裁定与 §3.4 只能由 Owner 做的事（第 194–276 行）、§4 链写计划格式（第 277–397 行）、§5 规模与分组格式（第 398 行起）。
- R3 拆分 `runs/r3/decomposition.md` 第 2 节（Story → Subtask → 包，第 21–70 行）；`runs/r3/subtasks.json`；`runs/state.md` 的 R3 包表。
- 链上读回：Subtask 状态与 id——会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3-subtasks-readback.json`（主线程在派你之前刚读回）；Story 原文与 id——`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-NNN.json`（record.id、record.summary）；INIT-015 为 `work:e5b3880c835fd77f1c14b81b`。
- 各包 handoff 与 problems（`runs/r3/handoff/*.md`、`runs/r3/problems/*.md`）只在核对某条返工或口径的原委时按节读。

## 4. 交付

写两份文件（直接写进工作树，不提交）：

1. `runs/r3/judgment.md`（不超过 60 KB，文首列各节行号）：
   - §1 R3 结论表：15 张 Story 的结论、未满足或阻塞的 GWT、关键缺口一句话、去向（R4、收口、Owner）。
   - §2 R4 返工清单（去重后）：编号 R4-n、来源、现象、改法、改动文件、档位与理由、依赖与能否并行；A 的收口步骤（重跑 scan 提交回执）写成 R4 批末项或收口步骤，二选一并说明。若判断 R4 不必做，写清理由与这些条目改由收口文件列为遗留。
   - §3 收口用的 Owner 事项清单（最终版）：合并 R1/R2 的 O-1…O-12（含设计会话 B 类裁定与默认执行）、RM20（库门配置）、130 与 134 的判定、目视验收、D8 停点、N-1 与上面四条新目视项、画板修订，以及第 2 节列的三类派工方法选择的复核意见；每项附建议与「未答复时」。另列按建议先做（R3 各包自定取舍、主线程的 SUB-101 方案 A 等）与知悉项，供收口回显。
   - §4 链写计划：R3 Subtask 逐张转态（键 → 状态、一句 summary；id 从读回文件取），SUB-046、076、078、080 的转态，Story 的 summary 注解（受 RM20 约束不转 done 的，用 work-annotate 写结论；summary 每条按 UTF-8 不超过 160 字节，写前自己计数），INIT-015 注解，知识卡（lessons.json）。写成主线程可直接装进一次 work-batch 的清单。
   - §5 R4 规模与分组（或收口条件）：包、档位、预计回合、依赖；R4 是否属小轮（实施包不超过 2 个）——若是，按批量原则第 6 条由一个主力档代理做 R4 的验收与判断；R4 批末要跑的门与再生项；R4 之后是否即可写收口文件。若属小轮且你判断 R4 需要做，请顺带把 R4 的拆分文件写出（`runs/r4/decomposition.md`、`packages.md`、`subtasks.json`、`subtasks-batch.json`，格式沿用 `runs/r3/` 的同名文件，键自 TCRN-DS-SUB-107 起；你不落链，落链由主线程用 subtasks-batch.json 做）。
2. `runs/r3/lessons.json`：不超过 5 条，只写 R3 新确立的事实与教训，每条含 subject、summary、snippet、body、tags、evidence（证据路径数组）。

## 5. 限制

- 只读：除上面列出的文件外不改任何文件，不跑门、不构建、不启动浏览器、不运行 einzbern 引擎、不 git commit。需要的只读探查脚本写在 `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/tmp/r3-judgment/`。
- 命令里不 cd（只读命令也不 cd），一律绝对路径；不用 rm、rmdir。不运行 `pnpm config list`、`npm config list` 或任何会打印 npmrc、环境变量、凭据的命令。
- 写出的文件里不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得出现行首 `XXX_TOKEN=` 或 `key=` 式赋值行，也不得写入 no-private-input-scan 的 positive-overclaim 短语表（`scripts/no-private-input-scan.mjs`）里的任何英文短语。
- 不代 Owner 做目视验收、发布授权或任何 A 类裁定。
