# doc-shell 包外类清零差集 · R2 末

证据来源：`node scripts/doc-shell-class-proof.mjs --details` 在 HEAD 9096833 的输出（先 `pnpm build`），对照 R1 起点 `docs/verification/doc-shell-class/baseline.json`（b1c0ade，TCRN-DS-SUB-024 首跑）与处置表 `docs/design/gplus-2026-10/doc-class-map.json`。本文件只记差集；基线文件不改，没有用 `--write-baseline`。逐类的残留计数由本文件的生成脚本按整词匹配另行统计，只作旁证，门的判定以 doc-shell-class-proof 为准。

## 计数

| 项 | R1 起点（baseline.json） | R2 末（--details） |
| --- | --- | --- |
| 包外 tcrn- 类（outOfPackageCount） | 171 | 0 |
| 包 CSS 定义的类（packageCss.definedClassCount） | 425 | 453 |
| 豁免的文档类（exemptDocClassCount） | 67 | 152 |
| 包写出而无规则的类（packageEmittedWithoutRuleCount） | 40 | 39 |
| 扫描的静态页 / 源文件 | 35 / 54 | 37 / 64 |

差集：基线以来新增 0 类，清除 171 类；处置表 171 条，未映射 0 条。门的结论：`ok: true`，reasonCode `DOC_SHELL_CLASSES_PACKAGE_BACKED`，模板类检查 `DOC_SHELL_CLASSES_DEFINED`（75 类，缺 0）。

## 按处置汇总

| 处置（doc-class-map） | 处置表计数 | 本差集计数 | 去向 |
| --- | --- | --- | --- |
| delete-package-provided | 38 | 38 | 删除，改由包组件提供：The class is written onto a package component, or the doc layer copies a package component or variant. Delete the class and its doc rules; render the package component with its own props. A variant the package lacks goes to the package, not back into the doc layer. |
| rename-tcrn-doc | 86 | 86 | 改名为文档脚手架类：rename→tcrn-doc-*: documentation scaffolding that only arranges package components or doc text. Rename the class to target in markup, doc CSS, proofs and tests; keep the rules under the new name. |
| delete-demo | 32 | 32 | 删除仿制演示：Storybook-only imitation of product UI that the package does not provide. Delete the markup and its doc rules; where a story still needs the pattern, compose it from package components. |
| delete-dead | 15 | 15 | 删除无效类：No effect: defined but never written, or written with no rule anywhere and no proof hook. Delete the rule or the class token. |

旁证合计：171 个旧类名在文档源（apps/storybook/src 与 .storybook，不含 *.test.*）中的整词残留 0 处，在构建出的静态站（html、js、css）中 1 处；rename 目标名在源与静态站都找不到的 1 条；处置表缺条目的 0 条。

清零经过的提交（按处置成批，不逐类追溯）：R1 的 e5ff346（SUB-025，去掉文档层的平行组件 CSS、脚手架改 tcrn-doc- 前缀）、564f352（SUB-026，清 alphaStoryCss 的包外类）、3e2c46f（SUB-027，文档骨架改 tcrn-doc- 前缀）；R2 的 1fe5bcb（SUB-063，去掉文档层对包组件外观的覆盖）、95f0e09（SUB-066，按 delete-demo 退役密集与紧凑壳原型）。

## 旁证的两处例外

- `tcrn-input--short` 在静态站的 1 处出现，是包 inputs 段的一行 CSS 注释（`packages/ui-react/src/styles/inputs.css.ts` 第 166 行「.tcrn-input--short is a docs-only demo width and stays there」），随 tcrnComponentCss 进了 `storybook-static/ds-static-bridges.js`；不是类的使用，门不计。注释内容已过时（该类已按 delete-package-provided 删除），记入本轮问题清单，不在本包改。
- `tcrn-shell-demo--dense` 的 rename 目标 `tcrn-doc-shell-demo--dense` 现在源与静态站都没有：R1 的 e5ff346（SUB-025）先按处置改名，R2 的 95f0e09（SUB-066，R2-17）按 delete-demo 退役密集壳原型时连同改名后的类一起删掉。去向按最终状态是删除。

## 逐类去向

「残留」是旧类名的整词出现次数；「已清除」取自 --details 的 clearedSinceBaseline。

| 类 | 处置 | 去向 | rename 目标（源 / 静态出现次数） | 旧名残留 | 已清除 |
| --- | --- | --- | --- | --- | --- |
| `tcrn-action-row` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-action-row`（源 25，静态 168） | 源 0 / 静态 0 | 是 |
| `tcrn-bookmark-nav` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-bookmark-nav--tracked` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-bookmark-nav__children` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-bookmark-nav__group` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-bookmark-panel` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-brand-lockup-card` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-brand-lockups` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-brand-lockups`（源 2，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-brand-system` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-brand-system`（源 4，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-brand-system__copy` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-brand-system__copy`（源 4，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-brand-system__symbol` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-brand-system__symbol`（源 2，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record__artifact` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record__artifact`（源 3，静态 42） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record__boundary` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record__boundary`（源 3，静态 44） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record__evidence-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record__evidence-grid`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record__evidence-list` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record__evidence-list`（源 10，静态 150） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-record__header` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-record__header`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-records` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-changelog-records`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-token` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-token__label` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-changelog-token__value` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__body` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__brand` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__metric` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__panel` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__summary` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__switcher` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-compact-shell__top-bar` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-component-reference` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-component-reference`（源 3，静态 162） | 源 0 / 静态 0 | 是 |
| `tcrn-component-reference__empty` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-component-reference__empty`（源 3，静态 41） | 源 0 / 静态 0 | 是 |
| `tcrn-component-reference__facet` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-component-reference__facet`（源 4，静态 142） | 源 0 / 静态 0 | 是 |
| `tcrn-component-reference__intro` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-component-reference__intro`（源 2，静态 44） | 源 0 / 静态 0 | 是 |
| `tcrn-component-reference__meta` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-component-reference__meta`（源 3，静态 162） | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-dialog-spec-fixture`（源 21，静态 373） | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture__actions` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-dialog-spec-fixture__actions`（源 4，静态 40） | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture__dialog` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture__dialog-actions` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture__header` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-dialog-spec-fixture__header`（源 6，静态 77） | 源 0 / 静态 0 | 是 |
| `tcrn-dialog-spec-fixture__summary` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-dialog-spec-fixture__summary`（源 6，静态 77） | 源 0 / 静态 0 | 是 |
| `tcrn-display-primitive-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-display-primitive-grid`（源 11，静态 47） | 源 0 / 静态 0 | 是 |
| `tcrn-entry-shell-strip` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-entry-shell-strip__brand` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-entry-shell-strip__module` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-eyebrow` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-form-stack` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-form-stack`（源 9，静态 83） | 源 0 / 静态 0 | 是 |
| `tcrn-guidance-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-guidance-grid`（源 7，静态 42） | 源 0 / 静态 0 | 是 |
| `tcrn-guidance-list` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-icon-sample` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-icon-sample`（源 7，静态 148） | 源 0 / 静态 0 | 是 |
| `tcrn-icon-sample-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-icon-sample-grid`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-inline-proof-token` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-input--short` | delete-package-provided | 删除，改由包组件提供；静态 1 处为包 CSS 注释，见上节 | — | 源 0 / 静态 1 | 是 |
| `tcrn-interaction-primitive-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-interaction-primitive-grid`（源 5，静态 42） | 源 0 / 静态 0 | 是 |
| `tcrn-interaction-primitive-row` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-interaction-primitive-row`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-preview` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-preview`（源 5，静态 75） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-preview__panel` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-preview__panel`（源 5，静态 75） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell-layout` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell-layout`（源 17，静态 297） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__actions` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__actions`（源 15，静态 260） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__brand` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__brand`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__brand-cell` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__brand-cell`（源 5，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__brand-slot` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__content` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__content`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__groups` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__groups`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__pager` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__pager`（源 17，静态 297） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__pager-icon` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__sidebar` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__sidebar-intro` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__sidebar-intro`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__topbar` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-knowledge-shell__topbar-copy` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-knowledge-shell__topbar-copy`（源 11，静态 186） | 源 0 / 静态 0 | 是 |
| `tcrn-loading-card` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-card__row` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-loading-card__row`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-loading-copy` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-loading-copy`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-loading-motion-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-loading-motion-grid`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-loading-progress` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-progress__bar` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-skeleton` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-skeleton__line` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-skeleton__line--medium` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-skeleton__line--short` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-spinner` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-status` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-status__arrow` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-status__chip` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-loading-status__chip--active` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-locale-card` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-locale-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-locale-grid`（源 4，静态 40） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo`（源 10，静态 115） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo--emphasis` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo--emphasis`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo--instant` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo--instant`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo--reduced` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo--reduced`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo--standard` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo--standard`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo-grid`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo__dot` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo__dot`（源 16，静态 226） | 源 0 / 静态 0 | 是 |
| `tcrn-motion-demo__track` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-motion-demo__track`（源 6，静态 41） | 源 0 / 静态 0 | 是 |
| `tcrn-nav-component-preview` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-nav-component-preview`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-drawer-grid` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-drawer-stage` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-mode-card` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-mode-card`（源 10，静态 151） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-mode-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-mode-grid`（源 5，静态 75） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-mode-matrix` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-mode-matrix`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-mode-matrix__intro` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-mode-matrix__intro`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-static-card` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-static-card`（源 5，静态 76） | 源 0 / 静态 0 | 是 |
| `tcrn-overlay-static-modes` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-overlay-static-modes`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-package-nav-proof` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-package-nav-proof`（源 9，静态 149） | 源 0 / 静态 0 | 是 |
| `tcrn-package-nav-proof__skip` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-package-nav-proof__skip`（源 7，静态 112） | 源 0 / 静态 0 | 是 |
| `tcrn-popover-spec-fixture` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-popover-spec-fixture__popover` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-product-shell-contract-proof` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-product-shell-contract-proof`（源 1，静态 1） | 源 0 / 静态 0 | 是 |
| `tcrn-product-shell-search--static-display` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-reference-index` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-reference-index`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-reference-index__item` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-reference-index__item`（源 11，静态 311） | 源 0 / 静态 0 | 是 |
| `tcrn-reference-strip` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-reference-strip`（源 7，静态 77） | 源 0 / 静态 0 | 是 |
| `tcrn-reference-table` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-reference-table`（源 12，静态 310） | 源 0 / 静态 0 | 是 |
| `tcrn-reference-table-scroll` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-reference-table-scroll`（源 4，静态 162） | 源 0 / 静态 0 | 是 |
| `tcrn-search-input--compact` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-command-board` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-command-board__header` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-shell-demo`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo--compact` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-shell-demo--compact`（源 2，静态 37） | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo--dense` | rename-tcrn-doc | 改名为文档脚手架类；R1 改名后随密集壳原型在 R2 删除，见上节 | `tcrn-doc-shell-demo--dense`（源 0，静态 0） | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo--hub` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo--knowledge` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-shell-demo--knowledge`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo__brand` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo__menu-button` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo__topbar` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo__topbar--dense` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-demo__topbar--docs` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-density-stack` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-domain-group` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-domain-item` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-domain-list` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-domain-nav` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-hub-action` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-hub-actions` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-hub-menu` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-hub-sidecar` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-hub-summary` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-layer` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-mega-menu` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-quick-list` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-quick-rail` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-task-lane` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-task-lane__title` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-shell-task-lanes` | delete-demo | 删除仿制演示 | — | 源 0 / 静态 0 | 是 |
| `tcrn-spec-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-spec-grid`（源 10，静态 115） | 源 0 / 静态 0 | 是 |
| `tcrn-spec-grid--record-index` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-spec-grid--record-index`（源 5，静态 75） | 源 0 / 静态 0 | 是 |
| `tcrn-static-nav` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-static-section` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-static-section`（源 6，静态 70） | 源 0 / 静态 0 | 是 |
| `tcrn-static-section--category-index` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-static-section--category-index`（源 2，静态 44） | 源 0 / 静态 0 | 是 |
| `tcrn-status-cloud` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-status-cloud`（源 4，静态 39） | 源 0 / 静态 0 | 是 |
| `tcrn-story-disclosure` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-disclosure`（源 4，静态 176） | 源 0 / 静态 0 | 是 |
| `tcrn-story-disclosure__chevron` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-disclosure__chevron`（源 4，静态 176） | 源 0 / 静态 0 | 是 |
| `tcrn-story-disclosure__chevron-svg` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-disclosure__chevron-svg`（源 2，静态 102） | 源 0 / 静态 0 | 是 |
| `tcrn-story-disclosure__heading` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-disclosure__heading`（源 3，静态 139） | 源 0 / 静态 0 | 是 |
| `tcrn-story-disclosure__title` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-disclosure__title`（源 3，静态 139） | 源 0 / 静态 0 | 是 |
| `tcrn-story-kicker` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-story-kicker`（源 3，静态 37） | 源 0 / 静态 0 | 是 |
| `tcrn-storybook-component-example` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-storybook-product-shell` | delete-dead | 删除无效类 | — | 源 0 / 静态 0 | 是 |
| `tcrn-theme-preview` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-theme-preview`（源 4，静态 48） | 源 0 / 静态 0 | 是 |
| `tcrn-token-swatch` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-token-swatch`（源 14，静态 313） | 源 0 / 静态 0 | 是 |
| `tcrn-token-swatch-grid` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-token-swatch-grid`（源 6，静态 41） | 源 0 / 静态 0 | 是 |
| `tcrn-token-swatch__color` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-token-swatch__color`（源 4，静态 128） | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo` | rename-tcrn-doc | 改名为文档脚手架类 | `tcrn-doc-type-scale-demo`（源 3，静态 38） | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__body` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__caption` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__code` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__dense` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__page` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__reading` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-type-scale-demo__section` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
| `tcrn-typography-sample` | delete-package-provided | 删除，改由包组件提供 | — | 源 0 / 静态 0 | 是 |
