# 交回 · P1a（INIT-016 R1，W1）：壳 token、标按钮、固定项

分支 `claude/init016-r1-p1a`，自 `198b8ae` 切出。三张 Subtask 全部完成，无接续点。日志在会话 scratch 的 `logs/r1-p1a/`（下文写作 `<logs>/`）。交回时 `git status --short` 为空；没有门改动 `docs/verification/**`，没有遗留未跟踪文件。

## 1. Subtask 状态

| Subtask | 状态 | 提交 | 改动文件 |
| --- | --- | --- | --- |
| TCRN-DS-SUB-113 | 完成 | `a7a1b0b` | `docs/design/gplus-2026-10/contract/tokens.json`；五个生成物（`gplus-tokens.generated.ts`、`actions.pairs.ts`、`inputs.pairs.ts`、`typography.scale.ts`、`matrices.generated.ts`，后四个只有头部 contract-sha256 变化）；`packages/ui-tokens/src/index.ts`、`index.test.ts`、`tokens.css`；`apps/storybook/src/storybook.css`（tokens-sync 再生）；`CHANGELOG.md` |
| TCRN-DS-SUB-114 | 完成 | `b44c4d7` | `Navigation/ShellBrandButton.tsx`、`ShellBrandButton.test.tsx`、`shell-copy.ts`（新）；`styles/shell.css.ts`（新）、`styles/index.ts`；`Navigation/index.ts`；`src/index.tsx`；`docs/contract/families.json` |
| TCRN-DS-SUB-115 | 完成 | `5fe6158` | `Navigation/ShellPins.tsx`、`ShellPins.test.tsx`（新）；`shell-copy.ts`、`styles/shell.css.ts`、`styles/index.ts`、`Navigation/index.ts`、`src/index.tsx`、`docs/contract/families.json` |

独占文件集里未改的两份：`scripts/tokens-sync.mjs`（触摸 44 未进 token 层，见 3.1，无需改）；`packages/ui-react/src/index.test.tsx`（花名册测试按真实导出双向比对，`index.tsx` 花名册加名即绿，无需改）。

## 2. 局部门（命令前缀 `corepack pnpm@10.12.1 -C <包树>`）

| Subtask | 命令 | 退出码 | 日志 |
| --- | --- | --- | --- |
| 113 | `exec node scripts/contract-generate.mjs` | 0 | `<logs>/113-contract-generate.log` |
| 113 | `--filter @tcrn/ui-tokens build` | 0 | `<logs>/113-ui-tokens-build.log` |
| 113 | `exec node scripts/tokens-sync.mjs` | 0 | `<logs>/113-tokens-sync.log` |
| 113 | `exec node scripts/tokens-sync.mjs --check` | 0（C5 两主题块 86 属性） | `<logs>/113-tokens-sync-check.log` |
| 113 | `--filter @tcrn/ui-tokens test` | 0（13/13） | `<logs>/113-ui-tokens-test.log` |
| 113 | `run build` | 0 | `<logs>/113-build.log` |
| 113 | `run tokens:proof` | 0 | `<logs>/113-tokens-proof.log` |
| 113 | `run contract:static` | 0 | `<logs>/113-contract-static.log` |
| 113 | `run contract:proof` | 0 | `<logs>/113-contract-proof.log` |
| 114 | `--filter @tcrn/ui-react build` | 0 | `<logs>/114-ui-react-build.log` |
| 114 | `--filter @tcrn/ui-react test` | 0（171/171，新增 8） | `<logs>/114-ui-react-test.log` |
| 114 | `run typecheck` | 0 | `<logs>/114-typecheck.log` |
| 114 | `exec node scripts/css-template-integrity-proof.mjs` | 0 | `<logs>/114-css-integrity.log` |
| 114 | `run component-modifiers:proof` | 0 | `<logs>/114-component-modifiers.log` |
| 114 | `run selection:proof` | 0 | `<logs>/114-selection.log` |
| 114 | `exec node scripts/token-extension-proof.mjs` | 0 | `<logs>/114-token-extension.log` |
| 114 | `run contract:static` | 0 | `<logs>/114-contract-static.log` |
| 114 | `run exports:check` | 0 | `<logs>/114-exports.log` |
| 114 | `run brand-asset:proof` | 0 | `<logs>/114-brand-asset.log` |
| 115 | `--filter @tcrn/ui-react build` | 0 | `<logs>/115-ui-react-build.log` |
| 115 | `--filter @tcrn/ui-react test` | 0（178/178，新增 7） | `<logs>/115-ui-react-test.log` |
| 115 | `run typecheck` | 0 | `<logs>/115-typecheck.log` |
| 115 | `exec node scripts/css-template-integrity-proof.mjs` | 0 | `<logs>/115-css-integrity.log` |
| 115 | `run component-modifiers:proof` | 0 | `<logs>/115-component-modifiers.log` |
| 115 | `run selection:proof` | 0（选择规则 25 条，0 发现） | `<logs>/115-selection.log` |
| 115 | `exec node scripts/token-extension-proof.mjs` | 0 | `<logs>/115-token-extension.log` |
| 115 | `run contract:static` | 0（C2、C6、C11 各 0 发现） | `<logs>/115-contract-static.log` |
| 115 | `run exports:check` | 0 | `<logs>/115-exports.log` |

114 的 typecheck 至 brand-asset 八条第一次调用写成变量展开，zsh 不分词，八条都以 127「命令不存在」返回、没有执行；改成函数后各执行一次，上表是那一次。

## 3. 写明的选择与回显

1. **触摸 44 不在 token 层。** tokens-sync 写不了媒体块：`parseTokenCssBlocks` 只认扁平块，嵌套 `@media` 里的 `:root` 会被算进主题无关块并报重复声明，`index.test.ts` 与 C5 也断言 token 表恰为三块；要支持就得改 C5 门的块模型，属 C-17 停下条件。按摘录退路，由 SUB-114 在 `shell.css.ts`（`shellCss01` 末尾）写 `@media (pointer: coarse) { :root { --tcrn-shell-row-h: 44px; --tcrn-shell-srch-h: 44px; } }`：凡读 `var(--tcrn-shell-row-h)`、`var(--tcrn-shell-srch-h)` 的规则随之切换，不另设 token。44 是 F 段原值，仓内没有值为 44 的 token，所以写成字面值。`scripts/tokens-sync.mjs` 因此不改。
2. **上限 6 读 JS token 值。** `shellPinsMax()` 从 `tcrnTokens` 取 `--tcrn-shell-pins-max`，不读 CSS 变量。组件代码里没有 6，测试剥掉注释后断言。
3. **token 名与组。** 16 条 shell 名就是 F 段点分名（`shell.strip-h` … `shell.pinb`，从 contract key 去掉 `shell-` 前缀得到），group 为 container（契约组 shell 的现有映射）。motion.intro 四条名为 `motion.intro.fade/move/rise/max`，group motion。全部在主题无关 `:root` 块。intro 四值写字面 120/240/100/700ms，不写成 `var(--t-fill)` 引用；测试断言 fade = t-fill、move = t-move、三段和为 460 且 ≤ 700。r-paper 注释改为顶带壳纸面，值不变。
4. **退役。** `tokens.json` 里 topbar-h 的值改为 `var(--shell-strip-h)`，生成为 `var(--tcrn-shell-strip-h)`。`index.ts` 新增 `retiredContractTokens`：两条宽度弃用、replacement 为 null、保留 220/52；topbar-h 是指向 strip-h 的弃用别名，加载时校验别名与契约值一致。`tcrnDeprecatedTokens` 列这三条；`tcrnDeprecatedTokenAliases` 按其定义只收有继任者的别名，所以只多 topbar-h 一条，语义未改。CHANGELOG 4.0.0 段加了「Three shell tokens retired by the top band」小节，版本面不动。
5. **同源测试。** `index.test.ts` 读 `build-shell2.mjs` 的 `.scr.ts{…}` 行，逐个比对 `--strip-h`、`--tab`、`--panel-wx`、`--menu-gap`、`--pin-gap`、`--drop-w`、`--cascade-gap`、`--row-h`、`--pinb`、`--srch-h`，另加 `--paper-r`（对 r-paper），每个都等于契约值和包值。
6. **标按钮的版本。** `version`：`"auto"`（默认）、`"v1"` 或 `"v2"`。auto 时样式表在 `max-width: 1023px` 隐去字标并让宽度自适应，首帧即对；挂载后 `matchMedia("(max-width: 1023px)")` 把 `data-shell-brand` 报成 v1 或 v2，`data-shell-brand-auto` 标记 auto。强制 v1 时不渲染 `<b>`。
7. **标资产。** 用 `TcrnBrandMark`（productId、color 版、内联 colorBody）画标，带 `data-logo`、`data-guide="tab"`、`aria-hidden`。尺寸走品牌局部变量 `--tcrn-brand-mark-size: 22px`，与 brand.css.ts 的侧栏档同值。测试逐个比对四个产品的 SVG 体与 `logos2/<id>.svg` 的 sha256。
8. **字重。** 首行整行取 600，依据 C-6 与板 `.lkr b` 的 12.5/600。Story 136 的 Use Case 写「TCRN 墨色 500」，与板不一致，取板，见问题 3。
9. **固定项的收缩。** 项为 `flex: 0 1 auto`，标签单行截断并带 title；板上是 `0 0 auto`，不收缩，这里为满足「不超出裁切祖先」而改。组不设固定高，中线靠顶带居中（SUB-119）。板宽 4 项不会触发收缩，几何与板相同。
10. **aria-controls 与选中。** `menuIdOf?: (id) => string` 给出下拉 id；省略时由 `useId` 派生唯一 id。选中的链接写 `aria-current="page"`；选中的带下拉项（当前页在其菜单里）写 `aria-current="true"`。选中态用对键 s：6% 墨洗、`--tcrn-pair-weight` 600。
11. **公开面。** `ShellBrandButton`、`ShellPins` 进 `index.tsx` 花名册，也进 `families.json` 的 shell 家族（块 `tcrn-shell-brand`、`tcrn-shell-pins`，contract:static 全量检查，无豁免）。`shellPinsMax`、`shellPinsOverflowIds` 随 `ShellPins.js` 导出。`shell-copy.ts` 只在包内使用，不从入口导出。

## 4. 与别包的接口约定（给下游包）

- **token（全批引用）：** C-2 表 20 个变量都在主题无关 `:root` 块，值与表一致。弃用名 `--tcrn-shell-topbar-height`（等于 `var(--tcrn-shell-strip-h)`）、`--tcrn-shell-sidebar-width`、`--tcrn-shell-sidebar-width-collapsed` 仍可解析。
- **`ShellBrandButton`（P1c 的 SUB-119 组顶带，SUB-117 做 Esc 回焦）：** `forwardRef<HTMLButtonElement>`；props 为 `productId`、`expanded`、`version`、`locale`，其余透传到 button（`aria-label` 可覆盖）。DOM 钩子：`data-tab`、`data-shell-brand="v1|v2"`、`data-shell-brand-auto`、`[data-lockup="lkr-line"] > svg[data-logo]`、`data-shell-toggle`。它不管菜单状态，`expanded` 与点击回调由外层控制。
- **`ShellPins`（SUB-117 的「已固定」分组、SUB-118 的下拉、SUB-120 的偏好）：** props 为 `items: readonly { id, label, href?, hasMenu? }[]`（已按偏好排序）、`selectedId`、`openId`、`onOpenChange(openId | null)`、`menuIdOf`、`locale`；空列表时不渲染。下拉应使用 `menuIdOf(id)` 给出的 id（`aria-controls` 指向它）。`shellPinsOverflowIds(items)` 返回第 7 项起的 id，供完整菜单标「已固定」。窄于 1024 时整组由 CSS 隐藏，不在 DOM 层移除。钩子：`data-pins`、`data-pin="<id>"`、`data-open-pin`。
- **`shell.css.ts`：** `shellCss01`（标按钮与触摸 44）、`shellCss02`（固定项）已按序登记在 `styles/index.ts` 级联表末尾。下一段请命名 `shellCss03…`，接在 `shellCss02` 之后登记。状态规则沿用 `:where()` 只切对、不写颜色；选中对键用 s，open 用 o。
- **`shell-copy.ts`：** `TcrnShellCopy` 现有 `openNavigationOf`、`closeNavigationOf`、`pinnedItems` 三个键，经 `tcrnShellCopyFor(locale)` 读取。新键须五语齐。

## 5. 接续点

无。
