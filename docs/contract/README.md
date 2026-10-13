# 契约门入口

本目录存放 G+ 机器消费契约（TCRN-DS-INIT-015）的条款与登记文件。本文是门的入口，逐门写明查什么、阈值、自带变异、豁免怎么登记、怎么单跑，以及在 `pnpm verify` 里排在哪一步（TCRN-DS-STORY-133）。条款原文与各条落点见 `clauses.md`，数值刻度见 `docs/style-scale.md`。

## 本目录文件

| 文件 | 用途 |
| --- | --- |
| `README.md` | 本文：门清单、判据、阈值、变异、豁免登记方式、运行方式 |
| `clauses.md` | 条款 C1–C17 原文、契约静态门的口径与各条落点 |
| `families.json` | 16 个家族与包 CSS 根类的对应；`scope.batch` 指定全量检查的批次（第一批五家族） |
| `exemptions.json` | 契约静态门的豁免登记：每条只豁免一个家族、一组类或一组选择器，写明条款并带裁定引用 |
| `roles.json` | C7 单行角色的承载类、C8 工具栏登记、C11「通用件拼壳」的壳层登记 |

契约数据本身在 `docs/design/gplus-2026-10/contract/`：`tokens.json`、`typography.json`、`pairs.json`、`icons.json`、`marks.json`、`matrices.json`。生成物只由 `node scripts/contract-generate.mjs` 写入，文件头注明「由 contract 生成，勿手改」。

## 运行方式

分阶段验证沿用 TCRN-DS-STORY-119：开发期只跑受影响的门，批末跑一次全量 `pnpm verify`。

- **单跑一道门。** 每道门有自己的根脚本。`pnpm <脚本>` 先跑该门的 `node --test tests/<门>.test.mjs`，再跑门本身，不带其它门。脚本名后面的参数会传给门，例如只查 Actions 家族：`pnpm contract:static --family actions`、`pnpm geometry:measure --family actions`。只跑门、跳过单测时用 `pnpm exec node scripts/<门>.mjs <参数>`。
- **前置构建。** 下列门都读构建产物：`packages/ui-react/dist`（包 CSS 与导出），或 `apps/storybook/storybook-static`（静态文档）。所以先跑 `pnpm build`，它会依次构建全部包与静态文档。浏览器门用 `@playwright/test` 的 Chromium。
- **报告。** 在 verify 里，各门把报告打印到标准输出（JSON 或逐腿文本），不写仓内文件。需要落盘的报告（geometry-measure 与 storybook-visual-proof 的 `--write-report`，contract-static 的 `--report <路径>`）在批末显式重生成，不随 verify 写。
- **不跳过。** 没有任何无条件跳过开关，豁免只能按下文各门的登记方式逐条登记，并带裁定引用（STORY-133 实现说明）。开发期缩小范围的参数（`--family`、`--story`、`--kind`、`--theme`、`--no-mutations`）只用于单跑，verify 一律跑默认的全量。

## verify 里的位置

`pnpm verify` 的既有步骤与顺序不变，新门插在下列位置（全部排在 `pnpm build` 之后）：

| 位置 | 步骤 | 前置 |
| --- | --- | --- |
| `tokens:proof` 内 | `node --test tests/token-contrast-proof.test.mjs`、`node --test tests/token-deprecation-notice.test.mjs` | ui-tokens 构建 |
| `tokens:proof` 之后 | `pnpm contract:proof` | 包 dist |
| `doc-shell:proof` 之后 | `pnpm contract:static` | 包 dist 与静态文档 |
| `storybook:smoke` 之后 | `pnpm geometry:measure` → `pnpm storybook:visual-proof` → `pnpm doc:sample-style` → `pnpm fonts:render` | 静态文档与 Chromium |

`doc-shell:proof` 原已在 verify 中；token-deprecation-notice 由 storybook 构建调用，不阻断构建。

## 各门

### contract-proof · `pnpm contract:proof`

- **建立。** TCRN-DS-SUB-011（STORY-122），门 `scripts/contract-proof.mjs`，测试 `tests/contract-proof.test.mjs`。
- **判据。** 共六项检查，任一项红就退出 1。
  - generated-sources：七个生成物都存在，带「勿手改」头，头部的 contract-sha256 等于按生成器算法重算的契约哈希，并且与内存中的 `generate()` 逐字节相同；生成目录里没有别的文件。
  - generated-state-rules：生成的 pair 状态规则只切换 `--tcrn-pair-*`，不写颜色字面量，每个 ruleOrder 条目对应一条规则。
  - package-css：dist 的 `tcrnComponentCss` 逐字包含全部生成段；整张表的状态规则（clauses.md C2 定义的状态条件，或 pairs.json 的状态条件）里没有颜色字面量。唯一放行与 C2 相同：只有 transparent 的 outline。
  - icon-roster：icons.json 的名字与 dist 的 `tcrnIconNames` 是同一集合。
  - product-marks：由 marks.json 生成的 8 个 SVG 与 `logos2/`、dist 的 `tcrnProductMarkSvg`、AI 契约登记的字节数和 sha256 逐字节一致。
  - matrix-expect：五块板的契约格、生成的矩阵数据与画板 `data-cell` 是同一批格，每格的期望值（两位小数）与画板 `data-expect` 相差为 0，kind 与豁免标记一致。
- **阈值。** 数量是门里的常量：37 个图标、8 个标文件、五板分别 44/28/10/116/42 格、生成的状态规则 25 条，期望值的差为 0。契约有意改数量时，同批改这些常量。
- **变异。** 测试 8 条，全部在临时副本或内存副本里做。分别是：改 pairs.json 的一个 ink 但不重生成，判红；包 CSS 状态规则注入颜色、weight 写成颜色、手改生成文件，各判红；图标改名或 dist 少一个名字，判红；改一枚标的 body 或给文件多加一个字节，判红；改一格 data-expect 或删一格，判红。
- **豁免。** 没有登记入口。矩阵格的对比度豁免只来自契约：`matrices.json` 的 `exempt: true`（现有 22 格，都是禁用态）必须与画板格的 `data-exempt` 一致，本门的 matrix-expect 核对两边。要增减豁免格，先改画板与 `matrices.json`，再重生成。依据是 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D6：画布是确认面，仓内契约文件是实现、story 与门的数据来源。
- **单跑。** `pnpm contract:proof`，或用 `pnpm exec node scripts/contract-proof.mjs --json` 输出结构化结果。改契约后的顺序是 `node scripts/contract-generate.mjs`，然后 `pnpm build`，最后跑本门；只重生成、不重建时 package-css 判红。

### contract-static-proof · `pnpm contract:static`

- **建立。** TCRN-DS-SUB-036（STORY-132）建立，story 渲染层由 TCRN-DS-SUB-037 补全。门 `scripts/contract-static-proof.mjs`，解析库 `scripts/lib/css-rules.mjs`，测试 `tests/contract-static-proof.test.mjs`。
- **判据。** 用包 CSS（dist 的 `tcrnComponentCss`）与发布的 `@tcrn/ui-tokens/tokens.css` 检查以下条款，任一条款有发现就退出 1：
  - C2 状态规则不越级、不写颜色；
  - C5 浅色与夜间每个选择器的属性集相同，主题 token 块的键集相同；
  - C6 不用左边条或 inset x 偏移作选中标记；
  - C7 单行角色带 nowrap、ellipsis 与裁切；
  - C8 工具栏恰有一个让步项；
  - C11 禁用清单：渐变、模糊超过 3px、卡套卡、表情图标、左边条；
  - C13 文档层不渲染包里没有的 tcrn-* 类，取 doc-shell-class-proof 的差集。
  C7、C8、C11 另在静态 Storybook 的 story 区块上检查。读不到 story 区块或差集算不出时判红（`Cx.story-input-missing`、`C13.input-missing`），不跳过。
  C7 story 层取哪个 title 见 `clauses.md` C7（TCRN-DS-SUB-079 收紧）：祖先上的 title 只算到组件根为止，且该祖先的子树里只有这一个承载元素。internal-alpha browser-proof 的 clipped 判定（`clippedButtonText`，TCRN-DS-SUB-084）与收紧后的 C7 有差异：截断文字的 title 取元素自身、元素内部，或最近带 title 的祖先，含可见文字即不算 clipped；这个祖先不限于组件根以内，也不要求它的子树里只有一个承载元素。所以同一个截断元素可能在 internal-alpha 不算 clipped，却在本门判 `C7.story-title-missing`。
- **阈值与口径。** 各条的判定口径写在 `clauses.md` 对应条款的「本门」段，例如左边条 2px 阈值、透明 outline 允许项、无变体时的 (0,2,0) 特异性、状态类 ARIA 列表。改口径时，同步改门里的常量与测试的允许项用例。
- **变异。** 测试先证明夹具全绿，再对每条规则注入一条变异并断言转红（C14）。测试同时覆盖 STORY-132 GWT1–3、豁免登记校验，以及仓内契约文件的一致性。
- **豁免。** 登记在 `docs/contract/exemptions.json`，每条必填：
  - `id`；
  - `clauses`：只收本门检查的条款编号，不收通配；
  - `ruling`：裁定引用；
  - `reason`；
  - `family`、`classes`、`selectors` 三者恰好有一个。
  第一批家族、其类，以及选中其类的选择器都不能登记。格式不合规时门判红（`CONTRACT_STATIC_EXEMPTION_INVALID`），本次没有命中的条目列在报告的 `scope.unusedExemptions`。现有 12 条：
  - 11 条是第二至五批家族，依据 TCRN-DS-INIT-015 scope 不授权段（本 INIT 只授权第一批五家族进包）与 R1 拆分问题清单 P4；
  - 1 条按类登记 LockHint 默认的表情字符锁形图标（C11），依据同上，并引用 TCRN-DS-SUB-037 判据。
  每条都写明删除条件 `until`。
- **家族子集。** `--family <id>[,<id>…]` 只让归属这些家族的发现决定结果，id 取 `families.json` 的家族 id，或 `utility`、`unattributed`。不属于任何家族的发现照样计入，未知 id 判红。子集只缩小判定范围，不是豁免。
- **单跑。** `pnpm contract:static`、`pnpm contract:static --family actions`，或用 `pnpm exec node scripts/contract-static-proof.mjs --details --report <路径>` 另列被豁免的发现并把 JSON 写到指定路径。

### geometry-measure-proof · `pnpm geometry:measure`

- **建立。** TCRN-DS-SUB-034（STORY-131）建立，TCRN-DS-SUB-035 补全接入。门 `scripts/geometry-measure-proof.mjs`，测量库 `scripts/lib/gplus-measure.mjs`，路由 `scripts/lib/storybook-routes.mjs`，测试 `tests/geometry-measure-proof.test.mjs`。
- **判据。** 在静态文档里，按浅色与夜间两种主题，打开每个 G+ 矩阵与样板 story，只在 story 渲染区域内测量。测量集合是 GPLUS_STORY_IDS 加上注册表 `gplus-*` 类目下的 story。每次运行先做夹具自检（`tests/fixtures/geometry-measure/manifest.json`），随后检查：
  - REQUIRED_CHECKS：每个 story 必须适用的项不得为 n/a；
  - 全量运行时，十项检查（测量库的 CHECK_IDS：clip、singleLine、shadowBlur、rail、rowAlign、mark、contrast、controlHeight、overlap、shellFrame）都要在某个 story 上适用；
  - STORY_PROBES 四个：ButtonGroup 焦点环不被裁切；DatePicker 指示器的点击能到达输入框；Highlight 与纯文本同宽；iconStroke：16px 图标渲染为 16px 见方，每个子元素计算描边 1.25px 并带 non-scaling-stroke（ICON_STROKE）。
- **阈值。** 门里的 THRESHOLDS，storybook-visual-proof 复用同一份：

  | 项 | 阈值 |
  | --- | --- |
  | clip | 0 个元素超出裁切祖先（容差 0.5px） |
  | singleLine | 声明单行的元素只有 1 个行框 |
  | shadowBlur | box-shadow 模糊不超过 3px |
  | rail | 引导列在距壳层边 16px 处，引导文字在 48px 处（容差 0.5px，C17） |
  | rowAlign | 表格与列表每行首格文字起点相同（差不超过 0.5px） |
  | mark | 0 个改变排版的高亮标记 |
  | contrast | 每格与 data-expect 相差不超过 0.05；文字 4.5，其它 kind 3，豁免格除外 |
  | controlHeight | 声明的控件高度相符（0.5px），且只能是 28、32 或 40 |
  | overlap | 网格或弹性布局的兄弟元素在两个方向上的相交都不超过 1px |
  | shellFrame | 每个 ProductShell 根（`[data-shell]`）内的纸面离壳的上、尾、下三边 12px，壳顶栏高 52px（容差 0.5px）；起始边贴侧栏，不量 |

- **变异。** 夹具自检要求每项在注入的违例上转红、在干净页上保持绿。STORY_MUTATIONS 在真实 story 上注入六条变异，都必须判红：rowAlign（STORY-131 GWT1）、mark（GWT2）、shadowBlur 模糊 4px（GWT3）、contrast，以及 shellFrame 的两条——纸面贴到壳边（`shell-paper-inset-zero`，129-GWT3）与壳顶栏回到 68px（`shell-top-bar-68`，131-GWT4）。测试在 `tests/geometry-measure-proof.test.mjs`，含页面模板作用域改写的单测与测量探针单测；条数以现跑为准，这里不写死。
- **豁免。** 没有登记表。对比度格的豁免只来自契约（`matrices.json` 的 `exempt`，与画板 `data-exempt` 一致，见 contract-proof）。
- **单跑。** `pnpm geometry:measure`；用 `pnpm geometry:measure --family actions` 只跑该家族的矩阵与样板（变异也只跑落在这些 story 上的），用 `--story <id>` 指定 story。`pnpm exec node scripts/geometry-measure-proof.mjs --self-check-only` 只做夹具自检，不需要构建。`--write-report` 把报告写到 `docs/verification/geometry-measure/report.json`，由批末重生成。

### storybook-visual-proof · `pnpm storybook:visual-proof`

- **建立。** TCRN-DS-SUB-032 建映射，TCRN-DS-SUB-033 建门（STORY-130）。门 `scripts/storybook-visual-proof.mjs` 替换已退役的逐像素基线桩（STORY-041），测试 `tests/storybook-visual-proof.test.mjs`。
- **判据。** 下列任一情况判红：
  - map：映射的行、未映射条目或差异条目不完整，或指向未知的检查项或引用；
  - coverage：`canvas.json` 的板或板内字母分段没有映射条目，或映射写了不存在的板或分段；
  - stories：映射与 story 清单有差集；
  - rows：任一行任一主题的十项检查（测量库的 CHECK_IDS，与几何门同一组）有 fail，requiredChecks 有 n/a，或格数、格 id 与契约或画板不符；
  - mutations：在范围内的变异没有判红。
- **阈值。** 取 geometry-measure-proof 的 THRESHOLDS，映射文件与测量库都不带阈值。不做像素比对，也不截图。
- **变异。** ROW_MUTATIONS 十条，每项检查一条（rail 与 shellFrame 落在样板 story 上，其余在矩阵上），都必须判红。测试在 `tests/storybook-visual-proof.test.mjs`；条数以现跑为准，这里不写死。
- **登记。** 豁免与差异都登记在 `docs/design/gplus-2026-10/storybook-map.json`，人读版 `storybook-map.md` 与它同源。
  - 没有 story 的板与分段写进 `unmapped`，必填 `reason`、`realizedBy`、`refs`。
  - 画布与 story 的差异写进 `differences`，编号 DIFF-n，带 `refs` 与 `status`；待 Owner 裁定的，在 status 里写明。
  - `refs` 指向映射文件 `refs` 表里的裁定与约定，例如 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D6 与跨包约定。
- **单跑。** `pnpm storybook:visual-proof`。开发期可用 `--kind matrix|sample`、`--theme light|dark`、`--no-mutations` 缩小范围。`--write-report` 写 `docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md`，由批末重生成。

### doc-shell-class-proof · `pnpm doc-shell:proof`

- **建立。** TCRN-DS-SUB-024（STORY-128），清零由 SUB-025/026/027 完成。门 `scripts/doc-shell-class-proof.mjs`，测试 `tests/doc-shell-class-proof.test.mjs`。
- **判据。** 收集文档层（构建后的静态文档与文档层源码）渲染或样式化的全部 tcrn-* 类，减去包 CSS 定义的类，差集为空才绿。包的已编译组件自己写出的类也算包类。页面模板写的每个类必须有定义（INC-010 子检查）。
- **豁免。** `tcrn-doc-` 是文档层私有前缀，整体豁免（STORY-128），没有别的登记入口。
- **单跑。** `pnpm doc-shell:proof`；`pnpm exec node scripts/doc-shell-class-proof.mjs --details` 列出明细。

### fonts-render-proof · `pnpm fonts:render`

- **建立。** TCRN-DS-SUB-007（STORY-121 GWT1、GWT5），门 `scripts/fonts-render-proof.mjs`。
- **判据。** 共八条腿：
  - copies：静态文档里的字体与许可副本与 vendored 文件逐字节一致；
  - stylesheet：`tcrn-fonts.css` 只指向清单里的字体文件，没有 data: URI 或远程 URL；
  - pages：每页在 head 里恰好链接 `tcrn-fonts.css` 一次；
  - cdn-strings：静态文档里没有 googleapis 或 gstatic 字样；
  - network：页面加载时不请求外部来源，下载到的字体与 vendored 文件逐字节一致；
  - families：每个字族都用自己的 web 字体绘制；
  - fallback：标题字族栈里的中文回退到 Noto Serif SC web 字体；
  - control：屏蔽 `fonts/` 后，同一探针必须回退到系统字体。
- **阈值。** 字节完全一致，字族与字重共 10 个组合。「用什么字体绘制」取自 CDP `CSS.getPlatformFontsForNode`，可变字体按名称前缀匹配。
- **变异。** control 腿在每次运行时屏蔽字体目录，并要求结果转为系统字体，以此证明本门分辨得出 vendored 字体。建立时另做过字节与链接变异，四条腿转红。本门没有单独的测试文件。
- **豁免。** 无。
- **单跑。** `pnpm fonts:render`；`--root <dir>` 指定仓库根。

### doc-sample-style-proof · `pnpm doc:sample-style`

- **建立。** TCRN-DS-SUB-028（STORY-128 GWT3），门 `scripts/doc-sample-style-proof.mjs`，测试 `tests/doc-sample-style-proof.test.mjs`。
- **判据。** 参照样本取自五个矩阵 story 两块里的第一批 23 件，按签名归类：标签与第一批类、状态、最近的第一批祖先。注册表里其它 story 中的第一批元素，与同签名的参照样本比较计算样式。每处偏离按原因分类：
  - doc-stylesheet：去掉文档层样式表后吻合；
  - story-inline-style：再去掉内联样式后吻合；
  - package-context：两者去掉后仍不吻合，即包在该上下文里给组件的样式。
  前两类判红。package-context 只列为发现，`--strict` 时也判红。没有参照样本的签名列为未覆盖。
- **阈值。** 比较的属性（COMPARED_PROPERTIES）包括字体、颜色、背景、边框、阴影、圆角，以及控件与图标的高度，必须与某个同签名参照完全相同。读值前先关闭过渡与动画。
- **变异。** MUTATIONS 每次运行注入一条文档层规则，必须产生偏离。测试 6 条。
- **豁免。** 没有登记表。
- **单跑。** `pnpm doc:sample-style`；可用 `--story <id>`、`--theme light|dark` 缩小范围，`--strict` 让 package-context 也判红。

### token-contrast-proof · `pnpm tokens:proof` 内

- **建立。** TCRN-DS-SUB-002（STORY-120 GWT2、GWT3），门 `scripts/token-contrast-proof.mjs`，测试 `tests/token-contrast-proof.test.mjs`。
- **判据。** 两种主题下逐对检查 C1：对表 `CONTRAST_PAIRS` 加焦点环两对（环色对间隙色、环色对 panel）。取值只走 `createResolvedTokenMap(theme)`，门里没有颜色字面量。
- **阈值。** text 与字标 4.5，edge 与焦点环 3。半透明色先合成到承载面上再算比值。
- **变异。** 测试 10 条，其中一条把 ink-3 改回旧值，门必须判红并点名该对（GWT3）。
- **豁免。** 登记在门里的 `WORDMARK_EXEMPTIONS`，每条写 `theme`、`fg`、`on`、`ruling`、`source`，只收字标对。缺裁定、指向非字标对、所指的对已经达标（stale）、找不到对应的对，都判红。现有 4 条：design-system 浅色于 panel 与 bg，tms 夜间于 panel 与 bg。依据是 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 与 V2-B1-Brand 板 F 段（字标作为 logotype 不受 4.5 约束）；tms 两条另标「夜间值待 Owner 裁定」（R1 问题 P15）。
- **单跑。** `pnpm exec node --test tests/token-contrast-proof.test.mjs`，`pnpm exec node scripts/token-contrast-proof.mjs`。

### token-deprecation-notice · 非阻断

- **建立。** TCRN-DS-SUB-003（STORY-120 GWT4），脚本 `scripts/token-deprecation-notice.mjs`，测试 `tests/token-deprecation-notice.test.mjs`（在 `tokens:proof` 内）。
- **行为。** storybook 构建写完静态文档后调用一次，扫描 `apps/storybook/src` 与 `.storybook`，每个在用的旧 token 名打印一行，写明改用的新名。退出码恒为 0，只有用法错误为 2。不是门，也不阻断构建。
- **单跑。** `pnpm exec node scripts/token-deprecation-notice.mjs <文件或目录>...`

## 条款口径入口

| 条款 | 落点（门） |
| --- | --- |
| C1 态对比度矩阵 | token-contrast-proof（token 对）；geometry-measure `contrast`（渲染格）；contract-proof matrix-expect（期望值与画板一致） |
| C2、C5、C6、C13 | contract-static-proof |
| C7、C8、C11 | contract-static-proof（包 CSS 与 story 渲染层） |
| C3 不溢出、C4 固定高容器 | geometry-measure `clip`、`singleLine`、`overlap` |
| C9 品牌资产只复制不重绘 | brand-asset-source-proof（`pnpm brand-asset:proof`）；contract-proof product-marks |
| C10 壳层几何来自 token | 几何类门（geometry-proof、geometry-measure） |
| C12 位置到组件的选型表 | selection-grammar-proof（`tokens:proof` 内） |
| C14 门自带会红的变异 | 每道门的测试与运行内变异，见上文各门「变异」 |
| C15 五语言同源 | 现有字符串同源检查（见 `clauses.md` C15，不在本目录的门里） |
| C16 徽标与标签一行不折 | geometry-measure `singleLine`；承载类的单行声明由 C7 静态检查 |
| C17 引导列关系断言 | geometry-measure `rail` |

条款原文、机器检查与先红要求以 `clauses.md` 为准；它与本表不一致时，以 `clauses.md` 与门的实现为准，并修正本表。
