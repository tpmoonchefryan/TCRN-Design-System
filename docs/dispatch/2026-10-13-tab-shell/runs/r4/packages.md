# TCRN-DS-INIT-016 · R4 分包

13 张 Subtask 分 5 个包、3 个波次（判断 §5 的 5 包 3 波，组成、档位、波次与前置不变；包名 M1…M5 改为 N1…N5，避免与 R3 的 M 包混淆）。同一波的包并行，后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-17），每个包都必须遵守。

节行号：规则与校验 L7；共享登记处归属 L17；包表 L57；共享文件的先后 L69；期望对齐的接收 L85；各包局部门 L99；N1 L101；N2 L118；N3 L131；N4 L148；N5 L161。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包不超过 3；本表与包表由脚本从 `subtasks.json` 的同一份数据生成并校验通过：键号 TCRN-DS-SUB-212 至 224 连续，parentId 与链上 Story 导出一致，依赖都在更早的波或同包靠前、且跨包依赖都在前置包里，每包预计不超过 150，summary 都不超过 160 字节，R4-1 至 R4-9 每条至少被一张 Subtask 承接，R4-9（SUB-224）是最后一个包的最后一张。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回「期望过期」或问题文件。
- 档位：经济为 `einzbern-economy`（claude-opus-5-5 low），主力为 `einzbern-main`（claude-opus-5-5 max）。判断 §5：N1、N4 经济，N2、N3、N5 主力；R4-6 的改动属经济级，随 N3 主力包。R4 的项再被退回时按 START「起始档与升档」：经济档升主力，主力档交 Owner（C-16）。
- 前置包列只写包号并逐个列出（C-17）；改动让别的门期望过期的包按 C-15 同包对齐，或交给下文「期望对齐的接收」里的下一个持有者（R2 主线程问题 M2）。
- 规模按模型响应数估；每包目标不超过 150，逼近 180 时按 C-4 提交干净状态、写接续点交回。合计 435 响应（判断 §5 表逐行相加）。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告不提交（N5 的 SUB-224 除外，C-9）。verify 只在批末跑一次，不进任何包；R4-9（SUB-224）是最后一个包的最后一张。
- 合入：每波结束主线程按依赖顺序把本波各包合入集成分支，W1 为 N1 → N2 → N3；N3 合入前，主线程在集成树上只读复跑一次 `demo-styles-sync --check`（它读 dist，KB-019；判断 §3.4 第 8 条）。交回物统一为 `runs/r4/handoff/<包>.md`，见红只记写 `runs/r4/problems/<包>.md`；文件名各不相同，不构成文件集相交。

## 共享登记处归属

本表列每波谁可以改共享登记处；空格（—）表示该波没有包可改，需要改的写进交回说明。

| 登记处 | W1 | W2 | W3 |
| --- | --- | --- | --- |
| 根 `package.json`、各包 `package.json`、`pnpm-lock.yaml` | — | — | — |
| `components/Navigation/index.ts`、`src/index.tsx` 与 `index.test.tsx`（导出面；本轮新模块不导出） | — | — | — |
| `components/Navigation/` 的 `Navigation.tsx`、`ShellBrandButton.tsx` 与测试、`ShellIntro.tsx` 与测试、新模块 `product-mark-id.ts` | N1 | — | — |
| `Navigation.test.tsx`、`ShellMenu`、`ShellDropdown`、`ShellPins` 与测试、`shell-copy.ts` | — | — | — |
| `src/test/shell-intro.dom.spec.tsx` | N1（按需） | — | — |
| `components/Layout/Layout.test.tsx`（`Layout.tsx` 不改） | N1 | — | — |
| `styles/base.css.ts` | N1 | — | — |
| 其余包样式模块与 `styles/index.ts` | — | — | — |
| 契约 `tokens.json`、`icons.json`、`matrices.json`、`marks.json` 与五个生成物头、ui-tokens 源码 | — | — | — |
| `docs/contract/families.json` | N2 | — | — |
| `docs/contract/{exemptions,roles}.json`、`docs/contract/clauses.md`、`docs/contract/README.md` | — | — | — |
| `scripts/contract-static-proof.mjs` | — | — | — |
| `tests/contract-static-proof.test.mjs` | N2 | — | — |
| `scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`、第一批夹具上级 `tests/fixtures/geometry-measure/manifest.json` | N1 | — | — |
| 壳层门 `scripts/lib/shell-measure.mjs`、`scripts/shell-measure-proof.mjs`、`tests/shell-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/shell/**`、量测工具 `measure-shell.js` | — | — | — |
| 共享路由库 `scripts/lib/storybook-routes.mjs` | — | — | — |
| `scripts/internal-alpha-browser-proof.mjs`、`scripts/lib/visual-signature.mjs` | N2 | — | — |
| 文档层样式 `apps/storybook/src/{alpha-styles.ts,story-demo-styles.ts,storybook.css}` | N3 | — | — |
| 视觉实例 `visual-instances/aos-*.tsx`（两份） | N3 | — | — |
| `scripts/storybook-smoke.mjs` | N3 | — | — |
| `scripts/shell-fidelity-proof.mjs`、`docs/style-scale.md` | N3 | — | — |
| `scripts/selection-grammar-proof.mjs` | N3 | — | — |
| `scripts/token-deprecation-notice.mjs`、`tests/token-deprecation-notice.test.mjs` | N3 | — | — |
| `docs/design/gplus-2026-10/doc-class-map.json` | N3（只在 doc-shell:proof 要求时） | — | — |
| 页模板与页面脚本（`page-template.tsx`、`client-scripts.ts`、`shell-hydrate.tsx`）、`story-content.tsx`、`apps/storybook/src/build/**` | — | — | — |
| 五语字典与台账（`storybook-content-text.ts`、`storybook-locale-text.ts`、`locale-invariant-ledger.mjs`、`story-budget.mjs`）、`smoke.test.ts` | — | — | — |
| `scripts/geometry-proof.mjs`、`scripts/shell-parity-proof.mjs`、`scripts/brand-asset-source-proof.mjs`、`scripts/css-template-integrity-proof.mjs`、`scripts/package-contract-manifest.mjs` | — | — | — |
| 映射机读件 `docs/design/gplus-2026-10/storybook-map.json` | — | N4 | — |
| 映射 `storybook-map.md`、设计 README | — | — | — |
| ui-react `README.md` | — | N4 | — |
| `CHANGELOG.md`、`docs/migration-4.0.md` | — | N4 | — |
| 成品板与草案板、`heights.json`、`visual-standard/canvas.json` | — | — | — |
| 回执与门报告 `docs/verification/**`、`owner-acceptance.md` | — | — | N5（SUB-224） |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| N1（W1） | 包件与几何门覆盖：标按钮与登入动画的 data-logo、Disclosure 描边、纸内焦点探针上真件（经济） | SUB-212 → SUB-214 → SUB-216 → SUB-213 | `packages/ui-react/src/components/Navigation/product-mark-id.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellIntro.tsx`<br>`packages/ui-react/src/components/Navigation/ShellIntro.test.tsx`<br>`packages/ui-react/src/test/shell-intro.dom.spec.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Layout/Layout.test.tsx`<br>`scripts/geometry-measure-proof.mjs`<br>`tests/geometry-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/manifest.json` | — | 90 | `runs/r4/handoff/N1.md` |
| N2（W1） | 契约登记与视觉签名门：families.json 补登、截图不受纸的滚动裁切（主力） | SUB-215 → SUB-217 | `docs/contract/families.json`<br>`tests/contract-static-proof.test.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/lib/visual-signature.mjs` | — | 100 | `runs/r4/handoff/N2.md` |
| N3（W1） | 文档站与文档层的门：展开标题左边条、文档层死规则与四处门的过期口径（主力） | SUB-218 → SUB-219 → SUB-220 → SUB-222 | `apps/storybook/src/alpha-styles.ts`<br>`apps/storybook/src/story-demo-styles.ts`<br>`apps/storybook/src/storybook.css`<br>`scripts/shell-fidelity-proof.mjs`<br>`docs/style-scale.md`<br>`docs/design/gplus-2026-10/doc-class-map.json`<br>`scripts/storybook-smoke.mjs`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`scripts/selection-grammar-proof.mjs`<br>`scripts/token-deprecation-notice.mjs`<br>`tests/token-deprecation-notice.test.mjs` | — | 85 | `runs/r4/handoff/N3.md` |
| N4（W2） | 文档同步：映射机读件、图标件数、迁移说明开头与分消费方清单（经济） | SUB-221 → SUB-223 | `docs/design/gplus-2026-10/storybook-map.json`<br>`packages/ui-react/README.md`<br>`docs/migration-4.0.md`<br>`CHANGELOG.md` | N1、N2、N3 | 50 | `runs/r4/handoff/N4.md` |
| N5（W3） | 批末生成物再生与清单校正（主力） | SUB-224 | `docs/verification/**`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | N1、N2、N3、N4 | 110 | `runs/r4/handoff/N5.md` |

合计 435 响应。包与判断 §5 的对应：N1 为组 A：R4-1、R4-2、R4-3（判断 §5 的 M1）；N2 为组 B：R4-4、R4-5（判断 §5 的 M2）；N3 为组 C：R4-6、R4-7（判断 §5 的 M3）；N4 为组 D：R4-8（判断 §5 的 M4）；N5 为组 E：R4-9（判断 §5 的 M5）。

## 共享文件的先后

被两张以上 Subtask 改的文件按包内顺序先后；跨包时前一个包合入后，后一个包才从集成分支切出。本轮只有一个文件被两张 Subtask 改：

| 文件 | 先后 |
| --- | --- |
| `apps/storybook/src/alpha-styles.ts` | SUB-218（N3 W1） → SUB-219（N3 W1） |

另有三处「一个包写、后一个包读」，由波次保证先后：

| 读写对象 | 写 | 读 |
| --- | --- | --- |
| `docs/design/gplus-2026-10/storybook-map.json` | SUB-221（N4 W2）改 refs 与 DIFF-10 | `tests/geometry-measure-proof.test.mjs`（SUB-213 在 N1 W1 改该测试）只读 rows，本轮不改 rows |
| browser-proof 的截图输入摘要（`internal-alpha-browser-proof.mjs` 第 896 行一带：storybook-static、本脚本、`visual-signature.mjs`、`Navigation.tsx`、包样式模块等） | N1、N2、N3 都改到其中的文件 | SUB-224（N5 W3）在全部合入后的同一构建上重收 |
| 各包交回的「迁移条目」 | N1、N2、N3 | SUB-223（N4 W2）收录 |

### 期望对齐的接收（C-15）

| 门或文件 | 让它过期的单 | 对齐的单 |
| --- | --- | --- |
| `docs/verification/internal-alpha/visual-signature-baseline.json`（视觉签名） | SUB-216、SUB-218、SUB-219（可见变化），SUB-217（截法） | SUB-224（N5） |
| `packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`（标 id 断言） | SUB-212 | SUB-212（同单） |
| `tests/geometry-measure-proof.test.mjs`（探针 id 清单与真件断言） | SUB-213 | SUB-213（同单） |
| `tests/contract-static-proof.test.mjs`（家族断言） | SUB-215 | SUB-215（同单） |
| `scripts/shell-fidelity-proof.mjs` 白名单、`docs/style-scale.md` 清单 | SUB-219 | SUB-219（同单） |
| `scripts/storybook-smoke.mjs`、`scripts/selection-grammar-proof.mjs` | SUB-220 | SUB-220（同单） |
| `tests/token-deprecation-notice.test.mjs` | SUB-222 | SUB-222（同单） |
| `owner-acceptance.md`（G 行、待裁表、目视项） | 全部包（交回的目视项与读数） | SUB-224（N5） |
| `docs/migration-4.0.md`、`CHANGELOG.md`、ui-react `README.md` | SUB-212、SUB-214、SUB-216、SUB-222 与 N3 的文档站变化（交回的迁移条目） | SUB-223（N4） |

## 各包局部门

### N1 · 包件与几何门覆盖：标按钮与登入动画的 data-logo、Disclosure 描边、纸内焦点探针上真件

- 波次：W1；档位：经济；前置包：无；Subtask：TCRN-DS-SUB-212 → TCRN-DS-SUB-214 → TCRN-DS-SUB-216 → TCRN-DS-SUB-213；预计 90 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
- 交回：`runs/r4/handoff/N1.md`；见红只记：`runs/r4/problems/N1.md`。

### N2 · 契约登记与视觉签名门：families.json 补登、截图不受纸的滚动裁切

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-215 → TCRN-DS-SUB-217；预计 100 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 交回：`runs/r4/handoff/N2.md`；见红只记：`runs/r4/problems/N2.md`。

### N3 · 文档站与文档层的门：展开标题左边条、文档层死规则与四处门的过期口径

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-218 → TCRN-DS-SUB-219 → TCRN-DS-SUB-220 → TCRN-DS-SUB-222；预计 85 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
- 注：demo-styles:sync 按 build、sync、storybook:build 的顺序跑（KB-019，SUB-219）；N3 合入前主线程在集成树上只读复跑 demo-styles-sync --check。
- 交回：`runs/r4/handoff/N3.md`；见红只记：`runs/r4/problems/N3.md`。

### N4 · 文档同步：映射机读件、图标件数、迁移说明开头与分消费方清单

- 波次：W2；档位：经济；前置包：N1、N2、N3；Subtask：TCRN-DS-SUB-221 → TCRN-DS-SUB-223；预计 50 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 交回：`runs/r4/handoff/N4.md`；见红只记：`runs/r4/problems/N4.md`。

### N5 · 批末生成物再生与清单校正

- 波次：W3；档位：主力；前置包：N1、N2、N3、N4；Subtask：TCRN-DS-SUB-224；预计 110 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑；写 docs/verification 的门跑完按 C-9 还原）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <选择文件>`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注：browser-proof 先跑一次产出 visual-selection-result.json，用 --update-visual-baseline 应用选择后再跑一次确认（SUB-224；这两次不算重复跑）。
- 交回：`runs/r4/handoff/N5.md`；见红只记：`runs/r4/problems/N5.md`。
