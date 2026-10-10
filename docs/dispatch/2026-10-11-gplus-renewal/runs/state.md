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

- 拆分结果：46 张 Subtask（SUB-001–046，链 version 1387，全部 planned），27 包 8 波；拆分文件、两块补入画板（V2-Rejections、V2-Families）与主线程问题清单已提交集成分支 `6a35a29`。
- 调度（并行 ≤3，滚动补位）：包工作树在 scratch 的 `pkg/<包小写>`，分支 `claude/init015-r1-<包小写>`，自集成分支切出并已装依赖；摘录在 `runs/r1/excerpts/<包>.md`（生成器 scratch `tools/make-excerpt.mjs <runDir> <包> <out> [4|5|6|7]`）。包交回后：核对提交与 `status` 干净 → 按依赖合入集成分支（`git -C <集成树> merge --no-ff`）→ 退役包工作树 → 派下一个就绪包。
- 依赖（就绪条件，按 subtasks.json 的 dependsOn）：W2-A 等 W1-A、W1-C；W2-B/D/E/F 等 W1-A、W1-B；W2-C 等 W1-A、W1-B（另：锁文件在 W1-C 后）；W2-G 等 W1-C；W2-H 等 W1-A；W1-D/E/F 无依赖；W3-A 等 W2-A；W3-B 等 W1-D、W2-A；W3-C 等 W1-D；W3-D 等 W2-C、W2-D、W2-E；W4-A 等 W2-B、W2-C、W2-F、W3-B、W3-C、W3-D；W4-B 等 W1-E、W2-F、W3-B、W3-C、W3-D；W5-A/B 等 W4-A（W5-B 另等 W1-F）；W5-C 等 W4-A、W3-C、W1-F；W6-A 等 W3-A、W1-C、W2-G、W2-H、W1-D、W5-B、W5-C、W4-B；W6-B 等 W5-A、W4-A、W3-C；W7-A 等 W6-A、W6-B、W5-B；W8-A 等 W6-A、W6-B、W7-A。
- 摘录附加：家族包与 W2-H 的摘录追加 `file:handoff/W1-A.md`；W2-G 追加 `file:handoff/W1-C.md`；需要的问题条目在派工提示里点名（摘录生成器只按 P 编号自动带入拆分问题清单的条目）。
- 补位优先级（关键路径）：W2-C、W2-F 与 W3-C（二者都改 story-content.tsx，不能同时在跑）、W2-B、W3-B（W2-A 后）、W3-D（W2-C/D/E 后）、W2-G、W2-H、W1-E、W1-F、W3-A（W2-A 后），然后 W4、W5、W6、W7、W8。

| 包 | 状态 | 包分支起点 | 备注 |
| --- | --- | --- | --- |
| W1-A | 已合入 2bf6d9b，包树已退役 | 6a35a29 | SUB-008→009；问题 P1–P8 在 `problems/W1-A.md`；`handoff/W1-A.md`「给后续包」一节须并入 W2 家族包、W2-A、W2-H 的摘录 |
| W1-B | 已合入 3fff29c，包树已退役 | 6a35a29 | SUB-010；CSS 规范化相同（974 条规则同序，字节 124578→126188 全在原位拆开的跨家族选择器）；集外：doc-shell-class-proof 仍读 Navigation.tsx（W1-D 重写时按约定 8 改读 dist）、s254-component-contract-proof 正则失效（不在 verify，批末问题清单）、style-scale.md 第 63 行（W6-A/SUB-040） |
| W1-C | 已合入 31b0f6b，包树已退役 | 6a35a29 | SUB-004→005；字体 52 文件 3,290,644 B；`handoff/W1-C.md` 写给 SUB-006/007 与集成（合并新文案后跑 `fonts-vendor --check`）；待 Owner：W1C-1 上游 OFL 版权行；安全：子代理跑 `pnpm config list` 时 npm authToken 出现在其工具输出（未落任何文件，已 grep 核对），收口时报 Owner 建议轮换；此后派工提示禁止打印配置/凭据 |
| W1-D | 已合入 35b918b，包树已退役 | d736309 | SUB-024；现仓先红 171 个包外类（映射 171 条：包已提供删 38、改 tcrn-doc- 86、删演示 32、删死类 15）；40 个「包组件写出但包 CSS 无规则」的类按包类计、不计入差集（按建议先做，验收复核）；35 个类被 shell-parity/shell-fidelity/storybook-smoke/smoke.test 点名，W3 改名须同提交改门；集外：`doc-shell:proof` 脚本先跑 `node --test tests/doc-shell-class-proof.test.mjs`（归 W6-A/SUB-038 接线） |
| W2-A | 已合入 d0e6900，包树已退役 | c447221 | SUB-001→006；C5 两块各 85 名同集（主题无关块 118）；fonts-proof coverage 红：「盃」U+76C3（marks.json）不在随包分片，基线即红，批末跑 `pnpm fonts:vendor` 重生分片；预计红：token-contrast-proof（旧名变 var 别名，W3-A 重写）、smoke.test canvas 断言与 .storybook/preview.ts（P3）、旧几何断言门（P11）；tokens.css 顶部 @import fonts.css；问题 P1–P15 与 51 行新旧名表在 `problems/W2-A.md`、`handoff/W2-A.md`（W3-A/W3-B 摘录追加） |
| W2-E | 在跑 | 85d8583 | SUB-019→020 |
| W2-D | 在跑 | 223100e | SUB-016→017 |
| W2-C | 在跑 | 0af0bf8 | SUB-014→015 |

集成树合入 W1-A/B/C 后 typecheck 与 build 均 EXIT=0（scratch `logs/integ-w1abc-compile.log`）。

## 批末生成物（一次再生，不随单包重做）

- `pnpm fonts:vendor`（中文分片按最终产品用字重选）→ fonts-proof coverage 转绿；`node scripts/contract-generate.mjs --check`；tokens-sync；internal-alpha 回执与视觉签名基线（W8-A）。

## 下一步

1. 等 W1-A/B/C 交回（完成通知即唤醒）；逐包核对后合入集成分支，按上面的优先级补位派包（每次派前生成该包摘录并提交到集成分支）。
2. 全部包合入后：批末 verify 一次（日志放 scratch `logs/`），派 `einzbern-main` 按 Story 验收一次，问题清单一次处置，一次链写与知识采集。
