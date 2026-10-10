# 问题清单 · W2-B（SUB-012 → SUB-013）

只记不修。本包五条局部门全绿（Typography 单测 10 过、1 条 todo，见 P2）。以下事项留给后续包、集成或设计权威处置；base 段与 Navigation.test 的具体改法写在 `runs/r1/handoff/W2-B.md`。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| P1 | 外部断言（预期红） | `packages/ui-react/src/components/Navigation/Navigation.test.tsx:399` 断言样式里有 `.tcrn-highlight-mark`。mark 改用契约类名 `tcrn-highlight__mark`（W1-A P5），旧规则（`padding: 0 var(--tcrn-space-0h)` 加 medium 字重，正是「命中后文字右移」的缺陷）已删，这条断言会红。仓内别处只有 storybook 两处注释提到旧类名。 | 正则改为 `/\.tcrn-highlight__mark\b/`（W3-D，影响表 5c 行）。 |
| P2 | base 覆盖契约（链接） | `styles/base.css.ts` 2528–2546（baseCss30）的 `.tcrn-link`、`.tcrn-link:hover`、`.tcrn-link:focus-visible` 在级联里排在生成段的链接规则之后并胜出：颜色仍是 brand-primary，下划线偏移 .2em、颜色 color-mix；hover 因 base 的 `.tcrn-link { color }`（0,1,0）晚于 `:where(:hover…)`（0,1,0）而停在 acc，不是 acc-2；焦点在 box-shadow 环之外再加 2px outline。单测「a link is accent ink…」因此标为 todo（失败原因正是 brand-primary ≠ acc）；在内存里去掉这一块后，链接的全部期望成立（scratchpad 模拟，未入仓）。 | W3-D 删除该块（注释加三条规则），随后去掉 Typography.test.tsx 里那条测试的 todo 选项。壳内焦点另受 baseCss08 `.tcrn-product-shell :focus-visible…{ box-shadow: none }` 影响，与 W2-D 交回第 5 条同一根因，算一条。 |
| P3 | base 覆盖契约（Surface 标题） | `styles/base.css.ts:2247`（baseCss28）`.tcrn-surface__head :is(h2,h3) { margin: 0; font-size: var(--tcrn-type-size-heading-3); }` 特异性 (0,1,1)，压过 `.tcrn-heading--2`（0,1,0）：Surface 头里的二级 Heading 得到 20px 字号，配二级的 30px 行高与字距。 | W3-D 去掉其中的 font-size（由 visualLevel 决定），或改成 `:is(h2,h3):not(.tcrn-heading)`。 |
| P4 | 契约缺口（caps 截断） | typography.json 的 caps 没有 `truncate`，生成段只给 nowrap。C7 把标签、表头列为单行角色，装不下要出省略号并带 title，所以 typography.css.ts 在生成段之后给 `.tcrn-text.tcrn-text--caps` 加了 `overflow: hidden; text-overflow: ellipsis`，Text 的 caps 变体带 title。 | 契约 caps 加 `"truncate": true` 并重生成，之后删掉这条家族规则。 |
| P5 | 契约缺口（numeral 截断） | numeral 为 nowrap 加 inline-flex（单位槽靠 gap），inline-flex 盒上 text-overflow 出不了省略号；装不下时溢出，Text 只给了 title。 | 设计权威定数字是否截断（截断的金额会被误读）；要截断就需要块级单行形态，写进契约。 |
| P6 | 契约与包默认值 | 生成段写 `.tcrn-text{margin:0}`，现包 Text 是 `margin: var(--tcrn-space-2) 0 0`。STORY-123 要求不传 prop 时外观不变，所以 typography.css.ts 在生成段之后为段落角色恢复这条上外距，numeral 与 caps 归零（由容器摆放）。这样 Heading 后接 Text 的间距（8px 加半行距）不小于正文行距，按 D3「行距」理解为行间距。 | 若契约本意是所有 Text 外距为零，由设计权威或 Owner 裁定；否则把外距写进契约，删掉家族规则。 |
| P7 | C10 字面量风险 | 生成段的几何全是字面量：各级字号与行高 px、numeral gap 5px、caps 前缀 margin-right 8px、链接与 mark 圆角 2px、mark 晕 2px。部分已有 token（`--tcrn-type-size-heading-2/3` 为 26/20px，`--tcrn-type-size-control` 为 13px）。本包未跑任何字面量扫描。 | 由 C10 的负责 Subtask 定生成段是否在扫描范围；在范围内就让生成器在有 token 时写 `var(--tcrn-type-size-*)`，或在契约里补刻度 token。 |
| P8 | 门与截断冲突风险 | `scripts/internal-alpha-browser-proof.mjs:272` 把 overflow 非 visible 且 scrollWidth > clientWidth 的 `.tcrn-heading, h1, h2, h3` 记为 clipped。标题现在按 C7 截断加 title，alpha 页面里任何装不下的标题都会成为 clipped 发现。本包未跑。 | W8-A 或该门负责人：对带 title 的单行角色接受省略号，或保留为发现并改容器宽度。 |
| P9 | API 范围 | D2 只定了 Text 的三个 prop，契约类 `tcrn-text--numeral-inline`、`tcrn-text--numeral-large`、`tcrn-text--mono` 没有对应 prop，只能经 className 取用；Text 渲染 `<p>`，画板 E 段说的行内数字（inl）放进句子里会形成 p 套 p。 | Owner 决定是否给 Text 加 numeral 尺寸或元素选项；在此之前由 W5 样板 story 写明 className 用法。 |

已核对：typography 上下文规则涉及的 15 个容器本身都不声明字号，Text 原先从更上层继承字号，现在显式为 13/20，与 STORY-123 写的现状一致（上层根字号未逐页核对）；仓内断言旧标题或正文标记的测试只有 P1 一处。
