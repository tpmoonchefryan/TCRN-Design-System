# INIT-016 回路状态（实施对话的接续点）

每次唤醒先读本文件，再按「下一步」接续。只记事实与接续点，不记进度叙述。

## 固定绑定

- 集成工作树：`/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell`，分支 `claude/init016-tab-shell`，自 DS 主检出 main `69aa195` 切出。`69aa195` = main `d910ccb`（开单提交）对 INIT-015 候选 `claude/init015-gplus-renewal` @ `184db0d` 的 `--no-ff` 合并（2026-10-13，无冲突，未推送）。依赖已装（`install --frozen-lockfile --prefer-offline` 退出 0）。
- 主检出：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System`（main `69aa195`），只用于读库、库门运行与批末把候选合入 main 本地。
- 库：`/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`。引擎 `node ~/.einzbern/engine/einzbern.mjs`（2.0.2），`--actor agent:claude-opus-5-5`，项目 `project:ba2f70f9503ac43c3ec6aa36`。开工读数 version 1889。
- INIT-016 = `work:1a8e81aaa0138ef58d9a8f18`（planned）；Story 135–150 planned（planned 不能直接 active，先 ready）；键号与 id 见 `../README.md`。Subtask 键号从 `TCRN-DS-SUB-113` 起（本库 Subtask 已到 112）。Incident 种类在 2.x 已退役：返工开新 Subtask，或开带 `--fixes` 关系的 Story。
- 库门：开工时 `gates-config-list` 读数 0 个门（version 1889）。S-1 待 Owner 在 Atelier 声明 `verify`（字段见 START「库门（S-1）」节）；INIT-015 的 13 张与本批 16 张的 done 都卡在这里。每轮开始重读。
- 档位：拆分、实施包、孤立修复用 `einzbern-economy`（claude-opus-5-5 low）；批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工用 `einzbern-main`（claude-opus-5-5 max）；旗舰不调。派工必须用 `subagent_type` 指定定义。
- 并发与包：并行包上限 3；每包不超过 150 回合，大单单独成包；每包派工前切摘录 `runs/r<轮>/excerpts/<包>.md`，派工提示只指向摘录。同一修复目标退回 1 次升主力，再退回记入 closeout 交 Owner。
- 未配置：`models.*`、`execution.maxConcurrentSubagents`、`execution.dispatchTiers`、`design.authority`（settings-catalog 现读 null）；不猜、不写链改。
- 包工作树建在 scratch 的 `pkg/r<轮>-<包小写>`，分支 `claude/init016-r<轮>-<包小写>`，自集成分支切出；主线程建树后先 `install --frozen-lockfile --prefer-offline`，再先构建 ui-tokens 与 ui-copy-state。
- 包管理器：`corepack pnpm@10.12.1 -C <树>`；命令不 cd、不 rm（删除改 mv 到 scratch 的 trash）。
- 扫描红线（no-private-input-scan 扫文件系统而非 git 索引，未跟踪文件也算）：工作树内任何文件不得出现本机用户目录下的凭据目录、钥匙串目录或应用数据目录的绝对路径；任何行不得以 `API`、`AUTH`、`SESSION`、`SECRET`、`PASSWORD`、`TOKEN`、`KEY` 结尾的大写或小写名字接 `=` 开头（规则 env-assignment 不分大小写）；不得出现 overclaim 短语表里的英文短语。
- verify 跑完会改 `docs/verification/internal-alpha/no-overclaim-scan.json` 并生成未跟踪的 `visual-selection-result.json`：跑门前后都把树收干净（前者 `git checkout --`，后者 mv 到 scratch 的 trash）。

## 轮次

### R1

- 开工：主检出 main 合入候选得 `69aa195`；集成工作树建好、依赖已装；库门 0 个（S-1）。
- 链上正文导出在 scratch `chain/src/`（INIT、6 Epic、16 Story、两份纪要）。
- 拆分：`einzbern-economy` 一次做完并提交（198b8ae）：28 张 Subtask（SUB-113…140）、18 个包（P1 切 P1a–P1d 四段 + P2…P15）、9 波；问题清单 25 条（`runs/r1/problems/decomposition.md`，均已按建议排进 Subtask，批末判断处置）。
- 开工链写：一个 work-batch 62 成员（INIT-016 与 16 张 Story 各 planned→ready→active、28 张 Subtask 建单），WORKSPACE_COMMAND_COMPLETED，version 1889 → 1951；读回 Subtask 28 张与 subtasks.json 零差异（planned），Story 16 张 active，INIT-016 active。批文件与回执在 scratch `chain/r1/`。
- 调度（并行 ≤3，滚动补位）：可起的包由 scratch `tools/eligible-016.mjs <runDir> <已合入> <在跑>` 算（列出的前置包已合入、更早波次里与它文件相交的包已合入、与在跑包文件不相交）。包树由 scratch `tools/setup-pkg.sh <轮> <包>` 建；摘录由 `tools/make-excerpt-016.mjs <dispatchDir> <轮> <包> <包树> <输出>` 切。P1 各段各自从集成分支最新 HEAD 新建包树（等价于 C-15 的「先把集成分支合进 P1 分支」）。包交回后：核对提交与 `status` 干净 → 按依赖 `git -C <集成树> merge --no-ff` → `git worktree remove` 退役包树 → 派下一个可起的包。
- W1 已派：P1a（SUB-113→114→115）、P2（SUB-123→127）、P3（SUB-135），包树 scratch `pkg/r1-p1a`、`pkg/r1-p2`、`pkg/r1-p3`，摘录已提交（63d07f9）。

## 下一步

- W1 各包交回后按上面的合入步骤处理；P1a 与 P2 都合入后起 P1b、P4；P1b 合入后起 P5 与 P1c（P1c 还等 P4 合入）。全部包合入后：批末 verify（逐步、遇红继续）→ 主力档验收与判断 → 一次链写与知识采集 → 下一轮。
