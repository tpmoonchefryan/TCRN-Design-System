# R1 跨包通告（主线程维护）

派工提示指到本文件时全文读；它只指向已合入包的交回物里给下游的节，按指明的行段读，不整读交回物。

## 1. 已知红（批末一次处置，包内不修）

- `--filter @tcrn/ui-react test` 有 1 条既有红：P1a 的 `packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx` 断言夜间 TMS 后缀对比度 ≥ 4.5，P4 把后缀改回两主题同色后读数 3.07（`runs/r1/problems/P4.md`）。在你的包树里看到它时记一句「既有红」即可，不修、不改那份测试。
- `--filter @tcrn/ui-react test` 在 `dist` 未构建时会以 0 条测试退出 0：先 `--filter @tcrn/ui-react build` 再跑 test，否则读数无效。

## 2. 已合入包给下游的接口（只读指明的行段）

| 包 | 交回物与行段 | 要点 |
| --- | --- | --- |
| P1a | `runs/r1/handoff/P1a.md` 第 64–71 行（第 4 节） | 壳 token 20 个在主题无关 `:root` 块；`ShellBrandButton`（forwardRef，`productId`/`expanded`/`version`/`locale`，钩子 `data-shell-brand="v1|v2"` 等）；`ShellPins`（`items`/`selectedId`/`openId`/`onOpenChange`/`menuIdOf`/`locale`，`shellPinsOverflowIds`）；`shell.css.ts` 段按 `shellCss03…` 接在 `shellCss02` 后登记；`shell-copy.ts` 新键五语齐 |
| P2 | `runs/r1/handoff/P2.md` 第 52–57 行（第 5 节） | 可钉 NavItem 渲染 `.tcrn-nav-item-row`（链接与图钉钮并排，传给 NavItem 的 `data-*` 落在链接上，量行时以行包裹为准）；`pinLabel` 只是项名；NavGroup 新增 `locale`；选中即关的菜单要忽略 `[data-pin-button]` 上的点击 |
| P3 | `runs/r1/handoff/P3.md` 第 41–52 行（第 4、5 节） | 壳层读数库 `scripts/lib/shell-measure.mjs` 与门 `scripts/shell-measure-proof.mjs`；做壳件的包除 C-5 钩子外要提供：行内文字 `data-text="prail"`、行内图标 `data-guide="prail"`、选中行 `aria-current="page"`、静态悬停 `data-tcrn-preview-state~="hover"`、底栏分隔线是 `[data-shell-pbar]` 的上边框、底栏锁定块 `[data-lockup]`、底栏面包屑是底栏里的 `nav`、标按钮第一版 `data-shell-brand="v1"`、标 `svg[data-logo]` 用彩色原样 |
| P4 | `runs/r1/handoff/P4.md` 第 39–46 行（第 4 节） | `--tcrn-brand-suffix-tms` 只在主题无关块、没有 dark 值，读夜间值用 `createResolvedTokenMap("dark")`；`WORDMARK_EXEMPTIONS` 4 条，夜间 TMS 两条带 `pending`（D7） |
| P1b | `runs/r1/handoff/P1b.md` 第 67–77 行（第 4 节） | 新件 `ShellMenu`、`ShellDropdown` 与 C-7 菜单模型类型、可复用的 `useShellTransientLayer`（Esc、点外部、选中即收，Esc 与选中后焦点回触发键）；ProductShell 接线写法（SUB-119 照抄）；壳根要成为 `.tcrn-shell-menu` 的定位包含块；下拉不传 ref 时按 `aria-controls` 找固定项；门用的 DOM 钩子；`shell-copy.ts` 新键；`shell.css.ts` 下一段命名 `shellCss05` |

## 3. W3 共享文件（P1c 与 P5 同时在跑）

- `packages/ui-react/src/styles/index.ts`：P5 按包表持有（登记 `shell-intro.css.ts`）；P1c 只为登记自己新加的 `shellCss05…` 改两处——`./shell.css.js` 那行 import 与数组末尾 `shellCss04` 之后——此文件别处都不动。两包谁后合入，谁在主线程通知后把集成分支合进自己的包树并解这两处登记行的冲突（保留双方的登记，壳层段在前、登入动画段在后），重跑 `css-template-integrity` 后提交。
