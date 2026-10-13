# TCRN-DS-INIT-016 · R2 分包

37 张 Subtask 分 13 个包、5 个波次（判断 §5 的 12 包，另从 K6 拆出 K6b）。同一波的包并行，后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-14），每个包都必须遵守。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包不超过 3；本表与包表由脚本从 `subtasks.json` 的同一份数据生成并校验通过：键号 TCRN-DS-SUB-141 至 177 连续，parentId 与链上 Story 导出一致，依赖都在更早的波或同包靠前、且跨包依赖都在前置包里，每包预计不超过 150，summary 都不超过 160 字节，R2-1 至 R2-36 每条至少被一张 Subtask 承接。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回说明。新样式段的登记行随段的归属包走（C-8，R1 问题 M2）。
- 档位：经济为 `einzbern-economy`（claude-opus-5-5 low），主力为 `einzbern-main`（claude-opus-5-5 max）。改共享契约（token 键集、contract/*.json、导出面、门的判定语义、ProductShell 的 prop 面）的包起主力；同一修复目标被退回一次升主力；R1 判断没有点名已被退回的修复目标，本轮各包按包表起档。
- 规模按模型响应数估；每包目标不超过 150，逼近 180 时按 C-4 提交干净状态、写接续点交回。总计约 1660 响应。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告不提交（K12 的 SUB-177 除外，C-9）。verify 只在批末跑一次，不进任何包；R2-36（SUB-177）是最后一个包的最后一张。
- 合入：每波结束主线程按依赖顺序把本波各包合入集成分支。交回物统一为 `runs/r2/handoff/<包>.md`，见红只记写 `runs/r2/problems/<包>.md`；文件名各不相同，不构成文件集相交。

## 共享登记处归属

本表列每波谁可以改共享登记处；空格（—）表示该波没有包可改，需要改的写进交回说明。

| 登记处 | W1 | W2 | W3 | W4 | W5 |
| --- | --- | --- | --- | --- | --- |
| 根 `package.json`、各包 `package.json`、`pnpm-lock.yaml` | — | — | — | — | — |
| `components/Navigation/index.ts`、`src/index.tsx` 与 `index.test.tsx`（导出面） | — | K5（只在挂载要新导出时） | K6（只在新增导出类型时） | — | — |
| `docs/contract/{exemptions,roles,families}.json` | — | K4 | — | — | — |
| `styles/index.ts`（级联表与段登记，M2：登记行随段的归属包走） | K1 | K4 | K6 | K6b | — |
| `styles/shell.css.ts` | K1 | K4 | K6（只加行为属性） | K6b | — |
| `styles/base.css.ts` | K1 | K4 | K6 | K6b | — |
| `styles/brand.css.ts` | K1 | — | — | — | — |
| `styles/shell-sheet.css.ts` | — | K4 | — | — | — |
| `Navigation.tsx` 与 `Navigation.test.tsx` | K1 | K5 | K6 | K6b | — |
| `ShellMenu.tsx` 与测试 | K1 | K5 | K6 | — | — |
| `components/Navigation/shell-copy.ts` | — | — | K6 | — | — |
| 契约 `tokens.json`、五个生成物头、ui-tokens `index.ts` / `tokens.css` | — | K4 | — | — | — |
| ui-tokens `index.test.ts` | K1 | K4 | — | — | — |
| 契约生成器 `scripts/contract-generate.mjs` 与 `icon-paths.generated.ts` | — | — | — | K9（只改注释模板） | — |
| `apps/storybook/src/storybook.css` | K2 | K4（token 块） | — | — | — |
| 页模板 `page-template.tsx` | K2 | K5 | — | K11 | — |
| 页面脚本 `client-scripts.ts` | K2 | K5 | — | — | — |
| story 内容 `story-content.tsx` | — | K5 | K8 | K11 | — |
| story 登记 `governance.ts`、`groups/components.ts`、`components.stories.tsx`、`story-budget.mjs` | — | — | K8（governance、story-budget） | K11 | — |
| `smoke.test.ts` | — | — | — | — | K12 |
| 五语字典 `storybook-content-text.ts` | K2 | — | K8 | K9 | K12 |
| 标题字典 `storybook-locale-text.ts` | — | — | K8 | K11 | K12 |
| 台账 `locale-invariant-ledger.mjs` | K2（只在确需时） | — | — | K9 | K12 |
| `CHANGELOG.md`、`docs/migration-4.0.md` | — | — | — | K9 | K12（只追加 K6b 的迁移条目） |
| 文档与 Storybook 门：`shell-parity`、`storybook-smoke`、`internal-alpha-browser-proof`、`package-contract-manifest`、`selection-grammar-proof` | K3 | — | — | — | — |
| `scripts/shell-fidelity-proof.mjs` | — | K4 | — | K11 | — |
| `scripts/geometry-proof.mjs` | — | — | — | K11 | — |
| 壳层门：`shell-measure.mjs`、`shell-measure-proof.mjs`、`tests/shell-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/shell/` | — | K7 | K10 | K11（只改 stories.screens 与 storyMutations 的登记） | — |
| `scripts/css-template-integrity-proof.mjs` | — | K7 | — | — | — |
| 第一批 geometry-measure 夹具（`all.green.html`、上级 `manifest.json`） | — | — | K10 | — | — |
| 成品板与草案板、`heights.json`、`visual-standard/canvas.json` | — | — | K8 | — | — |
| 回执与门报告 `docs/verification/**`、`owner-acceptance.md` | — | — | — | — | K12（SUB-177） |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| K1（W1） | 包件修复：同源测试、首行、锁定块、C7、Sheet 态、段首标记、纸内焦点、铃铛、页头（经济） | SUB-141 → SUB-143 → SUB-144 → SUB-154 → SUB-159 → SUB-145 → SUB-146 → SUB-162 | `packages/ui-tokens/src/index.test.ts`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx` | — | 130 | `runs/r2/handoff/K1.md` |
| K2（W1） | 文档页模板：比对副本、换字范围、文档壳文案与 Esc、shell-fidelity 漂移（主力） | SUB-165 → SUB-166 → SUB-167 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`apps/storybook/src/story-demo-styles.ts`<br>`apps/storybook/src/storybook.css`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx` | — | 130 | `runs/r2/handoff/K2.md` |
| K3（W1） | 文档与 Storybook 门改期望，browser-proof 三处（主力） | SUB-168 → SUB-169 | `scripts/shell-parity-proof.mjs`<br>`scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/package-contract-manifest.mjs`<br>`scripts/selection-grammar-proof.mjs`<br>`packages/ui-react/README.md` | — | 140 | `runs/r2/handoff/K3.md` |
| K4（W2） | 壳层几何 token 与第二批三族豁免到期（主力） | SUB-142 → SUB-155 | `docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css`<br>`scripts/tokens-sync.mjs`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/styles/shell-sheet.css.ts`<br>`scripts/shell-fidelity-proof.mjs`<br>`packages/ui-react/src/styles/index.ts`<br>`docs/contract/exemptions.json`<br>`docs/contract/roles.json`<br>`docs/contract/families.json`<br>`packages/ui-react/src/styles/base.css.ts` | K1 | 150 | `runs/r2/handoff/K4.md` |
| K5（W2） | 页模板改按段首标记切段、静态页客户端挂载、静态 story 修补（主力） | SUB-170 → SUB-151 → SUB-160 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/build/shell-hydrate.tsx`<br>`apps/storybook/src/build/write-static.ts`<br>`apps/storybook/src/build.tsx`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`<br>`packages/ui-react/src/components/Navigation/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx` | K1、K2 | 150 | `runs/r2/handoff/K5.md` |
| K7（W2） | 壳层门读法与判定补齐（主力） | SUB-174 | `scripts/lib/shell-measure.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/**`<br>`scripts/css-template-integrity-proof.mjs` | — | 130 | `runs/r2/handoff/K7.md` |
| K6（W3） | 包件契约：行钩子、受控搜索词与分类说明、PageHeader 层级、地标名、拖排（主力） | SUB-152 → SUB-147 → SUB-163 → SUB-148 → SUB-149 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`packages/ui-react/src/components/Navigation/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Navigation/ShellPins.tsx`<br>`packages/ui-react/src/components/Navigation/ShellPins.test.tsx`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/test/product-shell-preferences.dom.spec.tsx`<br>`packages/ui-react/src/test/shell-pins.dom.spec.tsx`<br>`packages/ui-react/src/styles/index.ts` | K4、K5 | 145 | `runs/r2/handoff/K6.md` |
| K8（W3） | 设计数据与 story 文字：件数 38、canvas、TreeNav 演示、shell-matrix、读回文字（经济） | SUB-153 → SUB-172 → SUB-157 → SUB-175 → SUB-171 | `docs/design/gplus-2026-10/tools/build-icon.mjs`<br>`docs/design/gplus-2026-10/tools/build-typography.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B1-Typography.dc.html`<br>`docs/design/visual-standard/boards/Icon.dc.html`<br>`docs/design/visual-standard/boards/Typography.dc.html`<br>`docs/design/visual-standard/heights.json`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`docs/design/gplus-2026-10/README.md`<br>`docs/design/visual-standard/canvas.json`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`<br>`apps/storybook/src/contract-stories/governance.ts` | K2、K3、K5 | 130 | `runs/r2/handoff/K8.md` |
| K10（W3） | 145、146 补门（门侧）（主力） | SUB-164 | `scripts/lib/shell-measure.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/**`<br>`tests/fixtures/geometry-measure/all.green.html`<br>`tests/fixtures/geometry-measure/manifest.json`<br>`tests/geometry-measure-proof.test.mjs` | K7 | 100 | `runs/r2/handoff/K10.md` |
| K11（W4） | 消费新 prop 与 145、146 的 story 侧（主力） | SUB-150 → SUB-161 | `apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/build/page-template.tsx`<br>`scripts/geometry-proof.mjs`<br>`scripts/shell-fidelity-proof.mjs`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`<br>`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`<br>`tests/fixtures/geometry-measure/shell/manifest.json`<br>`apps/storybook/src/contract-stories/shell-brand-first-line.tsx`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/components.stories.tsx`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`tests/fixtures/geometry-measure/shell/mutations.json` | K4、K5、K6、K8、K10 | 145 | `runs/r2/handoff/K11.md` |
| K9（W4） | 契约文字、oracle、台账与迁移说明（经济） | SUB-176 → SUB-158 | `apps/storybook/src/build/ai-consumption-contract.ts`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`apps/storybook/src/contract-stories/content/component-rows.ts`<br>`apps/storybook/src/contract-stories/content/navigation-rows.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`CHANGELOG.md`<br>`packages/ui-tokens/README.md`<br>`docs/migration-4.0.md`<br>`docs/design/gplus-2026-10/README.md`<br>`docs/contract/README.md`<br>`scripts/contract-generate.mjs`<br>`packages/ui-react/src/components/Icon/icon-paths.generated.ts` | K3、K4、K6、K8 | 120 | `runs/r2/handoff/K9.md` |
| K6b（W4） | 豁免到期后的组件余项与面包屑图标 token（主力） | SUB-156 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/components/Layout/Layout.tsx`<br>`packages/ui-react/src/components/Layout/Layout.test.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`<br>`packages/ui-react/src/styles/index.ts` | K4、K6 | 70 | `runs/r2/handoff/K6b.md` |
| K12（W5） | apps 单测与样板文案、批末再生（经济） | SUB-173 → SUB-177 | `apps/storybook/src/smoke.test.ts`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`packages/ui-tokens/fonts/**`<br>`packages/ui-tokens/licenses/**`<br>`docs/verification/**`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`<br>`docs/migration-4.0.md` | 其余全部（W1–W4 各包） | 120 | `runs/r2/handoff/K12.md` |

## 偏离判断 §5 的地方

共四处，理由见 `decomposition.md` 第 2.4 节与 `problems/decomposition.md` 第 1 至 4 条：K6 拆出 K6b（W4）承接 R2-11、R2-12 的组件部分；落在 story-content.tsx 的 R2-29 读回文字与 R2-31 第 1321 行改归 K8（W3）；R2-23 的「页内壳传层级 2」改归 K11；R2-20 的菜单分类说明拆成 K6 包侧与 K11 页模板侧。其余包的返工项、档位、前置与波次照判断 §5。

## 共享文件的先后

被两张以上 Subtask 改的文件，按波次与包内顺序先后；跨包时前一个包合入后，后一个包才从集成分支切出。

| 文件 | 先后 |
| --- | --- |
| `apps/storybook/src/build/client-scripts.ts` | SUB-166（K2 W1） → SUB-151（K5 W2） |
| `apps/storybook/src/build/locales/storybook-content-text.ts` | SUB-166（K2 W1） → SUB-153（K8 W3） → SUB-157（K8 W3） → SUB-171（K8 W3） → SUB-176（K9 W4） → SUB-173（K12 W5） |
| `apps/storybook/src/build/locales/storybook-locale-text.ts` | SUB-153（K8 W3） → SUB-161（K11 W4） → SUB-173（K12 W5） |
| `apps/storybook/src/build/page-template.tsx` | SUB-165（K2 W1） → SUB-166（K2 W1） → SUB-170（K5 W2） → SUB-151（K5 W2） → SUB-150（K11 W4） |
| `apps/storybook/src/contract-stories/governance.ts` | SUB-175（K8 W3） → SUB-161（K11 W4） |
| `apps/storybook/src/contract-stories/gplus/sample-stories.tsx` | SUB-150（K11 W4） → SUB-173（K12 W5） |
| `apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx` | SUB-160（K5 W2） → SUB-150（K11 W4） |
| `apps/storybook/src/contract-stories/story-content.tsx` | SUB-151（K5 W2） → SUB-160（K5 W2） → SUB-153（K8 W3） → SUB-157（K8 W3） → SUB-171（K8 W3） → SUB-150（K11 W4） → SUB-161（K11 W4） |
| `apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx` | SUB-160（K5 W2） → SUB-150（K11 W4） |
| `apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx` | SUB-160（K5 W2） → SUB-150（K11 W4） |
| `apps/storybook/src/storybook.css` | SUB-167（K2 W1） → SUB-142（K4 W2） |
| `docs/design/gplus-2026-10/README.md` | SUB-153（K8 W3） → SUB-158（K9 W4） |
| `docs/migration-4.0.md` | SUB-176（K9 W4） → SUB-158（K9 W4） → SUB-177（K12 W5） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx` | SUB-162（K1 W1） → SUB-163（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx` | SUB-163（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/components/Navigation/index.ts` | SUB-151（K5 W2） → SUB-147（K6 W3） |
| `packages/ui-react/src/components/Navigation/Navigation.test.tsx` | SUB-143（K1 W1） → SUB-144（K1 W1） → SUB-154（K1 W1） → SUB-159（K1 W1） → SUB-145（K1 W1） → SUB-146（K1 W1） → SUB-151（K5 W2） → SUB-152（K6 W3） → SUB-147（K6 W3） → SUB-163（K6 W3） → SUB-148（K6 W3） → SUB-149（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/components/Navigation/Navigation.tsx` | SUB-143（K1 W1） → SUB-144（K1 W1） → SUB-154（K1 W1） → SUB-159（K1 W1） → SUB-146（K1 W1） → SUB-151（K5 W2） → SUB-152（K6 W3） → SUB-147（K6 W3） → SUB-163（K6 W3） → SUB-148（K6 W3） → SUB-149（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/components/Navigation/ShellMenu.test.tsx` | SUB-144（K1 W1） → SUB-151（K5 W2） → SUB-147（K6 W3） |
| `packages/ui-react/src/components/Navigation/ShellMenu.tsx` | SUB-144（K1 W1） → SUB-151（K5 W2） → SUB-147（K6 W3） |
| `packages/ui-react/src/components/Navigation/ShellPins.test.tsx` | SUB-148（K6 W3） → SUB-149（K6 W3） |
| `packages/ui-react/src/components/Navigation/ShellPins.tsx` | SUB-148（K6 W3） → SUB-149（K6 W3） |
| `packages/ui-react/src/index.test.tsx` | SUB-151（K5 W2） → SUB-147（K6 W3） |
| `packages/ui-react/src/index.tsx` | SUB-151（K5 W2） → SUB-147（K6 W3） |
| `packages/ui-react/src/styles/base.css.ts` | SUB-145（K1 W1） → SUB-162（K1 W1） → SUB-155（K4 W2） → SUB-163（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/styles/brand.css.ts` | SUB-143（K1 W1） → SUB-144（K1 W1） → SUB-145（K1 W1） |
| `packages/ui-react/src/styles/index.ts` | SUB-145（K1 W1） → SUB-142（K4 W2） → SUB-149（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/styles/shell.css.ts` | SUB-143（K1 W1） → SUB-144（K1 W1） → SUB-154（K1 W1） → SUB-145（K1 W1） → SUB-146（K1 W1） → SUB-142（K4 W2） → SUB-155（K4 W2） → SUB-149（K6 W3） → SUB-156（K6b W4） |
| `packages/ui-react/src/test/shell-menu.dom.spec.tsx` | SUB-159（K1 W1） → SUB-147（K6 W3） |
| `packages/ui-tokens/src/index.test.ts` | SUB-141（K1 W1） → SUB-142（K4 W2） |
| `scripts/internal-alpha-browser-proof.mjs` | SUB-168（K3 W1） → SUB-169（K3 W1） |
| `scripts/lib/locale-invariant-ledger.mjs` | SUB-166（K2 W1） → SUB-176（K9 W4） → SUB-173（K12 W5） |
| `scripts/lib/shell-measure.mjs` | SUB-174（K7 W2） → SUB-164（K10 W3） |
| `scripts/lib/story-budget.mjs` | SUB-175（K8 W3） → SUB-161（K11 W4） |
| `scripts/shell-fidelity-proof.mjs` | SUB-142（K4 W2） → SUB-155（K4 W2） → SUB-150（K11 W4） |
| `scripts/shell-measure-proof.mjs` | SUB-174（K7 W2） → SUB-164（K10 W3） |
| `tests/fixtures/geometry-measure/shell/**` | SUB-174（K7 W2） → SUB-164（K10 W3） → SUB-150（K11 W4） → SUB-161（K11 W4） |
| `tests/shell-measure-proof.test.mjs` | SUB-174（K7 W2） → SUB-164（K10 W3） |

## 各包局部门

### K1 · 包件修复：同源测试、首行、锁定块、C7、Sheet 态、段首标记、纸内焦点、铃铛、页头

- 波次：W1；档位：经济；前置包：无；Subtask：TCRN-DS-SUB-141 → TCRN-DS-SUB-143 → TCRN-DS-SUB-144 → TCRN-DS-SUB-154 → TCRN-DS-SUB-159 → TCRN-DS-SUB-145 → TCRN-DS-SUB-146 → TCRN-DS-SUB-162；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
- 交回：`runs/r2/handoff/K1.md`；见红只记：`runs/r2/problems/K1.md`。

### K2 · 文档页模板：比对副本、换字范围、文档壳文案与 Esc、shell-fidelity 漂移

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-165 → TCRN-DS-SUB-166 → TCRN-DS-SUB-167；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run demo-styles:sync`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
- 交回：`runs/r2/handoff/K2.md`；见红只记：`runs/r2/problems/K2.md`。

### K3 · 文档与 Storybook 门改期望，browser-proof 三处

- 波次：W1；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-168 → TCRN-DS-SUB-169；预计 140 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
- 交回：`runs/r2/handoff/K3.md`；见红只记：`runs/r2/problems/K3.md`。

### K4 · 壳层几何 token 与第二批三族豁免到期

- 波次：W2；档位：主力；前置包：K1；Subtask：TCRN-DS-SUB-142 → TCRN-DS-SUB-155；预计 150 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
- 交回：`runs/r2/handoff/K4.md`；见红只记：`runs/r2/problems/K4.md`。

### K5 · 页模板改按段首标记切段、静态页客户端挂载、静态 story 修补

- 波次：W2；档位：主力；前置包：K1、K2；Subtask：TCRN-DS-SUB-170 → TCRN-DS-SUB-151 → TCRN-DS-SUB-160；预计 150 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- 交回：`runs/r2/handoff/K5.md`；见红只记：`runs/r2/problems/K5.md`。

### K7 · 壳层门读法与判定补齐

- 波次：W2；档位：主力；前置包：无；Subtask：TCRN-DS-SUB-174；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 交回：`runs/r2/handoff/K7.md`；见红只记：`runs/r2/problems/K7.md`。

### K6 · 包件契约：行钩子、受控搜索词与分类说明、PageHeader 层级、地标名、拖排

- 波次：W3；档位：主力；前置包：K4、K5；Subtask：TCRN-DS-SUB-152 → TCRN-DS-SUB-147 → TCRN-DS-SUB-163 → TCRN-DS-SUB-148 → TCRN-DS-SUB-149；预计 145 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
- 交回：`runs/r2/handoff/K6.md`；见红只记：`runs/r2/problems/K6.md`。

### K8 · 设计数据与 story 文字：件数 38、canvas、TreeNav 演示、shell-matrix、读回文字

- 波次：W3；档位：经济；前置包：K2、K3、K5；Subtask：TCRN-DS-SUB-153 → TCRN-DS-SUB-172 → TCRN-DS-SUB-157 → TCRN-DS-SUB-175 → TCRN-DS-SUB-171；预计 130 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-icon.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Icon 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-typography.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Typography 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 交回：`runs/r2/handoff/K8.md`；见红只记：`runs/r2/problems/K8.md`。

### K10 · 145、146 补门（门侧）

- 波次：W3；档位：主力；前置包：K7；Subtask：TCRN-DS-SUB-164；预计 100 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
- 交回：`runs/r2/handoff/K10.md`；见红只记：`runs/r2/problems/K10.md`。

### K11 · 消费新 prop 与 145、146 的 story 侧

- 波次：W4；档位：主力；前置包：K4、K5、K6、K8、K10；Subtask：TCRN-DS-SUB-150 → TCRN-DS-SUB-161；预计 145 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 交回：`runs/r2/handoff/K11.md`；见红只记：`runs/r2/problems/K11.md`。

### K9 · 契约文字、oracle、台账与迁移说明

- 波次：W4；档位：经济；前置包：K3、K4、K6、K8；Subtask：TCRN-DS-SUB-176 → TCRN-DS-SUB-158；预计 120 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run readme:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- 交回：`runs/r2/handoff/K9.md`；见红只记：`runs/r2/problems/K9.md`。

### K6b · 豁免到期后的组件余项与面包屑图标 token

- 波次：W4；档位：主力；前置包：K4、K6；Subtask：TCRN-DS-SUB-156；预计 70 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
- 交回：`runs/r2/handoff/K6b.md`；见红只记：`runs/r2/problems/K6b.md`。

### K12 · apps 单测与样板文案、批末再生

- 波次：W5；档位：经济；前置包：其余全部；Subtask：TCRN-DS-SUB-173 → TCRN-DS-SUB-177；预计 120 响应。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:vendor`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:proof`
  - `corepack pnpm@10.12.1 -C <包树> run fonts:render`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
- 交回：`runs/r2/handoff/K12.md`；见红只记：`runs/r2/problems/K12.md`。
