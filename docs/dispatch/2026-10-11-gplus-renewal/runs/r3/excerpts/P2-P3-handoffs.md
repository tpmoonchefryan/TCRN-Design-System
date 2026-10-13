# 附件 · R3 P2、P3 的前置包交回（P1 问题清单与交回、P0 交回原文）

## runs/r3/problems/P1.md

### 问题清单 · P1（INIT-015 R3 · 契约与包壳）

见红只记，不修、不为它重跑；同一根因算一条。门的日志只留在会话 scratch 的 `tmp/r3-P1/`。行号是包树 HEAD 上的位置，改前先 grep。

### 1. O-1 旧壳几何期望转红，按持有包分列（跨包约定第 4 条）

SUB-090 把 ProductShell 改成构图一几何后（侧栏 220、收起 52、壳顶栏 52、侧栏画布色无右边线、纸面离边 12），下列期望仍钉着旧值。本包不改别包文件。

### 1a. 持有包 P2（SUB-098、SUB-099）

- `scripts/storybook-smoke.mjs:333–334` 与 `:396–397` 的 `topBar: { minHeight: 68 }`：11 条 `topBar:min-height:52`（实测壳顶栏 52）。
  - designSystemVisualInstanceParityReadback 4 条：desktop-light-expanded-cockpit-search-rest、desktop-dark-expanded-cockpit、desktop-light-collapsed-work、reduced-motion。
  - ownerQualityProductShellProof 7 条：desktop-light-operations-cockpit、desktop-light-operations-cockpit-collapsed、desktop-dark-operations-cockpit、desktop-dark-operations-cockpit-collapsed、desktop-light-work-queue、desktop-light-work-queue-collapsed、reduced-motion。
- `scripts/storybook-smoke.mjs:637` 的 `railWidthPx: 92`（`:2768` 读取）：3 条 `side-nav-collapsed-rail-width:52:expected:92`（desktop-light-operations-cockpit-collapsed、desktop-dark-operations-cockpit-collapsed、desktop-light-work-queue-collapsed）。
- `scripts/full-surface-remediation-proof.mjs`：本轮未见红（两段都绿）。
- `scripts/internal-alpha-browser-proof.mjs`：未见可归 O-1 的红。axe 违规 0；视觉签名回归 155 条按 R2 第 5 条在 SUB-046 前不计入；storyCoverageManifest 的两项红是已知项（见第 4 条）。

### 1b. 持有包 P3（SUB-100、SUB-101）

- `shell:parity`（`scripts/shell-parity-proof.mjs` 与文档样式源）baseline、mutated、restored 三处同样的 4 个角色：
  - package-topbar：文档 `.tcrn-doc-global-bar` minHeight 68、paddingTop/Bottom 12，包壳顶栏 52、6（document-lags）。
  - package-group-title：文档 `.tcrn-doc-nav__category-toggle` paddingLeft/Right 8，包 `.tcrn-nav-group__label` 0（document-lags；分组标题落在引导列 16）。
  - sidebar-surface：文档 `.tcrn-doc-sidebar` 底色 rgba(11, 107, 101, 0.08)，包侧栏 rgb(239, 238, 234)（authority 为 document，报 package-lags）。
  - package-nav-item：文档导航项 paddingLeft 32，包 `.tcrn-nav-item` 3（authority 为 document，报 package-lags）。
  - 后两项的 authority 写的是 document：是改文档侧跟随包壳，还是把 authority 换成 package，由 P3 在 O-1 范围内定。
- `scripts/geometry-proof.mjs`：未见 O-1 红（只有第 4 条的 searchOverlay 已知项）。
- `apps/storybook/src/build/foundation-visual-standards.ts:575`（文档壳侧栏 clamp(280px, 20vw, 360px) 的说明）与 `:610`（`desktopSidebarMinWidthPx: 280`）：本包所跑的门没有因它们转红，列给 P3 核对是不是旧壳几何。

### 2. `apps/storybook/src/smoke.test.ts` 仍断言样板的 220 局部覆写（持有包 P0）

- 现象：`smoke.test.ts:36` 导入 `gplusSampleSidebarWidth`，`:1785` 断言每个样板块带 `--tcrn-product-shell-sidebar-width:220px`。SUB-090 按判据去掉了 composition-one 的局部覆写，这条断言会红。`@tcrn/design-system-storybook test` 不在本包局部门里，未执行，是按代码推断。
- 本包的处理：composition-one.tsx 保留导出 `gplusSampleSidebarWidth`（值仍为 220px，注释写明只为这处导入保留）。删掉它会让 storybook 的 `tsc` 编译失败，进而拖垮 `run build` 与所有读 storybook-static 的门。
- 待办：持有者删掉 `:1785` 的断言与 `:36` 的导入（可以改成断言块内没有内联覆写）。之后 `gplusSampleSidebarWidth` 可以从 composition-one.tsx 删掉（P1 文件，下一轮做）。

### 3. `apps/storybook/src/build/ai-consumption-contract.ts:866` 仍写 `railWidthPx: 92`（未授权，交 R3 判断）

- 现象：发布给消费方的 AI 消费契约里，ownerQualitySideNavPolicy 的收起侧栏宽仍是 92，O-1 之后是 52。没有门读这个值（smoke 用的是它自己 `:637` 的副本），所以没有红。
- 这个文件本轮在 P1 的文件集里，但只授权给 SUB-088 的后缀文案条件改动，SUB-090 没有授权改它，所以没动。建议和 P2 改 `storybook-smoke.mjs:637` 时同步改成 52，由 R3 判断指定改动方。

### 4. 本包所跑的门里看到的既有红（不是本包引起，同一根因各算一条）

- storybook:smoke 的 `searchInput:focus-outline-width:3px` 14 条（productShellComparatorProof 1、designSystemVisualInstanceParityReadback 5、ownerQualityProductShellProof 8）：基线就有（R2 problems/P6.md 第 3 条），R3 拆分已归 P2（133-GWT1 B2-2）。
- shell:parity 的 brand-lockup（surfaceTopGap 文档 12 对包 0）、sample shell 的 sidebar 内距与 gap、shell-relations（brandSurfaceLeft/Right、sidebarTopFromBrandBottom、navItemLeft）：R2 problems/P5.md 第 1 条已记，与本包改动无关（都是文档壳与知识库样板壳之间的差）。
- geometry:proof 的 searchOverlay baseline 与 restored：openMenus 6 对期望 8（判断 §3.3 第 4 条，R3-9 归 P3）。badge、brand、copy、mobileNavigation、recordContainment 的 baseline 与 restored 都绿，broken 变异按设计为红。
- internal-alpha:browser-proof：视觉签名回归 155 条（SUB-046 前不计入）；storyCoverageManifest 只有 mobileHashAnchorOcclusionCheck（C2-3）与 zh-CN 新漏译 3 条（C2-4，来自 496c1d7）两项红。回执已还原。

## runs/r3/handoff/P1.md

### 交回 · P1 契约与包壳（INIT-015 R3）

分支 `claude/init015-r3-p1`，从 b6a4519 切出。三张 Subtask 按包内顺序 SUB-090 → SUB-088 → SUB-097 做完，没有触发停下条件。问题清单在 `runs/r3/problems/P1.md`。

### 1. 提交

| 提交 | Subtask | 标题 |
| --- | --- | --- |
| 907de34 | SUB-090（R3-1） | feat(ui-react): ProductShell takes composition one's geometry from four shell tokens |
| 52faa47 | SUB-088（R3-2） | feat(ui-tokens): TMS wordmark suffix takes #7aa0f5 by night; night TMS exemptions withdrawn |
| 4a67524 | SUB-097（R3-3） | chore(contract): the Inputs text pair segment comment names rf |
| （本提交） | — | 交回与问题清单 |

### 2. 各单判据状态

- **SUB-090：判据达成。** geometry:measure 的样板 rail 在 10 次运行（5 个样板 × 浅色与夜间）里都通过，最大偏差 0 px（容差 0.5），所以 guideLefts 全为 16、textLefts 全为 48（原为 [16, 49] 与 [48, 77]）。判断 R3-1 第 5 点列的门已跑，因旧几何转红的期望按持有包写进问题清单第 1 条。副作用：样板去掉 220 覆写后，`smoke.test.ts:1785`（P0 持有）会红，见问题清单第 2 条。
- **SUB-088：判据达成。** token-contrast-proof 全绿：夜间 tms 在 panel 上 6.86、在 bg 上 7.30，都是通过，没有用豁免；只剩两条 DS 浅色豁免（3.83、3.30）。contract:static 的 C5 绿，主题块与夜间块都是 86 个属性。internal-alpha 的 axe 豁免回执只剩 DS 浅色两条登记（豁免节点由 90 降到 80，降掉的 10 个是 TMS 夜间节点），axe 违规为 0。127-GWT3 只判浅色，TMS 浅色仍为 #2c63c8，DS #6577f3 没动。
- **SUB-097：判据达成。** inputs.pairs.ts 只变第 5 行注释（d/h/f/x/r/rf/e/ef），contract-sha256 不变；contract:proof 的 generated-sources 绿。

### 3. 4 个壳层 token（最终名字与值，沿用判断建议的名字，没有改名）

| 变量 | 值 | 契约 key / group | 注册名 / TokenGroup | 作用域 |
| --- | --- | --- | --- | --- |
| `--tcrn-shell-sidebar-width` | 220px | rail-w / shell | shell.sidebar.width / container | 主题无关 |
| `--tcrn-shell-sidebar-width-collapsed` | 52px | rail-w-collapsed / shell | shell.sidebar.width.collapsed / container | 主题无关 |
| `--tcrn-shell-topbar-height` | 52px | topbar-h / shell | shell.topbar.height / container | 主题无关 |
| `--tcrn-radius-paper` | 14px | r-paper / radius | radius.paper / radius | 主题无关 |

index.ts 的 contractGroups 新增 `shell → container`，没有新增 TokenGroup 成员，也没有新增导出。

壳里引用的现有 token：space-4（侧栏内距与引导列 16）、space-1（导航项向侧栏内距外伸 4、收起态横向内距）、space-3（导航项列间距、纸面离边 12）、space-1h（壳顶栏上下内距 6）、`--tcrn-color-surface-canvas`（侧栏，与壳根同一个变量）、`--tcrn-color-panel`（纸面底色，构图板 sheet 为 panel）、`--tcrn-shadow-s1`。48 = 16 + 20（图标列）+ 12（space-3 列间距）。导航项起始内距写成 `calc(var(--tcrn-space-1) - 1px + 深度缩进)`，其中 1px 抵消导航项自带的 1px 透明边框；不新增局部变量（token-extension-proof 绿）。

### 4. 判断 §3.3 第 5 条回显

4 个壳层 token 按建议的名字和值新增（见上表）。本包没有新增构图三内容宽 token，也没有新增第 5 个壳层 token。独立 TopBar（`.tcrn-top-bar`）高度不改，仍是 min-height 68px，Navigation.test.tsx 新钉了这一条。

### 5. SUB-090 的实现范围

- `.tcrn-product-shell` 保留局部变量 `--tcrn-product-shell-sidebar-width`（消费方仍可覆写），默认值引 `--tcrn-shell-sidebar-width`，收起值引 `--tcrn-shell-sidebar-width-collapsed`。
- 侧栏改用壳根的画布色，去掉右边线。这条在所有宽度生效，包括手机：O-2 要第 30 步的 ink-3 落在 bg 上。
- 壳顶栏的 min-height 引 `--tcrn-shell-topbar-height`。
- 其余构图一几何都放在 `@media not all and (max-width: 760px)`。它正好是移动块 `(max-width: 760px)` 的补集，移动块本身一行没改。这部分包括：
  - 引导列：导航项、分组标题。
  - 收起态横向内距 space-1：52 宽里留出 44，放得下 38px 收起钮和 44px 导航项。
  - 纸面：workspace 离壳的上、右、下边各 12，左边贴着侧栏；radius-paper、shadow-s1、panel 底色；`overflow: clip` 让顶栏圆角被裁掉，又不构成滚动容器，顶栏照样吸顶。
  - 壳顶栏上下内距 space-1h，单行顶栏正好 52。
- NavItem 的标记结构、API 与状态规则没动。

### 6. 局部门结果

SUB-090（907de34 的内容上跑）：
- contract-generate：写了 5 个文件，只变头部 sha。tokens-sync 再生 tokens.css 与 storybook.css 的 token 块；`--check` 绿（C5 85 个属性）。
- ui-tokens：build 绿，test 10/10。ui-react：build 绿，test 163/163（含新测试“product shell geometry follows composition one through the shell tokens”）。`run build` 绿。
- css-template-integrity-proof 绿（0 findings）。token-extension-proof 绿。demo-styles-sync --check 绿。
- contract:proof：test 10/10，脚本 6/6 绿。contract:static：test 69/69，7 个条款全绿。
- geometry:measure：test 64/64，脚本 ok（rail 与 clip 在样板上都通过）；没有写 geometry-measure 报告。
- storybook:visual-proof：test 16/16，脚本 ok。
- storybook:smoke 红：28 条 = 14 条既有 searchInput 焦点 + 11 条 topBar 52 + 3 条收起宽 52，后两类都是 O-1，归 P2。
- shell:parity 红：4 个 O-1 角色（归 P3）加 3 个既有角色。
- geometry:proof 红：只有 searchOverlay 6 对 8（既有，R3-9）。
- full-surface:proof：两段都绿（test 11/11，脚本 ok）。
- internal-alpha:browser-proof 红（退出码 1）：axe 0；豁免节点 90；视觉回归 155 不计入；两项已知 storyCoverage 红。回执已还原。

SUB-088（52faa47 的内容上跑）：
- contract-generate 写了 5 个文件。ui-tokens build 绿（提交前修了一处类型错误后重建）。tokens-sync 与 `--check` 绿（C5 86 个属性）。
- ui-tokens test 10/10。ui-react test 163/163。`run build` 绿。
- token-contrast-proof：test 11/11，脚本 ALL PAIRS PASS。token-deprecation-notice test 6/6。
- contract:static：69/69，C5 绿。contract:proof：6/6 绿。
- internal-alpha:browser-proof 红：只剩 DS 浅色两条登记，豁免节点 80，axe 0；其余红同 SUB-090 那一轮。回执已还原。

SUB-097（4a67524 的内容上跑）：contract-generate 只写 inputs.pairs.ts；contract:proof 6/6 绿；ui-react build 绿。

### 7. 门外实测（会话 scratch 里的临时脚本读 storybook-static，不是门）

- 样板 brand-sample-product 浅色，1440 宽：
  - 侧栏 220，底色 #efeeea，右边线 0。
  - 纸面离壳上、右、下各 12，左边紧贴侧栏；radius 14，阴影 s1，底色白。
  - 壳顶栏高 52（min-height 52，上下内距 6）。分组标题在 16；导航项底色区 12–208；侧栏没有横向溢出。
- 1024 宽：样板的纸面约 406 宽，工具行折行，顶栏长到 147。窄纸面本来就会折行，旧几何下纸面更窄。
- 390 宽：纸面规则不生效，壳顶栏上下内距仍为 12。
- 收起态（在 1440 宽下切换属性，等过渡结束后读）：
  - 侧栏 52，scrollWidth 52，没有横向溢出。
  - 收起钮 7–45；品牌链接 5–47；标志 5–27（22，不缩放）。
  - 导航项 2–46，在 48 宽的分组 2–50 里靠起始边排，图标落在 14–30。图标中心 22，侧栏中心 26，旧 92 栏也是这种偏法。
  - 这组数给 R3-11 的收起读数参考。

### 8. 接续点

无。本包三单都已提交，工作树干净。下一轮可以接的有两项：
- smoke.test.ts 删掉那条断言以后，删 composition-one.tsx 的 `gplusSampleSidebarWidth`（问题清单第 2 条）。
- AI 消费契约 `railWidthPx` 改成 52，等 R3 判断指定改动方（问题清单第 3 条）。

### 9. 临时项

- 门的日志与临时测量脚本在会话 scratch 的 `tmp/r3-P1/`，不进仓。
- internal-alpha 两次运行新出的 `visual-selection-result.json` 已移进 `trash/r3-P1/sub090-ia/` 与 `trash/r3-P1/sub088-ia/`。
- 回执目录已用 `git checkout` 还原。

## runs/r3/handoff/P0.md

### 交回说明 · P0（INIT-015 R3 · 构图三与文案）

分支 `claude/init015-r3-p0`，自集成分支 b6a4519 切出。四张 Subtask 按包内顺序 SUB-095 → SUB-104 → SUB-096 → SUB-092 做完，没有停下的单，无接续点。只改了包表列出的独占文件；`locale-invariant-ledger.mjs` 没有改（没有按机器词登记的词）。

### 提交

| 提交 | Subtask（返工号） | 内容 |
| --- | --- | --- |
| e50162a | SUB-095（R3-15） | `storybook-content-text.ts` 搜索读数词条的键与五语值 36px → 32px |
| 5ba9a05 | SUB-104（R3-16） | `storybook-content-text.ts` 新增 6 条五语词条，补齐 7 种「标签 — 原因」title 的另一边 |
| a731c6a | SUB-096（R3-17） | 契约 README、设计目录 README、roles.json 的 description 按落地事实回写 |
| b2290e2 | SUB-092（R3-14） | 新增构图三样板 story 与四处注册、CSF 适配、冒烟断言、新词条 |
| 1f4bf20 | SUB-092（R3-14） | 构图三顶栏改排布，三种视口下都不撑出 story 框（见下文「SUB-092」） |
| 本提交 | — | 本交回说明与 problems/P0.md |

### 各单判据状态

### SUB-095：达成

- `storybook-content-text.ts:1301` 的键改为 `260px rest, 360px expanded, 32px high`，五语值同改（zh-CN `260px 静止, 360px 展开, 32px 高` 等），与 `story-content.tsx:1482` 用 oracle 值（searchHeightPx 32）拼出的串一致；没有加豁免，story-content.tsx 未动（§3.3 第 7 条：取改键）。
- 读数：internal-alpha browser-proof 的 `localeLeakZhCnNewLeaks` 为 0（R2 I1 记的 5 条里 foundation-visual-standards 的 `px rest`、`px expanded`、`px high` 三条已不在）。两次运行（SUB-104 之后、SUB-092 之后）都是 0。

### SUB-104：达成（读法说明见第 2 点）

1. 新增词条（都在 `storybook-content-text.ts`，「Preview refresh is downstream and route-owned」之后，五语齐）：

   | 键 | zh-CN | ja | ko | fr |
   | --- | --- | --- | --- | --- |
   | Add record placeholder | 添加记录占位符 | レコード追加のプレースホルダー | 레코드 추가 플레이스홀더 | Espace réservé pour ajouter un enregistrement |
   | Promote | 提升 | 昇格する | 승격하기 | Promouvoir |
   | Dispatch | 派发 | ディスパッチ | 디스패치 | Distribuer |
   | Inspect | 检查 | 検査 | 검사 | Inspecter |
   | Refresh | 刷新 | 更新 | 새로고침 | Actualiser |
   | Document publishing is not wired in this static DS fixture | 此静态 DS 夹具未接入文档发布 | この静的 DS フィクスチャには文書の公開が接続されていません | 이 정적 DS 픽스처에는 문서 발행이 연결되지 않았습니다 | La publication des documents n’est pas raccordée dans cette fixture DS statique |

   - `Add record placeholder` 原先只作为键 `Add Work placeholder` 的英文值存在，按页裁剪词典时该键不在页面上，所以运行时查不到；新键沿用同一组五语值。
   - `Promote` 的 ja、ko 没有用「昇格」「승격」，因为键 `Promotion` 已用这两个值；文档发布一句的 ja、ko、fr 也与 `Knowledge publishing…` 一句的值不同。值相同而英文不同时，运行时按当前文字反查原文，切换语言会把一个换成另一个。
2. 探针前后计数（只读探针放在会话 scratch，不进仓：构建产物全部页面、五种语言，读所有含「 — 」的 title，逐元素与英文对比）：
   - 改前：21 种 title，13 种在四种非英文语言下两边都与英文不同；8 种有一边与英文相同，即 I1 记的 7 种，再加 fr 的 `Route — …`。
   - 改后：21 种里 20 种两边都与英文不同；剩下 1 种是 fr 的标签 `Route`，词典里它的法语值本来就是 `Route`（同形词），属于已翻译。按 I1 的读法（两边都在词典里）改前 14/21、改后 21/21。
   - 「与英文相同的为 0」若按每一边逐字比，fr `Route` 仍算 1 条；它不在 7 种之内，本单没有改它，记在 problems/P0.md 第 6 条。
3. internal-alpha browser-proof 的 zh-CN 新漏译为 0（没有增加）。

### SUB-096：达成

- `docs/contract/README.md`：
  - 第 47 行 package-css 改为 P3 问题 P2 给出的正文：整张表的状态规则（clauses.md C2 定义的状态条件，或 pairs.json 的状态条件）里没有颜色字面量。
  - contract-static 一节在 C7、C8、C11 那句之后加一段：internal-alpha 的 clipped 判定（`clippedButtonText`）取元素自身、元素内部或最近带 title 的祖先，含可见文字即不算 clipped；这个祖先不限于组件根以内，也不要求子树里只有一个承载元素，所以与收紧后的 C7 有差异。放在 C7 所在的 contract-static 一节，没有放在第 47 行的 contract-proof 一节，因为说的是 C7。
- `docs/design/gplus-2026-10/README.md`：
  - 第 12 行 Inputs 文本类改为 d/h/f/x/r/rf/e/ef（与 pairs.json 的 inputs-text 一致）。
  - 第 16 行补 29 条字体刻度 token、链接状态对表（default 与 quiet，d/h/f 三态），并写明刻度 token 生成进 `packages/ui-tokens/src/gplus-tokens.generated.ts`。
  - 「浅色选择器由契约夜间选择器的属性派生」一句放在第 11 行 tokens.json 一栏（主题选择器属于 tokens.json；生成器 `themeSelectors` 取 `:root` 加 `[data-tcrn-theme="light"]`），并注明契约值不变。
- `docs/contract/roles.json`：只改顶层 description，写明第一批承载元素（现为 `tcrn-button__label`）的 title 须含可见文字，后续批次仍只要求非空（O-7 维持）。
- 读数：readme:proof、public-output:scan、internal-vocab:scan、contract:static 都是绿。

### SUB-092：达成，story 已注册；visual-proof 的映射红按预期交 SUB-093

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

### 判断 §3.3 回显项

- 第 5 条：构图三内容宽 1040 写在样板自己的内联样式里，不新增 token；独立 TopBar 高度未改（68 对板 56，见上）。
- 第 7 条：C2-4 取改词典键，story-content.tsx 未动。

### 局部门结果摘要（全部在包树内跑，回执已还原）

| 门 | 结果 | 说明 |
| --- | --- | --- |
| `run build` | 绿 | 最后一次在 1f4bf20 的源码上 |
| `--filter @tcrn/design-system-storybook test` | 绿 | 10/10 |
| `run internal-alpha:browser-proof` | 红（非本包） | 只有 storyCoverageManifest 的 mobileHashAnchorOcclusionCheck 红，与视觉签名回归（SUB-046 前不计）；本包字段全绿 |
| `run readme:proof` | 绿 | 1/1 |
| `run public-output:scan` | 绿 | |
| `run internal-vocab:scan` | 绿 | |
| `run contract:static` | 绿 | 测试 69/69，脚本 findings 为空 |
| `run doc-shell:proof` | 绿 | 13/13 |
| `run scan` | 红（非本包） | 6 条命中都在 `runs/r2/excerpts/judgment.md`（548a657 提交） |
| `run storybook:visual-proof` | 红（预期，交 SUB-093） | 测试段 15/16（130-GWT2）；另单跑脚本段一次取全貌：notInMap 为新 story，另有构图一样板 10 行 rail 红 |
| `run geometry:measure` | 红（非本包） | 测试 64/64；脚本段只有构图一五个样板的 rail 红，新 story ok |

### 接续点

无。

### 已清理与保留的临时项

- 已还原：每次门跑完都用 `git checkout -- docs/verification/internal-alpha` 还原回执。storybook-visual-proof 与 geometry-measure 两门这次没有写仓内文件。
- 移入会话 scratch 的 trash（`trash/r3-P0/`）：两份 `visual-selection-result.json`；internal-alpha 门生成的截图目录 `docs/verification/internal-alpha/screenshots/`，被 gitignore 的 310 张 PNG。
- 保留：包树里被 gitignore 的构建产物（`apps/storybook/dist`、`apps/storybook/storybook-static` 与各包 dist），后续在本树跑门要用，可随时重建；会话 scratch 下 `tmp/r3-P0/` 的探针脚本、门日志与截图，供 R3 判断复核，用完可整目录移走。

