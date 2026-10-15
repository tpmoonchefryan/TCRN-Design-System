# 机器消费契约条款 C1–C17

条款编号与文案的正本是画板 `docs/design/gplus-2026-10/boards/V2-Rejections.dc.html`（打回根因总账；入仓副本 26,697 B，sha256 `6a964abd9e567374666770a88221547b880b4d86e2f8f2b681f2720f450d6273`）。C1–C16 的「约束」「机器检查」「先红要求」三栏逐字取自该板第四节；C17 只出现在第一节（第 6 行「侧栏引导列」的「进契约的条款」栏），第四节没有对应行；C5、C11、C14 在第一节另有增补，附在各条之后。家族清单取自 `V2-Families.dc.html`。

本目录的文件：

| 文件 | 用途 |
| --- | --- |
| `clauses.md` | 本文：条款文本与各条的检查落点 |
| `families.json` | 16 个家族与包 CSS 根类的对应；`scope.checkedBatches` 列出全量检查的批次（现为第一、二批） |
| `exemptions.json` | 豁免登记：每条只豁免一个家族、一组类或一组选择器，列明条款并带裁定引用 |
| `roles.json` | C7 的单行角色承载类、C8 的工具栏登记与 C11「通用件拼壳」的壳层登记 |

## 契约静态门

门是 `scripts/contract-static-proof.mjs`，规则解析库是 `scripts/lib/css-rules.mjs`（自写，不加依赖），变异测试是 `tests/contract-static-proof.test.mjs`。在仓库根先 `pnpm build`，再运行：

```
node --test tests/contract-static-proof.test.mjs
node scripts/contract-static-proof.mjs [--details] [--report <path>] [--family <id>[,<id>…]]
```

- **输入。** 包 CSS 是已构建的 `packages/ui-react/dist/index.js` 导出的 `tcrnComponentCss`；token 表经 `@tcrn/ui-tokens` 的发布导出 `./tokens.css` 读取；C13 取 `scripts/doc-shell-class-proof.mjs` 算出的包外类差集（构建后的静态文档加文档层源码）；story 渲染层读构建后的 `apps/storybook/storybook-static/*.html` 里带 `data-story-id` 的 story 区块（文档站外壳不算 story 渲染）。门不读组件源文件，与源文件布局无关。
- **报告。** 标准输出是 JSON，`clauses` 按条款编号列出状态、发现数、按规则与按家族的计数、豁免命中数与每条发现（选择器、所在行、家族、说明）；`--details` 另列被豁免的发现；`--report` 把同一份 JSON 写到指定路径。story 层的发现另带 `story`（story id）与 `element`（标签加类名），`source` 是页面路径，`selector` 为空；`inputs.storyLayer` 列出读到的页面数与 story 数。任一条款有发现，或豁免登记不合规，或 CSS 读不通，退出码为 1。
- **家族子集。** `--family <id>[,<id>…]`（可重复）只让归属这些家族的发现决定结果，id 取 `families.json` 的家族 id 与 `utility`、`unattributed`；不属于任何家族的发现（如输入缺失）照样计入；未知 id 判红（`CONTRACT_STATIC_FAMILY_UNKNOWN`）。报告的 `scope.familyFilter` 记下所用子集。子集只缩小判定范围，不是豁免。
- **范围。** `families.json` 中 `scope.checkedBatches` 所列批次的家族全量检查，不得登记豁免：现为第一批五家族（字体、图标、品牌、动作、表单控件）与第二批三家族（导航、壳层、布局）。其它家族同样参与检查，只有 `exemptions.json` 对该家族与该条款有登记时，发现才记为「已豁免」并计数，不算红；仓库运行时，未列批次的家族没有家族条目判红（`CONTRACT_STATIC_EXEMPTION_MISSING`），某批次的豁免到期删除时，同一提交把该批次列进 `checkedBatches`。不属于任何家族的类、以及没有 tcrn-* 类的选择器，一律检查。一个选择器只有当其中每个被选中的 tcrn-* 类都被豁免时才豁免（`:not()` 与 `:has()` 里的类不算被选中）；所以后续家族写在已检查批次组件上的上下文规则照样检查。没有无条件跳过。
- **豁免登记。** 每条必须有 `id`、`clauses`（只收本门检查的条款编号，不收通配）、`ruling`（裁定引用）、`reason`，并且恰好有 `family`、`classes`、`selectors` 之一。`scope.checkedBatches` 所列批次的家族、其类、以及选中其类的选择器不能登记。格式不合规的条目、以及没有列出已检查批次的登记表，使门判红（`CONTRACT_STATIC_EXEMPTION_INVALID`）。本次运行没有命中的条目列在报告 `scope.unusedExemptions`，未列批次里缺家族条目的家族列在 `scope.uncoveredFamilies`。现有 9 条：8 条是第三至五批家族，引用 TCRN-DS-INIT-015 scope 不授权段与 R1 拆分问题清单 P4；1 条按类登记 LockHint 默认的 🔒（`EX-INIT015-lock-hint-emoji`，只含 C11，引用同一不授权段、P4 与 TCRN-DS-SUB-037 判据）。条目对包 CSS 与 story 渲染层同样生效：story 层发现按渲染元素的包类（tcrn-*，不含 tcrn-doc-*）归家族；它没有 CSS 选择器，所以 `selectors` 条目不匹配 story 层发现。
- **story 层（TCRN-DS-SUB-037）。** 同一道门另读渲染出的 story：C7 的 title 与强制换行、C8 的渲染工具栏让步结构、C11 的表情字符、卡套卡（卡片嵌套深度）、行内样式特征、四级语义同形与通用件拼壳，规则编号带 `story-`，见各条。读不到任何 story 区块（未构建静态 Storybook 或页面里没有 `data-story-id`）时 C7、C8、C11 各判红（`Cx.story-input-missing`），不跳过。容器矩阵与让步的像素量测属几何门（C3、C4、C16、C17 一侧），本门做的是渲染结构与静态声明这一半。

## 条款

### C1 态对比度矩阵

- 约束：每个组件的 variant × {default, hover, active, focus, disabled, loading, selected} 都有成对的 fill 与 ink，文字对比 ≥ 4.5，图标与边线 ≥ 3。
- 机器检查：从包 CSS 渲染每一格，取计算样式算对比度；矩阵缺格即红。
- 先红要求：注入「hover 改底不改字」变异必须红。
- 落点：渲染层（契约渲染证明），不在本门。

### C2 状态规则不得越级

- 约束：状态选择器的特异性不得高于其变体选择器；基类上的状态规则不得改变底色。
- 机器检查：静态解析 CSS，比较 `.x:hover` 与 `.x.variant` 的特异性。
- 先红要求：注入 `.scope .btn:hover{background}` 必须红。
- 本门：
  - 状态规则：选择器任一复合选择器带状态条件（`:hover`、`:active`、`:focus`、`:focus-visible`、`:focus-within`、`:disabled`、`:checked`、`:indeterminate`、`:invalid`、`:user-invalid`、`:read-only`，状态类 ARIA 属性 `[aria-busy|checked|current|disabled|expanded|invalid|pressed|readonly|selected|sort]`、`[data-tcrn-preview-state]`、`[readonly]`、`[disabled]`；`aria-hidden`、`aria-label` 这类非状态属性不算），含 `:where()`、`:is()` 里的条件，不含 `:not()`、`:has()` 里的。
  - `C2.specificity`：状态规则的特异性（去掉伪元素后，按 Selectors Level 4 计，`:where()` 记 0）高于主体组件类的变体特异性即红。变体特异性取该类单复合变体规则（如 `.tcrn-button.tcrn-button--primary`）的最小值；该类没有变体规则时按跨包约定的 (0,2,0)。
  - `C2.colour`：状态规则写颜色即红。只允许切换生效对（`--tcrn-pair-*` 只引用 `--tcrn-pair-*` 变量）。颜色属性（color、background-color、border-*-color、outline-color、fill、stroke 等）写任何非生效对的值，复合属性（background、border*、outline、box-shadow、text-shadow、text-decoration、filter 等）或自定义属性的值里出现颜色字面量（十六进制、颜色函数、渐变、具名色含 transparent 与 currentcolor）或颜色类 token（`--tcrn-color-*`、`--tcrn-shadow-*`、`--tcrn-focus-ring`、`--tcrn-elevation-*`、`--tcrn-selection-*`、`--tcrn-brand-accent-*`、`--tcrn-brand-suffix-*`、`--tcrn-glass*`），都算写颜色。唯一允许项：颜色只有 `transparent` 的 outline（强制色模式的焦点环，平时不着色）。

### C3 不溢出

- 约束：任何元素的包围盒不得超出最近裁切祖先；浮层、抽屉、轻提示、表格单元、收起态锁定块全部纳入。
- 机器检查：现有 overflow-leak 检查扩展到 overlay 角色与收起态。
- 先红要求：把抽屉内容加高 40px 必须红。
- 落点：几何测量（渲染层），不在本门。

### C4 固定高容器声明溢出策略

- 约束：固定高度容器必须声明 overflow 行为；`overflow:hidden` 不得裁掉可操作控件或文案。
- 机器检查：遍历固定高容器，断言其内可交互元素与文案块 clientWidth ≥ scrollWidth 且可见。
- 先红要求：把页脚推出容器必须红。
- 落点：几何测量（渲染层），不在本门。

### C5 主题属性集同构

- 约束：浅色与深色下同一选择器的声明属性集合相同，只允许值不同；选中、悬停、焦点三态尤其。
- 机器检查：解析两套主题规则，diff 属性名集合，非空即红。
- 先红要求：给暗色选中态单加 inset 阴影必须红。
- 板一节增补：表面模型在两套主题下同构。
- 本门：
  - 夜间上下文是 `[data-tcrn-theme="dark"]`（祖先或自身），以及 `@media (prefers-color-scheme: dark)`；去掉主题部分得到基础选择器，按「来源 + 其余 at-rule + 基础选择器」分组比较。
  - `C5.dark-only`：夜间声明了浅色（无主题规则与显式浅色规则）没有声明的属性即红。无主题规则在两套主题下都生效，所以夜间只覆盖部分属性的值不算分叉。简写覆盖其展开属性（如浅色 `border` 覆盖夜间 `border-color`）。
  - `C5.light-only`：显式浅色规则（`[data-tcrn-theme="light"]`）声明了夜间没有的属性即红。
  - `C5.token-set`：带 `/* tcrn-token-block: theme */` 标记的 `:root` 块与 dark 块的 token 名集合必须完全相同；带 `theme-independent` 标记的 `:root` 块不参与比较（主题无关 token 放独立块，SUB-001 的口径）。

### C6 选中态结构规则

- 约束：选中元素不得同时具备非透明填充与单侧边线或单侧内阴影；禁止 border-left 与 inset x 偏移作为选中指示。
- 机器检查：扫描 `[aria-current]`、`[aria-selected]`、`.on` 的计算样式。
- 先红要求：注入左侧 2px 色条必须红。
- 本门（静态部分；计算样式扫描属渲染层）：
  - 选中规则：选择器带选中条件（`[aria-selected]`、`[aria-current]`、`[aria-pressed="true"]`、`[aria-checked="true"]`、`:checked`、`:indeterminate`、`[data-selected]`、`[data-current]`、`[data-active]`、`[data-state=active|on|checked|selected]`、`.on`、`.is-selected` 等、`--selected|--current|--active|--on|--checked` 修饰类）。
  - 选中对：变体声明的选中态对值 `--tcrn-pair-fill-<键>`、`--tcrn-pair-edge-<键>`，键取 `docs/design/gplus-2026-10/contract/pairs.json` 里名为 selected 或 checked 开头的状态（现为 s、c、cf、cx）。
  - `C6.left-border`：选中规则声明可见的 `border-left` 或 `border-inline-start`。
  - `C6.inset-x`：选中规则或选中对的边线含 x 偏移非零的可见 inset 阴影。
  - `C6.fill-with-one-side-edge`：非透明填充与单侧边线（单边 border，或只有一个方向偏移的 inset 阴影）兼有。

### C7 单行元素不折行

- 约束：声明为单行的角色（面包屑项、导航项、按钮、标签、徽标、表格单元、页头标题）渲染高度不超过一个行高；装不下截断加 title，不折行。
- 机器检查：容器矩阵（390 到 1440）下量 clientHeight ≤ line-height × 1.2。
- 先红要求：缩窄容器必须出省略号而不是换行。
- 本门（静态部分；容器矩阵量测与 title 属 story 层）：
  - 单行角色按 `roles.json` 的 `singleLine` 登记（按钮 `tcrn-button__label`，面包屑项、导航项、徽标、表格单元、页头标题各自的承载类；标签暂无独立类，见 roles.json `unregistered`）。
  - `C7.not-single-line`：承载类的基础规则（无状态、无主题、无 at-rule）没有同时声明 `white-space: nowrap`、`text-overflow: ellipsis` 与 `overflow: hidden`（或 clip）。
  - `C7.wrap-allowed`：任何规则把承载类改回可折行（`white-space: normal|pre-wrap|pre-line|break-spaces`、`text-overflow: clip`、`overflow: visible`）。
  - `C7.role-missing`：登记的承载类在包 CSS 里没有规则。
- story 层：
  - `C7.story-title-missing`：渲染出的承载元素有可见文字，却没有给截断文字用的 `title`。口径分两档（TCRN-DS-SUB-079 按 R2-31 收紧）：
    - 已检查批次的承载元素（元素的包类里有 `families.json` 中 `scope.checkedBatches` 所列批次家族的类，现为按钮 `tcrn-button__label`、面包屑项 `tcrn-breadcrumb__item`、导航项 `tcrn-nav-item__label`、页头标题 `tcrn-page-header__title`）：title 须含该元素的可见文字。比较前两边都把连续空白折成一个空格、去掉首尾空白，title 包含这段文字即满足；所以「标签 — 原因」这类在标签后接说明的写法满足，只写禁用原因或只写部分文字的判红。看的是浏览器在该元素上显示的那个 title：元素自身的 title；没有时取最近带 title 的祖先，到组件根（类名等于承载类根类的最近祖先，如 `tcrn-button`）为止，且该祖先的子树里只有这一个承载元素（共享容器的 title 不算）；空 title 不显示提示，也挡住更外层的 title。元素内部的 title 含这段文字也满足。
    - 后续批次家族的承载元素沿用原口径，到该家族进入检查范围为止：title 在元素自身、元素内部，或在它到组件根之间、且子树里只有这一个承载元素的祖先上，存在且非空即满足，不比对文字（关系标记的完整说明也算）。
    - 没有文字的承载元素（只有图标）不查。包里的 Button 带禁用原因时 title 写「标签 — 原因」（标签是按钮的可见文字），原因另经 `aria-describedby` 读出；没有可见文字的按钮（如 IconButton）title 只写原因。
  - `C7.story-forced-wrap`：承载元素里有 `<br>` 或块级元素，或它及其后代的行内样式把它改回可折行（同 `C7.wrap-allowed` 的取值）。

### C8 工具栏让步声明

- 约束：每个工具栏声明唯一让步项（带 min-width）与固定项（flex-shrink 0）。
- 机器检查：矩阵下无换行、无溢出；让步项达到 min-width 后其余不得被压。
- 先红要求：去掉 flex-shrink 0 必须红。
- 本门（静态部分；矩阵量测属 story 层）：
  - 工具栏按 `roles.json` 的 `toolbars` 登记，每个工具栏恰有一个 `yield` 类。
  - `C8.yield-without-min-width`：让步项的基础规则没有非零 `min-width` 或 `min-inline-size`。
  - `C8.yield-does-not-shrink`：让步项声明了 flex-shrink 0。
  - `C8.fixed-item-shrinks`：固定项的基础规则没有 flex-shrink 0（`flex-shrink: 0`、`flex: none` 或 `flex: <g> 0 <basis>`）。
  - `C8.yield-undeclared`、`C8.toolbar-missing`：登记缺让步项，或容器类在包 CSS 里没有规则。
  - 第一批家族里没有工具栏。现登记的是壳的顶带（TCRN-DS-SUB-191）：容器 `tcrn-shell-strip`；让步项 `tcrn-shell-pins`（顶带上的固定项条）；C8 意义上的固定项（不收缩）是标按钮 `tcrn-shell-brand` 与右簇 `tcrn-shell-cluster`。壳层家族属第二批，全量检查，不豁免。顶带按板让步，登记带下文「板定让步」的两个字段（TCRN-DS-SUB-229）。
- story 层（每个渲染出的工具栏容器；未声明让步项的工具栏已由 `C8.yield-undeclared` 判红，story 层不重复）：
  - `C8.story-yield-missing`、`C8.story-yield-not-unique`：渲染出的工具栏里让步项不是恰好一个。
  - `C8.story-yield-in-fixed`：让步项落在固定项里面（固定项不收缩，让步项让不出来）。
  - `C8.story-item-not-fixed`：工具栏行（让步项外层第一个有多个子元素的元素，没有让步项时是容器本身）里，除让步项外的每一项都须是固定项：登记在 `fixed`，或其包类的基础规则声明 flex-shrink 0；否则让步项到 min-width 之前它先被压。这是「让步项达到 min-width 后其余不得被压」的静态一半，像素量测属几何门。
  - `C8.story-inline-override`：行内样式把让步项的 min-width 改成 0/auto 或让它不收缩，或让固定项可收缩。
  - 归属：story 层 C8 发现归到工具栏（容器、行与固定项的类），由工具栏负责项的布局。
- 板定让步（TCRN-DS-SUB-229；依据纪要 TCRN-DS-MIN-20261016-R6 D2，O-19 选甲「顶带按板」）：板上让步项可收到 0、没有可让的内容时不渲染，这时工具栏登记带两个字段，门只对这个工具栏各跳过一项：
  - `"yieldMinWidth": "zero-by-board"`：静态层不报 `C8.yield-without-min-width`（板上让步项写 `min-width: 0`）。
  - `"yieldOptional": true`：story 层不报 `C8.story-yield-missing`（板上没有空的让步位，组件在没有内容时不渲染让步项）。
  - 门只认这两个字面值；别的值（如 `"zero"`、字符串 `"true"`）按没带字段照判。带字段的登记另写 `yieldBoardRule`，写明板规则出处；仓库测试核对出处在、且引用纪要。
  - 其余 C8 检查照旧：`C8.yield-does-not-shrink`、`C8.fixed-item-shrinks`、`C8.yield-undeclared`、`C8.toolbar-missing`，story 层的 `C8.story-yield-not-unique`、`C8.story-yield-in-fixed`、`C8.story-item-not-fixed`、`C8.story-inline-override`。渲染出的工具栏没有让步项时，行就是容器本身，容器里每一项都须是固定项。
  - 这是按板放宽判定，效果与豁免相同，不是给让步项补数值。现只有顶带带这两个字段，出处是成品壳层板 07a（`docs/design/visual-standard/boards/Shell.dc.html`，由 `docs/design/gplus-2026-10/tools/shell-screen.mjs` 生成）的 `.ts-pins{…min-width:0;flex:0 1 auto}`；没有固定项的壳不渲染 `tcrn-shell-pins`。登记保留，它仍钉着标按钮与右簇不收缩。别的工具栏要带这两个字段，须另有裁定；去掉字段，两项照判红（自检见 `tests/contract-static-proof.test.mjs` 的 board-ruled yield 三条）。

### C9 品牌资产只复制不重绘

- 约束：品牌资产只复制不重绘，sha256 逐字节一致。
- 机器检查：digest 对照（INIT-036 已有）。
- 先红要求：替换一个字节必须红。
- 落点：brand-asset-source-proof，不在本门。

### C10 壳层几何来自 token

- 约束：壳层几何（侧栏宽、顶栏高、内缩、行高、圆角、间距）逐值来自 token，字面量即红。
- 机器检查：现有 radius / spacing 字面量扫描扩到几何属性。
- 先红要求：写入 196px 必须红。
- 落点：几何类门，不在本门。

### C11 禁用清单

- 约束：禁用清单：左侧色条选中、装饰渐变与光斑、模糊云阴影、卡套卡、四级语义同形、通用件拼壳、表情符号做图标。
- 机器检查：CSS 特征扫描（shell-fidelity 已有三项）加元素清点与嵌套深度。
- 先红要求：每项各一条变异必须红。
- 板一节增补：无内容可透的玻璃壳层。
- 本门（CSS 特征部分）：
  - `C11.gradient`：任何值里的 linear、radial、conic（含 repeating 与前缀）渐变。
  - `C11.blur`：`blur()` 半径大于 3px（filter、backdrop-filter 等；无内容可透的玻璃壳层即落在这里）。
  - `C11.cloud-shadow`：box-shadow、text-shadow、`drop-shadow()` 以及形如阴影的自定义属性值里，可见层的模糊半径大于 3px。
  - `C11.card-in-card`：一个选择器里有两个卡片根类（`tcrn-card`、`tcrn-*-card`）的复合选择器。
  - `C11.emoji-icon`：值里的字符串（如 `content`）含表情符号（Emoji_Presentation，或带 U+FE0F 的象形字符；`\1F512` 这类转义同样识别）。
  - `C11.left-bar`：宽度 2px 及以上的 `border-left` / `border-inline-start`，或只在左侧的 inset 条（x ≥ 2、y 为 0、无模糊）。
  - 卡片根是 `tcrn-card`、`tcrn-*-card` 与画法和卡片相同（边框、圆角、面板底）的 `tcrn-surface`；`__` 元素类不算根。
  - 卡套卡的家族归属（静态层与 story 层相同，TCRN-DS-SUB-190）：两张卡各按自己的包类归家族。一张卡同时带 `tcrn-surface` 与另一个已登记家族的类时，是那个家族画在 Surface 上的组合件，归该家族、不再记布局（ReadbackPanel 的 `section.tcrn-surface.tcrn-readback-panel` 归反馈，RecordInspector 归检视）；只带布局类的卡仍记布局，所以 Surface 套 Surface 判布局。
- story 层：
  - `C11.story-emoji`：story 区块里渲染出的文字或属性值（SVG 几何属性与 style 除外，style 归下一条）含表情符号；发现归到最近的带包类的元素。LockHint 默认的 🔒 按类登记豁免（`EX-INIT015-lock-hint-emoji`），不改该组件。
  - `C11.story-card-in-card`：渲染出的卡片根元素嵌在另一个卡片根元素里（卡片嵌套深度大于 1，即元素嵌套深度一项）。
  - `C11.story-inline-style`：行内 `style` 里出现上面 CSS 特征扫描的任一项（渐变、模糊、云阴影、表情、左边条）。
  - `C11.story-same-shape`：一个 story 里同一外形签名（元素上同一组包类）承担四种及以上语义（显式 role 或隐含角色；按下切换与弹出触发各算一种，current、selected 是状态不算语义）。依据：画板第二节 2026-07-26 AOS 检索页「四层语义一种外形」。
  - `C11.story-generic-shell`：带 `data-shell-control` 的壳层控件位缺 `roles.json` `shell.controls` 登记的专用类；或壳层条（`shell.bars`）里出现原生 `select`、搜索组件（`shell.searchComponents`）之外的文本输入。依据：画板第二节 2026-08-14「通用件拼壳」。发现归到壳层控件位的专用类与壳层条。

### C12 位置到组件的选型表

- 约束：位置到组件的选型表：主题切换、语言菜单、搜索、数值、二值、多值、集合、导航各有唯一组件。
- 机器检查：selection-grammar 与 resolveFieldValueControl 已有，扩到壳层控件。
- 先红要求：用原生 select 当语言菜单必须红。
- 落点：selection-grammar-proof，不在本门。

### C13 一处真相

- 约束：一处真相：样例与文档只用注册组件；story 渲染出的 tcrn-* 类必须存在于包 CSS；文档站私有类改用 tcrn-doc- 前缀。
- 机器检查：类名差集（上一轮已算出 149 个包外类）。
- 先红要求：新增一个包外 tcrn- 类必须红。
- 本门：
  - `C13.out-of-package`：文档层（构建后的静态文档与文档层源码）用到、包 CSS 没有定义、也不是包组件自己写出的 tcrn-* 类，`tcrn-doc-` 前缀除外。差集来自 `scripts/doc-shell-class-proof.mjs`。归属第一批家族与不属于任何家族的类一律算红。
  - `C13.input-missing`：差集算不出来（如未构建静态文档）时判红，不跳过。

### C14 门自带会红的变异

- 约束：每道新门附带一条会红的注入变异；三连绿不作为证据。
- 机器检查：门自带变异用例并在 CI 跑。
- 先红要求：门本身。
- 板一节增补：画板与样例的渲染核对是交付条件，不是可选项。
- 本门：`tests/contract-static-proof.test.mjs` 先证明夹具全绿，再对每条规则注入一条变异并断言转红，覆盖 STORY-132 的三条 GWT。

### C15 五语言同源

- 约束：所有用户可见字符串含属性五语言同源。
- 机器检查：string-source 检查（INC-023 已有）。
- 先红要求：烤死一个英文 aria-label 必须红。
- 落点：现有字符串同源检查，不在本门。

### C16 徽标与标签一行不折

- 约束：徽标与标签一行不折；收起态明确隐藏文案或容器按内容定宽；禁止用 overflow:hidden 藏字。
- 机器检查：文案块 clientWidth ≥ scrollWidth 或明确 hidden。
- 先红要求：把收起态容器压到 52px 必须红。
- 落点：几何测量（渲染层），不在本门；徽标承载类的单行声明由 C7 静态检查覆盖。

### C17 引导列关系断言

- 条款文本（板一节第 6 行）：新增：壳层与列表的引导列、文字起点、右缘为关系断言，量两侧实际元素，不比属性清单。
- 机器检查、先红要求：板四节无此行。
- 落点：几何测量（渲染层），不在本门。
