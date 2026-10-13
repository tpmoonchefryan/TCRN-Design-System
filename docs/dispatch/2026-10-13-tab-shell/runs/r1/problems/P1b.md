# P1b 问题清单 · INIT-016 R1 · W2（完整菜单、下拉与级联）

见红只记：本包范围外的缺口与需要裁定的选择。同一根因算一条。

| # | 类别 | 现象与证据 | 建议（默认） | 涉及 |
| --- | --- | --- | --- | --- |
| 1 | 归属缺口 | 新样式段要进样式表必须在 `styles/index.ts` 登记（`css-template-integrity-proof` 对未登记的 `shellCssNN` 判红），P1a 交回也写明「下一段命名 shellCss03，接在 shellCss02 后登记」；但 packages.md 的共享文件表里该文件 W2 一栏为「—」，SUB-116、SUB-118 的改动文件不含它。把规则塞进已登记的 `shellCss02` 会撞 ShellPins 测试对该段的字面断言。本包加了两行登记（`shellCss03`、`shellCss04`），W2 没有其它持有者。 | 主线程确认这两行随 P1b 合入；P1c（SUB-119）的顶带态段同样要登记，而 W3 的持有者是 P5，请在 P1c 派工里给出登记方式（同样两行，或由 P5 代登记）。 | SUB-116、SUB-118、SUB-119、SUB-122 |
| 2 | 实现缺口 | 「浮层定位用 Overlay 家族现有定位层，不新造」：Overlay.tsx 的 `computeFloatingPosition` 与 `useFloatingLayer` 未导出；唯一导出的 `mountStaticOverlayBoundary` 面向服务端输出的静态 HTML，会把层节点移到 body、自己挂触发键点击并在销毁时回写触发键的 `aria-expanded`，用在 React 管理的层上会与 ShellPins 的状态打架。本包：完整菜单按 STORY-138 用 token 计算的 CSS 定位；下拉读固定项的 left 与 bottom（resize、scroll 时重读），接续 6 用 token 写成 margin；z 层用 Overlay 的 `--tcrn-z-popover`。 | 若要求两者真正共用 Overlay 的定位函数，需在 Overlay.tsx 导出一个 React 可用的锚定定位（bottom-start、gap 可传），由持有 Overlay.tsx 的批次做；在此之前按现写法。 | SUB-116、SUB-118 |
| 3 | 钩子缺口 | C-5 的「分组行 `data-shell-group`」：NavGroup 只把属性落在根元素（标题行 + 各项的整列），标题行（28 高）没有接收属性的口子，所以本包的 `data-shell-group` 量到的是整列。 | 由持有 Navigation.tsx 的包给 NavGroup 标题行加钩子（或透传属性），壳层门在此之前用 `[data-shell-group] > .tcrn-nav-group__label` 读标题行。 | SUB-123、SUB-124、SUB-135 |
| 4 | 钩子缺口 | 行内图标 `data-guide="prail"` 与文字 `data-text="prail"` 要落在 NavItem 上（Navigation.tsx），完整菜单、级联与下拉的每一行都缺；与 P2 问题 7 同一根因，此处只记影响面。菜单行的文字盒是 `.tcrn-nav-item__label` 内的 `.tcrn-shell-menu__text`。 | 同 P2 问题 7。 | SUB-124、SUB-135 |
| 5 | 板面缺口 | 07a 只画了下拉态的三、四级级联，没画完整菜单里带子项的行（合约、排期都带箭头）点开后的样子。本包按同一件处理：级联列接在面板右侧（+4，宽 240，高 = 面板高）。1440 宽下同时打开三、四两列时，第二个级联列右缘到 1452，超出视口 12；1240 板宽下第一列就到 1208。 | 请设计会话或 Owner 定完整菜单里级联列的位置（面板右侧、覆盖右邻分组列，或只允许一级级联），定后改 `shellCss03` 一处；在此之前按现写法。 | SUB-117、SUB-133 |
| 6 | 板与实现 | 07a 的下拉搜索里画了 `⌘K` 提示，但 ⌘K 打开的是完整菜单并聚焦它的搜索，下拉里的提示会误导，本包未显示（`shortcut={false}`）。 | 按现写法；若 Owner 要保留板面一致，改一个 prop。 | SUB-118 |
| 7 | 重复写值 | 完整菜单底栏的锁定块要侧栏尺度，而 brand.css.ts 的侧栏档只写在 `.tcrn-product-shell .tcrn-shell-brand-lockup` 下；菜单可能不在 ProductShell 内渲染（story、门的夹具），本包把同一组值（标 22、12.5/16、600、10.5/14、列间 10）抄进 `.tcrn-shell-menu__lockup`。 | 由持有 brand.css.ts 的批次把侧栏档做成可用类名或 prop，届时删掉这份副本。 | SUB-116、SUB-125 |
| 8 | C7 缺口 | 菜单内由 Navigation.tsx 渲染的三处没有单行截断所要的 title：非可钉的 NavGroup 标题（本包的「已固定」分组）、ProductShellSearch 的结果链接；另外 ProductShellSearch 在结果为空时连空态文案一起隐藏，查询无匹配时菜单主体为空。shell 与 navigation 家族目前在 contract:static 的豁免里，门不报。 | 由持有 Navigation.tsx 的包补 title 与空态显示（SUB-124 / SUB-125 家族归位时一并处理）。 | SUB-124、SUB-125 |
