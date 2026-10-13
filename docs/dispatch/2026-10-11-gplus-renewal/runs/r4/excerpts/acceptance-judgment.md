# 摘录 · R4 验收与判断（小轮，一个主力档代理一次完成）

本摘录由主线程切出。R4 只有一个实施包，按批量原则第 6 条由一个主力档代理一次做验收与判断，仍按原格式写验收、判断与 lessons 三份文件。只读本摘录与下面点名的文件、节或行范围；超过 32 KB 的文件按节读。链上 Story 的 scope 与 GWT 是任务权威。

## 1. 现状

- 集成分支 `claude/init015-gplus-renewal`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`。R4 的包 P0（SUB-107 → 112）合入 510c972，其后只改 runs/ 下的调度文档。
- R4 批末：真实 `corepack pnpm@10.12.1 run verify` 在 510c972 上于 2026-10-12T23:56:26Z 至 2026-10-13T00:05:47Z 跑完，退出 0；`corepack pnpm@10.12.1 run storybook:build` 退出 0（00:05:49Z）。日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/r4-final/verify.log`（大，按需 grep，每次输出不超过 200 行）与 `storybook-build.log`，退出码与时间在 `verify.meta`。internal-alpha 读数：requiredStoryCount 66、screenshotCount 310、axeViolationCount 0。verify 后工作树照例多出 no-overclaim-scan 计数与未跟踪的 visual-selection-result.json，已存档并还原（R3 判断 J-3、J-4）。
- R3 判断（`runs/r3/judgment.md`）的结论：13 张 Story 机器判据满足，130、134 判定人为 Owner；R4 只做 R4-1…R4-6（经济档、文档与清单回写加批末再生）；R4 之后若 6 张都达成、verify 与 storybook:build 退出 0、本判断没有新的非 Owner 返工，即写收口文件，剩余工作全部阻塞于 Owner（S-1…S-6、N-1…N-6、M-1、O-8 与各 B 类裁定的事后更正）。
- 链上：Subtask 112 张（done 106，R4 的 SUB-107…112 为 planned），Story 15 张 active；Story 转 done 受 RM20 约束（库内没有覆盖 Story 的必需门，S-1）。

## 2. 输入（按需读）

- R4 拆分 `runs/r4/decomposition.md`：第 3 节六张 Subtask（SUB-107 第 54 行、108 第 72 行、109 第 89 行、110 第 103 行、111 第 121 行、112 第 138 行），§2.3 问题（第 43 行）。
- R4 包交回 `runs/r4/handoff/P0.md`（15 KB）与问题清单 `runs/r4/problems/P0.md`（2 KB）。
- R3 判断 `runs/r3/judgment.md`（52 KB，按节读）：§1 结论表第 7 行；§2.2 R4-1…R4-6 第 48–111 行；§3 收口用 Owner 事项第 119–260 行；§4 链写计划格式第 261–344 行；§5.3 R4 之后第 364–369 行。
- R3 三片验收 `runs/r3/acceptance/{A,B,C}.md`：只在核对 130、133、134 的 GWT 或 R3 的返工来源时按节读（文首有节行号）。
- 目视清单 `docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`（SUB-111 改过）、`docs/contract/README.md`（SUB-108）、`apps/storybook/src/contract-stories/governance.ts` 与知识库样板说明（SUB-107、SUB-110）、`scripts/lib/locale-invariant-ledger.mjs`（SUB-109）、`docs/verification/storybook-visual-proof/gplus-map-report.md` 与 `docs/verification/internal-alpha/` 下的选择与写入记录（SUB-112）——只读与判据相关的部分。
- 链上读回：Subtask——会话 scratch `chain/r4-subtasks-readback.json`（version 1834；records[].id、externalKey、status）；Story——会话 scratch `chain/r4/STORY-NNN.json`（record.id、record.summary 为 R3 写的注解）；INIT-015 为 `work:e5b3880c835fd77f1c14b81b`。

## 3. 交付（三份文件，直接写进工作树，不提交）

1. `runs/r4/acceptance.md`（不超过 30 KB，文首列节行号）：§1 一览（六张 Subtask 的判据结论；130、133、134 三张父 Story 的 GWT 复核结论；其余 12 张 Story 只核 R4 没有回退，以 R4 批末 verify 退出 0 与相关读数为证）；§2 逐张判据与证据；§3 返工清单（编号 R4A-1 起，含档位与是否第二次返工）；§4 新的或变化的 Owner 事项（尤其 N-1 的浏览器实测 4.45 与清单写法）；§5 口径判定（P0 handoff 的自定取舍逐条判可接受、有条件或不可接受）；§6 证据盲区。
2. `runs/r4/judgment.md`（不超过 40 KB，文首列节行号）：§1 15 张 Story 的最终结论表（机器判据、判定人、链上状态、剩余与去向）；§2 R5 返工（若无，写明「无」与理由）；§3 收口用 Owner 事项的最终版（在 R3 判断 §3 的基础上按 R4 更新，每项附建议与不答复时，供主线程写进收口文件的表格）；§4 链写计划：R4 六张 Subtask 逐张转态（planned → ready → active → done，每步一个成员，summary 按 UTF-8 不超过 160 字节，写前自己计数）、需要更新 summary 的 Story（用 work-annotate，只写 summary；不计划会被引擎拒的转态）与 INIT-015 注解，写成可直接装进一次 work-batch 的清单（另把这份 JSON 写到会话 scratch `tmp/r4-judgment/r4-chain-batch.json`，格式 `{"schemaVersion":"tcrn.work-batch.v1","members":[...]}`，成员形状同 `runs/r3/` 那次：work-transition 带 id、status、summary，work-annotate 带 id、summary）；§5 收口判定：是否满足 R3 判断 §5.3 的条件、现在是否即可写收口文件、收口步骤（重跑 `pnpm scan` 并提交刷新回执，J-3）与需要在收口文件写明的每个阻点。
3. `runs/r4/lessons.json`：不超过 5 条，只写 R4 新确立的事实与教训（与已有知识卡 KB-001…021 不重复），每条含 subject、summary、snippet、body、tags、evidence。

## 4. 限制

- 只读：除上面三份文件与 scratch 下的批文件外不改任何文件，不跑门、不构建、不启动浏览器、不运行 einzbern 引擎、不 git commit。只读探查脚本写在 `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/tmp/r4-judgment/`。
- 命令里不 cd（只读命令也不 cd），一律绝对路径；不用 rm、rmdir。不运行 `pnpm config list`、`npm config list` 或任何会打印 npmrc、环境变量、凭据的命令。
- 写出的文件里不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得出现行首 `XXX_TOKEN=` 或 `key=` 式赋值行，也不得写入 no-private-input-scan 的 positive-overclaim 短语表（`scripts/no-private-input-scan.mjs`）里的任何英文短语。
- 不代 Owner 做目视验收、发布授权或任何 A 类裁定。
