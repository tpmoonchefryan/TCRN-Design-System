# R3 判断 · TCRN-DS-INIT-016（STORY-135 至 150）

节行号：§0 L5；§1 L18；§2 L41（A L45、B L71、C L89、D L112、E L124、2.6 L136）；§3 L159（3.1 L161、3.1.1 L186、3.2 L194、3.3 L204、3.4 L212、3.5 L241）；§4 L247（4.1 L249、4.2 L332、4.3 L336、4.4 L357、4.5 L362、4.6 L372）；§5 L376

## 0. 依据与判断补查

- 依据：三片验收；主线程问题 M1–M4（按摘录更正）；拆分问题 16 条；11 份包问题；跨包通告；批末 verify（c45c529：30 步红 2、44 段红 2）；R2 判断 R3-8、R3-10、R3-28 原文与 §3.1、§3.4、§4.1；R3 拆分 §1、§2；START「质量硬线」「模型与子代理」；链上 Story 正文；`owner-acceptance.md` 第 282–343 行。没跑门、没构建、没写链；只读跑过 `status`、`work-list`、`knowledge-list` 各一次（库 version 2228，R3 开工后无写入）。
- 只读补查（scratch `judge-r3/`）：
  1. 13 log 摘要 `"C8": "red (15 findings, 0 exempted)"`，其余条款 green。18 条是 M2、M4 的包时读数，M9 退役三个 collapsed 变体后少了 3 条。
  2. C8 属 START「第一批的 C1 至 C17 继续有效」。`clauses.md` 第 106–121 行：让步项要有非零 min-width，渲染出的工具栏要恰有一个让步项；第 115 行写「壳层家族属第二批，全量检查，不豁免」。
  3. `contract-static-proof.mjs:238`：checkedBatches 里的家族不得豁免。shell 族在 `[1, 2]` 里，分片 A 方案一（`exemptions.json` 加 C8 豁免）会被判为无效豁免；要落地得先改校验，那本身就是放宽。
  4. 板 `shell-screen.mjs:59` 写 `.ts-pins{…min-width:0;flex:0 1 auto}`；板上每块屏都有固定项，没有「无固定项的壳」的画法。
  5. `tcrn-collapsible-region`、`tcrn-disclosure-panel` 在 layout 族（第 2 批），C3-5 属本 INIT 的家族。
  6. 件数 37：R2 点名的 matrix-stories:520、icon-roster:1、契约 README:51 已改；只剩 `packages/ui-react/README.md:267、272`，R2、R3 都没点名。`storybook-map.json` 第 33、123 行仍是旧值，R3-28 的文件表只列了 md。`docs/contract/README.md` 第 11 行已由 M10 改（M2 问题 4 已解决）。
  7. ShellBrandButton 把产品键交给 TcrnBrandMark（第 84 行），`ShellIntro.tsx:336` 直写 `data-logo={productId}`；`productMarkIdOf` 是 `Navigation.tsx:343` 的模块内函数。
  8. 链上：R3 的 34 张都是 planned；R2 done 24、active 13；R1 done 11、active 17。active 的 R1、R2 Subtask 里，判据含 contract:static 退出 0 的是 113、142，含 145-GWT2 墨迹的是 127，含真件 18 门的是 137，含夜间后缀 ≥ 4.5 的是 114。

## 1. R3 结论表

| Story | 验收结论 | 机器判据是否已满足 | 未满足的阻点类别 | R4 返工项 | Owner 目视项 |
| --- | --- | --- | --- | --- | --- |
| 135 壳 token | 阻塞于 Owner | 否：GWT4 contract:static 只剩顶带 C8 15 条；GWT1–3 满足 | 只有 Owner 能定（O-19） | 无 | 无 |
| 136 标按钮 | 阻塞于 Owner | 否：GWT3 夜间后缀 3.07（D7）；符合性里标按钮 data-logo 仍是产品键 | Owner（O-8）；data-logo 可返工 | R4-1 | 两版、hover / open、390、长字标（O-1） |
| 137 固定项 | 满足（机器判据） | 是；GWT3 本轮第一次在文档页实测 | 无 | 无 | 固定项、选中态、1023 的「已固定」分组 |
| 138 完整菜单 | 满足（机器判据） | GWT 全满足；硬线「标旁文字中线」底栏锁定块 en 1.7 | Owner（O-4，硬线读数） | 无 | 菜单与底栏锁定块、⌘K 只开一个壳 |
| 139 下拉与级联 | 满足（机器判据） | 是；三条 DOM 用例只在包内跑（O-18） | 无（O-3 不挡机判） | 无 | 下拉与级联（O-3） |
| 140 ProductShell | 满足（机器判据） | 是；门侧的纸内焦点探针在真件上读数为 0 | 门侧覆盖可返工 | R4-2 | 顶带壳、铃铛 6%、拖排与产品切换、纸内焦点环（文档壳底边被卡片盖住，§3.2） |
| 141 登入动画 | 满足（机器判据） | 是；飞行标 data-logo 仍是产品键 | 可返工（符合性） | R4-1 | 登入动画 |
| 142 图钉 | 满足（机器判据） | 是 | 无（O-5、O-6 不挡） | 无 | 图钉三态、菜单与 Sheet 行图标盒 |
| 143 导航家族 | 部分 | 否：C1–C17 余顶带 C8 15 条；家族表漏登 9 个根类 | Owner（O-19）；家族表可返工 | R4-4 | Tabs 五形、面包屑分隔图标、TreeNav 在下拉、菜单外禁用原因换行 |
| 144 手机 Sheet | 满足（机器判据） | 是；Story 文字与板不一致 | Owner（O-20，只改 Story 文字） | 无 | 手机 Sheet（O-15） |
| 145 首行变体 | 部分 | 否：GWT2 DS 首行 1.4；符合性 data-logo 两种取值、`storybook-map.json` 旧值 | Owner（O-4）；其余可返工 | R4-1、R4-8 | 八枚首行两尺度（zh-CN 已与 en 同） |
| 146 PageHeader | 部分（判断改挂 R4-3） | GWT 全满足；「几何门全绿」只差 markText；layout 族 Disclosure 描边被裁（硬线） | Owner（O-4）；硬线可返工 | R4-3 | 纸内页头、设置页 1040、SplitView、目录 h2、Disclosure 描边（G-18） |
| 147 文档壳 | 部分 | GWT1–4 满足；禁用清单「左边条」；骨架死规则；视觉签名截图盲区 | 可返工 | R4-5、R4-6、R4-7 | 文档站整体、展开故事标题（R4-6 后） |
| 148 五样板 | 阻塞于 Owner | 否：GWT1「五块」对四板 D 段加 07a 第 1 段；GWT2–4 满足 | Owner（O-2）；map.json 同步随 R4-8 | R4-8 | 四板 D 段（发布后） |
| 149 壳层门 | 阻塞于 Owner | 否：GWT1 真件 17/18（markText）；GWT2 verify 红 13 与 18 | Owner（O-4、O-19） | 无 | 无 |
| 150 4.0.0 候选 | 满足（机器判据；判定人 Owner） | GWT1–4 满足；README 件数、迁移说明开头与分消费方清单、截法变更后的基线待做 | 可返工（文档质量与再生） | R4-8、R4-9 | 清单；离群项（R4-9 重收后） |

结论：机判满足 8、部分 4、阻塞于 Owner 4（R2 为 4 / 10 / 1，另 1 张不满足）。146 由分片 B 的「阻塞于 Owner」改为「部分」：C3-5 的 Disclosure 属 layout 族，挂到 146（§0 第 5 条）。批末 verify 只剩两步红，都只等 Owner：第 13 步 C8 15 条（O-19）、第 18 步 markText 两处读数（O-4）；M4 与 steps.md 的「18 条」「只有 1.4」以本判断为准。R4 有可做返工 9 条，含两条硬线，不收口。

## 2. R4 返工清单

共 9 条，5 组，一组一包，全部是 R3 新发现的目标。仍不满足而只能交 Owner 的只有 C8（135-GWT4 同一目标第三轮：R2-12 → R3-6，加 R3-8 的登记）与 markText（O-4 待裁），都不进 R4。同一根因已合并：A3-1、B3-1 → R4-1；B3-3、C3-3、C3-4 → R4-8。R4 的项再被退回时按 START「起始档与升档」：经济档升主力，主力档交 Owner。

### 组 A 包件与几何门覆盖（M1，经济）

**R4-1 · 标按钮与登入动画的 data-logo 改写标的 id**（经济；新）
- 来源：A3-1、B3-1、M4 问题 4、owner-acceptance G-20。
- 现象：SUB-194 后首行与被量锁定块写标的 id，ShellBrandButton（经 TcrnBrandMark）与 ShellIntro 仍写产品键；文档壳标按钮在构建页写 `data-logo="design-system"`，同页首行写 `ds`。TMS 两键相同所以门不红；DS、Mana 的标按钮一旦被量，brandDigest 找不到源。
- 证据：A §3 A3-1；B §3 B3-1（acc/40-docbrand.txt）；`ShellBrandButton.tsx:84`、`ShellIntro.tsx:336`、`Navigation.tsx:343、641、728`。
- 改法：两处 data-logo 都写标的 id，取法同 `productMarkIdOf`（抽到 Navigation 目录内的共用模块，不从 index 导出）；SVG 仍按产品键取源。`ShellBrandButton.test.tsx:79` 改按 `mark.id` 断言，ShellIntro 单测加 DS、Mana 两例。壳层门覆盖不扩。迁移条目（M42 末句不再成立）写进交回，由 R4-8 追加。
- 文件：`packages/ui-react/src/components/Navigation/{ShellBrandButton,ShellIntro,Navigation}.tsx`、新共用模块、`ShellBrandButton.test.tsx`、`ShellIntro.test.tsx`。依赖：无。
- Story：136-GWT2 与硬线「品牌资产 digest」；141-GWT4；145 符合性（同一属性只有一种取值）。

**R4-2 · focusRingClipInPage 在真件上读到纸内滚动区**（经济；新）
- 来源：A3-2、M3 问题 6。
- 现象：SUB-182 把纸内滚动区纳入了探针，夹具红绿成立；但 STORY_PROBES 只在没有 ProductShell 的 actions-matrix 上跑它，真件 regions 为 0，纸内焦点环回退了门也看不到。
- 证据：18 log:7240；`scripts/geometry-measure-proof.mjs:138、161、356`。
- 改法：STORY_PROBES 加一个带 ProductShell 的 story（默认 ts-closed-l 所在的 shell-top-band，拆分 grep 核实 id），判定与阈值不变；测试断言真件上 regions ≥ 1 且通过，读不到就记问题。跑完按 C-9 还原。
- 文件：`scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`。依赖：无。
- Story：140（SUB-182 ③ 的真件读数；硬线「焦点可见」）。判断认定 SUB-182 的判据③字面已满足（探针纳入、夹具红绿），本条是新的覆盖面目标，不按「同一目标」交 Owner。

**R4-3 · Disclosure 展开区按钮的底边描边被裁**（经济；新；硬线）
- 来源：C3-5、M11 问题 2、G-18。
- 现象：`interaction-disclosure-spec` 展开区的次级按钮「Focusable only while expanded」用外扩 1px 的 box-shadow 画描边。按钮底与 `.tcrn-collapsible-region__inner`（overflow hidden、padding-bottom 0）的底重合，1440、1024、390 三个视口的底边线都被裁掉。违反 START 硬线「任何元素不超出裁切祖先」。
- 证据：C §3 C3-5（probe4b.out）；`packages/ui-react/src/styles/base.css.ts:2393–2396`；`Layout.tsx:49–61`。
- 改法：区域内层在块向末端留出描边宽度，二选一：现有 token 的 padding-block-end，或 `overflow: clip` 加 `overflow-clip-margin`，取不改展开动画几何的那一种。按钮描边画法不改；没有合适的现有 token 就停下记问题（不新增 token）。在 Layout 现有单测里断言内层的块向末端留白；该 story 的视觉签名由 R4-9 重收，进 Owner 目视。几何门不改。
- 文件：`packages/ui-react/src/styles/base.css.ts`，Layout 现有单测文件。依赖：无。
- Story：146（layout 族在纸内的几何；硬线）。

### 组 B 契约登记与视觉签名门（M2，主力）

**R4-4 · families.json 补登本 INIT 新增的根类**（主力；新）
- 来源：B3-2、M2 问题 3、B §5 M2-5 的条件。
- 现象：navigation 族缺 `tcrn-nav-item-row`、`tcrn-nav-pin`；shell 族缺 `tcrn-shell-cluster`（C8 登记的固定项）、`-account`、`-avatar`、`-bell`、`-sheet`；inputs 族缺 `tcrn-date-picker-wrap`、`tcrn-select-wrap`。这些类的发现记 unattributed，照查不放宽，但按家族筛选、计数与 roles.json 的家族断言都会漏掉它们。
- 证据：B acc/43-families.txt；`scripts/contract-static-proof.mjs:277`；`tests/contract-static-proof.test.mjs` 第 580–583 行。
- 改法：9 个类各登进所属族的 blocks（inputs 两类只登记、不改组件）；测试把「容器与让步项在 shell 族」扩到固定项。跑 contract:static、contract:proof、doc-shell:proof，确认只改了归属：C8 仍是 15 条，其余条款仍为 0。出现新发现就逐条记问题，不改组件、不加豁免。
- 文件：`docs/contract/families.json`、`tests/contract-static-proof.test.mjs`。依赖：无。
- Story：143 符合性（C1–C17 的家族表完整）、140。

**R4-5 · 视觉签名截图不受纸的滚动裁切**（主力；新；门的截法，属收紧）
- 来源：C3-2、M11 问题 1、G-17。
- 现象：story 在文档壳的纸内滚动区里，`locator.screenshot` 对比视口高的 story 只绘出纸内可见的约一屏，其余是画布底，顶带固定项行压在 story 上缘；44 张桌面截图高于 900。217 条基线按此收下，纸外内容改了门不红。盲区由 147 换壳造成。
- 证据：C §2.1 与 shots-dim.txt；`docs/verification/internal-alpha/screenshots/desktop-1440x900-i18n-theme-contract.png`（1040×1807，上下各约 450–490 为空）。
- 改法：截图期间让被截 story 不受纸的裁切：默认临时把纸与主区改为高度随内容、overflow visible，把顶带移出截图区，截完还原并断言样式与滚动位置复原；若因此改变了 story 版式宽度，改用纸内分段滚动截取再拼接。阈值、签名算法与选择机制不改。门脚本内加自检：高于纸可见高的 story，截图下半部不得是整片画布底（本仓没有 browser-proof 的独立测试文件）。本条不重收基线（R4-9 一次重收）；回执守住 1,000,000 字节（KB-028）。
- 文件：`scripts/internal-alpha-browser-proof.mjs`（截图段），必要时 `scripts/lib/visual-signature.mjs`。依赖：无（R4-9 依赖本条）。
- Story：147（视觉签名的覆盖面）、150（SUB-211 基线的代表性）。

### 组 C 文档站与文档层的门（M3，主力）

**R4-6 · 文档页展开故事标题的 3px 强调色左边条**（改动属经济级，随 M3 主力包；新；硬线）
- 来源：C3-1、M8 问题 3。
- 现象：`article[data-story-collapsed="false"] > .tcrn-doc-story-disclosure__heading` 画 `box-shadow: inset 3px 0 0 var(--tcrn-color-acc)`，并加 padding-left。这属于 START 禁用清单里的「左边条」。selection-grammar 只看选中类标记，所以门是绿的。
- 证据：C probe2-sum.txt BAR（展开后读到 3px 强调色内阴影与 10px 左内距，收起时 none）；`alpha-styles.ts:237–240`。
- 改法：删掉 box-shadow 与随它加的 padding-left，展开态由 chevron 旋转表达。这是可见变化：签名由 R4-9 重收，Owner 目视加「展开故事标题无左边条」一项。
- 文件：`apps/storybook/src/alpha-styles.ts`。依赖：无。
- Story：147（START 硬线禁用清单）。

**R4-7 · 文档层的死规则与四道门的过期口径**（主力；新）
- 来源：C3-6（M8 问题 1、2，M9 问题 5，M6 问题 5）、M8 问题 4、5。
- 现象：
  - (a) 6 个文档层类没有写入处：`alpha-styles.ts:166、182` 的 eyebrow、claim；`story-demo-styles.ts:563–644` 的 `.tcrn-doc-brand`（连同两条放置规则）与 search-results、-result、-empty（`storybook.css` 是生成副本）。属 147「删 tcrn-doc- 骨架的壳层部分」的余项。
  - (b) `shell-fidelity-proof.mjs:102、103、107、108、115` 五项白名单无规则以它为主题，第 110–113 行注释写已退役的类。
  - (c) `storybook-smoke.mjs` 约第 1782、2392 行读退役的侧栏区与切换钮，读回恒空、不判红。
  - (d) 两份 AOS 视觉实例的 `searchLabel` 等 5 个文案字段无人读。
  - (e) `selection-grammar-proof.mjs:66–67` 两条禁形只按弃用名匹配，第 151 行语法文字也是弃用名，G+ 名写的同类选中态查不出。
  - (f) `token-deprecation-notice.mjs:28` 按目录名跳过 `build`，把源码目录 `apps/storybook/src/build` 一起跳过。
- 改法：(a) 与随之无用的 (b) 同一提交删，同步 `docs/style-scale.md`，demo-styles:sync 按 build、sync、build 跑（KB-019）。(c) 删空读回，或改为「已退役件不存在」的反向断言。(d) 删字段。(e) 禁形加 G+ 名（`--tcrn-color-acc`、`-acc-2`、`--tcrn-shadow-s3`），改语法文字，自检补 G+ 写法判红。(f) 只跳产物目录（按相对路径），测试补一个 `src/build` 样本被扫到。删前 grep 全仓消费者（KB-015、KB-027）。(e)(f) 跑出新发现只记问题，不改组件、不放宽。
- 文件：`apps/storybook/src/{alpha-styles.ts,story-demo-styles.ts,storybook.css}`，`apps/storybook/src/contract-stories/visual-instances/aos-{frontend-shell-slice,owner-quality-product-shell}.tsx`，`scripts/{shell-fidelity-proof,storybook-smoke,selection-grammar-proof,token-deprecation-notice}.mjs`，`tests/token-deprecation-notice.test.mjs`，`docs/style-scale.md`。依赖：R4-6（同一文件，包内先做）。
- Story：147（骨架余项、文档层的门）、150（构建弃用提示的覆盖面）。

### 组 D 文档同步（M4，经济）

**R4-8 · 映射机读件、图标件数、迁移说明开头与分消费方清单**（经济；新）
- 来源：B3-3、C3-3、C3-4、M10 问题 1 与 4、M8 问题 6、G-21；本判断 §3.4 第 4、7 条的两句说明。
- 现象：
  - (a) `storybook-map.json` 第 33 行 `refs.O-3` 仍把夜间 TMS #7aa0f5 写成现行，第 123 行 DIFF-10 是旧值，refs 没有 SHELL-D2、D7；md 第 3 行写「两份同源」。
  - (b) `packages/ui-react/README.md:267、272` 写 37 个图标名，名册是 38。
  - (c) `docs/migration-4.0.md` 第 6–7 行仍写第二批是 M20 到 M29，第 24–29 行来源只指 r1；「By consumer」三份清单没有 M29 以后的条目。
- 改法：(a) 把 md 第 33、36、38、138 行原样搬进 json，跑 storybook:visual-proof 与其测试，differencesPendingOwner 不变。(b) 改 38 并指向 M25。(c) 放开 C-11 对这两段的「只追加」：开头改为第二批 M20 起至本轮末号，来源补 r2、r3、r4；三份清单按条补步骤（landmarkLabel 与 menuShortcut、按 data-logo 选标、TocRail headingLevel、AI 契约改名 M47 等），M1–M48 正文不动。(d) 从 M49 起追加各包交回的迁移条目，另加两句：AOS 视觉实例 id 的 expanded 是历史名；`menuShortcut={false}` 的壳仍按板画快捷键提示（README 壳控制段同写）。CHANGELOG 摘要同步。
- 文件：`docs/design/gplus-2026-10/storybook-map.json`、`packages/ui-react/README.md`、`docs/migration-4.0.md`、`CHANGELOG.md`。依赖：M1、M2、M3（收齐它们的迁移条目）。
- Story：145（两主题同色的机读件）、148（映射两份同源）、150-GWT2（迁移说明好用）。

### 组 E 收尾（M5，主力）

**R4-9 · 批末生成物再生与清单校正**（主力；新；SUB-211 在本轮的对应）
- 来源：R4-3、R4-5、R4-6、R4-7 带来的可见变化与截法变化；三片与摘录的读数更正；本判断新增的 O-19、O-20。
- 改法：其余各包合入后，在同一构建上做：
  - ① 按 R4-5 的新截法整批重收视觉签名基线。选择文件逐条注明「截法变更」或所属 R4 项；A 类离群（maxCell > 40）逐条写理由，列为 Owner 目视项。写入前先给上一份记录文件改名（KB-022）。
  - ② 一次再生几何、壳层门报告、映射、契约与 API 清单，以及 internal-alpha 回执。
  - ③ 改 `owner-acceptance.md`：G-16 改为 15 条并写明 O-19；第 329 行 O-4 的「唯一挡住批末 verify 归 0 的项」改为与 O-19 并列；待裁表补 O-19、O-20；G-17、G-18、G-20、G-21 改写本轮处置；目视项补 R4 新增的三类（展开标题无左边条、Disclosure 描边、截法变更后的离群项）。
  - nonVisualProofOk 为假就停在①。
- 文件：`docs/verification/**`、`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`。依赖：M1 至 M4。
- Story：150（清单与基线）、147，以及 149-GWT2 的证据。

### 2.6 对照：R3 问题 → 处置（同一根因只列一处）

| 来源 | 处置 |
| --- | --- |
| A3-1、B3-1、M4 问题 4、G-20 | R4-1 |
| A3-2、M3 问题 6 | R4-2 |
| C3-5、M11 问题 2、G-18 | R4-3 |
| B3-2、M2 问题 3 | R4-4 |
| C3-2、M11 问题 1、G-17 | R4-5 |
| C3-1、M8 问题 3 | R4-6 |
| C3-6（M8 问题 1、2，M9 问题 5，M6 问题 5）、M8 问题 4、5 | R4-7 |
| B3-3、C3-3、C3-4、M10 问题 1、4，M8 问题 6，G-21 | R4-8 |
| 生成物再生与清单 | R4-9 |
| C8：A §4 第 1 条、B §4 ①、C §4、M2 问题 1、2，M4 问题 3，主线程 M4，G-16 | O-19（§3.1.1） |
| markText：M1 问题 3、M7 问题 8、M11 问题 4、主线程 M4、G-15 | O-4（补 1.7） |
| B §4 ③ Story 144 的 Sheet 文字 | O-20 |
| A §4 第 4 条、M4 问题 6（⌘K 提示） | §3.4 第 4 条（保持现状） |
| M11 问题 3（基线机制无删除） | §3.4 第 7 条（一次性处置） |
| M1 问题 4（label-plus-40 取法） | §3.4 第 7 条（追认） |
| M1 问题 5、6，M2 问题 5，M3 问题 9，M4 问题 5、7，M5 问题 7、8，M7 问题 5、6，M9 问题 2、3、4、6、7，拆分问题 14 | §3.2 知悉 |
| 拆分问题 13 | O-18（沿用） |
| 各包「既有红」（M1 问题 1、2，M3 问题 1–5，M4 问题 1–3，M5 问题 2–6，M6 问题 1–4，M9 问题 1）；主线程 M2、M3；M2 问题 4；M5 问题 1、M7 问题 1–4（M9 附录）；M10 问题 2、3；M3 问题 7、8；M4 问题 8；拆分问题 1–12、15、16 | 批末已转绿、已解决或按默认执行，判法见 §3.4 |

## 3. 只有 Owner 能定的事项

### 3.1 待裁（沿用 O-1 至 O-18，本轮新增 O-19、O-20）

| # | 事项 | 建议 | 不裁时的默认 | 裁定后的改法与规模 | 挡住 |
| --- | --- | --- | --- | --- | --- |
| O-19 新 | **顶带的 C8 让步项**（15 条：静态 `yield-without-min-width` 1 条、story 层 `story-yield-missing` 14 条）。详见 §3.1.1 | 选甲：裁定「顶带按板」，即让步项可收到 0、没有固定项时可以缺省；登记保留 | 门照判：contract:static 红；登记保留；SUB-113、125、142、155、178、191 保持 active | 甲：roles.json 顶带一项加两个字段，门的 C8 静态层与 story 层读取，clauses.md 写明，两条自检；主力约 25。乙：见 §3.1.1 | verify 第 13 步；135-GWT4；143 符合性 C1–C17；149-GWT2 |
| O-4 | 墨迹中线遇下行字母。现有两处读数：DS 首行 `lkr-line@22:design-system` 1.4（en、zh-CN 相同）与底栏 TMS 锁定块 `lkr@22:tms` en 1.7（ts-x-l、ts-x-n、ts-search-l、ts-narrow-x-l 与 shell-matrix 两格；zh-CN 1.0 过）。R3 已消 zh-CN −1.1。它和 O-19 一起挡 verify，不再是唯一一项 | ±1 改为量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量是 0.6） | 照 ±1 判，markText 红 | 门库与 measure-shell.js 同改，补夹具与变异，主力约 40；改后 DS 仍 > 1 就再交 Owner | verify 第 18 步；145-GWT2；146「几何门全绿」；138、145 的硬线「标旁文字中线」；149-GWT1、GWT2；D 段「标按钮（v2）」 |
| O-20 新 | Story 144 的标题写「一段即开全屏 Sheet」，Assumptions 写「假定 Sheet 全屏、从顶带下方升起」；板 `shell-screen.mjs:119` 的 `.ts-sheet` 是自底升起、最高 84%，包件照板（ts-m-s 盒 top 364、高 480） | 同 O-14：按板改 Story 文字，不改实现 | 实现照板，Story 文字不准 | 只改链上 Story 正文 | 无（Owner 目视手机 Sheet） |
| O-1 | 长字标放不下（要 117，格 60，D1 定宽 134） | 宽度至少 134、随字标加宽，07b 补长名屏 | 截断加 title | 改宽度规则与 brandGeometry 期望，主力约 40 | 无（目视） |
| O-2 | 148-GWT1「五块」对四板 D 段加 07a 第 1 段 | 接受，注解写明读法 | GWT1 记部分 | 接受只写注解；要 Brand D 段约 60 | 148-GWT1 |
| O-3 | 级联越过视口右缘 | 越界就向左展开 | 现写法 | 改下拉定位与用例，主力约 40 | 无 |
| O-5 | Icon 板「禁填充」与 pin 实心态冲突 | 加例外，补画实心态 | 只改件数 | 画板、重生，约 30 | 无 |
| O-6 | 触摸端未固定的图钉平时不显 | 粗指针下常显 ink-3 | 获焦才显 | 改粗指针规则，约 20 | 无 |
| O-7 | 文档站默认头像；目录宽 144 | 接受现状 | 现状 | 无 | 无 |
| O-8 | 夜间后缀 3.07 / 3.13 / 3.33（D7） | 随 S-6 一并裁 | 两主题同色、标红、pending | 改 token、矩阵与测试，约 30 | 136-GWT3 |
| O-9 | AOS 在 logos2 里没有标 | 补标或撤 AOS story | 占位并标明 | 约 20–30 | 无 |
| O-10 | 头像菜单几何、无账户图标，板上没画 | 接受，目视时定 | 现写法 | 按目视意见改，约 20 | 无 |
| O-11 | 窄屏按视口切还是按容器切 | 容器查询 | 按视口 | 改容器查询加 1023 门，主力约 80 | 无 |
| O-12 | 下拉里显不显示 ⌘K | 不显示 | 不显示 | 无，可直接结掉 | 无 |
| O-13 | 纸升起的距离 | 设计会话给数 | 10 | 改 token 值，约 10 | 无 |
| O-14 | STORY-136 的字重文本与板不一致 | 按板改 Story 文本 | 按板实现 | 只改 Story 正文 | 无 |
| O-15 | Sheet 夜间遮罩与下一级怎么开；遮罩下的纸夜间读 4.13，板 7.29 | 设计会话补 | 现写法 | 改遮罩夜间值、补下级导航，约 40 | 无（目视） |
| O-16 | 纸内页标题行高：板 28.6 无 type token，包件 30 | 接受 30 | 30 | 要 28.6 就新增 type token，约 15 | 无 |
| O-17 | TreeNav 归宿：壳菜单与下拉由模型渲染 | 接受；M22、M30 写明 TreeNav 只用于消费方的下拉或浮层 | 现写法 | 要壳下拉装 TreeNav 属新 API，约 100 | 无 |
| O-18 | 批末 verify 不含 test:dom；加段属执行方法变更 | 批末 verify 后加跑只读 `test:dom`，记入 steps.md | 不加 | 主线程脚本加一段 | 无判据；139、140 的 DOM 用例只有包自报 |

#### 3.1.1 C8 的处置（摘录要求明确定一种）

- **性质：门判定语义的放宽，不是对板值的如实登记。** C8 是 START「第一批 C1 至 C17 继续有效」里的硬线，要求让步项有非零 min-width、每个渲染出的工具栏恰有一个让步项；板上 `.ts-pins` 写 `min-width:0`，没有固定项的壳不渲染让步项。让顶带过 C8 只有三条路：改判定（对顶带不查这两项；roles.json 加字段由门读取，与加豁免效果相同，分片 C 的 (c) 即此）；给板补数值（设计正本的新画法）；让无固定项的壳渲染空让步位（板上没有，还牵涉空 nav 地标）。
- **归 A 类。** 三条路都在 A 类。另有两条独立依据：135-GWT4「contract:static 退出 0」是 R2-12 → R3-6 返工过的同一目标，R3 仍不满足；R3-8 原文与拆分 C-14 都写「需要板上没有的数值时，停下交 Owner」。分片 A 的方案一落不了地（§0 第 3 条）。
- **判断选定：** 交 Owner（O-19），R4 不派 C8 的任何改动。登记按现状保留（B 类）：它钉着标按钮与右簇不收缩（`fixed-item-shrinks`、`story-item-not-fixed` 都是 0）；撤掉登记，C8 在壳层家族又没有被测物（R2 判断 §0 第 4 条）。
- **给 Owner 的选项：** 甲（建议）裁定顶带按板：roles.json 顶带一项加两个字段（默认名 `yieldMinWidth: "zero-by-board"`、`yieldOptional: true`，带板规则出处），门只对带字段的登记跳过这两项，其余 C8 检查照旧；clauses.md 写明；两条自检（去字段判红、加字段判绿）；主力约 25，裁后单独成包。乙：设计会话给让步项一个最小宽进 07b 与 token，组件照改，再定空让步位与地标；设计会话加主力约 60。丙：撤登记，不建议。
- **不裁时：** contract:static 一直红；135-GWT4、143 符合性 C1–C17、149-GWT2 不满足；SUB-113、125、142、155、178、191 保持 active。

### 3.2 知悉

- 交设计会话一并发布：F 段补登 R2 的三条（shell.mark、touch、crumb-icon）与 R3 的三条（shell.chevron、locale-chevron、mark-lg）；四块板与 canvas.json（148）。measure-shell.js 在 R3 未改，149-GWT4 仍相等。
- 读数更正：批末 C8 是 15 条，不是 18 条；markText 的失败读数是 1.4 与 1.7 两处。owner-acceptance 的 G-16 与第 329 行由 R4-9 改。
- 文档壳纸内焦点环：获焦时底边在 25%、50%、75% 处被伸到纸边的 story 卡片盖住，滚到底后换成顶边被盖（内收阴影画在内容之下；A §2.6）。分片 A 判 140 满足，列为目视项。这是 R3-10 的同一目标：若 Owner 目视不接受，由 Owner 定改法，不再派。
- 壳层门读法余项（M1 问题 5、6；C §5 M1-4 的条件）：o.prail、o.rows、x.rowHeights 仍收不渲染的元素，contrast 底色只认 rgb() 与 rgba()，都不判红。留给下一次改壳层门读法的单，同提交统一并镜像 measure-shell.js。
- NavPin、SubNav、TocRail、TreeNav 在壳内仍走兜底焦点环，`-f` 与 token 同值（M3 问题 9）；改这些家族的 `-f` 时同提交加进排除名单。
- 文档站读屏文字三处小缺口：静态页拼出的地标名在非英语页仍是英文（M4 问题 5）；文档壳 header 名重复品牌名（M4 问题 7）；fr 字典「Design System」与 marks.json 描述不一致（M5 问题 7、M7 问题 6）。都没有门读、不挡判据，留给下一次改 client-scripts 与字典的单。
- 其余观察，都不动：browser-proof 读 oracle 旧名，4.1 删旧名时同改（M9 问题 2、拆分问题 14）；「sidebar clones」一句在顶带壳下仍成立（M9 问题 3）；钉钮可及名是 Story 142 原文（M9 问题 4）；README 独立搜索的两句仍成立（M9 问题 6）；fr 记录泄漏 18 → 21 不判红（M9 问题 7，KB-023）；包装层 min-height 差在行高固定时无影响（M2 问题 5）；拖排后悬停预览跟着项走（M5 问题 8，G-19）；窄屏菜单模型改在 1440 面板上读，文档壳 Sheet 靠目视（M7 问题 5）。

### 3.3 授权外，不列返工

- 不放宽阈值：O-4 裁前 markText 照 ±1；O-19 裁前不改 C8 的判定、不给 checkedBatches 里的家族加豁免、不撤顶带登记；smoke、browser-proof 的期望不放宽；不抬扫描上限。
- 不改 ShellPins 在 0 项时的渲染（O-19 的乙、丙）。不给板补数值；不改 Shell 两板、07b 字句与画布画法；measure-shell.js 只镜像门库读法。
- 不新增 token（R4-3 用现有 token，没有合适的就停）；不改第一批品牌尺度 38、28；不新增 type scale token；O-1、O-5、O-11 裁前不动。
- 不改 ⌘K 提示的行为（§3.4 第 4 条）；不给 AOS 视觉实例改 id；不改字典的 fr 值；不改 Story 文字（O-14、O-20）。
- 不改批末 verify 的组成（O-18）；不声明也不绕过库门（S-1）；不推送、不打 tag、不发版、不部署、不发布画布。不新增依赖与 package.json 脚本，自检写进已有的测试或门脚本。

### 3.4 按建议先做（判断自定，收口时回显，Owner 可事后更正）

1. **C8 归 A 类**，列为 O-19。顶带登记保留，R4 不派 C8（§3.1.1）。
2. **「同一修复目标」的认定。** 下列 R3 项点名的目标都已满足，余下的部分落在当时没点名的文件或行上，按新目标进 R4：
   - R3-17 点名的是首行与底栏锁定块（R4-1）；
   - R3-10 / SUB-182 判据③要的是探针纳入与夹具红绿（R4-2）；
   - R3-28 点名的是 md 与列出的行（json 与 ui-react README 进 R4-8）；
   - R3-27 点名的是 search-static（其余死类进 R4-7）；
   - R3-29 的追加与 R3-30 的重收都已达成（开头、清单与截法进 R4-8、R4-5）。
   - 135-GWT4 是同一目标再不满足，markText 自 R2 起只等 O-4，两处都交 Owner。
3. **门判定语义的改动按 B 类先做，都不放宽：** R4-5 的截法（扩大覆盖面）；R4-7 (b)(c)(e)(f) 的收紧与结构调整；R4-2 给探针加被测物；R4-4 只改归属。
4. **⌘K 提示保持现状**（A §4 第 4 条、M4 问题 6）：`menuShortcut={false}` 的壳仍按板画提示。README 那句只给真搜索配快捷键标签，针对的是静态假搜索，壳菜单的搜索是真搜索；要提示随开关隐藏，得改 ShellMenu、矩阵 srch-kbd 两格的对比度期望，并给文档屏另设预览态，改动面大于收益。R4-8 在 README 与迁移说明写明一句。Owner 要提示随开关时：主力约 35。
5. **R4-3 挂 146**（layout 族、纸内几何、硬线），不挂 150。
6. **对 R4-8 放开 C-11 的「只追加」**：只限迁移说明开头与「By consumer」三份清单，条目正文不动。
7. **三片「有条件」口径的追认：**
   - 追认：A §5 M4-1（ShellMenu、ShellDropdown 加可选 landmarkLabel，M40 与 API 清单已列）；B §5 M2-5（cluster 未登家族表，由 R4-4 补）；B §5 M3-3（禁用原因换行，进目视）；C §5 M6-4（计数行，进目视）；C §5 M7-3、4（门专用 panel 只读模型，文档壳 Sheet 进目视，条件已满足）；C §5 M10-3（json 由 R4-8 补）；C §5 M11-3（确认）。
   - B §5 M1-1：追认，不加「source 补写去截断」的条件。source 逐字引 G 段，不该改写；取法写在门脚本注释与 M1 交回里，与 C §5 M1-1 同判。
   - C §5 M1-4：追认，条件延续到下一次改壳层门读法的单（§3.2）。
   - C §5 M9-3：追认，不改 id，R4-8 写明 expanded 是历史名。
   - C §5 M11-2：追认为一次性处置（sha 与 digest 已记在 removedBeforeSelection），机制不补，M11 问题 3 不做。
   - 其余判「可接受」的照收，含 SUB-194 比对键改标 id（B §5 M4-2）、M10 为扫描跑构建（C §5 M10-1）、parity 复合行盒（C §5 M2-2）、SUB-183 两条断言（A §5 M3-183）。
8. **R4 拆分约定**（由本判断定）：
   - `docs/verification` 与 `owner-acceptance.md` 只由 R4-9 提交；迁移说明与 CHANGELOG 只由 R4-8 改，其余各包把迁移条目写进交回。
   - 改动会让别包门期望过期的包，同包对齐那条期望（R2 M2）；R4-7 删东西之前 grep 全仓的消费者。
   - 收录迁移条目的包排在所有产出迁移条目的包之后（R3 主线程 M3）。
   - 跑过会写 `docs/verification` 的门，按 C-9 还原。
   - 包表的前置列只写包号（C-17）。
   - 合入顺序 M1 → M2 → M3；M3 合入前，在集成树上只读复跑一次 `demo-styles-sync --check`（它读 dist，KB-019）。

### 3.5 停点

- 推送、打 tag、发版、部署都不做，停在推送之前；画布与 F 段交设计会话发布。
- Owner 目视：136–150 加第一批，按 owner-acceptance.md；R4 新增展开标题、Disclosure 描边与截法变更后的离群项，由 R4-9 写进清单。
- 库门 S-1：声明 `verify` 之前，16 张 Story 与 INIT-015 的 13 张都不能转 done；两个 INIT 都等 Owner 目视后再转。

## 4. 链写计划（主线程一次 work-batch；summary 都已量过，均 ≤ 160 字节）

### 4.1 Subtask

R3 的 34 张现在都是 planned。下表 32 张转 done，走三步 ready → active → done；前两步的 summary 写「R3 包已合入集成分支，批末验收已出」，第三步用表中的 summary。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-179 | work:58bde3921db438266270c792 | R3 验收满足：⌘K 只开被测屏或文档壳，focusLoop 读 search，屏内 SectionTabs 带屏名 |
| SUB-180 | work:ba5d437268085415e39f9ef8 | R3 验收满足：下拉三条 DOM 用例在位；批末不跑 test:dom（O-18），读数取包自报 |
| SUB-181 | work:4b59f8b719baf9d243744b92 | R3 验收满足：searchOverlay 只计面板外碰撞，两主题 0，面板底不透明，两条变异判红 |
| SUB-182 | work:cd7c7cc3fe729e584d59df96 | R3 验收满足：纸内焦点内收可见，兜底排除自带焦点对的壳件；真件探针覆盖另立 R4-2 |
| SUB-183 | work:109a0ddf1e832ff79b9d971d | R3 验收满足：两个死名在 packages、apps、scripts、tests 下 0 处 |
| SUB-184 | work:c90ce4318196e9e0a404508d | R3 验收满足：landmarkLabel 命名壳内全部地标，30.02 axe 0；新增 prop 已追认 |
| SUB-185 | work:b4bd409f619e926f22536eff | R3 验收满足：menuShortcut 默认开，关掉不注册 ⌘K，README 与迁移 M41 已写 |
| SUB-186 | work:f0d3297877841d69ad374389 | R3 验收满足：ts-closed-l 拖排与 Alt+→ 刷新后保留，头像菜单列 5 个产品 |
| SUB-187 | work:c6c883abb6ffb468d9997793 | R3 验收满足：登入动画读回句五语齐，storybook 单测 14/14 |
| SUB-188 | work:ccb1b6941ce8f4b9d5f441ff | R3 验收满足：菜单与 Sheet 引导图标照板 22 盒内距 3，真件 prail 全过 |
| SUB-189 | work:d2039fc7ce120f96efa08241 | R3 验收满足：checkedBatches [1, 2]，测试 74/74，门脚本跑到底 |
| SUB-190 | work:4feb886d59620fb39dd6acae | R3 验收满足：C11 卡套卡归组合件家族，layout 0 条，34 条豁免随第 3、5 批到期 |
| SUB-192 | work:ca141caa0f647c226ceec360 | R3 验收满足：导航项标签单行截断带 title，C7 0；禁用原因换行待目视 |
| SUB-193 | work:88573059a911149e69e59a2d | R3 验收满足：TocRail headingLevel 2 或 3，默认 3，单测在 256/256 内 |
| SUB-194 | work:aafcd7b700e56fbdab05b08c | R3 验收满足：首行与底栏锁定块 data-logo 写标 id，brandDigest 24 run 全过 |
| SUB-195 | work:ce9a35b47bf2209b8a60883d | R3 验收满足：DS 首行字标五语不换字，三张名单载体一致 |
| SUB-196 | work:196b47afcf3992dfe225256c | R3 验收满足：singleLine 逐段读面包屑，390 两屏转绿，自检判红 |
| SUB-197 | work:203e3f6ae184f991136c78b6 | R3 验收满足：parity 复合行盒读法，退出 0，右内距改 0 的自检判红 |
| SUB-198 | work:0eaee18c9017534cb18ef2e9 | R3 验收满足：复现性两投影相等，禁用项读回 3 样本，zh-CN 泄漏等水合后 0 |
| SUB-199 | work:8421140e85a9645aa94f5e9b | R3 验收满足：AOS 实例标题裁切 8 → 0，clippedButtonText false |
| SUB-200 | work:553fef5d7cc5532810389b0b | R3 验收满足：两个 search-results 变体出结果，zh-CN「工作项」补回 |
| SUB-201 | work:79c1d1107a5a92dbea5b38bc | R3 验收满足：文档壳为水合真件，≤760 开 Sheet、761 起开面板，Esc 回焦 |
| SUB-202 | work:9bb0902226418afc88ec3815 | R3 验收满足：文档页目录标题 h2，heading-order 0 |
| SUB-203 | work:011f5fe814ba730271c09bcb | R3 验收满足：门侧无需改动，阈值不变 |
| SUB-204 | work:42e60e55891390c44b160d9c | R3 验收满足：文档层改 G+ 名，search-static 死规则、例外与白名单删除 |
| SUB-205 | work:9219bcfe70e1d97218d0eeda | R3 验收满足：十个样板壳高 640 与画框齐，overlap 0，映射 23/23 |
| SUB-206 | work:437b2bbaca37d8dc385adf58 | R3 验收满足：pinJitter 只收渲染钉钮，24 run 全过，故事变异 22/22 判红 |
| SUB-207 | work:85c957f8938dfad16ab2e18a | R3 验收满足：对比度按格心绘制栈取底，srch-kbd 7.59 与 6.11 等于板值 |
| SUB-208 | work:8ac3ef32a47bf9b51d3a7582 | R3 验收满足：AI 契约与 oracle 改顶带壳，构建弃用提示 0，contracts 0 |
| SUB-209 | work:41b6e1f61a978607468799d1 | R3 验收满足：四份 README 改顶带壳与两主题同色；map.json 另立 R4-8 |
| SUB-210 | work:14661959b276582279b3c56b | R3 验收满足：迁移 M38–M46 与 CHANGELOG 摘要；开头与分消费方清单另立 R4-8 |
| SUB-211 | work:24f9795b1018a813b73b8726 | R3 验收满足：视觉签名重收 217 条、回归 0，清单改批末读数；截图盲区另立 R4-5 |

下表 2 张保持，走两步 ready → active，两步的 summary 都写「R3 部分满足；交 Owner：O-19（C8）」（42 字节）。

| Subtask | id | 未满足 |
| --- | --- | --- |
| SUB-178 | work:1f4489dd1228f72a32c90612 | 判据⑥ contract:static 退出 0：只剩 C8 |
| SUB-191 | work:57a7fa0c4e845d884eb3b260 | 判据④：C8 15 条只等 Owner |

R2 保持 active 的 13 张：下表 11 张承接的 R3 项都已满足，各走一步 active → done。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-144 | work:bf391e91e9ba439a0a9c2af2 | R3 承接项满足（R3-17）：锁定块 data-logo 写标 id，验收见 r3 分片 B |
| SUB-145 | work:53beecc703922e8bb33b0363 | R3 承接项满足（R3-12）：两个死名清零，验收见 r3 分片 A |
| SUB-146 | work:79bc4751909ec3fddc02fc54 | R3 承接项满足（R3-10）：纸内焦点内收可见，验收见 r3 分片 A |
| SUB-148 | work:cd46ee1a30ab388cad8f94fe | R3 承接项满足（R3-14）：地标名按实例区分、axe 0，验收见 r3 分片 A |
| SUB-150 | work:b7790029f4dbd1414b2d281c | R3 承接项满足（R3-4、R3-14、R3-27），验收见 r3 分片 A、C |
| SUB-151 | work:6195d538cd393b1c3c230582 | R3 承接项满足（R3-21）：文档壳水合真件，验收见 r3 分片 C |
| SUB-160 | work:2b378042f3f02d7a86a366db | R3 承接项满足（R3-22、R3-23）：样板壳 640、AOS 裁切 0，验收见 r3 分片 C |
| SUB-166 | work:2e7cc4cf77abf0f7280ba82b | R3 承接项满足（R3-20）：首行字标五语不换字，验收见 r3 分片 B |
| SUB-167 | work:3c297dfe25bcf0cf7a42b676 | R3 承接项满足（R3-27），验收见 r3 分片 C |
| SUB-174 | work:6098761d0dcd688859f4cf9f | R3 承接项满足（R3-1、R3-2、R3-9），验收见 r3 分片 B、C |
| SUB-177 | work:375645cfb762fd69d9ceb510 | R3 承接项满足（R3-30）：视觉签名重收 217 条，验收见 r3 分片 C |

R1 保持 active 的 17 张：下表 12 张承接的 R3 项都已满足，各走一步 active → done。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-116 | work:e1e9b91a9f04e3bf918be0f2 | R3 承接项满足（R3-2、R3-9、R3-18），验收见 r3 分片 A、B |
| SUB-119 | work:ce26517292ff623a8cfe4fe2 | R3 承接项满足（R3-10、R3-14、R3-18、R3-25），验收见 r3 分片 A |
| SUB-121 | work:4ff0723e6c60af609155600b | R3 承接项满足（R3-4、R3-5、R3-21），验收见 r3 分片 A、C |
| SUB-126 | work:67dd0f644fc7628d85f7e1a5 | R3 承接项满足（R3-4、R3-21），验收见 r3 分片 B |
| SUB-128 | work:fc5b6216b6fa24d504495b9c | R3 承接项满足（R3-28 点名各处），验收见 r3 分片 B、C |
| SUB-131 | work:188a1f32d0344a905e22beec | R3 承接项满足（R3-14、R3-20、R3-21、R3-27），验收见 r3 分片 C |
| SUB-132 | work:d4d30e72342df308e492b8e5 | R3 承接项满足（R3-5、R3-19），验收见 r3 分片 C |
| SUB-134 | work:61054e000dd53df705212bdd | R3 承接项满足（R3-22），验收见 r3 分片 C |
| SUB-135 | work:20d8783340faa1c75ea941a6 | R3 承接项满足（R3-1、R3-2、R3-3），验收见 r3 分片 B、C |
| SUB-136 | work:62d16d400bd01427e0667ecf | R3 承接项满足（R3-2），验收见 r3 分片 C |
| SUB-139 | work:0d618cb5cd0c00b635d8d63f | R3 承接项满足（R3-30），验收见 r3 分片 C |
| SUB-140 | work:f9c5a26b1e703dd43c78b3cc | R3 承接项满足（R3-30），验收见 r3 分片 C |

另 7 张保持 active，不写转态（剩下未满足的只等 Owner）：R1 的 113 → O-19（判据 135-GWT4）、114 → O-8（136-GWT3）、125 → O-19（R3-8）、127 → O-4（145-GWT2）、137 → O-4（真件 18 门）；R2 的 142 → O-19（判据含 contract:static 退出 0）、155 → O-19（R3-8）。引擎有 Subtask 注解入口就同批写「R3 后只等 Owner：交 Owner：O-n」，没有就不写。

本批共 123 个成员（32 × 3 + 2 × 2 + 11 + 12）。

### 4.2 Story 不转 done

16 张都保持 active（库门为 0，引擎拒绝 Story 转 done），只写注解。不开 `--fixes` Story，R4 返工由 R4 拆分建新 Subtask，挂在原 Story 下（R4-3 挂 146）。

### 4.3 Story 注解 summary

| Story | summary |
| --- | --- |
| 135 | R3 阻于 Owner：GWT1–3 满足；GWT4 contract:static 只剩顶带 C8 15 条（O-19）。库门 0 |
| 136 | R3 阻于 Owner：GWT3 夜间后缀 3.07 待 D7（O-8）；标按钮 data-logo 改标 id 进 R4-1。库门 0 |
| 137 | R3 机判满足：间距 8、上限 6，第 7 项在菜单带已固定标记（本轮实测）。库门 0 |
| 138 | R3 机判满足：⌘K 只开一个壳，快捷键格按叠放取底；底栏锁定块墨迹 1.7 待 O-4。库门 0 |
| 139 | R3 机判满足：三条下拉 DOM 用例在位（批末不跑 test:dom，O-18）；O-3 待裁。库门 0 |
| 140 | R3 机判满足：geometry:proof、parity、地标、⌘K、纸内焦点全过；真件焦点探针 R4-2。库门 0 |
| 141 | R3 机判满足：读回句五语齐；飞行标 data-logo 改标 id 进 R4-1。库门 0 |
| 142 | R3 机判满足：pinJitter、prail 全过，钉钮 24×24；O-5、O-6 待裁。库门 0 |
| 143 | R3 部分：四条 GWT 满足；C1–C17 余顶带 C8 15 条（O-19），家族表补登 R4-4。库门 0 |
| 144 | R3 机判满足：两宽 Sheet 可开、行 44；Story 写全屏 Sheet 与板不符（O-20）。库门 0 |
| 145 | R3 部分：GWT1、3、4 满足；GWT2 DS 首行 1.4 待 O-4；data-logo、map.json 进 R4。库门 0 |
| 146 | R3 部分：四条 GWT 满足；几何门只差 markText（O-4）；Disclosure 描边被裁 R4-3。库门 0 |
| 147 | R3 部分：GWT1–4 满足；展开标题左边条、死规则、截图盲区进 R4-5、6、7。库门 0 |
| 148 | R3 阻于 Owner：GWT2–4 满足，映射 23/23；GWT1 五块待 O-2；map.json 进 R4-8。库门 0 |
| 149 | R3 阻于 Owner：真件 17/18、变异 22/22；verify 红 13（O-19）与 18（O-4）。库门 0 |
| 150 | R3 机判满足（判定人 Owner）：pack、迁移 M1–M48、清单、4.0.0；文档与再生 R4-8、9。库门 0 |

### 4.4 INIT-016 注解要点

- summary：「R3 判断：机判满足 8、部分 4、阻于 Owner 4；R4 返工 9 条（主力 4、经济 5）；Owner 待裁 20；库门 0」，共 126 字节。
- 正文要点：批末 verify c45c529 红 2 / 2（R2 为 7 / 8），两步都只等 Owner（C8 → O-19，markText → O-4）；C8 判为门判定语义的放宽，归 A 类，登记保留；验收与判断路径；R4 共 5 包 3 波，含两条硬线；停点不变。

### 4.5 知识卡

lessons.json 5 条，接 TCRN-DS-KB-036；主线程逐条 knowledge-capture 并读回（需要时加 `--allow-trailing`），被预算拒绝的记阻塞。

1. 登记新被测物（收紧）之前，先把板值与条款要求逐项对一遍。
2. 已全量检查批次的家族不能用豁免放行任何条款发现。
3. 内容进了滚动容器，元素截图只画得出可见的一段。
4. 按目录名跳过构建产物，会把同名的源码目录一起跳过。
5. 按选中标记查禁用画法的门，看不到别的状态属性下的同一种画法。

### 4.6 不在本次链写内

Story 与 INIT 的转态、INIT-015 的 13 张（库门为 0）；R4 新 Subtask 的建单（由 R4 拆分负责）；Owner 待裁项与库门声明。本轮不写纪要。

## 5. R4 规模估计与分包建议

| 包 | 档 | 返工项 | 前置 | 预计响应 |
| --- | --- | --- | --- | --- |
| M1 | 经济 | 组 A：R4-1、R4-2、R4-3 | 无 | 90 |
| M2 | 主力 | 组 B：R4-4、R4-5 | 无 | 100 |
| M3 | 主力 | 组 C：R4-6、R4-7 | 无 | 85 |
| M4 | 经济 | 组 D：R4-8 | M1、M2、M3 | 50 |
| M5 | 主力 | 组 E：R4-9 | M1、M2、M3、M4 | 110 |

- 并行上限 3：W1 跑 M1、M2、M3（文件集互不相交）；W2 跑 M4；W3 跑 M5。之后批末 verify 一次，按 Epic 分片验收，再判断。
- 规模：实施约 435 响应；加上拆分约 60、验收约 300、判断约 100，整轮约 900 响应。关键路径 M2 → M4 → M5。
- 风险：R4-5 让 browser-proof 的时长与回执体积上升（包内先量，守住 1,000,000 字节）；R4-7 (e)(f) 可能跑出新发现（只记，交 R4 判断）；R4-9 重收会有新的 A 类离群（进目视）；R4-3 找不到合适的现有 token 就停下记问题。
- O-19、O-4 若在 R4 拆分前裁定，按 §3.1 的改法单独成一个主力包（C8 约 25、markText 约 40），排进 W2（守并行上限 3）。
- **R4 做完后预计只剩的 Owner 阻点：**
  - O-19（verify 第 13 步；135-GWT4、143 符合性、149-GWT2）；
  - O-4（verify 第 18 步；145-GWT2、146「几何门全绿」、138 与 145 的硬线读数、149-GWT1）；
  - O-8（136-GWT3）；O-2（148-GWT1）；O-20（144 的 Story 文字）；
  - 库门 S-1（29 张 Story 的 done）；Owner 目视；推送、打 tag、发版、部署；画布与 F 段发布。
  - 其余待裁 O-1、O-3、O-5–O-7、O-9–O-18 不挡机器判据。
  - 届时 R4 判断应写「R5 无返工、建议收口」。
