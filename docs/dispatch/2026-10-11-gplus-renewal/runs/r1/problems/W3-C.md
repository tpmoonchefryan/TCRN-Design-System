# W3-C 问题清单（INIT-015 R1，SUB-027）

见红只记不修，交批末一次处置。日志在 scratchpad `logs/r1-W3-C-*.log`。

1. **doc-shell:proof 在本包树仍红（预期）。** `outOfPackageCount` 164（171 减去已清的 7 个），另有 `templateClassCheck` 缺 14 个类（`DOC_SHELL_CLASS_UNDEFINED`）。164 个类全部只剩 `storybook.css`、`story-demo-styles.ts`、`alpha-styles.ts` 里的规则定义，源码标记与静态页里的使用为 0（`--details` 逐类核对：`usedIn` 为空，`outputKinds` 只有 `doc-style`）。缺定义的 14 个是 `page-template.tsx` 改名后的 `tcrn-doc-*` 类，CSS 侧还是旧名。W3-B 合入后两项一起转绿。已清的 7 个：`tcrn-bookmark-nav--tracked`、`tcrn-compact-shell__top-bar`、`tcrn-overlay-drawer-stage`、`tcrn-popover-spec-fixture`、`tcrn-popover-spec-fixture__popover`、`tcrn-product-shell-contract-proof`（改名，旧名本来就没有规则）、`tcrn-shell-demo--hub`。
2. **storybook test 红 3 条用例。** 用软断言探针把 3 条用例跑完，失败的断言一共 8 条：
   - (a) 过渡红，1 条：`.tcrn-doc-icon-sample-grid[\s\S]*margin: var(--tcrn-space-4) 0 0` 读的是页面内联 CSS，CSS 侧改名后转绿。W3-B 改名时要保留这条 margin。
   - (b) 不是本包造成的，7 条，读的文件都在本包集外，本包也没有改：页面 CSS 的 `.tcrn-field:focus-within` background-color 与 forced-colors 两条（包的 inputs CSS）；`.storybook/preview.ts` 画布色 `var(--tcrn-color-bg)` 三条和首帧 theme-color meta 一条（token 改名）；AI 契约的「TCRN stays regular weight」一条。归属请主线程分派。
3. **集外门在本包合入后会转红，须同一次合并时一起改。**
   - `scripts/s254-story-dom-proof.mjs:43` 查询 DOM 里的 `.tcrn-story-disclosure`。合入后查到 null，`storyExpanded` 会恒为 false，应改为 `.tcrn-doc-story-disclosure`。
   - `scripts/shell-fidelity-proof.mjs`：第 37、38、40 行 `FUNCTIONAL_GRADIENT_SELECTORS` 里的 `.tcrn-loading-progress__bar`、`.tcrn-loading-skeleton__line`、`.tcrn-bookmark-nav--tracked`，在 W3-B 删掉规则后成为空条目。第 77–84、111–112、138 行注释里的旧类名，和第 333 行自测夹具字符串 `.tcrn-storybook-component-example .tcrn-nav-item{}` 只是字面量，不查询页面，可以保留，也可以改成 `tcrn-doc-` 名。
4. **处置中的判断，请验收复核。**
   - (a) 密集壳与紧凑壳原型（delete-demo）：删除了类，元素、data 属性和文案保留。原因是 smoke.test.ts（约第 742–800 行）和 storybook-smoke 把这些 data 属性和文案当作判据。删除后这些部件按无样式的原生元素渲染。整块删掉，或改用包组件重画，属于范围决定；Story 的假设写明旧 story 不在本单重画。欢迎页的入口条原型没有任何门依赖，已连同标记一起删掉。
   - (b) 两处手写顶栏改为包 `TopBar`：productName 放菜单 IconButton 与 ShellBrandLockup，moduleName 放 SearchInput，actions 放 StatusBadge。
   - (c) 字号样本改为 `Heading` visualLevel 1/2 与普通 `Text`。G+ 的 `tcrn-text--reading|body|meta` 只在 `styles/generated/typography.scale.ts` 里，还没有拼进 tcrnComponentCss，用了门会判为包外类。所以正文、阅读、说明三档目前同为 Text 字号，要等 Text 提供变体（排版家族）。
   - (d) 加载示例：卡片改 `Card`；转圈改 `Icon name="loader-circle"`，旋转由包提供；骨架改 `Skeleton variant="text" lines={3}`；进度改 `Progress`，不定态，label 复用「Progress feedback」，保留 aria-hidden；状态切换的芯片改 `Badge`。
   - (e) `.tcrn-input--short` 改为在 Field 外包 `<div data-field-width="short" style={{ inlineSize: "min(18ch, 100%)" }}>`。Field 会克隆它的直接子元素来注入 aria-describedby，所以容器不能放在 Field 和 Input 之间。代价是提示文字在 18ch 内折行。
   - (f) Dialog/Popover 夹具的操作行：删了类，改为普通 div。Dialog 没有 actions 属性；改用 ButtonGroup 需要新增 aria-label 文案。
   - (g) ChangelogToken 改为外层 span 包 `MachineToken token={compactValue} label density="compact"`，外层 span 保留 data-changelog-*、title 和 aria-label。storybook-smoke 的紧凑节点选择器改为 `[data-changelog-full-token] .tcrn-machine-token__value`，它的宽度和省略号期望可能变化，归 W6-B。
   - (h) inline proof token 改为可聚焦的 span 包 `MachineToken`，Tooltip 的触发点仍然可以用键盘到达。
5. **门引用的同步口径。** 改名的类改成新名。删除的类改为断言同一元素上的非类钩子，即 id、data-*、aria-label，或包根类 `tcrn-top-bar`、`tcrn-side-nav`。只保留一条反向断言 `tcrn-bookmark-nav--tracked`，该类本来就没有 CSS 定义。shell-parity 的 `.tcrn-knowledge-shell__topbar|__sidebar` 改为 `${sampleShellRoot} > .tcrn-top-bar` 和 `> .tcrn-side-nav`。
6. **未跑的门。** storybook-smoke、internal-alpha-browser-proof、shell-parity、full-surface、geometry 不在本包局部门里，只做了 `node --check` 语法检查。它们的外观期望值没有改，归 W6-B。
7. **W1-D 问题第 8 条**：`docs/style-scale.md` 的豁免表不在本包文件集内，仍然待处理。
