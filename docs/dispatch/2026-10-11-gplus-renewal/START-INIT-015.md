# START · TCRN-DS-INIT-015 · DS 焕新：G+ 底盘、第一批五家族与四枚产品标进包，Storybook 只渲染包

首行硬条件：本会话从这条消息起自主运行，不等 Owner、不问「是否继续」；开工第一步就用 `/loop`（不带间隔，自定节奏）把下面的 goal 文本交给循环，之后每个回合末尾都必须留下唤醒源（下一单已派、或 ScheduleWakeup 已排），只有 goal 达成或全部剩余工作阻塞于只有 Owner 能做的决定时才停下汇报。

## Goal（按目标书写契约 v1）

TCRN-DS-INIT-015 下 TCRN-DS-STORY-120 至 134 共 15 张 Story 全部 `done`，候选分支在本工作树本地提交完毕，`corepack pnpm@10.12.1 run verify` 全绿，`storybook:build` 成功，收口文件 `docs/dispatch/2026-10-11-gplus-renewal/closeout.md` 已写出并停在推送之前；或：剩余工作全部阻塞于只有 Owner 能做的决定，且每个阻点已在收口文件里说明。

## 你是谁、在哪、改什么

- 你是 INIT-015 的实施对话，跑在 `TCRN-Design-System` 的独立工作树与分支上；cwd 就是这棵树。容器根 `/Users/ryanlan/Code/AGENTS.md` 的全部规则对你有效，特别是第三部分的批量处理原则 v3、自主运行、无人值守指令、静默汇报，和第二部分八的无效残余收尾原则。
- git 身份 `tpmoonchefryan <253097889+tpmoonchefryan@users.noreply.github.com>`，提交信息末尾不加 Co-Authored-By。按 Subtask 提交，提交信息带工单键号。
- 不推送、不打 tag、不发版、不部署、不改其它仓、不改宿主与 launchd；这些是 Owner 停点。控制树只经引擎（下文），永不用文件工具写 `.ether`。
- 包管理器：`corepack pnpm@10.12.1 -C "<本工作树>" run <脚本>`，命令里不 cd、不 rm（删除改 mv 到 scratch 的 trash）。

## 真值在哪

| 东西 | 位置 | 怎么读 |
| --- | --- | --- |
| 工单正文 | DS 库 `TCRN Platform/TCRN-Design-System/.ether`（在本工作树里 `--workspace` 指向主检出的这个路径） | `node ~/.einzbern/engine/einzbern.mjs work-show --external-key <键> --workspace <库>`；Story 的 goal、acceptance、body 在 `fields` 里；INIT 与 Epic 的 scope 在 `fields.body` |
| 裁定 | `minutes:` 记录 `TCRN-DS-MIN-20261011-GPLUS-RENEWAL`（D1 至 D8） | `minutes-show` |
| 设计正本 | 画布 https://claude.ai/artifact/DuPjVjwSK6Wb9qthW4BwFz 版本 33（草稿与确认面） | 只看，不改 |
| 设计数据与画板 | `docs/design/gplus-2026-10/`：`tools/lib.mjs` 的 `T`（token 对象）、`ICONS`（37 件路径）、`build-actions.mjs` 的 `pairs()`、`build-inputs.mjs` 的对表 CSS、`build-logos2.mjs` 的 `MARKS` 与 `PAL`、`boards/*.dc.html`（每块板的矩阵表与 F 段 token 差异）、`measure.js`（八项测量）、`logos2/*.svg` | 这是 STORY-122 要抽成 `contract/*.json` 的来源；在那之前实现与 story 直接读这些文件 |
| 现仓真值 | `packages/ui-tokens/src/index.ts`、`packages/ui-react/src/components/**`、`tcrnComponentCss`、`apps/storybook/src`、`scripts/*-proof.mjs`、`docs/style-scale.md` | 改之前先读 |

## 回路（批量处理原则 v3，一批 = 15 张 Story）

1. **拆分一次**：派一个子代理读完 15 张 Story 的正文与 `docs/design/gplus-2026-10`，一次拆成 Subtask（每张写改动文件与依赖），用 `work-create --kind Subtask --parent-id <Story id>` 落链；拆分子代理把发现的 scope 矛盾记入本批问题清单，不改 Story。
2. **分包并行**：改同一批文件或有先后依赖的 Subtask 进同一个包，包内按序；互不影响的各成一包；依赖顺序大体是 EPIC-039 → 040 → 041 → 042 → 043，但 039 与 128（文档层清零）、131/132 的门脚本可早做。并发上限 `execution.maxConcurrentSubagents` 为 8；两个写代理不得同时改同一文件集。包完成即退役，不跑门、不验收、不写链。
3. **集成一次**：包全部完成后按依赖顺序合到本分支，冲突交一个集成子代理。
4. **门与验收批末一次**：开发期只跑受影响的局部门（STORY-119 的分阶段规则）；批末 `verify` 一次、Opus 档验收一次（按 Story 出结论），问题清单一次处置、一轮返工、一次重跑（MIN-218）。见红只记不修。
5. **一次链写、一次汇报**：Story 转态与注解用批量入口；Subtask 免十块模板；`work-transition` 的 summary 不超过 160 字节；planned 不能直接 active（先 ready）。验收通过的 Story 转 `done`；不通过的开 Incident（`--fixes`）或补充 Story 回拆分。
6. **每轮知识采集**：判断代理在判断报告旁写 lessons（不超过 5 条），主线程用 `knowledge-create` 落卡并读回。
7. **一轮做完立即开下一轮**，直到 goal 达成；轮与轮之间不等 Owner、不换会话、不汇报。

## 模型与子代理

- 三档按 Owner 2026-09-22 裁定（MIN-214/215）：主力与经济档都是 `claude-opus-5-5`，效果档不调旗舰；DS 库未配置 `execution.dispatchTiers`，记为未配置，不猜。
- 子代理单次派工即退役，不派子代理的子代理；子代理之间不互发进度；只有安全问题、硬阻塞与会阻塞别人的冲突可中途上报。
- 子代理只读派工指明的文件、节号或行号范围；工具输出先写进文件再按需读入，每次不超过 200 行；超过 32 KB 的文件不整读。

## 质量硬线（违反即返工，来自画布打回总账 C1 至 C17）

fill 与 ink 永远成对换，状态选择器特异性不得高于变体选择器且不含颜色；任何元素不超出裁切祖先，固定高容器声明溢出策略；浅色与夜间同一选择器属性集相同只换值；选中态只做 6% 墨洗加字重，禁左边条、禁填充与边线兼有；面包屑、导航项、按钮、标签、徽标、表格单元、标题一律单行截断加 title；工具栏声明唯一让步项；品牌资产 digest 不变；几何逐值来自 token；禁用清单（左边条、渐变、光斑、模糊云阴影、卡套卡、四级语义同形、通用件拼壳、表情图标、无内容可透的玻璃壳层）；引导列、文字起点、右缘是关系断言要量；定位规则只写在具体类上。

## 收口

全部 Story done 后：写 `closeout.md`（各 Story 结论、verify 与 storybook:build 证据路径、HEAD、链头、问题清单处置、待 Owner 停点：推送、发版、部署、目视验收清单 `owner-acceptance.md`），把 INIT-015 保持 active 并注解收口摘要（INIT 的 done 由 Owner 目视验收后再转），然后停。
