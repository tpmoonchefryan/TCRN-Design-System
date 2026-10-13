# 附件 · P4 的 R3 回写素材（主线程汇编）

SUB-103、SUB-106 回写 style-scale、门清单、owner-acceptance、CHANGELOG、迁移说明与 README 时用：A 节是 R3 主线程问题清单（R3M1–R3M6：各包的结果、自定取舍、交判断与目视的项），B 节是各包 handoff 的取舍、例外与回显原文节选。只写已落地的事实；未做或有偏差的（R3M6 末段）照实写为现状。

## A. R3 主线程问题清单（runs/r3/problems/main.md 全文）

每条：现象、证据、处置。批末与各包问题清单一起合并处置。

**R3M1 P5 交回（合入 989fec7）：SUB-091 判据达成（第二次返工，主力档）。** `.tcrn-multi-select-dropdown` 改为纵向（flex-direction column、align-items stretch）；实测静态展开态列表紧贴触发器正下方（偏移 0、宽差 0、左缘对齐），四个选项不换行；full-surface 两个弹层用例亮暗都绿（R2 的 dark 红消除）；inputs-matrix 亮暗各 42/42、controlHeight 零偏差；R2 SUB-061 的 30px 末端区与 Select 同语境不回退。余项：样板 rail 红属 O-1（P1、P3 处理）；doc-shell-class 基线与 R2 清零说明仍按旧注释计 1 处静态命中（现为 0），交 SUB-046；静态展开态列表紧贴触发器而运行时浮层留 8px 间隙（判据未要求，交 R3 判断）。RM7 ① 的目视行按验收 B 改为复核项（P4 的 SUB-106 回写）。

**R3M2 P0 交回（合入 d706676）与一处主线程自身的扫描红。** SUB-095、104、096、092 判据达成：zh-CN 新漏译 0；「标签 — 原因」title 两边皆译 13 → 20 种（余法语 `Route` 一种，词典值本就同词，交 R3 判断定读法）；契约 README、设计目录 README、roles.json description 回写；构图三样板 story id `composition-three-sample`（`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`，CSF `compositions--composition-three` 在新建的 `apps/storybook/src/compositions.stories.tsx`），只用包公开组件、无新 token 与新 tcrn- 类；TopBar 与构图板的差（高 68 对 56、导航只能排在搜索之后、1024 下导航折 4 行）写进 P0 handoff 供 SUB-093 写 DIFF-2，并交 Owner 目视。授权外未做：gplus-samples 类目说明过时、ledger 两条已译的译文债未删、TopBar 缺导航槽（交判断与目视）。
主线程自身的红：P0 跑 `scan` 报 6 条 positive-overclaim 命中，全在 `runs/r2/excerpts/judgment.md`——主线程把扫描的禁用短语表原文写进了摘录的限制节。已在 3113b5e 改为指向扫描脚本的说明，全树复查只剩原有的脚本与测试文件。教训：派工摘录与调度文档里不写禁用短语原文（R3 判断考虑写进 lessons）。

**R3M3 P1 交回（合入 fa28ba9）与两处集成修复项。** SUB-090、088、097 判据达成：样板 rail 10 个 run 零偏差（引导列 16、文字列 48）；新增四个壳 token（`--tcrn-shell-sidebar-width` 220、`--tcrn-shell-sidebar-width-collapsed` 52、`--tcrn-shell-topbar-height` 52、`--tcrn-radius-paper` 14），移动端块未动，桌面几何限定在 `@media not all and (max-width: 760px)`，独立 TopBar 仍 68；TMS 夜间后缀 #7aa0f5 于 panel 6.86、bg 7.30，撤两条夜间豁免，axe 违规 0（豁免节点 90 → 80）。带出的旧几何期望：storybook-smoke 顶栏 68 与收起 92 共 14 条红、ai-consumption-contract 的 `railWidthPx: 92` → 作为集成修复项 I-P2 写进 P2 摘录；shell:parity 4 个角色 → P3 的 SUB-101 范围；smoke.test.ts 断言 220 局部覆写与 composition-one 的遗留导出 → 作为集成修复项 I-P3 写进 P3 摘录（两包均主力档，文件集仍不相交）。新增四个壳 token 属 O-1 授权的直接需要（数值取自 token 的裁定），收口回显。

**R3M4 P2 交回（合入 a5fe2ad）与续派 I-P2b。** I-P2、SUB-099、SUB-094 达成（storyCoverageManifest 转绿；shellFrame 10 个样板 run 纸离边 12、顶栏 52 零偏差，两条变异判红）；SUB-098 比较达成（14 条 focus-outline 红消除）但冒烟仍因构图三来源路径判错退出 1；SUB-093 映射达成（DIFF-1 记「已按 O-1 实现」、构图三入映射、DIFF-10）但 visual-proof 测试 1/16 红（storyKind 只认十个固定 id）。internal-alpha 的可复现性探针仍要求 openMenus 8。三条都是 P0 新 story 与 SUB-066 原型退役在 P2 持有文件里的集成后果，第三条直接落在 R2 判断 §3.3 对 8 → 6 的 B 类裁定内。处置：不另派代理，用 SendMessage 续派原 P2 代理（主力档、同一包树、快进到 a5fe2ad），三项各一提交：冒烟来源路径按注册导出判、storyKind 按注册表类目取 kind（不动 storybook-routes）、探针 8 → 6 逐个核对。P2 自定：测试里登记构图三与 DIFF-1 断言改查 P1/O-1 引用、clean 测试页加纸面框（handoff §5），交验收。

**R3M5 P2 续派与 P3 交回（合入 36b58d3、b3a2d0b）；SUB-101 的做法裁定；额度停点。** I-P2b 三项达成：storybook:smoke 退出 0；visual-proof 的 storyKind 按注册表类目取值（不动 storybook-routes），23/23 行、测试 16/16；可复现性探针 openMenus [6, 6]，逐个核对 6 个正是原 8 个减去 95f0e09 删掉的两个原型菜单钮。P3：I-P3、SUB-100（第二次返工，达成：静态结果留在版面内、碰撞 0、逐个核对 6 个菜单）、SUB-089（收起态 52）、SUB-102、SUB-105 达成；SUB-101 部分——画布色侧栏、品牌格、矩阵 4/4、shell-relations 转绿，axe 0；余下顶栏 52、引导列 16/48、侧栏 220/52 与两条暂缓例外未做，原因是同一批文档元素既对包壳又对知识库样板（样板用独立 TopBar、SideNav、NavGroup、NavItem，仍是包默认几何），两边不能同时转绿。
裁定（主线程按批量原则第 5 条「不阻塞工作的按建议先做、回显、Owner 事后可更正」，R3 判断复核）：取 P3 的方案 A——在 `story-demo-styles.ts` 为知识库样板的包件登记文档作用域例外（TopBar 的 min-height 与 padding-block；SideNav 的 padding、gap、background；NavGroup 标题的 padding-inline；NavItem 的 padding-inline-start），删除条件为 Navigation 家族批次让独立件提供构图一几何时；随后文档壳按构图一改 package-topbar、package-group-title、package-nav-item 与侧栏 220/52，删除 EX-INIT015-doc-shell-brand-collapse 与 -narrow；顶栏 52 连带的 `apps/storybook/src/smoke.test.ts` 约 538 行（96）与 `apps/storybook/src/build/page-template.tsx` 归同一续派。方案 B、C 要改门的比对数据或选择器，属 Owner，不取。P3 问题 2（重复选择器白名单加回 `.tcrn-product-shell-search__results`，随 EX-INIT015-doc-product-shell-search-static 一起删）判可接受；问题 4 的两条（demo-styles-sync 读 dist 要先 build 再同步再 build；SUB-105 用整份清单断言同时满足两条判据）知悉，交判断。
额度：本周全模型用量 99%（2026-10-12T21:00Z 重置），按设计会话的指示停在原地，不再派新代理；重置后先续派原 P3 代理做 SUB-101 余项（包树 `pkg/r3-P3` 保留，已快进到 b3a2d0b），再派 P4。

**R3M6 SUB-101 续做与冒烟钉值（合入 e1c463e、本提交前的合并）。** 方案 A 落地：新登记 4 条 `EX-INIT015-doc-knowledge-shell-topbar`、`-side-nav`、`-group-title`、`-nav-item`（删除条件为 Navigation 家族批次让独立件提供构图一几何），重复选择器白名单随之加 `.tcrn-nav-group__label`、`.tcrn-nav-item`；删除 `EX-INIT015-doc-shell-brand-collapse`、`-narrow` 与 `JUDGMENT_C21`；oracle 侧栏 288/280/360 → 220、顶栏 96 → 52；shell:parity 退出 0（四个角色与原三处转绿，变异判红）；随后冒烟 5 处旧文档壳钉值改为从壳层 token 与包导出读（b024f0e），storybook:smoke 退出 0。交 R3 判断确认：`shell-parity-proof.mjs` 约 534 行样板切换钮期望右距 23.04 → 16（比对方式未动，220 栏放下锁定组合所需）；两条白名单新增；`smoke.test.ts` 1212–1215 行钉值一并改（授权字面之外、同一 oracle 后果）。未做或有偏差（交判断与 Owner 目视）：文档壳品牌锁定组合仍为 38 标、文案起点 66 而非构图一的 48（缩 22 标要给包类写自定义属性，未授权）；文档壳纸离边 12 未做（未授权、门不量）；`page-template.tsx` 未改（品牌留在顶栏首列、负外边距成为侧栏顶端）；样板顶栏描述截成一行。

## B. 各包 handoff 节选

### P0（runs/r3/handoff/P0.md）

#### SUB-092：达成，story 已注册；visual-proof 的映射红按预期交 SUB-093

- **story id：** `composition-three-sample`，类目 gplus-samples，group Components，sourcePath 为样板的 `apps/storybook/src/contract-stories/gplus/sample-stories.tsx`。标题 `Composition three sample: projects`。
- **新文件：** `apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`（导出 `GplusCompositionThreeView`、`GplusCompositionThreeBlock`、`gplusCompositionThreeContentWidth = "1040px"`）。
- **四处注册：**
  1. `sample-stories.tsx`：`gplusCompositionThreeStoryId`、`gplusCompositionThreeStoryText`、`gplusCompositionThreeStory`；`gplusSampleStories` 仍是五个，不含构图三。
  2. `groups/components.ts`：在按下标配对的 flatMap 之后显式追加 `gplusCompositionThreeStory`。
  3. `governance.ts`：`storyRegistryOrder` 在 `inputs-sample-members` 之后加 `{ id: "composition-three-sample", group: "Components", categoryId: "gplus-samples" }`。
  4. `smoke.test.ts`：`expectedContractStoryIds` 加该 id，llms.txt 的 Components 列表断言补上该 id。
- **CSF 适配：** 新文件 `apps/storybook/src/compositions.stories.tsx`（title `Compositions`，导出 `CompositionThree`，Storybook id `compositions--composition-three`），登记在 smoke.test.ts Components 适配清单末尾；冒烟另断言 title 与 name。没有改 inputs.stories.tsx。
- **做法：**
  - 只用包的公开组件与 props：TopBar、ProductLockup、ProductShellSearch、SubNav、IconButton、Avatar、PageHeader、Button、Icon、TableShell、Text、Badge。
  - 不加 `[data-shell]`，不新增 token 与 tcrn- 类，没有改文档样式源、composition-one.tsx（只读其导出 `gplusSampleThemes` 与类型）、story-demo-styles.ts、alpha-styles.ts、storybook.css 与包代码。
  - 浅色、夜间两块，块外层用现有文档类 `tcrn-doc-theme-preview` 铺画布（与矩阵块相同）。
  - 内容放在样板自己的内联样式 `max-width: 1040px; margin-inline: auto` 里，内层用包类 `tcrn-product-shell-content-stack`。
  - 页面文案全部复用构图一的项目页词条。
- **顶栏排布：**
  - TopBar 的 brand、module 两列按内容取宽，只有 actions 列可收缩。第一版把导航和搜索都放进 module：1440 下 actions 被挤到约 0 宽，铃铛压在搜索上；1024 与 390 下整块撑出 story 框。
  - 现排布：brand 放产品锁定块；module 只放 ProductShellSearch，是 C8 唯一让步项，外包一层单列 grid 和 flex 行，让窄屏下搜索能小于包里固定的 320px；actions 放 SubNav（可折行）与铃铛、头像。
  - 导航 5 项：Workbench、Projects（计数 12，当前项）、Members、Billing、Settings。板上的「通知」项由铃铛承担。
- **TopBar 与构图板的差（供 SUB-093 写入 DIFF-2 的 story 文字，未改 TopBar）：**
  1. 高度：独立 TopBar 为 68px（min-height 68、padding 12/20），1440 下实测 68；板上构图三顶栏 56px。
  2. 次序：板上是品牌、导航、留白、搜索、铃铛、头像；这里是品牌、搜索、导航、铃铛、头像。原因是 TopBar 没有导航槽，而导航要能折行，只能放进唯一可收缩的 actions 槽。
  3. 导航外观：SubNav 是带边框的胶囊条，选中项用选中底色；板上是文字加 2px 墨线。Navigation 家族的结构留第二批。
  4. 窄视口：1024 下 story 框 672，actions 列约 150px，导航折成 4 行，顶栏高 207px；390 下 TopBar 堆成单列，顶栏高 243px。三种视口下块宽 1046、638、324，都在 story 框（1080、672、358）以内。
  5. 内容宽：1040 是 max-width。1440 下 story 框只给出 956px，所以实测内容宽 956。
- **读数：**
  - design-system-storybook test 10/10，含新增的构图三用例：两块、每块一个 TopBar、一个导航、一个搜索、无 ProductShell、无侧栏、无 data-shell、内容 1040、样板文字都在词典里、两个导航地标名不同。
  - contract:static、doc-shell:proof、internal-vocab:scan 绿。contract:static 的 `--details` 显示新 story 有 34 条被豁免的 C7 发现：TableShell 单元格的 title-missing 与 forced-wrap 各 16 条，属 records 家族；PageHeader 标题的 forced-wrap 2 条，属 layout 家族。与构图一同型。
  - internal-alpha browser-proof：
    - storyCount 65→66，新基线 30→33，是新 story 的三个视口；回归仍 155。
    - axe 12 条不变，clippedButtonText false，story 高度预算 ok、违例 0，zh-CN 新漏译 0。
  - geometry:measure 量到新 story，两种主题都 ok（rail、mark、contrast、controlHeight 为 n/a，非必测）；门红来自构图一五个样板的 rail。
  - storybook:visual-proof 因映射里没有新 story 而红（notInMap、130-GWT2 用例），按预期交 SUB-093。以上详见 problems/P0.md。

#### 判断 §3.3 回显项

- 第 5 条：构图三内容宽 1040 写在样板自己的内联样式里，不新增 token；独立 TopBar 高度未改（68 对板 56，见上）。
- 第 7 条：C2-4 取改词典键，story-content.tsx 未动。

### P1（runs/r3/handoff/P1.md）

#### 3. 4 个壳层 token（最终名字与值，沿用判断建议的名字，没有改名）

| 变量 | 值 | 契约 key / group | 注册名 / TokenGroup | 作用域 |
| --- | --- | --- | --- | --- |
| `--tcrn-shell-sidebar-width` | 220px | rail-w / shell | shell.sidebar.width / container | 主题无关 |
| `--tcrn-shell-sidebar-width-collapsed` | 52px | rail-w-collapsed / shell | shell.sidebar.width.collapsed / container | 主题无关 |
| `--tcrn-shell-topbar-height` | 52px | topbar-h / shell | shell.topbar.height / container | 主题无关 |
| `--tcrn-radius-paper` | 14px | r-paper / radius | radius.paper / radius | 主题无关 |

index.ts 的 contractGroups 新增 `shell → container`，没有新增 TokenGroup 成员，也没有新增导出。

壳里引用的现有 token：space-4（侧栏内距与引导列 16）、space-1（导航项向侧栏内距外伸 4、收起态横向内距）、space-3（导航项列间距、纸面离边 12）、space-1h（壳顶栏上下内距 6）、`--tcrn-color-surface-canvas`（侧栏，与壳根同一个变量）、`--tcrn-color-panel`（纸面底色，构图板 sheet 为 panel）、`--tcrn-shadow-s1`。48 = 16 + 20（图标列）+ 12（space-3 列间距）。导航项起始内距写成 `calc(var(--tcrn-space-1) - 1px + 深度缩进)`，其中 1px 抵消导航项自带的 1px 透明边框；不新增局部变量（token-extension-proof 绿）。

#### 4. 判断 §3.3 第 5 条回显

4 个壳层 token 按建议的名字和值新增（见上表）。本包没有新增构图三内容宽 token，也没有新增第 5 个壳层 token。独立 TopBar（`.tcrn-top-bar`）高度不改，仍是 min-height 68px，Navigation.test.tsx 新钉了这一条。

#### 5. SUB-090 的实现范围

- `.tcrn-product-shell` 保留局部变量 `--tcrn-product-shell-sidebar-width`（消费方仍可覆写），默认值引 `--tcrn-shell-sidebar-width`，收起值引 `--tcrn-shell-sidebar-width-collapsed`。
- 侧栏改用壳根的画布色，去掉右边线。这条在所有宽度生效，包括手机：O-2 要第 30 步的 ink-3 落在 bg 上。
- 壳顶栏的 min-height 引 `--tcrn-shell-topbar-height`。
- 其余构图一几何都放在 `@media not all and (max-width: 760px)`。它正好是移动块 `(max-width: 760px)` 的补集，移动块本身一行没改。这部分包括：
  - 引导列：导航项、分组标题。
  - 收起态横向内距 space-1：52 宽里留出 44，放得下 38px 收起钮和 44px 导航项。
  - 纸面：workspace 离壳的上、右、下边各 12，左边贴着侧栏；radius-paper、shadow-s1、panel 底色；`overflow: clip` 让顶栏圆角被裁掉，又不构成滚动容器，顶栏照样吸顶。
  - 壳顶栏上下内距 space-1h，单行顶栏正好 52。
- NavItem 的标记结构、API 与状态规则没动。

### P2（runs/r3/handoff/P2.md）

#### 3. 判断 §3.3 回显项

- 第 6 条：冒烟与 AI 契约里的旧壳几何按 O-1 改了值，前后值见上表；锚点门（internal-alpha）没有可归 O-1 的期望值，没改。
- 第 1、2 条：DIFF-8、DIFF-9 按裁定记「待 Owner 知悉」，没补 story，没恢复列。
- 第 5 条：本包没有新增 token。构图三的内容宽仍写在样板里，本包没碰。

#### 5. 摘录没点名、我按直接后果做了的改动（请判断复核）

- 冒烟 validateProductShellReadback 的缺省值 `?? 92` 改读同一个 token（I-P2 同族旧值，不影响现有判定）。
- SUB-094：
  - 夹具干净页 all.green.html 的 rail 壳加了 ProductShell 类、纸面与顶栏。geometry-measure 的测试要求干净页每项都 pass，并且每项都有一条打在干净页上的变异。这是本项的自检夹具，原有各项读数不变。
  - shellFrame 的两条变异放在 icon-sample-project：放在 brand 样板会让 `--family brand` 的测试多出两条变异。
  - 「real-story mutations」那条测试的运行集加了 icon-sample-project，标题去掉了「four」。
  - visual-proof 测试的一个标题去掉了「nine」。
- SUB-093：
  - `tests/storybook-visual-proof.test.mjs` 不在 SUB-093 列出的文件里，但在本包文件集内。按 SUB-093 的映射改动改了两处：
    1. 合成注册表加了构图三。它注明「合并后的批次构建出的注册表」，现在构建里有构图三。
    2. 原断言要求 DIFF-1 保持「待 Owner 裁定」，与裁定直接冲突，改为 DIFF-1 同时引 P1 与 O-1。
  - DIFF-1 与 DIFF-3 的 story 文字按现状改写：去掉了已过时的 280 / 92。
  - unmapped 里的「构图三」条目删除了：它现在有 story。
  - JSON description 写上 shellFrame：SUB-094 的补漏。

### P3（runs/r3/handoff/P3.md）

#### 3. 例外：登记与删除

- 新登记 `EX-INIT015-doc-product-shell-search-static`：
  - 范围：选择器 `.tcrn-doc-product-shell-search--static-display[data-search-expanded="true"] .tcrn-product-shell-search__results`，属性 position、inset。
  - 裁定：判断 R3-9 与 §3.3 第 4 条。
  - 删除条件：Navigation 家族批次由包提供静态结果展示时删除。
- 同一处改动的连带：重复选择器白名单加回 `.tcrn-product-shell-search__results`。SUB-026 删旧规则时一并删了它；不加回 shell-fidelity 就会报 duplicateSelectors。这超出了判断的字面写法，列在问题清单第 2 条，请 R3 判断确认。
- 删除：无。两条 C-21 暂缓例外见 SUB-101「未做」。

#### 例外：登记与删除

- 新登记 4 条，删除条件都是「Navigation 家族批次让独立件提供构图一几何时删除」，裁定都引 R3M5：

  | 例外 | 选择器 | 属性 |
  | --- | --- | --- |
  | EX-INIT015-doc-knowledge-shell-topbar | `.tcrn-doc-knowledge-shell-layout[data-standard-shell] > .tcrn-top-bar` | min-height、padding-block |
  | EX-INIT015-doc-knowledge-shell-side-nav | `... > .tcrn-side-nav` | padding、background |
  | EX-INIT015-doc-knowledge-shell-group-title | `... .tcrn-nav-group__label` | padding-inline |
  | EX-INIT015-doc-knowledge-shell-nav-item | `... .tcrn-nav-item` | padding-inline-start |

  - 选择器加 `[data-standard-shell]`，是为了压过故事页在 `.story-body` 下作用的包规则。
  - 项框外伸 4 用的是 margin，属摆放，不需要例外。
- 连带：重复选择器白名单新增 `.tcrn-nav-group__label` 与 `.tcrn-nav-item`，随上面 4 条例外一起删。
- 删除：EX-INIT015-doc-shell-brand-collapse 与 EX-INIT015-doc-shell-brand-narrow，连同 JUDGMENT_C21、文案淡出的过渡与动画规则、`tcrn-doc-sidebar-copy-reveal` 关键帧。
  - 收起与极窄态改为跟随包：文案 max-width 0，由文档盒子裁掉，不再淡出。

#### 偏离与说明

1. `scripts/shell-parity-proof.mjs:534`：样板切换钮的期望右距改了。
   - 原来是旧文档壳的公式 clamp(16px, 1.6vw, 24px)，1440 下为 23.04；现改为构图一侧栏内距 16。比对方式不变。
   - 依据 §3.3 第 6 条（O-1 直接后果的旧几何期望值）。不改的话，220 栏里留给锁定组合的宽度只有 135，放不下 141px 的锁定组合。
   - 请 R3 判断确认。
2. `smoke.test.ts`：除第 538 行外，第 1212–1215 行钉着 oracle 的 288 / 280 / 360 / 96，属同一文件、同一 oracle 后果，一并改为 220 / 220 / 220 / 52。
3. `page-template.tsx` 没有改。样板的 element-inventory 与 string-source 角色要求文档顶栏里含品牌与切换钮，所以品牌留在顶栏首列的 DOM 里，用负外边距成为侧栏顶端。
4. 品牌锁定组合没有缩到构图一的 22 标、12.5 字，仍是 38 标，文案起点在 66 而不是 48。原因：包只在 ProductShell 内缩放（brand.css.ts），文档侧要改就得给包类写自定义属性，不在授权内（问题清单「续派」第 3 条）。
5. 纸离边 12 没有做：不在续派授权列出的项里，门也不量。
6. 样板顶栏描述截成一行加省略号：52 高的顶栏放不下标题加两行描述，全文仍在 DOM 里。

### P5（runs/r3/handoff/P5.md）

#### 静态展开态读数

在本树构建出的静态页 `/components-gplus-matrices.html#inputs-matrix` 上，用 Chromium（Playwright，视口 1440×1000，locale en）实测。theme=light 与 theme=dark 两次加载，读数相同；每次页面里有浅色与夜间两个主题块：

| 主题块 | 容器 | 触发器 x / y / 宽 × 高 | 列表 x / y / 宽 × 高 | 列表顶 − 触发器底 | 宽差 | 左边差 |
| --- | --- | --- | --- | --- | --- | --- |
| 浅色 | flex · column · stretch | 367 / 1138.14 / 465 × 32 | 367 / 1170.14 / 465 × 154 | 0 | 0 | 0 |
| 夜间 | flex · column · stretch | 896 / 1138.14 / 465 × 32 | 896 / 1170.14 / 465 × 154 | 0 | 0 | 0 |

- 列表 position 为 static（原位展开），四个选项都是 455 × 36，标签各占 1 行。R2 判断记录的现象是列表排在触发器右侧，宽约 110px，选项折行。
- 构建出的静态站 CSS 里这条规则为 `.tcrn-multi-select-dropdown{position:relative;display:flex;flex-direction:column;align-items:stretch;min-inline-size:0;max-inline-size:100%}`。

