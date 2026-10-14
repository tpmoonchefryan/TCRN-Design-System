# R5 判断 · TCRN-DS-INIT-016（STORY-135 至 150，小轮合并）

节行号：§0 L5；§1 L10；§2 L33；§3 L44（3.1 L46、3.2 L77、3.3 L87、3.4 L95、3.5 L111）；§4 L119（4.1 L121、4.2 L143、4.3 L151、4.4 L172、4.5 L178、4.6 L187）；§5 L191（(a) L193、(b) L216、(c) L242、(d) L252）

## 0. 依据

- 本轮验收 `runs/r5/acceptance/R5.md`（同一代理；验时 HEAD f08e8d3，代码同 73bac9f）；批末 verify `runs/r5/verify/steps.md`（60ff2ef：30 步红 2、44 段红 2，与 R4 相同；storybook:build 退出 0）；R5 拆分第 1–3 节、`packages.md`、Q1 与 Q2 交回、四份问题清单（拆分 8 条、Q1 5 条、Q2 4 条、主线程 M1–M3）、跨包通告；R4 判断 §1–§4；START「库门」「质量硬线」「收口」；链上 Story 原文与 MIN-SHELL D1–D7、MIN-INIT016 D8。
- 只读补查（会话 scratch `judge-r5/`）：引擎 `status`（DS 库 version 2439，即 R5 开工链写后的版本，之后没有写入；顶层 engineVersion 2.1.0）、`gates-config-list`（1 个门 verify）、`library-list`（DS 条目仍无 projectId）、`knowledge-list`（45 张，最新 KB-045）、`commands`。没跑门、没构建、没写链、没跑 git 写命令。

## 1. R5 结论表

| Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别 | R6 返工项 | Owner 目视项 |
| --- | --- | --- | --- | --- | --- |
| 135 壳 token | 阻塞于 Owner | 否：GWT4 contract:static 只剩顶带 C8 15 条；GWT1–3 满足 | 只有 Owner 能定（O-19） | 无 | 无 |
| 136 标按钮 | 阻塞于 Owner | 否：GWT3 夜间后缀 3.07（D7） | 只有 Owner 能定（O-8） | 无 | 两版、hover / open、390、长字标（O-1）、夜间后缀 |
| 137 固定项 | 满足（机器判据） | 是；无改动、无回退 | 无 | 无 | 固定项、选中态、1023 的「已固定」分组 |
| 138 完整菜单 | 满足（机器判据） | GWT 全满足；硬线「标旁文字中线」只剩底栏 TMS 锁定块 en 1.7 | Owner（O-4，硬线读数） | 无 | 菜单与底栏锁定块、⌘K 只开一个壳 |
| 139 下拉与级联 | 满足（机器判据） | 是；DOM 用例只有包自报（O-18） | 无（O-3 不挡） | 无 | 下拉与级联（O-3） |
| 140 ProductShell | 满足（机器判据） | 是；清单补齐纸内焦点环被卡片盖住（SUB-228） | 无 | 无 | 顶带壳、铃铛 6%、拖排与产品切换、纸内焦点环（文档壳一边被卡片盖住，Owner 定是否接受） |
| 141 登入动画 | 满足（机器判据） | 是；O-18 名单已含 SUB-214 | 无 | 无 | 登入动画（画面不变） |
| 142 图钉 | 满足（机器判据） | 是；无回退 | 无（O-5、O-6 不挡） | 无 | 图钉三态、菜单与 Sheet 行图标盒 |
| 143 导航家族 | 阻塞于 Owner | 否：C1–C17 只剩 C8 15 条；M30 过期已由 M53 补正 | 只有 Owner 能定（O-19） | 无 | Tabs 五形、面包屑分隔图标、TreeNav 在下拉、菜单外禁用原因换行 |
| 144 手机 Sheet | 满足（机器判据） | 是；Story 文字与板不一致 | Owner（O-20，只改 Story 文字） | 无 | 手机 Sheet（O-15） |
| 145 首行变体 | 阻塞于 Owner | 否：GWT2 DS 品牌首行 1.4 | 只有 Owner 能定（O-4） | 无 | 八枚首行两尺度 |
| 146 PageHeader | 阻塞于 Owner | 否：GWT1–4 满足、START 硬线已收（SUB-225）；「几何门全绿」只差 markText | 只有 Owner 能定（O-4） | 无 | 纸内页头、设置页 1040、SplitView、目录 h2、Disclosure 焦点环四边与展开代价（G-18，Safari 同看） |
| 147 文档壳 | 满足（机器判据） | 是；SUB-219 判据④残串已收（SUB-226） | 无 | 无 | 文档站整体、展开标题无左边条、截法变更后的离群项 |
| 148 五样板 | 阻塞于 Owner | 否：GWT1「五块」；GWT2–4 满足 | 只有 Owner 能定（O-2） | 无 | 四板 D 段（发布后） |
| 149 壳层门 | 阻塞于 Owner | 否：GWT1 真件 17/18（markText）；GWT2 verify 红 13 与 18 | 只有 Owner 能定（O-4、O-19） | 无 | 无 |
| 150 4.0.0 候选 | 满足（机器判据；判定人 Owner） | GWT1–4 满足；M53、CHANGELOG、清单与批末读数一致 | Owner（判定人；推送与发版是停点） | 无 | 全清单；第五轮新增两项 |

结论：机判满足 9、阻塞于 Owner 7、部分 0（R4 为 9 / 6 / 1）。146 由「部分」转「阻塞于 Owner」：R4-3 这一修复目标经 R5-1 升主力后满足，没有第二次退回。批末 verify 与 R4 逐段比无回退，只剩两步红，都只等 Owner：第 13 步 C8 15 条（O-19），第 18 步 markText（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7，O-4）。库门已声明，但跑门被本机设备登记挡住（新增 O-21）。**R6 无返工，建议收口。**

## 2. R6 返工清单

R6 无返工。理由：

1. R5 四条返工（R5-1 至 R5-4）全部满足，验收没有发现新缺陷，批末 verify 与 R4 逐段相同（验收 §3.1）。
2. 未满足的判据全部只等 Owner：O-19（135-GWT4、143 符合性、149-GWT2）、O-4（145-GWT2、146「几何门全绿」、149-GWT1 与 GWT2，及 138 的硬线读数）、O-8（136-GWT3）、O-2（148-GWT1）；150 的判定人是 Owner。
3. 余下的都属不碰判据、可推迟的项：R4 判断 §3.4 第 7、8 条的门读法余项，加本轮新记的证据缺口（§5 (b)）。它们不挡任何判据，改动要动门脚本或加可交互 story，按 R4 的同一处置交各脚本的下一个持有者。
4. 库门运行被拒（O-21）是本机持久配置，不是代码返工。

O-19、O-4 裁定后的改法已有规模（§3.1），届时各起一个主力包，开新的一轮（实施包 2 个，可按小轮合并）。

## 3. 只有 Owner 能定的事项

### 3.1 待裁（O-1 至 O-20 沿用，新增 O-21）

读数与 R4 相同的写「同 R4」；裁定后的改法沿用 R3 判断 §3.1、§3.1.1 与 R4 判断 §3.1。

| # | 事项 | R5 现状（即不裁时的默认） | 建议 | 裁后改法与规模 | 挡住 |
| --- | --- | --- | --- | --- | --- |
| O-21 | 本机设备登记的 DS 条目没有 projectId，`gates-run` 在执行 verify 前被拒（`GATES_PROJECT_UNKNOWN`，主线程 M2） | 不补登记：库门已声明但跑不了，INIT-015 的 12 张与本批 16 张都不能转 done；`library-list` 现读仍缺（AOS 条目有） | Owner 亲自运行或授权运行一次 `library-register` 补 projectId（命令见 §5 (c) 第 1 步），读回 `library-list` | 一条命令加读回；之后照 START「库门」第 1–5 步转 INIT-015 的 12 张（verify 约 9 分钟） | INIT-015 的 12 张 done；本批 16 张 done（另需下列各项） |
| O-19 | 顶带的 C8 让步项 15 条（静态 1、story 层 14，全在 shell） | 同 R4：contract:static 红；登记保留；M53 已写明待裁；SUB-113、125、142、155、178、191 保持 active | 甲：裁定顶带按板（R3 判断 §3.1.1） | 甲：roles.json 顶带一项加两个字段，门只对带字段的登记跳过两项，clauses.md 写明，两条自检；主力约 25，单独成包 | verify 第 13 步；135-GWT4；143 C1–C17；149-GWT2；全部 16 张的库门 |
| O-4 | 墨迹中线遇下行字母 | 同 R4：DS 品牌首行 `lkr-line@22:design-system` 1.4（4 次运行）；底栏 TMS 锁定块 `lkr@22:tms` en 1.7；markText 红；SUB-127、137 保持 active | ±1 改量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量 0.6） | 门库与 measure-shell.js 同改，补夹具与变异，主力约 40；改后 DS 仍 > 1 再交 Owner | verify 第 18 步；145-GWT2；146「几何门全绿」；138、145 的硬线读数；149-GWT1、GWT2；全部 16 张的库门 |
| O-8 | 夜间后缀 3.07 / 3.13 / 3.33（D7） | 同 R4：两主题同色、标红 pending；SUB-114 保持 active | 随 S-6 一并裁 | 改 token、矩阵与测试，约 30 | 136-GWT3 |
| O-2 | 148-GWT1「五块」对四板 D 段加 07a 第 1 段 | 同 R4：GWT1 记部分；R5 没动画板 | 接受，注解写明读法 | 接受只写注解；要 Brand D 段约 60 | 148-GWT1 |
| O-18 | 批末 verify 不含 test:dom（加段属执行方法变更） | 不加；清单名单已补 SUB-214（SUB-228） | 批末 verify 后加跑只读 test:dom，记入 steps.md | 主线程脚本加一段 | 无判据；139、140、141 的 DOM 用例只有包自报 |
| O-20 | Story 144 写「全屏 Sheet」「从顶带下方升起」，板与包件是自底升起、最高 84% | 同 R4：实现照板 | 同 O-14：按板改 Story 文字 | 只改链上 Story 正文 | 无（目视手机 Sheet） |
| O-1 | 长字标放不下（要 117，格 60，D1 定宽 134） | 截断加 title（G-10） | 宽度至少 134、随字标加宽，07b 补长名屏 | 主力约 40 | 无（目视） |
| O-3 | 级联越过视口右缘 | 现写法 | 越界就向左展开 | 改下拉定位与用例，主力约 40 | 无 |
| O-5 | Icon 板「禁填充」与 pin 实心态冲突 | 只改件数 | 加例外，补画实心态 | 画板、重生约 30 | 无 |
| O-6 | 触摸端未固定的图钉平时不显 | 获焦才显 | 粗指针下常显 ink-3 | 约 20 | 无 |
| O-7 | 文档站默认头像；目录宽 144 | 现状 | 接受现状 | 无 | 无 |
| O-9 | AOS 在 logos2 里没有标 | AOS story 暂传 design-system（G-2） | 补标或撤 AOS story | 约 20–30 | 无 |
| O-10 | 头像菜单几何、无账户图标，板上没画 | 现写法 | 接受，目视时定 | 按目视意见改约 20 | 无 |
| O-11 | 窄屏按视口切还是按容器切 | 按视口 | 容器查询 | 加 1023 门，主力约 80 | 无 |
| O-12 | 下拉里显不显示 ⌘K | 不显示 | 不显示，可直接结掉 | 无 | 无 |
| O-13 | 纸升起的距离 | 10 | 设计会话给数 | 改 token 值约 10 | 无 |
| O-14 | STORY-136 的字重文本与板不一致 | 按板实现 | 按板改 Story 文本 | 只改 Story 正文 | 无 |
| O-15 | Sheet 夜间遮罩与下一级怎么开；遮罩下的纸夜间 4.13，板 7.29 | 现写法 | 设计会话补 | 约 40 | 无（目视） |
| O-16 | 纸内页标题行高：板 28.6 无 type token，包件 30 | 30 | 接受 30 | 要 28.6 就新增 type token，约 15 | 无 |
| O-17 | TreeNav 归宿：壳菜单与下拉由模型渲染 | 现写法 | 接受；M22、M30 写明 TreeNav 只用于消费方的下拉或浮层 | 要壳下拉装 TreeNav 属新 API，约 100 | 无 |

- R4 判断 §3.1 的条件项（R5-1 再被退回就交 Owner）不触发：R5-1 满足。
- 合计待裁 21 条（O-1 至 O-21），本轮新增 1 条。挡机器判据的只有 O-19、O-4、O-8、O-2；挡库门的是 O-21。

### 3.2 知悉

- **引擎已升到 2.1.0**：`status` 顶层 engineVersion 现读 2.1.0，设备流记的最后写库版本是 2.0.3（R5 开工链写，version 2439）。M1、M2 的读数与三次被拒都在 2.0.3 下；2.1.0 下是否仍拒没有读数（`gates-run` 写库，本判断不跑）。2.1.0 的 `library-register` 仍有 `--project-id`，`gates-run` 的 `--release` 仍是布尔值、要写 `true`。
- **INIT-015 是 12 张，不是 13 张**（M3）：120–128、131–133；129、130、134 已 cancelled；covers 也是 12 个。START 与 D8 的「13」按 12 读，收口文件写明。
- **WebKit 未核**：Safari 是否认 `overflow-clip-margin` 仍无读数；余量从 2px 改 4px 不改变这一点。G-18 与第五轮节已请 Owner 在 Safari 与 Chromium 内核各看一遍。
- **展开代价**：区域块末端外最多 4px 内容在展开过程中可见；只按样式读出，静态 Storybook 没有可切换的 Disclosure，帧没机读（Q1 问题 4）。已进清单第 318 行与 G-18。
- **证据面**：DS 标按钮只有验收探查与静态全量路径比对，Mana 标按钮只有 SSR 单测；SUB-180、184、185、214 的 DOM 用例与 SUB-225 的变异只有包自报；paperFocusRing 只量浅色。
- **容差内漂移**：同 R4，47 条签名仍是第三轮截法，`navigation-product-shell-spec@tablet` 是唯一留旧截法的高 story；下次越容差时分来源要算进去。
- **观察不动**：`full-surface:proof` 记录的选择框触发器与焦点环计算样式是过渡中取样，两轮不同但门不判（验收 §3.1）；壳层门读到的登入动画属性顺序会互换，集合不变；Feedback error 相收起区域高 36.5、内层 0 高、看不到内容（Q1 问题 5）。

### 3.3 授权外，不列返工

- 不放宽阈值：O-4 裁前 markText 照 ±1；O-19 裁前不改 C8 判定、不加豁免、不撤顶带登记；smoke、browser-proof 与各门的期望不放宽，不抬扫描上限。
- 不新增 token；不改板、07a / 07b 字句与画布画法；不改 measure-shell.js；不改 Story 文字（O-14、O-20）。
- 不改批末 verify 的组成（O-18）；不运行 `library-register`（写本机设备配置）；本判断不跑 `gates-run`；不拆 START 的「16 张同一批转 done」。
- 不安装 Playwright WebKit，不开 safaridriver；不推送、不打 tag、不发版、不部署、不发布画布。
- 不新增依赖与 package.json 脚本。

### 3.4 按建议先做（判断自定，收口时回显，Owner 可事后更正）

1. **R6 无返工、建议收口**（§2）。收口是停点收口：写 `closeout.md`，16 张 Story 与 INIT-016 保持 active，停在 Owner 各项之前。
2. **SUB-225 满足，SUB-216 承接项满足**：验收按 R4 B4-1 的同一读法在集成树重量，四边第 3、4 行 / 列在三宽、夜间与 forced-colors 下都是环色。两张都转 done。
3. **SUB-219 按拆分问题 1 的读法转 done**：排除迁移说明后 grep 为 0，不排除只剩 M50 三行删除记录。M50 是按名记录删除的迁移条目，C-11 不许改；判据④要清的是读取方与写入处。不属放宽判据。
4. **收口时连同 `scaffold-proof.json` 一起提交再生的回执**。理由：这份回执最后提交于第一轮批末（f98b298），第二轮起 CHANGELOG 与 ui-tokens `index.ts` 两项输入摘要就与现文件不符，R2–R5 每次批末 verify 都改写它、又按 C-9 还原；它只差输入摘要，按 C-9 (b) 没有包会提交它，只能在收口一次再生（批量处理原则 v3 第 4 条）。读数与判定不变（ok、findings 空）。INIT-015 收口按 J-3 只刷新了 no-overclaim；main@69aa195 上 scaffold 的 15 个输入摘要全部相符（验收 §0 核对），INIT-015 那边不需要再生它。做法：收口的最后一笔文档提交之后，在集成树跑 `scaffold:proof` 与 `scan`，把 `docs/verification/scaffold-proof.json` 与 `docs/verification/internal-alpha/no-overclaim-scan.json` 放进同一笔 `chore(receipts)` 提交，提交信息只带 INIT 键号（照 4c3ddeb）；`scaffold-proof.md` 只在它也变了时一并提交；`visual-selection-result.json` 照旧不入仓。这样之后 verify 只改写 no-overclaim 一份（它的 scannedFiles 随文件系统上的产物变，总会漂）。
5. **库门第 3 步的收干净清单**（Owner 跑门后，主检出上）：
   - 已跟踪改写：`docs/verification/internal-alpha/no-overclaim-scan.json`，`git -C "<主检出>" checkout --`；INIT-016 的 16 张若收口没按第 4 条再生，`docs/verification/scaffold-proof.json` 同样还原。INIT-015 的 12 张在 main@69aa195 上跑，scaffold 不会漂。
   - 未跟踪新生成：`docs/verification/internal-alpha/visual-selection-result.json`，移到 scratch 的 trash。
   - 依据：R3、R4、R5 三次批末跑后的 `git status --short` 都只有这三项（scratch `r5-verify/status-after.txt`、`diff-stat.txt`：no-overclaim +73 −1 行，scaffold 2 个摘要）。之后 `git status --short` 必须为空；若 `docs/verification` 外出现改动，停下记问题，不还原。
6. **146 转「阻塞于 Owner」**：START 硬线已满足，剩下的「几何门全绿」只差 markText。
7. **150 的判定人是 Owner**（KB-016）：16 张同一批转 done 的时点放在 Owner 对 150 作出判定之后，同时还要 O-19、O-4 的返工完成与 O-8、O-2 的裁定及其返工；不拆成 15 加 1（拆批属执行方法变更）。
8. **Q2 问题 3 的读数更正**：scaffold 回执的 CHANGELOG 摘要不是 R5 才过期，682fc94 上已不符；处置不变（第 4 条）。
9. **验收 §6 的写明选择全部照收**，Q1-8 的条件已由 SUB-228 满足；没有不可接受的口径。
10. **R1–R3 留下的 9 张 active** 仍只等 Owner，不写转态（§4.1）。

### 3.5 停点

- 推送、打 tag、发版、部署都不做，停在推送之前；4.0.0 只是集成分支上的候选。
- 本机设备登记（O-21）与库门运行：Owner 补登记后，INIT-015 的 12 张即可在 main@69aa195 上跑门转 done；本批 16 张还要等 O-19、O-4 裁定与返工、O-8、O-2 裁定与 150 的判定。
- Owner 目视：136–150 加第一批，按 `owner-acceptance.md`（第五轮节第 311–320 行：Disclosure 焦点环 Safari 与 Chromium 内核各看一遍、展开代价）。两个 INIT 都等 Owner 目视后再转 done。
- 画布与 F 段发布交设计会话（§5 (d)）。
- 安装（可选）：要机读核 WebKit，需授权装 Playwright WebKit 或开 safaridriver。

## 4. 链写计划（主线程一次 work-batch；summary 都已量过，均 ≤ 160 字节）

### 4.1 Subtask

SUB-225…228 现在都是 planned，4 张全部满足，走三步 ready → active → done；前两步 summary 由主线程写「R5 包已合入集成分支，批末验收已出」，第三步用表中的 summary。

| Subtask | id | summary |
| --- | --- | --- |
| SUB-225 | work:4617cda2a8387659fd080516 | R5 验收满足：内层余量改 space-1，Disclosure 焦点环四边第 3、4 行列都是环色（三宽、夜间、forced-colors），变异判红 |
| SUB-226 | work:9a29d6337499dc0afba430d0 | R5 验收满足：第 147 行注释示例换成在用的 .tcrn-doc-page，排除迁移说明后 grep 为 0，doc-shell:proof 退出 0 |
| SUB-227 | work:bc1221bc8c97e7d7f6ce08d4 | R5 验收满足：迁移说明追加 M53（三族块数、9 个根类、顶带 C8 工具栏），开头区间、三份清单与 CHANGELOG 同步 |
| SUB-228 | work:3ba8b64c4db61e48ef7227b4 | R5 验收满足：清单跟上第四、五轮：G-18、G-21、O-18 名单、第五轮目视节、E 段落点 M20 至 M53，行号与交回一致 |

R4 留下由 R5 承接的两张现在是 active，承接项都满足，各一步 → done：

| Subtask | id | summary |
| --- | --- | --- |
| SUB-216 | work:fc422bdf469d7f7fdc966381 | R5 承接项满足：获焦焦点环底边与起始边不再被裁（SUB-225 余量 space-1），描边与焦点对都在余量内 |
| SUB-219 | work:4faddab0a4c1b0c5e65acde1 | R5 承接项满足：判据④的注释残串已换（SUB-226），排除迁移说明 M50 删除记录后 grep 为 0 |

R1–R3 留下的 9 张 active 承接的都是 Owner 项，R5 后仍只等 Owner，不写转态：113 → O-19（135-GWT4）、114 → O-8（136-GWT3）、125 → O-19（R3-8）、127 → O-4（145-GWT2）、137 → O-4（真件 18 门）、142 → O-19（判据含 contract:static 退出 0）、155 → O-19（R3-8）、178 → O-19（判据⑥）、191 → O-19（判据④）。引擎有 Subtask 注解入口就同批写「R5 后仍只等 Owner：O-n」，没有就不写。

本批 Subtask 成员共 14 个（4 × 3 + 2 × 1）。

### 4.2 Story 不转 done 的理由

16 张都保持 active，只写注解。两道独立的挡：

- **库门运行被拒（O-21）挡全部 16 张**：引擎 2.x 要求最新一次 `--work-id` 含该 Story 的门运行在当前树上全绿；DS 条目没有 projectId，`gates-run` 在执行 verify 前就被拒，一张也跑不了。同一原因挡 INIT-015 的 12 张。
- **verify 红步挡全部 16 张**：库里只有一个门 verify，它在批末第 13、18 步红，补了登记跑出来也是红。按判据归属：第 13 步（C8，O-19）对应 135-GWT4、143 符合性、149-GWT2；第 18 步（markText，O-4）对应 145-GWT2、146「几何门全绿」、149-GWT1 与 GWT2、138 的硬线读数。其余 9 张机判已满足的 Story 同受这个门挡。
- 另：136 等 O-8，148 等 O-2，150 等 Owner 判定。不开 `--fixes` Story，R6 没有新 Subtask。

### 4.3 Story 注解

| Story | id | summary |
| --- | --- | --- |
| 135 | work:1ad3c63c6fe6468a9d553758 | R5 阻于 Owner：GWT1–3 满足；GWT4 contract:static 只剩顶带 C8 15 条（O-19），同 R4。跑门待 O-21 |
| 136 | work:73563c973ba4945683fbb15f | R5 阻于 Owner：GWT3 夜间后缀 3.07 待 D7（O-8），读数同 R4，无回退。跑门待 O-21 |
| 137 | work:b8e05fe98dd99b6b0da62493 | R5 机判满足：本轮无改动，批末读数同 R4，无回退。跑门待 O-21 与 verify 红步 |
| 138 | work:3d8ec5e9bbaaa3623c3315c8 | R5 机判满足：GWT 全过；硬线读数底栏 TMS 锁定块 en 1.7 只等 O-4。跑门待 O-21 |
| 139 | work:09e0986c769bddf72859897f | R5 机判满足：读数同 R4；DOM 用例只有包自报（O-18），O-3 待裁。跑门待 O-21 |
| 140 | work:e14a7f089a9cac4c7da39d52 | R5 机判满足：读数同 R4；清单补文档壳纸内焦点环被卡片盖住（SUB-228）。跑门待 O-21 |
| 141 | work:e2def1cb6cee96bcde0ea937 | R5 机判满足：读数同 R4；清单 O-18 名单补 SUB-214（SUB-228）。跑门待 O-21 |
| 142 | work:27344937d9f099034b0c773e | R5 机判满足：读数同 R4，无回退；O-5、O-6 待裁。跑门待 O-21 |
| 143 | work:1b03f6ae2b1a9e080fde1432 | R5 阻于 Owner：GWT 全过，M30 过期由 M53 补正（SUB-227）；C1–C17 只剩 C8 15 条（O-19）。跑门待 O-21 |
| 144 | work:14b2761d4ff9e55b90cd110e | R5 机判满足：读数同 R4；Story 写全屏 Sheet 与板不符（O-20）。跑门待 O-21 |
| 145 | work:f19ca0b68e52842e947dcafc | R5 阻于 Owner：GWT2 DS 品牌首行墨迹 1.4（O-4），其余满足，同 R4。跑门待 O-21 |
| 146 | work:792b63bc73100197f6f41e96 | R5 阻于 Owner：焦点环四边完整（SUB-225），硬线已收；GWT1–4 满足，几何门只差 markText（O-4）。跑门待 O-21 |
| 147 | work:6fd15b4e5366871194d862ab | R5 机判满足：SUB-219 判据④的注释残串已换（SUB-226），grep 为 0，读数同 R4。跑门待 O-21 |
| 148 | work:bad748579e7b1b7f0773bd53 | R5 阻于 Owner：GWT2–4 满足；GWT1 五块待 O-2，同 R4。跑门待 O-21 |
| 149 | work:854cd021e8bb869b2b585fe0 | R5 阻于 Owner：真件 18 门 17 过；verify 红 13（O-19）与 18（O-4），同 R4。跑门待 O-21 |
| 150 | work:b140305693da159bfdc615c8 | R5 机判满足（判定人 Owner）：M53、CHANGELOG 与清单跟上第四、五轮（SUB-227、228）。跑门待 O-21 |

### 4.4 INIT 注解

- INIT-016 summary：「R5 判断：机判满足 9、阻于 Owner 7、部分 0；R6 无返工，建议收口；Owner 待裁 21（新增 O-21 本机登记缺 projectId）」
- INIT-015 summary：「R5：库门 verify 已声明；12 张跑门被拒（本机登记缺 projectId，O-21），补登记后按 START 跑门转 done」
- INIT-016（work:1a8e81aaa0138ef58d9a8f18）正文要点：批末 verify 60ff2ef 红 2 / 2，与 R4 相同，都只等 Owner（C8 → O-19；markText → O-4，DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7）；R5 的 4 张 Subtask 全部满足，R4 留下的 SUB-216、219 承接项满足，R5 共 6 张转 done；146 的 START 硬线已收，R4-3 目标没有第二次退回；Owner 已声明库门 verify，跑门因本机登记缺 projectId 被拒（O-21），引擎现为 2.1.0；R6 无返工，按停点收口，收口材料在 `runs/r5/judgment.md` §5；收口时连同 scaffold-proof.json 再生提交回执；验收与判断路径 `runs/r5/acceptance/R5.md`、`runs/r5/judgment.md`；停点：O-21、O-19、O-4、O-8、O-2、150 判定、目视、推送与发版、画布发布。INIT-015（work:e5b3880c835fd77f1c14b81b）正文要点：START 与 D8 写的 13 张实为 12 张；补登记后照 START「库门」第 1–5 步在 main@69aa195 上转 12 张，INIT-015 保持 active 到 Owner 目视。

### 4.5 知识卡

`runs/r5/lessons.json` 4 条，接 TCRN-DS-KB-046；主线程逐条 knowledge-capture 并读回（需要时加 `--allow-trailing`），被预算拒绝的记阻塞：

1. 2.x 跑库门要求本机登记条目带 projectId，旧登记没有它，门在执行前就被拒。
2. 只按读数与判定变化提交回执的规则，会让带输入摘要的回执一直过期，收口要专门再生一次。
3. 「删后 grep 为 0」的判据会被之后写的删除记录打破，判据要事先排除按名记录删除的文档。
4. status 顶层的 engineVersion 与设备流里的不同，说明上次写库后引擎升过级，先前的引擎读数要按新版本重核。

### 4.6 不在本次链写内

Story 与 INIT 的转态（库门跑不了，§4.2）；INIT-015 的 12 张；`library-register` 与 `gates-run`（O-21，Owner）；R6 新 Subtask（无）；Owner 待裁项。本轮不写纪要。成员合计 32 个（Subtask 14、Story 注解 16、INIT 注解 2）。

## 5. 收口材料（R6 无返工）

### (a) 16 张 Story 的收口结论

HEAD f08e8d3（代码同 73bac9f）；批末 verify `runs/r5/verify/steps.md`（60ff2ef，逐段日志在会话 scratch `r5-verify/`）；`storybook:build` 退出 0（scratch `r5-verify/storybook-build.log`）；链头 version 2439（headEventHash a26eaadf…，R5 链写后会前移）。下表「验收」指 `runs/r5/acceptance/R5.md`，A、B、C 指 `runs/r4/acceptance/` 三片。

| Story | 机器判据结论 | 证据路径 | 待 Owner 的事 |
| --- | --- | --- | --- |
| 135 | 未满足：GWT4（C8 15） | steps.md 第 13 步；A | O-19；库门（O-21） |
| 136 | 未满足：GWT3（夜间后缀 3.07） | 第 18 步 contrast pending；A | O-8；目视 |
| 137 | 满足 | 第 18 步壳层门；A | 目视 |
| 138 | 满足；硬线读数待 O-4 | 第 18 步；A | O-4；目视 |
| 139 | 满足 | A；DOM 用例包自报（O-18） | 目视（O-3 不挡） |
| 140 | 满足 | A；清单第 218 行 | 目视（含纸内焦点环被卡片盖住） |
| 141 | 满足 | A；清单第 401 行 | 目视 |
| 142 | 满足 | B | 目视（O-5、O-6 不挡） |
| 143 | 未满足：符合性 C8 15 | 第 13 步；B；迁移说明 M53 | O-19；目视 |
| 144 | 满足 | B | O-20（只改 Story 文字）；目视 |
| 145 | 未满足：GWT2（1.4） | 第 18 步；B | O-4；目视 |
| 146 | 未满足：几何门差 markText；硬线已收 | 第 18 步；验收 §2.1；B | O-4；目视（G-18，Safari 同看） |
| 147 | 满足 | 验收 §2.2；C | 目视 |
| 148 | 未满足：GWT1 五块 | C | O-2；目视；画布发布 |
| 149 | 未满足：GWT1、GWT2 | 第 13、18 步；C | O-19、O-4 |
| 150 | 满足（判定人 Owner） | 验收 §2.3、§2.4；第 16、29 步；C | Owner 判定；全清单目视；推送与发版 |

### (b) 已知差距（照实列出，交下一个持有者）

| # | 差距 | 交给谁 | 可清理条件 |
| --- | --- | --- | --- |
| 1 | C4-2：browser-proof 一处读回恒空（同区已由 `legacyProductShellGlobalNavCount` 判红覆盖）；geometry-proof 一条走不到的隐藏态分支 | 两份门脚本的下一个持有者 | 下次改这两份脚本时删掉，原门仍绿 |
| 2 | 几何门 `cutOf` 不认 clip margin（R4 N1 问题 4） | 几何门的下一个持有者 | 被量 story 进入可折叠区之前改读法 |
| 3 | 壳层门 brandDigest 不量 DS、Mana 标按钮（R4 拆分问题 4） | shell-measure 的下一个持有者 | 扩覆盖面的单 |
| 4 | axe 豁免节点数随主区滚动位置变（R4 N2 问题 3） | browser-proof 的下一个持有者 | 固定主区位置后再跨轮比 |
| 5 | 「根类全有家族」守护测试未加（R4 N2 问题 4） | contract 家族表的下一个持有者 | 加测试；现读 unattributed 0 |
| 6 | `.tcrn-segmented-nav` 白名单保留（R4 N3 问题 5） | shell-fidelity 的下一个持有者 | 包再写这个类时一并核 |
| 7 | G+ 禁形不含 `--tcrn-color-acc-bg`（R4 N3 问题 6） | selection-grammar 的下一个持有者 | 选中态用到它时补 |
| 8 | 壳层门读法余项：o.prail、o.rows、x.rowHeights、contrast 只认 rgb 与 rgba（R3） | shell-measure 的下一个持有者 | 改门读法的单 |
| 9 | NavPin 等四家族的兜底焦点环（R3） | 这些家族的下一个持有者 | 改到这些家族时补 |
| 10 | 文档站读屏文字三处小缺口（R3） | 文档层的下一个持有者 | 改文档层时补 |
| 11 | 证据面：DS 标按钮只有探查与静态比对，Mana 只有 SSR 单测；DOM 用例与变异只有包自报（O-18）；paperFocusRing 只量浅色 | O-18 与壳层门的下一个持有者 | O-18 裁定加段；壳层门扩覆盖面 |
| 12 | 47 条签名仍是第三轮截法（R4 N5 问题 2） | browser-proof 的下一个持有者 | 下次越容差时按来源分开收 |
| 13 | SUB-225 的用例只读按钮那条焦点 outline（R5 拆分问题 3） | Layout.test 的下一个持有者 | 区内出现别的外扩焦点画法时改为全模块取最大值 |
| 14 | 展开动画帧没机读，静态 Storybook 没有可切换的 Disclosure（Q1 问题 4） | Owner 目视（G-18、清单第 318 行） | Owner 目视接受；要机读另立可交互 story |
| 15 | M53、G-21 抄写的块数与 C8 条数没有门看守（Q2 问题 4，KB-044） | families.json、roles.json 的下一个改动单 | 改登记的单同步追加迁移条目 |
| 16 | `scaffold-proof.json` 输入摘要自第二轮过期（Q2 问题 3） | 主线程收口 | §3.4 第 4 条再生提交后，verify 不再改写它 |
| 17 | `full-surface:proof` 记录过渡中取样，跨轮不同 | full-surface-proof 的下一个持有者 | 取样前等过渡结束 |
| 18 | WebKit 未核 `overflow-clip-margin` | Owner | Safari 目视，或授权装 WebKit 后机读 |
| 19 | 库门被拒的读数来自 2.0.3，引擎现为 2.1.0 | 主线程 | 补登记后按 2.1.0 实跑一次 |
| 20 | 交设计会话：F 段补登六条壳层 token（shell.mark、shell.touch、shell.crumb-icon、shell.chevron、shell.locale-chevron、shell.mark-lg）与四块成品板（(d)） | 设计会话 | 画布发布后 |
| 21 | 观察：壳层报告每次 `--write-report` 差登入动画时长；browser-proof 时长在并发负载下不可比；Feedback error 相收起区域高 36.5 | 无 | 不处置 |

### (c) Owner 停点与建议动作

1. **本机登记（O-21）**：Owner 亲自运行或授权运行：
   `node ~/.einzbern/engine/einzbern.mjs library-register --project "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System" --library "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --project-id project:ba2f70f9503ac43c3ec6aa36 --git-remote github.com/tpmoonchefryan/TCRN-Design-System --at <UTC>`
   `--git-remote` 与原条目同值，防止重登记时丢字段。之后只读 `library-list`：DS 条目有 projectId，gitRemote、projectPath、libraryPath 与原条目相同（registeredAt 可能更新）。
2. **INIT-015 的 12 张**：照 START「库门」第 1–5 步，在主检出 main@69aa195 上一次跑 `gates-run --release true --work-id <12 个 id>`（id 见 START 第 42 行；后台跑，输出进文件，回执 `GATES_RUN_COMPLETED` 且 ok 为真）；按 §3.4 第 5 条收干净；一个 work-batch 转 12 张；逐张 `work-show` 读回。INIT-015 保持 active 到 Owner 目视。门若红或仍被拒，记问题、不转。
3. **INIT-016 的 16 张**：Owner 裁 O-19、O-4（建议见 §3.1）后开下一轮，各起一个主力包（C8 约 25、markText 约 40），批末 verify 要 30 步全绿；O-8、O-2 裁定（裁后有改动的同轮做）；Owner 对 150 作出判定。然后：写收口文件 → 按 §3.4 第 4 条再生提交回执 → 候选分支 `--no-ff` 合入主检出 main 本地（不推送），`git status --short` 为空 → 主检出上一次 `gates-run --release true --work-id <16 个 id>` → 按 §3.4 第 5 条收干净 → 一个 work-batch 转 16 张 → 读回。INIT-016 保持 active 到 Owner 目视。
4. **目视验收**：按 `owner-acceptance.md`，8 板各一节加第三、四、五轮节与 G 项；第五轮新增 Disclosure 焦点环（Safari 与 Chromium 内核）与展开代价。
5. **推送、打 tag、发版、部署**：各是独立停点，等 Owner。

### (d) 本 INIT 改过的设计文件（交设计会话发布）

`git diff --name-only 69aa195..HEAD -- docs/design` 共 25 个，本轮没有新改动；逐板改动与提交见 `owner-acceptance.md`「待发布的成品板」节。`Shell.dc.html`、`Shell-2.dc.html`、`Tokens.dc.html`、`Brand.dc.html` 没有改。

- 成品板：`docs/design/visual-standard/boards/Actions.dc.html`、`Icon.dc.html`、`Inputs.dc.html`、`Typography.dc.html`
- 草稿画布（草案板）：`docs/design/gplus-2026-10/boards/V2-B1-Actions.dc.html`、`V2-B1-Icon.dc.html`、`V2-B1-Inputs.dc.html`、`V2-B1-Typography.dc.html`
- `docs/design/visual-standard/canvas.json`
- `docs/design/visual-standard/heights.json`
- 生成工具：`docs/design/visual-standard/tools/make-standard.mjs`；`docs/design/gplus-2026-10/tools/` 下 `build-actions.mjs`、`build-icon.mjs`、`build-inputs.mjs`、`build-shell2.mjs`、`build-typography.mjs`、`lib.mjs`、`shell-screen.mjs`
- 设计数据（门与包在用，不上画布）：`docs/design/gplus-2026-10/contract/icons.json`、`matrices.json`、`tokens.json`；`docs/design/gplus-2026-10/doc-class-map.json`、`storybook-map.json`、`storybook-map.md`、`README.md`
- 另交：`Shell-2.dc.html` 的 F 段补登六条壳层 token（(b) 第 20 条）；148 的 Brand 板 D 段视 O-2 裁定。
