# TCRN-DS-INIT-015 · R1 分包

46 张 Subtask 分 8 波 27 个包。同一波的包并行，后一波从前一波合并后的集成分支（claude/init015-gplus-renewal）切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节；跨包约定见其第 1 节，每个包都必须遵守。

## 规则与校验

- 同一波任意两个包的文件集不相交（含目录前缀重叠），每波并行包数不超过 8；本表由脚本从 `subtasks.json` 的同一份数据生成并校验通过。
- 每个共享登记处每波只归一个包（下表）。没有列在某包文件集里的共享登记处，该包在该波不得改；需要改的写进交回说明。
- 规模按实施档 claude-opus-5-5 low effort 估算（模型响应数），每包目标不超过 120；W2-A、W4-A 预估 115，是最紧的两个包，接近上限时按执行约束提交干净状态并写接续点交回。
- 包完成即退役：只跑表中的局部门，不跑全量 verify、不验收、不写链；回执不提交（W8-A 除外）。
- W2 的家族包（W2-B 至 W2-F）在交回时各写一份 `docs/dispatch/2026-10-11-gplus-renewal/runs/r1/handoff/<包号>.md`：列出需要改但不归本包的 base 段上下文规则、Navigation.test 正则与其它门的预期变化，供 W3-D 与 W6-B 使用。文件名各不相同，不构成文件集相交。

## 共享登记处归属

| 登记处 | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 根 `package.json`（verify 链、脚本、devDependencies） | W1-C | — | W3-B | — | — | W6-A | — | — |
| `pnpm-lock.yaml` | W1-C | W2-C | — | — | — | — | — | — |
| `packages/ui-react/package.json` | — | W2-C | — | — | — | — | W7-A | — |
| `packages/ui-tokens/package.json` | W1-C | — | — | — | — | — | W7-A | — |
| `packages/ui-react/src/index.tsx`（导出与名册） | — | W2-D | — | — | — | — | — | — |
| `packages/ui-react/src/styles/index.ts`（拼接顺序） | W1-B | — | — | — | — | — | — | — |
| `packages/ui-react/src/styles/base.css.ts` | W1-B | 冻结 | W3-D | — | — | — | — | — |
| 契约生成物（styles/generated、icon-paths、product-marks、gplus-tokens、gplus/generated） | W1-A | — | — | — | — | — | — | — |
| `packages/ui-tokens/src/index.ts` 与 tokens.css、storybook.css 的 token 块 | — | W2-A | W3-B（只保留块标记） | — | — | — | — | — |
| `docs/verification/internal-alpha/**` 等回执 | — | — | — | — | — | — | — | W8-A |
| 新门报告目录 | W1-D（doc-shell-class） | — | — | — | W5-B（storybook-visual-proof）、W5-C（geometry-measure） | — | — | — |
| 组件 API 与包契约脚本 | — | W2-C（package-contract）、W2-D（component-api） | — | — | — | — | — | — |
| story 注册表、五语字典、语言不变清单、story 预算 | — | — | — | W4-A | W5-A | — | — | — |
| `apps/storybook/src/smoke.test.ts` | — | — | W3-C | W4-A | W5-A | W6-B | — | — |
| `Navigation.test.tsx` | — | W2-F | W3-D | — | — | — | — | — |
| storybook-smoke / internal-alpha / shell-parity / geometry / full-surface 门脚本 | W1-B（仅 internal-alpha 输入路径） | — | W3-C（仅类名引用） | — | — | W6-B | — | — |

# 波次与包

## W1

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W1-C | SUB-004 → SUB-005 | `package.json`<br>`pnpm-lock.yaml`<br>`scripts/fonts-vendor.mjs`<br>`packages/ui-tokens/fonts/**`<br>`packages/ui-tokens/licenses/**`<br>`packages/ui-tokens/FONT-LICENSES.md`<br>`packages/ui-tokens/package.json`<br>`scripts/fonts-proof.mjs`<br>`tests/fonts-proof.test.mjs` | 105 | 随包字体与 manifest、OFL、fonts-proof 新判据、字体总字节数 |
| W1-A | SUB-008 → SUB-009 | `docs/design/gplus-2026-10/contract/**`<br>`docs/design/gplus-2026-10/tools/data.mjs`<br>`docs/design/gplus-2026-10/tools/lib.mjs`<br>`docs/design/gplus-2026-10/tools/build-actions.mjs`<br>`docs/design/gplus-2026-10/tools/build-inputs.mjs`<br>`docs/design/gplus-2026-10/tools/build-logos2.mjs`<br>`docs/design/gplus-2026-10/tools/build-typography.mjs`<br>`docs/design/gplus-2026-10/tools/build-icon.mjs`<br>`docs/design/gplus-2026-10/tools/build-brand.mjs`<br>`docs/design/gplus-2026-10/README.md`<br>`scripts/contract-generate.mjs`<br>`packages/ui-react/src/styles/generated/**`<br>`packages/ui-react/src/components/Icon/icon-paths.generated.ts`<br>`packages/ui-react/src/components/Navigation/product-marks.generated.ts`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/**` | 95 | contract/*.json、tools/data.mjs、contract-generate.mjs 与全部生成物 |
| W1-B | SUB-010 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/styles/index.ts`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/styles/typography.css.ts`<br>`packages/ui-react/src/styles/icon.css.ts`<br>`packages/ui-react/src/styles/actions.css.ts`<br>`packages/ui-react/src/styles/inputs.css.ts`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`scripts/lib/component-css-sources.mjs`<br>`scripts/css-template-integrity-proof.mjs`<br>`scripts/stamp-whitelist-proof.mjs`<br>`scripts/shell-fidelity-proof.mjs`<br>`scripts/token-extension-proof.mjs`<br>`scripts/component-modifier-proof.mjs`<br>`scripts/selection-grammar-proof.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`apps/storybook/src/build/foundation-visual-standards.ts`<br>`apps/storybook/README.md` | 85 | styles/ 段模块、Navigation.tsx 再导出、六个读源门改读新位置、语义等价证据（提交信息） |
| W1-D | SUB-024 | `scripts/doc-shell-class-proof.mjs`<br>`tests/doc-shell-class-proof.test.mjs`<br>`docs/design/gplus-2026-10/doc-class-map.json`<br>`docs/verification/doc-shell-class/**` | 70 | doc-shell-class-proof 新逻辑（先红）、doc-class-map.json、基线清单 |
| W1-F | SUB-034 | `scripts/lib/gplus-measure.mjs`<br>`scripts/lib/storybook-routes.mjs`<br>`scripts/geometry-measure-proof.mjs`<br>`tests/geometry-measure-proof.test.mjs`<br>`tests/fixtures/geometry-measure/**` | 85 | gplus-measure 库、storybook-routes、门骨架、八项违例夹具与测试 |
| W1-E | SUB-036 | `scripts/contract-static-proof.mjs`<br>`scripts/lib/css-rules.mjs`<br>`tests/contract-static-proof.test.mjs`<br>`docs/contract/**` | 90 | contract-static-proof、规则解析库、条款与豁免文档、变异测试 |

包内局部门：

- W1-C：`corepack pnpm@10.12.1 -C <包树> install`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens pack --pack-destination <scratch>/pack`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/fonts-proof.test.mjs`
- W1-A：`corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<家族>.mjs <canvas.json 中该板的 h>（逐板；build-brand 需三参，取现板内的值）`；`git -C <包树> diff --stat -- docs/design/gplus-2026-10/boards docs/design/gplus-2026-10/logos2`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`；`git -C <包树> status --short`；`corepack pnpm@10.12.1 -C <包树> run typecheck`
- W1-B：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- W1-D：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/doc-shell-class-proof.test.mjs`
- W1-F：`corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
- W1-E：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`

## W2

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W2-A | SUB-001 → SUB-006 | `packages/ui-tokens/src/index.ts`<br>`packages/ui-tokens/src/tokens.css`<br>`apps/storybook/src/storybook.css`<br>`scripts/tokens-sync.mjs`<br>`packages/ui-tokens/src/index.test.ts`<br>`scripts/fonts-proof.mjs` | 115 | G+ token（颜色、字体、形状、动效）、tokens.css 与 storybook token 块再生、别名表 |
| W2-G | SUB-007 | `apps/storybook/src/build/write-static.ts`<br>`apps/storybook/.storybook/preview.ts`<br>`apps/storybook/.storybook/main.ts`<br>`scripts/fonts-render-proof.mjs` | 50 | Storybook 两轨字体加载、fonts-render-proof |
| W2-H | SUB-011 | `scripts/contract-proof.mjs`<br>`tests/contract-proof.test.mjs` | 45 | contract-proof 与测试 |
| W2-B | SUB-012 → SUB-013 | `packages/ui-react/src/components/Typography/Typography.tsx`<br>`packages/ui-react/src/components/Typography/Typography.test.tsx`<br>`packages/ui-react/src/styles/typography.css.ts`<br>`scripts/component-modifier-proof.mjs` | 60 | Typography 三件与 CSS、单测、修饰类门期望 |
| W2-C | SUB-014 → SUB-015 | `packages/ui-react/src/components/Icon/Icon.tsx`<br>`packages/ui-react/src/components/Icon/Icon.test.tsx`<br>`packages/ui-react/src/styles/icon.css.ts`<br>`packages/ui-react/package.json`<br>`pnpm-lock.yaml`<br>`packages/ui-react/README.md`<br>`scripts/package-contract-manifest.mjs` | 70 | Icon 新渲染器、lucide 移除与锁文件 |
| W2-D | SUB-016 → SUB-017 | `packages/ui-react/src/components/Button/Button.tsx`<br>`packages/ui-react/src/components/Button/Button.test.tsx`<br>`packages/ui-react/src/styles/actions.css.ts`<br>`packages/ui-react/src/components/Clipboard/Clipboard.tsx`<br>`packages/ui-react/src/components/Clipboard/static-clipboard.ts`<br>`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`<br>`packages/ui-react/src/components/ButtonGroup/**`<br>`packages/ui-react/src/index.tsx`<br>`scripts/component-api-manifest.mjs` | 100 | Button 族状态对、ButtonGroup 新件与导出、Clipboard 五态 |
| W2-E | SUB-019 → SUB-020 | `packages/ui-react/src/components/Form/Form.tsx`<br>`packages/ui-react/src/components/Form/Form.test.tsx`<br>`packages/ui-react/src/components/Form/multi-select-dropdown.ts`<br>`packages/ui-react/src/styles/inputs.css.ts` | 110 | 十一件表单控件对表 CSS 与行为调整、单测 |
| W2-F | SUB-022 → SUB-023 | `packages/ui-react/src/components/Navigation/Navigation.tsx`<br>`packages/ui-react/src/styles/brand.css.ts`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`scripts/brand-asset-source-proof.mjs`<br>`apps/storybook/src/build/ai-consumption-contract.ts`<br>`scripts/token-extension-proof.mjs`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx` | 100 | 产品标注册表与锁定块、brand-asset 八文件 digest、品牌单测 |

包内局部门：

- W2-A：`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
- W2-G：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-render-proof.mjs`
- W2-H：`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-proof.test.mjs`
- W2-B：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Typography/Typography.test.js`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/component-modifier-proof.mjs`
- W2-C：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Icon/Icon.test.js`；`corepack pnpm@10.12.1 -C <包树> install`；`grep -c lucide <包树>/packages/ui-react/package.json`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/package-contract-manifest.mjs`
- W2-D：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Button/Button.test.js`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Clipboard/Clipboard.test.js packages/ui-react/dist/components/ButtonGroup/ButtonGroup.test.js packages/ui-react/dist/index.test.js`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/component-api-manifest.mjs --check`
- W2-E：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Form/Form.test.js`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
- W2-F：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> exec node --test packages/ui-react/dist/components/Navigation/Navigation.test.js`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/brand-asset-source-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`

## W3

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W3-A | SUB-002 → SUB-003 | `scripts/token-contrast-proof.mjs`<br>`tests/token-contrast-proof.test.mjs`<br>`scripts/token-deprecation-notice.mjs`<br>`tests/token-deprecation-notice.test.mjs`<br>`apps/storybook/src/build.tsx` | 70 | token-contrast-proof 新版、弃用通知脚本与测试 |
| W3-D | SUB-018 → SUB-021 | `packages/ui-react/src/components/Clipboard/Clipboard.tsx`<br>`packages/ui-react/src/components/Clipboard/static-clipboard.ts`<br>`packages/ui-react/src/components/Clipboard/Clipboard.test.tsx`<br>`packages/ui-react/src/styles/base.css.ts`<br>`packages/ui-react/src/components/Navigation/Navigation.test.tsx`<br>`packages/ui-react/src/components/Form/Form.tsx`<br>`packages/ui-react/src/components/Form/Form.test.tsx`<br>`packages/ui-react/src/styles/inputs.css.ts` | 70 | Clipboard copy 图标、DatePicker 日历图标、base 段上下文规则、Navigation.test 断言 |
| W3-B | SUB-025 → SUB-026 | `apps/storybook/src/storybook.css`<br>`apps/storybook/src/story-demo-styles.ts`<br>`scripts/demo-styles-sync.mjs`<br>`package.json`<br>`scripts/selection-grammar-proof.mjs`<br>`scripts/shell-fidelity-proof.mjs`<br>`docs/style-scale.md`<br>`apps/storybook/src/alpha-styles.ts` | 100 | storybook.css、story-demo-styles.ts、alpha-styles.ts 清零与相关门源列表 |
| W3-C | SUB-027 | `apps/storybook/src/build/page-template.tsx`<br>`apps/storybook/src/build/client-scripts.ts`<br>`apps/storybook/src/contract-stories/story-frame.tsx`<br>`apps/storybook/src/contract-stories/story-content.tsx`<br>`apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`<br>`apps/storybook/src/contract-stories/fixtures/overlay.tsx`<br>`apps/storybook/src/contract-stories/visual-instances/**`<br>`apps/storybook/src/internal-dev/**`<br>`apps/storybook/src/smoke.test.ts`<br>`scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/full-surface-remediation-proof.mjs`<br>`scripts/geometry-proof.mjs` | 110 | 文档骨架与 story 标记改前缀、门内类名引用同步 |

包内局部门：

- W3-A：`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`；`corepack pnpm@10.12.1 -C <包树> run storybook:build`
- W3-D：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- W3-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
- W3-C：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

## W4

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W4-A | SUB-029 → SUB-030 | `apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`<br>`apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`<br>`apps/storybook/src/contract-stories/gplus/icon-roster.tsx`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/typography.stories.tsx`<br>`apps/storybook/src/icon.stories.tsx`<br>`apps/storybook/src/brand.stories.tsx`<br>`apps/storybook/src/actions.stories.tsx`<br>`apps/storybook/src/inputs.stories.tsx`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/build/navigation.ts`<br>`apps/storybook/src/smoke.test.ts` | 115 | 矩阵渲染器、五个矩阵 story、注册与五语文案 |
| W4-B | SUB-037 | `scripts/contract-static-proof.mjs`<br>`scripts/lib/css-rules.mjs`<br>`tests/contract-static-proof.test.mjs`<br>`docs/contract/**` | 70 | contract-static 全绿与渲染层检查、豁免登记 |

包内局部门：

- W4-A：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`
- W4-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-static-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/contract-static-proof.test.mjs`

## W5

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W5-C | SUB-028 → SUB-035 | `scripts/doc-sample-style-proof.mjs`<br>`tests/doc-sample-style-proof.test.mjs`<br>`scripts/geometry-measure-proof.mjs`<br>`tests/geometry-measure-proof.test.mjs`<br>`docs/verification/geometry-measure/**` | 85 | geometry-measure-proof 接入与报告、doc-sample-style-proof |
| W5-A | SUB-031 | `apps/storybook/src/contract-stories/gplus/sample-stories.tsx`<br>`apps/storybook/src/contract-stories/gplus/samples/**`<br>`apps/storybook/src/contract-stories/governance.ts`<br>`apps/storybook/src/contract-stories/groups/components.ts`<br>`apps/storybook/src/typography.stories.tsx`<br>`apps/storybook/src/icon.stories.tsx`<br>`apps/storybook/src/brand.stories.tsx`<br>`apps/storybook/src/actions.stories.tsx`<br>`apps/storybook/src/inputs.stories.tsx`<br>`apps/storybook/src/build/locales/storybook-locale-text.ts`<br>`apps/storybook/src/build/locales/storybook-content-text.ts`<br>`scripts/lib/locale-invariant-ledger.mjs`<br>`scripts/lib/story-budget.mjs`<br>`apps/storybook/src/smoke.test.ts` | 100 | 五个构图一样板 story 与注册 |
| W5-B | SUB-032 → SUB-033 | `docs/design/gplus-2026-10/storybook-map.md`<br>`docs/design/gplus-2026-10/storybook-map.json`<br>`scripts/storybook-visual-proof.mjs`<br>`tests/storybook-visual-proof.test.mjs`<br>`docs/verification/storybook-visual-proof/**` | 75 | storybook-map.md/json、storybook-visual-proof 与报告 |

包内局部门：

- W5-C：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-sample-style-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/doc-sample-style-proof.test.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
- W5-A：`corepack pnpm@10.12.1 -C <包树> run typecheck`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/public-naming-proof.mjs`
- W5-B：`corepack pnpm@10.12.1 -C <包树> exec node -e "JSON.parse(require('fs').readFileSync('docs/design/gplus-2026-10/storybook-map.json','utf8'))"`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`

## W6

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W6-A | SUB-038 → SUB-039 → SUB-040 | `package.json`<br>`.github/workflows/verify.yml`<br>`docs/style-scale.md`<br>`docs/contract/README.md`<br>`packages/ui-react/README.md`<br>`apps/storybook/README.md` | 80 | verify 编排、CI 工作流、style-scale 与门文档 |
| W6-B | SUB-041 → SUB-042 | `scripts/storybook-smoke.mjs`<br>`scripts/internal-alpha-browser-proof.mjs`<br>`scripts/shell-parity-proof.mjs`<br>`scripts/geometry-proof.mjs`<br>`scripts/full-surface-remediation-proof.mjs`<br>`scripts/ds-consumption-proof.mjs`<br>`apps/storybook/src/smoke.test.ts`<br>`tests/full-surface-remediation.test.mjs`<br>`tests/ds-consumption-proof.test.mjs` | 110 | 既有浏览器门与冒烟测试按 G+ 重定基线 |

包内局部门：

- W6-A：`corepack pnpm@10.12.1 -C <包树> run geometry:measure`；`corepack pnpm@10.12.1 -C <包树> run contract:static`；`corepack pnpm@10.12.1 -C <包树> run contract:proof`；`node -e "require('fs').readFileSync('<包树>/.github/workflows/verify.yml','utf8')"`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`
- W6-B：`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> run storybook:smoke`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> run shell:parity`；`corepack pnpm@10.12.1 -C <包树> run geometry:proof`；`corepack pnpm@10.12.1 -C <包树> run full-surface:proof`；`corepack pnpm@10.12.1 -C <包树> run ds:consumption:proof`；`corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`

## W7

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W7-A | SUB-043 → SUB-044 → SUB-045 | `packages/ui-tokens/package.json`<br>`packages/ui-copy-state/package.json`<br>`packages/ui-react/package.json`<br>`packages/ui-tokens/README.md`<br>`packages/ui-copy-state/README.md`<br>`packages/ui-react/README.md`<br>`docs/tms-adoption-guide.md`<br>`CHANGELOG.md`<br>`docs/migration-4.0.md`<br>`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` | 70 | 4.0.0 版本面、CHANGELOG、迁移说明、目视验收清单 |

包内局部门：

- W7-A：`corepack pnpm@10.12.1 -C <包树> exec node scripts/version-surface-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/changelog-release-sections-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/scaffold-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> run pack:smoke`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/no-private-input-scan.mjs`

## W8

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W8-A | SUB-046 | `docs/verification/internal-alpha/**`<br>`docs/verification/internal-alpha-hardening-proof.json`<br>`docs/verification/internal-alpha-hardening-proof.md`<br>`docs/verification/scaffold-proof.json`<br>`docs/verification/scaffold-proof.md`<br>`docs/verification/readme-public-contract.json` | 60 | 视觉签名基线选择与 internal-alpha 等回执再生 |

包内局部门：

- W8-A：`corepack pnpm@10.12.1 -C <包树> run internal-alpha:proof`；`corepack pnpm@10.12.1 -C <包树> run scaffold:proof`；`corepack pnpm@10.12.1 -C <包树> run readme:proof`；`corepack pnpm@10.12.1 -C <包树> run pack:smoke`；`corepack pnpm@10.12.1 -C <包树> run storybook:build`

## 波后集成

每波包全部交回后按下列顺序合入集成分支（同波文件集不相交，顺序只为便于读 diff）；冲突交一个集成子代理。建议合并后只跑 `corepack pnpm@10.12.1 -C <集成树> run typecheck` 与 `run build` 确认下一波能从可编译的树切出；红项记问题清单，不在波间修（编译不过使下一波无法开工时按硬阻塞处理）。这是建议，是否执行由主线程按已批准的执行方法决定。

| 波 | 合并顺序 | 合并后应看到 |
| --- | --- | --- |
| W1 | W1-A → W1-B → W1-C → W1-D → W1-E → W1-F | 契约 JSON 与生成物在位；tcrnComponentCss 已拆到 styles/；随包字体在位；doc-shell-class-proof 先红并列出包外类；contract-static 在焕新前预期红 |
| W2 | W2-A → W2-C → W2-B → W2-D → W2-E → W2-F → W2-G → W2-H | contract-proof 的图标名册项转绿（W2-C 与 W2-H 合并后）；token-contrast-proof 预期红到 W3；Navigation.test 的按钮与搜索框正则预期红到 W3 |
| W3 | W3-A → W3-D → W3-B → W3-C | doc-shell-class-proof 计数为 0（W3-B 与 W3-C 合并后，按 doc-class-map 同一份映射）；ui-react 单测回绿 |
| W4 | W4-A → W4-B | 五个矩阵 story 在 storybook-static 可达；contract-static 全绿 |
| W5 | W5-A → W5-B → W5-C | 样板 story 可达；映射表与 story 清单对账为空差；测量报告生成 |
| W6 | W6-A → W6-B | verify 含全部新门；既有浏览器门期望改为 G+ |
| W7 | W7-A | 4.0.0 版本面一致 |
| W8 | W8-A | 视觉签名基线与回执再生，之后主线程跑批末 verify |

## 跨波顺序依据

- W2 等 W1：家族 CSS 要落进 SUB-010 拆出的段模块并引入 SUB-009 的生成段；token 包要读 SUB-009 生成的 token 数据。
- W3 等 W2：Clipboard 的 copy 图标与 DatePicker 的 calendar 图标要等 SUB-014 的 37 件名册合并后才能通过类型检查；文档层清零要在 token 块再生之后改 storybook.css。
- W4 等 W3：矩阵 story 要在文档层清零之后接入（STORY-129 前置 128），且只渲染已焕新的包组件。
- W5 等 W4：样板、映射与测量都要用到 W4 定下的矩阵 story 与注册类目。
- W6 等 W5：verify 编排要接入 W5 才完成的门；既有门的期望要按最终 story 清单改。
- W7、W8 收尾：版本面在全部实现之后；回执与视觉基线在版本面之后再生一次。
