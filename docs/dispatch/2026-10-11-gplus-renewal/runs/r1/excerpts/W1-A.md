# 摘录 · W1-A（INIT-015 R1）

本摘录由主线程从 R1 拆分文件切出，只含本包需要的部分；不要去读整份拆分文件。链上 Story 的 scope 仍是任务权威。

## 1. 跨包约定（实施包必须遵守，改动须先回拆分）

1. **Token 变量名由契约定。** `docs/design/gplus-2026-10/contract/tokens.json` 每条带 `cssVar`。颜色用 `--tcrn-color-<短横线键名>`：bg、bg-2、panel、panel-2、line、line-2、line-3、line-ctl、rule、ink、ink-2、ink-3、acc、acc-2、acc-3、acc-bg、acc-ul、on-acc、red、red-bg、red-bg-2、ok、warn、bad、bad-bg、wash、hover、dis、glass、chrome、av-bg、av-ink、knob、surface（焦点环间隙色，跟随承载面）。阴影 `--tcrn-shadow-s1|s2|s3|edge`，焦点环 `--tcrn-focus-ring`，品牌后缀 `--tcrn-brand-suffix-<tms|design-system|einzbern|mana-orchestrate>`（aos 保持现状）。字族、字号行高、圆角、控件高、内距、动效沿用现有 `--tcrn-type-*`、`--tcrn-radius-*`、`--tcrn-motion-*` 体系，新增项的变量名同样写在 tokens.json。旧名（`--tcrn-color-text-*`、`--tcrn-color-border-*`、`--tcrn-color-surface-*`、`--tcrn-color-brand-*` 等）在 SUB-001 里保留为指向新名的弃用别名。
2. **夜间选择器**是 `[data-tcrn-theme="dark"]`（与仓库及 STORY-120/129 一致），不是画板的 `.gp.night`。C5 比较的是主题相关 token 的 `:root` 块与 dark 块；主题无关 token 放独立 `:root` 块（SUB-001 定，门按同一口径比较）。
3. **状态对变量。** 变体声明 `--tcrn-pair-fill-<态>`、`--tcrn-pair-ink-<态>`、`--tcrn-pair-edge-<态>`（Actions 态键 d/h/a/f/x/l/s；Inputs 文本类 d/h/f/r/x/e/ef，勾选类与开关类的附加元组由 pairs.json 定名），基础规则读生效对 `--tcrn-pair-fill|ink|edge|weight`。变体选择器特异性 (0,2,0)，如 `.tcrn-button.tcrn-button--primary`；状态规则写成 `.tcrn-button:where(:hover,[data-tcrn-preview-state="hover"])`，特异性 (0,1,0)，排在基础规则之后，只切换生效对、不写颜色。SUB-010 让 token-extension-proof 接受 `--tcrn-pair-*` 局部变量。
4. **静态状态呈现**用属性 `data-tcrn-preview-state="hover|active|focus"`（矩阵 story 用，与真实伪类共用同一对表），不用无前缀的 `.is-hover` 类。
5. **CSS 段归属。** SUB-010 之后 `tcrnComponentCss` 由 `packages/ui-react/src/styles/index.ts` 按原顺序拼接；家族包只改自己的 `styles/<家族>.css.ts`，并在其中引入 `styles/generated/` 的生成段。`styles/index.ts` 只由 SUB-010 写。`styles/base.css.ts` 在 W2 冻结：家族包若需要改 base 里的家族上下文规则，写进本包交回说明 `runs/r1/handoff/<包号>.md`，由 W3-D（SUB-018、SUB-021）统一处理。
6. **生成物只由生成器写。** `styles/generated/**`、`components/Icon/icon-paths.generated.ts`、`components/Navigation/product-marks.generated.ts`、`packages/ui-tokens/src/gplus-tokens.generated.ts`、`apps/storybook/src/contract-stories/gplus/generated/**` 只由 `node scripts/contract-generate.mjs` 写，文件头注明「由 contract 生成，勿手改」；改契约后重生成。
7. **story id 预先定死**（并行包据此对齐）：矩阵 `typography-matrix`、`icon-matrix`、`brand-matrix`、`actions-matrix`、`inputs-matrix`；样板 `typography-sample-billing`、`icon-sample-project`、`brand-sample-product`、`actions-sample-project`、`inputs-sample-members`。真 Storybook 轨的 CSF 标题为 Typography/Icon/Brand/Actions/Inputs，导出 Matrix、SampleBilling、SampleProject、SampleProduct、SampleMembers，对应 Storybook id `typography--matrix`、`typography--sample-billing` 等（STORY-130 用例）。id 与标题不含 aos/tms/workflow（public-naming-proof）。
8. **新门读包 CSS 一律从 dist 导入。** doc-shell-class、contract-static、contract-proof 从 `packages/ui-react/dist/index.js` 导入 `tcrnComponentCss`（先 build），与源文件布局无关；读源文件的旧门由 SUB-010 改用 `scripts/lib/component-css-sources.mjs`。
9. **测量库 API 在 W1 定稿。** `scripts/lib/gplus-measure.mjs`（浏览器注入的八项测量与重叠检查，加 Node 侧运行入口）与 `scripts/lib/storybook-routes.mjs`（story id → 静态页路由）由 SUB-034 定稿；W5 的 SUB-028、SUB-033、SUB-035 只读复用，不改签名，需要改的记问题清单。
10. **命令形态。** 局部门一律在包树根以 `corepack pnpm@10.12.1 -C <包树> exec node <脚本>` 或 `corepack pnpm@10.12.1 -C <包树> run <脚本>` 执行，不 cd、不 rm。局部门只跑本表列出的门，不跑全量 verify。
11. **回执不在实施包里提交。** `docs/verification/internal-alpha/**`、hardening、scaffold、readme 回执只由 W8-A（SUB-046）提交；其它包若跑了会写回执的脚本，跑完用 `git -C <包树> checkout -- <回执路径>` 还原。各新门自己的报告目录（`docs/verification/doc-shell-class/`、`geometry-measure/`、`storybook-visual-proof/`）归对应 Subtask。
12. **渲染文本约束。** story 渲染文本不含工单键（TCRN-DS-*、STORY-*、EPIC-*、INIT-*）与 Codex（internal-vocabulary-scan）；新可见文案五语齐，或作为机器词登记进 `scripts/lib/locale-invariant-ledger.mjs`。
13. **提交。** 按 Subtask 提交，提交信息带 TCRN-DS-SUB-NNN；git 身份与禁止事项按 START（不推送、不打 tag、不发版、不部署）。

## 本包（packages.md）

| 包 | Subtask（包内按序） | 独占文件集 | 预计响应数 | 交回物 |
| --- | --- | --- | --- | --- |
| W1-A | SUB-008 → SUB-009 | `docs/design/gplus-2026-10/contract/**`<br>`docs/design/gplus-2026-10/tools/data.mjs`<br>`docs/design/gplus-2026-10/tools/lib.mjs`<br>`docs/design/gplus-2026-10/tools/build-actions.mjs`<br>`docs/design/gplus-2026-10/tools/build-inputs.mjs`<br>`docs/design/gplus-2026-10/tools/build-logos2.mjs`<br>`docs/design/gplus-2026-10/tools/build-typography.mjs`<br>`docs/design/gplus-2026-10/tools/build-icon.mjs`<br>`docs/design/gplus-2026-10/tools/build-brand.mjs`<br>`docs/design/gplus-2026-10/README.md`<br>`scripts/contract-generate.mjs`<br>`packages/ui-react/src/styles/generated/**`<br>`packages/ui-react/src/components/Icon/icon-paths.generated.ts`<br>`packages/ui-react/src/components/Navigation/product-marks.generated.ts`<br>`packages/ui-tokens/src/gplus-tokens.generated.ts`<br>`apps/storybook/src/contract-stories/gplus/generated/**` | 95 | contract/*.json、tools/data.mjs、contract-generate.mjs 与全部生成物 |

包内局部门：

- W1-A：`corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<家族>.mjs <canvas.json 中该板的 h>（逐板；build-brand 需三参，取现板内的值）`；`git -C <包树> diff --stat -- docs/design/gplus-2026-10/boards docs/design/gplus-2026-10/logos2`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`；`git -C <包树> status --short`；`corepack pnpm@10.12.1 -C <包树> run typecheck`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-008 · 契约数据抽取：tokens/pairs/matrices/icons/marks/typography 六份 JSON 与无副作用的 tools/data.mjs

- 包 / 波：W1-A / W1
- 文件：`docs/design/gplus-2026-10/contract/**`，`docs/design/gplus-2026-10/tools/data.mjs`，`docs/design/gplus-2026-10/tools/lib.mjs`，`docs/design/gplus-2026-10/tools/build-actions.mjs`，`docs/design/gplus-2026-10/tools/build-inputs.mjs`，`docs/design/gplus-2026-10/tools/build-logos2.mjs`，`docs/design/gplus-2026-10/tools/build-typography.mjs`，`docs/design/gplus-2026-10/tools/build-icon.mjs`，`docs/design/gplus-2026-10/tools/build-brand.mjs`，`docs/design/gplus-2026-10/README.md`
- 依赖：无
- 判据：122 goal：contract 下 tokens.json（T 浅/夜 39 键同集 + 固定 token：surface、focus、三族字栈、圆角、控件高、内距、字号、动效；每条带 cssVar，命名规则见拆分文件「跨包约定」）、pairs.json（Actions 4 变体×7 态 fill/ink/edge 的 token 名；Inputs 文本类 d/h/f/r/x/e/ef、勾选类加 mark 三元组、开关类四元组）、matrices.json（五板 B 段每格：cellId、fill/ink/surface token 名、kind、exempt；格数 44/28/10/116/42）、icons.json（37 名与 20 格路径，9 个新增标 new）、marks.json（四枚标 body 模板、PAL 含 tint、字标与字体、五语标语按 STORY-127）、typography.json（h1–h4、Text size/tone/variant、mark 与链接）；tools 改为经 data.mjs 读 JSON；用 canvas.json 的板高重生成各板与 logos2，逐字节一致，不一致记问题不改板；C9
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node docs/design/gplus-2026-10/tools/build-<家族>.mjs <canvas.json 中该板的 h>（逐板；build-brand 需三参，取现板内的值）`
  - `git -C <包树> diff --stat -- docs/design/gplus-2026-10/boards docs/design/gplus-2026-10/logos2`

#### TCRN-DS-SUB-009 · contract-generate 生成器：变体对 CSS 段、字体刻度段、图标路径、产品标、token 数据与矩阵数据

- 包 / 波：W1-A / W1
- 文件：`scripts/contract-generate.mjs`，`packages/ui-react/src/styles/generated/**`，`packages/ui-react/src/components/Icon/icon-paths.generated.ts`，`packages/ui-react/src/components/Navigation/product-marks.generated.ts`，`packages/ui-tokens/src/gplus-tokens.generated.ts`，`apps/storybook/src/contract-stories/gplus/generated/**`
- 依赖：TCRN-DS-SUB-008
- 判据：122 goal「一个生成脚本产出 tcrnComponentCss 变体对段与 story 矩阵数据」：输出 styles/generated/actions.pairs.ts、inputs.pairs.ts、typography.scale.ts，Icon 路径、产品标 SVG body、gplus token 数据、矩阵数据（每格 expect 用与 lib.mjs cr/fmt 相同算法）；文件头「由 docs/design/gplus-2026-10/contract 生成，勿手改」；幂等（连跑两次无 diff）；变量名 --tcrn-pair-{fill,ink,edge}-<态>、生效对 --tcrn-pair-{fill,ink,edge,weight}；变体选择器 (0,2,0)，状态用 :where(:hover,[data-tcrn-preview-state="hover"]) 等 (0,1,0) 且只切换对、不写颜色；C2/C5
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/contract-generate.mjs`
  - `git -C <包树> status --short`
  - `corepack pnpm@10.12.1 -C <包树> run typecheck`

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

