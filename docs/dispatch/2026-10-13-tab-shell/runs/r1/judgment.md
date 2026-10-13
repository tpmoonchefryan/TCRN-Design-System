# R1 判断 · TCRN-DS-INIT-016（STORY-135 至 150）

节行号：§0 L5；§1 L16；§2 L39（G1 L43、G2 L105、G3 L155、G4 L189、G5 L219、G6 L272、2.7 L283）；§3 L302（3.1 L304、3.2 L324、3.3 L330、3.4 L338、3.5 L385）；§4 L393（4.1 L395、4.2 L437、4.3 L441、4.4 L462、4.5 L467、4.6 L477）；§5 L483

## 0. 依据与判断补查

- 依据：三片验收、`runs/r1/problems/`（按条读）、cross-notes 与 scratch `r1-verify/` 红段日志；代码同批末 verify 的 63e1ee2。没跑门、没构建、没写链。
- 只读补查（scratch `judge-r1/`），结论已写进条目：
  1. 停用 `.story-body` 比对副本后读数全部合板：菜单行 12.5、组标题 10 / 500 ink-3、chevron ink-3、下拉搜索 228×28、菜单搜索 936×40；副本在时是 12、11 / 600 ink-2、260（`probe-j1.out`、`probe-j3.out`）。C1-15、P12-5 与 A1-5 同根，包件 CSS 不改。
  2. 30.02 三项未归因的红：settings 23 例全红在 noHiddenOverflow（设置布局里 3 个 `span.tcrn-tabs__label` 带 C7 截断样式，未截断、有 title）；storyCoverageManifest 红在 railReachabilityCheck（无侧栏）、localeRouteCheck（缺「变更日志」）与 111 页 categoryAriaFailures；proof-visual-instances 三视口各 8 处 AOS 壳标题被判裁切（`bp/analyze.out`、`bp/cmp.out`、`probe-j2.out`）。
  3. 30.03 scan 红是回执超限：上限 1,000,000 字节（`no-private-input-scan.mjs:18`），summary 由 466,652 涨到 1,080,003，主因 sidebarNoIconLabelReadbacks（34 KB → 360 KB）；只修 C1-6 仍约 1,026,000。批末 browser-proof 跑完了，日志无 timeout。
  4. 潜伏红：`package-contract-manifest.mjs:239–243、355` 要求源码里仍有 `tcrn-doc-header` 等四个旧标记，现只剩在过期的 `ai-consumption-contract.ts` 与 `smoke.test.ts` 里；C1-8、C1-11 删字后 30.01 翻红。
  5. `exemptions.json` 的 EX-INIT015-navigation、-shell、-layout 的 until 是「该家族所在批次开工时删除本条」；本 INIT 即第二批，三条仍在。
  6. axe scrollable-region-focusable 2：`section.tcrn-product-shell__main` overflow auto、无可聚焦后代、无 tabindex。

## 1. R1 结论表

| Story | 验收结论 | 机器判据是否已满足 | R2 返工项 | Owner 目视项（R2 后） |
| --- | --- | --- | --- | --- |
| 135 壳 token | 部分 | 否：GWT4 tokens:proof 红（字体子集、fidelity）；同源测试红 | R2-1、R2-11、R2-21、R2-36 | 无 |
| 136 标按钮 | 部分 | 否：GWT3 夜间 3.07 待 D7；GWT4 门红；D2 文案原样不满足 | R2-2、R2-3、R2-11、R2-22 | 两版、hover/open、390；长字标 O-1 |
| 137 固定项 | 部分 | 否：GWT5 对比度门未证 | R2-14、R2-18、R2-27 | 固定项、选中、1023 已固定 |
| 138 完整菜单 | 部分 | 否：文档页被副本盖坏；锁定块钩子；GWT4 门红 | R2-4、R2-5、R2-18、R2-22 | 菜单、底栏锁定块 |
| 139 下拉与级联 | 部分 | 否：文档页下拉搜索 260；GWT4 门红 | R2-18、R2-22 | 下拉与级联（O-3） |
| 140 ProductShell 顶带态 | 部分 | 否：GWT3 无拖排；parity、geometry:proof 红；O-1 残留 | R2-6、R2-7、R2-8、R2-10、R2-14、R2-15、R2-17、R2-18、R2-24 | 顶带壳、头像菜单、铃铛、拖排 |
| 141 登入动画 | 部分 | 否：组件层满足，静态页 intro 门红 | R2-22 | 登入动画 |
| 142 图钉与 pin | 部分 | 否：GWT1 门 n/a、变异不判红；Icon 板写 37 | R2-5、R2-13、R2-18、R2-27、R2-31 | 图钉三态（实心态 O-5） |
| 143 导航家族 | 部分 | 否：四条 GWT 满足；迁移逐件、TreeNav、C7 title、豁免到期 | R2-5、R2-12、R2-30、R2-33 | Tabs 五形、面包屑 |
| 144 手机 Sheet | 部分 | 否：GWT2 变异不可区分；GWT3 geometry:proof 红；无 sheet 态 | R2-6、R2-11、R2-22、R2-23、R2-24 | 手机 Sheet |
| 145 首行变体 | 部分 | 否：GWT2 DS 1.4、门未量本件；后缀越界 1px | R2-2、R2-3、R2-4、R2-28、R2-29 | 四枚首行两尺度 |
| 146 PageHeader 与纸内 | 部分 | 否：四条 GWT 满足；几何门红、无门读本件 | R2-9、R2-16、R2-28 | 纸内页头、1040 设置页 |
| 147 文档壳 | 部分 | 否：GWT1–4 读数满足；parity 红，换壳带出 06.10、17、28、30.02 红 | R2-16 至 R2-26、R2-29 | 文档站整体 |
| 148 五样板换壳 | 部分 | 否：GWT2 23 行 12 绿；GWT1 五块对四块（O-2） | R2-3、R2-27、R2-31、R2-32、R2-35 | 四板 D 段（发布后） |
| 149 壳层 18 门 | 不满足 | 否：真件 8 过 9 红 1 n/a；壳层三段批末未执行 | R2-13、R2-18、R2-22、R2-23、R2-27、R2-28、R2-34 | 无 |
| 150 4.0.0 候选 | 部分 | 否：GWT1–4 满足；verify 非 0；SUB-140 未重收；清单过头 | R2-29、R2-30、R2-36 | 验收清单 |

结果：部分 15 张，不满足 1 张；机器判据一张都没满足（批末 verify：30 步红 9，44 段红 12）。另外库门为 0（S-1），所以就算满足也不能转 done；这一条不计入返工项。

## 2. 返工清单（R2）

共 36 条，分 6 组：主力 14 条（R2-11 至 R2-18、R2-22、R2-24 至 R2-28），经济 22 条。改共享契约的从主力起，其余从经济起；退回一次升主力。改法不越过 §3.3；「Story」写对应 GWT 或符合性条。

### G1 包件修复（经济；packages/ui-tokens、packages/ui-react，组内按序）

**R2-1 ui-tokens 同源测试读过期路径**（经济）。来源 A1-1、C1-10、steps 注 2。
- 现象：`index.test.ts:357–362` 在 build-shell2.mjs 里找 `.scr.ts{`，而 SUB-133 已把它移到 `tools/shell-screen.mjs:32`，所以读到 undefined。verify 05 因此停在首包，后续包的测试批末都没跑（05 log:16、36）。
- 改法：改读 shell-screen.mjs 导出的值，断言语义不变；改完整跑一次 pnpm test，新出的红记入 R2 问题清单。文件：`packages/ui-tokens/src/index.test.ts`。依赖：无，组内第一个做。Story 135 符合性（同源）、148。

**R2-2 ShellBrandButton 夜间后缀断言与 D7 不一致**（经济）。来源 M3、A1-2、B1-11。
- 现象：`ShellBrandButton.test.tsx:168–177` 要求两个主题都 ≥ 4.5，夜间实测 3.07，所以恒红。
- 改法：浅色仍断言 ≥ 4.5；夜间改为断言与浅色同色，并记下读数、加 D7 pending 注（与 token-contrast 同口径）。等 S-6 裁定后再收紧。Story 136-GWT3、145-GWT3。

**R2-3 首行字标：TMS 被截断，后缀越出 `b` 1px**（标按钮与 ProductLockup 首行一起改；经济）。来源 A1-3、B1-9、C1-9；P1d 问题 2、P12 问题 6、P14 问题 1。
- 现象：字标格宽 60，TMS 实宽 60.234，所有屏都显示「TCRN T…」。`em` 行盒高 17，`b` 行高只有 15 且 overflow hidden，上下各越出 1px。证据：18 log:3487–3494，19 log:4461（11 行 clip），壳报告 singleLine 36 处。
- 改法：
  - 字标列：按板 `.ts-brand` 的 `22 auto 20` 取内容宽，外框仍是 134×40、中线 26；只有超出 > 1px 时才显示省略号并带 title。
  - 后缀：`b` 不再纵向裁切，或给纵向留余量；不移字形，不丢省略号。
  - 两处首行用同一写法（不抽共用，§3.4）。
  - 测试补「scrollWidth ≤ clientWidth」与「em 不越出 b」两条。
- 文件：`styles/shell.css.ts`、`styles/brand.css.ts`、`ShellBrandButton.test.tsx`、`Navigation.test.tsx`。依赖 R2-2。Story 136 符合性（D2）、145 符合性、148-GWT2、149-GWT1；第一批硬线「不超出裁切祖先」。

**R2-4 底栏锁定块按 C-6 出 DOM，侧栏尺度只留一处**（经济）。来源 A1-4、B1-12、C1-17①；P12 问题 4、P1b 问题 7。
- 现象：锁定块是 ProductLogo（`svg[data-product-mark]`），没有 `svg[data-logo]`、`b > em`、`small`，导致 lockupDecor 红 16 处、brandDigest 红 24 处（`shell-measure.mjs:446–448、576–578`）。另外 `.tcrn-shell-menu__lockup` 抄了一份侧栏尺度。
- 改法：
  - ProductLogo 给彩色标加 `data-logo={productId}`，与 `Navigation.tsx:699` 的首行一致。
  - 锁定块结构改为 `b > em` 加 `small`，符合 C-6。
  - 菜单锁定块改用 brand.css.ts 的侧栏档，删掉副本（C13）。
  - 若必须改 ShellBrandLockup 的导出 prop，就升主力，单独成条。
- 文件：`Navigation.tsx`、`ShellMenu.tsx`、`styles/brand.css.ts`、`styles/shell.css.ts` 及测试。Story 138 符合性、145、149-GWT1；壳层硬线「锁定块只装饰」「品牌资产 digest」。

**R2-5 菜单内的 C7 缺口与搜索空态**（经济）。来源 B1-6；P1b 问题 8、P2 问题 8。
- 现象：
  - 非可钉 NavGroup 标题（`Navigation.tsx:1513`）截断了但没有 title，变异报 truncatedWithoutTitle。
  - ProductShellSearch 的结果链接没有 title。
  - 无匹配时，空态文案也被隐藏。
  - 可钉行的 `.tcrn-nav-item__label` 不做单行截断，长名会折行。
- 改法：非可钉分支包一层 `span.tcrn-nav-group__label-text[title]`；结果链接加 title；空态文案常显；可钉行标签改为单行截断并加 title；补单测。
- 文件：`Navigation.tsx`、`styles/shell.css.ts` 及测试。Story 143 符合性、138、142；第一批 C7。

**R2-6 Sheet 打开时壳根报 `data-state="sheet"`**（经济）。来源 B1-8、C1-17④；P7 问题 1。
- 改法：ProductShell 调 `useShellMenuPresentation()`，菜单打开且呈现为 sheet 时报 sheet。只加状态值，不改 prop 面；补单测。
- 文件：`Navigation.tsx` 及测试。Story 144（C-5）、149 touch。

**R2-7 清理 O-1 残留与旧顶栏尺寸，加包样式段首标记**（经济）。来源 A1-9、A1-5 后半；P1c 问题 2、C §5 P10-7。
- 改法：
  - 删 `brand.css.ts:198、215、216` 三条死选择器，并去掉 Navigation.test GWT1 对 brand 段的排除。
  - 删 `base.css.ts:163–176` 中 `.tcrn-product-shell-search` 的旧顶栏尺寸（260、margin-left auto）。
  - 在包样式表第一个壳层段前加一个稳定的段首标记，供 R2-18 切段用；页模板不再按 `\n.tcrn-shell-brand {` 找段。
- 文件：`styles/brand.css.ts`、`styles/base.css.ts`、`styles/shell.css.ts`、`Navigation.test.tsx`。Story 140 符合性（O-1 撤出）、147。

**R2-8 纸内滚动区可聚焦**（经济；判断新发现，§0 第 6 条）。
- 改法：给 ProductShell 的 `section.tcrn-product-shell__main` 加 `tabIndex={0}`（它已有 aria-label），焦点环沿用现有规则；补单测。
- 文件：`Navigation.tsx` 及测试。Story 140、147（axe 归 0）。

**R2-9 纸内 PageHeader 主体对齐板 `.ph`**（经济；验收没覆盖到）。来源 P6 问题 4。
- 现象：板上标题行 gap 14、底线 `--line-2`、h2 衬线 26；包件 gap 是 space-3（12），底线是 border-subtle。
- 改法：gap 改 space-3h，底线改 line-2 对应 token，标题字形对齐板上 h2。只用已有 token，没有等值的就停下记问题（§3.3）。
- 文件：`styles/base.css.ts` 及测试。Story 146 符合性（D1 纸内首行）。

**R2-10 铃铛悬停按 07a B 段改 6% 墨洗**（经济）。来源 P9 问题 2、清单 G-6。
- 现象：真件铃铛用 3.5% 墨洗，读 14.70 / 14.14；板上要 6%（13.97 / 13.17），contrast 门判红。
- 改法：按板改；G-6 改记「已按板改，待目视」。若 Story 正文写的是 3.5%，停下记问题。
- 文件：`styles/shell.css.ts`。Story 140 符合性、149 contrast。

### G2 包件契约（主力；与 G1 改同一批文件，排在 G1 之后）

**R2-11 壳层几何字面值进 token，粗指针切换移到 token 层**（主力）。来源：clauses.md C10「壳层几何逐值来自 token，字面量即红」；A §2.1 与 §5 P1a-1；B1-2②；B §5 P7-6、P8-7。
- 现象：
  - `shell.css.ts` 里有字面值：标 22px（67、612 行），触摸 44px（137–138 行，写在组件层的 coarse `:root` 里）。
  - shell-sheet 有 44px，面包屑分隔符 Icon 用 11。
  - 页面把 token 表排在组件表后面，coarse 的 44 被 `:root{…32px}` 盖掉（acc-B 49、50）。
- 改法：
  - tokens.json 加主题无关 token：标 22、触摸 44、icon 11（名字属 B 类）。
  - ui-tokens 在 token 表的基础块之后写 `@media (pointer: coarse)`；组件里的字面值全部换成 var()。
  - 几何字面量扫描扩到 `shell*.css.ts`，写入 196px 必须判红。
  - 生成物按 C-13 提交，复核 contract:static C5；新 token 交设计会话补进 F 段。
  - 字号 12.5、10、11.5 不属 C10，不在本条。
- 文件：`contract/tokens.json`、`packages/ui-tokens/src/index.ts` 及生成物、`styles/shell.css.ts`、`styles/shell-sheet.css.ts`、几何扫描脚本；`Navigation.tsx` 里面包屑的 `size={11}` 换 token 交 K6 做（K4 不碰 Navigation.tsx）。依赖 G1。Story 135、136、143、144；硬线「几何逐值来自 token」。

**R2-12 第二批三族豁免到期删除，按 C1–C17 整改旧规则**（主力；§0 第 5 条）。来源 P8 问题 7、8、9；P1b 问题 8。
- 现象：三条豁免仍对 C2、C5、C6、C7、C8、C11、C13 免检。SubNav 选中态只有墨洗、没有字重。roles.json 仍登记 3 个退役壳控件，families.json 因此暂留了三块。
- 改法：
  - 删 navigation、shell、layout 三条豁免。
  - 跑 contract:static 与 shell-fidelity，把读出来的红逐条按条款改。已知的有：SubNav 选中改为 6% 墨洗加字重；TocRail、NavItem 悬停旧写法；Surface、Divider 等布局件。
  - roles.json 删掉退役控件后，移除 families.json 的暂留块。
  - shell-fidelity 里两条导航族的条件例外，各按自己的 until 处理：search-static 等 R2-24 删，skip-link 不满足条件就保留。
  - 红太多做不完时，在交回里列清单，余项进 R3；不恢复豁免。
- 文件：`docs/contract/{exemptions,roles,families}.json`、`styles/base.css.ts`（三族段）；要改组件文件的部分写进交回，由 K6 做。依赖 R2-11。Story 143、140、146 符合性；START 质量硬线 C1–C17。

**R2-13 NavItem、NavGroup 出 C-5 行钩子**（主力）。来源 B1-1 包侧、C1-17③；P1b 问题 3、4，P2 问题 7，P12 问题 3。
- 改法：`.tcrn-nav-item__label` 上发 `data-text="prail"`，图标上发 `data-guide="prail"`；NavGroup 标题行接收 `data-shell-group`；测试断言这些钩子存在。门侧改动在 R2-27。
- 文件：`Navigation.tsx` 及测试。Story 142-GWT1、149-GWT1。

**R2-14 固定项拖排，带键盘替代**（主力）。来源 A1-8、P1c 问题 3。
- 改法：
  - ShellPins 加指针拖排：项就地移位，不加板上没有的插入线、拖影、把手。
  - 键盘替代用 Alt+← / →。拖排结束回调 `onPinsReorder`，ProductShell 加对应 prop 接到 `movePin`。
  - 迁移条目的文字写进交回。
- 文件：`ShellPins.tsx`、`Navigation.tsx`、`styles/shell.css.ts`（只加行为属性），以及测试。Story 140-GWT3（137）。拖排效果要目视（§3.5）。

**R2-15 ShellMenu 支持受控搜索词**（主力）。来源 A1-7 包侧、P1d 问题 6。
- 改法：ShellMenu 加受控的 `query` 与 `defaultQuery`（不传时行为不变），ProductShell 透传；补单测。story 与门的部分在 R2-24。
- 文件：`ShellMenu.tsx`、`Navigation.tsx`。Story 140、144-GWT3。

**R2-16 纸内页标题用 h1**（主力）。来源 C1-2 包侧；P6 问题 9、C §5 P10-9。
- 现象：axe 报 page-has-heading-one 108 处，文档页没有 h1（PageHeader 标题恒为 h2，见 `DomainDisplay.tsx:272`）。
- 改法：PageHeader 加可选的标题层级，默认 2；ProductShell 纸内默认用 1，显式给了层级就按给的来。页内的 story 壳由 R2-23、R2-24 传 2。
- 文件：`DomainDisplay.tsx`、`Navigation.tsx` 及测试。Story 146、147。

**R2-17 ProductShell 地标名按实例区分**（主力）。来源 C1-3 包侧、A §5 P1c-3（删 navId、navLabel 时把实例命名也删了）。
- 现象：axe landmark-unique 24，固定项 nav 与面包屑 nav 同名。
- 改法：开放实例级地标名（如 `landmarkLabel`），作为两个 nav 可及名的前缀，五语由 shell-copy 组装；默认值不变；补单测。
- 文件：`Navigation.tsx`、`ShellPins.tsx`、`shell-copy.ts`。Story 147、140。

### G3 文档构建与静态 story（apps/storybook/src）

**R2-18 `.story-body` 比对副本压过壳层段**（主力）。来源 A1-5、B1-2①、C1-15、C1-17②；P1d 问题 1、P12 问题 5；§0 第 1 条。
- 现象：页模板把 `tcrnComponentCss` 截到 settings 段前加前缀重放，壳层段不在副本里，同特异性下被盖掉：菜单搜索 260×260 靠右、下拉搜索包裹 260、≥1024 仍显示「已固定」、行与组标题回旧样式、静态悬停失效；parity 包侧两处值差，continuation 红 8 处，contrast 同根格红。
- 改法：副本纳入 shellCss*、shellIntroCss*、shellSheetCss* 并排在其后，或只复制不被壳层段覆盖的规则；按 R2-7 的标记切段；另开只含包样式的空白页对照一次（A 盲区 10）。
- 文件：`apps/storybook/src/build/page-template.tsx`。依赖 R2-7：标记合入前先按现在的方式定位，合入后在 K5 切换。Story 138-GWT1、139-GWT1、140、142、147、149。

**R2-19 运行时换字的跳过范围不对**（经济）。来源 C1-1；C §5 P10-6 不可接受。
- 现象：跳过选择器放宽到了 `[data-locale-invariant]`。结果 AI 契约故事整块没翻译（28 log:30），而品牌字标反被换成「TCRN 设计系统」。
- 改法：跳过范围只认品牌字标（标按钮 `b`、锁定块首行的 `b` 与 `em`，或文档层专用钩子）；`[data-locale-invariant]` 只给台账用；锁定块描述行照常换字。
- 文件：`client-scripts.ts`、`page-template.tsx`。Story 147；壳层硬线「品牌资产原样」。

**R2-20 文档壳文案与行为，三处**（经济）。来源 C1-6；P13 问题 13、14(a)、15。
- 改法：zh-CN 的 Change Log 只留一个词典来源（「变更日志」）；页模板把五语 category.description 作为菜单分类行说明（aria-describedby）传给包件，选补说明、不撤门里的计数；内层语言列表处理完 Esc 不再关头像菜单，焦点回语言触发键。
- 文件：`page-template.tsx`、`client-scripts.ts`、`locales/storybook-content-text.ts`。Story 147。

**R2-21 shell-fidelity 漂移与文档层弃用 token**（经济）。来源 C1-5、A1-10②；P10 问题 8、P15 问题 8。
- 改法：删 `story-demo-styles.ts` 的 `.tcrn-doc-knowledge-shell*` 块与 storybook.css 两条重复选择器，按 build → demo-styles-sync → build 同步；demos 演示框类名按 P10 问题 6③ 改；构建不再出弃用 token 提示。
- 文件：`story-demo-styles.ts`、`storybook.css`、`prototypes/storybook-shell-demos.tsx`。Story 147、135-GWT4。

**R2-22 静态页加客户端挂载，静态桥退场**（主力）。来源 A1-6、C1-16；P5 问题 2、P12 问题 1、P10 问题 5、P1d 问题 4 与 5、P12 问题 10、P14 问题 6。
- 现象：静态页没有 hydrateRoot，ShellIntro 不播、浮层与焦点回路不可观察、≤ 760 无 Sheet；intro、focusLoop、noCollapse 半边、touch 红，4 条变异不可区分；「tab click: Timeout 3000ms」原因不明。
- 改法：定挂载归属后一次接入，壳 story（top-band、narrow、mobile、intro）与文档壳浮层由小挂载入口水合真件；ProductShell 把 previewStates 传给 ShellMenu / ShellDropdown，下拉静态桥（含 `tcrn-shell-dropdown__col`）退场；挂载后 `data-shell-brand` 随视口改写；超时原因写进交回，门的判定不改。
- 文件：`page-template.tsx`、`client-scripts.ts` 或新入口、`story-content.tsx`、`Navigation.tsx`（透传）。依赖 R2-18。Story 136/138/139-GWT4、141-GWT1/2、144-GWT2、147、149-GWT1。

**R2-23 静态 story 修补**（经济）。来源 B1-7；§0 第 2 条；P1c 问题 7、A §5 P1c-2。
- 改法：ts-m-s 包进 `shellMenuPresentationContext.Provider value="sheet"`；AOS 壳证明、两个视觉实例、构图一浅夜两块给壳加定高画框（壳不改）；AOS story 读回标明 design-system 是占位（O-9）；页内另有 h1 的 story 传标题层级 2。
- 文件：`story-content.tsx` 及相关 story 文件。依赖 R2-22。Story 144-GWT2、140、147。

**R2-24 消费新 prop：搜索结果屏、地标名、geometry-proof 宿主**（主力）。来源 A1-7、C1-3 的 apps 侧，P9 问题 3。
- 现象：searchOverlay 基线 openMenus 读 12，与写死的常数 13 不等；overlayCount 0（10 log:5）。
- 改法：shell-top-band 加一屏「已输入、结果展开」（R2-15 的 query）；searchOverlay 宿主改到该屏，open-menus 从 DOM 派生、不写常数；文档壳与页内 story 壳各传不同地标名；静态结果屏出现后删 shell-fidelity 的 EX-INIT015-doc-product-shell-search-static（until 已满足）。
- 文件：`story-content.tsx`、`page-template.tsx`、`scripts/geometry-proof.mjs`、`scripts/shell-fidelity-proof.mjs`。依赖 R2-15、R2-17、R2-23。Story 140、144-GWT3、147。

### G4 门口径（主力；scripts/**、tests/fixtures/**）

**R2-25 文档与 Storybook 门按新家族改期望**（主力）。来源 C1-7 前半；P13 问题 2、6、14(b)，P10 问题 3；§0 第 2、4 条。
- 现象：parity 样板角色读已删的 `.tcrn-doc-*`（11 log:5）；smoke 三个 ProductShell 比较器按旧壳比、静态段缺 8 项（17 log:40–48）；索引与参考页要求标当前 story，42 页红；railReachability 读侧栏；文档壳契约靠陈旧字符串成立。
- 改法（口径见 §3.4）：parity 退役 10 个样板角色、文档侧改读新壳；smoke 比较器与静态项按新家族改期望（AOS 两项按占位读，检查不删）；索引页「当前」认菜单当前分区行；railReachability 改量完整菜单（菜单高于视口时目的地仍可达，812×375、1440×900）；`storybookDocShellControlContract` 按顶带文档壳重写；清 selection-grammar 死分支。本条须先于 R2-29、R2-35 合入。
- 文件：`scripts/{shell-parity-proof,storybook-smoke,internal-alpha-browser-proof,package-contract-manifest,selection-grammar-proof}.mjs` 及测试。Story 147、149、150。

**R2-26 browser-proof 三处：设置溢出、回执体积、字标豁免**（主力）。来源 C1-4；§0 第 2、3 条。
- 改法：
  - noHiddenOverflow：对 nowrap + ellipsis 的 C7 载体，没截断时（scrollWidth ≤ clientWidth + 1）放行，截断了仍判红。
  - axe 字标豁免：加入 `.tcrn-shell-brand__suffix`（2026-10-11 D2）；夜间 TMS 仍标 pending。
  - 回执体积：sidebarNoIconLabelReadbacks 改名为顶带读法，逐页只留失败项与计数，并加回执体积自检，须 < 1,000,000 字节。不抬扫描上限。
- 文件：`scripts/internal-alpha-browser-proof.mjs` 及测试。依赖 R2-25（同文件同包）。Story 147、146、150；30.02、30.03、30.04 随之转绿。

**R2-27 壳层门：读法与判定补齐**（主力）。来源 C1-7 后半、B1-1 门侧、C1-13(b)；P9 问题 1、P12 问题 7(a)、P5 问题 4、拆分 #24。
- 改法：
  - contrast：07a B 段标「按设计不读 / 不进门」的格只列不比；补三类读法（彩色标、面板对画布、遮罩下的纸）。
  - pinJitter：用 `.tcrn-nav-item-row` 找图钉；变异要同时撤掉保留轨道，并在夹具自检里证明它会判红。
  - 新增 prail 判定：菜单引导列图标在 16、文字在 48（07b 标注「引导列 面板内图标 16」，口径同 measure-shell.js 的 `o.prail`），配一条会判红的变异。第一批的 rail 从此改量菜单引导列，样板行不再要求 rail，映射说明 I16-P24 与清单第 202 行因此成立。
  - css-template 的两条正则按 P5 问题 4 放宽。
- 文件：`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/fixtures/geometry-measure/shell/`、`tests/shell-measure-proof.test.mjs`、`scripts/css-template-integrity-proof.mjs`。真件读数要等 R2-13，夹具可先做。Story 142-GWT1、149-GWT1、148（rail）、137-GWT5。

**R2-28 给 145、146 补门**（主力）。来源 B1-10；P6 问题 7、P14 问题 4。
- 改法：
  - 加一个品牌 story：四枚产品，每枚两种尺度的首行；markText 读这个 story，配 padding-top 4 的变异。
  - 壳 story 加两屏：设置页与名册页，各出 390、1440，用长面包屑。
  - 门新读三项，每项配一条会判红的变异：pageCrumbs（单行、省略号、title）；SettingsLayout ≤ 1040 且左右等距；SplitView 左缘 = 纸左缘 + 内距。
  - all.green.html 换成顶带壳。
- 文件：`apps/storybook/src/contract-stories/`、`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/fixtures/geometry-measure/`。依赖 R2-27。Story 145-GWT2、146 符合性（几何门）。

### G5 文案、文档与设计数据（经济）

**R2-29 契约文字、oracle、台账，以及 #7aa0f5 残留**（经济）。来源 C1-8；P13 问题 16、P4 问题 3、P15 问题 6、P8 问题 5、P1d 问题 11、P6 问题 3。
- 改法：以下文字改成顶带壳与「两主题同色、D7 待裁」的说法，并补齐五语：
  - `ai-consumption-contract.ts`：1039、1046 两行；search 的 260 / 360；brandSurfaceDisposition 里的 #7aa0f5。
  - oracle 的两段 disposition。
  - content rows 里的 SideNav、TopBar、ProductSwitcher、SegmentedNav 行。
  - ProductShell spec 与 AOS 壳的读回。
  - CHANGELOG.md:164、migration、ui-tokens README。
  - oracle 数值渲染时不带英文单位，或在泄漏台账里按新值登记（30.02 log:42）。
- 文件：上述各处，另有 `foundation-visual-standards.ts`、`storybook-content-text.ts`、`locale-invariant-ledger.mjs`；`story-content.tsx` 的读回文字归 K11。依赖：R2-25 先合入。Story 147、150、145-GWT3。

**R2-30 迁移说明与说明文档**（经济）。来源 B1-4；P5 问题 5、A §5 P1c-6、P9 问题 7、P2 问题 6；G2 交回的条目。
- 改法：
  - 迁移说明（`docs/migration-4.0.md`）：
    - 加家族逐件处置表：navigation 13 件、shell 9 件，每行写保留、并入 Tabs、弃用或新增，以及 families.json 的现值；MobileNavToggle 记为弃用，仍计入 10 件。
    - 追加 R2-11、R2-14 至 R2-17 的条目。
    - 写明 ShellIntro「只在登入成功时挂载」，以及壳根一屏高、纸内滚动、长页嵌壳要加画框。
    - 按 C-14 只追加，不改已有条目。
  - 两个 README 改为六板。
  - tcrnIconNewNames 的注释改口径。
- Story 143 符合性、140、141、150-GWT2。

**R2-31 Icon / Typography 板与文案改为 38**（经济）。来源 B1-3、C1-13(a)；P2 问题 2 与 4，P11 问题 4。
- 改法：
  - `build-icon.mjs`、`build-typography.mjs:259` 改为用 ICON_NAMES.length 出数，只重生受影响的行。
  - 以下各处的数一并改成 38：Storybook 五语描述（`storybook-locale-text.ts` 148、340、532、724、916）、`storybook-content-text.ts:528`、`story-content.tsx:1321`（归 K11）、gplus README:14。
  - 实心态等 O-5 裁定，这次不画。改过的板放进收口的待发布清单。
- Story 142 符合性、148（D4）。

**R2-32 canvas.json 板高与 y**（经济）。来源 C1-12、M7、P11 问题 2。
- 改法：按 P11 问题 2 给的建议值，改 `visual-standard/canvas.json` 的 h 与后续各板的 y；同时放进待发布清单。
- Story 148 符合性。

**R2-33 TreeNav 文档 story 演示归位**（经济）。来源 B1-5。
- 改法：`documents-and-collaboration-components-spec` 与 `-density-spec` 里的 TreeNav 演示，挪进完整菜单或下拉的上下文。页内需要文档树时，按页面内容模式写明，不拿 TreeNav 充当页内导航列。五语一起改。
- 文件：`contract-stories/story-content.tsx` 中两个 spec 段、对应 locales。Story 143 符合性。

**R2-34 shell-matrix 的高度、台账与治理元数据**（经济）。来源 C1-14；P9 问题 5；新发现：smoke 静态段缺 `owning-page-story-governance-metadata:Components:shell-matrix`（17 log:48）。
- 改法：
  - 高度：两块并排（id 不变），桌面高控制在 ≤ 2000；做不到就进 grace allowlist，并带 owedTo。
  - 台账：9 条 recordedHeightPx 改成现测值。
  - 补上所属页的治理元数据。
- 文件：`scripts/lib/story-budget.mjs`、`gplus/matrix-renderer.tsx`、`contract-stories/governance.ts`（治理元数据，以 grep 核实）。Story 149。

**R2-35 apps/storybook 单测与样板五语文案**（经济）。来源 C1-11、C1-8 的测试部分；P8 问题 3、P13 问题 12、P14 问题 2 与 3、P1d 问题 8。
- 改法：
  - `smoke.test.ts` 中，构图一的 rail 与构图三的 TopBar 断言，按 P14 问题 2 改。
  - oracle 断言改为 0、0、0、52、936、936、999；旧文档头、旧 SideNav 与知识库原型的断言改成新壳；ts-m-s 的期望跟着 R2-23 改。
  - 六个样板的五语标题与描述改为顶带壳，gplusSampleStoryText 一起改。
  - 先 build，再跑 storybook 包的测试，要求全绿。
- 文件：`smoke.test.ts`、`storybook-locale-text.ts`、`gplus/sample-stories.tsx`。依赖 R2-25、R2-23、R2-24、R2-29。Story 148、147、150。

### G6 收尾（经济；被退回一次就升主力）

**R2-36 批末生成物一次再生，验收清单同步**（经济）。来源 C1-18、A1-10①；P15 问题 1、2，P8 问题 10。
- 改法：等上面各条都合入后，在同一个构建上依次做：
  1. 字体：跑 `fonts-vendor.mjs`，补上 U+94DB 和新文案用到的码点。这一步要访问 npm registry；连不上就记问题，改用子集里已有的字。
  2. 视觉签名：nonVisualProofOk 为真后，按 P15 问题 2 写选择文件，重收视觉签名（回归 199 条、新增 15 条）。
  3. 其余生成物同批再生：几何、壳层门、映射、契约与 API 清单、internal-alpha 回执。
  4. owner-acceptance.md：改第 178、202 两行，补上差距（长字标、3.07、铃铛 6% 待目视）。
  做完这些，再跑批末 verify。
- 文件：`packages/ui-tokens/fonts/**`、`docs/verification/**`、`owner-acceptance.md`。Story 150（SUB-139、140）、135-GWT4。

### 2.7 对照：批末红段到返工项

| 红段 | 返工项 |
| --- | --- |
| 05 test | R2-1（首包）、R2-2、R2-35；后续包首跑出新红记入 R2 问题清单 |
| 06.08 fonts-proof | R2-36 |
| 06.10 shell-fidelity | R2-21（R2-12、R2-24 删例外后复核） |
| 10 geometry:proof | R2-15、R2-24 |
| 11 shell:parity | R2-18（包侧）、R2-25 |
| 17 storybook:smoke | R2-20、R2-25、R2-34 |
| 18 geometry:measure | gplus 段：R2-3；壳层段：R2-4、R2-5、R2-6、R2-10、R2-13、R2-18、R2-22、R2-23、R2-27、R2-28 |
| 19 visual-proof | R2-3 |
| 28 full-surface | R2-19 |
| 30.02 browser-proof | axe：R2-8、R2-16、R2-17、R2-24、R2-26；其余：R2-20、R2-21、R2-23、R2-25、R2-26、R2-29、R2-34、R2-36 |
| 30.03 scan、30.04 hardening | R2-26；回执由 R2-36 再生 |
| 潜伏：30.01、13 contract:static | R2-25 先合入；R2-12 删豁免后暴露的红 |

验收编号与返工项的对应，见各条的「来源」。三片验收共 40 条，去重后落在 32 条里（个别拆到两条）；另 4 条由判断补查新增：R2-8、R2-9、R2-10、R2-12。

## 3. 只有 Owner 能定的事项

### 3.1 待裁（R1 新增 7 项，沿用 8 项）

| # | 事项 | 来源 | 建议 | 不裁时的默认 |
| --- | --- | --- | --- | --- |
| O-1 | 第二版放不下长字标：「TCRN Design System」需 117，格只有 60（D1 定宽 134） | C O-1、P1a 问题 6 | 宽度「至少 134、随字标加宽」，三处间距仍为 8，07b 补长名屏；不同意则改用第一版 | 截断加 title；TMS 由 R2-3 保证不截断 |
| O-2 | STORY-148 GWT1 写「五块」，现做法是四板 D 段 + 07a 第 1 段 | C O-2、拆分 #4 | 接受现做法，注解写明怎么读 | 按现做法，GWT1 记部分 |
| O-3 | 级联越过视口右缘：第四级在 1024–1330 宽出界；菜单内两列在 1440 宽出界 12 | A §4、M6、P1b 问题 5 | 越过右缘就向左展开 | 现写法 |
| O-4 | 墨迹中线遇到下行字母：DS 侧栏读 1.4，又不许下移 | B O-1 | ±1 改量「大写顶到基线」 | 145-GWT2 记部分 |
| O-5 | Icon 板规则写「禁填充」，与 pin 实心态冲突 | B O-2 | 加例外，补画实心态 | R2-31 只改件数 |
| O-6 | 触摸端未固定的行，图钉平时看不见 | B O-3 | 粗指针下常显 ink-3 | 获焦时才显 |
| O-7 | 文档站：无登录时头像用默认人形；目录宽 144、截断 | C O-5 | 接受现状 | 现状 |
| O-8 | 夜间后缀 3.13 / 3.33，另 R1 测到 3.07，判断归入 D7 | M3、C O-3 | 随 S-6 一并裁 | 同色、标红、pending |
| O-9 | AOS 在 logos2 里没有标 | P1c 问题 1 | 补 AOS 标，或撤掉 AOS story | 先用占位并标明 |
| O-10 | 头像菜单几何与无账户图标，板上没画 | P1c 问题 8 | 接受现写法，目视时定 | 现写法 |
| O-11 | 窄屏按视口切还是按容器切 | P1d 问题 3、P12 问题 9 | 改用容器查询 | 按视口 |
| O-12 | 下拉里是否显示 ⌘K | P1b 问题 6 | 不显示 | 不显示 |
| O-13 | 纸升起的距离，板上没给数 | P5 问题 3 | 设计会话给数 | 10 |
| O-14 | STORY-136 字重文本与板不一致 | P1a 问题 3 | 按板改 Story | 按板实现 |
| O-15 | Sheet 夜间遮罩，以及 Sheet 下一级怎么开 | P7 问题 5、6 | 设计会话补 | 现写法 |

### 3.2 知悉

- 交设计会话下次一并发布：四块成品板 D 段、Icon 名册行、R2-31 改的板、canvas.json；07b 字句（G 段 20 应为 26，F 段「新 · 待 Owner」「顶栏」，拆分 #1、#3）；Brand、Shell 板 D4 关键词（P11 问题 3）；R2-11 新 token 补进 F 段；Shell 两板 token 块重生（C O-4），之前以「抽模块前后输出相同」守护。
- R1 批末没有 ui-react、storybook、pilot 的单测读数，R2-1 后首跑可能出新红。R2-12 删豁免后的红量未知。
- scroll-spy 在包树上超时过一次（P15 问题 1），批末未复现。主线程注「scan 红是超时副作用」更正见 §0 第 3 条。3.07 按 D7 处理；铃铛、拖排要目视。

### 3.3 授权外，不列返工

- 下列做法都会放宽判定或缩小范围，不做：抬高扫描上限；撤掉 searchOverlay 检查；以「控制器层即可」结掉 140-GWT3。
- 设计正本与 Story 原文不动：不改 Shell 两板与 07b 字句（C-16）；O-5 裁前不画实心态；O-1 裁前不改 134；不改 Story 正文（O-2、O-14）。
- 不新增 type scale token（字号 12.5、10、11.5，以及 R2-9 遇到的值）；O-11 裁前不扩运行网格到 1023。
- 不碰第三批：不导出 Overlay 的定位函数（P1b 问题 2），其它家族的豁免照旧保留。
- 不在 Atelier 声明库门，也不绕过（S-1）；推送、打 tag、发版、部署、发布画布都不做。

### 3.4 按建议先做（实施侧自定，收口时回显）

判断已定下的口径：
1. 门判定语义（C-17）以下改动全部接受，没有撤回项：
   - 布局与壳层：P12 规定 390 下打开的层必须是 Sheet；railReachability 改量完整菜单。
   - 文档与 parity：P13 的 docOwn；P13 包词表，条件是 R2-22 让静态桥退场；parity 退役样板角色；索引页的「当前」改认菜单当前分区行；文档壳契约改为顶带壳。
   - 对比度与可及性：contrast 豁免格只列不比；axe 豁免扩到 `.tcrn-shell-brand__suffix`；noHiddenOverflow 放行没截断的 C7 载体。
   - 新增或收紧的检查：新增 prail 判定；css-template 正则放宽；C10 扫描扩到 shell*.css.ts；open-menus 改为从 DOM 派生。
2. 三族豁免按各自的 until 删除。这是执行既有条款，不是新裁定。
3. 首行不抽共用组件（拆分 #11），两处写法相同，在同一包里一起改。
4. 「10」口径（拆分 #13、P8-6）：10 件里包含已弃用的 MobileNavToggle，与 Story「13 → 10」一致。SubNav 保留为页内二级导航，选中态按 C6 改（R2-12）。
5. 新 token 的名字属 B 类，Owner 可以改名，也可以决定不设 token。28 = calc(2 × space-3h)、抓手 calc(3 × space-3) 都视为来自 token。
6. 铃铛按板改为 6%；拖排不加板外视觉；Brand 板按默认不加 D 段（O-2 待裁）。
7. 下拉定位不复用 Overlay：它的定位没导出，又属于第三批。
8. 菜单分类说明由页模板传五语 description，不撤门里的计数。
9. prop 面：P1c 删掉的 brandHref、brandSuffix、search 等，接受。地标命名由 R2-17 用新 prop 补回，不恢复旧名。
10. 样板行不再要求 rail（P14 的选择），改为量菜单引导列（R2-27）。
11. C1-15 与 P12 问题 5 所说的「包件 CSS 偏离」不成立，并入 R2-18。
12. R2 拆分约定：
    - 样式段的登记行跟着段的归属包走（M2）。
    - Navigation.tsx、page-template.tsx、story-content.tsx 按包串行。
    - 迁移说明与 CHANGELOG 统一由 R2-30 追加。
    - docs/verification 只由收尾包提交（同 C-12）。

各包交回里写明的选择落在哪里，见下表（编号取各片 §5 的「包-条」；没列出的条都接受）：

| 包 | 转返工或待裁 |
| --- | --- |
| P1a | 1 → R2-11；5 → R2-1；6（version auto）→ R2-22 |
| P1b | 5、7 → O-3；8 → R2-18、R2-7；15、18 → R2-4（R2-18 合入后复核） |
| P1c | 2 → O-9、R2-23；3 → R2-17（其余删除接受）；6 → R2-30、R2-23；11 → R2-29 |
| P1d | 3 → R2-22；4 → O-11 |
| P2 | 2 → R2-13、R2-27；6 → R2-31、O-5 |
| P3 | 8 → O-8 |
| P4 | 5 → R2-2 |
| P5 | 4 → O-13 |
| P6 | 1、5 → 接受（第 5 条） |
| P7 | 1 → R2-23、R2-22；2 → O-15；6 → R2-11 |
| P8 | 5 → R2-12；6 → 接受（第 4 条）；7 → R2-11 |
| P9 | 6 → 接受 |
| P10 | 3 → R2-22；6（不可接受）→ R2-19；7 → R2-7、R2-18；9（不可接受）→ R2-16 |
| P11 | 6 → R2-32；7 → O-2 |
| P12 | 1 → 接受（第 1 条） |
| P13 | 包词表 → 接受（以 R2-22 为条件）；(2) → R2-26；样板角色 → R2-25；full-surface 改归 R2-19 |
| P14 | rail → 接受（第 10 条） |
| P15 | 9 → R2-36 |

### 3.5 停点

- 推送、打 tag、发版、部署都不做，停在推送之前。
- 画布发布：清单见 §3.2，交设计会话。
- Owner 目视：范围是 136–150 加第一批，按 owner-acceptance.md 进行。建议等 R2-3、R2-18、R2-22 做完再看；本轮新增的目视项有铃铛、拖排、长字标。
- 库门 S-1：Owner 在 Atelier 声明 verify（29 个 work id）之前，29 张 Story 都不能转 done。
- INIT-016 与 INIT-015 的 done，等 Owner 目视之后再转。

## 4. 链写计划（主线程一次 work-batch；下列 summary 都已量过，均 ≤ 160 字节）

### 4.1 Subtask（28 张，现在都是 planned）

下表 6 张转 done，走三步 ready → active → done。前两步的 summary 都写「R1 包已合入集成分支，批末验收已出」，第三步用表中的 summary。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-115 | work:a35b2c0b9a94aa8650749ba1 | R1 验收满足：间距 8、上限 6、窄屏进已固定；对比度门归 149 |
| SUB-117 | work:01d12e90023a86e2bc728111 | R1 验收满足：一段即开、Esc 与点外部即收、⌘K、方向键（jsdom） |
| SUB-118 | work:d56464e0ab2e9d3468ac34a0 | R1 验收满足：接续 6、宽 240、级联 +4 同高、悬停不展开 |
| SUB-122 | work:80285af310a87e6b92f2da69 | R1 验收满足：120/240/100、每会话一次、减动效 0 次 |
| SUB-130 | work:c51402442029350248282465 | R1 验收满足：设置页 1040 居中、SplitView 左缘合纸内容左缘 |
| SUB-138 | work:93d715359f638e711e93c1a7 | R1 验收满足：版本面 7 处 4.0.0、迁移 M1–M29、pack:smoke 通过 |

下表 22 张保持，交 R2 承接，走两步 ready → active。active 的 summary 统一写「R1 部分满足；R2 承接 <本行编号>」，最长一条（SUB-119）是 63 字节。

| Subtask | id | R2 承接 |
| --- | --- | --- |
| SUB-113 | work:1c0fe9d1863e4ce3f0d6ec5f | R2-1、R2-11 |
| SUB-114 | work:dcffe846b24bd55c4f86c54c | R2-2、R2-3、R2-11 |
| SUB-116 | work:e1e9b91a9f04e3bf918be0f2 | R2-4、R2-5 |
| SUB-119 | work:ce26517292ff623a8cfe4fe2 | R2-6、R2-8、R2-10、R2-16、R2-17 |
| SUB-120 | work:8abfff3a7bd5da38b14ef84e | R2-14 |
| SUB-121 | work:4ff0723e6c60af609155600b | R2-15、R2-18、R2-22、R2-24 |
| SUB-123 | work:8da1483603499565d95d92bd | R2-5、R2-13、R2-31 |
| SUB-124 | work:4e61f0f656a5427ee264da2e | R2-5、R2-9、R2-33 |
| SUB-125 | work:2b11fac9b2dbed24b71977a4 | R2-12、R2-30 |
| SUB-126 | work:67dd0f644fc7628d85f7e1a5 | R2-6、R2-11、R2-23 |
| SUB-127 | work:3ecb3d37482eaa40cc02ecb4 | R2-3、R2-4、R2-28 |
| SUB-128 | work:fc5b6216b6fa24d504495b9c | R2-2、R2-29 |
| SUB-129 | work:648bffe2050625726ee59021 | R2-9、R2-16 |
| SUB-131 | work:188a1f32d0344a905e22beec | R2-17 至 R2-22、R2-24 |
| SUB-132 | work:d4d30e72342df308e492b8e5 | R2-25、R2-26 |
| SUB-133 | work:593492cd9ceffdd2c0a6683d | R2-1、R2-31、R2-32 |
| SUB-134 | work:61054e000dd53df705212bdd | R2-3、R2-27、R2-35 |
| SUB-135 | work:20d8783340faa1c75ea941a6 | R2-27、R2-28 |
| SUB-136 | work:62d16d400bd01427e0667ecf | R2-27、R2-34 |
| SUB-137 | work:2e4293e154a5922993fedf88 | R2-22、R2-25、R2-27 |
| SUB-139 | work:0d618cb5cd0c00b635d8d63f | R2-36 |
| SUB-140 | work:f9c5a26b1e703dd43c78b3cc | R2-36 |

本批共 62 个成员（6 × 3 + 22 × 2）。如果引擎对 Subtask 转 done 也要求门：这 6 张停在 active，记问题，不重试。

### 4.2 Story 不转 done

16 张都保持 active。原因是库门为 0（S-1），引擎拒绝转 done，所以只写注解。不开 `--fixes` Story；返工交给 R2 拆分，建新 Subtask 挂在原 Story 下。

### 4.3 Story 注解 summary

| Story | summary |
| --- | --- |
| 135 | R1 部分：GWT4 tokens:proof 红（字体子集、shell-fidelity），同源测试红。R2-1、R2-11、R2-21、R2-36。库门 0 |
| 136 | R1 部分：夜间后缀待 D7；字标截断与后缀越界 1px；门红。R2-2、R2-3、R2-11、R2-22。库门 0 |
| 137 | R1 部分：GWT1–4 满足，GWT5 对比度门未证。R2-14、R2-18、R2-27。库门 0 |
| 138 | R1 部分：文档页被比对副本盖坏，锁定块缺 data-logo，门红。R2-4、R2-5、R2-18、R2-22。库门 0 |
| 139 | R1 部分：消费方合板，文档页下拉搜索 260，门红。R2-18、R2-22；级联越界待 Owner。库门 0 |
| 140 | R1 部分：无拖排，parity 与 geometry:proof 红。R2-6/7/8/10、R2-14、R2-15、R2-17、R2-18、R2-24。库门 0 |
| 141 | R1 部分：组件层满足，静态页无挂载 intro 门红。R2-22。库门 0 |
| 142 | R1 部分：图钉门 n/a、变异不判红，Icon 板写 37。R2-5、R2-13、R2-27、R2-31。库门 0 |
| 143 | R1 部分：迁移未逐件、TreeNav 演示、C7 title、导航族豁免到期。R2-5、R2-12、R2-30、R2-33。库门 0 |
| 144 | R1 部分：Sheet 态与静态屏缺，geometry:proof 红。R2-6、R2-11、R2-22、R2-23、R2-24。库门 0 |
| 145 | R1 部分：DS 首行 1.4 待 Owner，后缀越界 1px，门未量本件。R2-2、R2-3、R2-4、R2-28、R2-29。库门 0 |
| 146 | R1 部分：四条 GWT 满足，几何门红且无门读本件。R2-9、R2-16、R2-28。库门 0 |
| 147 | R1 部分：parity 红、换壳带出 5 处批末红、品牌文案。R2-16 至 R2-26、R2-29。库门 0 |
| 148 | R1 部分：映射 23 行 12 绿（clip），五块对四块待 Owner。R2-3、R2-27、R2-31、R2-32、R2-35。库门 0 |
| 149 | R1 不满足：真件 8 过 9 红 1 n/a，verify 非 0。R2-13、R2-18、R2-22、R2-23、R2-27、R2-28、R2-34。库门 0 |
| 150 | R1 部分：GWT1–4 满足，SUB-140 未重收，清单两处过头。R2-29、R2-30、R2-36。库门 0 |

### 4.4 INIT-016 注解要点

- summary：「R1 判断：15 部分 1 不满足；R2 返工 36 条（主力 14、经济 22）；Owner 待裁 15；库门 0 不转 done」，共 120 字节。
- 正文要点：批末 verify 63e1ee2 红 9 / 12；三片验收与本判断路径；判断补查六条（§0）；R2 12 包 5 波（§5）；停点不变。

### 4.5 知识卡

lessons.json 共 5 条，主线程逐条执行 knowledge-capture 并读回，需要时加 `--allow-trailing`。被预算拒绝的，记为阻塞。

1. `.story-body` 比对副本会盖掉新的样式段。
2. 门里断言旧字符串必须存在，删陈旧文字会把门打红。
3. 回执超过 1,000,000 字节，scan 就判红。
4. 带 until 的豁免不会自动到期，需由满足条件的那一批在拆分时删除。
5. DS 的 pnpm test 在第一个红包处就停下。

### 4.6 不在本次链写内

- Story 与 INIT 的转态，以及 INIT-015 的 13 张（库门为 0）。
- R2 新 Subtask 的建单，由 R2 拆分负责。
- Owner 待裁项与库门声明。本轮不写纪要。

## 5. R2 规模估计与分包建议

| 包 | 档 | 返工项 | 文件集要点 | 前置 | 预计响应 |
| --- | --- | --- | --- | --- | --- |
| K1 | 经济 | R2-1 至 R2-10 | ui-tokens 测试；Navigation.tsx、ShellMenu.tsx、shell / brand / base.css.ts 及测试 | 无 | 130 |
| K2 | 主力 | R2-18 至 R2-21 | page-template、client-scripts、storybook-content-text、story-demo-styles、storybook.css | 无 | 130 |
| K3 | 主力 | R2-25、R2-26 | shell-parity、storybook-smoke、browser-proof、package-contract-manifest、selection-grammar | 无 | 140 |
| K4 | 主力 | R2-11、R2-12 | tokens.json、ui-tokens、shell / shell-sheet / base.css.ts、contract 三个 json | K1 | 150（R2-12 量未知） |
| K5 | 主力 | R2-22、R2-23；R2-18 改用标记 | page-template、client-scripts、story-content、挂载入口、Navigation.tsx 透传 | K1、K2 | 150 |
| K7 | 主力 | R2-27 | shell-measure 的 lib 与 proof、shell 夹具、css-template-integrity | 无（先做夹具） | 130 |
| K6 | 主力 | R2-13 至 R2-17；R2-11、R2-12 的组件部分 | Navigation.tsx、ShellPins、ShellMenu、DomainDisplay、shell-copy | K4、K5 | 150（超出则 R2-14 拆成 K6b） |
| K8 | 经济 | R2-31（板与 locale）、R2-32 至 R2-34 | 板生成器与板、canvas.json、story-content 的 documents 段、governance.ts、story-budget | K2、K5 | 110 |
| K10 | 主力 | R2-28 门侧 | shell-measure、geometry-measure 夹具 | K7 | 100 |
| K11 | 主力 | R2-24、R2-28 的 story 侧、story-content 里的文字 | story-content、page-template、品牌 story、geometry-proof | K5、K6、K10 | 140 |
| K9 | 经济 | R2-29 其余、R2-30 | ai-consumption-contract、locales、ledger、content rows、CHANGELOG、migration、README | K3、K8、K6 交回 | 120 |
| K12 | 经济 | R2-35、R2-36 | smoke.test.ts、样板文案、fonts、docs/verification、owner-acceptance.md | 全部 | 120 |

分波次推进，并行上限 3：
- W1：K1、K2、K3。三包的文件集互不相交。
- W2：K4、K5、K7。
- W3：K6、K8、K10。
- W4：K11、K9。
- W5：K12。之后跑一次批末 verify，做一次验收（可按 Epic 分 3 片），再做一次判断。

总规模：实施约 1,570 响应；加上拆分约 100、验收约 400、判断约 120，整轮约 2,200 响应。关键路径是 K1 → K4/K5 → K6 → K11 → K12。

必须串行：Navigation.tsx K1 → K5 → K6；css K1 → K4 → K6；page-template K2 → K5 → K11；story-content K5 → K8 → K11；shell-measure K7 → K10；K3 先于 K9、K12（docShellMarkersVisible）；docs/verification 只在 K12。

风险：R2-12 删豁免后的红量未知；R2-22 可能动导出面（已按主力）；R2-36 重收视觉签名要求零非视觉红。
