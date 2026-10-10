# INIT-015 回路状态（实施对话的接续点）

每次唤醒先读本文件，再按「下一步」接续。只记事实与接续点，不记进度叙述。

## 固定绑定

- 工作树：`/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，分支 `claude/init015-gplus-renewal`，自 DS 主检出 main `b321d10` 切出。
- 库：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`（主检出里；工作树里没有库）。引擎 `node ~/.einzbern/engine/einzbern.mjs`，`--actor agent:claude-opus-5-5`，项目 `project:ba2f70f9503ac43c3ec6aa36`。
- INIT-015 = `work:e5b3880c835fd77f1c14b81b`（active）。Story 120–134 起始 planned（planned 不能直接 active，先 ready）。Incident 在引擎 2.x 已退役：返工开新 Subtask，或开带 fixes 关系的 Story。
- Subtask 键号：`TCRN-DS-SUB-001` 起（本库此前没有 Subtask）。
- 档位（START「模型与子代理」节，DS main 5814699；本库 `minutes:ef150905e3fe968a4e1d7263` 取代 `minutes:8df2694657c74772e8b23c17` 的 D2）：拆分、实施包、孤立修复用 `einzbern-economy`（claude-opus-5-5 low）；批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工用 `einzbern-main`（claude-opus-5-5 max）；旗舰不调。必须用 `subagent_type` 指定定义，否则继承主对话 max。
- 并发与包：并行包上限 3；每包不超过 150 回合，大单单独成包；每包派工前切摘录文件 `runs/r<轮>/excerpts/<包>.md`，派工提示只指向摘录。同一修复目标退回 1 次升主力，再退回记入 closeout 交 Owner。
- 未配置：`models.tiers`、`execution.maxConcurrentSubagents`（declared 为 null）、`execution.dispatchTiers`、`design.authority`；不猜、不写链改。
- 集成分支已快进到 main `5814699`（START 改档位节）。
- 包管理器：`corepack pnpm@10.12.1 -C <树>`；嵌套 pnpm 实测解析为 10.12.1。
- 分包工作树放在 scratch 下（只写本工作树与 scratch）；包分支名 `claude/init015-r<轮>-<包>`。
- 扫描红线（no-private-input-scan 扫文件系统而非 git 索引，未跟踪文件也算）：工作树内任何文件不得出现本机 `Library/Application Support`、`.ssh`、`.aws`、`Keychains` 路径，不得出现 `TOKEN=` 式赋值行与 overclaim 短语表里的英文短语。

## 轮次

### R1

- 拆分：派 `einzbern-main` 一次做完，产出写在 `runs/r1/`（decomposition.md、subtasks.json、packages.md、problems/decomposition.md、subtasks-batch.json），Subtask 用 work-batch 落链。
- 基线：b321d10 全量 verify `VERIFY_EXIT=0`，用时 7 分（2026-10-10T20:57:50Z 至 21:04:50Z），日志在 scratch 的 `logs/baseline-verify.log`（49,781 行）。跑完后树变脏两处：`docs/verification/internal-alpha/no-overclaim-scan.json` 的 scannedFiles 随树内文件数漂移（282→300），并新生成未跟踪的 `visual-selection-result.json`（164 KB）；批末 verify 后按 DS 惯例处理这两处回执。基线工作树已经 git worktree remove 退役（365 MB，回执副本移入 scratch trash）。磁盘余量 60 GiB（df，2026-10-10T21:10Z）。

## 下一步

1. 等拆分代理交回；核对 runs/r1 文件与链上 Subtask 读回。
2. 把 runs/r1 拆分文件提交到集成分支，再按 packages.md 的第一波建包工作树并行派 `einzbern-economy`。
