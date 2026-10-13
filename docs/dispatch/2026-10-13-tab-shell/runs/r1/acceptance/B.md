# R1 批末验收 · 分片 B（STORY-142 至 146；EPIC-045 导航、EPIC-046 品牌与布局）

节行号：1 一览 L9；2 逐 Story L21（2.1 STORY-142 L23、2.2 STORY-143 L36、2.3 STORY-144 L49、2.4 STORY-145 L62、2.5 STORY-146 L75、2.6 质量硬线 L88）；3 返工清单 L103；4 只有 Owner 能定的事项 L171；5 实施口径判定 L178；6 证据盲区 L222

被验对象：集成分支 `claude/init016-tab-shell`，代码与 5a82dc5 相同（之后只有 docs/dispatch 提交；`git diff f98b298 HEAD -- packages apps scripts tests docs/design` 为空，所以 SUB-140 提交的壳层门报告与 HEAD 代码一致）。方法只读：读批末日志、回执与门报告、源文件、dist 与静态 Storybook；在会话 scratch 写只读探查脚本，用 Playwright（Chromium）打开静态 Storybook 或把 dist 的 SSR 输出连同包的 token 与组件样式挂进空白页量 DOM。未改代码、门、回执、链，未重跑门、未构建。Owner 目视的部分只给机器结论，不代签。

证据记法：`NN log:行` 为 scratch `r1-verify/` 下的批末逐段日志；`acc/文件:行` 为本分片 scratch `acc-r1-B/` 下的探查输出（脚本在 `acc-r1-B/probe/`）；`壳报告` 为 `docs/verification/shell-measure/report.json`（f98b298，SUB-140 提交），`壳报告摘录` 为 `acc/20-shellreport-gates.txt`（门与变异）与 `acc/21-shellreport-runs.txt`（逐 run 失败项）。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-142 图钉位与名册 pin | 部分 | GWT1 部分：实测 rest 与 hover 文字盒等宽，但壳层门 pinJitter 对真件 n/a，`display:none → inline` 变异未判红（且在现实现上不可能判红） | 3（B1-1、B1-2、B1-3） |
| STORY-143 导航家族归位 | 部分 | 四条 GWT 满足；符合性两处缺口：迁移说明未逐件记处置、TreeNav 仍作页内导航列展示；另 NavGroup 非可钉标题截断无 title | 3（B1-4、B1-5、B1-6） |
| STORY-144 手机 Sheet 与 INC-399 | 部分 | GWT2 部分：Sheet 行 44 成立，「行高改 32 的变异判红」不成立；GWT3 部分：INC-399 段六腿按期，`geometry:proof` 整体退出 1（红在段外） | 3（B1-2、B1-7、B1-8） |
| STORY-145 首行变体与 TMS 后缀 | 部分 | GWT2 部分：8 个首行里 7 个墨迹中线在 ±1 内，Design System 侧栏尺度 1.4；门从未量过 ProductLockup 首行本件 | 4（B1-9、B1-10、B1-11、B1-12） |
| STORY-146 PageHeader 必有与纸内布局 | 部分 | 四条 GWT 满足；符合性「几何门全绿」不成立：批末两道几何门都红（红不在本 Story），且没有门读本 Story 的面包屑、1040 与左缘 | 1（B1-10） |

返工 12 条：主力 2（B1-1、B1-10），经济 10。共享项（B1-2、B1-10）计入涉及的每张 Story。五张 Story 的「Owner 目视」均未代签；库门为 0（S-1）只影响转态，不影响本结论。

## 2. 逐 Story

### 2.1 STORY-142 · NavItem 图钉与固定项契约，名册加 pin（SUB-123，P2）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 rest 与 hover 文字盒等宽；`display:none → inline` 变异判红 | 部分 | 实测满足：`shell-top-band` 的 ts-x-l 16 行、ts-drop-l 4 行，真实鼠标悬停前后 `.tcrn-nav-item__label` 宽差 0（acc/34-pin-summary.txt:1-12；dark + zh-CN 同为 0，acc/51-pin-dark-zh.json）。门不满足：壳报告 `gates.pinJitter = "n/a"`、各 run `checked 0`（壳报告摘录 gates:13、runs:5），变异 `story-pin-display-none-inline` 结论 `stays n/a`、`ok:false`（gates:32）。根因三处：① 行内没有 C-5 钩子 `data-text="prail"`、`data-guide="prail"`（acc/33-topband-summary.txt:22，textHook 0、guideHook 0），门库 `rowText` 读不到行宽，`x.rowGroups = null`（`scripts/lib/shell-measure.mjs:132,412-416`）；② 门按 `[data-shell-row]`（落在链接上）找图钉，而图钉是链接的兄弟（`Navigation.tsx:1587-1596`）；③ 行网格把 24 轨道写死（`base.css.ts:362`），图钉 `display:none` 时轨道仍在，文字盒不变——同一变异在实件上量得宽差 0（acc/34-pin-summary.txt:22），是等价变异，门修好钩子后也杀不掉它 |
| 2 role button、aria-pressed 与固定态一致、aria-label 含项名 | 满足 | 原生 `<button>`、`aria-pressed={pinned}`、五语模板（`Navigation.tsx:1468-1483`，文案表 145-146、174-175、203-204、232-233、261-262）；实测已固定行 `aria-pressed=true`「Unpin from top bar: Roster」，未固定「Pin to top bar: Teams」（acc/33-topband-summary.txt:23-24） |
| 3 contract/icons.json 38 且含 pin 描边与实心两态 | 满足 | `07 log:29` icon-roster「same 38 names」；`docs/design/gplus-2026-10/contract/icons.json:44` pin 带 `variants {outline: fill [], solid: fill [0]}`，名册 38 条 |
| 4 行获焦不悬停时图钉可见 | 满足 | 链接获焦、行 `:focus-within`、未悬停，图钉 opacity 1；Tab 到图钉本身 `:focus-visible`，opacity 1 且有焦点环（acc/34-pin-summary.txt:14-15） |

符合性：槽 24 常驻、钮 24×24、图标 16（acc/33-topband-summary.txt:22）满足；hover 与 `:focus-visible` 同现满足；分组行、项行、子菜单行都可钉满足（分组标题 hover 时图钉 1，acc/35-head-summary.txt:1-3；级联列标题与级联行经 `shellMenuPinProps`，`ShellMenu.tsx:298-310,712`）；触摸端热区 44 满足（粗指针下 `::after` 44×44，acc/49-touch.json）；可见名五语同源满足；「icons.json 与 Icon 板同步」部分：两块 Icon 板的 A 段网格已画 pin，但板上文字仍写「名册 37 件」「28 件现有加 9 件新增」「37 件逐个绘制」，也没画实心态（acc/37-icons.txt:1-14；`build-icon.mjs:77,171,177,193,195`），Storybook 五语描述与 README 同样写 37（B1-3）。静态文档里 ts-x-l 的「hover」预览行既无 3.5% 墨洗也不显图钉（acc/35-head-summary.txt:10，acc/34-pin-summary.txt:16-21），Owner 在文档站看不到板上「hover 出现图钉」这一态（B1-2）。

Subtask：SUB-123 包自报「完成」；实测部分达成（GWT1 门侧、Icon 板文字与实心态、静态预览三处未落）。单测（P2 自报 167/167、169/169）未在批末执行（见第 6 节）。Owner 目视：待 Owner。

### 2.2 STORY-143 · 导航家族焕新，SideNav 等退役（SUB-124、SUB-125，P8）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 每个退役件有弃用导出与迁移步骤 | 满足 | dist 的 `componentLibraryDeprecatedComponentNames` 6 件（SideNav、SideNavCollapseButton、MobileNavToggle、TopBar、ProductLauncher、ProductSwitcher）逐件：仍导出、在公共名册、`.d.ts` 带 `@deprecated`、迁移说明与 CHANGELOG 都提到（acc/43-exports.json）；`docs/migration-4.0.md:624-649` M23 表逐件给「Do instead」；规则全部移出 `tcrnComponentCss`、进 `tcrnRetiredComponentCss`（同文件 css 段） |
| 2 五种旧形同一家族、同一选中态结构，selection:proof 0 | 满足 | `06.12 log:1-12` ok、`tabsFamily.selectedRules 1`；实测五形根都是 `tcrn-tabs`，选中只多 6% 墨洗（浅色 rgba(22,21,15,.06)）与 600 字重，无边线、阴影、伪元素，浅色夜间同构（acc/42-layout-summary.txt:57-88） |
| 3 TocRail 在纸内；壳内常驻侧栏 0 | 满足 | ProductShell 内 TocRail `inPaper true`、在页头之后（acc/42-layout-summary.txt:28,56）；静态 Storybook 11 个壳屏按 DOM 计 `sidebars=0`、收起钮 0（acc/32-shell-probe-summary.txt；展开后复核 acc/33-topband-summary.txt:7,20、acc/38-mobile-summary.txt:7,14） |
| 4 Breadcrumb 在 390 宽一行、截断、有 title | 满足 | 纸内页头首行是 `nav.tcrn-breadcrumb`；390 宽三项同一 top、三项都截断（ellipsis）、title 等于全文，导航与页面无横向溢出（acc/42-layout-summary.txt:29-33） |

符合性：Tabs 选中态单一结构、Breadcrumb 作为页头首行、退役件弃用一个小版本并列入 CHANGELOG、包外 tcrn- 类 0（`12 log:29-30` DOC_SHELL_CLASSES_PACKAGE_BACKED）均满足。两处不满足：① 「家族清单逐件处置并记入迁移说明」部分：navigation 13 件里 Pagination、SkipLink，shell 9 件里 ProductShellSearch、ShellThemeToggle、ShellLocaleMenu、AppStatusBar 在迁移说明里没有处置记录（acc/45-families.txt，拆分问题第 13 条要求「逐件处置写进迁移说明」）（B1-4）；② 「NavGroup、TreeNav 只在面板与下拉里渲染」部分：NavGroup 满足（只出现在壳的菜单与文档壳菜单里，acc/46-treenav-where.txt），TreeNav 仍在 `documents-and-collaboration-components-spec`（「Tree, canvas, and local rail」，aria-label「Page navigation」）与 `-density-spec` 里作为页内导航列独立渲染（B1-5）。另：NavGroup 非可钉分支的标题 `<div class="tcrn-nav-group__label">` 没有 title（`Navigation.tsx:1513`），菜单里这类标题按单行截断（`shell.css.ts:370-373`），壳报告变异 `story-label-plus-40` 给出 `truncatedWithoutTitle: div.tcrn-nav-group__label`（壳报告摘录 gates:35）——START 第一批硬线「导航项单行截断加 title」的潜在违例（B1-6）。

Subtask：SUB-124 自报完成，实测 GWT2、GWT4 达成，TreeNav 归位未落到文档 story；SUB-125 自报完成，实测 GWT1、GWT3 达成，迁移说明逐件处置不全。Owner 目视：待 Owner。

### 2.3 STORY-144 · 手机 Sheet 与 INC-399 门（SUB-126，P7）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 390×844 顶带只有标与示意，固定项 0 | 满足 | INC-399 客户端挂载：390 与 760 宽 `pinsShown 0`、标按钮 `v1` 64×40 在 (12,6)（`10 log:5`，摘出于 acc/10-geo-proof-mobile.txt:3-9）；静态 ts-m-l 可见固定项 0/4、标按钮 64×40（acc/38-mobile-summary.txt:2-7） |
| 2 打开 Sheet 行高 44；行高改 32 的变异判红 | 部分 | 行 44、搜索 44 成立（同上，`sheet.rows [44]`、`search 44`）。变异不成立：壳报告 `touch` 基线红 `layer.notSheet`（ts-m-s 读到的是 `expanded`），变异 `story-sheet-row-32` 结论「not distinguishable」（壳报告摘录 gates:20,39；runs:74）。原因：静态 `shell-mobile` 的 ts-m-s 仍渲染桌面完整菜单——300 宽框里 366 宽面板、三列文字盒只剩 6、行高 32（acc/38-mobile-summary.txt:8-19；`story-content.tsx:792-795` 仍是 `state: "expanded"`）（B1-7） |
| 3 滚动 2000 后点标按钮 Sheet 打开（INC-399 门退出 0） | 部分 | 行为满足：760 与 390 各三腿基线绿、变异红、复原绿，纸滚 2000、命中标按钮、Sheet 在视口内（acc/10-geo-proof-mobile.txt:3-9）。门退出码不满足：`geometry:proof` 退出 1（`runs/r1/verify/steps.md:25`），红在 `searchOverlay` 段（基线 overlayCount 0、openMenus 12，`redThenGreen.searchOverlay.green false`，acc/11-geo-oks.txt:1-7），属 P1d 问题 6 与 P9 问题 3，不在本分片；INC-399 段不能单独运行（`geometry-proof.mjs:558-566` 一个 ok） |
| 4 夜间与浅色同一选择器属性集只换值 | 满足 | `shell-sheet.css.ts:26-101` 无主题选择器、无颜色字面量；`13 log:85-86` CONTRACT_STATIC_CLAUSES_HOLD（含 C5） |

符合性：标按钮 390 宽可点高 40、Sheet 搜索 44、固定项不在顶带、滚动后可开、移动块（≤760）纸与顶带几何与桌面同一 token（无 760 覆写，静态读数顶带 52、纸 12/52/14，acc/38-mobile-summary.txt:2-6）满足。不满足：Sheet 打开时壳根 `data-state` 仍报 `expanded`，C-5 规定的 `sheet` 态缺失（P7 问题 1，`Navigation.tsx` 未接 `useShellMenuPresentation`）（B1-8）。另：实施说明要求的「pointer: coarse 切换 shell.row-h 到 44」在 DS 自己的静态页里失效——粗指针仿真下菜单行仍 32，因为页面把 token 样式表排在组件样式表之后，同特异性的 `:root{--tcrn-shell-row-h:32px}` 覆盖了 `@media (pointer: coarse) :root{…44px}`（acc/49-touch.json，acc/50-rowh.json；`shell.css.ts:135-140`）（B1-2）。

Subtask：SUB-126 自报「完成（文件集内）」，与实测一致：INC-399 段已改真件、Sheet 本件达标；门侧的 touch 判红与壳根 sheet 态落在其他文件，未落。Owner 目视：待 Owner（静态文档里看不到 Sheet，需 B1-7 后才能目视）。

### 2.4 STORY-145 · ProductLockup 首行变体（SUB-127 P2，SUB-128 P4）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 四枚产品首行的标 digest 等于 logos2 | 满足 | `14 log:7-8` BRAND_ASSET_SOURCE_VERIFIED，`14 log:173-212` 四枚 × 两尺度 `firstLineMatches true`；SSR 读到首行标带 `data-logo=<productId>` 且为彩色（acc/41-ssr.json） |
| 2 字标墨迹中线与标中线差 ≤ 1；padding-top 4 变异判红 | 部分 | 用与 `shell-measure.mjs:524-526` 同一口径（canvas measureText，大写顶到墨迹底）在静态页字体下量本件：tms 0.1 / -0.6、einzbern -1.0 / -0.5、mana-orchestrate -0.9 / -0.5、design-system **1.4** / 1.0（侧栏 / 锁定块），盒中心差均为 0（acc/47-brand-summary.txt:2-9，夜间相同 12-19）。DS 侧栏首行超出 ±1，原因是「Design System」的下行字母 g、y 把墨迹底拉低，flex 居中下无法在不做下移的前提下回到 ±1（交 Owner，第 4 节 O-1）。门侧：壳报告 markText 只量到标按钮自己的首行（`brand@22`、`lkr-line@22`，均 TMS），变异 `story-word-padding-top-4` 在它们上判红（壳报告摘录 gates:29）；ProductLockup 的首行变体没有任何 story 渲染（静态页 `tcrn-brand-lockup--line` 只出现在样式表里，acc/40-lockup-line-where.txt），门从未量过本件（B1-10）。本件上同一变异量得 2.1/1.4/3.4/3.0/1.0/1.5/1.1/1.5，einzbern 侧栏从 -1.0 移到 +1.0，按 ±1 判不红（acc/47-brand-summary.txt:10） |
| 3 夜间 TMS 后缀 #2c63c8，矩阵格标红并注明待裁 | 满足 | 实测两主题后缀 rgb(44,99,200)（acc/47-brand-summary.txt:2,12）；`06.05 log:52-53` 夜间 3.13 / 3.33 exempt 并带 D7 待裁注；matrices.json 壳板 `brand-suffix-n`、`brand-suffix-open-n`、`lk-em-n` 墨 #2c63c8、`exempt false`（红格，acc/48-matrix-suffix.txt），壳层门 contrast 把夜间三处后缀读数（3.33、3.07、3.13）记 pending 并引 MIN-20261013-SHELL D7（`shell-measure-proof.mjs:124,413`；壳报告 shell-matrix run 的 contrast.pending）。矩阵契约本身无逐格注释字段（P4 问题 1），待裁注落在门输出与 token-contrast 报告 |
| 4 brand-asset:proof 退出 0 | 满足 | `runs/r1/verify/steps.md:29` 退出 0；`14 log:7-8` |

符合性：只把第一行与标居中、不重排、不改字重、不改颜色满足——字号字重字距与 Brand 板 E 段一致（侧栏 12.5/600 行高 1.2，锁定块 16/600/20、-0.005em，衬线 13.5、18/400），首行规则无 padding、margin、top、transform（acc/47-brand-summary.txt:2-9；`brand.css.ts:153-197`；Brand.dc.html 的 `.rail b`、`.lk .w b`），r6 的 2/3px 下移未重现；标 digest 同源、后缀两主题同色满足。不满足：首行后缀 `em` 上下各超出裁切祖先 `b`（overflow hidden）1px（侧栏 1/1、锁定块 1/0，acc/47-brand-summary.txt:2-5），与标按钮同一结构、同一根因——批末 `geometry:measure` 六个样板两主题 12 个 run 全部只因标按钮后缀 clip 1px 判红（acc/55-geomeasure-clip-all.txt），壳报告 singleLine 同红（runs:8）（B1-9）。`ShellBrandButton.test.tsx:168-177` 仍断言夜间 ≥4.5（读数 3.07），与 D7 和本单 GWT3 相抵（主线程 M3）（B1-11）。菜单底栏锁定块（ShellBrandLockup → ProductLogo）的标不带 `data-logo`，壳层门 lockupDecor 与 brandDigest 因此全 run 判红（runs:3,6；SSR 证据 acc/41-ssr.json `logo-tms`；`Navigation.tsx:619`）（B1-12，也是质量硬线第 5、6 条的门侧红）。

Subtask：SUB-127 自报完成；实测 digest 与结构达成，墨迹中线 7/8、clip 未达。SUB-128 自报「部分」（矩阵格），该剩余项已由 SUB-136 落在 matrices.json 壳板，实测达成；连带的 ShellBrandButton 测试未改（B1-11）。Owner 目视：待 Owner（首行变体在文档站无 story，需 B1-10 后才能目视）。

### 2.5 STORY-146 · PageHeader 必有与纸内布局重排（SUB-129、SUB-130，P6）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 不传 PageHeader 类型检查报错；传入则纸内首行是它 | 满足 | `ProductShellProps.pageHeader: PageHeaderProps` 必填（dist `Navigation.d.ts:649`）；`Navigation.test.tsx:532-540` 两处 `@ts-expect-error`（缺 pageHeader、缺 title），测试文件在 `tsconfig.json` include 内，`02 log` 批末 `tsc -b` 退出 0 即证明两处确实报错；七种 SSR 夹具里 `[data-paper] > .tcrn-product-shell__main` 的第一个子元素都是 `header.tcrn-page-header`（acc/42-layout-summary.txt:1-56） |
| 2 面包屑在 390 与 1440 宽一行、截断、有 title | 满足 | 1440：三项同一 top、nowrap、ellipsis、title 全文；390：三项同一 top、全部截断、无溢出（acc/42-layout-summary.txt:1-5,29-33） |
| 3 SettingsLayout 1440 宽内容 ≤1040 且居中 | 满足 | 设置页 l 200、w 1040、r 1240；纸内容区 40–1400，左右各留 160（acc/42-layout-summary.txt:9-12） |
| 4 SplitView 左缘 = 纸内容左缘 | 满足 | 1440：左缘 40 = 12 + 28，宽 1360；390：28 = 12 + 16（acc/42-layout-summary.txt:13-16,41-44）；DetailLayout 同 |

符合性：PageHeader 必有靠 prop 类型、不靠运行时警告满足；文档与设置页 1040 居中（SettingsLayout、DocumentCanvas，`--tcrn-layout-content-max-w`）、列表与详情全宽满足（acc/42-layout-summary.txt:17-24）；Surface 与 Divider 间距全取 space token 满足（`base.css.ts` 相关规则无 px 字面量）。不满足：「几何门全绿」——批末 `geometry:proof` 与 `geometry:measure` 都退出 1，红分别来自 searchOverlay 段与标按钮后缀 clip，都不是本 Story 引起；但同时没有门读本 Story 的项：门库 `pageCrumbs` 选择器已定义却未被任何读数使用，singleLine 读数排除壳自己的纸（`shell-measure.mjs:152-153,452`），壳 story 里没有设置页或列表页屏（P6 问题 7 未处置），GWT2–GWT4 的机器证据只有包时单测、P6 的 scratch 读数与本次探查（B1-10）。

Subtask：SUB-129、SUB-130 自报完成；实测四条 GWT 达成。P6 交回写的面包屑 DOM（`tcrn-page-header__breadcrumbs` 等）已被 SUB-124 改成 Breadcrumb 件，迁移说明 M22、M27 已按新 DOM 写。Owner 目视：待 Owner。

### 2.6 START 质量硬线逐条核（壳层新增八条）

| 硬线 | 结论 | 证据与备注 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 静态 11 个壳屏 `sidebars 0`、收起钮 0（acc/32-shell-probe-summary.txt、acc/33-topband-summary.txt、acc/38-mobile-summary.txt）；SSR 七种壳无壳级侧栏与收起钮，计到的 `aside` 都是 SettingsLayout、DetailLayout、TocRail 的页内 aside（acc/42-layout-summary.txt）。壳报告 noCollapse 的 fail 只来自行为追踪 `outsideClick unopened`（静态页无客户端 React，点标按钮超时），逐屏读数全过 |
| 顶带无底无线，中线 26 | 满足 | 顶带 52、上下边框 0、背景透明、无阴影；标按钮、四个固定项、铃铛 32、头像 28 的中线都在 26（acc/33-topband-summary.txt:2-5）；壳报告 strip pass |
| 三处间距相等 | 满足 | 标按钮到首个固定项 8、固定项之间 8/8/8，边框 0（acc/33-topband-summary.txt:4）；壳报告 pinSpacing pass |
| 接续 6 | 满足（读数） | 完整菜单顶 − 标按钮底 = 6，下拉顶 − 固定项底 = 6（acc/33-topband-summary.txt:19,49）。壳报告 continuation 的 fail 是同门的另一项 `drop.search 260≠28`（runs:4；静态页 ts-x-l 的 `[data-shell-search]` 也读到 260 高，疑为搜索包裹含结果列表，acc/49-touch.json），属分片 A |
| 锁定块只装饰 | 满足（行为）；门红 | 底栏锁定块 `div[role=img]`、tabIndex -1、内无可聚焦元素（acc/33-topband-summary.txt:21）。门 lockupDecor 全 run 红在 `lockup.mark null`：标不带 `data-logo`（B1-12） |
| 品牌资产 digest | 满足；门红 | `14 log:7-8`、`07 log:30` product-marks 8 件逐字节相等。壳报告 brandDigest 红只在 `lockup:lkr lockup.reference null`（runs:3），同 B1-12 |
| 标旁文字墨迹中线 = 标中线（±1） | 部分 | 标按钮（TMS）门 markText pass 且 padding-top 4 变异判红（gates:10,29）；ProductLockup 首行 DS 侧栏 1.4（见 2.4 GWT2，O-1、B1-10） |
| 登入动画只用 transform 与 opacity | 满足（代码） | `ShellIntro.tsx:145-151` 关键帧只有 opacity 与 transform，`shell-intro.css.ts` 无 transition 与 animation；门 intro 红因静态页不播（P5 已知），属分片 A |

第一批硬线里与本分片相关的两条：「任何元素不超出裁切祖先」不满足（首行与标按钮后缀 1px，B1-9）；「导航项单行截断加 title」潜在不满足（NavGroup 非可钉标题，B1-6）。

## 3. 返工清单

**B1-1 · 图钉位无抖动的门对真件不起作用（STORY-142 GWT1）**
- 现象：pinJitter 全 run n/a，`display:none → inline` 变异 stays n/a；即便门能读，该变异在固定 24 轨道的网格上不改变文字盒，是等价变异。
- 证据：壳报告摘录 gates:13,32、runs:5；acc/33-topband-summary.txt:22（textHook 0）；acc/34-pin-summary.txt:22（变异实测宽差 0）；`shell-measure.mjs:132,377-416`；`mutations.json:124-126`；`Navigation.tsx:1587-1596`；`base.css.ts:362`。
- 建议改法：NavItem 在 `.tcrn-nav-item__label` 上发 `data-text="prail"`、在图标上发 `data-guide="prail"`（C-5 原文要求，组件测试断言钩子存在）；门库对行取 `[data-shell-row]` 的父行 `.tcrn-nav-item-row`（或 `closest('[data-nav-pinnable]')`）找图钉；变异改为同时撤掉保留轨道，例如 `.tcrn-nav-item-row{grid-template-columns:minmax(0,1fr) auto}` 加静止 `display:none`、hover / 选中 `display:inline-flex`，并在夹具自检里证明它会红。
- 改动文件：`packages/ui-react/src/components/Navigation/Navigation.tsx`、`Navigation.test.tsx`、`scripts/lib/shell-measure.mjs`、`tests/fixtures/geometry-measure/shell/mutations.json`（必要时 `tests/shell-measure-proof.test.mjs`）。
- 建议档位：主力（改 C-5 钩子契约与门的读数语义）。

**B1-2 · 静态文档页的样式拼装让两处包内规则失效（STORY-142、144）**
- 现象：① ts-x-l、ts-x-n 的「hover」预览行在文档站既无 3.5% 墨洗也不显图钉；② 粗指针下菜单行仍 32，`--tcrn-shell-row-h` 的 coarse 44 被覆盖。
- 证据：① `page-template.tsx:276-279,322` 只把 `tcrnComponentCss` 截到 settings 契约之前加 `.story-body` 作用域，壳段不在内（acc/35-head-summary.txt:4，scoped 壳规则 0），于是 `.story-body .tcrn-nav-pin{opacity:0}`、`.story-body .tcrn-nav-item-row{…}` 以高一级特异性压过未作用域的预览规则 `shell.css.ts:468-478`（acc/34-pin-summary.txt:16-21，acc/35-head-summary.txt:10）；② 页面里 coarse 块在第 766 条、token 的 `:root{…32px}` 在第 883 条（acc/50-rowh.json）。
- 建议改法：page-template 把壳段（`shellComponentCss`）也纳入 `.story-body` 作用域副本，或让作用域副本只覆盖到不含图钉与行的段；token 样式表排在组件样式表之前。包内可同时加固：coarse 值改写在 `.tcrn-product-shell, .tcrn-shell-menu, .tcrn-shell-dropdown` 上，使其不依赖样式表顺序。
- 改动文件：`apps/storybook/src/build/page-template.tsx`；可选 `packages/ui-react/src/styles/shell.css.ts`。
- 建议档位：经济。可能与分片 C（STORY-147 文档壳）重复，判断时合并。

**B1-3 · Icon 板与文案仍写 37，板上没有实心态（STORY-142 符合性）**
- 现象与证据：两块 Icon 板 A 段网格已画 pin 描边，正文 5 处写 37、无实心态（acc/37-icons.txt:1-14；`build-icon.mjs:77,171,177,193,195`）；Storybook `storybook-locale-text.ts:148,340,532,724,916` 五语描述、`storybook-content-text.ts:528`、`story-content.tsx:1321`、`docs/design/gplus-2026-10/README.md:14` 写 37（P2 问题 2、4 未处置）。
- 建议改法：build-icon.mjs 改 38 并画出 pin 实心态（待 O-2 定规则措辞），按 P2 的做法只提交 Icon 两板受影响的行后交设计会话发布；五语描述与 README 同改。
- 改动文件：`docs/design/gplus-2026-10/tools/build-icon.mjs`、`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`、`docs/design/visual-standard/boards/Icon.dc.html`、上列 Storybook 文案文件、README。
- 建议档位：经济。

**B1-4 · 迁移说明未逐件记家族处置（STORY-143 符合性）**
- 证据：acc/45-families.txt（Pagination、SkipLink、ProductShellSearch、ShellThemeToggle、ShellLocaleMenu、AppStatusBar 在 `docs/migration-4.0.md` 无处置记录）；拆分问题第 13 条「逐件处置写进迁移说明」。
- 建议改法：在 M22 或 M23 加一张家族处置表，navigation 13 件、shell 9 件逐行写「保留不变 / 并入 Tabs 变体 / 弃用 / 新增」及 families.json 现值（10、11）。
- 改动文件：`docs/migration-4.0.md`。建议档位：经济。

**B1-5 · TreeNav 仍以页内导航列出现在文档类 story（STORY-143 符合性）**
- 证据：`components-documents-and-collaboration.html` 的 `documents-and-collaboration-components-spec`（SplitView 列表列里 `nav.tcrn-tree-nav[aria-label="Page navigation"]`，标题「Tree, canvas, and local rail」）与 `-density-spec`（acc/46-treenav-where.txt）。
- 建议改法：把这两处 TreeNav 演示改到完整菜单或下拉的上下文；若判断认为文档树属页内内容（同目录），在迁移说明与 story 文案写明例外与边界。
- 改动文件：文档类 story 内容（`apps/storybook/src/contract-stories/` 下 documents 相关文件）与对应五语文案。建议档位：经济。

**B1-6 · NavGroup 非可钉标题截断无 title（STORY-143；第一批硬线 C7）**
- 证据：`Navigation.tsx:1513` 无 title；菜单里非可钉标题 `overflow:hidden; text-overflow:ellipsis`（`shell.css.ts:370-373`）；壳报告变异 `story-label-plus-40` 读到 `truncatedWithoutTitle: div.tcrn-nav-group__label`（gates:35）。
- 建议改法：非可钉分支同样包 `span.tcrn-nav-group__label-text[title]`（与可钉分支一致），补单测。
- 改动文件：`Navigation.tsx`、`Navigation.test.tsx`。建议档位：经济。

**B1-7 · 静态 ts-m-s 渲染桌面完整菜单而不是 Sheet（STORY-144 GWT2）**
- 证据：acc/38-mobile-summary.txt:8-19；`story-content.tsx:792-795`；壳报告 touch `layer.notSheet`、变异 `story-sheet-row-32` not distinguishable（gates:20,39；runs:66-74，同屏 singleLine 还报面板溢出壳 78px）。
- 建议改法：按 P7 交回第 5 节，把 ts-m-s 的 ProductShell 包进 `shellMenuPresentationContext.Provider value="sheet"`；随之改 smoke 对 ts-m-s 的期望；复核 touch 门基线转绿、变异转红。
- 改动文件：`apps/storybook/src/contract-stories/story-content.tsx`、`apps/storybook/src/smoke.test.ts`（期望值）。建议档位：经济。

**B1-8 · Sheet 打开时壳根不报 `data-state="sheet"`（STORY-144；C-5）**
- 证据：P7 问题 1；静态读数 ts-m-s `state=expanded`（acc/38-mobile-summary.txt:8）；C-5 规定 `data-state` 取 closed、expanded、drop、sheet。
- 建议改法：ProductShell 调 `useShellMenuPresentation()`，菜单打开且呈现为 sheet 时报 `sheet`；补单测。
- 改动文件：`Navigation.tsx`、`Navigation.test.tsx`。建议档位：经济（只加状态值，不改 prop 面）。

**B1-9 · 首行后缀 `em` 超出裁切祖先 1px（STORY-145；第一批硬线「不超出裁切祖先」）**
- 证据：本件 acc/47-brand-summary.txt:2-5（clip topOver 1、bottomOver 1/0）；标按钮同根：`18 log` 六个样板两主题 12 个 run 只有这一处 clip 红：`em.tcrn-shell-brand__suffix` 超 `b.tcrn-shell-brand__word` 1px（acc/55-geomeasure-clip-all.txt）；壳报告 singleLine（runs:8）。根因：行内 `em` 的内容区（字体升降部）高于 `b` 的行盒（行高 1.2 / 20），而 `b` 为 overflow hidden。
- 建议改法：两处首行（ProductLockup 与标按钮）同改，让后缀不越出行盒且不移动字形、不丢省略号（例如约束后缀的内容区高度，或改用不在祖先上裁切的截断写法），改后复跑 clip 与 markText。
- 改动文件：`packages/ui-react/src/styles/brand.css.ts`、`packages/ui-react/src/styles/shell.css.ts`。建议档位：经济。与分片 A（STORY-136）、分片 C（STORY-148 样板）同根，判断时合一。

**B1-10 · 本分片的纸内与品牌件没有 story 与门读数（STORY-145 GWT2、STORY-146 符合性）**
- 现象：ProductLockup 首行变体不在任何 story（acc/40-lockup-line-where.txt），markText 只量标按钮；PageHeader 面包屑、1040 居中、SplitView 左缘无门读（`shell-measure.mjs:152-153` 的 `pageCrumbs` 未被使用，`:452` 排除壳自己的纸），壳 story 无设置页与列表页屏。
- 建议改法：加一个品牌 story 渲染四枚产品 × 两尺度首行，并把它加进 markText 的读数与 padding-top 4 变异；在壳 story 加设置页与名册页两屏（390、1440，长面包屑），门库读 `pageCrumbs` 的单行、省略号、title，读 SettingsLayout ≤1040 且左右等距、SplitView 左缘 = 纸左缘 + 内距，各配一条会红的变异。
- 改动文件：品牌与壳 story 内容（`apps/storybook/src/contract-stories/`）、`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/fixtures/geometry-measure/shell/`（manifest、mutations.json）、`tests/shell-measure-proof.test.mjs`。
- 建议档位：主力（改门的读数范围与判定）。可能与分片 C（STORY-149）重复。

**B1-11 · ShellBrandButton 测试仍断言夜间后缀 ≥4.5（STORY-145 GWT3 连带，主线程 M3）**
- 证据：`ShellBrandButton.test.tsx:168-177`；P4 问题 2（读数 3.07）。批末 `pnpm test` 停在 ui-tokens，未跑到这条（`05 log:16,52`），红仍在。
- 建议改法：白天断言 ≥4.5；夜间断言后缀等于白天色并记实测值与 D7 待裁（与 token-contrast 的 pending 一致）。
- 改动文件：`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`。建议档位：经济。与分片 A 可能重复。

**B1-12 · 第三版锁定块的标不带 `data-logo`（质量硬线第 5、6 条门侧；STORY-145 修复落点 ShellBrandLockup）**
- 证据：SSR `logo-tms`、`lockup-whole-tms` 的 svg 无 `data-logo`，首行变体有（acc/41-ssr.json）；`Navigation.tsx:619`；壳报告 lockupDecor `lockup.mark null`、brandDigest `lockup.reference null` 全 run 红（runs:3,6,67,71）。
- 建议改法：ProductLogo 给彩色标传 `data-logo={asset.productId}`（与 `Navigation.tsx:699` 首行一致），补单测；复核两道门转绿。
- 改动文件：`Navigation.tsx`、`Navigation.test.tsx`。建议档位：经济。与分片 A（STORY-138 底栏锁定块）同根。

## 4. 只有 Owner 能定的事项

- **O-1 标旁文字墨迹中线的口径遇到下行字母。** Design System 侧栏尺度首行 flex 居中后按现口径偏 1.4（g、y 的下行部拉低墨迹底），锁定块尺度恰为 1.0；硬线同时禁止视觉重心下移，所以实现侧无解。建议：±1 改按「大写顶到基线」量（不计下行部），标按钮与首行沿用 flex 居中；备选是接受 DS 1.4 记为已知。
- **O-2 Icon 板「绘制规则」禁止填充与 pin 实心态。** 板上规则写禁止填充色块，pin 的已固定态填充图钉本体（P2 问题 2）。建议：规则加一句例外「仅 pin 已固定态填充本体」，板上补画实心态（随 B1-3）。
- **O-3 触摸端未固定行的图钉静止不可见。** 触屏没有 hover，未固定行只有获焦时才出图钉（P2 问题 9）。建议：`pointer: coarse` 下未固定行图钉常显为 ink-3。
- **目视（机器结论见第 2 节，未代签）：** 142 图钉 hover、已固定、获焦三态与 pin 实心态；143 Tabs 五形同一家族与 11 号 chevron 面包屑；144 手机 Sheet（需 B1-7 后文档站才可见）；145 四枚产品首行两尺度（需 B1-10 的 story）；146 纸内页头与 1040 设置页。Sheet 夜间遮罩与 Sheet 下一级的设计待定已在主线程 M6，不重复列。

## 5. 实施口径判定

P2（SUB-123、SUB-127）：
1. pin 一个名册名两个变体、Icon API 不变、实心态由 CSS 填第一个子元素：可接受（合 Story 假定「同一名册项的 variant」，contract:proof 38）。
2. 可钉 NavItem 为链接与按钮并排的行：有条件——合法 HTML、点图钉不触发链接，结构可取；条件是补上 C-5 行钩子并让门以行包裹找图钉（B1-1）。
3. 槽 24 常驻、只用 opacity、粗指针 `::after` 扩到 44：可接受（实测等宽、44×44）。
4. `pinLabel` 只是项名、整条名字由五语模板组成：可接受。
5. NavGroup 新增可选 `locale`、不给 `onPinnedChange` 时 DOM 不变：可接受。
6. Icon 两板只提交 A 段名册两行、板内 token 块漂移留给 SUB-133：有条件——板上文字与实心态未同步（B1-3），漂移是否已由 SUB-133 处置本分片未核。
7. ProductLockup `firstLine?: "rail" | "lockup"`、恒用彩色标、尺度取 Brand 板 E 段、只靠 inline-flex 居中：可接受（实测字号字重字距与 E 段一致、无下移）；后缀 clip 1px 另见 B1-9。
8. brand-asset-source-proof 只为认识首行加一段：可接受。

P4（SUB-128）：
1. 删 TMS 的 night 与 nightRef、回到主题无关块、保留机制：可接受（改裁时只加回两字段）。
2. 恢复夜间两条豁免并引 D7、门里不写色值：可接受。
3. 测试钉 3.13 / 3.33 并加两条变异：可接受。
4. tokens.json note 写 D2、D7 与改裁做法：可接受。
5. ui-tokens 与 Navigation 测试改回同色：可接受；文件集外的 ShellBrandButton 测试未改，留下 M3（B1-11）。

P6（SUB-129、SUB-130）：
1. 纸内容区一列网格、内距 14 28 12，28 写作 `calc(2 * var(--tcrn-space-3h))`：有条件——取自 token 的算式，读数 28 正确，但不是单一 token；是否加 space 28 属 token 键集变更，交判断（C-17 本批不许加）。
2. 默认密度面包屑到标题间距 8 → space-2h：可接受（板 `.ts-content` 行距 10）。
3. 省略面包屑时取菜单当前位置、末项 `b[aria-current]`、颜色写在类上：可接受（之后 DOM 由 SUB-124 换成 Breadcrumb 件，语义保留）。
4. PageHeader 新增 `locale`、面包屑导航名五语：可接受。
5. 1040 新 token `layout-content-max-w`（契约组 `layout`）：有条件——共享契约变更，拆分问题第 7 条已授权「按建议先做，判断可更正」，实测生效。
6. DocumentCanvas 也收进 1040 居中：可接受（D1「文档与设置页内容居中 1040」）。

P7（SUB-126）：
1. ShellMenu `presentation` auto|panel|sheet，auto 在挂载后按 `(max-width:760px)` 判断、服务端与首帧为面板：有条件——客户端应用成立；无脚本与静态文档首帧是面板，story 必须显式给 sheet（B1-7）。
2. Sheet 下一级接在列表之后、无返回钮：有条件（设计待定，已在 M6）。
3. 按压打开时焦点给 Sheet 自身、⌘K 给搜索：可接受。
4. 「从顶带下方升起」理解为贴底、最高 84%、不越过顶带底，入场只淡入：可接受（取板 `.ts-sheet` 的 84%，板为字节真值）。
5. Sheet 无底栏、无锁定块、无收起钮，先固定项组后全部：可接受（板 A8）。
6. `44px` 字面值（F 段触摸值）、抓手 `calc(3 * var(--tcrn-space-3))`：有条件——C-17 下可接受，但同一 44 在桌面粗指针路径上依赖样式表顺序（B1-2）。

P8（SUB-124、SUB-125）：
1. 五形取变体导出而非弃用别名、旧根类留作无规则钩子：可接受。
2. Breadcrumb 与 PageHeader 合一、当前页 `b[aria-current]`：可接受（实测一行截断加 title）。
3. TocRail 组件不改、归位体现在用法：可接受。
4. 退役 CSS 进 `retiredNavigationCss01` 与新导出 `tcrnRetiredComponentCss`：可接受（css-template 与 exports:check 绿）。
5. families.json navigation 13 → 10、shell 14 → 11，roles.json 牵连的三个块暂留：有条件——待 roles.json 持有者改登记后移除（P8 问题 9）。
6. MobileNavToggle 一并弃用但仍列在 navigation 组件里：有条件——与 SideNav、SideNavCollapseButton 已从名单移除的处理不一致，「10」的口径交判断。
7. 面包屑分隔符 `Icon size={11}` 字面值：有条件——无 11 的 icon-size token，C-17 不许新增，交判断。

## 6. 证据盲区

- 批末 `pnpm test` 在第一个包 ui-tokens 停下（`05 log:16,52`），ui-react 与 storybook 的单测没有在批末执行；本分片各 GWT 的单测只有包时日志（P2 169/169、P8 226 条含 1 条既有红等），合入后的结果未知。
- 批末 `geometry:measure` 在 `geometry-measure-proof` 处停下（`18 log:3,86`），壳层 18 门没有在批末运行；本报告用的是 SUB-140 提交的壳报告（f98b298，代码与 HEAD 相同）。
- 静态页没有客户端 React：Sheet、登入动画、菜单行为追踪在文档站不可观察；Sheet 证据只来自 INC-399 段的客户端挂载。
- 探查只用 Chromium；粗指针用 `isMobile + hasTouch` 仿真，没有真实触屏、Safari、Firefox；布局读数用 SSR 加包样式（系统字体；位置与宽度不依赖字体，面包屑是否截断在系统字体下读取），墨迹中线用静态页字体；夜间读数依赖页面 `?theme=dark` 生效，焦点环内圈在夜间仍读到浅色值，未深究。
- 五语只抽查 en 与 zh-CN；读屏实际播报、RTL 未查。
- 未核：Icon 与壳层成品板在画布 artifact 上的发布状态；P2 问题 3 的 Icon 板 token 块漂移是否已由 SUB-133 处置；包时 scratch 日志 `logs/r1-p*/` 未逐份读，只读交回物与批末日志。
