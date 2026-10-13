# 摘录 · R2 问题清单判断（INIT-015）

本摘录由主线程切出。判断子代理只读本摘录与下面点名的文件、节或行范围；超过 32 KB 的文件按节读（三份验收文件文首都有节行号）。链上 Story 的 scope 与 GWT 是任务权威。

## 1. 现状

- 集成分支 `claude/init015-gplus-renewal`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，HEAD 10496cb；R2 的 12 个包与集成修复 I1 已全部合入，批末 verify 跑在 e643d74（之后只改了 runs/ 下的调度文档）。
- 批末 verify：30 步红 6 步（10 geometry:proof、11 shell:parity、17 storybook:smoke、18 geometry:measure、19 storybook:visual-proof、30 internal-alpha），表与主线程初步归因在 `runs/r2/verify/steps.md`；验收 C 已更正其中两处归因（第 30 步手机锚点检查不是 O-1，是 SUB-064 让搜索包裹层透明后门的锚点循环没放行 G+ 半透明层；三条 zh-CN 漏译来自 496c1d7 / SUB-064），以验收为准。
- 三片验收结论（本摘录第 3 节给行号）：A——120 不通过（GWT5，verify）、121 通过、122 通过、134 不通过（SUB-046 基线未写入、前置条件）；B——123、124、125、126 通过，127 阻塞于 Owner（GWT4，O-1）；C——128 通过、129 阻塞于 Owner（GWT3，O-1）、130 阻塞于 Owner（GWT1 样板行，O-1）、131 阻塞于 Owner（GWT4，O-1）、132 通过、133 不通过（GWT1 部分）。返工项：A 3 条（经济 3）、B 3 条（主力 2、经济 1）、C 8 条（主力 4、经济 4），跨片有重复（如 B2-2 与 C2-2 同为冒烟 outline-width 期望值过时；B2-3、A2-2 与 C 的文档项）。

## 2. 规则（START 与批量原则 v3，判断必须遵守）

- 档位：改共享契约（token 键集、contract/*.json、导出面、门的判定语义）的返工从主力档起，孤立修复从经济档起；同一修复目标被退回 1 次升主力，主力档项再被退回即停下，写进收口文件交 Owner（R2 拆分第 1 节第 12 条）。R2 已经返工过的目标（如 SUB-080 的 searchOverlay、SUB-061 的 MultiSelect 末端区）按此判。
- 批量原则：批内发现的新工作进下一批；一批一次链写；Owner 事项成批列出、每项附建议，不阻塞工作的按建议先做并回显、Owner 事后可更正；不为单步派代理。判断只能裁定实施对话权限内的事（B、C 类），A 类（判据、范围、破坏性、模型名、持久配置、抵触既有裁定、发布）只列给 Owner。
- 只有 Owner 能定的事项 O-1…O-12 均未答复，按 `runs/r1/judgment.md` §3.1 各条「未答复时」处理。
- goal 的终态是「15 张 Story 全部 done、verify 全绿、storybook:build 成功、收口文件写出并停在推送前」，或「剩余工作全部阻塞于只有 Owner 能做的决定且每个阻点已在收口文件说明」。判断要明说：R3 做完后，剩余工作是否全部阻塞于 Owner（若是，R3 之后即写收口文件）。
- 链上状态词：本库已用过 planned、ready、active、done（planned 不能直接 active，要先 ready）。不要计划转到没用过的状态；确需时写「待主线程核实」。Subtask 判据达成即可 done（即使 Story 未通过）；未达成或部分达成的 Subtask 由你判是 done 加注解、保持 active，还是由 R3 新 Subtask 承接（2.x 没有 Incident，返工开新 Subtask）。

## 3. 输入（按需读，范围如下）

- 验收 A：`runs/r2/acceptance/A.md`（35.6 KB）——§1 第 18 行、§2 第 29 行（2.1 第 31、2.2 第 54、2.3 第 73、2.4 第 97 行）、§3 返工 第 128 行、§4 Owner 第 170 行、§5 口径 第 195 行、§6 盲区 第 227 行。
- 验收 B：`runs/r2/acceptance/B.md`（32.4 KB）——§1 第 15 行、§2 第 33 行（123 第 35、124 第 61、125 第 78、126 第 101、127 第 139 行）、§3 第 154 行、§4 第 202 行、§5 第 223 行、§6 第 255 行。
- 验收 C：`runs/r2/acceptance/C.md`（37.6 KB）——§1 第 11 行、§2 第 28 行（2.1 第 30、2.2 第 61、2.3 第 80、2.4 第 93、2.5 第 107、2.6 第 120 行）、§3 第 142 行、§4 第 211 行、§5 第 227 行、§6 第 267 行。
- 主线程问题清单 `runs/r2/problems/main.md`（RM1–RM18：集成修复、各包自定取舍、目视项、交 Owner 项、交判断项）。
- 批末 verify 表 `runs/r2/verify/steps.md`。
- R1 判断 `runs/r1/judgment.md`：§3.1 Owner 事项第 343–397 行、§3.4 第 417–430 行、§4 链写计划（格式参考）第 435–494 行、§5 R2 规模与分组（格式参考）第 495 行起。
- R2 拆分 `runs/r2/decomposition.md` 第 2 节（第 22–48 行，Story → Subtask → 包）；`runs/r2/subtasks.json`（键、父单 id、包）；`runs/state.md` 的 R2 包表（各包合入提交与判据状态）。
- 链上 id：Subtask 读回 `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2-subtasks-readback.json`（records[].id、externalKey、status），Story 原文与 id `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-NNN.json`（record.id），INIT-015 为 `work:e5b3880c835fd77f1c14b81b`。
- 各包 handoff 与 problems（`runs/r2/handoff/*.md`、`runs/r2/problems/*.md`）只在核对某条返工的原委时按节读。

## 4. 交付

写两份文件（直接写进工作树，不提交）：

1. `runs/r2/judgment.md`（不超过 60 KB，文首列各节行号）：
   - §1 R2 结论表：15 张 Story 的结论、未满足或阻塞的 GWT、关键缺口一句话、R3 去向。
   - §2 去重后的 R3 返工清单：每条写编号（R3-n）、来源（验收编号与 RM 号）、现象、改法、改动文件、档位与理由（含升档或「再退回交 Owner」标记）、需要的 B 类裁定（写明你的裁定与依据，例如 searchOverlay 的 `openMenus` 8 → 6 是否属已定的原型退役的直接后果）、依赖与能否并行。验收判「不可接受」的口径（B 判 RM7 ① 归类、C 判第 30 步归因）给出处置。
   - §3 只有 Owner 能定的事项：在 R1 的 O-1…O-12 上合并 R2 的更正与补充（第 30 步手机锚点移出 O-1 与 SUB-046 的阻塞列表；O-1 授权后要补「纸离边 12」「顶栏 52」两项测量；RM6 归 O-3；DIFF-9 归 O-4；RM8 归 O-6；N-1 文档导航计数 ink-3 并入 O-2；Inputs 画板两处修订挂 §3.4 第 1、3 项），每项附建议与「未答复时」；另列 §3.4 式的「按建议先做」清单（R2 各包已做的自定取舍里你判可接受的，收口回显）与知悉项。
   - §4 链写计划：R2 Subtask 逐张转态（键 → 状态，附一句 summary），Story 转态（按验收通过的转 done；其余保持 active 并在 summary 写结论与去向），R1 的 B 类裁定 M5 等要注解的条目，INIT-015 注解要点，知识卡（lessons.json 的条目）。写成主线程可直接装进一次 work-batch 的清单（id 从第 3 节的读回文件取）。
   - §5 R3 规模与分组：包、档位、预计回合（每包不超过 150）、依赖、并行上限 3 下的起跑顺序；R3 批末要再生的生成物（含 A2-1 的 internal-vocab 回执、SUB-046 的基线写入条件）；R3 做完后哪些 Story 能转 done、哪些仍阻塞于 Owner，以及 R3 之后是否即可写收口文件。
2. `runs/r2/lessons.json`：不超过 5 条，只写 R2 新确立的事实与教训，每条含 subject、summary、snippet、body、tags、evidence（证据路径数组）。

## 5. 限制

- 只读：除上面两份文件外不改任何文件，不跑门、不构建、不启动浏览器、不运行 einzbern 引擎、不 git commit。需要的只读探查脚本写在 `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/tmp/r2-judgment/`。
- 命令里不 cd（只读命令也不 cd），一律绝对路径；不用 rm、rmdir。不运行 `pnpm config list`、`npm config list` 或任何会打印 npmrc、环境变量、凭据的命令。
- 两份文件里不得出现本机用户目录下凭据、钥匙串或应用数据目录的绝对路径，不得出现行首 `XXX_TOKEN=` 或 `key=` 式赋值行，不得出现 no-private-input-scan 的 positive-overclaim 短语表（`scripts/no-private-input-scan.mjs`）里的任何英文短语。
- 不代 Owner 做目视验收、发布授权或任何 A 类裁定。
