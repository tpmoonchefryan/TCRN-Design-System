# 交回说明 · W1-F

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
