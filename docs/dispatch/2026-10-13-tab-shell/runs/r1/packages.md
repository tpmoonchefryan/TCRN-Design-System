# TCRN-DS-INIT-016 · R1 分包

28 张 Subtask 分 15 个包、9 个波次（P1 切成同一分支上首尾相接的 P1a、P1b、P1c、P1d 四段，段与段严格串行）。同一波的包并行，后一波从前一波合入后的集成分支 `claude/init016-tab-shell` 切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节（C-1 至 C-17），每个包都必须遵守。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包不超过 3；本表由脚本从 `subtasks.json` 的同一份数据生成并校验通过（键号连续、parentId 与链上导出一致、依赖都在更早的波或同包靠前、每包预计不超过 150）。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回说明。
- 规模按经济档（claude-opus-5-5 / low）估模型响应数；每包目标不超过 150。P1 六张 Story 合计约 445，切成四段：P1a 约 120、P1b 约 125、P1c 约 125、P1d 约 75；单次派工逼近 180 时按执行约束提交干净状态、写接续点交回。
- 包完成即退役：只跑表中的局部门，不跑 verify、不验收、不写链；回执与门报告不提交（P15 的 SUB-140 除外，C-12）。
- 合入：每波结束主线程按依赖顺序把本波各包合入集成分支；P1 下一段开始前，主线程把集成分支最新 HEAD 合进 P1 分支（C-15）。verify 只在批末跑一次。
- 交回物统一为 `runs/r1/handoff/<包>.md`，见红只记写 `runs/r1/problems/<包>.md`；文件名各不相同，不构成文件集相交。

## 共享登记处归属

| 登记处 | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 根 `package.json`（脚本、verify 链、版本） | — | — | — | — | — | — | P12（只改 geometry:measure） | — | P15 |
| `packages/*/package.json` 与 `apps/storybook/package.json`（版本面） | — | — | — | — | — | — | — | — | P15 |
| `packages/ui-react/src/components/Navigation/index.ts`（模块导出） | P1a | P1b | P5 | — | — | — | — | — | — |
| `packages/ui-react/src/index.tsx` 与 `index.test.tsx`（公开名单）、`docs/contract/families.json` | P1a | P1b | P5 | — | — | P8 | — | — | — |
| `packages/ui-react/src/styles/index.ts`（级联表） | P1a | — | P5 | — | P7 | P8 | — | — | — |
| `styles/shell.css.ts` 与 `Navigation/shell-copy.ts` | P1a | P1b | P1c | — | P7（只改 shell-copy.ts） | — | — | — | — |
| `Navigation.tsx` 与 `styles/base.css.ts` | P2 | — | P1c | — | P6 | P8 | — | — | — |
| `Navigation.test.tsx` | P2 | P4 | P1c | — | P6 | P8 | — | — | — |
| 契约 `tokens.json` 与五个生成物头、ui-tokens `index.ts` / `index.test.ts` / `tokens.css` | P1a | P4 | — | — | P6 | — | — | — | — |
| 契约 `icons.json` 与 `icon-paths.generated.ts` | P2 | — | — | — | — | — | — | — | — |
| 契约 `matrices.json` 与 `matrices.generated.ts` | P1a（头） | P4 | — | — | P6（头） | P9 | — | — | — |
| `apps/storybook/src/storybook.css` | P1a（token 块） | P4（token 块） | — | — | P6（token 块） | — | P10（文档壳） | — | — |
| `CHANGELOG.md` | P1a | — | — | — | — | P8 | — | — | P15 |
| `docs/migration-4.0.md` | — | — | P1c | — | — | P8 | — | — | P15 |
| story 内容 `story-content.tsx` | — | — | P1c | P1d | P6 | P8 | — | — | — |
| story 登记 `governance.ts`、`groups/components.ts`、`components.stories.tsx`、`smoke.test.ts`、`story-budget.mjs` | — | — | — | P1d | — | P9 | — | P13（只改 smoke.test.ts） | — |
| 五语字典 `storybook-content-text.ts` | — | — | — | P1d | — | P8 | P10 | P14 | — |
| 标题字典 `storybook-locale-text.ts` 与 `locale-invariant-ledger.mjs` | — | — | — | P1d | — | P9 | P10（只改 ledger） | P14（只改 ledger） | — |
| `scripts/contract-proof.mjs` 与测试 | P2 | — | — | — | — | P9 | — | — | — |
| `scripts/geometry-proof.mjs` | — | — | — | P1d | P7 | — | — | — | — |
| `scripts/shell-parity-proof.mjs` | — | — | — | P1d | — | — | — | P13 | — |
| shellFrame：`gplus-measure.mjs`、`geometry-measure-proof.mjs`、geometry-measure 夹具、storybook-map、storybook-visual-proof | — | — | — | — | — | — | — | P14 | — |
| 壳层门：`shell-measure.mjs`、`shell-measure-proof.mjs`、`tests/fixtures/geometry-measure/shell/` | P3 | — | — | — | — | — | P12 | — | — |
| 成品板与草案板（`docs/design/visual-standard/boards`、`docs/design/gplus-2026-10/boards/V2-B1-*`） | P2（Icon） | — | — | — | — | — | P11 | — | — |
| 回执与门报告 `docs/verification/**` | — | — | — | — | — | — | — | — | P15（SUB-140） |

## 包表

| 包 | 名称 | Subtask（包内按序） | 独占文件集 | 前置包 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- | --- | --- |
| P1a（W1） | P1 第 1 段：壳 token、标按钮、固定项 | SUB-113 → SUB-114 → SUB-115 | `docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css`<br>`scripts/tokens-sync.mjs`<br>`CHANGELOG.md`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.tsx`<br>`packages/ui-react/src/components/Navigation/ShellBrandButton.test.tsx`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/components/Navigation/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`docs/contract/families.json`<br>`packages/ui-react/src/components/Navigation/ShellPins.tsx`<br>`packages/ui-react/src/components/Navigation/ShellPins.test.tsx` | — | 120 | `runs/r1/handoff/P1a.md` |
| P2（W1） | 图钉位与名册 pin、ProductLockup 首行变体 | SUB-123 → SUB-127 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`docs/design/gplus-2026-10/contract/icons.json`<br>`packages/ui-react/src/components/Icon/icon-paths.generated.ts`<br>`packages/ui-react/src/components/Icon/Icon.test.tsx`<br>`scripts/contract-proof.mjs`<br>`tests/contract-proof.test.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`<br>`docs/design/visual-standard/boards/Icon.dc.html`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`scripts/brand-asset-source-proof.mjs` | — | 105 | `runs/r1/handoff/P2.md` |
| P3（W1） | 壳层读数库与 18 门（画板夹具） | SUB-135 | `scripts/lib/shell-measure.mjs`<br>`scripts/shell-measure-proof.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/manifest.json`<br>`tests/fixtures/geometry-measure/shell/mutations.json` | — | 110 | `runs/r1/handoff/P3.md` |
| P1b（W2） | P1 第 2 段：完整菜单、下拉与级联 | SUB-116 → SUB-117 → SUB-118 | `packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/components/Navigation/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`docs/contract/families.json`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.tsx`<br>`packages/ui-react/src/components/Navigation/ShellDropdown.test.tsx`<br>`packages/ui-react/src/test/shell-dropdown.dom.spec.tsx` | P1a、P2 | 125 | `runs/r1/handoff/P1b.md` |
| P4（W2） | TMS 后缀夜间回同色 | SUB-128 | `docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css`<br>`scripts/token-contrast-proof.mjs`<br>`tests/token-contrast-proof.test.mjs`<br>`docs/design/gplus-2026-10/contract/matrices.json`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx` | P1a、P2 | 50 | `runs/r1/handoff/P4.md` |
| P1c（W3） | P1 第 3 段：ProductShell 顶带态与固定项偏好 | SUB-119 → SUB-120 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/shell.css.ts`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`<br>`packages/ui-react/src/test/product-shell-preferences.dom.spec.tsx`<br>`docs/migration-4.0.md` | P1b | 125 | `runs/r1/handoff/P1c.md` |
| P5（W3） | 登入动画 | SUB-122 | `packages/ui-react/src/components/Navigation/ShellIntro.tsx`<br>`packages/ui-react/src/components/Navigation/ShellIntro.test.tsx`<br>`packages/ui-react/src/test/shell-intro.dom.spec.tsx`<br>`packages/ui-react/src/styles/shell-intro.css.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/components/Navigation/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`docs/contract/families.json` | P1a | 55 | `runs/r1/handoff/P5.md` |
| P1d（W4） | P1 第 4 段：顶带壳 story 与包侧壳门 | SUB-121 | `apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/components.stories.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/smoke.test.ts`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/geometry-proof.mjs` | P1c、P5 | 75 | `runs/r1/handoff/P1d.md` |
| P6（W5） | PageHeader 必有与纸内布局 | SUB-129 → SUB-130 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`<br>`packages/ui-react/src/components/Layout/Layout.tsx`<br>`packages/ui-react/src/components/Layout/Layout.test.tsx`<br>`docs/design/gplus-2026-10/contract/tokens.json`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`packages/ui-react/src/styles/generated/actions.pairs.ts`<br>`packages/ui-react/src/styles/generated/inputs.pairs.ts`<br>`packages/ui-react/src/styles/generated/typography.scale.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/index.test.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css` | P1d | 110 | `runs/r1/handoff/P6.md` |
| P7（W5） | 手机 Sheet 与 INC-399 门 | SUB-126 | `packages/ui-react/src/components/Navigation/ShellMenu.tsx`<br>`packages/ui-react/src/components/Navigation/ShellMenu.test.tsx`<br>`packages/ui-react/src/test/shell-menu.dom.spec.tsx`<br>`packages/ui-react/src/components/Navigation/shell-copy.ts`<br>`packages/ui-react/src/styles/shell-sheet.css.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`scripts/geometry-proof.mjs` | P1d | 70 | `runs/r1/handoff/P7.md` |
| P8（W6） | 导航家族归位与退役 | SUB-124 → SUB-125 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx`<br>`packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`scripts/selection-grammar-proof.mjs`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/index.tsx`<br>`packages/ui-react/src/index.test.tsx`<br>`docs/contract/families.json`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`<br>`docs/migration-4.0.md`<br>`CHANGELOG.md` | P6 | 140 | `runs/r1/handoff/P8.md` |
| P9（W6） | 壳层矩阵 story | SUB-136 | `docs/design/gplus-2026-10/contract/matrices.json`<br>`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`<br>`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`<br>`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/components.stories.tsx`<br>`apps/storybook/src/smoke.test.ts`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`scripts/lib/story-budget.mjs`<br>`scripts/contract-proof.mjs`<br>`tests/contract-proof.test.mjs` | P4、P7 | 90 | `runs/r1/handoff/P9.md` |
| P10（W7） | 文档壳换顶带壳 | SUB-131 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/alpha-styles.ts`<br>`apps/storybook/src/storybook.css`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/build/navigation.ts`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs` | P8 | 120 | `runs/r1/handoff/P10.md` |
| P11（W7） | 四板 D 段换壳（画板侧） | SUB-133 | `docs/design/gplus-2026-10/tools/shell-screen.mjs`<br>`docs/design/gplus-2026-10/tools/build-shell2.mjs`<br>`docs/design/gplus-2026-10/tools/lib.mjs`<br>`docs/design/gplus-2026-10/tools/build-typography.mjs`<br>`docs/design/gplus-2026-10/tools/build-icon.mjs`<br>`docs/design/gplus-2026-10/tools/build-actions.mjs`<br>`docs/design/gplus-2026-10/tools/build-inputs.mjs`<br>`docs/design/gplus-2026-10/boards/V2-B1-Typography.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B1-Actions.dc.html`<br>`docs/design/gplus-2026-10/boards/V2-B1-Inputs.dc.html`<br>`docs/design/visual-standard/tools/make-standard.mjs`<br>`docs/design/visual-standard/boards/Typography.dc.html`<br>`docs/design/visual-standard/boards/Icon.dc.html`<br>`docs/design/visual-standard/boards/Actions.dc.html`<br>`docs/design/visual-standard/boards/Inputs.dc.html`<br>`docs/design/visual-standard/heights.json` | P8 | 110 | `runs/r1/handoff/P11.md` |
| P12（W7） | 壳层门对真件并串入 geometry:measure | SUB-137 | `scripts/shell-measure-proof.mjs`<br>`scripts/lib/shell-measure.mjs`<br>`tests/shell-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shell/manifest.json`<br>`tests/fixtures/geometry-measure/shell/mutations.json`<br>`package.json`<br>`.github/workflows/verify.yml` | P3、P9 | 100 | `runs/r1/handoff/P12.md` |
| P13（W8） | 文档壳的门收口 | SUB-132 | `scripts/shell-fidelity-proof.mjs`<br>`scripts/doc-shell-class-proof.mjs`<br>`tests/doc-shell-class-proof.test.mjs`<br>`docs/design/gplus-2026-10/doc-class-map.json`<br>`scripts/shell-parity-proof.mjs`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/full-surface-remediation-proof.mjs`<br>`apps/storybook/src/smoke.test.ts` | P10 | 110 | `runs/r1/handoff/P13.md` |
| P14（W8） | 样板换壳（Storybook 侧）、映射与 shellFrame | SUB-134 | `docs/design/gplus-2026-10/storybook-map.json`<br>`docs/design/gplus-2026-10/storybook-map.md`<br>`scripts/lib/gplus-measure.mjs`<br>`scripts/geometry-measure-proof.mjs`<br>`tests/geometry-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/shellFrame.green.html`<br>`tests/fixtures/geometry-measure/shellFrame.red.html`<br>`tests/fixtures/geometry-measure/manifest.json`<br>`apps/storybook/src/compositions.stories.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`<br>`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`<br>`scripts/storybook-visual-proof.mjs`<br>`tests/storybook-visual-proof.test.mjs`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs` | P10、P11 | 110 | `runs/r1/handoff/P14.md` |
| P15（W9） | 4.0.0 候选与批末再生 | SUB-138 → SUB-139 → SUB-140 | `CHANGELOG.md`<br>`docs/migration-4.0.md`<br>`package.json`<br>`packages/ui-tokens/package.json`<br>`packages/ui-react/package.json`<br>`packages/ui-copy-state/package.json`<br>`apps/storybook/package.json`<br>`docs/dispatch/2026-10-13-tab-shell/owner-acceptance.md`<br>`docs/verification/**` | P12、P13、P14 | 140 | `runs/r1/handoff/P15.md` |

## 共享文件的先后

被两个以上包改的文件，按波次先后；同一行里前一个包合入后，后一个包才从集成分支切出。

| 文件 | 先后 |
| --- | --- |
| `CHANGELOG.md` | SUB-113（P1a W1） → SUB-125（P8 W6） → SUB-138（P15 W9） |
| `apps/storybook/src/build/locales/storybook-content-text.ts` | SUB-121（P1d W4） → SUB-124（P8 W6） → SUB-131（P10 W7） → SUB-134（P14 W8） |
| `apps/storybook/src/build/locales/storybook-locale-text.ts` | SUB-121（P1d W4） → SUB-136（P9 W6） |
| `apps/storybook/src/components.stories.tsx` | SUB-121（P1d W4） → SUB-136（P9 W6） |
| `apps/storybook/src/contract-stories/governance.ts` | SUB-121（P1d W4） → SUB-136（P9 W6） |
| `apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） → SUB-136（P9 W6） |
| `apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx` | SUB-119（P1c W3） → SUB-129（P6 W5） → SUB-134（P14 W8） |
| `apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx` | SUB-125（P8 W6） → SUB-134（P14 W8） |
| `apps/storybook/src/contract-stories/groups/components.ts` | SUB-121（P1d W4） → SUB-136（P9 W6） |
| `apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx` | SUB-125（P8 W6） → SUB-131（P10 W7） |
| `apps/storybook/src/contract-stories/story-content.tsx` | SUB-119（P1c W3） → SUB-121（P1d W4） → SUB-129（P6 W5） → SUB-124（P8 W6） → SUB-125（P8 W6） |
| `apps/storybook/src/contract-stories/visual-instances/aos-frontend-shell-slice.tsx` | SUB-119（P1c W3） → SUB-129（P6 W5） |
| `apps/storybook/src/contract-stories/visual-instances/aos-owner-quality-product-shell.tsx` | SUB-119（P1c W3） → SUB-129（P6 W5） |
| `apps/storybook/src/smoke.test.ts` | SUB-121（P1d W4） → SUB-136（P9 W6） → SUB-132（P13 W8） |
| `apps/storybook/src/storybook.css` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） → SUB-131（P10 W7） |
| `docs/contract/families.json` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-118（P1b W2） → SUB-122（P5 W3） → SUB-125（P8 W6） |
| `docs/design/gplus-2026-10/boards/V2-B1-Icon.dc.html` | SUB-123（P2 W1） → SUB-133（P11 W7） |
| `docs/design/gplus-2026-10/contract/matrices.json` | SUB-128（P4 W2） → SUB-136（P9 W6） |
| `docs/design/gplus-2026-10/contract/tokens.json` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `docs/design/visual-standard/boards/Icon.dc.html` | SUB-123（P2 W1） → SUB-133（P11 W7） |
| `docs/migration-4.0.md` | SUB-120（P1c W3） → SUB-125（P8 W6） → SUB-138（P15 W9） |
| `package.json` | SUB-137（P12 W7） → SUB-138（P15 W9） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.test.tsx` | SUB-129（P6 W5） → SUB-130（P6 W5） → SUB-124（P8 W6） |
| `packages/ui-react/src/components/DataDisplay/DomainDisplay.tsx` | SUB-129（P6 W5） → SUB-130（P6 W5） → SUB-124（P8 W6） → SUB-125（P8 W6） |
| `packages/ui-react/src/components/Navigation/Navigation.test.tsx` | SUB-123（P2 W1） → SUB-127（P2 W1） → SUB-128（P4 W2） → SUB-119（P1c W3） → SUB-120（P1c W3） → SUB-129（P6 W5） → SUB-124（P8 W6） → SUB-125（P8 W6） |
| `packages/ui-react/src/components/Navigation/Navigation.tsx` | SUB-123（P2 W1） → SUB-127（P2 W1） → SUB-119（P1c W3） → SUB-120（P1c W3） → SUB-129（P6 W5） → SUB-124（P8 W6） → SUB-125（P8 W6） |
| `packages/ui-react/src/components/Navigation/ShellMenu.test.tsx` | SUB-116（P1b W2） → SUB-117（P1b W2） → SUB-126（P7 W5） |
| `packages/ui-react/src/components/Navigation/ShellMenu.tsx` | SUB-116（P1b W2） → SUB-117（P1b W2） → SUB-126（P7 W5） |
| `packages/ui-react/src/components/Navigation/index.ts` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-118（P1b W2） → SUB-122（P5 W3） |
| `packages/ui-react/src/components/Navigation/shell-copy.ts` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-117（P1b W2） → SUB-118（P1b W2） → SUB-119（P1c W3） → SUB-126（P7 W5） |
| `packages/ui-react/src/index.test.tsx` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-118（P1b W2） → SUB-122（P5 W3） → SUB-125（P8 W6） |
| `packages/ui-react/src/index.tsx` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-118（P1b W2） → SUB-122（P5 W3） → SUB-125（P8 W6） |
| `packages/ui-react/src/styles/base.css.ts` | SUB-123（P2 W1） → SUB-119（P1c W3） → SUB-129（P6 W5） → SUB-130（P6 W5） → SUB-124（P8 W6） → SUB-125（P8 W6） |
| `packages/ui-react/src/styles/generated/actions.pairs.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-react/src/styles/generated/inputs.pairs.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-react/src/styles/generated/typography.scale.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-react/src/styles/index.ts` | SUB-114（P1a W1） → SUB-122（P5 W3） → SUB-126（P7 W5） → SUB-125（P8 W6） |
| `packages/ui-react/src/styles/shell.css.ts` | SUB-114（P1a W1） → SUB-115（P1a W1） → SUB-116（P1b W2） → SUB-118（P1b W2） → SUB-119（P1c W3） |
| `packages/ui-react/src/test/shell-menu.dom.spec.tsx` | SUB-117（P1b W2） → SUB-126（P7 W5） |
| `packages/ui-tokens/src/gplus-tokens.generated.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-tokens/src/index.test.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-tokens/src/index.ts` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `packages/ui-tokens/src/tokens.css` | SUB-113（P1a W1） → SUB-128（P4 W2） → SUB-130（P6 W5） |
| `scripts/contract-proof.mjs` | SUB-123（P2 W1） → SUB-136（P9 W6） |
| `scripts/geometry-proof.mjs` | SUB-121（P1d W4） → SUB-126（P7 W5） |
| `scripts/lib/locale-invariant-ledger.mjs` | SUB-121（P1d W4） → SUB-136（P9 W6） → SUB-131（P10 W7） → SUB-134（P14 W8） |
| `scripts/lib/shell-measure.mjs` | SUB-135（P3 W1） → SUB-137（P12 W7） |
| `scripts/lib/story-budget.mjs` | SUB-121（P1d W4） → SUB-136（P9 W6） |
| `scripts/shell-measure-proof.mjs` | SUB-135（P3 W1） → SUB-137（P12 W7） |
| `scripts/shell-parity-proof.mjs` | SUB-121（P1d W4） → SUB-132（P13 W8） |
| `tests/contract-proof.test.mjs` | SUB-123（P2 W1） → SUB-136（P9 W6） |
| `tests/fixtures/geometry-measure/shell/manifest.json` | SUB-135（P3 W1） → SUB-137（P12 W7） |
| `tests/fixtures/geometry-measure/shell/mutations.json` | SUB-135（P3 W1） → SUB-137（P12 W7） |
| `tests/shell-measure-proof.test.mjs` | SUB-135（P3 W1） → SUB-137（P12 W7） |

## 各包局部门

### P1a · P1 第 1 段：壳 token、标按钮、固定项

- 波次：W1；前置包：无；Subtask：TCRN-DS-SUB-113 → TCRN-DS-SUB-114 → TCRN-DS-SUB-115；预计 120 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
- 交回：`runs/r1/handoff/P1a.md`；见红只记：`runs/r1/problems/P1a.md`。

### P2 · 图钉位与名册 pin、ProductLockup 首行变体

- 波次：W1；前置包：无；Subtask：TCRN-DS-SUB-123 → TCRN-DS-SUB-127；预计 105 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-icon.mjs <docs/design/gplus-2026-10/boards/canvas.json 中 Icon 板的 h>`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `git -C <包树> diff --stat -- docs/design`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 交回：`runs/r1/handoff/P2.md`；见红只记：`runs/r1/problems/P2.md`。

### P3 · 壳层读数库与 18 门（画板夹具）

- 波次：W1；前置包：无；Subtask：TCRN-DS-SUB-135；预计 110 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
- 交回：`runs/r1/handoff/P3.md`；见红只记：`runs/r1/problems/P3.md`。

### P1b · P1 第 2 段：完整菜单、下拉与级联

- 波次：W2；前置包：P1a、P2；Subtask：TCRN-DS-SUB-116 → TCRN-DS-SUB-117 → TCRN-DS-SUB-118；预计 125 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
- 交回：`runs/r1/handoff/P1b.md`；见红只记：`runs/r1/problems/P1b.md`。

### P4 · TMS 后缀夜间回同色

- 波次：W2；前置包：P1a、P2；Subtask：TCRN-DS-SUB-128；预计 50 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 交回：`runs/r1/handoff/P4.md`；见红只记：`runs/r1/problems/P4.md`。

### P1c · P1 第 3 段：ProductShell 顶带态与固定项偏好

- 波次：W3；前置包：P1b；Subtask：TCRN-DS-SUB-119 → TCRN-DS-SUB-120；预计 125 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
- 交回：`runs/r1/handoff/P1c.md`；见红只记：`runs/r1/problems/P1c.md`。

### P5 · 登入动画

- 波次：W3；前置包：P1a；Subtask：TCRN-DS-SUB-122；预计 55 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run brand-asset:proof`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
- 交回：`runs/r1/handoff/P5.md`；见红只记：`runs/r1/problems/P5.md`。

### P1d · P1 第 4 段：顶带壳 story 与包侧壳门

- 波次：W4；前置包：P1c、P5；Subtask：TCRN-DS-SUB-121；预计 75 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 交回：`runs/r1/handoff/P1d.md`；见红只记：`runs/r1/problems/P1d.md`。

### P6 · PageHeader 必有与纸内布局

- 波次：W5；前置包：P1d；Subtask：TCRN-DS-SUB-129 → TCRN-DS-SUB-130；预计 110 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
  - `corepack pnpm@10.12.1 -C <包树> run tokens:proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- 交回：`runs/r1/handoff/P6.md`；见红只记：`runs/r1/problems/P6.md`。

### P7 · 手机 Sheet 与 INC-399 门

- 波次：W5；前置包：P1d；Subtask：TCRN-DS-SUB-126；预计 70 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run test:dom`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- 交回：`runs/r1/handoff/P7.md`；见红只记：`runs/r1/problems/P7.md`。

### P8 · 导航家族归位与退役

- 波次：W6；前置包：P6；Subtask：TCRN-DS-SUB-124 → TCRN-DS-SUB-125；预计 140 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run selection:proof`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`
  - `corepack pnpm@10.12.1 -C <包树> run contract:static`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run exports:check`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 交回：`runs/r1/handoff/P8.md`；见红只记：`runs/r1/problems/P8.md`。

### P9 · 壳层矩阵 story

- 波次：W6；前置包：P4、P7；Subtask：TCRN-DS-SUB-136；预计 90 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run contract:proof`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 交回：`runs/r1/handoff/P9.md`；见红只记：`runs/r1/problems/P9.md`。

### P10 · 文档壳换顶带壳

- 波次：W7；前置包：P8；Subtask：TCRN-DS-SUB-131；预计 120 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- 交回：`runs/r1/handoff/P10.md`；见红只记：`runs/r1/problems/P10.md`。

### P11 · 四板 D 段换壳（画板侧）

- 波次：W7；前置包：P8；Subtask：TCRN-DS-SUB-133；预计 110 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-shell2.mjs final --h1 5324 --h2 4895`
  - `git -C <包树> diff --exit-code -- docs/design/visual-standard/boards/Shell.dc.html docs/design/visual-standard/boards/Shell-2.dc.html`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<typography|icon|actions|inputs>.mjs <canvas.json 中该板的 h>（逐板）`
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/visual-standard/tools/make-standard.mjs docs/design/visual-standard/heights.json`
  - `git -C <包树> diff --stat -- docs/design`
- 交回：`runs/r1/handoff/P11.md`；见红只记：`runs/r1/problems/P11.md`。

### P12 · 壳层门对真件并串入 geometry:measure

- 波次：W7；前置包：P3、P9；Subtask：TCRN-DS-SUB-137；预计 100 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/shell-measure-proof.test.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs --fixtures`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-measure-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- 交回：`runs/r1/handoff/P12.md`；见红只记：`runs/r1/problems/P12.md`。

### P13 · 文档壳的门收口

- 波次：W8；前置包：P10；Subtask：TCRN-DS-SUB-132；预计 110 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
  - `corepack pnpm@10.12.1 -C <包树> run shell:fidelity`
  - `corepack pnpm@10.12.1 -C <包树> run shell:parity`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- 交回：`runs/r1/handoff/P13.md`；见红只记：`runs/r1/problems/P13.md`。

### P14 · 样板换壳（Storybook 侧）、映射与 shellFrame

- 波次：W8；前置包：P10、P11；Subtask：TCRN-DS-SUB-134；预计 110 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
- 交回：`runs/r1/handoff/P14.md`；见红只记：`runs/r1/problems/P14.md`。

### P15 · 4.0.0 候选与批末再生

- 波次：W9；前置包：P12、P13、P14；Subtask：TCRN-DS-SUB-138 → TCRN-DS-SUB-139 → TCRN-DS-SUB-140；预计 140 回合。
- 局部门（按 Subtask 判据挑跑，同一门不为求稳重复跑）：
  - `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
  - `corepack pnpm@10.12.1 -C <包树> run scan`
  - `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
  - `corepack pnpm@10.12.1 -C <包树> run public:naming:proof`
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:build`
  - `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
  - `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
  - `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
  - `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
  - `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- 交回：`runs/r1/handoff/P15.md`；见红只记：`runs/r1/problems/P15.md`。
