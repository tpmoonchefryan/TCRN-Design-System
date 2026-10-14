# R2 批末验收 · 分片 B（STORY-142 至 146；EPIC-045 导航、EPIC-046 品牌与布局）

节行号：1 一览 L11；2 逐 Story L23（2.1 STORY-142 L25、2.2 STORY-143 L40、2.3 STORY-144 L55、2.4 STORY-145 L68、2.5 STORY-146 L81、2.6 质量硬线 L94）；3 返工清单 L109；4 只有 Owner 能定的事项 L176；5 实施口径判定 L185；6 证据盲区 L263

被验对象：集成分支 `claude/init016-tab-shell`，验时 HEAD 7e85eeb；`git diff 6f739b2 HEAD -- packages apps scripts tests docs/design docs/contract docs/verification` 为空，代码与批末 verify（6f739b2）相同；壳层门报告 `docs/verification/shell-measure/report.json` 由 SUB-177 在 5a5cad2 写出，`git diff 5a5cad2 HEAD` 在同一组路径上也为空，所以报告读数就是 HEAD 代码的读数。静态 Storybook 为批末之后的 `storybook:build`（退出 0）产物。

方法只读：读批末日志、回执、门报告、源文件、dist 与静态 Storybook；scratch 里的只读脚本经门自己的静态服务器与路由函数用 Playwright（Chromium）打开静态页、等水合后量 DOM，必要时在浏览器内存里克隆节点量 1440 宽。未改代码、门、回执、链，未重跑门、未构建。Owner 目视不代签。

证据记法：`NN log:行` 为 scratch `r2-verify/` 下的批末逐段日志；`acc/文件:行` 为本分片 scratch `acc-r2-B/` 下的探查输出（脚本在 `acc-r2-B/probe/`）；`壳报告` 为上述 report.json，摘录在 `acc/02-report-gates.txt`（门、检查与 22 条故事变异）、`acc/05-gate-details.txt`（逐 run 失败项）、`acc/16-firstlines.txt`（首行墨迹读数）。

## 1. 一览

| Story | 结论 | 未满足或部分的 GWT | 返工项数 |
| --- | --- | --- | --- |
| STORY-142 图钉位与名册 pin | 部分 | GWT1 部分：实测 rest 与 hover 等宽，`display:none → inline` 变异已判红（带新失败）；但 pinJitter 基线在 8 个菜单 run 全红，红只来自隐藏的「已固定」列里 4 个 0×0 图钉被门计入 | 2（B2-1、B2-2） |
| STORY-143 导航家族归位 | 部分 | 四条 GWT 满足；符合性「C1–C17」未达：contract:static 退出 1（测试不变式过期，门脚本余 C11 34 条）；TocRail 在 h1 页面下标题层级与 nav 名不合 axe | 3（B2-3、B2-4、B2-10） |
| STORY-144 手机 Sheet 与 INC-399 | 部分 | GWT3 部分：INC-399 段 760 与 390 三腿按期，`geometry:proof` 整体退出 1（红在 searchOverlay 段，属分片 A） | 1（B2-5） |
| STORY-145 首行变体与 TMS 后缀 | 部分 | GWT1 部分：8 枚标与 logos2 逐路径相等、brand-asset:proof 0，壳层门 brandDigest 在品牌 story 红（data-logo 用产品键）；GWT2 部分：en 7/8 在 ±1 内（DS 侧栏 1.4，O-4），zh-CN 的 DS 首行被文档换字成「TCRN 设计系统」后读 −1.1 | 4（B2-6、B2-7、B2-8、B2-11） |
| STORY-146 PageHeader 必有与纸内布局 | 部分 | 四条 GWT 满足；符合性「几何门全绿」未达：singleLine 把纸内面包屑整条当一行读，390 设置页与名册页红；geometry:proof 与 geometry:measure 退出 1（红在分片 A、C） | 3（B2-9、B2-5、B2-10） |

返工 11 条：主力 7（B2-1、B2-3、B2-4、B2-5、B2-8、B2-9、B2-10），经济 4（B2-2、B2-6、B2-7、B2-11）。共享项（B2-5、B2-10）计入涉及的每张 Story。R1 本分片的 12 条返工里，B1-2 至 B1-9、B1-11、B1-12 已由 R2 解决，B1-1 的门侧剩 B2-1，B1-10 的门侧剩 B2-6、B2-9，都是新暴露的读法问题。库门为 0（S-1）只影响转态。

## 2. 逐 Story

### 2.1 STORY-142 · NavItem 图钉与名册 pin（SUB-152 K6、SUB-153 K8）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 rest 与 hover 文字盒等宽；`display:none → inline` 变异判红 | 部分 | 实测满足：水合后的 ts-x-l、ts-x-n 各 12 个可见行，真实指针悬停前后 `.tcrn-nav-item__label` 宽差 0（acc/11-pins-summary.txt:10,21）；dark + zh-CN 同为 0（acc/12-pins-dark-zh.json）。变异满足：`story-pin-display-none-inline` 读到 rest 247.3 对 hover 223.3，「red on a red baseline, with a new failure」，ok true（acc/02-report-gates.txt:36）。门不满足：pinJitter 基线 fail，8 个菜单 run 的失败项都只是 `pinButton 0x0`（acc/05-gate-details.txt:1,11）。根因：门读面板里全部 `[data-pin-button]`（`scripts/lib/shell-measure.mjs:404-405`），而 ≥1024 时「已固定」列 `tcrn-shell-menu__col--pinned` 为 display:none，列内 4 个图钉（Roster、Contracts、Statements、Schedule）量得 0×0（acc/11-pins-summary.txt:3-4）；文字宽分组本身全过（B2-1） |
| 2 role button、aria-pressed 与固定态一致、aria-label 含项名 | 满足 | 原生 `<button type=button>`；未固定「Pin to top bar: People」`aria-pressed=false`，已固定「Unpin from top bar: Roster」`true`；zh-CN「固定到顶带：人员」「从顶带取下：名册」（acc/11-pins-summary.txt:2-4，acc/12-pins-dark-zh.json） |
| 3 icons.json 38 且含 pin 描边与实心两态 | 满足 | `07 log:5,29` icon-roster 38；icons.json pin `variants {outline:{fill:[]}, solid:{fill:[0]}}`（acc/24-static.txt:2-3） |
| 4 行获焦不悬停时图钉可见 | 满足 | 键盘模式下 `.tcrn-nav-item` 获焦、`:focus-visible` 为真、指针在外，图钉 opacity 1（acc/11-pins-summary.txt:11；zh-CN 同） |

符合性：槽 24 常驻（行网格 `263.3px 24px`）、钮 24×24、图标 16（acc/22-misc.json `preview`）满足；hover 与 `:focus-visible` 同现满足；可见名五语同源（en、zh-CN 抽查）满足；分组行（People 等三组标题带图钉）、项行、子菜单行（ts-drop-l 下拉 4 行各带 24×24 图钉，acc/27-drop.txt）都可钉满足；触摸端热区 44（Sheet 内图钉 `::after` 44×44，acc/15-mobile.json）满足；名册 38 与 Icon、Typography 板及五语描述同步满足（「37」残留 0，acc/24-static.txt:5-16），实心态按 O-5 默认未画。C-5 行钩子：16 个标签都带 `data-text="prail"` 与 title，图标 svg 带 `data-guide="prail"`，`data-shell-group` 落在组列上（acc/11-pins-summary.txt:5-9）。目的锚「07a 板 B 段 NavItem 行 1:1」有一处偏差：菜单行图标左缘离面板 19，板为 16（文字 48 对齐），因为图标在 22 宽的轨道里居中（`shell.css.ts:448-457`），壳报告 prail 检查在 12 个 run 红 `prail.icon 19`（acc/05-gate-details.txt:3；acc/11-pins-summary.txt:5-6）（B2-2）。

R1 项复核：B1-1 包侧已解决（钩子到位、门以 `.tcrn-nav-item-row` 找图钉、变异改为撤轨道后能判红），门侧留下 B2-1 的新读法问题；B1-2① 已解决（ts-x-l 的 hover 预览行底为 3.5% 墨洗、图钉 opacity 1，acc/28-wash.txt）；B1-3 已解决（件数 38），实心态待 O-5。

Subtask：SUB-152 自报完成，实测达成（钩子存在、单测断言 5 处；`data-shell-group` 落在列上的口径见第 5 节）。SUB-153 自报完成，实测达成。Owner 目视：待 Owner。

### 2.2 STORY-143 · 导航家族归位（SUB-154 K1、SUB-155 K4、SUB-156 K6b、SUB-157 K8、SUB-158 K9）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 每个退役件有弃用导出与迁移步骤 | 满足 | dist `componentLibraryDeprecatedComponentNames` 6 件（acc/24-static.txt 末段）；`docs/migration-4.0.md` M23 逐件「Do instead」，M30 逐件处置表（第 794-846 行） |
| 2 五种旧形同一家族、同一选中态结构，selection:proof 0 | 满足 | `06.12 log:1-8` ok、`tabsFamily.selectedRules 1`；R2 未改 Tabs 家族规则（K4 只把 NavItem、SubNav、TocRail、TreeNav、面包屑改成 pair 写法） |
| 3 TocRail 在纸内；壳内常驻侧栏 0 | 满足 | 文档页 TocRail 在 `[data-paper]` 内，纸外高于 200 的 aside 或 nav 0（acc/22-misc.json `doc:*`）；静态 Storybook 16 个壳屏常驻侧栏 0、收起钮 0、面板关闭钮 0（acc/23-sidebars.json）；壳报告 noCollapse 16 个 run pass（acc/02-report-gates.txt:11） |
| 4 Breadcrumb 在 390 宽一行、截断、有 title | 满足 | ts-settings-m、ts-roster-m：三项同一 top、nowrap、ellipsis、三项都截断且 title 为全文，nav 244 无溢出（acc/20-pages-summary.txt:7-10）；zh-CN 同（第 21-24 行）；壳报告 pageCrumbs pass |

符合性：家族逐件处置记入迁移说明满足（M30：navigation 13 → 10、shell 9 → 11，与 families.json 现值一致；B1-4 解决）；NavGroup、TreeNav 只在面板与下拉里渲染满足（文档页 4 处 TreeNav 全在静态 Popover 下拉里，aria-label 改为「Document tree」等；B1-5 解决，口径见第 5 节 K8-5）；导航项单行截断加 title 满足（不可钉「已固定」组标题也带 title，菜单行标签 16/16 nowrap、ellipsis、title；搜索结果 7/7 带 title，acc/11-pins-summary.txt:7-8；B1-6 解决）；退役件弃用一个小版本并列入 CHANGELOG、包外 tcrn- 类 0（`12 log:29-30` DOC_SHELL_CLASSES_PACKAGE_BACKED）满足；面包屑分隔图标读 `--tcrn-shell-crumb-icon` 满足（K6b）。

不满足：START 质量硬线 C1–C17 对三族全量检查（SUB-155 判据「contract:static 退出 0，或在交回列出余项」）。批末 `13 log:72-104`：`node --test` 一步在 `tests/contract-static-proof.test.mjs:524` 红（不变式「家族有豁免 ⇔ 批次 ≠ scope.batch」仍要求第二批三族有豁免），串联停下，门脚本没在批末跑（B2-3）；按 K6b 包时单跑，C2、C7、C8 已清零，余 C11 34 条：Surface（layout 族，已全量检查）作为 ReadbackPanel（feedback，第 3 批）与 RecordInspector（inspection，第 5 批）的卡外壳再装卡（K6b 交回第 3 节、问题 1）（B2-4）。另：SUB-163 让纸内页标题成 h1 后，TocRail 的书签标题固定 h3，axe heading-order 报「Current page bookmarks」，TocRail 内 nav 无名致 landmark-unique（`docs/verification/internal-alpha/a11y-axe-summary.json`）（B2-10）。K1 问题 6（菜单外 NavItem 不截断）属已弃用 SideNav 等场景，本 Story 不要求，只记。

Subtask：SUB-154 自报完成，实测达成（空态常显只读到代码 `Navigation.tsx:1866-1868`，DOM 未观察）。SUB-155 自报「部分」，与实测一致。SUB-156 自报完成，实测达成。SUB-157 自报完成，实测达成（带条件）。SUB-158 自报完成，实测达成。Owner 目视：待 Owner。

### 2.3 STORY-144 · 手机 Sheet 与 INC-399（SUB-159 K1、SUB-160 K5；token 层粗指针来自 SUB-142 K4）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 390×844 顶带只有标与示意，固定项 0 | 满足 | INC-399 段 760、390 两宽 `pinsShown 0`、标按钮 v1 64×40 在 (12,6)（acc/14-inc399.txt:2）；静态 ts-m-l 可见固定项 0，顶带为标按钮 v1 与铃铛、头像簇（acc/15-mobile.json `fine-light`），与 R1 对板读数一致 |
| 2 打开 Sheet 行高 44；行高改 32 的变异判红 | 满足 | ts-m-s 壳根 `data-state="sheet"`，Sheet 行 44（7 行）、搜索 44、图钉热区 44×44（acc/15-mobile.json）；壳报告 touch 在 shell-mobile 4 个 run pass、`story-sheet-row-32` 判红 `ts-m-s|sheet.row|32`（acc/05-gate-details.txt:13；acc/02-report-gates.txt:43） |
| 3 滚动 2000 后点标按钮 Sheet 打开（INC-399 门退出 0） | 部分 | 行为满足：760 与 390 各三腿基线绿、变异红、复原绿，纸滚 2000、命中标按钮、Sheet 在视口内（acc/14-inc399.txt:2）。退出码不满足：`geometry:proof` 退出 1（`runs/r2/verify/steps.md` 第 10 步），红在 searchOverlay：openMenus 14 = 14、overlayCount 1，但结果框与纸内「Roster」标题与首段相交 2 处，基线、变异、复原三次都红（acc/14-inc399.txt:3-4；K11 问题 1），不在本分片（B2-5） |
| 4 夜间与浅色同一选择器属性集只换值 | 满足 | `shell-sheet.css.ts` 无主题选择器、无颜色字面量（acc/24-static.txt「sheet css」段为空）；浅夜两主题读数相同（acc/15-mobile.json `fine-dark`）；`06.02 log` tokens-sync `--check` 0（粗指针块与主题块次序也在断言内） |

符合性：标按钮 390 宽高 40、Sheet 行与搜索 44、固定项不在顶带、滚动后可开、移动块纸与顶带几何同 token（纸 12/52/12、圆角 14、顶带 52）满足；Sheet 打开时壳根报 `sheet` 满足（B1-8 解决）；粗指针下 `:root --tcrn-shell-row-h` 为 44、桌面完整菜单行与搜索 44（acc/15-mobile.json `coarse-desktop-menu`；B1-2② 解决）；静态 ts-m-s 呈现 Sheet（B1-7 解决）。

Subtask：SUB-159 自报完成，实测达成（DOM 测试 `test:dom` 不在 verify 链里，见第 6 节）。SUB-160 自报「部分」：本 Story 相关的 ts-m-s 已达成，余项（AOS 壳标题裁切）不在本分片。Owner 目视：待 Owner（Sheet 现在文档站 ts-m-s 可见）。

### 2.4 STORY-145 · ProductLockup 首行变体（SUB-161 K11 story 侧、SUB-164 K10 门侧；首行写法来自 SUB-143、SUB-144 K1）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 四枚产品首行的标 digest 等于 logos2 | 部分 | 资产满足：品牌 story 八枚首行的 svg 路径与 `logos2/{tms,einzbern,mana,ds}.svg` 逐条相等（acc/18-brand-summary.txt:3-10，`match=`）；`14 log:7-8` BRAND_ASSET_SOURCE_VERIFIED，`firstLineMatches true` 8/8（`14 log:176-211`）。门不满足：壳报告 brandDigest 只在品牌 story 的 4 个 run 红，Mana 与 DS 两枚 `mark.source` 与 `lockup.reference`（acc/05-gate-details.txt:18）：包件 `data-logo` 写产品键（`mana-orchestrate`、`design-system`，`Navigation.tsx:630,717`），门按 `logos2/<data-logo>.svg` 与 Brand 板 `data-logo="ds"` 找参照（K10 问题 3）（B2-6） |
| 2 字标墨迹中线与标中线差 ≤ 1；padding-top 4 变异判红 | 部分 | 门已读本件（B1-10 解决）：en 下 TMS 0.1 / −0.6、Einzbern −1.0 / −0.5、Mana −0.9 / −0.5、DS **1.4** / 1.0（侧栏 / 锁定块，acc/16-firstlines.txt:1-2），DS 侧栏超 ±1，待 O-4；变异 `story-word-padding-top-4` 判红 `lkr-line@22:tms 2.1`（acc/02-report-gates.txt:33）。新问题：zh-CN 下 DS 两枚读 −0.3 / **−1.1**（acc/16-firstlines.txt:3-4），原因不是字体回退：文档页运行时换字把 DS 首行的 `b` 改成「TCRN 设计系统」（title 一并改），汉字由 Noto Sans SC 绘制（acc/18-brand-summary.txt:27-28）；换字的跳过选择器只认 `.tcrn-shell-brand__word`、`.tcrn-product-logo__line-one`、`.tcrn-brand-wordmark`，不认首行的 `.tcrn-brand-lockup__word`（`apps/storybook/src/build/client-scripts.ts:310`）（B2-7） |
| 3 夜间 TMS 后缀 #2c63c8，矩阵格标红并注明待裁 | 满足 | 两主题首行 TMS 后缀 rgb(44,99,200)（acc/18-brand-summary.txt:3-4,12-13）；`06.05 log:52-53` 夜间 3.13 / 3.33 exempt 并引 D2、D7；matrices.json `brand-suffix-n`、`brand-suffix-open-n`、`lk-em-n` 墨 #2c63c8、`exempt false`（`docs/design/gplus-2026-10/contract/matrices.json:309,312,336`） |
| 4 brand-asset:proof 退出 0 | 满足 | `runs/r2/verify/steps.md` 第 14 步退出 0；`14 log:7-8` |

符合性：只把第一行与标居中、不重排、不改字重、不改颜色满足——侧栏 12.5/600 行高 15、锁定块 16/600/20 −0.08px、衬线 13.5、18/400，后缀 TMS #2c63c8、DS #6577f3；`b` 新加上下各 2 的内距，盒中线与标中线相等（11 / 22），行高仍是标高 22 / 44，未见 2 / 3px 下移（acc/18-brand-summary.txt:3-10）；后缀 `em` 不再越出 `b`（上下 −1 / −1 与 −1 / −2，负值即在盒内），`geometry:measure` clip pass（`18 log` summary），B1-9 解决；底栏锁定块标带 `data-logo`、lockupDecor pass、壳 story 的 brandDigest pass（B1-12 解决）；ShellBrandButton 夜间断言改同色，ui-react 单测 246/246（`05 log:308-311`，B1-11 解决）。不满足：品牌 story 的 DS 侧栏首行后缀被 axe color-contrast 报出（`a11y-axe-summary.json`），豁免表 `AXE_WORDMARK_SUFFIX_SELECTORS` 不认 `.tcrn-brand-lockup__suffix`（`scripts/internal-alpha-browser-proof.mjs:94`）（B2-8）；设计文档 `docs/design/gplus-2026-10/README.md:11` 与 `storybook-map.md:33,136` 仍写 TMS 夜间后缀 #7aa0f5（K9 问题 4）（B2-11）。完整菜单底栏两行锁定块 `lkr` 在 en 读 1.7（标语下行字母），见 2.6 第 7 条。

Subtask：SUB-161 自报完成，实测达成（八枚首行与四屏按 manifest 出值，四条新变异判红）。SUB-164 门侧见 2.5。Owner 目视：待 Owner（品牌 story 可看；zh-CN 需 B2-7 后再看）。

### 2.5 STORY-146 · PageHeader 必有与纸内布局（SUB-162 K1、SUB-163 K6、SUB-164 K10）

| GWT | 结论 | 证据 |
| --- | --- | --- |
| 1 不传 PageHeader 类型检查报错；传入则纸内首行是它 | 满足 | dist `Navigation.d.ts:662` `pageHeader: PageHeaderProps` 必填；`Navigation.test.tsx:551,558` 两处 `@ts-expect-error`，`02 log` typecheck 退出 0；四个页面屏、收起屏与文档页的纸内首个子元素都是 `header.tcrn-page-header`（acc/20-pages-summary.txt:1-14） |
| 2 面包屑在 390 与 1440 宽一行、截断、有 title | 满足 | 宽屏：三项同一 top、nowrap、ellipsis、title 全文，放得下所以不截；390：三项同一 top、全部截断带省略号与 title（acc/20-pages-summary.txt:1-10）；壳报告 pageCrumbs 全 run pass、`story-crumbs-spill` 判红（acc/02-report-gates.txt:22,45） |
| 3 SettingsLayout 1440 宽内容 ≤ 1040 且居中 | 满足 | 故事屏 ts-settings-l 的壳只有 1006 宽，内容 926、左右各 28；在内存里克隆到 1440 宽：内容 1040、离纸左右各 188（acc/21-wide.json）；壳报告 settingsLayout pass、`story-settings-max-width-none` 判红（acc/02-report-gates.txt:23,46） |
| 4 SplitView 左缘 = 纸内容左缘 | 满足 | 1440 克隆：左缘距纸 28 = 纸内容左缘 28，宽 1360（acc/21-wide.json）；390：16（acc/20-pages-summary.txt:9）；壳报告 splitView pass、`story-split-rail-240` 判红（acc/02-report-gates.txt:24,47） |

符合性：PageHeader 必有靠 prop 类型满足；面包屑任何宽度一行截断加 title 满足；三种布局从纸缘起算、文档与设置页 1040 居中满足；纸内页头对齐板 `.ph` 满足（标题行间距 14，页头底线 1px line-2 即 rgba(22,21,15,.16)，标题 Source Serif 4、26、400，acc/20-pages-summary.txt、acc/21-wide.json）；板 h2 行高 1.1（28.6）无 token，包保持 30（K1 问题 4，交 Owner）；纸内标题默认 h1、页内壳传 2，h1 与 h2 读数相同（文档页 h1 与故事屏 h2 同为 Source Serif 4 26/400/30）。不满足「几何门全绿」：壳报告 singleLine 在 shell-mobile en 两个 run 红 `cut:nav.tcrn-breadcrumb` 50.6 与 18.3（acc/05-gate-details.txt:12），同屏 pageCrumbs 却判每段按规矩截断，是 singleLine 把整条面包屑当一个单行载体读（K10 问题 4、K11 问题 3）（B2-9）；`geometry:proof` 退出 1（searchOverlay，B2-5）；`geometry:measure` 退出 1，红是 typography、inputs 两个样板的内容伸出 640 画框（`18 log` summary overlap fail；K12 问题 7，分片 C）。另 h1 与 TocRail h3 的 heading-order 见 B2-10。

Subtask：SUB-162 自报完成，实测达成（行高停下条件见上）。SUB-163 自报完成，实测达成，带出 B2-10。SUB-164 自报完成（门侧），实测达成：三项新读数与四条变异都在真件上出值并判红，夹具与两份单测 0（K10 交回第 3 节；`18 log` 前段 71/71）；门侧另有 B2-6、B2-9 两处读法问题。Owner 目视：待 Owner。

### 2.6 START 质量硬线逐条核（壳层八条）

| 硬线 | 结论 | 证据与备注 |
| --- | --- | --- |
| 壳内常驻侧栏与收起钮 0 | 满足 | 16 个壳屏与文档壳：侧栏 0、收起钮 0（acc/23-sidebars.json、acc/22-misc.json）；noCollapse 16 run pass，`story-x-button-back` 判红（acc/02-report-gates.txt:11,35） |
| 顶带无底无线，中线 26 | 满足 | strip、brandGeometry 全 run pass；`story-strip-bottom-line`、`story-brand-top-0`（tab.mid 20）判红（acc/02-report-gates.txt:2,4,26,28） |
| 三处间距相等 | 满足 | pinSpacing pass；`story-pins-left-line` 判红（第 6、30 行） |
| 接续 6 | 满足 | continuation pass（R1 的 drop.search 260 已消）；`story-menu-top-60` 判红（第 7、31 行） |
| 锁定块只装饰 | 满足 | lockupDecor pass；`story-lockup-as-button` 判红（第 13、37 行） |
| 品牌资产 digest | 部分 | 壳 story 的 20 个 run 全 pass（shell-top-band 每 run 33 处）；品牌 story 因 data-logo 命名红（B2-6） |
| 标旁文字墨迹中线 = 标中线（±1） | 部分 | 标按钮首行过；DS 侧栏首行 1.4（O-4）；底栏两行锁定块 `lkr` TMS 在 en 读 1.7（标语 g、y 的下行部，K10 问题 1，同 O-4）；zh-CN DS −1.1 由换字造成（B2-7） |
| 登入动画只用 transform 与 opacity | 满足 | `ShellIntro.tsx:145-151` 关键帧只有 opacity 与 transform，`shell-intro.css.ts` 无 transition、animation；水合后 intro 门 pass，`story-intro-no-session-marker` 判红（第 17、41 行） |

第一批硬线与本分片相关的两条：「任何元素不超出裁切祖先」本分片件满足（首行 em 在 b 内，geometry:measure clip pass）；「导航项单行截断加 title」菜单内满足。

## 3. 返工清单

**B2-1 · pinJitter 把隐藏列里的图钉计入（STORY-142 GWT1；149）**
- 现象：≥1024 时「已固定」列 display:none，列内 4 个图钉量得 0×0，门报 `pinButton 0x0`，8 个菜单 run 的 pinJitter 基线因此全红；文字宽比较本身全过。
- 证据：acc/05-gate-details.txt:1,11；acc/11-pins-summary.txt:3-4；`scripts/lib/shell-measure.mjs:404-405`（`panel.querySelectorAll(sel.pinButton)` 不滤隐藏）；`scripts/shell-measure-proof.mjs:441-443`。
- 建议改法：读数只收渲染出来的图钉（`getClientRects().length > 0` 或 `checkVisibility()`），文字宽分组同样跳过隐藏行；夹具加一列 display:none 的已固定行，自检证明不再误红，原变异仍判红。
- 改动文件：`scripts/lib/shell-measure.mjs`、`tests/shell-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/shell/package-menu.html`。建议档位：主力（门的读数语义）。可能与分片 C（149）重复。

**B2-2 · 菜单行图标离面板 19，板为 16（STORY-142 目的锚；138、149 prail）**
- 现象：引导列图标轨道宽 `icon-md + space-1h` = 22，图标在轨道里居中，左缘 = 列 8 + 内距 8 + 3 = 19；文字 48 已对。prail 检查 12 个 run 红。
- 证据：acc/11-pins-summary.txt:5-6；acc/05-gate-details.txt:3；`packages/ui-react/src/styles/shell.css.ts:448-457`；`story-guide-icons-right-4` 变异能判红（acc/02-report-gates.txt:44）。
- 建议改法：菜单列里的行图标 `justify-self: start`（轨道仍 22，文字仍 48），或把轨道拆成 16 加列间距 16；补一条行几何单测。
- 改动文件：`styles/shell.css.ts`、`Navigation.test.tsx` 或 `ShellMenu.test.tsx`。建议档位：经济。可能与分片 A（138）、C（149）重复。

**B2-3 · contract:static 的测试不变式在删豁免后过期（STORY-143 C1–C17；140、146）**
- 现象：`tests/contract-static-proof.test.mjs:524` 仍要求「非 scope.batch 的家族都有豁免」，第二批三族豁免按 R2-12 删除后恒红，`run contract:static` 停在 `node --test`，门脚本不在批末执行。
- 证据：`13 log:72-104`；K4 问题 5、K6b 问题 2；`docs/contract/families.json:3-5`（说明已写「其它家族只有登记时才豁免」）。
- 建议改法：families.json 的 scope 增列「已到期、全量检查的批次」（例如 `checkedBatches: [1, 2]`），validateExemptions 与该测试按它判：在列批次不得有豁免、不在列批次须有豁免；第 517 行的五族断言随之改成按 checkedBatches 取。
- 改动文件：`tests/contract-static-proof.test.mjs`、`scripts/contract-static-proof.mjs`、`docs/contract/families.json`。建议档位：主力（门契约与判定语义）。

**B2-4 · C11 卡套卡 34 条记在 layout 族（STORY-143、146 符合性）**
- 现象：Surface（layout）被 ReadbackPanel（feedback，第 3 批）与 RecordInspector（inspection，第 5 批）用作卡外壳，story 再往里放卡，门按类名把 34 条记到已全量检查的 layout 族。
- 证据：K6b 交回第 3 节与问题 1；K4 问题 8。
- 建议改法：判断先定归属。(a) C11 卡套卡按外层组件的家族记（ReadbackPanel 记 feedback、RecordInspector 记 inspection，二者仍豁免），layout 族自身清零；(b) 改 ReadbackPanel 与 RecordInspector 不以 Surface 卡呈现，越过 §3.3「不碰第三批」，需 Owner 授权。建议 (a)，同时在豁免条目上写明这 34 条随第 3、5 批到期。
- 改动文件：(a) `scripts/contract-static-proof.mjs` 与其测试；(b) `Feedback.tsx`、`DomainDisplay.tsx` 与相关 story。建议档位：主力。

**B2-5 · geometry:proof 的 searchOverlay 基线碰撞（STORY-144 GWT3、146 几何门；分片 A 主属）**
- 现象：结果框在完整菜单面板里，面板按 07a 盖在纸上，结果框与纸内标题、首段相交 2 处，基线、变异、复原三次都红，整步退出 1，INC-399 段虽全绿也拿不到退出 0。
- 证据：acc/14-inc399.txt:3-4；K11 问题 1（探针 `15-probe-alt.json`：只计面板外交集时基线 0、变异 1）。
- 建议改法：按 K11 问题 1，碰撞只计结果框与纸内文字的交集落在结果所在面板之外的部分；补一条红绿可分的自检。
- 改动文件：`scripts/geometry-proof.mjs`。建议档位：主力（门判定语义）。与分片 A 同根，判断合一。

**B2-6 · 首行与受测锁定块的 data-logo 写产品键，门与板用标的 id（STORY-145 GWT1；硬线「品牌资产 digest」）**
- 现象：Mana、DS 两枚 `data-logo` 为 `mana-orchestrate`、`design-system`，logos2 文件与 Brand 板是 `mana`、`ds`，品牌 story 4 个 run 的 brandDigest 红；TMS、Einzbern 两名相同不受影响。
- 证据：acc/05-gate-details.txt:18；acc/18-brand-summary.txt:3-10（路径本身与 logos2 相等）；`Navigation.tsx:630,717`（同一处已有 `asset.markId`）；K10 问题 3、K11 问题 5。
- 建议改法：包件两处 `data-logo` 改写 `asset.markId`（与板一致，不动门口径）；`test/shell-intro.dom.spec.tsx` 等按 `data-logo='tms'` 选的地方不受影响，按产品键选 Mana、DS 的测试同步改；迁移说明 M36 追加一句。
- 改动文件：`Navigation.tsx`、`Navigation.test.tsx`（必要时 `docs/migration-4.0.md` 追加）。建议档位：经济。

**B2-7 · 文档运行时换字改写了首行字标（STORY-145 GWT2；品牌资产只取通过稿）**
- 现象：zh-CN 页把 DS 首行的「TCRN Design System」换成「TCRN 设计系统」，title 同改，汉字落到 Noto Sans SC，门读 −1.1 / −0.3；TMS、Einzbern、Mana 词典里没有译文，所以没被改。
- 证据：acc/18-brand-summary.txt:27-28；acc/16-firstlines.txt:3-4；`apps/storybook/src/build/client-scripts.ts:310`；首行字标类 `tcrn-brand-lockup__word`（`Navigation.tsx:723`）；HTML 源里仍是英文。
- 建议改法：跳过选择器加 `.tcrn-brand-lockup__word`（属性同样跳过），locale-invariant 台账同步认这一类；复读 zh-CN 的 markText。
- 改动文件：`apps/storybook/src/build/client-scripts.ts`（必要时 `scripts/lib/locale-invariant-ledger.mjs`）。建议档位：经济。与分片 C（SUB-166 换字跳过范围）同族。

**B2-8 · 首行后缀不在 axe 字标豁免里（STORY-145 符合性）**
- 现象：品牌 story 的 DS 侧栏首行后缀 `em.tcrn-brand-lockup__suffix` 被 axe color-contrast 报出（#6577f3，D2 已裁为字标豁免），豁免选择器只认三类。
- 证据：`docs/verification/internal-alpha/a11y-axe-summary.json` 的 color-contrast 节点；`scripts/internal-alpha-browser-proof.mjs:94`；K11 问题 6。
- 建议改法：豁免选择器加 `.tcrn-brand-lockup__suffix`，理由同 D2；不建议给 em 加 `.tcrn-brand-wordmark__suffix` 基类（该规则带 `color: ink`、flex 与字重，会改首行外观，`brand.css.ts:64-70`）。
- 改动文件：`scripts/internal-alpha-browser-proof.mjs`。建议档位：主力（门豁免范围；C-7 只授权到 `.tcrn-shell-brand__suffix`）。

**B2-9 · singleLine 把纸内面包屑整条当单行载体读（STORY-146 几何门；143 GWT4 门侧）**
- 现象：面包屑按设计逐段让位、每段省略号加 title，pageCrumbs 判过；singleLine 却把整条 nav 当一个载体，被截段的文字区伸出 nav 盒、nav 自身无省略号，于是 ts-settings-m 50.6、ts-roster-m 18.3 判红。同门的 `story-label-plus-40` 因标签已全部截断带 title 而成等价变异，stays pass（acc/02-report-gates.txt:39；K10 问题 5）。
- 证据：acc/05-gate-details.txt:12；K10 问题 4、K11 问题 3。
- 建议改法：singleLine 的 textLines 不再收 `sel.pageCrumbs`（由 pageCrumbs 判），或改收每段（`pageCrumb` 键）；`story-label-plus-40` 改选一段不截断的文字或强制 `white-space: normal`，在页夹具上证明判红。
- 改动文件：`scripts/lib/shell-measure.mjs`、`tests/fixtures/geometry-measure/shell/mutations.json`、`tests/shell-measure-proof.test.mjs`。建议档位：主力（门读法）。

**B2-10 · TocRail 在 h1 页面下的标题层级与 nav 名（STORY-143 页内空间、146 h1）**
- 现象：纸内页标题默认 h1 后，TocRail 书签标题固定 h3，axe heading-order 报出；TocRail 里的 nav 无名，与同页其它 nav 撞名，landmark-unique 报出。
- 证据：`docs/verification/internal-alpha/a11y-axe-summary.json`（`h3[title='Current page bookmarks']`、`aside[aria-label='当前页书签'] > nav`）；K11 问题 7、8。
- 建议改法：TocRail 加可选标题层级（默认 3，文档页传 2），nav 取标题文字作可及名；补单测。
- 改动文件：`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`（TocRail 所在文件，按 grep 现读）、对应测试、`apps/storybook/src/build/page-template.tsx`。建议档位：主力（导出件的 prop 面）。与分片 C（147）可能重复。

**B2-11 · 设计文档仍写 TMS 夜间后缀 #7aa0f5（STORY-145 符合性「两主题同色」）**
- 证据：`docs/design/gplus-2026-10/README.md:11`（「TMS 后缀带夜间值 #7aa0f5…按主题写进浅色块与夜间块」，另写已退役的 rail-w 三条）；`docs/design/gplus-2026-10/storybook-map.md:33,136`（O-3 行与 DIFF-10）；K9 问题 4。标的 SVG 里亮色笔画 #7aa0f5 是资产本身，不在此列。
- 建议改法：两处改成两主题同色、夜间取值待 D7，壳层 token 改为顶带 token；storybook-map 的 O-3 行标为已撤回。
- 改动文件：上两文件。建议档位：经济。与分片 C（R2-29 余项）可能重复。

## 4. 只有 Owner 能定的事项

- **O-4 扩展（沿用，补新读数）**：墨迹中线遇到下行字母不只 DS 侧栏首行 1.4，完整菜单底栏两行锁定块 `lkr`（TMS，标语「Talent Management System」）在 en 读 1.7、zh-CN 1.0。建议同一口径：只量首行「大写顶到基线」，两行锁定块也按首行量；不裁时照记红，不放宽。
- **新 · 纸内页标题行高**：板 `.ph h2` 行高 1.1（26 号即 28.6），无对应 type token，包保持 `--tcrn-type-line-heading-2` 30（K1 问题 4）。建议接受 30（字形其余一致，加 token 属 type scale，§3.3 不新增）。
- **新 · TreeNav 的归宿**：包的 ShellMenu 与 ShellDropdown 由菜单模型渲染，放不进 TreeNav；文档用通用 Popover 当下拉演示。Story「TreeNav 进完整菜单与下拉」按此只算「消费方自建的下拉」。建议接受，在 M22 / M30 写明壳菜单与下拉的行一律来自模型，TreeNav 只用于消费方的下拉或浮层；若要壳下拉能装 TreeNav，属新 API。
- **新 · C11 卡套卡的授权（随 B2-4）**：若判断不取 (a) 而取 (b)，要改第 3、5 批组件，越过本 INIT 授权。建议取 (a)，不需 Owner。
- **沿用未裁**：O-5（pin 实心态，Icon 板未画）、O-6（触摸端未固定行图钉平时不显）、O-8（夜间后缀 3.13 / 3.33 / 3.07，D7）、O-9（AOS 无标，占位）。
- **目视（机器结论见第 2 节，未代签）**：142 图钉 hover、已固定、获焦三态（文档站 ts-x-l）；143 Tabs 五形、11 号面包屑分隔图标、TreeNav 在下拉里；144 手机 Sheet（ts-m-s 已可看）；145 品牌 story 八枚首行两尺度（zh-CN 待 B2-7）；146 纸内页头（间距 14、line-2 底线、h1 与 h2 同字形）、设置页 1040 与名册页 SplitView 四屏。

## 5. 实施口径判定

只判本分片 Subtask 与本分片 Story 直接受影响的条目，其余 Subtask 的条目由分片 A、C 判。

K1（SUB-154、SUB-159、SUB-162；连带 145 的 SUB-143、SUB-144 首行部分）：
1. SUB-143 夜间后缀断言改同色并记 3.07、D7 pending：可接受（ui-react 246/246）。
2. SUB-143 首行字标 `inline-size: max-content; max-inline-size: calc(100% + space-0h / 2)`，「最多越出 1」：有条件——八枚首行实测都不截断、`b` 右缘贴行右缘、不越界；条件是 O-1 裁长字标后复核，越出的 1px 不得落进裁切祖先。
3. SUB-143 两处 `b` 加上下各 space-0h 内距，不移字形：可接受（盒中线等于标中线，行高不变，em 不再越出）。
4. SUB-143 首行 `b` 补 title：可接受（只加属性）。
5. SUB-144 ProductLogo 改 `b > em` 加 `small`、类名不变：可接受（lockupDecor pass）。
6. SUB-144 侧栏档选择器加 `[data-lockup="lkr"]`、删菜单副本：可接受。
7. SUB-144 `data-logo` 只在带 data-lockup 的彩色标上出：有条件——条件限制合理（避开登入卡），但值写产品键，与 logos2 和板不一致（B2-6）。
8. SUB-154 不可钉标题包 span 并在 base.css.ts 补 `display:block`：可接受（标题截断带 title）。
9. SUB-154 结果链接 title「标题 — 说明」：可接受（7/7）。
10. SUB-154 空态常显：可接受（代码已改，DOM 未观察）。
11. SUB-154 可钉行标签 title 与菜单内单行截断：可接受；菜单外未覆盖（K1 问题 6）不属本判据。
12. SUB-159 壳根 sheet、面板仍 expanded、prop 面不变，SSR 经 context：可接受（ts-m-s 读 sheet）。
13. SUB-162 间距 14、底线 line-2、字形按 `.tcrn-heading--2`、行高无 token 时停下：可接受（停下条件照做，交 Owner）。

K4（SUB-155；连带 144 的 SUB-142）：
1. 三条 token 按 C-2 默认名：可接受（名属 B 类）。
2. 粗指针块写在 token 表、紧跟主题无关块：可接受（粗指针下根值 44，菜单行与搜索 44）。
3. 块解析认一层 `@media`，C5 只比顶层块：可接受（tokens-sync `--check` 0）。
4. C10 扫描进 shell-fidelity：可接受（06.10 0）。
5. pair 变量名：可接受。
6. roles.json 登记 `tcrn-shell-strip` 为壳条、families.json Shell 增此块：有条件——新登记，读数无新发现，判断可改回。
7. scope.batch 仍为 1：有条件——为保住另一条断言没改测试，代价是 contract:static 恒红且无持有者；条件是 B2-3 一并改不变式。

K5（SUB-160）：
1. ts-m-s 设 `presentation: "sheet"`：可接受（壳根 sheet、行 44、touch 判红可区分）。
2. 桌面板开屏一律 panel、闭合屏跟视口（O-11 默认）：可接受。
3. AOS 等加定高 640 画框、壳经 style 填满：可接受（story 层，不改壳）。
4. AOS 读回标占位（O-9 默认）：可接受。

K6（SUB-152、SUB-163）：
1. `data-shell-group` 留在组列上，按「标题行所在的列接收」：可接受（门按列的直接子元素取标题行，读数可用），注释已写明。
2. `headingLevel` 运行时只认 1，其余为 2：可接受。
3. Typography.test.tsx 越出文件集改一行：可接受（派工点名）。

K6b（SUB-156）：
1. 兜底焦点规则移到 shell.css.ts 末尾而非原地降级：可接受（逐停读数不变）。
2. 焦点 pair 跟主题声明：可接受（深色子树差异归零）。
3. 删去从未生效的语言触发器规则：可接受。
4. 新类名 `__lead`、`__description`：可接受（B 类）。
5. baseCss09 留空段：可接受。

K8（SUB-153、SUB-157）：
1. 件数由 ICON_NAMES 出：可接受（37 残留 0）。
2. 只重生件数行、板内 token 块漂移行留 HEAD 字节：有条件——漂移仍在，交设计会话发布时须知悉。
3. heights.json 不改：可接受（实测自然高不变）。
5. TreeNav 放进包的 Popover 当下拉：有条件——文档演示成立，页内不再有 TreeNav 导航列；壳的菜单与下拉放不进 TreeNav，「进完整菜单与下拉」只按消费方下拉成立，交 Owner（第 4 节）。

K9（SUB-158）：
6. contract README 六板、38、规则条数改为「须等于 ruleOrder 条目数」：可接受。
7. M9 就地改并在文末注明例外：可接受（拆分问题第 9 条授权）。
8. CHANGELOG 摘要追加 M30–M37：可接受（K9 文件集内，只追加）。
9. 迁移条目照录各包：可接受（M30–M37 在，M30 表与 families.json 现值一致）。

K10（SUB-164）：
1. pageCrumbs 按段读，「有 title」判为被截段有 title：可接受（包件每段都带 title）。
2. settingsLayout、splitView 标 `boards: false`，在页夹具证明：可接受。
3. 分栏内距取 07b 的 28 / 16：可接受（真件读 28 / 16）。
4. 品牌 story 按 (data-lockup, data-product-id) 依序比对：可接受；门按 `data-logo` 找 logos2 的另一处见 B2-6。
5. markText 失败键「壳:类型@尺寸:产品」：可接受。
6. padding-top 4 变异叠在 space-0h 上：可接受（判红 2.1）。
7. all.green.html 退出 rail、rail 引导列作独立部件：可接受。
8. story 缺失时变异记 not run：可接受（批末已无缺失）。
9. `runPackageFixture` 按 spec 跑：可接受。

K11（SUB-161）：
1. 改文件集外的 `shell-hydrate.tsx`：可接受（通告指明）。
7. 设置页与名册页内容（SplitView 而非 TableShell）：可接受（390 不溢出）。
8. 品牌 story 条目放回 story-content.tsx：可接受。
9. 设置页变异改为撤上限并设 1160 宽：可接受（只改变异输入，判定未动）。
10. 台账与类目计数：可接受（storybook 12/12）。

不可接受：无。

## 6. 证据盲区

- 摘录第 4 节点名的主线程问题清单 `runs/r2/problems/main.md` 不存在，未读到主线程的集成与交 Owner 项。
- 批末 `contract:static` 停在测试一步，门脚本未执行；C11 34 条只有 K6b 的包时读数。
- 批末 `geometry:measure` 停在 `geometry-measure-proof`（overlap），壳层两段未在 verify 里跑；本报告用 SUB-177 写出的壳报告（代码与 HEAD 相同）。
- `test:dom` 不在 verify 链：SUB-159 的 DOM 测试只有包时读数，本报告以水合静态页读数代替。
- 搜索空态只读到代码；Sheet 的下一级与夜间遮罩仍是设计待定（O-15），未量。
- 只用 Chromium，粗指针为仿真；五语只抽 en 与 zh-CN；读屏播报、RTL 未查。
- 故事屏「1440」的壳只有 1006 宽，1440 读数来自浏览器内存克隆，不是门的读数；门的 1040 证明在页夹具（1240 宽）上。
- 顶带中线、间距、接续只引门的 pass 与变异，未逐值重量；07a、07b 板未逐字节复读，prail 的 16 / 48 取自 R2-27 与门的板读数。
- 未核画布 artifact 的发布状态与 Icon 板 token 块漂移（K8 第 2 条）。
