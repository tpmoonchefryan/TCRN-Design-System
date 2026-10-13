# 摘录 · W5-B（INIT-015 R1）

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
| W5-B | SUB-032 → SUB-033 | `docs/design/gplus-2026-10/storybook-map.md`<br>`docs/design/gplus-2026-10/storybook-map.json`<br>`scripts/storybook-visual-proof.mjs`<br>`tests/storybook-visual-proof.test.mjs`<br>`docs/verification/storybook-visual-proof/**` | 75 | storybook-map.md/json、storybook-visual-proof 与报告 |

包内局部门：

- W5-B：`corepack pnpm@10.12.1 -C <包树> exec node -e "JSON.parse(require('fs').readFileSync('docs/design/gplus-2026-10/storybook-map.json','utf8'))"`；`corepack pnpm@10.12.1 -C <包树> run build`；`corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs`；`corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`

## 本包 Subtask（decomposition.md 第 3 节）

#### TCRN-DS-SUB-032 · 画布板到 story 的映射表（md 与机读 json）

- 包 / 波：W5-B / W5
- 文件：`docs/design/gplus-2026-10/storybook-map.md`，`docs/design/gplus-2026-10/storybook-map.json`
- 依赖：TCRN-DS-SUB-030
- 判据：130 goal：八块入仓画板（G+、构图、五块 B1、产品标）逐行 → story id（SUB-030/031 定的 id）→ 期望格数与测量项；无对应 story 的板写差异与裁定引用；V2-Rejections 与 V2-Families 未入仓单列；json 供门读取
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> exec node -e "JSON.parse(require('fs').readFileSync('docs/design/gplus-2026-10/storybook-map.json','utf8'))"`

#### TCRN-DS-SUB-033 · storybook-visual-proof 重建：映射与 story 清单对账，逐行八项测量报告

- 包 / 波：W5-B / W5
- 文件：`scripts/storybook-visual-proof.mjs`，`tests/storybook-visual-proof.test.mjs`，`docs/verification/storybook-visual-proof/**`
- 依赖：TCRN-DS-SUB-032，TCRN-DS-SUB-034
- 判据：130-GWT1（映射每行有报告行且八项全绿）、130-GWT2（测试里删映射一行判红：映射与 story 清单差集非空）；替换现有 RETIRED 桩；测量只调 scripts/lib/gplus-measure.mjs 与 storybook-routes.mjs（W1 定的 API，不改库）；样板行在 W5-A 合并前缺席，局部跑只判矩阵行；报告写 docs/verification/storybook-visual-proof/，含 UTC 与 HEAD；截图只做目视不做像素比对
- 局部门：
  - `corepack pnpm@10.12.1 -C <包树> run build`
  - `corepack pnpm@10.12.1 -C <包树> exec node scripts/storybook-visual-proof.mjs`
  - `corepack pnpm@10.12.1 -C <包树> exec node --test tests/storybook-visual-proof.test.mjs`

## verify 链影响表中与本包有关的行（第 4 节）

| # | 步骤 | 现判据（摘要） | 焕新后的影响 | 负责 | 转绿 |
| --- | --- | --- | --- | --- | --- |
| 19 | internal-vocab:scan | 渲染文本无工单键、Codex 等 | 新 story 与映射页须守 | SUB-029、SUB-031、SUB-032 | W4、W5 |

## 7. 「Storybook」所指

根脚本 `storybook:build` = `pnpm --filter @tcrn/design-system-storybook build` = `tsc && node dist/build.js`，产出静态文档 `apps/storybook/storybook-static`（README 所称 Track B，Vercel 产物）；`storybook:manager-build` 才是真 Storybook 10.4.6（Track A，输出 storybook-preview-static，已 gitignore，不在 verify）。现有与新增的浏览器门全部量 Track B；START 的「storybook:build 成功」也是 Track B。Story 正文里「Storybook 渲染结果」按 Track B 判；两轨共用 `contract-stories` 注册表，SUB-030/031 同时补 Track A 的 CSF 适配，Track A 不设门。

## 跨包交回（r1/handoff/W1-F.md）

### 交回说明 · W1-F

## 已交付

- SUB-034（c206ee2）：`scripts/lib/gplus-measure.mjs`（八项测量与重叠检查，浏览器侧加 Node 侧）、`scripts/lib/storybook-routes.mjs`（story id → 静态页路由）、`scripts/geometry-measure-proof.mjs`（门骨架，阈值在此）、`tests/geometry-measure-proof.test.mjs`（47 条）、`tests/fixtures/geometry-measure/`（22 个 HTML 加 manifest.json，32 个用例）。
- 局部门 `corepack pnpm@10.12.1 -C <包树> exec node --test tests/geometry-measure-proof.test.mjs`：47/47 通过，约 5 秒；未构建与已构建两种状态都跑过。
- 九项检查各有一份只红在本项的夹具、一份绿夹具，另在 all.green.html 上各注入一条变异（manifest 的 mutationCss）。STORY-131 验收 1 至 3 的夹具版对应 row-align-mutation（选中行首格多 8px）、mark-mutation（padding 2px）、shadow-blur-mutation（模糊 4px）；真实 story 上的变异由 SUB-035 写进 STORY_MUTATIONS。

## API（定稿，W5 只读复用，不改签名；需要改的记问题清单）

### scripts/lib/storybook-routes.mjs

- `GPLUS_MATRIX_STORY_IDS`、`GPLUS_SAMPLE_STORY_IDS`、`GPLUS_STORY_IDS`：跨包约定 7 的十个 id，冻结数组。
- `groupSlug(group)`、`categorySlug(categoryId)`、`groupFileName(group)`、`categoryFileName(group, categoryId)`：与 `apps/storybook/src/build/navigation.ts` 同规则。
- `storySelector(id)` → `[data-contract-story-id="<id>"]`（整篇 article，含文档外壳）；`storyBodySelector(id)` → `[data-contract-story-id="<id>"] > [id="<id>-region"]`（只含 story 渲染内容，门量的就是它）。
- `storyRoute({ id, group, categoryId })` → `{ id, group, categoryId, file, path, selector, bodySelector }`，`path` 形如 `/components-actions.html#actions-matrix`（geometry-proof 的「页面#id」规则）。
- `storyUrl(origin, route, { theme, locale, params })` → `<origin>/<file>?theme=..&locale=..#<id>`。
- `storyRouteTable(registry)`（id 重复即抛错）、`resolveStoryRoutes(ids, registry)` → `{ routes, missing }`（注册表没有的 id 进 missing，不猜页面）。
- `loadStoryRegistry({ root, modulePath })`：动态导入构建后的 `apps/storybook/dist/contract-stories/governance.js` 的 `storyRegistryOrder`；未构建时以 `error.code === "storybook_registry_missing"` 拒绝。
- `expandStory(page, id)`：把折叠的 story 展开（与 geometry-proof 同法）；页面上没有该 story 时抛错。
- 常量 `STATIC_DOCS_ROOT`、`STORY_REGISTRY_MODULE`。

### scripts/lib/gplus-measure.mjs

- `CHECK_IDS`：`clip`、`singleLine`、`shadowBlur`、`rail`、`rowAlign`、`mark`、`contrast`、`controlHeight`、`overlap`。
- 阈值不在库里。`THRESHOLD_KEYS` 列出每项必需的键；`assertThresholds(t)` 逐键校验。门的取值见 `THRESHOLDS`（geometry-measure-proof.mjs）；只想改一项时用 `{ ...THRESHOLDS, contrast: {...} }`。
- `measureInPage(options)`：浏览器侧、自包含，交给 `page.evaluate`。options：`thresholds`（必需）、`root`（选择器，默认 body）、`checks`（子集）、`sampleLimit`（25）、`exemptSelector`（`.sr, .grain, .tcrn-sr-only`）、`singleLineTags`、`shellSelector`（`[data-shell]`）、`markSelector`（`mark`）、`rowsSelector`（`[data-rows]`）、`controlSelector`（默认无）。返回 `{ schemaVersion, root, rootBox, viewport, checks }`，每项 `{ checked, value, violationCount, violations, ...明细 }`；根找不到时返回 `{ error: "root_not_found" }`。
- 各项 value：clip 越界元素数；singleLine 最大行框数；shadowBlur 最大模糊 px（明细 element）；rail 最大偏差 px（明细 shells：guideLefts / textLefts）；rowAlign 最大起点差 px（明细 groups）；mark 违例数；contrast 与期望最大差（明细 cells：ratio / expect / diff / reasons）；controlHeight 最大偏差 px（明细 controls）；overlap 相交对数（violations 带 ox / oy）。
- `judgeMeasurements(raw, thresholds)` → `{ ok, failed, notApplicable, checks }`；每项 `{ status: pass|fail|n/a, checked, value, limit, violationCount, violations, ...明细 }`。checked 为 0 即 n/a。
- `measurePage(page, options)`、`settlePage(page, { networkIdle })`、`startStaticServer(staticRoot)` → `{ origin, close }`。
- `runMeasureTargets({ targets, thresholds, browser, viewport, launchOptions })`：target 为 `{ id, html }` 或 `{ id, url }`，可带 `root`、`prepare(page)`、`mutationCss`（注入变异）、`viewport`、`measure`（额外 options）；没传 browser 就自己启动并关闭 Chromium。返回 `[{ id, raw, verdict }]`。
- Node 侧颜色：`parseColor`（hex 与 rgb/rgba）、`compositeOver`、`relativeLuminance`、`contrastRatio`、`expectedContrast(ink, fills, base)`，与浏览器同公式、同两位小数，可用来从 pairs.json 算 data-expect。

### story 标记约定（矩阵与样板 story 要带）

- 侧栏：外壳 `data-shell="<名>"`；图标、标记、头像 `data-guide="rail"`（距外壳左缘 16）；文字 `data-text="rail"`（48）。外壳里两种钩子都没有算违例。
- 单行：`white-space: nowrap` 的 a/b/span/td/th/button/label/h1–h6/small/kbd/code/p 自动检查；其它元素加 `data-line`。
- 对比：`data-cell="<id>"` 加 `data-expect="<值>"`（没有 data-expect 算违例）；`data-probe` 取 `ph`、`shadow`、`border`、`after-border`、`after-shadow`、`after-bg`（未知值算违例）；`data-kind` 非 text 时门槛 3；`data-exempt` 免最低对比（仍比期望差）。
- 控件高：`data-h="28|32|40"`；声明值不在 28/32/40 之列也算违例。
- 列表行对齐：容器加 `data-rows`；table、role=table/grid/treegrid 自动检查。
- 豁免：`data-measure-skip="<检查名> ..."`，作用于该元素及其后代（重叠检查作用于容器或单个子项）。
- 高亮：默认只认 `<mark>`；若 Typography 用 `.tcrn-highlight__mark` 且不是 mark 元素，传 `measure: { markSelector: "mark, .tcrn-highlight__mark" }`。

### scripts/geometry-measure-proof.mjs

- 导出 `THRESHOLDS`、`DEFAULT_PATHS`（报告 `docs/verification/geometry-measure/report.json`）、`DEFAULT_RUN`（1440×900，light 与 dark，en）、`REQUIRED_CHECKS`（空，SUB-035 按 story 填必须适用的检查，n/a 即红）、`STORY_MUTATIONS`（空，`{ id, storyId, check, css, theme? }`，必须把 check 打红）、`evaluateFixtureCase`、`fixtureCoverage`、`runFixtureSelfCheck`、`runGeometryMeasureProof`。
- 每次运行先跑夹具自检，再按主题量每个 story 的渲染区域。ok 需要：自检通过、静态页与注册表存在、无 missing story、每个 run 无 fail、每条变异被打红。
- CLI：`node scripts/geometry-measure-proof.mjs [--self-check-only] [--story <id>]... [--write-report]`，打印 JSON，不 ok 时退出码 1。`--write-report` 才写报告文件。

## 实测（构建后的包树，构建产物已移出）

- 对现有 55 个注册表 story 的浅色主题跑了一遍：53 个全绿，2 个红（明细见 problems/W1-F.md P1），没有发现测量口径造成的误报；现有 story 没有 data-cell / data-h / data-shell 钩子，所以 contrast、controlHeight、rail 全为 n/a。
- G+ 十个 id 目前都不在注册表里，门如实报 missingStories、不 ok。

## gplus-measure.mjs 分段（39 KB，超读取守卫，按行读）

1–88 头注释、常量、assertThresholds；92–609 measureInPage（clip 201、singleLine 264、shadowBlur 311、rail 344、rowAlign 373、mark 404、contrast 433、controlHeight 491、overlap 530）；611–644 judgeMeasurements；645–741 measurePage、settlePage、startStaticServer、runMeasureTargets；743 起 Node 侧颜色。

## 集外改动需求

- 根 `package.json` 加 `geometry-measure:proof` 脚本并接入 verify：本包文件集外，按 STORY-131 正文属接线（SUB-035 / W5-C）。
- 无其它集外改动；base.css.ts、styles/index.ts、story 源码均未触碰。

## 未做完

无。接真实矩阵与样板 story、填 STORY_MUTATIONS 与 REQUIRED_CHECKS、写报告目录，按拆分属 SUB-035。

## 跨包交回（r1/handoff/W4-A.md）

### 交回说明 · W4-A（SUB-029 → SUB-030）

## 已交付

- SUB-029：`contract-stories/gplus/matrix-renderer.tsx`（格属性、浅色与夜间两块、分节、状态表、`StaticMarkup` 标记编辑）、`matrix-stories.tsx`（五个矩阵与 23 件组件名册 `gplusMatrixComponents`）、`icon-roster.tsx`（37 件 × 14/16/20）。格数 44/28/10/116/42，全部来自 `gplusMatrices`。
- SUB-030：Components 下新类目 `gplus-matrices`（Family matrices），story id 与 registry 顺序为 typography-matrix、icon-matrix、brand-matrix、actions-matrix、inputs-matrix，排在 documents-and-collaboration-templates-spec 之后；五语标题与说明、类目与样张文案五语、W2-C/W3-C 的图标库文案替换、W2-F 的标语；台账删除 `Lucide React`，新增 properNouns 与 `matrixMachineWords`；Track A 适配文件 typography/icon/brand/actions/inputs.stories.tsx，导出 `Matrix`（Storybook id `typography--matrix` 等）。

## 给 W5（SUB-028、SUB-031、SUB-033、SUB-035）

- 路由：类目页 `components-gplus-matrices.html`，故事锚点 `#<story id>`；类目页上故事默认折叠，测量前把 `article[data-story-collapsed]` 设为 `false`（浏览器证明的做法）。
- 测量钩子：板根 `[data-gplus-matrix="<板>"]`（带 `data-gplus-matrix-cell-count`、`data-gplus-matrix-layout`）；两块 `[data-gplus-matrix-theme="light|night"]`，分别带 `data-tcrn-theme="light|dark"`；分节 `[data-gplus-matrix-component="<组件>"]`；格 `data-cell`、`data-kind`、`data-expect`、禁用格 `data-exempt`，探针 `data-probe` 取 ph、shadow、after-border、after-shadow、before-bg（最后一项是 Switch 的钮，测量库需支持）。
- 注册：样板 story 照 `matrix-stories.tsx` 的 `matrixStory` 写法（`storyGovernanceFor` 加 `sourcePath` 覆盖）。smoke 的 CSF 门按 components → typography → icon → brand → actions → inputs 的顺序拼接 Components 组的适配文件，样板导出放进家族文件后，registry 顺序要与拼接顺序一致；`smoke.test.ts` 的 sourcePath 断言按类目判断，新类目需同步。
- 类目上限 8：`gplus-matrices` 已有 5 个，样板请另开类目（例如 gplus-samples）。
- SUB-035 转绿前须先修问题清单第 1 条（页面 CSS 作用域吃掉状态规则），否则全部状态格偏离。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx`：组件 CSS 作用域改写按括号深度切选择器、支持一行多条规则（问题清单 1）。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（问题清单 2）。
3. `packages/ui-react`：ClipboardCopyButton 预览状态入口、TcrnBrandMark 默认尺寸、Text 的 mono 与 numeral-inline 入参、入口导出 `tcrnIconNewNames`（问题清单 3）。
4. `smoke.test.ts` 的 `/TCRN stays regular weight/` 按 W2-F 交回改写（问题清单 4c，批末处置）。

## 未做完

无接续点。story-budget.mjs 与 navigation.ts 无需改动（高度都在 2000 内，类目 5 个）。

