# TCRN-DS-INIT-016 · R3 分包

34 张 Subtask 分 11 个包、5 个波次（判断 §5 的 11 包 5 波，组成、档位与波次不变；前置列的显式化与两处落点见「偏离判断 §5 的地方」）。同一波的包并行，后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-17），每个包都必须遵守。

节行号：规则与校验 L7；共享登记处归属 L17；包表 L76；偏离判断 L92；共享文件的先后 L96；期望对齐的接收（C-15） L136；各包局部门 L147；M1 L149；M2 L160；M3 L171；M4 L192；M5 L217；M6 L229；M7 L242；M8 L257；M9 L269；M10 L282；M11 L291。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包不超过 3；本表与包表由脚本从 `subtasks.json` 的同一份数据生成并校验通过：键号 TCRN-DS-SUB-178 至 211 连续，parentId 与链上 Story 导出一致，依赖都在更早的波或同包靠前、且跨包依赖都在前置包里，每包预计不超过 150，summary 都不超过 160 字节，R3-1 至 R3-30 每条至少被一张 Subtask 承接，R3-30（SUB-211）是最后一个包的最后一张。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回「期望过期」或问题文件。
- 档位：经济为 `einzbern-economy`（claude-opus-5-5 low），主力为 `einzbern-main`（claude-opus-5-5 max）。判断 §2：R3 共 25 条主力、5 条经济（R3-13、24、25、26、29）；承接经济项的包（M3、M5、M6、M9、M10）同包都有主力项，整包起主力（判断 §5），11 个包全部主力。标「R2-x 再返工」的 22 条本轮再被退回就交 Owner（C-16）。
- 前置包列只写包号并逐个列出（C-17，R2 主线程问题 M5）；改动让别的门期望过期的包按 C-15 同包对齐，或交给下表「期望对齐的接收」里的下一个持有者（R2 主线程问题 M2）。
- 规模按模型响应数估；每包目标不超过 150，逼近 180 时按 C-4 提交干净状态、写接续点交回。合计 1,270 响应（判断 §5 表逐行相加）。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告不提交（M11 的 SUB-211 除外，C-9）。verify 只在批末跑一次，不进任何包；R3-30（SUB-211）是最后一个包的最后一张。
- 合入：每波结束主线程按依赖顺序把本波各包合入集成分支。交回物统一为 `runs/r3/handoff/<包>.md`，见红只记写 `runs/r3/problems/<包>.md`；文件名各不相同，不构成文件集相交。

## 共享登记处归属

本表列每波谁可以改共享登记处；空格（—）表示该波没有包可改，需要改的写进交回说明。

| 登记处 | W1 | W2 | W3 | W4 | W5 |
| --- | --- | --- | --- | --- | --- |
| 根 `package.json`、各包 `package.json`、`pnpm-lock.yaml` | — | — | — | — | — |
| `components/Navigation/index.ts`、`src/index.tsx` 与 `index.test.tsx`（导出面；本轮只给已导出件加 prop） | — | — | — | — | — |
| `docs/contract/{exemptions,roles,families}.json`、`docs/contract/clauses.md` | M2 | — | — | — | — |
| `docs/contract/README.md` | — | — | — | M10 | — |
| `styles/index.ts`（级联表与段登记） | M3 | — | — | — | — |
| `styles/shell.css.ts` | M3 | M4 | — | — | — |
| `styles/base.css.ts` | M3 | M4 | — | — | — |
| `styles/brand.css.ts` | — | M4 | — | — | — |
| `styles/shell-sheet.css.ts` | M3（只在 Sheet 行按板需改时） | — | — | — | — |
| `styles/typography.css.ts` | M3 | — | — | — | — |
| `Navigation.tsx` 与 `Navigation.test.tsx` | M3 | M4 | — | — | — |
| `ShellMenu.tsx` 与 `ShellMenu.test.tsx` | M3（只改测试） | M4 | — | — | — |
| `ShellDropdown.tsx` 与测试、`ShellPins.tsx` 与测试、`ShellBrandButton.tsx` 与测试 | — | M4 | — | — | — |
| `components/Navigation/shell-copy.ts` | — | M4 | — | — | — |
| `DomainDisplay.tsx` 与 `DomainDisplay.test.tsx` | — | M4 | — | — | — |
| `src/test/shell-dropdown.dom.spec.tsx` | M3 | — | — | — | — |
| `src/test/shell-menu.dom.spec.tsx` | — | M4（按需） | — | — | — |
| 契约 `tokens.json`、五个生成物头、ui-tokens `index.ts` / `index.test.ts` / `tokens.css` | — | M4（只在 SUB-178 新设 token 时） | — | — | — |
| `apps/storybook/src/storybook.css` | — | M4（token 块，随 tokens-sync） | M8 | — | — |
| ui-react `README.md` | — | M4 | — | — | — |
| ui-tokens `README.md` | — | — | — | M10 | — |
| 页模板 `page-template.tsx` | — | — | M7 | — | — |
| 页面脚本 `client-scripts.ts` | — | M5 | M7 | — | — |
| 挂载入口 `shell-hydrate.tsx` | — | M5 | M7 | — | — |
| story 内容 `story-content.tsx` | — | — | — | M9 | — |
| 样板 `prototypes/storybook-shell-demos.tsx` | — | M4 | — | — | — |
| 矩阵 `gplus/matrix-stories.tsx` | — | M4 | — | M9 | — |
| 样板 `gplus/samples/composition-one.tsx`、`gplus/matrix-renderer.tsx` | — | M6 | — | — | — |
| 视觉实例 `visual-instances/aos-*.tsx`（两份） | — | M6 | — | M9 | — |
| story 登记 `governance.ts`、`groups/components.ts`、`components.stories.tsx` | — | — | — | — | — |
| 台账 `scripts/lib/story-budget.mjs` | — | M5 | — | M9 | — |
| `apps/storybook/src/smoke.test.ts` | — | M5 | — | M9 | — |
| 五语字典 `storybook-content-text.ts` | — | M6（只在「工作项」确实丢在字典时） | — | M9 | — |
| 标题字典 `storybook-locale-text.ts` | — | — | — | M9（只在确需时） | — |
| 台账 `scripts/lib/locale-invariant-ledger.mjs` | — | M5 | — | M9（只在确需时） | — |
| AI 契约、oracle、content rows（`ai-consumption-contract.ts`、`foundation-visual-standards.ts`、`content/*-rows.ts`） | — | — | — | M9 | — |
| `CHANGELOG.md`、`docs/migration-4.0.md` | — | — | — | M10 | — |
| `scripts/storybook-smoke.mjs` | M3 | — | M7 | M9 | — |
| `scripts/internal-alpha-browser-proof.mjs` | — | M5 | M7 | — | — |
| `scripts/shell-parity-proof.mjs`、`scripts/geometry-proof.mjs` | M2 | — | — | — | — |
| `scripts/contract-static-proof.mjs`、`tests/contract-static-proof.test.mjs` | M2 | — | — | — | — |
| `scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`、第一批夹具 `all.green.html` 与上级 `manifest.json` | M3 | — | — | — | — |
| 壳层门 `scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/shell-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/shell/**` | M1 | — | M7（只改 proof、测试与 manifest） | — | — |
| 量测工具 `docs/design/gplus-2026-10/measure-shell.js` | M1（只镜像门库读法） | — | — | — | — |
| `scripts/token-extension-proof.mjs` | M3 | — | — | — | — |
| `scripts/brand-asset-source-proof.mjs` | — | M4 | — | — | — |
| `scripts/shell-fidelity-proof.mjs` | — | — | M8 | — | — |
| `docs/design/gplus-2026-10/doc-class-map.json` | — | — | M8（只在 doc-shell:proof 要求时） | — | — |
| 设计文档 `docs/design/gplus-2026-10/{README,storybook-map}.md` | — | — | — | M10 | — |
| `scripts/css-template-integrity-proof.mjs`、`scripts/package-contract-manifest.mjs`、`scripts/selection-grammar-proof.mjs` | — | — | — | — | — |
| 成品板与草案板、`heights.json`、`visual-standard/canvas.json` | — | — | — | — | — |
| 回执与门报告 `docs/verification/**`、`owner-acceptance.md` | — | — | — | — | M11（SUB-211） |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| M1（W1） | 壳层门读法：pinJitter 只读渲染出的元素、contrast 按叠放取底、面包屑逐段读（主力） | SUB-206 → SUB-207 → SUB-196 | `scripts/lib/shell-measure.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/package-menu.html`<br>`tests/fixtures/geometry-measure/shell/package-pages.html`<br>`tests/fixtures/geometry-measure/shell/mutations.json`<br>`tests/fixtures/geometry-measure/shell/manifest.json`<br>`docs/design/gplus-2026-10/measure-shell.js` | — | 110 | `runs/r3/handoff/M1.md` |
| M2（W1） | 其他门与契约：searchOverlay、parity 行盒、contract:static 不变式与 C11 归属、顶带登记 C8（主力） | SUB-181 → SUB-197 → SUB-189 → SUB-190 → SUB-191 | `scripts/geometry-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`tests/contract-static-proof.test.mjs`<br>`scripts/contract-static-proof.mjs`<br>`docs/contract/families.json`<br>`docs/contract/exemptions.json`<br>`docs/contract/roles.json`<br>`docs/contract/clauses.md` | — | 130 | `runs/r3/handoff/M2.md` |
| M3（W1） | 包件样式与测试：菜单图标盒、纸内焦点、导航项截断、死变量、下拉 DOM 用例（主力） | SUB-188 → SUB-182 → SUB-192 → SUB-183 → SUB-180 | `packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/styles/shell-sheet.css.ts`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`scripts/geometry-measure-proof.mjs`<br>`tests/geometry-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/all.green.html`<br>`tests/fixtures/geometry-measure/manifest.json`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`scripts/storybook-smoke.mjs`<br>`scripts/token-extension-proof.mjs`<br>`packages/ui-react/src/styles/typography.css.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx` | — | 120 | `runs/r3/handoff/M3.md` |
| M4（W2） | 包件组件与 prop 面：地标名、TocRail 层级、⌘K 开关、data-logo、几何字面值改 token（主力） | SUB-184 → SUB-193 → SUB-185 → SUB-194 → SUB-178 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`<br>`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`<br>`packages/ui-react/README.md`<br>`scripts/brand-asset-source-proof.mjs`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellPins.tsx`<br>`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css` | M2、M3 | 145 | `runs/r3/handoff/M4.md` |
| M5（W2） | 文档站门与品牌字标：browser-proof 期望与时机、字标三张名单、拖排与产品切换样板（主力） | SUB-198 → SUB-195 → SUB-186 | `scripts/internal-alpha-browser-proof.mjs`<br>`apps/storybook/src/build/shell-hydrate.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`apps/storybook/src/smoke.test.ts`<br>`scripts/lib/story-budget.mjs` | — | 125 | `runs/r3/handoff/M5.md` |
| M6（W2） | 样板与 AOS 视觉实例：画框同高、AOS 标题裁切、搜索结果变体与「工作项」（主力） | SUB-205 → SUB-199 → SUB-200 | `apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`<br>`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts` | — | 100 | `runs/r3/handoff/M6.md` |
| M7（W3） | 文档壳水合真件与门侧：⌘K 挂载与 focusLoop、TocRail 传层级 2、AOS 裁切门侧（主力） | SUB-201 → SUB-179 → SUB-202 → SUB-203 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/build/shell-hydrate.tsx`<br>`scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/manifest.json` | M1、M3、M4、M5、M6 | 140 | `runs/r3/handoff/M7.md` |
| M8（W3） | 文档层弃用 token 与 search-static 死规则（主力） | SUB-204 | `apps/storybook/src/alpha-styles.ts`<br>`apps/storybook/src/story-demo-styles.ts`<br>`apps/storybook/src/storybook.css`<br>`apps/storybook/src/internal-dev/overlay-family-lab/OverlayFamilyLab.tsx`<br>`scripts/shell-fidelity-proof.mjs`<br>`docs/style-scale.md`<br>`apps/storybook/src/contract-stories/gplus/icon-roster.tsx`<br>`docs/design/gplus-2026-10/doc-class-map.json` | M3、M4 | 80 | `runs/r3/handoff/M8.md` |
| M9（W4） | 旧壳文字残留的代码与文案、登入动画读回（主力） | SUB-187 → SUB-208 | `apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/build/ai-consumption-contract.ts`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`apps/storybook/src/contract-stories/content/navigation-rows.ts`<br>`apps/storybook/src/contract-stories/content/component-rows.ts`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`scripts/storybook-smoke.mjs`<br>`apps/storybook/src/smoke.test.ts`<br>`scripts/lib/story-budget.mjs`<br>`scripts/lib/locale-invariant-ledger.mjs` | M4、M5、M6、M7、M8 | 130 | `runs/r3/handoff/M9.md` |
| M10（W4） | 旧壳文字残留的纯文档、迁移说明与 CHANGELOG（主力） | SUB-209 → SUB-210 | `docs/design/gplus-2026-10/README.md`<br>`docs/design/gplus-2026-10/storybook-map.md`<br>`docs/contract/README.md`<br>`packages/ui-tokens/README.md`<br>`docs/migration-4.0.md`<br>`CHANGELOG.md` | M3、M4、M7 | 60 | `runs/r3/handoff/M10.md` |
| M11（W5） | 批末生成物再生与清单校正（主力） | SUB-211 | `docs/verification/**`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | M1、M2、M3、M4、M5、M6、M7、M8、M9、M10 | 130 | `runs/r3/handoff/M11.md` |

## 偏离判断 §5 的地方

共四处，理由见 `decomposition.md` 第 2.4 节：M8 的前置由「无」改为 M3、M4（storybook.css 走 M4 → M8，shell-fidelity 期望由 M3 交 M8 对齐）；M9 前置补写 M5、M10 前置补写 M3（原经传递已是前置，显式写出）；R3-18 的契约说明句移到 SUB-209（M10）；R3-14 的屏内 SectionTabs 余项落在 SUB-179（M7）。包的组成、档位与波次照判断 §5，调度顺序不变。

## 共享文件的先后

被两张以上 Subtask 改的文件，按波次与包内顺序先后；跨包时前一个包合入后，后一个包才从集成分支切出。判断 §3.4 第 4 条的串行文件链（Navigation.tsx 与 base.css.ts 走 M3 → M4；shell-measure-proof 走 M1 → M7；browser-proof、client-scripts、shell-hydrate 走 M5 → M7；storybook-smoke 走 M3 → M7 → M9；smoke.test 走 M5 → M9；aos 两份走 M6 → M9；matrix-stories 走 M4 → M9；story-content 只在 M9）都在表内。

| 文件 | 先后 |
| --- | --- |
| `apps/storybook/src/build/client-scripts.ts` | SUB-195（M5 W2） → SUB-201（M7 W3） |
| `apps/storybook/src/build/locales/storybook-content-text.ts` | SUB-200（M6 W2） → SUB-208（M9 W4） |
| `apps/storybook/src/build/page-template.tsx` | SUB-201（M7 W3） → SUB-179（M7 W3） → SUB-202（M7 W3） |
| `apps/storybook/src/build/shell-hydrate.tsx` | SUB-198（M5 W2） → SUB-186（M5 W2） → SUB-201（M7 W3） → SUB-179（M7 W3） |
| `apps/storybook/src/contract-stories/gplus/matrix-stories.tsx` | SUB-184（M4 W2） → SUB-208（M9 W4） |
| `apps/storybook/src/contract-stories/story-content.tsx` | SUB-187（M9 W4） → SUB-208（M9 W4） |
| `apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx` | SUB-199（M6 W2） → SUB-200（M6 W2） → SUB-208（M9 W4） |
| `apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx` | SUB-199（M6 W2） → SUB-200（M6 W2） → SUB-208（M9 W4） |
| `apps/storybook/src/smoke.test.ts` | SUB-195（M5 W2） → SUB-186（M5 W2） → SUB-208（M9 W4） |
| `apps/storybook/src/storybook.css` | SUB-178（M4 W2） → SUB-204（M8 W3） |
| `docs/design/gplus-2026-10/measure-shell.js` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx` | SUB-184（M4 W2） → SUB-193（M4 W2） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx` | SUB-184（M4 W2） → SUB-193（M4 W2） |
| `packages/ui-react/src/components/Navigation/Navigation.test.tsx` | SUB-182（M3 W1） → SUB-192（M3 W1） → SUB-183（M3 W1） → SUB-184（M4 W2） → SUB-185（M4 W2） → SUB-194（M4 W2） → SUB-178（M4 W2） |
| `packages/ui-react/src/components/Navigation/Navigation.tsx` | SUB-192（M3 W1） → SUB-184（M4 W2） → SUB-185（M4 W2） → SUB-194（M4 W2） → SUB-178（M4 W2） |
| `packages/ui-react/src/components/Navigation/ShellMenu.test.tsx` | SUB-188（M3 W1） → SUB-184（M4 W2） → SUB-185（M4 W2） → SUB-178（M4 W2） |
| `packages/ui-react/src/components/Navigation/ShellMenu.tsx` | SUB-184（M4 W2） → SUB-185（M4 W2） → SUB-178（M4 W2） |
| `packages/ui-react/src/styles/base.css.ts` | SUB-192（M3 W1） → SUB-183（M3 W1） → SUB-178（M4 W2） |
| `packages/ui-react/src/styles/shell.css.ts` | SUB-188（M3 W1） → SUB-182（M3 W1） → SUB-192（M3 W1） → SUB-178（M4 W2） |
| `packages/ui-react/src/test/shell-menu.dom.spec.tsx` | SUB-184（M4 W2） → SUB-185（M4 W2） |
| `scripts/contract-static-proof.mjs` | SUB-189（M2 W1） → SUB-190（M2 W1） |
| `scripts/internal-alpha-browser-proof.mjs` | SUB-198（M5 W2） → SUB-195（M5 W2） → SUB-201（M7 W3） → SUB-203（M7 W3） |
| `scripts/lib/locale-invariant-ledger.mjs` | SUB-195（M5 W2） → SUB-208（M9 W4） |
| `scripts/lib/shell-measure.mjs` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） |
| `scripts/lib/story-budget.mjs` | SUB-186（M5 W2） → SUB-208（M9 W4） |
| `scripts/shell-measure-proof.mjs` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） → SUB-179（M7 W3） |
| `scripts/storybook-smoke.mjs` | SUB-183（M3 W1） → SUB-201（M7 W3） → SUB-208（M9 W4） |
| `tests/contract-static-proof.test.mjs` | SUB-189（M2 W1） → SUB-190（M2 W1） → SUB-191（M2 W1） |
| `tests/fixtures/geometry-measure/shell/manifest.json` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） → SUB-179（M7 W3） |
| `tests/fixtures/geometry-measure/shell/mutations.json` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） |
| `tests/fixtures/geometry-measure/shell/package-menu.html` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） |
| `tests/fixtures/geometry-measure/shell/package-pages.html` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） |
| `tests/shell-measure-proof.test.mjs` | SUB-206（M1 W1） → SUB-207（M1 W1） → SUB-196（M1 W1） → SUB-179（M7 W3） |

### 期望对齐的接收（C-15）

| 门或文件 | 让它过期的单 | 对齐的单 |
| --- | --- | --- |
| `scripts/storybook-smoke.mjs` | M4、M5、M6 各单（样板改名与层级、拖排与产品、AOS 变体、样板高度） | SUB-201（M7） |
| `scripts/storybook-smoke.mjs` | SUB-201、SUB-179（M7）、SUB-204（M8） | SUB-208（M9） |
| `apps/storybook/src/smoke.test.ts`、`scripts/lib/story-budget.mjs` | M4、M6、M7、M8 各单 | SUB-208（M9） |
| `scripts/shell-fidelity-proof.mjs` | SUB-192（M3） | SUB-204（M8） |
| `scripts/brand-asset-source-proof.mjs` | SUB-194（M4） | SUB-194（同单） |
| `scripts/shell-measure-proof.mjs`、`tests/fixtures/geometry-measure/shell/manifest.json` | SUB-185（M4，新开关） | SUB-179（M7） |

## 各包局部门

### M1 · 壳层门读法：pinJitter 只读渲染出的元素、contrast 按叠放取底、面包屑逐段读

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-206 → TCRN-DS-SUB-207 → TCRN-DS-SUB-196；预计 110 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 交回：`runs/r3/handoff/M1.md`；见红只记：`runs/r3/problems/M1.md`。

### M2 · 其他门与契约：searchOverlay、parity 行盒、contract:static 不变式与 C11 归属、顶带登记 C8

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-181 → TCRN-DS-SUB-197 → TCRN-DS-SUB-189 → TCRN-DS-SUB-190 → TCRN-DS-SUB-191；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 交回：`runs/r3/handoff/M2.md`；见红只记：`runs/r3/problems/M2.md`。

### M3 · 包件样式与测试：菜单图标盒、纸内焦点、导航项截断、死变量、下拉 DOM 用例

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-188 → TCRN-DS-SUB-182 → TCRN-DS-SUB-192 → TCRN-DS-SUB-183 → TCRN-DS-SUB-180；预计 120 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 交回：`runs/r3/handoff/M3.md`；见红只记：`runs/r3/problems/M3.md`。

### M4 · 包件组件与 prop 面：地标名、TocRail 层级、⌘K 开关、data-logo、几何字面值改 token

- 波次：W2；档位：主力；前置包：M2、M3；Subtask：TCRN-DS-SUB-184 → TCRN-DS-SUB-193 → TCRN-DS-SUB-185 → TCRN-DS-SUB-194 → TCRN-DS-SUB-178；预计 145 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 交回：`runs/r3/handoff/M4.md`；见红只记：`runs/r3/problems/M4.md`。

### M5 · 文档站门与品牌字标：browser-proof 期望与时机、字标三张名单、拖排与产品切换样板

- 波次：W2；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-198 → TCRN-DS-SUB-195 → TCRN-DS-SUB-186；预计 125 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- 交回：`runs/r3/handoff/M5.md`；见红只记：`runs/r3/problems/M5.md`。

### M6 · 样板与 AOS 视觉实例：画框同高、AOS 标题裁切、搜索结果变体与「工作项」

- 波次：W2；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-205 → TCRN-DS-SUB-199 → TCRN-DS-SUB-200；预计 100 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 交回：`runs/r3/handoff/M6.md`；见红只记：`runs/r3/problems/M6.md`。

### M7 · 文档壳水合真件与门侧：⌘K 挂载与 focusLoop、TocRail 传层级 2、AOS 裁切门侧

- 波次：W3；档位：主力；前置包：M1、M3、M4、M5、M6；Subtask：TCRN-DS-SUB-201 → TCRN-DS-SUB-179 → TCRN-DS-SUB-202 → TCRN-DS-SUB-203；预计 140 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 交回：`runs/r3/handoff/M7.md`；见红只记：`runs/r3/problems/M7.md`。

### M8 · 文档层弃用 token 与 search-static 死规则

- 波次：W3；档位：主力；前置包：M3、M4；Subtask：TCRN-DS-SUB-204；预计 80 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
- 交回：`runs/r3/handoff/M8.md`；见红只记：`runs/r3/problems/M8.md`。

### M9 · 旧壳文字残留的代码与文案、登入动画读回

- 波次：W4；档位：主力；前置包：M4、M5、M6、M7、M8；Subtask：TCRN-DS-SUB-187 → TCRN-DS-SUB-208；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 交回：`runs/r3/handoff/M9.md`；见红只记：`runs/r3/problems/M9.md`。

### M10 · 旧壳文字残留的纯文档、迁移说明与 CHANGELOG

- 波次：W4；档位：主力；前置包：M3、M4、M7；Subtask：TCRN-DS-SUB-209 → TCRN-DS-SUB-210；预计 60 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
- 交回：`runs/r3/handoff/M10.md`；见红只记：`runs/r3/problems/M10.md`。

### M11 · 批末生成物再生与清单校正

- 波次：W5；档位：主力；前置包：M1、M2、M3、M4、M5、M6、M7、M8、M9、M10；Subtask：TCRN-DS-SUB-211；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 交回：`runs/r3/handoff/M11.md`；见红只记：`runs/r3/problems/M11.md`。
