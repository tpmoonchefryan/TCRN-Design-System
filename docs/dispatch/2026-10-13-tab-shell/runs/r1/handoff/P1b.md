# 交回 · P1b（INIT-016 R1，W2）：完整菜单、下拉与级联

包树分支 `claude/init016-r1-p1b`，起点 `f078b6f`（已含 P1a、P2）。日志目录记作 `<logs>` = 会话 scratch 的 `logs/r1-p1b/`。

## 1. Subtask 状态

| Subtask | 状态 | 提交 | 改动文件 |
| --- | --- | --- | --- |
| TCRN-DS-SUB-116 | 完成 | `f2d2921`，`867e43e`（JSX key 移离行首，见 §3 第 17 条） | `Navigation/ShellMenu.tsx`、`ShellMenu.test.tsx`、`shell-copy.ts`、`styles/shell.css.ts`（`shellCss03`）、`styles/index.ts`（登记，见问题 1）、`Navigation/index.ts`、`src/index.tsx`、`docs/contract/families.json` |
| TCRN-DS-SUB-117 | 完成 | `8391672` | `ShellMenu.tsx`、`ShellMenu.test.tsx`、`src/test/shell-menu.dom.spec.tsx`、`shell-copy.ts`、`shell.css.ts`（`shellCss03` 追加级联列、搜索结果、已固定分组断点、动效） |
| TCRN-DS-SUB-118 | 完成 | `35c43d6` | `Navigation/ShellDropdown.tsx`、`ShellDropdown.test.tsx`、`src/test/shell-dropdown.dom.spec.tsx`、`shell-copy.ts`、`shell.css.ts`（`shellCss04`）、`styles/index.ts`、`Navigation/index.ts`、`src/index.tsx`、`families.json`；另改 `ShellMenu.tsx` 一处（导出 `shellLayerTriggerOf`，见 §3 第 16 条） |

`src/index.test.tsx` 未改：它已按实际导出双向核对名册，再写一份名单只是第二份手抄副本。

## 2. 局部门（命令前缀 `corepack pnpm@10.12.1 -C <包树>`）

| Subtask | 命令 | 退出码 | 日志 |
| --- | --- | --- | --- |
| 116 | `--filter @tcrn/ui-react build` | 0 | `<logs>/116-ui-react-build.log` |
| 116 | `--filter @tcrn/ui-react test` | 0（194/194） | `<logs>/116-ui-react-test.log` |
| 116 | `run typecheck` | 0 | `<logs>/116-typecheck.log` |
| 116 | `exec node scripts/css-template-integrity-proof.mjs` | 0 | `<logs>/116-css-integrity.log` |
| 116 | `run component-modifiers:proof` | 0 | `<logs>/116-component-modifiers.log` |
| 116 | `run selection:proof` | 0 | `<logs>/116-selection.log` |
| 116 | `exec node scripts/token-extension-proof.mjs` | 0 | `<logs>/116-token-extension.log` |
| 116 | `run storybook:build`（contract:static 的前置输入） | 0 | `<logs>/116-storybook-build.log` |
| 116 | `run contract:static` | 0（C2、C5、C6、C7、C8、C11、C13 各 0 发现） | `<logs>/116-contract-static.log` |
| 116 | `run exports:check` | 0 | `<logs>/116-exports.log` |
| 117 | `--filter @tcrn/ui-react test` | 0（197/197） | `<logs>/117-ui-react-test.log` |
| 117 | `run test:dom` | 0（32/32，新增 7） | `<logs>/117-test-dom.log` |
| 117 | `run typecheck` | 0 | `<logs>/117-typecheck.log` |
| 118 | `--filter @tcrn/ui-react build` | 0 | `<logs>/118-ui-react-build.log` |
| 118 | `--filter @tcrn/ui-react test` | 0（202/202） | `<logs>/118-ui-react-test.log` |
| 118 | `run typecheck` | 0 | `<logs>/118-typecheck.log` |
| 118 | `exec node scripts/css-template-integrity-proof.mjs` | 0 | `<logs>/118-css-integrity.log` |
| 118 | `run component-modifiers:proof` | 0 | `<logs>/118-component-modifiers.log` |
| 118 | `run selection:proof` | 0 | `<logs>/118-selection.log` |
| 118 | `exec node scripts/token-extension-proof.mjs` | 0 | `<logs>/118-token-extension.log` |
| 118 | `run contract:static` | 0（各条 0 发现） | `<logs>/118-contract-static.log` |
| 118 | `run exports:check` | 0 | `<logs>/118-exports.log` |
| 118 | `run test:dom` | 0（37/37，新增 5） | `<logs>/118-test-dom.log` |
| 116 修正 | `--filter @tcrn/ui-react build`、`test` | 0、0（202/202） | `<logs>/116fix-*.log` |

本包自己引入并在包内改掉的红（不是包外红）：116 首跑测试三处正则写错（属性顺序、svg 有子元素）；116 首跑 contract:static 的 C2 一条（静态悬停显图钉的规则特异性 (0,4,0) 高于 `.tcrn-nav-pin`，改成 `:where(...) > .tcrn-nav-pin`）与故事层「静态 Storybook 未构建」四条（先跑 `storybook:build` 后清零）；117 首跑 test:dom 一条（测试环境无 `Element` 全局，改用 nodeType 判断）；118 首跑测试两处断言写宽（搜索框自身的 `aria-expanded`、图标的 `height` 属性）。私有输入扫描的 env-assignment 规则会把行首的 JSX `key={…}` 判红，`867e43e` 已把三处移到标签同行，八条扫描规则对本包改动文件逐条复核 0 命中。

## 3. 写明的选择与回显

1. **登记 `shellCss03`、`shellCss04`。** `styles/index.ts` 不在本包文件集（packages.md 该文件 W2 一栏为「—」），但 P1a 交回的接口要求新段命名 `shellCss03` 起并接在 `shellCss02` 后登记，`css-template-integrity-proof` 也要求每个 `shellCssNN` 都被登记；把规则塞进已登记的 `shellCss02` 会撞 P1a 测试对该段的字面断言（禁 `inset`、`divider` 等）。故只加了两行登记（import 名与 join 表），W2 无其它持有者、不会冲突。见问题 1，主线程可确认或改回。
2. **完整菜单定位。** `.tcrn-shell-menu` 为 `position: absolute`，`top: calc((strip-h − brand-h) / 2 + brand-h + menu-gap)`、`left: var(--tcrn-space-3)`，宽 `min(panel-w-expanded, 100vw − 2 × space-3)`；z 层用 Overlay 家族的 `--tcrn-z-popover`。包含块是最近的定位祖先：ProductShell（SUB-119）应让壳根成为包含块且顶带在其顶端。
3. **面板最大高。** `max-block-size: calc(100vh - var(--tcrn-shell-strip-h))`（板上 588 = 640 − 52）；列区 `overflow-y: auto`，底栏不随滚动。
4. **底栏 44 + 8。** 面板底内距 0，底栏 `block-size: calc(var(--tcrn-shell-pbar-h) + var(--tcrn-space-2))`、上边框 1px line、`align-items: center`，锁定块与当前位置在分隔线与面板底缘之间居中；G 段变异「面板底内距改 16」对应的是底栏高里的 `+ var(--tcrn-space-2)` 一项。
5. **下拉定位。** `ShellDropdown` 不走 portal，留在消费方放置的位置（便于壳层门在 `[data-shell]` 内找到），根为 `position: fixed`，打开时及 resize、scroll（捕获）时读固定项的 left 与 bottom 写成 left、top，接续 6 是 CSS 的 `margin-top: var(--tcrn-shell-menu-gap)`；未做视口夹取（固定项在顶带左段，240 宽不会出界）。Overlay 家族没有可供 React 浮层调用的定位函数，见问题 2。
6. **级联等高。** 根是一行网格：首列（面板或下拉面板），`grid-auto-columns: var(--tcrn-shell-drop-w)`、`column-gap: var(--tcrn-shell-cascade-gap)`、`align-items: stretch`；级联列 `contain: size`，自身内容不撑行高，被拉伸到首列高，内容超出时 `overflow-y: auto`。SUB-135 的「列二 height:auto」变异在这一写法下不改变读数，变异应改 `contain: size` 或根上的 `align-items: stretch`。
7. **完整菜单里的级联。** 板上只画了下拉态的级联；完整菜单里带子项的行同样按点击在面板右侧出级联列（同一件），见问题 5。
8. **搜索。** 完整菜单与下拉都用 `ProductShellSearch`（其输入框即 SearchInput，高度经 `--tcrn-search-input-block-size` 改为 srch-h 40 与 drop-srch-h 28）。提供者类型 `ShellMenuSearchProvider(query, groups) → ProductShellSearchResult[]`；默认 `shellMenuSearch`：名称或其上级项名称含查询词、且有 href 的条目，meta 为路径。输入非空时列区让位给结果列表（结果列表改为面板内的文档流）。下拉把自身子树作为唯一分组传给提供者，只搜该子树。
9. **下拉搜索不显示 ⌘K 提示**（`shortcut={false}`）。板上画了，但 ⌘K 打开的是完整菜单而非下拉搜索；见问题 6。
10. **焦点。** 两种浮层打开时都把焦点放进搜索框；Esc 与选中项关闭后焦点回触发键；点外部关闭时不移动焦点。
11. **带子项的行**是 `<a role="button" aria-expanded aria-controls>`（NavItem 只渲染链接），点击或 Space 开合下一级，自身 href 不用；`aria-expanded="true"` 的行取 6% 墨洗 + 600（板「项 · selected / 已点开」）。
12. **⌘K / Ctrl+K** 由 `ShellMenu` 挂在 document 上，一个壳一个，卸载即移除；菜单已开时只把焦点放回搜索框。
13. **已固定分组**始终渲染在 DOM 里，`@media (min-width: 1024px)` 隐藏，与 ShellPins 窄屏整组由 CSS 隐藏的做法对称；成员按 `pinnedItems` 顺序，id 能在模型里找到时用模型条目（含子项与级联），钉的是分组时以其项为下一级。
14. **动效。** 面板与级联列用 opacity 淡入（`--tcrn-motion-duration-fill`，不含 transform，进行中读数即终态几何）；`prefers-reduced-motion: reduce` 下 `animation: none`、行 `transition: none`（时长归零）。
15. **锁定块侧栏尺度。** `ShellBrandLockup productId role="img" data-lockup="lkr"`，SVG 与文案未改；侧栏尺度变量（标 22、12.5/16、600、10.5/14、列间 10）抄进 `.tcrn-shell-menu__lockup`，因为品牌的侧栏档只在 `.tcrn-product-shell` 内生效；内距 6 4 取板上 `.lkr`，右缘 = 菜单右缘 − 16。见问题 7。
16. **`ShellMenu.tsx` 在 SUB-118 提交里改了一处**：把内部的触发键查找导出为 `shellLayerTriggerOf`，供下拉复用。
17. **扫描红线**：行首 `key={…}` 会被私有输入扫描的 env-assignment 规则判红；本包 JSX 一律把 key 写在标签同一行。
18. 几何读数只在规则与 token 层核对（测试里按 token 推出 144、290、342、88、228 与板 spec-geom 一致）；真件渲染读数留给壳层门（SUB-135、SUB-137）。

## 4. 与别包的接口约定（给下游包）

- **导出（C-7）：** 组件 `ShellMenu`、`ShellDropdown`（已进名册与 shell 家族，blocks `tcrn-shell-menu`、`tcrn-shell-dropdown`）；类型 `ShellMenuGroup { id, label, iconName?, items }`、`ShellMenuItem { id, label, href?, iconName?, children? }`（最多四级，`shellMenuMaxDepth = 4`）、`ShellMenuCrumb`、`ShellMenuOpenChangeReason`、`ShellLayerCloseReason`（`escape`、`outside-pointer`、`selection`）、`ShellMenuSearchProvider`、`ShellMenuRowContext`；函数 `useShellTransientLayer({ open, layerRef, triggerRef?, controlsId?, onClose })`、`useShellMenuCascade(rootRef, firstLevel)`、`shellMenuRow`、`shellMenuCascades`、`shellMenuPinProps`、`shellMenuSearch(groups, query)`、`shellLayerTriggerOf(doc, controlsId)`。
- **ProductShell（SUB-119）接线：** `<ShellBrandButton ref={brandRef} expanded={menuOpen} aria-controls={menuId} onClick={切换} />`；`<ShellMenu id={menuId} open={menuOpen} onOpenChange={(open, reason) => …} triggerRef={brandRef} productId groups selectedId currentPath pinnedIds onPinnedChange pinnedItems searchProvider? />`；`<ShellPins … openId onOpenChange menuIdOf />` 加每个带菜单的固定项一个 `<ShellDropdown id={menuIdOf(pinId)} source={分组或项} level? open={openId === pinId} onOpenChange={(open) => !open && setOpenId(null)} … />`（不传 triggerRef 时按 aria-controls 找固定项）。同一时刻只开一层由壳负责：⌘K 以 `onOpenChange(true, "shortcut")` 请求打开完整菜单时，壳应关掉已开的下拉。壳根需成为 `.tcrn-shell-menu` 的包含块。
- **SUB-126（Sheet）：** 复用 `useShellTransientLayer` 与行、级联函数；`shellCss03` 的行、组、结果规则都挂在 `.tcrn-shell-menu` 之下，Sheet 根带上该类即可继承。
- **SUB-121（story）：** `previewStates={{ [行或分组 id]: "hover" | "focus" }}` 写 `data-tcrn-preview-state`，CSS 以 `~=` 匹配；分组悬停只显图钉、不换底。
- **壳层门（P3、SUB-135、SUB-137）：** 菜单根 `[data-shell-menu]`、下拉根 `[data-shell-dropdown]`；面板 `[data-panel="expanded"]` / `[data-panel="drop"]`（role="dialog"、aria-modal="false"，s3 阴影在这一元素上）；级联列 `[data-drop-col="2|3"]`（完整菜单与下拉都用，role="group"、aria-label 为上级名，面板以 `aria-owns` 收编）；搜索 `[data-shell-search]`；行 `[data-shell-row]`（在 NavItem 的链接上，另带 `data-shell-level`）；底栏 `[data-shell-pbar]`（分隔线是它的上边框），其中当前位置是 `nav`，锁定块 `[data-lockup="lkr"]`；选中行 `aria-current="page"`。`[data-shell-group]` 落在 NavGroup 根（整列）上，见问题 3。
- **P8（SUB-124、SUB-125，Navigation.tsx）：** 菜单行的文字在 `.tcrn-nav-item__label` 内的 `.tcrn-shell-menu__text`；NavItem 若补 `data-text="prail"` / `data-guide="prail"`，请落在标签与图标上，本包未在子元素上另写，免得重复。
- **shell-copy.ts：** 新键 `navigation`、`searchNavigation`、`currentPosition`、`pinnedGroup`、`searchWithin(name)`，五语齐。
- **shell.css.ts：** `shellCss03`（完整菜单、级联列、搜索结果）、`shellCss04`（下拉）已接在 `shellCss02` 后登记；下一段请命名 `shellCss05`。

## 5. 保留项与清理

- `storybook:build` 产出的 `apps/storybook/storybook-static`、`apps/storybook/dist`、两个 examples 的 `dist` 与三份 tsbuildinfo（共 33 MB，被忽略的构建物，本包创建、已无用途）移进会话 scratch 的 `trash/r1-p1b/`；移动不释放磁盘；移动前 `df -k` 读该卷可用 58681308 KiB（约 56.0 GiB）。
- 保留 `packages/ui-react/dist`（与 HEAD 一致的构建，便于主线程在本树复核）；`ui-tokens`、`ui-copy-state` 的 dist 为主线程准备，未动。

## 6. 接续点

无。三张 Subtask 均完成，包树干净。
