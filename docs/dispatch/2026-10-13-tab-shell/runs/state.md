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

| 包 | 状态 | 包内提交 | 合入 | 备注 |
| --- | --- | --- | --- | --- |
| P1a | 已合入，包树已退役（271 MB） | a7a1b0b、b44c4d7、5fe6158、0eb4136 | 36a08dd | 局部门全 0；问题 6 条（`runs/r1/problems/P1a.md`） |
| P2 | 已合入，包树已退役（271 MB） | 3f87bb3、04484e0、8c96e48、622c335 | f078b6f | token-extension-proof 在包树红 1 条（`--tcrn-shell-pinb` 未解析，P1a 合入后应转绿，批末核）；问题 12 条 |
| P3 | 已合入，包树已退役（236 MB） | 5bcc0a7、dad8d00 | a2f3538 | 18 门在两块画板上全绿、18 条变异全红；默认模式（真件）未跑，等 SUB-137；问题 4 条；交回第 5 节列了壳件钩子要求，已用消息转给在跑的 P1b（只做其文件集内的，其余记问题） |
| P1b | 已合入，包树已退役（239 MB） | f2d2921、867e43e、8391672、35c43d6、2a0a376 | 89a6c03 | 局部门终态全 0（ui-react test 202/202、test:dom 37/37）；越出文件集改了 `styles/index.ts` 两行登记（W2 无人持有，合入无冲突）；问题 8 条，第 5 条（完整菜单里级联列的位置，1440 宽同开两列超出视口 12）是设计待定项 |
| P1c | 已合入，包树已退役（272 MB） | caf6cfa、f85de9f、9872a16（合入集成分支解登记冲突）、abdb929 | c7fd635 | 局部门除既有红外全 0；问题 11 条：AOS 在 logos2 无标（三处 AOS story 暂传 design-system，待 Owner）、顶带无拖排手势（ShellPins.tsx 不在本包）、包外门按 C-12 会红 |
| P1d | 在跑（自 c7fd635） | | | |
| P5 | 已合入，包树已退役（239 MB） | 7eefd5b、5825bcb | f7d6f6d | 局部门全 0（ui-react test 208/209，唯一红是既有红）；问题 5 条，要紧的一条：静态 Storybook 页无客户端 React，ShellIntro 不播放（下一轮）；已经消息让 P1c 交回前把集成分支合进包树、解 `styles/index.ts` 登记冲突 |

- 跨包通告 `runs/r1/excerpts/cross-notes.md`（已知红、已合入包的接口行段、W3 共享文件规则）随每次派工指给子代理，包交回后主线程补行。
- 「批内发现的新工作」（钩子、title、文案等落在别包文件的缺口）一律只记问题文件、进下一轮，不插进在跑或待派的包（批量原则 v3 第 1 条）。
| P4 | 已合入，包树已退役（272 MB） | 1f67057、71ef1e4 | a2675b5 | SUB-128 部分：后缀两主题同色、夜间豁免带 D7 待裁已回；矩阵红格不在第一批 matrices.json，建议并入 SUB-136（P9）。已知红：ui-react test 183/184，P1a 的 `ShellBrandButton.test.tsx` 仍断言夜间后缀 ≥ 4.5（现 3.07），批末处置，后续包派工时告知不修；问题 4 条 |

## 下一步

- W1 各包交回后按上面的合入步骤处理；P1a 与 P2 都合入后起 P1b、P4；P1b 合入后起 P5 与 P1c（P1c 还等 P4 合入）。全部包合入后：批末 verify（逐步、遇红继续）→ 主力档验收与判断 → 一次链写与知识采集 → 下一轮。
