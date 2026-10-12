# 摘录 · R3 批末验收分片 B（STORY-123、124、125、126、127；EPIC-040）

本摘录由主线程切出，验收子代理只读本摘录与下面点名的文件、节或行范围；不要整读拆分、分包、判断文件。链上 Story 的 scope 与 GWT 是任务权威。

## 1. 被验对象与方法

- 被验对象：集成分支 `claude/init015-gplus-renewal`，工作树 `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`，HEAD 3f9d658。R3 末次 verify 跑在 3f9d658（之后只改了 runs/ 下的调度文档）：逐段运行 30 步 44 段全绿（`runs/r3/verify/steps.md`，逐段日志在会话 scratch `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/r3-verify/`，引用写作 `NN.MM log:行号`），另有真实 `corepack pnpm@10.12.1 run verify` 与 `storybook:build` 各一次（日志 `/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/r3-final/verify.log`、`storybook-build.log`，退出码在 `verify.meta`）。
- 方法：只读。不改代码、门、回执、链，不重跑门、不构建、不启动浏览器、不运行 einzbern 引擎。可以在会话 scratch 下写只读探查脚本（读 dist、源文件、回执与报告），脚本不入仓；门输出与探查输出先写进 scratch 文件再按需读（每次不超过 200 行，超过 32 KB 的文件按节读）。
- 结论用语：满足 / 不满足 / 部分 / 阻塞于 Owner。逐条 GWT 给证据（日志行、文件行、回执字段）。R2 已判满足且 R3 未触及的 GWT，确认没有回退即可，写「沿用 R2 满足，R3 无回退」并给一条证据；R3 改到的（壳几何、TMS 夜间后缀、文档壳、映射、门、基线）要重验。
- O-1…O-4 已由设计会话 B 类裁定（Owner 事后可更正），O-5…O-12 按默认执行（第 5 节）；按裁定后的判据判，不再以「待 Owner」处理这几项。Story 的 goal 写明判定人为 Owner 的（130、134）与「门判与 Owner 目视」的，只给机器判据结论，不代签。另知：引擎要求库内声明覆盖该 Story 的门才能转 done（R2 问题 RM20，交 Owner），这不影响验收结论。

## 2. 本分片 Story 与链上原文

每张 Story 的链上记录已导出到会话 scratch（`fields.acceptance` 是 GWT 原文，`fields.body` 是需求十块，`record.summary` 是 R2 结论）：

- STORY-123：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-123.json`
- STORY-124：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-124.json`
- STORY-125：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-125.json`
- STORY-126：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-126.json`
- STORY-127：`/private/tmp/claude-501/-Users-ryanlan-Code/c04aa113-5e59-4774-a41d-f828ef706cc7/scratchpad/chain/r3/STORY-127.json`

R2 的结论（runs/r2/judgment.md §1）：

| Story | R2 结论 | 未满足或阻塞的 GWT | 关键缺口 | R3 去向 |
| --- | --- | --- | --- | --- |
| 123 Typography | 通过 | — | — | 本次转 done |
| 124 Icon | 通过 | — | 判定人含 Owner 目视，未代签 | 本次转 done |
| 125 Actions | 通过 | — | O-5、O-9 按默认维持 | 本次转 done |
| 126 Inputs | 通过 | — | 静态展开态横排（B2-1），验收点在 129 | 本次转 done；R3-7 挂 129 |
| 127 Brand | 阻塞于 Owner | GWT4 | 收起宽仍是 92 | R3-1、R3-2、R3-11 |

## 3. R3 落到本分片的 Subtask

| Subtask | 标题 | 包 | 来源 |
| --- | --- | --- | --- |
| SUB-088 | TMS 夜间品牌后缀改为 #7aa0f5，生成器 brand 形状支持可选夜间值，撤两条 TMS 夜间豁免 | P1 | R3-2、O-3、RM19 |
| SUB-089 | geometry-proof 的品牌检查加收起态读数：侧栏宽 52、标 22×22、文案不显示，变异判红 | P3 | R3-11、127-GWT4、O-1 |

每张 Subtask 的判据原文在 `runs/r3/decomposition.md` 第 3 节，节标题 `#### TCRN-DS-SUB-NNN · 标题`，按需只读对应节。没有 R3 Subtask 的 Story 只核无回退。

## 4. 证据文件（按需读）

- 本分片涉及的包的交回与问题文件（每份 7–18 KB）：
  - P1：`runs/r3/handoff/P1.md`、`runs/r3/problems/P1.md`
  - P3：`runs/r3/handoff/P3.md`、`runs/r3/problems/P3.md`
  - P5：`runs/r3/handoff/P5.md`、`runs/r3/problems/P5.md`
- 主线程问题清单 `runs/r3/problems/main.md`（R3M1–R3M7：各包结果、集成修复、主线程的 SUB-101 方案裁定、交判断与目视的项）。
- R3 末次 verify：`runs/r3/verify/steps.md`；复合步已逐段跑。
- R2 本分片的验收文件 `runs/r2/acceptance/B.md`（R2 的逐 GWT 证据与口径，文首有节行号，按节读）。

## 5. R2 判断的裁定、默认、B 类裁定、只能由 Owner 做的事、按建议先做与知悉（runs/r2/judgment.md §3）

### §3.1 已由设计会话裁定（B 类，Owner 事后可更正）

**O-1 构图一壳层几何：已授权。**
- 范围：只有引导列 16/48、纸离边 12（圆角 14 加 s1）、顶栏 52、侧栏 220 与收起 52、侧栏画布色无右边线；数值取自 token；Navigation 家族其余行为、结构与 API 不动，留第二批。设计会话的依据：127-GWT4、129 判据、131 样板 rail 是 Owner 已批正文，禁用清单不许通用件拼壳，INIT 正文与判据冲突时以判据为准。
- R2 的更正与补充：第 30 步手机锚点不受 O-1 影响（C2-3），从 O-1 影响列表与 SUB-046 阻塞列表删去；授权后补「纸离边 12」「顶栏 52」测量（R3-4）、C-21（R3-10）与收起读数（R3-11）；现有 token 缺 4 个（R3-1），判属授权的直接需要。
- 仍受影响：127-GWT4、129-GWT3、130-GWT1 样板 10 行、131-GWT4、第 11、18、19 步，进而 120-GWT5、133-GWT1 与 134 前置。
- Owner 更正时（不授权）：按 R1 §3.1 O-1「Owner 不授权时」处理，撤回 R3-1、R3-4、R3-10、R3-11 与 DIFF 状态（约一个主力包），52px 两条判据移到 Navigation 批次（改判据须 Owner 明示），样板 rail 按包现行几何记差异，C-21 按包壳现行几何对齐。
- 提示：这一项本质是 INIT 范围与 Story 判据的冲突，设计会话按 B 类处理；本判断照此执行，不另作 A 类裁定，收口列给 Owner 确认。

**O-2 标语与壳品牌说明的对比：随 O-1 解决，不另做豁免。**
- 合并 N-1：文档导航分类计数（ink-3 落在 acc-bg 洗底上，4.35:1）机制相同，随 R3-10 一起解决。
- R3 末复核第 30 步 axe 为 0（ink-3 于 bg 浅色 4.86、夜间 4.89）。若仍有这两类节点：不自行加豁免，收口交 Owner 在「字标豁免」与「改 ink-2」之间二选一（R1 原建议）。Owner 更正时同此二选一。

**O-3 夜间品牌后缀色：TMS 夜间 #7aa0f5，DS 不改，撤 token-contrast 与 axe 的两条 TMS 夜间豁免，只改 brand 项并重生。**
- 合并 RM6（axe 字标豁免不分主题与承载面）：维持（§3.3 第 3 条）。O-3 与 O-1 落地后豁免只剩 DS 浅色两条，夜间样板侧栏的 6 个 DS 后缀节点随画布色约 4.9，不再依赖豁免。
- R3 落点：R3-2；DIFF-10。Owner 更正时：撤回夜间值与生成器形状，恢复两条豁免（主力小改）。

**O-4 映射待裁差异：DIFF-3 以构图板 220/52 为准；DIFF-2 构图三样板随 O-1 授权、R3 补。**
- 合并 DIFF-9（主线程归类）；DIFF-8、DIFF-9 设计会话未提及，由本判断定（§3.3 第 1、2 条）。R3 落点：R3-8、R3-14。Owner 更正时：DIFF-2 改记页面模板批次并撤回构图三（经济）。

### §3.2 按默认执行（设计会话指示 O-5…O-12 按 R1「未答复时」）

- O-5 外壳切换钮尺寸：维持（36 胶囊、38、44）；R3-1 收起 52 须放得下 38 钮。更正时：桌面两枚改 IconButton md 32 加 radius-control，随第二批或另开。
- O-6 组件内字面几何：不新增 token。合并 RM8：typography.scale 余 4 条字面值（numeral-inline 16px、numeral-large 44/48px、mono 11.5px）保留，Typography.test 钉住。R3-1 的壳层 token 不属 O-6。更正时：typography.json 补 4 条刻度 token 并注册（主力）。
- O-7 Typography API：维持（numeral 不截断、给 title）；R3-17 只改 roles.json 的 description。
- O-8：保持 B1，目视清单点名确认（R3-19）。
- O-9：edge 抬升层浅墨字面量维持（dist:174）；R3-19 在清单补一行。
- O-10：已按建议执行（tokens.json:49 注释），收口回显。
- O-11：不加 3500 字。O-12：维持；本判断不对许可合规下结论。

### §3.3 本判断作出的 B 类裁定（收口回显，Owner 可更正）

1. DIFF-8 记「待 Owner 知悉：第二批品牌」，不补 story：所在的 V2-B2-Logos-Draft 是第二批草稿板，INIT 不授权第二批家族；R1 原建议相同。
2. DIFF-9 记「待 Owner 知悉」，不恢复资产 ID 列（R3-8）。
3. RM6：axe 字标豁免维持「后缀选择器 + 登记色」匹配，不加主题条件；回执继续逐节点列出（C §4 O-3 的建议）。
4. searchOverlay 期望 8 → 6；静态展示用文档前缀类加登记例外（R3-9）。
5. 4 个壳层 token 的新增与命名（R3-1）；构图三内容宽不新增 token（R3-14）；独立 TopBar 高度不改。
6. 冒烟、full-surface 与锚点门里记录旧壳几何的期望按 O-1 改值，不算改阈值（R3-5、R3-6）。
7. C2-4 取改词典键的方案（R3-15）。
8. 第 30 步与漏译来源的归因更正只记在判断与注解，不改写 R2 运行文档。
9. Story 判定人：130、134 的 goal 写「判定人：Owner」，机器判据全满足也由 Owner 判定，实施侧不转 done，收口列给 Owner。124、126、127、129 写「门判与 Owner 目视」，按 R1 §5 与 D8 的做法，机器判据满足即转 done，目视另行、不代签；Owner 若要求目视后才可 done，可事后更正，已转 done 的不回退，目视不通过按新工作处理。
10. 链上：SUB-080 保持 active，由 R3-9 承接，达成后随 R3 链写转 done；SUB-046、SUB-076、SUB-078 保持 active，R3 末重做；判据字面达成但带副作用或余项的 Subtask 转 done 并注解去向（§4.1）。
11. 父单调整：126、128、132 本轮转 done，后续返工挂仍开着的 Story：R3-7 挂 129，R3-13、R3-16 挂 134。
12. R3-7 按 R2 拆分第 1 节第 12 条单独成包（R3-P5）。若主线程为省额度要并进 R3-P2，那是改派工方法，按 Owner 规则由主线程决定，本判断不擅自合并。

### §3.4 只能由 Owner 做的事（收口列明）

1. Owner 目视验收（owner-acceptance.md 10 节，含 R3 新增项）；机器结果不代签（D8）。
2. STORY-130、STORY-134 的判定（goal 判定人为 Owner）。
3. 推送、打 tag、发版、部署（D8 停点）。
4. 对 §3.1、§3.2、§3.3 各项的事后更正。
5. 画板修订（设计权威侧，建议一次做完，不阻断本轮）：Inputs 板补只读获焦 rf 一行（R1 §3.4 第 1 项、RM10）；Inputs 板快捷键 ink-3 改 ink-2（§3.4 第 3 项；浅色于 wash 叠 bg 4.31、夜间 3.89–3.90）；Brand 板夜间说明的 TMS 色（DIFF-10）；GPlus 底盘板 kv 表「侧栏 212 · 顶栏 48」改 220/52（DIFF-3）。改之前都有差异记录；Inputs 板的 rf 声明没有门比对。
6. 可能出现的停点：R3-1、R3-14 碰到 Navigation 结构或 API；R3-7、R3-9 再退回；R3 末 axe 仍红（O-2 二选一）。

### §3.5 按建议先做（R2 各包的自定取舍，判可接受，收口回显）

- P1：O-10 只改注释；选择器列表按集合比较；checkC5 逻辑不改；mono 400/500 探针；夹具从契约读字族；浅色选择器由生成器派生（条件 R3-17）；ink-3 复核结论；改契约后先构建 ui-tokens。
- P2：刻度登记在 typography.json；生成器对值不符与字段未用报错；numeral 引 heading-2 token；其余字距保留字面值；生成物头部只写 CHANGELOG；Navigation.test 两条改 doesNotMatch（RM1）；链接对表与生效对 underline；透明 outline 写在 typography.css.ts；quiet 改修饰类、下划线 2px 与 acc-2（RM11）；只读获焦取 rf（§3.4 第 1 项）。
- P3：「全部状态规则」取 C2 定义（RM3 ①）；导入 selectorFacts；删默认隐藏 moon 的规则（RM3 ②）；取 C-9。
- P4：删壳内 focus-within（配套 R3-5）；选项字重经 pair-weight、hover 在 selected 后；错误态洗底删去（§3.4 第 2 项）；快捷键 ink-2（§3.4 第 3 项）；SUB-061 的方向（写法由 R3-7 改）。
- P5：宽度与换行算摆放（条件 R3-12）；保留 260 轨道；oracle 搜索边取透明静止边；跳转链接、tooltip 预览、筛选栏登记例外；demo 副本不重复扫描；守卫落在 shell-fidelity；不扩到 data 属性主体（条件：Navigation 家族批次纳入）；SUB-050 只含 var() 的层交 token 表读。
- P6：smoke.test.ts 842、844 保留（R3-13 复核）；测量宿主改指 navigation-product-shell-spec；删 81 条不再渲染的词条；SUB-080 停在越级处；SUB-081 等有限动画；冒烟 3px 归门期望过时。
- P7：MultiSelect 去掉 data-choice-presentation；landmark 按样板命名；删整列并删 4 个资产 ID。
- P8：actions.A 与构图一行加 rowAlign；iconStroke 要求实际 16px；未知探针 id 报 error。
- P9：SUB-083 等有限动画；SUB-084 接受最近带 title 的祖先（条件 R3-17）；SUB-085 豁免不分主题（§3.3 第 3 条）。
- P10：title 取「标签 — 原因」及位置定义；标签取可见文字。
- P11：CHANGELOG 第 17–19 行改写来源说法；头部与 SUB-080 只写 CHANGELOG；M10 加 link states；RM7、RM13 放对应画板节；M1 保留 CDN 主机名（迁移指引）；版本行 accepted 不改；删 s254 脚本；README 加门清单指针；计划键（条件 R3-18）。
- P12：8 条宽限记前后值；视觉选择中间产物不入仓；生成脚本只在 scratch（条件：R3-20 完成前不清理，轮换时移交）；185 条选择（条件：R3-20 按届时捕获重生、去掉已修缺陷标注）；fonts:vendor 不跑；「注明 O-1」不手改报告（条件 R3-8）。
- I1：多处「 — 」逐个切分点试。
- R1 §3.4 第 4、5、7、8、10 项已按建议做，残留与条件见上。

### §3.6 知悉（不需裁定，收口列明）

- 视觉签名：R3 末 SUB-046 写入成功时，基线由 162d5aca 换为 R3 的选择，全部为 accepted-layout-change，目视另行。
- 故事高度宽限表 R2 刷新 8 条（SUB-075）；R3 若再刷新，同样列前后值。R1 §3.2 各项照旧。
- 不进 R3 的后续项（无 GWT 或硬线依据，交后续批次）：ja 检查与 localeLeakScan 读不到 title（RM16 ①）；clipped 只在英文下跑（RM16 ②）；守卫不拦 data 属性主体（RM12 ⑤）；package-context 142 处；390px 文档壳顶栏 401px、品牌字出现两次（P9 #4，门没红）；手机视口部分截图下半部空白（RM18，既有）。
- 流程：P3、P5、P8、P12 各有只读命令带 cd（RM4），未弹框、未改文件。
- 额度：本周约 95%（10-13 05:00 重置），额度门控变量未配置；触顶按 state.md 停在原地等重置。

## 6. （并入第 5 节）

## 7. 交付

写 `runs/r3/acceptance/B.md`（直接写进被验工作树的这个路径，不提交；不超过 40 KB，文首列各节行号），格式沿用 R1：

1. 一览：Story | 结论 | 未满足或部分的 GWT | 返工项数。
2. 逐 Story：逐条 GWT 的结论与证据；R2 各 Subtask 的判据是否达成（包自报与实测不一致时以实测为准并写明）。
3. 返工清单：编号 B3-1 起，每条写现象、证据、建议改法、改动文件、建议档位（改共享契约——token 键集、contract/*.json、导出面、门的判定语义——起主力，孤立修复起经济）、是否 R2 已改过同一目标（同一修复目标第二次返工，经济档升主力；主力档再退回交 Owner）。
4. 只有 Owner 能定的事项：新发现的（含目视项）与既有裁定的关联、建议。
5. 实施口径判定：本分片各包的自定取舍（handoff 的回显与 main.md 的 R3M 条目，含 SUB-101 方案 A 与其偏差）逐条判可接受 / 有条件 / 不可接受，附理由。
6. 证据盲区：没执行或看不到的检查。

交回（最后一条回复，不超过 25 行）：一览表、返工项条数（主力与经济各几）、新增 Owner 事项、不可接受的口径。
