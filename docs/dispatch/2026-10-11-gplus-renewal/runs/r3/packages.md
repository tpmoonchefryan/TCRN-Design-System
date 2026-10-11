# TCRN-DS-INIT-015 · R3 分包

19 张新 Subtask 与批末重做的 SUB-076、SUB-078、SUB-046 分 6 个包、3 个波次，并行上限 3。包号 P0–P5 即判断 §5 的 R3-P0–R3-P5。包从前置包合入后的集成分支（`claude/init015-gplus-renewal`）切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节，跨包约定见其第 1 节。本表与 `subtasks.json` 由同一份数据生成并校验。

## 规则与校验

- 校验结果：新键 TCRN-DS-SUB-088 至 TCRN-DS-SUB-106 连续，19 张（主力 11、经济 8）；父单 id 均属判断 §4.6 列的 6 张 Story；每张 Subtask 的跨包依赖都在其包的前置闭包内；包内依赖都排在前面；包档位与包内最高档一致。
- 可能同时运行的包对（彼此无前置关系）共 6 对，文件集两两不相交（含目录前缀重叠）；相交的包对都已用前置关系串开（见「共享文件的先后」）。
- 包完成即退役：只跑表中的局部门，不跑全量 verify、不验收、不写链；回执与新门报告按跨包约定第 6 条只由指定 Subtask 提交。
- 档位：包内只要有一张主力档 Subtask，整包按主力派（einzbern-main）；其余派 einzbern-economy。每包预计不超过 150 回合。

## 包表

| 包 | 名称 | Subtask（有序） | 独占文件集 | 档位 | 预计回合 | 须先合入 | 局部门（完整命令见下节） | 交回物 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | 构图三与文案 | SUB-095 → SUB-104 → SUB-096 → SUB-092 | `apps/storybook/src/build/locales/storybook-content-text.ts`、`scripts/lib/locale-invariant-ledger.mjs`、`docs/contract/README.md`、`docs/design/gplus-2026-10/README.md`、`docs/contract/roles.json`、`apps/storybook/src/contract-stories/gplus/samples/composition-three.tsx`、`apps/storybook/src/contract-stories/gplus/sample-stories.tsx`、`apps/storybook/src/contract-stories/groups/components.ts`、`apps/storybook/src/contract-stories/governance.ts`、`apps/storybook/src/inputs.stories.tsx`、`apps/storybook/src/compositions.stories.tsx`、`apps/storybook/src/smoke.test.ts`、`apps/storybook/src/build/locales/storybook-locale-text.ts` | 经济 | 65–90 | 无 | `run build`；`--filter @tcrn/design-system-storybook test`；`run internal-alpha:browser-proof`；`run readme:proof`；`run public-output:scan`；`run internal-vocab:scan`；`run contract:static`；`run doc-shell:proof`；`run scan`；`run storybook:visual-proof`；`run geometry:measure` | handoff/P0.md 写构图三的实际 story id、四处注册点与 CSF 适配位置、TopBar 高度与板的差（如有）、新增词条的五语值或 ledger 登记、SUB-104 探针前后计数；problems/P0.md 含新 story 未被映射引起的 visual-proof 与 geometry:measure 红（交 SUB-093） |
| P1 | 契约与包壳 | SUB-090 → SUB-088 → SUB-097 | `docs/design/gplus-2026-10/contract/tokens.json`、`scripts/contract-generate.mjs`、`packages/ui-tokens/src/index.ts`、`packages/ui-tokens/src/index.test.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`packages/ui-react/src/styles/generated/actions.pairs.ts`、`packages/ui-react/src/styles/generated/inputs.pairs.ts`、`packages/ui-react/src/styles/generated/typography.scale.ts`、`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`、`packages/ui-tokens/src/tokens.css`、`apps/storybook/src/storybook.css`、`packages/ui-react/src/styles/base.css.ts`、`packages/ui-react/src/components/Navigation/Navigation.test.tsx`、`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`、`scripts/token-contrast-proof.mjs`、`tests/token-contrast-proof.test.mjs`、`tests/token-deprecation-notice.test.mjs`、`apps/storybook/src/build/ai-consumption-contract.ts` | 主力 | 110–145 | 无 | `exec node scripts/contract-generate.mjs`；`exec node scripts/tokens-sync.mjs`；`exec node scripts/tokens-sync.mjs --check`；`--filter @tcrn/ui-tokens build`；`--filter @tcrn/ui-tokens test`；`--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`exec node scripts/css-template-integrity-proof.mjs`；`exec node scripts/token-extension-proof.mjs`；`exec node scripts/demo-styles-sync.mjs --check`；`run contract:proof`；`run contract:static`；`run geometry:measure`；`run storybook:visual-proof`；`run storybook:smoke`；`run shell:parity`；`run geometry:proof`；`run full-surface:proof`；`run internal-alpha:browser-proof`；`exec node --test tests/token-contrast-proof.test.mjs`；`exec node scripts/token-contrast-proof.mjs`；`exec node --test tests/token-deprecation-notice.test.mjs` | handoff/P1.md 写 4 个壳层 token 的最终名字与值、所跑全部门的结果、判断 §3.3 第 5 条回显；problems/P1.md 按持有包分列旧壳几何期望（跨包约定第 4 条） |
| P2 | 门与映射 | SUB-098 → SUB-099 → SUB-094 → SUB-093 | `scripts/storybook-smoke.mjs`、`scripts/full-surface-remediation-proof.mjs`、`tests/full-surface-remediation.test.mjs`、`scripts/internal-alpha-browser-proof.mjs`、`scripts/lib/gplus-measure.mjs`、`scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`、`tests/fixtures/geometry-measure/**`、`docs/design/gplus-2026-10/storybook-map.json`、`docs/design/gplus-2026-10/storybook-map.md`、`scripts/storybook-visual-proof.mjs`、`tests/storybook-visual-proof.test.mjs`、`scripts/lib/storybook-routes.mjs` | 主力 | 95–130 | P1、P0 | `run build`；`run storybook:smoke`；`run full-surface:proof`；`run internal-alpha:browser-proof`；`exec node --test tests/geometry-measure-proof.test.mjs`；`run geometry:measure`；`run storybook:visual-proof` | handoff/P2.md 写冒烟与 full-surface 期望的前后值、shellFrame 的阈值与两条变异结果、各 DIFF 的新状态；problems/P2.md |
| P3 | 文档层与残留 | SUB-100 → SUB-089 → SUB-101 → SUB-102 → SUB-105 | `scripts/geometry-proof.mjs`、`apps/storybook/src/contract-stories/story-content.tsx`、`apps/storybook/src/story-demo-styles.ts`、`apps/storybook/src/alpha-styles.ts`、`apps/storybook/src/storybook.css`、`scripts/shell-fidelity-proof.mjs`、`docs/design/gplus-2026-10/doc-class-map.json`、`apps/storybook/src/build/foundation-visual-standards.ts`、`scripts/shell-parity-proof.mjs`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`apps/storybook/src/contract-stories/content/component-rows.ts`、`apps/storybook/src/contract-stories/content/navigation-rows.ts`、`packages/ui-react/src/index.tsx`、`packages/ui-react/src/index.test.tsx` | 主力 | 110–145 | P1、P0 | `exec node scripts/demo-styles-sync.mjs`；`exec node scripts/demo-styles-sync.mjs --check`；`run build`；`run geometry:proof`；`exec node scripts/shell-fidelity-proof.mjs`；`run doc-shell:proof`；`run contract:static`；`--filter @tcrn/design-system-storybook test`；`run shell:parity`；`run storybook:smoke`；`run doc:sample-style`；`run internal-alpha:browser-proof`；`--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`git -C <包树> grep -n -E "DenseOperationsShellDemo|CompactToolShellDemo" -- apps packages scripts` | handoff/P3.md 逐个列被数的 6 个菜单、新登记与删除的例外、oracle 前后值、axe 余下节点（O-2）；problems/P3.md |
| P4 | 文档回写与批末 | SUB-103 → SUB-106 → SUB-076 → SUB-078 → SUB-046 | `docs/style-scale.md`、`apps/storybook/src/build/foundation-visual-standards.ts`、`scripts/lib/story-budget.mjs`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md`、`CHANGELOG.md`、`docs/migration-4.0.md`、`packages/ui-tokens/README.md`、`docs/design/gplus-2026-10/README.md`、`docs/verification/storybook-visual-proof/gplus-map-report.json`、`docs/verification/storybook-visual-proof/gplus-map-report.md`、`docs/verification/geometry-measure/report.json`、`docs/verification/internal-alpha/**`、`docs/verification/internal-alpha-hardening-proof.json`、`docs/verification/internal-alpha-hardening-proof.md`、`docs/verification/scaffold-proof.json`、`docs/verification/scaffold-proof.md`、`docs/verification/readme-public-contract.json`、`packages/ui-tokens/fonts/**`、`docs/verification/doc-shell-class/**` | 经济 | 85–120 | P0、P1、P2、P3、P5 | `run build`；`--filter @tcrn/design-system-storybook test`；`run internal-vocab:scan`；`run public-output:scan`；`run internal-alpha:browser-proof`；`run scaffold:proof`；`--filter @tcrn/ui-tokens build`；`run readme:proof`；`exec node scripts/storybook-visual-proof.mjs --write-report`；`run storybook:visual-proof`；`exec node scripts/geometry-measure-proof.mjs --write-report`；`run geometry:measure`；`run internal-alpha:browser-proof`；`run doc-shell:proof`；`exec node scripts/doc-shell-class-proof.mjs --details`；`run internal-alpha:contracts`；`exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`；`exec node scripts/internal-alpha-hardening-proof.mjs`；`run scaffold:proof`；`run readme:proof`；`run pack:smoke`；`run storybook:build`；`exec node scripts/fonts-vendor.mjs --check`；`run fonts:vendor`；`exec node scripts/fonts-proof.mjs`；`run scan` | handoff/P4.md 写宽限表变动条目前后值、视觉基线逐条理由、fonts:vendor 是否执行、pack:smoke 三个 tarball sha256 与 storybook:build 证据；SUB-046 提交回执；problems/P4.md |
| P5 | MultiSelect 容器 | SUB-091 | `packages/ui-react/src/styles/inputs.css.ts`、`packages/ui-react/src/components/Form/Form.test.tsx` | 主力 | 20–30 | 无 | `--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`run contract:static`；`run full-surface:proof`；`run geometry:measure`；`run storybook:visual-proof` | handoff/P5.md 写四项复核结果与静态展开态读数；problems/P5.md |

合计预计 485–660 回合；每包上限 150，最大的 P1、P3 为 110–145。关键路径 P1 → P3 → P4 约 305–410 回合。

## 波次与就绪条件

| 波 | 包 | 就绪条件 |
| --- | --- | --- |
| W1 | P1、P0、P5 同起 | 无文件前置，三包文件集两两不相交；第一批起跑 |
| W2 | P2 | P1、P0 都已合入 |
| W2 | P3 | P1、P0 都已合入（P0 为本拆分新增前置，见 decomposition §2.1 第 1 条） |
| W3 | P4 | P0、P1、P2、P3、P5 全部合入；包内 SUB-103 → SUB-106 → SUB-076 → SUB-078 → SUB-046。P4 完成后主线程跑 R3 末次全量 verify（30 步逐步跑、44 段，遇红继续），另跑一次真实 `pnpm verify` 记退出码 |

### 建议起跑顺序与时间线（估算）

按优先序 P1、P0、P5、P2、P3、P4 贪心补位、并行上限 3，取各包预计回合的中值模拟：

| 包 | 起（回合） | 止（回合） |
| --- | --- | --- |
| P1 | 0 | 128 |
| P0 | 0 | 78 |
| P5 | 0 | 25 |
| P2 | 128 | 240 |
| P3 | 128 | 255 |
| P4 | 255 | 358 |

中值约 358 回合到 P4 结束（下限 305、上限 410），与判断 §5.1 的关键路径估计 305–410 一致。P0 与 P5 在 P1 收尾前结束，P2、P3 在 P1 合入后同时补位；P3 新增的前置 P0 不推迟它的起跑。

## 共享文件的先后

下列文件被多个包改动；包之间已有前置关系，按箭头先后合入，同一时段只有一个包持有。

| 文件 | 先后 |
| --- | --- |
| `apps/storybook/src/build/locales/storybook-content-text.ts` | P0 → P3 → P4 |
| `docs/design/gplus-2026-10/README.md` | P0 → P4 |
| `apps/storybook/src/storybook.css` | P1 → P3 |
| `apps/storybook/src/build/foundation-visual-standards.ts` | P3 → P4 |

## 各包局部门（完整命令）

### P0 · 构图三与文案（经济）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof（会写回执时跑完还原）`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> run scan`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`

### P1 · 契约与包壳（主力）

- `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- `corepack pnpm@10.12.1 -C <包树> run shell:parity`
- `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`

### P2 · 门与映射（主力）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

### P3 · 文档层与残留（主力）

- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run shell:parity`
- `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- `corepack pnpm@10.12.1 -C <包树> run doc:sample-style`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `git -C <包树> grep -n -E "DenseOperationsShellDemo|CompactToolShellDemo" -- apps packages scripts`

### P4 · 文档回写与批末（经济）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- `corepack pnpm@10.12.1 -C <包树> run public-output:scan`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> run scaffold:proof（跑完 git -C <包树> checkout -- docs/verification/scaffold-proof.json docs/verification/scaffold-proof.md 还原回执）`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof（会写回执时跑完还原）`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs --write-report`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs --details`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof`
- `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
- `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> run fonts:vendor（仅当 --check 报 R3 新文案缺字形时）`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run scan（最后一次文档提交之后）`

### P5 · MultiSelect 容器（主力）

- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

