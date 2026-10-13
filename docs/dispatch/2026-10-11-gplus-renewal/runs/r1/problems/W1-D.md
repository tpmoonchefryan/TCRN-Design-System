# W1-D 问题清单（INIT-015 R1，SUB-024）

见红只记不修，交批末一次处置。

1. **doc-shell:proof 按判据先红。** 现仓首跑 171 个包外类，reasonCode `DOC_SHELL_OUT_OF_PACKAGE_CLASSES`；INC-010 子检查绿（76 个模板类均有定义）。verify 第 11 步在 SUB-025/026/027 清零前保持红。基线 `docs/verification/doc-shell-class/baseline.json`；逐类处置 `docs/design/gplus-2026-10/doc-class-map.json`：delete-package-provided 38、rename-tcrn-doc 86、delete-demo 32、delete-dead 15。
2. **口径待确认：包自身写出、但 tcrnComponentCss 没有规则的类不计数。** 共 40 个，单列在基线的 `packageEmittedWithoutRule`（如 `tcrn-tree-nav--compact`、`tcrn-badge--neutral`、`tcrn-icon`、`tcrn-checkbox`）。按判据原文「减去包 CSS 定义的类」和 128-GWT1 的严格读法，这些类应计入差集；但它们由包组件写出（类名字面量，或 `tcrn-x--${density}` 一类模板），文档层删不掉，计入后 W3 无法转绿。现做法：不计数，单列回显。文档源自己写出的类一律计数，只有包写出完全相同的字面量时才不计。如果验收要求严格读法，就得由包侧给这些类补规则或停止写出（大多属 W2 五个家族之外的家族），或由 Owner 裁定。建议：维持现做法。
3. **文档 CSS 覆写包类，不在本门范围。** 文档 CSS 另外给 23 个 tcrnComponentCss 已定义的类写了规则，`tcrn-icon`、`tcrn-checkbox` 这两个包写出的类也被文档 CSS 覆写。本门数的是类，不数规则。Story 128 的「组件样式删（由包提供）」要管住这类覆写，需要规则级检查，或由 128-GWT3 的计算样式取样覆盖。建议：W3 清理时把这 25 处覆写一起删掉，或在 SUB-028 一类的门里加规则级断言。
4. **引用联动。** map 里有 35 个类被 proofs/tests 点名：`scripts/shell-parity-proof.mjs`、`scripts/shell-fidelity-proof.mjs`、`scripts/storybook-smoke.mjs`、`scripts/s254-story-dom-proof.mjs`、`scripts/internal-alpha-browser-proof.mjs`、`apps/storybook/src/smoke.test.ts`，每个类的点名位置逐条写在它的 `references`。W3 改名或删除时，必须在同一提交里改这些门，否则 shell:parity、storybook:smoke、test 会转红。
5. **处置中的三处判断，请 W3 和验收复核。** (a) knowledge-shell 样例（`data-standard-shell="online-docs"`）的布局类按 rename 处理、没有删，因为 shell:parity 以它为测量对象；挂在包 TopBar/SideNav 上的类仍按 delete-package-provided。(b) dense 与 compact 壳原型的内部件（hub/mega menu、domain nav、quick rail、task lanes、command board、compact shell）按 delete-demo；外框 `tcrn-shell-demo` 按 Story 128 示例 rename。(c) token 色块、motion 演示、主题预览、locale 网格按 rename（文档内容），没有归入 delete-demo。
6. **首跑计数与拆分估计的差。** 拆分估计约 149–164，首跑 171。多出来的部分来自三处：本门同时读 storybook-static 的标记与脚本；计入了在源里写出、却哪里都没有定义的类（5 个，归 delete-dead）；计入了只出现在文档源、没进静态页的类（如 `tcrn-story-kicker`）。
7. **扫描范围。** storybook-static 只读 `.html` 与 `.js`：标记 class 属性、`<style>` 规则前导里的选择器、脚本里的 classList/className 写入与选择器查询。`.json`、`.txt`、`.svg` 不读，它们是数据和图片，不是渲染标记。文档源读 `apps/storybook/src` 与 `apps/storybook/.storybook`，不含 `*.test.*`；注释与 JSX 正文不读。
8. **Story 128 修复项里的 `docs/style-scale.md` 豁免表未改**，属 W3。
