# START · TCRN-DS-INIT-016 · DS 第二批：顶带壳、导航与布局进包，Storybook 壳改为纯包

首行硬条件：本会话从这条消息起自主运行，不等 Owner、不问「是否继续」；开工第一步就用 `/loop`（不带间隔，自定节奏）把下面的 goal 文本交给循环，之后每个回合末尾都必须留下唤醒源（下一单已派、或 ScheduleWakeup 已排），只有 goal 达成或全部剩余工作阻塞于只有 Owner 能做的决定时才停下汇报。

## Goal（按目标书写契约 v1）

TCRN-DS-INIT-016 下 TCRN-DS-STORY-135 至 150 共 16 张 Story 全部 `done`，TCRN-DS-INIT-015 下 STORY-120 至 128、131 至 133 共 13 张 `done`，候选分支在本工作树本地提交完毕，`corepack pnpm@10.12.1 run verify` 全绿，`storybook:build` 成功，收口文件 `docs/dispatch/2026-10-13-tab-shell/closeout.md` 已写出并停在推送之前；或：剩余工作全部阻塞于只有 Owner 能做的决定（库门在 Atelier 的声明、目视验收、推送），且每个阻点已在收口文件里说明。

## 你是谁、在哪、改什么

- 你是 INIT-016 的实施对话，会话根是平台容器 `/Users/ryanlan/Code`（不是 DS 仓目录）。容器根 `/Users/ryanlan/Code/AGENTS.md` 的全部规则对你有效，特别是第三部分的批量处理原则 v3、自主运行、无人值守指令、静默汇报，和第二部分八的无效残余收尾原则。
- 开工前三个动作，按序：
  1. **把 INIT-015 候选合入 DS main 本地**（TCRN-DS-MIN-20261013-INIT016 D8 ①；不推送）：主检出 `/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System` 在 main，先 `git -C "<主检出>" status --short` 确认干净，再 `git -C "<主检出>" merge --no-ff claude/init015-gplus-renewal -m "Merge the INIT-015 candidate 184db0d into main (TCRN-DS-INIT-015)"`。候选分支在 184db0d（代码停在 510c972，verify 与 storybook:build 退出 0），比 main 多 342 个提交；main 比候选多本次开单的提交（壳层草案、成品板、生成器与本目录）。候选没有改 `docs/design/gplus-2026-10/boards/canvas.json`，预期无冲突；若有冲突，以候选为准合并、记入本批问题清单，不改设计文件内容。
  2. **建独立工作树与分支**：`git -C "<主检出>" worktree add "/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell" -b claude/init016-tab-shell main`。之后所有第二批改动、构建、门都在这棵树上用绝对路径做（`git -C`、`corepack pnpm@10.12.1 -C`）；主检出只用来读 `.ether` 库和做第 3 步的库门运行。
  3. **库门与 INIT-015 的 13 张 done**：见「库门（S-1）」节。门未声明时记入收口待 Owner，继续第二批，不自行声明。
- git 身份 `tpmoonchefryan <253097889+tpmoonchefryan@users.noreply.github.com>`，提交信息末尾不加 Co-Authored-By。按 Subtask 提交，提交信息带工单键号。
- 不推送、不打 tag、不发版、不部署、不改其它仓、不改宿主与 launchd；这些是 Owner 停点。控制树只经引擎（下文），永不用文件工具写 `.ether`。
- 包管理器：`corepack pnpm@10.12.1 -C "/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell" run <脚本>`；命令里不 cd、不 rm（删除改 mv 到 scratch 的 trash）；只写这棵工作树、主检出的合并与门运行、scratch 目录。verify 每次跑完会改 `docs/verification/internal-alpha/no-overclaim-scan.json` 并生成未跟踪的 `visual-selection-result.json`（INIT-015 收口第 1 节），跑门前后都要把树收干净。
- 扫描红线沿用 INIT-015（no-private-input-scan 扫文件系统而非 git 索引）：工作树内任何文件不得出现本机用户目录下的凭据目录、钥匙串目录或应用数据目录的绝对路径，不得出现 `TOKEN=` 式赋值行。

## 真值在哪

| 东西 | 位置 | 怎么读 |
| --- | --- | --- |
| 工单正文 | DS 库 `/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether`（主检出里的库；工作树里没有它，`--workspace` 永远指向这个绝对路径；项目 `project:ba2f70f9503ac43c3ec6aa36`；`--actor` 写实际执行的模型） | `node ~/.einzbern/engine/einzbern.mjs work-show --external-key <键> --workspace <库>`；Story 的 goal、acceptance、body 在 `fields` 里；INIT 与 Epic 的 scope 在 `fields.body` |
| 裁定 | `TCRN-DS-MIN-20261013-SHELL`（minutes:374bfe849f6f3a4d55238de9，D1 至 D7：壳层几何与行为、品牌资产来源、两份画布分工、单一标准、标尺表达、名册加 pin、未裁项暂行处置）；`TCRN-DS-MIN-20261013-INIT016`（minutes:1365e27063f8b009656965b1，正文编号 D8：INIT-015 收口方式、三张 cancel、库门、本 INIT 的范围与起点、S-6 处置） | `minutes-show --id` |
| 设计正本 | 成品画布「TCRN 视觉设计标准」https://claude.ai/artifact/ArthUa2urzK714fA9yPDqp（8 板：01 底盘 Token、02 字体、03 图标、04 品牌 = 四枚产品标、05 动作、06 表单控件、07a 壳层上半块、07b 壳层下半块）。仓内同内容：`docs/design/visual-standard/boards/*.dc.html`，索引 `canvas.json`，板高 `heights.json`。只看，不改画布；板文件的改动（STORY-148）记入收口文件由设计会话发布 | 浏览器或本地 `python3 -m http.server`（容器 `.claude/launch.json` 有同类条目） |
| 壳层设计数据 | `docs/design/gplus-2026-10/tools/build-shell2.mjs`：`GEOM`（几何默认值，可被 `boards/spec-geom.json` 覆盖）、`contract`（E 段消费方契约）、`tokens`（F 段 token 差异表）、`gates`（G 段 18 条门与会红的变异）、`geoRows`（D 段 12 行关系断言）、`screen()`（真实屏幕渲染）；`boards/spec-geom.json`（量过的 DOM 坐标）；`measure-shell.js`（壳层专项读数：tab/brand、pins、drop、panel、lockups optical、closeButtons、descendantStateRules）；`logos2/*.svg`（四枚产品标通过稿） | 这是 STORY-135 至 149 的数值与断言来源；门脚本的读数口径以 measure-shell.js 为准 |
| 第一批真值（合并后在仓） | `docs/design/gplus-2026-10/contract/*.json`（tokens、pairs、matrices、icons 37、marks、typography）、`scripts/lib/gplus-measure.mjs` 与 `tests/fixtures/geometry-measure`（八项测量加 shellFrame）、`docs/design/gplus-2026-10/storybook-map.*`、`docs/dispatch/2026-10-11-gplus-renewal/closeout.md`（第 3.2 节 N-1 至 N-6 的已知差距与第 4 节） | 改之前先读 |
| 现仓真值 | `packages/ui-tokens/src/index.ts`、`packages/ui-react/src/components/Navigation/Navigation.tsx`（ProductShell、SideNav、TopBar、NavItem、ProductLockup、ShellBrandLockup…）、`DataDisplay/DomainDisplay.tsx`（PageHeader、TreeNav、TocRail、SplitView、DetailLayout…）、`Layout/Layout.tsx`、`styles/base.css.ts`、`apps/storybook/src`、`scripts/*-proof.mjs` | 改之前先读 |

## 库门（S-1）：Owner 在 Atelier 声明，实施侧跑门并转 done

引擎 2.x 要求 Story 转 `done` 前，库里有一个已启用的必需门精确覆盖该 Story 的 work id，且最新一次 gates-run 在当前树上覆盖了它并全绿。DS 库现为 0 个门；门是库的持久配置，引擎对模型经 CLI 写门一律拒绝（`MODEL_WRITE_REFUSED`，remedy「change it in Atelier」），不要用 `EINZBERN_SURFACE` 变量绕过。Owner 在 Atelier 里声明的字段（已写进 D8 ①）：

| 字段 | 值 |
| --- | --- |
| name | `verify` |
| command（argv，无 shell） | `["corepack","pnpm@10.12.1","run","verify"]` |
| root | `.` |
| required / enabled / releaseOnly | true / true / false |
| covers（29 个 work id） | INIT-015：STORY-120 work:dc8820c6d2ee0915cfda3878、121 work:f777d0aeec6779529a566622、122 work:bcf1f36ee2f93d7c8b69518c、123 work:88be4a8b40a73ef49bda49ce、124 work:cd0044cd4e877982b2380237、125 work:91e4b795d04577ade46f29ab、126 work:c6f950c965e3dd9fc23e854f、127 work:b4180fe5919ef55fd45dabae、128 work:3800d0d94195b75cbab2931a、131 work:83b087aa618af6dd002d0254、132 work:a4e12893d78be775d63b4e91、133 work:7fe5f75adb667c9e50bd7c5a；INIT-016：STORY-135 至 150 的 16 个 id（见 README 键号表） |

实施侧在每轮开始先 `gates-config-list --workspace <库> --project-id project:ba2f70f9503ac43c3ec6aa36` 读门。门已声明时，INIT-015 的 13 张按下面一次做完（放在第一轮，作为链写动作）：

1. 主检出在合并后的 main 且 `git status --short` 为空。
2. `gates-run --workspace <库> --project-id project:ba2f70f9503ac43c3ec6aa36 --at <UTC> --release --work-id <13 个 id 逗号分隔>`。verify 约 7 至 10 分钟，后台跑、输出进文件；回执 `GATES_RUN_COMPLETED` 且 `ok` 为 true 才继续。
3. 把主检出收回干净：`git -C "<主检出>" checkout -- docs/verification/internal-alpha/no-overclaim-scan.json`，`visual-selection-result.json` 移到 scratch 的 trash；再读 `git status --short` 为空。引擎按树摘要匹配门运行，树变了就按「没跑过」处理。
4. 一个 `work-batch --from-file` 文件（schema `tcrn.work-batch.v1`，members 每条 `{"verb":"work-transition","id":"work:…","status":"done","summary":"…"}`，summary 不超过 160 字节；格式样例在 `docs/dispatch/2026-10-11-gplus-renewal/runs/r1/subtasks-batch.json`）一次转 13 张。引擎要求这次批里的 Story 集合与第 2 步 `--work-id` 的集合完全相等，所以 13 张必须同一批、同一次门运行，不要逐张转。
5. 逐张 `work-show` 读回 status 为 done。

本批 16 张 Story 的 done 同理：批末门在工作树上跑过后，把候选分支合入主检出 main 本地（同第 1 步的方式），在主检出上跑一次 `gates-run --release --work-id <16 个 id>`，收干净树，再一个 work-batch 转 16 张。门红则记问题清单，不转。

## 回路（批量处理原则 v3，一批 = 16 张 Story）

1. **拆分一次**：派一个子代理读完 16 张 Story 的正文、成品画布 07a 与 07b 板、`build-shell2.mjs` 的五张表与 INIT-015 closeout 第 3.2 与第 4 节，一次拆成 Subtask（每张写改动文件与依赖），用 `work-create --kind Subtask --parent-id <Story id>`（或 work-batch）落链，键号接 `TCRN-DS-SUB-113` 起（本库 Subtask 已到 112）；拆分子代理把发现的 scope 矛盾记入本批问题清单，不改 Story。
2. **分包并行**：改同一批文件或有先后依赖的 Subtask 进同一个包，包内按序；互不影响的各成一包。**第一个包固定是 STORY-135 → 136 → 137 → 138 → 139 → 140**（壳 token、标按钮、固定项、完整菜单、下拉与级联、ProductShell 顶带态），单包按序做，用顶带壳替换 INIT-015 O-1 的 ProductShell 构图一几何（D8 ④）；141、142、145 可与之并行；143、144、146 等第一个包；147、148 等 140 与 143、146；149 可先用画板夹具开发、最后对真件；150 最后。并发上限 3（「模型与子代理」节）；拆分与实施包派经济档，两个写代理不得同时改同一文件集。包完成即退役，不跑门、不验收、不写链。
3. **集成一次**：包全部完成后按依赖顺序合到本分支，冲突交一个集成子代理。
4. **门与验收批末一次**：开发期只跑受影响的局部门；批末 `verify` 一次（含 STORY-149 接入的壳层 18 条门）、主力档验收一次（按 Story 出结论），问题清单一次处置、一轮返工、一次重跑。见红只记不修。
5. **一次链写、一次汇报**：Story 转态与注解用批量入口；Subtask 免十块模板；`work-transition` 的 summary 不超过 160 字节；planned 不能直接 active（先 ready）；INIT-016 本身开工时先 ready 再 active。验收通过的 Story 转 `done`（见「库门」节）；不通过的开带 `--fixes` 关系的 Story 或补充 Subtask 回拆分（引擎 2.x 已退役 Incident 种类）。
6. **每轮知识采集**：判断代理在判断报告旁写 lessons（不超过 5 条），主线程用 `knowledge-create` 落卡并读回。
7. **一轮做完立即开下一轮**，直到 goal 达成；轮与轮之间不等 Owner、不换会话、不汇报。回路状态写 `docs/dispatch/2026-10-13-tab-shell/runs/state.md`，每轮产物在 `runs/r<n>/`，格式沿用 INIT-015。

## 模型与子代理

- 档位是变量不是人设。DS 库与协调库的 `models.category`、`models.tiers`、`execution.maxConcurrentSubagents`、`execution.dispatchTiers` 现读皆为未配置（`settings-catalog` 2026-10-13 读数 value 为 null），记为未配置、不猜；Atelier 配置之前按下表的 Owner 裁定执行（来源纪要在协调库 `/Users/ryanlan/Code/.ether`，`minutes-show --id`）。
- 档位表（Claude Code 宿主）：

| 档 | 模型 / effort | 代理定义（容器根 `.claude/agents`） | 用在哪 | 来源 |
| --- | --- | --- | --- | --- |
| 旗舰 | claude-fable-5-1 / max | 无 | 不调；设计与裁定对话专用 | minutes:23fa3c95ea1965d0a09b35f7 D1 |
| 主力 | claude-opus-5-5 / max | `einzbern-main` | 批末验收、问题清单判断、集成冲突、改共享契约的返工、升档后的返工 | minutes:73653e64a465de427be20fb2；minutes:c8739892952325c316bdcea8 D2 |
| 经济 | claude-opus-5-5 / low | `einzbern-economy` | 拆分、实施包、孤立修复 | minutes:74cc0232ca417b74a954dcf2 D1；DS 库 minutes:ef150905e3fe968a4e1d7263 |

- 派子代理时用 `subagent_type` 指定上表的代理定义：effort 只能来自定义的 frontmatter。两份定义的正文写的是 INIT-053，其执行约束（单次派工不超过 200 次模型响应、工具输出进文件按需读、见红只记不修、不发进度、不派子代理的子代理、不用 claude-fable-5-1）对本 INIT 同样有效（DS 库 minutes:2141da45c22407eab3dd0e8a）。
- 起始档与升档：孤立修复从经济档起，改共享契约（token 键集、`contract/*.json`、导出面、门的判定语义、ProductShell 的 prop 面）的返工从主力档起；同一修复目标被退回 1 次即升到主力，止于主力，再被退回停下记入收口文件交 Owner；升档目标单独成包。
- 并发与包大小：并行包上限 3（minutes:eb763b2a518d5eddc8eee84f D1）；每包不超过 150 回合，大单单独成包；每个包派工前切一份只含本包 Subtask、通用约定与跨单契约的摘录文件，派工提示只指向摘录（INIT-015 的 `runs/r1/excerpts/` 与 scratch 的 `tools/make-excerpt.mjs` 是现成做法）。
- 子代理单次派工即退役，不派子代理的子代理；子代理之间不互发进度；只有安全问题、硬阻塞与会阻塞别人的冲突可中途上报。
- 子代理只读派工指明的文件、节号或行号范围；工具输出先写进文件再按需读入，每次不超过 200 行；超过 32 KB 的文件不整读。

## 质量硬线（违反即返工）

第一批的 C1 至 C17 继续有效：fill 与 ink 永远成对换，状态选择器特异性不得高于变体选择器且不含颜色；任何元素不超出裁切祖先，固定高容器声明溢出策略；浅色与夜间同一选择器属性集相同只换值；选中态只做 6% 墨洗加字重，禁左边条、禁填充与边线兼有；面包屑、导航项、按钮、标签、徽标、表格单元、标题一律单行截断加 title；品牌资产 digest 不变；几何逐值来自 token；禁用清单（左边条、渐变、光斑、模糊云阴影、卡套卡、四级语义同形、通用件拼壳、表情图标、无内容可透的玻璃壳层）；引导列、文字起点、右缘是关系断言要量；定位规则只写在具体类上。

壳层新增的硬线（MIN-20261013-SHELL D1、D2、D7）：壳只有一种，壳内常驻侧栏与收起钮数量为 0；顶带无底无线，整行中线 26；标按钮隐形边界到固定项、固定项之间三处间距读数相等，无分割线；完整菜单与下拉的接续都是 6；级联按点击、同宽、高随左列；锁定块只装饰、不进 Tab 序列；品牌资产只取 `logos2/*.svg` 与 Brand 板 E 段原样，不重绘、不重排、不用单色版、不用 50% 不透明度；标旁文字墨迹中线 = 标中线（±1），不做视觉重心下移；登入动画只用 transform 与 opacity、每会话一次；目录与书签在页内，不在导航上。

## 收口

全部 Story done 后：写 `closeout.md`（各 Story 结论、verify 与 storybook:build 证据路径、HEAD、链头、问题清单处置、待 Owner 停点：推送、发版、部署、目视验收清单 `owner-acceptance.md`（第一批与第二批合一，STORY-150）、STORY-148 改过的成品板文件清单交设计会话发布），把 INIT-016 保持 active 并注解收口摘要（INIT 的 done 由 Owner 目视验收后再转；INIT-015 同样保持 active 到 Owner 目视），然后停。
