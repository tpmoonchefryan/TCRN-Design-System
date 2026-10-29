# START · TCRN-DS-INIT-015 · DS 焕新：G+ 底盘、第一批五家族与四枚产品标进包，Storybook 只渲染包

首行硬条件：本会话从这条消息起自主运行，不等 Owner、不问「是否继续」；开工第一步就用 `/loop`（不带间隔，自定节奏）把下面的 goal 文本交给循环，之后每个回合末尾都必须留下唤醒源（下一单已派、或 ScheduleWakeup 已排），只有 goal 达成或全部剩余工作阻塞于只有 Owner 能做的决定时才停下汇报。

## Goal（按目标书写契约 v1）

TCRN-DS-INIT-015 下 TCRN-DS-STORY-120 至 134 共 15 张 Story 全部 `done`，候选分支在本工作树本地提交完毕，`corepack pnpm@10.12.1 run verify` 全绿，`storybook:build` 成功，收口文件 `docs/dispatch/2026-10-11-gplus-renewal/closeout.md` 已写出并停在推送之前；或：剩余工作全部阻塞于只有 Owner 能做的决定，且每个阻点已在收口文件里说明。

## 你是谁、在哪、改什么

- 你是 INIT-015 的实施对话，会话根是平台容器 `/Users/ryanlan/Code`（不是 DS 仓目录）。开工第一个动作：为 DS 仓建独立工作树与分支——`git -C "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System" worktree add "/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal" -b claude/init015-gplus-renewal main`——之后所有改动、构建、门都在这棵树上用绝对路径做（`git -C`、`corepack pnpm@10.12.1 -C`），不动主检出 main；主检出只用来读 `.ether` 库。容器根 `/Users/ryanlan/Code/AGENTS.md` 的全部规则对你有效，特别是第三部分的批量处理原则 v3、自主运行、无人值守指令、静默汇报，和第二部分八的无效残余收尾原则。
- git 身份 `tpmoonchefryan <253097889+tpmoonchefryan@users.noreply.github.com>`，提交信息末尾不加 Co-Authored-By。按 Subtask 提交，提交信息带工单键号。
- 不推送、不打 tag、不发版、不部署、不改其它仓、不改宿主与 launchd；这些是 Owner 停点。控制树只经引擎（下文），永不用文件工具写 `.ether`。
- 包管理器：`corepack pnpm@10.12.1 -C "/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal" run <脚本>`，命令里不 cd、不 rm（删除改 mv 到 scratch 的 trash）；只写这棵工作树与 scratch 目录。

## 真值在哪

| 东西 | 位置 | 怎么读 |
| --- | --- | --- |
| 工单正文 | DS 库 `/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`（主检出里的库；工作树里没有它，`--workspace` 永远指向这个绝对路径） | `node ~/.einzbern/engine/einzbern.mjs work-show --external-key <键> --workspace <库>`；Story 的 goal、acceptance、body 在 `fields` 里；INIT 与 Epic 的 scope 在 `fields.body` |
| 裁定 | `minutes:` 记录 `TCRN-DS-MIN-20261011-GPLUS-RENEWAL`（D1 至 D8） | `minutes-show` |
| 设计标准 | Sites「TCRN 视觉设计标准」https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site；当前已确认标准，新增内容须 Owner 明确确认 | [设计参考索引](../../design/README.md)；只读参考 |
| 设计草稿 | Sites「DS 视觉方向方案 · 草稿」https://tcrn-ds-visual-draft.honestfawn3.chatgpt.site；探索与待确认内容，旧稿与取代标记继续有效 | [设计参考索引](../../design/README.md)；与标准分别维护 |
| 设计数据与画板 | `docs/design/gplus-2026-10/`：`tools/lib.mjs` 的 `T`（token 对象）、`ICONS`（37 件路径）、`build-actions.mjs` 的 `pairs()`、`build-inputs.mjs` 的对表 CSS、`build-logos2.mjs` 的 `MARKS` 与 `PAL`、`boards/*.dc.html`（每块板的矩阵表与 F 段 token 差异）、`measure.js`（八项测量）、`logos2/*.svg` | 这是 STORY-122 要抽成 `contract/*.json` 的来源；在那之前实现与 story 直接读这些文件 |
| 现仓真值 | `packages/ui-tokens/src/index.ts`、`packages/ui-react/src/components/**`、`tcrnComponentCss`、`apps/storybook/src`、`scripts/*-proof.mjs`、`docs/style-scale.md` | 改之前先读 |

## 回路（批量处理原则 v3，一批 = 15 张 Story）

1. **拆分一次**：派一个子代理读完 15 张 Story 的正文与 `docs/design/gplus-2026-10`，一次拆成 Subtask（每张写改动文件与依赖），用 `work-create --kind Subtask --parent-id <Story id>` 落链；拆分子代理把发现的 scope 矛盾记入本批问题清单，不改 Story。
2. **分包并行**：改同一批文件或有先后依赖的 Subtask 进同一个包，包内按序；互不影响的各成一包；依赖顺序大体是 EPIC-039 → 040 → 041 → 042 → 043，但 039 与 128（文档层清零）、131/132 的门脚本可早做。并发上限按「模型与子代理」一节为 3（链上变量未配置）；拆分与实施包派经济档，两个写代理不得同时改同一文件集。包完成即退役，不跑门、不验收、不写链。
3. **集成一次**：包全部完成后按依赖顺序合到本分支，冲突交一个集成子代理。
4. **门与验收批末一次**：开发期只跑受影响的局部门（STORY-119 的分阶段规则）；批末 `verify` 一次、Opus 档验收一次（按 Story 出结论），问题清单一次处置、一轮返工、一次重跑（MIN-218）。见红只记不修。
5. **一次链写、一次汇报**：Story 转态与注解用批量入口；Subtask 免十块模板；`work-transition` 的 summary 不超过 160 字节；planned 不能直接 active（先 ready）。验收通过的 Story 转 `done`；不通过的开 Incident（`--fixes`）或补充 Story 回拆分。
6. **每轮知识采集**：判断代理在判断报告旁写 lessons（不超过 5 条），主线程用 `knowledge-create` 落卡并读回。
7. **一轮做完立即开下一轮**，直到 goal 达成；轮与轮之间不等 Owner、不换会话、不汇报。

## 模型与子代理

- 档位是变量不是人设。DS 库与协调库的 `models.category`、`models.tiers`、`execution.maxConcurrentSubagents` 现读皆为未配置（2.x 库 `settings-catalog` 2026-10-11 读数 value 为 null），记为未配置、不猜；Atelier 配置之前按下表的 Owner 裁定执行，每行注明来源纪要（协调库 `/Users/ryanlan/Code/.ether`，`minutes-show --id`）。
- 档位表（Claude Code 宿主）：

| 档 | 模型 / effort | 代理定义（容器根 `.claude/agents`，宿主本地文件） | 用在哪 | 来源 |
| --- | --- | --- | --- | --- |
| 旗舰 | claude-fable-5-1 / max | 无 | 不调；设计与裁定对话专用 | minutes:23fa3c95ea1965d0a09b35f7 D1（2026-09-16） |
| 主力 | claude-opus-5-5 / max | `einzbern-main` | 批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工 | minutes:73653e64a465de427be20fb2（2026-09-22）；minutes:c8739892952325c316bdcea8 D2（2026-09-28） |
| 经济 | claude-opus-5-5 / low | `einzbern-economy` | 拆分、实施包、孤立修复 | minutes:74cc0232ca417b74a954dcf2 D1（2026-09-26，取代 2026-09-22 的 opus-5-5/max） |

- 派子代理时用 `subagent_type` 指定上表的代理定义：effort 只能来自定义的 frontmatter，Agent 工具没有 effort 参数，不指定定义就会继承主对话的 max。两份定义的正文写的是 INIT-053，其执行约束（单次派工不超过 200 次模型响应、工具输出进文件按需读、见红只记不修、不发进度、不派子代理的子代理、不用 claude-fable-5-1）对本 INIT 同样有效。
- 起始档与升档（minutes:c8739892952325c316bdcea8 D2、D5）：孤立修复从经济档起，改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义）的返工从主力档起；同一修复目标被退回 1 次即升到主力，止于主力，再被退回停下记入收口文件交 Owner；升档目标单独成包。
- 并发与包大小：并行包上限 3（minutes:eb763b2a518d5eddc8eee84f D1，2026-09-26，由 8 改 4 再改 3）；每包按预计回合数定、不超过 150 回合，大单单独成包（同纪要 D3）；每个包派工前切一份只含本包 Subtask、通用约定与跨单契约的摘录文件，派工提示只指向摘录，不指向整份拆分文件（同纪要 D1）。
- 子代理单次派工即退役，不派子代理的子代理；子代理之间不互发进度；只有安全问题、硬阻塞与会阻塞别人的冲突可中途上报。
- 子代理只读派工指明的文件、节号或行号范围；工具输出先写进文件再按需读入，每次不超过 200 行；超过 32 KB 的文件不整读。

## 质量硬线（违反即返工，来自画布打回总账 C1 至 C17）

fill 与 ink 永远成对换，状态选择器特异性不得高于变体选择器且不含颜色；任何元素不超出裁切祖先，固定高容器声明溢出策略；浅色与夜间同一选择器属性集相同只换值；选中态只做 6% 墨洗加字重，禁左边条、禁填充与边线兼有；面包屑、导航项、按钮、标签、徽标、表格单元、标题一律单行截断加 title；工具栏声明唯一让步项；品牌资产 digest 不变；几何逐值来自 token；禁用清单（左边条、渐变、光斑、模糊云阴影、卡套卡、四级语义同形、通用件拼壳、表情图标、无内容可透的玻璃壳层）；引导列、文字起点、右缘是关系断言要量；定位规则只写在具体类上。

## 收口

全部 Story done 后：写 `closeout.md`（各 Story 结论、verify 与 storybook:build 证据路径、HEAD、链头、问题清单处置、待 Owner 停点：推送、发版、部署、目视验收清单 `owner-acceptance.md`），把 INIT-015 保持 active 并注解收口摘要（INIT 的 done 由 Owner 目视验收后再转），然后停。
