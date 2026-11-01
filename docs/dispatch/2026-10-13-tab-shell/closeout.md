# TCRN-DS-INIT-016 当前本地交付记录（2026-11-02）

B25/R29 的源码与本地机器证据已完成，源候选 32e5a21e1e3e1be120c19f3d0a7a3b3ce94114b4 已快进合入本地 main。原 119 项编号判据中 118 项有机器证据支持，127#4 已按既有决定退役而不适用；28 个完整目标的机器义务中，27 项有支持，142 的可见行动名含义仍待原 Owner 问题答复。本次 Root 正式门的提交、运行编号、适用工单与退出结果以原生 gates-run 及 C05 精确读回为准；本地源码验收、原生转态、Owner 目视和外部发布分别记录。

C05只读正式计划发现：同一个DS项目、同一个实际仓库被列为1个库级组与4个选中目标组，每组都有三道门；当前引擎会执行15条顶层命令。正式门尚未启动，未把这个计划追认为门通过。保持已批准的每门一次需要先处置分组与项目上下文的关系；执行方法或跨项目引擎修复范围须Owner明确决定，当前不删目标绑定、不关门、不改安装树。

## 当前证据与边界

| 项目 | 已取得的本地结果 | 仍保留的边界 |
| --- | --- | --- |
| B25 固定三门 | verify、storybook:build、test:dom 均退出0，DOM 65/65 | 本次 Root 在本地 main 正式覆盖原28与适用151/152及需转态的原子任务；源包命令不能替代原生回执 |
| 独立几何 | 原 geometry:measure 退出0，78/78 与45/45 | 不等于 Owner 目视；verify 内的既有几何子命令与这次独立调用分开计数 |
| 浏览器 | 328截图，217 gated match，111 recorded-only，回归0、新基线0、axe0 | 原37项基线变更与18项>40离群均待 Owner |
| Inputs | 高1990px，预算2000px；重叠0；240 IDs 与44/28/10/116/42保留 | 不裁切、不缩放、不删除样片，不放宽预算 |
| 原 Doc 外壳 | 1440/1024/390 的真实 owner；header52，paper 12/12/52/12、radius14、常驻导航轨0；原1440标按钮190.72×40 | 独立 Doc390 与内层 owner300 不混用；未宣称物理指针已投递 |
| 原 SUB234 浮层 | 4菜单、3下拉、1 Sheet、1遮罩的包含块、定位与层叠对照及恢复已留证；3个下拉原点相同 | 保留实际当前/控制/恢复读数与历史缺口，不重放旧树或改写旧报告 |
| 原 SUB242 与后续152 | 原清单两行等价更正与原scan退出0；M30的navigation/shell块数为11/19，组件10/11与27行保留 | 原scan生成收据已留存并精确恢复；不作为基线或产品源码提交 |
| 后续151 / 有效128#1 | Owner已采纳包归属差集0；包外0、例外清单空，55个无独立CSS规则的包内产出类逐项保留 | 未声称纯CSS规则集差集0；原128终态正文、身份与历史保持 |
| SUB243 / SUB244 | 精确37项，原19/后增16/新2；应用37、拒绝0，未重复应用 | 仅机械基线准入；37项目视均留空 |
| Sites | 草稿与标准入口已替代 Claude artifacts | 当前源码、交付包不等于线上已原地替换或设计会话已读回 |
| 原生记录 | 原第一批12张Story已done；原第二批16张仍按组保留active；151/152与234/242的最终转态见本次实际读回 | 142原语义问题未答复；两个INIT保持active到Owner目视，不代签目视或发布 |

参考入口：[设计标准站点](https://tcrn-ds-visual-standards.honestfawn3.chatgpt.site)、[草稿站点](https://tcrn-ds-visual-draft.honestfawn3.chatgpt.site)。完整目视列表在同目录 `owner-acceptance.md`，选择原因在 `docs/verification/internal-alpha/visual-baseline-selection-r6.json`，应用记录在同目录 `visual-selection-application.json`。当前源包逐项证据以 B25 交付报告为入口；本次正式原生回执与精确读回为 C05 交付材料。

## 已有裁定的适用

- TCRN-DS-MIN-20261016-R6 D1/D8：本阶段按机器判据收原28张Story，两个INIT保持active到Owner目视；STORY-150由实施会话按机器判据判定。原“13张第一批”计数以D1明确的12张及其实际编号集合为准，取消的129/130/134不重开。
- TCRN-DS-MIN-20261016-R6 D5 O-3：级联只有在将越过视口右缘时向左展开；不越界的原向右4px场景与GWT1–5保持。139完整目标已同步这项既有裁定。
- TCRN-DS-MIN-20261030-D03-COLOR D1/D2：标按钮背景保留日3.5%／夜4%；136#3的≥4.5门槛不放宽。DS日间hover/open后缀为#505fc1，idle与夜间按既有值；原136/137未分主题的简写不扩展为新的产品改色。
- TCRN-DS-MIN-20261013-SHELL D1及INIT016 D8：旧220/52布局由顶带壳替代；127#4保留历史原文并记录退役适用，不恢复旧布局，也不虚报旧布局实测通过。
- TCRN-DS-MIN-20261016-R6 D7：Sheet“自底升起、最高84%”仅改正文、不改实现；当前opacity淡入保留供Owner目视。
- TCRN-DS-MIN-20261102-CSS-OWNERSHIP D1–D3：当前有效128目标与首条通过关联151采用包CSS或包编译组件直接/模板产出的归属集合。文档自写类不能借包模板前缀绕过，page-template自写类仍需CSS定义，未知包外类仍判红；现有渲染、55项来源记录、原128其他判据与历史不改。
- 图钉的“可见名五语同源”与纯图标aria-label形式：仍待原Owner问题答复，不擅自添加新的显示形式或把可访问名等同于可见文字。

## 历史与交付停点

B23历史判断117/1/1、C01/C02后续118支持加1退役，以及B24的113/1/4/1与未知verify退出均保留为各自当时的结果；本次不将它们追认为B25或C05的执行。C01正式运行仅证明其当时main与原28覆盖，本次新增151/152及当前完成候选必须有实际适用覆盖。

目视清单的所有 `[ ]` 保持未勾选。Sites/成品板线上发布与设计会话读回、推送、tag、npm发布和部署均有各自停点，本地main合入与门通过不授予这些操作。

## 历史收口（2026-10-14，仅留证）

以下原文保留当时的候选、失败、计数与建议，已经被上面的当前结果及后续原生纪要取代；它不构成新的执行指令。旧登记路径、旧引擎版本、旧O项和签名数不代表当前状态。

# TCRN-DS-INIT-016 收口（顶带壳第二批）

INIT-016 的实施已经做完，停在推送之前：五轮返工后第六轮没有可做的返工，候选分支 `claude/init016-tab-shell` 只在本地；`corepack pnpm@10.12.1 run verify` 30 步还剩 2 步红，两步都只等 Owner 裁定（第 13 步 C8 → O-19，第 18 步 markText → O-4），`storybook:build` 退出 0。Owner 已在 Atelier 声明库门 `verify`，但 `gates-run` 在执行 verify 之前就被拒（本机设备登记的 DS 条目没有 projectId，O-21），所以本批 16 张与 INIT-015 的 12 张 Story 都还不能转 done。Owner 要做的事按先后列在第 3 节。

## 1. 候选与证据

| 项 | 值 |
| --- | --- |
| 工作树 | `/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init016-tab-shell` |
| 分支 | `claude/init016-tab-shell`，自 DS main 69aa195（INIT-015 候选的本地合入）切出；没有上游，没有 tag |
| 验证过的 HEAD | 60ff2ef（代码同第五轮 Q2 合入点 73bac9f）。之后只提交了 `docs/dispatch/2026-10-13-tab-shell/` 下的调度记录、本文件与再生回执；最终 HEAD 记在 `runs/state.md` |
| verify | 60ff2ef 上 2026-10-14T13:08:11Z 至 13:16:54Z 逐段跑完：30 步红 2、44 段红 2（`runs/r5/verify/steps.md`）。第 13 步 `contract:static` 只有顶带 C8 15 条（`C8.yield-without-min-width` 1、`C8.story-yield-missing` 14）；第 18 步 `geometry:measure` 的 stories 模式 18 门只有 markText 红（DS 品牌首行 `lkr-line@22:design-system` 1.4、底栏 TMS 锁定块 `lkr@22:tms` en 1.7）。与第三、四轮逐段相同 |
| storybook:build | 60ff2ef 上退出 0；37 个 HTML 页；forbiddenHits 为空 |
| 其余读数（同一次 verify） | 第 5 步 node 测试 299 条全过；browser-proof storyCount 72、screenshotCount 328、axeViolationCount 0、visualSignatureRegressions 0；pack:smoke 三个 4.0.0 tarball，sha256 前缀 f9e38c96（ui-tokens）、9130b42e（ui-copy-state）、01caea72（ui-react） |
| 逐段日志 | 会话 scratch `r1-verify/` 至 `r5-verify/`（会话临时目录，不保证长期保留）；仓内留各轮 `runs/r<n>/verify/steps.md` 结果表与红段读数 |
| 链（DS 库） | 第五轮链写后 version 2471，head f4d712d7…；本文件写出后另有一笔 INIT-016 收口注解，读回记在 `runs/state.md`。Subtask SUB-113 至 228 共 116 张：done 107，active 9（113、114、125、127、137、142、155、178、191，都只等 Owner）；16 张 Story active；INIT-016、INIT-015 active |
| 知识卡 | TCRN-DS-KB-026 至 KB-049（24 张），逐轮读回 |
| 引擎 | 现为 2.1.0（2026-10-14T13:20:31Z 由 2.0.3 切换）；第五轮开工时是 2.0.3 |

verify 跑完会改写 `docs/verification/internal-alpha/no-overclaim-scan.json`（scannedFiles 随文件系统上的构建产物变）与 `docs/verification/scaffold-proof.json`（输入摘要自第二轮起过期），并新生成未跟踪的 `visual-selection-result.json`。本文件提交后，按第五轮判断 §3.4 第 4 条，在集成树重跑 `scaffold:proof` 与 `scan`，把两份回执放进同一笔 `chore(receipts)` 提交；之后 verify 只会改写 no-overclaim 一份。

## 2. 16 张 Story

「机判」指机器判据；判定人写有 Owner 的只给机器结论。验收与判断见 `runs/r5/acceptance/R5.md`、`runs/r5/judgment.md`（第四轮三片在 `runs/r4/acceptance/`）。

| Story | 机判 | 证据 | 剩余（待 Owner） |
| --- | --- | --- | --- |
| 135 壳 token | 未满足：GWT4 contract:static 只剩顶带 C8 15 条；GWT1–3 满足 | steps.md 第 13 步 | O-19；库门 O-21 |
| 136 标按钮 | 未满足：GWT3 夜间后缀对比 3.07（D7） | 第 18 步 contrast pending | O-8；目视 |
| 137 固定项 | 满足 | 第 18 步壳层门 | 目视 |
| 138 完整菜单 | 满足；硬线「标旁文字中线」读数待 O-4（底栏 TMS 锁定块 en 1.7） | 第 18 步 | O-4；目视 |
| 139 下拉与级联 | 满足；DOM 用例只有包自报（O-18） | 第四轮 A 片 | 目视（O-3 不挡） |
| 140 ProductShell | 满足 | 第四轮 A 片；清单第 218 行 | 目视（含文档壳纸内焦点环一边被卡片盖住） |
| 141 登入动画 | 满足 | 第四轮 A 片；清单第 401 行 | 目视 |
| 142 图钉 | 满足 | 第四轮 B 片 | 目视（O-5、O-6 不挡） |
| 143 导航家族 | 未满足：符合性 C1–C17 只剩 C8 15 条 | 第 13 步；迁移说明 M53 | O-19；目视 |
| 144 手机 Sheet | 满足；Story 正文写「全屏、从顶带下方升起」，板与包件自底升起、最高 84% | 第四轮 B 片 | O-20（只改 Story 文字）；目视 |
| 145 首行变体 | 未满足：GWT2 DS 品牌首行墨迹中线差 1.4 | 第 18 步 | O-4；目视 |
| 146 PageHeader | 未满足：「几何门全绿」只差 markText；START 硬线（焦点环不被裁）第五轮已收 | 第 18 步；R5 验收 §2.1 | O-4；目视（G-18，Safari 同看） |
| 147 文档壳 | 满足 | R5 验收 §2.2 | 目视 |
| 148 五样板 | 未满足：GWT1「五块」（四板 D 段加 07a 第 1 段） | 第四轮 C 片 | O-2；目视；画布发布 |
| 149 壳层门 | 未满足：GWT1 真件 18 门 17 过（markText）；GWT2 verify 红 13 与 18 | 第 13、18 步 | O-19、O-4 |
| 150 4.0.0 候选 | 满足（判定人 Owner）：版本面、CHANGELOG、迁移说明 M20–M53、pack 冒烟、Storybook 构建、目视清单 | R5 验收 §2.3、§2.4；第 16、29 步 | Owner 判定；全清单目视；推送与发版 |

合计：机判满足 9（137–142、144、147、150），只等 Owner 7（135、136、143、145、146、148、149）。

## 3. 待 Owner

### 3.1 挡住 done 的事项（按先后）

| # | 事项 | 不裁时的现状 | 建议 | 裁后的动作与规模 |
| --- | --- | --- | --- | --- |
| O-21 | 本机设备登记的 DS 条目没有 projectId；`gates-run` 在 2.0.3 下两次、在 2.1.0 下一次（2026-10-14T13:43:31Z）都在执行 verify 前回 `GATES_PROJECT_UNKNOWN`（2.0.3 下另有一次是 `--release` 没写值被拒）（回执在会话 scratch `chain/gates/`） | 库门已声明但跑不了：INIT-015 的 12 张与本批 16 张都不能转 done | Owner 亲自运行或授权运行下面一条命令，再只读 `library-list` 核对 DS 条目带 projectId、其余字段不变 | 一条命令；之后 INIT-015 的 12 张按 3.3 第 1 条转 done（verify 约 9 分钟） |
| O-19 | 顶带的 C8 让步项 15 条（板 `.ts-pins` 写 `min-width:0`，没有固定项的壳不渲染让步项） | verify 第 13 步红；登记保留 | 甲：裁定顶带按板，`roles.json` 顶带一项加两个字段，门只对带字段的登记跳过这两项，`clauses.md` 写明，补两条自检 | 主力一包约 25 响应 |
| O-4 | 墨迹中线遇下行字母（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7，阈值 ±1） | verify 第 18 步红 | 改量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量 0.6） | 门库与 `measure-shell.js` 同改，补夹具与变异，主力一包约 40 响应；改后 DS 仍大于 1 再交 Owner |
| O-8 | 夜间后缀对比 3.07 / 3.13 / 3.33（D7） | 两主题同色、标红 pending | 随 S-6 一并裁 | 改 token、矩阵与测试，约 30 |
| O-2 | 148-GWT1「五块」对四板 D 段加 07a 第 1 段 | GWT1 记部分 | 接受，注解写明读法 | 接受只写注解；要补 Brand D 段约 60 |
| 150 | 4.0.0 候选的判定人是 Owner | 机判满足 | 目视后判定 | 无 |

O-21 的命令（`--git-remote` 与原条目同值，防止重登记丢字段）：

```
node ~/.einzbern/engine/einzbern.mjs library-register --project "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System" --library "/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System/.ether" --project-id project:ba2f70f9503ac43c3ec6aa36 --git-remote github.com/tpmoonchefryan/TCRN-Design-System --at <当前 UTC>
```

### 3.2 其余待裁（不挡判据；不裁时按「现状」保留）

| # | 事项 | 现状 | 建议 |
| --- | --- | --- | --- |
| O-1 | 长字标放不下（要 117，格 60，D1 定宽 134） | 截断加 title | 宽度至少 134、随字标加宽，07b 补长名屏（主力约 40） |
| O-3 | 级联越过视口右缘 | 现写法 | 越界就向左展开（主力约 40） |
| O-5 | Icon 板「禁填充」与 pin 实心态冲突 | 只改件数 | 加例外，补画实心态（约 30） |
| O-6 | 触摸端未固定的图钉平时不显 | 获焦才显 | 粗指针下常显 ink-3（约 20） |
| O-7 | 文档站默认头像；目录宽 144 | 现状 | 接受现状 |
| O-9 | AOS 在 logos2 里没有标 | AOS story 暂传 design-system | 补标或撤 AOS story（约 20–30） |
| O-10 | 头像菜单几何、无账户图标，板上没画 | 现写法 | 接受，目视时定 |
| O-11 | 窄屏按视口切还是按容器切 | 按视口 | 容器查询（主力约 80） |
| O-12 | 下拉里显不显示 ⌘K | 不显示 | 不显示，可直接结掉 |
| O-13 | 纸升起的距离 | 10 | 设计会话给数（约 10） |
| O-14 | STORY-136 的字重文本与板不一致 | 按板实现 | 按板改 Story 正文 |
| O-15 | Sheet 夜间遮罩与下一级怎么开；遮罩下的纸夜间 4.13，板 7.29 | 现写法 | 设计会话补（约 40） |
| O-16 | 纸内页标题行高：板 28.6 无 type token，包件 30 | 30 | 接受 30 |
| O-17 | TreeNav 归宿：壳菜单与下拉由模型渲染 | 现写法 | 接受；TreeNav 只用于消费方的下拉或浮层 |
| O-18 | 批末 verify 不含 test:dom（139、140、141 的 DOM 用例只有包自报） | 不加 | 批末 verify 后加跑只读 test:dom（执行方法变更，需 Owner 同意） |
| O-20 | Story 144 的「全屏 Sheet」「从顶带下方升起」与板不一致 | 实现照板 | 按板改 Story 正文 |

各项的证据、裁后改法与挡住哪一步，见 `runs/r5/judgment.md` §3.1（第 46–75 行）。

### 3.3 Owner 裁定之后的步骤

1. **INIT-015 的 12 张**（O-21 补登记后即可做）：主检出 `/Users/ryanlan/Code/TCRN Platform/TCRN-Design-System` 在 main@69aa195 且 `git status --short` 为空 → `node ~/.einzbern/engine/einzbern.mjs gates-run --workspace "<主检出>/.ether" --project "<主检出>" --project-id project:ba2f70f9503ac43c3ec6aa36 --at <当前 UTC> --release true --work-id <12 个 id，逗号分隔>`（id 见 START 库门表；2.x 的布尔旗标要写 `true`；后台跑、输出进文件）→ 回执 `GATES_RUN_COMPLETED` 且 ok 为真 → 收干净（下一条）→ 一个 work-batch 转 12 张 → 逐张 `work-show` 读回。INIT-015 保持 active 到 Owner 目视。
2. **收干净清单**（第三、四、五轮批末跑后都只有这三项）：`git -C "<主检出>" checkout -- docs/verification/internal-alpha/no-overclaim-scan.json`；本批回执若未按第 1 节再生，再还原 `docs/verification/scaffold-proof.json`；未跟踪的 `docs/verification/internal-alpha/visual-selection-result.json` 移出工作树。之后 `git status --short` 必须为空；`docs/verification` 外出现改动就停下记问题。
3. **INIT-016 的 16 张**：O-19、O-4 裁定后开下一轮（两个主力包，可按小轮合并验收与判断），批末 verify 要 30 步全绿；O-8、O-2 裁定（裁后有改动的同轮做）；Owner 对 150 作出判定。然后：候选分支 `--no-ff` 合入主检出 main 本地（不推送）→ 主检出上一次 `gates-run --release true --work-id <16 个 id>` → 收干净 → 一个 work-batch 转 16 张 → 读回。16 张须同一批、同一次门运行，不拆成 15 加 1。INIT-016 保持 active 到 Owner 目视。

### 3.4 停点

- 推送、打 tag、发版、部署：都没做，各自等 Owner。4.0.0 只是集成分支上的候选。
- 目视验收：按 `owner-acceptance.md`（第一批与第二批合一，432 行）：8 板各一节，加第三、四、五轮节与 G 项。第五轮新增两项（第 311–320 行）：Disclosure 获焦焦点环四边请在 Safari 与 Chromium 内核浏览器各看一遍（G-18，第 363 行）；展开动画中区域底缘外最多 4px 内容可见，按样式读出、未逐帧实测。
- 画布与 F 段发布：交设计会话，清单见第 4 节。
- 可选安装：要机读核 Safari 是否认 `overflow-clip-margin`，需授权装 Playwright WebKit 或开 safaridriver；不授权就以 G-18 的 Safari 目视为准。

## 4. 改过的设计文件（交设计会话发布）

`git diff --name-only 69aa195..HEAD -- docs/design` 共 25 个；第五轮没有新改动。逐板改动与提交见 `owner-acceptance.md`「待发布的成品板」节。`Shell.dc.html`、`Shell-2.dc.html`、`Tokens.dc.html`、`Brand.dc.html` 没有改。

| 类别 | 文件 |
| --- | --- |
| 成品板 | `docs/design/visual-standard/boards/Actions.dc.html`、`Icon.dc.html`、`Inputs.dc.html`、`Typography.dc.html` |
| 画布索引与板高 | `docs/design/visual-standard/canvas.json`、`docs/design/visual-standard/heights.json` |
| 草稿画布的草案板 | `docs/design/gplus-2026-10/boards/V2-B1-Actions.dc.html`、`V2-B1-Icon.dc.html`、`V2-B1-Inputs.dc.html`、`V2-B1-Typography.dc.html` |
| 生成工具 | `docs/design/visual-standard/tools/make-standard.mjs`；`docs/design/gplus-2026-10/tools/` 下 `build-actions.mjs`、`build-icon.mjs`、`build-inputs.mjs`、`build-shell2.mjs`、`build-typography.mjs`、`lib.mjs`、`shell-screen.mjs` |
| 设计数据（门与包在用，不上画布） | `docs/design/gplus-2026-10/contract/icons.json`、`matrices.json`、`tokens.json`；`docs/design/gplus-2026-10/doc-class-map.json`、`storybook-map.json`、`storybook-map.md`、`README.md` |
| 另交 | `Shell-2.dc.html` 的 F 段补登六条壳层 token（shell.mark、shell.touch、shell.crumb-icon、shell.chevron、shell.locale-chevron、shell.mark-lg）；148 的 Brand 板 D 段视 O-2 裁定 |

## 5. 五轮经过与问题处置

| 轮 | Subtask | 包 | 批末 verify（HEAD：30 步红数） | 链版本（开工 → 收尾） | 知识卡 |
| --- | --- | --- | --- | --- | --- |
| R1 | SUB-113–140（28） | 18 | 63e1ee2：9 | 1889 → 1951 → 2032 | KB-026–030 |
| R2 | SUB-141–177（37） | 13 | 6f739b2：7 | 2032 → 2069 → 2194 | KB-031–035 |
| R3 | SUB-178–211（34） | 11 | c45c529：2 | 2194 → 2228 → 2368 | KB-036–040 |
| R4 | SUB-212–224（13） | 5 | 682fc94：2 | 2368 → 2381 → 2435 | KB-041–045 |
| R5 | SUB-225–228（4） | 2 | 60ff2ef：2 | 2435 → 2439 → 2471 | KB-046–049 |

各轮的问题清单在 `runs/r<n>/problems/`，处置在同轮 `judgment.md` §2 至 §3。第三轮起只剩的两步红都转交 Owner（O-19、O-4），没有放宽门或加豁免。已知差距（不挡判据，交各文件的下一个持有者）：

| # | 差距 | 交给谁 |
| --- | --- | --- |
| 1 | browser-proof 一处读回恒空（同区已由 `legacyProductShellGlobalNavCount` 判红覆盖）；geometry-proof 一条走不到的隐藏态分支 | 两份门脚本的下一个持有者 |
| 2 | 几何门 `cutOf` 不认 `overflow-clip-margin` | 几何门的下一个持有者 |
| 3 | 壳层门 brandDigest 不量 DS、Mana 标按钮；读法余项 o.prail、o.rows、x.rowHeights，contrast 只认 rgb 与 rgba | shell-measure 的下一个持有者 |
| 4 | axe 豁免节点数随主区滚动位置变；47 条视觉签名仍是第三轮截法（下次越容差时按来源分开收） | browser-proof 的下一个持有者 |
| 5 | 「根类全有家族」守护测试未加（现读 unattributed 0）；M53 与 G-21 抄写的块数与 C8 条数没有门看守 | contract 家族表与 `roles.json` 的下一个改动单 |
| 6 | `.tcrn-segmented-nav` 白名单保留；G+ 禁形不含 `--tcrn-color-acc-bg` | shell-fidelity、selection-grammar 的下一个持有者 |
| 7 | NavPin 等四家族的兜底焦点环；文档站读屏文字三处小缺口 | 这些家族与文档层的下一个持有者 |
| 8 | 证据面：DS 标按钮只有探查与静态比对，Mana 标按钮只有 SSR 单测；DOM 用例与变异只有包自报（O-18）；paperFocusRing 只量浅色 | O-18 与壳层门的下一个持有者 |
| 9 | SUB-225 的用例只读按钮那条焦点 outline；展开动画帧没机读（静态 Storybook 没有可切换的 Disclosure）；WebKit 未核 `overflow-clip-margin` | Layout.test 的下一个持有者；Owner 目视 G-18 |
| 10 | `full-surface:proof` 记录的选择框触发器与焦点环样式是过渡中取样，跨轮不同（门不判） | full-surface-proof 的下一个持有者 |

完整清单 21 条见 `runs/r5/judgment.md` §5 (b)（第 216–240 行）。

## 6. 计数与口径更正

- INIT-015 的 Story 是 12 张，不是 START 与 D8 写的 13 张：120–128、131–133；129、130、134 已 cancelled；Owner 声明的库门 covers 也是这 12 个。
- 第三、四轮记录里的「DS 侧栏首行」实为品牌首行锁定块（`lkr-line@22:design-system`），壳里没有侧栏；读数 1.4 无误，旧记录不回改。
- SUB-219 判据④按「排除迁移说明后 grep 为 0」判定：不排除时只剩 M50 按名记录删除的 3 行（`docs/migration-4.0.md` 第 1366–1368 行），C-11 不改 M1–M52。

## 7. 收尾清理

- 包树：五轮共 49 个包树全部经 `git worktree remove` 退役（第五轮 Q1 328 MB、Q2 278 MB）；包分支保留在本地（已合入集成分支）。文件系统可用空间第五轮前后都是 57 GiB（`df -h`，GiB 取整，两棵包树合计约 606 MB 不足以改变读数）。
- 保留：集成工作树 `init016-tab-shell`（候选分支所在，Owner 裁定后的下一轮从这里继续）；会话 scratch 418 MB（其中各轮 verify 逐段日志 r1–r5 共约 15 MB、包日志 81 MB、链写回执 9.6 MB、trash 215 MB 为批末 verify 移出的未跟踪回执与包内一次性产物，其余为验收与判断的探查输出），是本 INIT 的证据与可丢弃残余，会话结束后由系统回收。
- 未动：`/Users/ryanlan/Code/.worktrees/TCRN-Design-System/init015-gplus-renewal`（INIT-015 的工作树，候选已合入 main 69aa195；不是本会话创建，留给其归属方按 Git 工作树管理入口处置）。主检出 main@69aa195 的 `git status --short` 为空，四次门运行尝试都在执行 verify 前被拒，没有改动它。
