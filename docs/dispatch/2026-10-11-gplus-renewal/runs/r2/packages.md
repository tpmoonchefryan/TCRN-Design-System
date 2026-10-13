# TCRN-DS-INIT-015 · R2 分包

41 张新 Subtask 与既有 SUB-046 分 12 个包、4 个波次，并行上限 3。包从前置包合入后的集成分支（`claude/init015-gplus-renewal`）切出；包内按列出的顺序做。Subtask 的文件、判据与局部门见 `decomposition.md` 第 3 节，跨包约定见其第 1 节。本表与 `subtasks.json` 由同一份数据生成并校验。

## 规则与校验

- 校验结果：键号 TCRN-DS-SUB-047 至 TCRN-DS-SUB-087 连续；父单 id 均属 15 张 Story；每张 Subtask 的跨包依赖都在其包的前置闭包内；包内依赖都排在前面。
- 可能同时运行的包对（彼此无前置关系）共 37 对，文件集两两不相交（含目录前缀重叠）；相交的包对都已用前置关系串开（见「共享文件的先后」）。
- 包完成即退役：只跑表中的局部门，不跑全量 verify、不验收、不写链；回执与新门报告按跨包约定第 6 条只由指定 Subtask 提交。
- 档位：包内只要有一张主力档 Subtask，整包按主力派（einzbern-main）；其余派 einzbern-economy。

## 包表

| 包 | 名称 | Subtask（有序） | 独占文件集 | 档位 | 预计回合 | 须先合入 | 局部门（完整命令见下节） | 交回物 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | 契约 token 输出 | SUB-048 → SUB-049 → SUB-047 | `docs/design/gplus-2026-10/contract/tokens.json`、`scripts/fonts-proof.mjs`、`packages/ui-tokens/src/index.test.ts`、`scripts/fonts-render-proof.mjs`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`packages/ui-tokens/src/tokens.css`、`apps/storybook/src/storybook.css`、`packages/ui-react/src/styles/generated/actions.pairs.ts`、`packages/ui-react/src/styles/generated/inputs.pairs.ts`、`packages/ui-react/src/styles/generated/typography.scale.ts`、`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`、`tests/fonts-proof.test.mjs`、`scripts/contract-generate.mjs`、`packages/ui-tokens/src/index.ts`、`scripts/tokens-sync.mjs`、`scripts/contract-static-proof.mjs`、`tests/contract-static-proof.test.mjs`、`tests/token-deprecation-notice.test.mjs`、`scripts/doc-sample-style-proof.mjs`、`tests/doc-sample-style-proof.test.mjs` | 主力 | 70–90 | 无 | `exec node scripts/contract-generate.mjs`；`exec node scripts/tokens-sync.mjs`；`exec node scripts/tokens-sync.mjs --check`；`--filter @tcrn/ui-tokens build`；`--filter @tcrn/ui-tokens test`；`run build`；`exec node scripts/css-template-integrity-proof.mjs`；`exec node scripts/demo-styles-sync.mjs --check`；`exec node --test tests/token-contrast-proof.test.mjs`；`exec node scripts/token-contrast-proof.mjs`；`exec node --test tests/token-deprecation-notice.test.mjs`；`exec node --test tests/fonts-proof.test.mjs`；`exec node scripts/fonts-proof.mjs`；`exec node scripts/stamp-whitelist-proof.mjs`；`exec node scripts/shell-fidelity-proof.mjs`；`exec node scripts/token-extension-proof.mjs`；`exec node scripts/selection-grammar-proof.mjs`；`run contract:proof`；`run contract:static`；`run fonts:render`；`run geometry:measure`；`run storybook:visual-proof`；`run doc:sample-style` | handoff/P1.md；problems/P1.md 含 tokens:proof 12 段逐段结果与五个子门状态（SUB-049）、ink-3 承载面复核结论（SUB-047） |
| P2 | 刻度、链接与只读焦点 | SUB-052 → SUB-055 → SUB-058 | `docs/design/gplus-2026-10/contract/tokens.json`、`docs/design/gplus-2026-10/contract/typography.json`、`scripts/contract-generate.mjs`、`packages/ui-tokens/src/index.ts`、`packages/ui-tokens/src/index.test.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`packages/ui-react/src/styles/generated/actions.pairs.ts`、`packages/ui-react/src/styles/generated/inputs.pairs.ts`、`packages/ui-react/src/styles/generated/typography.scale.ts`、`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`、`packages/ui-react/src/styles/base.css.ts`、`packages/ui-react/src/styles/typography.css.ts`、`packages/ui-react/src/components/Typography/Typography.test.tsx`、`docs/design/gplus-2026-10/contract/pairs.json`、`packages/ui-react/src/components/Form/Form.test.tsx` | 主力 | 90–120 | P1、P3、P4 | `exec node scripts/contract-generate.mjs`；`exec node scripts/tokens-sync.mjs --check`；`git -C <包树> diff --exit-code -- packages/ui-tokens/src/tokens.css apps/storybook/src/storybook.css`；`--filter @tcrn/ui-tokens build`；`--filter @tcrn/ui-tokens test`；`--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`run contract:proof`；`run contract:static`；`run component-modifiers:proof` | handoff/P2.md 写 tokens.css 与 storybook.css 字节不变的证据、SUB-058 的二选一与 §3.4 第 1 项回显；problems/P2.md |
| P3 | base 段与 contract-proof | SUB-053 → SUB-057 | `packages/ui-react/src/styles/base.css.ts`、`scripts/contract-proof.mjs`、`tests/contract-proof.test.mjs`、`packages/ui-react/src/components/Navigation/Navigation.test.tsx` | 主力 | 30–45 | 无 | `--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`run contract:proof`；`run contract:static` | handoff/P3.md 回显 §3.4 第 6 项；problems/P3.md |
| P4 | Inputs 收尾 | SUB-059 → SUB-060 → SUB-061 → SUB-062 | `packages/ui-react/src/styles/inputs.css.ts`、`apps/storybook/src/smoke.test.ts`、`packages/ui-react/src/components/Form/Form.test.tsx` | 经济 | 45–60 | 无 | `--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`--filter @tcrn/design-system-storybook test`；`run contract:static`；`run full-surface:proof`；`run geometry:measure` | handoff/P4.md 回显 §3.4 第 2、3 项与 SUB-062 的 token 对比计算；problems/P4.md |
| P5 | 文档层与守卫 | SUB-063 → SUB-064 → SUB-050 → SUB-065 | `apps/storybook/src/story-demo-styles.ts`、`apps/storybook/src/alpha-styles.ts`、`apps/storybook/src/storybook.css`、`scripts/shell-fidelity-proof.mjs`、`apps/storybook/src/build/foundation-visual-standards.ts`、`apps/storybook/src/build/ai-consumption-contract.ts`、`scripts/doc-shell-class-proof.mjs`、`tests/doc-shell-class-proof.test.mjs` | 主力 | 95–125 | P1 | `exec node scripts/demo-styles-sync.mjs`；`exec node scripts/demo-styles-sync.mjs --check`；`exec node scripts/shell-fidelity-proof.mjs`；`run build`；`run doc-shell:proof`；`run doc:sample-style`；`run shell:parity`；`run storybook:smoke`；`--filter @tcrn/design-system-storybook test`；`exec node scripts/css-template-integrity-proof.mjs`；`exec node scripts/tokens-sync.mjs --check`；`exec node --test tests/token-contrast-proof.test.mjs`；`exec node scripts/token-contrast-proof.mjs`；`exec node --test tests/token-deprecation-notice.test.mjs`；`exec node --test tests/fonts-proof.test.mjs`；`exec node scripts/fonts-proof.mjs`；`exec node scripts/stamp-whitelist-proof.mjs`；`exec node scripts/token-extension-proof.mjs`；`exec node scripts/selection-grammar-proof.mjs` | handoff/P5.md 逐条列 SUB-065 登记的例外（§3.4 第 8 项）与 oracle 搜索三项前后值（§3.2）；problems/P5.md |
| P6 | 文档 story 与冒烟 | SUB-066 → SUB-067 → SUB-068 → SUB-080 → SUB-081 → SUB-082 | `apps/storybook/src/contract-stories/prototypes/storybook-shell-demos.tsx`、`apps/storybook/src/contract-stories/story-content.tsx`、`apps/storybook/src/smoke.test.ts`、`scripts/storybook-smoke.mjs`、`scripts/geometry-proof.mjs`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`apps/storybook/src/build/locales/storybook-locale-text.ts`、`scripts/lib/locale-invariant-ledger.mjs`、`scripts/s254-story-dom-proof.mjs` | 主力 | 80–105 | P4、P7 | `run build`；`--filter @tcrn/design-system-storybook test`；`run storybook:smoke`；`run geometry:proof`；`run shell:parity`；`exec node scripts/s254-story-dom-proof.mjs`；`run internal-alpha:browser-proof` | handoff/P6.md 列 SUB-066 删掉的断言与 geometry-proof 宿主改指（如有）、§3.4 第 4 项回显；problems/P6.md 含本包末次 storybook:smoke 完整失败清单 |
| P7 | 矩阵与样板标记 | SUB-070 → SUB-071 → SUB-072 → SUB-073 → SUB-074 | `apps/storybook/src/contract-stories/gplus/matrix-stories.tsx`、`apps/storybook/src/contract-stories/gplus/matrix-renderer.tsx`、`apps/storybook/src/contract-stories/gplus/samples/composition-one.tsx`、`apps/storybook/src/build/locales/storybook-content-text.ts`、`scripts/lib/locale-invariant-ledger.mjs` | 经济 | 40–55 | 无 | `run build`；`--filter @tcrn/design-system-storybook test`；`run geometry:measure`；`run storybook:visual-proof`；`run internal-vocab:scan`；`run scan`；`run internal-alpha:browser-proof` | handoff/P7.md 列新增文案的五语值或 ledger 登记；problems/P7.md |
| P8 | 几何门 | SUB-077 → SUB-056 | `scripts/geometry-measure-proof.mjs`、`tests/geometry-measure-proof.test.mjs`、`docs/design/gplus-2026-10/storybook-map.json`、`docs/design/gplus-2026-10/storybook-map.md` | 主力 | 40–60 | P7 | `run build`；`exec node --test tests/geometry-measure-proof.test.mjs`；`run geometry:measure`；`run storybook:visual-proof` | handoff/P8.md 写样板 rail 红属 O-1、probes 清单；problems/P8.md |
| P9 | 浏览器门判定 | SUB-083 → SUB-084 → SUB-085 | `scripts/internal-alpha-browser-proof.mjs`、`scripts/lib/multi-select-dropdown-proof.mjs` | 主力 | 50–70 | 无 | `run build`；`run full-surface:proof`；`exec node scripts/token-contrast-proof.mjs`；`run internal-alpha:browser-proof` | handoff/P9.md 写 clipped 判定前后计数与 axe 豁免条目（§3.4 第 5、7 项）；problems/P9.md |
| P10 | C7 口径 | SUB-079 | `scripts/contract-static-proof.mjs`、`tests/contract-static-proof.test.mjs`、`docs/contract/clauses.md`、`packages/ui-react/src/components/Button/Button.tsx`、`packages/ui-react/src/components/Button/Button.test.tsx` | 主力 | 35–50 | P1 | `--filter @tcrn/ui-react build`；`--filter @tcrn/ui-react test`；`run build`；`run contract:static` | handoff/P10.md 写 Button title 的二选一与 §3.4 第 7 项回显；problems/P10.md |
| P11 | 文档与清理 | SUB-086 → SUB-051 → SUB-054 → SUB-087 | `README.md`、`README.zh-CN.md`、`README.ja.md`、`README.ko.md`、`README.fr.md`、`apps/storybook/src/build/foundation-visual-standards.ts`、`packages/ui-tokens/FONT-LICENSES.md`、`scripts/s254-component-contract-proof.mjs`、`CHANGELOG.md`、`docs/migration-4.0.md`、`packages/ui-tokens/README.md`、`docs/dispatch/2026-10-11-gplus-renewal/owner-acceptance.md` | 经济 | 35–50 | P1、P2、P3、P4、P5、P6、P7、P8、P9、P10 | `run readme:proof`；`run build`；`--filter @tcrn/design-system-storybook test`；`--filter @tcrn/ui-tokens build`；`run pack:smoke`；`git -C <包树> grep -n "s254-component-contract-proof" -- . ":!docs/dispatch"`；`run scaffold:proof` | handoff/P11.md 写 s254 脚本去留与依据；problems/P11.md |
| P12 | 批末再生 | SUB-075 → SUB-069 → SUB-076 → SUB-078 → SUB-046 | `scripts/lib/story-budget.mjs`、`docs/verification/doc-shell-class/r2-clearance.md`、`docs/verification/storybook-visual-proof/gplus-map-report.json`、`docs/verification/storybook-visual-proof/gplus-map-report.md`、`docs/verification/geometry-measure/report.json`、`docs/verification/internal-alpha/**`、`docs/verification/internal-alpha-hardening-proof.json`、`docs/verification/internal-alpha-hardening-proof.md`、`docs/verification/scaffold-proof.json`、`docs/verification/scaffold-proof.md`、`docs/verification/readme-public-contract.json`、`packages/ui-tokens/fonts/**` | 经济 | 50–70 | P11 | `run build`；`run internal-alpha:browser-proof`；`run doc-shell:proof`；`exec node scripts/doc-shell-class-proof.mjs --details`；`exec node scripts/storybook-visual-proof.mjs --write-report`；`run storybook:visual-proof`；`exec node scripts/geometry-measure-proof.mjs --write-report`；`run geometry:measure`；`run internal-alpha:contracts`；`exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`；`run scan`；`exec node scripts/internal-alpha-hardening-proof.mjs`；`run scaffold:proof`；`run readme:proof`；`run pack:smoke`；`run storybook:build`；`exec node scripts/fonts-vendor.mjs --check`；`run fonts:vendor`；`exec node scripts/fonts-proof.mjs` | handoff/P12.md 写宽限表变高条目前后值（§3.2）、视觉基线逐条理由、fonts:vendor 是否执行；SUB-046 提交回执；problems/P12.md |

合计预计 660–900 回合；每包上限 150，最大的 P5 为 95–125。

## 波次与就绪条件

| 波 | 包 | 就绪条件 |
| --- | --- | --- |
| W1 | P1、P3、P4 同起；P7、P9 补位 | 无文件前置。P7 在 P3 收尾腾出位置后起，P9 在 P4 收尾后起（只受并行上限约束） |
| W2 | P2 | P1、P3、P4 都已合入 |
| W2 | P5 | P1 已合入 |
| W2 | P6 | P4、P7 都已合入（P7 为本拆分新增前置） |
| W2 | P8 | P7 已合入 |
| W2 | P10 | P1 已合入 |
| W3 | P11 | P1–P10 全部合入 |
| W4 | P12 | P11 已合入；包内末项 SUB-046 在 SUB-075、069、076、078 之后。P12 完成后主线程跑 R2 末次全量 verify（30 步逐步跑、遇红继续，复合步逐段记） |

### 建议起跑顺序与时间线（估算）

按优先序 P1、P3、P4、P7、P9、P2、P5、P6、P8、P10、P11、P12 贪心补位、并行上限 3，取各包预计回合的中值模拟：

| 包 | 起（回合） | 止（回合） |
| --- | --- | --- |
| P1 | 0 | 80 |
| P3 | 0 | 38 |
| P4 | 0 | 53 |
| P7 | 38 | 86 |
| P9 | 53 | 113 |
| P2 | 80 | 185 |
| P5 | 86 | 196 |
| P6 | 113 | 206 |
| P8 | 185 | 235 |
| P10 | 196 | 239 |
| P11 | 239 | 282 |
| P12 | 282 | 342 |

中值约 342 回合到 P12 结束（下限 285、上限 395），与判断 §5 的关键路径估计 280–360 一致。P2 与 P5 是 W2 里最长的两个包，宜在 P1 合入后最先补位。

## 共享文件的先后

下列文件被多个包改动；包之间已有前置关系，按箭头先后合入，同一时段只有一个包持有。

| 文件 | 先后 |
| --- | --- |
| `docs/design/gplus-2026-10/contract/tokens.json`、`packages/ui-tokens/src/index.test.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`packages/ui-react/src/styles/generated/actions.pairs.ts`、`packages/ui-react/src/styles/generated/inputs.pairs.ts`、`packages/ui-react/src/styles/generated/typography.scale.ts`、`apps/storybook/src/contract-stories/gplus/generated/matrices.generated.ts`、`scripts/contract-generate.mjs`、`packages/ui-tokens/src/index.ts` | P1 → P2 |
| `apps/storybook/src/storybook.css` | P1 → P5 |
| `scripts/contract-static-proof.mjs`、`tests/contract-static-proof.test.mjs` | P1 → P10 |
| `packages/ui-react/src/styles/base.css.ts` | P3 → P2 |
| `packages/ui-react/src/components/Form/Form.test.tsx` | P4 → P2 |
| `apps/storybook/src/smoke.test.ts` | P4 → P6 |
| `apps/storybook/src/build/foundation-visual-standards.ts` | P5 → P11 |
| `apps/storybook/src/build/locales/storybook-content-text.ts`、`scripts/lib/locale-invariant-ledger.mjs` | P7 → P6 |

## 各包局部门（完整命令）

### P1 · 契约 token 输出（主力）

- `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/fonts-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run fonts:render`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> run doc:sample-style`

### P2 · 刻度、链接与只读焦点（主力）

- `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
- `git -C <包树> diff --exit-code -- packages/ui-tokens/src/tokens.css apps/storybook/src/storybook.css`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens test`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run component-modifiers:proof`

### P3 · base 段与 contract-proof（主力）

- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run contract:proof`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`

### P4 · Inputs 收尾（经济）

- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`
- `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`

### P5 · 文档层与守卫（主力）

- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/demo-styles-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/shell-fidelity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> run doc:sample-style`
- `corepack pnpm@10.12.1 -C <包树> run shell:parity`
- `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/css-template-integrity-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/tokens-sync.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-contrast-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/token-deprecation-notice.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/fonts-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/stamp-whitelist-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-extension-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/selection-grammar-proof.mjs`

### P6 · 文档 story 与冒烟（主力）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run storybook:smoke`
- `corepack pnpm@10.12.1 -C <包树> run geometry:proof`
- `corepack pnpm@10.12.1 -C <包树> run shell:parity`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/s254-story-dom-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）

### P7 · 矩阵与样板标记（经济）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> run internal-vocab:scan`
- `corepack pnpm@10.12.1 -C <包树> run scan`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）

### P8 · 几何门（主力）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`

### P9 · 浏览器门判定（主力）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run full-surface:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/token-contrast-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）

### P10 · C7 口径（主力）

- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-react test`
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run contract:static`

### P11 · 文档与清理（经济）

- `corepack pnpm@10.12.1 -C <包树> run readme:proof`（会写回执时跑完还原）
- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/design-system-storybook test`
- `corepack pnpm@10.12.1 -C <包树> --filter @tcrn/ui-tokens build`
- `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
- `git -C <包树> grep -n "s254-component-contract-proof" -- . ":!docs/dispatch"`
- `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`（跑完 git -C <包树> checkout -- docs/verification/scaffold-proof.json docs/verification/scaffold-proof.md 还原回执）

### P12 · 批末再生（经济）

- `corepack pnpm@10.12.1 -C <包树> run build`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:browser-proof`（跑完 git -C <包树> checkout -- docs/verification/internal-alpha 还原回执）
- `corepack pnpm@10.12.1 -C <包树> run doc-shell:proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/doc-shell-class-proof.mjs --details`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs --write-report`
- `corepack pnpm@10.12.1 -C <包树> run storybook:visual-proof`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/geometry-measure-proof.mjs --write-report`
- `corepack pnpm@10.12.1 -C <包树> run geometry:measure`
- `corepack pnpm@10.12.1 -C <包树> run internal-alpha:contracts`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-browser-proof.mjs --update-visual-baseline <selection.json>`
- `corepack pnpm@10.12.1 -C <包树> run scan`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/internal-alpha-hardening-proof.mjs`
- `corepack pnpm@10.12.1 -C <包树> run scaffold:proof`
- `corepack pnpm@10.12.1 -C <包树> run readme:proof`
- `corepack pnpm@10.12.1 -C <包树> run pack:smoke`
- `corepack pnpm@10.12.1 -C <包树> run storybook:build`
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-vendor.mjs --check`
- `corepack pnpm@10.12.1 -C <包树> run fonts:vendor`（仅当 --check 报 R2 新文案缺字形时）
- `corepack pnpm@10.12.1 -C <包树> exec node scripts/fonts-proof.mjs`

`tokens:proof` 12 段的顺序：`exec node scripts/css-template-integrity-proof.mjs`、`exec node scripts/tokens-sync.mjs --check`、`exec node scripts/demo-styles-sync.mjs --check`、`exec node --test tests/token-contrast-proof.test.mjs`、`exec node scripts/token-contrast-proof.mjs`、`exec node --test tests/token-deprecation-notice.test.mjs`、`exec node --test tests/fonts-proof.test.mjs`、`exec node scripts/fonts-proof.mjs`、`exec node scripts/stamp-whitelist-proof.mjs`、`exec node scripts/shell-fidelity-proof.mjs`、`exec node scripts/token-extension-proof.mjs`、`exec node scripts/selection-grammar-proof.mjs`。
