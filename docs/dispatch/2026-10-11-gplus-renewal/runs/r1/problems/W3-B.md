# W3-B 问题清单（INIT-015 R1，SUB-025 → SUB-026）

只记不修，交批末一次处置。日志在派工 scratchpad 的 `logs/r1-W3-B-*.log`。

| # | 类别 | 现象与证据 | 建议 |
| --- | --- | --- | --- |
| P1 | 预期红，基线即有 | shell-fidelity 的 `docsPackageSelectorDuplication` 报 `.tcrn-icon`：一处在 `storybook.css`（来自 `story-demo-styles.ts` 的基础规则，即 style-scale.md 记的 Deferred primitive），一处在 `alpha-styles.ts`（`.tcrn-doc-story-disclosure__chevron .tcrn-icon`、`.tcrn-doc-nav__section-icon .tcrn-icon` 两条摆放）。起因是 W2-C 在包里加了 `.tcrn-icon[data-icon-name="loader-circle"]`，`.tcrn-icon` 从此成了包规则的主体。在 5630344 上首跑就是红的，本包没有引入。同一次首跑里的 `.tcrn-checkbox`（W2-E）已由 SUB-026 删掉文档覆写，转绿。 | 两种改法：其一，Owner 裁定 W2-C P6，基础规则进包，删掉文档层这条，再看两条摆放；其二，P6 裁定之前，先按 style-scale.md 的 Deferred primitive 条目把 `.tcrn-icon` 加进 `DUPLICATE_SELECTOR_WHITELIST` 并注明出处，P6 定了再删。建议用其二，批末一行改完。 |
| P2 | 预期红，等 W3-C | doc-shell-class-proof：包外类 171 → 161，清掉的 10 个都是只有 CSS 定义的 delete-dead 类。剩下 161 个的 `definedIn` 全为空，只出现在标记、className 与脚本选择器里。INC-010 子检查报 `DOC_SHELL_CLASS_UNDEFINED`，原因是 `page-template.tsx` 的 15 个模板类（14 个 rename、1 个 `tcrn-search-input--compact`）现在没有定义。 | W3-C 按 map 改完标记后，计数应为 0，`templateClassCheck.ok` 应为 true。处理清单见 handoff/W3-B.md。 |
| P3 | 范围外残留 | 接 W1-D P3：map 之外仍有 45 条文档规则以包类为主体。其中 6 条没有放在文档容器下：`.tcrn-icon`（P1）、`.tcrn-filter-bar`（style-scale 记为演示钩子）、`.tcrn-sr-only`、`.tcrn-skip-link`、`.tcrn-skip-link:focus`（复刻的基础设施类，在白名单里）、`.tcrn-shell-brand-lockup .tcrn-brand-wordmark`（改了包锁定组合的字号，也在白名单里）。另外 39 条挂在 `tcrn-doc-*`/`alpha-*` 容器下，多数是摆放；`.tcrn-doc-global-brand .tcrn-brand-wordmark*` 和改名后的 `.tcrn-doc-knowledge-shell__brand`（给包 ShellBrandLockup 去底色、阴影和内距）是在改外观。 | 128-GWT3（计算样式与矩阵 story 比对）可能抓到这些改外观的规则。建议下一批由 SUB-028 一类的门加规则级断言，或删掉这几条改外观的规则。这些都不在 map 内，本包没有动。 |
| P4 | 风险，未验证 | 按 map 删掉 `tcrn-knowledge-shell__topbar`、`__sidebar`、`__brand-slot` 以后，知识库壳样例里的 TopBar 和 SideNav 按包默认外观渲染。原来的 68px 最小高、去边框、左栏底色与内距都没了，布局里只保留 grid-area 摆放。shell:parity 拿这个样例和线上文档壳比几何，数值可能变。shell:parity 不在本包局部门里，没跑。 | 批末跑 shell:parity。红了，先判断是该改 parity 判据（样例只渲染包），还是把壳的尺寸要求补进包。不要再加回文档层覆写。 |
| P5 | 信息 | map 里 `storybook.css` 的 `definedIn` 行号是 W2-A 重生成 token 块之前的，比现在少 120 行（例如 `tcrn-action-row` 记为 440，实际 560）。`story-demo-styles.ts` 和 `alpha-styles.ts` 的行号当时是准的，本包改完之后也都变了。 | 按类名处理，或以 `doc-shell-class-proof.mjs --details` 的现值为准。不要按 map 的行号改文件。 |
| P6 | 信息 | tokens-sync 提示 `storybook.css` 仍引用 19 个弃用 token 名，共 88 处，都能解析到 G+ 值。文档层规则还在用 `--tcrn-color-border-subtle`、`--tcrn-color-brand-*` 等旧名。 | 判据要求不改 `tcrn-doc-*` 的外观，本包没有迁移这些名字。迁到 G+ 名可以放到以后碰文档层的批次里一并做。 |
| P7 | 信息 | `story-demo-styles.ts` 里 `@container tcrn-knowledge-shell (max-width: 960px)` 前面的注释，还在讲品牌格跨两行的布局，但对应的 TopBar 轨道规则已经按 map 删了。 | 下次碰这个文件时把注释改成只讲操作区换行。 |
