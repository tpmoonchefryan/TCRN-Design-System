# 交回说明 · W3-B（SUB-025 → SUB-026）

两张 Subtask 都已完成，没有接续点。本文写给 W3-C（标记侧）和批末集成。问题与风险见 `runs/r1/problems/W3-B.md`。

## CSS 侧现状

- `doc-class-map.json` 的 171 个类在 `storybook.css`、`story-demo-styles.ts`、`alpha-styles.ts` 里已经没有任何定义。doc-shell-class-proof 的 `--details` 里，剩下每个类的 `definedIn` 都为空，`sourceKinds` 只剩 class-context、markup、script-selector。
- rename-tcrn-doc 86 个：CSS 里统一改为 `tcrn-doc-` + 原名去掉 `tcrn-`，与 map 的 `target` 逐条一致，没有例外。规则内容不变。
- delete-package-provided 38 个、delete-demo 32 个、delete-dead 15 个：CSS 规则已删。选择器列表里只有一部分选择器含被删类的，只删那几个选择器，留下的部分照旧。
- 只服务被删规则的三个 `@keyframes`（`tcrn-motion-spin`、`tcrn-motion-progress`、`tcrn-motion-shimmer`）一并删了。`tcrn-motion-travel` 还在，给 `tcrn-doc-motion-demo*` 用。
- `alpha-styles.ts` 里的 `.tcrn-checkbox { accent-color }` 覆写也删了（W2-E P13）。这个类不在 map 里，是包类。
- `story-demo-styles.ts` 没有清空：还剩 `tcrn-doc-*` 骨架和 `.alpha-*`。所以 demo-styles-sync 不退役，`tokens:proof` 链不变，`--check` 是绿的。selection-grammar 和 shell-fidelity 读的三个文档源文件都还在，源列表不用改。

## W3-C 要在标记侧做的

1. 按 map 改标记：rename 类改成 `target`，三类 delete 按 map 的 `reason` 处理（删类，或改用包组件渲染）。点名这些类的门和测试按各条的 `references` 在同一提交里改：`apps/storybook/src/smoke.test.ts`、`scripts/shell-parity-proof.mjs`、`scripts/storybook-smoke.mjs`、`scripts/s254-story-dom-proof.mjs`、`scripts/internal-alpha-browser-proof.mjs`。`scripts/shell-fidelity-proof.mjs` 里点名的类本包已经改了。
2. `page-template.tsx` 里有 15 个模板类现在没有定义，INC-010 子检查因此报 `DOC_SHELL_CLASS_UNDEFINED`：`tcrn-component-reference`（含 `__empty`、`__facet`、`__intro`、`__meta`）、`tcrn-reference-table`、`tcrn-reference-table-scroll`、`tcrn-static-section`（含 `--category-index`）、`tcrn-story-disclosure`（含 `__chevron`、`__chevron-svg`、`__heading`、`__title`），以及要删掉的 `tcrn-search-input--compact`。前 14 个改成 `tcrn-doc-` 名后就有定义了。
3. **知识库壳的结构依赖。** `tcrn-knowledge-shell__topbar` 和 `__sidebar` 按 map 删掉了，它们原来的规则（`min-height: 68px`、去边框、换底色、内距、`gap: 0 !important` 等）是在改包 TopBar/SideNav 的外观。布局里只保留了摆放：`.tcrn-doc-knowledge-shell-layout > .tcrn-top-bar { grid-area: topbar; }` 和 `.tcrn-doc-knowledge-shell-layout > .tcrn-side-nav { grid-area: sidebar; }`。所以 TopBar 和 SideNav 必须仍是布局元素的直接子元素（现在 `storybook-shell-demos.tsx` 就是这样）。shell-parity 里用 `.tcrn-knowledge-shell__topbar`、`__sidebar` 定位的地方，要换成上面这两个选择器或 data 属性。测量值可能因此变化，见问题清单 P4。
4. 被删的 `tcrn-shell-demo__topbar`、`tcrn-bookmark-nav`、`tcrn-knowledge-shell__brand-slot`、`tcrn-knowledge-shell__pager-icon` 这类挂在包组件上的钩子删掉以后，组件按包的默认外观渲染。不要在 tsx 里用 style 补回去；确实需要布局，写进 W3-C 的 handoff，交回 W3-B 的文件所有者处理（只在 `tcrn-doc-*` 容器下做摆放）。

## 本包改过的集外相关文件

`package.json`：`doc-shell:proof` 改成 `node --test tests/doc-shell-class-proof.test.mjs && node scripts/doc-shell-class-proof.mjs`（W1-D handoff 的建议，测试 13/13 通过）。它在本包文件集内，单独一个提交。
