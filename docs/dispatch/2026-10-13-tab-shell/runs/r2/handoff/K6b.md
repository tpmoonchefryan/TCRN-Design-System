# R2 交回 · K6b（SUB-156）

包树分支 `claude/init016-r2-k6b`，自集成分支 3b38286（K6 合入后）切出。只改了本包文件集里的六个文件；`Layout.tsx`、`Layout.test.tsx`、`styles/index.ts` 没有要改的地方，未动。

## 1. Subtask 状态与提交

| Subtask | 状态 | 提交 | 改动文件 |
| --- | --- | --- | --- |
| TCRN-DS-SUB-156 | 完成：R2-11 组件部分与 K4 交回第 10 节点名的两项组件余项都已做；第三项（ReadbackPanel 卡套卡）按第 10 节原样进 R3，见问题文件第 1 条 | 56f1f6c（代码与测试）；交回与问题文件另一个提交 | `components/Navigation/Navigation.tsx`、`Navigation.test.tsx`、`components/DataDisplay/DomainDisplay.tsx`、`DomainDisplay.test.tsx`、`styles/base.css.ts`、`styles/shell.css.ts`（均在 `packages/ui-react/src/` 下） |

## 2. 做了什么

1. **面包屑分隔符读 token（R2-11）。** `Breadcrumb` 的分隔符 Icon 不再写 `size={11}`：`Navigation.tsx` 从 `@tcrn/ui-tokens` 的 `tcrnTokens` 读 `--tcrn-shell-crumb-icon`（11px），解析成数字交给 `size`；token 缺失或不是 px 时在模块加载时报错，写法同 `Icon.tsx` 读图标尺寸 token。Icon API 不变，渲染出的 `width`/`height` 仍是 11。新测试钉住 token 值、渲染尺寸，并读源码确认分隔符的 `size` 里没有数字。
2. **C2 余项 3 条（K4 问题 6）。**
   - 壳内兜底焦点规则改为 `.tcrn-product-shell :where(:focus-visible):not(…)`，特异性 (0,2,0)，不再越过变体；`box-shadow` 改读 pair `--tcrn-pair-shell-edge-f`，规则里不再写颜色。
   - 这个 pair 在 `baseCss01` 里跟主题一起声明：`:root, [data-tcrn-theme="light"], [data-tcrn-theme="dark"] { --tcrn-pair-shell-edge-f: var(--tcrn-focus-ring); }`。原因见第 5 节第 2 条。
   - 兜底规则从 `baseCss09` 移到 `shell.css.ts` 的 `shellCss05` 末尾（壳件规则之后、减弱动效媒体块之前）。原因见第 5 节第 1 条。`baseCss09` 留作空段，`styles/index.ts` 的级联表不变。
   - 删去 `.tcrn-product-shell .tcrn-shell-locale-menu__trigger:focus-visible { box-shadow: none; }`。见第 5 节第 3 条。
   - `Navigation.test.tsx` 改了钉旧写法的两处，交回时在第 685–700 行与第 2136–2141 行：断言新选择器、pair 的声明、旧 (0,3,0) 写法已不在、兜底规则排在各家族与壳件同权 focus 规则之后、语言触发器的 focus 规则已删。
3. **C7 余项 45 条（K4 问题 7）。** `PageHeader` 的标题承载类挪到标题元素本身：`<h1|h2 class="tcrn-heading tcrn-heading--2 tcrn-page-header__title" title={title}>`；说明另起元素 `p.tcrn-text.tcrn-page-header__description`；两者装在新的列容器 `div.tcrn-page-header__lead` 里，这样 meta 仍在标题列旁边。`base.css.ts` 给 `.tcrn-page-header__title` 补了单行截断（nowrap、ellipsis、overflow hidden），新增 `.tcrn-page-header__lead { min-width: 0 }`，以及 `.tcrn-page-header__description { margin: 0 }`（承接原来 typography 那条后代规则给说明的零边距）。`DomainDisplay.test.tsx` 与 `Navigation.test.tsx` 中钉旧 DOM 的四处已改，另加一条测试钉住新 DOM 与三条规则。
4. **没做的部分。** C11 34 条按 K4 交回第 10 节进 R3（问题第 1 条），没有恢复豁免，也没有放宽门。

## 3. contract:static 读数变化

开工读数在 3b38286，交回读数在 56f1f6c，都在包树内先建了静态 Storybook，所以故事层也读到了。命令是 `exec node scripts/contract-static-proof.mjs --details`。

| 条款 | 开工 | 交回 | 说明 |
| --- | --- | --- | --- |
| C2 | 3 | 0 | 兜底规则 2 条（特异性、写色）与语言触发器 1 条 |
| C7 | 45 | 0 | 包 CSS 1 条，故事层 44 条（`div.tcrn-page-header__title` 装着 `<h1>`、`<h2>`、`<p>`） |
| C11 | 34 | 34 | 卡套卡，属仍在豁免内的后续批次家族（问题第 1 条） |
| C5、C6、C8、C13 | 0 | 0 | — |
| 合计 | 82 | 34 | 与 K4 交回第 2 节的 82 条一致 |

`run contract:static` 仍然退出 1，因为 `node --test` 一步在 `tests/contract-static-proof.test.mjs:524` 红 1 条（69 条中 68 条通过）。这是 K4 问题 5，问题文件第 2 条照记。

## 4. 局部门（同一门没有为求稳重跑）

日志在会话 scratch 的 `logs/r2-k6b/`。代码提交前最后一轮：

| 命令 | 退出码 | 日志 |
| --- | --- | --- |
| `--filter @tcrn/ui-react build` | 0 | 30-ui-react-build.log |
| `--filter @tcrn/ui-react test` | 0（246/246） | 31-ui-react-test.log |
| `run typecheck` | 0 | 21-typecheck.log |
| `exec node scripts/css-template-integrity-proof.mjs` | 0（findings 0） | 32-css-template.log |
| `run component-modifiers:proof` | 0（missing 0） | 23-modifiers.log |
| `run contract:static` | 1（只有 `:524` 一条，问题第 2 条） | 27-contract-static.log |
| `exec node scripts/contract-static-proof.mjs --details` | 1（只剩 C11 34） | 28-cs-details.json |
| `run shell:fidelity` | 0（12 组全 0，与开工读数相同） | 24-shell-fidelity.log |
| `run selection:proof` | 0（扫描 27 条规则，findings 0，与开工相同） | 25-selection.log |

开工读数：`base-*.log`。21 至 25 跑在最后一次 CSS 改动之后；之后只改过一段 CSS 注释的换行，所以重跑了 30–33（build、test、css-template、contract-static 摘要）。

另跑了三项读数，用作证据，不是门：
- `--filter @tcrn/design-system-storybook build`（10、26）：给 contract:static 的故事层供输入。产物在已忽略的 `storybook-static/`。
- `focus-compare`（脚本在 scratch 的 `k6btools/`）：用 Playwright 在静态页上按 Tab 走完每个停点，在壳内对比改前 CSS（把本包的焦点改动还原回去）和改后 CSS 的 `box-shadow` 与 `outline`。15：六页共 819 个停点，浅色根，差异 0。16：三页 615 个停点，深色根，差异 0。13 是第一版（pair 声明在壳根上）的读数，有 5 处差异，见第 5 节第 2 条。
- `header-compare`（34）：页头新旧 DOM 加新旧 CSS 排一遍，宽 1280、760、390，长短标题各一，标题、说明、meta 与整个页头的盒子完全相同；长标题都被截断。

跑过的门没有写 `docs/verification/**`，提交前 `git status --short` 只有本包文件。

## 5. 写明的选择与回显项

1. **兜底规则为什么移到 `shell.css.ts` 末尾，不在 `baseCss09` 里原地降到 (0,2,0)。** 原来的 (0,3,0) 能赢下其后所有同为 (0,2,0) 的规则。原地降级的话，`baseCss09` 之后的同权规则就会反过来赢：菜单项、表格工具条 chip 与收起钮、行号编辑器、可交互卡片、操作反馈详情钮这些家族自己写了彩色 focus outline，它们在壳内会和兜底环叠成两道。移到所有家族与壳件规则之后，靠排在后面赢下同权规则，胜负与改前一致，浏览器读数也一致（第 4 节）。
2. **pair 为什么跟主题声明，不放在壳根上。** 第一版把 pair 声明在 `.tcrn-product-shell` 上。对比读数在 navigation-shells 页有 5 个停点变了：浅色文档壳里有一块深色子树，里面的头像钮和图钉画成了浅色主题的环。原因是自定义属性里的 `var()` 在声明它的元素上就求值了。改成和 token 块一样，在 `:root` 与两种 `data-tcrn-theme` 上声明之后，差异为 0。
3. **语言触发器没有另加 focus pair（K4 问题 6 的建议）。** 原来那条 `box-shadow: none` 是 (0,3,0)，但在样式表里排在同权的兜底规则前面，所以从来没生效过：触发器在壳内获焦时一直显示兜底环（对比读数改前改后都有环）。K4 问题 6 里「看不到焦点环」的判断不成立。删掉这条规则后，表现与原来一样。
4. **类名。** `tcrn-page-header__lead`（标题列）与 `tcrn-page-header__description`（说明）是本包起的名字，属 B 类，可以改。标题元素显式传了 `title={title}`，与 `Heading` 的默认值相同。
5. **`baseCss09` 留成空段。** css-template-integrity 允许空段，这样 `styles/index.ts` 不用动（C-8）。段前用 TS 注释写明了规则移到了哪里。
6. **K4 问题 4（`Typography.test.tsx:301–303`）** 已经被前面的包改好了，本包树里 ui-react 测试 246 条全部通过，没有要处理的。
7. **K4 问题 3（`Navigation.test.tsx` 选中规则正则）** 已由 K6 改好，本包没动。

## 6. 迁移条目（供 SUB-158 / SUB-177 照录）

- **PageHeader 的 DOM。** 标题承载类 `tcrn-page-header__title` 从「包着标题与说明的 div」挪到标题元素本身（`h2`，在 ProductShell 纸内是 `h1`），并带 `title`。说明是带 `tcrn-page-header__description` 的 `p.tcrn-text`。两者装在新的 `div.tcrn-page-header__lead` 里。`.tcrn-page-header__title` 现在是单行截断规则。消费方如果按 `.tcrn-page-header__title h1/h2`、`.tcrn-page-header__title .tcrn-text` 选元素，或者把它当容器加样式，要改成直接选 `.tcrn-page-header__title`（标题）与 `.tcrn-page-header__description`（说明）。没有新 prop，默认值都不变。
- **壳内兜底焦点规则。** 选择器从 `.tcrn-product-shell :focus-visible:not(…)` 改为 `.tcrn-product-shell :where(:focus-visible):not(…)`，读新 pair `--tcrn-pair-shell-edge-f`（值为 `var(--tcrn-focus-ring)`，跟主题声明）。它在样式表里的位置从组件段前部移到壳件段末尾。消费方表现不变。如果有消费方用 (0,3,0) 的选择器去覆盖它，现在 (0,2,0) 以上、并且排在后面就能覆盖。

## 7. 目视项

无新增。焦点环逐停读数与页头排布读数，改前改后都相同（第 4 节）。

## 8. 待发布清单

无。没有改板、canvas 或 token。

## 9. 待补五语键

无。

## 10. 给下游包的接口与说明

- K12（SUB-173、SUB-177）与 K11（SUB-150）：页头 DOM 按第 6 节变了。我 grep 了 `apps/`、`scripts/`、`tests/`，没有找到按 `div.tcrn-page-header__title` 或其后代选元素的地方。故事层 C7 要在静态 Storybook 重建之后才读得到新 DOM。
- 跑 contract:static 的包：要读故事层，得先 `--filter @tcrn/design-system-storybook build`。不建的话，C7、C8、C11 会报 story-input-missing，C13 报 input-missing，读数只有包 CSS 那一部分。
- `Navigation.test.tsx` 新增的面包屑测试会读 `src/components/Navigation/Navigation.tsx` 源码（写法同 `ShellPins.test.tsx`），以后谁改分隔符那一行，要让 `size` 保持读 token。
- base.css.ts 的 pair 语法照旧。新加的 pair 只有 `--tcrn-pair-shell-edge-f` 一个，声明在 `baseCss01`。

## 11. 接续点

无（SUB-156 已提交）。会话 scratch 里 `logs/r2-k6b/` 是本包读数证据。`k6btools/` 里是本包用过的辅助脚本：读数摘要 1 段、规则扫描 2 段、浏览器对比 2 段、改写 2 段，另有提交信息文件，都已用完，可以清理。包树里的 `dist/` 与 `storybook-static/` 是被 git 忽略的构建产物。
