# TCRN-DS-INIT-016 · R6 分包

16 张 Subtask 分 9 个包、5 个波次（包名 S1–S9，避开前五轮的 P、K、M、N、Q）。后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-20），每个包都必须遵守。

节行号：规则与校验 L7；共享登记处归属 L18；包表 L66；共享文件的先后 L82；期望对齐的接收 L103；各包局部门 L121；S1 L123、S2 L134、S3 L153、S4 L166、S5 L185、S6 L197、S7 L208、S8 L232、S9 L247。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀，如 `tests/fixtures/geometry-measure/shell/**` 与其下文件算相交）；每波并行包不超过 3（W1 3 个，W2 3 个，W3、W4、W5 各 1 个）。`subtasks.json` 与 `subtasks-batch.json` 由脚本从 `decomposition.md` 第 3 节生成，本表的独占文件集与各包局部门由同一份数据生成；交叉校验通过：键号 TCRN-DS-SUB-229 至 244 连续，parentId 与链上 Story 导出一致，依赖都在更早的波或同包靠前、跨包依赖都在前置包里，每包预计不超过 150，summary 都不超过 160 字节，R6-1 至 R6-12 每条至少一张 Subtask 承接，同波文件集两两不相交。
- 排序：R6-11 的包 S8 排在所有改渲染与改文档的包（S1–S7）之后；R6-12 的包 S9 是最后一个包，SUB-244 是最后一张。
- 档位：经济为 `einzbern-economy`（claude-opus-5-5 low），主力为 `einzbern-main`（claude-opus-5-5 max）。改共享契约、门判定、ProductShell 顶带几何的包起主力（S1、S2、S3、S4、S7、S9）；孤立修复与文档起经济（S5、S6、S8）。S7 里 SUB-240 是 brief 建议的经济项，随包起主力。同一修复目标被退回一次：经济升主力（C-16）。
- 每个共享登记处每波只归一个包（下表）；没有列在某包文件集里的登记处，该包在该波不得改，需要改的写进交回「期望过期」或问题文件。前置包列只写包号并逐个列出（C-17）。
- 规模按模型响应数估；每包不超过 150，逼近 180 时按 C-4 提交干净状态、写接续点交回。合计 625 响应。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告只由 S9 提交（C-9）。批末由主线程在集成树上跑一次 verify（30 步）并另跑 `storybook:build` 与 `test:dom`，不进任何包。
- 合入：每波结束主线程按包号顺序合入集成分支，下一波从合入后的 HEAD 切出；冲突交集成子代理。交回物统一为 `runs/r6/handoff/<包>.md`，见红只记写 `runs/r6/problems/<包>.md`；文件名各不相同，不构成文件集相交。
- 验收与判断按批量原则第 6 条：实施包多于 2 个，验收按 Epic 分片同批并行，判断单独，下一轮拆分单独。

## 共享登记处归属

本表列每波谁可以改共享登记处；— 表示该波没有包可改。

| 登记处 | W1 | W2 | W3 | W4 | W5 |
| --- | --- | --- | --- | --- | --- |
| 根与各包 `package.json`、`pnpm-lock.yaml` | — | — | — | — | — |
| 导出面（`components/*/index.ts`、`src/index.tsx` 与 `index.test.tsx`） | — | — | — | — | — |
| ui-tokens 源码（`tokens.css`、`index.ts`、`index.test.ts`）、契约 `tokens.json`、`matrices.json` 与五个生成物 | S2 | — | S7 | — | — |
| 契约 `icons.json`、`marks.json`、`pairs.json`、`typography.json` | — | — | — | — | — |
| `docs/contract/**`（`roles.json`、`clauses.md`、`README.md` 等） | S1 | — | — | — | — |
| `contract-static-proof.mjs` 与其测试 | S1 | — | — | — | — |
| 壳层门（`shell-measure-proof.mjs`、`lib/shell-measure.mjs`、测试与 `tests/fixtures/geometry-measure/shell/**`） | S2 | S4 | S7 | — | — |
| 量测工具 `docs/design/gplus-2026-10/measure-shell.js` | S2 | — | — | — | — |
| `token-contrast-proof.mjs` 与其测试 | S2 | — | — | — | — |
| `geometry-proof.mjs`、`storybook-smoke.mjs` | — | S4 | S7 | — | — |
| `shell-parity-proof.mjs` | — | S4 | S7 | — | — |
| `ds-consumption-proof.mjs` | — | S4 | — | — | — |
| 其余门脚本、门库与门测试（geometry-measure、browser-proof、visual-proof、`lib/visual-signature.mjs`、`lib/storybook-routes.mjs`、selection-grammar、shell-fidelity、弃用提示、扫描） | — | — | — | — | — |
| `styles/shell.css.ts` | S3 | S4 | S7 | — | — |
| `styles/shell-sheet.css.ts` | — | S4 | — | — | — |
| `styles/base.css.ts` | — | S5 | — | — | — |
| `styles/brand.css.ts` | S2 | — | — | — | — |
| 其余样式模块与 `styles/index.ts` | — | — | — | — | — |
| `ShellDropdown.tsx` 与其测试、`shell-dropdown.dom.spec.tsx` | S3 | — | — | — | — |
| `ShellBrandButton.tsx` 与其测试 | — | S4 | S7 | — | — |
| `ShellMenu.tsx` 与其测试、`ShellPins.tsx`、`Navigation.tsx`、`shell-menu.dom.spec.tsx` | — | S4 | — | — | — |
| `Navigation.test.tsx` | S2 | S5 | — | — | — |
| 其余组件源码与测试 | — | — | — | — | — |
| `story-content.tsx` | — | S4 | S7 | — | — |
| AOS 视觉实例（`visual-instances/aos-*.tsx`） | — | — | S7 | — | — |
| 文档层（`alpha-styles.ts`、`build/shell-hydrate.tsx`、`build/page-template.tsx`） | — | S4 | — | — | — |
| `build/foundation-visual-standards.ts` | — | — | S7 | — | — |
| `apps/storybook/src/storybook.css` | S2 | — | — | — | — |
| 五语字典与台账 | — | — | — | — | — |
| 映射 `storybook-map.json` 与 `.md` | — | — | — | S8 | — |
| 设计 README（`docs/design/gplus-2026-10/README.md`） | S2 | — | — | S8 | — |
| `packages/ui-tokens/README.md` | S2 | — | — | — | — |
| `packages/ui-react/README.md` | — | — | — | S8 | — |
| 壳板生成器（`build-shell2.mjs`、`shell-screen.mjs`）、两份成品壳板与两份草案二板 | S2 | — | S7 | — | — |
| `build-brand.mjs` 与 `V2-B1-Brand.dc.html` | S2 | — | — | — | — |
| `build-inputs.mjs`、`build-icon.mjs`、`V2-B1-Inputs`、`V2-B1-Icon`、`V2-GPlus` 与成品 Inputs、Icon 板（含 make-standard 的运行） | — | S6 | — | — | — |
| 其余板与生成器（Typography、Actions、Tokens、Logos、草案一、`make-standard.mjs` 本身） | — | — | — | — | — |
| `visual-standard/heights.json`、`visual-standard/canvas.json`、gplus `boards/canvas.json` | S2 | S6 | S7 | — | — |
| `CHANGELOG.md`、`docs/migration-4.0.md` | — | — | — | S8 | — |
| `docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | — | — | — | S8 | S9（只填离群节与读数） |
| 回执、门报告与签名基线 `docs/verification/**` | — | — | — | — | S9 |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| S1（W1） | 顶带 C8 按板：roles.json 两字段，contract-static 两层只跳两项（主力） | SUB-229 | `docs/contract/roles.json`<br>`docs/contract/clauses.md`<br>`docs/contract/README.md`<br>`scripts/contract-static-proof.mjs`<br>`tests/contract-static-proof.test.mjs` | — | 30 | `runs/r6/handoff/S1.md` |
| S2（W1） | markText 量法与夜间 TMS 色：壳层门库、measure-shell.js、token 与契约、07a 与 V2-B1-Brand（主力） | SUB-230 → SUB-231 → SUB-232 | `scripts/lib/shell-measure.mjs`<br>`docs/design/gplus-2026-10/measure-shell.js`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/**`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-tokens/src/tokens.css`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-tokens/README.md`<br>`docs/design/gplus-2026-10/contract/tokens.json`<br>`docs/design/gplus-2026-10/contract/matrices.json`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/storybook.css`<br>`scripts/token-contrast-proof.mjs`<br>`tests/token-contrast-proof.test.mjs`<br>`docs/design/gplus-2026-10/tools/build-shell2.mjs`<br>`docs/design/gplus-2026-10/tools/build-brand.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B2-Shell-Draft2.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B2-Shell-Draft2-b.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B1-Brand.dc.html`<br>`docs/design/visual-standard/boards/Shell.dc.html`<br>`docs/design/visual-standard/boards/Shell-2.dc.html`<br>`docs/design/visual-standard/heights.json`<br>`docs/design/visual-standard/canvas.json`<br>`docs/design/gplus-2026-10/README.md` | — | 110 | `runs/r6/handoff/S2.md` |
| S3（W1） | 级联越过视口右缘时向左展开（主力） | SUB-233 | `packages/ui-react/src/components/Navigation/ShellDropdown.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`<br>`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx`<br>`packages/ui-react/src/styles/shell.css.ts` | — | 40 | `runs/r6/handoff/S3.md` |
| S4（W2） | 窄屏按壳的容器宽切换，补 1023 门读数（主力） | SUB-234 | `packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/styles/shell-sheet.css.ts`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellPins.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`scripts/geometry-proof.mjs`<br>`scripts/storybook-smoke.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/ds-consumption-proof.mjs`<br>`scripts/lib/shell-measure.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/**`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/build/shell-hydrate.tsx`<br>`apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/alpha-styles.ts` | S2、S3 | 95 | `runs/r6/handoff/S4.md` |
| S5（W2） | 粗指针下未固定的图钉常显 ink-3（经济） | SUB-235 | `packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx` | S2 | 20 | `runs/r6/handoff/S5.md` |
| S6（W2） | 画板修订：Inputs rf 行与快捷键、底盘 kv、Icon 板 pin 实心例外（经济） | SUB-236 → SUB-237 | `docs/design/gplus-2026-10/tools/build-inputs.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B1-Inputs.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-GPlus.dc.html`<br>`docs/design/gplus-2026-10/boards/canvas.json`<br>`docs/design/visual-standard/boards/Inputs.dc.html`<br>`docs/design/visual-standard/heights.json`<br>`docs/design/visual-standard/canvas.json`<br>`docs/design/gplus-2026-10/tools/build-icon.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`<br>`docs/design/visual-standard/boards/Icon.dc.html` | S2 | 40 | `runs/r6/handoff/S6.md` |
| S7（W3） | 标按钮随字标加宽与 07b 长名屏，AOS 示例无标（主力） | SUB-238 → SUB-239 → SUB-240 | `packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`scripts/shell-measure-proof.mjs`<br>`scripts/geometry-proof.mjs`<br>`scripts/storybook-smoke.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/**`<br>`docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`docs/design/gplus-2026-10/tools/build-shell2.mjs`<br>`docs/design/gplus-2026-10/tools/shell-screen.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B2-Shell-Draft2.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B2-Shell-Draft2-b.dc.html`<br>`docs/design/gplus-2026-10/boards/canvas.json`<br>`docs/design/visual-standard/boards/Shell.dc.html`<br>`docs/design/visual-standard/boards/Shell-2.dc.html`<br>`docs/design/visual-standard/heights.json`<br>`docs/design/visual-standard/canvas.json`<br>`tests/fixtures/geometry-measure/shell/manifest.json`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`scripts/shell-parity-proof.mjs` | S2、S4、S6 | 110 | `runs/r6/handoff/S7.md` |
| S8（W4） | 文档与目视清单：迁移 M54 起、CHANGELOG、映射、owner-acceptance（经济） | SUB-241 → SUB-242 | `docs/migration-4.0.md`<br>`CHANGELOG.md`<br>`docs/design/gplus-2026-10/storybook-map.json`<br>`docs/design/gplus-2026-10/storybook-map.md`<br>`docs/design/gplus-2026-10/README.md`<br>`packages/ui-react/README.md`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | S1、S2、S3、S4、S5、S6、S7 | 90 | `runs/r6/handoff/S8.md` |
| S9（W5） | 视觉签名重收与回执、门报告一次再生（主力） | SUB-243 → SUB-244 | `docs/verification/internal-alpha/visual-signature-baseline.json`<br>`docs/verification/internal-alpha/visual-baseline-selection-r6.json`<br>`docs/verification/internal-alpha/visual-selection-application.json`<br>`docs/verification/internal-alpha/visual-selection-application-init016-r4.json`<br>`docs/verification/internal-alpha/**`<br>`docs/verification/**`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md` | S1、S2、S3、S4、S5、S6、S7、S8 | 90 | `runs/r6/handoff/S9.md` |

合计 625 响应。包与返工项：S1 为 R6-1；S2 为 R6-2、R6-3；S3 为 R6-7；S4 为 R6-5；S5 为 R6-8；S6 为 R6-4、R6-9；S7 为 R6-6、R6-10；S8 为 R6-11；S9 为 R6-12。

## 共享文件的先后

同一文件被两张以上 Subtask 改时，先后由波次与包内顺序保证：

| 文件 | 先 | 后 |
| --- | --- | --- |
| `shell.css.ts` | SUB-233（S3，W1，只动下拉段） | SUB-234（S4，W2）→ SUB-238（S7，W3） |
| `ShellBrandButton.tsx` 与其测试 | SUB-234（W2） | SUB-238（W3） |
| 壳层门文件与 `tests/fixtures/geometry-measure/shell/**` | SUB-230 → SUB-232（S2，W1） | SUB-234（W2）→ SUB-238 → SUB-239（W3） |
| `geometry-proof.mjs`、`storybook-smoke.mjs` | SUB-234（W2） | SUB-238 → SUB-240（W3；smoke 两单都改） |
| `shell-parity-proof.mjs` | SUB-234（W2，按需） | SUB-240（W3，按需） |
| 契约 `tokens.json`、ui-tokens `index.ts` 与 `index.test.ts`、五个生成物 | SUB-232（W1） | SUB-238（W3） |
| `Navigation.test.tsx` | SUB-231 → SUB-232（W1） | SUB-235（W2） |
| `build-shell2.mjs`、两份成品壳板与两份草案二板 | SUB-232（W1） | SUB-239（W3） |
| `heights.json`、`canvas.json` | SUB-232（W1，按需） | SUB-236 → SUB-237（W2）→ SUB-239（W3） |
| `story-content.tsx` | SUB-234（W2） | SUB-240（W3） |
| 设计 README | SUB-232（W1，按需） | SUB-241（W4，按需） |
| `owner-acceptance.md` | SUB-242（W4，整份改写，留离群节表头） | SUB-244（W5，只填离群节与机器读数） |
| `docs/verification/**` | SUB-243（W5，签名基线与选择、应用记录） | SUB-244（W5，其余回执与报告） |
| 各包交回 `runs/r6/handoff/S1.md` 至 `S7.md`（迁移条目、目视项、待发布清单、期望过期、预期签名变化） | S1–S7 | SUB-241、242（S8）；SUB-243（S9） |

### 期望对齐的接收（C-15）

| 门或文件 | 让它过期的单 | 对齐的单 |
| --- | --- | --- |
| `tests/contract-static-proof.test.mjs` 第 579–584 行（`roles.toolbars` 的 deepEqual） | SUB-229 | SUB-229 |
| 壳层门 markText 说明、夹具与变异；149-GWT4 同屏读数测试 | SUB-230 | SUB-230 |
| ui-tokens `index.test.ts` 第 89–100 行、`Navigation.test.tsx` 第 827–832 行、token-contrast 测试、壳层门 `pendingBelowMinimum` 与夹具两格、07a B 段 66 格 | SUB-232 | SUB-232 |
| CHANGELOG 第 75、124、326–328 行，迁移说明「Open Owner decisions」，映射 SHELL-D7、O-3、DIFF-10 的夜间文字 | SUB-232 | SUB-241 |
| 标按钮里 DS 首行居中（SUB-231 在 `brand.css.ts` 内做不了时） | SUB-231 | SUB-238 |
| `geometry-proof.mjs` 窄屏读法、smoke 第 3140 行 `isDesktopViewport`、壳层门 `ts-narrow-l` 与 `ts-narrow-x-l` 的期望、`story-content.tsx` 第 606–608 行等说明 | SUB-234 | SUB-234 |
| `ShellBrandButton.test.tsx` 第 114、141、214、227 行，壳层门 `tabWidthV2Px`，`geometry-proof.mjs` 第 43、609 行，smoke 第 316–325 行 | SUB-238 | SUB-238 |
| 夹具清单里 07b 长名屏 | SUB-239 | SUB-239 |
| smoke 第 1065–1080 行 O-9 段 | SUB-240 | SUB-240 |
| 映射 DIFF-3 的 status | SUB-236 | SUB-241 |
| 视觉签名基线 `visual-signature-baseline.json` | SUB-231、232、234、238、240 | SUB-243 |
| 回执与门报告（geometry-measure、shell-measure、映射报告、internal-alpha 清单、hardening、scaffold） | 全部改渲染、改门的单 | SUB-244 |
| `owner-acceptance.md` 各节 | 全部 | SUB-242（整份）、SUB-244（离群节与读数） |

## 各包局部门

### S1 · 顶带 C8 按板：roles.json 两字段，contract-static 两层只跳两项

- 波次：W1；档位：主力（`einzbern-main`）；前置包：无；Subtask：TCRN-DS-SUB-229；预计 30 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 注：build 与 storybook:build 先跑（contract:static 的 story 层读构建产物）；去字段变异只在包树里做、复原后再跑一次门本体（判据写明，不算重复跑）。
- 交回：`runs/r6/handoff/S1.md`；见红只记：`runs/r6/problems/S1.md`。

### S2 · markText 量法与夜间 TMS 色：壳层门库、measure-shell.js、token 与契约、07a 与 V2-B1-Brand

- 波次：W1；档位：主力（`einzbern-main`）；前置包：无；Subtask：TCRN-DS-SUB-230 → TCRN-DS-SUB-231 → TCRN-DS-SUB-232；预计 110 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注：包内按 SUB-230 → 231 → 232 做：先改量法拿到 DS 品牌首行的新读数，决定 231 是否要改布局，再做 232 的契约与板。契约生成器与板生成器按文件头用法经 `exec node` 跑。browser-proof 只在 232 做完后量一次，不应用；geometry:measure 在 230、231、232 各自判据要读数时跑，不为求稳重复。写 `docs/verification` 的门跑完按 C-9 还原。
- 交回：`runs/r6/handoff/S2.md`；见红只记：`runs/r6/problems/S2.md`。

### S3 · 级联越过视口右缘时向左展开

- 波次：W1；档位：主力（`einzbern-main`）；前置包：无；Subtask：TCRN-DS-SUB-233；预计 40 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 注：DOM 用例跑 test:dom（脚本先重建 ui-react）；geometry:measure 只为确认级联门读数不变。
- 交回：`runs/r6/handoff/S3.md`；见红只记：`runs/r6/problems/S3.md`。

### S4 · 窄屏按壳的容器宽切换，补 1023 门读数

- 波次：W2；档位：主力（`einzbern-main`）；前置包：S2、S3；Subtask：TCRN-DS-SUB-234；预计 95 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 注：开工先跑判据 ① 的一次性探针（scratch），块宽表写进交回再动样式；默认处置（定宽 1240、横向可滚）按问题 7。browser-proof 只量不应用。
- 交回：`runs/r6/handoff/S4.md`；见红只记：`runs/r6/problems/S4.md`。

### S5 · 粗指针下未固定的图钉常显 ink-3

- 波次：W2；档位：经济（`einzbern-economy`）；前置包：S2；Subtask：TCRN-DS-SUB-235；预计 20 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- 注：探针用 Playwright 的触摸上下文，脚本放 scratch，不入仓；不跑 browser-proof（细指针，预期无签名变化）。
- 交回：`runs/r6/handoff/S5.md`；见红只记：`runs/r6/problems/S5.md`。

### S6 · 画板修订：Inputs rf 行与快捷键、底盘 kv、Icon 板 pin 实心例外

- 波次：W2；档位：经济（`einzbern-economy`）；前置包：S2；Subtask：TCRN-DS-SUB-236 → TCRN-DS-SUB-237；预计 40 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- 注：包内按 SUB-236 → 237：两单都跑 make-standard，第二次跑完核对其余成品板逐字节不变；板高变了在本包同步 heights / canvas。
- 交回：`runs/r6/handoff/S6.md`；见红只记：`runs/r6/problems/S6.md`。

### S7 · 标按钮随字标加宽与 07b 长名屏，AOS 示例无标

- 波次：W3；档位：主力（`einzbern-main`）；前置包：S2、S4、S6；Subtask：TCRN-DS-SUB-238 → TCRN-DS-SUB-239 → TCRN-DS-SUB-240；预计 110 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 注：包内按 SUB-238 → 239 → 240：238 改门与契约释义（重生五个生成物），239 依赖新门读法加长名屏，240 与 238 同改 smoke 的同一比对。browser-proof 在 240 做完后量一次，不应用。
- 交回：`runs/r6/handoff/S7.md`；见红只记：`runs/r6/problems/S7.md`。

### S8 · 文档与目视清单：迁移 M54 起、CHANGELOG、映射、owner-acceptance

- 波次：W4；档位：经济（`einzbern-economy`）；前置包：S1、S2、S3、S4、S5、S6、S7；Subtask：TCRN-DS-SUB-241 → TCRN-DS-SUB-242；预计 90 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注：SUB-241 先写迁移条目与映射，SUB-242 引用其条目号改写目视清单；scan 扫整棵工作树，在两张都改完、交回与问题文件写好后跑一次。交回写 owner-acceptance 新的节目录与行号。
- 交回：`runs/r6/handoff/S8.md`；见红只记：`runs/r6/problems/S8.md`。

### S9 · 视觉签名重收与回执、门报告一次再生

- 波次：W5；档位：主力（`einzbern-main`）；前置包：S1、S2、S3、S4、S5、S6、S7、S8；Subtask：TCRN-DS-SUB-243 → TCRN-DS-SUB-244；预计 90 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline docs/verification/internal-alpha/visual-baseline-selection-r6.json`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 注：SUB-243 先重收签名（改名提交 → 选择文件 → 应用 → 确认），SUB-244 再在同一构建上一次再生回执与报告；只提交有实质变化的文件。
- 交回：`runs/r6/handoff/S9.md`；见红只记：`runs/r6/problems/S9.md`。
