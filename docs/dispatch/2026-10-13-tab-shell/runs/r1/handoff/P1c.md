# 交回 · P1c（INIT-016 R1，W3）：ProductShell 顶带态与固定项偏好

包树分支 `claude/init016-r1-p1c`，起点 `0495e92`（已含 P1a、P2、P3、P4、P1b）。日志目录记作 `<logs>` = 会话 scratch 的 `logs/r1-p1c/`。

## 1. Subtask 状态

| Subtask | 状态 | 提交 | 改动文件 |
| --- | --- | --- | --- |
| TCRN-DS-SUB-119 | 完成 | `caf6cfa` | `packages/ui-react/src/components/Navigation/Navigation.tsx`、`Navigation.test.tsx`、`shell-copy.ts`；`packages/ui-react/src/styles/base.css.ts`、`shell.css.ts`、`index.ts`（只改 `shellCss05` 的两处登记行）；`apps/storybook/src/contract-stories/story-content.tsx`、`visual-instances/aos-frontend-shell-slice.tsx`、`visual-instances/aos-owner-quality-product-shell.tsx`、`gplus/samples/composition-one.tsx` |
| TCRN-DS-SUB-120 | 完成 | `f85de9f`（其后合入集成分支 `9872a16`） | `Navigation.tsx`、`Navigation.test.tsx`、`packages/ui-react/src/test/product-shell-preferences.dom.spec.tsx`、`docs/migration-4.0.md`（追加 M20、M21） |

判据对照：140-GWT1（顶带 52 无底无线；纸 top 52、左右下 12、圆角 14、s1，几何引 `--tcrn-shell-strip-h`、`--tcrn-space-3`、`--tcrn-radius-paper`、`--tcrn-shadow-s1`）与 GWT2（壳内无侧栏、无收起钮）由 `Navigation.test.tsx` 的 STORY-140 GWT1、GWT2 用例断言；GWT3（钉第 7 项偏好保存、顶带只显示前 6，拖排顺序写回）由 GWT3 用例在控制器加真件上断言；GWT4（头像菜单含切换产品，完整菜单与锁定块无产品清单）由 GWT4 用例断言；GWT5（旧 prop 类型层拒绝）由 GWT5 用例的 `@ts-expect-error` 断言（再编译通过即构建失败），迁移条目为 M20、M21。标按钮左 = 纸左 = 完整菜单左 = 12、簇右 = 纸右、铃铛 32 / 头像 28 / 中线 26 由 CSS 结构给出（顶带两端内距 space-3、簇 `margin-inline-start: auto`、项按 flex 居中），真件量读留给壳层门（SUB-137）。

## 2. 局部门（命令前缀 `corepack pnpm@10.12.1 -C <包树>`）

| 门 | Subtask | 退出码 | 读数 | 日志 |
| --- | --- | --- | --- | --- |
| `--filter @tcrn/ui-react build` | 119 | 0 | — | `<logs>/t5-build.log` |
| `--filter @tcrn/ui-react test` | 119 | 1 | 200 条，199 过，1 红为既有红（P1a 的 ShellBrandButton 夜间 TMS 后缀对比度，见 cross-notes 第 1 节） | `<logs>/t5-test.log` |
| `run test:dom` | 119 | 0 | 37 / 37 | `<logs>/t5-dom.log` |
| `run typecheck` | 119 | 0 | — | `<logs>/t3-typecheck.log` |
| `exec node scripts/css-template-integrity-proof.mjs` | 119 | 0 | findings 0 | `<logs>/g119-css-template.log` |
| `run component-modifiers:proof` | 119 | 0 | missing 0 | `<logs>/g119-modifiers.log` |
| `run selection:proof` | 119 | 0 | findings 0 | `<logs>/g119-selection.log` |
| `exec node scripts/token-extension-proof.mjs` | 119 | 0 | — | `<logs>/g119-token-extension.log` |
| `run shell:fidelity` | 119 | 0 | no drift | `<logs>/g119-shell-fidelity.log` |
| `run build` | 119 | 0 | 含 storybook 构建 | `<logs>/g119-build.log` |
| `run contract:static` | 119 | 0 | — | `<logs>/g119-contract-static.log` |
| `run typecheck` | 120 | 0 | 含 GWT5 的 16 处 `@ts-expect-error` | `<logs>/u1-typecheck.log` |
| `--filter @tcrn/ui-react build` | 120 | 0 | — | `<logs>/u2-build.log` |
| `--filter @tcrn/ui-react test` | 120 | 1 | 203 条，202 过，1 红同上既有红 | `<logs>/u2-test.log` |
| `run test:dom` | 120 | 0 | 37 / 37 | `<logs>/u2-dom.log` |

起点基线（改动前）：ui-react test 202 条 201 过 1 既有红，test:dom 37 / 37，typecheck 0（`<logs>/b0-*.log`）。没有门写 `docs/verification/**`，树上无此类改动。

合入 P5 后（主线程通知，本包为后合入者）：`git merge --no-ff claude/init016-tab-shell`，提交 `9872a16`；唯一冲突在 `packages/ui-react/src/styles/index.ts` 的两处登记，保留双方，顺序为 `shellCss04`、`shellCss05`、`shellIntroCss01`（import 行同序）。之后重跑：`exec node scripts/css-template-integrity-proof.mjs` 0（findings 0，`<logs>/m2-css-template.log`）、`--filter @tcrn/ui-react build` 0（`<logs>/m2-build.log`）、`run typecheck` 0（`<logs>/m2-typecheck.log`）。ShellIntro 读的壳钩子 `[data-shell-brand] svg[data-logo]`、`[data-shell-brand] [data-lockup]`、`[data-shell-toggle]`、`[data-pins]`、`[data-cluster]`、`[data-paper]` 在 ProductShell 上都有；壳不挂载 ShellIntro，由消费方挂。

## 3. 写明的选择与回显

1. **菜单模型取「扩 children」，不取别名。** `ProductShellNavItem extends ShellMenuItem`（`children?: readonly ProductShellNavItem[]`，`href` 在有下级时可省），`ProductShellNavGroup extends ShellMenuGroup`；保留 `labelKey`、`selected` 与分组的 `description`、`sectionLabel` 等字典元数据（壳不渲染）。`disabled`、`disabledReason`、`depth` 删除：菜单行不支持禁用，层级由 children 表达。选中项取 `selected: true` 的条目，壳据此算选中行、选中固定项与当前位置（分组 › … › 页）；无选中时当前位置为 `currentRouteLabel`。
2. **`brandProductId` 改为必填的产品标键**（`TcrnProductMarkId`），对应 Brand 契约「产品只传产品键」。AOS 无 logos2 标，三处 AOS 调用点临时改传 `design-system`（问题 1）。
3. **随侧栏一起删的 prop 比 Story 点名的多**：除 collapsed 一族与移动抽屉外，还删了侧栏品牌链接与团队锁定块的 `brandHref`、`brandSuffix`、`brandCaption`、`brandMarkSrc`、`brandMarkAlt`，侧栏导航的 `navId`、`navLabel`，顶栏的 `currentLocationLabel(Key)`、`search` 与三个搜索回调；壳的搜索改为完整菜单的 `searchPlaceholder`、`searchProvider`、`onSearchQueryChange`。全部列在 M20。
4. `headerActions` 保留，放进右上簇、在铃铛与头像之前；铃铛只在给了 `notifications` 时出现（没有通知来源的铃铛是空操作），头像始终在（主题与语言在它的菜单里）；无 `account` 时头像显示名册 `users` 图标（问题 8）。
5. 三层浮层（完整菜单、下拉、头像菜单）各自「受控或自持」：给了 `menuOpen` / `openPinId` / `accountMenuOpen` 就按受控，否则壳自持；打开一层即关另两层，被关的完整菜单报 `reason = "trigger"`。头像菜单复用 `useShellTransientLayer`（Esc、点外部、选中链接即收，Esc 回焦头像）。
6. 版式：壳根是两行网格、一屏高、`overflow: clip`，并作为完整菜单的定位包含块；页面在纸里滚（问题 7）。壳根的 `data-shell` 允许消费方给值（构图一样板传了自己的键）。
7. 控制器：`productShellControlProps` 改为新壳的 prop（主题、语言、`searchProvider`、`pinnedIds`、`onPinnedChange` 等）；`searchRecords` 存在时生成 `searchProvider`，否则菜单搜自己的模型；独立 `ProductShellSearch` 用的 `productShellSearchProps` 等保留。
8. 固定项读取顺序：请求里的服务端偏好 → 本产品的本地回退（`localStorage`，键 `pinsStorageKey` 或 `tcrn-shell-pins:<productId>`）→ `initialPins` → 空。只写本地回退与 `onPinsChange`，不写 cookie、不新增 cookie 键；不截断，顶带由 ShellPins 只显示前 6。`readPreferenceCookieValues` 只读 theme、locale，注释同步改写（problems 第 19 条）。
9. CSS 落点：顶带态全部在 `shell.css.ts` 新段 `shellCss05`（壳根、顶带、簇、铃铛、头像、头像菜单、纸）；`base.css.ts` 只做删除：侧栏、收起、壳顶栏、工具行、当前位置与 O-1 桌面块，移动块里的侧栏抽屉与顶栏规则。原 `.tcrn-product-shell` 根规则移入 `shellCss05`；焦点环规则从 `baseCss08` 移到 `baseCss09`（该段原本只有侧栏头规则，删后不留空段）。移动块保留独立 `TopBar`、`.tcrn-shell-locale-menu` 与仍导出的 `MobileNavToggle` 的规则（问题 11）。
10. 状态规则沿用 `:where()` 只切对、不写颜色；铃铛未读点的内缩 = (control-height-md − icon-size-lg) / 2 + 1px = 7，与板一致。
11. 调用点只做让类型与构建通过的改动：四个 story 文件删去退役 prop、改标键、`search` 换成 `searchPlaceholder`；构图一样板删去已无对象的 `railEdits`（问题 5）。story 文案未动（SUB-121）。

## 4. 与别包的接口约定（给下游包）

- **ProductShell props：** 必填 `productName`、`moduleName`、`brandProductId`（标键）、`currentRouteLabel`、`navGroups`、`locales`、`currentLocale`、`children`；可选 `currentTheme`、`localeMenuOpen`、`headerActions`、`account { name, initials? }`、`products { id, label, href, current? }[]`、`notifications { unread?, onOpen? }`、`pinnedIds`、`onPinnedChange(id, pinned)`、`menuOpen` / `onMenuOpenChange(open, reason)`、`openPinId` / `onOpenPinChange(id | null)`、`accountMenuOpen` / `onAccountMenuOpenChange(open)`、`searchPlaceholder`、`searchProvider`、`onSearchQueryChange`、`onThemeChange`、`onLocaleMenuOpenChange`、`onLocaleChange`、`contentId`、`contentRole`、`contentLabel`、`skipLinkLabel`。新导出类型 `ProductShellMenuChangeReason`、`ProductShellAccount`、`ProductShellProduct`、`ProductShellNotifications`。
- **DOM 钩子（C-5 之外的补充）：** 壳根 `.tcrn-product-shell[data-shell][data-state="closed|expanded|drop"]`（暂无 `sheet`，问题 9）；顶带 `header.tcrn-shell-strip[data-shell-strip]`；簇 `[data-cluster]` 内依次为 `[data-product-shell-region="header-actions"]`、`button[data-shell-bell]`（未读点 `.tcrn-shell-bell__dot`）、`[data-shell-account] > button[data-shell-avatar]`；头像菜单 `[data-panel="account"]`（role="dialog"、aria-modal="false"），内含 `nav[data-shell-products]` 的 NavItem 行 `[data-shell-product="<id>"]`（当前产品 aria-current="page"）与 `[data-shell-preferences]`（ShellThemeToggle、ShellLocaleMenu）；纸 `[data-paper] > .tcrn-product-shell__main#<contentId>`。完整菜单 id 为 `<useId>-menu`，下拉 id 为 `<useId>-drop-<pinId>`（固定项的 `aria-controls` 指向它）。
- **控制器：** `useProductShellController` 新增配置 `productId`、`initialPins`、`pinsStorageKey`、`onPinsChange`，返回 `pins`、`setPins`、`setPinned`、`movePin`；`requestPreferences` 为 `{ theme, locale, pins }`；collapsed 与移动抽屉相关的配置与返回都已删除（见 M21）。
- **shell-copy.ts 新键（五语齐）：** `account`、`accountMenuOf(name)`、`switchProduct`、`themeAndLanguage`、`notificationsOf(unread)`。
- **shell.css.ts：** `shellCss05` 已接在 `shellCss04` 后登记；本文件再加段请命名 `shellCss06`。
- **styles/index.ts（W3 与 P5 共享）：** 本包只改了 `./shell.css.js` 的 import 行与数组末尾 `shellCss04` 之后的一行。P5 后合入时按 cross-notes 第 3 节保留双方登记（壳层段在前、登入动画段在后）。

## 5. 保留项与清理

- 保留：`<logs>` 下全部门日志（本交回物引用的证据）；包树里 `--filter … build` 与 `run build` 产出的各包 `dist`（git 忽略，下游门要读）。
- 已清理：本包在会话 scratch `work/p1c/` 写的拼接脚本与测试片段，用途已完成，移进 scratch 的 `trash/`。

## 6. 接续点

无：两张 Subtask 都已完成并提交，包树干净。问题 11 条在 `runs/r1/problems/P1c.md`。
