# R4 判断 · TCRN-DS-INIT-016（STORY-135 至 150）

节行号：§0 L5；§1 L11；§2 L34（R5-1 L38、R5-2 L54、R5-3 L63、R5-4 L77、2.5 L85）；§3 L112（3.1 L114、3.2 L143、3.3 L153、3.4 L161、3.5 L188）；§4 L195（4.1 L197、4.2 L226、4.3 L230、4.4 L251、4.5 L256、4.6 L266）；§5 L270

## 0. 依据与判断补查

- 依据：三片验收 A、B、C（验时 HEAD 0c1d4ce，代码同 682fc94）；批末 verify `runs/r4/verify/steps.md`（682fc94：30 步红 2、44 段红 2，与 R3 相同）；拆分问题 11 条；包问题 N1 4 条、N2 5 条、N3 7 条、N4 2 条、N5 4 条；主线程 M1、M2；跨包通告；R3 判断 §3.1、§3.4、§4、§5 与 R4-3 原文；R4 拆分 §2 与 SUB-216 判据；START「回路」「模型与子代理」「质量硬线」；`owner-acceptance.md` 第 197–421 行；链上 Story 146 正文。
- 只读补查（scratch `judge-r4/`）：`status` 与 `knowledge-list` 各一次（DS 库 version 2381，即 R4 开工链写后的版本，之后没有写入；知识卡 40 张，最新 KB-040）；R4 开工读回里 13 张 R4 Subtask 都是 planned，R1–R3 留下 9 张 active（113、114、125、127、137、142、155、178、191）。核对过的源码行：`base.css.ts:2395–2403`（内层 `overflow: clip`、`overflow-clip-margin: var(--tcrn-space-0h)`）；`tokens.css:44、291`（`--tcrn-focus-ring` = 2px 承载面间隙加外扩到 4px 的强调色环）与 `:197–198`（space-0h 2px、space-1 4px）；`shell.css.ts:937–946`（纸内焦点对「the accent ring to space-1」）；`Layout.test.tsx:66–72`（断言 margin ≥ 1px）；`doc-shell-class-proof.mjs:147`；`migration-4.0.md:44、936–941`。没跑门、没构建、没写链、没跑 git 写命令。
- 措辞更正：`steps.md:57`、`problems/main.md` M2 与跨包通告第 1 节写的「DS 侧栏首行」，实为品牌首行锁定块（`shell-brand-first-line` 的 `lkr-line@22:design-system`），壳里没有侧栏；读数 1.4 无误。R4 的记录不回改，以本条为准；R5 的通告、链注解与收口文件写「DS 品牌首行」。owner-acceptance 原本写的就是「品牌首行」。

## 1. R4 结论表

| Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别 | R5 返工项 | Owner 目视项 |
| --- | --- | --- | --- | --- | --- |
| 135 壳 token | 阻塞于 Owner | 否：GWT4 contract:static 只剩顶带 C8 15 条；GWT1–3 满足、无回退 | 只有 Owner 能定（O-19） | 无 | 无 |
| 136 标按钮 | 阻塞于 Owner | 否：GWT3 夜间后缀 3.07（D7）；data-logo 写标 id 已满足（SUB-212） | 只有 Owner 能定（O-8） | 无 | 两版、hover / open、390、长字标（O-1）、夜间后缀 |
| 137 固定项 | 满足（机器判据） | 是；本轮无改动、无回退 | 无 | 无 | 固定项、选中态、1023 的「已固定」分组 |
| 138 完整菜单 | 满足（机器判据） | GWT 全满足；硬线「标旁文字中线」只剩底栏 TMS 锁定块 en 1.7 | Owner（O-4，硬线读数） | 无 | 菜单与底栏锁定块、⌘K 只开一个壳 |
| 139 下拉与级联 | 满足（机器判据） | 是；三条 DOM 用例只有包自报（O-18） | 无（O-3 不挡） | 无 | 下拉与级联（O-3） |
| 140 ProductShell | 满足（机器判据） | 是；纸内焦点探针真件 9 处、0 违规（SUB-213） | 无 | R5-3（清单文字） | 顶带壳、铃铛 6%、拖排与产品切换；纸内焦点环（文档壳一边被卡片盖住，Owner 定是否接受） |
| 141 登入动画 | 满足（机器判据） | 是；DS、Mana 两例只有包内 test:dom（O-18） | 无 | R5-3（O-18 行名单） | 登入动画（画面不变） |
| 142 图钉 | 满足（机器判据） | 是；无回退 | 无（O-5、O-6 不挡） | 无 | 图钉三态、菜单与 Sheet 行图标盒 |
| 143 导航家族 | 阻塞于 Owner | 否：C1–C17 只剩 C8 15 条；未归属根类 9 → 0（SUB-215） | Owner（O-19）；M30 文字过期可返工（不挡判据） | R5-2 | Tabs 五形、面包屑分隔图标、TreeNav 在下拉、菜单外禁用原因换行 |
| 144 手机 Sheet | 满足（机器判据） | 是；Story 文字与板不一致 | Owner（O-20，只改 Story 文字） | 无 | 手机 Sheet（O-15） |
| 145 首行变体 | 阻塞于 Owner | 否：GWT2 DS 品牌首行 1.4；符合性两处（data-logo 一种取值、map.json 两主题同色）已满足 | 只有 Owner 能定（O-4） | 无 | 八枚首行两尺度 |
| 146 PageHeader | 部分 | GWT1–4 满足；「几何门全绿」只差 markText；START 硬线：描边已画出，获焦焦点环底边与起始边被裁 2px（B4-1） | 硬线可返工；Owner（O-4） | R5-1 | 纸内页头、设置页 1040、SplitView、目录 h2、Disclosure 描边与焦点环（G-18，Safari 同看） |
| 147 文档壳 | 满足（机器判据） | GWT1–4 满足；左边条、截图盲区、死类（C3-1、C3-2、C3-6）都已收 | 可返工（注释残串，不挡判据） | R5-4 | 文档站整体、展开标题无左边条、截法变更后的离群项 |
| 148 五样板 | 阻塞于 Owner | 否：GWT1「五块」；GWT2–4 满足，map.json 与 md 同源 | 只有 Owner 能定（O-2） | 无 | 四板 D 段（发布后） |
| 149 壳层门 | 阻塞于 Owner | 否：GWT1 真件 17/18（markText）；GWT2 verify 红 13 与 18 | 只有 Owner 能定（O-4、O-19） | 无 | 无 |
| 150 4.0.0 候选 | 满足（机器判据；判定人 Owner） | GWT1–4 满足；清单与批末读数一致；文字过期三处（M30、清单两类） | 可返工（文档，不挡判据） | R5-2、R5-3 | 全清单；第四、五轮离群项 |

结论：机判满足 9、部分 1、阻塞于 Owner 6（R3 为 8 / 4 / 4）。143、145 由「部分」转「阻塞于 Owner」（R3 的可返工项都已收掉，只剩 O-19、O-4）；147 由「部分」转「满足」；146 仍是「部分」，原因由描边换成获焦焦点环。三片对 R3 已满足的 GWT 与硬线逐条复测，无回退。批末 verify 只剩两步红，都只等 Owner：第 13 步 C8 15 条（O-19），第 18 步 markText（DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7，O-4）。**R5 有可做返工 4 条，含一条 START 硬线（R5-1），本轮不收口**；主线程 M2「R5 无可做返工、建议收口」不采纳（§3.4 第 1 条）。

## 2. R5 返工清单

共 4 条、2 包：主力 1 条（R5-1，单独成包），经济 3 条（R5-2、R5-3、R5-4，同一包）。同一根因已合并：B4-2 与 C4-1(a) → R5-2；A4-1 与 C4-1(b) → R5-3（同一文件、同一原因：清单没跟上后续轮次）。C4-2 与同族的门读法余项不进 R5，记入收口已知差距（§3.4 第 7、8 条）。R5-1 是 R4-3 同一修复目标的第一次退回，已升主力；R5 再被退回就停下，记入收口文件交 Owner。

### R5-1 · 可折叠区里控件的获焦焦点环不被裁（主力；R4-3 第一次退回；硬线）

- 来源：B4-1；N1 问题 2；R3 判断 R4-3 → SUB-216。
- 现象：SUB-216 把 `.tcrn-collapsible-region__inner` 改为 `overflow: clip` 加 `overflow-clip-margin: var(--tcrn-space-0h)`（2px），够 1px 描边，不够焦点对：`--tcrn-focus-ring` 是 2px 承载面间隙加外扩到 4px 的强调色环，forced-colors 下的 outline 宽 2px、偏移 2px，同为外扩 4px。`interaction-disclosure-spec` 展开区的「Focusable only while expanded」获焦后，底边与起始边外只剩 2 行承载面色，强调色环被内层裁掉；上边与末端边完整。1440、1024、390 浅色 en 与 1440 夜间 zh-CN 都一样。规则在内层，任何贴着区域边的可聚焦控件都会这样（Feedback 的操作详情、AOS 视觉实例里的 DisclosurePanel）。违反 START「任何元素不超出裁切祖先」与焦点可见。
- 证据：B §2.5 符合性第 2 条与 §3 B4-1（scratch `acc-r4-B/out/61-disclosure-sum.txt`；`65`：内层是唯一贴边的裁切祖先，下一层离起始边 26、底边 217）；`base.css.ts:2399–2403`；`tokens.css:44、197–198`；`owner-acceptance.md` 第 268、352 行。
- 改法：
  1. 内层 `overflow-clip-margin` 改为 `var(--tcrn-space-1)`（4px，等于焦点对的最大外扩），注释改写为「裁切边外扩到控件的焦点对与描边」。包里已有同一读法：纸内焦点对写「the accent ring to space-1」（`shell.css.ts:937–946`），不是新语义，不新增 token。`overflow: clip`、`min-height: 0`、无内距无边框、`0fr / 1fr` 过渡都不变。
  2. `Layout.test.tsx:66` 起的用例收紧：从 `@tcrn/ui-tokens` 读出 `--tcrn-focus-ring` 各层 spread 的最大值，断言 margin token 的 px 不小于它，也不小于 forced-colors 下焦点 outline 的宽加偏移（规则位置由拆分 grep 定）；改回 `--tcrn-space-0h` 时判红，交回写这次变异的读数。
  3. 一次性只读探针（scratch，不入仓）：`interaction-disclosure-spec` 在 1440、1024、390 浅色 en 与 1440 夜间 zh-CN，再加 forced-colors 仿真一遍；键盘获焦后四边外第 3、4 行 / 列都是环色；收起态区域与内层 0 高且不可见；展开区域高 100 / 100 / 100、无标题 CollapsibleRegion 48 / 68 / 68 与 R4 相同。另量一处 Feedback 操作详情与一处 AOS 视觉实例的 DisclosurePanel（B §6 未量）。
  4. 局部门：build、`--filter @tcrn/ui-react test`、test:dom、typecheck、tokens:proof、contract:proof、contract-static（只剩 C8 15）、geometry:proof、geometry:measure（只剩 markText）、internal-alpha:browser-proof、storybook:build。browser-proof 预计签名全在容差内（静止态的描边在 2px 内已画出）；若有越容差，本包按 KB-022 先给现行应用记录改名（N5 已用 `-init016-r3`，取不撞名的下一个），只收越容差的条目，逐条写理由与离群类别，交回列出，由 R5-3 写进清单。回执若有实质变化（no-overclaim、scaffold 两份的漂移照惯例还原），本包一并提交再生结果：本轮其后没有改渲染的包，这就是本轮唯一一次生成物再生（批量原则第 4 条）；否则跑完按 C-9 还原。
- 不做：不新增 token；不改按钮描边与焦点对的画法；不走内距加负外距的方案（改动面大，收起态要另量）；不改几何门（`cutOf` 不认 clip margin 属门读法余项，§3.4 第 8 条）；不装 WebKit。
- 代价：展开、收起动画中，区域底外最多 4px 内容可见（现为 2px），并入 G-18 目视。
- 文件：`packages/ui-react/src/styles/base.css.ts`、`packages/ui-react/src/components/Layout/Layout.test.tsx`；只在重收或回执有实质变化时，另加 `docs/verification/internal-alpha/` 下的基线、选择文件、改名记录与回执。依赖：无。
- 档位：主力（同一目标第一次退回，升档，单独成包）。迁移条目：无（同 R4 对 SUB-216 的处置，B §5 N1 第 5 条已判可接受）。
- Story：146 符合性与 START 硬线「任何元素不超出裁切祖先」、焦点可见；GWT1–4 不变。WebKit 是否认 `overflow-clip-margin` 仍未核，取值改大不改变这一点（§3.2）。

### R5-2 · 迁移说明 M30 末段的登记事实过期（经济）

- 来源：B4-2、C4-1(a)、N4 问题 1（同一根因：SUB-191、SUB-215 改了登记，M30 没人跟）。
- 现象：`docs/migration-4.0.md:936–941` 写「navigation lists 9 … shell lists 14」与「`roles.json` lists no toolbar」。现状：SUB-215（f29fb30）后 navigation 11、shell 19、inputs 16；SUB-191（f26c633，R3）起 `roles.json` 把顶带登记为 C8 工具栏（容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`）。M38–M52 都没有记这两项。逐件表仍准，按 Do 读 `families.json` 的消费方不会出错，但这一段会被读错。
- 证据：上列行；`docs/contract/families.json` 各家族块数；`docs/contract/roles.json` 的 `toolbars`；B §3 B4-2；C §3 C4-1(a)。
- 改法：按 C-11 只追加，M30 正文不动：从 M53 起追加一条，写三族的新块数、补登的 9 个根类（navigation 2、shell 5、inputs 2）、顶带工具栏登记（注明 C8 判定待 O-19），并写明 M30 末段两处数字与「lists no toolbar」不再成立；Do 同 M30（从 `families.json`、`roles.json` 读）。开头的区间改到 M53，三份「By consumer」清单按区间补上 M53（照 R3 判断 §3.4 第 6 条的同一范围放开 C-11）；CHANGELOG 4.0.0 摘要同步一句。
- 文件：`docs/migration-4.0.md`、`CHANGELOG.md`。依赖：无（与 R5-3、R5-4 同包）。档位：经济。
- Story：150-GWT2（迁移说明逐条有步骤）；条目内容属 143。

### R5-3 · 目视清单跟上第四、五轮（经济）

- 来源：A4-1；C4-1(b)；R5-1、R5-2 落地后的同步。
- 现象：清单四处没跟上：第 218 行纸内焦点环没写文档壳上被卡片盖住（R3 判断 §1、§3.2 要求列进目视）；第 390 行（O-18）名单漏 SUB-214；第 201、208 行把 E 段落点写成 M20 至 M29，「⌘K 每个壳一次」实在 M41、M52；第三轮离群表（第 233–260 行）没注明已被第四轮重收取代。R5-1、R5-2 落地后，第 268 行、G-18、G-21 也会过期。
- 改法（按内容定位、自下而上改，插行后行号会移，KB-024）：
  1. 第 218 行原句后补：「文档壳的纸内可以滚动，获焦时底边被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下；R3 判断 §3.2，请 Owner 目视时定是否接受）」。
  2. 第 390 行名单补「SUB-214（141-GWT4 的 DS、Mana 两例）」。
  3. 第 201、208 行改为第二批全区间（R5-2 后为 M20 至 M53），注明 ⌘K 见 M41、M52。
  4. 第三轮离群表表头加一句：签名已由第四轮按新截法整批重收，表中是第三轮读数，Disclosure 的现状见 G-18。
  5. R5-1 落地后：第 268 行与 G-18 改为第五轮现状（余量 space-1，焦点环四边完整，读数取 Q1 交回，Chromium；Safari 仍请同看）；G-21 改为「第五轮追加 M53」；新增「第五轮新增与变化的目视项」一节（Disclosure 焦点环；Q1 若有重收，离群项逐条列）；写「第四轮批末读数」处只补一句「第五轮只改可折叠区内层的裁切余量，其余同第四轮批末」，不预写第五轮批末读数（由 R5 合并验收核对）。
- 证据：A §3 A4-1（`docmain.json` 取样点；R3 判断 §1、§3.2）；C §2.4 对照表与 §3 C4-1(b)；Q1 交回。
- 文件：`owner-acceptance.md`（R5 只由本条改）。依赖：R5-1（第 5 项读 Q1 交回）、R5-2（M53 的号）。档位：经济。
- Story：150-GWT3（清单）；内容分别涉及 140（目视项）、141（证据范围）、146（G-18）。不改变任何 Story 的结论。

### R5-4 · doc-shell-class-proof 注释里的已删类名（经济）

- 来源：C4-1(c)；N3 问题 1；SUB-219 判据④。
- 现象：`scripts/doc-shell-class-proof.mjs:147` 的 JSDoc 示例串 `".tcrn-doc-brand, [data-x]"` 用的是已删除的类，是 SUB-219 判据④ grep（排除 `docs/verification`、`docs/dispatch`）唯一的残余。它不是读取方，不影响门。
- 改法：示例换成在用的类（`.tcrn-doc-page`，`alpha-styles.ts:98` 在用，改前再 grep 一次）。只改注释，判定与导出不动；改后同一 grep 为 0，doc-shell:proof 退出 0。
- 文件：`scripts/doc-shell-class-proof.mjs`。依赖：无。档位：经济（只改注释）。
- Story：147（SUB-219 判据④）。

### 2.5 对照：R4 问题 → 处置（同一根因只列一处）

| 问题 | 处置 |
| --- | --- |
| 拆分 1 行号漂移、2 探针路由、3 DOM 用例落点、5 145 不直接挂单、9 differencesPendingOwner、10 记录文件名、11 字段数 | R4 内按默认做完，三片判可接受，不再处置 |
| 拆分 4、A §6 第 2 条：壳层门 brandDigest 不量 DS、Mana 标按钮 | 收口已知差距（§3.4 第 8 条） |
| 拆分 6、N1 问题 2、B4-1 | R5-1 |
| 拆分 7、8：收紧后的新发现 | N3 读数都是 0，无处置 |
| N1 问题 1、N2 问题 1、N3 问题 7、N4 问题 2、N5 问题 1、主线程 M2 的红 | 既有红，O-19 / O-4（§3.1） |
| N1 问题 3：WebKit 是否认 `overflow-clip-margin` | §3.2；§3.5（Safari 目视，装 WebKit 是停点） |
| N1 问题 4：几何门 `cutOf` 不认 clip margin | 收口已知差距（§3.4 第 8 条） |
| N2 问题 2：152 条高故事过渡红 | SUB-224 已重收（C §2.4） |
| N2 问题 3：axe 豁免节点数随主区滚动位置变 | 收口已知差距（§3.4 第 8 条） |
| N2 问题 4：「根类全有家族」守护测试 | 收口已知差距（B §5 已追认本轮不加） |
| N2 问题 5、N5 问题 4（观察）；N3 问题 2（读数更正） | 不处置；读数更正照收 |
| N3 问题 1、C4-1(c) | R5-4 |
| N3 问题 3、4、C4-2 | 收口已知差距（§3.4 第 7 条） |
| N3 问题 5：`.tcrn-segmented-nav` 白名单 | 保留（§3.4 第 8 条） |
| N3 问题 6：G+ 禁形不含 `--tcrn-color-acc-bg` | 不补，收口已知差距（§3.4 第 8 条） |
| N4 问题 1、B4-2、C4-1(a) | R5-2 |
| N5 问题 2：47 条容差内漂移 | §3.2 知悉；Q1 读签名时计入 |
| N5 问题 3：选择文件一条理由写错 | 包内已更正，C 判可接受 |
| A4-1、C4-1(b) | R5-3 |
| 主线程 M1 | 库门 S-1（§3.5） |
| 措辞「DS 侧栏首行」 | §0 更正 |
| C §6：后批家族的左边条（`EX-INIT015-inspection`） | 不判、不列返工（第五批家族的登记豁免） |

## 3. 只有 Owner 能定的事项

### 3.1 待裁（沿用 O-1 至 O-20，本轮无新增）

三片都没有新的 Owner 事项，本判断也不新增。读数与 R3 相同的写「同 R3」；裁定后的改法沿用 R3 判断 §3.1、§3.1.1。

| # | 事项 | R4 现状（即不裁时的默认） | 建议 | 裁后改法与规模 | 挡住 |
| --- | --- | --- | --- | --- | --- |
| O-19 | 顶带的 C8 让步项 15 条（静态 1、story 层 14，全在 shell） | 同 R3：contract:static 红；登记保留；SUB-215 补登后仍是这 15 条、无新发现；SUB-113、125、142、155、178、191 保持 active | 甲：裁定顶带按板（R3 判断 §3.1.1） | 甲：roles.json 顶带一项加两个字段，门只对带字段的登记跳过两项，clauses.md 写明，两条自检；主力约 25，单独成包 | verify 第 13 步；135-GWT4；143 C1–C17；149-GWT2 |
| O-4 | 墨迹中线遇下行字母 | 同 R3：DS 品牌首行 `lkr-line@22:design-system` 1.4（en、zh-CN，4 次运行）；底栏 TMS 锁定块 `lkr@22:tms` en 1.7（6 处、两主题）；markText 红；SUB-127、137 保持 active | ±1 改量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量 0.6） | 门库与 measure-shell.js 同改，补夹具与变异，主力约 40；改后 DS 仍 > 1 再交 Owner | verify 第 18 步；145-GWT2；146「几何门全绿」；138、145 的硬线读数；149-GWT1、GWT2；D 段「标按钮（v2）」 |
| O-8 | 夜间后缀 3.07 / 3.13 / 3.33（D7） | 同 R3：两主题同色、标红 pending；SUB-114 保持 active | 随 S-6 一并裁 | 改 token、矩阵与测试，约 30 | 136-GWT3 |
| O-2 | 148-GWT1「五块」对四板 D 段加 07a 第 1 段 | 同 R3：GWT1 记部分；R4 没动画板 | 接受，注解写明读法 | 接受只写注解；要 Brand D 段约 60 | 148-GWT1 |
| O-18 | 批末 verify 不含 test:dom（加段属执行方法变更） | 不加；R4 多了 SUB-214 两例（141-GWT4），清单名单由 R5-3 补 | 批末 verify 后加跑只读 test:dom，记入 steps.md | 主线程脚本加一段 | 无判据；139、140、141 的 DOM 用例只有包自报 |
| O-20 | Story 144 写「全屏 Sheet」「从顶带下方升起」，板与包件是自底升起、最高 84% | 同 R3：实现照板 | 同 O-14：按板改 Story 文字 | 只改链上 Story 正文 | 无（目视手机 Sheet） |
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

- 条件项（不是新 O 号）：R5-1 若在 R5 再被退回，按 START 停下，「可折叠区获焦焦点环被裁」作为已知差距交 Owner，随 G-18 目视定是否接受。

### 3.2 知悉

- **WebKit 未核**：本机 Playwright 只有 Chromium，Safari 是否认 `overflow-clip-margin` 没有读数。不认时，描边与焦点环在 WebKit 上照旧在盒边被裁（不比 R3 差），取值从 2px 改 4px 不改变这一点。G-18 已请 Owner 在 Safari 与 Chromium 内核浏览器各看一遍；要机读得装 Playwright WebKit 或开 safaridriver，都是停点（§3.5）。
- **文档壳纸内焦点环被卡片盖住**（R3 判断 §3.2）：读数未变，仍是目视项；R5-3 把这句补进清单。Owner 目视不接受时由 Owner 定改法，不再派。
- **证据面**：DS 标按钮只有验收探查与静态全量路径比对的读数，Mana 标按钮只有 SSR 单测（A §6 第 2 条）；SUB-180、184、185、214 的 DOM 用例只有包自报（O-18）；paperFocusRing 只量浅色。
- **容差内漂移**：47 条签名在容差内，仍是第三轮签名，其中 `navigation-product-shell-spec@tablet` 是唯一留旧截法签名的高 story（N5 问题 2）；下次越容差时分来源要算进去。
- **收口已知差距**（写进收口文件，交各脚本的下一个持有者）：§3.4 第 7、8 条的各项，加上 R3 判断 §3.2 沿用的三项：壳层门读法余项（o.prail、o.rows、x.rowHeights、contrast 只认 rgb 与 rgba）、NavPin 等四家族的兜底焦点环、文档站读屏文字三处小缺口。
- **交设计会话发布**：F 段补登六条壳层 token（shell.mark、shell.touch、shell.crumb-icon、shell.chevron、shell.locale-chevron、shell.mark-lg）；四块成品板与 `canvas.json`（148）。measure-shell.js 本轮未改，149-GWT4 仍相等。
- **观察不动**：壳层报告每次带 `--write-report` 再生都差登入动画时长（N5 问题 4）；browser-proof 时长差在并发负载下不可比（N2 问题 5）。

### 3.3 授权外，不列返工

- 不放宽阈值：O-4 裁前 markText 照 ±1；O-19 裁前不改 C8 的判定、不给已全量检查的家族加豁免、不撤顶带登记；smoke、browser-proof 与各门的期望不放宽，不抬扫描上限。
- 不新增 token（R5-1 用现有的 `--tcrn-space-1`）；不改板、07a / 07b 字句与画布画法；不改 measure-shell.js；不改 Story 文字（O-14、O-20）。
- 不改批末 verify 的组成（O-18）；不声明也不绕过库门（S-1）；不推送、不打 tag、不发版、不部署、不发布画布。
- 不安装 Playwright WebKit，不开 safaridriver（安装与改宿主设置都是停点）。
- 不新增依赖与 package.json 脚本；自检写进已有的测试或门脚本。

### 3.4 按建议先做（判断自定，收口时回显，Owner 可事后更正）

1. **R5 不收口。** B4-1 违反 START 质量硬线（「违反即返工」），改法已知，只用现有 token，不改板、不放宽门，不属 A 类；主线程 M2 的「R5 无可做返工、建议收口」不采纳。
2. **B4-1 认定为 R4-3 同一修复目标的第一次退回**（按摘录）：R4-3 要的是该按钮不超出裁切祖先，SUB-216 按描边取 2px，只完成了描边。R5-1 起主力、单独成包，R5 再被退回交 Owner。B 片按新目标给的经济档不采纳，取它写明的另一支（认定同一目标就起主力）。
3. **R5-1 取 `--tcrn-space-1`，仍用 `overflow-clip-margin`**：它等于 `--tcrn-focus-ring` 的最大外扩，包里纸内焦点对已按「accent ring to space-1」读；只改一个值，展开动画几何不变。WebKit 支持与取值无关，不为它改走内距加负外距。
4. **B4-2 与 C4-1(a) 合为 R5-2，按 C-11 追加 M53**，不放开 M30 正文；开头区间与三份「By consumer」清单照 R3 判断 §3.4 第 6 条的同一范围放开。R5 的迁移条目只有 M53（R5-1 无条目）。
5. **A4-1 与 C4-1(b) 合为 R5-3**，并由它同步第 268 行、G-18 与 G-21；`owner-acceptance.md` 在 R5 只由 R5-3 改。
6. **C4-1(c) 进 R5-4**：只改注释，放经济包；SUB-219 由它承接，判据④归 0 后转 done。
7. **C4-2 不进 R5，记入收口已知差距。** 理由：不碰 147–150 任何判据；browser-proof 那处读回恒空，同一区域已由第 1683 行的 `legacyProductShellGlobalNavCount` 判红覆盖，geometry-proof 的死分支只是一条走不到的隐藏态分支，都放不过缺陷；它要改两份门脚本（门的结构调整，起主力），又不能与升档目标同包，R5 会变成三包，按摘录的小轮条件（实施包不超过 2 个）要多一次分片验收与单独判断，换来的只是代码整洁。照 R3 判断 §3.2 对门读法余项的同一处置，交这两份脚本的下一个持有者。
8. **同族余项都不进 R5**（全部进收口已知差距）：
   - N1 问题 4（`cutOf` 不认 clip margin）：被量的 story 都不在可折叠区内，R5-1 后也不在，不会出假红；改门的读法起主力。
   - 拆分问题 4（brandDigest 不量 DS、Mana 标按钮）：扩覆盖面，R3 判断已定不扩；验收用单测与静态全量路径比对补了证。
   - N2 问题 3（axe 不固定主区位置）：两次 violationCount 都是 0，豁免节点数不是判据；改它要动 browser-proof 并再生回执。
   - N2 问题 4（「根类全有家族」守护测试）：B §5 已追认本轮不加；现状 unattributed 0 已独立复核。
   - N3 问题 5（`.tcrn-segmented-nav` 白名单）：保留。它合 SUB-219「每项至少一条文档规则」，眼下不屏蔽任何发现，删不删都不改变读数；只有包以后再写这个类时它才会遮住重复选择器，交 shell-fidelity 的下一个持有者一并核。
   - N3 问题 6（G+ 禁形补 `--tcrn-color-acc-bg`）：不补。属收紧；现在包与文档层没有选中态用它（只有悬停与 Highlight），补了发现为 0，留给下一次改 selection-grammar 的单。
9. **措辞**按 §0 更正：R4 记录不回改，R5 起写「DS 品牌首行」。
10. **三片口径追认**：A §5、B §5、C §5 判「可接受」的全部照收（含 N1-1 至 N1-3、N2-1 至 N2-6、N3-1 至 N3-5 与读数更正、N4-1 至 N4-7、N5-1 至 N5-8，以及拆分问题 2、3、4 的默认）；B §5 N1 第 3 条（SUB-216 取 space-0h，「有条件」）的条件由 R5-1 满足。
11. **145 的注解**照拆分问题 5 的默认，写 SUB-212 与 SUB-221 承接的两处符合性已满足。
12. **R5 拆分约定**（由本判断定）：
    - 包名用 Q1、Q2（避开前四轮的 P、K、M、N）；Subtask 键号从 `TCRN-DS-SUB-225` 起；每张写改动文件与依赖。R5-1 挂 146，R5-2、R5-3 挂 150，R5-4 挂 147。
    - R5-1 单独成 Q1（主力，W1）；R5-2、R5-3、R5-4 进 Q2（经济，W2，Q1 合入后派，读 Q1 交回）。
    - `owner-acceptance.md`、迁移说明与 CHANGELOG 只由 Q2 改；`docs/verification` 只在 R5-1 写明的情形由 Q1 改，否则跑完按 C-9 还原。
    - Q2 改完跑 `pnpm scan`（它扫整棵工作树，KB-020）与读迁移说明、CHANGELOG、文档层的门（至少 scaffold:proof、readme:proof、public-output:scan、doc-shell:proof），交回写 owner-acceptance 改后的行号。
    - 局部门照 R4 拆分的写法（`corepack pnpm@10.12.1 -C <包树> …`）；`--filter … test` 前先 build（跨包通告第 1 节）。
    - 既有红照旧只回显「既有红，待 O-19 / O-4」，不修。

### 3.5 停点

- 推送、打 tag、发版、部署都不做，停在推送之前；画布与 F 段交设计会话发布。
- Owner 目视：136–150 加第一批，按 `owner-acceptance.md`；R5 新增 Disclosure 获焦焦点环（Safari 与 Chromium 内核各看一遍），由 R5-3 写进清单。
- 库门 S-1：声明 `verify` 之前，16 张 Story 与 INIT-015 的 13 张都不能转 done；两个 INIT 都等 Owner 目视后再转。
- 安装（可选）：Owner 要机读核 WebKit，需授权装 Playwright WebKit 或开 safaridriver；不授权就以 G-18 的 Safari 目视为准。

## 4. 链写计划（主线程一次 work-batch；summary 都已量过，均 ≤ 160 字节）

### 4.1 Subtask

R4 的 13 张现在都是 planned。下表 11 张转 done，走三步 ready → active → done；前两步的 summary 写「R4 包已合入集成分支，批末验收已出」（48 字节），第三步用表中的 summary。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-212 | work:8e732ee2e67d7b42d4aef8e2 | R4 验收满足：标按钮 data-logo 写标 id，共用模块 productMarkIdOf 不从入口导出，单测按 mark.id 断言 |
| SUB-213 | work:ae93813c0dce563b8b4c5a2d | R4 验收满足：paperFocusRing 在真件读到纸内滚动区 9 处、0 违规，阈值不变 |
| SUB-214 | work:82f09bcb41cd930ff0f679a5 | R4 验收满足：飞行标 data-logo 写标 id；DS、Mana 两例只在包内 test:dom（O-18） |
| SUB-215 | work:a0aff9314b16691a037daa49 | R4 验收满足：families.json 补登 9 个根类，未归属 9→0，测试 74/74；C8 仍 15 条（O-19） |
| SUB-217 | work:38ebef7ceb848b71f55bcdcc | R4 验收满足：截图松开裁切并复原，216 张尺寸不变、顶带不压 story，高 story 自检 154/154 |
| SUB-218 | work:c4a845b4c131caa452643cfd | R4 验收满足：展开标题左边条与左内距删除，只剩 chevron 旋转，37 页扫描本 INIT 范围 0 处 |
| SUB-220 | work:52bb9a535065ac21d148a6af | R4 验收满足：smoke 空读回删除，AOS 无人读字段删 4 个，G+ 禁形自检过、新发现 0 |
| SUB-221 | work:57bdf706c17216f559219e6f | R4 验收满足：storybook-map.json 与 md 逐格一致，7aa0f5 0 处，DIFF-10 写现行 |
| SUB-222 | work:8adff1d941c878ae738935c2 | R4 验收满足：弃用提示只跳产物目录，src/build 照扫（69 个文件 0 旧名），用例 7/7 |
| SUB-223 | work:eee95efe1077fb4b618b7620 | R4 验收满足：README 图标 38 并列 pin，迁移开头与分消费方清单补齐，追加 M49–M52；M30 另立 R5-2 |
| SUB-224 | work:ce8eae29fa656c48f8938945 | R4 验收满足：按新截法重收 169 条、回归 0，回执均 <1MB，清单改第四轮读数；清单余项另立 R5-3 |

下表 2 张保持，走两步 ready → active，两步用同一 summary。

| Subtask | id | summary |
| --- | --- | --- |
| SUB-216 | work:fc422bdf469d7f7fdc966381 | R4 部分满足：描边画出，获焦焦点环底与起始边仍裁 2px；R5 承接 R5-1（升主力） |
| SUB-219 | work:4faddab0a4c1b0c5e65acde1 | R4 部分满足：判据④余 doc-shell-class-proof.mjs:147 注释串；R5 承接 R5-4 |

R1–R3 留下的 9 张 active 承接的都是 Owner 项，R4 没有一张满足，不写转态：113 → O-19（135-GWT4）、114 → O-8（136-GWT3）、125 → O-19（R3-8）、127 → O-4（145-GWT2）、137 → O-4（真件 18 门）、142 → O-19（判据含 contract:static 退出 0）、155 → O-19（R3-8）、178 → O-19（判据⑥）、191 → O-19（判据④）。引擎有 Subtask 注解入口就同批写「R4 后仍只等 Owner：O-n」，没有就不写。

本批 Subtask 成员共 37 个（11 × 3 + 2 × 2）。

### 4.2 Story 不转 done

16 张都保持 active（库门为 0，引擎拒绝 Story 转 done），只写注解。不开 `--fixes` Story；R5 返工由 R5 拆分建新 Subtask，挂原 Story（R5-1 挂 146，R5-2、R5-3 挂 150，R5-4 挂 147）。

### 4.3 Story 注解 summary

| Story | id | summary |
| --- | --- | --- |
| 135 | work:1ad3c63c6fe6468a9d553758 | R4 阻于 Owner：GWT1–3 满足；GWT4 contract:static 只剩顶带 C8 15 条（O-19），同 R3。库门 0 |
| 136 | work:73563c973ba4945683fbb15f | R4 阻于 Owner：GWT3 夜间后缀 3.07 待 D7（O-8）；标按钮 data-logo 已写标 id（SUB-212）。库门 0 |
| 137 | work:b8e05fe98dd99b6b0da62493 | R4 机判满足：本轮无改动，读数同 R3，无回退。库门 0 |
| 138 | work:3d8ec5e9bbaaa3623c3315c8 | R4 机判满足：GWT 全过；硬线读数底栏 TMS 锁定块 en 墨迹 1.7 只等 O-4。库门 0 |
| 139 | work:09e0986c769bddf72859897f | R4 机判满足：读数同 R3；DOM 用例只有包自报（O-18），O-3 待裁。库门 0 |
| 140 | work:e14a7f089a9cac4c7da39d52 | R4 机判满足：纸内焦点探针真件 9 处 0 违规（SUB-213）；文档壳卡片盖环进目视。库门 0 |
| 141 | work:e2def1cb6cee96bcde0ea937 | R4 机判满足：飞行标 data-logo 写标 id（SUB-214）；DS、Mana 两例只有包内 test:dom。库门 0 |
| 142 | work:27344937d9f099034b0c773e | R4 机判满足：读数同 R3，无回退；O-5、O-6 待裁。库门 0 |
| 143 | work:1b03f6ae2b1a9e080fde1432 | R4 阻于 Owner：GWT 全过，未归属根类 9→0（SUB-215）；C1–C17 只剩 C8 15 条（O-19）。库门 0 |
| 144 | work:14b2761d4ff9e55b90cd110e | R4 机判满足：读数同 R3；Story 写全屏 Sheet 与板不符（O-20）。库门 0 |
| 145 | work:f19ca0b68e52842e947dcafc | R4 阻于 Owner：data-logo 一种取值、map.json 两主题同色已满足；GWT2 DS 首行 1.4（O-4）。库门 0 |
| 146 | work:792b63bc73100197f6f41e96 | R4 部分：GWT1–4 满足，描边画出；获焦焦点环裁 2px 进 R5-1（主力）；几何门差 markText（O-4）。库门 0 |
| 147 | work:6fd15b4e5366871194d862ab | R4 机判满足：左边条、截图盲区、死类都已收；注释残串进 R5-4，门脚本空读回记收口差距。库门 0 |
| 148 | work:bad748579e7b1b7f0773bd53 | R4 阻于 Owner：GWT2–4 满足，map.json 与 md 同源（SUB-221）；GWT1 五块待 O-2。库门 0 |
| 149 | work:854cd021e8bb869b2b585fe0 | R4 阻于 Owner：真件 18 门 17 过、变异 22/22；verify 红 13（O-19）与 18（O-4），同 R3。库门 0 |
| 150 | work:b140305693da159bfdc615c8 | R4 机判满足（判定人 Owner）：README 38、迁移 M49–M52、基线重收；M30 与清单文字进 R5-2、3。库门 0 |

### 4.4 INIT-016 注解要点

- summary：「R4 判断：机判满足 9、部分 1、阻于 Owner 6；R5 返工 4 条（主力 1、经济 3）两包；Owner 待裁 20；库门 0」，132 字节。
- 正文要点：批末 verify 682fc94 红 2 / 2，与 R3 相同，都只等 Owner（C8 → O-19，markText → O-4，DS 品牌首行 1.4、底栏 TMS 锁定块 en 1.7）；R4 的 13 张 Subtask 11 张 done、2 张由 R5 承接；B4-1 是 START 硬线、R4-3 同一目标第一次退回，R5-1 升主力单独成包；文档残余进 R5-2 至 R5-4；C4-2 与同族门读法余项记收口已知差距；R5 两包，验收与判断按小轮合并；验收与判断路径 `runs/r4/acceptance/`、`runs/r4/judgment.md`；停点不变。

### 4.5 知识卡

`runs/r4/lessons.json` 5 条，接 TCRN-DS-KB-041；主线程逐条 knowledge-capture 并读回（需要时加 `--allow-trailing`），被预算拒绝的记阻塞。

1. 为「不超出裁切祖先」派返工，判据要写全元素的外扩绘制，只写看到的那一笔会按它取最小值。
2. 引入 overflow-clip-margin 前要核两件事：门的裁切模型认不认它，WebKit 认不认它。
3. 视觉基线只换越容差的条目：整批换截法后，容差内的条目仍是旧截法的签名。
4. 迁移说明里抄写的登记计数没有门看守，只改登记的单也会让它过期。
5. axe 回执里的豁免节点数随主区滚动位置变，跨轮比它会误读。

### 4.6 不在本次链写内

Story 与 INIT 的转态、INIT-015 的 13 张（库门为 0）；R5 新 Subtask 的建单（由 R5 拆分负责）；Owner 待裁项与库门声明。本轮不写纪要。

## 5. R5 规模与分包建议

| 包 | 档 | 返工项 | 前置 | 预计响应 |
| --- | --- | --- | --- | --- |
| Q1 | 主力 | R5-1 | 无 | 70 |
| Q2 | 经济 | R5-2、R5-3、R5-4 | Q1 | 45 |

- **小轮合并适用**（实施包 2 个）：R5 拆分派一个经济档代理（只拆 4 条，约 30 响应）；W1 派 Q1，合入后 W2 派 Q2；全部合入后主线程跑一次批末 verify（`tools/batch-end-verify.sh 5`）与 `storybook:build`；之后派一个主力档代理一次完成 R5 验收与判断，照原格式写验收、判断与 lessons 三份文件，并顺带写出下一轮的拆分文件（判断有返工时）。
- **规模**：实施约 115，拆分约 30，合并验收与判断约 150，整轮约 300 响应（R4 约 900）。关键路径 Q1 → Q2 → 批末 verify。
- **风险**：
  - R5-1 让个别签名越容差（预计没有）：Q1 包内按 KB-022 处理，离群进 R5-3 的第五轮目视节。
  - Safari 不认 `overflow-clip-margin`：机读不到，靠 G-18 目视（§3.2）。
  - Q2 在 owner-acceptance 里插行会让本判断引用的行号错位：按内容定位，交回写新行号（KB-024）。
  - R5-1 再被退回：停下，记入收口文件交 Owner（§3.1 条件项）。
- O-19、O-4 若在 R5 拆分前裁定：各按 §3.1 的改法单独成一个主力包（C8 约 25、markText 约 40），与 Q1 同在 W1（守并行上限 3）；R5 的实施包随之变成 3–4 个，小轮合并不再适用，验收按 Epic 分片、判断单独派。
- **R5 做完后预计只剩的 Owner 阻点：**
  - O-19（verify 第 13 步；135-GWT4、143 符合性 C1–C17、149-GWT2）；
  - O-4（verify 第 18 步；145-GWT2、146「几何门全绿」、138 与 145 的硬线读数、149-GWT1、GWT2）；
  - O-8（136-GWT3）；O-2（148-GWT1）；O-20（144 的 Story 文字）；
  - 库门 S-1（16 张 Story 与 INIT-015 的 13 张的 done）；Owner 目视（含 Disclosure 焦点环的 Safari 复看）；推送、打 tag、发版、部署；画布与 F 段发布；
  - 其余待裁 O-1、O-3、O-5 至 O-7、O-9 至 O-18 不挡机器判据。
- 届时 R5 合并判断若没有新的可做返工，应写「R6 无返工、建议收口」；收口文件除 START「收口」节所列各项外，附 §3.2 的收口已知差距清单与本轮 §3.4 的按建议先做各条。
