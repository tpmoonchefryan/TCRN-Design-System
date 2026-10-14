# R2 判断 · TCRN-DS-INIT-016（STORY-135 至 150）

节行号：§0 L5；§1 L17；§2 L40（A L44、B L63、C L90、D L117、E L143、F L155、G L190、H L201、2.9 L208）；§3 L223（3.1 L225、3.2 L248、3.3 L256、3.4 L263、3.5 L274）；§4 L280（4.1 L282、4.2 L345、4.3 L349、4.4 L370、4.5 L375、4.6 L385）；§5 L389

## 0. 依据与判断补查

- 依据：三片验收 `runs/r2/acceptance/{A,B,C}.md`；主线程问题 M1–M6；拆分问题 12 条；13 份包问题（按条读）；跨包通告；批末 verify（6f739b2：30 步红 7、44 段红 8）；R1 判断 §3.1、§3.4；R2 拆分 §2。没跑门、没构建、没写链（只读跑过一次 knowledge-list）。
- 只读补查（scratch `judge-r2/`）：
  1. 板 `.ts-it .ic` 是 22×22、内距 3（`shell-screen.mjs:89`）；包件是 16 宽图标在 22 轨道里居中。两边字形都在 19–35，但 prail 读盒左缘（`shell-measure.mjs:400`，同 `measure-shell.js:56`），所以板读 16、包件读 19。差在盒模型。B2-2 的 `justify-self: start` 会让字形左移 3，C2-1③ 要连改 measure-shell.js，所以定为包件按板的盒画（R3-9）。
  2. measure-shell.js 与门库的 effBg、钉钮读法相同（第 10、60–61 行）。149-GWT4 只在板屏上比（`shell-measure-proof.test.mjs:274`），板屏上没有隐藏列，也没有叠放的兄弟元素，所以组 A 只改门库时，板屏读数不变。
  3. 测试第 517 行要求 scope.batch 恰是第一批五族，第 524 行要求「有豁免 ⇔ 批次 ≠ scope.batch」；families.json 的 note 已写明第二批到期。过期的是测试。
  4. roles.json 的 `toolbars` 为空：clauses.md 第 115 行登记的「顶栏」已退役，C8 在壳层家族里没有被测物。
  5. 图标尺寸字面值：`Navigation.tsx:2272、2288`（20、14）、`ShellBrandButton.tsx:98`（16）、`ShellMenu.tsx:293、807` 与 `ShellPins.tsx:326`（12）、`base.css.ts:539–540`（11）。Icon 的 sm、md、lg 由 token 换算（`Icon.tsx:34–38`）。`brand.css.ts` 的 44、22 是本 INIT 新增的，38、28 是 INIT-015 既有的。
  6. 基线的 `table-work-index-spec` 3 条在注册表已无此 id（b29f15f 改名）。
  7. axe 字标豁免表（`internal-alpha-browser-proof.mjs:94`）与换字跳过表（`client-scripts.ts:310`）都漏了首行锁定块。

## 1. R2 结论表

| Story | 验收结论 | 机器判据是否已满足 | 阻点类别 | R3 返工项 | Owner 目视项 |
| --- | --- | --- | --- | --- | --- |
| 135 壳 token | 部分 | 否：GWT4 contract:static 退出 1（测试不变式） | 可返工 | R3-6、R3-18 | 无 |
| 136 标按钮 | 阻塞于 Owner | 否：GWT3 夜间后缀 3.07（D7）；硬线差示意钮 16 字面值 | Owner（O-8）；硬线可返工 | R3-18 | 两版、hover / open、390、长字标（O-1） |
| 137 固定项 | 满足（机器判据） | GWT 全满足；硬线差 12 号图标字面值 | 可返工 | R3-18 | 固定项、选中、1023 已固定 |
| 138 完整菜单 | 满足（机器判据） | GWT 全满足；符合性差 srch-kbd 读法、prail、⌘K、字面值；墨迹 1.7 | 可返工；墨迹只等 O-4 | R3-2、R3-9、R3-16、R3-18 | 菜单与底栏锁定块、⌘K |
| 139 下拉与级联 | 满足（机器判据） | GWT 全满足；定位无 DOM 用例，地标重名 | 可返工 | R3-13、R3-14 | 下拉与级联（O-3） |
| 140 ProductShell | 部分 | 否：geometry:proof、parity 红；地标重名；焦点环不可见；字面值 | 可返工 | R3-4、5、10、14、16、18、25 | 顶带壳、铃铛、产品切换、拖排 |
| 141 登入动画 | 满足（机器判据） | GWT 全满足；读回缺替换句 | 可返工 | R3-26 | 登入动画 |
| 142 图钉 | 部分 | 否：pinJitter 红（隐藏列 0×0）；prail 红（盒差 3） | 可返工；O-5、O-6 | R3-1、R3-9 | 图钉三态 |
| 143 导航家族 | 部分 | 否：contract:static（不变式、C11）；TocRail；菜单外截断；C8 | 可返工；O-17 | R3-6、7、8、11、14、15 | Tabs 五形、面包屑分隔图标、TreeNav |
| 144 手机 Sheet | 部分 | 否：GWT3 geometry:proof 退出 1；文档页 ≤ 760 开面板 | 可返工 | R3-4、R3-21 | 手机 Sheet（O-15） |
| 145 首行变体 | 部分 | 否：brandDigest（产品键）；DS 1.4、zh-CN −1.1（换字）；axe 后缀；#7aa0f5；字面值 | 可返工；DS 1.4 只等 O-4 | R3-17、18、20、28 | 八枚首行两尺度 |
| 146 PageHeader | 部分 | 否：singleLine 读面包屑；geometry:proof、:measure 退出 1；TocRail 层级 | 可返工；O-16 | R3-3、R3-4、R3-15、R3-22 | 纸内页头、设置页、SplitView |
| 147 文档壳 | 部分 | 否：parity；浮层非真件；字标换字；弃用别名；30.02；AI 契约 | 可返工 | R3-5、19、20、21、23、24、27、28 | 文档站整体 |
| 148 五样板 | 部分 | 否：GWT2 23 行 19 绿（伸出画框） | 可返工；GWT1 只等 O-2 | R3-22 | 四板 D 段（发布后） |
| 149 壳层门 | 不满足 | 否：真件 13 过 5 红、prail 红、变异 21 / 22；verify 7 步红 | 可返工；markText 只等 O-4 | R3-1、2、3、9、17、22（verify 另需全部 R3） | 无 |
| 150 4.0.0 候选 | 部分 | 否：视觉签名未重收；清单 3 处过时；AI 契约旧字段；迁移待补 | 可返工 | R3-28、R3-29、R3-30 | 清单；离群 14 个 story |

结论：机判满足 4 张（各有硬线或证据项进 R3）、阻塞于 Owner 1 张、部分 10 张、不满足 1 张。R3 做完后照现有证据只剩 markText（O-4）一处红；本轮列 R3 返工，不收口。库门 0（S-1）不计入返工。

## 2. R3 返工清单

共 30 条，8 组：主力 25 条，经济 5 条（R3-13、24、25、26、29）。改共享契约的从主力起；标「R2-x 再返工」的 22 条一律主力，R3 再被退回就交 Owner，不再派；新出的 8 条退回一次升主力。改门判定语义的授权写在条内，汇总见 §3.4，没有一条放宽阈值。三片重复已合并。

### 组 A 壳层门读法（shell-measure 一族）

组内约束：阈值只在 THRESHOLDS，不改。每条都在 shell 夹具 `package-menu.html` 上补出真件 DOM（隐藏的已固定列、叠放的快捷键提示），证明旧读法红、新读法绿、原变异仍红。改完跑 149-GWT4，不等才把同一改动镜像到 `docs/design/gplus-2026-10/measure-shell.js`（量测工具，不是板）。

**R3-1 · pinJitter 与 story-label-plus-40 只读渲染出的元素**（主力；R2-27 再返工）
- 来源：B2-1、C2-1①、B2-9 后半、K7-6（不可接受）。现象：≥ 1024 时已固定列按设计隐藏，4 个钉钮读成 0×0，8 个菜单 run 基线红；label-plus-40 改的是该列的组标题，变异 21 / 22。证据：`shell-measure.mjs:404–405`；B 的 acc/05-gate-details.txt:1、11。
- 改法：钉钮尺寸与文字宽分组只收 `getClientRects().length > 0` 的元素；静止时 opacity 0 的钉钮照收（槽常驻是判据）。label-plus-40 改选 1440 下可见、不截断的文字，在夹具上证明判红；撤轨道的变异保持判红。
- 文件：`scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/shell-measure-proof.test.mjs`、shell 夹具的 `package-menu.html`、`mutations.json`、`manifest.json`。依赖：无。Story：142-GWT1、149-GWT1（D 段图钉位）、137-GWT5。

**R3-2 · contrast 的底色按叠放取**（主力；R2-27 再返工）
- 来源：A2-8、C2-1②。现象：srch-kbd-l、-n 读 8.58、7.23，板 7.59、6.11；快捷键提示是叠在 6% 墨洗 `input` 上的兄弟，effBg 只沿祖先取到面板底，实测有效值等于板值。证据：`shell-measure.mjs:199`；C 的 `45-kbd.json`。
- 改法：对比度格的底色改按格中心 `elementsFromPoint` 的绘制栈往下合成到第一层不透明底，期望值不改。自检：对比 R2 的 report.json，只有 srch-kbd 两格变到 7.59、6.11（±0.05），其余各格读数不变。
- 文件：同 R3-1（夹具加叠放的 kbd）。依赖：R3-1。Story：138 符合性、137-GWT5、139、149-GWT1。

**R3-3 · singleLine 对纸内面包屑逐段读**（主力；R2-28 再返工）
- 来源：B2-9 前半、C2-10①、K10 问题 4。现象：面包屑逐段截断带 title，pageCrumbs 过；singleLine 把整条 nav 当一个载体，ts-settings-m 50.6、ts-roster-m 18.3 判红，D 段面包屑红。证据：B 的 acc/05-gate-details.txt:12。
- 改法：不再收整条 `nav.tcrn-breadcrumb`，改收每一段（pageCrumb 键），每段照判单行、省略号、title。夹具加一段溢出又没有省略号的面包屑，证明判红。
- 文件：同 R3-1。依赖：R3-2。Story：146 几何门、143-GWT4、149-GWT1。

### 组 B 其他门与契约

**R3-4 · searchOverlay 只计面板外的碰撞**（主力；R2-24 再返工）
- 来源：A2-1、B2-5、C2-10⑥、K11 问题 1。现象：结果框在完整菜单面板里，面板按 07a 盖在纸上，和纸内 h2、首段相交 2 处；基线、变异、复原三次都红。证据：10 log:5；`geometry-proof.mjs:300–311`；K11 探针（只计面板外时基线 0、变异 1）。
- 改法：碰撞改为结果框与纸内文字的交集减去所在面板盒，并断言该面板底色 alpha 为 1（两主题）；现有变异照留，加「面板底透明」变异应判红。openMenus 仍由 DOM 派生；检查不撤（R1 §3.3）。
- 文件：`scripts/geometry-proof.mjs` 及其测试。依赖：无。Story：140（SUB-150 判据）、144-GWT3、146。

**R3-5 · parity 的 package-nav-item 比同一种行盒**（主力；R2-25 再返工）
- 来源：A2-2、C2-4、K2 问题 1。现象：文档菜单全是普通行（右内距 4），ts-x-l 全是可钉行（链接 0、包装 `.tcrn-nav-item-row` 4），只剩 paddingRight 一处差；两种行的右缘留白都等于板 `.ts-it` 的 4。证据：11 log:5。
- 改法：两侧都量行盒：普通行取 `.tcrn-nav-item`，可钉行取 `.tcrn-nav-item-row`；字段与阈值不变。加自检：把可钉行包装的右内距改成 0，应判红。
- 文件：`scripts/shell-parity-proof.mjs` 及其测试。依赖：无。Story：140（R1 SUB-121）、147（判定人 parity）。

**R3-6 · contract:static 的测试不变式随豁免到期更新**（主力；R2-12 再返工）
- 来源：A2-7、B2-3、M3、K4 问题 5 与 13。现象：第 517、524 行在第二批豁免删除后恒红，`run contract:static` 停在 `node --test`，门脚本没有执行到。证据：13 log:72–104。
- 改法：families.json 的 scope 列出已全量检查的批次（默认名 `checkedBatches: [1, 2]`），`validateExemptions` 与测试读同一字段：在列批次不得有豁免，不在列的必须有；五族断言改为「在列批次的家族」。另把 `NOT_CHECKED_HERE.C10` 补上 shellGeometryLiterals。
- 文件：`tests/contract-static-proof.test.mjs`、`scripts/contract-static-proof.mjs`、`docs/contract/families.json`。依赖：无。Story：135-GWT4、143（C1–C17）、140、146。

**R3-7 · C11 卡套卡按组合件的家族归属**（主力；R2-12 再返工）
- 来源：B2-4、K4 问题 8、K6b 问题 1。现象：ReadbackPanel（feedback，第 3 批）与 RecordInspector（inspection，第 5 批）以 `section.tcrn-surface…` 呈现，story 又往里放卡，门按 `tcrn-surface` 把 34 条记到已全量检查的 layout 族。
- 改法（取 B 片的方案 (a)）：一个元素同时带两个家族的根类时，C11 归组合件的家族；这两族仍按 exemptions.json 豁免，34 条照列在报告里，豁免条目写明随第 3、5 批到期。只带 layout 根类的卡套卡仍记 layout，并加一条 Surface 套 Surface 判 layout 红的自检。方案 (b) 要改第 3、5 批组件，越过授权，不做。
- 文件：`scripts/contract-static-proof.mjs` 及其测试；`docs/contract/exemptions.json`（只改说明）。依赖：R3-6。Story：143、146（C1–C17 卡套卡）。

**R3-8 · 把顶带登记为 C8 工具栏**（主力；新）
- 来源：K4 问题 10、§0 第 4 条（C8 在壳层家族没有被测物）。
- 改法：登记容器 `tcrn-shell-strip`、让步项 `tcrn-shell-pins`、固定项 `tcrn-shell-brand` 与 `tcrn-shell-cluster`（类名以 grep 核实），跑 C8 静态层与 story 层。发现只需用现有 token 补 min-width 或 flex-shrink 0 的，由 M4 在 shell.css.ts 改；需要板上没有的数值时，停下交 Owner，不自定数值。
- 文件：`docs/contract/roles.json`，必要时加测试。依赖：R3-7。Story：143、140（C8）。

### 组 C 包件样式与测试（packages/ui-react）

**R3-9 · 菜单引导列图标按板的盒模型画**（主力；R2-27、R2-13 再返工）
- 来源：B2-2（撤回其改法）、C2-1③（撤回改门口径）、§0 第 1 条。现象：prail 12 个 run 读 19，板 16；字形都在 19–35，差在盒（板 22 带内距 3，包件 16 无内距）。
- 改法：`.tcrn-shell-menu .tcrn-nav-item > .tcrn-icon` 改成板 `.ic` 的盒：宽高 `calc(var(--tcrn-icon-size-md) + var(--tcrn-space-1h))`、内距 `calc(var(--tcrn-space-1h) / 2)`、border-box、贴轨道起点；字形、文字 48、行 32 不变；Sheet 行按板核对后同改。单测断言盒 22、内距 3、字形左缘 19。门不改。
- 文件：`styles/shell.css.ts`、`ShellMenu.test.tsx`。依赖：无。Story：142 目的锚（B 段 NavItem 行 1:1）、138、149 prail。

**R3-10 · 纸内滚动区的焦点要看得见；兜底不能盖掉壳件自带的焦点**（主力；R2-8 再返工）
- 来源：A2-5、K1 问题 3、K1-146a（不可接受）、K6b 问题 5 的壳件部分。现象：`.tcrn-product-shell__main` 可以获焦，但外扩的 box-shadow 被纸的 overflow hidden 整圈裁掉（WCAG 2.4.7）；壳内兜底环还把头像自带的 inset 1px 细线换掉了。证据：A 的 `probe3-mainfocus.png`；`shell.css.ts:816`。
- 改法：滚动区基础规则声明焦点 pair（读 `--tcrn-focus-ring` 一组 token），`:where(:focus-visible)` 只切 pair，用内收形态（inset 或负 outline-offset），状态规则不写颜色。兜底规则排除自带焦点 pair 的壳件（头像等），别的家族不动。focusRingClipInPage 纳入纸内滚动区（收紧）。单测断言环在区内、头像细线保留。
- 文件：`styles/shell.css.ts`、`Navigation.test.tsx`、`scripts/geometry-measure-proof.mjs` 与其测试。依赖：R3-9。Story：140（R2-8）、硬线 C2。

**R3-11 · 导航项单行截断写进基础规则**（主力；R2-5 再返工）
- 来源：K1 问题 6。现象：截断只写在 `.tcrn-shell-menu .tcrn-nav-item__label`；菜单外的 NavItem（含弃用的 SideNav）会折行、没有 title。这违反硬线「导航项一律单行截断加 title」，而静态 C7 是靠菜单规则才过的。
- 改法：`base.css.ts` 的 `.tcrn-nav-item__label` 加 nowrap、ellipsis、overflow hidden、min-width 0；NavItem 只要有文字就带 title；删掉菜单规则里的重复声明。单测覆盖菜单内外两种情况。
- 文件：`styles/base.css.ts`、`Navigation.tsx`、`Navigation.test.tsx`。依赖：R3-10。Story：143（C7）、142。

**R3-12 · 删死变量与死规则**（主力；R2-7 再返工）
- 来源：K1 问题 2 与 5、K1-145b（有条件）、K6b 问题 3。
- 改法：删 `base.css.ts:13` 的 `--tcrn-motion-product-shell-search` 及其在 `storybook-smoke.mjs:1065` 的标记、`token-extension-proof.mjs:33` 的登记；删 `typography.css.ts` 已不命中的 `typographyCss03` 与注释依赖。迁移条目交 R3-29。
- 文件：上列。依赖：R3-11。Story：140（O-1 撤出）、146。

**R3-13 · 下拉定位与级联回退补 DOM 用例**（经济；新）
- 来源：K5 问题 12、K5-151g（有条件）。
- 改法：新建 `src/test/shell-dropdown.dom.spec.tsx`：下拉按固定层祖先定位、顶带尺寸变化后重定位（接续 6）；级联 ArrowLeft 回到可见的打开行。只加测试。
- 依赖：无。Story：139-GWT1、GWT4。

### 组 D 包件组件与 prop 面

**R3-14 · 地标名按实例区分，覆盖壳内全部地标**（主力；R2-17 再返工）
- 来源：A2-3、C2-10③、B2-10 的 nav 名、K11 问题 7。现象：landmarkLabel 只给了两个 nav；菜单面板、底栏 nav、下拉、内容区仍是固定名，TocRail 的 nav 无名，demos 与矩阵未传名，landmark-unique 30 个节点。
- 改法：landmarkLabel 作壳内全部具名地标的前缀（由 `landmarkOf` 组装五语），不传时名称不变；TocRail 的 nav 取它的标题作可及名；`prototypes/storybook-shell-demos.tsx`、`gplus/matrix-stories.tsx` 等处各传不同名。单测断言同页两个壳的全部地标名互不相同；30.02 的 landmark-unique 应为 0。
- 文件：Navigation、ShellMenu、ShellDropdown、shell-copy、DomainDisplay（TocRail）与测试，上述两份 story。依赖：组 C。Story：140（SUB-148）、147、143。

**R3-15 · TocRail 的标题层级**（主力；新，导出件 prop 面）
- 来源：B2-10、C2-10③、K11 问题 8。改法：TocRail 加可选标题层级（2 或 3，默认 3，名字属 B 类），文档页传 2；补单测。包件部分在 M4，page-template 在 M7。
- 文件：`DomainDisplay.tsx` 与其测试、`build/page-template.tsx`。依赖：R3-14。Story：143、146、147（heading-order 归 0）。

**R3-16 · ⌘K 只打开一个壳**（主力；新，prop 面、门收紧）
- 来源：A2-4、K5 问题 11。现象：每个 ShellMenu 都注册全局 ⌘K，文档页按一次，所有未受控的壳同时打开，焦点落在最后注册的壳；focusLoop 读不出。
- 改法：ProductShell 透传快捷键开关（默认名 `menuShortcut?: boolean`，默认开）；文档页只让文档壳注册，壳 story 默认关，门运行时按页面参数只开被测屏；focusLoop 断言焦点落在被测屏自己的搜索框（收紧）。ui-react README 的 Shell Control Boundary 同包更新（K3 问题 11）。包件在 M4，挂载与门在 M7。
- 文件：`Navigation.tsx`、`ShellMenu.tsx`、测试、ui-react README；`build/shell-hydrate.tsx`、`scripts/shell-measure-proof.mjs`。依赖：R3-14、组 A。Story：138-GWT4、140。

**R3-17 · data-logo 改写标的 id**（主力；R2-4 再返工）
- 来源：B2-6、C2-10②、K1-144c（有条件）。现象：`Navigation.tsx:630、717` 写 `asset.productId`，Mana、DS 成了 `mana-orchestrate`、`design-system`，而 logos2 与 Brand 板用 `mana`、`ds`，品牌 story 4 个 run 的 brandDigest 红。
- 改法：两处都改为 `asset.markId`；按产品键选这两枚的测试同步改。门和板的口径不动。
- 文件：`Navigation.tsx` 与相关测试。依赖：R3-16。Story：145-GWT1、硬线「品牌资产 digest」、149-GWT1。

**R3-18 · 壳件与首行的几何字面值改用 token**（主力；R2-11 再返工）
- 来源：K6b 问题 4、K4-b（有条件）、§0 第 5 条，依据硬线「几何逐值来自 token」。
- 改法：铃铛 20、头像 14、示意钮 16 改用 Icon 的 `"lg"`、`"sm"`、`"md"`（值不变）。12（三处）与语言菜单箭头 11：有同值同义 token 就用，没有就在 shell 组新设（名属 B 类，依 R1 §3.4 第 5 条，列入 F 段待补登）。`brand.css.ts` 本 INIT 新增的 22 改读 `--tcrn-shell-mark`，44 照此处理；38、28 不动。契约说明写定粗指针映射以 ui-tokens 的 `tcrnCoarsePointerTokens` 为唯一来源。R3-8 需要的 shell.css.ts 修补也在本包。
- 文件：Navigation、ShellBrandButton、ShellMenu、ShellPins、base / brand.css.ts；新 token 时加 tokens.json 与 ui-tokens。依赖：R3-17。Story：135、136、137、138、140、145。

### 组 E 文档站门与品牌字标

**R3-19 · browser-proof 的期望与等待时机**（主力；R2-26 再返工）
- 来源：C2-5 (b)(c)(d)、K12 问题 5、K6 问题 3。现象：(b) reproducibility 钉死 `openMenus === 6`，实际 14；(c) 禁用项读回读的是收起的顶带，读到 0 个；(d) zh-CN 泄漏扫描不等水合，同一代码 13 条对 0 条；(e) aria-describedby 有两个 id 时取不到说明。
- 改法：(b) 比两个探针的投影是否相等，且等于 DOM 派生的数；(c) 改读菜单打开的屏，或带禁用 NavItem 的页内样本；(d) 挂载入口在水合和换语言之后写一个标记属性，扫描等全部 `[data-shell-hydrate]` 都带上标记再读；(e) 按空白拆开 id 逐个取。阈值不放宽。
- 文件：`scripts/internal-alpha-browser-proof.mjs`、`build/shell-hydrate.tsx`（标记）。依赖：无。Story：147、150（30.02、30.04）。

**R3-20 · 品牌字标保持原样：首行锁定块进三张名单**（主力；R2-19、R2-26 再返工）
- 来源：B2-7、C2-3、B2-8、C2-10③、K12 问题 4、K2-2（有条件）。同一根因：字标载体按类名多处列举，SUB-161 的首行 `__word`、`__suffix` 都没收。现象：zh-CN 把 DS 首行换成「TCRN 设计系统」，markText 读 −1.1；axe 报后缀；brandMarkLocaleChecks 仍要后缀按语言翻译，与 SUB-166 和硬线相反。
- 改法：换字跳过表与台账的 `exemptSubtreeSelectors` 加 `.tcrn-brand-lockup__word`；`AXE_WORDMARK_SUFFIX_SELECTORS` 加 `.tcrn-brand-lockup__suffix`（与 2026-10-11 D2 同一口径，不加别的选择器）；`expectedDesignSystemSuffixByLocale` 各语言都取字标原样，描述行另查换字。加一条测试，断言三张名单收的载体集合相同。改完复读 zh-CN 的 markText 与 brandDigest。
- 文件：`build/client-scripts.ts`、`scripts/lib/locale-invariant-ledger.mjs`、`internal-alpha-browser-proof.mjs`。依赖：R3-19。Story：145-GWT2、145 符合性、147、硬线「品牌资产原样」。

### 组 F 文档站与 story（apps/storybook）

**R3-21 · 文档壳浮层换成水合的真件**（主力；R2-22 再返工）
- 来源：C2-6、K5 问题 7、K5-151c（有条件）。现象：文档壳的开合、搜索、主题、语言靠文档层脚本操作隐藏标记，≤ 760 打开的是面板而不是 Sheet，D1「壳只有一种」在窄屏不成立。
- 改法：文档壳经挂载入口水合真件：受控 `menuOpen`，`searchProvider` 读页内索引，`onThemeChange`、`onLocaleChange` 接现有脚本，保留 `data-doc-shell`，≤ 760 打开 Sheet。focus() 拦截按块 try / finally 还原，某块失败也放行。smoke 与 browser-proof 的文档壳读法同包对齐，门判定不改。
- 文件：`page-template.tsx`、`client-scripts.ts`、`shell-hydrate.tsx`、`scripts/storybook-smoke.mjs`、`internal-alpha-browser-proof.mjs`。依赖：R3-14、R3-16 包件部分、组 E。Story：147（D1）、144、141。

**R3-22 · 样板画框里的壳与画框同高**（主力；R2-23 再返工）
- 来源：C2-2、K5-160（有条件）。现象：壳的父级 `[data-gplus-static-markup]` 没有高度，`block-size: 100%` 落空，壳成了内容高（661、681），伸出 640 画框；映射 4 行与 gplus 段 overlap 红，壳层三段因此没在 verify 里执行。
- 改法：画框内的 StaticMarkup 包装层加 `block-size: 100%`，不改壳组件。复量：壳高 640、纸内可滚、overlap 为 0、shellFrame 与映射行仍绿。视觉签名交 R3-30 重收。
- 文件：`gplus/samples/composition-one.tsx`（必要时加 `matrix-renderer.tsx`）。依赖：无。Story：148-GWT2、149-GWT2、146。

**R3-23 · AOS 壳标题被判裁切**（主力；R2-23 再返工）
- 来源：C2-10⑤、K5 问题 13。现象：clippedButtonText 在三个视口都把 AOS 的 h3、h4 判为裁切；R1 探针读到这些标题和它们的祖先高度都是 0。
- 改法：先读 browser-proof 第 351–410 行的裁切判定，定下根因。是 story 塌陷，就改视觉实例的画框或布局；是门读了不渲染的变体，就按 R3-1 的口径改读法（这部分由持有该文件的 M7 改）。阈值不变。
- 文件：`visual-instances/aos-*.tsx`。依赖：无。Story：147、140、150。

**R3-24 · AOS 搜索结果变体与「工作项」**（经济；新）
- 来源：C2-10④、K3 问题 4 与 5。现象：两个 search-results 视觉实例算出了查询词却没传给壳，渲染的是收起的壳；`mobile-dark-zh-cn-work-queue` 缺「工作项」（基线就红，原因未查）。
- 改法：两个变体用 SUB-147 的 `menuOpen`、`menuQuery` 渲染打开的菜单和结果，复核 openMenus 与 noHiddenOverflow；查清「工作项」从哪里丢的，在 story 或字典里修。smoke 期望不放宽。
- 文件：两份 aos 视觉实例（必要时加 locale 字典）。依赖：R3-23。Story：147、150（17）。

**R3-25 · 文档页样板接上拖排与产品切换**（经济；新）
- 来源：A2-6。现象：壳 story 没接 `onPinsReorder`、没传 `products`，文档页看不到 140-GWT3、GWT4。
- 改法：shell-top-band 收起屏（或按 C-9 新登记一屏）用 `useProductShellController` 的 `productShellControlProps` 接本地偏好，传 `products`（TMS 当前，加 AOS 等已有五语名的产品）；smoke 期望与台账同包对齐。
- 文件：`shell-hydrate.tsx`、`smoke.test.ts`、`scripts/lib/story-budget.mjs`。依赖：R3-19。Story：140-GWT3、GWT4。

**R3-26 · 登入动画读回渲染替换句**（经济；新）
- 来源：K12 问题 9、K12-4（有条件）、K5 问题 9。改法：在 `story-content.tsx` 的 ShellIntroStory 读回里，加上字典中已有的替换句（五语已齐）。依赖：与 R3-28 同包。Story：141。

**R3-27 · 文档层的弃用别名与死规则**（主力；R2-21、R2-24 再返工）
- 来源：C2-8、K11 问题 2。现象：构建仍提示 28 个弃用别名 210 处（SUB-167 判据未达）；`alpha-styles.ts:441–450` 的死规则及其例外 EX-INIT015-doc-product-shell-search-static（SUB-150 判据要删）、白名单项都还在；style-scale.md 仍举旧类名。
- 改法：文档层文件换成 G+ 新名，按 build → demo-styles:sync → build 跑；同一个提交里删掉死规则、例外和白名单项；改 `docs/style-scale.md:234–246、278` 与 `icon-roster.tsx:1`。`story-content.tsx` 里的别名由 M9 换。复跑 shell:fidelity、doc-shell:proof、tokens:proof。
- 文件：`alpha-styles.ts`、`story-demo-styles.ts`、`storybook.css`、`OverlayFamilyLab.tsx`、`scripts/shell-fidelity-proof.mjs`、`docs/style-scale.md`、`icon-roster.tsx`。依赖：无。Story：147。

### 组 G 消费面与文档文字

**R3-28 · 清掉旧壳文字残留**（主力；R2-29 再返工）
- 来源：C2-7、B2-11、K9 问题 2–4、K8 问题 5、6、K3 问题 6。现象：AI 契约点名行之外仍按旧壳写（`ai-consumption-contract.ts:31–33、224、435–450、1060、1077–1079`）；另有 `navigationStrategyRows` 三行、`storybookOnlyPrototypeRows`、oracle 字段 `desktopSidebarWidthPx` 等、文档壳控制表其余行、aos 两份的 collapsed 变体与 slots、设计 README:11 与 storybook-map:33、136（#7aa0f5、rail-w）、两处 37、ui-tokens README:38 的「三块」。smoke 交叉检查钉着这些字段。
- 改法：按顶带壳与 M23 改写：弃用件写「已弃用，见 M23」；visualSkin、themeTransition 改顶带与纸；删宽度过渡与收起策略；oracle 字段改名、旧名留一个版本；collapsed 变体退役或改现有态，slots 用顶带词汇；设计文档写两主题同色、夜间待 D7，O-3 行标撤回；37 改 38；token 写四块。smoke 交叉检查、smoke.test 与五语同包改。代码与文案在 M9（顺带换 story-content 的别名），纯文档在 M10。
- 文件：ai-consumption-contract、foundation-visual-standards、content rows、story-content、aos 两份、matrix-stories、storybook-content-text、storybook-smoke、smoke.test；`docs/design/gplus-2026-10/{README,storybook-map}.md`、`docs/contract/README.md`、ui-tokens README。依赖：R3-21、R3-24、R3-27。Story：150、147、145（两主题同色）。

**R3-29 · 迁移说明追加本轮条目**（经济；新）
- 来源：K5-151f（有条件）；A2-3、A2-4 的「迁移说明补一句」。改法：从 M38 起只追加（C-11），写入 R3-12、R3-14 至 R3-18 的变化，以及「previewStates 只供文档与测试使用」；CHANGELOG 摘要同步列出。
- 文件：`docs/migration-4.0.md`、`CHANGELOG.md`。依赖：组 C、组 D。Story：150-GWT2、143、140。

### 组 H 收尾

**R3-30 · 批末生成物再生与清单校正（SUB-177 续做）**（主力；R2-36 再返工）
- 来源：C2-9、K12 问题 1、K12-8（有条件）。
- 改法：其余各包合入后在同一构建上做。① nonVisualProofOk 为真后按 K12 的分类重分，A 类离群（maxCell > 40）在选择文件逐条写理由并列为 Owner 目视项，再用 `--update-visual-baseline` 应用（先给上一份记录文件改名，KB-022）；`table-work-index-spec` 三条以「已改名、注册表无此 id」删除并记出处（机制不支持删除时，只对注册表外的 id 加删除处置）。② 一次再生几何、壳层门报告、映射、契约与 API 清单、internal-alpha 回执。③ owner-acceptance.md：第 178 行改批末读数，G-5 改现行读法，待裁表补齐 R1 §3.1 未进表各条与 O-16 至 O-18，G 行补本轮差距。nonVisualProofOk 仍为假就停在①。
- 文件：`docs/verification/**`、`owner-acceptance.md`。依赖：全部。Story：150（SUB-139、140、177）、149-GWT2、135-GWT4。

### 2.9 对照：批末红段 → R3 项

| 段 | 红在哪里 | R3 |
| --- | --- | --- |
| 10 geometry:proof | searchOverlay 碰撞 2 处 | R3-4 |
| 11 shell:parity | package-nav-item 的 paddingRight | R3-5 |
| 13 contract:static | 测试第 524 行；C11 34 条 | R3-6、R3-7（R3-8 可能新增发现） |
| 17 storybook:smoke | AOS search-results ×2；「工作项」 | R3-24；改期望的包同包对齐 |
| 18 geometry:measure | gplus overlap；brandDigest、pinJitter、contrast、singleLine、prail、变异 | R3-22、17、1、2、3、9；markText 只等 O-4 |
| 19 storybook:visual-proof | 映射 4 行 overlap | R3-22 |
| 30.02 browser-proof | axe 14；brandMarkLocale；禁用项读回；复现性；泄漏；AOS 裁切；视觉签名 | R3-14、15、20、19、23、30 |
| 30.04 hardening | 随 30.02 回执 | R3-30 |

R3 合入后，O-4 未裁时预计只剩第 18 步 markText 红（DS 1.4、底栏锁定块 1.7；D 段「标按钮 v2」同根）。

## 3. 只有 Owner 能定的事项

### 3.1 待裁（沿用 R1 15 项，本轮新增 3 项）

| # | 事项 | 建议 | 不裁时的默认 | 裁定后的改法与规模 |
| --- | --- | --- | --- | --- |
| O-4 | **唯一挡住 verify 归 0 的项。** 墨迹中线遇下行字母：DS 侧栏首行 1.4、底栏锁定块 en 1.7，又不许下移字形 | ±1 改量「首行大写顶到基线」，两行锁定块只量首行（底栏这样量是 0.6） | 照 ±1 判：markText 红，verify 非 0，145-GWT2、149 记部分，不能收口 | 门库与 measure-shell.js 同改，补夹具与变异，主力约 40；改后 DS 仍 > 1 再交 Owner |
| O-1 | 长字标放不下（要 117，格 60，D1 定宽 134） | 宽度至少 134、随字标加宽，07b 补长名屏 | 截断加 title | 改宽度规则与 brandGeometry 期望，主力约 40 |
| O-2 | 148-GWT1「五块」对四板 D 段加 07a 第 1 段 | 接受，注解写明读法 | GWT1 记部分 | 接受只写注解；要 Brand D 段约 60 |
| O-3 | 级联越过视口右缘 | 越界向左展开 | 现写法 | 改下拉定位与用例，主力约 40 |
| O-5 | Icon 板「禁填充」与 pin 实心态冲突 | 加例外，补画实心态 | 只改件数 | 画板、重生，约 30 |
| O-6 | 触摸端未固定图钉平时不显 | 粗指针下常显 ink-3 | 获焦才显 | 改粗指针规则，约 20 |
| O-7 | 文档站默认头像；目录宽 144 | 接受现状 | 现状 | 无 |
| O-8 | 夜间后缀 3.07 / 3.13 / 3.33（D7） | 随 S-6 一并裁 | 同色、标红、pending | 改 token、矩阵与测试，约 30 |
| O-9 | AOS 在 logos2 无标 | 补标或撤 AOS story | 占位并标明 | 约 20–30 |
| O-10 | 头像菜单几何、无账户图标板上没画 | 接受，目视时定 | 现写法 | 按目视意见改，约 20 |
| O-11 | 窄屏按视口还是容器切 | 容器查询 | 按视口 | 改容器查询加 1023 门，主力约 80 |
| O-12 | 下拉里显不显示 ⌘K | 不显示 | 不显示 | 无，可直接结掉 |
| O-13 | 纸升起的距离 | 设计会话给数 | 10 | 改 token 值，约 10 |
| O-14 | STORY-136 字重文本与板不一致 | 按板改 Story 文本 | 按板实现 | 只改 Story 正文 |
| O-15 | Sheet 夜间遮罩与下一级怎么开；新证据：遮罩下的纸夜间读 4.13，板 7.29（K7 问题 3） | 设计会话补 | 现写法 | 改遮罩夜间值、补下级导航，约 40 |
| O-16 新 | 纸内页标题行高：板 1.1（28.6）无 type token，包件 30（K1 问题 4） | 接受 30 | 30 | 要 28.6 就新增 type token，约 15 |
| O-17 新 | TreeNav 归宿：壳菜单与下拉由模型渲染，装不进 TreeNav（K8-5） | 接受；M22 / M30 写明 TreeNav 只用于消费方的下拉或浮层 | 现写法 | 要壳下拉装 TreeNav 属新 API，约 100 |
| O-18 新 | 批末 verify 不含 test:dom（A、B 两片盲区）；加段属执行方法变更 | 批末 verify 后加跑只读 `test:dom`，记入 steps.md | 不加 | 主线程脚本加一段 |

### 3.2 知悉

- 交设计会话一并发布：F 段补登 shell.mark、touch、crumb-icon 与 R3-18 的新 token；改过的四块板与 canvas.json；板内 token 块漂移（K8 问题 4）；measure-shell.js 若镜像改过，量板用新版。
- `brand.css.ts` 的 38、28 是第一批的品牌尺度，仍是字面值，C10 扫描只覆盖 shell*.css.ts。本 INIT 只改自己新增的 22、44。是否把第一批也改成 token，属第一批的范围，请 Owner 一并定。
- 别的家族的彩色 outline 在壳内会被兜底换掉（K6b 问题 5），改前就是如此，归各自批次处理。
- 挂载产物 523 KB、比对副本每页多约 27 KB，都无门管，不阻塞；退役件的类全量检查无新发现（K4 问题 14）。
- R2 批末的壳层三段没在 verify 里执行，三片读的是 K12 在同一份代码上的报告；ja、ko 的换字只按字典推断。M4：K9、K11 都已合入 9cffe33 或其后的集成分支，没有扩大范围；M6 已修。

### 3.3 授权外，不列返工

- 不放宽阈值：O-4 裁前 markText 照 ±1；searchOverlay 检查保留；axe 只按 D2 加首行后缀；不抬扫描上限；smoke、browser-proof 期望不放宽。
- 不做 B2-2 的 `justify-self: start` 与 C2-1③ 的改口径；不走 C11 方案 (b)，不碰第 3、5 批与其他家族的豁免和焦点画法。
- 不改第一批品牌尺度，不新增 type scale token；O-11、O-5、O-1 裁前不动。
- 不改 Shell 两板、07b 字句与画布画法（C-16）；measure-shell.js 只镜像门库读法。不改批末 verify 组成（O-18）。不声明也不绕过库门（S-1）；不推送、打 tag、发版、部署、发布画布。

### 3.4 按建议先做（实施侧自定，收口时回显）

1. 门判定语义（判断按 B 类授权，都不放宽阈值，Owner 可事后更正）：R3-1、2、3、4、5、19、23 的读法改动，R3-6、7 的豁免判定与归属，R3-20 的期望与 axe 豁免（执行 2026-10-11 D2），R3-30 删除已改名 story 的基线；R3-8、10、16 属收紧。撤回 B2-2 与 C2-1③，改由 R3-9 让包件对齐板。确认 K7-1 属 R1 §3.4 第 1 条授权的「正则放宽」。
2. 命名（B 类）：`menuShortcut`、TocRail 的层级 prop、R3-18 的新 token、`checkedBatches` 都是默认名，落地单可以改名，在交回里写明。
3. 各包「写明的选择」：三片 §5 判可接受的照收。其余：K1-143b 接受（O-1 裁后复核）；K1-144c → R3-17；K1-145b、K1-146a 不接受 → R3-12、R3-10；K4-a、K4-e、K6-h、K7-1、K11-a 接受；K4-b → R3-18；scope.batch 仍为 1 → R3-6；K5-151 与 151c → R3-21；K5-151f → R3-29；K5-151g → R3-13；K5-160 → R3-22；K6-e → R3-14；K7-6 不接受 → R3-1；K8-2 接受并知悉；K8-5 → O-17；K8-8、K9-1 → R3-28；K11-d 已由 SUB-173 补齐；K12-4 → R3-26；K12-8 → R3-30。
4. R3 拆分约定（由本判断定）：
   - 改动会让别包门期望过期的包，在同包里对齐那条期望（M2），Subtask 写明要改哪条。
   - 包表的「前置」列只写包号（M5）。
   - 串行文件链：Navigation.tsx 与 base.css.ts 走 M3 → M4；shell-measure-proof 走 M1 → M7；browser-proof、client-scripts、shell-hydrate 走 M5 → M7；storybook-smoke 走 M3 → M7 → M9；smoke.test 走 M5 → M9；aos 两份走 M6 → M9；matrix-stories 走 M4 → M9；story-content 只在 M9。
   - docs/verification 只由 M11 提交；迁移说明与 CHANGELOG 只由 R3-29 追加。

### 3.5 停点

- 推送、打 tag、发版、部署都不做，停在推送之前；画布发布交设计会话。
- Owner 目视：136–150 加第一批，按 owner-acceptance.md；拖排与产品切换等 R3-25，zh-CN 首行等 R3-20，⌘K 等 R3-16，离群项等 R3-30。
- 库门 S-1：声明 verify 之前，16 张 Story 与 INIT-015 的 13 张都不能转 done；两个 INIT 等 Owner 目视后再转。

## 4. 链写计划（主线程一次 work-batch；summary 都已量过，均 ≤ 160 字节）

### 4.1 Subtask

R2 的 37 张现在都是 planned。下表 24 张转 done，走三步 ready → active → done；前两步的 summary 写「R2 包已合入集成分支，批末验收已出」，第三步用表中的 summary。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-141 | work:c636931514bf857ed6f678dd | R2 验收满足：同源测试读 SCREEN_CSS，pnpm test 全链跑完 |
| SUB-143 | work:5366b81a43963f1c76873066 | R2 验收满足：夜间后缀同色记 3.07（D7），TMS 字标不截断，em 在 b 内 |
| SUB-147 | work:c36bc2b06e69d4818cc87799 | R2 验收满足：受控搜索词出 7 条结果，111 页分类说明无失败 |
| SUB-149 | work:3c973fbae5c7860c9051ea2b | R2 验收满足（组件层）：指针拖排与 Alt+←/→，onPinsReorder 接 movePin |
| SUB-152 | work:0300123a91ebcf734ac5f668 | R2 验收满足：data-text、data-guide 与 data-shell-group 钩子在位 |
| SUB-153 | work:690a0b54520491a9b4cd4f8a | R2 验收满足：名册 38 写进 Icon、Typography 板与五语，37 残留 0 |
| SUB-154 | work:0abe3db6aa16bec6544d614b | R2 验收满足：分组标题与结果带 title，空态常显，可钉行单行截断 |
| SUB-156 | work:f79cbc977d39c9eb7114da99 | R2 验收满足：C2、C7 余项清零，面包屑分隔符读 shell-crumb-icon |
| SUB-157 | work:b240c173e1f78b688275aedb | R2 验收满足：TreeNav 演示进 Popover 下拉；归宿待 Owner（O-17） |
| SUB-158 | work:6b36b464427407879cb4094d | R2 验收满足：迁移 M30 逐件处置表与 M31–M37，两份 README 六板 |
| SUB-159 | work:7f68dd62a3ba7f8692ec22fc | R2 验收满足：Sheet 打开时壳根 data-state=sheet |
| SUB-161 | work:ae61b8e5d9c51ff0d9b5dcc2 | R2 验收满足：品牌首行 story 与设置、名册四屏出值，四条变异判红 |
| SUB-162 | work:70b91df47b1895f039459a41 | R2 验收满足：页头间距 14、底线 line-2、字形对板；行高待 O-16 |
| SUB-163 | work:4abef65a5d6b10bee6ec993a | R2 验收满足：纸内标题默认 h1、页内壳传 2，page-has-heading-one 0 |
| SUB-164 | work:a3ed214220f61e218dea160c | R2 验收满足：markText 读品牌 story，三项新读数与四条变异判红 |
| SUB-165 | work:5212da08095cb2d515d4d13f | R2 验收满足：比对副本纳入壳层段，文档页搜索 936×40、行 12.5/32 |
| SUB-168 | work:28329f2b678ad3a156ef84fe | R2 验收满足：parity 退役 10 角色，smoke 比较器与索引当前项改新壳 |
| SUB-169 | work:e10e55e6f604bbb39aeccc3c | R2 验收满足：settings 23 例过，回执 431,657 字节，scan 绿 |
| SUB-170 | work:b1b44510726822bea50b83a6 | R2 验收满足：页模板按段首标记切壳层段，缺失与重复报错 |
| SUB-171 | work:61a8beee60da9dc5758f9021 | R2 验收满足：story-content 读回改顶带壳与两主题同色说法 |
| SUB-172 | work:f0b49392863a0833b98885e6 | R2 验收满足：canvas.json 板高与 y 与 heights.json 一致 |
| SUB-173 | work:938569e9b8d4c4b3ed4f5479 | R2 验收满足：storybook 包测试 12/12，样板五语改顶带壳 |
| SUB-175 | work:2d31ec456cf9edee7ed0f96a | R2 验收满足：shell-matrix 1664≤2000，台账九条现测，smoke missing 0 |
| SUB-176 | work:d4bd5e2975369edf453b7327 | R2 验收满足：AI 契约点名行、oracle、内容行与 #7aa0f5 残留已改 |

下表 13 张保持，走两步 ready → active，summary 写「R2 部分满足；R3 承接 <本行编号>」（最长 48 字节）。SUB-144、145 判据已满足，但 R3 要改它们写的东西，也保持。

| Subtask | id | R3 承接 |
| --- | --- | --- |
| SUB-142 | work:6e21862c3acaa7bc2e726899 | R3-6、R3-18 |
| SUB-144 | work:bf391e91e9ba439a0a9c2af2 | R3-17 |
| SUB-145 | work:53beecc703922e8bb33b0363 | R3-12 |
| SUB-146 | work:79bc4751909ec3fddc02fc54 | R3-10 |
| SUB-148 | work:cd46ee1a30ab388cad8f94fe | R3-14 |
| SUB-150 | work:b7790029f4dbd1414b2d281c | R3-4、R3-14、R3-27 |
| SUB-151 | work:6195d538cd393b1c3c230582 | R3-21 |
| SUB-155 | work:156b9ed2f979568fea023a2d | R3-6、R3-7、R3-8 |
| SUB-160 | work:2b378042f3f02d7a86a366db | R3-22、R3-23 |
| SUB-166 | work:2e7cc4cf77abf0f7280ba82b | R3-20 |
| SUB-167 | work:3c297dfe25bcf0cf7a42b676 | R3-27 |
| SUB-174 | work:6098761d0dcd688859f4cf9f | R3-1、R3-2、R3-9 |
| SUB-177 | work:375645cfb762fd69d9ceb510 | R3-30 |

R1 保持 active 的 22 张：下表 5 张承接的 R2 返工都已满足，各走一步 active → done。

| Subtask | id | done summary |
| --- | --- | --- |
| SUB-120 | work:8abfff3a7bd5da38b14ef84e | R2 承接项满足（R2-14）：拖排与偏好持久化在组件层，验收见 r2 分片 A |
| SUB-123 | work:8da1483603499565d95d92bd | R2 承接项满足（R2-5、R2-13、R2-31），验收见 r2 分片 B |
| SUB-124 | work:4e61f0f656a5427ee264da2e | R2 承接项满足（R2-5、R2-9、R2-33），验收见 r2 分片 B |
| SUB-129 | work:648bffe2050625726ee59021 | R2 承接项满足（R2-9、R2-16），验收见 r2 分片 B |
| SUB-133 | work:593492cd9ceffdd2c0a6683d | R2 承接项满足（R2-1、R2-31、R2-32）；GWT1 五块待 O-2 |

其余 17 张保持 active，不写转态；R3 承接：113 → R3-6；114 → R3-18（另有 O-8）；116 → R3-2、9、18；119 → R3-10、14、18、25；121 → R3-4、5、21；125 → R3-6、7、8、11；126 → R3-4、21；127 → R3-17、18、20（另有 O-4）；128 → R3-28；131 → R3-14、20、21、27；132 → R3-5、19；134 → R3-22；135 → R3-1、2、3；136 → R3-2；137 → R3-1、2、3、9、17、22（另有 O-4）；139、140 → R3-30。引擎有 Subtask 注解入口就同批写「R2 部分满足；R3 承接 …」，没有就不写。

本批共 103 个成员（24 × 3 + 13 × 2 + 5 × 1）。

### 4.2 Story 不转 done

16 张都保持 active（库门 0，引擎拒绝转 done），只写注解。不开 `--fixes` Story，返工由 R3 拆分建新 Subtask 挂原 Story。

### 4.3 Story 注解 summary

| Story | summary |
| --- | --- |
| 135 | R2 部分：GWT1–3 满足；GWT4 contract:static 因测试不变式过期退出 1。R3-6；硬线字面值 R3-18。库门 0 |
| 136 | R2 阻于 Owner：GWT3 夜间后缀 3.07 待 D7，其余满足；示意钮 16 字面值 R3-18。库门 0 |
| 137 | R2 机判满足：间距 8、上限 6、选中 6%；12 号图标字面值 R3-18。库门 0 |
| 138 | R2 机判满足；srch-kbd 读法、prail、⌘K 多壳、字面值 R3-2/9/16/18；底栏墨迹 1.7 待 O-4。库门 0 |
| 139 | R2 机判满足：接续 6、宽 240、级联 +4；DOM 用例与地标 R3-13、R3-14；O-3 待裁。库门 0 |
| 140 | R2 部分：geometry:proof、parity 红，地标重名，纸内焦点环不可见。R3-4/5/10/14/16/18/25。库门 0 |
| 141 | R2 机判满足：120/240/100、刷新 0、减弱 0；读回补句 R3-26。库门 0 |
| 142 | R2 部分：行为与变异满足；pinJitter 读隐藏列 0×0、prail 盒差 3。R3-1、R3-9；O-5、O-6。库门 0 |
| 143 | R2 部分：四条 GWT 满足；contract:static、TocRail、导航项截断、C8。R3-6/7/8/11/14/15；O-17。库门 0 |
| 144 | R2 部分：Sheet 行 44、INC-399 三腿按期；geometry:proof 退出 1，文档页 ≤760 非 Sheet。R3-4、R3-21。库门 0 |
| 145 | R2 部分：data-logo 产品键、zh-CN 字标被换字、后缀 axe；DS 首行 1.4 待 O-4。R3-17/18/20/28。库门 0 |
| 146 | R2 部分：四条 GWT 满足；singleLine 读面包屑、几何门、TocRail 层级。R3-3/4/15/22；O-16。库门 0 |
| 147 | R2 部分：GWT1–4 满足；parity、文档壳浮层、字标换字、弃用别名、30.02。R3-5/19/20/21/23/24/27/28。库门 0 |
| 148 | R2 部分：映射 23 行 19 绿（样板伸出画框）；GWT1 待 O-2。R3-22。库门 0 |
| 149 | R2 不满足：真件 13 过 5 红、prail 红、变异 21/22，verify 7 步红。R3-1/2/3/9/17/22；O-4。库门 0 |
| 150 | R2 部分：GWT1–4 满足；视觉签名未重收、清单 3 处过时、AI 契约旧壳字段。R3-28/29/30。库门 0 |

### 4.4 INIT-016 注解要点

- summary：「R2 判断：机判满足 4、待 Owner 1、部分 10、不满足 1；R3 返工 30 条（主力 25、经济 5）；Owner 待裁 18；库门 0」，共 140 字节。
- 正文要点：批末 verify 6f739b2 红 7 / 8（R1 为 9 / 12）；验收与判断路径；prail 改为包件对齐板；O-4 是唯一挡住 verify 归 0 的项；R3 共 11 包 5 波；停点不变。

### 4.5 知识卡

lessons.json 5 条，接 TCRN-DS-KB-031；主线程逐条 knowledge-capture 并读回（需要时加 `--allow-trailing`），被预算拒绝的记阻塞。

1. 包件夹具要照包件的真实 DOM 写；照板写，会夹具绿、真件红。
2. 对比度门只沿祖先链取底色，会漏掉叠放的兄弟元素。
3. 关系断言量元素盒时，两侧盒模型不同会造成假差；字形同位就不要去挪字形。
4. 同一类载体在多处按类名列举，新加一个载体时会全部漏掉。
5. 读文字的门要等水合与语言切换完成，否则结果会随竞态翻转。

### 4.6 不在本次链写内

Story 与 INIT 的转态、INIT-015 的 13 张（库门为 0）；R3 新 Subtask 的建单（由 R3 拆分负责）；Owner 待裁项与库门声明。本轮不写纪要。

## 5. R3 规模估计与分包建议

| 包 | 档 | 返工项 | 前置 | 预计响应 |
| --- | --- | --- | --- | --- |
| M1 | 主力 | 组 A：R3-1、2、3 | 无 | 110 |
| M2 | 主力 | 组 B：R3-4 至 R3-8 | 无 | 130 |
| M3 | 主力 | 组 C：R3-9 至 R3-13 | 无 | 120 |
| M4 | 主力 | R3-14、17、18；R3-15、16 的包件部分；R3-8 发现的 CSS 修补 | M2、M3 | 145 |
| M5 | 主力 | R3-19、20、25 | 无 | 125 |
| M6 | 主力 | R3-22、23、24 | 无 | 100 |
| M7 | 主力 | R3-21；R3-16 的挂载与门；R3-15 的 page-template；R3-23 需要时的门部分 | M1、M3 至 M6 | 140 |
| M8 | 主力 | R3-27 | 无 | 80 |
| M9 | 主力 | R3-28 的代码与文案；R3-26；story-content 里的别名 | M4、M6 至 M8 | 130 |
| M10 | 主力 | R3-28 的纯文档部分；R3-29 | M4、M7 | 60 |
| M11 | 主力 | R3-30 | 全部 | 130 |

并行上限 3：W1 M1、M2、M3；W2 M4、M5、M6；W3 M7、M8；W4 M9、M10；W5 M11。之后批末 verify 一次（O-18 获准就加 test:dom），按 Epic 分 3 片验收，再判断。

总规模：实施约 1,370 响应，加拆分约 100、验收约 400、判断约 120，整轮约 2,000 响应。关键路径 M3 → M4 → M7 → M9 → M11。

风险：M4、M7 贴着上限，逼近时提交干净状态、写接续点交回（M4 可把 R3-18 拆成 M4b 进 W3）。R3-8 登记后红量未知，要板外数值的交 Owner。O-4 不裁时 R3 全绿也停在 markText，届时判断写「无可做返工、建议收口」。
