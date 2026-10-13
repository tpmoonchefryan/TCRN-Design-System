# 摘录附件 · W6-A：各新门的接线说明（W1-E、W2-G、W2-H、W3-A、W5-B、W5-C 交回）

只读各交回里关于 package.json 脚本名、verify 顺序（读 dist 的门排在 build 之后、浏览器门的前置）、测试文件接线与 README/style-scale 文字的条目。


## 交回 W1-E

### 交回说明 · W1-E

## 已交付

- SUB-036（f8cbe4e）：契约静态门 `scripts/contract-static-proof.mjs`、规则解析库 `scripts/lib/css-rules.mjs`（自写，无依赖）、测试 `tests/contract-static-proof.test.mjs`（41 条：解析器、夹具全绿、STORY-132 GWT1–3、每条规则一条转红变异、豁免与登记校验、仓内契约文件一致性），以及 `docs/contract/` 四份文件：`clauses.md`（C1–C17 原文与各条落点）、`families.json`（16 家族与根类）、`exemptions.json`（第二至五批 11 个家族，七条款，引用 INIT-015 不授权段与 P4）、`roles.json`（C7 单行角色、C8 工具栏）。
- 现仓结果（build 之后）：C2 红 9、C5 红 1、C13 红 160；C6、C7、C8、C11 绿。逐条见 `problems/W1-E.md` P1–P5。

## 给 W4-B（SUB-037）

- **转绿清单。** STORY-132 GWT4「现仓全绿」要清的就是 problems/W1-E.md 的 P1–P5：链接与 MultiSelect 选项的状态规则改对表（P1、P2，P1 的 G+ 段是生成物）；`inputs.css.ts` 里壳层上下文压 SearchInput 的特异性（P3）；主题图标的浅色声明（P4）；158 个文档层类改 `tcrn-doc-` 或删除，两个第一批包外类（`tcrn-input--short`、`tcrn-search-input--compact`）进包或换用已有修饰类（P5）。
- **豁免机制。** `exemptions.json` 每条恰有 `family`、`classes`、`selectors` 之一，`clauses` 只收 C2/C5/C6/C7/C8/C11/C13，`ruling` 必填。第一批家族、其类、选中其类的选择器都不能登记，登记了门判红。没有 tcrn-* 类的选择器（如 P4）只能用 `selectors` 精确登记。报告的 `scope.unusedExemptions` 列出本次没命中的条目（现为 identity）。
- **story 层留给你的部分。** C7 的 title 属性与容器矩阵下不换行、C8 的量测让步（让步项到 min-width 后其余不被压）、C11 的元素嵌套深度、四级语义同形、通用件拼壳、渲染文本里的表情字符（拆分 P4 的 LockHint「🔒」在这里）。C13 已由本门经 doc-shell-class-proof 的差集静态覆盖，story 层不必重算。
- **可复用的导出。** `evaluateContract({ packageCss, tokensCss, families, exemptions, roles, pairs, outOfPackage })` 是纯函数；`runContractStaticProof({ root })` 读 dist 与契约文件；`checkC2/C5/C6/C7/C8/C11/C13`、`selectorFacts`、`buildScope`、`validateExemptions` 可单独调用。解析库导出 `parseCss`、`compounds`、`parseCompound`、`specificity`、`selectorClasses`（`targetOnly` 去掉 `:not()`、`:has()` 里的类）、`shadowLayers`、`colourLiterals`、`emojiIn`。story 层若与本门共用家族归属，读同一份 `families.json`，按 `blockOf`（去掉 `__` 与 `--`）归类。
- **接入 verify。** 需要改 `package.json`（不在本包文件集）：脚本 `"contract:static": "node --test tests/contract-static-proof.test.mjs && node scripts/contract-static-proof.mjs"`，接在 verify 的 `doc-shell:proof` 之后（C13 需要构建后的静态文档；差集算不出时门判红 `C13.input-missing`，不跳过）。
- **口径可改处。** problems/W1-E.md P9 列了本包自定的判定口径（透明 outline 允许项、无变体时的 (0,2,0)、左边条 2px 阈值、状态类 ARIA 列表等），都写在 `docs/contract/clauses.md`；要改时同步改门里的常量与测试的允许项用例。

## 命令

在包树根：`corepack pnpm@10.12.1 -C <树> run build`，然后 `corepack pnpm@10.12.1 -C <树> exec node --test tests/contract-static-proof.test.mjs` 与 `corepack pnpm@10.12.1 -C <树> exec node scripts/contract-static-proof.mjs [--details] [--report <path>]`。门不写回执，也不写仓内文件（`--report` 只写到给定路径）。

## 交回 W2-G

### INIT-015 R1 · W2-G 交回说明（SUB-007 与画布色）

SUB-007 已完成，画布色这项小事也已完成，没有接续点。本文只记录后续包需要对齐的事实，以及本包文件集以外需要的改动。

## 1. 静态轨（apps/storybook/src/build/write-static.ts）

- 构建会把 `@tcrn/ui-tokens` 字体清单里的每个字体文件原名复制到 `storybook-static/fonts/`。复制后逐个校验字节数和 sha256，不一致就以 `storybook_fonts_copy_differs` 报错退出。每个字族的 OFL 文本复制到 `storybook-static/licenses/`。构建拥有这两个目录，清单里没有的旧文件会被清掉。
- 包内的 `fonts.css` 写成 `storybook-static/tcrn-fonts.css`。改写只有一处：把 `url("./<face>")` 改成 `url("fonts/<face>")`，另外在文件头加了一行说明。如果出现以下任一情况，构建会以 `storybook_fonts_*` 报错退出：清单外的字体、未声明的字体、data: URI、远程 URL、googleapis 或 gstatic、改写后仍不合规的 url。
- 每页 `<head>` 里、`<title>` 之前注入一行，且只注入一次：`<link rel="stylesheet" href="tcrn-fonts.css" data-tcrn-font-source="@tcrn/ui-tokens/fonts.css" />`。
- 导出的常量和函数：`STATIC_FONT_DIR`、`STATIC_FONT_LICENSE_DIR`、`STATIC_FONT_STYLESHEET`、`STATIC_FONT_SOURCE`、`rewriteFontStylesheet(css, faces)`、`linkFontStylesheet(html, label)`。构建摘要里新增了 `fonts` 字段，记录目录、字体数、字节数、许可数和样式表名。

## 2. 真 Storybook 轨与画布色

- `preview.ts` 引入 `@tcrn/ui-tokens/fonts.css`，由 Vite 输出哈希名副本，内容逐字节相同。`main.ts` 的 staticDirs 把包内字体目录挂到 `/fonts`；目录路径用 `import.meta.resolve("@tcrn/ui-tokens/fonts.css")` 解析，不写死仓库布局。
- 画布色统一取 `--tcrn-color-bg`，浅色为 #efeeea，夜间为 #121210。`client-scripts.ts` 导出 `storybookCanvasColors`，其 light 与 dark 两个值都从 `createResolvedTokenMap(theme)["--tcrn-color-bg"]` 读取；如果读到的不是六位十六进制色，构建会报错。以下三处都从这里取值：`page-template.tsx` 的首屏 theme-color meta、切换主题时用的镜像值、`preview.ts` 的「TCRN canvas」。

## 3. 给 W4-A：smoke.test 画布断言的新写法

文件头的 import 需要加上 `createResolvedTokenMap`。旧测试「canvas color and theme-color first-paint mirror the surface-canvas token」整条替换为：

```ts
test("canvas color and theme-color first-paint mirror the G+ ground token", () => {
  const canvasLight = createResolvedTokenMap("light")["--tcrn-color-bg"];
  const canvasDark = createResolvedTokenMap("dark")["--tcrn-color-bg"];
  assert.match(canvasLight, /^#[0-9a-f]{6}$/i);
  assert.match(canvasDark, /^#[0-9a-f]{6}$/i);
  const preview = readStorybookSource(".storybook/preview.ts");
  assert.match(preview, /createResolvedTokenMap\("light"\)\["--tcrn-color-bg"\]/);
  assert.match(preview, /"TCRN canvas",\s*value:\s*tcrnCanvas\b/);
  assert.doesNotMatch(preview, /#[0-9a-f]{6}\b/i, "preview.ts must not hand-copy a canvas hex");
  const componentsPage = readGroupPage("Components");
  assert.ok(componentsPage.includes('<meta name="theme-color" content="' + canvasLight + '" data-storybook-theme-color'));
  assert.match(componentsPage, new RegExp('light:\\s*"' + escapeRegExp(canvasLight) + '",\\s*dark:\\s*"' + escapeRegExp(canvasDark) + '"'));
  const clientScripts = readStorybookSource("src/build/client-scripts.ts");
  assert.match(clientScripts, /createResolvedTokenMap\(theme\)\["--tcrn-color-bg"\]/);
  assert.doesNotMatch(clientScripts, /(?:light|dark):\s*"#[0-9a-f]{6}"/i);
});
```

如果 P2 把 backgrounds 改成 `options` 形态，第二条 `preview` 断言要改成 `/name:\s*"TCRN canvas",\s*value:\s*tcrnCanvas\b/`。

## 4. fonts-render-proof（scripts/fonts-render-proof.mjs）

- 运行方式是 `node scripts/fonts-render-proof.mjs [--root <dir>]`，要先 `pnpm build`。
- 导出接口：`runFontsRenderProof({ root })` 返回 `{ ok, checks, cdn: { strings, requests } }`；另有 `familyProbes(manifest)`、`headingProbes()` 和若干目录常量。
- 共八条腿：copies、stylesheet、pages、cdn-strings、network（加载全部 35 页，并逐字节核对下载到的字体）、families（10 个字族与字重组合）、fallback（「季度复盘」配合 `--tcrn-type-family-heading`，在 400 与 600 两个字重下检查）、control（屏蔽 fonts/ 后应回退到系统字体，本机为 Songti SC）。
- 「用什么字体绘制」取自 CDP 的 `CSS.getPlatformFontsForNode`。可变字体报出的 familyName 是默认实例名，例如 Noto Sans SC Thin、Noto Serif SC ExtraLight，所以按前缀匹配。后续门如果复用这个办法，也要按前缀匹配。
- 变异自测做过：给一个字体副本多加一个字节，再删掉一页的 link，copies、pages、network、families 四条腿随即判红。之后已重新构建复原。

## 5. 本包文件集以外需要的改动

1. 根 `package.json` 增加 `fonts:render-proof` 脚本，并接进 verify（问题清单 P4）。
2. `apps/storybook/src/smoke.test.ts` 的画布断言改法见第 3 节（W4-A；问题清单 P1）。
3. 视需要把 backgrounds 改成 Storybook 10 的 `options` 形态（问题清单 P2）。

## 交回 W2-H

### 交回说明 · W2-H（SUB-011）

## 已交付

- SUB-011（9930ae9）：
  - `scripts/contract-proof.mjs`（schema `tcrn.ds.contract-proof.v1`）六项检查：generated-sources（七个生成物存在、带勿手改头、头部 contract-sha256 等于按生成器算法重算的契约哈希、与内存 `generate()` 逐字节相同，生成目录无他文件）；generated-state-rules（生成的 pair 状态规则只切换 `--tcrn-pair-*`、无颜色字面量，条数等于 pairs.json 各表 ruleOrder 之和 25；typography 段 2 条状态规则无颜色字面量）；package-css（dist `tcrnComponentCss` 逐字包含 5 个生成段，pairs.json 目标基类的 38 条状态规则无颜色字面量）；icon-roster（icons.json 37 名与 dist `tcrnIconNames` 同集）；product-marks（marks.json 按 build-logos2 文件形态生成的 8 个 SVG 与 logos2、dist `tcrnProductMarkSvg`、`productMarkSources` 登记的字节数与 sha256 逐字节一致）；matrix-expect（五板 44/28/10/116/42 格，契约 cr/fmt 期望、生成的矩阵数据 expect、画板 data-expect 两位小数差 0，kind 与 exempt 一致）。`--json` 输出结构化结果；`import { runContractProof }` 接受 `{ root, distEntry, ui }`。
  - `tests/contract-proof.test.mjs` 8 条：真树全绿；状态规则判定单测；GWT1 改 pairs.json 一个 ink（自动选未被矩阵格引用的态，当前为 actions.primary.s）不重生成判红；GWT2 重生成并模拟重建后全绿，包 CSS 状态规则注入颜色、pairs.json weight 写颜色、手改生成文件各判红；GWT3 改名一个图标与 dist 少一名判红；GWT4 改一枚标的 body 与 logos2 多一个字节判红；矩阵改一格 data-expect（差 0.01）与删一格判红。变异都在临时副本或内存副本里做，测试结束即删除副本。

## 给后续包

- 门读 dist：先 build ui-tokens、ui-copy-state、ui-react。改契约后的顺序是 `node scripts/contract-generate.mjs` → build → 本门；只重生成不重建时 package-css 判红（dist 落后于生成段）。
- 期望数量是常量：`EXPECTED_ICON_COUNT` 37、`EXPECTED_MARK_FILES` 8、`EXPECTED_CELLS` 44/28/10/116/42、`BOARD_FILES` 五板文件名。契约有意改数量时同批改常量。
- 家族用 `inputsPairsCss` 整段或三段分开都可以（拼接段按组成段判）。
- 状态规则的判定：选择器里带 pairs.json 目标基类的复合选择器含任一 `when` 条件（含 `:where`/`:is`/`:not` 内）。颜色字面量用 `scripts/lib/css-rules.mjs` 的 `colourLiterals`，唯一放行与 contract-static C2 相同（outline 只有 transparent）。

## 集外改动需求

- 根 `package.json`：加 `"contract:proof": "node scripts/contract-proof.mjs && node --test tests/contract-proof.test.mjs"`，verify 中放在 `pnpm build` 之后。根 `pnpm test` 不跑根 `tests/`，测试要靠这条脚本带上。

## 未做完

无。

## 交回 W3-A

### 交回说明 · W3-A（SUB-002 → SUB-003）

两张 Subtask 都已完成，没有接续点。问题与待判定口径见 `runs/r1/problems/W3-A.md`。

## 已交付

- SUB-002：`scripts/token-contrast-proof.mjs` 已按 C1 重写，测试为 `tests/token-contrast-proof.test.mjs`。verify 影响表第 6d 行（tokens:proof › token-contrast-proof）在本包树上转绿。
- SUB-003：新增 `scripts/token-deprecation-notice.mjs` 与测试 `tests/token-deprecation-notice.test.mjs`。`apps/storybook/src/build.tsx` 在静态构建写完后调用一次通知脚本，不阻断构建（影响表第 3 行）。

## 对比度门（给 C5、contract、DOM 层各门）

- 取值只走 `createResolvedTokenMap(theme)`，脚本里没有任何颜色字面量，测试会检查这一点。rgba 色先按承载面合成再算比值，用的是画板 `tools/lib.mjs` 的 `cr`，所以打印的比值与画板一致。
- 阈值 `C1`：text 与 wordmark 4.5，edge 与 focus 3。图标用 currentColor，文字对已经覆盖了图标。
- 对表 `CONTRAST_PAIRS` 分两组。第一组是 GWT2 要求的：ink、ink-2、ink-3 于 panel 与 bg，on-acc 于 acc，line-ctl 于 panel 与 bg。第二组是旧门原有的对，换成 G+ 名：acc 于 panel 与 bg；red 于 panel，以及 red 于 red-bg 叠在 panel 上；ok、bad、warn 于 panel，以及各自叠在洗色上。焦点环的对从 `--tcrn-focus-ring` 的声明读出：环色对间隙色，环色对 panel。
- 失败按「前景 on 承载面 (主题)」点名，例如 `ink-3 on panel (light)`；焦点环与字标的名字前缀分别是 `focus ring `、`wordmark `。
- 哪些品牌后缀算字标文字，按契约判定：marks.json 里带 `suffix` 的标（tms、design-system）才算。einzbern 与 mana-orchestrate 的字标没有后缀，门会输出说明行，不会静默跳过。
- `WORDMARK_EXEMPTIONS` 逐条登记了 4 条豁免：design-system 浅色于 panel 与 bg，tms 夜间于 panel 与 bg。每条都引用 TCRN-DS-MIN-20261011-GPLUS-RENEWAL D2 与 V2-B1-Brand 板 F 段，tms 两条另标「夜间值待 Owner」（拆分 P15）。以下情况都会判红：豁免指向非字标对，缺裁定引用，所指的对已经达标（stale），或者找不到对应的对。
- 导出 `runTokenContrastProof({ tokens, exemptions, resolve, wordmarkContract })`，返回 `{ ok, results, failures, notes, exemptions, lowest }`。另有 `formatReport`、`focusRingPairs`、`wordmarkSuffixPairs`、`pairLabel`。

## 弃用通知

- 用法：`node scripts/token-deprecation-notice.mjs [--label <名>] <文件或目录>...`。每个在用的旧名打印一行，措辞来自包的 `formatDeprecatedTokenNotices`，例如 `deprecated token <旧> (n uses): use <新> [文件]`；设置了旧名的地方另加 note。退出码恒为 0，只有路径不存在或缺参数时为 2。
- 旧名表读 `@tcrn/ui-tokens` dist 的 `tcrnDeprecatedTokenAliases`，无后继的名字来自 `tcrnDeprecatedTokens`。带 `tcrn-token-block` 标记的块，以及照抄的 `--旧: var(--新)` 声明，都不算使用。
- 导出 `runDeprecationNotice({ paths, label })`、`scanDeprecatedTokenUses(source, { stylesheet })`、`deprecatedTokenTable()`。
- storybook 构建扫描 `apps/storybook/src` 与 `.storybook`。现在打印 32 个旧名（P7）。脚本缺失或异常时只打印警告。

## 本包门结果（包树根执行）

`--filter @tcrn/ui-tokens build`、`token-contrast-proof`（最低文字比 4.59，ink-3 于 panel 夜间；最低边或焦点环比 3.06，line-ctl 于 bg 浅色；4 条豁免生效）、`node --test tests/token-contrast-proof.test.mjs`（10/10）、`node --test tests/token-deprecation-notice.test.mjs`（5/5）、`run storybook:build` 均通过。storybook 构建前先构建了 ui-copy-state 与 ui-react。

## 集外改动需求

1. 根 `package.json` 的 `tokens:proof` 接入两份新测试（P3）。
2. `packages/ui-tokens`：`findDeprecatedTokenUsages` 与脚本的定义判定口径对齐，或者提供 bin 入口；README 写明两种调用方式（P6，SUB-043 与 EPIC-043）。
3. 字标承载面是否只算 panel，由验收判定（P4）；tms 夜间值待 Owner 裁定（P5）。

## 交回 W5-B

### 交回说明 · W5-B（SUB-032 → SUB-033）

## 已交付

- SUB-032：`docs/design/gplus-2026-10/storybook-map.json`（机读，门读它）与 `storybook-map.md`（人读，同源）。十块板全部入表：22 行有 story（15 行第一批 A/B/D、5 行构图一对五个样板、2 行产品标板 A–E 与 I），25 条没有 story（写原因、落点、引用），8 条差异逐条带引用，其中 DIFF-1、DIFF-2、DIFF-3、DIFF-8 待 Owner 裁定（前三条引 P1）。样板 id 按约定 7 先登记。
- SUB-033：`scripts/storybook-visual-proof.mjs` 替换退役桩；`tests/storybook-visual-proof.test.mjs` 16 条；报告 `docs/verification/storybook-visual-proof/gplus-map-report.json` 与 `.md`（`--write-report` 才写）；同目录 README 改为先说本门、再保留旧像素基线历史（旧回执与截图未动，smoke 与隐私扫描仍读它们）。

## 门怎么判

- 红的条件：映射结构不全；canvas.json 的板或板内字母分段（`class="sec"><h3><b>X</b>`）没有映射条目，或映射写了不存在的分段；映射与 story 清单（约定 7 的十个 id 加注册表里 `gplus-` 类目的全部 story）有差集；任一行任一主题的九项检查（八项测量加 overlap）有 fail、requiredChecks 有 n/a、格数或格 id 与契约不符、story 的 data-expect 与画板同格不同；任一在范围内的变异没有判红。
- 阈值取 `scripts/geometry-measure-proof.mjs` 的 THRESHOLDS（不复制、不进映射、库里没有）。
- `--kind matrix` 只判矩阵行（样板未合并时用）；`--theme`、`--no-mutations` 可缩小范围；默认浅色与夜间两种页面主题、九条变异（每项检查一条，rail 那条写在 typography-sample-billing 上）。
- 测量钩子：对所有 story 传 `markSelector: "mark, .tcrn-highlight__mark"`；格数据在 prepare 阶段读 `[data-cell]` 与 `data-gplus-matrix-cell-count`。

## 本包树实测（HEAD 见报告）

- 全量：对账报 5 个样板不在注册表，10 个样板行 story_not_measured；12 个矩阵行全部因 contrast 不通过（浅色：状态格停在默认态；夜间：浅色块读夜间 token），inputs.B 另缺 opt-sel 两格；其余七项检查凡适用的全过，rail、controlHeight 在矩阵上 n/a。
- `--kind matrix`：对账一致，8 条变异全部判红，结论仍红（同上 contrast 与缺格）。
- 明细与根因见 `problems/W5-B.md`。

## 集外改动需求

1. `apps/storybook/src/build/page-template.tsx` 作用域修复（W5-C 已排）——P1、可能连带 P4。
2. 浅色主题块（W4-A 交回集外改动 2）——P2。
3. `matrix-stories.tsx` 让 opt-sel 格静态可见——P3。
4. `scripts/lib/gplus-measure.mjs` 探针表加 `before-bg`——P5（约定 9：本包不改库）。
5. 根 `package.json` 是否把 `storybook:visual-proof` 接进 verify；README.md 第 85 行与 `foundation-visual-standards.ts` 第 546 行的文字——P9。

## 未做完

无。合并 W5-A 后在集成分支重跑 `node scripts/storybook-visual-proof.mjs --write-report` 即得全量报告（生成物批末再生）。

## 交回 W5-C

### 交回说明 · W5-C（作用域前置修复 → SUB-028 → SUB-035）

## 已交付

- 作用域前置修复（挂 SUB-035）：`apps/storybook/src/build/page-template.tsx` 改为扫描式作用域改写。选择器表只在顶层逗号处拆分，括号、方括号和字符串里的逗号不拆；一行可以有多条规则；@media、@supports、@container、@layer、@scope、@starting-style、@document 的块内照常加作用域；@keyframes 等其它 at 规则和语句原样复制。导出 `scopeComponentCss`、`splitTopLevelSelectors`。测量库新增 `before-bg` 探针，只做加法，用于 Switch 的钮。三条作用域单测与一条探针单测在 `tests/geometry-measure-proof.test.mjs`；作用域单测按浏览器解析的规则数锁定：包 CSS 的每条规则（含全部状态规则）都要留在作用域副本里，且都带作用域。
- 修复前后，浅色页上的矩阵状态格偏离由 76 降为 0。全部 238 个对比格中，修复前偏离 80 个（其中 76 个是状态格），修复后只剩 inputs 的 err-msg 两格（见 problems P2）；Switch 钮两格在加了 before-bg 探针后吻合。
- SUB-028：`scripts/doc-sample-style-proof.mjs` 与 `tests/doc-sample-style-proof.test.mjs`（6 条）。
- SUB-035：`scripts/geometry-measure-proof.mjs` 完成接入，`tests/geometry-measure-proof.test.mjs` 共 60 条，报告写在 `docs/verification/geometry-measure/report.json`。

## 两门的接口与口径

- doc-sample-style-proof：运行 `node scripts/doc-sample-style-proof.mjs [--story <id>]... [--theme light|dark]... [--strict]`，只打印 JSON，不写报告；不 ok 时退出码为 1。
  - 参照样本：五个矩阵 story 两块里的第一批 23 件。签名由三部分组成：标签与第一批类；包 CSS 选择器里出现的 aria-* 或 data-* 状态，以及表单伪类；最近的第一批祖先的签名。样本按自身的主题取浅色块或夜间块作参照。
  - 比较内容：字族与字号等字体属性、颜色、背景、边框、阴影、圆角，以及控件与图标的高度。
  - 每处偏离都会再读两次：一次去掉文档层规则（保留随文档样式表带入的 token 块），一次再去掉内联样式；据此把原因归为 doc-stylesheet、story-inline-style 或 package-context。前两类原因判红。
  - 读值前先关闭过渡与动画，避免读到过渡中途的颜色。
  - 每次运行都带一条文档层变异（MUTATIONS），必须被抓到。
- geometry-measure-proof：运行 `node scripts/geometry-measure-proof.mjs [--story <id>]... [--family <名>] [--write-report]`。
  - 测量集合：GPLUS_STORY_IDS，加上注册表中 gplus-* 类目下的其它 story。
  - `--family`：只跑该家族的矩阵与样板，变异也只跑落在这些 story 上的。
  - REQUIRED_CHECKS：十个 id 都有清单，矩阵按实测写，样板至少要有五项。
  - 全量运行另加集合级要求：九项检查都必须在某个 story 上适用。
  - STORY_MUTATIONS 共四条：GWT1 rowAlign（table-record-index-spec）、GWT2 mark、GWT3 shadowBlur 模糊 4px，再加一条对比度。
  - STORY_PROBES 共三条（decomposition P31）：ButtonGroup 焦点环不被裁切；DatePicker 输入框右侧 30px 是原生 calendar 指示器，且点击能到达输入框；Highlight 与纯文本同宽。
  - 报告按项保留数值，对比格写成 `[cell, ratio, expect, diff]`。

## 本包树上的结果

- geometry-measure-proof 判红，原因如下：
  - 五个样板缺席（W5-A）；
  - rail 与 controlHeight 在全量运行中从未适用；
  - dark 运行中，浅色块继承夜间 token（problems P1，W4-A 问题 2）；
  - inputs 的 err-msg 两格（P2）。
- geometry-measure-proof 判绿的部分：
  - 夹具自检；
  - 四条变异全部判红（即被抓到），三条探针全部通过；
  - 浅色运行中，typography、icon、brand、actions 四个矩阵的八项全绿。
- doc-sample-style-proof 判红：icons-motion 有 72 处文档层覆盖（P4）。另有 82 处包内上下文差异只列为发现（P5、P7），688 个样本未覆盖（P6）；那条变异已被抓到。

## 集外改动

1. 根 `package.json`：
   - 新增 `"geometry-measure:proof": "node --test tests/geometry-measure-proof.test.mjs && node scripts/geometry-measure-proof.mjs"`；
   - 新增 `"doc-sample-style:proof": "node --test tests/doc-sample-style-proof.test.mjs && node scripts/doc-sample-style-proof.mjs"`；
   - 把两条脚本放进 verify，位置在 `storybook:smoke` 之后。
   - 建议 verify 不带 `--write-report`，报告由批末显式重生成。两门目前都红，见 problems P11。
2. ui-tokens / `styles/base.css.ts`：补 `[data-tcrn-theme="light"]` 主题块（P1）。
3. 文档层（story-demo-styles.ts、storybook.css）：去掉 `.tcrn-doc-icon-sample svg[data-icon-name]` 的尺寸与颜色覆盖（P4）。

## 未做完

无接续点。批末待办：W5-A 合并后重跑全量 geometry-measure-proof，判定 GWT4 的样板部分，并用 `--write-report` 重生成报告；按 P8 移动 GWT1 变异；P7 的判据口径请批末确认。
