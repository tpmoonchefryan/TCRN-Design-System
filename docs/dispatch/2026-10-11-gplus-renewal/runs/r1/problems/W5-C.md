# 问题清单 · W5-C（SUB-028、SUB-035 及作用域前置修复）

只记不修。数值来自本包树构建后的运行（报告 `docs/verification/geometry-measure/report.json`；doc-sample-style-proof 只打印 JSON）。

| # | 类别 | 事实 | 建议 |
| --- | --- | --- | --- |
| P1 | 夜间页面上的浅色块（W4-A 问题清单 2） | geometry-measure 的 dark 运行五个矩阵全红：夜间页面里 `data-tcrn-theme="light"` 的浅色块继承了夜间 token（仓内只有 `[data-tcrn-theme="dark"]` 块，没有 light 块）。偏离的全部是 `-l` 格：typography 21、icon 13、brand 4、actions 58、inputs 20 个；夜间块的格与期望一致。 | 由 W3-D 或批末在 ui-tokens / `styles/base.css.ts` 补 `[data-tcrn-theme="light"]` 主题块，然后重跑本门。 |
| P2 | Inputs 错误提示对比度 | `.tcrn-field__error`：浅色块 err-msg-l 实测 6.20，期望 6.69（差 −0.49）；夜间块 err-msg-n 实测 6.27，期望 6.88（差 −0.61）。契约写的是 `bad` 落在 `panel` 上，渲染出的颜色或承载面和契约不一致（两种主题下都偏离）。 | Inputs 家族核对错误提示的颜色与承载面，或由设计权威改 matrices.json 里这一格；DOM 层阈值 0.05（decomposition P6）。 |
| P3 | GWT4 样板部分 | 五个样板 id 不在本包注册表中（W5-A 并行），门照实报 missingStories，判红。全量运行时 rail 与 controlHeight 在矩阵上从未适用（矩阵没有 `data-shell`、`data-guide`、`data-text`、`data-h` 钩子），所以 `checksNeverApplied` 为 `["rail","controlHeight"]`，也判红。 | W5-A 合并后批末重跑：样板须带侧栏与控件高钩子（标记约定见 handoff/W1-F.md）；若某个样板应该必查 rail、rowAlign 或 controlHeight，就把它加进该 id 的 REQUIRED_CHECKS。 |
| P4 | doc-sample-style 文档层覆盖（门红） | icons-motion 的 36 个图标在两种主题下都是 18px（矩阵同尺寸 16px），共 72 处，原因归为 doc-stylesheet。来源规则是 `.tcrn-doc-icon-sample svg[data-icon-name] { width: 18px; height: 18px; color: var(--tcrn-color-brand-primary) }`（`apps/storybook/src/story-demo-styles.ts:284`、`apps/storybook/src/storybook.css:591`）。 | 文档层归属包删去尺寸覆盖，或改用 Icon 的 size 入参；颜色同样不要在文档层覆盖。 |
| P5 | doc-sample-style 包内上下文差异（不判红，列为发现） | 82 处，两种主题合计：StateSurface 里的标题取语气色（tokens-copy-state、display-primitives-spec）；外壳语言菜单图标 11px，面包屑图标 14px，都不是 16px；外壳 ProductLogo 字号 12.5px、字重 600，矩阵是 14px、500；外壳搜索图标颜色；SettingChoice 单选组 fieldset 的背景与边框（field-spec-usage、forms-patterns 夜间）。 | 待判：这些上下文规则算包的合法组合，还是矩阵应该补出这些上下文。若判定应该判红，门加 `--strict` 运行即可。 |
| P6 | doc-sample-style 未覆盖 | 688 个样本的签名在矩阵中没有对应变体，因此不比，例如 sm 尺寸的 IconButton、带 aria-expanded 的按钮、显示快捷键的 SearchInput、外壳里的 ProductLogo。前若干项列在 JSON 的 `uncoveredSignatures`。 | 矩阵要不要补这些变体，由各家族决定。 |
| P7 | 判据口径（本包自定，请批末确认） | doc-sample-style 只在文档层原因（doc-stylesheet、story-inline-style）上判红，包内上下文差异只列为发现。理由：STORY-128 的目的锚是「Storybook 只渲染包」，判据也写的是「注入文档层覆盖判红」。每次运行都带一条文档层变异（button-spec-usage 按钮底色），必须被抓到。 | 若批末认为应该按字面「任一 story 与矩阵一致」判，就改为默认 `--strict`。 |
| P8 | GWT1 变异落点（decomposition P17） | table-record-index-spec 的 TableShell 里没有选中行，所以用第一条数据行的首格代替。CSS 无法在原有内距上加 8px，`padding-left: 8px` 实际是把原内距换成 8px，实测起点差 4px，仍然判红。 | 样板（如 inputs-sample-members）或 `.tcrn-table` 有了选中行之后，把这条变异移到选中行。 |
| P9 | W1-F P1 两个既有红 | 本包裁定：navigation-focused-shells-spec（clip）与 selection-list-patterns（overlap）不纳入本门。本门的目标清单是 G+ 矩阵与样板类目，table-record-index-spec 只作为 GWT1 变异的载体。 | 两处既有红仍归各自的文档演示框或列表最小宽度处理。 |
| P10 | 作用域修复的影响面 | 修复前，`.story-body` 作用域副本里含 `:where()`、`:is()` 的规则被拆坏后由浏览器丢弃，一行一条规则之后的规则又是不带作用域复制的。修复后，包里每一条规则都进入作用域副本（单测按浏览器解析计数锁定）。这会改变所有静态页 `.story-body` 内的层叠，矩阵状态格在浅色页上的偏离由 76 降为 0。doc-shell-class-proof 仍为 0。 | 批末重跑带视觉基线或几何断言的浏览器门（storybook-visual-proof、geometry-proof、internal-alpha 浏览器证明），观察层叠变化。 |
| P11 | 根 package.json 接线（集外） | 根 package.json 还没有 `geometry-measure:proof` 和 `doc-sample-style:proof` 两个脚本，verify 也不跑这两个门。 | 见 handoff/W5-C.md「集外改动」。两个门目前都红（P1 至 P4），接入 verify 后 verify 会红，由批末一并处置。 |
