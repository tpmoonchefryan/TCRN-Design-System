# 摘录 · R2 批末验收分片 C（STORY-128、129、130、131、132、133；EPIC-041 + EPIC-042）

本摘录由主线程切出，验收子代理只读本摘录与下面点名的文件、节或行范围；不要整读拆分、分包、判断文件。链上 Story 的 scope 与 GWT 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init015-gplus-renewal`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，HEAD 61b0556。R2 末次 verify 跑在 e643d74（之后只改了 runs/ 下的调度文档），逐步结果见 `runs/r2/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/r2-verify/`（文件名即步号与命令；引用写作 `NN.MM log:行号`）。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不启动浏览器、不运行 einzbern 引擎。可以在会话 scratch 下写只读探查脚本（读 dist、源文件、回执与报告），脚本不入仓；门输出与探查输出先写进 scratch 文件再按需读（每次不超过 200 行，超过 32 KB 的文件按节读）。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条 GWT 给证据（日志行、文件行、回执字段）。R1 判过满足、R2 未触及的 GWT，确认没有回退即可，写「沿用 R1 满足，R2 无回退」并给一条证据。
- 只有 Owner 能定的事项（O-1…O-12，见第 6 节）未答复时按各条「未答复时」处理：受其阻塞的 GWT 记「阻塞于 Owner」，不记不满足，也不出返工项。

## 2. 本分片 Story 与链上原文

每张 Story 的链上记录已导出到会话 scratch（`fields.acceptance` 是 GWT 原文，`fields.body` 是需求十块）：

- STORY-128：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-128.json`
- STORY-129：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-129.json`
- STORY-130：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-130.json`
- STORY-131：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-131.json`
- STORY-132：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-132.json`
- STORY-133：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r2/STORY-133.json`

R1 的结论（runs/r1/judgment.md §1）：

| Story | 结论 | 未满足的 GWT | 关键缺口（一句话） | R2 返工 |
| --- | --- | --- | --- | --- |
| 128 文档层清零 | 不通过 | GWT3 | 图标 18px 覆写 72 处；文档 CSS 仍改包外观，密集与紧凑壳原型渲染为裸元素 | R2-13、R2-14、R2-16 至 R2-19、R2-37a |
| 129 矩阵与构图一样板 | 不通过（GWT3 另阻塞于 Owner） | GWT1、GWT2；GWT3 待 O-1 | inputs 可见 40/42；夜间页浅色块读夜间值；landmark 重名、内部词与隐私扫描命中 | R2-23 至 R2-27a、R2-36；依赖 R2-3、R2-8、R2-10 |
| 130 画布板到 story 映射 | 不通过 | GWT1 | 映射 22 行全红：12 行夜间对比、err-msg、缺格、样板 10 行 rail | R2-27b、R2-37b；依赖 R2-3、R2-10、R2-23；样板行待 O-1 |
| 131 八项 DOM 测量门 | 不通过 | GWT4 | 夜间页对比 4.03、controlHeight 从未实测、样板必测项配错；样板 rail 待 O-1 | R2-27b、R2-28、R2-37c；依赖 R2-3、R2-10 |
| 132 契约静态门 | 不通过 | GWT4 | 现仓 C2 红 7 条、C5 红 1 条；C7 只要求 title 非空 | R2-31；C2/C5 落点 R2-5、R2-8、R2-9 |
| 133 门接入 verify 与 CI | 不通过 | GWT1 部分 | 接线齐，但真实 verify 停在第 6 步、另 10 步红；冒烟输出被截断 | R2-20、R2-21、R2-22、R2-29、R2-30、R2-32；verify 全绿另待 O-1 |

## 3. R2 落到本分片的 Subtask

| Subtask | 标题 | 包 | 来源 |
| --- | --- | --- | --- |
| SUB-063 | 清除文档层改包组件外观的覆写（图标 18px、全局字标字号、包类副本） | P5 | R2-13、C-1、B-10、W2-E P13、W3-B P3 |
| SUB-064 | 文档壳顶栏搜索框改按包工具形态，文档壳视觉 oracle 的搜索三项按 G+ 重写 | P5 | R2-14、C-2、W6-B P3 |
| SUB-065 | 新增规则级守卫：文档样式源里以包类为主体的规则只准声明摆放属性 | P5 | R2-16、C-3、W3-B P3 |
| SUB-066 | 密集与紧凑壳原型按 delete-demo 退役，并删除只守护它们的冒烟断言 | P6 | R2-17、C-4、C 2.7 |
| SUB-067 | 字号样本标签五语随 token 拼接，s254 折叠选择器改用 tcrn-doc- 前缀 | P6 | R2-18、B-12、C-5、W6-B P8 |
| SUB-068 | 加载示例的 status 角色从 Card 移到外层包裹元素 | P6 | R2-19、C 第 4 节 |
| SUB-069 | doc-shell 清零差集证据入仓 | P12 | R2-37a、C 第 4 节 |
| SUB-070 | inputs 矩阵的 MultiSelect 以静态展开态渲染，opt-sel 两格可见 | P7 | R2-23、B-14、C-6 |
| SUB-071 | 矩阵分节与样板壳的 landmark 名按主题块区分 | P7 | R2-24、B-16、C-7 |
| SUB-072 | 品牌样板表去掉 Asset ID 列里的仓库名标识 | P7 | R2-25、C-8 |
| SUB-073 | 矩阵渲染器的 JSX key 属性不再独占行首，隐私扫描转绿 | P7 | R2-26、W7-A P1、W6-A P2 |
| SUB-074 | Actions 与 Inputs 矩阵控件补 data-h 测量钩子 | P7 | R2-27a、C-12、W5-B P8 |
| SUB-075 | R2 末刷新故事高度宽限表的陈旧记录 | P12 | R2-36、C-19、W6-B P9、拆分 P24 |
| SUB-076 | R2 末再生映射报告 | P12 | R2-37b |
| SUB-077 | 几何门必测项按板调整：样板测 rail、矩阵测 controlHeight，映射同步 | P8 | R2-27b、C-12、W5-B P8 |
| SUB-078 | R2 末再生几何测量报告 | P12 | R2-37c |
| SUB-079 | C7 对第一批承载元素要求 title 含可见文字，Button 禁用原因并入 title | P10 | R2-31、C-20、W4-B Q9a |
| SUB-080 | 导航壳故事调整版面，搜索结果浮层不再压住正文 | P6 | R2-20、C-16、W6-B P5 |
| SUB-081 | storybook-smoke 静止值改在交互前快照、读数等过渡结束 | P6 | R2-21a、B-8a、C-17 |
| SUB-082 | storybook-smoke 改用 exitCode 退出，完整输出不再被截断 | P6 | R2-22、C-18 |
| SUB-083 | internal-alpha 与 MultiSelect 下拉证明读数等过渡结束 | P9 | R2-21b、B-8b、B-8c、C-17 |
| SUB-084 | internal-alpha 的 clipped 判定排除带 title 的 C7 单行截断与单行纵向字体度量溢出 | P9 | R2-29、B-9、W6-B P7 |
| SUB-085 | internal-alpha 的 axe 对品牌后缀登记字标豁免，与 token-contrast 豁免同源 | P9 | R2-30、B-15、C O-3 |
| SUB-086 | README 五语与 foundation 标准页的门命令改为现行写法 | P11 | R2-32、C-22、W6-A P10 |

每张 Subtask 的判据原文在 `runs/r2/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回与问题文件（每份 7–18 KB）：
  - P5：`runs/r2/handoff/P5.md`、`runs/r2/problems/P5.md`
  - P6：`runs/r2/handoff/P6.md`、`runs/r2/problems/P6.md`
  - P7：`runs/r2/handoff/P7.md`、`runs/r2/problems/P7.md`
  - P8：`runs/r2/handoff/P8.md`、`runs/r2/problems/P8.md`
  - P9：`runs/r2/handoff/P9.md`、`runs/r2/problems/P9.md`
  - P10：`runs/r2/handoff/P10.md`、`runs/r2/problems/P10.md`
  - P11：`runs/r2/handoff/P11.md`、`runs/r2/problems/P11.md`
  - P12：`runs/r2/handoff/P12.md`、`runs/r2/problems/P12.md`
  - I1：`runs/r2/handoff/I1.md`、`runs/r2/problems/I1.md`
- 主线程问题清单 `runs/r2/problems/main.md`（RM1–RM18：集成修复、各包自定取舍、要目视的项、交 Owner 的项）。
- R2 末次 verify：`runs/r2/verify/steps.md`（表与红步尾部）；复合步 tokens:proof 与 internal-alpha:proof 已逐段跑。
- R1 本分片的验收文件 `runs/r1/acceptance/C.md`（R1 的逐 GWT 证据与口径，按节读）。

## 5. R1 判断的知悉、授权外与按建议先做（runs/r1/judgment.md §3.2–§3.4）

### §3.2 知悉（不需裁定，收口列明）

- 文档壳视觉 oracle 的搜索三项随 G+ 替换（R2-14；拆分 P18、C O-5）。
- 视觉签名基线整体替换，SUB-046 逐条以 accepted-layout-change 接受（拆分 P18）；目视另行。
- 故事高度宽限表刷新，变高条目列前后值（R2-36；拆分 P24、C O-5）。
- 第二批以后家族的状态徽标失去绿色与琥珀色底，改为中性 wash（A 2.1，W2-A P10 口径）。
- Actions 板 B 段标签按值反查 token 名（W1-A P1），属画板字节，随下一次画布修订改。
- STORY-120 正文的「3.44」按画板算法应为 3.36 与 2.89（W3-A P2），只注解、不改正文。

### §3.3 授权外或待 O-1，不列返工

- C-21 文档壳跟随包壳几何（第 11 步侧栏、品牌关系）：目标几何取决于 O-1，未答复时暂缓，见 O-1。
- 壳上下文里图标 11px、壳侧栏品牌链接继承默认链接色（`a.tcrn-product-shell__brand` 宜 `color: inherit`）：Navigation 家族。
- 非 Actions 家族的按压缩放（nav-item、locale 触发器、表格工具栏 chip 等，W3-D P2）与十余条旧焦点写法（W3-D P3）：后续家族。
- doc:sample-style 的 package-context 142 处按家族交后续批次（C 2.7 W5-C 条件③）。
- Field 其余外观与错误图标（第五批）；Text 外距与 caps 截断写进 typography.json（下次契约修订）。
- stamp 字栈以系统 Songti SC 打头（stamp 负责方）；tabular-nums 全局应用（页面与壳层根）。
- AI 消费契约没有暴露 51 个弃用名（W2-A P12，AI 契约负责方）；弃用通知两种计数口径对齐或 bin 入口（W7-A P7，EPIC-043 后续）。

### §3.4 按建议先做（实施对话自定，收口回显，Owner 可事后更正）

1. R2-6 只读获焦补焦点环（与画板状态顺序不同）。
2. R2-10 Field 错误态整块洗底一并去掉（P29 口径更正）；Owner 不接受时，把 126-GWT5 的 err-msg 两格移到第五批。
3. R2-12 快捷键 ink-3 改 ink-2；若 Inputs 板本身画的是 ink-3，以 C1 文字阈值为准，回显给 Owner。
4. R2-17 密集与紧凑壳原型退役并删除守护断言（C O-4）；Owner 要保留时，改为第二批用包组件重画。
5. R2-30 axe 对品牌后缀登记字标豁免（沿用 token-contrast 已登记的 D2 与 B1 板 F 段依据）。
6. R2-8 主题钮图标显隐改由 data-current-theme 控制（取 C-9，不取 B-3）。
7. R2-29 clipped 判定排除 C7 合规截断；R2-31 收紧 C7 并改 Button 禁用原因的 title。
8. R2-16 守卫例外的登记（后续家族沿用 EX-INIT015-* 写法），收口逐条列出。
9. O-10 契约注释改为与焦点环行为一致。
10. C-21 暂缓到 O-1 之后，不按包壳现行几何先改一遍。
11. 三片已判可接受的实施口径一并回显：W1-C 拦截 data: URI、W2-G 复制 OFL 进 storybook-static、W2-A P10 别名目标、W3-A P4 字标豁免与 bg 承载面、W2-H 只含 transparent 的 outline 放行、W1-B P5、W2-B P4/P5/P6、W2-D P7、W3-D P5（vertical-align middle）、W1-D 包写出的类不计包外类、W5-C `--strict` 不设默认、W1-E 的 C2/C6/C11 口径、W6-A 门序与命名、拆分 P5/P17/P22/P31 的载体调整、M5 `.tcrn-icon` 基类进包。

## 6. 只有 Owner 能定的事项（runs/r1/judgment.md §3.1，均未答复）

### §3.1 待裁事项（按影响排序）

**O-1 构图一的壳层几何是否算 G+ 底盘、纳入 INIT-015**（拆分 P1、B O-1、C O-1、映射 DIFF-1）
- 问题：样板引导列 16/49/77、纸离边 0、顶栏 68，ProductShell 侧栏 280、收起 92；构图一要求引导列 16/48、纸离边 12、顶栏 52、侧栏 220、收起 52。INIT 不授权改第二批以后的家族，禁用清单禁止通用件拼壳。
- 受影响：127-GWT4（52px）、129-GWT3、130-GWT1 的样板 10 行、131-GWT4 的样板 rail、第 11 步文档壳关系（C-21）、第 30 步壳侧栏洗底上的标语对比（O-2）；进而 120-GWT5 与 133-GWT1 的 verify 全绿，以及 134 的前置条件。
- 建议：按 D1「页面构图采用构图一」授权，只改 ProductShell 这几项：引导列 16/48、纸离边 12（14 圆角加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色且无右边线；Navigation 家族其余行为留第二批。
- 未答复时：保持阻塞。R2 做完其余返工；样板 rail 行与第 11 步文档壳关系保持红并注明 O-1；不以记差异代替。Owner 不授权时，把 129-GWT3 与 127-GWT4 的 52px 移到 Navigation 批次（改判据，须 Owner 明示），样板 rail 按包现行几何记差异，C-21 按包壳现行几何对齐（经济档）。

**O-2 锁定组合标语与壳品牌说明的对比度**（B 127「其它发现」、C O-3 标语部分）
- 问题：`.tcrn-product-logo__line-two` 与 `.tcrn-shell-brand-lockup__caption` 用 ink-3，落在壳侧栏的 acc-bg 洗底上：浅色 #6b675d 于 #dde4df 4.36，夜间 #85827a 于 #172421 4.17（样板、AOS 视觉实例、知识库壳）。
- 受影响：第 30 步 axe。
- 建议：随 O-1 把侧栏改为画布色即可达标（ink-3 于 bg 不低于 4.5，120-GWT2 已证）；O-1 不授权时二选一：标语按商标字标豁免（WCAG 1.4.3 logotype 例外），或标语改 ink-2。
- 未答复时：保持红并注明 O-2；不自行加豁免（标语没有既有裁定依据）。文档壳品牌区的洗底在 R2-13 删去外观后复核。

**O-3 夜间品牌后缀色**（A O-1、B O-2、C O-3、拆分 P15）
- 问题：后缀两主题同值；TMS #2c63c8 于夜间 panel 3.13、bg 3.33，靠字标豁免登记并标注「夜间值待 Owner」。
- 受影响：127 的可读性（GWT3 只判浅色）；token-contrast 与 axe 的夜间 TMS 豁免条目。
- 建议：TMS 夜间改用 D5 同标浅色 #7aa0f5（于 #191916 6.86、于 #121210 7.30），撤掉两条夜间豁免；DS #6577f3 夜间已达标，不改。定后只改 `contract/tokens.json` 的 brand 条目与生成器 brand 形状（主力档），门会把过期豁免判红、提示删除。
- 未答复时：维持两主题同值与字标豁免，不改色值。

**O-4 映射里待裁的差异**（C O-2）
- DIFF-3 画布内部两处不一致（212/48 对 220/52）：建议以构图板 220/52 为准。DIFF-2 构图三没有 story：建议随 O-1 一起定，授权则下一轮补构图三样板，否则记到页面模板批次。DIFF-8 产品标六档尺寸阶梯与贴片没有 story：建议放第二批品牌。DIFF-7 只需知悉。
- 受影响：130 的 differencesPendingOwner。
- 未答复时：保持 differencesPendingOwner，不补 story。

**O-5 外壳切换钮尺寸**（B O-3、W3-D P1、W2-D P15、W6-B P2）
- 问题：主题钮 36 胶囊、侧栏钮 38、移动导航钮 44，与 IconButton md 32、圆角 8 不一致；冒烟比较器按现行几何。
- 建议：桌面两枚改 IconButton md 32 加 radius-control，移动导航钮 44 登记为触控例外；属壳层件，随 O-1 或放第二批。
- 未答复时：维持现状。

**O-6 组件内字面几何是否补 token**（B O-6；与 R2-4 的分界）
- 问题：按钮内图标 13/15、勾选 16、开关 34×20、末端区 30、贴片圆角 11 等仍是字面值。C10 只管壳层几何，B 判不算硬线违例；字体刻度已有 token，按 122 的「单一真值」目的锚列为 R2-4，只引用已有 token。
- 建议：下次契约修订补 token，不阻断本轮。
- 未答复时：不新增 token。

**O-7 Typography API**（B O-5、W2-B P5、P9）
- 建议：numeral 不截断，在 `docs/contract/roles.json` 写明非单行截断角色；numeral-inline、large、mono 暂经 className，尺寸 prop 与 `as="span"` 下批再议。
- 未答复时：维持现状（numeral 不截断、给 title），不改 roles.json。

**O-8 B1 与 B2 品牌规格分歧**（B O-4、W2-F #13）
- 问题：B1（现实现）字标 500 加后缀 600、标 38/28/22；B2 为 sans 整词 600、示意标 44；doc:sample-style 读到壳内字标 12.5px/600 对矩阵 14px/500。
- 建议：保持 B1，目视清单点名确认。未答复时：保持 B1。

**O-9 secondary 与 danger 默认 edge 的抬升层是浅墨字面量**（A O-4、W1-A P2、W2-D P9）
- `0 1px 1px rgba(22,21,15,.04)` 两主题共用，夜间几乎不可见。建议本批维持画板，下次画板修订改主题化 token。未答复时：维持。

**O-10 焦点环间隙色是否随承载面变化**（A O-5）
- 契约注释写「跟随承载面（纸上为 panel）」，包与画板实际都显示 bg 色间隙。建议维持画板行为，把契约注释改成与行为一致（P1 顺手改，列 §3.4）；要间隙随纸面变白需改焦点环声明方式，属视觉改动。未答复时：按建议。

**O-11 中文子集是否加「常用 3500 字」**（A O-2、拆分 P9、W1C-2）
- 建议不加；要加请给定字表来源，由 fonts-vendor 加选切片。未答复时：不加。

**O-12 上游三份 LICENSE 的版权行只写 Google Inc.**（A O-3、W1C-1，知悉）
- 建议维持原样；附各项目自身的 OFL.txt 属新增下载来源，由 Owner 决定。本判断不对许可合规下结论。

## 7. 交付

写 `runs/r2/acceptance/C.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号），格式沿用 R1：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 的结论与证据；R2 各 Subtask 的判据是否达成（包自报与实测不一致时以实测为准并写明）。
3. 返工清单：编号 C2-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义——起主力，孤立修复起经济）、是否 R2 已改过同一目标（同一修复目标第二次返工，经济档升主力；主力档再退回交 Owner）。
4. 只有 Owner 能定的事项：新发现的与 O-1…O-12 的关联、建议与未答复时的处理。
5. 实施口径判定：本分片各包的自定取舍（handoff 的 §3.4 回显与 main.md 的 RM 条目）逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
